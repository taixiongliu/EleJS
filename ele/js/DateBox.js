(function(){
	var DateBox = Ele.DateBox = function(args){
		this.eleType = "layout";
		this.ele;
		this.view;
		this.edit;
		this.windowType;
		this.dateView;
		this.masking;
		this.position;
		this.offset;
		
		this._disable;
		this._itemClickEvent = null;
		this._updateEvent = null;
		this._onErrorResponse = null;
		
		DateBox.prototype.setWindowOffset = function(size){
			if(this.windowType){
				this.offset = size;
			}
		};
		
		DateBox.prototype.setOnItemClick = function(event){
			if(typeof(event) == "function"){
				this._itemClickEvent = event;
			}
		};
		DateBox.prototype.setOnSelectChange = function(event){
			if(typeof(event) == "function"){
				this._updateEvent = event;
			}
		};
		
		DateBox.prototype.setValue = function(value){
			if(typeof(value) == "undefined"){
				return ;
			}
			if(value instanceof Date){
				this.dateView.setDate(value);
				return ;
			}
			if(typeof(value) == "string"){
				this.dateView.setDateString(value);
			}
		};
		DateBox.prototype.reset = function(){
			this.edit.setValue("");
			this.dateView.setDate(new Date());
		};
		DateBox.prototype.setPattern = function(pattern){
			this.dateView.setPattern(pattern);
		};
		
		DateBox.prototype.getValue = function(){
			return this.edit.getValue();
		};
		
		DateBox.prototype.showErrorStyle = function(){
			this.ele.className = "ele_datebox_style_error";
		};
		DateBox.prototype.clearErrorStyle = function(){
			this.ele.className = "ele_datebox";
		};
		DateBox.prototype.expend = function(){
			if(this.windowType){
				this.position.inBottomLeft(this.view.ele);
				if(this.offset != null && this.offset instanceof Ele.Utils.Size){
					this.position.setOffset(this.offset);
				}
				this.masking.setContent(this.dateView, this.position);
				this.masking.showMasking();
				this.dateView.show();
				var context = this;
				this.masking.setHiddenHandler(function(){
					context._onBlur();
				});
				return;
			}
			this.masking.setContentNone();
			this.masking.showMasking();
			var context = this;
			this.masking.setHiddenHandler(function(){
				context._onBlur();
			});
			this.dateView.show();
		};
		
		DateBox.prototype.hide = function (){
			if(this.windowType){
				this.masking.hideMasking();
				return ;
			}
			this.dateView.hide();
			this.masking.hideMasking();
		};
		
		DateBox.prototype.setDisable = function (disable){
			if(typeof(disable) == "boolean"){
				this._disable = disable;
				this.edit.ele.readOnly = disable;
			}
		};
		DateBox.prototype._onItemClick = function(dateString){
			if(this._itemClickEvent != null){
				this._itemClickEvent();
			}
			this.ele.className = "ele_datebox";
			this.hide();
		};
		DateBox.prototype._onSelectUpdate = function(){
			if(this._itemClickEvent != null){
				this._itemClickEvent();
			}
			this.ele.className = "ele_datebox";
			this.hide();
			this.edit.setValue(this.dateView.getSelectDateString());
		};
		DateBox.prototype._onBlur = function(){
			this.ele.className = "ele_datebox";
			this.edit.setValue(this.dateView.getSelectDateString());
			//非窗口类型需要关闭本地窗口
			if(!this.windowType){
				this.dateView.hide();
				this.masking.hideMasking();
			}
		};
		
		DateBox.prototype._onFocus = function(){
			if(this._disable){
				this.ele.className = "ele_datebox_disable_focus";
				return ;
			}else{
				this.ele.className = "ele_datebox_focus";
			}
			this.edit.setValue(this.dateView.getSelectDateString());
			this.expend();
		};
		
		DateBox.prototype._updateValue = function(){
			var value = this.getValue();
			if(value.trim() != "" && value.length >= this.dateView.getPattern().length){
				var res = this.dateView.validateDateString(value);
				if(res){
					this.setValue(value);
				}
			}
		};
		
		DateBox.prototype._init = function(){
			this.view = new Ele.Layout("ele_datebox");
			this.ele = this.view.ele;
			this._disable = false;
			this.windowType = false;
			var context = this;
			this.masking = Ele.masking;
			if(typeof(args) == "object"){
				if(typeof(args.style) != "undefined"){
					this.ele.className = args.style;
				}
				if(typeof(args.disable) == "boolean" && args.disable){
					this._disable = args.disable;
				}
				if(typeof(args.onItemClick) == "function"){
					this._itemClickEvent = args.onItemClick;
				}
				if(typeof(args.selectChange) == "function"){
					this._updateEvent = args.selectChange;
				}
				if(typeof(args.windowType) == "boolean" && args.windowType){
					this.windowType = true;
				}
			}
			this.dateView = new DateView();
			this.dateView.setItemClickHandler(function(dateString){
				context._onItemClick(dateString);
			});
			this.dateView.setSelectUpdateHandler(function(){
				context._onSelectUpdate();
			});
			if(this.windowType){
				this.position = new Ele.Utils.Position();
			}else{
				this.dateView.ele.style.zIndex = this.masking.maxZIndex + 1;
				this.dateView.ele.style.marginTop = 33+"px";
				this.view.add(this.dateView);
			}
			
			var contentView = new Ele.HLayout("ele_datebox_panle");
			contentView.ele.onclick = function(){
				context._onFocus();
			};
			
			this.edit = new Ele.TextBox({style:"ele_datebox_intut_style"});
			this.edit.ele.onblur = function(e){
				context._updateValue();
			};
			if(this._disable){
				this.edit.ele.readOnly = true;
			}
			contentView.add(this.edit);
			var iconView = new Ele.Layout("ele_datebox_icon_view");
			var icon = new Ele.Img(Ele._pathPrefix+"ele/"+Ele._skin+"/assets/96/icon_date.png","ele_datebox_icon");
			iconView.add(icon);
			contentView.add(iconView);
			
			this.view.add(contentView);
		};
		this._init();
	};
	
	/**
	 * 时间面板
	 */
	var DateView = Ele.DateView = function(){
		this.eleType = "layout";
		this.ele;
		this.view;
		//时间文本显示
		this.dateText;
		//时间元素VIEW
		this.daysView = [];
		this._year;
		this._month;
		this._day;
		this._dateFormat;
		//选择的ITEM
		this._selected = null;
		//选择的日期字符串
		this._selectedDateString = "";
		this._itemClickHandler = null;
		this._selectedUpdateHandler = null;
		this._pageUpdateHandler = null;
		
		//初始化布局
		DateView.prototype.initView = function(){
			var context = this;
			this.view = new Ele.Layout("ele_dateview_panel");
			this.ele = this.view.ele;
			
			//标题布局
			var titleView = new Ele.HLayout("ele_dateview_title_view");
			var titleLeft = new Ele.Layout("ele_dateview_title_left_view");
			titleLeft.setAlign("center");
			var titleCenter = new Ele.Layout("ele_dateview_title_center_view");
			titleCenter.setAlign("center");
			var titleRight = new Ele.Layout("ele_dateview_title_right_view");
			titleRight.setAlign("center");
			var iconLeft = new Ele.Img(Ele._pathPrefix+"ele/"+Ele._skin+"/assets/96/icon_left.png", "ele_dateview_title_icon ele_ml20");
			iconLeft.ele.onclick = function(){
				context.previousMonth();
			};
			var icon2Left = new Ele.Img(Ele._pathPrefix+"ele/"+Ele._skin+"/assets/96/icon_2_left.png", "ele_dateview_title_icon");
			icon2Left.ele.onclick = function(){
				context.previousYear();
			};
			this.dateText = new Ele.Label(this._year+"-"+this._month, "ele_dateview_date_txt");
			var iconRight = new Ele.Img(Ele._pathPrefix+"ele/"+Ele._skin+"/assets/96/icon_right.png", "ele_dateview_title_icon");
			iconRight.ele.onclick = function(){
				context.nextMonth();
			};
			
			var icon2Right = new Ele.Img(Ele._pathPrefix+"ele/"+Ele._skin+"/assets/96/icon_2_right.png", "ele_dateview_title_icon ele_ml20");
			icon2Right.ele.onclick = function(){
				context.nextYear();
			};
			titleLeft.add(icon2Left);
			titleLeft.add(iconLeft);
			titleCenter.add(this.dateText);
			titleRight.add(iconRight);
			titleRight.add(icon2Right);
			
			titleView.add(titleLeft,{width:"25%"});
			titleView.add(titleCenter,{width:"50%"});
			titleView.add(titleRight,{width:"25%"});
			
			//星期标题布局
			var weekView = new Ele.Layout("ele_dateview_week_view");
			var weeks = ["一","二","三","四","五","六","日"];
			for(var index in weeks){
				var item = new Ele.Layout("ele_dateview_week_item");
				item.setAlign("center");
				item.setHtml(weeks[index]);
				weekView.add(item);
			}
			var weekFc = new Ele.Layout("ele_cl");
			weekView.add(weekFc);
			
			this.view.add(titleView);
			this.view.add(weekView);
			var divider = new Ele.Layout("ele_dateview_divider");
			this.view.add(divider);
			
			//时间元素布局
			for(var row = 0; row < 6; row ++){
				var rowView = new Ele.HLayout("ele_dateview_line_view");
				var rowViews = [];
				for(var col = 0; col < 7; col ++){
					var dateItem = new DateItem();
					rowView.add(dateItem, {padding:"0 0 0 8px"});
					rowViews.push(dateItem);
				}
				this.daysView.push(rowViews);
				this.view.add(rowView);
			}
		};
		
		//初始化时间，默认为今天
		DateView.prototype.initDate = function(){
			var now = new Date();
			this._year = now.getFullYear();
			this._month = now.getMonth() + 1;
			this._day = now.getDate();
			this._dateFormat = new Ele.Utils.DateFormat();
		};
		//初始化数据（指定元素布局填充元素数据）
		DateView.prototype.initData = function(){
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
					dayItem.setHtml(data);
					if(data == ""){
						dayItem.removeClickHandler();
						dayItem.ele.className = "ele_dateview_line_item";
					}else{
						dayItem.addClickHandler(function(item){
							context._onItemClick(item);
						});
						dayItem.setData(data);
						dayItem.ele.className = "ele_dateview_line_item ele_dateview_line_item_full";
						if(col > 4){
							dayItem.isWeek = true;
							dayItem.ele.className = "ele_dateview_line_item ele_dateview_line_item_week";
						}
						var tempDay = data;
						if(new Number(data) < 10){
							tempDay = "0"+data;
						}
						if((yearAndMonth +"-"+tempDay) == this._selectedDateString){
							dayItem.ele.className = "ele_dateview_line_item ele_dateview_line_item_select";
							this._selected = dayItem;
						}
					}
					
					if(this._year == year && this._month == month && new Number(data) == day){
						dayItem.isToday = true;
						dayItem.ele.className = "ele_dateview_line_item ele_dateview_line_item_today";
					}
				}
			}
		};
		
		//设置日期选择更新事件
		DateView.prototype.setSelectUpdateHandler = function(funName){
			if(typeof(funName) == "function"){
				this._selectedUpdateHandler = funName;
			}
		};
		//移除日期选择更新事件
		DateView.prototype.removeSelectUpdateHandler = function(){
			this._selectedUpdateHandler = null;
		};
		//设置日期元素点击事件
		DateView.prototype.setItemClickHandler = function(funName){
			if(typeof(funName) == "function"){
				this._itemClickHandler = funName;
			}
		};
		//移除日期选择更新事件
		DateView.prototype.removeItemClickHandler = function(){
			this._itemClickHandler = null;
		};
		//设置日期翻页事件
		DateView.prototype.setPageUpdateHandler = function(funName){
			if(typeof(funName) == "function"){
				this._pageUpdateHandler = funName;
			}
		};
		//移除日期翻页事件
		DateView.prototype.removePageUpdateHandler = function(){
			this._pageUpdateHandler = null;
		};
		
		DateView.prototype.getSelectDateString = function(){
			return this._selectedDateString;
		};
		
		//捕捉元素点击事件
		DateView.prototype._onItemClick = function(item){
			if(this._selected != null){
				if(item.data == this._selected.data){
					if(this._itemClickHandler != null){
						this._itemClickHandler(this._selectedDateString);
					}
					this.hide();
					return ;
				}
				if(!this._selected.isToday){
					if(this._selected.isWeek){
						this._selected.ele.className = "ele_dateview_line_item ele_dateview_line_item_week";
					}else{
						this._selected.ele.className = "ele_dateview_line_item ele_dateview_line_item_full";
					}
				}
			}
			if(!item.isToday){
				item.ele.className = "ele_dateview_line_item ele_dateview_line_item_select";
			}
			//设置选择对象
			this._selected = item;
			//设置当前DAY
			this._day = new Number(item.data);
			//设置当前选择的日期
			this._selectedDateString = this.toDateString();
			if(this._itemClickHandler != null){
				this._itemClickHandler(this._selectedDateString);
			}
			this.hide();
			if(this._selectedUpdateHandler != null){
				this._selectedUpdateHandler();
			}
		};
		
		//生成所有时间元素二位数组数据
		DateView.prototype.getArrayData = function(){
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
		DateView.prototype.getDays = function(){
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
		//设置文本封装格式
		DateView.prototype.setPattern = function(pattern){
			this._dateFormat.setPattern(pattern);
		};
		//获取文本封装格式
		DateView.prototype.getPattern = function(){
			return this._dateFormat.getPattern();
		};
		//获取选择的日期
		DateView.prototype.toDate = function(){
			return new Date(this._year, this._month - 1, this._day);
		};
		//将时间转换为字符串格式
		DateView.prototype.toDateString = function(){
			var date = this.toDate();
			return this._dateFormat.format(date);
		};
		
		//设置日期
		DateView.prototype.setDate = function(date){
			if(!(date instanceof Date)){
				return false;
			}
			this._year = date.getFullYear();
			this._month = date.getMonth() + 1;
			this._day = date.getDate();
			
			//设置选择日期
			this._selectedDateString = this.toDateString();
			
			this.initData();
			this.dateText.ele.innerHTML = this.toYearMonthString();
			if(this._selectedUpdateHandler != null){
				this._selectedUpdateHandler();
			}
			return true;
		};
		//设置日期字符串
		DateView.prototype.setDateString = function(str){
			if(typeof(str) != "string"){
				return false;
			}
			var date = null;
			try{
				date = this._dateFormat.parse(str);
			}catch(e){
				//TODO handle the exception
				console.log(e.message);
			}
			if(date == null){
				return false;
			}
			if(date instanceof Date && date.getTime() != "" && !isNaN(date.getTime())){
				return this.setDate(date);
			}
			return false;
		};
		//日期字符串校验
		DateView.prototype.validateDateString = function(str){
			if(typeof(str) != "string"){
				return false;
			}
			var date = null;
			try{
				date = this._dateFormat.parse(str);
			}catch(e){
				//TODO handle the exception
			}
			if(date instanceof Date && date.getTime() != "" && !isNaN(date.getTime())){
				return true;
			}
			return false;
		};
		
		//转换成只有年-月的时间字符串
		DateView.prototype.toYearMonthString = function(){
			var year = this._year;
			var month = this._month+"";
			if(this._month < 10){
				month = "0"+month;
			}
			return year+"-"+month;
		};
		
		//向前翻一个月
		DateView.prototype.previousMonth = function(){
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
		DateView.prototype.previousYear = function(){
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
		DateView.prototype.nextMonth = function(){
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
		DateView.prototype.nextYear = function(){
			this._year ++;
			this.initData();
			this.dateText.ele.innerHTML = this.toYearMonthString();
			if(this._pageUpdateHandler != null){
				this._pageUpdateHandler();
			}
		};
		
		//隐藏窗体
		DateView.prototype.hide = function (){
			this.view.ele.style.display = "none";
		};
		DateView.prototype.show = function(){
			this.view.ele.style.display = "block";
		};
		
		this.initDate();
		this.initView();
		this.initData();
	};
	
	/*DateItem private*/
	var DateItem = function(obj){
		this.eleType = "layout";
		this.ele;
		this.view;
		this.data = "";
		this.isWeek = false;
		this.isToday = false;
		this._clickHandle = null;
		
		DateItem.prototype.addClickHandler = function(funName){
			this._clickHandle = funName;
		};
		
		DateItem.prototype.removeClickHandler = function(){
			this._clickHandle = null;
		};
		
		DateItem.prototype.setData = function(data){
			this.data = data;
		};
		
		DateItem.prototype.setHtml = function(text){
			this.view.setHtml(text);
		};
		
		DateItem.prototype._onClickEvent = function(){
			if(this._clickHandle != null){
				this._clickHandle(this);
			}
		};
		
		DateItem.prototype._init = function(){
			this.view = new Ele.Layout("ele_dateview_line_item");
			this.ele = this.view.ele;
			var context = this;
			this.ele.onclick = function(){
				context._onClickEvent();
			};
		};
		
		this._init();
	};
})();
