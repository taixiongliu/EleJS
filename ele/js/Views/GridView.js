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
		
		GridView.prototype.addRow = function(row){
			this.content.addRow(row);
		}
		
		GridView.prototype._init = function(){
			this.view = new Ele.Layout("ele_grid_view");
			this.ele = this.view.ele;
			
			this.content = new Ele.ListGrid(args);
			
			
			this.view.add(this.content);
		};
		
		this._init();
	};
})();