(function(){
	var PageController = Ele.Controllers.PageController = function(args) {
		this.eleType = "controller";
		this.page;
		this.startRow;
		this.pageSize;
		this.totalPage;
		this.rows;
		this._loadEvent = null;
		this._errorEvent=null;
		this._formatEvent = null;
		this.url;
		
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
			this.page = Number.parseInt(this.startRow/this.pageSize) + 1;
			this.totalPage = Number.parseInt(this.rows/this.pageSize);
			if(this.rows % this.pageSize != 0){
				this.totalPage ++;
			}
		};
		PageController.prototype._loadData = function(){
			var context = this;
			var ajax = new Ele.Utils.Ajax();
			ajax.setParameter("startRow="+this.startRow+"&pageSize="+this.pageSize);
			ajax.request("datasources/table"+this.page+".json", function(result){
				context._onResponse(result);
			});
			// ajax.request(this.url, function(result){
			// 	context._onResponse(result);
			// });
		};
		
		PageController.prototype._onResponse = function(result){
			if(this._formatEvent != null){
				this._formatEvent(result);
				return ;
			}
			var res = JSON.parse(result);
			if(res.resCode != 1000 && this._errorEvent != null){
				var error = {
					resCode:res.resCode,
					resMsg:res.resMsg
				};
				this._errorEvent(error);
				return ;
			}
			var startRow = 0;
			var pageSize = 10;
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
			this.page = 1;
			this.startRow = 0;
			this.pageSize = 10;
			this.totalPage = 0;
			this.rows = 0;
		};
		
		this._init();
	};
})();