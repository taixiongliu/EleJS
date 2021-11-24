(function(){
	var FormView = Ele.Views.FormView = function() {
		this.eleType = "layout";
		this.ele;
		this.view;
		
		FormView.prototype._init = function(){
			this.view = new Ele.Layout("ele_form_view");
			this.ele = this.view.ele;
			
			var textBoxItem = new Ele.Views.TextBoxItem({
				text:"名称",
				hint:"请输入",
			});
			textBoxItem.validateLimit(4,10);
			var btn = new Ele.Button({text:"验证", onclick:function(){
				textBoxItem.validateValue();
			}});
			this.view.add(textBoxItem);
			this.view.add(btn);
		};
		
		this._init();
	};
})();