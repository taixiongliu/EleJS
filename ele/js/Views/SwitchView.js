(function(){
	var SwitchView = Ele.Views.SwitchView = function() {
		this.eleType = "layout";
		this.ele;
		this.view;
		this.count = 0;
		this.pages = [];
		this.bar;
		this.barItems = [];
		this.selectedIndex = -1;
		this._autoPlay = false;
		
		/**
		 * 播放下一页
		 */
		SwitchView.prototype.play = function(){
			var index = this.selectedIndex + 1;
			if(index == this.count){
				index = 0;
			}
			this.selectIndex(index);
		};
		SwitchView.prototype.autoPlay = function(interval){
			if(typeof(interval) != "number"){
				interval = 3000;
			}
			this._autoPlay = true;
			var context = this;
			var timer = new Ele.Utils.Timer(function(){
				if(context._autoPlay){
					context.play();
					return true;
				}
				return false;
			}, interval);
			setTimeout(function(){
				timer.execute();
			},interval);
		};
		SwitchView.prototype.autoStop = function(){
			this._autoPlay = false;
		};
		
		SwitchView.prototype.addPage = function(view, background){
			this.count ++;
			var layout = new Ele.Layout("ele_switch_page_panel");
			if(typeof(background) != "undefined"){
				layout.ele.background = background;
			}
			if(this.count > 1){
				layout.ele.style.left = "100%";
				layout.ele.style.zIndex = 1;
				layout.ele.style.display = "none";
			}
			
			layout.add(view);
			
			this.view.add(layout);
			this.pages.push(layout);
			this._addBar();
		};
		
		/**
		 * @param {Object} index： start from 0
		 */
		SwitchView.prototype.selectIndex = function(index){
			if(this.selectedIndex < 0){
				return ;
			}
			if(index == this.selectedIndex){
				return ;
			}
			var newPage = this.pages[index];
			var yetPage = this.pages[this.selectedIndex];
			var left = 100;
			newPage.ele.style.zIndex = 2;
			newPage.ele.style.display = "block";
			yetPage.ele.style.zIndex = 1;
			var context = this;
			var timer = new Ele.Utils.Timer(function(){
				if(left <= 0){
					yetPage.ele.style.left = "100%";
					yetPage.ele.style.display = "none";
					context.barItems[context.selectedIndex].ele.className = "ele_switch_bar_item";
					context.barItems[index].ele.className = "ele_switch_bar_item ele_switch_bar_item_selected";
					context.selectedIndex = index;
					return false;
				}
				left -=10;
				newPage.ele.style.left = left+"%";
				return true;
			});
			timer.execute();
		};
		
		SwitchView.prototype._onBarSelected = function(index){
			this.selectIndex(index);
		};
		
		SwitchView.prototype._addBar = function(){
			var item = new Ele.Layout("ele_switch_bar_item");
			var index = this.count;
			var context = this;
			item.ele.onclick = function(){
				context._onBarSelected(index - 1);
			}
			//12+12+12
			//12+8
			var base = 36;
			if(index == 1){
				//默认选择第一个
				this.selectedIndex = 0;
				item.ele.className = "ele_switch_bar_item ele_switch_bar_item_selected";
				this.bar.add(item, {width:"12px"});
			}else{
				base += (index - 1) * 20;
				this.bar.add(item, {width:"12px", padding:"0 0 0 8px"});
			}
			this.barItems.push(item);
			this.bar.setSize(base+"px","20px");
		};
		
		SwitchView.prototype._init = function(){
			this.view = new Ele.Layout("ele_switch_view");
			this.ele = this.view.ele;
			var barPanel = new Ele.Layout("ele_switch_bar_panel");
			barPanel.setAlign("center");
			this.bar = new Ele.HLayout("ele_switch_bar");
			barPanel.add(this.bar);
			
			this.view.add(barPanel);
		};
		
		this._init();
	};
})();