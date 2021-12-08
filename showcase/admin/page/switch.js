(function(){
	var Switch = window.Switch = function(rootView){
		MainView.call(this, rootView, 3);
		
		Switch.prototype.viewCreate = function(){
			
			//主面板--full
			var board = new Ele.Views.Board(true);
			
			var content = new Ele.Views.FullBoard();
			
			var context = this;
			
			var switchView = new Ele.Views.SwitchView();
			var pageView1 = new Ele.Layout("switch_page_1");
			pageView1.setHtml("page view 1.");
			var pageView2 = new Ele.Layout("switch_page_2");
			pageView2.setHtml("page view 2.");
			var pageView3 = new Ele.Layout("switch_page_3");
			pageView3.setHtml("page view 3.");
			switchView.addPage(pageView1);
			switchView.addPage(pageView2);
			switchView.addPage(pageView3);
			switchView.autoPlay();
			setTimeout(function(){
				switchView.autoStop();
			},10000);
			
			content.addView(switchView);
			board.addBoard(content);
			
			this.addContentView(board);
		};
		this.viewCreate();
	}
	
	var Super = function (){};
	Super.prototype = MainView.prototype;
	Super.constructor = Switch;
	var sp = new Super();
	sp.constructor = Switch;
	Switch.prototype = sp;
})();