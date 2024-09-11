var program = window.program = {viewLoad:function(){}};
program.viewLoad = viewload;
function viewload(view){
	//主面板--full
	var board = new Ele.Views.Board(true);
	
	var content = new Ele.Views.FullBoard();
	
	var context = this;
	
	var layout = new Ele.Layout("layout border-box");
	//var divider = new Ele.Layout("media_divider");
	var titleNav = new Ele.Layout("line-title border-box");
	titleNav.setHtml("菜单导航");
	
	var menu = new Ele.HLayout("line-view-64");
	var menu1 = new Ele.MenuLabel({text:"菜单1"});
	var menu2 = new Ele.MenuLabel({text:"菜单2",children:[
		{text:"二级菜单1",data:{id:1,name:"child1"}},
		{text:"二级菜单2",data:{id:2,name:"child2"}},
		{text:"二级菜单3",data:{id:3,name:"child3"}}]
	,onItemClick:function(isRoot, data){
		console.log(isRoot?"root:"+data.name:"child:"+data.name);
	},data:{id:0,name:"root"}});
	var menu3 = new Ele.MenuLabel({text:"菜单3"});
	//menu2.setWindowOffset(new Ele.Utils.Size(20,0));
	
	menu.add(menu1);
	menu.add(menu2);
	menu.add(menu3);
	
	layout.add(new Ele.Layout("divider"));
	layout.add(titleNav);
	layout.add(new Ele.Layout("divider"));
	layout.add(menu);
	
	content.addView(layout);
	
	board.addBoard(content);
	
	view.addContentView(board);
}