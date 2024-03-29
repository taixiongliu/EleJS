(function(){
	var Filter = Ele.Utils.Filter = function() {
		this.eleType = "util";
		this._injectionKey = ["&", "/", "\\", "\"", "'", "<",">"];
		
		Filter.prototype.isNumber = function(number) {
			var reg = /^(0|[1-9][0-9]*)$/;
			return reg.test(number);
		};
		
		Filter.prototype.isPhoneNumber = function(phoneNumber) {
			var reg = /^[1][3456789][0-9]{9}$/;
			return reg.test(phoneNumber);
		};
		
		Filter.prototype.isCount = function(count) {
			var reg = /^([1-9]|[1-9][0-9]*)$/;
			return reg.test(count);
		};
		Filter.prototype.isChinese = function(str) {
			var reg = /^[\u4E00-\u9FA5]$/;
			return reg.test(str);
		};
		Filter.prototype.isLetter = function(str) {
			var reg = /^[a-zA-Z]$/;
			return reg.test(str);
		};
		Filter.prototype.isUpper = function(str) {
			var reg = /^[A-Z]$/;
			return reg.test(str);
		};
		Filter.prototype.isLower = function(str) {
			var reg = /^[a-z]$/;
			return reg.test(str);
		};
	
		Filter.prototype.injectionKey = function(name) {
			var res = false;
			for (var i = 0, len = this._injectionKey.length; i < len; i++) {
				if (name.indexOf(this._injectionKey[i]) != -1) {
					res = true;
					break;
				}
			}
			return res;
		};
	};
})();
