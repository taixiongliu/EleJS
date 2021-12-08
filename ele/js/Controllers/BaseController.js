(function(){
	var BaseController = Ele.Controllers.BaseController = function(args) {
		this.eleType = "controller";
		this._loadEvent = null;
		this._errorEvent=null;
		this._formatEvent = null;
		this.url;
		this.parameter;
		
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
		
		BaseController.prototype.setParameter = function(parameter) {
			this.parameter = parameter;
		};
		
		BaseController.prototype._loadData = function(){
			var context = this;
			var ajax = new Ele.Utils.Ajax();
			if(typeof(this.parameter) != "undefined" && this.parameter != null){
				ajax.setParameter(this.parameter);
			}
			ajax.request(this.url, function(result){
				context._onResponse(result);
			});
		};
		
		BaseController.prototype._onResponse = function(result){
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