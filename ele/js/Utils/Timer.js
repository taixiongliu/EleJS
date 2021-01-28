(function(){
	var Timer = Ele.Utils.Timer = function(funName, interval){
		this.eleType = "util";
		this.ele;
		this._interval = 20;
		this._funName=function(){};
		var context = this;
	
		Timer.prototype._init = function(){
			if(typeof(funName) == "function"){
				this._funName = funName;
			}
			if(typeof(interval) == "number"){
				this._interval = interval;
			}
		};
		
		Timer.prototype.execute = function(){
			var res = context._funName();
			if(res){
				setTimeout(context.execute, context._interval);
			}
			
		};
		this._init();
	}
})();