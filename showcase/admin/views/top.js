(function(){
	var TopView = window.TopView = function(masking){
		
		TopView.prototype.initView = function(){
			//主面板
			var layout = new Ele.Layout("admin_top_view");
			
			var bar = new Ele.Layout("admin_top_bar_view");
			var bimg = new Ele.Img("img/huiyuan.png","admin_top_bar_icon");
			bar.add(bimg);
			layout.add(bar);
			
			var menu = new Ele.HLayout("admin_top_menu_view");
			var mn_home = new Ele.MenuLabel({text:"首页"});
			var mn_about = new Ele.MenuLabel({text:"关于"});
			var mn_case = new Ele.MenuLabel({text:"案例",children:[{text:"案例1",onItemClick:function(res){
				console.log(res);
			},data:{id:2,name:"child"}},{text:"案例2",onItemClick:function(res){
				console.log(res);
			},data:{id:3,name:"child"}}],masking:masking,onItemClick:function(res){
				console.log(res);
			},data:{id:1,name:"root"}});
			var mn_conct = new Ele.MenuLabel({text:"联系"});
			menu.add(mn_home);
			menu.add(mn_about);
			menu.add(mn_case);
			menu.add(mn_conct);
			layout.add(menu);
			
			var rMenu = new Ele.HLayout("admin_top_right_menu_view");
			var mn_version = new Ele.MenuLabel({text:"版本：V1.0.1",style:"admin_top_right_menu_txt"});
			var mn_account = new Ele.MenuLabel({icon:"img/icon_user.png",text:"admin"});
			//var mn_account = new Ele.IconLabel({icon:"img/huiyuan.png",text:"admin", style:"admin_top_right_icon_menu", focusStyle:"admin_top_right_icon_menu"});
			rMenu.add(mn_account);
			rMenu.add(mn_version);
			layout.add(rMenu);
			
			return layout;
		};
	}
})();