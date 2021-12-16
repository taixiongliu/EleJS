(function(){
	var Form = window.Form = function(rootView){
		MainView.call(this, rootView, 5);
		
		Form.prototype.viewCreate = function(){
			
			//主面板--full
			var board = new Ele.Views.Board(true);
			
			var content = new Ele.Views.FullBoard();
			
			var context = this;
			
			var formPanel = new Ele.Layout("form ele_scrollbar");
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
				readOnly:true,
				value: "不可修改文本"
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
			textAreaItem.validateNoChinese();
			
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
				},
				{
					text:"C类型",
					value:3
				},
				{
					text:"D类型",
					value:4
				}]
			});
			
			var fileItem = new Ele.Views.FileItem({
				name:"file",
				text:"文件组件",
			});
			//fileItem.readOnly(true);
			//fileItem.setValueUrl("http://127.0.0.1/EleJS/showcase/admin/img/shoucang.png");
			//fileItem.validateNotEmpty();
			// fileItem.acceptImage();
			
			var selectBoxItem = new Ele.Views.SelectBoxItem({
				name:"select",
				text:"下拉选择组件"
			});
			selectBoxItem.loadDataSourcesUrl("datasources/select.json");
			//selectBoxItem.readOnly(true);
			selectBoxItem.validateNotEmpty();
			selectBoxItem.setOnFilterSearch(function(value){
				if(value == ""){
					selectBoxItem.setFilterData([]);
				}else{
					selectBoxItem.loadFilterDataSourcesUrl("datasources/selectfilter.php", value);
					// var filter1 = new Ele.OptionFilter();
					// filter1.appendNormal("p");
					// filter1.appendFilter(value);
					// filter1.appendNormal("s");
					
					
					// var filter2 = new Ele.OptionFilter();
					// filter2.appendNormal("p2");
					// filter2.appendFilter(value);
					// filter2.appendNormal("s2");
					
					// var filter3 = new Ele.OptionFilter();
					// filter3.appendNormal("p3");
					// filter3.appendFilter(value);
					// filter3.appendNormal("s3");
					
					// var fitems = [
					// 	{text:"智推1", value:1,filterView:filter1},
					// 	{text:"智推2", value:2,filterView:filter2},
					// 	{text:"智推3", value:3,filterView:filter3}
					// ];
					// //更新智推数据
					// selectBoxItem.setFilterData(fitems);
				}
			});
			
			var dateBoxItem = new Ele.Views.DateBoxItem({
				name:"date",
				windowType:true,
				// readOnly:true,
				value:"2021-10-10",
				text:"时间选择组件"
			});
			//dateBoxItem.setPattern("yyyy/MM/dd HH:mm:ss S EEE qq");
			
			var checkBoxItem = new Ele.Views.CheckBoxItem({
				name:"checkbox",
				text:"多选组件",
				//lines:4,优先级大于自动填充的行数
				items:[{
					text:"A类型",
					value:1
				},
				{
					text:"B类型",
					value:2
				},
				{
					text:"C类型",
					value:3
				},
				{
					text:"D类型",
					value:4
				},
				{
					text:"E类型",
					value:5
				},
				{
					text:"F类型",
					value:6
				}]
			});
			// checkBoxItem.validateNotEmpty();
			
			var passwordItem = new Ele.Views.TextBoxItem({
				name:"pass",
				password:true,
				text:"密码框",
				hint:"请输入"
			});
			
			formView.addItem(textBoxItem);
			formView.addItem(textAreaItem);
			formView.addItem(radioBoxItem);
			formView.addItem(fileItem);
			formView.addItem(selectBoxItem);
			formView.addItem(dateBoxItem);
			formView.addItem(checkBoxItem);
			formView.addItem(passwordItem);
			
			form.add(formView);
			var btnPanel = new Ele.HLayout("form_button_panel");
			var reset = new Ele.Button({
				text:"重置",
				icon:Ele._pathPrefix+"ele/assets/64/icon_reset.png",
				onclick:function(){
					formView.reset();
				}
			});
			//自定义追加form数据
			//勿在提交时处理，防止多次提交多次多次添加
			formView.appendFormData("cust", "auto");
			// formView.setEnctypeMfd();
			var submit = new Ele.Button({
				text:"提交",
				icon:Ele._pathPrefix+"ele/assets/64/icon_submit.png",
				onclick:function(){
					if(!formView.validate()){
						return ;
					}
					
					console.log("form data:"+formView.formData());
					// formView.submit();
					// formView.submitFormAjax(function(res){
					// 	console.log(res);
					// });
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