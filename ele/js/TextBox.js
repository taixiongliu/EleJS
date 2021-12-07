(function(){
	var TextBox = Ele.TextBox = function(args){
		this.eleType = "input";
		this.ele;
		
		TextBox.prototype.setHint = function(hint){
			this.ele.placeholder = hint;
		};
		
		TextBox.prototype.setValue = function(value){
			this.ele.value = value;
		};
		
		TextBox.prototype.getValue = function(){
			return this.ele.value;
		};
		TextBox.prototype.readOnly = function(readOnly){
			if(typeof(readOnly) == "boolean" && readOnly){
				this.ele.readOnly = true;
				this.ele.className = "ele_edittext_style_disable";
			}else{
				this.ele.readOnly = false;
				this.ele.className = "ele_edittext_style";
			}
		};
		
		TextBox.prototype.showErrorStyle = function(){
			this.ele.className = "ele_edittext_style_error";
		};
		TextBox.prototype.clearErrorStyle = function(){
			if(this.ele.readOnly){
				this.ele.className = "ele_edittext_style_disable";
				return ;
			}
			this.ele.className = "ele_edittext_style";
		};
		
		TextBox.prototype._init = function(){
			this.ele = document.createElement("input");
			this.ele.type = "text";
			this.ele.className = "ele_edittext_style";
			if(typeof(args) == "object"){
				if(typeof(args.style) != "undefined"){
					this.ele.className = args.style;
				}
				if(typeof(args.hint) != "undefined"){
					this.ele.placeholder = args.hint;
				}
				if(typeof(args.readOnly) == "boolean" && args.readOnly){
					this.ele.readOnly = args.readOnly;
					this.ele.className = "ele_edittext_style_disable";
				}
			}
		};
		this._init();
	};
})();
