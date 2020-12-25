(function(){
	var MainView = window.MainView = function(){
		
		MainView.prototype.viewCreate = function(root){
			//主面板
			var board = new Ele.Views.Board();
			
			var welcom = new Ele.Views.EdgeBoard();
			var welTitle = new Ele.Layout("welcom_title");
			welTitle.setHtml("欢迎访问xxxxxx平台");
			var welLocation = new Ele.Layout("welcom_location");
			welLocation.setHtml("首页 / 看板");
			welcom.setLeft(welTitle);
			welcom.setRight(welLocation);
			
			board.add(welcom);
			
			var mergeBoard = new Ele.Views.MergeBoard();
			var mlv = new Ele.Layout("welcom_title");
			mlv.setHtml("left：30%");
			var mcv = new Ele.Layout("welcom_title");
			mcv.setHtml("center：40%");
			var mrv = new Ele.Layout("welcom_title");
			mrv.setHtml("right：30%");
			mergeBoard.setLeft(mlv);
			mergeBoard.setCenter(mcv);
			mergeBoard.setRight(mrv);
			
			board.add(mergeBoard);
			
			var hlinBoard = new Ele.Views.HLineBoard();
			var test = new Ele.Layout("welcom_title");
			test.setHtml("test：view 1-->25%");
			var test2 = new Ele.Layout("welcom_title");
			test2.setHtml("test：view 2-->25%");
			var test3 = new Ele.Layout("welcom_title");
			test3.setHtml("test：view 3-->25%");
			var test4 = new Ele.Layout("welcom_title");
			test4.setHtml("test：view 4-->25%");
			hlinBoard.add(test,25);
			hlinBoard.add(test2,25);
			hlinBoard.add(test3,25);
			hlinBoard.add(test4,25);
			board.add(hlinBoard);
			
			root.add(board);
		};
	}
})();