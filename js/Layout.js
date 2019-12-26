(function(){
	/**
	 * 布局元素
	 */
	var Layout = Ele.Layout = function(styleName){
		this.eleType = "div";
		this.ele;
		//自定义缓存
		this.cache = null;
		
		Layout.prototype._init = function(){
			this.ele = document.createElement("div");
			
			if(typeof(styleName) == "string"){
				this.ele.className = styleName;
			}else{
				this.ele.className = "layout";
			}
		};
		//设置父级容器
		Layout.prototype.setParentContainer = function(container){
			container.appendChild(this.ele);
		};
		//设置内置元素
		Layout.prototype.addView = function(ele){
			this.ele.appendChild(ele.ele);
		};
		//移除一个元素
		Layout.prototype.removeView = function(ele){
			this.ele.removeChild(ele.ele);
		};
		
		this._init();
	};
})();
