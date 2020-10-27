// var brokenLine = new Ele.BrokenLine({padding:40});
// var nodes = {X:[{text:"AAA",fieldName:"a",offset:20},{text:"B",fieldName:"b",offset:20},{text:"C",fieldName:"c",offset:20},{text:"D",fieldName:"d",offset:20},{text:"E",fieldName:"e",offset:20}],Y:["0","20","40","60","80","100"]};
// var titles = [{id:1,name:"总线",color:"#ff6600"},{id:2,name:"分支线",color:"#41BABD"}];
// var values = [{lineId:1,value:{a:{key:"", value:30},b:{key:"90", value:90},c:{key:"50", value:50},d:{key:"60", value:60},e:{key:"80", value:80}}},
// {lineId:2,value:{a:{key:"", value:20},b:{key:"60", value:60},c:{key:"30", value:30},d:{key:"40", value:40},e:{key:"60", value:60}}}];
// brokenLine.draw(nodes, values);
(function() {
	var BrokenLine = Ele.BrokenLine = function(opts) {
		this.eleType = "canvas";
		this.ele;
		this.ctx;
		this.width = 750; //默认宽度
		this.height = 300; //默认高度
		this.background = "#fff"; //默认背景
		this.border = "1px #f5f5f5 solid"; //默认边框
		this.padding = 20; //四周边距
		this.edgeLineColor = "#3898C8"; //轮廓线条颜色
		this.edgeLineHintColor = "rgba(139,190,245, 0.28)"; //轮廓线条颜色
		this.edgelineWidth = 1; //轮廓线条宽度
		this.edgeLeftSpacing = 40; //默认左侧线条左侧间距
		this.edgeBottomSpacing = 16; //默认底部线条地侧间距
		this.showTitle=false;
		
		this.textColor = "#333"; //文本字体颜色
		this.itemColor = "#41BABD"; //节点颜色a0e0a3
		this.itemFillColor = "rgba(250,138,157, 0.28)"; //节点填充颜色rgba(160,224,163, 0.28)
		this.itemlineWidth = 1; //节点线条宽度
		this.itemPointWeight = 2; //节点半径
		
		this._node_lenght = 10;//节点线条长度
		this._title_height = 36;//标题布局高度
		this._txt_v_offset = 16;//字体上下对齐偏移量
		this._txt_h_offset = 6;//字体左右对齐偏移量

		BrokenLine.prototype._init = function() {
			if (typeof(opts) != "object") {
				return;
			}
			if (typeof(opts.width) == "number") {
				this.width = opts.width;
			}
			if (typeof(opts.height) == "number") {
				this.height = opts.height;
			}
			if (typeof(opts.background) == "string") {
				this.background = opts.background;
			}
			if (typeof(opts.border) == "string") {
				this.border = opts.border;
			}
			if (typeof(opts.padding) == "number") {
				this.padding = opts.padding;
			}
			if (typeof(opts.edgeLineColor) == "string") {
				this.edgeLineColor = opts.edgeLineColor;
			}
			if (typeof(opts.edgeLineHintColor) == "string") {
				this.edgeLineHintColor = opts.edgeLineHintColor;
			}
			if (typeof(opts.edgelineWidth) == "number") {
				this.edgelineWidth = opts.edgelineWidth;
			}
			if (typeof(opts.edgeLeftSpacing) == "number") {
				this.edgeLeftSpacing = opts.edgeLeftSpacing;
			}
			if (typeof(opts.edgeBottomSpacing) == "number") {
				this.edgeBottomSpacing = opts.edgeBottomSpacing;
			}
			if (typeof(opts.showTitle) == "boolean") {
				this.showTitle = opts.showTitle;
			}
			if (typeof(opts.textColor) == "string") {
				this.textColor = opts.textColor;
			}
			if (typeof(opts.itemColor) == "string") {
				this.itemColor = opts.itemColor;
			}
			if (typeof(opts.itemFillColor) == "string") {
				this.itemFillColor = opts.itemFillColor;
			}
			if (typeof(opts.itemlineWidth) == "number") {
				this.itemlineWidth = opts.itemlineWidth;
			}
			if (typeof(opts.itemPointWeight) == "number") {
				this.itemPointWeight = opts.itemPointWeight;
			}
		};
		BrokenLine.prototype._create = function() {
			this._init();

			this.ele = document.createElement("canvas");

			this.ele.width = this.width;
			this.ele.height = this.height;
			this.ele.style.background = this.background;
			this.ele.style.border = this.border;
			this.ctx = this.ele.getContext("2d");
		};

		BrokenLine.prototype.setContainerById = function(id) {
			document.getElementById(id).appendChild(this.ele);
		};
		//画折线图
		BrokenLine.prototype.draw = function(nodes, values, titles) {
			//this._create();
			if(typeof(nodes) != "object"){
				return ;
			}
			if(typeof(values) != "object"){
				return ;
			}
			var vheight = this.height - (this.padding * 2) - this.edgeBottomSpacing - this._node_lenght;
			var hwidth = this.width - (this.padding * 2) - this.edgeLeftSpacing - this._node_lenght;
			var top = this.padding;
			if(this.showTitle){
				vheight -= this._title_height;
				top = this.padding + this._title_height;
			}
			var nodeHeight = vheight/(nodes.Y.length - 1);
			var vNodeX = this.padding + this._node_lenght + this.edgeLeftSpacing;
			var nodeWidth = hwidth/(nodes.X.length - 1);
			var hNodeY =  this.height - this.padding - this._node_lenght - this.edgeBottomSpacing;
			
			this.drawEdgeLine(nodeHeight, vNodeX, nodeWidth, hNodeY, top, nodes);
			this.drawEdgeText(nodeHeight, vNodeX, nodeWidth, hNodeY, top, nodes);
			this.drawData(vheight, nodeHeight, vNodeX, nodeWidth, hNodeY, nodes, values, titles);
			
		};
		BrokenLine.prototype.drawData = function(vheight, nodeHeight, vNodeX, nodeWidth, hNodeY, nodes, values, titles) {
			if(typeof(titles) == "undefined"){
				for(var i = 0; i < values.length; i ++){
					var value = values[i].value;
					var arr = [];
					for(var j = 0; j < nodes.X.length; j ++){
						//判断是否存在属性
						if(nodes.X[j].fieldName in value){
							arr.push(value[nodes.X[j].fieldName])
						}
					}
					this.drawArrayData(vheight, nodeHeight, vNodeX, nodeWidth, hNodeY, arr);
				}
			}
			
			
		};
		BrokenLine.prototype.drawArrayData = function(vheight, nodeHeight, vNodeX, nodeWidth, hNodeY, data) {
			console.log(data);
			var len = data.length
			this.ctx.fillStyle = this.textColor;
			this.ctx.font = "16px Arial";
			this.ctx.beginPath();
			var sx;
			var sy; 
			//横向刻度值
			for (var i = 0; i < len; i++) {
				var x = vNodeX + (i * nodeWidth);
				var val = new Number(data[i].value);
				if (val > 100) {
					val = 100;
				}
				var y = hNodeY - ((vheight * val) / 100);
				
				this.drawCircle(x, y);
				this.drawTextValue(data[i].key, x + this._txt_h_offset, y);
			
				if (i != 0) {
					this.ctx.strokeStyle = this.itemColor;
					this.ctx.lineWidth = 1; //设置线宽
					this.ctx.beginPath();
					this.drawLinePx(sx, sy, x, y);
					this.ctx.closePath();
					this.ctx.stroke();
				}
				sx = x;
				sy = y;
			}
		};
		
		BrokenLine.prototype.drawEdgeLine = function(nodeHeight,vNodeX, nodeWidth, hNodeY, top, nodes) {
			this.ctx.strokeStyle = this.edgeLineColor;
			this.ctx.lineWidth = this.edgelineWidth; //设置线宽
			this.ctx.beginPath();
			
			//竖线条
			this.drawLinePx(vNodeX, top, vNodeX, this.height - this.padding - this.edgeBottomSpacing);
			//竖向刻度标
			var left = this.padding+this.edgeLeftSpacing;
			for (var i = 0; i < nodes.Y.length - 1; i++) {
				var y = i * nodeHeight + top;
				this.drawLinePx(vNodeX, y, left, y);
				//水平线
				this.ctx.stroke();
				this.ctx.beginPath();
				this.ctx.strokeStyle = this.edgeLineHintColor;
				this.drawLinePx(vNodeX, y, this.width - this.padding, y);
				this.ctx.stroke();
				this.ctx.beginPath();
				this.ctx.strokeStyle = this.edgeLineColor;
			}
			this.drawLinePx(vNodeX - this._node_lenght, hNodeY, this.width - this.padding, hNodeY);
			//横向刻度标
			for (var i = 0; i < nodes.X.length; i++) {
				var x = i * nodeWidth + vNodeX;
				this.drawLinePx(x, hNodeY, x, hNodeY+this._node_lenght);
			}
			this.ctx.closePath();
			this.ctx.stroke();
		};
		BrokenLine.prototype.drawEdgeText = function(nodeHeight, vNodeX, nodeWidth, hNodeY, top, nodes) {
			//竖向刻度值
			this.ctx.fillStyle = this.edgeLineColor;
			this.ctx.font = "16px Arial";
			for (var i = 0; i < nodes.Y.length; i++) {
				var y = top + ((nodes.Y.length - 1- i) * nodeHeight)+ this._txt_v_offset;
				this.ctx.fillText(nodes.Y[i], this.padding, y);
			}
			//横向刻度值
			for (var i = 0; i < nodes.X.length; i++) {
				var x = i * nodeWidth + vNodeX;
				var offset = this._txt_h_offset;
				if(typeof(nodes.X[i].offset) == "number"){
					offset = nodes.X[i].offset;
				}
				this.ctx.fillText(nodes.X[i].text, x - offset, hNodeY+this._node_lenght+this._txt_v_offset);
			}
		};
		BrokenLine.prototype.drawLinePx = function(sx, sy, ex, ey) {
			this.ctx.moveTo(sx, sy);
			this.ctx.lineTo(ex, ey);
		};
		BrokenLine.prototype.drawTextValue = function(txt, x, y) {
			this.ctx.fillStyle = this.itemColor;
			this.ctx.fillText(txt, x, y);
		};
		BrokenLine.prototype.drawCircle = function(x, y) {
			var r = 6; //设置节点小圆点的半径
			this.ctx.beginPath();
			this.ctx.arc(x, y, r, 0, Math.PI * 2);
			this.ctx.fillStyle = this.itemColor;
			this.ctx.fill();
		};

		this._create();
	}
})();
