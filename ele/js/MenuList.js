(function(){
	var MenuList = Ele.MenuList = function(args) {
		this.eleType = "layout";
		this.ele;
		this.view;
		this.width = 240;
		this.title;
		this.onItemClickHandler;
		
		MenuList.prototype.add = function(args){
			var para = {};
			if(typeof(args) != "object"){
				para.width = (this.width - 20)+"px";
				para.icon = Ele._pathPrefix+"ele/icons/icon_menuitem.png";
			}else{
				para = args;
				para.width = (this.width - 20)+"px";
			}
			para.onItemClick = this.onItemClickHandler;
			var node = new Ele.TreeNode(para);
			if(typeof(para.children) == "object"){
				for(var i = 0; i < para.children.length; i ++){
					node.add(para.children[i]);
				}
			}
			if(typeof(para.expend) == "boolean"){
				if(para.expend){
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
			var imgLeft = new Ele.Img(Ele._pathPrefix+"ele/icons/icon_menu.png", "ele_menulist_title_img");
			this.title = new Ele.Label("功能菜单", "ele_menulist_title_txt ele_ml5");
			var imgRight = new Ele.Img(Ele._pathPrefix+"ele/icons/icon_menu.png", "ele_menulist_title_img ele_ml5");
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
