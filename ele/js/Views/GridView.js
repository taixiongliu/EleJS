(function(){
	/*
	/args:
	/  widthPx
	/  heightPx
	/  itemHeightPx
	/  fields：
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
		this.menuView;
		this.filterView;
		
		GridView.prototype.addRow = function(row){
			this.listGrid.addRow(row);
		};
		
		GridView.prototype.addToolBarMenu = function(iconMenu){
			this.menuView.add(iconMenu,{padding:"0 0 0 16px"});
		};
		
		GridView.prototype._init = function(){
			this.view = new Ele.Layout("ele_grid_view");
			this.ele = this.view.ele;
			
			this.toolBar = new Ele.HLayout("ele_grid_tool_bar");
			this.menuView = new Ele.HLayout("ele_grid_menu_view");
			var refresh = new Ele.Button({text:"", icon:Ele._pathPrefix+"ele/assets/64/icon_refresh.png"});
			var set = new Ele.Button({text:"", icon:Ele._pathPrefix+"ele/assets/64/icon_set.png"});
			var divider = new Ele.Layout("ele_grid_tool_divider");
			this.menuView.add(refresh,{padding:"0px 0px 0px 16px"});
			this.menuView.add(set,{padding:"0px 0px 0px 16px"});
			this.menuView.add(divider,{padding:"0px 0px 0px 16px"});
			
			this.filterView = new Ele.HLayout("ele_grid_filter_view");
			var search = new Ele.SearchBox({hint:"搜索关键字"});
			this.filterView.add(search,{padding:"10px 16px 0px 0px"});
			this.toolBar.add(this.menuView);
			this.toolBar.add(this.filterView,{float:"right"});
			
			this.content = new Ele.Layout("ele_grid_view_content");
			this.listGrid = new Ele.ListGrid(args);
			this.content.add(this.listGrid);
			this.pageBar = new Ele.Layout("ele_grid_page_bar");
			
			var top = 0;
			var bottom = 0;
			if(args.toolBar){
				this.view.add(this.toolBar);
				top += 48;
			}
			if(args.pageBar){
				this.view.add(this.pageBar);
				bottom += 48;
			}
			this.content.ele.style.padding = top+"px 0 "+bottom+"px 0";
			
			this.view.add(this.content);
		};
		
		this._init();
	};
})();