(function(){
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
