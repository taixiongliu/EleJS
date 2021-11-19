(function(){
	var TreeMenuView = Ele.Views.TreeMenuView = function(args) {
		this.eleType = "layout";
		this.ele;
		this.view;
		this.width = 240;
		this.height = 36;
		this.title;
		this.content;
		this.onItemClickHandler;
		this.baseController;
		this._onErrorResponse = null;
		this._selectFormat = null;
		this._expendFormat = null;
		
		TreeMenuView.prototype.add = function(args){
			if(typeof(args.icon) == "undefined"){
				args.icon = Ele._pathPrefix+"ele/assets/30/icon_menuroot.png";
			}
			args.width = (this.width - 8)+"px";
			args.onItemClick = this.onItemClickHandler;
			var node = new Ele.TreeNode(args);
			if(this._expendFormat != null){
				if(this._expendFormat(args.data)){
					args.expend = true;
				}else{
					args.expend = false;
				}
			}
			if(typeof(args.children) == "object"){
				for(var i = 0; i < args.children.length; i ++){
					if(typeof(args.children[i].icon) == "undefined"){
						args.children[i].icon = Ele._pathPrefix+"ele/assets/20/icon_menuitem.png";
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
			if(typeof(args.expend) == "boolean"){
				if(args.expend){
					node.expend();
				}
			}
			
			this.content.add(node);
		};
		TreeMenuView.prototype.setTitle = function(title){
			this.title.setText(title);
		};
		TreeMenuView.prototype.fillHeight = function(height){
			this.view.setHeight(height+"px");
			this.content.setHeight((height - 36)+"px");
		};
		TreeMenuView.prototype.onItemClickHandler = function(obj){
			if(this.onItemClickHandler != null){
				this.onItemClickHandler(obj);
			}
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
		TreeMenuView.prototype.loadDataSourcesUrl = function(url, funError){
			if(typeof(funError) == "function"){
				this._onErrorResponse = funError;
			}
			this.baseController.loadData(url);
		};
		TreeMenuView.prototype._init = function(){
			this.view = new Ele.Layout("ele_menulist");
			this.ele = this.view.ele;
			var context = this;
			if(typeof(args) == "object"){
				if(typeof(args.onItemClick) == "function"){
					this.onItemClickHandler = args.onItemClick;
				}
				if(typeof(args.selectFormat) == "function"){
					this._selectFormat = args.selectFormat;
				}
				if(typeof(args.expendFormat) == "function"){
					this._expendFormat = args.expendFormat;
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
			var imgLeft = new Ele.Img(Ele._pathPrefix+"ele/assets/20/icon_menu_left.png", "ele_menulist_title_img");
			this.title = new Ele.Label("功能菜单", "ele_menulist_title_txt ele_ml5");
			var imgRight = new Ele.Img(Ele._pathPrefix+"ele/assets/20/icon_menu_right.png", "ele_menulist_title_img ele_ml5");
			title.add(imgLeft);
			title.add(this.title);
			title.add(imgRight);
			
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
