(function(){
	var SelectBox = Ele.SelectBox = function(args){
		this.eleType = "layout";
		this.ele;
		this.view;
		this.hintView;
		this.edit;
		this.windowType;
		this.listView;
		this.masking;
		this.filter;
		this.optionList;
		this.optionController;
		this.filterController;
		this.position;
		this.offset;
		
		this._disable;
		this._options = [];
		this._selectIndex = -1;
		this._itemClickEvent = null;
		this._updateEvent = null;
		this._filterSearchEvent = null;
		this._onErrorResponse = null;
		this._onFilterErrorResponse = null;
		
		SelectBox.prototype.setWindowOffset = function(size){
			if(this.windowType){
				this.offset = size;
			}
		};
		
		SelectBox.prototype.setOnItemClick = function(event){
			if(typeof(event) == "function"){
				this._itemClickEvent = event;
			}
		};
		SelectBox.prototype.setOnSelectChange = function(event){
			if(typeof(event) == "function"){
				this._updateEvent = event;
			}
		};
		SelectBox.prototype.setOnFilterSearch = function(event){
			if(typeof(event) == "function"){
				this._filterSearchEvent = event;
			}
		};
		SelectBox.prototype.setOptions = function(items){
			this.optionList.clear();
			this._options = [];
			this._selectIndex = -1;
			this.edit.setValue("");
			var context = this;
			
			if(items.length > 0){
				for(var i = 0; i < items.length; i ++){
					var option = new Option(items[i].text, items[i].value);
					option.eleId = i;
					option.setClickEvent(function(){
						context._onItemClick(this.eleId);
					});
					this._options.push(option);
					this.optionList.add(option);
					if(i != items.length - 1){
						var odivider = new Ele.Layout("ele_selectbox_option_divider");
						this.optionList.add(odivider);
					}
				}
			}
		};
		SelectBox.prototype.loadFilterDataSourcesUrl = function(url, keyValue, funError){
			if(typeof(funError) == "function"){
				this._onFilterErrorResponse = funError;
			}
			if(typeof(keyValue) == "string" && keyValue.trim() != ""){
				this.filterController.setParameter("keyvalue="+keyValue);
			}
			this.filterController.loadData(url);
		};
		
		SelectBox.prototype.loadDataSourcesUrl = function(url, funError){
			if(typeof(funError) == "function"){
				this._onErrorResponse = funError;
			}
			this.optionController.loadData(url);
		};
		SelectBox.prototype.setValue = function(value){
			if(typeof(value) == "undefined"){
				return ;
			}
			var vIndex = -1;
			for(var index = 0; index < this._options.length; index ++){
				if(this._options[index].value == value){
					vIndex = index;
					break;
				}
			}
			this.selectIndex(vIndex);
		};
		SelectBox.prototype.reset = function(){
			this.setFilterData([]);
			this._selectIndex = -1;
			this.edit.setValue("");
		};
		SelectBox.prototype.selectIndex = function(index){
			//越界角标
			if(index < 0 || index >= this._options.length){
				return ;
			}
			//防止智推选择同选项不更新文本
			this.edit.setValue(this._options[index].text);
			//与当前选择角标选择一致
			if(this._selectIndex == index){
				return ;
			}
			
			if(this._selectIndex > -1){
				this._options[this._selectIndex].clearSelectedStyle();
			}
			this._options[index].setSelectedStyle();
			this._selectIndex = index;
			if(this._updateEvent != null){
				this._updateEvent(index);
			}
		};
		
		SelectBox.prototype.getValue = function(){
			if(this._selectIndex < 0){
				return "";
			}
			return this._options[this._selectIndex].value;
		};
		
		SelectBox.prototype.showErrorStyle = function(){
			this.ele.className = "ele_selectbox_style_error";
		};
		SelectBox.prototype.clearErrorStyle = function(){
			this.ele.className = "ele_selectbox";
		};
		SelectBox.prototype.expend = function(){
			if(this.windowType){
				this.position.inBottomLeft(this.view.ele);
				if(this.offset != null && this.offset instanceof Ele.Utils.Size){
					this.position.setOffset(this.offset);
				}
				this.masking.setContent(this.listView, this.position);
				this.masking.showMasking();
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
			this.listView.ele.style.display = "block";
		};
		
		SelectBox.prototype.hide = function (){
			if(this.windowType){
				this.masking.hideMasking();
				return ;
			}
			this.listView.ele.style.display = "none";
			this.masking.hideMasking();
		};
		
		SelectBox.prototype.setFilterData = function (data){
			if(!Ele._isArray(data)){
				return ;
			}
			this.filter.clear();
			if(data.length < 1){
				var empty = new Ele.Layout("ele_selectbox_filter_empty");
				empty.setHtml("暂无推荐数据");
				this.filter.add(empty);
				return ;
			}
			var context = this;
			for(var i in data){
				var foption = new FilterOption(data[i].text, data[i].value, data[i].filterView);
				foption.setClickEvent(function(){
					context._onFilterItemClick(this.value);
				});
				this.filter.add(foption);
				if(i < data.length - 1){
					var fdivier = new Ele.Layout("ele_selectbox_option_divider");
					this.filter.add(fdivier);
				}
			}
		};
		SelectBox.prototype.setDisable = function (disable){
			if(typeof(disable) == "boolean"){
				this._disable = disable;
				this.edit.ele.readOnly = disable;
			}
		};
		SelectBox.prototype._onFilterDataResponse = function(dataSources){
			if(!Ele._isArray(dataSources)){
				this.setFilterData([]);
				return ;
			}
			var fitems = [];
			for(var i in dataSources){
				var filterView = new Ele.OptionFilter();
				if(typeof(dataSources[i].filter) == "string"){
					if(dataSources[i].filter.indexOf(";") > -1){
						var farr = dataSources[i].filter.split(";");
						for(var f in farr){
							if(farr[f].length < 1){
								continue;
							}
							if(farr[f].charAt(0) == "@"){
								filterView.appendNormal(farr[f].substring(1, farr[f].length));
								continue;
							}
							if(farr[f].charAt(0) == "#"){
								filterView.appendFilter(farr[f].substring(1, farr[f].length));
								continue;
							}
						}
					}
				}
				var item = {text:dataSources[i].text, value:dataSources[i].value,filterView:filterView};
				
				fitems.push(item);
			}
			this.setFilterData(fitems);
		};
		SelectBox.prototype._onDataResponse = function(dataSources){
			this.setOptions(dataSources);
		};
		SelectBox.prototype._onFilterItemClick = function (value){
			this.ele.className = "ele_selectbox";
			this.hide();
			this.setValue(value);
		};
		SelectBox.prototype._onFilterKey = function(){
			if(this._filterSearchEvent != null){
				this._filterSearchEvent(this.edit.getValue());
			}
		};
		SelectBox.prototype._onItemClick = function(index){
			if(this._itemClickEvent != null){
				this._itemClickEvent();
			}
			this.ele.className = "ele_selectbox";
			this.hide();
			this.selectIndex(index);
		};
		SelectBox.prototype._onBlur = function(){
			this.ele.className = "ele_selectbox";
			if(this._selectIndex > -1){
				this.edit.setValue(this._options[this._selectIndex].text);
			}else{
				this.edit.setValue("");
			}
			this.setFilterData([]);
			//非窗口类型需要关闭本地窗口
			if(!this.windowType){
				this.hide();
			}
		};
		
		SelectBox.prototype._onFocus = function(){
			if(this._disable){
				this.ele.className = "ele_selectbox_disable_focus";
				return ;
			}else{
				this.ele.className = "ele_selectbox_focus";
			}
			if(this._selectIndex > -1){
				this.edit.setValue(this._options[this._selectIndex].text);
			}else{
				this.edit.setValue("");
			}
			this.setFilterData([]);
			this.expend();
		};
		
		SelectBox.prototype._init = function(){
			this.view = new Ele.Layout("ele_selectbox");
			this.ele = this.view.ele;
			this._disable = false;
			this.windowType = false;
			var items = [];
			var context = this;
			this.masking = Ele.masking;
			if(typeof(args) == "object"){
				if(typeof(args.style) != "undefined"){
					this.ele.className = args.style;
				}
				if(typeof(args.disable) == "boolean" && args.disable){
					this._disable = args.disable;
				}
				if(Ele._isArray(args.items)){
					items = args.items;
				}
				if(typeof(args.onItemClick) == "function"){
					this._itemClickEvent = args.onItemClick;
				}
				if(typeof(args.selectChange) == "function"){
					this._updateEvent = args.selectChange;
				}
				if(typeof(args.filterSearch) == "function"){
					this._filterSearchEvent = args.filterSearch;
				}
				if(typeof(args.windowType) == "boolean" && args.windowType){
					this.windowType = true;
				}
			}
			if(this.windowType){
				this.listView = new Ele.Layout("ele_selectbox_list_view_wt ele_scrollbar");
				this.position = new Ele.Utils.Position();
			}else{
				this.listView = new Ele.Layout("ele_selectbox_list_view ele_scrollbar");
				this.listView.ele.style.zIndex = this.masking.maxZIndex + 1;
				this.view.add(this.listView);
			}
			
			this.filter = new Ele.Layout("ele_selectbox_filter");
			this.setFilterData([]);
			this.listView.add(this.filter);
			var divider = new Ele.Layout("ele_selectbox_divider");
			this.listView.add(divider);
			this.optionList = new Ele.Layout("ele_selectbox_option");
			this.listView.add(this.optionList);
			
			var contentView = new Ele.HLayout("ele_selectbox_panle");
			contentView.ele.onclick = function(){
				context._onFocus();
			};
			
			this.hintView = new Ele.Layout("ele_selectbox_select_view");
			this.hintView.setHtml("请选择");
			contentView.add(this.hintView);
			this.edit = new Ele.TextBox({style:"ele_selectbox_intut_style"});
			this.edit.ele.onkeyup = function(e){
				context._onFilterKey();
			};
			if(this._disable){
				this.edit.ele.readOnly = true;
			}
			contentView.add(this.edit);
			var iconView = new Ele.Layout("ele_selectbox_icon_view");
			var icon = new Ele.Img(Ele._pathPrefix+"ele/assets/24/icon_down.png","ele_selectbox_icon");
			iconView.add(icon);
			contentView.add(iconView);
			
			this.view.add(contentView);
			
			this.setOptions(items);
			
			this.optionController = new Ele.Controllers.BaseController({
				loadHandler:function(data){
					context._onDataResponse(data);
				},
				errorHandler:function(error){
					if(context._onErrorResponse != null){
						context._onErrorResponse(error);
					}
				}
			});
			this.filterController = new Ele.Controllers.BaseController({
				loadHandler:function(data){
					context._onFilterDataResponse(data);
				},
				errorHandler:function(error){
					if(context._onFilterErrorResponse != null){
						context._onFilterErrorResponse(error);
					}
				}
			});
		};
		this._init();
	};
	
	var Option = Ele.Option = function(text, value){
		this.eleType = "layout";
		this.ele;
		this.view;
		this.text;
		this.value;
		this._clickEvent = null;
		
		Option.prototype.setClickEvent = function(event){
			if(typeof(event) == "function"){
				this._clickEvent = event;
			}
		};
		Option.prototype.setSelectedStyle = function(){
			this.ele.className = "ele_selectbox_option_item ele_selectbox_option_item_selected";
		};
		Option.prototype.clearSelectedStyle = function(){
			this.ele.className = "ele_selectbox_option_item";
		};
		
		Option.prototype._onClick = function(){
			if(this._clickEvent != null){
				this._clickEvent();
			}
		};
		
		Option.prototype._init = function(){
			this.text = "";
			this.value = "";
			if(typeof(text) == "string"){
				this.text = text;
			}
			if(typeof(value) != "undefined"){
				this.value = value;
			}
			this.view = new Ele.Layout("ele_selectbox_option_item");
			this.ele = this.view.ele;
			
			var context = this;
			this.ele.onclick = function(){
				context._onClick();
			};
			
			this.view.setHtml(this.text);
		};
		
		this._init();
	};
	
	var OptionFilter = Ele.OptionFilter = function(){
		this.eleType = "layout";
		this.ele;
		this.view;
		
		OptionFilter.prototype.appendFilter = function(text){
			if(typeof(text) != "string"){
				return ;
			}
			var lable = new Ele.Label(text, "ele_selectbox_filter_txt_filter");
			this.view.add(lable);
		};
		OptionFilter.prototype.appendNormal = function(text){
			if(typeof(text) != "string"){
				return ;
			}
			var lable = new Ele.Label(text, "ele_selectbox_filter_txt_normal");
			this.view.add(lable);
		};
		
		OptionFilter.prototype._init = function(){
			this.view = new Ele.Layout("ele_selectbox_filter_right");
			this.ele = this.view.ele;
			this.view.setAlign("right");
		};
		
		this._init();
	};
	
	var FilterOption = function(text, value, fview){
		this.eleType = "layout";
		this.ele;
		this.view;
		this.text;
		this.value;
		this._clickEvent = null;
		
		FilterOption.prototype.setClickEvent = function(event){
			if(typeof(event) == "function"){
				this._clickEvent = event;
			}
		};
		
		FilterOption.prototype._onClick = function(){
			if(this._clickEvent != null){
				this._clickEvent();
			}
		};
		
		FilterOption.prototype._init = function(){
			this.text = "";
			this.value = "";
			if(typeof(text) == "string"){
				this.text = text;
			}
			if(typeof(value) != "undefined"){
				this.value = value;
			}
			if(typeof(fview) != "object" || !(fview instanceof OptionFilter)){
				fview = new Ele.Label("");
			}
			this.view = new Ele.HLayout("ele_selectbox_filter_item");
			this.ele = this.view.ele;
			
			var context = this;
			this.ele.onclick = function(){
				context._onClick();
			};
			
			var left = new Ele.Layout("ele_selectbox_filter_left");
			left.setHtml(this.text);
			
			this.view.add(left,{width:"50%"});
			this.view.add(fview,{width:"50%"});
		};
		
		this._init();
	};
	
})();
