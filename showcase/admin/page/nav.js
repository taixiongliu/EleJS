(function(){
	var Nav = window.Nav = function(rootView){
		MainView.call(this, rootView, 1);
		
		Nav.prototype.viewCreate = function(){
			
			//主面板--full
			var board = new Ele.Views.Board(true);
			
			var content = new Ele.Views.FullBoard();
			
			var context = this;
			
			var layout = new Ele.Layout("nav");
			//var divider = new Ele.Layout("media_divider");
			var titleNav = new Ele.Layout("nav_title");
			titleNav.setHtml("菜单导航");
			
			var menu = new Ele.HLayout("nav_menu_view");
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
			
			layout.add(new Ele.Layout("nav_divider"));
			layout.add(titleNav);
			layout.add(new Ele.Layout("nav_divider"));
			layout.add(menu);
			
			content.addView(layout);
			
			board.addBoard(content);
			
			this.addContentView(board);
		};
		this.viewCreate();
	}
	
	var Super = function (){};
	Super.prototype = MainView.prototype;
	Super.constructor = Nav;
	var sp = new Super();
	sp.constructor = Nav;
	Nav.prototype = sp;
})();