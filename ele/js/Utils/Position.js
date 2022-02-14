(function(){
	var Position = Ele.Utils.Position = function() {
		this.eleType = "util";
		this.positionType;
		this.left;
		this.top;
		this.right;
		this.bottom;
		this.toTop;
		this.toLeft;
		this.toScrollTop;
		this.toScrollLeft;
	
		Position.prototype._init = function() {
			this.positionType = "bottom-left";
			this.left = 0;
			this.top = 0;
			this.right = 0;
			this.bottom = 0;
		};
		Position.prototype.toPosition = function(ele){
			this.toTop = 0;
			this.toLeft = 0;
			this.toScrollTop = 0;
			this.toScrollLeft = 0;
			this._recursion(ele);
		};
		Position.prototype._recursion = function(ele){
			if(ele.offsetParent == null){
				return ;
			}
			this.toTop += ele.offsetParent.offsetTop;
			this.toLeft += ele.offsetParent.offsetLeft;
			this.toScrollTop += ele.offsetParent.scrollTop;
			this.toScrollLeft += ele.offsetParent.scrollLeft;
			this._recursion(ele.offsetParent);
		};
	
		Position.prototype.inTopLeft = function(ele) {
			if(!Ele._isElement(ele)){
				return ;
			}
			
			this.positionType = "top-left";
			this.toPosition(ele);
			var otop = ele.offsetTop + this.toTop;
			var oleft = ele.offsetLeft + this.toLeft;
			var scrollTop = this.toScrollTop;
			var scrollLeft = this.toScrollLeft;
			this.bottom = otop - scrollTop;
			this.left = oleft - scrollLeft;
		};
		Position.prototype.inTopRight = function(ele) {
			if(!Ele._isElement(ele)){
				return ;
			}
			this.positionType = "top-right";
			this.toPosition(ele);
			var otop = ele.offsetTop + this.toTop;
			var oleft = ele.offsetLeft + this.toLeft;
			var width = ele.offsetWidth;
			var scrollTop = this.toScrollTop;
			var scrollLeft = this.toScrollLeft;
			this.bottom = otop - scrollTop;
			this.right = oleft + width - scrollLeft;
		};
		Position.prototype.inBottomLeft = function(ele) {
			if(!Ele._isElement(ele)){
				return ;
			}
			this.positionType = "bottom-left";
			this.toPosition(ele);
			var otop = ele.offsetTop + this.toTop;
			var oleft = ele.offsetLeft + this.toLeft;
			var scrollTop = this.toScrollTop;
			var scrollLeft = this.toScrollLeft;
			var height = ele.offsetHeight;
			this.top = otop + height - scrollTop;
			this.left = oleft - scrollLeft;
		};
		Position.prototype.inBottomRight = function(ele) {
			if(!Ele._isElement(ele)){
				return ;
			}
			this.positionType = "bottom-right";
			this.toPosition(ele);
			var otop = ele.offsetTop + this.toTop;
			var oleft = ele.offsetLeft + this.toLeft;
			var width = ele.offsetWidth;
			var height = ele.offsetHeight;
			var scrollTop = this.toScrollTop;
			var scrollLeft = this.toScrollLeft;
			this.top = otop + height - scrollTop;
			this.right = oleft + width - scrollLeft;
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