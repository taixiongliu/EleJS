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
		this._style;
		this._focusStyle;
		this.data="";
		this._canFocus;
		
		IconLabel.prototype.canFocus = function(focus){
			if(typeof(focus) == "boolean"){
				this._canFocus = focus;
			}
		};
		
		IconLabel.prototype._init = function(){
			this._style = "ele_icon_label";
			this._focusStyle = "ele_icon_label_focus";
			this._canFocus = true;
			this.view = new Ele.Layout("ele_icon_label");
			this.ele = this.view.ele;
			var img = null;
			var txt = null;
			var context = this;
			if(typeof(args) == "object"){
				if(typeof(args.style) != "undefined"){
					this.ele.className = args.style;
					this._style = args.style;
				}
				if(typeof(args.focusStyle) != "undefined"){
					this._focusStyle = args.focusStyle;
				}
				if(typeof(args.icon) != "undefined"){
					img = new Ele.Img(args.icon,"ele_icon_label_icon");
				}
				if(typeof(args.text) != "undefined"){
					txt = new Label(args.text,"ele_label ele_icon_label_txt ele_ml2");
				}
				if(txt != null && typeof(args.textStyle) != "undefined"){
					txt.ele.className = args.textStyle+" ele_icon_label_txt ele_ml2";
				}
				if(typeof(args.onclick) == "function"){
					this.ele.onclick = function(){
						args.onclick(context.data);
					};
				}
			}
			if(img != null){
				this.view.add(img);
			}
			if(txt != null){
				this.view.add(txt);
			}
			this.ele.onmouseover = function(){
				if(!context._canFocus){
					return;
				}
				context.ele.className = context._focusStyle;
			};
			this.ele.onmouseout = function(){
				if(!context._canFocus){
					return;
				}
				context.ele.className = context._style;
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
				
				var childrenIcon = new Ele.Img(Ele._pathPrefix+"ele/assets/16/icon_down_white.png","ele_menu_label_children_icon");
				contentView.add(childrenIcon);
			}
			
		};
		this._init();
	};
})();
