(function(){
	var BaseController = Ele.Controllers.BaseController = function(args) {
		this.eleType = "controller";
		this._loadEvent = null;
		this._errorEvent = null;
		this._formatEvent = null;
		this._method = '';
		this._arrayHead = [];
		this.url;
		this.parameter;
		this.addressSufix;
		
		BaseController.prototype.setMethod = function(method) {
			this._method = method;
		};
		BaseController.prototype.addRequestHead = function(name, value){
			if(typeof(name) != "string" || typeof(value) != "string"){
				return ;
			}
			if(name.trim() == ""){
				return ;
			}
			this._arrayHead.push(name+","+value);
		};
		
		BaseController.prototype.loadData = function(url){
			if(typeof(url) == "string"){
				this.url = url;
			}
			this._loadData();
		};
		
		BaseController.prototype.setFormat = function(formatHandler){
			if(typeof(formatHandler) == "function"){
				this._formatEvent = formatHandler;
			}
		};
		
		/**
		 * @param {Object} parameter
		 * 
		 */
		BaseController.prototype.setParameter = function(parameter) {
			this.parameter = parameter;
		};
		BaseController.prototype.setAddressSufix = function(as) {
			this.addressSufix = as;
		};
		
		BaseController.prototype._loadData = function(){
			var context = this;
			var ajax = new Ele.Utils.Ajax();
			if(this._method != "" && this._method != null){
				ajax.setMethod(this._method);
			}
			if(this._arrayHead.length > 0){
				for(var i = 0; i < this._arrayHead.length; i ++){
					var temp = this._arrayHead[i].split(",");
					ajax.addRequestHead(temp[0], temp[1]);
				}
			}
			var ru = this.url;
			if(typeof(this.addressSufix) != "undefined" && this.addressSufix != null){
				ru += this.addressSufix;
			}
			if(typeof(this.parameter) != "undefined" && this.parameter != null){
				//GET默认地址传参数
				if(this._method == "GET"){
					ru += ("?" + this.parameter);
				}else{
					ajax.setParameter(this.parameter);
				}
			}
			ajax.request(ru, function(result){
				context._onResponse(result);
			});
		};
		
		BaseController.prototype._onResponse = function(result){
			if(this._formatEvent != null){
				this._formatEvent(result);
				return ;
			}
			var res = null;
			try {
				res = JSON.parse(result);
			} catch (e) {
				console.error("JSON解析异常：", e);
				var error = {
					resCode: -1,
					resMsg: "JSON数据解析异常"
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
			if(this._loadEvent != null){
				this._loadEvent(res.data);
			}
		};
		
		BaseController.prototype._init = function(){
			if(typeof(args.loadHandler) == "function"){
				this._loadEvent = args.loadHandler;
			}
			if(typeof(args.errorHandler) == "function"){
				this._errorEvent = args.errorHandler;
			}
			if(typeof(args.formatHandler) == "function"){
				this._formatEvent = args.formatHandler;
			}
		};
		
		this._init();
	};
})();