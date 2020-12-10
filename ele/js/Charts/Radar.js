// var radar = new Ele.Charts.Radar();
// var data = [{key:"A",value:85},{key:"B",value:30},{key:"C",value:80},{key:"D",value:45},{key:"E",value:70},{key:"F",value:90}];
// radar.draw(data, 200);
(function(){
	var Radar = Ele.Charts.Radar = function(opts){
		this.eleType = "canvas";
		this.ele;
		this.ctx;
		this.width = 300;//默认宽度
		this.height = 300;//默认高度
		this.background = "#fff";//默认背景
		this.border = "1px #f5f5f5 solid";//默认边框
		this.padding = 70;//默认左右边框距离
		this.numSlot = 4;//一条线上的总节点数
		this.edgeLineColor="#8bbef5";//轮廓线条颜色
		this.edgelineWidth=1;//轮廓线条宽度
		this.textColor="#333";//文本字体颜色
		this.itemColor="#fa8a9d";//节点颜色a0e0a3
		this.itemFillColor="rgba(250,138,157, 0.28)";//节点填充颜色rgba(160,224,163, 0.28)
		this.itemlineWidth=1;//节点线条宽度
		this.itemPointWeight=2;//节点半径
		this.data;
	
		Radar.prototype._init = function(){
			if(typeof(opts) != "object"){
				return ;
			}
			if(typeof(opts.width) == "number"){
				this.width = opts.width;
			}
			if(typeof(opts.height) == "number"){
				this.height = opts.height;
			}
			if(typeof(opts.background) == "string"){
				this.background = opts.background;
			}
			if(typeof(opts.border) == "string"){
				this.border = opts.border;
			}
			if(typeof(opts.padding) == "number"){
				this.padding = opts.padding;
			}
			if(typeof(opts.numSlot) == "number"){
				this.numSlot = opts.numSlot;
			}
			if(typeof(opts.edgeLineColor) == "string"){
				this.edgeLineColor = opts.edgeLineColor;
			}
			if(typeof(opts.edgelineWidth) == "number"){
				this.edgelineWidth = opts.edgelineWidth;
			}
			if(typeof(opts.textColor) == "string"){
				this.textColor = opts.textColor;
			}
			
			if(typeof(opts.itemColor) == "string"){
				this.itemColor = opts.itemColor;
			}
			if(typeof(opts.itemFillColor) == "string"){
				this.itemFillColor = opts.itemFillColor;
			}
			if(typeof(opts.itemlineWidth) == "number"){
				this.itemlineWidth = opts.itemlineWidth;
			}
			if(typeof(opts.itemPointWeight) == "number"){
				this.itemPointWeight = opts.itemPointWeight;
			}
		};
		Radar.prototype._create = function() {
			this._init();
			
			this.ele = document.createElement("canvas");
			
			this.ele.width = this.width;
			this.ele.height = this.height;
			this.ele.style.background = this.background;
			this.ele.style.border = this.border;
			this.ctx = this.ele.getContext("2d");
		};
		
		Radar.prototype.setContainerById = function(id){
			document.getElementById(id).appendChild(this.ele);
		};
	
		//画雷达图
		Radar.prototype.draw = function(data, max){
			if(typeof(data) == "undefined"){
				return ;
			}
			if(typeof(max) != "number"){
				max = 100;
			}
			this.data = data;
			var mCenter = this.width / 2; //中心点
			var mRadius = mCenter - this.padding;
			var numCount = data.length;
			var mAngle = Math.PI * 2 / numCount; //角度
			//调用 
			this.drawRadarEdge(mCenter, numCount, mRadius, mAngle); //边框
			this.drawRadarLinePoint(mCenter, numCount, mRadius, mAngle);//交叉线
			this.drawRadarText(data, mCenter, numCount, mRadius, mAngle);//文本
			this.drawRadarCircle(data, mCenter, numCount, mRadius, mAngle, max)//节点
			this.drawRadarRegion(data, mCenter, numCount, mRadius, mAngle, max)//区域
		};
		
		Radar.prototype.drawRadarRegion = function (mData, mCenter, numCount, mRadius, mAngle, max) {
			this.ctx.beginPath();
			for (var m = 0; m < numCount; m++) {
				var val = mData[m].value;
				if(val > max){
					val = max;
				}
				var x = mCenter + mRadius * Math.cos(mAngle * m) * val / max;
				var y = mCenter + mRadius * Math.sin(mAngle * m) * val / max;
				this.ctx.lineTo(x, y);
			}
			this.ctx.closePath();
			this.ctx.fillStyle = this.itemFillColor;
			this.ctx.fill();
		};
		
		//画雷达值小圆点
		Radar.prototype.drawRadarCircle = function (mData, mCenter, numCount, mRadius, mAngle, max) {
			for (var i = 0; i < numCount; i++) {
				var val = mData[i].value;
				if(val > max){
					val = max;
				}
				var x = mCenter + mRadius * Math.cos(mAngle * i) * val / max;
				var y = mCenter + mRadius * Math.sin(mAngle * i) * val / max;
				this.ctx.beginPath();
				this.ctx.arc(x, y, this.itemPointWeight, 0, Math.PI * 2);
				this.ctx.fillStyle = this.itemColor; 
				this.ctx.fill();
			}
		};
		
		//画雷达文本
		Radar.prototype.drawRadarText = function (mData, mCenter, numCount, mRadius, mAngle) {
			this.ctx.fillStyle = this.textColor;
		  
			for (var n = 0; n < numCount; n++) {
				var x = mCenter + mRadius * Math.cos(mAngle * n);
				var y = mCenter + mRadius * Math.sin(mAngle * n);
				//通过不同的位置，调整文本的显示位置 
				if (mAngle * n >= 0 && mAngle * n <= Math.PI / 2) {
					this.ctx.fillText(mData[n].key, x + 5, y + 5);
				} else if (mAngle * n > Math.PI / 2 && mAngle * n <= Math.PI) {
					this.ctx.fillText(mData[n].key, x - this.ctx.measureText(mData[n].key).width - 7, y + 5);
				} else if (mAngle * n > Math.PI && mAngle * n <= Math.PI * 3 / 2) {
					this.ctx.fillText(mData[n].key, x - this.ctx.measureText(mData[n].key).width - 5, y);
				} else {
					this.ctx.fillText(mData[n].key, x + 7, y + 2);
				}
			}
		};
		
		//画交叉线
		Radar.prototype.drawRadarLinePoint = function (mCenter, numCount, mRadius, mAngle) {
			var cx = mCenter;
			var cy = mCenter;
			this.ctx.beginPath();
			for (var k = 0; k < numCount; k++) {
				var x = mCenter + mRadius * Math.cos(mAngle * k);
				var y = mCenter + mRadius * Math.sin(mAngle * k);
				this.ctx.moveTo(cx, cy); this.ctx.lineTo(x, y);
			}
			this.ctx.stroke();
		};
		
		//画边框形状
		Radar.prototype.drawRadarEdge = function (mCenter, numCount, mRadius, mAngle) {
			this.ctx.strokeStyle = this.edgeLineColor;
			this.ctx.lineWidth = this.edgelineWidth;  //设置线宽 
			for (var i = 0; i < this.numSlot; i++) {
				//计算半径 
				this.ctx.beginPath()
				var rdius = mRadius / this.numSlot * (i + 1)
				//画N条线段 
				for (var j = 0; j < numCount; j++) {
					//坐标 
					var x = mCenter + rdius * Math.cos(mAngle * j);
					var y = mCenter + rdius * Math.sin(mAngle * j);
					this.ctx.lineTo(x, y);
				}
				this.ctx.closePath();
				this.ctx.stroke();
			}
		};
		
		this._create();
	}
})();