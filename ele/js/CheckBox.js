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
	var ICheckBox = Ele.ICheckBox = function(){
		this.eleType = "img";
		this.ele;
		this.view;
		
		this._checked = false;
		this._handler = null;
		
		ICheckBox.prototype.click = function(){
			if(this._checked){
				this.ele.src = Ele._pathPrefix+"ele/icons/cb_none.png";
				this._checked = false;
			}else{
				this.ele.src = Ele._pathPrefix+"ele/icons/cb_block.png";
				this._checked = true;
			}
			if(this._handler != null){
				this._handler();
			}
		};
		ICheckBox.prototype.isChecked = function(){
			return this._checked;
		};
		ICheckBox.prototype.checked = function(){
			this.ele.src = Ele._pathPrefix+"ele/icons/cb_block.png";
			this._checked = true;
		};
		ICheckBox.prototype.unChecked = function(){
			this.ele.src = Ele._pathPrefix+"ele/icons/cb_none.png";
			this._checked = false;
		};
		ICheckBox.prototype.addClickEvent = function(handler){
			this._handler = handler;
		};
		
		ICheckBox.prototype._init = function(){
			this._checked = false;
			this.view = new Ele.Img(Ele._pathPrefix+"ele/icons/cb_none.png","ele_check_img");
			this.ele = this.view.ele;
			var context = this;
			this.ele.onclick = function(){
				context.click();
			};
		};
		this._init();
	};
})();
