(function(){
	var Button = Ele.Button = function(value, type){
		this.eleType = "layout";
		this.ele;
		this.view;
		this._ondown = false;
		this._clickHandler = null;
		
		
		Button.prototype._init = function(){
			var cName = "ele_button ele_button_blue";
			var cOver = "ele_button ele_button_blue_down";
			if(typeof(type) == "string"){
				cName = "ele_button ele_button_"+type;
				cOver = "ele_button ele_button_"+type+"_down";
			}
			this.view = new Ele.Layout(cName);
			this.view.setAlign("center");
			this.view.setHtml(value);
			this.ele = this.view.ele;
			var obj = this.ele;
			var context = this;
			obj.onmousedown = function(){
				obj.className = cOver;
				context._ondown = true;
			};
			obj.onmouseup = function(){
				obj.className = cName;
				context._ondown = false;
			};
			obj.onmouseout = function(){
				if(context._ondown){
					obj.className = cName;
					context._ondown = false;
				}
			};
			obj.onclick = function(){
				if(context._clickHandler != null){
					context._clickHandler();
				}
			};
		};
		Button.prototype.setWidth = function(width){
			this.view.setWidth(width);
		};
		Button.prototype.setClickHandler = function(handler){
			this._clickHandler = handler;
		};
		Button.prototype.removeClickHandler = function(){
			this._clickHandler = null;
		};
		this._init();
	};
	
	var CButton = Ele.CButton = function(value, s, e){
		this.eleType = "layout";
		this.ele;
		this.view;
		this._ondown = false;
		this._clickHandler = null;
		
		CButton.prototype._init = function(){
			this.view = new Ele.Layout(s);
			this.view.setAlign("center");
			this.view.setHtml(value);
			this.ele = this.view.ele;
			var obj = this.ele;
			var context = this;
			obj.onmousedown = function(){
				obj.className = e;
				context._ondown = true;
			};
			obj.onmouseup = function(){
				obj.className = s;
				context._ondown = false;
			};
			obj.onmouseout = function(){
				if(context._ondown){
					obj.className = s;
					context._ondown = false;
				}
			};
			obj.onclick = function(){
				if(context._clickHandler != null){
					context._clickHandler();
				}
			};
		};
		CButton.prototype.setClickHandler = function(handler){
			this._clickHandler = handler;
		};
		CButton.prototype.removeClickHandler = function(){
			this._clickHandler = null;
		};
		this._init();
	};
})();
