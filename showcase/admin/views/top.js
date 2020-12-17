(function(){
	var TopView = window.TopView = function(){
		
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
			menu.add(mn_home);
			menu.add(mn_about);
			
			layout.add(menu);
			
			return layout;
		};
	}
})();