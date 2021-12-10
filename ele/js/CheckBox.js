(function(){
	var CheckBox = Ele.CheckBox = function(){
		this.eleType = "input";
		this.ele;
		
		CheckBox.prototype._init = function(){
			this.ele = document.createElement("input");
			this.ele.type = "checkbox";
			this.ele.className = "ele_check_style";
		};
		this._init();
	};
	var ICheckBox = Ele.ICheckBox = function(args){
		this.eleType = "img";
		this.ele;
		this.view;
		this.icon;
		this.selectedIcon;
		
		this._checked = false;
		this._clickEvent = null;
		
		ICheckBox.prototype.click = function(){
			if(this._checked){
				this.unChecked();
			}else{
				this.checked();
			}
			if(this._clickEvent != null){
				this._clickEvent();
			}
		};
		ICheckBox.prototype.isChecked = function(){
			return this._checked;
		};
		ICheckBox.prototype.checked = function(){
			this.ele.src = this.selectedIcon;
			this._checked = true;
		};
		ICheckBox.prototype.unChecked = function(){
			this.ele.src = this.icon;
			this._checked = false;
		};
		ICheckBox.prototype.addClickEvent = function(event){
			this._clickEvent = event;
		};
		
		ICheckBox.prototype._init = function(){
			this._checked = false;
			this.icon = Ele._pathPrefix+"ele/assets/48/icon_cb_none.png";
			this.selectedIcon = Ele._pathPrefix+"ele/assets/48/icon_cb_block.png";
			
			var cssName = "ele_check_img";
			if(typeof(args) == "object"){
				if(typeof(args.style) == "string"){
					cssName = args.style;
				}
				if(typeof(args.icon) == "string"){
					this.icon = args.icon;
				}
				if(typeof(args.selectedIcon) == "string"){
					this.selectedIcon = args.selectedIcon;
				}
			}
			
			this.view = new Ele.Img(this.icon, cssName);
			this.ele = this.view.ele;
			var context = this;
			this.ele.onclick = function(){
				context.click();
			};
		};
		this._init();
	};
	
	var CheckGroup = Ele.CheckGroup = function(args){
		this.eleType = "layout";
		this.ele;
		this.view;
		
		this._orientation = "landscape";//竖向布局portrait
		this._clickEvent = null;
		this._updateEvent = null;
		this._radios = [];
		this._disable;
		this._loadViewSize;
		this._loadCount;
		this._loadTotal;
		this._loadEvent = null;
		
		CheckGroup.prototype.clearSelected = function(){
			for(var index = 0; index < this._radios.length; index ++){
				if(this._radios[i].isChecked()){
					this._radios[i].unChecked();
				}
			}
		};
		
		CheckGroup.prototype.allSelected = function(){
			for(var index = 0; index < this._radios.length; index ++){
				if(!this._radios[i].isChecked()){
					this._radios[i].checked();
				}
			}
		};
		
		CheckGroup.prototype.getSelectedValue = function(){
			var selectArr = [];
			for(var index = 0; index < this._radios.length; index ++){
				if(this._radios[index].isChecked()){
					selectArr.push(this._radios[index].getValue());
				}
			}
			return selectArr;
		};
		CheckGroup.prototype.getIndexValue = function(index){
			return this._radios[index].getValue();
		};
		CheckGroup.prototype.getSelectedText = function(){
			var selectArr = [];
			for(var index = 0; index < this._radios.length; index ++){
				if(this._radios[index].isChecked()){
					selectArr.push(this._radios[index].getText());
				}
			}
			return selectArr;
		};
		CheckGroup.prototype.getSelectedIndex = function(){
			var selectArr = [];
			for(var index = 0; index < this._radios.length; index ++){
				if(this._radios[index].isChecked()){
					selectArr.push(index);
				}
			}
			return selectArr;
		};
		CheckGroup.prototype.disable = function(disable){
			if(typeof(disable) != "boolean"){
				return ;
			}
			if(this._disable == disable){
				return ;
			}
			for(var i in this._radios){
				this._radios[i].able(!disable);
			}
			this._disable = disable;
		};
		CheckGroup.prototype.getIndexByValue = function(value){
			if(this._radios.length < 0){
				return -1;
			}
			var index = -1;
			for(var i = 0; i < this._radios.length; i ++){
				if(this._radios[i].getValue() === value){
					index = i;
					break;
				}
			}
			return index;
		};
		CheckGroup.prototype.select = function(index){
			if(index < 0 || index >= this._radios.length){
				return ;
			}
			this._radios[index].checked();
			if(this._updateEvent != null){
				this._updateEvent(index);
			}
		};
		CheckGroup.prototype.unSelect = function(index){
			if(index < 0 || index >= this._radios.length){
				return ;
			}
			this._radios[index].unChecked();
			if(this._updateEvent != null){
				this._updateEvent(index);
			}
		};
		CheckGroup.prototype.selectByValue = function(value){
			var index = this.getIndexByValue(value);
			//没有找到
			if(index == -1){
				return ;
			}
			this.select(index);
		};
		CheckGroup.prototype.unSelectByValue = function(value){
			var index = this.getIndexByValue(value);
			//没有找到
			if(index == -1){
				return ;
			}
			this.unSelect(index);
		};
		
		CheckGroup.prototype.setItemClickEvent = function(event){
			this._clickEvent = event;
		};
		CheckGroup.prototype.setUpdateEvent = function(event){
			this._updateEvent = event;
		};
		CheckGroup.prototype._onAppendDraw = function(width, height){
			this._loadViewSize.push(new Ele.Utils.Size(width+8, height));
			this._loadCount ++;
			if(this._loadCount == this._loadTotal){
				if(this._loadEvent != null){
					this._loadEvent(this._loadViewSize);
				}
			}
			
		};
		CheckGroup.prototype._onItemClick = function(index){
			//成员点击事件
			if(this._clickEvent != null){
				this._clickEvent(index);
			}
			if(!this._disable && this._updateEvent != null){
				this._updateEvent(index);
			}
		};
		
		CheckGroup.prototype._init = function(){
			this._disable = false;
			var items = [];
			if(typeof(args) != "undefined"){
				if(typeof(args.onload) == "function"){
					this._loadEvent = args.onload;
				}
				if(typeof(args.itemClick) == "function"){
					this._clickEvent = args.itemClick;
				}
				if(typeof(args.selectChange) == "function"){
					this._updateEvent = args.selectChange;
				}
				if(typeof(args.orientation) != "undefined" && args.orientation == "portrait"){
					this._orientation = "portrait";
				}
				if(typeof(args.disable) == "boolean" && args.disable){
					this._disable = args.disable;
				}
				if(Ele._isArray(args.items)){
					items = args.items;
				}
			}
			if(this._orientation == "landscape"){
				this.view = new Ele.HLayout("ele_nocrspace");
			}else{
				this.view = new Ele.VLayout("ele_nocrspace");
			}
			this.ele = this.view.ele;
			this._loadViewSize = [];
			this._loadCount = 0;
			this._loadTotal = items.length;
			var context = this;
			if(items.length > 0){
				for(var i = 0; i < items.length; i ++){
					if(typeof(items[i].icon) == "undefined"){
						items[i].icon = Ele._pathPrefix+"ele/assets/16/icon_check_unselect.png";
					}
					if(typeof(items[i].selectedIcon) == "undefined"){
						items[i].selectedIcon = Ele._pathPrefix+"ele/assets/16/icon_check_select.png";
					}
					var iradio = new Ele.IRadio(items[i]);
					iradio.setCancel(true);
					if(this._disable){
						iradio.able(false);
					}
					iradio.eleId = i;
					iradio.addClickEvent(function(){
						context._onItemClick(this.eleId);
					});
					iradio.onDraw(function(){
						context._onAppendDraw(this.ele.offsetWidth,this.ele.offsetHeight);
					});
					this._radios.push(iradio);
					this.view.add(iradio, {padding:"0 0 0 8px"});
				}
			}
		};
		this._init();
	};
	
})();
