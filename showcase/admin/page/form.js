(function(){
	var Form = window.Form = function(rootView){
		MainView.call(this, rootView, 4);
		
		Form.prototype.viewCreate = function(){
			
			//主面板--full
			var board = new Ele.Views.Board(true);
			
			var content = new Ele.Views.FullBoard();
			
			var context = this;
			
			var formPanel = new Ele.Layout("form");
			var formTitle = new Ele.Layout("form_title");
			var lbTitle = new Ele.Label("表单元素", "form_title_text");
			formTitle.add(lbTitle);
			formPanel.add(formTitle);
			
			var form = new Ele.Layout("form_content");
			var formView = new Ele.Views.FormView();
			form.add(formView);
			formPanel.add(form);
			
			// var form = new Ele.Form("a.php");
			// var tb = new Ele.TextBox();
			// tb.ele.name = "name";
			// var btn = new Ele.Button({text:"go", onclick:function(){
			// 	console.log(form.ele.elements);
			// }});
			
			// form.add(tb);
			// form.add(btn);
			// formPanel.add(form);
			
			content.addView(formPanel);
			
			board.addBoard(content);
			
			this.addContentView(board);
		};
		this.viewCreate();
	}
	
	var Super = function (){};
	Super.prototype = MainView.prototype;
	Super.constructor = Form;
	var sp = new Super();
	sp.constructor = Form;
	Form.prototype = sp;
})();