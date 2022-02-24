(function(){
	var PermissionView = Ele.Views.PermissionView = function() {
		this.eleType = "layout";
		this.ele;
		this.view;
		this.baseController;
		this.items;
		this.permissionLength;
		this._dataFormat = null;
		this._onDataSourcesLoad = null;
		
		PermissionView.prototype.setDataFormat = function(event){
			if(typeof(event) == "function"){
				this._dataFormat = event;
			}
		};
		PermissionView.prototype.setOnDataSourcesLoad = function(event){
			if(typeof(event) == "function"){
				this._onDataSourcesLoad = event;
			}
		};
		
		PermissionView.prototype.getPermission = function(){
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
		
		PermissionView.prototype.setPermission = function(permission){
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
		
		PermissionView.prototype.add = function(args){
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
		PermissionView.prototype.loadDataSources = function(dataSources){
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
		PermissionView.prototype._onDataResponse = function(dataSources){
			this.loadDataSources(dataSources);
		};
		PermissionView.prototype.loadDataSourcesUrl = function(url, funError){
			if(typeof(funError) == "function"){
				this._onErrorResponse = funError;
			}
			this.baseController.loadData(url);
		};
		
		PermissionView.prototype._init = function(){
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