// var areaLine = new Ele.Charts.AreaLine({padding:40,showTitle:true});
// var data = {
// 	title:"线路统计图Ab123"
// 	,max:1000
// 	,X:[{text:"AAA",fieldName:"a"},{text:"B",fieldName:"b"},{text:"C",fieldName:"c"},{text:"D",fieldName:"d"},{text:"E",fieldName:"e"}]
// 	,Y:["0","200","400","600","800","1000"]
// 	,nodes:[{id:1,name:"分支线",color:"#41BABD", areaColor:"rgba(94,204,204, 0.6)"},{id:2,name:"总线Ab123",color:"#b502a4",areaColor:"rgba(211,0,201, 0.6)"}]
// 	,values:[{lineId:1,value:{a:{key:"", value:200},b:{key:"600", value:600},c:{key:"300", value:300},d:{key:"400", value:400},e:{key:"600", value:600}}},{lineId:2,value:{a:{key:"", value:30},b:{key:"90", value:90},c:{key:"50", value:50},d:{key:"60", value:60},e:{key:"80", value:80}}}]
// 	};
// areaLine.draw(data);
(function() {
	var AreaLine = Ele.Charts.AreaLine = function(opts) {
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
		this.showTitle = false;
		this.itemColor = "#41BABD"; //节点颜色a0e0a3
		this.itemlineWidth = 1; //节点线条宽度
		this.itemPointWeight = 4; //节点半径
		this.offset = 0.4; //偏移量 0-1之间 落差百分比
		this.data;
		this.filter = new Ele.Filter();
		
		this._node_lenght = 10;//节点线条长度
		this._title_height = 36;//标题布局高度
		this._rectW = 16;//方形宽度
		this._rectH = 16;//方形高度
		this._txt_h_offset = 6;//字体左右对齐偏移量

		AreaLine.prototype._init = function() {
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
			if (typeof(opts.itemColor) == "string") {
				this.itemColor = opts.itemColor;
			}
			if (typeof(opts.itemlineWidth) == "number") {
				this.itemlineWidth = opts.itemlineWidth;
			}
			if (typeof(opts.itemPointWeight) == "number") {
				this.itemPointWeight = opts.itemPointWeight;
			}
			if (typeof(opts.offset) == "number") {
				this.offset = opts.offset;
			}
		};
		AreaLine.prototype._create = function() {
			this._init();

			this.ele = document.createElement("canvas");

			this.ele.width = this.width;
			this.ele.height = this.height;
			this.ele.style.background = this.background;
			this.ele.style.border = this.border;
			this.ctx = this.ele.getContext("2d");
		};

		AreaLine.prototype.setContainerById = function(id) {
			document.getElementById(id).appendChild(this.ele);
		};
		//画区域图
		AreaLine.prototype.draw = function(data) {
			if(typeof(data) != "object"){
				return ;
			}
			if(typeof(data.X) != "object"){
				return ;
			}
			if(typeof(data.Y) != "object"){
				return ;
			}
			if(typeof(data.values) != "object"){
				return ;
			}
			this.data = data;
			
			var vheight = this.height - (this.padding * 2) - this.edgeBottomSpacing - this._node_lenght;
			var hwidth = this.width - (this.padding * 2) - this.edgeLeftSpacing - this._node_lenght;
			var top = this.padding;
			if(this.showTitle){
				vheight -= this._title_height;
				top = this.padding + this._title_height;
				this.drawTitleText();
			}
			var nodeHeight = vheight/(data.Y.length - 1);
			var vNodeX = this.padding + this._node_lenght + this.edgeLeftSpacing;
			var nodeWidth = hwidth/(data.X.length - 1);
			var hNodeY =  this.height - this.padding - this._node_lenght - this.edgeBottomSpacing;
			
			this.drawEdgeLine(nodeHeight, vNodeX, nodeWidth, hNodeY, top);
			this.drawEdgeText(nodeHeight, vNodeX, nodeWidth, hNodeY, top);
			this.drawData(vheight, nodeHeight, vNodeX, nodeWidth, hNodeY);
			
		};
		AreaLine.prototype.drawData = function(vheight, nodeHeight, vNodeX, nodeWidth, hNodeY) {
			var values = this.data.values;
			if(typeof(this.data.nodes) == "undefined"){
				for(var i = 0; i < values.length; i ++){
					var value = values[i].value;
					var arr = [];
					for(var j = 0; j < this.data.X.length; j ++){
						//判断是否存在属性
						if(this.data.X[j].fieldName in value){
							arr.push(value[this.data.X[j].fieldName])
						}
					}
					this.drawArrayData(vheight, nodeHeight, vNodeX, nodeWidth, hNodeY, arr, this.itemColor);
				}
				return ;
			}
			var nodes = this.data.nodes;
			for(var i = 0; i < values.length; i ++){
				var value = values[i].value;
				var arr = [];
				for(var j = 0; j < this.data.X.length; j ++){
					//判断是否存在属性
					if(this.data.X[j].fieldName in value){
						arr.push(value[this.data.X[j].fieldName]);
					}
				}
				var lineId = values[i].lineId;
				var node = null;
				for(var k = 0; k < nodes.length; k ++){
					if(typeof(nodes[k].id) != "number"){
						continue;
					}
					if(nodes[k].id == lineId){
						node = nodes[k];
						break;
					}
				}
				if(node == null || typeof(node.color) != "string"){
					this.drawArrayData(vheight, nodeHeight, vNodeX, nodeWidth, hNodeY, arr, this.itemColor, this.edgeLineColor);
				}else{
					var areaColor = this.edgeLineHintColor;
					if(typeof(node.areaColor) == "string"){
						areaColor = node.areaColor;
					}
					this.drawArrayData(vheight, nodeHeight, vNodeX, nodeWidth, hNodeY, arr, node.color, areaColor);
				}
			}
		};
		AreaLine.prototype.drawArrayData = function(vheight, nodeHeight, vNodeX, nodeWidth, hNodeY, data, color, areaColor) {
			if(typeof(this.data.max) != "number"){
				return ;
			}
			var len = data.length
			this.ctx.font = "12px Microsoft YaHei";
			this.ctx.fillStyle = color;
			this.ctx.strokeStyle = color;
			this.ctx.lineWidth = this.itemlineWidth;
			this.ctx.beginPath();
			
			var points = [];
			
			//横向刻度值
			for (var i = 0; i < len; i++) {
				var x = vNodeX + (i * nodeWidth);
				var val = new Number(data[i].value);
				if (val > this.data.max) {
					val = this.data.max;
				}
				var y = hNodeY - ((vheight * val) / this.data.max);
				
				//小圆点
				this.ctx.beginPath();
				this.ctx.arc(x, y, this.itemPointWeight, 0, Math.PI * 2);
				this.ctx.fill();
				this.ctx.closePath();
				
				//数据文本
				this.ctx.beginPath();
				this.ctx.fillText(data[i].key, x + this._txt_h_offset, y);
				this.ctx.closePath();
				this.ctx.stroke();
			
				points.push({x:x,y:y})
			}
			this.drawQuadraticCurvePx(points, vNodeX, hNodeY, areaColor);
		};
		
		AreaLine.prototype.drawEdgeLine = function(nodeHeight,vNodeX, nodeWidth, hNodeY, top) {
			this.ctx.strokeStyle = this.edgeLineColor;
			this.ctx.lineWidth = this.edgelineWidth; //设置线宽
			this.ctx.beginPath();
			
			//竖线条
			this.drawLinePx(vNodeX, top, vNodeX, this.height - this.padding - this.edgeBottomSpacing);
			//竖向刻度标
			var left = this.padding+this.edgeLeftSpacing;
			for (var i = 0; i < this.data.Y.length - 1; i++) {
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
			for (var i = 0; i < this.data.X.length; i++) {
				var x = i * nodeWidth + vNodeX;
				this.drawLinePx(x, hNodeY, x, hNodeY+this._node_lenght);
			}
			this.ctx.closePath();
			this.ctx.stroke();
		};
		AreaLine.prototype.drawEdgeText = function(nodeHeight, vNodeX, nodeWidth, hNodeY, top) {
			//竖向刻度值
			this.ctx.fillStyle = this.edgeLineColor;
			this.ctx.textBaseline = 'top';
			this.ctx.font = "12px Microsoft YaHei";
			for (var i = 0; i < this.data.Y.length; i++) {
				var y = top + ((this.data.Y.length - 1- i) * nodeHeight);
				this.ctx.fillText(this.data.Y[i], this.padding, y);
			}
			//横向刻度值
			for (var i = 0; i < this.data.X.length; i++) {
				var x = i * nodeWidth + vNodeX;
				this.ctx.textAlign = 'right';
				this.ctx.fillText(this.data.X[i].text, x, hNodeY+this._node_lenght);
				this.ctx.textAlign = 'left';
			}
		};
		AreaLine.prototype.drawTitleText = function() {
			if(typeof(this.data.nodes) == "undefined"){
				return ;
			}
			this.ctx.fillStyle = this.edgeLineColor;
			this.ctx.font = "16px Microsoft YaHei";
			this.ctx.textBaseline = 'bottom';
			this.ctx.beginPath();
			this.ctx.fillText(this.data.title, this.padding, this.padding);
			
			var x =  this.padding + this.strLen(this.data.title) + 32;
			var y = this.padding;
			
			var nodes = this.data.nodes;
			for(var i = 0; i < nodes.length; i ++){
				if(typeof(nodes[i].color) != "string"){
					continue;
				}
				var name = "";
				if(typeof(nodes[i].name) == "string"){
					name = nodes[i].name;
				}
				this.ctx.fillStyle = nodes[i].color;
				this.ctx.strokeStyle = nodes[i].color;
				this.ctx.beginPath();
				//w*h正方形
				this.ctx.fillRect(x, y - this._rectH, this._rectW, this._rectH);
				x += 24;//16+8
				this.ctx.fillText(name, x, y);
				x += this.strLen(name) + 16;
				this.ctx.closePath();
				this.ctx.fill();
			}
			
		};
		AreaLine.prototype.drawLinePx = function(sx, sy, ex, ey) {
			this.ctx.moveTo(sx, sy);
			this.ctx.lineTo(ex, ey);
		};
		AreaLine.prototype.drawQuadraticCurvePx = function(points, vNodeX, hNodeY, areaColor) {
			if(points.length < 2){
				return ;
			}
			
			this.ctx.fillStyle = areaColor;
			this.ctx.beginPath();
			this.ctx.moveTo(vNodeX, hNodeY);
			this.ctx.lineTo(points[0].x,points[0].y);
			var px = points[0].x;
			var py = points[0].y;
			//横坐标均等，两次找中点被划分为四段
			var offsetX = (points[1].x - points[0].x)/4 * this.offset;
			for(var i = 1; i < points.length; i ++){
				//两点间的中点
				var centerX = (points[i].x + points[i-1].x)/2;
				var centerY = (points[i].y + points[i-1].y)/2;
				var type = (points[i].y - points[i-1].y) > 0?2:1;//1=增 2=减
				
				//中点距前一点的中点
				var tempX = (centerX + points[i-1].x)/2;
				var tempY = (centerY + points[i-1].y)/2;
				console.log(tempX+"-"+tempY);
				var offsetY = 0;
				if(type == 1){
					offsetY = (points[i-1].y - tempY) * this.offset;
					tempX = tempX + offsetX;
					tempY = tempY + offsetY;
				}else{
					offsetY = (tempY - points[i-1].y) * this.offset;
					tempX = tempX + offsetX;
					tempY = tempY - offsetY;
				}
				console.log(offsetX+"-"+offsetY);
				//中点前半段
				this.ctx.quadraticCurveTo(tempX, tempY, centerX, centerY);
				
				//中点距后一点的中点
				tempX = (centerX + points[i].x)/2;
				tempY = (centerY + points[i].y)/2;
				offsetY = 0;
				if(type == 1){
					offsetY = (tempY - points[i].y) * this.offset;
					tempX = tempX - offsetX;
					tempY = tempY - offsetY;
				}else{
					offsetY = (points[i].y - tempY) * this.offset;
					tempX = tempX - offsetX;
					tempY = tempY + offsetY;
				}
				//中点后半段
				this.ctx.quadraticCurveTo(tempX, tempY, points[i].x, points[i].y);
				this.ctx.stroke();
			}
			this.ctx.lineTo(points[points.length - 1].x, hNodeY);
			//this.ctx.lineTo(0, 0);
			
			// //
			// this.ctx.stroke();
			this.ctx.fill();
			this.ctx.closePath();
		};
		
		AreaLine.prototype.strLen = function(str){
			var len = 0;
			for(var i = 0; i < str.length; i ++){
				if(this.filter.isChinese(str.charAt(i))){
					len += 16;
					continue;
				}
				if(this.filter.isUpper(str.charAt(i))){
					len += 12;
					continue;
				}
				if(this.filter.isNumber(str.charAt(i))){
					len += 9;
					continue;
				}
				len += 8;
			}
			return len;
		};

		this._create();
	}
})();
