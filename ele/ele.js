var __sto = setTimeout;
window.setTimeout = function(callback,timeout,param){
　　var args = Array.prototype.slice.call(arguments,2);
　　var _cb = function()
　　{
　　callback.apply(null,args);
　　}
　　__sto(_cb,timeout);
}

var Ele = window.Ele = Ele || {
	models:["Layout","AjaxLoad","Alert","Label","Button",
		"TextBox","TextArea","Radio","CheckBox","DateBox",
		"ListGrid","TreeNode","PopWindow","SearchBox","Media",
		"SelectBox"
	],
	mUtils:["Ajax","WinInner","Filter","Timer","Validate","Position"],
	mCharts:["Radar","BrokenLine","AreaLine","Sector","Histogram"],
	mViews :["Masking","Board","GridView","PageBarView","TreeMenuView",
		"SwitchView","FormView","FormItemView"
	],
	mControllers:["BaseController","PageController"],
	Charts : {},//目录对象申明
	Utils : {},//目录对象申明
	Views : {},//目录对象申明
	Controllers : {},//目录对象申明
	imports:[],//导入内容申明
	_loadCallback:{},
	_loadModels:0,
	_loadCount:0,
	_pathPrefix:"/",
	_rootId:"",
	rootView:null,
	masking:null,
	
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
	 * @param {Object} id 内容布局ID
	 */
	initView:function(id){
		if(typeof id === "string"){
			this._rootId = id;
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
		
		this._loadModels = this.imports.length + models.length + 1;
		this._loadCount = 0;
		
		//加载类文件
		this._loadImports();
		
		//加载Element
		this._loadJS("Element", this._loadHandler);
		
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
				if(this._rootId == ""){
					console.log("Ele load model '"+models[i]+"' must call 'initView' method.");
					throw "Ele load model '"+models[i]+"' must call 'initView' method";
					break;
				}
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
			//控制器类加载项检查
			var isController = false;
			for(var c = 0; c < this.mControllers.length; c ++){
				if(this.mControllers[c] == models[i]){
					isController = true;
					this._loadControllers([models[i]]);
					break;
				}
			}
			if(isController){
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
				if(this._rootId == ""){
					console.log("Ele load model '"+models[i]+"' must call 'initView' method.");
					throw "Ele load model '"+models[i]+"' must call 'initView' method";
					break;
				}
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
		if(this._rootId == ""){
			console.log("Ele load view model must call 'initView' method.");
			throw "Ele load view model must call 'initView' method";
			return;
		}
		
		this._loadCallback = callback || function() {};
		
		//JS加载总量
		this._loadModels = this.imports.length + this.models.length + this.mUtils.length + this.mControllers.length + this.mCharts.length+this.mViews.length + 1;
		this._loadCount = 0;
		
		//全部加载
		this._loadImports();
		//加载Element
		this._loadJS("Element", this._loadHandler);
		this._loadEles(this.models);
		this._loadUtils(this.mUtils);
		this._loadCharts(this.mCharts);
		this._loadViews(this.mViews);
		this._loadControllers(this.mControllers);
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
	 * 加载控制器类 自动加载
	 */
	_loadControllers:function(controllers){
		for(var i = 0; i < controllers.length; i++) {
			this._loadJS("Controllers/"+controllers[i], this._loadHandler);
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
			if(typeof(context._rootId) == "string" && context._rootId.trim() != ""){
				context.rootView = new Ele.Element(context._rootId);
				context.masking = new Ele.Views.Masking();
				context.masking.view.setContainerById(context._rootId);
			}
			context._loadCallback(context.rootView);
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
	},
	_cloneObject: function(obj){
		//1
		var newJsonObj = {};
		newJsonObj = JSON.parse(JSON.stringify(obj));
		//2
		if(this.__cloneFilter(newJsonObj, obj)){
			newJsonObj = obj;
		}
		//3
		var newObj = new obj.constructor;
		for (items in newJsonObj) {
			newObj[items] = newJsonObj[items]
		}
		return newObj;
	},
	__cloneFilter: function(newJsonObj, obj){
		//object 包含数组类型
		if(typeof(obj) == "object"){
			for (items in obj) {
				if(this.__cloneFilter(newJsonObj[items], obj[items])){
					newJsonObj[items] = obj[items];
				}
			}
		}
		if (typeof obj == "function" || typeof obj == "undefined" || obj instanceof RegExp) {
			return true;
		}
		return false;
	},
	_isElement:function(obj){
		return (typeof HTMLElement === 'object') 
		?(obj instanceof HTMLElement)
		:!!(obj && typeof obj === 'object' && (obj.nodeType === 1 || obj.nodeType === 9) && typeof obj.nodeName === 'string');
	}
};