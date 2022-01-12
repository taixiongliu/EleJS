(function(){
	var Step = window.Step = function(rootView){
		MainView.call(this, rootView, 7);
		
		Step.prototype.viewCreate = function(){
			
			//主面板--full
			var board = new Ele.Views.Board(true);
			
			var content = new Ele.Views.FullBoard();
			var context = this;
			
			var layout = new Ele.Layout("step");
			
			var step = ["验证","设置","安装","完成"];
			var stepView = new Ele.Views.StepView(step);
			stepView.setStep(2);
			layout.add(stepView);
			
			content.addView(layout);
			
			board.addBoard(content);
			
			this.addContentView(board);
		};
		this.viewCreate();
	}
	
	var Super = function (){};
	Super.prototype = MainView.prototype;
	Super.constructor = Step;
	var sp = new Super();
	sp.constructor = Step;
	Step.prototype = sp;
})();