(function(){
	var MainView = window.MainView = function(){
		
		MainView.prototype.viewCreate = function(root){
			//主面板
			var layout = new Ele.Layout("hello");
			layout.setAlign("center");
			layout.setHtml("hello word.");
			
			root.add(layout);
		};
	}
})();