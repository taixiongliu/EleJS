(function(){
	var Button = Ele.Button = function(args) {
		this.eleType = "layout";
		this.ele;
		this.view;
		this.img;
		this._style;
		this._focusStyle;
		this._icon;
		this._focusIcon;
		this.data="";
		
		Button.prototype._init = function(){
			this._style = "ele_button";
			this._focusStyle = "ele_button_focus";
			this.view = new Ele.Layout("ele_button");
			this.ele = this.view.ele;
			var txt = null;
			var context = this;
			if(typeof(args) == "object"){
				if(typeof(args.style) != "undefined"){
					this.ele.className = args.style;
					this._style = args.style;
				}
				if(typeof(args.focusStyle) != "undefined"){
					this._focusStyle = args.focusStyle;
				}
				if(typeof(args.icon) != "undefined"){
					this.img = new Ele.Img(args.icon,"ele_button_icon");
					this._icon = args.icon;
				}
				if(typeof(args.focusIcon) != "undefined"){
					this._focusIcon = args.focusIcon;
				}
				if(typeof(args.text) != "undefined"){
					txt = new Ele.Label(args.text,"ele_label ele_button_txt ele_ml2");
				}
				if(txt != null && typeof(args.textStyle) != "undefined"){
					txt.ele.className = args.textStyle+" ele_button_txt ele_ml2";
				}
				if(typeof(args.onclick) == "function"){
					this.ele.onclick = function(){
						args.onclick(context.data);
					};
				}
			}
			if(this.img != null){
				this.view.add(this.img);
			}
			if(txt != null){
				this.view.add(txt);
			}
			this.ele.onmouseover = function(){
				context.ele.className = context._focusStyle;
				context.img.ele.src = context._focusIcon;
			};
			this.ele.onmouseout = function(){
				context.ele.className = context._style;
				context.img.ele.src = context._icon;
			};
		};
		this._init();
	};
	
	var BigButton = Ele.BigButton = function(value, type){
		this.eleType = "layout";
		this.ele;
		this.view;
		this._ondown = false;
		this._clickHandler = null;
		
		
		BigButton.prototype._init = function(){
			var cName = "ele_big_button ele_big_button_blue";
			var cOver = "ele_big_button ele_big_button_blue_down";
			if(typeof(type) == "string"){
				cName = "ele_big_button ele_big_button_"+type;
				cOver = "ele_big_button ele_big_button_"+type+"_down";
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
		BigButton.prototype.setWidth = function(width){
			this.view.setWidth(width);
		};
		BigButton.prototype.setClickHandler = function(handler){
			this._clickHandler = handler;
		};
		BigButton.prototype.removeClickHandler = function(){
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
