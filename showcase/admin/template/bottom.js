(function(){
	var BottomView = window.BottomView = function(masking,onMenuEvent){
		var layout;
		
		BottomView.prototype._initView = function(){
			//主面板
			layout = new Ele.Layout("admin-bottom-view border-box");
			layout.setHtml("© www.xxxxxxxxx.com - xxxx科技有限公司");
		};
		
		BottomView.prototype.getView = function(){
			return layout;
		};
		BottomView.prototype.setPaddingLeft = function(left){
			layout.ele.style.paddingLeft = left+"px";
		};
		
		this._initView();
	}
})();