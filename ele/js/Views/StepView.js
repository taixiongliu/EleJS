(function(){
	var StepView = Ele.Views.StepView = function(steps) {
		this.eleType = "layout";
		this.ele;
		this.view;
		this.step;
		this._triangles;
		this._items;
		
		StepView.prototype.setStep = function(step){
			if(typeof(step) != "number"){
				return ;
			}
			if(step < 0 || step > this._items.length){
				return ;
			}
			if(step == this.step){
				return ;
			}
			this._triangles[this.step - 1].setBlur();
			this._items[this.step - 1].ele.className = "ele_step_item";
			this._items[step - 1].ele.className = "ele_step_item ele_step_yet";
			if(step < this._items.length){
				this._triangles[step - 1].setFocus();
			}
			this.step = step;
		};
		
		StepView.prototype._init = function(){
			this.step = 1;
			this._triangles = [];
			this._items = [];
			
			this.view = new Ele.Layout("ele_step_view");
			this.ele = this.view.ele;
			
			if(Ele._isArray(steps)){
				var width = (100/steps.length)+"%";
				for(var i = 0; i < steps.length; i ++){
					if(typeof(steps[i]) != "string"){
						continue;
					}
					var css = "ele_step_item";
					if(i == 0){
						css = "ele_step_item ele_step_yet";
					}
					var itemView = new Ele.Layout(css);
					if(i > 0){
						var triangle = new StepTriangle();
						if(i > 1){
							triangle.setBlur();
						}
						itemView.add(triangle);
						this._triangles.push(triangle);
					}
					itemView.setWidth(width);
					var label = new Ele.Label(steps[i], "");
					itemView.add(label);
					this._items.push(itemView);
					this.view.add(itemView);
				}
			}
		};
		
		this._init();
	};
	
	var StepTriangle = function(){
		this.eleType = "layout";
		this.ele;
		this.view;
		this.triangle;
		
		StepTriangle.prototype.setFocus = function(){
			this.triangle.ele.className = "triangle-1";
		};
		StepTriangle.prototype.setBlur = function(){
			this.triangle.ele.className = "triangle-2";
		};
		
		StepTriangle.prototype._init = function(){
			this.view = new Ele.Layout("triangle");
			this.ele = this.view.ele;
			
			var bg = new Ele.Layout("triangle-bg");
			var bg2 = new Ele.Layout("triangle-bg2");
			this.triangle = new Ele.Layout("triangle-1");
			this.view.add(bg);
			this.view.add(bg2);
			this.view.add(this.triangle);
		};
		
		this._init();
	};
	
})();