(function(){
	var FormItemView = Ele.Views.FormItemView = function() {};
	var FormItem = function() {
		this.eleType = "layout";
		this.ele;
		this.view;
		this.label;
		this.width=614;
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
		FormItem.prototype.setHeight = function(height){
			if(typeof(height) == "number" && height > 34){
				this.view.setSize("auto", height+"px");
				this.label.ele.style.height = height+"px";
				this.label.ele.style.lineHeight = height+"px";
				this.tip.ele.style.paddingTop = ((height - 34)/2)+"px";
			}
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
			
			this.view.add(this.label,{width:"140px", align:"right"});
			this.view.add(view,{width:"220px", padding:"0 0 0 20px"});
			this.view.add(this.tip,{width:"224px", padding:"0 0 0 10px"});
			
			this.setHeight(height);
		};
	};
	
	/**
	 * @param {Object} args
	 * 隐藏组件
	 */
	var HiddenItem = Ele.Views.HiddenItem = function(args) {
		this.eleType = "layout";
		this.ele;
		this.view;
		this.name;
		this.hditem;
		
		HiddenItem.prototype.formString = function(){
			if(typeof(this.name) != "string" || this.name.trim() == ""){
				return null;
			}
			return this.name+"="+this.getValue();
		};
		
		HiddenItem.prototype.setValue = function(value){
			this.hditem.setValue(value);
		};
		
		HiddenItem.prototype.reset = function(){
			this.setValue("");
		};
		
		HiddenItem.prototype.getValue = function(){
			return this.hditem.getValue();
		};
		
		HiddenItem.prototype._init = function(){
			this.view = new Ele.HLayout("ele_form_hidden_view");
			this.ele = this.view.ele;
			
			//初始化布局组件
			this.hditem = new Ele.TextBox();
			this.hditem.ele.type = "hidden";
			
			var context = this;
			if(typeof(args) != "undefined"){
				if(typeof(args.name) == "string"){
					this.name = args.name;
					this.hditem.ele.name = this.name;
				}
				if(typeof(args.value) != "undefined"){
					this.hditem.setValue(args.value);
				}
			}
			this.view.add(this.hditem);
		};
		
		this._init();
	};
	
	/**
	 * @param {Object} args
	 * 时间选择组件
	 */
	var DateBoxItem = Ele.Views.DateBoxItem = function(args) {
		FormItem.call(this);
		
		this.item;
		this.name;
		this.dateBox;
		
		DateBoxItem.prototype.setWindowOffset = function(size){
			this.dateBox.setWindowOffset(size);
		};
		
		DateBoxItem.prototype.validate = function(){
			var res = this._validate.validate(this.getValue()+"");
			if(res){
				this.clearMessage();
				this.dateBox.clearErrorStyle();
			}else{
				this.showMessage(this._validate.error);
				this.dateBox.showErrorStyle();
			}
			return res;
		};
		
		DateBoxItem.prototype.formString = function(){
			if(this._validate.isEmpty(this.name)){
				return null;
			}
			return this.name+"="+this.getValue();
		};
		DateBoxItem.prototype.setPattern = function(pattern){
			return this.dateBox.setPattern(pattern);
		};
		
		DateBoxItem.prototype.setValue = function(value){
			this.dateBox.setValue(value);
		};
		
		DateBoxItem.prototype.reset = function(){
			this.clearMessage();
			this.dateBox.reset();
		};
		DateBoxItem.prototype.readOnly = function(readOnly){
			this.dateBox.setDisable(readOnly);
		};
		
		DateBoxItem.prototype.getValue = function(){
			return this.dateBox.getValue();
		};
		DateBoxItem.prototype._updateValue = function(index){
			this.hditem.setValue(this.dateBox.getValue());
		};
		
		DateBoxItem.prototype._init = function(){
			//初始化布局组件
			var context = this;
			this.item = new Ele.Layout();
			
			var text = "";
			var opts = {
				selectChange:function(index){
					context._updateValue(index);
				}
			};
			
			var value = "";
			if(typeof(args) != "undefined"){
				if(typeof(args.name) == "string"){
					this.name = args.name;
				}
				if(typeof(args.text) == "string"){
					text = args.text;
				}
				if(typeof(args.windowType) == "boolean"){
					opts.windowType = args.windowType;
				}
				if(typeof(args.readOnly) == "boolean"){
					opts.disable = args.readOnly;
				}
				if(typeof(args.value) != "undefined"){
					value = args.value;
				}
			}
			this.dateBox = new Ele.DateBox(opts);
			if(value != ""){
				this.setValue(value);
			}
			if(typeof(this.name) == "string"){
				this.dateBox.edit.ele.name = this.name;
			}
			this.item.add(this.dateBox);
			this.initView(text, this.item);
		};
		
		this._init();
	};
	
	/**
	 * @param {Object} args
	 * 复选框组件
	 */
	var CheckBoxItem = Ele.Views.CheckBoxItem = function(args) {
		FormItem.call(this);
		
		this.item;
		this.name;
		this.hditem;
		this.checkGroup;
		this.lines;
		this.width = 202;
		
		CheckBoxItem.prototype.validate = function(){
			var res = this._validate.validate(this.getValueString());
			if(res){
				this.clearMessage();
			}else{
				this.showMessage(this._validate.error);
			}
			return res;
		};
		
		CheckBoxItem.prototype.formString = function(){
			if(typeof(this.name) != "string" || this.name.trim() == ""){
				return null;
			}
			return this.name+"="+this.getValueString();
		};
		
		CheckBoxItem.prototype.setValue = function(value){
			this.checkGroup.selectByValue(value);
			this.hditem.setValue(value);
		};
		
		CheckBoxItem.prototype.reset = function(){
			this.checkGroup.clearSelected();
			this.hditem.setValue("");
		};
		
		CheckBoxItem.prototype.getValueString = function(){
			var arr = this.checkGroup.getSelectedValue();
			var value = "";
			for(var i in arr){
				value += arr[i];
				if(i < arr.length - 1){
					value += ","
				}
			}
			return value;
		};
		
		CheckBoxItem.prototype.getValues = function(){
			return this.checkGroup.getSelectedValue();
		};
		
		CheckBoxItem.prototype.readOnly = function(readOnly){
			this.checkGroup.disable(readOnly);
		};
		
		CheckBoxItem.prototype._updateValue = function(index){
			this.hditem.setValue(this.getValueString());
		};
		
		CheckBoxItem.prototype._updateView = function(viewSize){
			//自定义lines优先
			if(this.lines > 0){
				return ;
			}
			var tlen = 0;
			var inLine = false;
			for(var i in viewSize){
				var line = parseInt(viewSize[i].height / 24);
				if(line > 1){
					this.lines += line;
					tlen = 0;
					inLine = false;
					continue;
				}
				if(!inLine){
					this.lines ++;
					inLine = true;
				}
				tlen += viewSize[i].width;
				if(tlen < this.width){
					continue;
				}
				if(tlen == this.width){
					tlen = 0;
					inLine = false;
					continue;
				}
				tlen = viewSize[i].width;
				this.lines ++;
			}
			if(this.lines < 1){
				this.lines = 1;
			}
			var height = (this.lines * 24) + 10;
			this.setHeight(height);
		};
		
		CheckBoxItem.prototype._init = function(){
			
			//初始化布局组件
			this.item = new Ele.Layout("ele_form_checkbox");
			this.hditem = new Ele.TextBox();
			this.hditem.ele.type = "hidden";
			
			var context = this;
			this.lines = 0;
			var lines = 1;
			var text = "";
			var disable = false;
			
			if(typeof(args) != "undefined"){
				if(typeof(args.name) == "string"){
					this.name = args.name;
					this.hditem.ele.name = this.name;
				}
				if(typeof(args.lines) == "number"){
					lines = parseInt(args.lines);
					this.lines = lines;
				}
				if(typeof(args.text) == "string"){
					text = args.text;
				}
				if(typeof(args.readOnly) == "boolean" && args.readOnly){
					disable = true;
				}
				var opts = {
					onload:function(viewSize){
						context._updateView(viewSize);
					},
					selectChange:function(index){
						context._updateValue(index);
					},
					disable:disable,
					items:args.items
				};
				this.checkGroup = new Ele.CheckGroup(opts);
			}
			
			this.item.add(this.hditem);
			this.item.add(this.checkGroup);
			
			var height = (lines * 24) + 10;
			this.initView(text, this.item, height);
		};
		
		this._init();
	};
	
	/**
	 * @param {Object} args
	 * 选择框组件
	 */
	var SelectBoxItem = Ele.Views.SelectBoxItem = function(args) {
		FormItem.call(this);
		
		this.item;
		this.name;
		this.hditem;
		this.selectBox;
		
		SelectBoxItem.prototype.setWindowOffset = function(size){
			this.selectBox.setWindowOffset(size);
		};
		SelectBoxItem.prototype.setOnDataLoad = function(event){
			this.selectBox.setOnDataLoad(event);
		};
		SelectBoxItem.prototype.setOnSelectChange = function(event){
			this.selectBox.setOnSelectChange(event);
		};
		SelectBoxItem.prototype.setOnFilterSearch = function(event){
			this.selectBox.setOnFilterSearch(event);
		};
		
		SelectBoxItem.prototype.setFilterData = function (data){
			this.selectBox.setFilterData(data);
		};
		
		SelectBoxItem.prototype.validate = function(){
			var res = this._validate.validate(this.getValue()+"");
			if(res){
				this.clearMessage();
				this.selectBox.clearErrorStyle();
			}else{
				this.showMessage(this._validate.error);
				this.selectBox.showErrorStyle();
			}
			return res;
		};
		
		SelectBoxItem.prototype.itemCount = function(){
			return this.selectBox.count;
		};
		SelectBoxItem.prototype.addOptionValue = function(text, value){
			this.selectBox.addOptionValue(text, value);
		};
		SelectBoxItem.prototype.addOption = function(option){
			this.selectBox.addOption(option);
		};
		
		SelectBoxItem.prototype.formString = function(){
			if(this._validate.isEmpty(this.name)){
				return null;
			}
			return this.name+"="+this.getValue();
		};
		
		SelectBoxItem.prototype.loadDataSourcesUrl = function(url, funError){
			this.selectBox.loadDataSourcesUrl(url, funError);
		};
		SelectBoxItem.prototype.loadFilterDataSourcesUrl = function(url, keyValue,funError){
			this.selectBox.loadFilterDataSourcesUrl(url, keyValue, funError);
		};
		
		SelectBoxItem.prototype.setValue = function(value){
			this.selectBox.setValue(value);
		};
		
		SelectBoxItem.prototype.reset = function(){
			this.clearMessage();
			this.selectBox.reset();
			this.hditem.setValue("");
		};
		SelectBoxItem.prototype.readOnly = function(readOnly){
			this.selectBox.setDisable(readOnly);
		};
		
		SelectBoxItem.prototype.getValue = function(){
			return this.selectBox.getValue();
		};
		SelectBoxItem.prototype._updateValue = function(index){
			if(index == -1){
				this.hditem.setValue("");
				return ;
			}
			this.hditem.setValue(this.selectBox.getValue());
		};
		
		SelectBoxItem.prototype._init = function(){
			//初始化布局组件
			var context = this;
			this.item = new Ele.Layout();
			
			var text = "";
			var opts = {
				selectChange:function(index){
					context._updateValue(index);
				}
			};
			
			this.hditem = new Ele.TextBox();
			this.hditem.ele.type = "hidden";
			var value = "";
			if(typeof(args) != "undefined"){
				if(typeof(args.name) == "string"){
					this.name = args.name;
					this.hditem.ele.name = args.name;
				}
				if(typeof(args.text) == "string"){
					text = args.text;
				}
				if(typeof(args.windowType) == "boolean"){
					opts.windowType = args.windowType;
				}
				if(typeof(args.readOnly) == "boolean"){
					opts.disable = args.readOnly;
				}
				if(typeof(args.value) != "undefined"){
					value = args.value;
				}
				if(typeof(args.items) != "undefined"){
					opts.items = args.items;
				}
				if(typeof(args.filterSearch) == "function"){
					opts.filterSearch = args.filterSearch;
				}
			}
			this.selectBox = new Ele.SelectBox(opts);
			if(value != ""){
				this.setValue(value);
			}
			this.item.add(this.hditem);
			this.item.add(this.selectBox);
			this.initView(text, this.item);
		};
		
		this._init();
	};
	
	/**
	 * @param {Object} args
	 * 文件选择组件
	 */
	var FileItem = Ele.Views.FileItem = function(args) {
		FormItem.call(this);
		
		this.item;
		this.name;
		this.hditem;
		this.valueView;
		this.fileView;
		this.deleteView;
		this.value;
		this._readOnly;
		
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
		FileItem.prototype.readOnly = function(readOnly){
			if(typeof(readOnly) == "boolean"){
				this._readOnly = readOnly;
			}
		};
		
		FileItem.prototype.setValueUrl = function(url){
			if(typeof(url) != "string"){
				return ;
			}
			var suffix = "";
			if(url.indexOf(".") != -1){
				var arr = url.split(".");
				suffix = arr[arr.length - 1].toLowerCase();
			}
			this.value = url;
			this.valueView.setHtml(url);
			this.deleteView.ele.style.display = "block";
			//图片类型文件处理
			if(suffix == "png" || suffix == "jpg" || suffix == "jpeg" || suffix == "gif"){
				var img = new Ele.Img(url, "ele_form_file_icon");
				this.fileView.clear();
				this.fileView.add(img);
				return ;
			}
			
			//非图片类型文件处理
			var txt = new Ele.Layout("ele_form_file_text");
			txt.setHtml(suffix);
			txt.setAlign("center");
			this.fileView.clear();
			this.fileView.add(txt);
		};
		
		FileItem.prototype.reset = function(){
			this.clearMessage();
			this.deleteView.ele.style.display = "none";
			this.valueView.setHtml("请选择文件...");
			this.value = "";
			this.fileView.clear();
			var icon = new Ele.Img(Ele._pathPrefix+"ele/assets/64/icon_file_add.png", "ele_form_file_icon");
			this.fileView.add(icon);
			this.hditem.setValue("");
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
			if(this._readOnly){
				return;
			}
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
			if(this._readOnly){
				return;
			}
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
				if(typeof(args.readOnly) == "boolean"){
					this._readOnly = args.readOnly;
				}
			}
			this.item.add(this.hditem);
			this.valueView = new Ele.Layout("ele_form_file_value");
			this.valueView.setHtml("请选择文件...");
			this.value = "";
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
		
		RadioBoxItem.prototype.readOnly = function(readOnly){
			this.radioBox.disable(readOnly);
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
			var disable = false;
			if(typeof(args) != "undefined"){
				if(typeof(args.name) == "string"){
					this.name = args.name;
					this.hditem.ele.name = this.name;
				}
				if(typeof(args.text) == "string"){
					text = args.text;
				}
				if(typeof(args.readOnly) == "boolean" && args.readOnly){
					disable = true;
				}
				var opts = {
					selectChange:function(index){
						context._updateValue(index);
					},
					disable:disable,
					items:args.items
				};
				this.radioBox = new Ele.RadioBox(opts);
				this._updateValue(0);
			}
			this.item.add(this.hditem);
			this.item.add(this.radioBox);
			
			text = text+":";
			this.label = new Ele.Label(text, "ele_form_item_text");
			
			this.view.add(this.label,{width:"140px", align:"right"});
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
		TextAreaItem.prototype.readOnly = function(readOnly){
			this.item.readOnly(readOnly);
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
				if(typeof(args.readOnly) == "boolean"){
					this.item.readOnly(args.readOnly);
				}
				if(typeof(args.value) != "undefined"){
					this.item.setValue(args.value);
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
		
		TextBoxItem.prototype.setPassword = function(value){
			if(typeof(value) == "boolean" && value){
				this.item.ele.type = "password";
			}else{
				this.item.ele.type = "text";
			}
		};
		
		TextBoxItem.prototype.reset = function(){
			this.clearMessage();
			this.setValue("");
		};
		
		TextBoxItem.prototype.getValue = function(){
			return this.item.getValue();
		};
		TextBoxItem.prototype.readOnly = function(readOnly){
			this.item.readOnly(readOnly);
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
				if(typeof(args.password) == "boolean" && args.password){
					this.item.ele.type = "password";
				}
				if(typeof(args.hint) == "string"){
					this.item.setHint(args.hint);
				}
				if(typeof(args.readOnly) == "boolean"){
					this.item.readOnly(args.readOnly);
				}
				if(typeof(args.value) != "undefined"){
					this.item.setValue(args.value);
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
	
	var SelectBoxSuper = function (){};
	SelectBoxSuper.prototype = FormItem.prototype;
	SelectBoxSuper.constructor = SelectBoxItem;
	var selectBoxSuper = new SelectBoxSuper();
	selectBoxSuper.constructor = SelectBoxItem;
	SelectBoxItem.prototype = selectBoxSuper;
	
	var CheckBoxSuper = function (){};
	CheckBoxSuper.prototype = FormItem.prototype;
	CheckBoxSuper.constructor = CheckBoxItem;
	var checkBoxSuper = new CheckBoxSuper();
	checkBoxSuper.constructor = CheckBoxItem;
	CheckBoxItem.prototype = checkBoxSuper;
	
	var DateBoxSuper = function (){};
	DateBoxSuper.prototype = FormItem.prototype;
	DateBoxSuper.constructor = DateBoxItem;
	var dateBoxSuper = new DateBoxSuper();
	dateBoxSuper.constructor = DateBoxItem;
	DateBoxItem.prototype = dateBoxSuper;
	
	var HiddenSuper = function (){};
	HiddenSuper.prototype = FormItemView.prototype;
	HiddenSuper.constructor = HiddenItem;
	var hiddenSuper = new HiddenSuper();
	hiddenSuper.constructor = HiddenItem;
	HiddenItem.prototype = hiddenSuper;
	
})();