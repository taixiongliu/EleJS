(function(){
	var TableView = window.TableView = function(){
		
		TableView.prototype.viewCreate = function(root){
			//主面板--full
			var board = new Ele.Views.Board(true);
			
			var welcom = new Ele.Views.FullBoard();
			
			var args = {toolBar:true,
			selectOpr:{},
			itemHeightPx:60,
			fields:[{textName:"ID",fieldName:"id"},{textName:"姓名",fieldName:"name"},{textName:"班级",fieldName:"clazz"}],
			operations:{menus:[{text:"修改",icon:"img/shoucang.png"}]}};
			var tableView = new Ele.Views.GridView(args);
			tableView.addRow({id:1, name:"ltx", clazz:"三年二班ASAS ASXZHSIU	Dhisudhd"});
			tableView.addRow({id:2, name:"Lucy", clazz:"三年二班"});
			tableView.addRow({id:3, name:"Eric", clazz:"三年四班"});
			tableView.addRow({id:3, name:"Eric", clazz:"三年四班"});
			tableView.addRow({id:3, name:"Eric", clazz:"三年四班"});
			tableView.addRow({id:3, name:"Eric", clazz:"三年四班"});
			tableView.addRow({id:3, name:"Eric", clazz:"三年四班"});
			tableView.addRow({id:3, name:"Eric", clazz:"三年四班"});
			tableView.addRow({id:3, name:"Eric", clazz:"三年四班"});
			tableView.addRow({id:3, name:"Eric", clazz:"三年四班"});
			tableView.addRow({id:3, name:"Eric", clazz:"三年四班"});
			tableView.addRow({id:3, name:"Eric", clazz:"三年四班"});
			tableView.addRow({id:3, name:"Eric", clazz:"三年四班"});
			tableView.addRow({id:3, name:"Eric", clazz:"三年四班"});
			tableView.addRow({id:3, name:"Eric", clazz:"三年四班"});
			tableView.addRow({id:3, name:"Eric", clazz:"三年四班"});
			tableView.addRow({id:3, name:"Eric", clazz:"三年四班"});
			tableView.addRow({id:3, name:"Eric", clazz:"三年四班"});
			welcom.addView(tableView);
			board.addBoard(welcom);
			
			root.add(board);
		};
	}
})();