var Ele = window.Ele = Ele || {
	models:["Layout","AjaxLoad","Img","Alert","Label",
		"Button","TextBox","TextArea","CheckBox","DateBox",
		"ListGrid","TreeNode","MenuList","PopWindow"
	],
	mUtils:["Ajax","WinInner","Filter"],
	mCharts:["Radar","BrokenLine","AreaLine","Sector","Histogram"],
	mViews :["Masking","Board"],
	Charts : {},//目录对象申明
	Utils : {},//目录对象申明
	Views : {},//目录对象申明
	imports:[],//导入内容申明
	_loadCallback:{},
	_loadModels:0,
	_loadCount:0,
	_pathPrefix:"/",
	
	initPath:function(path){
		if(typeof path === "string"){
			if(path.charAt(0) == "/"){
				this._pathPrefix = path+"/";
			}else{
				this._pathPrefix = "/"+path+"/";
			}
		}
		
	},
	
	/**
	 * @param {Object} name 导入js文件名
	 */
	importJS:function(name){
		this.imports.push(name);
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
		
		this._loadModels = this.imports.length + models.length;
		this._loadCount = 0;
		
		//加载类文件
		this._loadImports();
		
		//遍历加载
		for(var i = 0; i < models.length; i++){
			//布局加载项检查
			var isEle = false;
			for(var x = 0; x < this.models.length; x ++){
				if(this.models[x] == models[i]){
					isEle = true;
					this._loadEles([models[i]]);
					break;
				}
			}
			if(isEle){
				continue;
			}
			//工具类加载项检查
			var isUtil = false;
			for(var y = 0; y < this.mUtils.length; y ++){
				if(this.mUtils[y] == models[i]){
					isUtil = true;
					this._loadUtils([models[i]]);
					break;
				}
			}
			if(isUtil){
				continue;
			}
			//统计图类加载项检查
			var isChart = false;
			for(var z = 0; z < this.mCharts.length; z ++){
				if(this.mCharts[z] == models[i]){
					isChart = true;
					this._loadCharts([models[i]]);
					break;
				}
			}
			if(isChart){
				continue;
			}
			
			//自定义布局加载项检查
			var isView = false;
			for(var v = 0; v < this.mViews.length; v ++){
				if(this.mViews[v] == models[i]){
					isView = true;
					this._loadViews([models[i]]);
					break;
				}
			}
			if(isView){
				continue;
			}
			
			console.log("Ele load model '"+models[i]+"' not found.");
			throw "Ele load model '"+models[i]+"' not found.";
		}
	},
	
	/**
	 * 全局加载
	 */
	load:function(callback){
		this._loadCallback = callback || function() {};
		
		//JS加载总量
		this._loadModels = this.imports.length + this.models.length + this.mUtils.length + this.mCharts.length+this.mViews.length;
		this._loadCount = 0;
		
		
		//全部加载
		this._loadImports();
		this._loadEles(this.models);
		this._loadUtils(this.mUtils);
		this._loadCharts(this.mCharts);
		this._loadViews(this.mViews);
	},
	
	/**
	 * 加载类文件
	 */
	_loadImports:function(){
		for(var index = 0; index < this.imports.length; index ++){
			this._importJS(this.imports[index], this._loadHandler);
		}
	},
	
	/**
	 * 加载布局类 
	 */
	_loadEles:function(models){
		for(var i = 0; i < models.length; i++) {
			this._loadCSS(models[i]);
			this._loadJS(models[i], this._loadHandler);
		}
	},
	
	/**
	 * 加载工具类 自动加载
	 */
	_loadUtils:function(utils){
		for(var i = 0; i < utils.length; i++) {
			this._loadJS("Utils/"+utils[i], this._loadHandler);
		}
	},
	/**
	 * 加载图表类控件 自动加载
	 */
	_loadCharts:function(charts){
		for(var i = 0; i < charts.length; i++) {
			this._loadJS("Charts/"+charts[i], this._loadHandler);
		}
	},
	
	/**
	 * 加载图表类控件 自动加载
	 */
	_loadViews:function(views){
		for(var i = 0; i < views.length; i++) {
			this._loadCSS("Views/"+views[i]);
			this._loadJS("Views/"+views[i], this._loadHandler);
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
		script.src = this._pathPrefix+"ele/js/"+model + ".js";
		document.getElementsByTagName('head')[0].appendChild(script);
	},
	
	/**
	 * 自定位文件导入
	 * @param {Object} fileName 导入文件名
	 * @param {Object} callback
	 */
	_importJS: function(fileName, callback) {
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
					fn(context,fileName);
				}
			};
		} else {
			//其他浏览器
			script.onload = function() {
				fn(context,fileName);
			};
		}
		script.src = fileName;
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