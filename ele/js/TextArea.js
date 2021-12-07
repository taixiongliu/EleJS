(function(){
	var TextArea = Ele.TextArea = function(args){
		this.eleType = "textarea";
		this.ele;
		
		TextArea.prototype.setHint = function(hint){
			this.ele.placeholder = hint;
		};
		TextArea.prototype.setValue = function(value){
			this.ele.value = value;
		};
		
		TextArea.prototype.getValue = function(){
			return this.ele.value;
		};
		TextArea.prototype.readOnly = function(readOnly){
			if(typeof(readOnly) == "boolean" && readOnly){
				this.ele.readOnly = true;
				this.ele.className = "ele_textarea_style_disable";
			}else{
				this.ele.readOnly = false;
				this.ele.className = "ele_textarea_style";
			}
		};
		
		TextArea.prototype.showErrorStyle = function(){
			this.ele.className = "ele_textarea_style_error";
		};
		TextArea.prototype.clearErrorStyle = function(){
			if(this.ele.readOnly){
				this.ele.className = "ele_textarea_style_disable";
				return ;
			}
			this.ele.className = "ele_textarea_style";
		};
		
		TextArea.prototype._init = function(){
			this.ele = document.createElement("textarea");
			this.ele.className = "ele_textarea_style";
			if(typeof(args) == "object"){
				if(typeof(args.style) == "string"){
					this.ele.className = args.style;
				}
				if(typeof(args.hint) == "string"){
					this.ele.placeholder = args.hint;
				}
				if(typeof(args.readOnly) == "boolean" && args.readOnly){
					this.ele.readOnly = args.readOnly;
					this.ele.className = "ele_textarea_style_disable";
				}
			}
		};
		this._init();
	};
})();
