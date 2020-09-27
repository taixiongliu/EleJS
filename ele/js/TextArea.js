(function(){
	var TextArea = Ele.TextArea = function(){
		this.eleType = "input";
		this.ele;
		
		TextArea.prototype._init = function(){
			this.ele = document.createElement("textarea");
			this.ele.className = "ele_textarea_style";
		};
		this._init();
	};
})();
