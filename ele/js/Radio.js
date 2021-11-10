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
		
		this._img;
		this._text;
		this._value;
		this._checked = false;
		this._clickEvent = null;
		this._data = null;
		
		IRadio.prototype.click = function(){
			this.update();
			if(this._clickEvent != null){
				this._clickEvent();
			}
		};
		IRadio.prototype.update = function(){
			if(this._checked){
				return ;
			}
			this.checked();
		};
		IRadio.prototype.isChecked = function(){
			return this._checked;
		};
		IRadio.prototype.getValue = function(){
			return this._value;
		};
		IRadio.prototype.getText = function(){
			return this._text.getText();
		};
		IRadio.prototype.checked = function(){
			this._img.ele.src = Ele._pathPrefix+"ele/assets/16/icon_radio_select.png";
			this._checked = true;
		};
		IRadio.prototype.unChecked = function(){
			this._img.ele.src = Ele._pathPrefix+"ele/assets/16/icon_radio_unselect.png";
			this._checked = false;
		};
		IRadio.prototype.addClickEvent = function(event){
			this._clickEvent = event;
		};
		
		IRadio.prototype._init = function(){
			var text = "";
			var value = "";
			if(typeof(args) != "undefined"){
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
			this._value = value;
			this.view = new Ele.HLayout("ele_radio");
			this.ele = this.view.ele;
			this._img = new Ele.Img(Ele._pathPrefix+"ele/assets/16/icon_radio_unselect.png","ele_radio_icon");
			this._text = new Ele.Label(text,"ele_radio_text");
			this.view.add(this._img);
			this.view.add(this._text,{padding:"0 0 0 4px"});
			
			var context = this;
			this.ele.onclick = function(){
				context.click();
			};
		};
		this._init();
	};
	var RadioBox = Ele.RadioBox = function(args){
		this.eleType = "layout";
		this.ele;
		this.view;
		
		this._checked = false;
		this._orientation = "landscape";//竖向布局portrait
		this._clickEvent = null;
		this._updateEvent = null;
		this._radios = [];
		this._selectIndex;
		
		RadioBox.prototype.getSelectedValue = function(){
			return this._radios[this._selectIndex].getValue();
		};
		RadioBox.prototype.getSelectedText = function(){
			return this._radios[this._selectIndex].getText();
		};
		RadioBox.prototype.getSelectedIndex = function(){
			return this._selectIndex;
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
		};
		
		RadioBox.prototype.onItemClick = function(index){
			console.log("radio click"+index);
			//成员点击事件
			if(this._clickEvent != null){
				this._clickEvent(index);
			}
			this.select(index);
		};
		RadioBox.prototype.setItemClickEvent = function(event){
			this._clickEvent = event;
		};
		RadioBox.prototype.setUpdateEvent = function(event){
			this._updateEvent = event;
		};
		
		RadioBox.prototype._init = function(){
			this._checked = false;
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
				if(Ele._isArray(args.items)){
					items = args.items;
				}
			}
			if(this._orientation == "landscape"){
				this.view = new Ele.HLayout();
			}else{
				this.view = new Ele.VLayout();
			}
			this.ele = this.view.ele;
			var context = this;
			if(items.length > 0){
				for(var i = 0; i < items.length; i ++){
					var iradio = new IRadio(items[i]);
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
