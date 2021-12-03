(function(){
	var Position = Ele.Utils.Position = function() {
		this.eleType = "util";
		this.positionType;
		this.left;
		this.top;
		this.right;
		this.bottom;
	
		Position.prototype._init = function() {
			this.positionType = "bottom-left";
			this.left = 0;
			this.top = 0;
			this.right = 0;
			this.bottom = 0;
		};
	
		Position.prototype.inTopLeft = function(ele) {
			if(!Ele._isElement(ele)){
				return ;
			}
			this.positionType = "top-left";
			var otop = ele.offsetTop + ele.offsetParent.offsetTop;
			var oleft = ele.offsetLeft + ele.offsetParent.offsetLeft;
			this.bottom = otop;
			this.left = oleft;
		};
		Position.prototype.inTopRight = function(ele) {
			if(!Ele._isElement(ele)){
				return ;
			}
			this.positionType = "top-right";
			var otop = ele.offsetTop + ele.offsetParent.offsetTop;
			var oleft = ele.offsetLeft + ele.offsetParent.offsetLeft;
			var width = ele.offsetWidth;
			this.bottom = otop;
			this.right = oleft + width;
		};
		Position.prototype.inBottomLeft = function(ele) {
			if(!Ele._isElement(ele)){
				return ;
			}
			this.positionType = "bottom-left";
			var otop = ele.offsetTop + ele.offsetParent.offsetTop;
			var oleft = ele.offsetLeft + ele.offsetParent.offsetLeft;
			var height = ele.offsetHeight;
			this.top = otop + height;
			this.left = oleft;
		};
		Position.prototype.inBottomRight = function(ele) {
			if(!Ele._isElement(ele)){
				return ;
			}
			this.positionType = "bottom-right";
			var otop = ele.offsetTop + ele.offsetParent.offsetTop;
			var oleft = ele.offsetLeft + ele.offsetParent.offsetLeft;
			var width = ele.offsetWidth;
			var height = ele.offsetHeight;
			this.top = otop + height;
			this.right = oleft + width;
		};
		Position.prototype.setOffset = function(size) {
			if(!(size instanceof Ele.Utils.Size)){
				return ;
			}
			if(this.positionType == "top-left"){
				this.left += size.width;
				this.bottom += size.height;
			}
			if(this.positionType == "top-right"){
				this.right += size.width;
				this.bottom += size.height;
			}
			if(this.positionType == "bottom-left"){
				this.left += size.width;
				this.top += size.height;
			}
			if(this.positionType == "bottom-right"){
				this.right += size.width;
				this.top += size.height;
			}
		};
		
		this._init();
	};
	var Size = Ele.Utils.Size = function(width, height) {
		this.eleType = "util";
		this.width;
		this.height;
	
		Size.prototype._init = function() {
			this.width = width;
			this.height = height;
		};
		
		this._init();
	};
})();