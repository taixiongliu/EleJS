(function(){
	var Element = Ele.Element = function(id){
		this.eleType = "ele";
		this.ele;
		
		Element.prototype._init = function(){
			this.ele = document.getElementById(id);
		};
		Element.prototype.add = function(view){
			this.ele.appendChild(view.ele);
		};
		Element.prototype.remove = function(view){
			this.ele.removeChild(view.ele);
		};
		this._init();
	};
})();