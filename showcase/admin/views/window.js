var program = window.program = {viewLoad:function(){}};
program.viewLoad = viewload;
function viewload(view){
	//主面板--full
	var board = new Ele.Views.Board(true);
	
	var content = new Ele.Views.FullBoard();
	var context = this;
	
	var layout = new Ele.Layout("layout border-box");
	//var divider = new Ele.Layout("media_divider");
	var titleWindow = new Ele.Layout("line-title border-box");
	titleWindow.setHtml("窗体");
	
	var window = new Ele.PopWindow(300,120);
	window.setTitle("提示消息");
	var button = new Ele.Button({text:"打开窗体", onclick:function(){
		window.show();
	}});
	
	var titleAlert = new Ele.Layout("line-title border-box");
	titleAlert.setHtml("Alert");
	
	var button2 = new Ele.Button({text:"打开提示", onclick:function(){
		view.alert("this is alert message.");
	}});
	
	var titleConfirm = new Ele.Layout("line-title border-box");
	titleConfirm.setHtml("Confirm");
	var button3 = new Ele.Button({text:"打开确认窗口", onclick:function(){
		view.confirm("this is confirm message.",function(){
			console.log("click sure.");
		});
	}});
	
	var titleLoader = new Ele.Layout("line-title border-box");
	titleLoader.setHtml("Loader");
	var button4 = new Ele.Button({text:"打开加载", onclick:function(){
		view.showLoad();
		setTimeout(function(){
			view.hideLoad();
		}, 3000)
	}});
	
	var infoView = new Ele.Layout("window-info-view border-box");
	infoView.setHtml("this is window info.");
	window.addView(infoView);
	
	layout.add(new Ele.Layout("divider"));
	layout.add(titleWindow);
	layout.add(new Ele.Layout("divider"));
	layout.add(button);
	layout.add(new Ele.Layout("divider"));
	layout.add(titleAlert);
	layout.add(new Ele.Layout("divider"));
	layout.add(button2);
	layout.add(new Ele.Layout("divider"));
	layout.add(titleConfirm);
	layout.add(new Ele.Layout("divider"));
	layout.add(button3);
	layout.add(new Ele.Layout("divider"));
	layout.add(titleLoader);
	layout.add(new Ele.Layout("divider"));
	layout.add(button4);
	
	
	
	content.addView(layout);
	
	board.addBoard(content);
	
	view.addContentView(board);
}