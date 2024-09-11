(function(){
	var PopView = Ele.Views.PopView = function(wid){
		this.eleType = "layout";
		this.ele;
		this.bgView;
		this.view;
		this.width = 808;
		if(typeof(wid) == "number"){
			this.width = wid+8;
		}
		this.close;
		this.contentView;
		
		PopView.prototype.init = function(){
			var context = this;
			this.bgView = new Ele.Layout("ele_popview_bg_view");
			this.view = new Ele.Layout("ele_popview_view");
			this.ele = this.view.ele;
			this.view.setAlign("center");
			
			var panel = new Ele.HLayout("ele_popview_panel");
			//72+2+72+16
			panel.setSize((this.width+162)+"px", "100%");
			
			this.contentView = new Ele.Layout("ele_popview_content_view ele_scrollbar");
			this.contentView.setWidth(this.width +"px");
			
			panel.add(this.contentView,{padding:"0 0 0 72px"});
			
			this.close = new Ele.Layout("ele_popview_close_view");
			var image = new Ele.Img(Ele._pathPrefix+"ele/"+Ele._skin+"/assets/big-close.png","ele_popview_close_img");
			this.close.add(image);
			this.close.ele.onclick = function(){
				context.hide();
			}
			
			panel.add(this.close,{padding:"16px 0 0 16px"});
			
			this.view.add(panel);
			
			Ele.rootView.add(this.bgView);
			Ele.rootView.add(this.view);
		};
		
		PopView.prototype.show = function(){
			if(this.bgView != null){
				this.bgView.ele.style.display = "block";
			}
			if(this.view != null){
				this.view.ele.style.display = "block";
			}
		};
		
		PopView.prototype.addView = function(ele){
			this.contentView.add(ele);
		};
		
		PopView.prototype.clear = function(){
			this.contentView.clear();
		};
		
		PopView.prototype.hide = function(){
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
