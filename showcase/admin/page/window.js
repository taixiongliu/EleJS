(function(){
	var Window = window.Window = function(rootView){
		MainView.call(this, rootView, 6);
		
		Window.prototype.viewCreate = function(){
			
			//主面板--full
			var board = new Ele.Views.Board(true);
			
			var content = new Ele.Views.FullBoard();
			var context = this;
			
			var layout = new Ele.Layout("window");
			//var divider = new Ele.Layout("media_divider");
			var titleWindow = new Ele.Layout("window_title");
			titleWindow.setHtml("窗体");
			
			var window = new Ele.PopWindow(300,120);
			window.setTitle("提示消息");
			var button = new Ele.Button({text:"打开窗体", onclick:function(){
				window.show();
			}});
			
			var titleAlert = new Ele.Layout("window_title");
			titleAlert.setHtml("Alert");
			var alert = new Ele.Alert();
			alert.setMsg("this is alert message.");
			var button2 = new Ele.Button({text:"打开提示", onclick:function(){
				alert.show();
			}});
			
			var titleConfirm = new Ele.Layout("window_title");
			titleConfirm.setHtml("Confirm");
			var confirm = new Ele.Confirm();
			confirm.setMsg("this is confirm message.");
			var button3 = new Ele.Button({text:"打开确认窗口", onclick:function(){
				confirm.show();
			}});
			
			var titleLoader = new Ele.Layout("window_title");
			titleLoader.setHtml("Loader");
			var load = new Ele.AjaxLoad();
			var button4 = new Ele.Button({text:"打开加载", onclick:function(){
				load.show();
				setTimeout(function(){
					load.hide();
				}, 3000)
			}});
			
			var infoView = new Ele.Layout("window_info_view");
			infoView.setHtml("this is window info.");
			window.addView(infoView);
			
			layout.add(new Ele.Layout("window_divider"));
			layout.add(titleWindow);
			layout.add(new Ele.Layout("window_divider"));
			layout.add(button);
			layout.add(new Ele.Layout("window_divider"));
			layout.add(titleAlert);
			layout.add(new Ele.Layout("window_divider"));
			layout.add(button2);
			layout.add(new Ele.Layout("window_divider"));
			layout.add(titleConfirm);
			layout.add(new Ele.Layout("window_divider"));
			layout.add(button3);
			layout.add(new Ele.Layout("window_divider"));
			layout.add(titleLoader);
			layout.add(new Ele.Layout("window_divider"));
			layout.add(button4);
			
			
			
			content.addView(layout);
			
			board.addBoard(content);
			
			this.addContentView(board);
		};
		this.viewCreate();
	}
	
	var Super = function (){};
	Super.prototype = MainView.prototype;
	Super.constructor = Window;
	var sp = new Super();
	sp.constructor = Window;
	Window.prototype = sp;
})();