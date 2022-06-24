(function(){
	var ClusterCheckBoxView = Ele.Views.ClusterCheckBoxView = function() {
		this.eleType = "layout";
		this.ele;
		this.view;
		this.baseController;
		this.items;
		this.permissionLength;
		this._dataFormat = null;
		this._onDataSourcesLoad = null;
		
		ClusterCheckBoxView.prototype.setDataFormat = function(event){
			if(typeof(event) == "function"){
				this._dataFormat = event;
			}
		};
		ClusterCheckBoxView.prototype.setOnDataSourcesLoad = function(event){
			if(typeof(event) == "function"){
				this._onDataSourcesLoad = event;
			}
		};
		ClusterCheckBoxView.prototype.getValues = function(){
			if(this.items.length < 1){
				return "";
			}
			var values = "";
			for(var i in this.items){
				var arr = this.items[i].getSelectedValue();
				for(var j = 0; j < arr.length; j ++){
					values += arr[j]+",";
				}
			}
			if(values != ""){
				values = values.substr(0, values.length - 1);
			}
			return values;
		};
		ClusterCheckBoxView.prototype.setValues = function(values, format){
			if(this.items.length < 1){
				return ;
			}
			var arr = values.split(",");
			for(var val in arr){
				var value = arr[val];
				if(typeof(format) == "function"){
					value = format(value);
					if(typeof(value) == "undefined"){
						break;
					}
				}
				for(var i in this.items){
					var index = this.items[i].getIndexByValue(value);
					if(index != -1){
						this.items[i].select(index);
						break;
					}
				}
			}
		};
		ClusterCheckBoxView.prototype.getPermission = function(){
			if(this.items.length < 1){
				return "";
			}
			var permission = "";
			for(var i in this.items){
				var eles = this.items[i]._radios;
				var tp = [];
				if(eles.length > 0){
					for(var k = 0; k < eles.length; k ++){
						tp[k] = "0";
					}
				}
				var arr = this.items[i].getSelectedIndex();
				if(arr.length > 0){
					permission += "1";
				}else{
					permission += "0";
				}
				for(var j in arr){
					tp[arr[j]] = "1";
				}
				//组装
				for(var t in tp){
					permission += tp[t];
				}
			}
			return permission;
		};
		
		ClusterCheckBoxView.prototype.setPermission = function(permission){
			if(typeof(permission) != "string"){
				return ;
			}
			if(this.permissionLength != permission.length){
				return ;
			}
			if(this.items.length < 1){
				return ;
			}
			//解析权限游标
			var cursor = 0;
			for(var i in this.items){
				var eles = this.items[i]._radios;
				if(permission.charAt(cursor) == '0'){
					cursor += eles.length + 1;
					continue;
				}
				cursor ++;
				if(eles.length < 1){
					continue;
				}
				for(var j = 0; j < eles.length; j ++){
					if(permission.charAt(cursor) == '1'){
						this.items[i].select(j);
					}
					cursor ++;
				}
			}
		};
		
		ClusterCheckBoxView.prototype.add = function(args){
			if(this._dataFormat != null){
				this._dataFormat(args);
			}
			if(typeof(args.title) == "undefined"){
				args.title = "";
			}
			var item = new Ele.Layout("ele_permission_item");
			var root = new Ele.Layout("ele_permission_root");
			root.setHtml(args.title);
			item.add(root);
			var childView = new Ele.Layout("ele_permission_children");
			var child = new Ele.CheckGroup(args);
			childView.add(child);
			item.add(childView);
			
			this.view.add(item);
			this.items.push(child);
			this.permissionLength += args.items.length + 1;
		};
		//加载数据源
		ClusterCheckBoxView.prototype.loadDataSources = function(dataSources){
			if(!Ele._isArray(dataSources)){
				return ;
			}
			this.view.clear();
			this.items = [];
			this.permissionLength = 0;
			for(var i = 0; i < dataSources.length; i ++){
				this.add(dataSources[i]);
			}
			if(this._onDataSourcesLoad != null){
				this._onDataSourcesLoad();
			}
		};
		ClusterCheckBoxView.prototype._onDataResponse = function(dataSources){
			this.loadDataSources(dataSources);
		};
		ClusterCheckBoxView.prototype.loadDataSourcesUrl = function(url, funError){
			if(typeof(funError) == "function"){
				this._onErrorResponse = funError;
			}
			this.baseController.loadData(url);
		};
		
		ClusterCheckBoxView.prototype._init = function(){
			this.view = new Ele.Layout("ele_permission_view");
			this.ele = this.view.ele;
			this.items = [];
			this.permissionLength = 0;
			
			var context = this;
			
			this.baseController = new Ele.Controllers.BaseController({
				loadHandler:function(data){
					context._onDataResponse(data);
				},
				errorHandler:function(error){
					if(context._onErrorResponse != null){
						context._onErrorResponse(error);
					}
				}
			});
		};
		
		this._init();
	};
})();