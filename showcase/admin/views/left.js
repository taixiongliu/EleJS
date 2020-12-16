(function(){
	var LeftView = window.LeftView = function(height){
		this.menu;
		
		LeftView.prototype.initView = function(){
			//主面板
			var layout = new Ele.Layout("admin_left_view");
			
			//顶部布局
			var top = new Ele.VLayout("admin_left_top");
			var logo = new Ele.Img("img/login_logo.png","admin_logo");
			top.add(logo,{align:"center"});
			var name = new Ele.Label("张富贵","admin_name");
			top.add(name,{align:"center",padding:"4px 0 0 0"});
			var position = new Ele.Label("超级管理员","admin_position");
			top.add(position,{align:"center"});
			layout.add(top);
			
			//菜单布局
			this.menu = new Ele.MenuList();
			this.menu.ele.style.height = (height - 180-16)+"px";
			var node1 = {icon:"img/gonggao.png",title:"主菜单1",expend:true, children:[
				{icon:"img/gonggao.png",text:"二级菜单A",selected:true,id:1},
				{icon:"img/gonggao.png",text:"二级菜单B"},
				{icon:"img/gonggao.png",text:"二级菜单C"},
				{icon:"img/gonggao.png",text:"二级菜单D"},
				{icon:"img/gonggao.png",text:"二级菜单E"},
				]};
			var node2 = {icon:"img/huiyuan.png",title:"主菜单2", children:[
				{icon:"img/gonggao.png",text:"二级菜单A"},
				{icon:"img/gonggao.png",text:"二级菜单B"},
				{icon:"img/gonggao.png",text:"二级菜单C"},
				{icon:"img/gonggao.png",text:"二级菜单D"},
				]};
			var node3 = {icon:"img/shoucang.png",title:"主菜单3"};
			
			this.menu.add(node1);
			this.menu.add(node2);
			this.menu.add(node3);
			layout.add(this.menu);
			
			return layout;
		};
		
		LeftView.prototype.onWindowResize = function(height){
			this.menu.ele.style.height = (height - 180-16)+"px";
		};
	}
})();