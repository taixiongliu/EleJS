(function(){
	var PageBarView = Ele.Views.PageBarView = function() {
		this.eleType = "layout";
		this.ele;
		this.view;
		this.pageItem;
		this.lbInfo;
		this.etJump;
		this.pageController;
		this._onDataResponse = null;
		this._onErrorResponse = null;
		
		PageBarView.prototype.loadData = function(url, funName, funError){
			//加载page数据
			if(typeof(funName) == "function"){
				this._onDataResponse = funName;
			}
			if(typeof(funError) == "function"){
				this._onErrorResponse = funError;
			}
			this.pageController.loadData(url);
		};
		PageBarView.prototype.reload = function(){
			this.pageController.reload();
		};
		PageBarView.prototype.jumpPage = function(page){
			this.pageController.jumpPage(page);
		};
		PageBarView.prototype.previousPage = function(){
			this.pageController.previousPage();
		};
		PageBarView.prototype.nextPage = function(){
			this.pageController.nextPage();
		};
		PageBarView.prototype.setFormat = function(formatHandler){
			this.pageController.setFormat(formatHandler);
		};
		PageBarView.prototype._setMessage = function(pages, rows){
			this.lbInfo.setText("共"+pages+"页 总计"+rows+"条数据");
		};
		PageBarView.prototype._onPageSelected = function(page){
			this.jumpPage(page);
		};
		PageBarView.prototype._onSubmitJump = function(){
			var val = this.etJump.getValue();
			if(val == ""){
				return ;
			}
			var page = Number.parseInt(val);
			this.jumpPage(page);
		};
		PageBarView.prototype._updateMessage = function(){
			this.pageItem.clear();
			var len = this.pageController.totalPage;
			//最多显示5个页码组件
			var startPage = this.pageController.page;
			if(len > 5){
				len = 5;
			}
			if((startPage + 2) > this.pageController.totalPage){
				startPage = this.pageController.totalPage - 4;
			}else{
				startPage -= 2;
			}
			
			if(startPage < 1){
				startPage = 1;
			}
			
			for(var i = 0; i < len; i ++){
				var tempPage = startPage + i;
				var tempSelect = false;
				if(tempPage == this.pageController.page){
					tempSelect = true;
				}
				this.pageItem.add(this._fillItemView(tempPage, tempSelect),{padding:"0 0 0 16px"});
			}
			
			this._setMessage(this.pageController.totalPage, this.pageController.rows);
		};
		PageBarView.prototype._fillItemView = function(value, selected){
			var css = "ele_page_bar_item";
			if(selected){
				css += " ele_page_bar_item_selected";
			}
			var context = this;
			var item = new Ele.Layout(css);
			item.setAlign("center");
			item.setHtml(value);
			item.ele.onclick = function(){
				context._onPageSelected(value);
			}
			return item;
		};
		PageBarView.prototype._init = function(){
			this.view = new Ele.HLayout("ele_page_bar");
			this.ele = this.view.ele;
			
			var context = this;
			this.pageController = new Ele.Controllers.PageController({
				loadHandler:function(data){
					context._updateMessage();
					if(context._onDataResponse != null){
						context._onDataResponse(data);
					}
				},
				errorHandler:function(error){
					if(context._onErrorResponse != null){
						context._onErrorResponse(error);
					}
				}
			});
			
			var btnPrevious = new Ele.Button({text:"上一页",icon:Ele._pathPrefix+"ele/assets/64/icon_previous.png",onclick:function(){
				context.previousPage();
			}});
			this.view.add(btnPrevious);
			this.pageItem = new Ele.HLayout();
			this.view.add(this.pageItem);
			
			var btnNext = new Ele.Button({text:"下一页",icon:Ele._pathPrefix+"ele/assets/64/icon_next.png", iconRight:true,onclick:function(){
				context.nextPage();
			}});
			this.view.add(btnNext, {padding:"0 0 0 16px"});
			
			this.lbInfo = new Ele.Label();
			this._setMessage(1,0);
			this.view.add(this.lbInfo, {padding:"0 0 0 16px"});
			
			var btnJump = new Ele.Button({text:"确认",onclick:function(){
				context._onSubmitJump();
			}});
			this.view.add(btnJump, {float:"right"});
			this.etJump = new Ele.TextBox({style:"ele_page_bar_jump_style"});
			this.etJump.ele.type = "number";
			this.view.add(this.etJump, {float:"right", padding:"0 8px 0 0"});
			var lbJump = new Ele.Label("跳转至：");
			this.view.add(lbJump, {float:"right", padding:"0 8px 0 0"});
		};
		
		this._init();
	};
})();