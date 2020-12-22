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
			
			
			
			root.add(board);
		};
	}
})();