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
	
	var EmptyBoard = Ele.Views.EmptyBoard = function(){
		this.eleType = "layout";
		this.ele;
		this.view;
		this.board;
		
		EmptyBoard.prototype._init = function(){
			this.view = new Ele.Layout("ele_empty_board");
			this.board = new Ele.Layout("ele_board_view");
			this.ele = this.view.ele;
			this.view.add(this.board);
		};
		EmptyBoard.prototype.addBoard = function(bview){
			this.board.add(bview);
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
			var board = new EmptyBoard();
			this.view = board.view;
			this.ele = this.view.ele;
			this._leftView = new Ele.Layout("ele_fl");
			this._rightView = new Ele.Layout("ele_fr");
			var cl = new Ele.Layout("ele_cl");
			
			board.addBoard(this._leftView);
			board.addBoard(this._rightView);
			board.addBoard(cl);
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
	
	/**
	 * 合并面板
	 */
	var MergeBoard = Ele.Views.MergeBoard = function(){
		this.eleType = "layout";
		this.ele;
		this.view;
		this.leftBoard;
		this.centerBoard;
		this.rightBoard;
		this._leftView;
		this._centerView;
		this._rightView;
		
		MergeBoard.prototype._init = function(){
			this.view = new Ele.Layout("ele_merge_board");
			this.leftBoard = new Ele.Layout("ele_merge_left_board");
			this.centerBoard = new Ele.Layout("ele_merge_center_board");
			this.rightBoard = new Ele.Layout("ele_merge_right_board");
			this.ele = this.view.ele;
			this.view.add(this.leftBoard);
			this.view.add(this.centerBoard);
			this.view.add(this.rightBoard);
			var cl = new Ele.Layout("ele_cl");
			this.view.add(cl);
			
			this._leftView = new Ele.Layout("ele_board_view");
			this._centerView = new Ele.Layout("ele_board_view");
			this._rightView = new Ele.Layout("ele_board_view");
			
			
			this.leftBoard.add(this._leftView);
			this.centerBoard.add(this._centerView);
			this.rightBoard.add(this._rightView);
		};
		MergeBoard.prototype.setLeft = function(leftView){
			this._leftView.clear();
			this._leftView.add(leftView);
		};
		MergeBoard.prototype.setCenter = function(centerView){
			this._centerView.clear();
			this._centerView.add(centerView);
		};
		MergeBoard.prototype.setRight = function(rightView){
			this._rightView.clear();
			this._rightView.add(rightView);
		};
		
		this._init();
	};
	
	/**
	 * 横向直线面板
	 */
	var HLineBoard = Ele.Views.HLineBoard = function(){
		this.eleType = "layout";
		this.ele;
		this.view;
		this.boards = [];
		this._cl;
		this._pc_default = 50;
		
		HLineBoard.prototype._init = function(){
			this.view = new Ele.Layout("ele_h_line_board");
			this.ele = this.view.ele;
			this._cl = new Ele.Layout("ele_cl");
			this.view.add(this._cl);
		};
		HLineBoard.prototype.add = function(bview,percent){
			if(typeof(bview) != "object"){
				throw "method parameter 'bview' of add can't be empty.";
				return;
			}
			var pc = this._pc_default;
			if(typeof(percent) == "number"){
				pc = percent;
				if(pc < 0){
					pc = 0;
				}
				if(pc > 100){
					pc = 100;
				}
			}
			var board = new Ele.Layout("ele_h_line_content_board");
			board.ele.style.width = pc+"%";
			var view = new Ele.Layout("ele_board_view");
			board.add(view);
			view.add(bview);
			this.view.add(board);
		};
		
		this._init();
	};
	
})();
