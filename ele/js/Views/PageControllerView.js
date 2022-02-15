(function(){
	var PageControllerView = Ele.Views.PageControllerView = function() {
		this.eleType = "layout";
		this.ele;
		this.view;
		this.pages;//压栈页面
		
		/**
		 * 压栈
		 * @param {Object} view
		 * @param {Object} background
		 */
		PageControllerView.prototype.pushView = function(view, background){
			var layout = new Ele.Layout("ele_page_controller_panel");
			if(typeof(background) != "undefined"){
				layout.ele.background = background;
			}
			//初始页面直接显示
			if(this.pages.length > 0){
				layout.ele.style.position = "absolute";
				layout.ele.style.top = "0px";
				layout.ele.style.left = "100%";
				layout.ele.style.zIndex = 1;
				layout.ele.style.display = "none";
			}
			
			layout.add(view);
			this.view.add(layout);
			//第二个页面开启动画
			if(this.pages.length > 0){
				//当前显示页面
				var yetPage = this.pages[this.pages.length - 1];
				var left = 100;
				layout.ele.style.display = "block";
				var context = this;
				var timer = new Ele.Utils.Timer(function(){
					if(left <= 0){
						yetPage.ele.style.display = "none";
						layout.ele.style.position = "static";
						return false;
					}
					left -=10;
					layout.ele.style.left = left+"%";
					return true;
				});
				timer.execute();
			}
			this.pages.push(layout);
		};
		
		/**
		 * 出栈
		 */
		PageControllerView.prototype.pullView = function(){
			//最后的页面无法推出
			if(this.pages.length < 2){
				return ;
			}
			if(this.pages.length > 0){
				//当前显示页面
				var prePage = this.pages[this.pages.length - 2];
				var yetPage = this.pages[this.pages.length - 1];
				var left = 0;
				//prePage.ele.style.left = "0%";
				//prePage.ele.style.display = "block";
				yetPage.ele.style.position = "absolute";
				yetPage.ele.style.top = "0px";
				yetPage.ele.style.left = "0%";
				yetPage.ele.style.zIndex = 1;
				prePage.ele.style.display = "block";
				var context = this;
				var timer2 = new Ele.Utils.Timer(function(){
					if(left >= 100){
						yetPage.ele.style.display = "none";
						//页面删除
						context.view.remove(yetPage);
						//删除数组最后一项
						context.pages.splice(context.pages.length - 1, 1);
						return false;
					}
					left +=10;
					yetPage.ele.style.left = left+"%";
					return true;
				});
				timer2.execute();
			}
		};
		
		PageControllerView.prototype._init = function(){
			this.view = new Ele.Layout("ele_page_controller_view");
			this.ele = this.view.ele;
			this.pages = [];
		};
		
		this._init();
	};
})();