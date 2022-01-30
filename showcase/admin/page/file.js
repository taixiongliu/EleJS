(function(){
	var File = window.File = function(rootView){
		MainView.call(this, rootView, 9);
		
		File.prototype.viewCreate = function(){
			
			//主面板--full
			var board = new Ele.Views.Board(true);
			
			var content = new Ele.Views.FullBoard();
			
			var context = this;
			
			var fileView = new Ele.Views.FileView({
				groupListUrl:"datasources/group.json",
				fileListUrl:"datasources/file.json",
				groupAddUrl:"datasources/success.json",
				groupDeleteUrl:"datasources/success.json",
				deleteUrl:"datasources/success.json",
				uploadUrl:"datasources/success.json",
				updateUrl:"datasources/success.json"
			});
			//fileView.setTitle("mytitle");
			fileView.setViewHandler(function(type, data){
				console.log("type:"+type);
				console.log(data);
			});
			fileView.setErrorHandler(function(error){
				console.log("error:"+error);
			});
			
			content.addView(fileView);
			board.addBoard(content);
			
			this.addContentView(board);
		};
		this.viewCreate();
	}
	
	var Super = function (){};
	Super.prototype = MainView.prototype;
	Super.constructor = File;
	var sp = new Super();
	sp.constructor = File;
	File.prototype = sp;
})();