(function(){
	var LeftView = window.LeftView = function(height, mi){
		var layout;
		var menu;
		
		LeftView.prototype._initView = function(){
			if(typeof(mi) != "number"){
				mi = 0;
			}
			//主面板
			layout = new Ele.Layout("admin_left_view");
			
			//顶部布局
			var top = new Ele.VLayout("admin_left_top");
			var logo = new Ele.Img("img/icon_user.png","admin_logo");
			top.add(logo,{align:"center"});
			var name = new Ele.Label("张富贵","admin_name");
			top.add(name,{align:"center",padding:"4px 0 0 0"});
			var role = new Ele.Label("超级管理员","admin_role");
			top.add(role,{align:"center"});
			layout.add(top);
			
			//菜单布局
			//menu.ele.style.height = (height - 180-16)+"px";
			menu = new Ele.Views.TreeMenuView({heightPx:height-196,
				onItemClick:function(res){
					console.log(res);
					if(res.id > 0){
						window.location.href = res.href;
					}
				},
				expendFormat:function(root){
					if(root.id == "03"){
						return false;
					}
					return true;
				},
				selectFormat:function(child){
					if(child.id == mi){
						return true;
					}
					return false;
				}
				});
			menu.setTitle("系统菜单");
			// var node1 = {title:"看板组件",expend:true, children:[
			// 	{text:"表格看板",selected:mi==1,data:{id:1,name:"2-1",href:"table.html"}},
			// 	{icon:"img/gonggao.png",text:"二级菜单B",data:{id:2,name:"2-2"}},
			// 	{icon:"img/gonggao.png",text:"二级菜单C"},
			// 	{icon:"img/gonggao.png",text:"二级菜单D",selected:true,data:{id:4,name:"2-4"}},
			// 	{icon:"img/gonggao.png",text:"二级菜单E"},
			// 	]};
			// var node2 = {icon:"img/huiyuan.png",title:"主菜单2", children:[
			// 	{icon:"img/gonggao.png",text:"二级菜单A"},
			// 	{icon:"img/gonggao.png",text:"二级菜单B"},
			// 	{icon:"img/gonggao.png",text:"二级菜单C"},
			// 	{icon:"img/gonggao.png",text:"二级菜单D"},
			// 	]};
			// var node3 = {icon:"img/shoucang.png",title:"主菜单3"};
			
			// menu.add(node1);
			// menu.add(node2);
			// menu.add(node3);
			//menu.loadDataSources([node1,node2,node3]);
			
			menu.loadDataSourcesUrl("datasources/menu.json");
			
			
			layout.add(menu);
		};
		
		LeftView.prototype.onWindowResize = function(height){
			//menu.ele.style.height = (height - 180-16)+"px";
			menu.fillHeight(height-196);
		};
		LeftView.prototype.getView = function(){
			return layout;
		};
		LeftView.prototype.setLeft = function(left){
			layout.ele.style.left = left+"px";
		};
		this._initView();
	}
})();