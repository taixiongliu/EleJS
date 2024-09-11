(function(){
	var Ajax = Ele.Utils.Ajax = function(){
		this.eleType = "util";
		this._method = 'POST';
		this._contentType = "application/x-www-form-urlencoded";
		this._con = true;
		this._parameter = null;
		this._arrayHead = [];
	
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
		
		Ajax.prototype.setContentType = function(contentType) {
			this._contentType = contentType;
		};
	
		Ajax.prototype.setSynchronization = function(syn) {
			this._con = syn;
		};
	
		Ajax.prototype.setParameter = function(parameter) {
			this._parameter = parameter;
		};
		Ajax.prototype.addRequestHead = function(name, value){
			if(typeof(name) != "string" || typeof(value) != "string"){
				return ;
			}
			if(name.trim() == ""){
				return ;
			}
			this._arrayHead.push(name+","+value);
		};
	
		Ajax.prototype.request = function(url, functionName, mark) {
			if (typeof(url) == 'undefined' || url == '') {
				return;
			}
			var context = this;
			var xmlhttp = this._createXmlHttp();
	
			xmlhttp.onreadystatechange = function() {
				if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
					if (typeof(functionName) == 'function') {
						functionName(xmlhttp.responseText, mark);
					}
				}
			};
			xmlhttp.open(this._method, url, this._con);
			if(this._contentType != null){
				xmlhttp.setRequestHeader("Content-Type", this._contentType);
			}
			//自定义head
			if(this._arrayHead.length > 0){
				for(var i = 0; i < this._arrayHead.length; i ++){
					var temp = this._arrayHead[i].split(",");
					xmlhttp.setRequestHeader(temp[0], temp[1]);
				}
			}
			xmlhttp.send(this._parameter);
		};
	}
})();