(function(){
	var MainView = window.MainView = function(rootView, mi){
		this.leftView;
		this.topView;
		this.contentView;
		this.bottomView;
		this.menuExpand = true;
		this.left = 0;
		this.alert;
		
		MainView.prototype.close = function(context){
			if(context.left <= -240){
				return false;
			}
			context.left -= 24;
			context.leftView.setLeft(context.left);
			
			var pleft = context.left + 240;
			context.topView.setPaddingLeft(pleft);
			context.bottomView.setPaddingLeft(pleft);
			context.contentView.ele.style.paddingLeft = pleft+"px";
			return true;
		};
		MainView.prototype.expand = function(context){
			if(context.left >= 0){
				return false;
			}
			context.left += 24;
			context.leftView.setLeft(context.left);
			var pleft = context.left + 240;
			context.topView.setPaddingLeft(pleft);
			context.bottomView.setPaddingLeft(pleft);
			context.contentView.ele.style.paddingLeft = pleft+"px";
			return true;
		};
		MainView.prototype.alertMsg = function(msg){
			this.alert.setMsg(msg);
			this.alert.show();
		};
		
		MainView.prototype._init = function(){
			var context = this;
			
			var wininner = new Ele.Utils.WinInner();
			this.alert = new Ele.Alert();
			// var masking = new Ele.Views.Masking();
			// masking.view.setContainerById("main");
			var at = new Ele.AjaxLoad();
			at.show();
			var ii= 10;
			var timer = new Ele.Utils.Timer(function(){
				ii --;
				if(ii < 0){
					at.close();
					return false;
				}
				console.log("==>"+ii);
				return true;
			});
			timer.execute();
			
			var ii2= 10;
			var timer2 = new Ele.Utils.Timer(function(){
				ii2 --;
				if(ii2 < 0){
					return false;
				}
				console.log("2==>"+ii2);
				return true;
			}, 100);
			timer2.execute();
			
			var closeTimer = new Ele.Utils.Timer(context.close);
			closeTimer.setData(context);
			var expandTimer = new Ele.Utils.Timer(context.expand);
			expandTimer.setData(context);
			//创建一个面板
			context.leftView = new LeftView(wininner.getHeight(), mi);
			
			wininner.addResizeHandler(function(width, height){
				context.leftView.onWindowResize(height);
			});
			
			context.topView = new TopView(function(){
				if(context.menuExpand){
					context.topView.showExpand();
					closeTimer.execute();
				}else{
					context.topView.showClose();
					expandTimer.execute();
				}
				context.menuExpand = !context.menuExpand;
			});
			
			context.contentView = new Ele.Layout("admin_content_view");
			
			context.bottomView = new BottomView();
			
			rootView.add(context.leftView.getView());
			rootView.add(context.topView.getView());
			rootView.add(context.contentView);
			rootView.add(context.bottomView.getView());
		};
		
		MainView.prototype.addContentView = function(view){
			this.contentView.add(view);
		};
		
		this._init();
	}

})();