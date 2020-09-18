(function(){
	var PopWindow = Ele.PopWindow = function(wid, hgt){
		this.eleType = "layout";
		this.ele;
		this.bgView;
		this.view;
		var width = 208;
		var height = 128;
		if(typeof(wid) == "number"){
			width = wid + 8;
		}
		if(typeof(hgt) == "number"){
			height = hgt + 32;
		}
		this.title;
		var contentView;
		
		PopWindow.prototype.init = function(){
			var context = this;
			var body = document.getElementsByTagName("body")[0];
			this.bgView = new Ele.Layout("ele_popwindow_bg_view");
			this.view = new Ele.Layout("ele_popwindow_view");
			this.ele = this.view.ele;
			this.view.setSize(width+"px", height+"px");
			
			var winInner = new Ele.WinInner();
			var left = (winInner.getWidth() - width)/2;
			var top = (winInner.getHeight() - height)/2;
			this.ele.style.left = left + "px";
			this.ele.style.top = top + "px";
			
			var titleView = new Ele.Layout("ele_popwindow_title_view");
			titleView.setWidth((width - 8) +"px");
			var titleNameView = new Ele.Layout("ele_popwindow_title_name_view");
			titleNameView.setWidth((width - 38)+"px");
			this.title = new Ele.Label("", "ele_popwindow_txt_title");
			titleNameView.add(this.title);
			
			var titleCloseView = new Ele.Layout("ele_popwindow_title_close_view");
			var imgClose = new Ele.Img(Ele._pathPrefix+"ele/icons/icon_close.png", "ele_popwindow_title_icon_close");
			imgClose.ele.onclick = function(){
				context.hide();
			};
			
			var clearFloat = new Ele.Layout("ele_cl");
			titleCloseView.add(imgClose);
			titleView.add(titleNameView);
			titleView.add(titleCloseView);
			titleView.add(clearFloat);
			
			contentView = new Ele.Layout("ele_popwindow_content_view");
			contentView.setSize((width - 8) +"px", (height - 32)+"px");
			
			console.log(titleView.ele);
			this.view.add(titleView);
			this.view.add(contentView);
			
			body.appendChild(this.bgView.ele);
			body.appendChild(this.view.ele);
		};
		
		PopWindow.prototype.setTitle = function(title){
			this.title.setText(title);
		};
		
		PopWindow.prototype.show = function(){
			if(this.bgView != null){
				this.bgView.ele.style.display = "block";
			}
			if(this.view != null){
				this.view.ele.style.display = "block";
			}
		};
		
		PopWindow.prototype.addView = function(ele){
			contentView.add(ele);
		};
		
		PopWindow.prototype.hide = function(){
			if(this.bgView != null){
				this.bgView.ele.style.display = "none";
			}
			if(this.view != null){
				this.view.ele.style.display = "none";
			}
		};
		
		this.init();
	};
})();
