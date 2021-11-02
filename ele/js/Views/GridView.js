(function(){
	/*
	/args:
	/  widthPx:宽度固定
	/  heightPx：高度固定
	/  itemHeightPx：单行高度固定
	/  barMenu:是否显示默认功能菜单，默认true
	/  fields：array
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
		this.search;
		this.setView;
		this.masking;
		this.args;
		
		GridView.prototype.addRow = function(row){
			this.listGrid.addRow(row);
		};
		
		GridView.prototype.addToolBarMenu = function(button){
			this.menuView.add(button,{padding:"0 0 0 16px"});
		};
		
		GridView.prototype.setOnSearch = function(onSearch){
			this.search.setOnSearch(onSearch);
		};
		
		GridView.prototype._showMenuView = function(){
			console.log(1);
			var otop = this.view.ele.offsetTop+this.view.ele.offsetParent.offsetTop;
			var oleft = this.view.ele.offsetLeft+this.view.ele.offsetParent.offsetLeft+20;
			//var cheight = this.view.ele.clientHeight;
			var cheight = 48;
			this.setView.ele.style.top = (otop + cheight)+"px";
			this.setView.ele.style.left = oleft+"px";
			console.log(otop+"_"+oleft+"_"+cheight);
			console.log(2);
			var item = new Ele.Layout("ele_grid_set_view_item");
			item.setHtml("text");
			this.setView.add(item);
			this.masking.setContent(this.setView);
			this.masking.showMasking();
			console.log(3);
		};
		
		GridView.prototype._initSetView = function(){
			this.setView.clear();
			if(Ele._isArray(args.fields)){
				for(var i = 0; i < args.fields.length; i ++){
					var item = new Ele.Layout("ele_grid_set_view_item");
					item.setHtml(args.fields[i].textName);
					this.setView.add(item);
					if(i < args.fields.length - 1){
						var divider = new Ele.Layout("ele_grid_set_view_item_divider");
						this.setView.add(divider);
					}
				}
			}
		};
		
		GridView.prototype._init = function(){
			this.view = new Ele.Layout("ele_grid_view");
			this.ele = this.view.ele;
			this.masking = Ele.masking;
			this.setView = new Ele.HLayout("ele_grid_set_view");
			this.args = args;
			var context = this;
			this._initSetView();
			
			this.toolBar = new Ele.HLayout("ele_grid_tool_bar");
			this.menuView = new Ele.HLayout("ele_grid_menu_view");
			
			var barMenu = true;
			if(typeof(this.args.barMenu) == "boolean"){
				barMenu = this.args.barMenu;
			}
			if(barMenu){
				var refresh = new Ele.Button({text:"", icon:Ele._pathPrefix+"ele/assets/64/icon_refresh.png"});
				var set = new Ele.Button({text:"", icon:Ele._pathPrefix+"ele/assets/64/icon_set.png",onclick:function(){
					context._showMenuView();
				}});
				var divider = new Ele.Layout("ele_grid_tool_divider");
				this.menuView.add(refresh,{padding:"0px 0px 0px 16px"});
				this.menuView.add(set,{padding:"0px 0px 0px 16px"});
				this.menuView.add(divider,{padding:"0px 0px 0px 16px"});
			}
			
			
			this.filterView = new Ele.HLayout("ele_grid_filter_view");
			this.search = new Ele.SearchBox({hint:"搜索关键字"});
			this.filterView.add(this.search,{padding:"10px 16px 0px 0px"});
			this.toolBar.add(this.menuView);
			this.toolBar.add(this.filterView,{float:"right"});
			
			this.content = new Ele.Layout("ele_grid_view_content");
			this.listGrid = new Ele.ListGrid(this.args);
			this.content.add(this.listGrid);
			this.pageBar = new Ele.Layout("ele_grid_page_bar");
			
			var top = 0;
			var bottom = 0;
			if(this.args.toolBar){
				this.view.add(this.toolBar);
				top += 48;
			}
			if(this.args.pageBar){
				this.view.add(this.pageBar);
				bottom += 48;
			}
			this.content.ele.style.padding = top+"px 0 "+bottom+"px 0";
			
			this.view.add(this.content);
		};
		
		this._init();
	};
})();