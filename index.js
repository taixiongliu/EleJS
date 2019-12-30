window.onload = init;
function init(){
	Ele.load(function(){
		console.log("ele .load ...");
		//创建一个面板
		var main = new Ele.Layout();
		console.log(main.ele);//dom对象
		console.log(main.eleType);//dom对象类型
		//可对原生对象操作
//		main.ele.className = "custom";
//		main.setHtml("hello world!");
		var body = document.getElementsByTagName('body')[0];
		//设置面板添加的dom容器
		main.setContainer(body);
		
		var item1 = new Ele.Layout("custom");
		var item2 = new Ele.Layout("custom");
		item1.add(new Ele.Label("nice"));
		item2.add(new Ele.Button("button"));
		var panel = new Ele.HLayout();
		panel.add(item1);
		panel.add(item2,{float:"right"});
		main.add(panel);
		main.add(new Ele.Button("中文按钮","green"));
		var tb =  new Ele.TextBox()
		main.add(tb);

//		var ajaxload = new Ele.AjaxLoad();
//		ajaxload.show();
		
//		var a = new Ele.Confirm();
//		a.setMsg("Helloween good..");
//		a.setSureHandler(function(){console.log("sure click..")});
//		a.show();

		var datebox = new Ele.DateBox();
		datebox.setSelectUpdateHandler(function(){
			var selectdate = datebox.getSelectDateString();
			console.log("selected:"+selectdate);
		})
		datebox.showBelowLeft(tb.ele);
	});
}