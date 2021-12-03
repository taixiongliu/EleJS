(function(){
	var SelectBox = Ele.SelectBox = function(args){
		this.eleType = "layout";
		this.ele;
		this.view;
		this.hintView;
		this.edit;
		this.listView;
		this.masking;
		
		SelectBox.prototype.addOption = function(option){
			this.ele.appendChild(option.ele);
		};
		SelectBox.prototype.setValue = function(value){
			this.ele.value = value;
		};
		
		SelectBox.prototype.getValue = function(){
			return this.ele.value;
		};
		
		SelectBox.prototype.showErrorStyle = function(){
			this.ele.className = "ele_select_style_error";
		};
		SelectBox.prototype.clearErrorStyle = function(){
			this.ele.className = "ele_select_style";
		};
		SelectBox.prototype.expend = function(){
			this.masking.setContentNone();
			this.masking.showMasking();
			var context = this;
			this.masking.setHiddenHandler(function(){
				context._onBlur();
			});
			this.listView.ele.style.display = "block";
		};
		
		SelectBox.prototype.hide = function (){
			this.listView.ele.style.display = "none";
		};
		
		SelectBox.prototype._onBlur = function(){
			this.ele.className = "ele_selectbox";
			this.hide();
		};
		
		SelectBox.prototype._onFocus = function(){
			this.ele.className = "ele_selectbox_focus";
			this.expend();
		};
		
		SelectBox.prototype._init = function(){
			this.view = new Ele.HLayout("ele_selectbox");
			this.ele = this.view.ele;
			var context = this;
			this.masking = Ele.masking;
			var hint = "请选择...";
			if(typeof(args) == "object"){
				if(typeof(args.style) != "undefined"){
					this.ele.className = args.style;
				}
				if(typeof(args.hint) != "undefined"){
					hint = args.hint;
				}
				if(typeof(args.readOnly) != "undefined"){
					this.ele.readOnly = args.readOnly;
				}
			}
			this.ele.onclick = function(){
				context._onFocus();
			};
			this.listView = new Ele.Layout("ele_selectbox_list_view");
			this.listView.ele.style.zIndex = this.masking.maxZIndex + 1;
			this.view.add(this.listView);
			
			this.hintView = new Ele.Layout("ele_selectbox_select_view");
			this.hintView.setHtml(hint);
			this.view.add(this.hintView);
			this.edit = new Ele.TextBox({style:"ele_selectbox_intut_style"});
			this.view.add(this.edit);
			var iconView = new Ele.Layout("ele_selectbox_icon_view");
			var icon = new Ele.Img(Ele._pathPrefix+"ele/assets/24/icon_down.png","ele_selectbox_icon");
			iconView.add(icon);
			this.view.add(iconView);
		};
		this._init();
	};
})();
