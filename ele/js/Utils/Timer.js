(function(){
	var Timer = Ele.Utils.Timer = function(funName, interval){
		this.eleType = "util";
		this.ele;
		this._interval = 20;
		this._funName=function(){};
		this.data=null;
	
		Timer.prototype._init = function(){
			if(typeof(funName) == "function"){
				this._funName = funName;
			}
			if(typeof(interval) == "number"){
				this._interval = interval;
			}
		};
		Timer.prototype.setData = function(data){
			this.data = data;
		};
		Timer.prototype.execute = function(){
			this._exe(this);
		};
		
		Timer.prototype._exe = function(context){
			var res = context._funName(context.data);
			if(res){
				setTimeout(context._exe, context._interval, context);
			}
		};
		
		this._init();
	}
})();