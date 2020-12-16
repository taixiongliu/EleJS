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
			var panel = new Layout("ele_fl");
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
			var panel = new Layout();
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
