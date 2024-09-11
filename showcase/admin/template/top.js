(function(){
	var TopView = window.TopView = function(onMenuEvent){
		var layout;
		var bimg;
		var popwindow;
		
		TopView.prototype._initView = function(){
			//修改密码窗口//form最小宽度614
			popwindow = new Ele.PopWindow(614, 300);
			popwindow.setTitle("修改密码");
			var form = new Ele.Layout("form-content border-box");
			formView = new Ele.Views.FormView("resetPass");
			var passwordItem = new Ele.Views.TextBoxItem({
				name:"oldpass",
				password:true,
				text:"原密码",
				hint:"请输入原密码"
			});
			passwordItem.validateNotEmpty();
			var newpassItem = new Ele.Views.TextBoxItem({
				name:"newpass",
				password:true,
				text:"新密码",
				hint:"请输入新密码"
			});
			newpassItem.validateNotEmpty();
			newpassItem.validateLimit(6,22);
			var repassItem = new Ele.Views.TextBoxItem({
				name:"repass",
				password:true,
				text:"确认密码",
				hint:"请再次输入新密码"
			});
			repassItem.validateNotEmpty();
			formView.addItem(passwordItem);
			formView.addItem(newpassItem);
			formView.addItem(repassItem);
			
			form.add(formView);
			
			var btnPanel = new Ele.HLayout("form-button-panel border-box");
			var reset = new Ele.Button({
				text:"重置",
				icon:Ele._pathPrefix+"ele/"+Ele.getSkinName()+"/assets/64/icon_reset.png",
				onclick:function(){
					formView.reset();
				}
			});
			var submit = new Ele.Button({
				text:"提交",
				icon:Ele._pathPrefix+"ele/"+Ele.getSkinName()+"/assets/64/icon_submit.png",
				onclick:function(){
					if(!formView.validate()){
						return ;
					}
					popwindow.hide();
					// if(newpassItem.getValue() != repassItem.getValue()){
					// 	root.alert("两次密码输入不一致");
					// 	return ;
					// }
					// formView.submitAjax(function(result){
					// 	var res = JSON.parse(result);
					// 	if(res.resCode != 1000){
					// 		root.alert(res.resMsg+",code:"+res.resCode);
					// 		return ;
					// 	}
					// 	popwindow.hide();
					// 	window.location.replace('login');
					// });
				}
			});
			btnPanel.add(reset);
			btnPanel.add(submit, {padding:"0 0 0 16px"});
			form.add(btnPanel);
			
			popwindow.addView(form);
			//主面板
			layout = new Ele.Layout("admin-top-view border-box");
			
			var bar = new Ele.Layout("admin-top-bar-view");
			bimg = new Ele.Img(Ele.getSkinName()+"/icon/fold.png","admin-top-bar-icon");
			bar.add(bimg);
			bar.ele.onclick = onMenuEvent;
			layout.add(bar);
			
			var menu = new Ele.HLayout("admin-top-menu-view");
			var mn_home = new Ele.MenuLabel({text:"首页",icon:Ele.getSkinName()+"/img/home.png",onItemClick:function (isRoot, data){
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
			
			var rMenu = new Ele.HLayout("admin-top-right-menu-view");
			var mn_version = new Ele.MenuLabel({text:"版本：V1.0.1",style:"admin-top-right-menu-txt"});
			var mn_account = new Ele.MenuLabel({icon:Ele.getSkinName()+"/img/user-mini.png",text:"admin",children:[
				{text:"修改密码",data:"update"},
				{text:"安全退出",data:"exit"}
				],onItemClick:function(isRoot, data){
					if(!isRoot){
						if(data == "update"){
							formView.reset();
							popwindow.show();
							return ;
						}
						if(data == "exit"){
							root.confirm("确认要退出吗？",function(){
								//EXIT
							});
							return ;
						}
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
			bimg.ele.src = Ele.getSkinName()+"/icon/fold.png";
		};
		TopView.prototype.showExpand = function(){
			bimg.ele.src = Ele.getSkinName()+"/icon/expand.png";
		};
		TopView.prototype.setPaddingLeft = function(left){
			layout.ele.style.paddingLeft = left+"px";
		};
		
		this._initView();
	}
})();