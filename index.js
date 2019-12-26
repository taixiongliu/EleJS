window.onload = init;
function init(){
	Ele.load(["Layout"],function(){
		console.log("ele .load ...");
		//创建一个面板
		var main = new Ele.Layout();
		console.log(main.ele);//dom对象
		console.log(main.eleType);//dom对象类型
		//可对原生对象操作
		main.ele.className = "custom";
		main.ele.innerHTML = "hello world!";
		var body = document.getElementsByTagName('body')[0];
		//设置面板添加的dom容器
		main.setParentContainer(body);
	});
}