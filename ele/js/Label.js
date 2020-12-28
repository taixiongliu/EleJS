(function(){
	var Label = Ele.Label = function(text, cName){
		this.eleType = "span";
		this.ele;
		
		Label.prototype.setText = function(text){
			this.ele.innerHTML = text;
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
		
		IconLabel.prototype._init = function(){
			this._style = "ele_icon_label";
			this._focusStyle = "ele_icon_label_focus";
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
				context.ele.className = context._focusStyle;
			};
			this.ele.onmouseout = function(){
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
		this.masking;
		
		MenuLabel.prototype.setText = function(text){
			this.ele.innerHTML = text;
		};
		
		MenuLabel.prototype.showChildren = function(){
			var otop = this.view.ele.offsetTop+this.view.ele.offsetParent.offsetTop;
			var oleft = this.view.ele.offsetLeft+this.view.ele.offsetParent.offsetLeft+20;
			var cheight = this.view.ele.clientHeight;
			this.childrenViews.ele.style.top = (otop + cheight)+"px";
			this.childrenViews.ele.style.left = oleft+"px";
			
			this.masking.setContent(this.childrenViews);
			this.masking.showMasking();
		};
		
		MenuLabel.prototype.hideChildren = function (){
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
			item.ele.onclick = function(){
				context.hideChildren();
				if(typeof(child.onItemClick) == "function"){
					if(typeof(child.data) != "undefined"){
						child.onItemClick(child.data);
					}else{
						child.onItemClick();
					}
				}
			};
			this.childrenViews.add(item);
		};
		
		MenuLabel.prototype._init = function(){
			this.view = new Ele.HLayout("ele_menu_label");
			this.ele = this.view.ele;
			this.childrenViews = new Ele.Layout("ele_menu_label_children");
			this.childrenViews.setAlign("center");
			var context = this;
			
			var img = null;
			var txt = null;
			var hasChildren = false;
			if(typeof(args) == "object"){
				if(typeof(args.masking) == "object"){
					this.masking = args.masking;
				}else{
					this.masking = new Ele.Views.Masking();
					this.view.add(this.masking);
				}
				if(typeof(args.style) != "undefined"){
					this.ele.className = args.style;
				}
				if(typeof(args.icon) != "undefined"){
					img = new Ele.Img(args.icon,"ele_menu_label_icon");
				}
				if(typeof(args.text) != "undefined"){
					txt = new Label(args.text,"ele_ml4");
				}
				if(typeof(args.children) == "object"){
					//判断是否是数组
					if(Ele._isArray(args.children)){
						for(var i = 0; i < args.children.length; i ++){
							this.addChild(args.children[i]);
						}
						hasChildren = true;
					}
				}
				this.ele.onclick = function(){
					if(hasChildren){
						context.showChildren();
					}
					if(typeof(args.onItemClick) == "function"){
						if(typeof(args.data) != "undefined"){
							args.onItemClick(args.data);
						}else{
							args.onItemClick();
						}
					}
				};
			}
			if(img != null){
				this.view.add(img);
			}
			if(txt != null){
				this.view.add(txt);
			}
			if(hasChildren){
				var childrenIcon = new Ele.Img(Ele._pathPrefix+"ele/icons/icon_down_white.png","ele_menu_label_children_icon");
				this.view.add(childrenIcon);
			}
			//this.view.add(content);
		};
		this._init();
	};
})();
