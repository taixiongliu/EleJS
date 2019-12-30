(function(){
	var Ajax = Ele.Ajax = function(){
		this.eleType = "util";
		this.ele;
		this._method = 'POST';
		this._con = true;
		this._parameter = null;
	
		Ajax.prototype._createXmlHttp = function() {
			var xmlHttp;
			try {
				// Firefox, Opera 8.0+, Safari
				xmlHttp = new XMLHttpRequest();
			} catch (e) {
				// Internet Explorer
				try {
					xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
				} catch (e) {
					try {
						xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
					} catch (e) {
						// Refusing To Support Ajax 
						return false;
					};
				};
			}
			return xmlHttp;
		};
	
		Ajax.prototype.setMethod = function(method) {
			this._method = method;
		};
	
		Ajax.prototype.setSynchronization = function(syn) {
			this._con = syn;
		};
	
		Ajax.prototype.setParameter = function(parameter) {
			this._parameter = parameter;
		};
	
		Ajax.prototype.request = function(url, functionName) {
			if (typeof(url) == 'undefined' || url == '') {
				return;
			}
			var xmlhttp = this._createXmlHttp();
	
			xmlhttp.onreadystatechange = function() {
				if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
					if (typeof(functionName) == 'function') {
						functionName(xmlhttp.responseText);
					}
				}
			};
			xmlhttp.open(this._method, url, this._con);
			xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			xmlhttp.send(this._parameter);
		};
	}
})();