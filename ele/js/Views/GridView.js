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
		this.gridData = [];
		this.menuView;
		this.filterView;
		this.search;
		this.setView;
		this.windowType;
		this.masking;
		this.position;
		this.offset;
		this.args;
		this.setArgs;
		this.radio;
		this.etRowHeight;
		this.cboxArray = [];
		this.rwidthArray = [];
		this.lbMsg;
		this.pageBarView;
		
		GridView.prototype.addRow = function(row){
			this.gridData.push(row);
			this.listGrid.addRow(row);
		};
		
		GridView.prototype.addToolBarMenu = function(button){
			this.menuView.add(button,{padding:"0 0 0 16px"});
		};
		GridView.prototype.setWindowOffset = function(size){
			if(this.windowType){
				this.offset = size;
			}
		};
		
		GridView.prototype.setOnSearch = function(onSearch){
			this.search.setOnSearch(onSearch);
		};
		
		GridView.prototype.setDataFormat = function(formatHandler){
			this.pageBarView.setFormat(formatHandler);
		};
		
		GridView.prototype.getSelected = function(){
			return this.listGrid.getSelect();
		};
		GridView.prototype.clear = function(){
			this.listGrid.clear();
		};
		GridView.prototype.selectAll = function(){
			this.listGrid.selectAll();
		};
		GridView.prototype.unSelectAll = function(){
			this.listGrid.unSelectAll();
		};
		
		//加载数据源
		GridView.prototype.loadDataSources = function(dataSources){
			if(!Ele._isArray(dataSources)){
				return ;
			}
			this.listGrid.clear();
			this.gridData = [];
			for(var i = 0; i < dataSources.length; i ++){
				this.addRow(dataSources[i]);
			}
		};
		GridView.prototype._onDataResponse = function(dataSources){
			this.loadDataSources(dataSources);
		};
		GridView.prototype.loadDataSourcesUrl = function(url, funError){
			var context = this;
			this.pageBarView.loadData(url, function(dataSources){
				context._onDataResponse(dataSources);
			}, funError);
		};
		
		GridView.prototype._onReset = function(){
			this.setArgs = Ele._cloneObject(this.args);
			this.content.remove(this.listGrid);
			this.listGrid = new Ele.ListGrid(this.setArgs);
			this.content.add(this.listGrid);
			for(var row in this.gridData){
				this.listGrid.addRow(this.gridData[row]);
			}
		};
		
		GridView.prototype._onSet = function(){
			this._showTip("");
			var fields = Ele._cloneObject(this.setArgs.fields);
			var tempFields = [];
			var updateData = [];
			var tp = 0;
			for(var i = 0; i < this.cboxArray.length; i ++){
				if(this.cboxArray[i].isChecked()){
					fields[i].hidden = false;
					var value = this.rwidthArray[i].getValue();
					if(value != ""){
						var num = Number.parseInt(value);
						tp += num;
						if(this.radio.getSelectedValue() == 1){
							fields[i].fieldWidth = num+"%";
						}else{
							fields[i].fieldWidth = num;
						}
						updateData.push(i);
					}
					tempFields.push(fields[i]);
				}else{
					fields[i].hidden = true;
					this.rwidthArray[i].setValue("");
					this.rwidthArray[i].setHint("");
					this.rwidthArray[i].data = "";
				}
			}
			if(this.radio.getSelectedValue() == 1 && tp > 100){
				this._showTip("展示字段百分比总和大于100");
				return;
			}
			this.radio.data = this.radio.getSelectedValue();
			for(var index = 0; index < updateData.length; index ++){
				this.rwidthArray[updateData[index]].data = this.rwidthArray[updateData[index]].getValue();
			}
			this.setArgs.fields = fields;
			this.setArgs.itemHeightPx = Number.parseInt(this.etRowHeight.getValue());
			
			var tempArgs = Ele._cloneObject(this.setArgs);
			tempArgs.fields = tempFields;
			
			//关闭窗口
			this._hideMenuView();
			
			this.content.remove(this.listGrid);
			this.listGrid = new Ele.ListGrid(tempArgs);
			this.content.add(this.listGrid);
			for(var row in this.gridData){
				this.listGrid.addRow(this.gridData[row]);
			}
		};
		GridView.prototype._showTip = function(tip){
			if(tip == ""){
				this.lbMsg.setText("");
				return ;
			}
			this.lbMsg.setText("Tip："+tip);
		};
		
		GridView.prototype._hideMenuView = function(){
			if(this.windowType){
				this.masking.hideMasking();
				return ;
			}
			this.setView.ele.style.display = "none";
			this.masking.hideMasking();
		};
		
		GridView.prototype._showMenuView = function(){
			if(this.windowType){
				var oleft = this.ele.offsetLeft + this.ele.offsetParent.offsetLeft;
				var otop = this.ele.offsetTop + this.ele.offsetParent.offsetTop;
				//定位在菜单布局下面
				this.position.positionType = "bottom-left";
				this.position.top = otop + this.menuView.ele.offsetHeight;
				this.position.left = oleft;
				
				if(this.offset != null && this.offset instanceof Ele.Utils.Size){
					this.position.setOffset(this.offset);
				}
				this.masking.setContent(this.setView, this.position);
				this.masking.showMasking();
				
				this._initSetValue();
				return ;
			}
			this.masking.setContentNone();
			this.masking.showMasking();
			var context = this;
			this.masking.setHiddenHandler(function(){
				context._hideMenuView();
			});
			
			this.setView.ele.style.display = "block";
			this._initSetValue();
		};
		
		GridView.prototype._initSetValue = function(){
			this._showTip("");
			this.etRowHeight.ele.value = this.listGrid.itemHeight;
			this.radio.selectByValue(this.radio.data);
			if(Ele._isArray(this.setArgs.fields)){
				var tempRwid = [];
				for(var i = 0; i < this.setArgs.fields.length; i ++){
					var field = this.setArgs.fields[i];
					if(field.hidden){
						this.cboxArray[i].unChecked();
						this.rwidthArray[i].setValue("");
						continue ;
					}
					this.cboxArray[i].checked();
					tempRwid.push(this.rwidthArray[i]);
				}
				if(tempRwid.length > 0){
					var wp = 100/tempRwid.length;
					for(var j = 0; j < tempRwid.length; j ++){
						if(tempRwid[j].data == ""){
							tempRwid[j].setHint(wp);
							tempRwid[j].setValue("");
						}else{
							tempRwid[j].setHint("");
							tempRwid[j].setValue(tempRwid[j].data);
						}
					}
				}
				
			}
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
			this.radio.data = 1;
			title.add(this.radio,{padding:"4px 0 0 0"});
			
			var imgRowHeight = new Ele.Img(Ele._pathPrefix+"ele/assets/16/icon_row_height.png", "ele_grid_set_view_title_icon");
			this.etRowHeight = new Ele.TextBox({style:"ele_grid_set_row_height_style"});
			this.etRowHeight.ele.type = "number";
			title.add(this.etRowHeight,{float:"right"});
			title.add(imgRowHeight,{padding:"0 8px 0 0",float:"right"});
			
			this.setView.add(title);
			var divider = new Ele.Layout("ele_grid_set_view_item_divider");
			this.setView.add(divider);
			if(Ele._isArray(this.setArgs.fields)){
				for(var i = 0; i < this.setArgs.fields.length; i ++){
					var item = new Ele.HLayout("ele_grid_set_view_item");
					var cbox = new Ele.ICheckBox();
					cbox.ele.style.marginTop= "8px";
					cbox.data = this.setArgs.fields[i];
					var textName = new Ele.Label(this.setArgs.fields[i].textName);
					var etColWidth = new Ele.TextBox({style:"ele_grid_set_row_height_style"});
					etColWidth.ele.type = "number";
					etColWidth.data = "";
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
			var bottom = new Ele.HLayout("ele_grid_set_view_bottom_item");
			var sure = new Ele.Button({text:"确定", icon:Ele._pathPrefix+"ele/assets/64/icon_sure.png", onclick:function(){
				context._onSet();
			}});
			this.lbMsg = new Ele.Label("", "ele_grid_set_view_bottom_hint");
			bottom.add(this.lbMsg);
			bottom.add(sure, {float:"right"});
			this.setView.add(bottom);
		};
		
		GridView.prototype._init = function(){
			this.view = new Ele.Layout("ele_grid_view");
			this.ele = this.view.ele;
			this.masking = Ele.masking;
			
			this.args = args;
			this.setArgs = Ele._cloneObject(args);
			var context = this;
			
			var barMenu = true;
			if(typeof(this.args.barMenu) == "boolean"){
				barMenu = this.args.barMenu;
			}
			if(typeof(args.windowType) == "boolean" && args.windowType){
				this.windowType = true;
			}
			if(this.windowType){
				this.setView = new Ele.HLayout("ele_grid_set_view_wt");
				this.position = new Ele.Utils.Position();
			}else{
				this.setView = new Ele.HLayout("ele_grid_set_view");
				this.setView.ele.style.zIndex = this.masking.maxZIndex + 1;
				this.view.add(this.setView);
			}
			
			this.toolBar = new Ele.HLayout("ele_grid_tool_bar");
			this.menuView = new Ele.HLayout("ele_grid_menu_view");
			
			
			if(barMenu){
				var refresh = new Ele.Button({text:"", icon:Ele._pathPrefix+"ele/assets/64/icon_refresh.png",onclick:function(){
					context._onReset();
				}});
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
			this.pageBarView = new Ele.Views.PageBarView();
			this.pageBar.add(this.pageBarView);
			
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
			this.view.add(this.content);
			this.content.ele.style.padding = top+"px 0 "+bottom+"px 0";
			
			//初始化设置布局
			this._initSetView();
		};
		
		this._init();
	};
})();