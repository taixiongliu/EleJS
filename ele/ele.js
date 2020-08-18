var Ele = window.Ele = Ele || {
	_loadCallback:{},
	_loadModels:0,
	_loadCount:0,
	_pathPrefix:"/",
	
	initPath:function(path){
		if(typeof path === "string"){
			this._pathPrefix = "/"+path+"/";
		}
		
	},
	
	/**
	 * 初始化加载设置
	 * @param {Object} models
	 * @param {Object} callback
	 */
	loadComponent: function(models, callback) {
		this._loadCallback = callback || function() {};
		if(!this._isArray(models)) {
			console.log("Ele load model must be a array.");
			throw "Ele load model must be a array.";
			return;
		}
		this._loadUtil();
		this._loadModels = models.length;
		this._loadCount = 0;
		for(var i = 0; i < models.length; i++) {
			this._loadCSS(models[i]);
			this._loadJS(models[i], this._loadHandler);
		}
	},
	
	/**
	 * 加载工具类 自动加载
	 */
	load:function(callback){
		this._loadCallback = callback || function() {};
		var models = [];
		models.push("Layout");
		models.push("AjaxLoad");
		models.push("Img");
		models.push("Alert");
		models.push("Label");
		models.push("Button");
		models.push("TextBox");
		models.push("CheckBox");
		models.push("DateBox");
		models.push("ListGrid");
		models.push("TreeNode");
		models.push("MenuList");
		models.push("PopWindow");
		
		this._loadUtil();
		this._loadModels = models.length;
		this._loadCount = 0;
		for(var i = 0; i < models.length; i++) {
			this._loadCSS(models[i]);
			this._loadJS(models[i], this._loadHandler);
		}
	},
	
	/**
	 * 加载工具类 自动加载
	 */
	_loadUtil:function(){
		this._loadJS("Ajax");
		this._loadJS("WinInner");
		this._loadJS("Filter");
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
		script.src = this._pathPrefix+"ele/js/"+model + ".js";
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
		link.href = this._pathPrefix+"ele/css/"+model+".css";
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