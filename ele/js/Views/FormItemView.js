(function(){
	var FormItemView = Ele.Views.FormItemView = function() {
		this.eleType = "layout";
		this.ele;
		this.view;
		this.label;
		this.width;
		this.tip;
		this.tipText;
		this._validate;
		
		FormItemView.prototype.showMessage = function(msg){
			this.tipText.setText(msg);
			this.tip.ele.style.display = "block";
		};
		
		FormItemView.prototype.clearMessage = function(){
			this.tipText.setText("");
			this.tip.ele.style.display = "none";
		};
		FormItemView.prototype.validateNotEmpty = function(){
			this._validate.addNotEmpty();
		};
		FormItemView.prototype.validateLimit = function(start, end){
			this._validate.addLimit(start, end);
		};
		FormItemView.prototype.validateReg = function(reg, errorMsg){
			this._validate.addReg(reg, errorMsg);
		};
		FormItemView.prototype.validateStartWithLetter = function(){
			this._validate.addStartWithLetter();
		};
		FormItemView.prototype.validateNoChinese = function(){
			this._validate.addNoChinese();
		};
		FormItemView.prototype.validateAllChinese = function(){
			this._validate.addAllChinese();
		};
		FormItemView.prototype.validateInjectionKey = function(){
			this._validate.addInjectionKey();
		};
		
		FormItemView.prototype.initView = function(lableText, view, height){
			this.view = new Ele.HLayout("ele_form_item_view");
			this.ele = this.view.ele;
			this._validate = new Ele.Utils.Validate();
			
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
			if(typeof(height) == "number" && height > 34){
				this.view.setSize("auto", height+"px");
				this.label.ele.style.height = height+"px";
				this.label.ele.style.lineHeight = height+"px";
				this.tip.ele.style.paddingTop = ((height - 34)/2)+"px";
			}
		};
	};
	
	var RadioBoxItem = Ele.Views.RadioBoxItem = function(args) {
		FormItemView.call(this);
		
		this.item;
		this.name;
		this.hditem;
		this.radioBox;
		
		RadioBoxItem.prototype.validate = function(){
			return true;
		};
		
		RadioBoxItem.prototype.formString = function(){
			if(this._validate.isEmpty(this.name)){
				return null;
			}
			return this.name+"="+this.getValue();
		};
		
		RadioBoxItem.prototype.setValue = function(value){
			this.radioBox.selectByValue(value);
			this.hditem.setValue(value);
		};
		
		RadioBoxItem.prototype.reset = function(){
			this.radioBox.select(0);
			this.hditem.setValue(this.getValue());
		};
		
		RadioBoxItem.prototype.getValue = function(){
			return this.radioBox.getSelectedValue();
		};
		
		RadioBoxItem.prototype._updateValue = function(index){
			this.hditem.setValue(this.radioBox.getIndexValue(index));
		};
		
		RadioBoxItem.prototype._init = function(){
			//初始化布局组件
			this.item = new Ele.Layout("ele_form_radio");
			this.hditem = new Ele.TextBox();
			this.hditem.ele.type = "hidden";
			
			var context = this;
			var text = "";
			if(typeof(args) != "undefined"){
				if(typeof(args.name) == "string"){
					this.name = args.name;
					this.hditem.ele.name = this.name;
				}
				if(typeof(args.text) == "string"){
					text = args.text;
				}
				var opts = {
					selectChange:function(index){
						context._updateValue(index);
					},
					items:args.items
				};
				this.radioBox = new Ele.RadioBox(opts);
				this._updateValue(0);
			}
			this.item.add(this.hditem);
			this.item.add(this.radioBox);
			
			this.initView(text, this.item);
		};
		
		this._init();
	};
	
	var TextAreaItem = Ele.Views.TextAreaItem = function(args) {
		FormItemView.call(this);
		
		this.item;
		this.name;
		
		TextAreaItem.prototype.validate = function(){
			var res = this._validate.validate(this.item.getValue());
			if(res){
				this.clearMessage();
				this.item.clearErrorStyle();
			}else{
				this.showMessage(this._validate.error);
				this.item.showErrorStyle();
			}
			return res;
		};
		
		TextAreaItem.prototype.formString = function(){
			if(this._validate.isEmpty(this.name)){
				return null;
			}
			return this.name+"="+this.getValue();
		};
		
		TextAreaItem.prototype.setValue = function(value){
			this.item.setValue(value);
		};
		
		TextAreaItem.prototype.reset = function(){
			this.setValue("");
		};
		
		TextAreaItem.prototype.getValue = function(){
			return this.item.getValue();
		};
		
		TextAreaItem.prototype._init = function(){
			//初始化布局组件
			this.item = new Ele.TextArea();
			var text = "";
			if(typeof(args) != "undefined"){
				if(typeof(args.name) == "string"){
					this.name = args.name;
					this.item.ele.name = args.name;
				}
				if(typeof(args.text) == "string"){
					text = args.text;
				}
				if(typeof(args.hint) == "string"){
					this.item.setHint(args.hint);
				}
			}
			this.initView(text, this.item, 48);
		};
		
		this._init();
	};
	
	/**
	 * @param {Object} args 
	 * text:表单项名称
	 */
	var TextBoxItem = Ele.Views.TextBoxItem = function(args) {
		FormItemView.call(this);
		
		this.item;
		this.name;
		
		TextBoxItem.prototype.validate = function(){
			var res = this._validate.validate(this.item.getValue());
			if(res){
				this.clearMessage();
				this.item.clearErrorStyle();
			}else{
				this.showMessage(this._validate.error);
				this.item.showErrorStyle();
			}
			return res;
		};
		
		TextBoxItem.prototype.formString = function(){
			if(this._validate.isEmpty(this.name)){
				return null;
			}
			return this.name+"="+this.getValue();
		};
		
		TextBoxItem.prototype.setValue = function(value){
			this.item.setValue(value);
		};
		
		TextBoxItem.prototype.reset = function(){
			this.setValue("");
		};
		
		TextBoxItem.prototype.getValue = function(){
			return this.item.getValue();
		};
		
		TextBoxItem.prototype._init = function(){
			//初始化布局组件
			this.item = new Ele.TextBox();
			var text = "";
			if(typeof(args) != "undefined"){
				if(typeof(args.name) == "string"){
					this.name = args.name;
					this.item.ele.name = args.name;
				}
				if(typeof(args.text) == "string"){
					text = args.text;
				}
				if(typeof(args.hint) == "string"){
					this.item.setHint(args.hint);
				}
			}
			this.initView(text, this.item);
		};
		
		this._init();
	};
	
	var TextBoxSuper = function (){};
	TextBoxSuper.prototype = FormItemView.prototype;
	TextBoxSuper.constructor = TextBoxItem;
	var textBoxSuper = new TextBoxSuper();
	textBoxSuper.constructor = TextBoxItem;
	TextBoxItem.prototype = textBoxSuper;
	
	var TextAreaSuper = function (){};
	TextAreaSuper.prototype = FormItemView.prototype;
	TextAreaSuper.constructor = TextAreaItem;
	var textAreaSuper = new TextAreaSuper();
	textAreaSuper.constructor = TextAreaItem;
	TextAreaItem.prototype = textAreaSuper;
	
	var RadioBoxSuper = function (){};
	RadioBoxSuper.prototype = FormItemView.prototype;
	RadioBoxSuper.constructor = RadioBoxItem;
	var radioBoxSuper = new RadioBoxSuper();
	radioBoxSuper.constructor = RadioBoxItem;
	RadioBoxItem.prototype = radioBoxSuper;
	
})();