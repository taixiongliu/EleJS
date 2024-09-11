(function(){
	var Radio = Ele.Radio = function(){
		this.eleType = "input";
		this.ele;
		
		Radio.prototype._init = function(){
			this.ele = document.createElement("input");
			this.ele.type = "radio";
		};
		this._init();
	};
	var IRadio = Ele.IRadio = function(args){
		this.eleType = "layout";
		this.ele;
		this.view;
		this.icon;
		this.selectedIcon;
		
		this._able;
		this._cancel;
		this._text;
		this._value;
		this._checked = false;
		this._clickEvent = null;
		this._drawEvent = null;
		this._data = null;
		
		IRadio.prototype.click = function(){
			if(this._able){
				this.update();
			}
			if(this._clickEvent != null){
				this._clickEvent();
			}
		};
		IRadio.prototype.update = function(){
			if(this._checked){
				if(this._cancel){
					this.unChecked();
				}
				return ;
			}
			this.checked();
		};
		IRadio.prototype.onDraw = function(event){
			if(typeof(event) == "function"){
				this._drawEvent = event;
			}
		};
		IRadio.prototype.isChecked = function(){
			return this._checked;
		};
		IRadio.prototype.getValue = function(){
			return this._value;
		};
		IRadio.prototype.able = function(able){
			if(typeof(able) == "boolean"){
				this._able = able;
			}
		};
		IRadio.prototype.getText = function(){
			return this._text;
		};
		IRadio.prototype.checked = function(){
			this.ele.style.backgroundImage = "url("+this.selectedIcon+")";
			this._checked = true;
		};
		IRadio.prototype.setCancel = function(cancel){
			if(typeof(cancel) == "boolean"){
				this._cancel = cancel;
			}
		};
		IRadio.prototype.unChecked = function(){
			this.ele.style.backgroundImage = "url("+this.icon+")";
			this._checked = false;
		};
		IRadio.prototype.addClickEvent = function(event){
			this._clickEvent = event;
		};
		
		IRadio.prototype._init = function(){
			var text = "";
			var value = "";
			this.icon = Ele._pathPrefix+"ele/"+Ele._skin+"/assets/64/icon_radio_unselect.png";
			this.selectedIcon = Ele._pathPrefix+"ele/"+Ele._skin+"/assets/64/icon_radio_select.png";
			var cssName = "ele_radio";
			this._able = true;
			this._cancel = false;
			if(typeof(args) != "undefined"){
				if(typeof(args.style) == "string"){
					cssName = args.style;
				}
				if(typeof(args.cancel) == "boolean"){
					this._cancel = args.cancel;
				}
				if(typeof(args.icon) == "string"){
					this.icon = args.icon;
				}
				if(typeof(args.selectedIcon) == "string"){
					this.selectedIcon = args.selectedIcon;
				}
				if(typeof(args.text) == "string"){
					text = args.text;
				}
				if(typeof(args.value) != "undefined"){
					value = args.value;
				}
				if(typeof(args.clickEvent) == "function"){
					this._clickEvent = args.clickEvent;
				}
			}
			this._checked = false;
			this._text = text;
			this._value = value;
			this.view = new Ele.Layout(cssName);
			this.ele = this.view.ele;
			this.ele.style.backgroundImage = "url("+this.icon+")";
			this.view.setHtml(text);
			
			var context = this;
			this.ele.onclick = function(){
				context.click();
			};
			setTimeout(function() {
				if(context._drawEvent != null){
					context._drawEvent();
				}
			}, 0);
		};
		this._init();
	};
	var RadioBox = Ele.RadioBox = function(args){
		this.eleType = "layout";
		this.ele;
		this.view;
		
		this._orientation = "landscape";//竖向布局portrait
		this._clickEvent = null;
		this._updateEvent = null;
		this._radios = [];
		this._selectIndex;
		this._disable;
		
		RadioBox.prototype.getSelectedValue = function(){
			return this._radios[this._selectIndex].getValue();
		};
		RadioBox.prototype.getIndexValue = function(index){
			return this._radios[index].getValue();
		};
		RadioBox.prototype.getSelectedText = function(){
			return this._radios[this._selectIndex].getText();
		};
		RadioBox.prototype.getSelectedIndex = function(){
			return this._selectIndex;
		};
		RadioBox.prototype.disable = function(disable){
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
		RadioBox.prototype.getIndexByValue = function(value){
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
		RadioBox.prototype.select = function(index){
			//无需更新
			if(index == this._selectIndex){
				return ;
			}
			//当前选择设置为unselect
			this._radios[this._selectIndex].unChecked();
			//选择当前
			this._radios[index].checked();
			//更新选项
			this._selectIndex = index;
			if(this._updateEvent != null){
				this._updateEvent(index);
			}
		};
		RadioBox.prototype.selectByValue = function(value){
			var index = this.getIndexByValue(value);
			//没有找到
			if(index == -1){
				return ;
			}
			this.select(index);
		};
		
		RadioBox.prototype.onItemClick = function(index){
			//成员点击事件
			if(this._clickEvent != null){
				this._clickEvent(index);
			}
			if(!this._disable){
				this.select(index);
			}
		};
		RadioBox.prototype.setItemClickEvent = function(event){
			this._clickEvent = event;
		};
		RadioBox.prototype.setUpdateEvent = function(event){
			this._updateEvent = event;
		};
		
		RadioBox.prototype._init = function(){
			this._disable = false;
			var items = [];
			if(typeof(args) != "undefined"){
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
			var context = this;
			if(items.length > 0){
				for(var i = 0; i < items.length; i ++){
					var iradio = new IRadio(items[i]);
					if(this._disable){
						iradio.able(false);
					}
					iradio.eleId = i;
					iradio.addClickEvent(function(){
						context.onItemClick(this.eleId);
					});
					//默认首个当选
					if(i == 0){
						this._selectIndex = 0;
						iradio.checked();
					}
					this._radios.push(iradio);
					this.view.add(iradio, {padding:"0 0 0 8px"});
					
				}
			}
		};
		this._init();
	};
})();
