(function(){
	var WinInner = Ele.Utils.WinInner = function() {
		this.eleType = "util";
		this._width;
		this._height;
		this._handlers = [];
		var _ele_wininner_context = this;
	
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
			_ele_wininner_context._init();
			if(_ele_wininner_context._handlers.length > 0){
				for(var i = 0; i < _ele_wininner_context._handlers.length; i ++){
					_ele_wininner_context._handlers[i](_ele_wininner_context._width,_ele_wininner_context._height);
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
