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
