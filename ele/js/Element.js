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
	
	// tag form
	var Form = Ele.Form = function(action){
		this.eleType = "form";
		this.ele;
		
		Form.prototype.add = function(eleView){
			this.ele.appendChild(eleView.ele);
		};
		
		Form.prototype.setAction = function(action){
			if(typeof(action) == "string"){
				this.ele.action = action;
			}
		};
		
		Form.prototype._init = function(){
			this.ele = document.createElement("form");
			this.setAction(action);
		};
		this._init();
	};
	
	// tag img
	var Img = Ele.Img = function(url,cName){
		this.eleType = "img";
		this.ele;
		
		Img.prototype._init = function(){
			this.ele = document.createElement("img");
			this.ele.src = url;
			if(typeof(cName) == "string"){
				this.ele.className = cName;
			}
		};
		this._init();
	};
})();