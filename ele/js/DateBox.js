(function(){
	var DateBox = Ele.DateBox = function(){
		this.eleType = "layout";
		this.ele;
		this.view;
		this.bg;
		//时间文本显示
		this.dateText;
		//时间元素VIEW
		this.daysView = [];
		this._year;
		this._month;
		this._day;
		//选择的ITEM
		this._selected = null;
		//选择的日期字符串
		this._selectedDateString = "";
		
		this._selectedUpdateHandler = null;
		this._pageUpdateHandler = null;
		
		//初始化布局
		DateBox.prototype.initView = function(){
			var context = this;
			this.view = new Ele.Layout("ele_date_box_panel");
			this.ele = this.view.ele;
			this.bg = new Ele.Layout("ele_data_box_bg");
			//点击主布局外隐藏窗口
			this.bg.ele.onclick = function(e){
				context.hide();
			};
			//标题布局
			var titleView = new Ele.Layout("ele_date_box_title_view");
			var titleLeft = new Ele.Layout("ele_date_box_title_left_view");
			titleLeft.setAlign("center");
			var titleCenter = new Ele.Layout("ele_date_box_title_center_view");
			titleCenter.setAlign("center");
			var titleRight = new Ele.Layout("ele_date_box_title_right_view");
			titleRight.setAlign("center");
			var iconLeft = new Ele.Img("icons/icon_left.png", "ele_date_box_title_icon ele_ml20");
			iconLeft.ele.onclick = function(){
				context.previousMonth();
			};
			var icon2Left = new Ele.Img("icons/icon_2_left.png", "ele_date_box_title_icon");
			icon2Left.ele.onclick = function(){
				context.previousYear();
			};
			this.dateText = new Ele.Label(this._year+"-"+this._month, "ele_date_box_date_txt");
			var iconRight = new Ele.Img("icons/icon_right.png", "ele_date_box_title_icon");
			iconRight.ele.onclick = function(){
				context.nextMonth();
			};
			
			var icon2Right = new Ele.Img("icons/icon_2_right.png", "ele_date_box_title_icon ele_ml20");
			icon2Right.ele.onclick = function(){
				context.nextYear();
			};
			var titleFc = new Ele.Layout("ele_cl");
			titleLeft.add(icon2Left);
			titleLeft.add(iconLeft);
			titleCenter.add(this.dateText);
			titleRight.add(iconRight);
			titleRight.add(icon2Right);
			titleView.add(titleLeft);
			titleView.add(titleCenter);
			titleView.add(titleRight);
			titleView.add(titleFc);
			
			//星期标题布局
			var weekView = new Ele.Layout("ele_date_box_week_view");
			var weeks = ["一","二","三","四","五","六","日"];
			for(var index in weeks){
				var item = new Ele.Layout("ele_date_box_week_item");
				item.setAlign("center");
				item.setHtml(weeks[index]);
				weekView.add(item);
			}
			var weekFc = new Ele.Layout("ele_cl");
			weekView.add(weekFc);
			
			this.view.add(titleView);
			this.view.add(weekView);
			var divider = new Ele.Layout("ele_date_box_divider");
			this.view.add(divider);
			
			//时间元素布局
			for(var row = 0; row < 6; row ++){
				var rowView = new Ele.Layout("ele_date_box_line_view");
				var colViews = new Array();
				for(var col = 0; col < 7; col ++){
					var dateItemView = new Ele.Layout("ele_date_box_line_item");
					dateItemView.setAlign("center");
					rowView.add(dateItemView);
					var dbItem = new DateBoxItem(dateItemView.ele);
					colViews.push(dbItem);
				}
				this.daysView.push(colViews);
				var rowFc = new Ele.Layout("ele_cl");
				rowView.add(rowFc);
				this.view.add(rowView);
			}
			
			var body = document.getElementsByTagName("body")[0];
			body.appendChild(this.bg.ele);
			body.appendChild(this.view.ele);
		};
		
		//初始化时间，默认为今天
		DateBox.prototype.initDate = function(){
			var now = new Date();
			this._year = now.getFullYear();
			this._month = now.getMonth() + 1;
			this._day = now.getDate();
		};
		//初始化数据（指定元素布局填充元素数据）
		DateBox.prototype.initData = function(){
			var now = new Date();
			var year = now.getFullYear();
			var month = now.getMonth() + 1;
			var day = now.getDate();
			var context = this;
			
			var datas = this.getArrayData();
			var yearAndMonth = this.toYearMonthString();
			this._selected = null;
			for(var row = 0; row < 6; row ++){
				for(var col = 0; col < 7; col ++){
					var data = datas[row][col];
					var dayItem = this.daysView[row][col];
					var dayElement = dayItem.getElement();
					dayElement.innerHTML = data;
					if(data == ""){
						dayItem.removeClickHandler();
						dayElement.className = "ele_date_box_line_item";
					}else{
						dayItem.addClickHandler(function(item){
							context._onItemClick(item);
						});
						dayItem.setData(data);
						dayElement.className = "ele_date_box_line_item_full";
						if(col > 4){
							dayItem.isWeek = true;
							dayElement.className = "ele_date_box_line_item_week";
						}
						var tempDay = data;
						if(new Number(data) < 10){
							tempDay = "0"+data;
						}
						if((yearAndMonth +"-"+tempDay) == this._selectedDateString){
							dayElement.className = "ele_date_box_line_item_select";
							this._selected = dayItem;
						}
					}
					
					if(this._year == year && this._month == month && new Number(data) == day){
						dayItem.isToday = true;
						dayElement.className = "ele_date_box_line_item_today";
					}
				}
			}
		};
		
		//设置日期选择更新事件
		DateBox.prototype.setSelectUpdateHandler = function(funName){
			this._selectedUpdateHandler = funName;
		};
		//移除日期选择更新事件
		DateBox.prototype.removeSelectUpdateHandler = function(){
			this._selectedUpdateHandler = null;
		};
		//设置日期翻页事件
		DateBox.prototype.setPageUpdateHandler = function(funName){
			this._pageUpdateHandler = funName;
		};
		//移除日期翻页事件
		DateBox.prototype.removePageUpdateHandler = function(){
			this._pageUpdateHandler = null;
		};
		
		DateBox.prototype.getSelectDateString = function(){
			return this._selectedDateString;
		};
		
		//捕捉元素点击事件
		DateBox.prototype._onItemClick = function(item){
			if(this._selected != null){
				if(item.data == this._selected.data){
					this.hide();
					return ;
				}
				if(!this._selected.isToday){
					if(this._selected.isWeek){
						this._selected.getElement().className = "ele_date_box_line_item_week";
					}else{
						this._selected.getElement().className = "ele_date_box_line_item_full";
					}
				}
			}
			if(!item.isToday){
				item.getElement().className = "ele_date_box_line_item_select";
			}
			//设置选择对象
			this._selected = item;
			//设置当前DAY
			this._day = new Number(item.data);
			//设置当前选择的日期
			this._selectedDateString = this.toDateString();
			this.hide();
			if(this._selectedUpdateHandler != null){
				this._selectedUpdateHandler();
			}
		};
		
		//生成所有时间元素二位数组数据
		DateBox.prototype.getArrayData = function(){
			var firstDay = new Date(this._year, this._month - 1, 1);
			var week = firstDay.getDay();
			if(week == 0){
				week = 7;
			}
			var rows = new Array();
			var temp_day = 1;
			var days = this.getDays();
			for(var row = 0; row < 6; row ++){
				var cols = new Array();
				for(var col = 0; col < 7; col ++){
					if(row == 0 && col < week - 1){
						cols.push("");
					}else{
						if(temp_day > days){
							cols.push("");
						}else{
							cols.push(""+temp_day);
							temp_day ++;
						}
					}
				}
				rows.push(cols);
			}
			return rows;
		};
		//获取当前月的天数
		DateBox.prototype.getDays = function(){
			var days = 31;
			if(this._month == 2){
				days = 28;
				if(this._year%4 == 0){
					days = 29;
				}
			}
			if(this._month == 4 ||this._month == 6 || this._month == 9 || this._month == 11){
				days = 30;
			}
			return days;
		};
		//将时间转换为字符串格式
		DateBox.prototype.toDateString = function(){
			var year = this._year;
			var month = this._month+"";
			var day = this._day+"";
			if(this._month < 10){
				month = "0"+month;
			}
			if(this._day < 10){
				day = "0"+day;
			}
			return year+"-"+month+"-"+day;
		};
		
		//转换成只有年-月的时间字符串
		DateBox.prototype.toYearMonthString = function(){
			var year = this._year;
			var month = this._month+"";
			if(this._month < 10){
				month = "0"+month;
			}
			return year+"-"+month;
		};
		
		//向前翻一个月
		DateBox.prototype.previousMonth = function(){
			var temp = this._month - 1;
			if(temp < 1){
				if(this._year - 1 < 1970){
					return;
				}
				this._year --;
				this._month = 12;
			}else{
				this._month = temp;
			}
			temp = null;
			this.initData();
			this.dateText.ele.innerHTML = this.toYearMonthString();
			if(this._pageUpdateHandler != null){
				this._pageUpdateHandler();
			}
		};
		//向前翻一年
		DateBox.prototype.previousYear = function(){
			if(this._year - 1 < 1970){
				return;
			}
			this._year --;
			this.initData();
			this.dateText.ele.innerHTML = this.toYearMonthString();
			if(this._pageUpdateHandler != null){
				this._pageUpdateHandler();
			}
		};
		//向后翻一个月
		DateBox.prototype.nextMonth = function(){
			var temp = this._month + 1;
			if(temp > 12){
				this._year ++;
				this._month = 1;
			}else{
				this._month = temp;
			}
			temp = null;
			this.initData();
			this.dateText.ele.innerHTML = this.toYearMonthString();
			if(this._pageUpdateHandler != null){
				this._pageUpdateHandler();
			}
		};
		//向后翻一年
		DateBox.prototype.nextYear = function(){
			this._year ++;
			this.initData();
			this.dateText.ele.innerHTML = this.toYearMonthString();
			if(this._pageUpdateHandler != null){
				this._pageUpdateHandler();
			}
		};
		
		//将星期转换为字符串格式
		DateBox.prototype.toWeekString = function(weekNum){
			var week = "";
			switch(weekNum){ 
				case 1:
					week = "星期一";
					break;
				case 2:
					week = "星期二";
					break;
				case 3:
					week = "星期三";
					break;
				case 4:
					week = "星期四";
					break;
				case 5:
					week = "星期五";
					break;
				case 6:
					week = "星期六";
					break;
				case 0:
					week = "星期日";
					break;
				
				default:
					break;
			}
			return week;
		};
		//在对象下方左对齐显示
		DateBox.prototype.showBelowLeft = function(obj){
			var otop = obj.offsetTop;
			var oleft = obj.offsetLeft;
			var cheight = obj.clientHeight;
			this.view.ele.style.top = (otop + cheight + 2)+"px";
			this.view.ele.style.left = oleft+"px";
			this.view.ele.style.display = "block";
			this.bg.ele.style.display = "block";
		};
		//隐藏窗体
		DateBox.prototype.hide = function (){
			this.view.ele.style.display = "none";
			this.bg.ele.style.display = "none";
		};
		DateBox.prototype.show = function(left, top){
			this.view.ele.style.top = top;
			this.view.ele.style.left = left;
			this.view.ele.style.display = "block";
			this.bg.ele.style.display = "block";
		};
		//销毁窗体
		DateBox.prototype.destroy = function(){
			var body = document.getElementsByTagName("body")[0];
			body.removeChild(this.bg.ele);
			body.removeChild(this.view.ele);
			this.view = null;
			this.bg = null;
		};
		this.initDate();
		this.initView();
		this.initData();
	};
	
	/*DateBoxItem private*/
	var DateBoxItem = function(obj){
		this._element = obj;
		this.data = "";
		this.isWeek = false;
		this.isToday = false;
		this._clickHandle = null;
		
		DateBoxItem.prototype._init = function(){
			var context = this;
			this._element.onclick = function(){
				context._onClickEvent();
			};
		};
		
		DateBoxItem.prototype.getElement = function(){
			return this._element;
		};
		
		DateBoxItem.prototype.addClickHandler = function(funName){
			this._clickHandle = funName;
		};
		
		DateBoxItem.prototype.removeClickHandler = function(){
			this._clickHandle = null;
		};
		
		DateBoxItem.prototype.setData = function(data){
			this.data = data;
		};
		
		DateBoxItem.prototype._onClickEvent = function(){
			if(this._clickHandle != null){
				this._clickHandle(this);
			}
		};
		
		this._init();
	};
})();
