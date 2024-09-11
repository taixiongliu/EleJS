var program = window.program = {viewLoad:function(){}};
program.viewLoad = viewload;
function viewload(view){
	//主面板--full
	var board = new Ele.Views.Board(true);
	
	var content = new Ele.Views.FullBoard();
	var context = this;
	
	var layout = new Ele.Layout("layout border-box");
	//var divider = new Ele.Layout("media_divider");
	var titleAudia = new Ele.Layout("line-title border-box");
	titleAudia.setHtml("音频");
	var titleVideo = new Ele.Layout("line-title border-box");
	titleVideo.setHtml("视频");
	var audio = new Ele.Audio("media/01.mp3");
	var video = new Ele.Video("media/01.mp3");
	
	layout.add(new Ele.Layout("divider"));
	layout.add(titleAudia);
	layout.add(new Ele.Layout("divider"));
	layout.add(audio);
	layout.add(new Ele.Layout("divider"));
	layout.add(titleVideo);
	layout.add(new Ele.Layout("divider"));
	layout.add(video);
	
	content.addView(layout);
	
	board.addBoard(content);
	
	view.addContentView(board);
}