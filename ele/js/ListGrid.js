(function(){
	var ListGrid = Ele.ListGrid = function(args){
		this.eleType = "layout";
		this.ele;
		
		this.count = 0;
		this.view;
		this.fields;
		this.width;
		this.height;
		this.itemWidth = 120;
		this.itemHeight = 26;
		this.oprs;
		this.selectOpr = null;
		this.selectArray = [];
		this.main_pr = 0;//主体表单右间距
		this.main_pl = 0;//主体表单左间距
		
		this.titleView;
		this.listView;
		
		ListGrid.prototype.getSelect = function(){
			var temp = [];
			if(this.selectArray.length < 1){
				return temp;
			}
			for(var i = 0; i < this.selectArray.length; i++){
				var ele = this.selectArray[i];
				if(ele.ele.checked){
					temp.push(ele.data);
				}
			}
			return temp;
		};
		
		ListGrid.prototype.addRow = function(row){
			if(typeof(args) != "object"){
				return;
			}
			if(this.count == 0){
				this.listView.getView().clear();
			}
			var rowCss = "ele_listgrid_bg_double";
			if(this.count%2 == 0){
				rowCss = "ele_listgrid_bg_single";
			}
			var line = new Ele.Layout("ele_listgrid_line_view "+rowCss);
			line.setSize("100%", this.itemHeight+"px");
			line.ele.rowcss = "ele_listgrid_line_view "+rowCss;
			
			if(this.selectOpr != null){
				var selitem = new Ele.Layout("ele_listgrid_cb");
				selitem.setHeight(this.itemHeight+"px");
				selitem.setLineHeight(this.itemHeight+"px");
				if(typeof(this.selectOpr.width) == "number"){
					selitem.setWidth(this.selectOpr.width+"px");
				}else{
					selitem.setWidth(this.itemWidth+"px");
				}
				selitem.setAlign("center");
				var cbox = document.createElement("input");
				cbox.type = "checkbox";
				var ele = {ele:cbox,data:row};
				selitem.add(ele);
				line.add(selitem);
				this.selectArray.push(ele);
			}
			
			var bar = new Ele.HLayout("ele_listgrid_line_bar");
			if(this.oprs != null){
				var opitem = new Ele.HLayout("");
				opitem.getView().setHeight(this.itemHeight+"px");
				if(typeof(this.oprs.width) == "number"){
					opitem.getView().setWidth(this.oprs.width+"px");
				}else{
					opitem.getView().setWidth(this.itemWidth+"px");
				}
				opitem.getView().setAlign("center");
				
				if(typeof(this.oprs.menus) != "undefined" && this.oprs.menus.length > 0){
					for(var i = 0; i < this.oprs.menus.length; i ++){
						var ic = new Ele.IconLabel(this.oprs.menus[i]);
						ic.data = row;
						opitem.add(ic,{padding:"0px 0px 0px 4px"});
					}
				}
				bar.add(opitem);
			}
			line.add(bar);
			
			var lineItemPanel = new Ele.HLayout("ele_listgrid_title_item_view");
			lineItemPanel.setSize("100%", this.itemHeight+"px");
			lineItemPanel.ele.style.padding = "0px "+(this.main_pr - 17)+"px 0px "+this.main_pl+"px";
			for(var f in this.fields){
				var rowItem = new Ele.Layout("ele_listgrid_item");
				rowItem.setHeight(this.itemHeight+"px");
				rowItem.setLineHeight(this.itemHeight+"px");
				var tempWidth = this.itemWidth;
				if(typeof(this.fields[f].fieldWidth) != "undefined"){
					tempWidth = this.fields[f].fieldWidth;
				}
				rowItem.setAlign("center");
				rowItem.setHtml(row[f]);
				lineItemPanel.add(rowItem,{width:tempWidth});
			}
			line.add(lineItemPanel);
			
			
			line.ele.onmouseover = function(){
				this.className = "ele_listgrid_line_view ele_listgrid_bg_selected";
			};
			line.ele.onmouseout = function(){
				this.className = this.rowcss;
			};
			
			this.listView.add(line,{height:this.itemHeight+"px"});
			this.count ++;
		};
		ListGrid.prototype.clear = function(){
			this.listView.clear();
			this.addEmpty();
			this.count = 0;
			this.selectArray = [];
		};
		ListGrid.prototype.addEmpty = function(){
			var empty = new Ele.Layout("ele_listgrid_item");
			empty.setLineHeight("26px");
			empty.setHtml("无数据");
			empty.setAlign("center");
			this.listView.add(empty);
		};
		
		ListGrid.prototype._init = function(){
			this.view = new Ele.Layout('ele_listgrid_view');
			this.ele = this.view.ele;
			if(typeof(args) == "object"){
				if(typeof(args.widthPx) == "number"){
					this.view.setWidth(args.widthPx+"px");
					this.width = args.widthPx;
				}
				if(typeof(args.heightPx) == "number"){
					this.view.setHeight(args.heightPx+"px");
					this.height = args.heightPx;
				}
				if(typeof(args.itemHeightPx) == "number"){
					this.itemHeight = args.itemHeightPx;
				}
				if(typeof(args.fields) == "object"){
					this.fields = args.fields;
				}
				if(typeof(args.operations) == "object"){
					this.oprs = args.operations;
				}
				if(typeof(args.selectOpr) == "object"){
					this.selectOpr = args.selectOpr;
				}
			}
			if(this.fields != null){
				var len = Object.getOwnPropertyNames(this.fields).length;
				if(this.oprs != null){
					len ++;
				}
				if(this.selectOpr != null){
					len ++;
				}
				if(this.width != null){
					//滚动条17
					this.itemWidth = (this.width - 17)/len;
				}
				this.titleView = new Ele.Layout('ele_listgrid_title_view');
				//padding left 数值
				if(this.selectOpr != null){
					var selitem = new Ele.Layout("ele_listgrid_title_cb");
					selitem.setHeight("26px");
					selitem.setLineHeight("26px");
					if(typeof(this.selectOpr.width) == "number"){
						selitem.setWidth(this.selectOpr.width+"px");
						this.main_pl = this.selectOpr.width;
					}else{
						selitem.setWidth(this.itemWidth+"px");
						this.main_pl = this.itemWidth;
					}
					selitem.setAlign("center");
					selitem.setHtml("选择");
					this.titleView.add(selitem);
				}
				//padding right 数值
				var bar = new Ele.HLayout("ele_listgrid_title_bar");
				if(this.oprs != null){
					var opitem = new Ele.Layout("ele_listgrid_title ele_listgrid_br");
					opitem.setHeight("26px");
					opitem.setLineHeight("26px");
					if(typeof(this.oprs.width) == "number"){
						opitem.setWidth(this.oprs.width+px);
						this.main_pr += this.oprs.width;
					}else{
						opitem.setWidth(this.itemWidth+"px");
						this.main_pr += this.itemWidth;
					}
					opitem.setAlign("center");
					opitem.setHtml("操作");
					bar.add(opitem);
				}
				
				var rollItem = new Ele.Layout("ele_listgrid_title");
				rollItem.setSize("16px","26px");
				bar.add(rollItem);
				this.main_pr += 16;
				this.titleView.add(bar);
				
				var titleItemPanel = new Ele.HLayout("ele_listgrid_title_item_view");
				titleItemPanel.ele.style.padding = "0px "+this.main_pr+"px 0px "+this.main_pl+"px";
				for(var f in this.fields){
					var titleItem = new Ele.Layout("ele_listgrid_title ele_listgrid_br");
					titleItem.setHeight("26px");
					titleItem.setLineHeight("26px");
					var tempWidth = this.itemWidth;
					if(typeof(this.fields[f].fieldWidth) != "undefined"){
						tempWidth = this.fields[f].fieldWidth;
					}
					titleItem.setAlign("center");
					titleItem.setHtml(this.fields[f].fieldName);
					titleItemPanel.add(titleItem,{width:tempWidth});
				}
				this.titleView.add(titleItemPanel);
				
				this.view.add(this.titleView);
			}
			
			this.listView = new Ele.VLayout('ele_listgrid_list_view');
			this.addEmpty();
			this.view.add(this.listView);
		};
		
		this._init();
	};
})();
