(function(){
	var PageController = Ele.Controllers.PageController = function(args) {
		this.eleType = "controller";
		this.page;
		this.startRow;
		this.pageSize;
		this.totalPage;
		this.rows;
		this._loadEvent = null;
		this._errorEvent = null;
		this._formatEvent = null;
		this._method = 'GET';
		this._arrayHead = [];
		this._parameter = null;
		this._addressSufix = null;
		this._isRest = false;
		this.url;
		
		
		PageController.prototype.setMethod = function(method) {
			this._method = method;
		};
		PageController.prototype.setParameter = function(parameter) {
			this._parameter = parameter;
		};
		PageController.prototype.setAddressSufix = function(as) {
			this._addressSufix = as;
		};
		PageController.prototype.setRest = function(rest) {
			this._isRest = rest;
		};
		PageController.prototype.addRequestHead = function(name, value){
			if(typeof(name) != "string" || typeof(value) != "string"){
				return ;
			}
			if(name.trim() == ""){
				return ;
			}
			this._arrayHead.push(name+","+value);
		};
		
		PageController.prototype.loadData = function(url){
			if(typeof(url) == "string"){
				this.url = url;
			}
			this._loadData();
		};
		PageController.prototype.reload = function(){
			this.page = 1;
			this.startRow = 0;
			this._loadData();
		};
		PageController.prototype.jumpPage = function(page){
			if(page < 1 || page > this.totalPage){
				return ;
			}
			this.page = page;
			this.startRow = (page - 1) * this.pageSize;
			this._loadData();
		};
		PageController.prototype.previousPage = function(){
			if(this.page <= 1){
				return ;
			}
			this.page --;
			this.startRow -= this.pageSize;
			this._loadData();
		};
		PageController.prototype.nextPage = function(){
			if(this.page >= this.totalPage){
				return ;
			}
			this.page ++;
			this.startRow += this.pageSize;
			this._loadData();
		};
		
		PageController.prototype.setFormat = function(formatHandler){
			if(typeof(formatHandler) == "function"){
				this._formatEvent = formatHandler;
			}
		};
		
		PageController.prototype.fillPageInfo = function(startRow, pageSize, rows){
			this.startRow = startRow;
			this.pageSize = pageSize;
			this.rows = rows;
			this.page = parseInt(this.startRow/this.pageSize) + 1;
			this.totalPage = parseInt(this.rows/this.pageSize);
			if(this.rows % this.pageSize != 0){
				this.totalPage ++;
			}
		};
		PageController.prototype._loadData = function(){
			var context = this;
			var ajax = new Ele.Utils.Ajax();
			//默认GET
			ajax.setMethod(this._method);
			if(this._arrayHead.length > 0){
				for(var i = 0; i < this._arrayHead.length; i ++){
					var temp = this._arrayHead[i].split(",");
					ajax.addRequestHead(temp[0], temp[1]);
				}
			}
			var ru = this.url;
			//rest参数向地址传递
			if(this._isRest){
				ru += ("/" + this.startRow + "/" + this.pageSize);
				if(this._addressSufix != null && this._addressSufix.trim() != ""){
					ru += ("/" + this._addressSufix);
				}
				if(this._parameter != null && this._parameter.trim() != ""){
					//GET默认地址传参数
					if(this._method == "GET"){
						ru += ("?" + this._parameter);
					}else{
						ajax.setParameter(this._parameter);
					}
				}
				ajax.request(ru, function(result){
					context._onResponse(result);
				});
				return ;
			}
			//常规模式
			var tp = "startRow=" + this.startRow + "&pageSize=" + this.pageSize;
			if(this._parameter != null && this._parameter.trim() != ""){
				tp += ("&" + this._parameter);
			}
			if(this._addressSufix != null && this._addressSufix.trim() != ""){
				ru += ("/" + this._addressSufix);
			}
			//GET默认地址传参数
			if(this._method == "GET"){
				ru += ("?" + tp);
			}else{
				ajax.setParameter(tp);
			}
			ajax.request(ru, function(result){
				context._onResponse(result);
			});
		};
		
		PageController.prototype._onResponse = function(result){
			if(this._formatEvent != null){
				this._formatEvent(result);
				return ;
			}
			var res = null;
			try {
				res = JSON.parse(result);
			} catch (e) {
				console.error("JSON parse exception：", e);
				var error = {
					resCode: -1,
					resMsg: "JSON parse exception"
				};
				// 处理错误，例如返回默认值或抛出异常
				this._errorEvent(error);
				return;
			}
			if(res.resCode != 1000 && this._errorEvent != null){
				var error = {
					resCode:res.resCode,
					resMsg:res.resMsg
				};
				this._errorEvent(error);
				return ;
			}
			var startRow = 0;
			var pageSize = 0;
			var rows = 0;
			if(typeof(res.startRow) == "number"){
				startRow = res.startRow;
			}
			if(typeof(res.pageSize) == "number"){
				pageSize = res.pageSize;
			}
			if(typeof(res.rows) == "number"){
				rows = res.rows;
			}
			
			this.fillPageInfo(startRow, pageSize, rows);
			if(this._loadEvent != null){
				this._loadEvent(res.data);
			}
		};
		
		PageController.prototype._init = function(){
			if(typeof(args.loadHandler) == "function"){
				this._loadEvent = args.loadHandler;
			}
			if(typeof(args.errorHandler) == "function"){
				this._errorEvent = args.errorHandler;
			}
			if(typeof(args.formatHandler) == "function"){
				this._formatEvent = args.formatHandler;
			}
			if(typeof(args.pageSize) == "number"){
				this.pageSize = args.pageSize;
			}else{
				this.pageSize = -1;
			}
			this.page = 1;
			this.startRow = 0;
			this.totalPage = 0;
			this.rows = 0;
		};
		
		this._init();
	};
})();