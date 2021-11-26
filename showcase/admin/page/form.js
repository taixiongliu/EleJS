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
			var formView = new Ele.Views.FormView("test.html");
			// formView.setMethod("get");
			
			var textBoxItem = new Ele.Views.TextBoxItem({
				name:"input",
				text:"文本框",
				hint:"请输入",
			});
			textBoxItem.validateNotEmpty();
			//textBoxItem.validateLimit(4,10);
			//var reg = /^[a-zA-Z][a-zA-Z0-9_]{3,14}$/;
			//textBoxItem.validateReg(reg,"账号格式错误");
			//textBoxItem.validateStartWithLetter();
			//textBoxItem.validateNoChinese();
			//textBoxItem.validateAllChinese();
			//textBoxItem.validateInjectionKey();
			
			
			var textAreaItem = new Ele.Views.TextAreaItem({
				name:"textarea",
				text:"区域文本",
				hint:"请输入",
			});
			textAreaItem.validateNotEmpty();
			
			var radioBoxItem = new Ele.Views.RadioBoxItem({
				name:"radiobox",
				text:"单选组件",
				items:[{
					text:"A类型",
					value:1
				},
				{
					text:"B类型",
					value:2
				}]
			});
			
			formView.addItem(textBoxItem);
			formView.addItem(textAreaItem);
			formView.addItem(radioBoxItem);
			
			form.add(formView);
			var btnPanel = new Ele.HLayout("ele_form_button_panel");
			var reset = new Ele.Button({
				text:"重置",
				icon:Ele._pathPrefix+"ele/assets/64/icon_reset.png"
			});
			//自定义追加form数据
			//多次添加
			formView.appendFormData("cust", "auto");
			var submit = new Ele.Button({
				text:"提交",
				icon:Ele._pathPrefix+"ele/assets/64/icon_submit.png",
				onclick:function(){
					if(!formView.validate()){
						return ;
					}
					
					console.log("form data:"+formView.formData());
					// formView.submit();
					formView.submitAjax(function(res){
						console.log(res);
					});
				}
			});
			btnPanel.add(reset, {padding:"0 0 0 16px"});
			btnPanel.add(submit, {padding:"0 0 0 16px"});
			form.add(btnPanel);
			
			formPanel.add(form);
			
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