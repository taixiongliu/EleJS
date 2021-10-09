window.onload = init;

var leftView;
var topView;
var contentView;
var bottomView;
var menuExpand = true;
var left = 0;
function init(){
	//ELE 不在根目录时设置前缀路径
	Ele.initPath("EleJs");
	//动态导入JS
	Ele.importJS("views/left.js");
	Ele.importJS("views/top.js");
	Ele.importJS("views/bottom.js");
	Ele.importJS("page/table.js");
	
	Ele.load(function(){
		console.log("ele .load ...");
		var wininner = new Ele.Utils.WinInner();
		var masking = new Ele.Views.Masking();
		masking.view.setContainerById("main");
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
		leftView = new LeftView(wininner.getHeight(), 1);
		
		wininner.addResizeHandler(function(width, height){
			leftView.onWindowResize(height);
		});
		
		topView = new TopView(masking,function(){
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
		new TableView().viewCreate(contentView);
		
		bottomView = new BottomView();
		
		leftView.getView().setContainerById("main");
		topView.getView().setContainerById("main");
		contentView.setContainerById("main");
		bottomView.getView().setContainerById("main");
	});
}

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