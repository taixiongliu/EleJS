(function(){
	var Label = Ele.Label = function(text, cName){
		this.eleType = "span";
		this.ele;
		
		Label.prototype.setText = function(text){
			this.ele.innerHTML = text;
		};
		
		Label.prototype._init = function(){
			this.ele = document.createElement("span");
			if(typeof(cName) == "string"){
				this.ele.className = cName;
			}else{
				this.ele.className = "ele_label";
			}
			if(typeof(text) == "string"){
				this.ele.innerHTML = text;
			}
		};
		this._init();
	};
	
	var IconLabel = Ele.IconLabel = function(args) {
		this.eleType = "layout";
		this.ele;
		this.view;
		this._style;
		this._focusStyle;
		this.data="";
		
		IconLabel.prototype._init = function(){
			this._style = "ele_icon_label";
			this._focusStyle = "ele_icon_label_focus";
			this.view = new Ele.Layout("ele_icon_label");
			this.ele = this.view.ele;
			var img = null;
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
					img = new Ele.Img(args.icon,"ele_icon_label_icon")
				}
				if(typeof(args.text) != "undefined"){
					txt = new Label(args.text,"ele_label ele_icon_label_txt ele_ml2");
				}
				if(txt != null && typeof(args.textStyle) != "undefined"){
					txt.ele.className = args.textStyle+" ele_icon_label_txt ele_ml2";
				}
				if(typeof(args.onclick) == "function"){
					this.ele.onclick = function(){
						args.onclick(context.data);
					};
				}
			}
			if(img != null){
				this.view.add(img);
			}
			if(txt != null){
				this.view.add(txt);
			}
			this.ele.onmouseover = function(){
				context.ele.className = context._focusStyle;
			};
			this.ele.onmouseout = function(){
				context.ele.className = context._style;
			};
		};
		this._init();
	};
})();
