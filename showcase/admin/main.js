var leftView;
var topView;
var contentView;
var bottomView;
var menuExpand = true;
var left = 0;

function close(){
	if(left <= -240){
		return;
	}
	left -= 24;
	leftView.setLeft(left);
	
	var pleft = left + 240;
	topView.setPaddingLeft(pleft);
	bottomView.setPaddingLeft(pleft);
	contentView.ele.style.paddingLeft = pleft+"px";
	setTimeout(close, 20);
}
function expand(){
	if(left >= 0){
		return;
	}
	left += 24;
	leftView.setLeft(left);
	var pleft = left + 240;
	topView.setPaddingLeft(pleft);
	bottomView.setPaddingLeft(pleft);
	contentView.ele.style.paddingLeft = pleft+"px";
	setTimeout(expand, 20);
}

(function(){
	var MainView = window.MainView = function(rootView){
		
		MainView.prototype._init = function(){
			var wininner = new Ele.Utils.WinInner();
			// var masking = new Ele.Views.Masking();
			// masking.view.setContainerById("main");
			// var at = new Ele.AjaxLoad();
			// at.show();
			var ii= 10;
			var timer = new Ele.Utils.Timer(function(){
				ii --;
				if(ii < 0){
					return false;
				}
				console.log("==>"+ii);
				return true;
			});
			timer.execute();
			
			//创建一个面板
			leftView = new LeftView(wininner.getHeight());
			
			wininner.addResizeHandler(function(width, height){
				leftView.onWindowResize(height);
			});
			
			topView = new TopView(function(){
				if(menuExpand){
					topView.showExpand();
					close();
				}else{
					topView.showClose();
					expand();
				}
				menuExpand = !menuExpand;
			});
			
			contentView = new Ele.Layout("admin_content_view");
			
			bottomView = new BottomView();
			
			rootView.add(leftView.getView());
			rootView.add(topView.getView());
			rootView.add(contentView);
			rootView.add(bottomView.getView());
		};
		
		MainView.prototype.addContentView = function(view){
			contentView.add(view);
		};
		
		this._init();
	}

})();