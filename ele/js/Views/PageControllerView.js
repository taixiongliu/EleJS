(function(){
	var PageControllerView = Ele.Views.PageControllerView = function() {
		this.eleType = "layout";
		this.ele;
		this.view;
		this.pageItem;
		this.lbInfo;
		this.etJump;
		
		PageControllerView.prototype._setMessage = function(pages, rows){
			this.lbInfo.setText("共"+pages+"页 总计"+rows+"条数据");
		};
		PageControllerView.prototype._fillItemView = function(value, selected){
			var css = "ele_page_controller_item";
			if(selected){
				css += " ele_page_controller_item_selected";
			}
			var item = new Ele.Layout(css);
			item.setAlign("center");
			item.setHtml(value);
			return item;
		};
		PageControllerView.prototype._init = function(){
			this.view = new Ele.HLayout("ele_page_controller");
			this.ele = this.view.ele;
			
			var btnPrevious = new Ele.Button({text:"上一页",icon:Ele._pathPrefix+"ele/assets/64/icon_previous.png"});
			this.view.add(btnPrevious);
			this.pageItem = new Ele.HLayout();
			this.pageItem.add(this._fillItemView(1, true),{padding:"0 0 0 16px"});
			this.view.add(this.pageItem);
			
			var btnNext = new Ele.Button({text:"下一页",icon:Ele._pathPrefix+"ele/assets/64/icon_next.png", iconRight:true});
			this.view.add(btnNext, {padding:"0 0 0 16px"});
			
			this.lbInfo = new Ele.Label();
			this._setMessage(1,0);
			this.view.add(this.lbInfo, {padding:"0 0 0 16px"});
			
			var btnJump = new Ele.Button({text:"确认"});
			this.view.add(btnJump, {float:"right"});
			this.etJump = new Ele.TextBox({style:"ele_page_controller_jump_style"});
			this.etJump.ele.type = "number";
			this.view.add(this.etJump, {float:"right", padding:"0 8px 0 0"});
			var lbJump = new Ele.Label("跳转至：");
			this.view.add(lbJump, {float:"right", padding:"0 8px 0 0"});
		};
		
		this._init();
	};
})();