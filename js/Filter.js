(function(){
	var Filter = Ele.Filter = function() {
		this.eleType = "util";
		this.ele;
		this._sqlkey = ["*", "/", "-", "'", "+"];
	
		Filter.prototype.isStoreId = function(name) {
			var reg = /^[a-zA-Z]{4}[0-9]{4,5}$/;
			return reg.test(name);
		};
	
		Filter.prototype.isAccount = function(name) {
			var reg = /^[a-zA-Z][a-zA-Z0-9_]{3,14}$/;
			return reg.test(name);
		};
		
		Filter.prototype.isNumber = function(number) {
			var reg = /^(0|[1-9][0-9]*)$/;
			return reg.test(number);
		};
		
		Filter.prototype.isPhoneNumber = function(phoneNumber) {
			var reg = /^[1][34578][0-9]{9}$/;
			return reg.test(phoneNumber);
		};
		
		Filter.prototype.isCount = function(count) {
			var reg = /^([1-9]|[1-9][0-9]*)$/;
			return reg.test(count);
		};
	
		Filter.prototype.isSqlKey = function(name) {
			var res = false;
			for (var i = 0, len = this._sqlkey.length; i < len; i++) {
				if (name.indexOf(this._sqlkey[i]) != -1) {
					res = true;
					break;
				}
			}
			return res;
		};
	};
})();
