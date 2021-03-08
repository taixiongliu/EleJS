(function(){
	var Timer = Ele.Utils.Timer = function(funName, interval){
		this.eleType = "util";
		this.ele;
		this._interval = 20;
		this._funName=function(){};
	
		Timer.prototype._init = function(){
			if(typeof(funName) == "function"){
				this._funName = funName;
			}
			if(typeof(interval) == "number"){
				this._interval = interval;
			}
		};
		Timer.prototype.execute = function(){
			this._exe(this);
		};
		
		Timer.prototype._exe = function(context){
			var res = context._funName();
			if(res){
				setTimeout(context._exe(context), context._interval);
			}
			
		};
		this._init();
	}
})();