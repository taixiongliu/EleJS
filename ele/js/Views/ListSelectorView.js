(function(){
	var ListSelectorView = Ele.Views.ListSelectorView = function(){
		this.eleType = "layout";
		this.ele;
		this.view;
		this.width = 740;
		this.height = 460;
		this.leftView;
		this.rightView;
		this.leftEmpty;
		this.rightEmpty;
		this.leftItems;
		this.rightItems;
		this.leftSelectIndex;
		this.rightSelectIndex;
		this.controller;
		this._onErrorResponse = null;
		this._onDataLoad = null;
		this._dataFormat = null;
		this._onUpdate = null;
		
		ListSelectorView.prototype.setDataFormat = function(event){
			if(typeof(event) == "function"){
				this._dataFormat = event;
			}
		};
		ListSelectorView.prototype.setOnUpdate = function(event){
			if(typeof(event) == "function"){
				this._onUpdate = event;
			}
		};
		ListSelectorView.prototype.setOnDataLoad = function(event){
			if(typeof(event) == "function"){
				this._onDataLoad = event;
			}
		};
		ListSelectorView.prototype.getSelectedValues = function(){
			var res = [];
			for(var i in this.rightItems){
				res.push(this.rightItems[i].value);
			}
			return res;
		};
		ListSelectorView.prototype.getSelectedStringValues = function(){
			var res = "";
			for(var i in this.rightItems){
				res += this.rightItems[i].value+",";
			}
			if(res != ""){
				res = res.substr(0, res.length - 1);
			}
			return res;
		};
		ListSelectorView.prototype.setValues = function(values){
			if(this.leftItems.length < 1 || values.length < 1){
				return ;
			}
			for(var val in values){
				var value = values[val];
				if(typeof(format) == "function"){
					value = format(value);
					if(typeof(value) == "undefined"){
						break;
					}
				}
				for(var i in this.leftItems){
					if(this.leftItems[i].value === value){
						this.leftSelectIndex = i;
						this.addMove();
						break;
					}
				}
			}
		};
		ListSelectorView.prototype.setStringValues = function(values, format){
			if(this.leftItems.length < 1){
				return ;
			}
			var arr = values.split(",");
			for(var val in arr){
				var value = arr[val];
				if(typeof(format) == "function"){
					value = format(value);
					if(typeof(value) == "undefined"){
						break;
					}
				}
				for(var i in this.leftItems){
					if(this.leftItems[i].value === value){
						this.leftSelectIndex = i;
						this.addMove();
						break;
					}
				}
			}
		};
		ListSelectorView.prototype.clear = function(){
			this.leftView.clear();
			this.rightView.clear();
			this.leftItems = [];
			this.rightItems = [];
			this.leftSelectIndex = -1;
			this.rightSelectIndex = -1;
			this.leftView.add(this.leftEmpty);
			this.rightView.add(this.rightEmpty);
		};
		ListSelectorView.prototype.loadDataSourcesUrl = function(url, funError){
			if(typeof(funError) == "function"){
				this._onErrorResponse = funError;
			}
			this.controller.loadData(url);
		};
		ListSelectorView.prototype.loadDataSources = function(datasources){
			this.clear();
			var context = this;
			
			if(datasources.length > 0){
				for(var i = 0; i < datasources.length; i ++){
					this.addValue(datasources[i]);
				}
			}
			if(this._onDataLoad != null){
				this._onDataLoad();
			}
		};
		ListSelectorView.prototype.addMove = function(){
			if(this.leftSelectIndex == -1){
				return ;
			}
			var object = this.leftItems[this.leftSelectIndex];
			//右侧添加
			this.addRightItem(object.text, object.value, object.data);
			//移除布局
			this.leftView.remove(object.view);
			//移除数据
			this.leftItems.splice(this.leftSelectIndex, 1);
			//角标维护
			for(var i = this.leftSelectIndex; i < this.leftItems.length; i++){
				this.leftItems[i].view.ele.index = i;
				var css = "ele_list_selector_item ";
				if(i % 2 == 0){
					css += "ele_list_selector_item_single";
				}else{
					css += "ele_list_selector_item_double";
				}
				this.leftItems[i].view.ele.className = css;
			}
			if(this.leftItems.length == 0){
				this.leftView.add(this.leftEmpty);
			}
			this.leftSelectIndex = -1;
			if(this._onUpdate != null){
				this._onUpdate({eventType:"addMove",data:this.rightItems[this.rightItems.length - 1]});
			}
		};
		ListSelectorView.prototype.subMove = function(){
			if(this.rightSelectIndex == -1){
				return ;
			}
			var object = this.rightItems[this.rightSelectIndex];
			//侧添加
			this.addLeftItem(object.text, object.value, object.data);
			//移除布局
			this.rightView.remove(object.view);
			//移除数据
			this.rightItems.splice(this.rightSelectIndex, 1);
			//角标维护
			for(var i = this.rightSelectIndex; i < this.rightItems.length; i++){
				this.rightItems[i].view.ele.index = i;
				var css = "ele_list_selector_item ";
				if(i % 2 == 0){
					css += "ele_list_selector_item_single";
				}else{
					css += "ele_list_selector_item_double";
				}
				this.rightItems[i].view.ele.className = css;
			}
			if(this.rightItems.length == 0){
				this.rightView.add(this.rightEmpty);
			}
			this.rightSelectIndex = -1;
			if(this._onUpdate != null){
				this._onUpdate({eventType:"subMove",data:this.leftItems[this.leftItems.length - 1]});
			}
		};
		ListSelectorView.prototype.addValue = function(data){
			if(this._dataFormat != null){
				this._dataFormat(data);
			}
			this.addLeftItem(data.text, data.value, data.data);
		};
		
		ListSelectorView.prototype.addLeftItem = function(text, value, data){
			if(typeof(text) =="undefined" || typeof(value) =="undefined"){
				return ;
			}
			var context = this;
			var index = this.leftItems.length;
			if(index == 0){
				this.leftView.remove(this.leftEmpty);
			}
			var css = "ele_list_selector_item ";
			if(index % 2 == 0){
				css += "ele_list_selector_item_single";
			}else{
				css += "ele_list_selector_item_double";
			}
			var item = new Ele.Layout(css);
			item.setHtml(text);
			this.leftView.add(item);
			var object = {view:item, text:text, value:value, data:data};
			//填充index
			item.ele.index = index;
			item.ele.onclick = function(){
				context._onLeftItemSelected(this.index);
			}
			this.leftItems.push(object);
		};
		ListSelectorView.prototype.addRightItem = function(text, value, data){
			if(typeof(text) =="undefined" || typeof(value) =="undefined"){
				return ;
			}
			var context = this;
			var index = this.rightItems.length;
			if(index > 0){
				var divider = new Ele.Layout("ele_list_selector_item_divider");
				this.rightView.add(divider);
			}else{
				this.rightView.remove(this.rightEmpty);
			}
			var css = "ele_list_selector_item ";
			if(index % 2 == 0){
				css += "ele_list_selector_item_single";
			}else{
				css += "ele_list_selector_item_double";
			}
			var item = new Ele.Layout(css);
			item.setHtml(text);
			this.rightView.add(item);
			var object = {view:item, text:text, value:value, data:data};
			//填充index
			item.ele.index = index;
			item.ele.onclick = function(){
				context._onRightItemSelected(this.index);
			}
			this.rightItems.push(object);
		};
		ListSelectorView.prototype.selectLeftItem = function(index){
			if(index < 0 || index >= this.leftItems.length){
				return ;
			}
			if(this.leftSelectIndex == index){
				return ;
			}
			this.leftItems[index].view.ele.className = "ele_list_selector_item ele_list_selector_item_select";
			if(this.leftSelectIndex != -1){
				var css = "ele_list_selector_item ";
				if(this.leftSelectIndex % 2 == 0){
					css += "ele_list_selector_item_single";
				}else{
					css += "ele_list_selector_item_double";
				}
				this.leftItems[this.leftSelectIndex].view.ele.className = css;
			}
			this.leftSelectIndex = index;
		};
		ListSelectorView.prototype.selectRightItem = function(index){
			if(index < 0 || index >= this.rightItems.length){
				return ;
			}
			if(this.rightSelectIndex == index){
				return ;
			}
			this.rightItems[index].view.ele.className = "ele_list_selector_item ele_list_selector_item_select";
			if(this.rightSelectIndex != -1){
				var css = "ele_list_selector_item ";
				if(this.rightSelectIndex % 2 == 0){
					css += "ele_list_selector_item_single";
				}else{
					css += "ele_list_selector_item_double";
				}
				this.rightItems[this.rightSelectIndex].view.ele.className = css;
			}
			this.rightSelectIndex = index;
		};
		
		ListSelectorView.prototype._onLeftItemSelected = function(index){
			this.selectLeftItem(index);
		};
		ListSelectorView.prototype._onRightItemSelected = function(index){
			this.selectRightItem(index);
		};
		
		ListSelectorView.prototype._onDataResponse = function(dataSources){
			this.loadDataSources(dataSources);
		};
		
		ListSelectorView.prototype._init = function(){
			var context = this;
			this.view = new Ele.Layout("ele_list_selector_view");
			this.ele = this.view.ele;
			this.leftItems = [];
			this.rightItems = [];
			this.leftSelectIndex = -1;
			this.rightSelectIndex = -1;
			
			var panel = new Ele.Layout("ele_list_selector_panel");
			this.leftView = new Ele.Layout("ele_list_selector_item_view ele_scrollbar");
			var centerView = new Ele.Layout("ele_list_selector_bar_view");
			this.rightView = new Ele.Layout("ele_list_selector_item_view ele_scrollbar");
			var cl = new Ele.Layout("ele_cl");
			
			this.leftEmpty = new Ele.Layout("ele_list_selector_empty");
			this.rightEmpty = new Ele.Layout("ele_list_selector_empty");
			this.leftEmpty.setHtml("暂无数据");
			this.rightEmpty.setHtml("暂无数据");
			this.leftView.add(this.leftEmpty);
			this.rightView.add(this.rightEmpty);
			
			var barView = new Ele.Layout("ele_list_selector_bar_panel");
			barView.setAlign("center");
			centerView.add(barView);
			
			var btn_add = new Ele.Button({text:"添加", iconRight:true, icon:Ele._pathPrefix+"ele/assets/24/icon_2_right.png",onclick:function(){
				context.addMove();
			}});
			var btn_sub = new Ele.Button({text:"移除", icon:Ele._pathPrefix+"ele/assets/24/icon_2_left.png",onclick:function(){
				context.subMove();
			}});
			barView.add(btn_add);
			barView.add(new Ele.Layout("ele_list_selector_bar_divider"));
			barView.add(btn_sub);
			
			panel.add(this.leftView);
			panel.add(centerView);
			panel.add(this.rightView);
			panel.add(cl);
			
			this.view.add(panel);
			
			this.controller = new Ele.Controllers.BaseController({
				loadHandler:function(data){
					context._onDataResponse(data);
				},
				errorHandler:function(error){
					if(context._onErrorResponse != null){
						context._onErrorResponse(error);
					}
				}
			});
		};
		
		this._init();
	};
})();