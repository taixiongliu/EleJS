window.onload = init;
function init(){
	Ele.load(["Layout","AjaxLoad","Img"],function(){
		console.log("ele .load ...");
		//创建一个面板
		var main = new Ele.Layout();
		console.log(main.ele);//dom对象
		console.log(main.eleType);//dom对象类型
		//可对原生对象操作
		main.ele.className = "custom";
		main.setHtml("hello world!");
		var body = document.getElementsByTagName('body')[0];
		//设置面板添加的dom容器
		main.setContainer(body);
		
//		var item1 = new Ele.Layout("custom");
//		var item2 = new Ele.Layout("custom");
//		item1.setHtml("1");
//		item2.setHtml("2");
//		var panel = new Ele.HLayout();
//		panel.add(item1);
//		panel.add(item2,{float:"right"});
//		main.add(panel);

//		var ajaxload = new Ele.AjaxLoad();
//		ajaxload.setMsg("数据加载中...");
//		ajaxload.show();
	});
}