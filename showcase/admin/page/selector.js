(function(){
	var Selector = window.Selector = function(rootView){
		MainView.call(this,rootView,12);
		
		Selector.prototype.viewCreate = function(){
			//主面板--full
			var board = new Ele.Views.Board(true);
			
			var content = new Ele.Views.FullBoard();
			var context = this;
			
			var listSelectorView = new Ele.Views.ListSelectorView();
			listSelectorView.setOnDataLoad(function(){
				//listSelectorView.setValues([2,3]);
				listSelectorView.setStringValues("2,3", function(value){
					return parseInt(value);
				});
			});
			listSelectorView.setOnUpdate(function(e){
				console.log(e);
			});
			listSelectorView.loadDataSourcesUrl("datasources/listselector.json", function(error){
				alert(error.resMsg+",code:"+error.resCode);
			});
			var btn = new Ele.Button({text:"选择",onclick:function(){
				var values = listSelectorView.getSelectedStringValues();
				console.log(values);
			}})
			content.addView(listSelectorView);
			content.addView(btn);
			
			board.addBoard(content);
			
			this.addContentView(board);
		};
		
		this.viewCreate();
	}
	
	var Super = function (){};
	Super.prototype = MainView.prototype;
	Super.constructor = Selector;
	var sp = new Super();
	sp.constructor = Selector;
	Selector.prototype = sp;
	
})();