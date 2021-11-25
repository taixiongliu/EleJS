(function(){
	var TextArea = Ele.TextArea = function(){
		this.eleType = "textarea";
		this.ele;
		
		TextArea.prototype.setHint = function(hint){
			return this.ele.placeholder = hint;
		};
		TextArea.prototype.setValue = function(value){
			return this.ele.value = value;
		};
		
		TextArea.prototype.getValue = function(){
			return this.ele.value;
		};
		
		TextArea.prototype.showErrorStyle = function(){
			this.ele.className = "ele_textarea_style_error";
		};
		TextArea.prototype.clearErrorStyle = function(){
			this.ele.className = "ele_textarea_style";
		};
		
		TextArea.prototype._init = function(){
			this.ele = document.createElement("textarea");
			this.ele.className = "ele_textarea_style";
		};
		this._init();
	};
})();
