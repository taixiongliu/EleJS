window.onload = init;
function init(){
	Ele.initPath("EleJs");
	Ele.load(function(){
		console.log("ele .load ...");
		// var winInner = new Ele.WinInner();
		// alert(winInner.getHeight());
		// winInner.addResizeHandler(function(w,h){
		// 	console.log("onresize2:"+w+"<->"+h);
		// });
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
		
		var ta = new Ele.TextArea();
		var bt = new Ele.Button("中文按钮","green");
		bt.setClickHandler(function(){
			alert(ta.ele.value);
			console.log(ta);
		});
		
		
		var brokenLine = new Ele.BrokenLine({padding:40});
		var nodes = {X:[{text:"AAA",fieldName:"a",offset:20},{text:"B",fieldName:"b",offset:20},{text:"C",fieldName:"c",offset:20},{text:"D",fieldName:"d",offset:20},{text:"E",fieldName:"e",offset:20}],Y:["0","20","40","60","80","100"]};
		var titles = [{id:1,name:"总线",color:"#ff6600"},{id:2,name:"分支线",color:"#41BABD"}];
		var values = [{lineId:1,value:{a:{key:"", value:30},b:{key:"90", value:90},c:{key:"50", value:50},d:{key:"60", value:60},e:{key:"80", value:80}}},
		{lineId:2,value:{a:{key:"", value:20},b:{key:"60", value:60},c:{key:"30", value:30},d:{key:"40", value:40},e:{key:"60", value:60}}}];
		brokenLine.draw(nodes, values);
		
		main.add(ta);
		main.add(bt);
		main.add(brokenLine);
		
		
		
//		var item1 = new Ele.Layout("custom");
//		var item2 = new Ele.Layout("custom");
//		item1.add(new Ele.Label("nice"));
//		item2.add(new Ele.Button("button"));
//		var panel = new Ele.HLayout();
//		panel.add(item1);
//		panel.add(item2,{float:"right"});
//		main.add(panel);
//		main.add(new Ele.Button("中文按钮","green"));
//		var tb =  new Ele.TextBox()
//		main.add(tb);

//		var ajaxload = new Ele.AjaxLoad();
//		ajaxload.show();
		
//		var a = new Ele.Confirm();
//		a.setMsg("Helloween good..");
//		a.setSureHandler(function(){console.log("sure click..")});
//		a.show();

//		var datebox = new Ele.DateBox();
//		datebox.setSelectUpdateHandler(function(){
//			var selectdate = datebox.getSelectDateString();
//			console.log("selected:"+selectdate);
//		})
//		datebox.showBelowLeft(tb.ele);
		
//		var il_updpass = new Ele.IconLabel({focusStyle:"top_icon_label_focus",textStyle:"info_name",icon:"img/tab.png",text:"修改密码",onclick:function(){}});
//		main.add(il_updpass);

		// var dg = new Ele.ListGrid({selectOpr:{},operations:{width:'120px',menus:[{text:'修改',onclick:function(data){
		// 	alert(data);
		// }},{text:'删除',format:function(data){
		// 	if(data.id==4 || data.id==8){
		// 		return false;
		// 	}
		// 	return true;
		// },onclick:function(data){
		// 	console.log(dg.getSelect());
			
		// }}]},fields:[{textName:"编号",fieldName:"id",fieldWidth:"50%"},{textName:"名称",fieldName:"name",fieldWidth:"50%"}]});
		// dg.addRow({id:1,name:"ltx"});
		// dg.addRow({id:"2",name:"nice"});
		// for(var i = 0; i < 10; i ++){
		// 	dg.addRow({id:i+3,name:"data"+i});
		// }
		// main.add(dg);
		
//		var tree = new Ele.TreeNode({"title":"菜单","icon":"img/icon_menuitem.png"});
//		tree.add({"text":"2菜单","icon":"img/icon_menuitem.png"});
//		main.add(tree);
		
		// var menuList = new Ele.MenuList({onItemClick:function(obj){
		// 	console.log(obj);
		// }});
		// menuList.title.setText("我是菜单");
		// menuList.add({
		// 	title:"用户管理",
		// 	icon:"img/icon_menuitem.png",
		// 	expend:true,
		// 	children:[
		// 	{id:1,text:"用户列表",icon:"img/icon_menuitem.png"},{id:2,text:"用户列表",icon:"img/icon_menuitem.png",selected:true},{id:3,text:"用户列表",icon:"img/icon_menuitem.png"}]
		// });
		// menuList.add({
		// 	title:"用户管理",
		// 	icon:"img/icon_menuitem.png",
		// 	children:[
		// 	{id:1,text:"用户列表",icon:"img/icon_menuitem.png"},{id:2,text:"用户列表",icon:"img/icon_menuitem.png"},{id:3,text:"用户列表",icon:"img/icon_menuitem.png"}]
		// });
		// main.add(menuList);

		// var pop = new Ele.PopWindow();
		// pop.setTitle("操作窗口");
		// pop.show();
		
	});
}