(function(){
	var Board = Ele.Views.Board = function() {
		this.eleType = "layout";
		this.ele;
		this.view;
		
		Board.prototype._init = function(){
			this.view = new Ele.Layout("ele_board");
			this.ele = this.view.ele;
		};
		
		Board.prototype.add = function(bview){
			this.view.add(bview);
		};
		
		this._init();
	};
	
	/**
	 * 两级化看板
	 */
	var EdgeBoard = Ele.Views.EdgeBoard = function(){
		this.eleType = "layout";
		this.ele;
		this.view;
		this._leftView;
		this._rightView;
		
		EdgeBoard.prototype._init = function(){
			this.view = new Ele.Layout("ele_edge_board");
			this.ele = this.view.ele;
			var panel = new Ele.Layout("ele_edge_board_view");
			this._leftView = new Ele.Layout("ele_fl");
			this._rightView = new Ele.Layout("ele_fr");
			var cl = new Ele.Layout("ele_cl");
			
			panel.add(this._leftView);
			panel.add(this._rightView);
			panel.add(cl);
			
			this.view.add(panel);
		};
		EdgeBoard.prototype.setLeft = function(leftView){
			this._leftView.clear();
			this._leftView.add(leftView);
		};
		EdgeBoard.prototype.setRight = function(rightView){
			this._rightView.clear();
			this._rightView.add(rightView);
		};
		
		this._init();
	};
	
})();
