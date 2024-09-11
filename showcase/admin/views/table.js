var program = window.program = {viewLoad:function(){}};
program.viewLoad = viewload;
function viewload(view){
	//主面板--full
	var board = new Ele.Views.Board(true);
	
	var content = new Ele.Views.FullBoard();
	
	var context = this;
	
	var args = {toolBar:true,
	pageBar:true,
	selectOpr:{},
	//canScoll:false,
	// itemHeightPx:60,
	//barMenu:false,
	// windowType:true,
	fields:[{textName:"ID",fieldName:"id"},{textName:"姓名",fieldName:"name", format:function(data){
		var img = new Ele.Img(Ele.getSkinName()+"/"+data.name);
		img.ele.style.height = "40px";
		// return img;  Ele object
		// return img.ele;  dom element
		return img.ele.outerHTML;  //string
	}},{textName:"班级",fieldName:"clazz"}],
	operations:{menus:[{text:"修改",icon:Ele.getSkinName()+"/icon/editor.png",focusIcon:Ele.getSkinName()+"/icon/editor-focus.png",onclick:function(row){
		console.log("nice"+row.id);
		},format:function(row){
		if(row.id == 3){
			return false;
		}
		return true;
	}}]}};
	var tableView = new Ele.Views.GridView(args);
	// tableView.setDataFormat(function(res){
	// 	console.log("截胡:"+res);
	// });
	var button = new Ele.Button({text:"选择", icon:Ele.getSkinName()+"/icon/add.png", onclick:function(){
		var sarr = tableView.getSelected();
		var msg = "您选择了：";
		for(var i in sarr){
			msg += sarr[i].id+",";
		}
		view.alert(msg);
	}});
	tableView.addToolBarMenu(button);
	tableView.setOnSearch(function(key){
		console.log(key+"...");
	});
	
	// var ds = [{id:1, name:"ltx", clazz:"三年二班ASAS ASXZHSIU	Dhisudhd"},
	// 	{id:2, name:"Lucy", clazz:"三年二班"},
	// 	{id:2, name:"Lucy", clazz:"三年二班"},
	// 	{id:2, name:"Lucy", clazz:"三年二班"},
	// 	{id:2, name:"Lucy", clazz:"三年二班"},
	// 	{id:2, name:"Lucy", clazz:"三年二班"},
	// 	{id:2, name:"Lucy", clazz:"三年二班"},
	// 	{id:2, name:"Lucy", clazz:"三年二班"},
	// 	{id:2, name:"Lucy", clazz:"三年二班"},
	// ];
	// tableView.loadDataSources(ds);
	tableView.loadDataSourcesUrl("datasources/table.json", function(error){
		context.alertMsg(error.resMsg);
	});
	
	
	content.addView(tableView);
	board.addBoard(content);
	
	view.addContentView(board);
}