(function(){
	var PoolController = Ele.Controllers.PoolController = function(args) {
		this.eleType = "controller";
		this._loadEvent = null;
		this._errorEvent= null;
		this._formatEvent = null;
		this.pool = [];
		/**
		 * @param {Object} connection
		 * {name, url, method, heads, parameter}
		 */
		PoolController.prototype.addConnection = function(connection){
			if(typeof(connection) == "undefined" || typeof(connection.name) == "undefined" || typeof(connection.url) == "undefined") {
				throw "connection对象异常，请确保至少包含name和url属性"; 
				return ;
			}
			this.pool.push(connection);
		};
		
		PoolController.prototype.loadNameData = function(name, parameter, as){
			if(this.pool.length < 1){
				return ;
			}
			var connection = null;
			for(var i = 0; i < this.pool.length; i ++){
				if(this.pool[i].name == name){
					connection = this.pool[i];
					break;
				}
			}
			if(connection == null){
				return ;
			}
			//临时更新参数
			if(typeof(parameter) != "undefined" && parameter != null){
				connection.parameter = parameter;
			}
			this._loadData(connection, as);
		};
		
		PoolController.prototype.setFormat = function(formatHandler){
			if(typeof(formatHandler) == "function"){
				this._formatEvent = formatHandler;
			}
		};
		
		PoolController.prototype._loadData = function(connection, as){
			var context = this;
			var ajax = new Ele.Utils.Ajax();
			if(typeof(connection.method) != "undefined" && connection.method != "" && connection.method != null){
				ajax.setMethod(connection.method);
			}
			if(typeof(connection.heads) != "undefined" && connection.heads.length > 0){
				for(var i = 0; i < connection.heads.length; i ++){
					ajax.addRequestHead(connection.heads[i].name, connection.heads[i].value);
				}
			}
			var url = connection.url;
			if(typeof(as) != "undefined" && as != null){
				url += as;
			}
			if(typeof(connection.parameter) != "undefined" && connection.parameter != null){
				//GET默认地址传参数
				if(typeof(connection.method) != "undefined" && connection.method == "GET"){
					url += ("?" + connection.parameter);
				}else{
					ajax.setParameter(connection.parameter);
				}
			}
			
			ajax.request(url, function(result, mark){
				context._onResponse(result, mark);
			}, connection.name);
		};
		
		PoolController.prototype._onResponse = function(result, name){
			if(this._formatEvent != null){
				this._formatEvent(result, name);
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
				this._errorEvent(error, name);
				return;
			}
			if(res.resCode != 1000 && this._errorEvent != null){
				var error = {
					resCode:res.resCode,
					resMsg:res.resMsg
				};
				this._errorEvent(error, name);
				return ;
			}
			if(this._loadEvent != null){
				this._loadEvent(res.data, name);
			}
		};
		
		PoolController.prototype._init = function(){
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