(function(){
	var TableView = window.TableView = function(rootView){
		MainView.call(this, rootView, 1);
		
		TableView.prototype.viewCreate = function(){
			//主面板--full
			var board = new Ele.Views.Board(true);
			
			var welcom = new Ele.Views.FullBoard();
			
			var args = {toolBar:true,
			pageBar:true,
			selectOpr:{},
			// itemHeightPx:60,
			//barMenu:false,
			fields:[{textName:"ID",fieldName:"id"},{textName:"姓名",fieldName:"name"},{textName:"班级",fieldName:"clazz"}],
			operations:{menus:[{text:"修改",icon:"img/shoucang.png",onclick:function(){console.log("nice");}}]}};
			var tableView = new Ele.Views.GridView(args);
			// tableView.setDataFormat(function(res){
			// 	console.log("截胡:"+res);
			// });
			var button = new Ele.Button({text:"添加", icon:"img/shoucang.png"});
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
			tableView.loadDataSourcesUrl("datasources/table.json");
			
			
			welcom.addView(tableView);
			board.addBoard(welcom);
			
			this.addContentView(board);
		};
		this.viewCreate();
	}
	
	var Super = function (){};
	Super.prototype = MainView.prototype;
	Super.constructor = TableView;
	var sp = new Super();
	sp.constructor = TableView;
	TableView.prototype = sp;
})();