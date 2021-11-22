(function(){
	var Audio = Ele.Audio = function(url){
		this.eleType = "audio";
		this.ele;
		
		Audio.prototype._init = function(){
			this.ele = document.createElement("audio");
			this.ele.src = url;
			this.ele.className = "ele_audio";
			this.ele.setAttribute("controls", "controls");
			this.ele.innerHTML = "您的浏览器不支持音频组件";
		};
		this._init();
	};
})();
