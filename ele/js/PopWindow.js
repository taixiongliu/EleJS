(function(){
	var PopWindow = Ele.PopWindow = function(wid, hgt){
		this.eleType = "layout";
		this.ele;
		this.bgView;
		this.view;
		this.width = 208;
		this.height = 128;
		if(typeof(wid) == "number"){
			this.width = wid + 8;
		}
		if(typeof(hgt) == "number"){
			this.height = hgt + 32;
		}
		this.title;
		this.contentView;
		
		PopWindow.prototype.init = function(){
			var context = this;
			this.bgView = new Ele.Layout("ele_popwindow_bg_view");
			this.view = new Ele.Layout("ele_popwindow_view");
			this.ele = this.view.ele;
			this.view.setSize(this.width+"px", this.height+"px");
			
			var winInner = new Ele.Utils.WinInner();
			var left = (winInner.getWidth() - this.width)/2;
			var top = (winInner.getHeight() - this.height)/2;
			this.ele.style.left = left + "px";
			this.ele.style.top = top + "px";
			
			var titleView = new Ele.Layout("ele_popwindow_title_view");
			titleView.setWidth((this.width - 8) +"px");
			var titleNameView = new Ele.Layout("ele_popwindow_title_name_view");
			titleNameView.setWidth((this.width - 38)+"px");
			this.title = new Ele.Label("", "ele_popwindow_txt_title");
			titleNameView.add(this.title);
			
			var titleCloseView = new Ele.Layout("ele_popwindow_title_close_view");
			var imgClose = new Ele.Img(Ele._pathPrefix+"ele/"+Ele._skin+"/assets/64/icon_close.png", "ele_popwindow_title_icon_close");
			imgClose.ele.onclick = function(){
				context.hide();
			};
			
			var clearFloat = new Ele.Layout("ele_cl");
			titleCloseView.add(imgClose);
			titleView.add(titleNameView);
			titleView.add(titleCloseView);
			titleView.add(clearFloat);
			
			this.contentView = new Ele.Layout("ele_popwindow_content_view");
			this.contentView.setSize((this.width - 8) +"px", (this.height - 32)+"px");
			
			this.view.add(titleView);
			this.view.add(this.contentView);
			
			Ele.rootView.add(this.bgView);
			Ele.rootView.add(this.view);
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
			this.contentView.add(ele);
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
