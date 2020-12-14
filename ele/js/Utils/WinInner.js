(function(){
	var WinInner = Ele.Utils.WinInner = function() {
		this.eleType = "util";
		this._width;
		this._height;
		this._handlers = [];
		var context = this;
	
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
		WinInner.prototype._onResizeResponse = function(){
			context._init();
			if(context._handlers.length > 0){
				for(var i = 0; i < context._handlers.length; i ++){
					context._handlers[i](context._width,context._height);
				}
			}
		};
		
		WinInner.prototype.getWidth = function(){
			return this._width;
		};
		
		WinInner.prototype.getHeight = function(){
			return this._height;
		};
		
		WinInner.prototype.addResizeHandler = function(onResizeHandler){
			if(typeof(onResizeHandler) == "function"){
				this._handlers.push(onResizeHandler);
			}
		};
		
		this._init();
		window.addEventListener("resize",this._onResizeResponse,false);
	};
})();
