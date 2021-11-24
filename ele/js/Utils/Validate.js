(function(){
	var Validate = Ele.Utils.Validate = function() {
		this.eleType = "util";
		this.validates = [];
		this.filter;
		this.error;
	
		Validate.prototype.validate = function(text){
			var res = true;
			if(typeof(text) != "string" || text.trim() == ""){
				this.error = "字段不能为空";
				return false;
			}
			for(var i in this.validates){
				
				if(this.validates[i] instanceof Limit){
					var len = text.length;
					if(len < this.validates[i].start){
						this.error = "字段长度不能少于"+this.validates[i].start;
						res = false;
						break;
					}
					if(len > this.validates[i].end){
						this.error = "字段长度不能多于"+this.validates[i].end;
						res = false;
						break;
					}
					continue;
				}
			}
			return res;
		};
	
		Validate.prototype.addLimit = function(start, end) {
			if(typeof(start) != "number" || typeof(end) != "number"){
				return ;
			}
			if(start < 0 || end < 0){
				return ;
			}
			this.validates.push(new Limit(start, end));
		};
		Validate.prototype.addReg = function(reg) {
			if(!reg instanceof RegExp){
				return ;
			}
			this.validates.push(new Reg(reg));
		};
		
		Validate.prototype.addStartWithLetter = function (){
			this.validates.push(new StartWithLetter());
		};
		Validate.prototype.addNoChinese = function(){
			this.validates.push(new NoChinese());
		};
		Validate.prototype.addAllChinese = function(){
			this.validates.push(new AllChinese());
		};
		Validate.prototype.addInjectionKey = function(){
			this.validates.push(new InjectionKey());
		};
		
		Validate.prototype._init = function() {
			this.filter = new Ele.Utils.Filter();
		};
		
		this._init();
	};
	
	var Limit = function(start, end){
		this.start;
		this.end;
		
		Limit.prototype._init = function(){
			this.start = start;
			this.end = end;
		};
		
		this._init();
	};
	var Reg = function(reg){
		this.reg;
		
		Limit.prototype._init = function(){
			this.reg = reg;
		};
		
		this._init();
	};
	var StartWithLetter = function(){};
	var NoChinese = function(){};
	var AllChinese = function(){};
	var InjectionKey = function(){};
})();