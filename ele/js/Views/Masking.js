(function(){
	var Masking = Ele.Views.Masking = function() {
		this.eleType = "layout";
		this.ele;
		this.view;
		this.bg;
		this.content;
		
		Masking.prototype._init = function(){
			this.view = new Ele.Layout("ele_masking");
			this.ele = this.view.ele;
			this.bg = new Ele.Layout("ele_masking_bg");
			this.content = new Ele.Layout("ele_masking_content");
			
			var context = this;
			//点击主布局外隐藏窗口
			this.bg.ele.onclick = function(e){
				context.hideMasking();
			};
			
			this.view.add(this.bg);
			this.view.add(this.content);
		};
		
		Masking.prototype.setContent = function(view){
			this.content.clear();
			this.content.add(view);
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
