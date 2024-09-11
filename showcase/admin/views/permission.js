var program = window.program = {viewLoad:function(){}};
program.viewLoad = viewload;
function viewload(view){
	//主面板--full
	var board = new Ele.Views.Board(true);
	
	var content = new Ele.Views.FullBoard();
	
	var context = this;
	
	var permissionView = new Ele.Views.ClusterCheckBoxView();
	permissionView.setOnDataSourcesLoad(function(){
		console.log("data load completed.");
		// permissionView.setPermission("111000100110100001");
		//数据源的value 是整型
		permissionView.setValues("1,2,6,8,9,15",function(value){
			return parseInt(value);
		});
	});
	content.addView(permissionView);
	var buttonView = new Ele.Layout("permission_buttom_view");
	var button = new Ele.Button({text:"确认",onclick:function(){
		console.log(permissionView.getPermission());
		console.log(permissionView.getValues());
	}});
	buttonView.add(button);
	content.addView(buttonView);
	board.addBoard(content);
	
	view.addContentView(board);
	
	//加载权限数据
	permissionView.loadDataSourcesUrl("datasources/permission.json");
}