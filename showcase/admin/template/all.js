(function(){
	var BottomView = window.BottomView = function(masking,onMenuEvent){
		var layout;
		
		BottomView.prototype._initView = function(){
			//主面板
			layout = new Ele.Layout("admin-bottom-view border-box");
			layout.setHtml("© www.xxxxxxxxx.com - xxxx科技有限公司");
		};
		
		BottomView.prototype.getView = function(){
			return layout;
		};
		BottomView.prototype.setPaddingLeft = function(left){
			layout.ele.style.paddingLeft = left+"px";
		};
		
		this._initView();
	}
})();
(function(){
	var LeftView = window.LeftView = function(height, mi){
		var layout;
		var menu;
		
		LeftView.prototype._initView = function(){
			if(typeof(mi) != "number"){
				mi = 0;
			}
			//主面板
			layout = new Ele.Layout("admin-left-view");
			
			//顶部布局
			var top = new Ele.VLayout("admin-left-top");
			var logo = new Ele.Img(Ele.getSkinName()+"/img/avatar.png","admin-logo");
			top.add(logo,{align:"center"});
			var name = new Ele.Label("张富贵","admin-name");
			top.add(name,{align:"center",padding:"4px 0 0 0"});
			var role = new Ele.Label("超级管理员","admin-role");
			top.add(role,{align:"center"});
			layout.add(top);
			
			//菜单布局
			//menu.ele.style.height = (height - 180-16)+"px";
			menu = new Ele.Views.TreeMenuView({heightPx:height-196,
				onItemClick:function(res){
					console.log(res);
					if(res.id > 0 && res.id != mi){
						window.location.href = res.href;
					}
				},
				selectFormat:function(child){
					if(child.id == mi){
						return true;
					}
					return false;
				},
				dataFormat:function(row, isRoot){
					if(typeof(row.icon) != "undefined"){
						row.icon = Ele.getSkinName()+"/"+row.icon;
					}
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
			
			var btnPanel = new Ele.HLayout("form-button-panel");
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
			btnPanel.add(reset, {padding:"0 0 0 178px"});
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
							// root.confirm("确认要退出吗？",function(){
							// 	//EXIT
							// });
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

(function(){
	var MainView = window.MainView = function(rootView, mi){
		this.leftView;
		this.topView;
		this.contentView;
		this.bottomView;
		this.menuExpand = true;
		this.left = 0;
		this._alert;
		this._ajaxLoad;
		this._confirm;
		
		MainView.prototype.close = function(context){
			if(context.left <= -240){
				return false;
			}
			context.left -= 24;
			context.leftView.setLeft(context.left);
			
			var pleft = context.left + 240;
			context.topView.setPaddingLeft(pleft);
			context.bottomView.setPaddingLeft(pleft);
			context.contentView.ele.style.paddingLeft = pleft+"px";
			return true;
		};
		MainView.prototype.expand = function(context){
			if(context.left >= 0){
				return false;
			}
			context.left += 24;
			context.leftView.setLeft(context.left);
			var pleft = context.left + 240;
			context.topView.setPaddingLeft(pleft);
			context.bottomView.setPaddingLeft(pleft);
			context.contentView.ele.style.paddingLeft = pleft+"px";
			return true;
		};
		MainView.prototype.alert = function(msg){
			this._alert.setMsg(msg);
			this._alert.show();
		};
		MainView.prototype.confirm = function(msg, sureFunction){
			this._confirm.setMsg(msg);
			this._confirm.setSureHandler(sureFunction);
			this._confirm.show();
		};
		MainView.prototype.showLoad = function(){
			this._ajaxLoad.show();
		};
		MainView.prototype.hideLoad = function(){
			this._ajaxLoad.hide();
		};
		
		MainView.prototype._init = function(){
			var context = this;
			
			var wininner = new Ele.Utils.WinInner();
			this._alert = new Ele.Alert();
			this._ajaxLoad = new Ele.AjaxLoad();
			this._confirm = new Ele.Confirm();
			
			
			var closeTimer = new Ele.Utils.Timer(context.close);
			closeTimer.setData(context);
			var expandTimer = new Ele.Utils.Timer(context.expand);
			expandTimer.setData(context);
			//创建一个面板
			context.leftView = new LeftView(wininner.getHeight(), mi);
			
			wininner.addResizeHandler(function(width, height){
				context.leftView.onWindowResize(height);
			});
			
			context.topView = new TopView(function(){
				if(context.menuExpand){
					context.topView.showExpand();
					closeTimer.execute();
				}else{
					context.topView.showClose();
					expandTimer.execute();
				}
				context.menuExpand = !context.menuExpand;
			});
			
			context.contentView = new Ele.Layout("admin-content-view border-box");
			
			context.bottomView = new BottomView();
			
			rootView.add(this._alert);
			rootView.add(this._ajaxLoad);
			rootView.add(this._confirm);
			rootView.add(context.leftView.getView());
			rootView.add(context.topView.getView());
			rootView.add(context.contentView);
			rootView.add(context.bottomView.getView());
		};
		
		MainView.prototype.addContentView = function(view){
			this.contentView.add(view);
		};
		
		this._init();
	}

})();