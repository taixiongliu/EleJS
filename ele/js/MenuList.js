(function(){
	var MenuList = Ele.MenuList = function(args) {
		this.eleType = "layout";
		this.ele;
		this.view;
		this.width = 240;
		this.title;
		this.onItemClickHandler;
		
		MenuList.prototype.add = function(args){
			if(typeof(args.icon) == "undefined"){
				args.icon = Ele._pathPrefix+"ele/assets/30/icon_menuroot.png";
			}
			args.width = (this.width - 20)+"px";
			args.onItemClick = this.onItemClickHandler;
			var node = new Ele.TreeNode(args);
			if(typeof(args.children) == "object"){
				for(var i = 0; i < args.children.length; i ++){
					if(typeof(args.children[i].icon) == "undefined"){
						args.children[i].icon = Ele._pathPrefix+"ele/assets/20/icon_menuitem.png";
					}
					node.add(args.children[i]);
				}
			}
			if(typeof(args.expend) == "boolean"){
				if(args.expend){
					node.expend();
				}
			}
			
			this.view.add(node);
		};
		MenuList.prototype.onItemClickHandler = function(obj){
			if(this.onItemClickHandler != null){
				this.onItemClickHandler(obj);
			}
		};
		MenuList.prototype._init = function(){
			this.view = new Ele.Layout();
			this.view.setWidth(this.width+"px");
			this.view.setOverflowX("hidden");
			this.view.setOverflowY("auto");
			this.ele = this.view.ele;
			if(typeof(args) == "object"){
				if(typeof(args.onItemClick) == "function"){
					this.onItemClickHandler = args.onItemClick;
				}
			}
			var title = new Ele.Layout("ele_menulist_title_view");
			title.setAlign("center");
			var imgLeft = new Ele.Img(Ele._pathPrefix+"ele/assets/20/icon_menu_left.png", "ele_menulist_title_img");
			this.title = new Ele.Label("功能菜单", "ele_menulist_title_txt ele_ml5");
			var imgRight = new Ele.Img(Ele._pathPrefix+"ele/assets/20/icon_menu_right.png", "ele_menulist_title_img ele_ml5");
			title.add(imgLeft);
			title.add(this.title);
			title.add(imgRight);
			
			var position = new Ele.Layout("ele_menulist_title_position");
			
			this.view.add(title);
			this.view.add(position);
		};
		this._init();
	};
})();
