(function(){
	var TableView = window.TableView = function(){
		
		TableView.prototype.viewCreate = function(root){
			//主面板--full
			var board = new Ele.Views.Board(true);
			
			var welcom = new Ele.Views.FullBoard();
			
			var tableView = new Ele.Layout("table_view");
			tableView.setHtml("hello table view.");
			welcom.addView(tableView);
			board.addBoard(welcom);
			
			root.add(board);
		};
	}
})();