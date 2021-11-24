(function(){
	var FormItemView = Ele.Views.FormItemView = function() {
		this.eleType = "layout";
		this.ele;
		this.view;
		this.label;
		this.width;
		this.tip;
		this.tipText;
		this.validate;
		
		FormItemView.prototype.showMessage = function(msg){
			this.tipText.setText(msg);
			this.tip.ele.style.display = "block";
		};
		
		FormItemView.prototype.clearMessage = function(){
			this.tipText.setText("");
			this.tip.ele.style.display = "none";
		};
		FormItemView.prototype.validateLimit = function(start, end){
			this.validate.addLimit(start, end);
		};
		
		FormItemView.prototype.initView = function(lableText, view){
			this.view = new Ele.HLayout("ele_form_item_view");
			this.ele = this.view.ele;
			this.validate = new Ele.Utils.Validate();
			
			var text = "Label:";
			if(typeof(lableText) == "string"){
				text = lableText+":";
			}
			this.label = new Ele.Label(text, "ele_form_item_text");
			this.tip = new Ele.HLayout("ele_form_item_tip");
			var errorIcon = new Ele.Img(Ele._pathPrefix+"ele/assets/64/icon_error.png", "ele_form_item_tip_icon");
			this.tipText = new Ele.Label("","ele_form_item_tip_text"); 
			this.tip.add(errorIcon);
			this.tip.add(this.tipText, {padding:"0 0 0 8px"});
			
			this.view.add(this.label,{width:"100px", align:"right"});
			this.view.add(view,{width:"240px", align:"center"});
			this.view.add(this.tip,{width:"224px"});
		};
	};
	
	/**
	 * @param {Object} args 
	 * text:表单项名称
	 */
	var TextBoxItem = Ele.Views.TextBoxItem = function(args) {
		FormItemView.call(this);
		
		this.item;
		
		TextBoxItem.prototype.validateValue = function(){
			var res = this.validate.validate(this.item.getValue());
			if(!res){
				this.showMessage(this.validate.error);
			}
			return res;
		};
		
		TextBoxItem.prototype._init = function(){
			//初始化布局组件
			this.item = new Ele.TextBox();
			var text = "";
			if(typeof(args) != "undefined"){
				if(typeof(args.text) == "string"){
					text = args.text;
				}
				if(typeof(args.hint) == "string"){
					this.item.setHint(args.hint);
				}
			}
			this.initView(text, this.item);
			
			//this.showMessage("用户姓名不能为空");
			//this.item.showErrorStyle();
		};
		
		this._init();
	};
	
	var TextBoxSuper = function (){};
	TextBoxSuper.prototype = FormItemView.prototype;
	TextBoxSuper.constructor = TextBoxItem;
	var textBoxSuper = new TextBoxSuper();
	textBoxSuper.constructor = TextBoxItem;
	TextBoxItem.prototype = textBoxSuper;
})();