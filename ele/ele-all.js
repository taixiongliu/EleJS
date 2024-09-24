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
	Charts : {},//目录对象申明
	Utils : {},//目录对象申明
	Views : {},//目录对象申明
	Controllers : {},//目录对象申明
	imports:[],//导入内容申明
	_importsCSS:[],//导入内容申明
	_loadCallback:{},
	_loadModels:0,
	_loadCount:0,
	_pathPrefix:"/",
	_rootId:"",
	_skin:"skin",
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
	
	initSkin:function(skin){
		if(typeof skin === "string"){
			this._skin = skin;
		}
	},
	getSkinName:function(){
		return this._skin;
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
	 * @param {Object} name 导入css文件名
	 */
	importCSS:function(name){
		this._importsCSS.push(name);
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
		this._loadModels = this.imports.length;
		this._loadCount = 0;
		var context = this;
		
		//导入通用CSS
		//需要优先加载，并成功后在加载JS和其他模块
		var head = document.getElementsByTagName('head')[0];
		var link = document.createElement('link');
		link.type='text/css';
		link.rel = 'stylesheet';
		link.href = this._pathPrefix+"ele/"+this._skin+"/ele-all.min.css";
		link.onload = function(){
			//加载导入
			context._loadImports();
		}
		head.appendChild(link);
	},
	
	/**
	 * 加载类文件
	 */
	_loadImports:function(){
		//加载JS
		for(var index = 0; index < this.imports.length; index ++){
			this._importJS(this.imports[index], this._loadHandler);
		}
		//加载CSS
		for(var i = 0; i < this._importsCSS.length; i ++){
			var head = document.getElementsByTagName('head')[0];
			var link = document.createElement('link');
			link.type='text/css';
			link.rel = 'stylesheet';
			link.href = this._importsCSS[i];
			head.appendChild(link);
		}
		//如果没有导入内容主动初始化并加载
		if(this.imports.length == 0){
			if(typeof(this._rootId) == "string" && this._rootId.trim() != ""){
				this.rootView = new Ele.Element(this._rootId);
				this.masking = new Ele.Views.Masking();
				this.masking.view.setContainerById(this._rootId);
			}
			this._loadCallback(this.rootView);
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
(function(){
	var AjaxLoad = Ele.AjaxLoad = function(){
		this.eleType = "layout";
		this.ele;
		this.view;
		this._msg;
		AjaxLoad.prototype._init = function(){
			this.view = new Ele.Layout("ele_shade_pl");
			this.ele = this.view.ele;
			this.ele.style.display = "none";//防止未加载CSS导致页面冲突
			
			var bg = new Ele.Layout("ele_shade_bg");
			
			var content = new Ele.Layout("ele_ajaxload_content");
			var winInner = new Ele.Utils.WinInner();
			var width = winInner.getWidth();
			var height = winInner.getHeight();
			content.ele.style.marginTop = (height/2 - 18)+"px";
			content.ele.style.marginLeft = (width/2 - 90)+"px";
			
			var img_panel = new Ele.Layout("ele_ajaxload_content_img");
			var img_item = new Ele.Img(Ele._pathPrefix+"ele/"+Ele._skin+"/assets/ajax-loader.gif");
			img_panel.add(img_item);
			this._msg = new Ele.Layout("ele_ajaxload_content_msg");
			this._msg.setAlign("center");
			this._msg.setHtml("数据处理中，请稍后...");
			
			content.add(img_panel);
			content.add(this._msg);
			
			this.view.add(bg);
			this.view.add(content);
		};
		
		AjaxLoad.prototype.setMsg = function(msg){
			if(this._msg != null){
				this._msg.setHtml(msg);
			}
		};
		
		AjaxLoad.prototype.show = function(){
			if(this.ele != null){
				this.ele.style.display = "block";
			}
		};
		
		AjaxLoad.prototype.hide = function(){
			if(this.ele != null){
				this.ele.style.display = "none";
			}
		};
		
		AjaxLoad.prototype.getView = function(){
			return this.view;
		};
		
		AjaxLoad.prototype.close = function(){
			if(this.view != null){
				Ele.rootView.remove(this.view);
				this.view = null;
				this.ele = null;
			}
		};
		
		this._init();
	}
})();
(function(){
	var Alert = Ele.Alert = function() {
		this.eleType = "layout";
		this.ele;
		this.view;
		this._msg;
		this._sureHandler = null;
		this._onsuredown = false;
		
		Alert.prototype._init = function() {
			var context = this;
			
			this.view = new Ele.Layout("ele_shade_pl");
			this.ele = this.view.ele;
			this.ele.style.display = "none";//防止未加载CSS导致页面冲突
			var bg = new Ele.Layout("ele_shade_bg");
			
			var content = new Ele.Layout("ele_confirm_panel");
			var winInner = new Ele.Utils.WinInner();
			var width = winInner.getWidth();
			var height = winInner.getHeight();
			content.ele.style.marginTop = (height/2 - 50)+"px";
			content.ele.style.marginLeft = (width/2 - 150)+"px";
			
			var divider = new Ele.Layout("ele_confirm_divider ele_confirm_margin_top_20");
			
			var content_view = new Ele.Layout("ele_confirm_view");
			content_view.setAlign("center");
			
			this._msg = new Ele.Label("确认继续该操作？","ele_confirm_txt");
			
			content_view.add(this._msg);
			
			var btn_view = new Ele.Layout("ele_confirm_btn_view");
			
			var btn_sure = new Ele.Layout("ele_alert_btn_sure");
			btn_sure.setAlign("center");
			
			btn_sure.ele.onmousedown = function(){
				btn_sure.ele.className = "ele_alert_btn_sure_over";
				context._onsuredown = true;
			};
			btn_sure.ele.onmouseup = function(){
				btn_sure.ele.className = "ele_alert_btn_sure";
				context._onsuredown = false;
			};
			btn_sure.ele.onmouseout = function(){
				if(context._onsuredown){
					btn_sure.ele.className = "ele_alert_btn_sure";
					context._onsuredown = false;
				}
			};
			btn_sure.ele.onclick = function(){
				context.hide();
				if(context._sureHandler != null){
					context._sureHandler();
				}
			};
	
			var txt_sure = new Ele.Label("确定","ele_confirm_btn_txt");
			btn_sure.add(txt_sure);
			
			btn_view.add(btn_sure);
			
			content.add(content_view);
			content.add(divider);
			content.add(btn_view);
			
			this.view.add(bg);
			this.view.add(content);
		};
		
		Alert.prototype.setSureHandler = function(handler){
			this._sureHandler = handler;
		};
		
		Alert.prototype.setMsg = function(msgStr){
			if(this._msg != null){
				this._msg.setText(msgStr);
			}
		};
		
		Alert.prototype.show = function(){
			if(this.ele != null){
				this.ele.style.display = "block";
			}
		};
		
		Alert.prototype.hide = function(){
			if(this.ele != null){
				this.ele.style.display = "none";
			}
		};
		
		Alert.prototype.close = function(){
			if(this.ele != null){
				Ele.rootView.remove(this.view);
				this.ele = null;
			}
		};
		
		this._init();
	};
	
	var Confirm = Ele.Confirm = function() {
		this.eleType = "layout";
		this.ele;
		this.view;
		this._msg = null;
		this._sureHandler = null;
		this._cancelHandler = null;
		this._onsuredown = false;
		
		Confirm.prototype._init = function() {
			var context = this;
			
			this.view = new Ele.Layout("ele_shade_pl");
			this.ele = this.view.ele;
			this.ele.style.display = "none";//防止未加载CSS导致页面冲突
			var bg = new Ele.Layout("ele_shade_bg");
			
			var content = new Ele.Layout("ele_confirm_panel");
			var winInner = new Ele.Utils.WinInner();
			var width = winInner.getWidth();
			var height = winInner.getHeight();
			content.ele.style.marginTop = (height/2 - 50)+"px";
			content.ele.style.marginLeft = (width/2 - 150)+"px";
			
			var divider = new Ele.Layout("ele_confirm_divider ele_confirm_margin_top_20");
			
			var content_view = new Ele.Layout("ele_confirm_view");
			content_view.setAlign("center");
			
			this._msg = new Ele.Label("确认继续该操作？","ele_confirm_txt");
			
			content_view.add(this._msg);
			
			var btn_view = new Ele.Layout("ele_confirm_btn_view");
			
			var btn_sure = new Ele.Layout("ele_confirm_btn_sure");
			btn_sure.setAlign("center");
			
			btn_sure.ele.onmousedown = function(){
				btn_sure.ele.className = "ele_confirm_btn_sure_over";
				context._onsuredown = true;
			};
			btn_sure.ele.onmouseup = function(){
				btn_sure.ele.className = "ele_confirm_btn_sure";
				context._onsuredown = false;
			};
			btn_sure.ele.onmouseout = function(){
				if(context._onsuredown){
					btn_sure.ele.className = "ele_confirm_btn_sure";
					context._onsuredown = false;
				}
			};
			btn_sure.ele.onclick = function(){
				context.hide();
				if(context._sureHandler != null){
					context._sureHandler();
				}
			};
	
			var txt_sure = new Ele.Label("确定","ele_confirm_btn_txt");
			btn_sure.add(txt_sure);
			
			var v_divider = new Ele.Layout("ele_confirm_divider_v");
			
			var btn_cancel = new Ele.Layout("ele_confirm_btn_cancel");
			btn_cancel.setAlign("center");
			btn_cancel.ele.onmousedown = function(){
				btn_cancel.ele.className = "ele_confirm_btn_cancel_over";
				context._onsuredown = true;
			};
			btn_cancel.ele.onmouseup = function(){
				btn_cancel.ele.className = "ele_confirm_btn_cancel";
				context._onsuredown = false;
			};
			btn_cancel.ele.onmouseout = function(){
				if(context._onsuredown){
					btn_cancel.ele.className = "ele_confirm_btn_cancel";
					context._onsuredown = false;
				}
			};
			btn_cancel.ele.onclick = function(){
				context.hide();
				if(context.cancelHandler != null){
					context.cancelHandler();
				}
			};
			var txt_cancel = new Ele.Label("取消","ele_confirm_btn_txt");
			btn_cancel.add(txt_cancel);
			
			btn_view.add(btn_cancel);
			btn_view.add(v_divider);
			btn_view.add(btn_sure);
			
			content.add(content_view);
			content.add(divider);
			content.add(btn_view);
			
			this.view.add(bg);
			this.view.add(content);
		};
		
		Confirm.prototype.setSureHandler = function(handler){
			this._sureHandler = handler;
		};
		
		Confirm.prototype.setCancelHandler = function(handler){
			this.cancelHandler = handler;
		};
		
		Confirm.prototype.setMsg = function(msgStr){
			if(this._msg != null){
				this._msg.setText(msgStr);
			}
		};
		
		Confirm.prototype.show = function(){
			if(this.ele != null){
				this.ele.style.display = "block";
			}
		};
		
		Confirm.prototype.hide = function(){
			if(this.ele != null){
				this.ele.style.display = "none";
			}
		};
		
		Confirm.prototype.close = function(){
			if(this.ele != null){
				Ele.rootView.remove(this.view);
				this.ele = null;
			}
		};
		
		this._init();
	};
	
})();
(function(){
	var Button = Ele.Button = function(args) {
		this.eleType = "layout";
		this.ele;
		this.view;
		this.img;
		this._style;
		this._focusStyle;
		this._icon;
		this._focusIcon;
		this.data="";
		
		Button.prototype._init = function(){
			this._style = "ele_button";
			this._focusStyle = "ele_button_focus";
			this.view = new Ele.Layout("ele_button");
			this.ele = this.view.ele;
			var txt = null;
			var context = this;
			var iconRight = false;
			if(typeof(args) == "object"){
				var isSuffix = "";
				var tsSuffix = " ele_ml2";
				if(args.iconRight){
					iconRight = true;
					isSuffix = " ele_ml2";
					tsSuffix = "";
				}
				if(typeof(args.style) != "undefined"){
					this.ele.className = args.style;
					this._style = args.style;
				}
				if(typeof(args.focusStyle) != "undefined"){
					this._focusStyle = args.focusStyle;
				}
				if(typeof(args.icon) != "undefined"){
					this.img = new Ele.Img(args.icon,"ele_button_icon"+isSuffix);
					this._icon = args.icon;
				}
				if(typeof(args.focusIcon) != "undefined"){
					this._focusIcon = args.focusIcon;
				}
				if(typeof(args.text) != "undefined"){
					txt = new Ele.Label(args.text,"ele_label ele_button_txt"+tsSuffix);
				}
				if(txt != null && typeof(args.textStyle) != "undefined"){
					txt.ele.className = args.textStyle+" ele_button_txt"+tsSuffix;
				}
				if(typeof(args.onclick) == "function"){
					this.ele.onclick = function(){
						args.onclick(context.data);
					};
				}
			}
			if(iconRight){
				if(txt != null){
					this.view.add(txt);
				}
				if(this.img != null){
					this.view.add(this.img);
				}
			}else{
				if(this.img != null){
					this.view.add(this.img);
				}
				if(txt != null){
					this.view.add(txt);
				}
			}
			
			this.ele.onmouseover = function(){
				context.ele.className = context._focusStyle;
				if(context._focusIcon){
					context.img.ele.src = context._focusIcon;
				}
				
			};
			this.ele.onmouseout = function(){
				context.ele.className = context._style;
				if(context._focusIcon){
					context.img.ele.src = context._icon;
				}
			};
		};
		this._init();
	};
	
	var BigButton = Ele.BigButton = function(value, type){
		this.eleType = "layout";
		this.ele;
		this.view;
		this._ondown = false;
		this._clickHandler = null;
		
		
		BigButton.prototype._init = function(){
			var cName = "ele_big_button ele_big_button_blue";
			var cOver = "ele_big_button ele_big_button_blue_down";
			if(typeof(type) == "string"){
				cName = "ele_big_button ele_big_button_"+type;
				cOver = "ele_big_button ele_big_button_"+type+"_down";
			}
			this.view = new Ele.Layout(cName);
			this.view.setAlign("center");
			this.view.setHtml(value);
			this.ele = this.view.ele;
			var obj = this.ele;
			var context = this;
			obj.onmousedown = function(){
				obj.className = cOver;
				context._ondown = true;
			};
			obj.onmouseup = function(){
				obj.className = cName;
				context._ondown = false;
			};
			obj.onmouseout = function(){
				if(context._ondown){
					obj.className = cName;
					context._ondown = false;
				}
			};
			obj.onclick = function(){
				if(context._clickHandler != null){
					context._clickHandler();
				}
			};
		};
		BigButton.prototype.setWidth = function(width){
			this.view.setWidth(width);
		};
		BigButton.prototype.setClickHandler = function(handler){
			this._clickHandler = handler;
		};
		BigButton.prototype.removeClickHandler = function(){
			this._clickHandler = null;
		};
		this._init();
	};
	
	var CButton = Ele.CButton = function(value, s, e){
		this.eleType = "layout";
		this.ele;
		this.view;
		this._ondown = false;
		this._clickHandler = null;
		
		CButton.prototype._init = function(){
			this.view = new Ele.Layout(s);
			this.view.setAlign("center");
			this.view.setHtml(value);
			this.ele = this.view.ele;
			var obj = this.ele;
			var context = this;
			obj.onmousedown = function(){
				obj.className = e;
				context._ondown = true;
			};
			obj.onmouseup = function(){
				obj.className = s;
				context._ondown = false;
			};
			obj.onmouseout = function(){
				if(context._ondown){
					obj.className = s;
					context._ondown = false;
				}
			};
			obj.onclick = function(){
				if(context._clickHandler != null){
					context._clickHandler();
				}
			};
		};
		CButton.prototype.setClickHandler = function(handler){
			this._clickHandler = handler;
		};
		CButton.prototype.removeClickHandler = function(){
			this._clickHandler = null;
		};
		this._init();
	};
})();
(function(){
	var CheckBox = Ele.CheckBox = function(){
		this.eleType = "input";
		this.ele;
		
		CheckBox.prototype._init = function(){
			this.ele = document.createElement("input");
			this.ele.type = "checkbox";
			this.ele.className = "ele_check_style";
		};
		this._init();
	};
	var ICheckBox = Ele.ICheckBox = function(args){
		this.eleType = "img";
		this.ele;
		this.view;
		this.icon;
		this.selectedIcon;
		
		this._checked = false;
		this._clickEvent = null;
		
		ICheckBox.prototype.click = function(){
			if(this._checked){
				this.unChecked();
			}else{
				this.checked();
			}
			if(this._clickEvent != null){
				this._clickEvent();
			}
		};
		ICheckBox.prototype.isChecked = function(){
			return this._checked;
		};
		ICheckBox.prototype.checked = function(){
			this.ele.src = this.selectedIcon;
			this._checked = true;
		};
		ICheckBox.prototype.unChecked = function(){
			this.ele.src = this.icon;
			this._checked = false;
		};
		ICheckBox.prototype.addClickEvent = function(event){
			this._clickEvent = event;
		};
		
		ICheckBox.prototype._init = function(){
			this._checked = false;
			this.icon = Ele._pathPrefix+"ele/"+Ele._skin+"/assets/64/icon_cb_none.png";
			this.selectedIcon = Ele._pathPrefix+"ele/"+Ele._skin+"/assets/64/icon_cb_block.png";
			
			var cssName = "ele_check_img";
			if(typeof(args) == "object"){
				if(typeof(args.style) == "string"){
					cssName = args.style;
				}
				if(typeof(args.icon) == "string"){
					this.icon = args.icon;
				}
				if(typeof(args.selectedIcon) == "string"){
					this.selectedIcon = args.selectedIcon;
				}
			}
			
			this.view = new Ele.Img(this.icon, cssName);
			this.ele = this.view.ele;
			var context = this;
			this.ele.onclick = function(){
				context.click();
			};
		};
		this._init();
	};
	
	var CheckGroup = Ele.CheckGroup = function(args){
		this.eleType = "layout";
		this.ele;
		this.view;
		
		this._orientation = "landscape";//竖向布局portrait
		this._clickEvent = null;
		this._updateEvent = null;
		this._radios = [];
		this._disable;
		this._loadViewSize;
		this._loadCount;
		this._loadTotal;
		this._loadEvent = null;
		
		CheckGroup.prototype.clearSelected = function(){
			for(var index = 0; index < this._radios.length; index ++){
				if(this._radios[index].isChecked()){
					this._radios[index].unChecked();
				}
			}
		};
		
		CheckGroup.prototype.allSelected = function(){
			for(var index = 0; index < this._radios.length; index ++){
				if(!this._radios[index].isChecked()){
					this._radios[index].checked();
				}
			}
		};
		
		CheckGroup.prototype.getSelectedValue = function(){
			var selectArr = [];
			for(var index = 0; index < this._radios.length; index ++){
				if(this._radios[index].isChecked()){
					selectArr.push(this._radios[index].getValue());
				}
			}
			return selectArr;
		};
		CheckGroup.prototype.getIndexValue = function(index){
			return this._radios[index].getValue();
		};
		CheckGroup.prototype.getSelectedText = function(){
			var selectArr = [];
			for(var index = 0; index < this._radios.length; index ++){
				if(this._radios[index].isChecked()){
					selectArr.push(this._radios[index].getText());
				}
			}
			return selectArr;
		};
		CheckGroup.prototype.getSelectedIndex = function(){
			var selectArr = [];
			for(var index = 0; index < this._radios.length; index ++){
				if(this._radios[index].isChecked()){
					selectArr.push(index);
				}
			}
			return selectArr;
		};
		CheckGroup.prototype.disable = function(disable){
			if(typeof(disable) != "boolean"){
				return ;
			}
			if(this._disable == disable){
				return ;
			}
			for(var i in this._radios){
				this._radios[i].able(!disable);
			}
			this._disable = disable;
		};
		CheckGroup.prototype.getIndexByValue = function(value){
			if(this._radios.length < 0){
				return -1;
			}
			var index = -1;
			for(var i = 0; i < this._radios.length; i ++){
				if(this._radios[i].getValue() === value){
					index = i;
					break;
				}
			}
			return index;
		};
		CheckGroup.prototype.select = function(index){
			if(index < 0 || index >= this._radios.length){
				return ;
			}
			this._radios[index].checked();
			if(this._updateEvent != null){
				this._updateEvent(index);
			}
		};
		CheckGroup.prototype.unSelect = function(index){
			if(index < 0 || index >= this._radios.length){
				return ;
			}
			this._radios[index].unChecked();
			if(this._updateEvent != null){
				this._updateEvent(index);
			}
		};
		CheckGroup.prototype.selectByValue = function(value){
			var index = this.getIndexByValue(value);
			//没有找到
			if(index == -1){
				return ;
			}
			this.select(index);
		};
		CheckGroup.prototype.unSelectByValue = function(value){
			var index = this.getIndexByValue(value);
			//没有找到
			if(index == -1){
				return ;
			}
			this.unSelect(index);
		};
		
		CheckGroup.prototype.setItemClickEvent = function(event){
			this._clickEvent = event;
		};
		CheckGroup.prototype.setUpdateEvent = function(event){
			this._updateEvent = event;
		};
		CheckGroup.prototype._onAppendDraw = function(width, height){
			this._loadViewSize.push(new Ele.Utils.Size(width+8, height));
			this._loadCount ++;
			if(this._loadCount == this._loadTotal){
				if(this._loadEvent != null){
					this._loadEvent(this._loadViewSize);
				}
			}
			
		};
		CheckGroup.prototype._onItemClick = function(index){
			//成员点击事件
			if(this._clickEvent != null){
				this._clickEvent(index);
			}
			if(!this._disable && this._updateEvent != null){
				this._updateEvent(index);
			}
		};
		
		CheckGroup.prototype._init = function(){
			this._disable = false;
			var items = [];
			if(typeof(args) != "undefined"){
				if(typeof(args.onload) == "function"){
					this._loadEvent = args.onload;
				}
				if(typeof(args.itemClick) == "function"){
					this._clickEvent = args.itemClick;
				}
				if(typeof(args.selectChange) == "function"){
					this._updateEvent = args.selectChange;
				}
				if(typeof(args.orientation) != "undefined" && args.orientation == "portrait"){
					this._orientation = "portrait";
				}
				if(typeof(args.disable) == "boolean" && args.disable){
					this._disable = args.disable;
				}
				if(Ele._isArray(args.items)){
					items = args.items;
				}
			}
			if(this._orientation == "landscape"){
				this.view = new Ele.HLayout("ele_nocrspace");
			}else{
				this.view = new Ele.VLayout("ele_nocrspace");
			}
			this.ele = this.view.ele;
			this._loadViewSize = [];
			this._loadCount = 0;
			this._loadTotal = items.length;
			var context = this;
			if(items.length > 0){
				for(var i = 0; i < items.length; i ++){
					if(typeof(items[i].icon) == "undefined"){
						items[i].icon = Ele._pathPrefix+"ele/"+Ele._skin+"/assets/64/icon_check_unselect.png";
					}
					if(typeof(items[i].selectedIcon) == "undefined"){
						items[i].selectedIcon = Ele._pathPrefix+"ele/"+Ele._skin+"/assets/64/icon_check_select.png";
					}
					var iradio = new Ele.IRadio(items[i]);
					iradio.setCancel(true);
					if(this._disable){
						iradio.able(false);
					}
					iradio.eleId = i;
					iradio.addClickEvent(function(){
						context._onItemClick(this.eleId);
					});
					iradio.onDraw(function(){
						context._onAppendDraw(this.ele.offsetWidth,this.ele.offsetHeight);
					});
					this._radios.push(iradio);
					this.view.add(iradio, {padding:"0 0 0 8px"});
				}
			}
		};
		this._init();
	};
	
})();
(function(){
	var DateBox = Ele.DateBox = function(args){
		this.eleType = "layout";
		this.ele;
		this.view;
		this.edit;
		this.windowType;
		this.dateView;
		this.masking;
		this.position;
		this.offset;
		
		this._disable;
		this._itemClickEvent = null;
		this._updateEvent = null;
		this._onErrorResponse = null;
		
		DateBox.prototype.setWindowOffset = function(size){
			if(this.windowType){
				this.offset = size;
			}
		};
		
		DateBox.prototype.setOnItemClick = function(event){
			if(typeof(event) == "function"){
				this._itemClickEvent = event;
			}
		};
		DateBox.prototype.setOnSelectChange = function(event){
			if(typeof(event) == "function"){
				this._updateEvent = event;
			}
		};
		
		DateBox.prototype.setValue = function(value){
			if(typeof(value) == "undefined"){
				return ;
			}
			if(value instanceof Date){
				this.dateView.setDate(value);
				return ;
			}
			if(typeof(value) == "string"){
				this.dateView.setDateString(value);
			}
		};
		DateBox.prototype.reset = function(){
			this.edit.setValue("");
			this.dateView.setDate(new Date());
		};
		DateBox.prototype.setPattern = function(pattern){
			this.dateView.setPattern(pattern);
		};
		
		DateBox.prototype.getValue = function(){
			return this.edit.getValue();
		};
		
		DateBox.prototype.showErrorStyle = function(){
			this.ele.className = "ele_datebox_style_error";
		};
		DateBox.prototype.clearErrorStyle = function(){
			this.ele.className = "ele_datebox";
		};
		DateBox.prototype.expend = function(){
			if(this.windowType){
				this.position.inBottomLeft(this.view.ele);
				if(this.offset != null && this.offset instanceof Ele.Utils.Size){
					this.position.setOffset(this.offset);
				}
				this.masking.setContent(this.dateView, this.position);
				this.masking.showMasking();
				this.dateView.show();
				var context = this;
				this.masking.setHiddenHandler(function(){
					context._onBlur();
				});
				return;
			}
			this.masking.setContentNone();
			this.masking.showMasking();
			var context = this;
			this.masking.setHiddenHandler(function(){
				context._onBlur();
			});
			this.dateView.show();
		};
		
		DateBox.prototype.hide = function (){
			if(this.windowType){
				this.masking.hideMasking();
				return ;
			}
			this.dateView.hide();
			this.masking.hideMasking();
		};
		
		DateBox.prototype.setDisable = function (disable){
			if(typeof(disable) == "boolean"){
				this._disable = disable;
				this.edit.ele.readOnly = disable;
			}
		};
		DateBox.prototype._onItemClick = function(dateString){
			if(this._itemClickEvent != null){
				this._itemClickEvent();
			}
			this.ele.className = "ele_datebox";
			this.hide();
		};
		DateBox.prototype._onSelectUpdate = function(){
			if(this._itemClickEvent != null){
				this._itemClickEvent();
			}
			this.ele.className = "ele_datebox";
			this.hide();
			this.edit.setValue(this.dateView.getSelectDateString());
		};
		DateBox.prototype._onBlur = function(){
			this.ele.className = "ele_datebox";
			this.edit.setValue(this.dateView.getSelectDateString());
			//非窗口类型需要关闭本地窗口
			if(!this.windowType){
				this.dateView.hide();
				this.masking.hideMasking();
			}
		};
		
		DateBox.prototype._onFocus = function(){
			if(this._disable){
				this.ele.className = "ele_datebox_disable_focus";
				return ;
			}else{
				this.ele.className = "ele_datebox_focus";
			}
			this.edit.setValue(this.dateView.getSelectDateString());
			this.expend();
		};
		
		DateBox.prototype._updateValue = function(){
			var value = this.getValue();
			if(value.trim() != "" && value.length >= this.dateView.getPattern().length){
				var res = this.dateView.validateDateString(value);
				if(res){
					this.setValue(value);
				}
			}
		};
		
		DateBox.prototype._init = function(){
			this.view = new Ele.Layout("ele_datebox");
			this.ele = this.view.ele;
			this._disable = false;
			this.windowType = false;
			var context = this;
			this.masking = Ele.masking;
			if(typeof(args) == "object"){
				if(typeof(args.style) != "undefined"){
					this.ele.className = args.style;
				}
				if(typeof(args.disable) == "boolean" && args.disable){
					this._disable = args.disable;
				}
				if(typeof(args.onItemClick) == "function"){
					this._itemClickEvent = args.onItemClick;
				}
				if(typeof(args.selectChange) == "function"){
					this._updateEvent = args.selectChange;
				}
				if(typeof(args.windowType) == "boolean" && args.windowType){
					this.windowType = true;
				}
			}
			this.dateView = new DateView();
			this.dateView.setItemClickHandler(function(dateString){
				context._onItemClick(dateString);
			});
			this.dateView.setSelectUpdateHandler(function(){
				context._onSelectUpdate();
			});
			if(this.windowType){
				this.position = new Ele.Utils.Position();
			}else{
				this.dateView.ele.style.zIndex = this.masking.maxZIndex + 1;
				this.dateView.ele.style.marginTop = 33+"px";
				this.view.add(this.dateView);
			}
			
			var contentView = new Ele.HLayout("ele_datebox_panle");
			contentView.ele.onclick = function(){
				context._onFocus();
			};
			
			this.edit = new Ele.TextBox({style:"ele_datebox_intut_style"});
			this.edit.ele.onblur = function(e){
				context._updateValue();
			};
			if(this._disable){
				this.edit.ele.readOnly = true;
			}
			contentView.add(this.edit);
			var iconView = new Ele.Layout("ele_datebox_icon_view");
			var icon = new Ele.Img(Ele._pathPrefix+"ele/"+Ele._skin+"/assets/96/icon_date.png","ele_datebox_icon");
			iconView.add(icon);
			contentView.add(iconView);
			
			this.view.add(contentView);
		};
		this._init();
	};
	
	/**
	 * 时间面板
	 */
	var DateView = Ele.DateView = function(){
		this.eleType = "layout";
		this.ele;
		this.view;
		//时间文本显示
		this.dateText;
		//时间元素VIEW
		this.daysView = [];
		this._year;
		this._month;
		this._day;
		this._dateFormat;
		//选择的ITEM
		this._selected = null;
		//选择的日期字符串
		this._selectedDateString = "";
		this._itemClickHandler = null;
		this._selectedUpdateHandler = null;
		this._pageUpdateHandler = null;
		
		//初始化布局
		DateView.prototype.initView = function(){
			var context = this;
			this.view = new Ele.Layout("ele_dateview_panel");
			this.ele = this.view.ele;
			
			//标题布局
			var titleView = new Ele.HLayout("ele_dateview_title_view");
			var titleLeft = new Ele.Layout("ele_dateview_title_left_view");
			titleLeft.setAlign("center");
			var titleCenter = new Ele.Layout("ele_dateview_title_center_view");
			titleCenter.setAlign("center");
			var titleRight = new Ele.Layout("ele_dateview_title_right_view");
			titleRight.setAlign("center");
			var iconLeft = new Ele.Img(Ele._pathPrefix+"ele/"+Ele._skin+"/assets/96/icon_left.png", "ele_dateview_title_icon ele_ml20");
			iconLeft.ele.onclick = function(){
				context.previousMonth();
			};
			var icon2Left = new Ele.Img(Ele._pathPrefix+"ele/"+Ele._skin+"/assets/96/icon_2_left.png", "ele_dateview_title_icon");
			icon2Left.ele.onclick = function(){
				context.previousYear();
			};
			this.dateText = new Ele.Label(this._year+"-"+this._month, "ele_dateview_date_txt");
			var iconRight = new Ele.Img(Ele._pathPrefix+"ele/"+Ele._skin+"/assets/96/icon_right.png", "ele_dateview_title_icon");
			iconRight.ele.onclick = function(){
				context.nextMonth();
			};
			
			var icon2Right = new Ele.Img(Ele._pathPrefix+"ele/"+Ele._skin+"/assets/96/icon_2_right.png", "ele_dateview_title_icon ele_ml20");
			icon2Right.ele.onclick = function(){
				context.nextYear();
			};
			titleLeft.add(icon2Left);
			titleLeft.add(iconLeft);
			titleCenter.add(this.dateText);
			titleRight.add(iconRight);
			titleRight.add(icon2Right);
			
			titleView.add(titleLeft,{width:"25%"});
			titleView.add(titleCenter,{width:"50%"});
			titleView.add(titleRight,{width:"25%"});
			
			//星期标题布局
			var weekView = new Ele.Layout("ele_dateview_week_view");
			var weeks = ["一","二","三","四","五","六","日"];
			for(var index in weeks){
				var item = new Ele.Layout("ele_dateview_week_item");
				item.setAlign("center");
				item.setHtml(weeks[index]);
				weekView.add(item);
			}
			var weekFc = new Ele.Layout("ele_cl");
			weekView.add(weekFc);
			
			this.view.add(titleView);
			this.view.add(weekView);
			var divider = new Ele.Layout("ele_dateview_divider");
			this.view.add(divider);
			
			//时间元素布局
			for(var row = 0; row < 6; row ++){
				var rowView = new Ele.HLayout("ele_dateview_line_view");
				var rowViews = [];
				for(var col = 0; col < 7; col ++){
					var dateItem = new DateItem();
					rowView.add(dateItem, {padding:"0 0 0 8px"});
					rowViews.push(dateItem);
				}
				this.daysView.push(rowViews);
				this.view.add(rowView);
			}
		};
		
		//初始化时间，默认为今天
		DateView.prototype.initDate = function(){
			var now = new Date();
			this._year = now.getFullYear();
			this._month = now.getMonth() + 1;
			this._day = now.getDate();
			this._dateFormat = new Ele.Utils.DateFormat();
		};
		//初始化数据（指定元素布局填充元素数据）
		DateView.prototype.initData = function(){
			var now = new Date();
			var year = now.getFullYear();
			var month = now.getMonth() + 1;
			var day = now.getDate();
			var context = this;
			
			var datas = this.getArrayData();
			var yearAndMonth = this.toYearMonthString();
			this._selected = null;
			for(var row = 0; row < 6; row ++){
				for(var col = 0; col < 7; col ++){
					var data = datas[row][col];
					var dayItem = this.daysView[row][col];
					dayItem.setHtml(data);
					if(data == ""){
						dayItem.removeClickHandler();
						dayItem.ele.className = "ele_dateview_line_item";
					}else{
						dayItem.addClickHandler(function(item){
							context._onItemClick(item);
						});
						dayItem.setData(data);
						dayItem.ele.className = "ele_dateview_line_item ele_dateview_line_item_full";
						if(col > 4){
							dayItem.isWeek = true;
							dayItem.ele.className = "ele_dateview_line_item ele_dateview_line_item_week";
						}
						var tempDay = data;
						if(new Number(data) < 10){
							tempDay = "0"+data;
						}
						if((yearAndMonth +"-"+tempDay) == this._selectedDateString){
							dayItem.ele.className = "ele_dateview_line_item ele_dateview_line_item_select";
							this._selected = dayItem;
						}
					}
					
					if(this._year == year && this._month == month && new Number(data) == day){
						dayItem.isToday = true;
						dayItem.ele.className = "ele_dateview_line_item ele_dateview_line_item_today";
					}
				}
			}
		};
		
		//设置日期选择更新事件
		DateView.prototype.setSelectUpdateHandler = function(funName){
			if(typeof(funName) == "function"){
				this._selectedUpdateHandler = funName;
			}
		};
		//移除日期选择更新事件
		DateView.prototype.removeSelectUpdateHandler = function(){
			this._selectedUpdateHandler = null;
		};
		//设置日期元素点击事件
		DateView.prototype.setItemClickHandler = function(funName){
			if(typeof(funName) == "function"){
				this._itemClickHandler = funName;
			}
		};
		//移除日期选择更新事件
		DateView.prototype.removeItemClickHandler = function(){
			this._itemClickHandler = null;
		};
		//设置日期翻页事件
		DateView.prototype.setPageUpdateHandler = function(funName){
			if(typeof(funName) == "function"){
				this._pageUpdateHandler = funName;
			}
		};
		//移除日期翻页事件
		DateView.prototype.removePageUpdateHandler = function(){
			this._pageUpdateHandler = null;
		};
		
		DateView.prototype.getSelectDateString = function(){
			return this._selectedDateString;
		};
		
		//捕捉元素点击事件
		DateView.prototype._onItemClick = function(item){
			if(this._selected != null){
				if(item.data == this._selected.data){
					if(this._itemClickHandler != null){
						this._itemClickHandler(this._selectedDateString);
					}
					this.hide();
					return ;
				}
				if(!this._selected.isToday){
					if(this._selected.isWeek){
						this._selected.ele.className = "ele_dateview_line_item ele_dateview_line_item_week";
					}else{
						this._selected.ele.className = "ele_dateview_line_item ele_dateview_line_item_full";
					}
				}
			}
			if(!item.isToday){
				item.ele.className = "ele_dateview_line_item ele_dateview_line_item_select";
			}
			//设置选择对象
			this._selected = item;
			//设置当前DAY
			this._day = new Number(item.data);
			//设置当前选择的日期
			this._selectedDateString = this.toDateString();
			if(this._itemClickHandler != null){
				this._itemClickHandler(this._selectedDateString);
			}
			this.hide();
			if(this._selectedUpdateHandler != null){
				this._selectedUpdateHandler();
			}
		};
		
		//生成所有时间元素二位数组数据
		DateView.prototype.getArrayData = function(){
			var firstDay = new Date(this._year, this._month - 1, 1);
			var week = firstDay.getDay();
			if(week == 0){
				week = 7;
			}
			var rows = new Array();
			var temp_day = 1;
			var days = this.getDays();
			for(var row = 0; row < 6; row ++){
				var cols = new Array();
				for(var col = 0; col < 7; col ++){
					if(row == 0 && col < week - 1){
						cols.push("");
					}else{
						if(temp_day > days){
							cols.push("");
						}else{
							cols.push(""+temp_day);
							temp_day ++;
						}
					}
				}
				rows.push(cols);
			}
			return rows;
		};
		//获取当前月的天数
		DateView.prototype.getDays = function(){
			var days = 31;
			if(this._month == 2){
				days = 28;
				if(this._year%4 == 0){
					days = 29;
				}
			}
			if(this._month == 4 ||this._month == 6 || this._month == 9 || this._month == 11){
				days = 30;
			}
			return days;
		};
		//设置文本封装格式
		DateView.prototype.setPattern = function(pattern){
			this._dateFormat.setPattern(pattern);
		};
		//获取文本封装格式
		DateView.prototype.getPattern = function(){
			return this._dateFormat.getPattern();
		};
		//获取选择的日期
		DateView.prototype.toDate = function(){
			return new Date(this._year, this._month - 1, this._day);
		};
		//将时间转换为字符串格式
		DateView.prototype.toDateString = function(){
			var date = this.toDate();
			return this._dateFormat.format(date);
		};
		
		//设置日期
		DateView.prototype.setDate = function(date){
			if(!(date instanceof Date)){
				return false;
			}
			this._year = date.getFullYear();
			this._month = date.getMonth() + 1;
			this._day = date.getDate();
			
			//设置选择日期
			this._selectedDateString = this.toDateString();
			
			this.initData();
			this.dateText.ele.innerHTML = this.toYearMonthString();
			if(this._selectedUpdateHandler != null){
				this._selectedUpdateHandler();
			}
			return true;
		};
		//设置日期字符串
		DateView.prototype.setDateString = function(str){
			if(typeof(str) != "string"){
				return false;
			}
			var date = null;
			try{
				date = this._dateFormat.parse(str);
			}catch(e){
				//TODO handle the exception
				console.log(e.message);
			}
			if(date == null){
				return false;
			}
			if(date instanceof Date && date.getTime() != "" && !isNaN(date.getTime())){
				return this.setDate(date);
			}
			return false;
		};
		//日期字符串校验
		DateView.prototype.validateDateString = function(str){
			if(typeof(str) != "string"){
				return false;
			}
			var date = null;
			try{
				date = this._dateFormat.parse(str);
			}catch(e){
				//TODO handle the exception
			}
			if(date instanceof Date && date.getTime() != "" && !isNaN(date.getTime())){
				return true;
			}
			return false;
		};
		
		//转换成只有年-月的时间字符串
		DateView.prototype.toYearMonthString = function(){
			var year = this._year;
			var month = this._month+"";
			if(this._month < 10){
				month = "0"+month;
			}
			return year+"-"+month;
		};
		
		//向前翻一个月
		DateView.prototype.previousMonth = function(){
			var temp = this._month - 1;
			if(temp < 1){
				if(this._year - 1 < 1970){
					return;
				}
				this._year --;
				this._month = 12;
			}else{
				this._month = temp;
			}
			temp = null;
			this.initData();
			this.dateText.ele.innerHTML = this.toYearMonthString();
			if(this._pageUpdateHandler != null){
				this._pageUpdateHandler();
			}
		};
		//向前翻一年
		DateView.prototype.previousYear = function(){
			if(this._year - 1 < 1970){
				return;
			}
			this._year --;
			this.initData();
			this.dateText.ele.innerHTML = this.toYearMonthString();
			if(this._pageUpdateHandler != null){
				this._pageUpdateHandler();
			}
		};
		//向后翻一个月
		DateView.prototype.nextMonth = function(){
			var temp = this._month + 1;
			if(temp > 12){
				this._year ++;
				this._month = 1;
			}else{
				this._month = temp;
			}
			temp = null;
			this.initData();
			this.dateText.ele.innerHTML = this.toYearMonthString();
			if(this._pageUpdateHandler != null){
				this._pageUpdateHandler();
			}
		};
		//向后翻一年
		DateView.prototype.nextYear = function(){
			this._year ++;
			this.initData();
			this.dateText.ele.innerHTML = this.toYearMonthString();
			if(this._pageUpdateHandler != null){
				this._pageUpdateHandler();
			}
		};
		
		//隐藏窗体
		DateView.prototype.hide = function (){
			this.view.ele.style.display = "none";
		};
		DateView.prototype.show = function(){
			this.view.ele.style.display = "block";
		};
		
		this.initDate();
		this.initView();
		this.initData();
	};
	
	/*DateItem private*/
	var DateItem = function(obj){
		this.eleType = "layout";
		this.ele;
		this.view;
		this.data = "";
		this.isWeek = false;
		this.isToday = false;
		this._clickHandle = null;
		
		DateItem.prototype.addClickHandler = function(funName){
			this._clickHandle = funName;
		};
		
		DateItem.prototype.removeClickHandler = function(){
			this._clickHandle = null;
		};
		
		DateItem.prototype.setData = function(data){
			this.data = data;
		};
		
		DateItem.prototype.setHtml = function(text){
			this.view.setHtml(text);
		};
		
		DateItem.prototype._onClickEvent = function(){
			if(this._clickHandle != null){
				this._clickHandle(this);
			}
		};
		
		DateItem.prototype._init = function(){
			this.view = new Ele.Layout("ele_dateview_line_item");
			this.ele = this.view.ele;
			var context = this;
			this.ele.onclick = function(){
				context._onClickEvent();
			};
		};
		
		this._init();
	};
})();
(function(){
	var Element = Ele.Element = function(id){
		this.eleType = "ele";
		this.ele;
		
		Element.prototype._init = function(){
			this.ele = document.getElementById(id);
		};
		Element.prototype.add = function(view){
			this.ele.appendChild(view.ele);
		};
		Element.prototype.remove = function(view){
			this.ele.removeChild(view.ele);
		};
		this._init();
	};
	
	// tag form
	var Form = Ele.Form = function(action){
		this.eleType = "form";
		this.ele;
		
		Form.prototype.add = function(eleView){
			this.ele.appendChild(eleView.ele);
		};
		
		Form.prototype.setAction = function(action){
			if(typeof(action) == "string"){
				this.ele.action = action;
			}
		};
		
		Form.prototype._init = function(){
			this.ele = document.createElement("form");
			this.setAction(action);
		};
		this._init();
	};
	
	// tag img
	var Img = Ele.Img = function(url,cName){
		this.eleType = "img";
		this.ele;
		
		Img.prototype._init = function(){
			this.ele = document.createElement("img");
			this.ele.src = url;
			if(typeof(cName) == "string"){
				this.ele.className = cName;
			}
		};
		this._init();
	};
})();
(function(){
	var Label = Ele.Label = function(text, cName){
		this.eleType = "span";
		this.ele;
		
		Label.prototype.setText = function(text){
			this.ele.innerHTML = text;
		};
		
		Label.prototype.getText = function(){
			return this.ele.innerHTML;
		};
		
		Label.prototype._init = function(){
			this.ele = document.createElement("span");
			if(typeof(cName) == "string"){
				this.ele.className = cName;
			}else{
				this.ele.className = "ele_label";
			}
			if(typeof(text) == "string"){
				this.ele.innerHTML = text;
			}
		};
		this._init();
	};
	
	var IconLabel = Ele.IconLabel = function(args) {
		this.eleType = "layout";
		this.ele;
		this.view;
		this._icon;
		this._focusIcon;
		this.data="";
		
		IconLabel.prototype._init = function(){
			this.view = new Ele.Layout("ele_icon_label ele_icon_label_def");
			this.ele = this.view.ele;
			var context = this;
			if(typeof(args) == "object"){
				if(typeof(args.style) != "undefined"){
					this.ele.className = args.style;
					this._style = args.style;
				}
				if(typeof(args.icon) != "undefined"){
					this.ele.style.backgroundImage = "url('"+args.icon+"')";
					this._icon = args.icon;
				}
				if(typeof(args.focusIcon) != "undefined"){
					this._focusIcon = args.focusIcon;
				}
				if(typeof(args.text) != "undefined"){
					this.view.setHtml(args.text);
				}
				if(typeof(args.onclick) == "function"){
					this.ele.onclick = function(){
						args.onclick(context.data);
					};
				}
			}
			
			this.ele.onmouseover = function(){
				if(typeof(context._focusIcon) == "undefined"){
					return;
				}
				context.ele.style.backgroundImage = "url('"+context._focusIcon+"')";
			};
			this.ele.onmouseout = function(){
				if(typeof(context._focusIcon) == "undefined" || typeof(context._icon) == "undefined"){
					return;
				}
				context.ele.style.backgroundImage = "url('"+context._icon+"')";
			};
		};
		this._init();
	};
	
	var MenuLabel = Ele.MenuLabel = function(args){
		this.eleType = "layout";
		this.ele;
		this.view;
		this.childrenViews;
		this.windowType;
		this.masking;
		this.position;
		this.offset;
		
		this._itemClickEvent = null;
		this._rootData;
		
		MenuLabel.prototype.setWindowOffset = function(size){
			if(this.windowType){
				this.offset = size;
			}
		};
		
		MenuLabel.prototype.setText = function(text){
			this.ele.innerHTML = text;
		};
		
		MenuLabel.prototype.showChildren = function(){
			if(this.windowType){
				this.position.inBottomLeft(this.view.ele);
				if(this.offset != null && this.offset instanceof Ele.Utils.Size){
					this.position.setOffset(this.offset);
				}
				this.masking.setContent(this.childrenViews, this.position);
				this.masking.showMasking();
				return ;
			}
			
			this.masking.setContentNone();
			this.masking.showMasking();
			var context = this;
			this.masking.setHiddenHandler(function(){
				context.hideChildren();
			});
			this.childrenViews.ele.style.display = "block";
		};
		
		MenuLabel.prototype.hideChildren = function (){
			if(this.windowType){
				this.masking.hideMasking();
				return ;
			}
			this.childrenViews.ele.style.display = "none";
			this.masking.hideMasking();
		};
		
		MenuLabel.prototype.addChild = function(child){
			var context = this;
			if(typeof(child) != "object"){
				return ;
			}
			var item = new Ele.Layout("ele_menu_label_children_item");
			if(typeof(child.text) == "string"){
				item.setHtml(child.text);
			}
			if(typeof(child.data) != "undefined"){
				//动态赋值数据
				item.ele.eledata = child.data;
			}
			
			item.ele.onclick = function(){
				context.hideChildren();
				context._onItemClick(false, this.eledata);
			};
			this.childrenViews.add(item);
		};
		
		MenuLabel.prototype._onItemClick = function(isRoot, data){
			if(this._itemClickEvent != null){
				if(typeof(data) != "undefined"){
					this._itemClickEvent(isRoot, data);
				}else{
					this._itemClickEvent(isRoot);
				}
			}
		};
		
		MenuLabel.prototype._init = function(){
			this.view = new Ele.Layout("ele_menu_label");
			this.ele = this.view.ele;
			var context = this;
			this.masking = Ele.masking;
			
			var img = null;
			var txt = null;
			var hasChildren = false;
			if(typeof(args) == "object"){
				if(typeof(args.style) != "undefined"){
					this.ele.className = args.style;
				}
				if(typeof(args.icon) != "undefined"){
					img = new Ele.Img(args.icon,"ele_menu_label_icon");
				}
				if(typeof(args.text) != "undefined"){
					txt = new Label(args.text,"ele_ml4");
				}
				if(typeof(args.onItemClick) == "function"){
					this._itemClickEvent = args.onItemClick;
				}
				if(typeof(args.data) != "undefined"){
					this._rootData = args.data;
				}
				if(typeof(args.children) == "object"){
					//判断是否是数组
					if(Ele._isArray(args.children)){
						hasChildren = true;
					}
				}
				if(typeof(args.windowType) == "boolean" && args.windowType){
					this.windowType = true;
				}
			}
			var contentView = new Ele.HLayout("ele_menu_label_panel");
			if(this.windowType){
				this.childrenViews = new Ele.Layout("ele_menu_label_children_wt");
				this.childrenViews.setAlign("center");
				this.position = new Ele.Utils.Position();
			}else{
				this.childrenViews = new Ele.Layout("ele_menu_label_children");
				this.childrenViews.setAlign("center");
				this.childrenViews.ele.style.zIndex = this.masking.maxZIndex + 1;
				this.view.add(this.childrenViews);
			}
			
			if(img != null){
				contentView.add(img);
			}
			if(txt != null){
				contentView.add(txt);
			}
			
			contentView.ele.onclick = function(){
				if(hasChildren){
					context.showChildren();
				}
				context._onItemClick(true, context._rootData);
			};
			this.view.add(contentView);
			
			if(hasChildren){
				for(var i = 0; i < args.children.length; i ++){
					this.addChild(args.children[i]);
					if(i < args.children.length - 1){
						var divider = new Ele.Layout("ele_menu_label_children_divider");
						this.childrenViews.add(divider);
					}
				}
				
				var childrenIcon = new Ele.Img(Ele._pathPrefix+"ele/"+Ele._skin+"/assets/64/icon_down.png","ele_menu_label_children_icon");
				contentView.add(childrenIcon);
			}
			
		};
		this._init();
	};
})();
(function(){
	/**
	 * 布局元素
	 */
	var Layout = Ele.Layout = function(styleName){
		this.eleType = "div";
		this.ele;
		
		Layout.prototype._init = function(){
			this.ele = document.createElement("div");
			
			if(typeof(styleName) == "string"){
				this.ele.className = styleName;
			}
		};
		Layout.prototype.setSize = function(width, height){
			this.ele.style.width = width;
			this.ele.style.height = height;
		};
		Layout.prototype.setWidth = function(width){
			this.ele.style.width = width;
		};
		Layout.prototype.setHeight = function(height){
			this.ele.style.height = height;
		};
		Layout.prototype.setLineHeight = function(height){
			this.ele.style.lineHeight = height;
		};
		Layout.prototype.setOverflow = function(overflow){
			this.ele.style.overflow = overflow;
		};
		Layout.prototype.setOverflowX = function(overflow){
			this.ele.style.overflowX = overflow;
		};
		Layout.prototype.setOverflowY = function(overflow){
			this.ele.style.overflowY = overflow;
		};
		Layout.prototype.setContainer = function(obj){
			obj.appendChild(this.ele);
		};
		Layout.prototype.setContainerById = function(id){
			document.getElementById(id).appendChild(this.ele);
		};
		Layout.prototype.add = function(obj){
			this.ele.appendChild(obj.ele);
		};
		Layout.prototype.remove = function(obj){
			this.ele.removeChild(obj.ele);
		};
		Layout.prototype.setHtml = function(html){
			if(typeof(html) == "undefined"){
				this.ele.innerHTML = "";
				return ;
			}
			this.ele.innerHTML = html;
		};
		Layout.prototype.setAlign = function(align){
			this.ele.align = align;
		};
		Layout.prototype.clear = function(){
			this.ele.innerHTML = "";
		};
		
		this._init();
	};
	
	/**
	 * 横向布局
	 */
	var HLayout = Ele.HLayout = function(styleName){
		this.eleType = "layout";
		this.ele;
		this.view;
		this._clView;
		this._width;
		this._height;
		
		HLayout.prototype.setSize = function(width, height){
			this.view.setSize(width, height);
			this._width = width;
			this._height = height;
		};
		
		HLayout.prototype.setContainer = function(obj){
			this.view.setContainer(obj);
		};
		HLayout.prototype.setContainerById = function(id){
			this.view.setContainerById(id);
		};
		HLayout.prototype.add = function(obj,args){
			var panel = new Layout("ele_bs_border ele_fl");
			if(this._height == null){
				panel.setHeight("100%");
			}else{
				panel.setHeight(this._height);
			}
			if(typeof(args) == "object" && args != null){
				if(args.float){
					if(args.float == "right"){
						panel.ele.className = "ele_fr";
					}
				}
				if(args.width){
					panel.setWidth(args.width);
				}
				if(args.align){
					panel.ele.align = args.align;
				}
				if(args.padding){
					panel.ele.style.padding = args.padding;
				}
			}
			panel.add(obj);
			this.view.remove(this._clView);
			this.view.add(panel);
			this.view.add(this._clView);
		};
		HLayout.prototype.clear = function(){
			this.view.clear();
			this.view.add(this._clView);
		};
		HLayout.prototype.getView = function(){
			return this.view;
		};
		
		HLayout.prototype._init = function(){
			if(typeof(styleName) != "string"){
				styleName = "ele_layout";
			}
			this.view = new Layout(styleName);
			this._clView = new Layout("ele_cl");
			this.view.add(this._clView);
			this.ele = this.view.ele;
		};
		this._init();
	};
	
	/**
	 * 竖向布局
	 */
	var VLayout = Ele.VLayout = function(styleName){
		this.eleType = "layout";
		this.ele;
		this.view;
		this._width;
		this._height;
		
		VLayout.prototype.setSize = function(width, height){
			this.view.setSize(width, height);
			this._width = width;
			this._height = height;
		};
		
		VLayout.prototype.add = function(obj,args){
			var panel = new Layout("ele_bs_border");
			if(this._width == null){
				panel.setWidth("100%");
			}else{
				panel.setWidth(this._width);
			}
			panel.setHeight("auto");
			if(typeof(args) == "object" && args != null){
				if(args.heigth){
					panel.setHeight(args.heigth);
				}
				if(args.align){
					panel.ele.align = args.align;
				}
				if(args.padding){
					panel.ele.style.padding = args.padding;
				}
			}
			panel.add(obj);
			this.view.add(panel);
		};
		VLayout.prototype.setContainer = function(obj){
			this.view.setContainer(obj);
		};
		VLayout.prototype.setContainerById = function(id){
			this.view.setContainerById(id);
		};
		VLayout.prototype.getView = function(){
			return this.view;
		};
		VLayout.prototype.clear = function(){
			this.view.clear();
		};
		
		VLayout.prototype._init = function(){
			if(typeof(styleName) != "string"){
				styleName = "ele_layout";
			}
			this.view = new Layout(styleName);
			this.ele = this.view.ele;
		};
		this._init();
	};
})();
(function(){
	var ListGrid = Ele.ListGrid = function(args){
		this.eleType = "layout";
		this.ele;
		
		this.count = 0;
		this.view;
		this.fields;
		this.width;
		this.height;
		this.itemWidth = 120;
		this.itemHeight = 40;
		this.titleHeight = 40;
		this.oprs;
		this.selectOpr = null;
		this.selectArray = [];
		this.main_pr = 0;//主体表单右间距
		this.main_pl = 0;//主体表单左间距
		
		this.titleView;
		this.listView;
		
		this.oprsWidth = 120;
		this.selectOprWidth = 80;
		
		ListGrid.prototype.getSelect = function(){
			var temp = [];
			if(this.selectArray.length < 1){
				return temp;
			}
			for(var i = 0; i < this.selectArray.length; i++){
				var ele = this.selectArray[i];
				if(ele.isChecked()){
					temp.push(ele.data);
				}
			}
			return temp;
		};
		ListGrid.prototype.selectAll = function(){
			if(this.selectArray.length < 1){
				return ;
			}
			for(var i = 0; i < this.selectArray.length; i++){
				var ele = this.selectArray[i];
				if(!ele.isChecked()){
					ele.checked();
				}
			}
		};
		ListGrid.prototype.unSelectAll = function(){
			if(this.selectArray.length < 1){
				return ;
			}
			for(var i = 0; i < this.selectArray.length; i++){
				var ele = this.selectArray[i];
				if(ele.isChecked()){
					ele.unChecked();
				}
			}
		};
		
		ListGrid.prototype.addRow = function(row){
			if(typeof(args) != "object"){
				return;
			}
			if(this.count == 0){
				this.listView.getView().clear();
			}
			var rowCss = "ele_listgrid_bg_double";
			if(this.count%2 == 0){
				rowCss = "ele_listgrid_bg_single";
			}
			var line = new Ele.Layout("ele_listgrid_line_view "+rowCss);
			line.setSize("100%", this.itemHeight+"px");
			line.ele.rowcss = "ele_listgrid_line_view "+rowCss;
			
			if(this.selectOpr != null){
				var selitem = new Ele.Layout("ele_listgrid_cb ele_listgrid_br");
				selitem.setHeight(this.itemHeight+"px");
				selitem.setLineHeight(this.itemHeight+"px");
				selitem.setWidth(this.selectOprWidth+"px");
				selitem.setAlign("center");
				var cbox = new Ele.ICheckBox();
				cbox.ele.style.marginTop= ((this.itemHeight - 16)/2)+"px";
				cbox.data = row;
				selitem.add(cbox);
				line.add(selitem);
				this.selectArray.push(cbox);
			}
			
			var bar = new Ele.HLayout("ele_listgrid_line_bar");
			if(this.oprs != null){
				var opitem = new Ele.HLayout("ele_listgrid_item");
				opitem.getView().setHeight(this.itemHeight+"px");
				opitem.getView().setWidth(this.oprsWidth+"px");
				opitem.getView().setAlign("center");
				
				if(typeof(this.oprs.menus) != "undefined" && this.oprs.menus.length > 0){
					var ptop = (this.itemHeight - 26)/2;
					for(var i = 0; i < this.oprs.menus.length; i ++){
						if(typeof(this.oprs.menus[i].format) == "function"){
							if(!this.oprs.menus[i].format(row)){
								continue;
							}
						}
						
						var ic = new Ele.IconLabel(this.oprs.menus[i]);
						ic.data = row;
						opitem.add(ic,{padding:ptop+"px 0px 0px 4px"});
					}
				}
				bar.add(opitem);
			}
			line.add(bar);
			
			var lineItemPanel = new Ele.HLayout("ele_listgrid_title_item_view");
			lineItemPanel.setSize("100%", this.itemHeight+"px");
			lineItemPanel.ele.style.padding = "0px "+(this.main_pr - 8)+"px 0px "+this.main_pl+"px";
			for(var f in this.fields){
				var rowItem = new Ele.Layout("ele_listgrid_item");
				rowItem.setHeight(this.itemHeight+"px");
				rowItem.setLineHeight(this.itemHeight+"px");
				var tempWidth = this.itemWidth+"px";
				if(typeof(this.fields[f].fieldWidth) != "undefined"){
					if(typeof(this.fields[f].fieldWidth) == "number"){
						tempWidth = this.fields[f].fieldWidth+"px";
					}
					if(typeof(this.fields[f].fieldWidth) == "string"){
						tempWidth = this.fields[f].fieldWidth;
					}
				}else{
					if(this.width == null){
						tempWidth = this.itemWidth+"%";
					}
				}
				rowItem.setAlign("center");
				if(typeof(this.fields[f].format) == "function"){
					var element = this.fields[f].format(row);
					if(Ele._isElement(element)){
						rowItem.setHtml(element.outerHTML);
					}else{
						if(element && typeof(element.eleType) == "string"){
							rowItem.add(element);
						}else{
							rowItem.setHtml(element);
						}
					}
					
				}else{
					rowItem.setHtml(row[this.fields[f].fieldName]);
				}
				lineItemPanel.add(rowItem,{width:tempWidth});
			}
			line.add(lineItemPanel);
			
			
			line.ele.onmouseover = function(){
				this.className = "ele_listgrid_line_view ele_listgrid_bg_over";
			};
			line.ele.onmouseout = function(){
				this.className = this.rowcss;
			};
			
			this.listView.add(line,{height:this.itemHeight+"px"});
			this.count ++;
		};
		ListGrid.prototype.clear = function(){
			this.listView.clear();
			this.addEmpty();
			this.count = 0;
			this.selectArray = [];
		};
		ListGrid.prototype.addEmpty = function(){
			var empty = new Ele.Layout("ele_listgrid_item ele_listgrid_empty_txt");
			empty.setLineHeight("40px");
			empty.setHtml("无数据");
			empty.setAlign("center");
			this.listView.add(empty);
		};
		
		ListGrid.prototype._init = function(){
			this.view = new Ele.Layout('ele_listgrid_view');
			this.ele = this.view.ele;
			var context = this;
			var canScoll = true;
			if(typeof(args) == "object"){
				if(typeof(args.widthPx) == "number"){
					this.view.setWidth(args.widthPx+"px");
					this.width = args.widthPx;
				}
				if(typeof(args.heightPx) == "number"){
					this.view.setHeight(args.heightPx+"px");
					this.height = args.heightPx;
				}
				if(typeof(args.itemHeightPx) == "number"){
					this.itemHeight = args.itemHeightPx;
				}
				if(typeof(args.canScoll) == "boolean" && !args.canScoll){
					canScoll = false;
				}
				if(typeof(args.fields) == "object"){
					this.fields = args.fields;
				}
				if(typeof(args.operations) == "object"){
					this.oprs = args.operations;
					if(typeof(this.oprs.width) == "number"){
						this.oprsWidth = this.oprs.width;
					}
				}
				if(typeof(args.selectOpr) == "object"){
					this.selectOpr = args.selectOpr;
					if(typeof(this.selectOpr.width) == "number"){
						this.selectOprWidth = this.selectOpr.width;
					}
				}
			}
			if(this.fields != null){
				//var len = Object.getOwnPropertyNames(this.fields).length;
				var len = this.fields.length;
				//滚动条8--自定义
				var edge = 8;
				if(this.oprs != null){
					edge += this.oprsWidth;
				}
				if(this.selectOpr != null){
					edge += this.selectOprWidth;
				}
				if(this.width != null){
					this.itemWidth = (this.width - edge)/len;
				}else{
					this.itemWidth = 100/len;
				}
				this.titleView = new Ele.Layout('ele_listgrid_title_view');
				//padding left 数值
				if(this.selectOpr != null){
					var selitem = new Ele.Layout("ele_listgrid_title_cb");
					selitem.setHeight(this.titleHeight+"px");
					selitem.setLineHeight(this.titleHeight+"px");
					selitem.setWidth(this.selectOprWidth+"px");
					this.main_pl += this.selectOprWidth;
					selitem.setAlign("center");
					var cbox = new Ele.ICheckBox();
					cbox.addClickEvent(function(){
						if(cbox.isChecked()){
							context.selectAll();
						}else{
							context.unSelectAll();
						}
					});
					cbox.ele.style.marginTop="12px";
					selitem.add(cbox);
					var label = new Ele.Label("全选","ele_listgrid_cb_title");
					selitem.add(label);
					this.titleView.add(selitem);
				}
				//padding right 数值
				var bar = new Ele.HLayout("ele_listgrid_title_bar");
				if(this.oprs != null){
					var opitem = new Ele.Layout("ele_listgrid_title ele_listgrid_br");
					opitem.setHeight(this.titleHeight+"px");
					opitem.setLineHeight(this.titleHeight+"px");
					opitem.setWidth(this.oprsWidth+"px");
					this.main_pr += this.oprsWidth;
					opitem.setAlign("center");
					opitem.setHtml("操作");
					bar.add(opitem);
				}
				
				var rollItem = new Ele.Layout("ele_listgrid_title ele_listgrid_bsbb");
				rollItem.setSize("8px",this.titleHeight+"px");
				bar.add(rollItem);
				this.main_pr += 8;
				this.titleView.add(bar);
				
				var titleItemPanel = new Ele.HLayout("ele_listgrid_title_item_view");
				titleItemPanel.ele.style.padding = "0px "+this.main_pr+"px 0px "+this.main_pl+"px";
				for(var f in this.fields){
					var titleItem = new Ele.Layout("ele_listgrid_title ele_listgrid_br");
					titleItem.setHeight(this.titleHeight+"px");
					titleItem.setLineHeight(this.titleHeight+"px");
					var tempWidth = this.itemWidth+"px";
					if(typeof(this.fields[f].fieldWidth) != "undefined"){
						if(typeof(this.fields[f].fieldWidth) == "number"){
							tempWidth = this.fields[f].fieldWidth+"px";
						}
						if(typeof(this.fields[f].fieldWidth) == "string"){
							tempWidth = this.fields[f].fieldWidth;
						}
					}else{
						if(this.width == null){
							tempWidth = this.itemWidth+"%";
						}
					}
					titleItem.setAlign("center");
					titleItem.setHtml(this.fields[f].textName);
					titleItemPanel.add(titleItem,{width:tempWidth});
				}
				this.titleView.add(titleItemPanel);
				
				this.view.add(this.titleView);
			}
			var pos = new Ele.Layout("ele_listgrid_list_panel");
			
			var listCss = "ele_listgrid_list_view ele_scrollbar";
			if(!canScoll){
				listCss = "ele_listgrid_list_view_no_scoll";
			}
			
			this.listView = new Ele.VLayout(listCss);
			this.addEmpty();
			pos.add(this.listView);
			this.view.add(pos);
		};
		
		this._init();
	};
})();
(function(){
	var Audio = Ele.Audio = function(url){
		this.eleType = "media/audio";
		this.ele;
		
		Audio.prototype._init = function(){
			this.ele = document.createElement("audio");
			this.ele.src = url;
			this.ele.className = "ele_audio";
			this.ele.setAttribute("controls", "controls");
			this.ele.innerHTML = "您的浏览器不支持音频组件";
		};
		this._init();
	};
	
	var Video = Ele.Video = function(url, width, height){
		this.eleType = "media/video";
		this.ele;
		
		Video.prototype._init = function(){
			if(typeof(width) != "number"){
				width = 320;
			}
			if(typeof(height) != "number"){
				height = 240;
			}
			this.ele = document.createElement("video");
			this.ele.src = url;
			this.ele.className = "ele_video";
			this.ele.setAttribute("width", width);
			this.ele.setAttribute("height", height);
			this.ele.setAttribute("controls", "controls");
			this.ele.innerHTML = "您的浏览器不支持视频组件";
		};
		this._init();
	};
})();
(function(){
	var PopWindow = Ele.PopWindow = function(wid, hgt){
		this.eleType = "layout";
		this.ele;
		this.bgView;
		this.view;
		this.width = 208;
		this.height = 128;
		if(typeof(wid) == "number"){
			this.width = wid + 8;
		}
		if(typeof(hgt) == "number"){
			this.height = hgt + 32;
		}
		this.title;
		this.contentView;
		
		PopWindow.prototype.init = function(){
			var context = this;
			this.bgView = new Ele.Layout("ele_popwindow_bg_view");
			this.view = new Ele.Layout("ele_popwindow_view");
			this.ele = this.view.ele;
			this.view.setSize(this.width+"px", this.height+"px");
			
			var winInner = new Ele.Utils.WinInner();
			var left = (winInner.getWidth() - this.width)/2;
			var top = (winInner.getHeight() - this.height)/2;
			this.ele.style.left = left + "px";
			this.ele.style.top = top + "px";
			
			var titleView = new Ele.Layout("ele_popwindow_title_view");
			titleView.setWidth((this.width - 8) +"px");
			var titleNameView = new Ele.Layout("ele_popwindow_title_name_view");
			titleNameView.setWidth((this.width - 38)+"px");
			this.title = new Ele.Label("", "ele_popwindow_txt_title");
			titleNameView.add(this.title);
			
			var titleCloseView = new Ele.Layout("ele_popwindow_title_close_view");
			var imgClose = new Ele.Img(Ele._pathPrefix+"ele/"+Ele._skin+"/assets/64/icon_close.png", "ele_popwindow_title_icon_close");
			imgClose.ele.onclick = function(){
				context.hide();
			};
			
			var clearFloat = new Ele.Layout("ele_cl");
			titleCloseView.add(imgClose);
			titleView.add(titleNameView);
			titleView.add(titleCloseView);
			titleView.add(clearFloat);
			
			this.contentView = new Ele.Layout("ele_popwindow_content_view");
			this.contentView.setSize((this.width - 8) +"px", (this.height - 32)+"px");
			
			this.view.add(titleView);
			this.view.add(this.contentView);
			
			Ele.rootView.add(this.bgView);
			Ele.rootView.add(this.view);
		};
		
		PopWindow.prototype.setTitle = function(title){
			this.title.setText(title);
		};
		
		PopWindow.prototype.show = function(){
			if(this.bgView != null){
				this.bgView.ele.style.display = "block";
			}
			if(this.view != null){
				this.view.ele.style.display = "block";
			}
		};
		
		PopWindow.prototype.addView = function(ele){
			this.contentView.add(ele);
		};
		
		PopWindow.prototype.hide = function(){
			if(this.bgView != null){
				this.bgView.ele.style.display = "none";
			}
			if(this.view != null){
				this.view.ele.style.display = "none";
			}
		};
		
		this.init();
	};
})();
(function(){
	var Radio = Ele.Radio = function(){
		this.eleType = "input";
		this.ele;
		
		Radio.prototype._init = function(){
			this.ele = document.createElement("input");
			this.ele.type = "radio";
		};
		this._init();
	};
	var IRadio = Ele.IRadio = function(args){
		this.eleType = "layout";
		this.ele;
		this.view;
		this.icon;
		this.selectedIcon;
		
		this._able;
		this._cancel;
		this._text;
		this._value;
		this._checked = false;
		this._clickEvent = null;
		this._drawEvent = null;
		this._data = null;
		
		IRadio.prototype.click = function(){
			if(this._able){
				this.update();
			}
			if(this._clickEvent != null){
				this._clickEvent();
			}
		};
		IRadio.prototype.update = function(){
			if(this._checked){
				if(this._cancel){
					this.unChecked();
				}
				return ;
			}
			this.checked();
		};
		IRadio.prototype.onDraw = function(event){
			if(typeof(event) == "function"){
				this._drawEvent = event;
			}
		};
		IRadio.prototype.isChecked = function(){
			return this._checked;
		};
		IRadio.prototype.getValue = function(){
			return this._value;
		};
		IRadio.prototype.able = function(able){
			if(typeof(able) == "boolean"){
				this._able = able;
			}
		};
		IRadio.prototype.getText = function(){
			return this._text;
		};
		IRadio.prototype.checked = function(){
			this.ele.style.backgroundImage = "url("+this.selectedIcon+")";
			this._checked = true;
		};
		IRadio.prototype.setCancel = function(cancel){
			if(typeof(cancel) == "boolean"){
				this._cancel = cancel;
			}
		};
		IRadio.prototype.unChecked = function(){
			this.ele.style.backgroundImage = "url("+this.icon+")";
			this._checked = false;
		};
		IRadio.prototype.addClickEvent = function(event){
			this._clickEvent = event;
		};
		
		IRadio.prototype._init = function(){
			var text = "";
			var value = "";
			this.icon = Ele._pathPrefix+"ele/"+Ele._skin+"/assets/64/icon_radio_unselect.png";
			this.selectedIcon = Ele._pathPrefix+"ele/"+Ele._skin+"/assets/64/icon_radio_select.png";
			var cssName = "ele_radio";
			this._able = true;
			this._cancel = false;
			if(typeof(args) != "undefined"){
				if(typeof(args.style) == "string"){
					cssName = args.style;
				}
				if(typeof(args.cancel) == "boolean"){
					this._cancel = args.cancel;
				}
				if(typeof(args.icon) == "string"){
					this.icon = args.icon;
				}
				if(typeof(args.selectedIcon) == "string"){
					this.selectedIcon = args.selectedIcon;
				}
				if(typeof(args.text) == "string"){
					text = args.text;
				}
				if(typeof(args.value) != "undefined"){
					value = args.value;
				}
				if(typeof(args.clickEvent) == "function"){
					this._clickEvent = args.clickEvent;
				}
			}
			this._checked = false;
			this._text = text;
			this._value = value;
			this.view = new Ele.Layout(cssName);
			this.ele = this.view.ele;
			this.ele.style.backgroundImage = "url("+this.icon+")";
			this.view.setHtml(text);
			
			var context = this;
			this.ele.onclick = function(){
				context.click();
			};
			setTimeout(function() {
				if(context._drawEvent != null){
					context._drawEvent();
				}
			}, 0);
		};
		this._init();
	};
	var RadioBox = Ele.RadioBox = function(args){
		this.eleType = "layout";
		this.ele;
		this.view;
		
		this._orientation = "landscape";//竖向布局portrait
		this._clickEvent = null;
		this._updateEvent = null;
		this._radios = [];
		this._selectIndex;
		this._disable;
		
		RadioBox.prototype.getSelectedValue = function(){
			return this._radios[this._selectIndex].getValue();
		};
		RadioBox.prototype.getIndexValue = function(index){
			return this._radios[index].getValue();
		};
		RadioBox.prototype.getSelectedText = function(){
			return this._radios[this._selectIndex].getText();
		};
		RadioBox.prototype.getSelectedIndex = function(){
			return this._selectIndex;
		};
		RadioBox.prototype.disable = function(disable){
			if(typeof(disable) != "boolean"){
				return ;
			}
			if(this._disable == disable){
				return ;
			}
			for(var i in this._radios){
				this._radios[i].able(!disable);
			}
			this._disable = disable;
		};
		RadioBox.prototype.getIndexByValue = function(value){
			if(this._radios.length < 0){
				return -1;
			}
			var index = -1;
			for(var i = 0; i < this._radios.length; i ++){
				if(this._radios[i].getValue() === value){
					index = i;
					break;
				}
			}
			return index;
		};
		RadioBox.prototype.select = function(index){
			//无需更新
			if(index == this._selectIndex){
				return ;
			}
			//当前选择设置为unselect
			this._radios[this._selectIndex].unChecked();
			//选择当前
			this._radios[index].checked();
			//更新选项
			this._selectIndex = index;
			if(this._updateEvent != null){
				this._updateEvent(index);
			}
		};
		RadioBox.prototype.selectByValue = function(value){
			var index = this.getIndexByValue(value);
			//没有找到
			if(index == -1){
				return ;
			}
			this.select(index);
		};
		
		RadioBox.prototype.onItemClick = function(index){
			//成员点击事件
			if(this._clickEvent != null){
				this._clickEvent(index);
			}
			if(!this._disable){
				this.select(index);
			}
		};
		RadioBox.prototype.setItemClickEvent = function(event){
			this._clickEvent = event;
		};
		RadioBox.prototype.setUpdateEvent = function(event){
			this._updateEvent = event;
		};
		
		RadioBox.prototype._init = function(){
			this._disable = false;
			var items = [];
			if(typeof(args) != "undefined"){
				if(typeof(args.itemClick) == "function"){
					this._clickEvent = args.itemClick;
				}
				if(typeof(args.selectChange) == "function"){
					this._updateEvent = args.selectChange;
				}
				if(typeof(args.orientation) != "undefined" && args.orientation == "portrait"){
					this._orientation = "portrait";
				}
				if(typeof(args.disable) == "boolean" && args.disable){
					this._disable = args.disable;
				}
				if(Ele._isArray(args.items)){
					items = args.items;
				}
			}
			if(this._orientation == "landscape"){
				this.view = new Ele.HLayout("ele_nocrspace");
			}else{
				this.view = new Ele.VLayout("ele_nocrspace");
			}
			this.ele = this.view.ele;
			var context = this;
			if(items.length > 0){
				for(var i = 0; i < items.length; i ++){
					var iradio = new IRadio(items[i]);
					if(this._disable){
						iradio.able(false);
					}
					iradio.eleId = i;
					iradio.addClickEvent(function(){
						context.onItemClick(this.eleId);
					});
					//默认首个当选
					if(i == 0){
						this._selectIndex = 0;
						iradio.checked();
					}
					this._radios.push(iradio);
					this.view.add(iradio, {padding:"0 0 0 8px"});
					
				}
			}
		};
		this._init();
	};
})();
(function(){
	var SearchBox = Ele.SearchBox = function(args){
		this.eleType = "layout";
		this.ele;
		this.view;
		this.onSearchEvent = function(){};
		this.tb;
		
		SearchBox.prototype.setOnSearch = function(onSearch){
			if(typeof(onSearch) == "function"){
				this.onSearchEvent = onSearch;
			}
		};
		
		SearchBox.prototype._init = function(){
			this.view = new Ele.Layout("ele_searchbox_view"); 
			this.ele = this.view.ele;
			
			this.tb = new Ele.TextBox({style:"ele_searchbox_style"});
			this.tb.type = "text";
			this.tb.className = "ele_edittext_style";
			if(typeof(args) == "object"){
				if(typeof(args.hint) != "undefined"){
					this.tb.ele.placeholder = args.hint;
				}
				if(typeof(args.onSearch) == "function"){
					this.onSearchEvent = args.onSearch;
				}
			}
			var img = new Ele.Img(Ele._pathPrefix+"ele/"+Ele._skin+"/assets/64/icon_search.png","ele_searchbox_icon");
			this.view.add(this.tb);
			this.view.add(img);
			var context = this;
			this.ele.onkeydown = function(e){
				if (event.keyCode == 13){
					event.returnValue=false;
					event.cancel = true;
					context.onSearchEvent(context.tb.ele.value);
				}
			};
			img.ele.onclick = function(){
				context.onSearchEvent(context.tb.ele.value);
			};
		};
		
		this._init();
	};
})();
(function(){
	var SelectBox = Ele.SelectBox = function(args){
		this.eleType = "layout";
		this.ele;
		this.view;
		this.hintView;
		this.edit;
		this.windowType;
		this.listView;
		this.masking;
		this.filter;
		this.optionList;
		this.optionController;
		this.filterController;
		this.position;
		this.offset;
		this.count;
		
		this._disable;
		this._options = [];
		this._selectIndex = -1;
		this._itemClickEvent = null;
		this._updateEvent = null;
		this._filterSearchEvent = null;
		this._onErrorResponse = null;
		this._onFilterErrorResponse = null;
		this._onDataLoad = null;
		
		SelectBox.prototype.setWindowOffset = function(size){
			if(this.windowType){
				this.offset = size;
			}
		};
		
		SelectBox.prototype.setOnDataLoad = function(event){
			if(typeof(event) == "function"){
				this._onDataLoad = event;
			}
		};
		SelectBox.prototype.setOnItemClick = function(event){
			if(typeof(event) == "function"){
				this._itemClickEvent = event;
			}
		};
		SelectBox.prototype.setOnSelectChange = function(event){
			if(typeof(event) == "function"){
				this._updateEvent = event;
			}
		};
		SelectBox.prototype.setOnFilterSearch = function(event){
			if(typeof(event) == "function"){
				this._filterSearchEvent = event;
			}
		};
		SelectBox.prototype.addOptionValue = function(text, value){
			var option = new Option(text, value);
			this.addOption(option);
		};
		SelectBox.prototype.addOption = function(option){
			if(!(option instanceof Option)){
				return ;
			}
			var context = this;
			this.optionList.add(new Ele.Layout("ele_selectbox_option_divider"));
			option.eleId = this.count;
			option.setClickEvent(function(){
				context._onItemClick(this.eleId);
			});
			this._options.push(option);
			this.optionList.add(option);
			this.count ++;
		};
		SelectBox.prototype.setOptions = function(items){
			this.optionList.clear();
			this._options = [];
			this._selectIndex = -1;
			this.count = 0;
			this.edit.setValue("");
			var context = this;
			var empty = new Option("--请选择--", -1);
			empty.eleId = -1;
			empty.setClickEvent(function(){
				context._onItemClick(this.eleId);
			});
			this.optionList.add(empty);
			
			if(items.length > 0){
				for(var i = 0; i < items.length; i ++){
					var option = new Option(items[i].text, items[i].value);
					option.eleId = this.count;
					option.setClickEvent(function(){
						context._onItemClick(this.eleId);
					});
					this._options.push(option);
					this.optionList.add(new Ele.Layout("ele_selectbox_option_divider"));
					this.optionList.add(option);
					this.count ++;
				}
			}
			if(this._onDataLoad != null){
				this._onDataLoad();
			}
		};
		SelectBox.prototype.loadFilterDataSourcesUrl = function(url, keyValue, method, funError){
			if(typeof(funError) == "function"){
				this._onFilterErrorResponse = funError;
			}
			if(typeof(keyValue) == "string" && keyValue.trim() != ""){
				this.filterController.setParameter("keyvalue="+keyValue);
			}
			if(typeof(method) != "undefined" && method != "" && method != null){
				this.filterController.setMethod(method);
			}else{
				this.filterController.setMethod("GET");
			}
			this.filterController.loadData(url);
		};
		
		SelectBox.prototype.loadDataSourcesUrl = function(url, method, funError){
			if(typeof(funError) == "function"){
				this._onErrorResponse = funError;
			}
			if(typeof(method) != "undefined" && method != "" && method != null){
				this.optionController.setMethod(method);
			}else{
				this.optionController.setMethod("GET");
			}
			this.optionController.loadData(url);
		};
		SelectBox.prototype.setValue = function(value){
			if(typeof(value) == "undefined"){
				return ;
			}
			var vIndex = -1;
			for(var index = 0; index < this._options.length; index ++){
				if(this._options[index].value == value){
					vIndex = index;
					break;
				}
			}
			this.selectIndex(vIndex);
		};
		SelectBox.prototype.reset = function(){
			this.setFilterData([]);
			if(this._selectIndex > -1){
				this._options[this._selectIndex].clearSelectedStyle();
			}
			this._selectIndex = -1;
			this.clearErrorStyle();
			this.edit.setValue("");
			this.hintView.setHtml("请选择");
		};
		SelectBox.prototype.selectIndex = function(index){
			//越界角标
			if(index < -1 || index >= this._options.length){
				return ;
			}
			if(index == -1){
				this.reset();
				if(this._updateEvent != null){
					this._updateEvent(index);
				}
				return ;
			}
			
			//防止智推选择同选项不更新文本
			this.edit.setValue(this._options[index].text);
			//与当前选择角标选择一致
			if(this._selectIndex == index){
				return ;
			}
			
			if(this._selectIndex > -1){
				this._options[this._selectIndex].clearSelectedStyle();
			}
			this._options[index].setSelectedStyle();
			this._selectIndex = index;
			this.hintView.setHtml("已选择");
			if(this._updateEvent != null){
				this._updateEvent(index);
			}
		};
		
		SelectBox.prototype.getValue = function(){
			if(this._selectIndex < 0){
				return "";
			}
			return this._options[this._selectIndex].value;
		};
		
		SelectBox.prototype.showErrorStyle = function(){
			this.ele.className = "ele_selectbox_style_error";
		};
		SelectBox.prototype.clearErrorStyle = function(){
			this.ele.className = "ele_selectbox";
		};
		SelectBox.prototype.expend = function(){
			if(this.windowType){
				this.position.inBottomLeft(this.view.ele);
				if(this.offset != null && this.offset instanceof Ele.Utils.Size){
					this.position.setOffset(this.offset);
				}
				this.masking.setContent(this.listView, this.position);
				this.masking.showMasking();
				var context = this;
				this.masking.setHiddenHandler(function(){
					context._onBlur();
				});
				return;
			}
			this.masking.setContentNone();
			this.masking.showMasking();
			var context = this;
			this.masking.setHiddenHandler(function(){
				context._onBlur();
			});
			this.listView.ele.style.display = "block";
		};
		
		SelectBox.prototype.hide = function (){
			if(this.windowType){
				this.masking.hideMasking();
				return ;
			}
			this.listView.ele.style.display = "none";
			this.masking.hideMasking();
		};
		
		SelectBox.prototype.setFilterData = function (data){
			if(!Ele._isArray(data)){
				return ;
			}
			this.filter.clear();
			if(data.length < 1){
				var empty = new Ele.Layout("ele_selectbox_filter_empty");
				empty.setHtml("暂无推荐数据");
				this.filter.add(empty);
				return ;
			}
			var context = this;
			for(var i in data){
				var foption = new FilterOption(data[i].text, data[i].value, data[i].filterView);
				foption.setClickEvent(function(){
					context._onFilterItemClick(this.value);
				});
				this.filter.add(foption);
				if(i < data.length - 1){
					var fdivier = new Ele.Layout("ele_selectbox_option_divider");
					this.filter.add(fdivier);
				}
			}
		};
		SelectBox.prototype.setDisable = function (disable){
			if(typeof(disable) == "boolean"){
				this._disable = disable;
				this.edit.ele.readOnly = disable;
			}
		};
		SelectBox.prototype._onFilterDataResponse = function(dataSources){
			if(!Ele._isArray(dataSources)){
				this.setFilterData([]);
				return ;
			}
			var fitems = [];
			for(var i in dataSources){
				var filterView = new Ele.OptionFilter();
				if(typeof(dataSources[i].filter) == "string"){
					if(dataSources[i].filter.indexOf(";") > -1){
						var farr = dataSources[i].filter.split(";");
						for(var f in farr){
							if(farr[f].length < 1){
								continue;
							}
							if(farr[f].charAt(0) == "@"){
								filterView.appendNormal(farr[f].substring(1, farr[f].length));
								continue;
							}
							if(farr[f].charAt(0) == "#"){
								filterView.appendFilter(farr[f].substring(1, farr[f].length));
								continue;
							}
						}
					}
				}
				var item = {text:dataSources[i].text, value:dataSources[i].value,filterView:filterView};
				
				fitems.push(item);
			}
			this.setFilterData(fitems);
		};
		SelectBox.prototype._onDataResponse = function(dataSources){
			this.setOptions(dataSources);
		};
		SelectBox.prototype._onFilterItemClick = function (value){
			this.ele.className = "ele_selectbox";
			this.hide();
			this.setValue(value);
		};
		SelectBox.prototype._onFilterKey = function(){
			if(this._filterSearchEvent != null){
				this._filterSearchEvent(this.edit.getValue());
			}
		};
		SelectBox.prototype._onItemClick = function(index){
			if(this._itemClickEvent != null){
				this._itemClickEvent(index);
			}
			this.ele.className = "ele_selectbox";
			this.hide();
			this.selectIndex(index);
		};
		SelectBox.prototype._onBlur = function(){
			this.ele.className = "ele_selectbox";
			if(this._selectIndex > -1){
				this.edit.setValue(this._options[this._selectIndex].text);
			}else{
				this.edit.setValue("");
			}
			this.setFilterData([]);
			//非窗口类型需要关闭本地窗口
			if(!this.windowType){
				this.hide();
			}
		};
		
		SelectBox.prototype._onFocus = function(){
			if(this._disable){
				this.ele.className = "ele_selectbox_disable_focus";
				return ;
			}else{
				this.ele.className = "ele_selectbox_focus";
			}
			if(this._selectIndex > -1){
				this.edit.setValue(this._options[this._selectIndex].text);
			}else{
				this.edit.setValue("");
			}
			this.setFilterData([]);
			this.expend();
		};
		
		SelectBox.prototype._init = function(){
			this.view = new Ele.Layout("ele_selectbox");
			this.ele = this.view.ele;
			this._disable = false;
			this.windowType = false;
			this.count = 0;
			var items = [];
			var context = this;
			this.masking = Ele.masking;
			if(typeof(args) == "object"){
				if(typeof(args.style) != "undefined"){
					this.ele.className = args.style;
				}
				if(typeof(args.disable) == "boolean" && args.disable){
					this._disable = args.disable;
				}
				if(Ele._isArray(args.items)){
					items = args.items;
				}
				if(typeof(args.onItemClick) == "function"){
					this._itemClickEvent = args.onItemClick;
				}
				if(typeof(args.selectChange) == "function"){
					this._updateEvent = args.selectChange;
				}
				if(typeof(args.filterSearch) == "function"){
					this._filterSearchEvent = args.filterSearch;
				}
				if(typeof(args.windowType) == "boolean" && args.windowType){
					this.windowType = true;
				}
			}
			if(this.windowType){
				this.listView = new Ele.Layout("ele_selectbox_list_view_wt ele_scrollbar");
				this.position = new Ele.Utils.Position();
			}else{
				this.listView = new Ele.Layout("ele_selectbox_list_view ele_scrollbar");
				this.listView.ele.style.zIndex = this.masking.maxZIndex + 1;
				this.view.add(this.listView);
			}
			
			this.filter = new Ele.Layout("ele_selectbox_filter");
			this.setFilterData([]);
			this.listView.add(this.filter);
			var divider = new Ele.Layout("ele_selectbox_divider");
			this.listView.add(divider);
			this.optionList = new Ele.Layout("ele_selectbox_option");
			this.listView.add(this.optionList);
			
			var contentView = new Ele.HLayout("ele_selectbox_panle");
			contentView.ele.onclick = function(){
				context._onFocus();
			};
			
			this.hintView = new Ele.Layout("ele_selectbox_select_view");
			this.hintView.setHtml("请选择");
			contentView.add(this.hintView);
			this.edit = new Ele.TextBox({style:"ele_selectbox_input_style"});
			this.edit.ele.onkeyup = function(e){
				context._onFilterKey();
			};
			if(this._disable){
				this.edit.ele.readOnly = true;
			}
			contentView.add(this.edit);
			var iconView = new Ele.Layout("ele_selectbox_icon_view");
			var icon = new Ele.Img(Ele._pathPrefix+"ele/"+Ele._skin+"/assets/96/icon_down.png","ele_selectbox_icon");
			iconView.add(icon);
			contentView.add(iconView);
			
			this.view.add(contentView);
			
			this.setOptions(items);
			
			this.optionController = new Ele.Controllers.BaseController({
				loadHandler:function(data){
					context._onDataResponse(data);
				},
				errorHandler:function(error){
					if(context._onErrorResponse != null){
						context._onErrorResponse(error);
					}
				}
			});
			this.filterController = new Ele.Controllers.BaseController({
				loadHandler:function(data){
					context._onFilterDataResponse(data);
				},
				errorHandler:function(error){
					if(context._onFilterErrorResponse != null){
						context._onFilterErrorResponse(error);
					}
				}
			});
		};
		this._init();
	};
	
	var Option = Ele.Option = function(text, value){
		this.eleType = "layout";
		this.ele;
		this.view;
		this.text;
		this.value;
		this._clickEvent = null;
		
		Option.prototype.setClickEvent = function(event){
			if(typeof(event) == "function"){
				this._clickEvent = event;
			}
		};
		Option.prototype.setSelectedStyle = function(){
			this.ele.className = "ele_selectbox_option_item ele_selectbox_option_item_selected";
		};
		Option.prototype.clearSelectedStyle = function(){
			this.ele.className = "ele_selectbox_option_item";
		};
		
		Option.prototype._onClick = function(){
			if(this._clickEvent != null){
				this._clickEvent();
			}
		};
		
		Option.prototype._init = function(){
			this.text = "";
			this.value = "";
			if(typeof(text) == "string"){
				this.text = text;
			}
			if(typeof(value) != "undefined"){
				this.value = value;
			}
			this.view = new Ele.Layout("ele_selectbox_option_item");
			this.ele = this.view.ele;
			
			var context = this;
			this.ele.onclick = function(){
				context._onClick();
			};
			
			this.view.setHtml(this.text);
		};
		
		this._init();
	};
	
	var OptionFilter = Ele.OptionFilter = function(){
		this.eleType = "layout";
		this.ele;
		this.view;
		
		OptionFilter.prototype.appendFilter = function(text){
			if(typeof(text) != "string"){
				return ;
			}
			var lable = new Ele.Label(text, "ele_selectbox_filter_txt_filter");
			this.view.add(lable);
		};
		OptionFilter.prototype.appendNormal = function(text){
			if(typeof(text) != "string"){
				return ;
			}
			var lable = new Ele.Label(text, "ele_selectbox_filter_txt_normal");
			this.view.add(lable);
		};
		
		OptionFilter.prototype._init = function(){
			this.view = new Ele.Layout("ele_selectbox_filter_right");
			this.ele = this.view.ele;
			this.view.setAlign("right");
		};
		
		this._init();
	};
	
	var FilterOption = function(text, value, fview){
		this.eleType = "layout";
		this.ele;
		this.view;
		this.text;
		this.value;
		this._clickEvent = null;
		
		FilterOption.prototype.setClickEvent = function(event){
			if(typeof(event) == "function"){
				this._clickEvent = event;
			}
		};
		
		FilterOption.prototype._onClick = function(){
			if(this._clickEvent != null){
				this._clickEvent();
			}
		};
		
		FilterOption.prototype._init = function(){
			this.text = "";
			this.value = "";
			if(typeof(text) == "string"){
				this.text = text;
			}
			if(typeof(value) != "undefined"){
				this.value = value;
			}
			if(typeof(fview) != "object" || !(fview instanceof OptionFilter)){
				fview = new Ele.Label("");
			}
			this.view = new Ele.HLayout("ele_selectbox_filter_item");
			this.ele = this.view.ele;
			
			var context = this;
			this.ele.onclick = function(){
				context._onClick();
			};
			
			var left = new Ele.Layout("ele_selectbox_filter_left");
			left.setHtml(this.text);
			
			this.view.add(left,{width:"50%"});
			this.view.add(fview,{width:"50%"});
		};
		
		this._init();
	};
	
})();
(function(){
	var TextArea = Ele.TextArea = function(args){
		this.eleType = "textarea";
		this.ele;
		
		TextArea.prototype.setHint = function(hint){
			this.ele.placeholder = hint;
		};
		TextArea.prototype.setValue = function(value){
			this.ele.value = value;
		};
		
		TextArea.prototype.getValue = function(){
			return this.ele.value;
		};
		TextArea.prototype.readOnly = function(readOnly){
			if(typeof(readOnly) == "boolean" && readOnly){
				this.ele.readOnly = true;
				this.ele.className = "ele_textarea_style_disable";
			}else{
				this.ele.readOnly = false;
				this.ele.className = "ele_textarea_style";
			}
		};
		
		TextArea.prototype.showErrorStyle = function(){
			this.ele.className = "ele_textarea_style_error";
		};
		TextArea.prototype.clearErrorStyle = function(){
			if(this.ele.readOnly){
				this.ele.className = "ele_textarea_style_disable";
				return ;
			}
			this.ele.className = "ele_textarea_style";
		};
		
		TextArea.prototype._init = function(){
			this.ele = document.createElement("textarea");
			this.ele.className = "ele_textarea_style";
			if(typeof(args) == "object"){
				if(typeof(args.style) == "string"){
					this.ele.className = args.style;
				}
				if(typeof(args.hint) == "string"){
					this.ele.placeholder = args.hint;
				}
				if(typeof(args.readOnly) == "boolean" && args.readOnly){
					this.ele.readOnly = args.readOnly;
					this.ele.className = "ele_textarea_style_disable";
				}
			}
		};
		this._init();
	};
})();
(function(){
	var TextBox = Ele.TextBox = function(args){
		this.eleType = "input";
		this.ele;
		
		TextBox.prototype.setHint = function(hint){
			this.ele.placeholder = hint;
		};
		
		TextBox.prototype.setValue = function(value){
			this.ele.value = value;
		};
		
		TextBox.prototype.getValue = function(){
			return this.ele.value;
		};
		TextBox.prototype.readOnly = function(readOnly){
			if(typeof(readOnly) == "boolean" && readOnly){
				this.ele.readOnly = true;
				this.ele.className = "ele_edittext_style_disable";
			}else{
				this.ele.readOnly = false;
				this.ele.className = "ele_edittext_style";
			}
		};
		
		TextBox.prototype.showErrorStyle = function(){
			this.ele.className = "ele_edittext_style_error";
		};
		TextBox.prototype.clearErrorStyle = function(){
			if(this.ele.readOnly){
				this.ele.className = "ele_edittext_style_disable";
				return ;
			}
			this.ele.className = "ele_edittext_style";
		};
		
		TextBox.prototype._init = function(){
			this.ele = document.createElement("input");
			this.ele.type = "text";
			this.ele.className = "ele_edittext_style";
			if(typeof(args) == "object"){
				if(typeof(args.style) != "undefined"){
					this.ele.className = args.style;
				}
				if(typeof(args.hint) != "undefined"){
					this.ele.placeholder = args.hint;
				}
				if(typeof(args.readOnly) == "boolean" && args.readOnly){
					this.ele.readOnly = args.readOnly;
					this.ele.className = "ele_edittext_style_disable";
				}
			}
		};
		this._init();
	};
})();
(function(){
	var TreeNode = Ele.TreeNode = function(args) {
		this.eleType = "layout";
		this.ele;
		this.view;
		this.listView;
		this.isExpand = false;
		this.onClickHandler;
		this.onItemClickHandler;
		this.count = 0;
		this.selected = 0;
		this.iconStatus;
		this.data = null;
		
		TreeNode.prototype.add = function(args){
			if(this.count == 0){
				this.clear();
			}
			var cellStyle = " ele_treenode_double";
			if(this.count % 2 == 0){
				cellStyle = " ele_treenode_single";
			}
			if(typeof(args.selected) != "undefined"){
				if(args.selected){
					cellStyle += " ele_treenode_selected";
					this.selected = args.id;
				}
			}
			var item = new Ele.Layout("ele_treenode_item_view"+cellStyle);
			item.setAlign("left");
			var mgl = " ele_ml10";
			if(typeof(args.icon) != "undefined"){
				var icItem = new Ele.Img(args.icon,"ele_treenode_item_icon ele_ml10");
				item.add(icItem);
				mgl = " ele_ml5";
			}
			var txtItem = new Ele.Label("unknow","ele_treenode_item_txt"+mgl);
			if(typeof(args.text) != "undefined"){
				txtItem.setText(args.text);
			}
			item.add(txtItem);
			
			var context = this;
			item.ele.onclick = function(){
				if(context.onItemClickHandler != null){
					if(typeof(args.data) != "undefined"){
						context.onItemClickHandler(args.data);
					}else{
						context.onItemClickHandler();
					}
				}
			};
			item.ele.onmouseover = function(){
				if(args.selected){
					return ;
				}
				this.className = "ele_treenode_item_view ele_treenode_over";
			};
			item.ele.onmouseout = function(){
				if(args.selected){
					return ;
				}
				this.className = "ele_treenode_item_view"+cellStyle;
			};
			
			if(this.count > 0){
				var divider = new Ele.Layout("ele_treenode_divider");
				this.listView.add(divider);
			}
			
			this.listView.add(item);
			this.count ++;
		};
		TreeNode.prototype.close = function(){
			this.listView.ele.style.display="none";
			this.iconStatus.ele.src = Ele._pathPrefix+"ele/"+Ele._skin+"/assets/64/icon_list_right.png";
			this.isExpand = false;
		};
		TreeNode.prototype.expand = function(){
			this.listView.ele.style.display="block";
			this.iconStatus.ele.src = Ele._pathPrefix+"ele/"+Ele._skin+"/assets/64/icon_list_down.png";
			this.isExpand = true;
		};
		TreeNode.prototype.clear = function(){
			this.listView.setHtml("");
			this.count = 0;
		};
		TreeNode.prototype._initListView = function(){
			var empty = new Ele.Label("无数据","ele_treenode_empty_txt ele_llh30");
			this.listView.add(empty);
		};
		TreeNode.prototype._init = function(){
			this.view = new Ele.Layout();
			this.view.setHeight("auto");
			this.ele = this.view.ele;
			var title = new Ele.Layout("ele_treenode_title_view");
			//状态
			this.iconStatus = new Ele.Img(Ele._pathPrefix+"ele/"+Ele._skin+"/assets/64/icon_list_right.png","ele_treenode_status_view");
			title.add(this.iconStatus);
			
			var txtTitle = new Ele.Label("Root","ele_treenode_title_txt ele_ml5");
			if(typeof(args) == "object"){
				if(typeof(args.width) != "undefined"){
					this.view.setWidth(args.width);
				}
				if(typeof(args.icon) != "undefined"){
					var iconMenu = new Ele.Img(args.icon,"ele_treenode_icon ele_ml5");
					title.add(iconMenu);
				}
				if(typeof(args.title) != "undefined"){
					txtTitle.setText(args.title);
				}
				if(typeof(args.data) != "undefined"){
					this.data = args.data;
				}
				if(typeof(args.onClick) == "function"){
					this.onClickHandler = args.onClick;
				}
				if(typeof(args.onItemClick) == "function"){
					this.onItemClickHandler = args.onItemClick;
				}
			}
			
			title.add(txtTitle);
			
			var context = this;
			//注册事件
			title.ele.onclick = function(){
				if(context.isExpand){
					context.close();
				}else{
					context.expand();
				}
				if(context.onClickHandler != null){
					if(context.data != null){
						context.onClickHandler(context.data);
					}else{
						context.onClickHandler(context.isExpand);
					}
				}
			};
			this.listView = new Ele.Layout();
			this.listView.setHeight("auto");
			this.listView.setAlign("center");
			this.close();
			
			//初始化list
			this._initListView();
			
			this.view.add(title);
			this.view.add(this.listView);
		};
		this._init();
	};
})();
// var areaLine = new Ele.Charts.AreaLine({padding:40,showTitle:true});
// var data = {
// 	title:"线路统计图Ab123"
// 	,max:1000
// 	,X:[{text:"AAA",fieldName:"a"},{text:"B",fieldName:"b"},{text:"C",fieldName:"c"},{text:"D",fieldName:"d"},{text:"E",fieldName:"e"}]
// 	,Y:["0","200","400","600","800","1000"]
// 	,nodes:[{id:1,name:"分支线",color:"#41BABD", areaColor:"rgba(94,204,204, 0.6)"},{id:2,name:"总线Ab123",color:"#b502a4",areaColor:"rgba(211,0,201, 0.6)"}]
// 	,values:[{lineId:1,value:{a:{key:"", value:200},b:{key:"600", value:600},c:{key:"300", value:300},d:{key:"400", value:400},e:{key:"600", value:600}}},{lineId:2,value:{a:{key:"", value:30},b:{key:"90", value:90},c:{key:"50", value:50},d:{key:"60", value:60},e:{key:"80", value:80}}}]
// 	};
// areaLine.draw(data);
(function() {
	var AreaLine = Ele.Charts.AreaLine = function(opts) {
		this.eleType = "canvas";
		this.ele;
		this.ctx;
		this.width = 750; //默认宽度
		this.height = 300; //默认高度
		this.background = "#FFFFFF"; //默认背景
		this.border = "1px #EEEEEE solid"; //默认边框
		this.titleColor = "#333333"; //默认标题颜色
		this.textColor = "#4C4C4C"; //默认文本颜色
		this.padding = 20; //四周边距
		this.edgeLineColor = "#C4C4C4"; //轮廓线条颜色
		this.edgeLineHintColor = "rgba(221,221,221, 0.28)"; //轮廓线条颜色
		this.edgelineWidth = 1; //轮廓线条宽度
		this.edgeLeftSpacing = 40; //默认左侧线条左侧间距
		this.edgeBottomSpacing = 16; //默认底部线条地侧间距
		this.showTitle = false;
		this.itemColor = "#4FDBDB"; //节点颜色a0e0a3
		this.itemlineWidth = 1; //节点线条宽度
		this.itemPointWeight = 4; //节点半径
		this.offset = 0.4; //偏移量 0-1之间 落差百分比
		this.data;
		this.filter = new Ele.Utils.Filter();
		
		this._node_lenght = 10;//节点线条长度
		this._title_height = 36;//标题布局高度
		this._rectW = 16;//方形宽度
		this._rectH = 16;//方形高度
		this._txt_h_offset = 6;//字体左右对齐偏移量
		
		if(Ele._skin == "skin-black"){
			this.background = "#444444";
			this.border = "1px #555555 solid";
			this.titleColor = "#FFFFFF";
			this.textColor = "#F5F5F5";
			this.edgeLineColor = "#F5F5F5";
			this.edgeLineHintColor = "rgba(237,237,237, 0.28)";
		}

		AreaLine.prototype._init = function() {
			if (typeof(opts) != "object") {
				return;
			}
			if (typeof(opts.width) == "number") {
				this.width = opts.width;
			}
			if (typeof(opts.height) == "number") {
				this.height = opts.height;
			}
			if (typeof(opts.background) == "string") {
				this.background = opts.background;
			}
			if (typeof(opts.border) == "string") {
				this.border = opts.border;
			}
			if (typeof(opts.padding) == "number") {
				this.padding = opts.padding;
			}
			if (typeof(opts.edgeLineColor) == "string") {
				this.edgeLineColor = opts.edgeLineColor;
			}
			if (typeof(opts.edgeLineHintColor) == "string") {
				this.edgeLineHintColor = opts.edgeLineHintColor;
			}
			if (typeof(opts.edgelineWidth) == "number") {
				this.edgelineWidth = opts.edgelineWidth;
			}
			if (typeof(opts.edgeLeftSpacing) == "number") {
				this.edgeLeftSpacing = opts.edgeLeftSpacing;
			}
			if (typeof(opts.edgeBottomSpacing) == "number") {
				this.edgeBottomSpacing = opts.edgeBottomSpacing;
			}
			if (typeof(opts.showTitle) == "boolean") {
				this.showTitle = opts.showTitle;
			}
			if (typeof(opts.itemColor) == "string") {
				this.itemColor = opts.itemColor;
			}
			if (typeof(opts.itemlineWidth) == "number") {
				this.itemlineWidth = opts.itemlineWidth;
			}
			if (typeof(opts.itemPointWeight) == "number") {
				this.itemPointWeight = opts.itemPointWeight;
			}
			if (typeof(opts.offset) == "number") {
				this.offset = opts.offset;
			}
		};
		AreaLine.prototype._create = function() {
			this._init();

			this.ele = document.createElement("canvas");

			this.ele.width = this.width;
			this.ele.height = this.height;
			this.ele.style.background = this.background;
			this.ele.style.border = this.border;
			this.ctx = this.ele.getContext("2d");
		};

		AreaLine.prototype.setContainerById = function(id) {
			document.getElementById(id).appendChild(this.ele);
		};
		//画区域图
		AreaLine.prototype.draw = function(data) {
			if(typeof(data) != "object"){
				return ;
			}
			if(typeof(data.X) != "object"){
				return ;
			}
			if(typeof(data.Y) != "object"){
				return ;
			}
			if(typeof(data.values) != "object"){
				return ;
			}
			this.data = data;
			
			var vheight = this.height - (this.padding * 2) - this.edgeBottomSpacing - this._node_lenght;
			var hwidth = this.width - (this.padding * 2) - this.edgeLeftSpacing - this._node_lenght;
			var top = this.padding;
			if(this.showTitle){
				vheight -= this._title_height;
				top = this.padding + this._title_height;
				this.drawTitleText();
			}
			var nodeHeight = vheight/(data.Y.length - 1);
			var vNodeX = this.padding + this._node_lenght + this.edgeLeftSpacing;
			var nodeWidth = hwidth/(data.X.length - 1);
			var hNodeY =  this.height - this.padding - this._node_lenght - this.edgeBottomSpacing;
			
			this.drawEdgeLine(nodeHeight, vNodeX, nodeWidth, hNodeY, top);
			this.drawEdgeText(nodeHeight, vNodeX, nodeWidth, hNodeY, top);
			this.drawData(vheight, nodeHeight, vNodeX, nodeWidth, hNodeY);
			
		};
		AreaLine.prototype.drawData = function(vheight, nodeHeight, vNodeX, nodeWidth, hNodeY) {
			var values = this.data.values;
			if(typeof(this.data.nodes) == "undefined"){
				for(var i = 0; i < values.length; i ++){
					var value = values[i].value;
					var arr = [];
					for(var j = 0; j < this.data.X.length; j ++){
						//判断是否存在属性
						if(this.data.X[j].fieldName in value){
							arr.push(value[this.data.X[j].fieldName])
						}
					}
					this.drawArrayData(vheight, nodeHeight, vNodeX, nodeWidth, hNodeY, arr, this.itemColor);
				}
				return ;
			}
			var nodes = this.data.nodes;
			for(var i = 0; i < values.length; i ++){
				var value = values[i].value;
				var arr = [];
				for(var j = 0; j < this.data.X.length; j ++){
					//判断是否存在属性
					if(this.data.X[j].fieldName in value){
						arr.push(value[this.data.X[j].fieldName]);
					}
				}
				var lineId = values[i].lineId;
				var node = null;
				for(var k = 0; k < nodes.length; k ++){
					if(typeof(nodes[k].id) != "number"){
						continue;
					}
					if(nodes[k].id == lineId){
						node = nodes[k];
						break;
					}
				}
				if(node == null || typeof(node.color) != "string"){
					this.drawArrayData(vheight, nodeHeight, vNodeX, nodeWidth, hNodeY, arr, this.itemColor, this.edgeLineColor);
				}else{
					var areaColor = this.edgeLineHintColor;
					if(typeof(node.areaColor) == "string"){
						areaColor = node.areaColor;
					}
					this.drawArrayData(vheight, nodeHeight, vNodeX, nodeWidth, hNodeY, arr, node.color, areaColor);
				}
			}
		};
		AreaLine.prototype.drawArrayData = function(vheight, nodeHeight, vNodeX, nodeWidth, hNodeY, data, color, areaColor) {
			if(typeof(this.data.max) != "number"){
				return ;
			}
			var len = data.length
			this.ctx.font = "12px Microsoft YaHei";
			this.ctx.fillStyle = color;
			this.ctx.strokeStyle = color;
			this.ctx.lineWidth = this.itemlineWidth;
			this.ctx.beginPath();
			
			var points = [];
			
			//横向刻度值
			for (var i = 0; i < len; i++) {
				var x = vNodeX + (i * nodeWidth);
				var val = new Number(data[i].value);
				if (val > this.data.max) {
					val = this.data.max;
				}
				var y = hNodeY - ((vheight * val) / this.data.max);
				
				//小圆点
				this.ctx.beginPath();
				this.ctx.arc(x, y, this.itemPointWeight, 0, Math.PI * 2);
				this.ctx.fill();
				this.ctx.closePath();
				
				//数据文本
				this.ctx.beginPath();
				this.ctx.fillText(data[i].key, x + this._txt_h_offset, y);
				this.ctx.closePath();
				this.ctx.stroke();
			
				points.push({x:x,y:y})
			}
			this.drawQuadraticCurvePx(points, vNodeX, hNodeY, areaColor);
		};
		
		AreaLine.prototype.drawEdgeLine = function(nodeHeight,vNodeX, nodeWidth, hNodeY, top) {
			this.ctx.strokeStyle = this.edgeLineColor;
			this.ctx.lineWidth = this.edgelineWidth; //设置线宽
			this.ctx.beginPath();
			
			//竖线条
			this.drawLinePx(vNodeX, top, vNodeX, this.height - this.padding - this.edgeBottomSpacing);
			//竖向刻度标
			var left = this.padding+this.edgeLeftSpacing;
			for (var i = 0; i < this.data.Y.length - 1; i++) {
				var y = i * nodeHeight + top;
				this.drawLinePx(vNodeX, y, left, y);
				//水平线
				this.ctx.stroke();
				this.ctx.beginPath();
				this.ctx.strokeStyle = this.edgeLineHintColor;
				this.drawLinePx(vNodeX, y, this.width - this.padding, y);
				this.ctx.stroke();
				this.ctx.beginPath();
				this.ctx.strokeStyle = this.edgeLineColor;
			}
			this.drawLinePx(vNodeX - this._node_lenght, hNodeY, this.width - this.padding, hNodeY);
			//横向刻度标
			for (var i = 0; i < this.data.X.length; i++) {
				var x = i * nodeWidth + vNodeX;
				this.drawLinePx(x, hNodeY, x, hNodeY+this._node_lenght);
			}
			this.ctx.closePath();
			this.ctx.stroke();
		};
		AreaLine.prototype.drawEdgeText = function(nodeHeight, vNodeX, nodeWidth, hNodeY, top) {
			//竖向刻度值
			this.ctx.fillStyle = this.textColor;
			this.ctx.textBaseline = 'top';
			this.ctx.font = "12px Microsoft YaHei";
			for (var i = 0; i < this.data.Y.length; i++) {
				var y = top + ((this.data.Y.length - 1- i) * nodeHeight);
				this.ctx.fillText(this.data.Y[i], this.padding, y);
			}
			//横向刻度值
			for (var i = 0; i < this.data.X.length; i++) {
				var x = i * nodeWidth + vNodeX;
				this.ctx.textAlign = 'right';
				this.ctx.fillText(this.data.X[i].text, x, hNodeY+this._node_lenght);
				this.ctx.textAlign = 'left';
			}
		};
		AreaLine.prototype.drawTitleText = function() {
			if(typeof(this.data.nodes) == "undefined"){
				return ;
			}
			this.ctx.fillStyle = this.titleColor;
			this.ctx.font = "13px Microsoft YaHei";
			this.ctx.textBaseline = 'bottom';
			// this.ctx.shadowBlur = 4;
			// this.ctx.shadowOffsetX = 1;
			// this.ctx.shadowOffsetY = 1;
			// this.ctx.shadowColor = "#FFFFFF";
			this.ctx.beginPath();
			this.ctx.fillText(this.data.title, this.padding, this.padding);
			
			var x =  this.padding + this.strLen(this.data.title) + 32;
			var y = this.padding;
			
			var nodes = this.data.nodes;
			for(var i = 0; i < nodes.length; i ++){
				if(typeof(nodes[i].color) != "string"){
					continue;
				}
				var name = "";
				if(typeof(nodes[i].name) == "string"){
					name = nodes[i].name;
				}
				this.ctx.fillStyle = nodes[i].color;
				this.ctx.strokeStyle = nodes[i].color;
				this.ctx.beginPath();
				//w*h正方形
				this.ctx.fillRect(x, y - this._rectH, this._rectW, this._rectH);
				x += 24;//16+8
				this.ctx.fillText(name, x, y);
				x += this.strLen(name) + 13;
				this.ctx.closePath();
				this.ctx.fill();
			}
			
		};
		AreaLine.prototype.drawLinePx = function(sx, sy, ex, ey) {
			this.ctx.moveTo(sx, sy);
			this.ctx.lineTo(ex, ey);
		};
		AreaLine.prototype.drawQuadraticCurvePx = function(points, vNodeX, hNodeY, areaColor) {
			if(points.length < 2){
				return ;
			}
			
			this.ctx.fillStyle = areaColor;
			this.ctx.beginPath();
			this.ctx.moveTo(vNodeX, hNodeY);
			this.ctx.lineTo(points[0].x,points[0].y);
			var px = points[0].x;
			var py = points[0].y;
			//横坐标均等，两次找中点被划分为四段
			var offsetX = (points[1].x - points[0].x)/4 * this.offset;
			for(var i = 1; i < points.length; i ++){
				//两点间的中点
				var centerX = (points[i].x + points[i-1].x)/2;
				var centerY = (points[i].y + points[i-1].y)/2;
				var type = (points[i].y - points[i-1].y) > 0?2:1;//1=增 2=减
				
				//中点距前一点的中点
				var tempX = (centerX + points[i-1].x)/2;
				var tempY = (centerY + points[i-1].y)/2;
				var offsetY = 0;
				if(type == 1){
					offsetY = (points[i-1].y - tempY) * this.offset;
					tempX = tempX + offsetX;
					tempY = tempY + offsetY;
				}else{
					offsetY = (tempY - points[i-1].y) * this.offset;
					tempX = tempX + offsetX;
					tempY = tempY - offsetY;
				}
				//中点前半段
				this.ctx.quadraticCurveTo(tempX, tempY, centerX, centerY);
				
				//中点距后一点的中点
				tempX = (centerX + points[i].x)/2;
				tempY = (centerY + points[i].y)/2;
				offsetY = 0;
				if(type == 1){
					offsetY = (tempY - points[i].y) * this.offset;
					tempX = tempX - offsetX;
					tempY = tempY - offsetY;
				}else{
					offsetY = (points[i].y - tempY) * this.offset;
					tempX = tempX - offsetX;
					tempY = tempY + offsetY;
				}
				//中点后半段
				this.ctx.quadraticCurveTo(tempX, tempY, points[i].x, points[i].y);
				this.ctx.stroke();
			}
			this.ctx.lineTo(points[points.length - 1].x, hNodeY);
			//this.ctx.lineTo(0, 0);
			
			// //
			// this.ctx.stroke();
			this.ctx.fill();
			this.ctx.closePath();
		};
		
		AreaLine.prototype.strLen = function(str){
			var len = 0;
			for(var i = 0; i < str.length; i ++){
				if(this.filter.isChinese(str.charAt(i))){
					len += 16;
					continue;
				}
				if(this.filter.isUpper(str.charAt(i))){
					len += 12;
					continue;
				}
				if(this.filter.isNumber(str.charAt(i))){
					len += 9;
					continue;
				}
				len += 8;
			}
			return len;
		};

		this._create();
	}
})();
// var brokenLine = new Ele.Charts.BrokenLine({padding:40,showTitle:true});
// var data = {
// 	title:"线路统计图Ab123"
// 	,max:1000
// 	,X:[{text:"AAA",fieldName:"a"},{text:"B",fieldName:"b"},{text:"C",fieldName:"c"},{text:"D",fieldName:"d"},{text:"E",fieldName:"e"}]
// 	,Y:["0","200","400","600","800","1000"]
// 	,nodes:[{id:1,name:"总线Ab123",color:"#ff6600"},{id:2,name:"分支线",color:"#41BABD"}]
// 	,values:[{lineId:1,value:{a:{key:"", value:30},b:{key:"90", value:90},c:{key:"50", value:50},d:{key:"60", value:60},e:{key:"80", value:80}}},
// {lineId:2,value:{a:{key:"", value:200},b:{key:"600", value:600},c:{key:"300", value:300},d:{key:"400", value:400},e:{key:"600", value:600}}}]
// 	};
// brokenLine.draw(data);
(function() {
	var BrokenLine = Ele.Charts.BrokenLine = function(opts) {
		this.eleType = "canvas";
		this.ele;
		this.ctx;
		this.width = 750; //默认宽度
		this.height = 300; //默认高度
		this.background = "#FFFFFF"; //默认背景
		this.border = "1px #EEEEEE solid"; //默认边框
		this.titleColor = "#333333"; //默认标题颜色
		this.textColor = "#4C4C4C"; //默认文本颜色
		this.padding = 20; //四周边距
		this.edgeLineColor = "#C4C4C4"; //轮廓线条颜色
		this.edgeLineHintColor = "rgba(221,221,221, 0.28)"; //轮廓线条颜色
		this.edgelineWidth = 1; //轮廓线条宽度
		this.edgeLeftSpacing = 40; //默认左侧线条左侧间距
		this.edgeBottomSpacing = 16; //默认底部线条地侧间距
		this.showTitle = false;
		this.itemColor = "#4FDBDB"; //节点颜色a0e0a3
		this.itemlineWidth = 1; //节点线条宽度
		this.itemPointWeight = 4; //节点半径
		this.data;
		this.filter = new Ele.Utils.Filter();
		
		this._node_lenght = 10;//节点线条长度
		this._title_height = 36;//标题布局高度
		this._rectW = 16;//方形宽度
		this._rectH = 16;//方形高度
		this._txt_h_offset = 6;//字体左右对齐偏移量
		
		if(Ele._skin == "skin-black"){
			this.background = "#444444";
			this.border = "1px #555555 solid";
			this.titleColor = "#FFFFFF";
			this.textColor = "#F5F5F5";
			this.edgeLineColor = "#F5F5F5";
			this.edgeLineHintColor = "rgba(237,237,237, 0.28)";
		}

		BrokenLine.prototype._init = function() {
			if (typeof(opts) != "object") {
				return;
			}
			if (typeof(opts.width) == "number") {
				this.width = opts.width;
			}
			if (typeof(opts.height) == "number") {
				this.height = opts.height;
			}
			if (typeof(opts.background) == "string") {
				this.background = opts.background;
			}
			if (typeof(opts.border) == "string") {
				this.border = opts.border;
			}
			if (typeof(opts.padding) == "number") {
				this.padding = opts.padding;
			}
			if (typeof(opts.edgeLineColor) == "string") {
				this.edgeLineColor = opts.edgeLineColor;
			}
			if (typeof(opts.edgeLineHintColor) == "string") {
				this.edgeLineHintColor = opts.edgeLineHintColor;
			}
			if (typeof(opts.edgelineWidth) == "number") {
				this.edgelineWidth = opts.edgelineWidth;
			}
			if (typeof(opts.edgeLeftSpacing) == "number") {
				this.edgeLeftSpacing = opts.edgeLeftSpacing;
			}
			if (typeof(opts.edgeBottomSpacing) == "number") {
				this.edgeBottomSpacing = opts.edgeBottomSpacing;
			}
			if (typeof(opts.showTitle) == "boolean") {
				this.showTitle = opts.showTitle;
			}
			if (typeof(opts.itemColor) == "string") {
				this.itemColor = opts.itemColor;
			}
			if (typeof(opts.itemlineWidth) == "number") {
				this.itemlineWidth = opts.itemlineWidth;
			}
			if (typeof(opts.itemPointWeight) == "number") {
				this.itemPointWeight = opts.itemPointWeight;
			}
		};
		BrokenLine.prototype._create = function() {
			this._init();

			this.ele = document.createElement("canvas");

			this.ele.width = this.width;
			this.ele.height = this.height;
			this.ele.style.background = this.background;
			this.ele.style.border = this.border;
			this.ctx = this.ele.getContext("2d");
		};

		BrokenLine.prototype.setContainerById = function(id) {
			document.getElementById(id).appendChild(this.ele);
		};
		//画折线图
		BrokenLine.prototype.draw = function(data) {
			if(typeof(data) != "object"){
				return ;
			}
			if(typeof(data.X) != "object"){
				return ;
			}
			if(typeof(data.Y) != "object"){
				return ;
			}
			if(typeof(data.values) != "object"){
				return ;
			}
			this.data = data;
			
			var vheight = this.height - (this.padding * 2) - this.edgeBottomSpacing - this._node_lenght;
			var hwidth = this.width - (this.padding * 2) - this.edgeLeftSpacing - this._node_lenght;
			var top = this.padding;
			if(this.showTitle){
				vheight -= this._title_height;
				top = this.padding + this._title_height;
				this.drawTitleText();
			}
			var nodeHeight = vheight/(data.Y.length - 1);
			var vNodeX = this.padding + this._node_lenght + this.edgeLeftSpacing;
			var nodeWidth = hwidth/(data.X.length - 1);
			var hNodeY =  this.height - this.padding - this._node_lenght - this.edgeBottomSpacing;
			
			this.drawEdgeLine(nodeHeight, vNodeX, nodeWidth, hNodeY, top);
			this.drawEdgeText(nodeHeight, vNodeX, nodeWidth, hNodeY, top);
			this.drawData(vheight, nodeHeight, vNodeX, nodeWidth, hNodeY);
			
		};
		BrokenLine.prototype.drawData = function(vheight, nodeHeight, vNodeX, nodeWidth, hNodeY) {
			var values = this.data.values;
			var nodes = [];
			if(typeof(this.data.nodes) == "object"){
				nodes = this.data.nodes;
			}
			for(var i = 0; i < values.length; i ++){
				var value = values[i].value;
				var arr = [];
				for(var j = 0; j < this.data.X.length; j ++){
					//判断是否存在属性
					if(this.data.X[j].fieldName in value){
						arr.push(value[this.data.X[j].fieldName]);
					}
				}
				var lineId = values[i].lineId;
				var node = null;
				for(var k = 0; k < nodes.length; k ++){
					if(typeof(nodes[k].id) != "number"){
						continue;
					}
					if(nodes[k].id == lineId){
						node = nodes[k];
						break;
					}
				}
				if(node == null || typeof(node.color) != "string"){
					this.drawArrayData(vheight, nodeHeight, vNodeX, nodeWidth, hNodeY, arr, this.itemColor);
				}else{
					this.drawArrayData(vheight, nodeHeight, vNodeX, nodeWidth, hNodeY, arr, node.color);
				}
			}
		};
		BrokenLine.prototype.drawArrayData = function(vheight, nodeHeight, vNodeX, nodeWidth, hNodeY, data, color) {
			if(typeof(this.data.max) != "number"){
				return ;
			}
			var len = data.length
			this.ctx.font = "12px Microsoft YaHei";
			this.ctx.fillStyle = color;
			this.ctx.strokeStyle = color;
			this.ctx.lineWidth = this.itemlineWidth;
			this.ctx.beginPath();
			var sx;
			var sy;
			
			//横向刻度值
			for (var i = 0; i < len; i++) {
				var x = vNodeX + (i * nodeWidth);
				var val = new Number(data[i].value);
				if (val > this.data.max) {
					val = this.data.max;
				}
				var y = hNodeY - ((vheight * val) / this.data.max);
				
				//小圆点
				this.ctx.beginPath();
				this.ctx.arc(x, y, this.itemPointWeight, 0, Math.PI * 2);
				this.ctx.closePath();
				this.ctx.fill();
				
				//数据文本
				this.ctx.beginPath();
				this.ctx.fillText(data[i].key, x + this._txt_h_offset, y);
				this.ctx.closePath();
				this.ctx.stroke();
			
				if (i != 0) {
					//连线
					this.ctx.beginPath();
					this.drawLinePx(sx, sy, x, y);
					this.ctx.closePath();
					this.ctx.stroke();
				}
				sx = x;
				sy = y;
			}
			
		};
		
		BrokenLine.prototype.drawEdgeLine = function(nodeHeight,vNodeX, nodeWidth, hNodeY, top) {
			this.ctx.strokeStyle = this.edgeLineColor;
			this.ctx.lineWidth = this.edgelineWidth; //设置线宽
			this.ctx.beginPath();
			
			//竖线条
			this.drawLinePx(vNodeX, top, vNodeX, this.height - this.padding - this.edgeBottomSpacing);
			//竖向刻度标
			var left = this.padding+this.edgeLeftSpacing;
			for (var i = 0; i < this.data.Y.length - 1; i++) {
				var y = i * nodeHeight + top;
				this.drawLinePx(vNodeX, y, left, y);
				//水平线
				this.ctx.stroke();
				this.ctx.beginPath();
				this.ctx.strokeStyle = this.edgeLineHintColor;
				this.drawLinePx(vNodeX, y, this.width - this.padding, y);
				this.ctx.stroke();
				this.ctx.beginPath();
				this.ctx.strokeStyle = this.edgeLineColor;
			}
			this.drawLinePx(vNodeX - this._node_lenght, hNodeY, this.width - this.padding, hNodeY);
			//横向刻度标
			for (var i = 0; i < this.data.X.length; i++) {
				var x = i * nodeWidth + vNodeX;
				this.drawLinePx(x, hNodeY, x, hNodeY+this._node_lenght);
			}
			this.ctx.closePath();
			this.ctx.stroke();
		};
		BrokenLine.prototype.drawEdgeText = function(nodeHeight, vNodeX, nodeWidth, hNodeY, top) {
			//竖向刻度值
			this.ctx.fillStyle = this.textColor;
			this.ctx.textBaseline = 'top';
			this.ctx.font = "12px Microsoft YaHei";
			for (var i = 0; i < this.data.Y.length; i++) {
				var y = top + ((this.data.Y.length - 1- i) * nodeHeight);
				this.ctx.fillText(this.data.Y[i], this.padding, y);
			}
			//横向刻度值
			for (var i = 0; i < this.data.X.length; i++) {
				var x = i * nodeWidth + vNodeX;
				this.ctx.textAlign = 'right';
				this.ctx.fillText(this.data.X[i].text, x, hNodeY+this._node_lenght);
				this.ctx.textAlign = 'left';
			}
		};
		BrokenLine.prototype.drawTitleText = function() {
			if(typeof(this.data.nodes) == "undefined"){
				return ;
			}
			this.ctx.fillStyle = this.titleColor;
			this.ctx.font = "13px Microsoft YaHei";
			this.ctx.textBaseline = 'bottom';
			this.ctx.beginPath();
			this.ctx.fillText(this.data.title, this.padding, this.padding);
			
			var x =  this.padding + this.strLen(this.data.title) + 32;
			var y = this.padding;
			
			var nodes = this.data.nodes;
			for(var i = 0; i < nodes.length; i ++){
				if(typeof(nodes[i].color) != "string"){
					continue;
				}
				var name = "";
				if(typeof(nodes[i].name) == "string"){
					name = nodes[i].name;
				}
				this.ctx.fillStyle = nodes[i].color;
				this.ctx.strokeStyle = nodes[i].color;
				this.ctx.beginPath();
				//w*h正方形
				this.ctx.fillRect(x, y - this._rectH, this._rectW, this._rectH);
				x += 24;//16+8
				this.ctx.fillText(name, x, y);
				x += this.strLen(name) + 13;
				this.ctx.closePath();
				this.ctx.fill();
			}
			
		};
		BrokenLine.prototype.drawLinePx = function(sx, sy, ex, ey) {
			this.ctx.moveTo(sx, sy);
			this.ctx.lineTo(ex, ey);
		};
		
		BrokenLine.prototype.strLen = function(str){
			var len = 0;
			for(var i = 0; i < str.length; i ++){
				if(this.filter.isChinese(str.charAt(i))){
					len += 16;
					continue;
				}
				if(this.filter.isUpper(str.charAt(i))){
					len += 12;
					continue;
				}
				if(this.filter.isNumber(str.charAt(i))){
					len += 9;
					continue;
				}
				len += 8;
			}
			return len;
		};

		this._create();
	}
})();
// var histogram = new Ele.Charts.Histogram({padding:40,showTitle:true,showBrokenLine:true});
// var data = {
// 	title:"线路统计图Ab123"
// 	,max:1000
// 	,X:[{text:"AAA",fieldName:"a"},{text:"B",fieldName:"b"},{text:"C",fieldName:"c"},{text:"D",fieldName:"d"},{text:"E",fieldName:"e"}]
// 	,Y:["0","200","400","600","800","1000"]
// 	,nodes:[{id:1,name:"总线Ab123",color:"#ff6600"},{id:2,name:"分支线",color:"#41BABD"}]
// 	,values:[{lineId:1,value:{a:{key:"30", value:30},b:{key:"90", value:90},c:{key:"50", value:50},d:{key:"60", value:60},e:{key:"80", value:80}}},
// {lineId:2,value:{a:{key:"200", value:200},b:{key:"600", value:600},c:{key:"300", value:300},d:{key:"400", value:400},e:{key:"600", value:600}}}]
// 	};
// histogram.draw(data);

(function() {
	var Histogram = Ele.Charts.Histogram = function(opts) {
		this.eleType = "canvas";
		this.ele;
		this.ctx;
		this.width = 750; //默认宽度
		this.height = 300; //默认高度
		this.background = "#FFFFFF"; //默认背景
		this.border = "1px #EEEEEE solid"; //默认边框
		this.titleColor = "#333333"; //默认标题颜色
		this.textColor = "#4C4C4C"; //默认文本颜色
		this.padding = 20; //四周边距
		this.edgeLineColor = "#C4C4C4"; //轮廓线条颜色
		this.edgeLineHintColor = "rgba(221,221,221, 0.28)"; //轮廓线条颜色
		this.edgelineWidth = 1; //轮廓线条宽度
		this.edgeLeftSpacing = 40; //默认左侧线条左侧间距
		this.edgeBottomSpacing = 16; //默认底部线条地侧间距
		this.showTitle = false;
		this.itemColor = "#4FDBDB"; //节点颜色a0e0a3
		this.itemlineWidth = 1; //节点线条宽度
		this.itemWidth = 20; //柱状宽度，当长度不够时自动计算
		this.showBrokenLine = false;//是否显示折线
		this.data;
		this.filter = new Ele.Utils.Filter();
		
		this._node_lenght = 10;//节点线条长度
		this._title_height = 36;//标题布局高度
		this._rectW = 16;//方形宽度
		this._rectH = 16;//方形高度
		this._txt_h_offset = 12;//字体左右对齐偏移量
		
		if(Ele._skin == "skin-black"){
			this.background = "#444444";
			this.border = "1px #555555 solid";
			this.titleColor = "#FFFFFF";
			this.textColor = "#F5F5F5";
			this.edgeLineColor = "#F5F5F5";
			this.edgeLineHintColor = "rgba(237,237,237, 0.28)";
		}

		Histogram.prototype._init = function() {
			if (typeof(opts) != "object") {
				return;
			}
			if (typeof(opts.width) == "number") {
				this.width = opts.width;
			}
			if (typeof(opts.height) == "number") {
				this.height = opts.height;
			}
			if (typeof(opts.background) == "string") {
				this.background = opts.background;
			}
			if (typeof(opts.border) == "string") {
				this.border = opts.border;
			}
			if (typeof(opts.padding) == "number") {
				this.padding = opts.padding;
			}
			if (typeof(opts.edgeLineColor) == "string") {
				this.edgeLineColor = opts.edgeLineColor;
			}
			if (typeof(opts.edgeLineHintColor) == "string") {
				this.edgeLineHintColor = opts.edgeLineHintColor;
			}
			if (typeof(opts.edgelineWidth) == "number") {
				this.edgelineWidth = opts.edgelineWidth;
			}
			if (typeof(opts.edgeLeftSpacing) == "number") {
				this.edgeLeftSpacing = opts.edgeLeftSpacing;
			}
			if (typeof(opts.edgeBottomSpacing) == "number") {
				this.edgeBottomSpacing = opts.edgeBottomSpacing;
			}
			if (typeof(opts.showTitle) == "boolean") {
				this.showTitle = opts.showTitle;
			}
			if (typeof(opts.itemColor) == "string") {
				this.itemColor = opts.itemColor;
			}
			if (typeof(opts.itemlineWidth) == "number") {
				this.itemlineWidth = opts.itemlineWidth;
			}
			if (typeof(opts.itemWidth) == "number") {
				this.itemWidth = opts.itemWidth;
			}
			if (typeof(opts.showBrokenLine) == "boolean") {
				this.showBrokenLine = opts.showBrokenLine;
			}
		};
		Histogram.prototype._create = function() {
			this._init();

			this.ele = document.createElement("canvas");

			this.ele.width = this.width;
			this.ele.height = this.height;
			this.ele.style.background = this.background;
			this.ele.style.border = this.border;
			this.ctx = this.ele.getContext("2d");
		};

		Histogram.prototype.setContainerById = function(id) {
			document.getElementById(id).appendChild(this.ele);
		};
		//画折线图
		Histogram.prototype.draw = function(data) {
			if(typeof(data) != "object"){
				return ;
			}
			if(typeof(data.X) != "object"){
				return ;
			}
			if(typeof(data.Y) != "object"){
				return ;
			}
			if(typeof(data.values) != "object"){
				return ;
			}
			this.data = data;
			
			var vheight = this.height - (this.padding * 2) - this.edgeBottomSpacing - this._node_lenght;
			var hwidth = this.width - (this.padding * 2) - this.edgeLeftSpacing - this._node_lenght;
			var top = this.padding;
			if(this.showTitle){
				vheight -= this._title_height;
				top = this.padding + this._title_height;
				this.drawTitleText();
			}
			var nodeHeight = vheight/(data.Y.length - 1);
			var vNodeX = this.padding + this._node_lenght + this.edgeLeftSpacing;
			var nodeWidth = hwidth/(data.X.length);
			var hNodeY =  this.height - this.padding - this._node_lenght - this.edgeBottomSpacing;
			
			this.drawEdgeLine(nodeHeight, vNodeX, nodeWidth, hNodeY, top);
			this.drawEdgeText(nodeHeight, vNodeX, nodeWidth, hNodeY, top);
			this.drawData(vheight, nodeHeight, vNodeX, nodeWidth, hNodeY);
			
		};
		Histogram.prototype.drawData = function(vheight, nodeHeight, vNodeX, nodeWidth, hNodeY) {
			var values = this.data.values;
			var nodes = [];
			if(typeof(this.data.nodes) == "object"){
				nodes = this.data.nodes;
			}
			var iWidth = this.itemWidth;
			if(values.length * iWidth > nodeWidth){
				iWidth = nodeWidth/values.length;
			}
			var offsetX = (values.length * iWidth)/2;
			
			for(var i = 0; i < values.length; i ++){
				var value = values[i].value;
				var arr = [];
				for(var j = 0; j < this.data.X.length; j ++){
					//判断是否存在属性
					if(this.data.X[j].fieldName in value){
						arr.push(value[this.data.X[j].fieldName]);
					}
				}
				var lineId = values[i].lineId;
				var node = null;
				for(var k = 0; k < nodes.length; k ++){
					if(typeof(nodes[k].id) != "number"){
						continue;
					}
					if(nodes[k].id == lineId){
						node = nodes[k];
						break;
					}
				}
				if(node == null || typeof(node.color) != "string"){
					this.drawArrayData(vheight, nodeHeight, vNodeX, nodeWidth, hNodeY, arr, this.itemColor,iWidth,offsetX);
				}else{
					this.drawArrayData(vheight, nodeHeight, vNodeX, nodeWidth, hNodeY, arr, node.color,iWidth,offsetX);
				}
				//更新offset
				offsetX -= iWidth;
			}
		};
		Histogram.prototype.drawArrayData = function(vheight, nodeHeight, vNodeX, nodeWidth, hNodeY, data, color,iWidth,offsetX) {
			if(typeof(this.data.max) != "number"){
				return ;
			}
			var len = data.length
			this.ctx.font = "12px Microsoft YaHei";
			this.ctx.fillStyle = color;
			this.ctx.strokeStyle = color;
			this.ctx.lineWidth = this.itemlineWidth;
			this.ctx.beginPath();
			var sx;
			var sy;
			
			//横向刻度值
			for (var i = 0; i < len; i++) {
				var x = vNodeX + ((i+0.5) * nodeWidth);
				var val = new Number(data[i].value);
				if (val > this.data.max) {
					val = this.data.max;
				}
				var y = hNodeY - ((vheight * val) / this.data.max);
				
				//柱条
				this.ctx.beginPath();
				this.ctx.fillRect(x-offsetX, y, iWidth, hNodeY - y);
				this.ctx.closePath();
				this.ctx.fill();
				
				//数据文本
				this.ctx.beginPath();
				this.ctx.fillText(data[i].key, x-offsetX, y-this._txt_h_offset);
				this.ctx.closePath();
				this.ctx.stroke();
			
				x -= offsetX-iWidth/2;
			
				if (this.showBrokenLine && i != 0) {
					//连线
					this.ctx.beginPath();
					this.drawLinePx(sx, sy, x, y);
					this.ctx.closePath();
					this.ctx.stroke();
				}
				sx = x;
				sy = y;
			}
			
		};
		
		Histogram.prototype.drawEdgeLine = function(nodeHeight,vNodeX, nodeWidth, hNodeY, top) {
			this.ctx.strokeStyle = this.edgeLineColor;
			this.ctx.lineWidth = this.edgelineWidth; //设置线宽
			this.ctx.beginPath();
			
			//竖线条
			this.drawLinePx(vNodeX, top, vNodeX, this.height - this.padding - this.edgeBottomSpacing);
			//竖向刻度标
			var left = this.padding+this.edgeLeftSpacing;
			for (var i = 0; i < this.data.Y.length - 1; i++) {
				var y = i * nodeHeight + top;
				this.drawLinePx(vNodeX, y, left, y);
				//水平线
				this.ctx.stroke();
				this.ctx.beginPath();
				this.ctx.strokeStyle = this.edgeLineHintColor;
				this.drawLinePx(vNodeX, y, this.width - this.padding, y);
				this.ctx.stroke();
				this.ctx.beginPath();
				this.ctx.strokeStyle = this.edgeLineColor;
			}
			this.drawLinePx(vNodeX - this._node_lenght, hNodeY, this.width - this.padding, hNodeY);
			//横向刻度标
			for (var i = 0; i <= this.data.X.length; i++) {
				var x = i * nodeWidth + vNodeX;
				this.drawLinePx(x, hNodeY, x, hNodeY+this._node_lenght);
			}
			this.ctx.closePath();
			this.ctx.stroke();
		};
		Histogram.prototype.drawEdgeText = function(nodeHeight, vNodeX, nodeWidth, hNodeY, top) {
			//竖向刻度值
			this.ctx.fillStyle = this.textColor;
			this.ctx.textBaseline = 'top';
			this.ctx.font = "12px Microsoft YaHei";
			for (var i = 0; i < this.data.Y.length; i++) {
				var y = top + ((this.data.Y.length - 1- i) * nodeHeight);
				this.ctx.fillText(this.data.Y[i], this.padding, y);
			}
			//横向刻度值
			for (var i = 0; i < this.data.X.length; i++) {
				var x = (i+0.5) * nodeWidth + vNodeX;
				this.ctx.textAlign = 'center';
				this.ctx.fillText(this.data.X[i].text, x, hNodeY+this._node_lenght);
				this.ctx.textAlign = 'left';
			}
		};
		Histogram.prototype.drawTitleText = function() {
			if(typeof(this.data.nodes) == "undefined"){
				return ;
			}
			this.ctx.fillStyle = this.titleColor;
			this.ctx.font = "13px Microsoft YaHei";
			this.ctx.textBaseline = 'bottom';
			this.ctx.beginPath();
			this.ctx.fillText(this.data.title, this.padding, this.padding);
			
			var x =  this.padding + this.strLen(this.data.title) + 32;
			var y = this.padding;
			
			var nodes = this.data.nodes;
			for(var i = 0; i < nodes.length; i ++){
				if(typeof(nodes[i].color) != "string"){
					continue;
				}
				var name = "";
				if(typeof(nodes[i].name) == "string"){
					name = nodes[i].name;
				}
				this.ctx.fillStyle = nodes[i].color;
				this.ctx.strokeStyle = nodes[i].color;
				this.ctx.beginPath();
				//w*h正方形
				this.ctx.fillRect(x, y - this._rectH, this._rectW, this._rectH);
				x += 24;//16+8
				this.ctx.fillText(name, x, y);
				x += this.strLen(name) + 13;
				this.ctx.closePath();
				this.ctx.fill();
			}
			
		};
		Histogram.prototype.drawLinePx = function(sx, sy, ex, ey) {
			this.ctx.moveTo(sx, sy);
			this.ctx.lineTo(ex, ey);
		};
		
		Histogram.prototype.strLen = function(str){
			var len = 0;
			for(var i = 0; i < str.length; i ++){
				if(this.filter.isChinese(str.charAt(i))){
					len += 16;
					continue;
				}
				if(this.filter.isUpper(str.charAt(i))){
					len += 12;
					continue;
				}
				if(this.filter.isNumber(str.charAt(i))){
					len += 9;
					continue;
				}
				len += 8;
			}
			return len;
		};

		this._create();
	}
})();
// var radar = new Ele.Charts.Radar();
// var data = [{key:"A",value:85},{key:"B",value:30},{key:"C",value:80},{key:"D",value:45},{key:"E",value:70},{key:"F",value:90}];
// radar.draw(data, 200);
(function(){
	var Radar = Ele.Charts.Radar = function(opts){
		this.eleType = "canvas";
		this.ele;
		this.ctx;
		this.width = 300;//默认宽度
		this.height = 300;//默认高度
		this.background = "#FFFFFF";//默认背景
		this.border = "1px #EEEEEE solid";//默认边框
		this.padding = 70;//默认左右边框距离
		this.numSlot = 4;//一条线上的总节点数
		this.edgeLineColor="#EDEDED";//轮廓线条颜色
		this.edgelineWidth=1;//轮廓线条宽度
		this.textColor="#4C4C4C";//文本字体颜色
		this.itemColor="#4FDBDB";//节点颜色
		this.itemFillColor="rgba(79,219,219, 0.5)";//节点填充颜色
		this.itemlineWidth=1;//节点线条宽度
		this.itemPointWeight=2;//节点半径
		this.data;
		
		if(Ele._skin == "skin-black"){
			this.background = "#444444";
			this.border = "1px #555555 solid";
			this.textColor = "#F5F5F5";
		}
	
		Radar.prototype._init = function(){
			if(typeof(opts) != "object"){
				return ;
			}
			if(typeof(opts.width) == "number"){
				this.width = opts.width;
			}
			if(typeof(opts.height) == "number"){
				this.height = opts.height;
			}
			if(typeof(opts.background) == "string"){
				this.background = opts.background;
			}
			if(typeof(opts.border) == "string"){
				this.border = opts.border;
			}
			if(typeof(opts.padding) == "number"){
				this.padding = opts.padding;
			}
			if(typeof(opts.numSlot) == "number"){
				this.numSlot = opts.numSlot;
			}
			if(typeof(opts.edgeLineColor) == "string"){
				this.edgeLineColor = opts.edgeLineColor;
			}
			if(typeof(opts.edgelineWidth) == "number"){
				this.edgelineWidth = opts.edgelineWidth;
			}
			if(typeof(opts.textColor) == "string"){
				this.textColor = opts.textColor;
			}
			
			if(typeof(opts.itemColor) == "string"){
				this.itemColor = opts.itemColor;
			}
			if(typeof(opts.itemFillColor) == "string"){
				this.itemFillColor = opts.itemFillColor;
			}
			if(typeof(opts.itemlineWidth) == "number"){
				this.itemlineWidth = opts.itemlineWidth;
			}
			if(typeof(opts.itemPointWeight) == "number"){
				this.itemPointWeight = opts.itemPointWeight;
			}
		};
		Radar.prototype._create = function() {
			this._init();
			
			this.ele = document.createElement("canvas");
			
			this.ele.width = this.width;
			this.ele.height = this.height;
			this.ele.style.background = this.background;
			this.ele.style.border = this.border;
			this.ctx = this.ele.getContext("2d");
		};
		
		Radar.prototype.setContainerById = function(id){
			document.getElementById(id).appendChild(this.ele);
		};
	
		//画雷达图
		Radar.prototype.draw = function(data, max){
			if(typeof(data) == "undefined"){
				return ;
			}
			if(typeof(max) != "number"){
				max = 100;
			}
			this.data = data;
			var mCenter = this.width / 2; //中心点
			var mRadius = mCenter - this.padding;
			var numCount = data.length;
			var mAngle = Math.PI * 2 / numCount; //角度
			//调用 
			this.drawRadarEdge(mCenter, numCount, mRadius, mAngle); //边框
			this.drawRadarLinePoint(mCenter, numCount, mRadius, mAngle);//交叉线
			this.drawRadarText(data, mCenter, numCount, mRadius, mAngle);//文本
			this.drawRadarCircle(data, mCenter, numCount, mRadius, mAngle, max)//节点
			this.drawRadarRegion(data, mCenter, numCount, mRadius, mAngle, max)//区域
		};
		
		Radar.prototype.drawRadarRegion = function (mData, mCenter, numCount, mRadius, mAngle, max) {
			this.ctx.beginPath();
			for (var m = 0; m < numCount; m++) {
				var val = mData[m].value;
				if(val > max){
					val = max;
				}
				var x = mCenter + mRadius * Math.cos(mAngle * m) * val / max;
				var y = mCenter + mRadius * Math.sin(mAngle * m) * val / max;
				this.ctx.lineTo(x, y);
			}
			this.ctx.closePath();
			this.ctx.fillStyle = this.itemFillColor;
			this.ctx.fill();
		};
		
		//画雷达值小圆点
		Radar.prototype.drawRadarCircle = function (mData, mCenter, numCount, mRadius, mAngle, max) {
			for (var i = 0; i < numCount; i++) {
				var val = mData[i].value;
				if(val > max){
					val = max;
				}
				var x = mCenter + mRadius * Math.cos(mAngle * i) * val / max;
				var y = mCenter + mRadius * Math.sin(mAngle * i) * val / max;
				this.ctx.beginPath();
				this.ctx.arc(x, y, this.itemPointWeight, 0, Math.PI * 2);
				this.ctx.fillStyle = this.itemColor; 
				this.ctx.fill();
			}
		};
		
		//画雷达文本
		Radar.prototype.drawRadarText = function (mData, mCenter, numCount, mRadius, mAngle) {
			this.ctx.fillStyle = this.textColor;
		  
			for (var n = 0; n < numCount; n++) {
				var x = mCenter + mRadius * Math.cos(mAngle * n);
				var y = mCenter + mRadius * Math.sin(mAngle * n);
				//通过不同的位置，调整文本的显示位置 
				if (mAngle * n >= 0 && mAngle * n <= Math.PI / 2) {
					this.ctx.fillText(mData[n].key, x + 5, y + 5);
				} else if (mAngle * n > Math.PI / 2 && mAngle * n <= Math.PI) {
					this.ctx.fillText(mData[n].key, x - this.ctx.measureText(mData[n].key).width - 7, y + 5);
				} else if (mAngle * n > Math.PI && mAngle * n <= Math.PI * 3 / 2) {
					this.ctx.fillText(mData[n].key, x - this.ctx.measureText(mData[n].key).width - 5, y);
				} else {
					this.ctx.fillText(mData[n].key, x + 7, y + 2);
				}
			}
		};
		
		//画交叉线
		Radar.prototype.drawRadarLinePoint = function (mCenter, numCount, mRadius, mAngle) {
			var cx = mCenter;
			var cy = mCenter;
			this.ctx.beginPath();
			for (var k = 0; k < numCount; k++) {
				var x = mCenter + mRadius * Math.cos(mAngle * k);
				var y = mCenter + mRadius * Math.sin(mAngle * k);
				this.ctx.moveTo(cx, cy); this.ctx.lineTo(x, y);
			}
			this.ctx.stroke();
		};
		
		//画边框形状
		Radar.prototype.drawRadarEdge = function (mCenter, numCount, mRadius, mAngle) {
			this.ctx.strokeStyle = this.edgeLineColor;
			this.ctx.lineWidth = this.edgelineWidth;  //设置线宽 
			for (var i = 0; i < this.numSlot; i++) {
				//计算半径 
				this.ctx.beginPath()
				var rdius = mRadius / this.numSlot * (i + 1)
				//画N条线段 
				for (var j = 0; j < numCount; j++) {
					//坐标 
					var x = mCenter + rdius * Math.cos(mAngle * j);
					var y = mCenter + rdius * Math.sin(mAngle * j);
					this.ctx.lineTo(x, y);
				}
				this.ctx.closePath();
				this.ctx.stroke();
			}
		};
		
		this._create();
	}
})();
// var sector = new Ele.Charts.Sector({showTitle:true});
// var data = {title:"用户人群分布",value:[
// 		{
// 			title: '15-20岁',
// 			color: "#41BABD",
// 			value: 20
// 		},
// 		{
// 			title: '20-25岁',
// 			value: 30
// 		},
// 		{
// 			title: '25-30岁',
// 			value: 40
// 		},
// 		{
// 			title: '30以上',
// 			value: 10
// 		}
// 	]};
// sector.draw(data);
(function() {
	var Sector = Ele.Charts.Sector = function(opts) {
		this.eleType = "canvas";
		this.ele;
		this.ctx;
		this.width = 610; //默认宽度
		this.height = 486; //默认高度
		this.background = "#FFFFFF"; //默认背景
		this.border = "1px #EEEEEE solid"; //默认边框
		this.padding = 20; //四周边距
		this.edgeLeftSpacing = 60; //默认左侧线条左侧间距
		this.showTitle = false;
		this.titleColor = "#333333"; //节点颜色a0e0a3
		this.itemlineWidth = 1; //节点线条宽度
		this.cellSpacing = 80;//圆形内间距
		this.data;
		
		this._title_height = 36;//标题布局高度
		/*伸出去的线的长度*/
		this._out_line = 20;
		/*说明的矩形大小*/
		this._rectW = 30;
		this._rectH = 16;
		this._space = 10;
		
		if(Ele._skin == "skin-black"){
			this.background = "#444444";
			this.border = "1px #555555 solid";
			this.titleColor = "#FFFFFF";
		}


		Sector.prototype._init = function() {
			if (typeof(opts) != "object") {
				return;
			}
			if (typeof(opts.width) == "number") {
				this.width = opts.width;
			}
			if (typeof(opts.height) == "number") {
				this.height = opts.height;
			}
			if (typeof(opts.background) == "string") {
				this.background = opts.background;
			}
			if (typeof(opts.border) == "string") {
				this.border = opts.border;
			}
			if (typeof(opts.padding) == "number") {
				this.padding = opts.padding;
			}
			if (typeof(opts.edgeLeftSpacing) == "number") {
				this.edgeLeftSpacing = opts.edgeLeftSpacing;
			}
			if (typeof(opts.showTitle) == "boolean") {
				this.showTitle = opts.showTitle;
			}
			if (typeof(opts.titleColor) == "string") {
				this.titleColor = opts.titleColor;
			}
			if (typeof(opts.itemlineWidth) == "number") {
				this.itemlineWidth = opts.itemlineWidth;
			}
			if (typeof(opts.cellSpacing) == "number") {
				this.cellSpacing = opts.cellSpacing;
			}
		};
		Sector.prototype._create = function() {
			this._init();

			this.ele = document.createElement("canvas");

			this.ele.width = this.width;
			this.ele.height = this.height;
			this.ele.style.background = this.background;
			this.ele.style.border = this.border;
			this.ctx = this.ele.getContext("2d");
		};

		Sector.prototype.setContainerById = function(id) {
			document.getElementById(id).appendChild(this.ele);
		};
		//画饼状图
		Sector.prototype.draw = function(data) {
			if(typeof(data) != "object"){
				return ;
			}
			if(typeof(data.value) != "object"){
				return ;
			}
			this.data = data;
			
			/*圆心*/
			var x0 = (this.width / 2) + this.edgeLeftSpacing;
			var y0 = this.height / 2;
			var top = 0;
			var cellwith = (this.cellSpacing + this.padding) * 2;
			var hWidth = this.width - cellwith - this.edgeLeftSpacing;
			var vHeight = this.height - cellwith;
			if(this.showTitle){
				y0 += this._title_height;
				vHeight -= this._title_height;
				top += this._title_height;
				this.drawTitleText();
			}
			//直径取最小有效值
			var diameter = hWidth > vHeight?vHeight:hWidth;
			/*半径*/
			var radius = diameter/2;
			var context = this;
			/*1.转化弧度*/
			var angleList = this.transformAngle(data.value);
			/*2.绘制饼图*/
			var startAngle = 0;
			angleList.forEach(function (item, i) {
				/*当前的结束弧度要等于下一次的起始弧度*/
				var endAngle = startAngle + item.angle;
				context.ctx.beginPath();
				context.ctx.moveTo(x0, y0);
				context.ctx.arc(x0, y0, radius, startAngle, endAngle);
				var color;
				if(typeof(item.color) == "string"){
					color = context.ctx.fillStyle = item.color;
				}else{
					color = context.ctx.fillStyle = context.getRandomColor();
				}
				
				context.ctx.fill();
				/*下一次要使用当前的这一次的结束角度*/
				/*绘制标题*/
				context.drawTitle(x0, y0, radius, startAngle, item.angle, color, item.title);
				/*绘制说明*/
				context.drawDesc(i, top, item.title);
				startAngle = endAngle;
			});
		};
		
		Sector.prototype.drawTitle = function (x0, y0, radius, startAngle, angle ,color , title) {
			/*1.确定伸出去的线 通过圆心点 通过伸出去的点  确定这个线*/
			/*2.确定伸出去的点 需要确定伸出去的线的长度*/
			/*3.固定伸出去的线的长度*/
			/*4.计算这个点的坐标*/
			/*5.需要根据角度和斜边的长度*/
			/*5.1 使用弧度  当前扇形的起始弧度 + 对应的弧度的一半 */
			/*5.2 半径+伸出去的长度 */
			/*5.3 outX = x0 + cos(angle) * ( r + outLine)*/
			/*5.3 outY = y0 + sin(angle) * ( r + outLine)*/
			/*斜边*/
			var edge = radius + this._out_line;
			/*x轴方向的直角边*/
			var edgeX = Math.cos(startAngle + angle / 2) * edge;
			/*y轴方向的直角边*/
			var edgeY = Math.sin(startAngle + angle / 2) * edge;
			/*计算出去的点坐标*/
			var outX = x0 + edgeX;
			var outY = y0 + edgeY;
			this.ctx.beginPath();
			this.ctx.moveTo(x0, y0);
			this.ctx.lineTo(outX, outY);
			this.ctx.strokeStyle = color;
			/*画文字和下划线*/
			/*线的方向怎么判断 伸出去的点在X0的左边 线的方向就是左边*/
			/*线的方向怎么判断 伸出去的点在X0的右边 线的方向就是右边*/
			/*结束的点坐标  和文字大小*/
			this.ctx.font = '13px Microsoft YaHei';
			var textWidth = this.ctx.measureText(title).width ;
			if(outX > x0){
				/*右*/
				this.ctx.lineTo(outX + textWidth,outY);
				this.ctx.textAlign = 'left';
			}else{
				/*左*/
				this.ctx.lineTo(outX - textWidth,outY);
				this.ctx.textAlign = 'right';
			}
			this.ctx.stroke();
			this.ctx.textBaseline = 'bottom';
			this.ctx.fillText(title,outX,outY);
	
		};
		
		Sector.prototype.drawDesc = function (index, top, title) {
			/*绘制说明*/
			/*矩形的大小*/
			/*距离上和左边的间距*/
			/*矩形之间的间距*/
			var tp = this.padding + top + index * (this._rectH + this._space);
			
			this.ctx.fillRect(this.padding, tp,this._rectW,this._rectH);
			/*绘制文字*/
			this.ctx.beginPath();
			this.ctx.textAlign = 'left';
			this.ctx.textBaseline = 'top';
			this.ctx.font = '12px Microsoft YaHei';
			this.ctx.fillText(title,this.padding + this._rectW + this._space, tp);
		};
		
		Sector.prototype.transformAngle = function(data) {
			/*返回的数据内容包含弧度的*/
			var total = 0;
			data.forEach(function (item, i) {
				total += item.value;
			});
			/*计算弧度 并且追加到当前的对象内容*/
			data.forEach(function (item, i) {
				var angle = item.value / total * Math.PI * 2;
				item.angle = angle;
			});
			return data;

		};
		
		Sector.prototype.drawTitleText = function() {
			if(typeof(this.data.title) != "string"){
				return ;
			}
			this.ctx.fillStyle = this.titleColor;
			this.ctx.textAlign = 'center';
			this.ctx.textBaseline = 'top';
			this.ctx.font = "13px Microsoft YaHei";
			this.ctx.beginPath();
			this.ctx.fillText(this.data.title, this.width/2, this.padding);
		};
		
		Sector.prototype.getRandomColor = function () {
			var r = Math.floor(Math.random() * 256);
			var g = Math.floor(Math.random() * 256);
			var b = Math.floor(Math.random() * 256);
			return 'rgb(' + r + ',' + g + ',' + b + ')';
		}
		
		this._create();
	}
})();
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
(function(){
	var Ajax = Ele.Utils.Ajax = function(){
		this.eleType = "util";
		this._method = 'POST';
		this._contentType = "application/x-www-form-urlencoded";
		this._con = true;
		this._parameter = null;
		this._arrayHead = [];
	
		Ajax.prototype._createXmlHttp = function() {
			var xmlHttp;
			try {
				// Firefox, Opera 8.0+, Safari
				xmlHttp = new XMLHttpRequest();
			} catch (e) {
				// Internet Explorer
				try {
					xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
				} catch (e) {
					try {
						xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
					} catch (e) {
						// Refusing To Support Ajax 
						return false;
					};
				};
			}
			return xmlHttp;
		};
	
		Ajax.prototype.setMethod = function(method) {
			this._method = method;
		};
		
		Ajax.prototype.setContentType = function(contentType) {
			this._contentType = contentType;
		};
	
		Ajax.prototype.setSynchronization = function(syn) {
			this._con = syn;
		};
	
		Ajax.prototype.setParameter = function(parameter) {
			this._parameter = parameter;
		};
		Ajax.prototype.addRequestHead = function(name, value){
			if(typeof(name) != "string" || typeof(value) != "string"){
				return ;
			}
			if(name.trim() == ""){
				return ;
			}
			this._arrayHead.push(name+","+value);
		};
	
		Ajax.prototype.request = function(url, functionName, mark) {
			if (typeof(url) == 'undefined' || url == '') {
				return;
			}
			var context = this;
			var xmlhttp = this._createXmlHttp();
	
			xmlhttp.onreadystatechange = function() {
				if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
					if (typeof(functionName) == 'function') {
						functionName(xmlhttp.responseText, mark);
					}
				}
			};
			xmlhttp.open(this._method, url, this._con);
			if(this._contentType != null){
				xmlhttp.setRequestHeader("Content-Type", this._contentType);
			}
			//自定义head
			if(this._arrayHead.length > 0){
				for(var i = 0; i < this._arrayHead.length; i ++){
					var temp = this._arrayHead[i].split(",");
					xmlhttp.setRequestHeader(temp[0], temp[1]);
				}
			}
			xmlhttp.send(this._parameter);
		};
	}
})();
(function(){
	var DateFormat = Ele.Utils.DateFormat = function(pattern){
		this.eleType = "util";
		this._pattern;
	
		//按照pattern解析日期
		DateFormat.prototype.format = function(date) {
			if(!(date instanceof Date)){
				return ;
			}
			var o = {
				"M+" : date.getMonth()+1, //月份
				"d+" : date.getDate(), //日
				"H+" : date.getHours(), //小时
				"m+" : date.getMinutes(), //分
				"s+" : date.getSeconds(), //秒
				"S" : date.getMilliseconds() //毫秒
			};
			var week = {"0" : "\u65e5","1" : "\u4e00","2" : "\u4e8c","3" : "\u4e09","4" : "\u56db","5" : "\u4e94","6" : "\u516d"};
			var fmt = this._pattern;
			if(/(y+)/.test(fmt)){
				fmt = fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
			}
			if(/(E+)/.test(fmt)){
				fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "\u661f\u671f" : "\u5468") : "") +week[date.getDay()+""]);
			}
			if(/(q+)/.test(fmt)){
				var q = (Math.floor((date.getMonth()+3)/3));
				fmt = fmt.replace(RegExp.$1, RegExp.$1.length > 1?("Q"+q):q);
			}
			for(var i in o){
				if( new RegExp("("+ i +")").test(fmt)){
					fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[i]) : (("00"+ o[i]).substr((""+ o[i]).length)));
				}
			}
			//涉及小m，最后封装
			if(/(h+)/.test(fmt)){
				var step = date.getHours() > 12 ? "pm " : "am ";
				var h = date.getHours()%12 == 0 ? 12 : date.getHours()%12, //小时
				fmt = fmt.replace(RegExp.$1, step + ((RegExp.$1.length == 1) ? (h) : (("00"+ h).substr((""+ h).length))));
			}
			return fmt;
		};
		//按照pattern解析日期
		DateFormat.prototype.parse = function(dateString) {
			var fmt = this._pattern;
			if(dateString.length < fmt.length){
				throw new Error("'"+dateString+"' content length must equals or more than pattern:"+fmt);
				return null;
			}
			if(/(h+)/.test(fmt)){
				//时间加3
				if(dateString.length + 3 < fmt.length){
					throw new Error("'"+dateString+"' content with 'h' length must more than pattern:"+fmt);
					return null;
				}
			}
			
			var startIndex;
			var len;
			var year;
			var mouth;
			var day;
			var hour;
			var minutes;
			var seconds;
			
			var o = /(y|M|d|H|h|m|s|S|E|q)/;
			var p = {
				"M":{name:"mouth", value:null},
				"d":{name:"day", value:null},
				"H":{name:"hour", value:null},
				"m":{name:"minutes", value:null},
				"s":{name:"seconds", value:null}
			}
			
			for(var i = 0; i < fmt.length; ){
				var ch = fmt.charAt(i);
				//年份处理
				if(ch == 'y'){
					//获取连续的长度
					/(y+)/.test(fmt);
					len = RegExp.$1.length;
					//截取数据
					startIndex = fmt.indexOf(RegExp.$1);
					year = dateString.substring(startIndex, startIndex + len);
					if(len < 4){
						var now = new Date();
						year = (now.getFullYear()+"").substring(startIndex, startIndex + (4 - RegExp.$1.length)) + year;
					}
					if(year.trim() == "" || isNaN(year)){
						throw new Error("year parse error:"+year);
					}
					year = parseInt(year);
					
					i += len;
					continue;
				}
				if(ch == 'h'){
					//获取连续的长度
					/(h+)/.test(fmt);
					len = RegExp.$1.length;
					
					//截取数据
					startIndex = fmt.indexOf(RegExp.$1);
					//获取am pm后规范格式
					var ap = dateString.substring(startIndex, startIndex + 2);
					dateString = dateString.substring(0, startIndex) + dateString.substring(startIndex + 3, dateString.length);
					fmt.charAt(startIndex + 1);
					if(len < 2){
						if(startIndex == fmt.length - 1){
							if(dateString.length > fmt.length){
								p['H'].value = dateString.substring(startIndex, startIndex + 2);
							}else{
								p['H'].value = dateString.substring(startIndex, startIndex + 1);
							}
						}else{
							//检测下一位是否具有分隔符
							if(o.test(fmt.charAt(startIndex + 1))){
								throw new Error("single hour format need divider.");
							}
							//数据后面1-2位必须拥有对应分隔符号
							if(fmt.charAt(startIndex + 1) != dateString.charAt(startIndex + 1) && fmt.charAt(startIndex + 1) != dateString.charAt(startIndex + 2)){
								throw new Error("single "+p[item].name+" format data divider not found,data:"+dateString);
							}
							//确定日期数据是几位
							if(dateString.charAt(startIndex + 1).trim() !="" && !isNaN(dateString.charAt(startIndex + 1)) && fmt.charAt(startIndex + 1) != dateString.charAt(startIndex + 1)){
								//非分隔字符亦非且是数字则认定为是单项扩展数据
								p['H'].value = dateString.substring(startIndex, startIndex + 2);
								//数据更改，防止数据错位
								dateString = dateString.substring(0, startIndex) +"h"+ dateString.substring(startIndex + 2, dateString.length);
							}else{
								p['H'].value = dateString.substring(startIndex, startIndex + 1);
							}
						}
					}else{
						if(startIndex == dateString.length - 1){
							throw new Error("'"+RegExp.$1+"' double parse error to '"+dateString.charAt(dateString.length - 1)+"'");
						}
						if(dateString.charAt(startIndex).trim() == "" || dateString.charAt(startIndex + 1).trim() == ""){
							throw new Error("'"+RegExp.$1+"' double parse error to '"+dateString.substring(startIndex, startIndex + 2)+"'");
						}
						if(isNaN(dateString.charAt(startIndex)) || isNaN(dateString.charAt(startIndex + 1))){
							throw new Error("'"+RegExp.$1+"' double parse error to '"+dateString.substring(startIndex, startIndex + 2)+"'");
						}
						//仅取最大值2位
						p['H'].value = dateString.substring(startIndex, startIndex + 2);
					}
					
					if(p['H'].value.trim() == "" || isNaN(p['H'].value)){
						throw new Error("hour parse error:"+p['H'].value);
					}
					p['H'].value = parseInt(p['H'].value);
					
					if(ap == "pm"){
						p['H'].value = p['H'].value + 12;
					}
					i += len;
					continue;
				}
				
				//月、日、时分秒批量处理
				var isFind = false;
				for(var item in p){
					if(ch != item){
						continue;
					}
					isFind = true;
					//获取连续的长度
					new RegExp("("+ item +"+)").test(fmt);
					len = RegExp.$1.length;
					
					//截取数据
					startIndex = fmt.indexOf(RegExp.$1);
					if(len < 2){
						//最后一位
						if(startIndex == fmt.length - 1){
							if(dateString.length > fmt.length){
								p[item].value = dateString.substring(startIndex, startIndex + 2);
							}else{
								p[item].value = dateString.substring(startIndex, startIndex + 1);
							}
						}else{
							//检测下一位是否具有分隔符
							if(o.test(fmt.charAt(startIndex + 1))){
								throw new Error("single "+p[item].name+" format need divider.");
							}
							//数据后面1-2位必须拥有对应分隔符号
							if(fmt.charAt(startIndex + 1) != dateString.charAt(startIndex + 1) && fmt.charAt(startIndex + 1) != dateString.charAt(startIndex + 2)){
								throw new Error("single "+p[item].name+" format data divider not found,data:"+dateString);
							}
							//确定日期数据是几位
							if(dateString.charAt(startIndex + 1).trim() !="" && !isNaN(dateString.charAt(startIndex + 1)) && fmt.charAt(startIndex + 1) != dateString.charAt(startIndex + 1)){
								//非分隔字符亦非且是数字则认定为是单项扩展数据
								p[item].value = dateString.substring(startIndex, startIndex + 2);
								//数据更改，防止数据错位
								dateString = dateString.substring(0, startIndex) +item+ dateString.substring(startIndex + 2, dateString.length);
							}else{
								p[item].value = dateString.substring(startIndex, startIndex + 1);
							}
						}
					}else{
						if(startIndex == dateString.length - 1){
							throw new Error("'"+RegExp.$1+"' double parse error to '"+dateString.charAt(dateString.length - 1)+"'");
						}
						if(dateString.charAt(startIndex).trim() == "" || dateString.charAt(startIndex + 1).trim() == ""){
							throw new Error("'"+RegExp.$1+"' double parse error to '"+dateString.substring(startIndex, startIndex + 2)+"'");
						}
						if(isNaN(dateString.charAt(startIndex)) || isNaN(dateString.charAt(startIndex + 1))){
							throw new Error("'"+RegExp.$1+"' double parse error to '"+dateString.substring(startIndex, startIndex + 2)+"'");
						}
						//仅取最大值2位
						p[item].value = dateString.substring(startIndex, startIndex + 2);
					}
					if(p[item].value.trim() == "" || isNaN(p[item].value)){
						throw new Error(p[item].name+" parse error:"+p[item].value);
					}
					p[item].value = parseInt(p[item].value);
					
					i += len;
					break;
				}
				
				//没有找到抬走下一位
				if(!isFind){
					i ++;
				}
			}
			
			return new Date(year, parseInt(p["M"].value) - 1, p["d"].value, p["H"].value, p["m"].value, p["s"].value);
		};
	
		DateFormat.prototype.setPattern = function(pattern){
			if(typeof(pattern) == "string"){
				this._pattern = pattern;
			}
		};
		
		DateFormat.prototype.getPattern = function(){
			return this._pattern;
		};
		
		DateFormat.prototype._init = function(){
			this._pattern ="yyyy-MM-dd";
			if(typeof(pattern) == "string"){
				this._pattern = pattern;
			}
		};
		
		this._init();
	}
})();
(function(){
	var Descartes = Ele.Utils.Descartes = function() {
		this.eleType = "util";
		this.array = [];
	
		Descartes.prototype.addArray = function(array) {
			this.array.push(array);
		};
		Descartes.prototype.toStringDescartes = function() {
			var arr = [];
			for(var i in this.array){
				var yet = this.array[i];
				if(i == 0){
					for(var j in yet){
						arr.push(yet[j]);
					}
				}else{
					arr = this.copyString(arr, yet);
				}
			}
			return arr;
		};
		
		Descartes.prototype.copyString = function(arr, yet) {
			var temp = [];
			for(var i in arr){
				for(var j in yet){
					temp.push(arr[i] + yet[j]);
				}
			}
			return temp;
		};
		Descartes.prototype.toArrayDescartes = function() {
			var arr = [];
			for(var i in this.array){
				var yet = this.array[i];
				if(i == 0){
					for(var j in yet){
						arr.push([yet[j]]);
					}
				}else{
					arr = this.copyArray(arr, yet);
				}
			}
			return arr;
		};
		
		Descartes.prototype.copyArray = function(arr, yet) {
			var temp = [];
			for(var i in arr){
				for(var j in yet){
					temp.push(this.appendArray(arr[i], yet[j]));
				}
			}
			return temp;
		};
		
		Descartes.prototype.appendArray = function(arr, item) {
			var temp = [];
			for(var i in arr){
				temp.push(arr[i]);
			}
			temp.push(item);
			return temp;
		};
	};
})();
(function(){
	var Filter = Ele.Utils.Filter = function() {
		this.eleType = "util";
		this._injectionKey = ["&", "/", "\\", "\"", "'", "<",">"];
		
		Filter.prototype.isNumber = function(number) {
			var reg = /^(0|[1-9][0-9]*)$/;
			return reg.test(number);
		};
		
		Filter.prototype.isPhoneNumber = function(phoneNumber) {
			var reg = /^[1][3456789][0-9]{9}$/;
			return reg.test(phoneNumber);
		};
		
		Filter.prototype.isCount = function(count) {
			var reg = /^([1-9]|[1-9][0-9]*)$/;
			return reg.test(count);
		};
		Filter.prototype.isChinese = function(str) {
			var reg = /^[\u4E00-\u9FA5]$/;
			return reg.test(str);
		};
		Filter.prototype.isLetter = function(str) {
			var reg = /^[a-zA-Z]$/;
			return reg.test(str);
		};
		Filter.prototype.isUpper = function(str) {
			var reg = /^[A-Z]$/;
			return reg.test(str);
		};
		Filter.prototype.isLower = function(str) {
			var reg = /^[a-z]$/;
			return reg.test(str);
		};
	
		Filter.prototype.injectionKey = function(name) {
			var res = false;
			for (var i = 0, len = this._injectionKey.length; i < len; i++) {
				if (name.indexOf(this._injectionKey[i]) != -1) {
					res = true;
					break;
				}
			}
			return res;
		};
	};
})();
(function(){
	var Position = Ele.Utils.Position = function() {
		this.eleType = "util";
		this.positionType;
		this.left;
		this.top;
		this.right;
		this.bottom;
		this.toTop;
		this.toLeft;
		this.toScrollTop;
		this.toScrollLeft;
	
		Position.prototype._init = function() {
			this.positionType = "bottom-left";
			this.left = 0;
			this.top = 0;
			this.right = 0;
			this.bottom = 0;
		};
		Position.prototype.toPosition = function(ele){
			this.toTop = 0;
			this.toLeft = 0;
			this.toScrollTop = 0;
			this.toScrollLeft = 0;
			this._recursion(ele);
		};
		Position.prototype._recursion = function(ele){
			if(ele.offsetParent == null){
				return ;
			}
			this.toTop += ele.offsetParent.offsetTop;
			this.toLeft += ele.offsetParent.offsetLeft;
			this.toScrollTop += ele.offsetParent.scrollTop;
			this.toScrollLeft += ele.offsetParent.scrollLeft;
			this._recursion(ele.offsetParent);
		};
	
		Position.prototype.inTopLeft = function(ele) {
			if(!Ele._isElement(ele)){
				return ;
			}
			
			this.positionType = "top-left";
			this.toPosition(ele);
			var otop = ele.offsetTop + this.toTop;
			var oleft = ele.offsetLeft + this.toLeft;
			var scrollTop = this.toScrollTop;
			var scrollLeft = this.toScrollLeft;
			this.bottom = otop - scrollTop;
			this.left = oleft - scrollLeft;
		};
		Position.prototype.inTopRight = function(ele) {
			if(!Ele._isElement(ele)){
				return ;
			}
			this.positionType = "top-right";
			this.toPosition(ele);
			var otop = ele.offsetTop + this.toTop;
			var oleft = ele.offsetLeft + this.toLeft;
			var width = ele.offsetWidth;
			var scrollTop = this.toScrollTop;
			var scrollLeft = this.toScrollLeft;
			this.bottom = otop - scrollTop;
			this.right = oleft + width - scrollLeft;
		};
		Position.prototype.inBottomLeft = function(ele) {
			if(!Ele._isElement(ele)){
				return ;
			}
			this.positionType = "bottom-left";
			this.toPosition(ele);
			var otop = ele.offsetTop + this.toTop;
			var oleft = ele.offsetLeft + this.toLeft;
			var scrollTop = this.toScrollTop;
			var scrollLeft = this.toScrollLeft;
			var height = ele.offsetHeight;
			this.top = otop + height - scrollTop;
			this.left = oleft - scrollLeft;
		};
		Position.prototype.inBottomRight = function(ele) {
			if(!Ele._isElement(ele)){
				return ;
			}
			this.positionType = "bottom-right";
			this.toPosition(ele);
			var otop = ele.offsetTop + this.toTop;
			var oleft = ele.offsetLeft + this.toLeft;
			var width = ele.offsetWidth;
			var height = ele.offsetHeight;
			var scrollTop = this.toScrollTop;
			var scrollLeft = this.toScrollLeft;
			this.top = otop + height - scrollTop;
			this.right = oleft + width - scrollLeft;
		};
		Position.prototype.setOffset = function(size) {
			if(!(size instanceof Ele.Utils.Size)){
				return ;
			}
			if(this.positionType == "top-left"){
				this.left += size.width;
				this.bottom += size.height;
			}
			if(this.positionType == "top-right"){
				this.right += size.width;
				this.bottom += size.height;
			}
			if(this.positionType == "bottom-left"){
				this.left += size.width;
				this.top += size.height;
			}
			if(this.positionType == "bottom-right"){
				this.right += size.width;
				this.top += size.height;
			}
		};
		
		this._init();
	};
	var Size = Ele.Utils.Size = function(width, height) {
		this.eleType = "util";
		this.width;
		this.height;
	
		Size.prototype._init = function() {
			this.width = width;
			this.height = height;
		};
		
		this._init();
	};
})();
(function(){
	var Timer = Ele.Utils.Timer = function(funName, interval){
		this.eleType = "util";
		this._interval = 20;
		this._funName=function(){};
		this.data=null;
	
		Timer.prototype._init = function(){
			if(typeof(funName) == "function"){
				this._funName = funName;
			}
			if(typeof(interval) == "number"){
				this._interval = interval;
			}
		};
		Timer.prototype.setData = function(data){
			this.data = data;
		};
		Timer.prototype.execute = function(){
			this._exe(this);
		};
		
		Timer.prototype._exe = function(context){
			var res = context._funName(context.data);
			if(res){
				setTimeout(context._exe, context._interval, context);
			}
		};
		
		this._init();
	}
})();
(function(){
	var Validate = Ele.Utils.Validate = function() {
		this.eleType = "util";
		this.validates = [];
		this.filter;
		this.error;
		this._notEmpty = false;
	
		Validate.prototype.isEmpty = function(text){
			if(typeof(text) != "string" || text.trim() == ""){
				return true;
			}
			return false;
		};
	
		Validate.prototype.validate = function(text){
			var res = true;
			if(this._notEmpty){
				if(this.isEmpty(text)){
					this.error = "内容不能为空";
					return false;
				}
			}
			
			if(this.validates.length < 1){
				return true;
			}
			
			for(var i in this.validates){
				//长度限制
				if(this.validates[i] instanceof Limit){
					var len = text.length;
					if(len < this.validates[i].start){
						this.error = "长度不能少于"+this.validates[i].start;
						res = false;
						break;
					}
					if(len > this.validates[i].end){
						this.error = "长度不能多于"+this.validates[i].end;
						res = false;
						break;
					}
					continue;
				}
				
				//正则限制
				if(this.validates[i] instanceof Reg){
					if(!this.validates[i].test(text)){
						this.error = "正则验证失败";
						if(typeof(this.validates[i].errorMsg) == "string"){
							this.error = this.validates[i].errorMsg;
						}
						res = false;
						break;
					}
					continue;
				}
				
				//字母开头限制
				if(this.validates[i] instanceof StartWithLetter){
					var start = text.charAt(0);
					if(!this.filter.isLetter(start)){
						this.error = "请以字母开头";
						res = false;
						break;
					}
					continue;
				}
				
				//不包含中文限制
				if(this.validates[i] instanceof NoChinese){
					var inChinese = false;
					for(var index = 0; index < text.length; index ++){
						if(this.filter.isChinese(text.charAt(index))){
							inChinese = true;
							break;
						}   
					}
					if(inChinese){
						this.error = "内容不能包含中文字符";
						res = false;
						break;
					}
					continue;
				}
				//中文限制
				if(this.validates[i] instanceof AllChinese){
					var inNotChinese = false;
					for(var index = 0; index < text.length; index ++){
						if(!this.filter.isChinese(text.charAt(index))){
							inNotChinese = true;
							break;
						}   
					}
					if(inNotChinese){
						this.error = "内容仅限中文字符";
						res = false;
						break;
					}
					continue;
				}
				
				//注入字符限制
				if(this.validates[i] instanceof InjectionKey){
					var inKey = false;
					for(var index = 0; index < text.length; index ++){
						if(this.filter.injectionKey(text.charAt(index))){
							inKey = true;
							break;
						}   
					}
					if(inKey){
						this.error = "内容包含非法字符";
						res = false;
						break;
					}
					continue;
				}
				
			}
			return res;
		};
		Validate.prototype.addNotEmpty = function() {
			this._notEmpty = true;
		};
		Validate.prototype.addLimit = function(start, end) {
			if(typeof(start) != "number" || typeof(end) != "number"){
				return ;
			}
			if(start < 0 || end < 0){
				return ;
			}
			this._notEmpty = true;
			this.validates.push(new Limit(start, end));
		};
		Validate.prototype.addReg = function(reg, errorMsg) {
			if(!(reg instanceof RegExp)){
				return ;
			}
			this._notEmpty = true;
			this.validates.push(new Reg(reg, errorMsg));
		};
		
		Validate.prototype.addStartWithLetter = function (){
			this._notEmpty = true;
			this.validates.push(new StartWithLetter());
		};
		Validate.prototype.addNoChinese = function(){
			this._notEmpty = true;
			this.validates.push(new NoChinese());
		};
		Validate.prototype.addAllChinese = function(){
			this._notEmpty = true;
			this.validates.push(new AllChinese());
		};
		Validate.prototype.addInjectionKey = function(){
			this._notEmpty = true;
			this.validates.push(new InjectionKey());
		};
		
		Validate.prototype._init = function() {
			this.filter = new Ele.Utils.Filter();
		};
		
		this._init();
	};
	
	var Limit = function(start, end){
		this.start;
		this.end;
		
		Limit.prototype._init = function(){
			this.start = start;
			this.end = end;
		};
		
		this._init();
	};
	var Reg = function(reg, errorMsg){
		this.reg;
		this.errorMsg;
		
		Reg.prototype._init = function(){
			this.reg = reg;
			this.errorMsg = errorMsg;
		};
		Reg.prototype.test = function(text){
			return this.reg.test(text);
		};
		
		this._init();
	};
	var StartWithLetter = function(){};
	var NoChinese = function(){};
	var AllChinese = function(){};
	var InjectionKey = function(){};
})();
(function(){
	var WinInner = Ele.Utils.WinInner = function() {
		this.eleType = "util";
		this._width;
		this._height;
		this._handlers = [];
		var _ele_wininner_context = this;
	
		WinInner.prototype._init = function() {
			if (typeof(window.innerWidth) != "undefined") {
				this._width = window.innerWidth;
				this._height = window.innerHeight;
			} else if (typeof(document.documentElement) != "undefined" && typeof(document.documentElement.clientWidth) != "undefined" && document.documentElement.clientWidth != 0) {
				this._width = document.documentElement.clientWidth;
				this._height = document.documentElement.clientHeight;
			} else {
				this._width = document.getElementsByTagName('body')[0].clientWidth;
				this._height = document.getElementsByTagName('body')[0].clientHeight;
			}
		};
		WinInner.prototype._onResizeResponse = function(){
			_ele_wininner_context._init();
			if(_ele_wininner_context._handlers.length > 0){
				for(var i = 0; i < _ele_wininner_context._handlers.length; i ++){
					_ele_wininner_context._handlers[i](_ele_wininner_context._width,_ele_wininner_context._height);
				}
			}
		};
		
		WinInner.prototype.getWidth = function(){
			return this._width;
		};
		
		WinInner.prototype.getHeight = function(){
			return this._height;
		};
		
		WinInner.prototype.addResizeHandler = function(onResizeHandler){
			if(typeof(onResizeHandler) == "function"){
				this._handlers.push(onResizeHandler);
			}
		};
		
		this._init();
		window.addEventListener("resize",this._onResizeResponse,false);
	};
})();
(function(){
	var Board = Ele.Views.Board = function(isFull) {
		this.eleType = "layout";
		this.ele;
		this.view;
		
		Board.prototype._init = function(){
			if(typeof(isFull) == "boolean" && isFull){
				this.view = new Ele.Layout("ele_board_full");
			}else{
				this.view = new Ele.Layout("ele_board");
			}
			this.ele = this.view.ele;
		};
		
		Board.prototype.addBoard = function(board){
			this.view.add(board);
		};
		
		this._init();
	};
	
	var EmptyBoard = Ele.Views.EmptyBoard = function(){
		this.eleType = "layout";
		this.ele;
		this.view;
		this.board;
		
		EmptyBoard.prototype._init = function(){
			this.view = new Ele.Layout("ele_empty_board");
			this.board = new Ele.Layout("ele_board_view");
			this.ele = this.view.ele;
			this.view.add(this.board);
		};
		EmptyBoard.prototype.addView = function(bview){
			this.board.add(bview);
		};
		
		this._init();
	};
	
	var FullBoard = Ele.Views.FullBoard = function(){
		this.eleType = "layout";
		this.ele;
		this.view;
		this.board;
		
		FullBoard.prototype._init = function(){
			this.view = new Ele.Layout("ele_full_board");
			this.board = new Ele.Layout("ele_full_board_view ele_scrollbar");
			this.ele = this.view.ele;
			this.view.add(this.board);
		};
		FullBoard.prototype.addView = function(bview){
			this.board.add(bview);
		};
		
		this._init();
	};
	
	/**
	 * 两级化看板
	 */
	var EdgeBoard = Ele.Views.EdgeBoard = function(){
		this.eleType = "layout";
		this.ele;
		this.view;
		this._leftView;
		this._rightView;
		
		EdgeBoard.prototype._init = function(){
			var board = new EmptyBoard();
			this.view = board.view;
			this.ele = this.view.ele;
			this._leftView = new Ele.Layout("ele_fl");
			this._rightView = new Ele.Layout("ele_fr");
			var cl = new Ele.Layout("ele_cl");
			
			board.addView(this._leftView);
			board.addView(this._rightView);
			board.addView(cl);
		};
		EdgeBoard.prototype.setLeft = function(leftView){
			this._leftView.clear();
			this._leftView.add(leftView);
		};
		EdgeBoard.prototype.setRight = function(rightView){
			this._rightView.clear();
			this._rightView.add(rightView);
		};
		
		this._init();
	};
	
	/**
	 * 合并面板
	 */
	var MergeBoard = Ele.Views.MergeBoard = function(){
		this.eleType = "layout";
		this.ele;
		this.view;
		this.leftBoard;
		this.centerBoard;
		this.rightBoard;
		this._leftView;
		this._centerView;
		this._rightView;
		
		MergeBoard.prototype._init = function(){
			this.view = new Ele.Layout("ele_merge_board");
			this.leftBoard = new Ele.Layout("ele_merge_left_board");
			this.centerBoard = new Ele.Layout("ele_merge_center_board");
			this.rightBoard = new Ele.Layout("ele_merge_right_board");
			this.ele = this.view.ele;
			this.view.add(this.leftBoard);
			this.view.add(this.centerBoard);
			this.view.add(this.rightBoard);
			var cl = new Ele.Layout("ele_cl");
			this.view.add(cl);
			
			this._leftView = new Ele.Layout("ele_board_view");
			this._centerView = new Ele.Layout("ele_board_view");
			this._rightView = new Ele.Layout("ele_board_view");
			
			
			this.leftBoard.add(this._leftView);
			this.centerBoard.add(this._centerView);
			this.rightBoard.add(this._rightView);
		};
		MergeBoard.prototype.setLeft = function(leftView){
			this._leftView.clear();
			this._leftView.add(leftView);
		};
		MergeBoard.prototype.setCenter = function(centerView){
			this._centerView.clear();
			this._centerView.add(centerView);
		};
		MergeBoard.prototype.setRight = function(rightView){
			this._rightView.clear();
			this._rightView.add(rightView);
		};
		
		this._init();
	};
	
	/**
	 * 横向直线面板
	 */
	var HLineBoard = Ele.Views.HLineBoard = function(){
		this.eleType = "layout";
		this.ele;
		this.view;
		this.boards = [];
		this._cl;
		this._pc_default = 50;
		
		HLineBoard.prototype._init = function(){
			this.view = new Ele.Layout("ele_h_line_board");
			this.ele = this.view.ele;
			this._cl = new Ele.Layout("ele_cl");
			this.view.add(this._cl);
		};
		HLineBoard.prototype.addView = function(bview,percent){
			if(typeof(bview) != "object"){
				throw "method parameter 'bview' of add can't be empty.";
				return;
			}
			var pc = this._pc_default;
			if(typeof(percent) == "number"){
				pc = percent;
				if(pc < 0){
					pc = 0;
				}
				if(pc > 100){
					pc = 100;
				}
			}
			var board = new Ele.Layout("ele_h_line_content_board");
			board.ele.style.width = pc+"%";
			var view = new Ele.Layout("ele_board_view");
			board.add(view);
			view.add(bview);
			this.view.add(board);
		};
		
		this._init();
	};
	
})();
(function(){
	var ClusterCheckBoxView = Ele.Views.ClusterCheckBoxView = function() {
		this.eleType = "layout";
		this.ele;
		this.view;
		this.baseController;
		this.items;
		this.permissionLength;
		this._dataFormat = null;
		this._onDataSourcesLoad = null;
		
		ClusterCheckBoxView.prototype.setDataFormat = function(event){
			if(typeof(event) == "function"){
				this._dataFormat = event;
			}
		};
		ClusterCheckBoxView.prototype.setOnDataSourcesLoad = function(event){
			if(typeof(event) == "function"){
				this._onDataSourcesLoad = event;
			}
		};
		ClusterCheckBoxView.prototype.getValues = function(){
			if(this.items.length < 1){
				return "";
			}
			var values = "";
			for(var i in this.items){
				var arr = this.items[i].getSelectedValue();
				for(var j = 0; j < arr.length; j ++){
					values += arr[j]+",";
				}
			}
			if(values != ""){
				values = values.substr(0, values.length - 1);
			}
			return values;
		};
		ClusterCheckBoxView.prototype.setValues = function(values, format){
			if(this.items.length < 1){
				return ;
			}
			var arr = values.split(",");
			for(var val in arr){
				var value = arr[val];
				if(typeof(format) == "function"){
					value = format(value);
					if(typeof(value) == "undefined"){
						break;
					}
				}
				for(var i in this.items){
					var index = this.items[i].getIndexByValue(value);
					if(index != -1){
						this.items[i].select(index);
						break;
					}
				}
			}
		};
		ClusterCheckBoxView.prototype.getPermission = function(){
			if(this.items.length < 1){
				return "";
			}
			var permission = "";
			for(var i in this.items){
				var eles = this.items[i]._radios;
				var tp = [];
				if(eles.length > 0){
					for(var k = 0; k < eles.length; k ++){
						tp[k] = "0";
					}
				}
				var arr = this.items[i].getSelectedIndex();
				if(arr.length > 0){
					permission += "1";
				}else{
					permission += "0";
				}
				for(var j in arr){
					tp[arr[j]] = "1";
				}
				//组装
				for(var t in tp){
					permission += tp[t];
				}
			}
			return permission;
		};
		
		ClusterCheckBoxView.prototype.setPermission = function(permission){
			if(typeof(permission) != "string"){
				return ;
			}
			if(this.permissionLength != permission.length){
				return ;
			}
			if(this.items.length < 1){
				return ;
			}
			//解析权限游标
			var cursor = 0;
			for(var i in this.items){
				var eles = this.items[i]._radios;
				if(permission.charAt(cursor) == '0'){
					cursor += eles.length + 1;
					continue;
				}
				cursor ++;
				if(eles.length < 1){
					continue;
				}
				for(var j = 0; j < eles.length; j ++){
					if(permission.charAt(cursor) == '1'){
						this.items[i].select(j);
					}
					cursor ++;
				}
			}
		};
		
		ClusterCheckBoxView.prototype.add = function(args){
			if(this._dataFormat != null){
				this._dataFormat(args);
			}
			if(typeof(args.title) == "undefined"){
				args.title = "";
			}
			var item = new Ele.Layout("ele_permission_item");
			var root = new Ele.Layout("ele_permission_root");
			root.setHtml(args.title);
			item.add(root);
			var childView = new Ele.Layout("ele_permission_children");
			var child = new Ele.CheckGroup(args);
			childView.add(child);
			item.add(childView);
			
			this.view.add(item);
			this.items.push(child);
			this.permissionLength += args.items.length + 1;
		};
		//加载数据源
		ClusterCheckBoxView.prototype.loadDataSources = function(dataSources){
			if(!Ele._isArray(dataSources)){
				return ;
			}
			this.view.clear();
			this.items = [];
			this.permissionLength = 0;
			for(var i = 0; i < dataSources.length; i ++){
				this.add(dataSources[i]);
			}
			if(this._onDataSourcesLoad != null){
				this._onDataSourcesLoad();
			}
		};
		ClusterCheckBoxView.prototype._onDataResponse = function(dataSources){
			this.loadDataSources(dataSources);
		};
		ClusterCheckBoxView.prototype.loadDataSourcesUrl = function(url, method, funError){
			if(typeof(funError) == "function"){
				this._onErrorResponse = funError;
			}
			if(typeof(method) != "undefined" && method != "" && method != null){
				this.baseController.setMethod(method);
			}else{
				this.baseController.setMethod("GET");
			}
			this.baseController.loadData(url);
		};
		
		ClusterCheckBoxView.prototype._init = function(){
			this.view = new Ele.Layout("ele_permission_view");
			this.ele = this.view.ele;
			this.items = [];
			this.permissionLength = 0;
			
			var context = this;
			
			this.baseController = new Ele.Controllers.BaseController({
				loadHandler:function(data){
					context._onDataResponse(data);
				},
				errorHandler:function(error){
					if(context._onErrorResponse != null){
						context._onErrorResponse(error);
					}
				}
			});
		};
		
		this._init();
	};
})();
(function(){
	var FileView = Ele.Views.FileView = function(args) {
		this.eleType = "layout";
		this.ele;
		this.view;
		this.confirm;
		this.groupView;
		this.titleView;
		this.emptyView;
		this.tbGroup;
		this.listView;
		this.fileView;
		this.permission;
		this.groupController;
		this.fileController;
		this.gAddController;
		this.gDeleteController;
		this.fDeleteController;
		this._groupCount;
		this._groupSelect;
		this._items;//分组对象组
		this._pages;//页面控制器
		this._viewEvent;
		this._errorEvent;
		this._groupListUrl;
		this._fileListUrl;
		this._groupAddUrl;
		this._groupDeleteUrl;
		this._uploadUrl;
		this._updateUrl;
		this._deleteUrl;
		
		FileView.prototype.setTitle = function(title){
			if(typeof(title) == "string"){
				this.titleView.setHtml(title);
			}
		};
		FileView.prototype.setViewHandler = function(viewEvent){
			if(typeof(viewEvent) == "function"){
				this._viewEvent = viewEvent;
			}
		};
		FileView.prototype.setErrorHandler = function(errorEvent){
			if(typeof(errorEvent) == "function"){
				this._errorEvent = errorEvent;
			}
		};
		
		FileView.prototype.addGroup = function(name, value){
			var cellStyle = "ele_file_group_item ele_file_group_double";
			if(this._groupCount % 2 == 0){
				cellStyle = "ele_file_group_item ele_file_group_single";
			}
			var context = this;
			var item = new Ele.Layout(cellStyle);
			item.setHtml(name);
			item.ele.index = this._groupCount;
			item.ele.value = value;
			item.ele.onclick = function(){
				context.select(this.index, this.value);
			};
			this.groupView.add(item);
			this._items.push(item);
			this._groupCount ++;
		};
		FileView.prototype.addFile = function(file){
			var context = this;
			var view = new Ele.Layout("ele_file_item_view");
			var item = new Ele.Layout("ele_file_item");
			var deleteView = new Ele.Layout("ele_file_item_delete_view");
			var editView = new Ele.Layout("ele_file_item_edit_view");
			var delIcon = new Ele.Img(Ele._pathPrefix+"ele/"+Ele._skin+"/assets/64/icon_remove_white.png", "ele_file_item_icon");
			var editIcon = new Ele.Img(Ele._pathPrefix+"ele/"+Ele._skin+"/assets/64/icon_edit.png", "ele_file_item_icon");
			editView.ele.onclick = function(){
				context._pages.pushView(context._initPageEdit(file));
			};
			deleteView.ele.onclick = function(){
				if(context.confirm == null){
					var value = file.id;
					if(context._deleteUrl.url != null && context._deleteUrl.url.trim() != ""){
						context.fDeleteController.loadData(context._deleteUrl.url+"?file="+value);
						return ;
					}
					if(typeof(context._viewEvent) == "function"){
						context._viewEvent("fileDelete", {file:value});
					}
					return ;
				}
				context.confirm.setMsg("确认要删除该文件吗？");
				context.confirm.setSureHandler(function(){
					var value = file.id;
					if(context._deleteUrl.url != null && context._deleteUrl.url.trim() != ""){
						context.fDeleteController.loadData(context._deleteUrl.url+"?file="+value);
						return ;
					}
					if(typeof(context._viewEvent) == "function"){
						context._viewEvent("fileDelete", {file:value});
					}
				});
				context.confirm.show();
			};
			deleteView.add(delIcon);
			editView.add(editIcon);
			
			if(this.permission != null && this.permission.length == 7 && this.permission.charAt(6) == '1'){
				item.add(deleteView);
			}
			if(this.permission != null && this.permission.length == 7 && this.permission.charAt(5) == '1'){
				item.add(editView);
			}
			
			var img = new Ele.Img(file.url, "ele_file_item_img");
			var name = new Ele.Layout("ele_file_item_text");
			name.setHtml(file.name);
			var size = new Ele.Layout("ele_file_item_text ele_file_item_text_info");
			size.setHtml(file.size);
			item.add(img);
			item.add(name);
			item.add(size);
			view.add(item);
			
			this.fileView.add(view);
		};
		
		FileView.prototype.clearGroup = function(){
			this.groupView.clear();
			this._items.splice(0, this._groupCount);
			this._groupCount = 0;
		};
		
		FileView.prototype.select = function(index, value){
			if(index < 0 || this._groupSelect == index || index >= this._groupCount){
				return ;
			}
			var cellStyle = "ele_file_group_item ele_file_group_selected ele_file_group_double";
			if(index % 2 == 0){
				cellStyle = "ele_file_group_item ele_file_group_selected ele_file_group_single";
			}
			this._items[index].ele.className = cellStyle;
			if(this._groupSelect != -1){
				cellStyle = "ele_file_group_item ele_file_group_double";
				if(this._groupSelect % 2 == 0){
					cellStyle = "ele_file_group_item ele_file_group_single";
				}
				this._items[this._groupSelect].ele.className = cellStyle;
			}
			this._groupSelect = index;
			//获取对应的列表数据
			if(this._fileListUrl.url != null && this._fileListUrl.url.trim() != ""){
				if(this.permission != null && this.permission.length == 7 && this.permission.charAt(3) == '1'){
					this.fileController.loadData(this._fileListUrl.url+"?group="+value);
				}
			}
		};
		
		FileView.prototype._init = function(){
			this.view = new Ele.Layout("ele_file_view");
			this.ele = this.view.ele;
			this.confirm = null;
			this.permission = "1111111";
			this._groupCount = 0;
			this._groupSelect = -1;
			this._items = [];
			var context = this;
			if(typeof(args) == "object"){
				if(typeof(args.groupListUrl) == "string"){
					this._groupListUrl = {url:args.groupListUrl, method:"GET"};
				}else{
					this._groupListUrl = args.groupListUrl;
				}
				if(typeof(args.fileListUrl) == "string"){
					this._fileListUrl = {url:args.fileListUrl, method:"GET"};
				}else{
					this._fileListUrl = args.fileListUrl;
				}
				if(typeof(args.groupAddUrl) == "string"){
					this._groupAddUrl = {url:args.groupAddUrl, method:"POST"};
				}else{
					this._groupAddUrl = args.groupAddUrl;
				}
				if(typeof(args.groupDeleteUrl) == "string"){
					this._groupDeleteUrl = {url:args.groupDeleteUrl, method:"DELETE"};
				}else{
					this._groupDeleteUrl = args.groupDeleteUrl;
				}
				if(typeof(args.uploadUrl) == "string"){
					this._uploadUrl = {url:args.uploadUrl, method:"POST"};
				}else{
					this._uploadUrl = args.uploadUrl;
				}
				if(typeof(args.updateUrl) == "string"){
					this._updateUrl = {url:args.updateUrl, method:"PUT"};
				}else{
					this._updateUrl = args.updateUrl;
				}
				if(typeof(args.deleteUrl) == "string"){
					this._deleteUrl = {url:args.deleteUrl, method:"DELETE"};
				}else{
					this._deleteUrl = args.deleteUrl;
				}
				if(typeof(args.permission) == "string"){
					this.permission = args.permission;
				}
				if(typeof(args.confirm) != "undefined"){
					this.confirm = args.confirm;
				}
			}
			
			var groupPanle = new Ele.Layout("ele_file_group_view");
			this.groupView = new Ele.Layout("ele_file_group ele_scrollbar");
			groupPanle.add(this.groupView);
			
			var contentPanle = new Ele.Layout("ele_file_content_view");
			this._pages = new Ele.Views.PageControllerView();
			this._pages.pushView(this._initPageList());
			contentPanle.add(this._pages);
			
			this.titleView = new Ele.Layout("ele_file_title");
			this.titleView.setHtml("分组列表");
			var addView = new Ele.HLayout("ele_file_add");
			this.tbGroup = new Ele.TextBox({style:"ele_file_editgroup_style"});
			addView.add(this.tbGroup, {padding:"0 0 0 8px"});
			var btnAdd = new Ele.Button({text:"添加", onclick:function(){
				var name = context.tbGroup.getValue();
				if(context._groupAddUrl.url != null && context._groupAddUrl.url.trim() != ""){
					context.gAddController.loadData(context._groupAddUrl.url+"?groupName="+name);
					return ;
				}
				if(typeof(context._viewEvent) == "function"){
					context._viewEvent("addGroup", {name:name});
				}
			}});
			addView.add(btnAdd, {padding:"0 0 0 12px"});
			
			this.view.add(groupPanle);
			this.view.add(this.titleView);
			if(this.permission != null && this.permission.length == 7 && this.permission.charAt(1) == '1'){
				this.view.add(addView);
			}
			this.view.add(contentPanle);
			
			//如果绑定了分组数据源 自动加载
			if(typeof(this._groupListUrl) == "object"){
				this.groupController = new Ele.Controllers.BaseController({
					loadHandler:function(data){
						context._onDataResponse("groupList",data);
					},
					errorHandler:function(error){
						if(context._errorEvent != null){
							context._errorEvent(error);
						}
					}
				});
				this.groupController.setMethod(this._groupListUrl.method);
				if(this.permission != null && this.permission.length == 7 && this.permission.charAt(0) == '1'){
					this.groupController.loadData(this._groupListUrl.url);
				}
			}
			if(typeof(this._fileListUrl) == "object"){
				this.fileController = new Ele.Controllers.BaseController({
					loadHandler:function(data){
						context._onDataResponse("fileList",data);
					},
					errorHandler:function(error){
						if(context._errorEvent != null){
							context._errorEvent(error);
						}
					},
				});
				this.fileController.setMethod(this._fileListUrl.method);
			}
			if(typeof(this._groupAddUrl) == "object"){
				this.gAddController = new Ele.Controllers.BaseController({
					loadHandler:function(data){
						context._onDataResponse("groupAdd",data);
					},
					errorHandler:function(error){
						if(context._errorEvent != null){
							context._errorEvent(error);
						}
					},
				});
				this.gAddController.setMethod(this._groupAddUrl.method);
			}
			if(typeof(this._groupDeleteUrl) == "object"){
				this.gDeleteController = new Ele.Controllers.BaseController({
					loadHandler:function(data){
						context._onDataResponse("groupDelete",data);
					},
					errorHandler:function(error){
						if(context._errorEvent != null){
							context._errorEvent(error);
						}
					},
				});
				this.gDeleteController.setMethod(this._groupDeleteUrl.method);
			}
			if(typeof(this._deleteUrl) == "object"){
				this.fDeleteController = new Ele.Controllers.BaseController({
					loadHandler:function(data){
						context._onDataResponse("fileDelete",data);
					},
					errorHandler:function(error){
						if(context._errorEvent != null){
							context._errorEvent(error);
						}
					},
				});
				this.fDeleteController.setMethod(this._deleteUrl.method);
			}
		};
		
		FileView.prototype._onDataResponse = function(type, data){
			if(type == "groupList"){
				this.clearGroup();
				for(var i in data){
					this.addGroup(data[i].name, data[i].value);
				}
				if(this._groupCount > 0){
					//初始化第一条数据
					if(this._groupSelect != -1){
						var temp = this._groupSelect;
						this._groupSelect = -1;
						this.select(temp, data[temp].value);
					}else{
						this.select(0, data[0].value);
					}
				}
				return ;
			}
			if(type == "fileList"){
				//数据设置
				this.listView.clear();
				var len = data.length;
				if(len > 0){
					this.fileView.clear();
					for(var i = 0; i < len; i++){
						this.addFile(data[i]);
					}
					this.listView.add(this.fileView);
				}else{
					this.listView.add(this.emptyView);
				}
				return ;
			}
			if(type == "groupAdd"){
				this.groupController.loadData(this._groupListUrl);
				return ;
			}
			if(type == "groupDelete"){
				this._groupSelect = -1;
				this.groupController.loadData(this._groupListUrl.url);
				return ;
			}
			if(type == "fileDelete"){
				var value = this._items[this._groupSelect].ele.value;
				if(this._fileListUrl.url != null && this._fileListUrl.url.trim() != ""){
					this.fileController.loadData(this._fileListUrl.url+"?group="+value);
				}
				return ;
			}
		};
		
		FileView.prototype._initPageList = function(){
			var view = new Ele.Layout("ele_file_content");
			var barView = new Ele.HLayout("ele_file_content_bar");
			var left = new Ele.Layout("ele_file_content_bar_edge");
			var center = new Ele.Layout("ele_file_content_bar_center");
			center.setHtml("文件列表");
			var right = new Ele.Layout("ele_file_content_bar_edge");
			right.setAlign("right");
			var context = this;
			var mn_add = new Ele.IconLabel({text:"添加文件",icon:Ele._pathPrefix+"ele/"+Ele._skin+"/assets/64/icon_add.png",
			focusIcon:Ele._pathPrefix+"ele/"+Ele._skin+"/assets/64/icon_add_focus.png",onclick:function (){
				context._pages.pushView(context._initPageAdd());
			}});
			var mn_delete = new Ele.IconLabel({text:"删除该分组",icon:Ele._pathPrefix+"ele/"+Ele._skin+"/assets/64/icon_remove.png",
			focusIcon:Ele._pathPrefix+"ele/"+Ele._skin+"/assets/64/icon_remove_focus.png",onclick:function (){
				if(context.confirm == null){
					var value = context._items[context._groupSelect].ele.value;
					if(context._groupDeleteUrl.url != null && context._groupDeleteUrl.url.trim() != ""){
						context.gDeleteController.loadData(context._groupDeleteUrl.url+"?group="+value);
						return ;
					}
					if(typeof(context._viewEvent) == "function"){
						context._viewEvent("groupDelete", {group:value});
					}
					return ;
				}
				context.confirm.setMsg("确认要删除该分组吗？");
				context.confirm.setSureHandler(function(){
					var value = context._items[context._groupSelect].ele.value;
					if(context._groupDeleteUrl.url != null && context._groupDeleteUrl.url.trim() != ""){
						context.gDeleteController.loadData(context._groupDeleteUrl.url+"?group="+value);
						return ;
					}
					if(typeof(context._viewEvent) == "function"){
						context._viewEvent("groupDelete", {group:value});
					}
				});
				context.confirm.show();
			}});
			if(this.permission != null && this.permission.length == 7 && this.permission.charAt(2) == '1'){
				left.add(mn_delete);
			}
			if(this.permission != null && this.permission.length == 7 && this.permission.charAt(4) == '1'){
				right.add(mn_add);
			}
			
			barView.add(left, {width:"40%"});
			barView.add(center, {width:"20%"});
			barView.add(right, {width:"40%"});
			view.add(barView);
			this.listView = new Ele.Layout("ele_file_content_body ele_scrollbar");
			this.fileView = new Ele.Layout("ele_file_list_view");
			this.emptyView = new Ele.VLayout("ele_file_empty");
			var emptyImage = new Ele.Img(Ele._pathPrefix+"ele/"+Ele._skin+"/assets/empty.png","ele_file_empty_image");
			var label = new Ele.Label("暂无数据");
			this.emptyView.add(emptyImage,{padding:"96px 0 0 0"});
			this.emptyView.add(label);
			this.listView.add(this.emptyView);
			view.add(this.listView);
			return view;
		};
		
		FileView.prototype._initPageAdd = function(){
			var view = new Ele.Layout("ele_file_content");
			var barView = new Ele.HLayout("ele_file_content_bar");
			var left = new Ele.Layout("ele_file_content_bar_edge");
			var center = new Ele.Layout("ele_file_content_bar_center");
			center.setHtml("添加文件");
			var right = new Ele.Layout("ele_file_content_bar_edge");
			right.setAlign("right");
			var context = this;
			var mn_back = new Ele.IconLabel({text:"返回",icon:Ele._pathPrefix+"ele/"+Ele._skin+"/assets/64/icon_previous.png",
			focusIcon:Ele._pathPrefix+"ele/"+Ele._skin+"/assets/64/icon_previous_focus.png",onclick:function (isRoot, data){
				context._pages.pullView();
			}});
			var mn_position = new Ele.IconLabel({text:"文件列表 / 添加文件",style:"ele_icon_label ele_icon_label_none",icon:Ele._pathPrefix+"ele/"+Ele._skin+"/assets/64/icon_position.png"});
			right.add(mn_position);
			left.add(mn_back);
			barView.add(left, {width:"40%"});
			barView.add(center, {width:"20%"});
			barView.add(right, {width:"40%"});
			view.add(barView);
			var body = new Ele.Layout("ele_file_content_body ele_scrollbar");
			var form = new Ele.Layout("ele_file_form");
			var formView = new Ele.Views.FormView();
			var textBoxItem = new Ele.Views.TextBoxItem({
				name:"fileName",
				text:"文件名称",
				hint:"请输入",
			});
			textBoxItem.validateNotEmpty();
			var fileItem = new Ele.Views.FileItem({
				name:"file",
				text:"文件",
			});
			fileItem.validateNotEmpty();
			formView.setEnctypeMfd();
			formView.addItem(textBoxItem);
			formView.addItem(fileItem);
			form.add(formView);
			
			var btnView = new Ele.HLayout("ele_file_form_button_panel");
			var reset = new Ele.Button({
				text:"重置",
				icon:Ele._pathPrefix+"ele/"+Ele._skin+"/assets/64/icon_reset.png",
				onclick:function(){
					formView.reset();
					if(typeof(context._viewEvent) == "function"){
						context._viewEvent("reset", {});
					}
				}
			});
			var submit = new Ele.Button({
				text:"提交",
				icon:Ele._pathPrefix+"ele/"+Ele._skin+"/assets/64/icon_submit.png",
				onclick:function(){
					if(!formView.validate()){
						return ;
					}
					if(context._uploadUrl.url != null && context._uploadUrl.url.trim() != ""){
						formView.setAction(context._uploadUrl.url+"?group="+context._items[context._groupSelect].ele.value);
						formView.setMethod(context._uploadUrl.method);
						formView.submitFormAjax(function(res){
							var result = JSON.parse(res);
							if(result.resCode != 1000 && context._errorEvent != null){
								var error = {
									resCode:result.resCode,
									resMsg:result.resMsg
								};
								context._errorEvent(error);
								return ;
							}
							context._pages.pullView();
							var value = context._items[context._groupSelect].ele.value;
							if(context._fileListUrl.url != null && context._fileListUrl.url.trim() != ""){
								context.fileController.loadData(context._fileListUrl.url+"?group="+value);
							}
						});
						return ;
					}
					if(typeof(context._viewEvent) == "function"){
						context._viewEvent("upload", {formView:formView});
					}
				}
			});
			btnView.add(reset, {padding:"0 0 0 176px"});
			btnView.add(submit, {padding:"0 0 0 16px"});
			form.add(btnView);
			
			body.add(form);
			
			view.add(body);
			return view;
		};
		
		FileView.prototype._initPageEdit = function(file){
			var view = new Ele.Layout("ele_file_content");
			var barView = new Ele.HLayout("ele_file_content_bar");
			var left = new Ele.Layout("ele_file_content_bar_edge");
			var center = new Ele.Layout("ele_file_content_bar_center");
			center.setHtml("修改文件");
			var right = new Ele.Layout("ele_file_content_bar_edge");
			right.setAlign("right");
			var context = this;
			var mn_back = new Ele.IconLabel({text:"返回",icon:Ele._pathPrefix+"ele/"+Ele._skin+"/assets/64/icon_previous.png",
			focusIcon:Ele._pathPrefix+"ele/"+Ele._skin+"/assets/64/icon_previous_focus.png",onclick:function (isRoot, data){
				context._pages.pullView();
			}});
			var mn_position = new Ele.IconLabel({text:"文件列表 / 修改文件",style:"ele_icon_label ele_icon_label_none",icon:Ele._pathPrefix+"ele/"+Ele._skin+"/assets/64/icon_position.png"});
			right.add(mn_position);
			left.add(mn_back);
			barView.add(left, {width:"40%"});
			barView.add(center, {width:"20%"});
			barView.add(right, {width:"40%"});
			view.add(barView);
			var body = new Ele.Layout("ele_file_content_body ele_scrollbar");
			var form = new Ele.Layout("ele_file_form");
			var imageView = new Ele.Layout("ele_file_editfile_view");
			var image = new Ele.Img(file.url, "ele_file_editfile_image");
			imageView.add(image);
			form.add(imageView);
			
			var formView = new Ele.Views.FormView();
			var textBoxItem = new Ele.Views.TextBoxItem({
				name:"fileName",
				text:"文件名称",
				hint:"请输入",
				value:file.name
			});
			textBoxItem.validateNotEmpty();
			
			formView.appendFormData("file", file.id);
			formView.addItem(textBoxItem);
			form.add(formView);
			
			var btnView = new Ele.HLayout("ele_file_form_button_panel");
			var reset = new Ele.Button({
				text:"重置",
				icon:Ele._pathPrefix+"ele/"+Ele._skin+"/assets/64/icon_reset.png",
				onclick:function(){
					formView.reset();
					if(typeof(context._viewEvent) == "function"){
						context._viewEvent("reset", {});
					}
				}
			});
			var submit = new Ele.Button({
				text:"提交",
				icon:Ele._pathPrefix+"ele/"+Ele._skin+"/assets/64/icon_submit.png",
				onclick:function(){
					if(!formView.validate()){
						return ;
					}
					
					if(context._updateUrl.url != null && context._updateUrl.url.trim() != ""){
						formView.setAction(context._updateUrl.url);
						formView.setMethod(context._updateUrl.method);
						formView.submitAjax(function(res){
							var result = JSON.parse(res);
							if(result.resCode != 1000 && context._errorEvent != null){
								var error = {
									resCode:result.resCode,
									resMsg:result.resMsg
								};
								context._errorEvent(error);
								return ;
							}
							context._pages.pullView();
							var value = context._items[context._groupSelect].ele.value;
							if(context._fileListUrl.url != null && context._fileListUrl.url.trim() != ""){
								context.fileController.loadData(context._fileListUrl.url+"?group="+value);
							}
						});
						return ;
					}
					if(typeof(context._viewEvent) == "function"){
						context._viewEvent("fileUpdate", {file:file.id});
					}
				}
			});
			btnView.add(reset, {padding:"0 0 0 176px"});
			btnView.add(submit, {padding:"0 0 0 16px"});
			form.add(btnView);
			
			body.add(form);
			
			view.add(body);
			return view;
		};
		
		this._init();
	};
})();
(function(){
	var FormItemView = Ele.Views.FormItemView = function() {};
	var FormItem = function() {
		this.eleType = "layout";
		this.ele;
		this.view;
		this.label;
		this.width=614;
		this.tip;
		this.tipText;
		this._validate;
		
		FormItem.prototype.showMessage = function(msg){
			this.tipText.setText(msg);
			this.tip.ele.style.display = "block";
		};
		
		FormItem.prototype.clearMessage = function(){
			this.tipText.setText("");
			this.tip.ele.style.display = "none";
		};
		FormItem.prototype.validateNotEmpty = function(){
			this._validate.addNotEmpty();
		};
		FormItem.prototype.validateLimit = function(start, end){
			this._validate.addLimit(start, end);
		};
		FormItem.prototype.validateReg = function(reg, errorMsg){
			this._validate.addReg(reg, errorMsg);
		};
		FormItem.prototype.validateStartWithLetter = function(){
			this._validate.addStartWithLetter();
		};
		FormItem.prototype.validateNoChinese = function(){
			this._validate.addNoChinese();
		};
		FormItem.prototype.validateAllChinese = function(){
			this._validate.addAllChinese();
		};
		FormItem.prototype.validateInjectionKey = function(){
			this._validate.addInjectionKey();
		};
		FormItem.prototype.setHeight = function(height){
			if(typeof(height) == "number" && height > 34){
				this.view.setSize("auto", height+"px");
				this.label.ele.style.height = height+"px";
				this.label.ele.style.lineHeight = height+"px";
				this.tip.ele.style.paddingTop = ((height - 34)/2)+"px";
			}
		};
		
		FormItem.prototype.initView = function(lableText, view, height){
			this.view = new Ele.HLayout("ele_form_item_view");
			this.ele = this.view.ele;
			this._validate = new Ele.Utils.Validate();
			
			var text = "Label:";
			if(typeof(lableText) == "string"){
				text = lableText+":";
			}
			this.label = new Ele.Label(text, "ele_form_item_text");
			this.tip = new Ele.HLayout("ele_form_item_tip");
			var errorIcon = new Ele.Img(Ele._pathPrefix+"ele/"+Ele._skin+"/assets/64/icon_error.png", "ele_form_item_tip_icon");
			this.tipText = new Ele.Label("","ele_form_item_tip_text"); 
			this.tip.add(errorIcon);
			this.tip.add(this.tipText, {padding:"0 0 0 8px"});
			
			this.view.add(this.label,{width:"140px", align:"right"});
			this.view.add(view,{width:"220px", padding:"0 0 0 20px"});
			this.view.add(this.tip,{width:"224px", padding:"0 0 0 10px"});
			
			this.setHeight(height);
		};
	};
	
	/**
	 * @param {Object} args
	 * 隐藏组件
	 */
	var HiddenItem = Ele.Views.HiddenItem = function(args) {
		this.eleType = "layout";
		this.ele;
		this.view;
		this.name;
		this.hditem;
		
		HiddenItem.prototype.formString = function(){
			if(typeof(this.name) != "string" || this.name.trim() == ""){
				return null;
			}
			return this.name+"="+this.getValue();
		};
		
		HiddenItem.prototype.setValue = function(value){
			this.hditem.setValue(value);
		};
		
		HiddenItem.prototype.reset = function(){
			this.setValue("");
		};
		
		HiddenItem.prototype.getValue = function(){
			return this.hditem.getValue();
		};
		
		HiddenItem.prototype._init = function(){
			this.view = new Ele.HLayout("ele_form_hidden_view");
			this.ele = this.view.ele;
			
			//初始化布局组件
			this.hditem = new Ele.TextBox();
			this.hditem.ele.type = "hidden";
			
			var context = this;
			if(typeof(args) != "undefined"){
				if(typeof(args.name) == "string"){
					this.name = args.name;
					this.hditem.ele.name = this.name;
				}
				if(typeof(args.value) != "undefined"){
					this.hditem.setValue(args.value);
				}
			}
			this.view.add(this.hditem);
		};
		
		this._init();
	};
	
	/**
	 * @param {Object} args
	 * 时间选择组件
	 */
	var DateBoxItem = Ele.Views.DateBoxItem = function(args) {
		FormItem.call(this);
		
		this.item;
		this.name;
		this.dateBox;
		
		DateBoxItem.prototype.setWindowOffset = function(size){
			this.dateBox.setWindowOffset(size);
		};
		
		DateBoxItem.prototype.validate = function(){
			var res = this._validate.validate(this.getValue()+"");
			if(res){
				this.clearMessage();
				this.dateBox.clearErrorStyle();
			}else{
				this.showMessage(this._validate.error);
				this.dateBox.showErrorStyle();
			}
			return res;
		};
		
		DateBoxItem.prototype.formString = function(){
			if(this._validate.isEmpty(this.name)){
				return null;
			}
			return this.name+"="+this.getValue();
		};
		DateBoxItem.prototype.setPattern = function(pattern){
			return this.dateBox.setPattern(pattern);
		};
		
		DateBoxItem.prototype.setValue = function(value){
			this.dateBox.setValue(value);
		};
		
		DateBoxItem.prototype.reset = function(){
			this.clearMessage();
			this.dateBox.clearErrorStyle();
			this.dateBox.reset();
		};
		DateBoxItem.prototype.readOnly = function(readOnly){
			this.dateBox.setDisable(readOnly);
		};
		
		DateBoxItem.prototype.getValue = function(){
			return this.dateBox.getValue();
		};
		DateBoxItem.prototype._updateValue = function(index){
			this.hditem.setValue(this.dateBox.getValue());
		};
		
		DateBoxItem.prototype._init = function(){
			//初始化布局组件
			var context = this;
			this.item = new Ele.Layout();
			
			var text = "";
			var opts = {
				selectChange:function(index){
					context._updateValue(index);
				}
			};
			
			var value = "";
			if(typeof(args) != "undefined"){
				if(typeof(args.name) == "string"){
					this.name = args.name;
				}
				if(typeof(args.text) == "string"){
					text = args.text;
				}
				if(typeof(args.windowType) == "boolean"){
					opts.windowType = args.windowType;
				}
				if(typeof(args.readOnly) == "boolean"){
					opts.disable = args.readOnly;
				}
				if(typeof(args.value) != "undefined"){
					value = args.value;
				}
			}
			this.dateBox = new Ele.DateBox(opts);
			if(value != ""){
				this.setValue(value);
			}
			if(typeof(this.name) == "string"){
				this.dateBox.edit.ele.name = this.name;
			}
			this.item.add(this.dateBox);
			this.initView(text, this.item);
		};
		
		this._init();
	};
	
	/**
	 * @param {Object} args
	 * 复选框组件
	 */
	var CheckBoxItem = Ele.Views.CheckBoxItem = function(args) {
		FormItem.call(this);
		
		this.item;
		this.name;
		this.hditem;
		this.checkGroup;
		this.lines;
		this.width = 202;
		
		CheckBoxItem.prototype.validate = function(){
			var res = this._validate.validate(this.getValueString());
			if(res){
				this.clearMessage();
			}else{
				this.showMessage(this._validate.error);
			}
			return res;
		};
		
		CheckBoxItem.prototype.formString = function(){
			if(typeof(this.name) != "string" || this.name.trim() == ""){
				return null;
			}
			return this.name+"="+this.getValueString();
		};
		
		CheckBoxItem.prototype.setValue = function(value){
			this.checkGroup.selectByValue(value);
			this.hditem.setValue(value);
		};
		
		CheckBoxItem.prototype.reset = function(){
			this.checkGroup.clearSelected();
			this.hditem.setValue("");
		};
		
		CheckBoxItem.prototype.getSelectTextString = function(){
			var arr = this.checkGroup.getSelectedText();
			var res = "";
			if(arr.length > 0){
				for(var i = 0; i < arr.length; i ++){
					res += arr[i];
					if(i < arr.length - 1){
						res += ","
					}
				}
			}
			return res;
		};
		
		CheckBoxItem.prototype.getValueString = function(){
			var arr = this.checkGroup.getSelectedValue();
			var value = "";
			for(var i in arr){
				value += arr[i];
				if(i < arr.length - 1){
					value += ","
				}
			}
			return value;
		};
		
		CheckBoxItem.prototype.setValueString = function(value){
			if(typeof(value) != "string" || value.trim() == ""){
				return ;
			}
			var arr = value.split(",");
			for(var i in arr){
				this.setValue(arr[i]);
			}
		};
		
		CheckBoxItem.prototype.getValues = function(){
			return this.checkGroup.getSelectedValue();
		};
		
		CheckBoxItem.prototype.readOnly = function(readOnly){
			this.checkGroup.disable(readOnly);
		};
		
		CheckBoxItem.prototype._updateValue = function(index){
			this.hditem.setValue(this.getValueString());
		};
		
		CheckBoxItem.prototype._updateView = function(viewSize){
			//自定义lines优先
			if(this.lines > 0){
				return ;
			}
			var tlen = 0;
			var inLine = false;
			for(var i in viewSize){
				var line = parseInt(viewSize[i].height / 24);
				if(line > 1){
					this.lines += line;
					tlen = 0;
					inLine = false;
					continue;
				}
				if(!inLine){
					this.lines ++;
					inLine = true;
				}
				tlen += viewSize[i].width;
				if(tlen < this.width){
					continue;
				}
				if(tlen == this.width){
					tlen = 0;
					inLine = false;
					continue;
				}
				tlen = viewSize[i].width;
				this.lines ++;
			}
			if(this.lines < 1){
				this.lines = 1;
			}
			var height = (this.lines * 24) + 10;
			this.setHeight(height);
		};
		
		CheckBoxItem.prototype._init = function(){
			
			//初始化布局组件
			this.item = new Ele.Layout("ele_form_checkbox");
			this.hditem = new Ele.TextBox();
			this.hditem.ele.type = "hidden";
			
			var context = this;
			this.lines = 0;
			var lines = 1;
			var text = "";
			var disable = false;
			
			if(typeof(args) != "undefined"){
				if(typeof(args.name) == "string"){
					this.name = args.name;
					this.hditem.ele.name = this.name;
				}
				if(typeof(args.lines) == "number"){
					lines = parseInt(args.lines);
					this.lines = lines;
				}
				if(typeof(args.text) == "string"){
					text = args.text;
				}
				if(typeof(args.readOnly) == "boolean" && args.readOnly){
					disable = true;
				}
				var opts = {
					onload:function(viewSize){
						context._updateView(viewSize);
					},
					selectChange:function(index){
						context._updateValue(index);
					},
					disable:disable,
					items:args.items
				};
				this.checkGroup = new Ele.CheckGroup(opts);
			}
			
			this.item.add(this.hditem);
			this.item.add(this.checkGroup);
			
			var height = (lines * 24) + 10;
			this.initView(text, this.item, height);
		};
		
		this._init();
	};
	
	/**
	 * @param {Object} args
	 * 选择框组件
	 */
	var SelectBoxItem = Ele.Views.SelectBoxItem = function(args) {
		FormItem.call(this);
		
		this.item;
		this.name;
		this.hditem;
		this.selectBox;
		
		SelectBoxItem.prototype.setWindowOffset = function(size){
			this.selectBox.setWindowOffset(size);
		};
		SelectBoxItem.prototype.setOnDataLoad = function(event){
			this.selectBox.setOnDataLoad(event);
		};
		SelectBoxItem.prototype.setOnSelectChange = function(event){
			this.selectBox.setOnSelectChange(event);
		};
		SelectBoxItem.prototype.setOnFilterSearch = function(event){
			this.selectBox.setOnFilterSearch(event);
		};
		
		SelectBoxItem.prototype.setFilterData = function (data){
			this.selectBox.setFilterData(data);
		};
		
		SelectBoxItem.prototype.validate = function(){
			var res = this._validate.validate(this.getValue()+"");
			if(res){
				this.clearMessage();
				this.selectBox.clearErrorStyle();
			}else{
				this.showMessage(this._validate.error);
				this.selectBox.showErrorStyle();
			}
			return res;
		};
		
		SelectBoxItem.prototype.itemCount = function(){
			return this.selectBox.count;
		};
		SelectBoxItem.prototype.addOptionValue = function(text, value){
			this.selectBox.addOptionValue(text, value);
		};
		SelectBoxItem.prototype.addOption = function(option){
			this.selectBox.addOption(option);
		};
		
		SelectBoxItem.prototype.formString = function(){
			if(this._validate.isEmpty(this.name)){
				return null;
			}
			return this.name+"="+this.getValue();
		};
		
		SelectBoxItem.prototype.loadDataSourcesUrl = function(url, method, funError){
			this.selectBox.loadDataSourcesUrl(url, method, funError);
		};
		SelectBoxItem.prototype.loadFilterDataSourcesUrl = function(url, keyValue, method, funError){
			this.selectBox.loadFilterDataSourcesUrl(url, keyValue, method, funError);
		};
		
		SelectBoxItem.prototype.setValue = function(value){
			this.selectBox.setValue(value);
		};
		
		SelectBoxItem.prototype.reset = function(){
			this.clearMessage();
			this.selectBox.reset();
			this.hditem.setValue("");
		};
		SelectBoxItem.prototype.clear = function(){
			this.reset();
			this.selectBox.setOptions([]);
		};
		SelectBoxItem.prototype.readOnly = function(readOnly){
			this.selectBox.setDisable(readOnly);
		};
		
		SelectBoxItem.prototype.getValue = function(){
			return this.selectBox.getValue();
		};
		SelectBoxItem.prototype._updateValue = function(index){
			if(index == -1){
				this.hditem.setValue("");
				return ;
			}
			this.hditem.setValue(this.selectBox.getValue());
		};
		
		SelectBoxItem.prototype._init = function(){
			//初始化布局组件
			var context = this;
			this.item = new Ele.Layout();
			
			var text = "";
			var opts = {
				selectChange:function(index){
					context._updateValue(index);
				}
			};
			
			this.hditem = new Ele.TextBox();
			this.hditem.ele.type = "hidden";
			var value = "";
			if(typeof(args) != "undefined"){
				if(typeof(args.name) == "string"){
					this.name = args.name;
					this.hditem.ele.name = args.name;
				}
				if(typeof(args.text) == "string"){
					text = args.text;
				}
				if(typeof(args.windowType) == "boolean"){
					opts.windowType = args.windowType;
				}
				if(typeof(args.readOnly) == "boolean"){
					opts.disable = args.readOnly;
				}
				if(typeof(args.value) != "undefined"){
					value = args.value;
				}
				if(typeof(args.items) != "undefined"){
					opts.items = args.items;
				}
				if(typeof(args.filterSearch) == "function"){
					opts.filterSearch = args.filterSearch;
				}
			}
			this.selectBox = new Ele.SelectBox(opts);
			if(value != ""){
				this.setValue(value);
			}
			this.item.add(this.hditem);
			this.item.add(this.selectBox);
			this.initView(text, this.item);
		};
		
		this._init();
	};
	
	/**
	 * @param {Object} args
	 * 文件选择组件
	 */
	var FileItem = Ele.Views.FileItem = function(args) {
		FormItem.call(this);
		
		this.item;
		this.name;
		this.hditem;
		this.valueView;
		this.fileView;
		this.deleteView;
		this.value;
		this._readOnly;
		
		FileItem.prototype.validate = function(){
			var res = this._validate.validate(this.getValue());
			if(res){
				this.clearMessage();
			}else{
				this.showMessage(this._validate.error);
			}
			return res;
		};
		
		FileItem.prototype.appendToFormData = function(formData){
			if(typeof(formData) != "object"){
				return ;
			}
			if(!(formData instanceof FormData)){
				return ;
			}
			if(this._validate.isEmpty(this.name)){
				return ;
			}
			formData.append(this.name, this.getFormData());
		};
		
		FileItem.prototype.formString = function(){
			if(this._validate.isEmpty(this.name)){
				return null;
			}
			return this.name+"="+this.getValue();
		};
		FileItem.prototype.readOnly = function(readOnly){
			if(typeof(readOnly) == "boolean"){
				this._readOnly = readOnly;
			}
		};
		
		FileItem.prototype.setValueUrl = function(url){
			if(typeof(url) != "string"){
				return ;
			}
			var suffix = "";
			if(url.indexOf(".") != -1){
				var arr = url.split(".");
				suffix = arr[arr.length - 1].toLowerCase();
			}
			this.value = url;
			this.valueView.setHtml(url);
			this.deleteView.ele.style.display = "block";
			//图片类型文件处理
			if(suffix == "png" || suffix == "jpg" || suffix == "jpeg" || suffix == "gif"){
				var img = new Ele.Img(url, "ele_form_file_icon");
				this.fileView.clear();
				this.fileView.add(img);
				return ;
			}
			
			//非图片类型文件处理
			var txt = new Ele.Layout("ele_form_file_text");
			txt.setHtml(suffix);
			txt.setAlign("center");
			this.fileView.clear();
			this.fileView.add(txt);
		};
		
		FileItem.prototype.reset = function(){
			this.clearMessage();
			this.deleteView.ele.style.display = "none";
			this.valueView.setHtml("请选择文件...");
			this.value = "";
			this.fileView.clear();
			var icon = new Ele.Img(Ele._pathPrefix+"ele/"+Ele._skin+"/assets/64/icon_file_add.png", "ele_form_file_icon");
			this.fileView.add(icon);
			this.hditem.setValue("");
		};
		
		FileItem.prototype.getValue = function(){
			return this.value;
		};
		
		FileItem.prototype.getFormData = function(){
			return this.hditem.ele.files[0];
		};
		FileItem.prototype.accept = function(accept){
			this.hditem.ele.accept = accept;
		};
		FileItem.prototype.acceptImage = function(){
			this.accept("image/*");
		};
		
		FileItem.prototype._setValueData = function(value, prefix, suffix){
			//图片文件类型预览处理
			if(prefix.toLowerCase() == "image"){
				var img = new Ele.Img(value, "ele_form_file_icon");
				this.fileView.clear();
				this.fileView.add(img);
				this.value = value;
				return ;
			}
			//非图片类型文件处理
			var txt = new Ele.Layout("ele_form_file_text");
			txt.setHtml(suffix);
			txt.setAlign("center");
			this.fileView.clear();
			this.fileView.add(txt);
			this.value = value;
		};
		FileItem.prototype._onDelete = function(){
			if(this._readOnly){
				return;
			}
			this.reset();
		};
		FileItem.prototype._onChange = function(){
			this.clearMessage();
			var file = this.hditem.ele.files[0];
			var prefix = "";
			var suffix = "";
			//文件类型处理
			if(file.type != ""){
				var spIndex = file.type.indexOf("/");
				if(spIndex != -1){
					prefix = file.type.substring(0, spIndex);
				}
			}
			//文件后缀处理
			var path = this.hditem.ele.value;
			//选择文件显示
			this.valueView.setHtml(path);
			this.deleteView.ele.style.display = "block";
			if(path.indexOf(".") != -1){
				var arr = path.split(".");
				suffix = arr[arr.length - 1];
			}
			var context = this;
			var reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload=function(e){
				context._setValueData(e.target.result, prefix, suffix);
			}
		};
		FileItem.prototype._onFile = function(){
			if(this._readOnly){
				return;
			}
			this.hditem.ele.click();
		};
		
		FileItem.prototype._init = function(){
			//初始化布局组件
			var context = this;
			
			this.item = new Ele.HLayout("ele_form_file");
			this.hditem = new Ele.TextBox();
			this.hditem.ele.type = "file";
			this.hditem.ele.style.display = "none";
			this.hditem.ele.onchange = function(){
				context._onChange();
			};
			var text = "";
			if(typeof(args) != "undefined"){
				if(typeof(args.name) == "string"){
					this.name = args.name;
					this.hditem.ele.name = this.name;
				}
				if(typeof(args.text) == "string"){
					text = args.text;
				}
				if(typeof(args.readOnly) == "boolean"){
					this._readOnly = args.readOnly;
				}
			}
			this.item.add(this.hditem);
			this.valueView = new Ele.Layout("ele_form_file_value");
			this.valueView.setHtml("请选择文件...");
			this.value = "";
			this.fileView = new Ele.Layout("ele_form_file_view");
			var icon = new Ele.Img(Ele._pathPrefix+"ele/"+Ele._skin+"/assets/64/icon_file_add.png", "ele_form_file_icon");
			this.fileView.add(icon);
			this.fileView.ele.onclick = function(){
				context._onFile();
			};
			this.deleteView = new Ele.Layout("ele_form_file_delete_view");
			var delIcon = new Ele.Img(Ele._pathPrefix+"ele/"+Ele._skin+"/assets/64/icon_delete.png", "ele_form_file_delete_icon");
			this.deleteView.add(delIcon);
			this.deleteView.ele.onclick = function(){
				context._onDelete();
			};
			this.item.add(this.valueView);
			this.item.add(this.fileView);
			this.item.add(this.deleteView);
			this.initView(text, this.item, 64);
		};
		
		this._init();
	};
	
	/**
	 * @param {Object} args
	 * 单选框组件
	 */
	var RadioBoxItem = Ele.Views.RadioBoxItem = function(args) {
		this.eleType = "layout";
		this.ele;
		this.view;
		this.label;
		this.width=564;
		this.item;
		this.name;
		this.hditem;
		this.radioBox;
		
		RadioBoxItem.prototype.formString = function(){
			if(typeof(this.name) != "string" || this.name.trim() == ""){
				return null;
			}
			return this.name+"="+this.getValue();
		};
		
		RadioBoxItem.prototype.setValue = function(value){
			this.radioBox.selectByValue(value);
			this.hditem.setValue(value);
		};
		
		RadioBoxItem.prototype.reset = function(){
			this.radioBox.select(0);
			this.hditem.setValue(this.getValue());
		};
		
		RadioBoxItem.prototype.getValue = function(){
			return this.radioBox.getSelectedValue();
		};
		
		RadioBoxItem.prototype.readOnly = function(readOnly){
			this.radioBox.disable(readOnly);
		};
		
		RadioBoxItem.prototype._updateValue = function(index){
			this.hditem.setValue(this.radioBox.getIndexValue(index));
		};
		
		RadioBoxItem.prototype._init = function(){
			this.view = new Ele.HLayout("ele_form_item_view");
			this.ele = this.view.ele;
			
			//初始化布局组件
			this.item = new Ele.Layout("ele_form_radio");
			this.hditem = new Ele.TextBox();
			this.hditem.ele.type = "hidden";
			
			var context = this;
			var text = "";
			var disable = false;
			if(typeof(args) != "undefined"){
				if(typeof(args.name) == "string"){
					this.name = args.name;
					this.hditem.ele.name = this.name;
				}
				if(typeof(args.text) == "string"){
					text = args.text;
				}
				if(typeof(args.readOnly) == "boolean" && args.readOnly){
					disable = true;
				}
				var opts = {
					selectChange:function(index){
						context._updateValue(index);
					},
					disable:disable,
					items:args.items
				};
				this.radioBox = new Ele.RadioBox(opts);
				this._updateValue(0);
			}
			this.item.add(this.hditem);
			this.item.add(this.radioBox);
			
			text = text+":";
			this.label = new Ele.Label(text, "ele_form_item_text");
			
			this.view.add(this.label,{width:"140px", align:"right"});
			this.view.add(this.item,{width:"452px", padding:"0 0 0 12px"});
		};
		
		this._init();
	};
	
	/**
	 * @param {Object} args
	 * 区域文本组件
	 */
	var TextAreaItem = Ele.Views.TextAreaItem = function(args) {
		FormItem.call(this);
		
		this.item;
		this.name;
		
		TextAreaItem.prototype.validate = function(){
			var res = this._validate.validate(this.item.getValue());
			if(res){
				this.clearMessage();
				this.item.clearErrorStyle();
			}else{
				this.showMessage(this._validate.error);
				this.item.showErrorStyle();
			}
			return res;
		};
		
		TextAreaItem.prototype.formString = function(){
			if(this._validate.isEmpty(this.name)){
				return null;
			}
			return this.name+"="+this.getValue();
		};
		
		TextAreaItem.prototype.setValue = function(value){
			this.item.setValue(value);
		};
		
		TextAreaItem.prototype.reset = function(){
			this.clearMessage();
			this.item.clearErrorStyle();
			this.setValue("");
		};
		
		TextAreaItem.prototype.getValue = function(){
			return this.item.getValue();
		};
		TextAreaItem.prototype.readOnly = function(readOnly){
			this.item.readOnly(readOnly);
		};
		
		TextAreaItem.prototype._init = function(){
			//初始化布局组件
			this.item = new Ele.TextArea();
			var text = "";
			if(typeof(args) != "undefined"){
				if(typeof(args.name) == "string"){
					this.name = args.name;
					this.item.ele.name = args.name;
				}
				if(typeof(args.text) == "string"){
					text = args.text;
				}
				if(typeof(args.hint) == "string"){
					this.item.setHint(args.hint);
				}
				if(typeof(args.readOnly) == "boolean"){
					this.item.readOnly(args.readOnly);
				}
				if(typeof(args.value) != "undefined"){
					this.item.setValue(args.value);
				}
			}
			this.initView(text, this.item, 48);
		};
		
		this._init();
	};
	
	/**
	 * @param {Object} args 
	 * 文本框组件
	 */
	var TextBoxItem = Ele.Views.TextBoxItem = function(args) {
		FormItem.call(this);
		
		this.item;
		this.name;
		
		TextBoxItem.prototype.validate = function(){
			var res = this._validate.validate(this.item.getValue());
			if(res){
				this.clearMessage();
				this.item.clearErrorStyle();
			}else{
				this.showMessage(this._validate.error);
				this.item.showErrorStyle();
			}
			return res;
		};
		
		TextBoxItem.prototype.formString = function(){
			if(this._validate.isEmpty(this.name)){
				return null;
			}
			return this.name+"="+this.getValue();
		};
		
		TextBoxItem.prototype.setValue = function(value){
			this.item.setValue(value);
		};
		
		TextBoxItem.prototype.setPassword = function(value){
			if(typeof(value) == "boolean" && value){
				this.item.ele.type = "password";
			}else{
				this.item.ele.type = "text";
			}
		};
		
		TextBoxItem.prototype.reset = function(){
			this.clearMessage();
			this.item.clearErrorStyle();
			this.setValue("");
		};
		
		TextBoxItem.prototype.getValue = function(){
			return this.item.getValue();
		};
		TextBoxItem.prototype.readOnly = function(readOnly){
			this.item.readOnly(readOnly);
		};
		
		TextBoxItem.prototype._init = function(){
			//初始化布局组件
			this.item = new Ele.TextBox();
			var text = "";
			if(typeof(args) != "undefined"){
				if(typeof(args.name) == "string"){
					this.name = args.name;
					this.item.ele.name = args.name;
				}
				if(typeof(args.text) == "string"){
					text = args.text;
				}
				if(typeof(args.password) == "boolean" && args.password){
					this.item.ele.type = "password";
				}
				if(typeof(args.hint) == "string"){
					this.item.setHint(args.hint);
				}
				if(typeof(args.readOnly) == "boolean"){
					this.item.readOnly(args.readOnly);
				}
				if(typeof(args.value) != "undefined"){
					this.item.setValue(args.value);
				}
			}
			this.initView(text, this.item);
		};
		
		this._init();
	};
	
	var ItemSuper = function (){};
	ItemSuper.prototype = FormItemView.prototype;
	ItemSuper.constructor = FormItem;
	var itemSuper = new ItemSuper();
	itemSuper.constructor = FormItem;
	FormItem.prototype = itemSuper;
	
	var TextBoxSuper = function (){};
	TextBoxSuper.prototype = FormItem.prototype;
	TextBoxSuper.constructor = TextBoxItem;
	var textBoxSuper = new TextBoxSuper();
	textBoxSuper.constructor = TextBoxItem;
	TextBoxItem.prototype = textBoxSuper;
	
	var TextAreaSuper = function (){};
	TextAreaSuper.prototype = FormItem.prototype;
	TextAreaSuper.constructor = TextAreaItem;
	var textAreaSuper = new TextAreaSuper();
	textAreaSuper.constructor = TextAreaItem;
	TextAreaItem.prototype = textAreaSuper;
	
	var RadioBoxSuper = function (){};
	RadioBoxSuper.prototype = FormItemView.prototype;
	RadioBoxSuper.constructor = RadioBoxItem;
	var radioBoxSuper = new RadioBoxSuper();
	radioBoxSuper.constructor = RadioBoxItem;
	RadioBoxItem.prototype = radioBoxSuper;
	
	var FileSuper = function (){};
	FileSuper.prototype = FormItem.prototype;
	FileSuper.constructor = FileItem;
	var fileSuper = new FileSuper();
	fileSuper.constructor = FileItem;
	FileItem.prototype = fileSuper;
	
	var SelectBoxSuper = function (){};
	SelectBoxSuper.prototype = FormItem.prototype;
	SelectBoxSuper.constructor = SelectBoxItem;
	var selectBoxSuper = new SelectBoxSuper();
	selectBoxSuper.constructor = SelectBoxItem;
	SelectBoxItem.prototype = selectBoxSuper;
	
	var CheckBoxSuper = function (){};
	CheckBoxSuper.prototype = FormItem.prototype;
	CheckBoxSuper.constructor = CheckBoxItem;
	var checkBoxSuper = new CheckBoxSuper();
	checkBoxSuper.constructor = CheckBoxItem;
	CheckBoxItem.prototype = checkBoxSuper;
	
	var DateBoxSuper = function (){};
	DateBoxSuper.prototype = FormItem.prototype;
	DateBoxSuper.constructor = DateBoxItem;
	var dateBoxSuper = new DateBoxSuper();
	dateBoxSuper.constructor = DateBoxItem;
	DateBoxItem.prototype = dateBoxSuper;
	
	var HiddenSuper = function (){};
	HiddenSuper.prototype = FormItemView.prototype;
	HiddenSuper.constructor = HiddenItem;
	var hiddenSuper = new HiddenSuper();
	hiddenSuper.constructor = HiddenItem;
	HiddenItem.prototype = hiddenSuper;
	
})();
(function(){
	var FormView = Ele.Views.FormView = function(action) {
		this.eleType = "layout";
		this.ele;
		this.view;
		this.form;
		this.appendData;
		this.items;
		this.url;
		this.method;
		
		FormView.prototype.validate = function(){
			var res = true;
			for(var i in this.items){
				if(typeof(this.items[i].validate) != "function"){
					continue;
				}
				if(!this.items[i].validate()){
					res = false;
					break;
				}
			}
			
			return res;
		};
		
		FormView.prototype.reset = function(){
			for(var i in this.items){
				if(typeof(this.items[i].reset) != "function"){
					continue;
				}
				this.items[i].reset();
			}
		};
		
		FormView.prototype.formData = function(){
			var data = "";
			var first = true;
			for(var a in this.appendData){
				if(first){
					first = false;
				}else{
					data += "&";
				}
				data += this.appendData[a];
			}
			for(var i in this.items){
				if(typeof(this.items[i].formString) == "function"){
					if(first){
						first = false;
					}else{
						data += "&";
					}
					data += this.items[i].formString();
				}
			}
			return data;
		};
		FormView.prototype.submit = function(){
			this.form.ele.submit();
		};
		FormView.prototype.submitFormAjax = function(funName){
			var formData = new FormData();
			for(var a in this.appendData){
				var arr = this.appendData[a].split("=");
				formData.append(arr[0], arr[1]);
			}
			for(var i in this.items){
				if(typeof(this.items[i].appendToFormData) == "function"){
					//默认表单数据优先
					this.items[i].appendToFormData(formData);
					continue;
				}
				if(typeof(this.items[i].formString) == "function"){
					var arr = this.items[i].formString().split("=");
					formData.append(arr[0], arr[1]);
				}
			}
			var ajax = new Ele.Utils.Ajax();
			//取消请求头设置，表单提交自动填充类型
			ajax.setContentType(null);
			var uri = this.url;
			if(this.method.toLowerCase() == "get"){
				ajax.setMethod("GET");
			}else{
				ajax.setMethod(this.method);
			}
			ajax.setParameter(formData);
			ajax.request(uri, funName);
		};
		FormView.prototype.submitAjax = function(funName){
			var ajax = new Ele.Utils.Ajax();
			var uri = this.url;
			if(this.method.toLowerCase() == "get"){
				ajax.setMethod("GET");
				uri = this.url +"?"+this.formData();
			}else{
				ajax.setMethod(this.method);
				ajax.setParameter(this.formData());
			}
			ajax.request(uri, funName);
		};
		FormView.prototype.setMethod = function(method){
			this.form.ele.method=method;
			this.method = method;
		};
		FormView.prototype.setEnctype = function(enctype){
			this.form.ele.enctype=enctype;
		};
		FormView.prototype.setEnctypeMfd = function(){
			this.setEnctype("multipart/form-data");
		};
		
		FormView.prototype.addItem = function(item){
			if(!(item instanceof Ele.Views.FormItemView)){
				return;
			}
			this.form.add(item);
			this.items.push(item);
			if(!(item instanceof Ele.Views.HiddenItem)){
				var dividerPanel = new Ele.Layout("ele_form_view_divider_panel");
				dividerPanel.add(new Ele.Layout("ele_form_view_divider"));
				this.form.add(dividerPanel);
			}
		};
		FormView.prototype.appendFormData = function(name, value){
			if(typeof(name) != "string" || typeof(value) == "undefined"){
				return ;
			}
			if(name.trim() == ""){
				return ;
			}
			var hditem = new Ele.TextBox();
			hditem.ele.type = "hidden";
			hditem.ele.name = name;
			hditem.ele.value = value;
			
			this.form.add(hditem);
			this.appendData.push(name+"="+value);
		};
		
		FormView.prototype.setAction = function(action){
			if(typeof(action) == "string"){
				this.url = action;
				this.form.setAction(action);
			}
		};
		
		FormView.prototype._init = function(){
			this.view = new Ele.Layout("ele_form_view");
			this.ele = this.view.ele;
			
			this.form = new Ele.Form();
			this.form.ele.method = "POST";
			this.method = "POST";
			this.setAction(action);
			this.view.add(this.form);
			
			this.items = [];
			this.appendData = [];
		};
		
		this._init();
	};
})();
(function(){
	/*
	/args:
	/  widthPx:宽度固定
	/  heightPx：高度固定
	/  itemHeightPx：单行高度固定
	/  barMenu:是否显示默认功能菜单，默认true
	/  fields：array
	/    fieldWidth:字段宽度
	/    textName:字段名称
	/    fieldName:字段名
	/  operations：
	/    width:操作col宽度
	/    menus:
	/      format：是否该列显示function(rowData)
	/      IconLabelArgs:参考IconLabel
	/  selectOpr:
	/    width:选择col宽度
	*/
	var GridView = Ele.Views.GridView = function(args) {
		this.eleType = "layout";
		this.ele;
		this.view;
		this.toolBar;
		this.content;
		this.pageBar;
		this.listGrid;
		this.gridData = [];
		this.menuView;
		this.filterView;
		this.search;
		this.setView;
		this.windowType;
		this.masking;
		this.position;
		this.offset;
		this.args;
		this.setArgs;
		this.radio;
		this.etRowHeight;
		this.cboxArray = [];
		this.rwidthArray = [];
		this.lbMsg;
		this.pageBarView;
		
		GridView.prototype.addRow = function(row){
			this.gridData.push(row);
			this.listGrid.addRow(row);
		};
		
		GridView.prototype.addToolBarMenu = function(button){
			this.menuView.add(button,{padding:"0 0 0 16px"});
		};
		GridView.prototype.setWindowOffset = function(size){
			if(this.windowType){
				this.offset = size;
			}
		};
		
		GridView.prototype.setOnSearch = function(onSearch){
			this.search.setOnSearch(onSearch);
		};
		
		GridView.prototype.setDataFormat = function(formatHandler){
			this.pageBarView.setFormat(formatHandler);
		};
		GridView.prototype.setParameter = function(parameter) {
			this.pageBarView.setParameter(parameter);
		};
		GridView.prototype.setAddressSufix = function(as) {
			this.pageBarView.setAddressSufix(as);
		};
		GridView.prototype.setRest = function(rest) {
			this.pageBarView.setRest(rest);
		};
		GridView.prototype.jumpPage = function(page){
			this.pageBarView.jumpPage(page);
		};
		
		GridView.prototype.getSelected = function(){
			return this.listGrid.getSelect();
		};
		GridView.prototype.clear = function(){
			this.listGrid.clear();
		};
		GridView.prototype.selectAll = function(){
			this.listGrid.selectAll();
		};
		GridView.prototype.unSelectAll = function(){
			this.listGrid.unSelectAll();
		};
		
		//加载数据源
		GridView.prototype.loadDataSources = function(dataSources){
			if(!Ele._isArray(dataSources)){
				return ;
			}
			this.listGrid.clear();
			this.gridData = [];
			for(var i = 0; i < dataSources.length; i ++){
				this.addRow(dataSources[i]);
			}
		};
		GridView.prototype._onDataResponse = function(dataSources){
			this.loadDataSources(dataSources);
		};
		GridView.prototype.loadDataSourcesUrl = function(url, method, funError, funFormat){
			var context = this;
			var baseController = new Ele.Controllers.BaseController({
				loadHandler: function(data){
					context._onDataResponse(data);
				},
				errorHandler: function(error){
					if(typeof(funError) == "function"){
						funError(error);
					}
				}
			});
			if(typeof(funFormat) == "function"){
				baseController.setFormat(funFormat);
			}
			if(typeof(method) != "undefined" && method != "" && method != null){
				baseController.setMethod(method);
			}else{
				baseController.setMethod("GET");
			}
			baseController.loadData(url);
		};
		GridView.prototype.loadDataSourcesPageUrl = function(url, method, funError, pageSize){
			var context = this;
			this.pageBarView.loadData(url, function(dataSources){
				context._onDataResponse(dataSources);
			}, method, funError, pageSize);
		};
		
		GridView.prototype._onReset = function(){
			this.setArgs = Ele._cloneObject(this.args);
			this.content.remove(this.listGrid);
			this.listGrid = new Ele.ListGrid(this.setArgs);
			this.content.add(this.listGrid);
			for(var row in this.gridData){
				this.listGrid.addRow(this.gridData[row]);
			}
		};
		
		GridView.prototype._onSet = function(){
			this._showTip("");
			var fields = Ele._cloneObject(this.setArgs.fields);
			var tempFields = [];
			var updateData = [];
			var tp = 0;
			for(var i = 0; i < this.cboxArray.length; i ++){
				if(this.cboxArray[i].isChecked()){
					fields[i].hidden = false;
					var value = this.rwidthArray[i].getValue();
					if(value != ""){
						var num = Number.parseInt(value);
						tp += num;
						if(this.radio.getSelectedValue() == 1){
							fields[i].fieldWidth = num+"%";
						}else{
							fields[i].fieldWidth = num;
						}
						updateData.push(i);
					}
					tempFields.push(fields[i]);
				}else{
					fields[i].hidden = true;
					this.rwidthArray[i].setValue("");
					this.rwidthArray[i].setHint("");
					this.rwidthArray[i].data = "";
				}
			}
			if(this.radio.getSelectedValue() == 1 && tp > 100){
				this._showTip("展示字段百分比总和大于100");
				return;
			}
			this.radio.data = this.radio.getSelectedValue();
			for(var index = 0; index < updateData.length; index ++){
				this.rwidthArray[updateData[index]].data = this.rwidthArray[updateData[index]].getValue();
			}
			this.setArgs.fields = fields;
			this.setArgs.itemHeightPx = Number.parseInt(this.etRowHeight.getValue());
			
			var tempArgs = Ele._cloneObject(this.setArgs);
			tempArgs.fields = tempFields;
			
			//关闭窗口
			this._hideMenuView();
			
			this.content.remove(this.listGrid);
			this.listGrid = new Ele.ListGrid(tempArgs);
			this.content.add(this.listGrid);
			for(var row in this.gridData){
				this.listGrid.addRow(this.gridData[row]);
			}
		};
		GridView.prototype._showTip = function(tip){
			if(tip == ""){
				this.lbMsg.setText("");
				return ;
			}
			this.lbMsg.setText("Tip："+tip);
		};
		
		GridView.prototype._hideMenuView = function(){
			if(this.windowType){
				this.masking.hideMasking();
				return ;
			}
			this.setView.ele.style.display = "none";
			this.masking.hideMasking();
		};
		
		GridView.prototype._showMenuView = function(){
			if(this.windowType){
				var oleft = this.ele.offsetLeft + this.ele.offsetParent.offsetLeft;
				var otop = this.ele.offsetTop + this.ele.offsetParent.offsetTop;
				//定位在菜单布局下面
				this.position.positionType = "bottom-left";
				this.position.top = otop + this.menuView.ele.offsetHeight;
				this.position.left = oleft;
				
				if(this.offset != null && this.offset instanceof Ele.Utils.Size){
					this.position.setOffset(this.offset);
				}
				this.masking.setContent(this.setView, this.position);
				this.masking.showMasking();
				
				this._initSetValue();
				return ;
			}
			this.masking.setContentNone();
			this.masking.showMasking();
			var context = this;
			this.masking.setHiddenHandler(function(){
				context._hideMenuView();
			});
			
			this.setView.ele.style.display = "block";
			this._initSetValue();
		};
		
		GridView.prototype._initSetValue = function(){
			this._showTip("");
			this.etRowHeight.ele.value = this.listGrid.itemHeight;
			this.radio.selectByValue(this.radio.data);
			if(Ele._isArray(this.setArgs.fields)){
				var tempRwid = [];
				for(var i = 0; i < this.setArgs.fields.length; i ++){
					var field = this.setArgs.fields[i];
					if(field.hidden){
						this.cboxArray[i].unChecked();
						this.rwidthArray[i].setValue("");
						continue ;
					}
					this.cboxArray[i].checked();
					tempRwid.push(this.rwidthArray[i]);
				}
				if(tempRwid.length > 0){
					var wp = 100/tempRwid.length;
					for(var j = 0; j < tempRwid.length; j ++){
						if(tempRwid[j].data == ""){
							tempRwid[j].setHint(wp);
							tempRwid[j].setValue("");
						}else{
							tempRwid[j].setHint("");
							tempRwid[j].setValue(tempRwid[j].data);
						}
					}
				}
				
			}
		};
		
		GridView.prototype._initSetView = function(){
			this.setView.clear();
			var context = this;
			var title = new Ele.HLayout("ele_grid_set_view_title_item");
			var cbAll = new Ele.ICheckBox();
			cbAll.ele.style.marginTop="8px";
			var lbTitle = new Ele.Label("全选","");
			title.add(cbAll);
			title.add(lbTitle,{padding:"0 0 0 8px"});
			
			var imgColWidth = new Ele.Img(Ele._pathPrefix+"ele/"+Ele._skin+"/assets/64/icon_col_width.png", "ele_grid_set_view_title_icon");
			title.add(imgColWidth,{padding:"0 0 0 24px"});
			this.radio = new Ele.RadioBox({items:[{text:"%",value:1},{text:"px",value:2}]});
			this.radio.data = 1;
			title.add(this.radio,{padding:"4px 0 0 0"});
			
			var imgRowHeight = new Ele.Img(Ele._pathPrefix+"ele/"+Ele._skin+"/assets/64/icon_row_height.png", "ele_grid_set_view_title_icon");
			this.etRowHeight = new Ele.TextBox({style:"ele_grid_set_row_height_style"});
			this.etRowHeight.ele.type = "number";
			title.add(this.etRowHeight,{float:"right"});
			title.add(imgRowHeight,{padding:"0 8px 0 0",float:"right"});
			
			this.setView.add(title);
			var divider = new Ele.Layout("ele_grid_set_view_item_divider");
			this.setView.add(divider);
			if(Ele._isArray(this.setArgs.fields)){
				for(var i = 0; i < this.setArgs.fields.length; i ++){
					var item = new Ele.HLayout("ele_grid_set_view_item");
					var cbox = new Ele.ICheckBox();
					cbox.ele.style.marginTop= "8px";
					cbox.data = this.setArgs.fields[i];
					var textName = new Ele.Label(this.setArgs.fields[i].textName);
					var etColWidth = new Ele.TextBox({style:"ele_grid_set_row_height_style"});
					etColWidth.ele.type = "number";
					etColWidth.data = "";
					item.add(cbox);
					item.add(textName, {padding:"0 0 0 8px"});
					item.add(etColWidth, {float:"right"});
					var icw = new Ele.Img(Ele._pathPrefix+"ele/"+Ele._skin+"/assets/64/icon_col_width.png", "ele_grid_set_view_title_icon");
					item.add(icw, {padding:"0 8px 0 0",float:"right"});
					
					this.setView.add(item);
					var divider = new Ele.Layout("ele_grid_set_view_item_divider");
					this.setView.add(divider);
					
					this.cboxArray.push(cbox);
					this.rwidthArray.push(etColWidth);
				}
			}
			var bottom = new Ele.HLayout("ele_grid_set_view_bottom_item");
			var sure = new Ele.Button({text:"确定", icon:Ele._pathPrefix+"ele/"+Ele._skin+"/assets/64/icon_sure.png", onclick:function(){
				context._onSet();
			}});
			this.lbMsg = new Ele.Label("", "ele_grid_set_view_bottom_hint");
			bottom.add(this.lbMsg);
			bottom.add(sure, {float:"right"});
			this.setView.add(bottom);
		};
		
		GridView.prototype._init = function(){
			this.view = new Ele.Layout("ele_grid_view");
			this.ele = this.view.ele;
			this.masking = Ele.masking;
			
			this.args = args;
			this.setArgs = Ele._cloneObject(args);
			var context = this;
			
			var barMenu = true;
			if(typeof(this.args.barMenu) == "boolean"){
				barMenu = this.args.barMenu;
			}
			if(typeof(args.windowType) == "boolean" && args.windowType){
				this.windowType = true;
			}
			if(this.windowType){
				this.setView = new Ele.HLayout("ele_grid_set_view_wt");
				this.position = new Ele.Utils.Position();
			}else{
				this.setView = new Ele.HLayout("ele_grid_set_view");
				this.setView.ele.style.zIndex = this.masking.maxZIndex + 1;
				this.view.add(this.setView);
			}
			
			this.toolBar = new Ele.HLayout("ele_grid_tool_bar");
			this.menuView = new Ele.HLayout("ele_grid_menu_view");
			
			
			if(barMenu){
				var refresh = new Ele.Button({text:"", icon:Ele._pathPrefix+"ele/"+Ele._skin+"/assets/64/icon_refresh.png",onclick:function(){
					context._onReset();
				}});
				var set = new Ele.Button({text:"", icon:Ele._pathPrefix+"ele/"+Ele._skin+"/assets/64/icon_set.png",onclick:function(){
					context._showMenuView();
				}});
				var divider = new Ele.Layout("ele_grid_tool_divider");
				this.menuView.add(refresh,{padding:"0px 0px 0px 16px"});
				this.menuView.add(set,{padding:"0px 0px 0px 16px"});
				this.menuView.add(divider,{padding:"0px 0px 0px 16px"});
			}
			
			
			this.filterView = new Ele.HLayout("ele_grid_filter_view");
			this.search = new Ele.SearchBox({hint:"搜索关键字"});
			this.filterView.add(this.search,{padding:"10px 16px 0px 0px"});
			this.toolBar.add(this.menuView);
			this.toolBar.add(this.filterView,{float:"right"});
			
			this.content = new Ele.Layout("ele_grid_view_content");
			this.listGrid = new Ele.ListGrid(this.args);
			this.content.add(this.listGrid);
			this.pageBar = new Ele.Layout("ele_grid_page_bar");
			this.pageBarView = new Ele.Views.PageBarView();
			this.pageBar.add(this.pageBarView);
			
			var top = 0;
			var bottom = 0;
			if(this.args.toolBar){
				this.view.add(this.toolBar);
				top += 48;
			}
			if(this.args.pageBar){
				this.view.add(this.pageBar);
				bottom += 48;
			}
			this.view.add(this.content);
			this.content.ele.style.padding = top+"px 0 "+bottom+"px 0";
			
			//初始化设置布局
			this._initSetView();
		};
		
		this._init();
	};
})();
(function(){
	var ListSelectorView = Ele.Views.ListSelectorView = function(){
		this.eleType = "layout";
		this.ele;
		this.view;
		this.width = 740;
		this.height = 460;
		this.leftView;
		this.rightView;
		this.leftEmpty;
		this.rightEmpty;
		this.leftItems;
		this.rightItems;
		this.leftSelectIndex;
		this.rightSelectIndex;
		this.controller;
		this._onErrorResponse = null;
		this._onDataLoad = null;
		this._dataFormat = null;
		this._onUpdate = null;
		
		ListSelectorView.prototype.setDataFormat = function(event){
			if(typeof(event) == "function"){
				this._dataFormat = event;
			}
		};
		ListSelectorView.prototype.setOnUpdate = function(event){
			if(typeof(event) == "function"){
				this._onUpdate = event;
			}
		};
		ListSelectorView.prototype.setOnDataLoad = function(event){
			if(typeof(event) == "function"){
				this._onDataLoad = event;
			}
		};
		ListSelectorView.prototype.getSelectedValues = function(){
			var res = [];
			for(var i in this.rightItems){
				res.push(this.rightItems[i].value);
			}
			return res;
		};
		ListSelectorView.prototype.getSelectedStringValues = function(){
			var res = "";
			for(var i in this.rightItems){
				res += this.rightItems[i].value+",";
			}
			if(res != ""){
				res = res.substr(0, res.length - 1);
			}
			return res;
		};
		ListSelectorView.prototype.setValues = function(values, format){
			if(this.leftItems.length < 1 || values.length < 1){
				return ;
			}
			for(var val in values){
				var value = values[val];
				if(typeof(format) == "function"){
					value = format(value);
					if(typeof(value) == "undefined"){
						break;
					}
				}
				for(var i in this.leftItems){
					if(this.leftItems[i].value === value){
						this.leftSelectIndex = i;
						this.addMove();
						break;
					}
				}
			}
		};
		ListSelectorView.prototype.setStringValues = function(values, format){
			if(this.leftItems.length < 1){
				return ;
			}
			var arr = values.split(",");
			for(var val in arr){
				var value = arr[val];
				if(typeof(format) == "function"){
					value = format(value);
					if(typeof(value) == "undefined"){
						break;
					}
				}
				for(var i in this.leftItems){
					if(this.leftItems[i].value === value){
						this.leftSelectIndex = i;
						this.addMove();
						break;
					}
				}
			}
		};
		ListSelectorView.prototype.clear = function(){
			this.leftView.clear();
			this.rightView.clear();
			this.leftItems = [];
			this.rightItems = [];
			this.leftSelectIndex = -1;
			this.rightSelectIndex = -1;
			this.leftView.add(this.leftEmpty);
			this.rightView.add(this.rightEmpty);
		};
		ListSelectorView.prototype.loadDataSourcesUrl = function(url, method, funError){
			if(typeof(funError) == "function"){
				this._onErrorResponse = funError;
			}
			if(typeof(method) != "undefined" && method != "" && method != null){
				this.controller.setMethod(method);
			}else{
				this.controller.setMethod("GET");
			}
			this.controller.loadData(url);
		};
		ListSelectorView.prototype.loadDataSources = function(datasources){
			this.clear();
			var context = this;
			
			if(datasources.length > 0){
				for(var i = 0; i < datasources.length; i ++){
					this.addValue(datasources[i]);
				}
			}
			if(this._onDataLoad != null){
				this._onDataLoad();
			}
		};
		ListSelectorView.prototype.addMove = function(){
			if(this.leftSelectIndex == -1){
				return ;
			}
			var object = this.leftItems[this.leftSelectIndex];
			//右侧添加
			this.addRightItem(object.text, object.value, object.data);
			//移除布局
			this.leftView.remove(object.view);
			//移除数据
			this.leftItems.splice(this.leftSelectIndex, 1);
			//角标维护
			for(var i = this.leftSelectIndex; i < this.leftItems.length; i++){
				this.leftItems[i].view.ele.index = i;
				var css = "ele_list_selector_item ";
				if(i % 2 == 0){
					css += "ele_list_selector_item_single";
				}else{
					css += "ele_list_selector_item_double";
				}
				this.leftItems[i].view.ele.className = css;
			}
			if(this.leftItems.length == 0){
				this.leftView.add(this.leftEmpty);
			}
			this.leftSelectIndex = -1;
			if(this._onUpdate != null){
				this._onUpdate({eventType:"addMove",data:this.rightItems[this.rightItems.length - 1]});
			}
		};
		ListSelectorView.prototype.subMove = function(){
			if(this.rightSelectIndex == -1){
				return ;
			}
			var object = this.rightItems[this.rightSelectIndex];
			//侧添加
			this.addLeftItem(object.text, object.value, object.data);
			//移除布局
			this.rightView.remove(object.view);
			//移除数据
			this.rightItems.splice(this.rightSelectIndex, 1);
			//角标维护
			for(var i = this.rightSelectIndex; i < this.rightItems.length; i++){
				this.rightItems[i].view.ele.index = i;
				var css = "ele_list_selector_item ";
				if(i % 2 == 0){
					css += "ele_list_selector_item_single";
				}else{
					css += "ele_list_selector_item_double";
				}
				this.rightItems[i].view.ele.className = css;
			}
			if(this.rightItems.length == 0){
				this.rightView.add(this.rightEmpty);
			}
			this.rightSelectIndex = -1;
			if(this._onUpdate != null){
				this._onUpdate({eventType:"subMove",data:this.leftItems[this.leftItems.length - 1]});
			}
		};
		ListSelectorView.prototype.addValue = function(data){
			if(this._dataFormat != null){
				this._dataFormat(data);
			}
			this.addLeftItem(data.text, data.value, data.data);
		};
		
		ListSelectorView.prototype.addLeftItem = function(text, value, data){
			if(typeof(text) =="undefined" || typeof(value) =="undefined"){
				return ;
			}
			var context = this;
			var index = this.leftItems.length;
			if(index == 0){
				this.leftView.remove(this.leftEmpty);
			}
			var css = "ele_list_selector_item ";
			if(index % 2 == 0){
				css += "ele_list_selector_item_single";
			}else{
				css += "ele_list_selector_item_double";
			}
			var item = new Ele.Layout(css);
			item.setHtml(text);
			this.leftView.add(item);
			var object = {view:item, text:text, value:value, data:data};
			//填充index
			item.ele.index = index;
			item.ele.onclick = function(){
				context._onLeftItemSelected(this.index);
			}
			this.leftItems.push(object);
		};
		ListSelectorView.prototype.addRightItem = function(text, value, data){
			if(typeof(text) =="undefined" || typeof(value) =="undefined"){
				return ;
			}
			var context = this;
			var index = this.rightItems.length;
			if(index > 0){
				var divider = new Ele.Layout("ele_list_selector_item_divider");
				this.rightView.add(divider);
			}else{
				this.rightView.remove(this.rightEmpty);
			}
			var css = "ele_list_selector_item ";
			if(index % 2 == 0){
				css += "ele_list_selector_item_single";
			}else{
				css += "ele_list_selector_item_double";
			}
			var item = new Ele.Layout(css);
			item.setHtml(text);
			this.rightView.add(item);
			var object = {view:item, text:text, value:value, data:data};
			//填充index
			item.ele.index = index;
			item.ele.onclick = function(){
				context._onRightItemSelected(this.index);
			}
			this.rightItems.push(object);
		};
		ListSelectorView.prototype.selectLeftItem = function(index){
			if(index < 0 || index >= this.leftItems.length){
				return ;
			}
			if(this.leftSelectIndex == index){
				return ;
			}
			this.leftItems[index].view.ele.className = "ele_list_selector_item ele_list_selector_item_select";
			if(this.leftSelectIndex != -1){
				var css = "ele_list_selector_item ";
				if(this.leftSelectIndex % 2 == 0){
					css += "ele_list_selector_item_single";
				}else{
					css += "ele_list_selector_item_double";
				}
				this.leftItems[this.leftSelectIndex].view.ele.className = css;
			}
			this.leftSelectIndex = index;
		};
		ListSelectorView.prototype.selectRightItem = function(index){
			if(index < 0 || index >= this.rightItems.length){
				return ;
			}
			if(this.rightSelectIndex == index){
				return ;
			}
			this.rightItems[index].view.ele.className = "ele_list_selector_item ele_list_selector_item_select";
			if(this.rightSelectIndex != -1){
				var css = "ele_list_selector_item ";
				if(this.rightSelectIndex % 2 == 0){
					css += "ele_list_selector_item_single";
				}else{
					css += "ele_list_selector_item_double";
				}
				this.rightItems[this.rightSelectIndex].view.ele.className = css;
			}
			this.rightSelectIndex = index;
		};
		
		ListSelectorView.prototype._onLeftItemSelected = function(index){
			this.selectLeftItem(index);
		};
		ListSelectorView.prototype._onRightItemSelected = function(index){
			this.selectRightItem(index);
		};
		
		ListSelectorView.prototype._onDataResponse = function(dataSources){
			this.loadDataSources(dataSources);
		};
		
		ListSelectorView.prototype._init = function(){
			var context = this;
			this.view = new Ele.Layout("ele_list_selector_view");
			this.ele = this.view.ele;
			this.leftItems = [];
			this.rightItems = [];
			this.leftSelectIndex = -1;
			this.rightSelectIndex = -1;
			
			var panel = new Ele.Layout("ele_list_selector_panel");
			this.leftView = new Ele.Layout("ele_list_selector_item_view ele_scrollbar");
			var centerView = new Ele.Layout("ele_list_selector_bar_view");
			this.rightView = new Ele.Layout("ele_list_selector_item_view ele_scrollbar");
			var cl = new Ele.Layout("ele_cl");
			
			this.leftEmpty = new Ele.Layout("ele_list_selector_empty");
			this.rightEmpty = new Ele.Layout("ele_list_selector_empty");
			this.leftEmpty.setHtml("暂无数据");
			this.rightEmpty.setHtml("暂无数据");
			this.leftView.add(this.leftEmpty);
			this.rightView.add(this.rightEmpty);
			
			var barView = new Ele.Layout("ele_list_selector_bar_panel");
			barView.setAlign("center");
			centerView.add(barView);
			
			var btn_add = new Ele.Button({text:"添加", iconRight:true, icon:Ele._pathPrefix+"ele/"+Ele._skin+"/assets/96/icon_2_right.png",onclick:function(){
				context.addMove();
			}});
			var btn_sub = new Ele.Button({text:"移除", icon:Ele._pathPrefix+"ele/"+Ele._skin+"/assets/96/icon_2_left.png",onclick:function(){
				context.subMove();
			}});
			barView.add(btn_add);
			barView.add(new Ele.Layout("ele_list_selector_bar_divider"));
			barView.add(btn_sub);
			
			panel.add(this.leftView);
			panel.add(centerView);
			panel.add(this.rightView);
			panel.add(cl);
			
			this.view.add(panel);
			
			this.controller = new Ele.Controllers.BaseController({
				loadHandler:function(data){
					context._onDataResponse(data);
				},
				errorHandler:function(error){
					if(context._onErrorResponse != null){
						context._onErrorResponse(error);
					}
				}
			});
		};
		
		this._init();
	};
})();
(function(){
	var Masking = Ele.Views.Masking = function() {
		this.eleType = "layout";
		this.ele;
		this.view;
		this.bg;
		this.content;
		this.maxZIndex = 1002;
		this._hiddenEvent = null;
		
		Masking.prototype._init = function(){
			this.view = new Ele.Layout("ele_masking");
			this.ele = this.view.ele;
			this.bg = new Ele.Layout("ele_masking_bg");
			this.content = new Ele.Layout("ele_masking_content");
			
			var context = this;
			//点击主布局外隐藏窗口
			this.bg.ele.onclick = function(e){
				context.hideMasking();
				if(context._hiddenEvent != null && typeof(context._hiddenEvent) == "function"){
					context._hiddenEvent();
				}
			};
			
			this.view.add(this.bg);
			this.view.add(this.content);
		};
		Masking.prototype.setHiddenHandler = function(event){
			this._hiddenEvent = event;
		};
		
		Masking.prototype.setContent = function(view, position){
			if(position instanceof Ele.Utils.Position){
				if(position.positionType == "top-left"){
					view.ele.style.left = position.left+"px";
					view.ele.style.bottom = position.bottom+"px";
				}
				if(position.positionType == "top-right"){
					view.ele.style.right = position.right+"px";
					view.ele.style.bottom = position.bottom+"px";
				}
				if(position.positionType == "bottom-left"){
					view.ele.style.left = position.left+"px";
					view.ele.style.top = position.top+"px";
				}
				if(position.positionType == "top-left"){
					view.ele.style.right = position.right+"px";
					view.ele.style.top = position.top+"px";
				}
			}
			this.content.clear();
			this.content.add(view);
		};
		Masking.prototype.setContentNone = function(){
			this.content.clear();
		};
		Masking.prototype.showMasking = function(){
			this.ele.style.display = "block";
		};
		Masking.prototype.hideMasking = function(){
			this.ele.style.display = "none";
		};
		
		this._init();
	};
})();
(function(){
	var PageBarView = Ele.Views.PageBarView = function(pageSize) {
		this.eleType = "layout";
		this.ele;
		this.view;
		this.pageItem;
		this.lbInfo;
		this.etJump;
		this.pageController;
		this._onDataResponse = null;
		this._onErrorResponse = null;
		
		PageBarView.prototype.loadData = function(url, funName, method, funError, pageSize){
			//加载page数据
			if(typeof(funName) == "function"){
				this._onDataResponse = funName;
			}
			if(typeof(funError) == "function"){
				this._onErrorResponse = funError;
			}
			if(typeof(pageSize) == "number"){
				this.setPageSize(pageSize);
			}
			if(typeof(method) != "undefined" && method != "" && method != null){
				this.pageController.setMethod(method);
			}
			this.pageController.loadData(url);
		};
		PageBarView.prototype.setParameter = function(parameter) {
			this.pageController.setParameter(parameter);
		};
		PageBarView.prototype.setAddressSufix = function(as) {
			this.pageController.setAddressSufix(as);
		};
		PageBarView.prototype.setRest = function(rest) {
			this.pageController.setRest(rest);
		};
		PageBarView.prototype.reload = function(){
			this.pageController.reload();
		};
		PageBarView.prototype.setPageSize = function(pageSize){
			this.pageController.pageSize = pageSize;
		};
		PageBarView.prototype.getPageSize = function(){
			return this.pageController.pageSize;
		};
		PageBarView.prototype.jumpPage = function(page){
			this.pageController.jumpPage(page);
		};
		PageBarView.prototype.previousPage = function(){
			this.pageController.previousPage();
		};
		PageBarView.prototype.nextPage = function(){
			this.pageController.nextPage();
		};
		PageBarView.prototype.setFormat = function(formatHandler){
			this.pageController.setFormat(formatHandler);
		};
		PageBarView.prototype._setMessage = function(pages, rows){
			this.lbInfo.setText("共"+pages+"页 总计"+rows+"条数据");
		};
		PageBarView.prototype._onPageSelected = function(page){
			this.jumpPage(page);
		};
		PageBarView.prototype._onSubmitJump = function(){
			var val = this.etJump.getValue();
			if(val == ""){
				return ;
			}
			var page = Number.parseInt(val);
			this.jumpPage(page);
		};
		PageBarView.prototype._updateMessage = function(){
			this.pageItem.clear();
			var len = this.pageController.totalPage;
			//最多显示5个页码组件
			var startPage = this.pageController.page;
			if(len > 5){
				len = 5;
			}
			if((startPage + 2) > this.pageController.totalPage){
				startPage = this.pageController.totalPage - 4;
			}else{
				startPage -= 2;
			}
			
			if(startPage < 1){
				startPage = 1;
			}
			
			for(var i = 0; i < len; i ++){
				var tempPage = startPage + i;
				var tempSelect = false;
				if(tempPage == this.pageController.page){
					tempSelect = true;
				}
				this.pageItem.add(this._fillItemView(tempPage, tempSelect),{padding:"0 0 0 16px"});
			}
			
			this._setMessage(this.pageController.totalPage, this.pageController.rows);
		};
		PageBarView.prototype._fillItemView = function(value, selected){
			var css = "ele_page_bar_item";
			if(selected){
				css += " ele_page_bar_item_selected";
			}
			var context = this;
			var item = new Ele.Layout(css);
			item.setAlign("center");
			item.setHtml(value);
			item.ele.onclick = function(){
				context._onPageSelected(value);
			}
			return item;
		};
		PageBarView.prototype._init = function(){
			this.view = new Ele.HLayout("ele_page_bar");
			this.ele = this.view.ele;
			
			var context = this;
			this.pageController = new Ele.Controllers.PageController({
				loadHandler:function(data){
					context._updateMessage();
					if(context._onDataResponse != null){
						context._onDataResponse(data);
					}
				},
				errorHandler:function(error){
					if(context._onErrorResponse != null){
						context._onErrorResponse(error);
					}
				},
				pageSize:pageSize
			});
			
			var btnPrevious = new Ele.Button({text:"上一页",icon:Ele._pathPrefix+"ele/"+Ele._skin+"/assets/64/icon_previous.png",onclick:function(){
				context.previousPage();
			}});
			this.view.add(btnPrevious);
			this.pageItem = new Ele.HLayout();
			this.view.add(this.pageItem);
			
			var btnNext = new Ele.Button({text:"下一页",icon:Ele._pathPrefix+"ele/"+Ele._skin+"/assets/64/icon_next.png", iconRight:true,onclick:function(){
				context.nextPage();
			}});
			this.view.add(btnNext, {padding:"0 0 0 16px"});
			
			this.lbInfo = new Ele.Label();
			this._setMessage(1,0);
			this.view.add(this.lbInfo, {padding:"0 0 0 16px"});
			
			var btnJump = new Ele.Button({text:"确认",onclick:function(){
				context._onSubmitJump();
			}});
			this.view.add(btnJump, {float:"right"});
			this.etJump = new Ele.TextBox({style:"ele_page_bar_jump_style"});
			this.etJump.ele.type = "number";
			this.view.add(this.etJump, {float:"right", padding:"0 8px 0 0"});
			var lbJump = new Ele.Label("跳转至：");
			this.view.add(lbJump, {float:"right", padding:"0 8px 0 0"});
		};
		
		this._init();
	};
})();
(function(){
	var PageControllerView = Ele.Views.PageControllerView = function() {
		this.eleType = "layout";
		this.ele;
		this.view;
		this.pages;//压栈页面
		
		/**
		 * 压栈
		 * @param {Object} view
		 * @param {Object} background
		 */
		PageControllerView.prototype.pushView = function(view, background){
			var layout = new Ele.Layout("ele_page_controller_panel");
			if(typeof(background) != "undefined"){
				layout.ele.background = background;
			}
			//初始页面直接显示
			if(this.pages.length > 0){
				layout.ele.style.position = "absolute";
				layout.ele.style.top = "0px";
				layout.ele.style.left = "100%";
				layout.ele.style.zIndex = 1;
				layout.ele.style.display = "none";
			}
			
			layout.add(view);
			this.view.add(layout);
			//第二个页面开启动画
			if(this.pages.length > 0){
				//当前显示页面
				var yetPage = this.pages[this.pages.length - 1];
				var left = 100;
				layout.ele.style.display = "block";
				var context = this;
				var timer = new Ele.Utils.Timer(function(){
					if(left <= 0){
						yetPage.ele.style.display = "none";
						layout.ele.style.position = "static";
						return false;
					}
					left -=10;
					layout.ele.style.left = left+"%";
					return true;
				});
				timer.execute();
			}
			this.pages.push(layout);
		};
		
		/**
		 * 出栈
		 */
		PageControllerView.prototype.pullView = function(){
			//最后的页面无法推出
			if(this.pages.length < 2){
				return ;
			}
			if(this.pages.length > 0){
				//当前显示页面
				var prePage = this.pages[this.pages.length - 2];
				var yetPage = this.pages[this.pages.length - 1];
				var left = 0;
				//prePage.ele.style.left = "0%";
				//prePage.ele.style.display = "block";
				yetPage.ele.style.position = "absolute";
				yetPage.ele.style.top = "0px";
				yetPage.ele.style.left = "0%";
				yetPage.ele.style.zIndex = 1;
				prePage.ele.style.display = "block";
				var context = this;
				var timer2 = new Ele.Utils.Timer(function(){
					if(left >= 100){
						yetPage.ele.style.display = "none";
						//页面删除
						context.view.remove(yetPage);
						//删除数组最后一项
						context.pages.splice(context.pages.length - 1, 1);
						return false;
					}
					left +=10;
					yetPage.ele.style.left = left+"%";
					return true;
				});
				timer2.execute();
			}
		};
		
		PageControllerView.prototype._init = function(){
			this.view = new Ele.Layout("ele_page_controller_view");
			this.ele = this.view.ele;
			this.pages = [];
		};
		
		this._init();
	};
})();
(function(){
	var PopView = Ele.Views.PopView = function(wid){
		this.eleType = "layout";
		this.ele;
		this.bgView;
		this.view;
		this.width = 808;
		if(typeof(wid) == "number"){
			this.width = wid+8;
		}
		this.close;
		this.contentView;
		
		PopView.prototype.init = function(){
			var context = this;
			this.bgView = new Ele.Layout("ele_popview_bg_view");
			this.view = new Ele.Layout("ele_popview_view");
			this.ele = this.view.ele;
			this.view.setAlign("center");
			
			var panel = new Ele.HLayout("ele_popview_panel");
			//72+2+72+16
			panel.setSize((this.width+162)+"px", "100%");
			
			this.contentView = new Ele.Layout("ele_popview_content_view ele_scrollbar");
			this.contentView.setWidth(this.width +"px");
			
			panel.add(this.contentView,{padding:"0 0 0 72px"});
			
			this.close = new Ele.Layout("ele_popview_close_view");
			var image = new Ele.Img(Ele._pathPrefix+"ele/"+Ele._skin+"/assets/big-close.png","ele_popview_close_img");
			this.close.add(image);
			this.close.ele.onclick = function(){
				context.hide();
			}
			
			panel.add(this.close,{padding:"16px 0 0 16px"});
			
			this.view.add(panel);
			
			Ele.rootView.add(this.bgView);
			Ele.rootView.add(this.view);
		};
		
		PopView.prototype.show = function(){
			if(this.bgView != null){
				this.bgView.ele.style.display = "block";
			}
			if(this.view != null){
				this.view.ele.style.display = "block";
			}
		};
		
		PopView.prototype.addView = function(ele){
			this.contentView.add(ele);
		};
		
		PopView.prototype.clear = function(){
			this.contentView.clear();
		};
		
		PopView.prototype.hide = function(){
			if(this.bgView != null){
				this.bgView.ele.style.display = "none";
			}
			if(this.view != null){
				this.view.ele.style.display = "none";
			}
		};
		
		this.init();
	};
})();
(function(){
	var StepView = Ele.Views.StepView = function(steps) {
		this.eleType = "layout";
		this.ele;
		this.view;
		this.step;
		this._triangles;
		this._items;
		
		StepView.prototype.setStep = function(step){
			if(typeof(step) != "number"){
				return ;
			}
			if(step < 0 || step > this._items.length){
				return ;
			}
			if(step == this.step){
				return ;
			}
			this._triangles[this.step - 1].setBlur();
			this._items[this.step - 1].ele.className = "ele_step_item";
			this._items[step - 1].ele.className = "ele_step_item ele_step_yet";
			if(step < this._items.length){
				this._triangles[step - 1].setFocus();
			}
			this.step = step;
		};
		
		StepView.prototype._init = function(){
			this.step = 1;
			this._triangles = [];
			this._items = [];
			
			this.view = new Ele.Layout("ele_step_view");
			this.ele = this.view.ele;
			
			if(Ele._isArray(steps)){
				var width = (100/steps.length)+"%";
				for(var i = 0; i < steps.length; i ++){
					if(typeof(steps[i]) != "string"){
						continue;
					}
					var css = "ele_step_item";
					if(i == 0){
						css = "ele_step_item ele_step_yet";
					}
					var itemView = new Ele.Layout(css);
					if(i > 0){
						var triangle = new StepTriangle();
						if(i > 1){
							triangle.setBlur();
						}
						itemView.add(triangle);
						this._triangles.push(triangle);
					}
					itemView.setWidth(width);
					var label = new Ele.Label(steps[i], "");
					itemView.add(label);
					this._items.push(itemView);
					this.view.add(itemView);
				}
			}
		};
		
		this._init();
	};
	
	var StepTriangle = function(){
		this.eleType = "layout";
		this.ele;
		this.view;
		this.triangle;
		
		StepTriangle.prototype.setFocus = function(){
			this.triangle.ele.className = "triangle-1";
		};
		StepTriangle.prototype.setBlur = function(){
			this.triangle.ele.className = "triangle-2";
		};
		
		StepTriangle.prototype._init = function(){
			this.view = new Ele.Layout("triangle");
			this.ele = this.view.ele;
			
			var bg = new Ele.Layout("triangle-bg");
			var bg2 = new Ele.Layout("triangle-bg2");
			this.triangle = new Ele.Layout("triangle-1");
			this.view.add(bg);
			this.view.add(bg2);
			this.view.add(this.triangle);
		};
		
		this._init();
	};
	
})();
(function(){
	var SwitchView = Ele.Views.SwitchView = function() {
		this.eleType = "layout";
		this.ele;
		this.view;
		this.count = 0;
		this.pages = [];
		this.bar;
		this.barItems = [];
		this.selectedIndex = -1;
		this._autoPlay = false;
		
		/**
		 * 播放下一页
		 */
		SwitchView.prototype.play = function(){
			var index = this.selectedIndex + 1;
			if(index == this.count){
				index = 0;
			}
			this.selectIndex(index);
		};
		SwitchView.prototype.autoPlay = function(interval){
			if(typeof(interval) != "number"){
				interval = 3000;
			}
			this._autoPlay = true;
			var context = this;
			var timer = new Ele.Utils.Timer(function(){
				if(context._autoPlay){
					context.play();
					return true;
				}
				return false;
			}, interval);
			setTimeout(function(){
				timer.execute();
			},interval);
		};
		SwitchView.prototype.autoStop = function(){
			this._autoPlay = false;
		};
		
		SwitchView.prototype.addPage = function(view, background){
			this.count ++;
			var layout = new Ele.Layout("ele_switch_page_panel");
			if(typeof(background) != "undefined"){
				layout.ele.background = background;
			}
			if(this.count > 1){
				layout.ele.style.display = "none";
			}
			
			layout.add(view);
			
			this.view.add(layout);
			this.pages.push(layout);
			this._addBar();
		};
		
		/**
		 * @param {Object} index： start from 0
		 */
		SwitchView.prototype.selectIndex = function(index){
			if(this.selectedIndex < 0){
				return ;
			}
			if(index == this.selectedIndex){
				return ;
			}
			var newPage = this.pages[index];
			var yetPage = this.pages[this.selectedIndex];
			var left = 100;
			
			newPage.ele.style.position = "absolute";
			newPage.ele.style.top = "0px";
			newPage.ele.style.left = "100%";
			newPage.ele.style.zIndex = 1;
			newPage.ele.style.display = "block";
			var context = this;
			var timer = new Ele.Utils.Timer(function(){
				if(left <= 0){
					yetPage.ele.style.display = "none";
					newPage.ele.style.position = "static";
					
					context.barItems[context.selectedIndex].ele.className = "ele_switch_bar_item";
					context.barItems[index].ele.className = "ele_switch_bar_item ele_switch_bar_item_selected";
					context.selectedIndex = index;
					return false;
				}
				left -=10;
				newPage.ele.style.left = left+"%";
				return true;
			});
			timer.execute();
		};
		
		SwitchView.prototype._onBarSelected = function(index){
			this.selectIndex(index);
		};
		
		SwitchView.prototype._addBar = function(){
			var item = new Ele.Layout("ele_switch_bar_item");
			var index = this.count;
			var context = this;
			item.ele.onclick = function(){
				context._onBarSelected(index - 1);
			}
			
			if(index == 1){
				//默认选择第一个
				this.selectedIndex = 0;
				item.ele.className = "ele_switch_bar_item ele_switch_bar_item_selected";
				this.bar.add(item, {width:"12px"});
			}else{
				//12+12+12
				//12+8
				var base = 36;
				base += (index - 1) * 20;
				this.bar.setSize(base+"px","20px");
				this.bar.add(item, {width:"20px", padding:"0 0 0 8px"});
			}
			this.barItems.push(item);
		};
		
		SwitchView.prototype._init = function(){
			this.view = new Ele.Layout("ele_switch_view");
			this.ele = this.view.ele;
			var barPanel = new Ele.Layout("ele_switch_bar_panel");
			barPanel.setAlign("center");
			this.bar = new Ele.HLayout("ele_switch_bar");
			barPanel.add(this.bar);
			
			this.view.add(barPanel);
		};
		
		this._init();
	};
})();
(function(){
	var TreeMenuView = Ele.Views.TreeMenuView = function(args) {
		this.eleType = "layout";
		this.ele;
		this.view;
		this.width = 240;
		this.height = 36;
		this.title;
		this.content;
		this.nodes;
		this._onItemClick;
		this._onExpandChange = null;
		this.baseController;
		this._onErrorResponse = null;
		this._selectFormat = null;
		this._expandFormat = null;
		this._dataFormat = null;
		
		TreeMenuView.prototype.add = function(args){
			if(this._dataFormat != null){
				this._dataFormat(args, true);
			}
			if(typeof(args.icon) == "undefined"){
				args.icon = Ele._pathPrefix+"ele/"+Ele._skin+"/assets/64/icon_menuroot.png";
			}
			var context = this;
			args.width = (this.width - 8)+"px";
			args.onItemClick = function(res){
				if(context._onItemClick != null){
					context._onItemClick(res);
				}
			};
			args.onClick = function(res){
				if(context._onExpandChange != null){
					context._onExpandChange(res);
				}
			};
			var node = new Ele.TreeNode(args);
			if(this._expandFormat != null){
				if(this._expandFormat(args.data)){
					args.expand = true;
				}else{
					args.expand = false;
				}
			}
			if(typeof(args.children) == "object"){
				for(var i = 0; i < args.children.length; i ++){
					if(this._dataFormat != null){
						this._dataFormat(args.children[i], false);
					}
					if(typeof(args.children[i].icon) == "undefined"){
						args.children[i].icon = Ele._pathPrefix+"ele/"+Ele._skin+"/assets/64/icon_menuitem.png";
					}
					if(this._selectFormat != null){
						if(this._selectFormat(args.children[i].data)){
							args.children[i].selected = true;
						}else{
							args.children[i].selected = false;
						}
					}
					node.add(args.children[i]);
				}
			}
			if(typeof(args.expand) == "boolean"){
				if(args.expand){
					node.expand();
				}
			}
			
			if(this.nodes.length > 0){
				var divider = new Ele.Layout("ele_menulist_divider");
				this.content.add(divider);
			}
			
			this.content.add(node);
			this.nodes.push(node);
		};
		TreeMenuView.prototype.expandStatus = function(){
			var status = "";
			for(var node in this.nodes){
				if(this.nodes[node].isExpand){
					status += "1";
				}else{
					status += "0";
				}
			}
			return status;
		};
		TreeMenuView.prototype.setTitle = function(title){
			this.title.setText(title);
		};
		TreeMenuView.prototype.fillHeight = function(height){
			this.view.setHeight(height+"px");
			this.content.setHeight((height - 36)+"px");
		};
		//加载数据源
		TreeMenuView.prototype.loadDataSources = function(dataSources){
			if(!Ele._isArray(dataSources)){
				return ;
			}
			this.content.clear();
			for(var i = 0; i < dataSources.length; i ++){
				this.add(dataSources[i]);
			}
		};
		TreeMenuView.prototype._onDataResponse = function(dataSources){
			this.loadDataSources(dataSources);
		};
		TreeMenuView.prototype.loadDataSourcesUrl = function(url, method, funError){
			if(typeof(funError) == "function"){
				this._onErrorResponse = funError;
			}
			if(typeof(method) != "undefined" && method != "" && method != null){
				this.baseController.setMethod(method);
			}else{
				this.baseController.setMethod("GET");
			}
			this.baseController.loadData(url);
		};
		TreeMenuView.prototype._init = function(){
			this.view = new Ele.Layout("ele_menulist");
			this.ele = this.view.ele;
			this.nodes = [];
			var context = this;
			if(typeof(args) == "object"){
				if(typeof(args.onItemClick) == "function"){
					this._onItemClick = args.onItemClick;
				}
				if(typeof(args.onExpandChange) == "function"){
					this._onExpandChange = args.onExpandChange;
				}
				if(typeof(args.selectFormat) == "function"){
					this._selectFormat = args.selectFormat;
				}
				if(typeof(args.expandFormat) == "function"){
					this._expandFormat = args.expandFormat;
				}
				if(typeof(args.dataFormat) == "function"){
					this._dataFormat = args.dataFormat;
				}
				if(typeof(args.heightPx) == "number"){
					this.height = args.heightPx;
					if(this.height < 36){
						this.height = 36;
					}
				}
				if(typeof(args.widthPx) == "number"){
					this.width = args.widthPx;
					this.view.setWidth(this.width+"px");
				}
			}
			var title = new Ele.Layout("ele_menulist_title_view");
			title.setAlign("center");
			this.title = new Ele.Label("系统菜单", "ele_menulist_title_txt ele_ml5");
			title.add(this.title);
			
			var panel = new Ele.Layout("ele_menulist_panel");
			this.content = new Ele.Layout("ele_menulist_content ele_scrollbar");
			if(this.height > 36){
				this.fillHeight(this.height);
			}
			panel.add(this.content);
			
			this.view.add(title);
			this.view.add(panel);
			
			this.baseController = new Ele.Controllers.BaseController({
				loadHandler:function(data){
					context._onDataResponse(data);
				},
				errorHandler:function(error){
					if(context._onErrorResponse != null){
						context._onErrorResponse(error);
					}
				}
			});
		};
		this._init();
	};
})();
