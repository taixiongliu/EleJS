(function(){
	var Masking = Ele.Views.Masking = function() {
		this.eleType = "layout";
		this.ele;
		this.view;
		this.bg;
		this.content;
		this.maxZIndex = 1002;
		this._hiddenEvent = null;
		
		Masking.prototype._init = function(){
			this.view = new Ele.Layout("ele_masking");
			this.ele = this.view.ele;
			this.bg = new Ele.Layout("ele_masking_bg");
			this.content = new Ele.Layout("ele_masking_content");
			
			var context = this;
			//点击主布局外隐藏窗口
			this.bg.ele.onclick = function(e){
				context.hideMasking();
				if(context._hiddenEvent != null && typeof(context._hiddenEvent) == "function"){
					context._hiddenEvent();
				}
			};
			
			this.view.add(this.bg);
			this.view.add(this.content);
		};
		Masking.prototype.setHiddenHandler = function(event){
			this._hiddenEvent = event;
		};
		
		Masking.prototype.setContent = function(view, position){
			if(position instanceof Ele.Utils.Position){
				if(position.positionType == "top-left"){
					view.ele.style.left = position.left+"px";
					view.ele.style.bottom = position.bottom+"px";
				}
				if(position.positionType == "top-right"){
					view.ele.style.right = position.right+"px";
					view.ele.style.bottom = position.bottom+"px";
				}
				if(position.positionType == "bottom-left"){
					view.ele.style.left = position.left+"px";
					view.ele.style.top = position.top+"px";
				}
				if(position.positionType == "top-left"){
					view.ele.style.right = position.right+"px";
					view.ele.style.top = position.top+"px";
				}
			}
			this.content.clear();
			this.content.add(view);
		};
		Masking.prototype.setContentNone = function(){
			this.content.clear();
		};
		Masking.prototype.showMasking = function(){
			this.ele.style.display = "block";
		};
		Masking.prototype.hideMasking = function(){
			this.ele.style.display = "none";
		};
		
		this._init();
	};
})();
