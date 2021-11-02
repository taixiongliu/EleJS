(function(){
	var SearchBox = Ele.SearchBox = function(args){
		this.eleType = "layout";
		this.ele;
		this.view;
		this.onSearchEvent = function(){};
		this.tb;
		
		SearchBox.prototype.setOnSearch = function(onSearch){
			if(typeof(onSearch) == "function"){
				this.onSearchEvent = onSearch;
			}
		};
		
		SearchBox.prototype._init = function(){
			this.view = new Ele.Layout("ele_searchbox_view"); 
			this.ele = this.view.ele;
			
			this.tb = new Ele.TextBox({style:"ele_searchbox_style"});
			this.tb.type = "text";
			this.tb.className = "ele_edittext_style";
			if(typeof(args) == "object"){
				if(typeof(args.hint) != "undefined"){
					this.tb.ele.placeholder = args.hint;
				}
				if(typeof(args.onSearch) == "function"){
					this.onSearchEvent = args.onSearch;
				}
			}
			var img = new Ele.Img(Ele._pathPrefix+"ele/assets/64/icon_search.png","ele_searchbox_icon");
			this.view.add(this.tb);
			this.view.add(img);
			var context = this;
			this.ele.onkeydown = function(e){
				if (event.keyCode == 13){
					event.returnValue=false;
					event.cancel = true;
					context.onSearchEvent(context.tb.ele.value);
				}
			};
			img.ele.onclick = function(){
				context.onSearchEvent(context.tb.ele.value);
			};
		};
		
		this._init();
	};
})();
