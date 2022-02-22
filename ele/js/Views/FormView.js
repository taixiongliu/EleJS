(function(){
	var FormView = Ele.Views.FormView = function(action) {
		this.eleType = "layout";
		this.ele;
		this.view;
		this.form;
		this.appendData;
		this.items;
		this.url;
		this.method;
		
		FormView.prototype.validate = function(){
			var res = true;
			for(var i in this.items){
				if(typeof(this.items[i].validate) != "function"){
					continue;
				}
				if(!this.items[i].validate()){
					res = false;
					break;
				}
			}
			
			return res;
		};
		
		FormView.prototype.reset = function(){
			for(var i in this.items){
				if(typeof(this.items[i].reset) != "function"){
					continue;
				}
				this.items[i].reset();
			}
		};
		
		FormView.prototype.formData = function(){
			var data = "";
			var first = true;
			for(var a in this.appendData){
				if(first){
					first = false;
				}else{
					data += "&";
				}
				data += this.appendData[a];
			}
			for(var i in this.items){
				if(typeof(this.items[i].formString) == "function"){
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
		FormView.prototype.submitFormAjax = function(funName){
			var formData = new FormData();
			for(var a in this.appendData){
				var arr = this.appendData[a].split("=");
				formData.append(arr[0], arr[1]);
			}
			for(var i in this.items){
				if(typeof(this.items[i].appendToFormData) == "function"){
					//默认表单数据优先
					this.items[i].appendToFormData(formData);
					continue;
				}
				if(typeof(this.items[i].formString) == "function"){
					var arr = this.items[i].formString().split("=");
					formData.append(arr[0], arr[1]);
				}
			}
			var ajax = new Ele.Utils.Ajax();
			//取消请求头设置，表单提交自动填充类型
			ajax.setContentType(null);
			var uri = this.url;
			if(this.method.toLowerCase() == "get"){
				ajax.setMethod("GET");
			}
			ajax.setParameter(formData);
			ajax.request(uri, funName);
		};
		FormView.prototype.submitAjax = function(funName){
			var ajax = new Ele.Utils.Ajax();
			var uri = this.url;
			if(this.method.toLowerCase() == "get"){
				ajax.setMethod("GET");
				uri = this.url +"?"+this.formData();
			}else{
				ajax.setParameter(this.formData());
			}
			ajax.request(uri, funName);
		};
		FormView.prototype.setMethod = function(method){
			this.form.ele.method=method;
			this.method = method;
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
		FormView.prototype.appendFormData = function(name, value){
			if(typeof(name) != "string" || typeof(value) == "undefined"){
				return ;
			}
			if(name.trim() == ""){
				return ;
			}
			var hditem = new Ele.TextBox();
			hditem.ele.type = "hidden";
			hditem.ele.name = name;
			hditem.ele.value = value;
			
			this.form.add(hditem);
			this.appendData.push(name+"="+value);
		};
		
		FormView.prototype.setAction = function(action){
			if(typeof(action) == "string"){
				this.url = action;
				this.form.setAction(action);
			}
		};
		
		FormView.prototype._init = function(){
			this.view = new Ele.Layout("ele_form_view");
			this.ele = this.view.ele;
			
			this.form = new Ele.Form();
			this.form.ele.method = "post";
			this.method = "post";
			this.setAction(action);
			this.view.add(this.form);
			
			this.items = [];
			this.appendData = [];
		};
		
		this._init();
	};
})();