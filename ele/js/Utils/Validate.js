(function(){
	var Validate = Ele.Utils.Validate = function() {
		this.eleType = "util";
		this.validates = [];
		this.filter;
		this.error;
		this._notEmpty = false;
	
		Validate.prototype.isEmpty = function(text){
			if(typeof(text) != "string" || text.trim() == ""){
				return true;
			}
			return false;
		};
	
		Validate.prototype.validate = function(text){
			var res = true;
			if(this._notEmpty){
				if(this.isEmpty(text)){
					this.error = "内容不能为空";
					return false;
				}
			}
			
			if(this.validates.length < 1){
				return true;
			}
			
			for(var i in this.validates){
				//长度限制
				if(this.validates[i] instanceof Limit){
					var len = text.length;
					if(len < this.validates[i].start){
						this.error = "长度不能少于"+this.validates[i].start;
						res = false;
						break;
					}
					if(len > this.validates[i].end){
						this.error = "长度不能多于"+this.validates[i].end;
						res = false;
						break;
					}
					continue;
				}
				
				//正则限制
				if(this.validates[i] instanceof Reg){
					if(!this.validates[i].test(text)){
						this.error = "正则验证失败";
						if(typeof(this.validates[i].errorMsg) == "string"){
							this.error = this.validates[i].errorMsg;
						}
						res = false;
						break;
					}
					continue;
				}
				
				//字母开头限制
				if(this.validates[i] instanceof StartWithLetter){
					var start = text.charAt(0);
					if(!this.filter.isLetter(start)){
						this.error = "请以字母开头";
						res = false;
						break;
					}
					continue;
				}
				
				//不包含中文限制
				if(this.validates[i] instanceof NoChinese){
					var inChinese = false;
					for(var index = 0; index < text.length; index ++){
						if(this.filter.isChinese(text.charAt(index))){
							inChinese = true;
							break;
						}   
					}
					if(inChinese){
						this.error = "内容不能包含中文字符";
						res = false;
						break;
					}
					continue;
				}
				//中文限制
				if(this.validates[i] instanceof AllChinese){
					var inNotChinese = false;
					for(var index = 0; index < text.length; index ++){
						if(!this.filter.isChinese(text.charAt(index))){
							inNotChinese = true;
							break;
						}   
					}
					if(inNotChinese){
						this.error = "内容仅限中文字符";
						res = false;
						break;
					}
					continue;
				}
				
				//注入字符限制
				if(this.validates[i] instanceof InjectionKey){
					var inKey = false;
					for(var index = 0; index < text.length; index ++){
						if(this.filter.injectionKey(text.charAt(index))){
							inKey = true;
							break;
						}   
					}
					if(inKey){
						this.error = "内容包含非法字符";
						res = false;
						break;
					}
					continue;
				}
				
			}
			return res;
		};
		Validate.prototype.addNotEmpty = function() {
			this._notEmpty = true;
		};
		Validate.prototype.addLimit = function(start, end) {
			if(typeof(start) != "number" || typeof(end) != "number"){
				return ;
			}
			if(start < 0 || end < 0){
				return ;
			}
			this._notEmpty = true;
			this.validates.push(new Limit(start, end));
		};
		Validate.prototype.addReg = function(reg, errorMsg) {
			if(!(reg instanceof RegExp)){
				return ;
			}
			this._notEmpty = true;
			this.validates.push(new Reg(reg, errorMsg));
		};
		
		Validate.prototype.addStartWithLetter = function (){
			this._notEmpty = true;
			this.validates.push(new StartWithLetter());
		};
		Validate.prototype.addNoChinese = function(){
			this._notEmpty = true;
			this.validates.push(new NoChinese());
		};
		Validate.prototype.addAllChinese = function(){
			this._notEmpty = true;
			this.validates.push(new AllChinese());
		};
		Validate.prototype.addInjectionKey = function(){
			this._notEmpty = true;
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
	var Reg = function(reg, errorMsg){
		this.reg;
		this.errorMsg;
		
		Reg.prototype._init = function(){
			this.reg = reg;
			this.errorMsg = errorMsg;
		};
		Reg.prototype.test = function(text){
			return this.reg.test(text);
		};
		
		this._init();
	};
	var StartWithLetter = function(){};
	var NoChinese = function(){};
	var AllChinese = function(){};
	var InjectionKey = function(){};
})();