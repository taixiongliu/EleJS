(function(){
	var WinInner = Ele.WinInner = function() {
		this._width;
		this._height;
	
		WinInner.prototype._init = function() {
			if (typeof(window.innerWidth) != "undefined") {
				this._width = window.innerWidth;
				this._height = window.innerHeight;
			} else if (typeof(document.documentElement) != "undefined" && typeof(document.documentElement.clientWidth) != "undefined" && document.documentElement.clientWidth != 0) {
				this._width = document.documentElement.clientWidth;
				this._height = document.documentElement.clientHeight;
			} else {
				this._width = document.getElementsByTagName('body')[0].clientWidth;
				this._height = document.getElementsByTagName('body')[0].clientHeight;
			}
		};
		
		WinInner.prototype.getWidth = function(){
			return this._width;
		};
		
		WinInner.prototype.getHeight = function(){
			return this._height;
		};
		
		this._init();
	};
})();
