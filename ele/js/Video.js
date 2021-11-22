(function(){
	var Video = Ele.Video = function(url, width, height){
		this.eleType = "video";
		this.ele;
		
		Video.prototype._init = function(){
			if(typeof(width) != "number"){
				width = 320;
			}
			if(typeof(height) != "number"){
				height = 240;
			}
			this.ele = document.createElement("video");
			this.ele.src = url;
			this.ele.className = "ele_video";
			this.ele.setAttribute("width", width);
			this.ele.setAttribute("height", height);
			this.ele.setAttribute("controls", "controls");
			this.ele.innerHTML = "您的浏览器不支持视频组件";
		};
		this._init();
	};
})();
