(function(){
	var TopView = window.TopView = function(onMenuEvent){
		var layout;
		var bimg;
		
		TopView.prototype._initView = function(){
			//主面板
			layout = new Ele.Layout("admin_top_view");
			
			var bar = new Ele.Layout("admin_top_bar_view");
			bimg = new Ele.Img("img/chevronsLeft.png","admin_top_bar_icon");
			bar.add(bimg);
			bar.ele.onclick = onMenuEvent;
			layout.add(bar);
			
			var menu = new Ele.HLayout("admin_top_menu_view");
			var mn_home = new Ele.MenuLabel({text:"首页",icon:"img/shouye.png",onItemClick:function (isRoot, data){
				window.location.href = "index.html";
			}});
			var mn_about = new Ele.MenuLabel({text:"关于"});
			var mn_case = new Ele.MenuLabel({text:"案例",children:[{text:"案例1"},{text:"案例2"},{text:"案例3"}],windowType:true});
			
			var mn_conct = new Ele.MenuLabel({text:"联系"});
			menu.add(mn_home);
			menu.add(mn_about);
			menu.add(mn_case);
			menu.add(mn_conct);
			layout.add(menu);
			
			var rMenu = new Ele.HLayout("admin_top_right_menu_view");
			var mn_version = new Ele.MenuLabel({text:"版本：V1.0.1",style:"admin_top_right_menu_txt"});
			var mn_account = new Ele.MenuLabel({icon:"img/icon_min_user.png",text:"admin",children:[
				{text:"修改密码",data:"update"},
				{text:"安全退出",data:"exit"}
				],onItemClick:function(isRoot, data){
					if(!isRoot){
						console.log("click "+data);
					}
				},windowType:true});
			//var mn_account = new Ele.IconLabel({icon:"img/huiyuan.png",text:"admin", style:"admin_top_right_icon_menu", focusStyle:"admin_top_right_icon_menu"});
			rMenu.add(mn_account);
			rMenu.add(mn_version);
			layout.add(rMenu);
		};
		
		TopView.prototype.getView = function(){
			return layout;
		};
		TopView.prototype.showClose = function(){
			bimg.ele.src = "img/chevronsLeft.png";
		};
		TopView.prototype.showExpand = function(){
			bimg.ele.src = "img/chevronsRight.png";
		};
		TopView.prototype.setPaddingLeft = function(left){
			layout.ele.style.paddingLeft = left+"px";
		};
		
		this._initView();
	}
})();