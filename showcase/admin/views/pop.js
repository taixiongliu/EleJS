var program = window.program = {viewLoad:function(){}};
program.viewLoad = viewload;
function viewload(view){
	//主面板--full
	var board = new Ele.Views.Board(true);
	
	var content = new Ele.Views.FullBoard();
	var context = this;
	
	var layout = new Ele.Layout("layout border-box");
	var titlePop = new Ele.Layout("line-title border-box");
	titlePop.setHtml("弹出View");
	
	var popView = new Ele.Views.PopView();
	var button = new Ele.Button({text:"打开窗体", onclick:function(){
		popView.show();
	}});
	
	layout.add(new Ele.Layout("divider"));
	layout.add(titlePop);
	layout.add(new Ele.Layout("divider"));
	layout.add(button);
	
	content.addView(layout);
	
	board.addBoard(content);
	
	view.addContentView(board);
}