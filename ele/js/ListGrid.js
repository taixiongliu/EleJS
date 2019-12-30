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
			var line = new Ele.HLayout();
			line.setSize("100%", this.itemHeight+"px");
			line.ele.className = rowCss;
			line.ele.rowcss = rowCss;
			var first = true;
			
			if(this.selectOpr != null){
				var selitem = new Ele.Layout();
				selitem.setHeight("26px");
				selitem.setLineHeight("26px");
				if(typeof(this.selectOpr.width) != "undefined"){
					selitem.setWidth(this.selectOpr.width);
				}else{
					selitem.setWidth(this.itemWidth+"px");
				}
				selitem.setAlign("center");
				var cbox = document.createElement("input");
				cbox.type = "checkbox";
				var ele = {ele:cbox,data:row};
				selitem.add(ele);
				line.add(selitem);
				first = false;
				this.selectArray.push(ele);
			}
			
			for(var f in this.fields){
				if(!first){
					var divider = new Ele.Layout("ele_listgrid_v_divider");
					line.add(divider);
				}else{
					first = false;
				}
				
				var rowItem = new Ele.Layout("ele_listgrid_item");
				rowItem.setHeight(this.itemHeight+"px");
				rowItem.setLineHeight(this.itemHeight+"px");
				if(typeof(this.fields[f].fieldWidth) != "undefined"){
					rowItem.setWidth(this.fields[f].fieldWidth);
				}else{
					rowItem.setWidth(this.itemWidth+"px");
				}
				rowItem.setAlign("center");
				rowItem.setHtml(row[f]);
				line.add(rowItem);
			}
			
			if(this.oprs != null){
				if(!first){
					line.add(new Ele.Layout("ele_listgrid_v_divider"));
				}
				var opitem = new Ele.HLayout();
				opitem.getView().setHeight(this.itemHeight+"px");
				if(typeof(this.oprs.width) != "undefined"){
					opitem.getView().setWidth(this.oprs.width);
				}else{
					opitem.getView().setWidth(this.itemWidth+"px");
				}
				opitem.getView().setAlign("center");
				
				if(typeof(this.oprs.menus) != "undefined" && this.oprs.menus.length > 0){
					for(var i = 0; i < this.oprs.menus.length; i ++){
						var ic = new Ele.IconLabel(this.oprs.menus[i]);
						opitem.add(ic,{ppadding:"0px 0px 0px 4px"});
					}
				}
				
				line.add(opitem);
			}
			line.ele.onmouseover = function(){
				this.className = "ele_listgrid_bg_selected";
			};
			line.ele.onmouseout = function(){
				this.className = this.rowcss;
			};
			
			this.listView.add(line);
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
			this.view = new Ele.Layout();
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
					//滚动条17 加分割少1
					this.itemWidth = (this.width - 16 - len)/len;
				}
				this.titleView = new Ele.HLayout();
				this.titleView.setSize("100%", this.itemHeight+"px");
				var first = true;
				if(this.selectOpr != null){
					var selitem = new Ele.Layout("ele_listgrid_title");
					selitem.setHeight("26px");
					selitem.setLineHeight("26px");
					if(typeof(this.selectOpr.width) != "undefined"){
						selitem.setWidth(this.selectOpr.width);
					}else{
						selitem.setWidth(this.itemWidth+"px");
					}
					selitem.setAlign("center");
					selitem.setHtml("选择");
					this.titleView.add(selitem);
					first = false;
				}
				for(var f in this.fields){
					if(!first){
						var divider = new Ele.Layout("ele_listgrid_v_divider");
						this.titleView.add(divider);
					}else{
						first = false;
					}
					
					var titleItem = new Ele.Layout("ele_listgrid_title");
					titleItem.setHeight("26px");
					titleItem.setLineHeight("26px");
					if(typeof(this.fields[f].fieldWidth) != "undefined"){
						titleItem.setWidth(this.fields[f].fieldWidth);
					}else{
						titleItem.setWidth(this.itemWidth+"px");
					}
					titleItem.setAlign("center");
					titleItem.setHtml(this.fields[f].fieldName);
					this.titleView.add(titleItem);
				}
				if(this.oprs != null){
					if(!first){
						this.titleView.add(new Layout("ele_listgrid_v_divider"));
					}
					var opitem = new Ele.Layout("ele_listgrid_title");
					opitem.setHeight("26px");
					opitem.setLineHeight("26px");
					if(typeof(this.oprs.width) != "undefined"){
						opitem.setWidth(this.oprs.width);
					}else{
						opitem.setWidth(this.itemWidth+"px");
					}
					opitem.setAlign("center");
					opitem.setHtml("操作");
					this.titleView.add(opitem);
				}
				
				var dividerRoll = new Ele.Layout("ele_listgrid_v_divider");
				var rollItem = new Ele.Layout("ele_listgrid_title");
				rollItem.setSize("16px","26px");
				this.titleView.add(dividerRoll);
				this.titleView.add(rollItem);
				this.view.add(this.titleView);
			}
			
			this.listView = new Ele.VLayout();
			var lh = this.itemHeight * 10;
			if(this.height != null){
				lh = this.height - this.itemHeight;
			}
			this.listView.setSize("100%", lh+"px");
			this.listView.getView().setOverflowX("hidden");
			this.listView.getView().setOverflowY("auto");
			this.addEmpty();
			this.view.add(this.listView);
		};
		
		this._init();
	};
})();
