window.onload = init;
function init(){
	//ELE 不在根目录时设置前缀路径
	Ele.initPath("EleJs");
	//动态导入JS
	Ele.importJS("views/left.js");
	Ele.importJS("views/top.js");
	Ele.load(function(){
		console.log("ele .load ...");
		var wininner = new Ele.Utils.WinInner();
		//创建一个面板
		var leftView = new LeftView(wininner.getHeight());
		
		wininner.addResizeHandler(function(width, height){
			leftView.onWindowResize(height);
		});
		
		var topView = new TopView();
		
		
		leftView.initView().setContainerById("main");
		topView.initView().setContainerById("main");
	});
}