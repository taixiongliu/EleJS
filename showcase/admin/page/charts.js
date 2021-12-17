(function(){
	var Chart = window.Chart = function(rootView){
		MainView.call(this, rootView, 7);
		
		Chart.prototype.viewCreate = function(){
			
			//主面板--full
			var board = new Ele.Views.Board(true);
			
			var content = new Ele.Views.FullBoard();
			var context = this;
			
			var layout = new Ele.Layout("charts");
			//var divider = new Ele.Layout("media_divider");
			var titleAl = new Ele.Layout("charts_title");
			titleAl.setHtml("区域曲线图");
			var alView = new Ele.Layout("charts_view");
			var areaLine = new Ele.Charts.AreaLine({padding:40,showTitle:true});
			var data = {
				title:"线路统计图Ab123"
				,max:1000
				,X:[{text:"AAA",fieldName:"a"},{text:"B",fieldName:"b"},{text:"C",fieldName:"c"},{text:"D",fieldName:"d"},{text:"E",fieldName:"e"}]
				,Y:["0","200","400","600","800","1000"]
				,nodes:[{id:1,name:"分支线",color:"#4FDBDB", areaColor:"rgba(79,219,219, 0.3)"},{id:2,name:"总线Ab123",color:"#43CAFF",areaColor:"rgba(67,202,255, 0.3)"}]
				,values:[{lineId:1,value:{a:{key:"", value:200},b:{key:"600", value:600},c:{key:"300", value:300},d:{key:"400", value:400},e:{key:"600", value:600}}},{lineId:2,value:{a:{key:"", value:30},b:{key:"90", value:90},c:{key:"50", value:50},d:{key:"60", value:60},e:{key:"80", value:80}}}]
				};
			areaLine.draw(data);
			alView.add(areaLine);
			
			var titleBl = new Ele.Layout("charts_title");
			titleBl.setHtml("折线图");
			var blView = new Ele.Layout("charts_view");
			var brokenLine = new Ele.Charts.BrokenLine({padding:40,showTitle:true});
			var data = {
				title:"线路统计图Ab123"
				,max:1000
				,X:[{text:"AAA",fieldName:"a"},{text:"B",fieldName:"b"},{text:"C",fieldName:"c"},{text:"D",fieldName:"d"},{text:"E",fieldName:"e"}]
				,Y:["0","200","400","600","800","1000"]
				,nodes:[{id:1,name:"总线Ab123",color:"#43CAFF"},{id:2,name:"分支线",color:"#4FDBDB"}]
				,values:[{lineId:1,value:{a:{key:"", value:30},b:{key:"90", value:90},c:{key:"50", value:50},d:{key:"60", value:60},e:{key:"80", value:80}}},
			{lineId:2,value:{a:{key:"", value:200},b:{key:"600", value:600},c:{key:"300", value:300},d:{key:"400", value:400},e:{key:"600", value:600}}}]
				};
			brokenLine.draw(data);
			blView.add(brokenLine);
			
			var titleHg = new Ele.Layout("charts_title");
			titleHg.setHtml("柱状图");
			var hgView = new Ele.Layout("charts_view");
			var histogram = new Ele.Charts.Histogram({padding:40,showTitle:true,showBrokenLine:true});
			var data = {
				title:"线路统计图Ab123"
				,max:1000
				,X:[{text:"AAA",fieldName:"a"},{text:"B",fieldName:"b"},{text:"C",fieldName:"c"},{text:"D",fieldName:"d"},{text:"E",fieldName:"e"}]
				,Y:["0","200","400","600","800","1000"]
				,nodes:[{id:1,name:"总线Ab123",color:"#43CAFF"},{id:2,name:"分支线",color:"#4FDBDB"}]
				,values:[{lineId:1,value:{a:{key:"30", value:30},b:{key:"90", value:90},c:{key:"50", value:50},d:{key:"60", value:60},e:{key:"80", value:80}}},
			{lineId:2,value:{a:{key:"200", value:200},b:{key:"600", value:600},c:{key:"300", value:300},d:{key:"400", value:400},e:{key:"600", value:600}}}]
				};
			histogram.draw(data);
			hgView.add(histogram);
			
			var titleRadar = new Ele.Layout("charts_title");
			titleRadar.setHtml("雷达图");
			var radarView = new Ele.Layout("charts_view");
			var radar = new Ele.Charts.Radar();
			var data = [{key:"A",value:85},{key:"B",value:30},{key:"C",value:80},{key:"D",value:45},{key:"E",value:70},{key:"F",value:90}];
			radar.draw(data, 100);
			radarView.add(radar);
			
			var titleSector = new Ele.Layout("charts_title");
			titleSector.setHtml("饼状图");
			var sectorView = new Ele.Layout("charts_view");
			var sector = new Ele.Charts.Sector({showTitle:true});
			var data = {title:"用户人群分布",value:[
					{
						title: '15-20岁',
						color: "#41BABD",
						value: 20
					},
					{
						title: '20-25岁',
						color: "#43CAFF",
						value: 30
					},
					{
						title: '25-30岁',
						value: 40
					},
					{
						title: '30以上',
						value: 10
					}
				]};
			sector.draw(data);
			sectorView.add(sector);
			
			
			layout.add(new Ele.Layout("charts_divider"));
			layout.add(titleAl);
			layout.add(new Ele.Layout("charts_divider"));
			layout.add(alView);
			layout.add(new Ele.Layout("charts_divider"));
			layout.add(titleBl);
			layout.add(new Ele.Layout("charts_divider"));
			layout.add(blView);
			layout.add(new Ele.Layout("charts_divider"));
			layout.add(titleHg);
			layout.add(new Ele.Layout("charts_divider"));
			layout.add(hgView);
			
			layout.add(new Ele.Layout("charts_divider"));
			layout.add(titleRadar);
			layout.add(new Ele.Layout("charts_divider"));
			layout.add(radarView);
			
			layout.add(new Ele.Layout("charts_divider"));
			layout.add(titleSector);
			layout.add(new Ele.Layout("charts_divider"));
			layout.add(sectorView);
			// layout.add(new Ele.Layout("charts_divider"));
			
			content.addView(layout);
			
			board.addBoard(content);
			
			this.addContentView(board);
		};
		this.viewCreate();
	}
	
	var Super = function (){};
	Super.prototype = MainView.prototype;
	Super.constructor = Chart;
	var sp = new Super();
	sp.constructor = Chart;
	Chart.prototype = sp;
})();