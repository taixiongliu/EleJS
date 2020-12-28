(function(){
	var Alert = Ele.Alert = function() {
		this.eleType = "layout";
		this.ele;
		this.view;
		this._msg;
		this._sureHandler = null;
		this._onsuredown = false;
		
		Alert.prototype._init = function() {
			var context = this;
			
			var body = document.getElementsByTagName('body')[0];
			this.view = new Ele.Layout("ele_shade_pl");
			this.ele = this.view.ele;
			var bg = new Ele.Layout("ele_shade_bg");
			
			var content = new Ele.Layout("ele_confirm_panel");
			var winInner = new Ele.Utils.WinInner();
			var width = winInner.getWidth();
			var height = winInner.getHeight();
			content.ele.style.marginTop = (height/2 - 50)+"px";
			content.ele.style.marginLeft = (width/2 - 150)+"px";
			
			var divider = new Ele.Layout("ele_confirm_divider ele_confirm_margin_top_20");
			
			var content_view = new Ele.Layout("ele_confirm_view");
			content_view.setAlign("center");
			
			this._msg = new Ele.Label("确认继续该操作？","ele_confirm_txt");
			
			content_view.add(this._msg);
			
			var btn_view = new Ele.Layout("ele_confirm_btn_view");
			
			var btn_sure = new Ele.Layout("ele_alert_btn_sure");
			btn_sure.setAlign("center");
			
			btn_sure.ele.onmousedown = function(){
				btn_sure.ele.className = "ele_alert_btn_sure_over";
				context._onsuredown = true;
			};
			btn_sure.ele.onmouseup = function(){
				btn_sure.ele.className = "ele_alert_btn_sure";
				context._onsuredown = false;
			};
			btn_sure.ele.onmouseout = function(){
				if(context._onsuredown){
					btn_sure.ele.className = "ele_alert_btn_sure";
					context._onsuredown = false;
				}
			};
			btn_sure.ele.onclick = function(){
				context.hide();
				if(context._sureHandler != null){
					context._sureHandler();
				}
			};
	
			var txt_sure = new Ele.Label("确定","ele_confirm_btn_txt");
			btn_sure.add(txt_sure);
			
			btn_view.add(btn_sure);
			
			content.add(content_view);
			content.add(divider);
			content.add(btn_view);
			
			this.view.add(bg);
			this.view.add(content);
			
			this.view.setContainer(body);
		};
		
		Alert.prototype.setSureHandler = function(handler){
			this._sureHandler = handler;
		};
		
		Alert.prototype.setMsg = function(msgStr){
			if(this._msg != null){
				this._msg.setText(msgStr);
			}
		};
		
		Alert.prototype.show = function(){
			if(this.ele != null){
				this.ele.style.display = "block";
			}
		};
		
		Alert.prototype.hide = function(){
			if(this.ele != null){
				this.ele.style.display = "none";
			}
		};
		
		Alert.prototype.close = function(){
			if(this.ele != null){
				var body = document.getElementsByTagName('body')[0];
				body.removeChild(this.ele);
				this.ele = null;
			}
		};
		
		this._init();
	};
	
	var Confirm = Ele.Confirm = function() {
		this.eleType = "layout";
		this.ele;
		this.view;
		this._msg = null;
		this._sureHandler = null;
		this._cancelHandler = null;
		this._onsuredown = false;
		
		Confirm.prototype._init = function() {
			var context = this;
			
			var body = document.getElementsByTagName('body')[0];
			this.view = new Ele.Layout("ele_shade_pl");
			this.ele = this.view.ele;
			var bg = new Ele.Layout("ele_shade_bg");
			
			var content = new Ele.Layout("ele_confirm_panel");
			var winInner = new Ele.Utils.WinInner();
			var width = winInner.getWidth();
			var height = winInner.getHeight();
			content.ele.style.marginTop = (height/2 - 50)+"px";
			content.ele.style.marginLeft = (width/2 - 150)+"px";
			
			var divider = new Ele.Layout("ele_confirm_divider ele_confirm_margin_top_20");
			
			var content_view = new Ele.Layout("ele_confirm_view");
			content_view.setAlign("center");
			
			this._msg = new Ele.Label("确认继续该操作？","ele_confirm_txt");
			
			content_view.add(this._msg);
			
			var btn_view = new Ele.Layout("ele_confirm_btn_view");
			
			var btn_sure = new Ele.Layout("ele_confirm_btn_sure");
			btn_sure.setAlign("center");
			
			btn_sure.ele.onmousedown = function(){
				btn_sure.ele.className = "ele_confirm_btn_sure_over";
				context._onsuredown = true;
			};
			btn_sure.ele.onmouseup = function(){
				btn_sure.ele.className = "ele_confirm_btn_sure";
				context._onsuredown = false;
			};
			btn_sure.ele.onmouseout = function(){
				if(context._onsuredown){
					btn_sure.ele.className = "ele_confirm_btn_sure";
					context._onsuredown = false;
				}
			};
			btn_sure.ele.onclick = function(){
				context.hide();
				if(context._sureHandler != null){
					context._sureHandler();
				}
			};
	
			var txt_sure = new Ele.Label("确定","ele_confirm_btn_txt");
			btn_sure.add(txt_sure);
			
			var v_divider = new Ele.Layout("ele_confirm_divider_v");
			
			var btn_cancel = new Ele.Layout("ele_confirm_btn_cancel");
			btn_cancel.setAlign("center");
			btn_cancel.ele.onmousedown = function(){
				btn_cancel.ele.className = "ele_confirm_btn_cancel_over";
				context._onsuredown = true;
			};
			btn_cancel.ele.onmouseup = function(){
				btn_cancel.ele.className = "ele_confirm_btn_cancel";
				context._onsuredown = false;
			};
			btn_cancel.ele.onmouseout = function(){
				if(context._onsuredown){
					btn_cancel.ele.className = "ele_confirm_btn_cancel";
					context._onsuredown = false;
				}
			};
			btn_cancel.ele.onclick = function(){
				context.hide();
				if(context.cancelHandler != null){
					context.cancelHandler();
				}
			};
			var txt_cancel = new Ele.Label("取消","ele_confirm_btn_txt");
			btn_cancel.add(txt_cancel);
			
			btn_view.add(btn_cancel);
			btn_view.add(v_divider);
			btn_view.add(btn_sure);
			
			content.add(content_view);
			content.add(divider);
			content.add(btn_view);
			
			this.view.add(bg);
			this.view.add(content);
			
			this.view.setContainer(body);
		};
		
		Confirm.prototype.setSureHandler = function(handler){
			this._sureHandler = handler;
		};
		
		Confirm.prototype.setCancelHandler = function(handler){
			this.cancelHandler = handler;
		};
		
		Confirm.prototype.setMsg = function(msgStr){
			if(this._msg != null){
				this._msg.setText(msgStr);
			}
		};
		
		Confirm.prototype.show = function(){
			if(this.ele != null){
				this.ele.style.display = "block";
			}
		};
		
		Confirm.prototype.hide = function(){
			if(this.ele != null){
				this.ele.style.display = "none";
			}
		};
		
		Confirm.prototype.close = function(){
			if(this.ele != null){
				var body = document.getElementsByTagName('body')[0];
				body.removeChild(this.ele);
				this.ele = null;
			}
		};
		
		this._init();
	};
	
})();
