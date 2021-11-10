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
		this.radio;
		this.etRowHeight;
		this.cboxArray = [];
		this.rwidthArray = [];
		
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
			var otop = this.view.ele.offsetTop+this.view.ele.offsetParent.offsetTop;
			var oleft = this.view.ele.offsetLeft+this.view.ele.offsetParent.offsetLeft;
			this.setView.ele.style.top = (otop + 48)+"px";
			this.setView.ele.style.left = oleft+"px";
			this.masking.setContent(this.setView);
			this.masking.showMasking();
		};
		
		GridView.prototype._onReset = function(){
			this.masking.hideMasking();
		};
		
		GridView.prototype._initSetView = function(){
			this.setView.clear();
			var context = this;
			var title = new Ele.HLayout("ele_grid_set_view_title_item");
			var cbAll = new Ele.ICheckBox();
			cbAll.ele.style.marginTop="6px";
			var lbTitle = new Ele.Label("全选","");
			title.add(cbAll);
			title.add(lbTitle,{padding:"0 0 0 8px"});
			
			var imgColWidth = new Ele.Img(Ele._pathPrefix+"ele/assets/16/icon_col_width.png", "ele_grid_set_view_title_icon");
			title.add(imgColWidth,{padding:"0 0 0 24px"});
			this.radio = new Ele.RadioBox({items:[{text:"%",value:1},{text:"px",value:2}]});
			title.add(this.radio,{padding:"4px 0 0 0"});
			
			var imgRowHeight = new Ele.Img(Ele._pathPrefix+"ele/assets/16/icon_row_height.png", "ele_grid_set_view_title_icon");
			this.etRowHeight = new Ele.TextBox({style:"ele_grid_set_row_height_style"});
			this.etRowHeight.ele.type = "number";
			this.etRowHeight.ele.value = this.listGrid.itemHeight;
			title.add(this.etRowHeight,{float:"right"});
			title.add(imgRowHeight,{padding:"0 8px 0 0",float:"right"});
			
			this.setView.add(title);
			var divider = new Ele.Layout("ele_grid_set_view_item_divider");
			this.setView.add(divider);
			if(Ele._isArray(args.fields)){
				var wp = 100/args.fields.length;
				for(var i = 0; i < args.fields.length; i ++){
					var item = new Ele.HLayout("ele_grid_set_view_item");
					var cbox = new Ele.ICheckBox();
					cbox.ele.style.marginTop= "8px";
					cbox.data = args.fields[i];
					//item.setHtml(args.fields[i].textName);
					var textName = new Ele.Label(args.fields[i].textName);
					var etColWidth = new Ele.TextBox({style:"ele_grid_set_row_height_style"});
					etColWidth.ele.type = "number";
					etColWidth.ele.value = wp;
					item.add(cbox);
					item.add(textName, {padding:"0 0 0 8px"});
					item.add(etColWidth, {float:"right"});
					var icw = new Ele.Img(Ele._pathPrefix+"ele/assets/16/icon_col_width.png", "ele_grid_set_view_title_icon");
					item.add(icw, {padding:"0 8px 0 0",float:"right"});
					
					this.setView.add(item);
					var divider = new Ele.Layout("ele_grid_set_view_item_divider");
					this.setView.add(divider);
					
					this.cboxArray.push(cbox);
					this.rwidthArray.push(etColWidth);
				}
			}
			var bottom = new Ele.Layout("ele_grid_set_view_bottom_item");
			bottom.setAlign("right");
			var sure = new Ele.Button({text:"确定", icon:Ele._pathPrefix+"ele/assets/64/icon_sure.png", onclick:function(){
				context._onReset();
			}});
			bottom.add(sure);
			this.setView.add(bottom);
		};
		
		GridView.prototype._init = function(){
			this.view = new Ele.Layout("ele_grid_view");
			this.ele = this.view.ele;
			this.masking = Ele.masking;
			this.setView = new Ele.HLayout("ele_grid_set_view");
			this.args = args;
			var context = this;
			
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
			
			//初始化设置布局
			this._initSetView();
		};
		
		this._init();
	};
})();