var Ele = window.Ele = Ele || {
	_loadCallback:{},
	_loadModels:0,
	_loadCount:0,
	
	/**
	 * 初始化加载设置
	 * @param {Object} models
	 * @param {Object} callback
	 */
	load: function(models, callback) {
		this._loadCallback = callback || function() {};
		if(!this._isArray(models)) {
			console.log("Ele load model must be a array.");
			throw "Ele load model must be a array.";
			return;
		}
		this._loadModels = models.length;
		this._loadCount = 0;
		for(var i = 0; i < models.length; i++) {
			this._loadCSS(models[i]);
			this._loadJS(models[i], this._loadHandler);
		}
	},
	
	/**
	 * 脚本加载进度处理
	 * @param {Object} context
	 * @param {Object} model
	 */
	_loadHandler:function(context,model){
		context._loadCount ++;
		if(context._loadCount == context._loadModels){
			context._loadCallback();
		}
	},
	
	/**
	 * 加载JS脚本
	 * @param {Object} model
	 * @param {Object} callback 加载完成回调
	 */
	_loadJS: function(model, callback) {
		var context = this;
		var script = document.createElement('script'),
			fn = callback || function() {};

		script.type = 'text/javascript';
		//IE
		if(script.readyState) {
			script.onreadystatechange = function() {
				console.log(script.readyState);
				if(script.readyState == 'loaded' || script.readyState == 'complete') {
					script.onreadystatechange = null;
					fn(context,model);
				}
			};
		} else {
			//其他浏览器
			script.onload = function() {
				fn(context,model);
			};
		}
		script.src = "js/"+model + ".js";
		document.getElementsByTagName('head')[0].appendChild(script);
	},
	
	/**
	 * 加载CSS样式
	 * @param {Object} model
	 */
	_loadCSS:function(model){
		var head = document.getElementsByTagName('head')[0];
		var link = document.createElement('link');
		link.type='text/css';
		link.rel = 'stylesheet';
		link.href = "css/"+model+".css";
		head.appendChild(link);
	},
	
	/**
	 * 判断对象是否是数组
	 */
	_isArray: function(value) {
		if(typeof Array._isArray === "function") {
			return Array._isArray(value);
		}
		return Object.prototype.toString.call(value) === "[object Array]";
	}
};