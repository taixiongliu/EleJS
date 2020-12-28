(function(){
	var AjaxLoad = Ele.AjaxLoad = function(){
		this.eleType = "layout";
		this.ele;
		this.view;
		this._msg;
		AjaxLoad.prototype._init = function(){
			var body = document.getElementsByTagName('body')[0];
			this.view = new Ele.Layout("ele_shade_pl");
			this.ele = this.view.ele;
			
			var bg = new Ele.Layout("ele_shade_bg");
			
			var content = new Ele.Layout("ele_ajaxload_content");
			var winInner = new Ele.Utils.WinInner();
			var width = winInner.getWidth();
			var height = winInner.getHeight();
			content.ele.style.marginTop = (height/2 - 18)+"px";
			content.ele.style.marginLeft = (width/2 - 90)+"px";
			
			var img_panel = new Ele.Layout("ele_ajaxload_content_img");
			var img_item = new Ele.Img(Ele._pathPrefix+"ele/icons/ajax-loader.gif");
			img_panel.add(img_item);
			this._msg = new Ele.Layout("ele_ajaxload_content_msg");
			this._msg.setAlign("center");
			this._msg.setHtml("数据处理中，请稍后...");
			
			content.add(img_panel);
			content.add(this._msg);
			
			this.view.add(bg);
			this.view.add(content);
			
			this.view.setContainer(body);
		};
		
		AjaxLoad.prototype.setMsg = function(msg){
			if(this._msg != null){
				this._msg.setHtml(msg);
			}
		};
		
		AjaxLoad.prototype.show = function(){
			if(this.ele != null){
				this.ele.style.display = "block";
			}
		};
		
		AjaxLoad.prototype.hide = function(){
			if(this.ele != null){
				this.ele.style.display = "none";
			}
		};
		
		AjaxLoad.prototype.getView = function(){
			return this.view;
		};
		
		AjaxLoad.prototype.close = function(){
			var body = document.getElementsByTagName('body')[0];
			if(this.ele != null){
				body.removeChild(this.ele);
				this.ele = null;
			}
		};
		
		this._init();
	}
})();
