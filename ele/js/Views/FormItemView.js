(function(){
	var FormItemView = Ele.Views.FormItemView = function() {};
	var FormItem = function() {
		this.eleType = "layout";
		this.ele;
		this.view;
		this.label;
		this.width=564;
		this.tip;
		this.tipText;
		this._validate;
		
		FormItem.prototype.showMessage = function(msg){
			this.tipText.setText(msg);
			this.tip.ele.style.display = "block";
		};
		
		FormItem.prototype.clearMessage = function(){
			this.tipText.setText("");
			this.tip.ele.style.display = "none";
		};
		FormItem.prototype.validateNotEmpty = function(){
			this._validate.addNotEmpty();
		};
		FormItem.prototype.validateLimit = function(start, end){
			this._validate.addLimit(start, end);
		};
		FormItem.prototype.validateReg = function(reg, errorMsg){
			this._validate.addReg(reg, errorMsg);
		};
		FormItem.prototype.validateStartWithLetter = function(){
			this._validate.addStartWithLetter();
		};
		FormItem.prototype.validateNoChinese = function(){
			this._validate.addNoChinese();
		};
		FormItem.prototype.validateAllChinese = function(){
			this._validate.addAllChinese();
		};
		FormItem.prototype.validateInjectionKey = function(){
			this._validate.addInjectionKey();
		};
		
		FormItem.prototype.initView = function(lableText, view, height){
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
			this.view.add(view,{width:"220px", padding:"0 0 0 20px"});
			this.view.add(this.tip,{width:"224px"});
			if(typeof(height) == "number" && height > 34){
				this.view.setSize("auto", height+"px");
				this.label.ele.style.height = height+"px";
				this.label.ele.style.lineHeight = height+"px";
				this.tip.ele.style.paddingTop = ((height - 34)/2)+"px";
			}
		};
	};
	
	var FileItem = Ele.Views.FileItem = function(args) {
		FormItem.call(this);
		
		this.item;
		this.name;
		this.hditem;
		this.valueView;
		this.fileView;
		this.deleteView;
		this.value;
		
		FileItem.prototype.validate = function(){
			var res = this._validate.validate(this.getValue());
			if(res){
				this.clearMessage();
			}else{
				this.showMessage(this._validate.error);
			}
			return res;
		};
		
		FileItem.prototype.appendToFormData = function(formData){
			if(typeof(formData) != "object"){
				return ;
			}
			if(!(formData instanceof FormData)){
				return ;
			}
			if(this._validate.isEmpty(this.name)){
				return ;
			}
			formData.append(this.name, this.getFormData());
		};
		
		FileItem.prototype.formString = function(){
			if(this._validate.isEmpty(this.name)){
				return null;
			}
			return this.name+"="+this.getValue();
		};
		
		FileItem.prototype.setValue = function(value){
			this.value = value;
		};
		
		FileItem.prototype.reset = function(){
			this.clearMessage();
			this.deleteView.ele.style.display = "none";
			this.valueView.setHtml("请选择文件...");
			this.value = "";
			this.fileView.clear();
			var icon = new Ele.Img(Ele._pathPrefix+"ele/assets/64/icon_file_add.png", "ele_form_file_icon");
			this.fileView.add(icon);
		};
		
		FileItem.prototype.getValue = function(){
			return this.value;
		};
		
		FileItem.prototype.getFormData = function(){
			return this.hditem.ele.files[0];
		};
		FileItem.prototype.accept = function(accept){
			this.hditem.ele.accept = accept;
		};
		FileItem.prototype.acceptImage = function(){
			this.accept("image/*");
		};
		
		FileItem.prototype._setValueData = function(value, prefix, suffix){
			//图片文件类型预览处理
			if(prefix.toLowerCase() == "image"){
				var img = new Ele.Img(value, "ele_form_file_icon");
				this.fileView.clear();
				this.fileView.add(img);
				this.value = value;
				return ;
			}
			//非图片类型文件处理
			var txt = new Ele.Layout("ele_form_file_text");
			txt.setHtml(suffix);
			txt.setAlign("center");
			this.fileView.clear();
			this.fileView.add(txt);
			this.value = value;
		};
		FileItem.prototype._onDelete = function(){
			this.reset();
		};
		FileItem.prototype._onChange = function(){
			this.clearMessage();
			var file = this.hditem.ele.files[0];
			var prefix = "";
			var suffix = "";
			//文件类型处理
			if(file.type != ""){
				var spIndex = file.type.indexOf("/");
				if(spIndex != -1){
					prefix = file.type.substring(0, spIndex);
				}
			}
			//文件后缀处理
			var path = this.hditem.ele.value;
			//选择文件显示
			this.valueView.setHtml(path);
			this.deleteView.ele.style.display = "block";
			if(path.indexOf(".") != -1){
				var arr = path.split(".");
				suffix = arr[arr.length - 1];
			}
			var context = this;
			var reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload=function(e){
				context._setValueData(e.target.result, prefix, suffix);
			}
		};
		FileItem.prototype._onFile = function(){
			this.hditem.ele.click();
		};
		
		FileItem.prototype._init = function(){
			//初始化布局组件
			var context = this;
			
			this.item = new Ele.HLayout("ele_form_file");
			this.hditem = new Ele.TextBox();
			this.hditem.ele.type = "file";
			this.hditem.ele.style.display = "none";
			this.hditem.ele.onchange = function(){
				context._onChange();
			};
			var text = "";
			if(typeof(args) != "undefined"){
				if(typeof(args.name) == "string"){
					this.name = args.name;
					this.hditem.ele.name = this.name;
				}
				if(typeof(args.text) == "string"){
					text = args.text;
				}
			}
			this.item.add(this.hditem);
			this.valueView = new Ele.Layout("ele_form_file_value");
			this.valueView.setHtml("请选择文件...");
			this.fileView = new Ele.Layout("ele_form_file_view");
			var icon = new Ele.Img(Ele._pathPrefix+"ele/assets/64/icon_file_add.png", "ele_form_file_icon");
			this.fileView.add(icon);
			this.fileView.ele.onclick = function(){
				context._onFile();
			};
			this.deleteView = new Ele.Layout("ele_form_file_delete_view");
			var delIcon = new Ele.Img(Ele._pathPrefix+"ele/assets/64/icon_delete.png", "ele_form_file_delete_icon");
			this.deleteView.add(delIcon);
			this.deleteView.ele.onclick = function(){
				context._onDelete();
			};
			this.item.add(this.valueView);
			this.item.add(this.fileView);
			this.item.add(this.deleteView);
			this.initView(text, this.item, 64);
		};
		
		this._init();
	};
	
	/**
	 * @param {Object} args
	 * 单选框组件
	 */
	var RadioBoxItem = Ele.Views.RadioBoxItem = function(args) {
		this.eleType = "layout";
		this.ele;
		this.view;
		this.label;
		this.width=564;
		this.item;
		this.name;
		this.hditem;
		this.radioBox;
		
		RadioBoxItem.prototype.formString = function(){
			if(typeof(this.name) != "string" || this.name.trim() == ""){
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
			this.view = new Ele.HLayout("ele_form_item_view");
			this.ele = this.view.ele;
			
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
			
			text = text+":";
			this.label = new Ele.Label(text, "ele_form_item_text");
			
			this.view.add(this.label,{width:"100px", align:"right"});
			this.view.add(this.item,{width:"452px", padding:"0 0 0 12px"});
		};
		
		this._init();
	};
	
	/**
	 * @param {Object} args
	 * 区域文本组件
	 */
	var TextAreaItem = Ele.Views.TextAreaItem = function(args) {
		FormItem.call(this);
		
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
			this.clearMessage();
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
	 * 文本框组件
	 */
	var TextBoxItem = Ele.Views.TextBoxItem = function(args) {
		FormItem.call(this);
		
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
			this.clearMessage();
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
	
	var ItemSuper = function (){};
	ItemSuper.prototype = FormItemView.prototype;
	ItemSuper.constructor = FormItem;
	var itemSuper = new ItemSuper();
	itemSuper.constructor = FormItem;
	FormItem.prototype = itemSuper;
	
	var TextBoxSuper = function (){};
	TextBoxSuper.prototype = FormItem.prototype;
	TextBoxSuper.constructor = TextBoxItem;
	var textBoxSuper = new TextBoxSuper();
	textBoxSuper.constructor = TextBoxItem;
	TextBoxItem.prototype = textBoxSuper;
	
	var TextAreaSuper = function (){};
	TextAreaSuper.prototype = FormItem.prototype;
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
	
	var FileSuper = function (){};
	FileSuper.prototype = FormItem.prototype;
	FileSuper.constructor = FileItem;
	var fileSuper = new FileSuper();
	fileSuper.constructor = FileItem;
	FileItem.prototype = fileSuper;
	
})();