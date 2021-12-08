(function(){
	var Media = window.Media = function(rootView){
		MainView.call(this, rootView, 4);
		
		Media.prototype.viewCreate = function(){
			
			//主面板--full
			var board = new Ele.Views.Board(true);
			
			var content = new Ele.Views.FullBoard();
			var context = this;
			
			var layout = new Ele.Layout("media");
			//var divider = new Ele.Layout("media_divider");
			var titleAudia = new Ele.Layout("media_title");
			titleAudia.setHtml("音频");
			var titleVideo = new Ele.Layout("media_title");
			titleVideo.setHtml("视频");
			var audio = new Ele.Audio("media/01.mp3");
			var video = new Ele.Video("media/01.mp3");
			
			layout.add(new Ele.Layout("media_divider"));
			layout.add(titleAudia);
			layout.add(new Ele.Layout("media_divider"));
			layout.add(audio);
			layout.add(new Ele.Layout("media_divider"));
			layout.add(titleVideo);
			layout.add(new Ele.Layout("media_divider"));
			layout.add(video);
			
			content.addView(layout);
			
			board.addBoard(content);
			
			this.addContentView(board);
		};
		this.viewCreate();
	}
	
	var Super = function (){};
	Super.prototype = MainView.prototype;
	Super.constructor = Media;
	var sp = new Super();
	sp.constructor = Media;
	Media.prototype = sp;
})();