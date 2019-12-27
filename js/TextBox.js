(function(){
	var TextBox = Ele.TextBox = function(args){
		this.eleType = "input";
		this.ele;
		
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
				if(typeof(args.readOnly) != "undefined"){
					this.ele.readOnly = args.readOnly;
				}
			}
		};
		this._init();
	};
})();
