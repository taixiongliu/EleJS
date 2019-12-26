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
			}else{
				this.ele.className = "ele_layout";
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
	var HLayout = Ele.HLayout = function(){
		this.eleType = "layout";
		this.ele;
		this.view;
		this.clView;
		this.width;
		this.height;
		
		HLayout.prototype.setSize = function(width, height){
			this.view.setSize(width, height);
			this.width = width;
			this.height = height;
		};
		
		HLayout.prototype.setContainer = function(obj){
			this.view.setContainer(obj);
		};
		HLayout.prototype.setContainerById = function(id){
			this.view.setContainerById(id);
		};
		HLayout.prototype.add = function(obj,args){
			var panel = new Layout("ele_fl");
			if(this.height == null){
				panel.setHeight("100%");
			}else{
				panel.setHeight(this.height);
			}
			if(typeof(args) == "object"){
				if(typeof(args.float) != "undefined"){
					if(args.float == "right"){
						panel.ele.className = "ele_fr";
					}
				}
				if(typeof(args.width) != "undefined"){
					panel.setWidth(args.width);
				}
				if(typeof(args.align) != "undefined"){
					panel.ele.align = args.align;
				}
				if(typeof(args.padding) != "undefined"){
					panel.ele.style.padding = args.padding;
				}
			}
			panel.add(obj);
			this.view.remove(this.clView);
			this.view.add(panel);
			this.view.add(this.clView);
		};
		HLayout.prototype.clear = function(){
			this.view.clear();
			this.view.add(this.clView);
		};
		HLayout.prototype.getView = function(){
			return this.view;
		};
		
		HLayout.prototype._init = function(){
			this.view = new Layout();
			this.clView = new Layout("ele_cl");
			this.view.add(this.clView);
			this.ele = this.view.ele;
		};
		this._init();
	};
	
	/**
	 * 竖向布局
	 */
	var VLayout = Ele.VLayout = function(){
		this.eleType = "layout";
		this.ele;
		this.view;
		this.width;
		this.height;
		
		VLayout.prototype.setSize = function(width, height){
			this.view.setSize(width, height);
			this.width = width;
			this.height = height;
		};
		
		VLayout.prototype.add = function(obj,args){
			var panel = new Layout();
			if(this.width == null){
				panel.setWidth("100%");
			}else{
				panel.setWidth(this.width);
			}
			panel.setHeight("auto");
			if(typeof(args) == "object"){
				if(typeof(args.heigth) != "undefined"){
					panel.setHeight(args.heigth);
				}
				if(typeof(args.align) != "undefined"){
					panel.ele.align = args.align;
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
			this.view = new Layout();
			this.ele = this.view.ele;
		};
		this._init();
	};
})();
