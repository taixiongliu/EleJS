(function(){
	var Pop = window.Pop = function(rootView){
		MainView.call(this, rootView, 11);
		
		Pop.prototype.viewCreate = function(){
			
			//主面板--full
			var board = new Ele.Views.Board(true);
			
			var content = new Ele.Views.FullBoard();
			var context = this;
			
			var layout = new Ele.Layout("pop");
			var titlePop = new Ele.Layout("pop_title");
			titlePop.setHtml("弹出View");
			
			var popView = new Ele.Views.PopView();
			var button = new Ele.Button({text:"打开窗体", onclick:function(){
				popView.show();
			}});
			
			layout.add(new Ele.Layout("pop_divider"));
			layout.add(titlePop);
			layout.add(new Ele.Layout("pop_divider"));
			layout.add(button);
			
			content.addView(layout);
			
			board.addBoard(content);
			
			this.addContentView(board);
		};
		this.viewCreate();
	}
	
	var Super = function (){};
	Super.prototype = MainView.prototype;
	Super.constructor = Pop;
	var sp = new Super();
	sp.constructor = Pop;
	Pop.prototype = sp;
})();