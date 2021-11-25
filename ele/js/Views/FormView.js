(function(){
	var FormView = Ele.Views.FormView = function(action) {
		this.eleType = "layout";
		this.ele;
		this.view;
		this.form;
		this.items;
		this.url;
		
		FormView.prototype.validate = function(){
			var res = true;
			for(var i in this.items){
				if(!this.items[i].validate()){
					res = false;
					break;
				}
			}
			
			return res;
		};
		
		FormView.prototype.formData = function(){
			var data = "";
			var first = true;
			for(var i in this.items){
				if(this.items[i].formString() != null){
					if(first){
						first = false;
					}else{
						data += "&";
					}
					data += this.items[i].formString();
				}
			}
			return data;
		};
		FormView.prototype.submit = function(){
			this.form.ele.submit();
		};
		FormView.prototype.setMethod = function(method){
			this.form.ele.method=method;
		};
		FormView.prototype.setEnctype = function(enctype){
			this.form.ele.enctype=enctype;
		};
		FormView.prototype.setEnctypeMfd = function(){
			this.setEnctype("multipart/form-data");
		};
		
		FormView.prototype.addItem = function(item){
			if(!(item instanceof Ele.Views.FormItemView)){
				return;
			}
			this.form.add(item);
			this.items.push(item);
			var dividerPanel = new Ele.Layout("ele_form_view_divider_panel");
			dividerPanel.add(new Ele.Layout("ele_form_view_divider"));
			this.form.add(dividerPanel);
		};
		
		FormView.prototype._init = function(){
			this.view = new Ele.Layout("ele_form_view");
			this.ele = this.view.ele;
			
			this.url = action;
			this.form = new Ele.Form(action);
			this.form.ele.method = "post";
			this.view.add(this.form);
			
			this.items = [];
		};
		
		this._init();
	};
})();