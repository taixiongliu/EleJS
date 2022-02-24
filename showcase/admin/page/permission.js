(function(){
	var Permission = window.Permission = function(rootView){
		MainView.call(this, rootView, 10);
		
		Permission.prototype.viewCreate = function(){
			
			//主面板--full
			var board = new Ele.Views.Board(true);
			
			var content = new Ele.Views.FullBoard();
			
			var context = this;
			
			var permissionView = new Ele.Views.PermissionView();
			permissionView.setOnDataSourcesLoad(function(){
				console.log("data load completed.");
				permissionView.setPermission("111000100110100001");
			});
			content.addView(permissionView);
			var buttonView = new Ele.Layout("permission_buttom_view");
			var button = new Ele.Button({text:"确认",onclick:function(){
				console.log(permissionView.getPermission());
			}});
			buttonView.add(button);
			content.addView(buttonView);
			board.addBoard(content);
			
			this.addContentView(board);
			
			//加载权限数据
			permissionView.loadDataSourcesUrl("datasources/permission.json");
		};
		this.viewCreate();
	}
	
	var Super = function (){};
	Super.prototype = MainView.prototype;
	Super.constructor = Permission;
	var sp = new Super();
	sp.constructor = Permission;
	Permission.prototype = sp;
})();