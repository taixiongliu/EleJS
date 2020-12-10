// var sector = new Ele.Charts.Sector({showTitle:true});
// var data = {title:"用户人群分布",value:[
// 		{
// 			title: '15-20岁',
// 			color: "#41BABD",
// 			value: 20
// 		},
// 		{
// 			title: '20-25岁',
// 			value: 30
// 		},
// 		{
// 			title: '25-30岁',
// 			value: 40
// 		},
// 		{
// 			title: '30以上',
// 			value: 10
// 		}
// 	]};
// sector.draw(data);
(function() {
	var Sector = Ele.Charts.Sector = function(opts) {
		this.eleType = "canvas";
		this.ele;
		this.ctx;
		this.width = 610; //默认宽度
		this.height = 486; //默认高度
		this.background = "#fff"; //默认背景
		this.border = "1px #f5f5f5 solid"; //默认边框
		this.padding = 20; //四周边距
		this.edgeLeftSpacing = 60; //默认左侧线条左侧间距
		this.showTitle = false;
		this.titleColor = "#41BABD"; //节点颜色a0e0a3
		this.itemlineWidth = 1; //节点线条宽度
		this.cellSpacing = 80;//圆形内间距
		this.data;
		
		this._title_height = 36;//标题布局高度
		/*伸出去的线的长度*/
		this._out_line = 20;
		/*说明的矩形大小*/
		this._rectW = 30;
		this._rectH = 16;
		this._space = 10;


		Sector.prototype._init = function() {
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
			if (typeof(opts.edgeLeftSpacing) == "number") {
				this.edgeLeftSpacing = opts.edgeLeftSpacing;
			}
			if (typeof(opts.showTitle) == "boolean") {
				this.showTitle = opts.showTitle;
			}
			if (typeof(opts.titleColor) == "string") {
				this.titleColor = opts.titleColor;
			}
			if (typeof(opts.itemlineWidth) == "number") {
				this.itemlineWidth = opts.itemlineWidth;
			}
			if (typeof(opts.cellSpacing) == "number") {
				this.cellSpacing = opts.cellSpacing;
			}
		};
		Sector.prototype._create = function() {
			this._init();

			this.ele = document.createElement("canvas");

			this.ele.width = this.width;
			this.ele.height = this.height;
			this.ele.style.background = this.background;
			this.ele.style.border = this.border;
			this.ctx = this.ele.getContext("2d");
		};

		Sector.prototype.setContainerById = function(id) {
			document.getElementById(id).appendChild(this.ele);
		};
		//画饼状图
		Sector.prototype.draw = function(data) {
			if(typeof(data) != "object"){
				return ;
			}
			if(typeof(data.value) != "object"){
				return ;
			}
			this.data = data;
			
			/*圆心*/
			var x0 = (this.width / 2) + this.edgeLeftSpacing;
			var y0 = this.height / 2;
			var top = 0;
			var cellwith = (this.cellSpacing + this.padding) * 2;
			var hWidth = this.width - cellwith - this.edgeLeftSpacing;
			var vHeight = this.height - cellwith;
			if(this.showTitle){
				y0 += this._title_height;
				vHeight -= this._title_height;
				top += this._title_height;
				this.drawTitleText();
			}
			//直径取最小有效值
			var diameter = hWidth > vHeight?vHeight:hWidth;
			/*半径*/
			var radius = diameter/2;
			var context = this;
			/*1.转化弧度*/
			var angleList = this.transformAngle(data.value);
			/*2.绘制饼图*/
			var startAngle = 0;
			angleList.forEach(function (item, i) {
				/*当前的结束弧度要等于下一次的起始弧度*/
				var endAngle = startAngle + item.angle;
				context.ctx.beginPath();
				context.ctx.moveTo(x0, y0);
				context.ctx.arc(x0, y0, radius, startAngle, endAngle);
				var color;
				if(typeof(item.color) == "string"){
					color = context.ctx.fillStyle = item.color;
				}else{
					color = context.ctx.fillStyle = context.getRandomColor();
				}
				
				context.ctx.fill();
				/*下一次要使用当前的这一次的结束角度*/
				/*绘制标题*/
				context.drawTitle(x0, y0, radius, startAngle, item.angle, color, item.title);
				/*绘制说明*/
				context.drawDesc(i, top, item.title);
				startAngle = endAngle;
			});
		};
		
		Sector.prototype.drawTitle = function (x0, y0, radius, startAngle, angle ,color , title) {
			/*1.确定伸出去的线 通过圆心点 通过伸出去的点  确定这个线*/
			/*2.确定伸出去的点 需要确定伸出去的线的长度*/
			/*3.固定伸出去的线的长度*/
			/*4.计算这个点的坐标*/
			/*5.需要根据角度和斜边的长度*/
			/*5.1 使用弧度  当前扇形的起始弧度 + 对应的弧度的一半 */
			/*5.2 半径+伸出去的长度 */
			/*5.3 outX = x0 + cos(angle) * ( r + outLine)*/
			/*5.3 outY = y0 + sin(angle) * ( r + outLine)*/
			/*斜边*/
			var edge = radius + this._out_line;
			/*x轴方向的直角边*/
			var edgeX = Math.cos(startAngle + angle / 2) * edge;
			/*y轴方向的直角边*/
			var edgeY = Math.sin(startAngle + angle / 2) * edge;
			/*计算出去的点坐标*/
			var outX = x0 + edgeX;
			var outY = y0 + edgeY;
			this.ctx.beginPath();
			this.ctx.moveTo(x0, y0);
			this.ctx.lineTo(outX, outY);
			this.ctx.strokeStyle = color;
			/*画文字和下划线*/
			/*线的方向怎么判断 伸出去的点在X0的左边 线的方向就是左边*/
			/*线的方向怎么判断 伸出去的点在X0的右边 线的方向就是右边*/
			/*结束的点坐标  和文字大小*/
			this.ctx.font = '14px Microsoft YaHei';
			var textWidth = this.ctx.measureText(title).width ;
			if(outX > x0){
				/*右*/
				this.ctx.lineTo(outX + textWidth,outY);
				this.ctx.textAlign = 'left';
			}else{
				/*左*/
				this.ctx.lineTo(outX - textWidth,outY);
				this.ctx.textAlign = 'right';
			}
			this.ctx.stroke();
			this.ctx.textBaseline = 'bottom';
			this.ctx.fillText(title,outX,outY);
	
		};
		
		Sector.prototype.drawDesc = function (index, top, title) {
			/*绘制说明*/
			/*矩形的大小*/
			/*距离上和左边的间距*/
			/*矩形之间的间距*/
			var tp = this.padding + top + index * (this._rectH + this._space);
			
			this.ctx.fillRect(this.padding, tp,this._rectW,this._rectH);
			/*绘制文字*/
			this.ctx.beginPath();
			this.ctx.textAlign = 'left';
			this.ctx.textBaseline = 'top';
			this.ctx.font = '12px Microsoft YaHei';
			this.ctx.fillText(title,this.padding + this._rectW + this._space, tp);
		};
		
		Sector.prototype.transformAngle = function(data) {
			/*返回的数据内容包含弧度的*/
			var total = 0;
			data.forEach(function (item, i) {
				total += item.value;
			});
			/*计算弧度 并且追加到当前的对象内容*/
			data.forEach(function (item, i) {
				var angle = item.value / total * Math.PI * 2;
				item.angle = angle;
			});
			return data;

		};
		
		Sector.prototype.drawTitleText = function() {
			if(typeof(this.data.title) != "string"){
				return ;
			}
			this.ctx.fillStyle = this.titleColor;
			this.ctx.textAlign = 'center';
			this.ctx.textBaseline = 'top';
			this.ctx.font = "16px Microsoft YaHei";
			this.ctx.beginPath();
			this.ctx.fillText(this.data.title, this.width/2, this.padding);
		};
		
		Sector.prototype.getRandomColor = function () {
			var r = Math.floor(Math.random() * 256);
			var g = Math.floor(Math.random() * 256);
			var b = Math.floor(Math.random() * 256);
			return 'rgb(' + r + ',' + g + ',' + b + ')';
		}
		
		this._create();
	}
})();
