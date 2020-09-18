(function(){
	var TreeNode = Ele.TreeNode = function(args) {
		this.eleType = "layout";
		this.ele;
		this.view;
		this.listView;
		this.isExpend = false;
		this.onClickHandler;
		this.onItemClickHandler;
		this.count = 0;
		this.selected = 0;
		
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
					cellStyle = " ele_treenode_selected";
					this.selected = args.id;
				}
			}
			var item = new Ele.Layout("ele_treenode_item_view"+cellStyle);
			item.setAlign("left");
			var mgl = " ele_ml10";
			if(typeof(args.icon) != "undefined"){
				var icItem = new Ele.Img(args.icon,"ele_treenode_icon ele_ml10");
				item.add(icItem);
				mgl = " ele_ml5";
			}
			var txtItem = new Ele.Label("unknow","ele_treenode_item_txt"+mgl);
			if(typeof(args.text) != "undefined"){
				txtItem.setText(args.text);
			}
			item.add(txtItem);
			
			var context = this;
			item.ele.data = args;
			item.ele.cellStyle = cellStyle;
			item.ele.onclick = function(){
				if(context.onItemClickHandler != null){
					context.onItemClickHandler(this.data);
				}
			};
			item.ele.onmouseover = function(){
				if(this.data.id == context.selected){
					return ;
				}
				this.className = "ele_treenode_item_view ele_treenode_over";
			};
			item.ele.onmouseout = function(){
				if(this.data.id == context.selected){
					return ;
				}
				this.className = "ele_treenode_item_view"+this.cellStyle;
			};
			
			this.listView.add(item);
			this.count ++;
		};
		TreeNode.prototype.close = function(){
			this.listView.ele.style.display="none";
			this.isExpend = false;
		};
		TreeNode.prototype.expend = function(){
			this.listView.ele.style.display="block";
			this.isExpend = true;
		};
		TreeNode.prototype.clear = function(){
			this.listView.setHtml("");
			this.count = 0;
		};
		TreeNode.prototype._initListView = function(){
			var empty = new Ele.Label("无数据","ele_label ele_llh30");
			this.listView.add(empty);
		};
		TreeNode.prototype._init = function(){
			this.view = new Ele.Layout();
			this.view.setHeight("auto");
			this.ele = this.view.ele;
			var title = new Ele.Layout("ele_treenode_title_view");
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
				if(context.isExpend){
					context.close();
				}else{
					context.expend();
				}
				if(this.onClickHandler != null){
					this.onClickHandler(context.expend);
				}
			};
			this.listView = new Ele.Layout();
			this.listView.setHeight("auto");
			this.listView.setAlign("center");
			this.close();
			
			//初始化list
			this._initListView();
			var divider = new Ele.Layout("ele_treenode_divider");
			
			this.view.add(title);
			this.view.add(this.listView);
			this.view.add(divider);
		};
		this._init();
	};
})();
