(function(){
	var FileView = Ele.Views.FileView = function(args) {
		this.eleType = "layout";
		this.ele;
		this.view;
		this.confirm;
		this.groupView;
		this.titleView;
		this.emptyView;
		this.tbGroup;
		this.listView;
		this.fileView;
		this.permission;
		this.groupController;
		this.fileController;
		this.gAddController;
		this.gDeleteController;
		this.fDeleteController;
		this._groupCount;
		this._groupSelect;
		this._items;//分组对象组
		this._pages;//页面控制器
		this._viewEvent;
		this._errorEvent;
		this._groupListUrl;
		this._fileListUrl;
		this._groupAddUrl;
		this._groupDeleteUrl;
		this._uploadUrl;
		this._updateUrl;
		this._deleteUrl;
		
		FileView.prototype.setTitle = function(title){
			if(typeof(title) == "string"){
				this.titleView.setHtml(title);
			}
		};
		FileView.prototype.setViewHandler = function(viewEvent){
			if(typeof(viewEvent) == "function"){
				this._viewEvent = viewEvent;
			}
		};
		FileView.prototype.setErrorHandler = function(errorEvent){
			if(typeof(errorEvent) == "function"){
				this._errorEvent = errorEvent;
			}
		};
		
		FileView.prototype.addGroup = function(name, value){
			var cellStyle = "ele_file_group_item ele_file_group_double";
			if(this._groupCount % 2 == 0){
				cellStyle = "ele_file_group_item ele_file_group_single";
			}
			var context = this;
			var item = new Ele.Layout(cellStyle);
			item.setHtml(name);
			item.ele.index = this._groupCount;
			item.ele.value = value;
			item.ele.onclick = function(){
				context.select(this.index, this.value);
			};
			this.groupView.add(item);
			this._items.push(item);
			this._groupCount ++;
		};
		FileView.prototype.addFile = function(file){
			var context = this;
			var view = new Ele.Layout("ele_file_item_view");
			var item = new Ele.Layout("ele_file_item");
			var deleteView = new Ele.Layout("ele_file_item_delete_view");
			var editView = new Ele.Layout("ele_file_item_edit_view");
			var delIcon = new Ele.Img(Ele._pathPrefix+"ele/assets/64/icon_remove.png", "ele_file_item_icon");
			var editIcon = new Ele.Img(Ele._pathPrefix+"ele/assets/64/icon_edit.png", "ele_file_item_icon");
			editView.ele.onclick = function(){
				context._pages.pushView(context._initPageEdit(file));
			};
			deleteView.ele.onclick = function(){
				context.confirm.setMsg("确认要删除该文件吗？");
				context.confirm.setSureHandler(function(){
					var value = file.id;
					if(context._deleteUrl != null && context._deleteUrl.trim() != ""){
						context.fDeleteController.loadData(context._deleteUrl+"?file="+value);
						return ;
					}
					if(typeof(context._viewEvent) == "function"){
						context._viewEvent("fileDelete", {file:value});
					}
				});
				context.confirm.show();
			};
			deleteView.add(delIcon);
			editView.add(editIcon);
			
			if(this.permission != null && this.permission.length == 7 && this.permission.charAt(6) == '1'){
				item.add(deleteView);
			}
			if(this.permission != null && this.permission.length == 7 && this.permission.charAt(5) == '1'){
				item.add(editView);
			}
			
			var img = new Ele.Img(file.url, "ele_file_item_img");
			var name = new Ele.Layout("ele_file_item_text");
			name.setHtml(file.name);
			var size = new Ele.Layout("ele_file_item_text");
			size.setHtml(file.size);
			item.add(img);
			item.add(name);
			item.add(size);
			view.add(item);
			
			this.fileView.add(view);
		};
		
		FileView.prototype.clearGroup = function(){
			this.groupView.clear();
			this._items.splice(0, this._groupCount);
			this._groupCount = 0;
		};
		
		FileView.prototype.select = function(index, value){
			if(index < 0 || this._groupSelect == index || index >= this._groupCount){
				return ;
			}
			var cellStyle = "ele_file_group_item ele_file_group_selected ele_file_group_double";
			if(index % 2 == 0){
				cellStyle = "ele_file_group_item ele_file_group_selected ele_file_group_single";
			}
			this._items[index].ele.className = cellStyle;
			if(this._groupSelect != -1){
				cellStyle = "ele_file_group_item ele_file_group_double";
				if(this._groupSelect % 2 == 0){
					cellStyle = "ele_file_group_item ele_file_group_single";
				}
				this._items[this._groupSelect].ele.className = cellStyle;
			}
			this._groupSelect = index;
			//获取对应的列表数据
			if(this._fileListUrl != null && this._fileListUrl.trim() != ""){
				if(this.permission != null && this.permission.length == 7 && this.permission.charAt(3) == '1'){
					this.fileController.loadData(this._fileListUrl+"?group="+value);
				}
			}
		};
		
		FileView.prototype._init = function(){
			this.view = new Ele.Layout("ele_file_view");
			this.ele = this.view.ele;
			this.confirm = new Ele.Confirm();
			this.permission = "1111111";
			this._groupCount = 0;
			this._groupSelect = -1;
			this._items = [];
			var context = this;
			if(typeof(args) == "object"){
				if(typeof(args.groupListUrl) == "string"){
					this._groupListUrl = args.groupListUrl;
				}
				if(typeof(args.fileListUrl) == "string"){
					this._fileListUrl = args.fileListUrl;
				}
				if(typeof(args.groupAddUrl) == "string"){
					this._groupAddUrl = args.groupAddUrl;
				}
				if(typeof(args.groupDeleteUrl) == "string"){
					this._groupDeleteUrl = args.groupDeleteUrl;
				}
				if(typeof(args.uploadUrl) == "string"){
					this._uploadUrl = args.uploadUrl;
				}
				if(typeof(args.updateUrl) == "string"){
					this._updateUrl = args.updateUrl;
				}
				if(typeof(args.deleteUrl) == "string"){
					this._deleteUrl = args.deleteUrl;
				}
				if(typeof(args.permission) == "string"){
					this.permission = args.permission;
				}
			}
			
			var groupPanle = new Ele.Layout("ele_file_group_view");
			this.groupView = new Ele.Layout("ele_file_group ele_scrollbar");
			groupPanle.add(this.groupView);
			
			var contentPanle = new Ele.Layout("ele_file_content_view");
			this._pages = new Ele.Views.PageControllerView();
			this._pages.pushView(this._initPageList());
			contentPanle.add(this._pages);
			
			this.titleView = new Ele.Layout("ele_file_title");
			this.titleView.setHtml("分组列表");
			var addView = new Ele.HLayout("ele_file_add");
			this.tbGroup = new Ele.TextBox({style:"ele_file_editgroup_style"});
			addView.add(this.tbGroup, {padding:"0 0 0 8px"});
			var btnAdd = new Ele.Button({text:"添加", onclick:function(){
				var name = context.tbGroup.getValue();
				if(context._groupAddUrl != null && context._groupAddUrl.trim() != ""){
					context.gAddController.loadData(context._groupAddUrl+"?groupName="+name);
					return ;
				}
				if(typeof(context._viewEvent) == "function"){
					context._viewEvent("addGroup", {name:name});
				}
			}});
			addView.add(btnAdd, {padding:"0 0 0 12px"});
			
			this.view.add(groupPanle);
			this.view.add(this.titleView);
			if(this.permission != null && this.permission.length == 7 && this.permission.charAt(1) == '1'){
				this.view.add(addView);
			}
			this.view.add(contentPanle);
			
			//如果绑定了分组数据源 自动加载
			if(this._groupListUrl != null && this._groupListUrl.trim() != ""){
				this.groupController = new Ele.Controllers.BaseController({
					loadHandler:function(data){
						context._onDataResponse("groupList",data);
					},
					errorHandler:function(error){
						if(context._errorEvent != null){
							context._errorEvent(error);
						}
					}
				});
				if(this.permission != null && this.permission.length == 7 && this.permission.charAt(0) == '1'){
					this.groupController.loadData(this._groupListUrl);
				}
			}
			if(this._fileListUrl != null && this._fileListUrl.trim() != ""){
				this.fileController = new Ele.Controllers.BaseController({
					loadHandler:function(data){
						context._onDataResponse("fileList",data);
					},
					errorHandler:function(error){
						if(context._errorEvent != null){
							context._errorEvent(error);
						}
					},
				});
			}
			if(this._groupAddUrl != null && this._groupAddUrl.trim() != ""){
				this.gAddController = new Ele.Controllers.BaseController({
					loadHandler:function(data){
						context._onDataResponse("groupAdd",data);
					},
					errorHandler:function(error){
						if(context._errorEvent != null){
							context._errorEvent(error);
						}
					},
				});
			}
			if(this._groupDeleteUrl != null && this._groupDeleteUrl.trim() != ""){
				this.gDeleteController = new Ele.Controllers.BaseController({
					loadHandler:function(data){
						context._onDataResponse("groupDelete",data);
					},
					errorHandler:function(error){
						if(context._errorEvent != null){
							context._errorEvent(error);
						}
					},
				});
			}
			if(this._deleteUrl != null && this._deleteUrl.trim() != ""){
				this.fDeleteController = new Ele.Controllers.BaseController({
					loadHandler:function(data){
						context._onDataResponse("fileDelete",data);
					},
					errorHandler:function(error){
						if(context._errorEvent != null){
							context._errorEvent(error);
						}
					},
				});
			}
		};
		
		FileView.prototype._onDataResponse = function(type, data){
			if(type == "groupList"){
				this.clearGroup();
				for(var i in data){
					this.addGroup(data[i].name, data[i].value);
				}
				if(this._groupCount > 0){
					//初始化第一条数据
					if(this._groupSelect != -1){
						var temp = this._groupSelect;
						this._groupSelect = -1;
						this.select(temp, data[temp].value);
					}else{
						this.select(0, data[0].value);
					}
				}
				return ;
			}
			if(type == "fileList"){
				//数据设置
				this.listView.clear();
				var len = data.length;
				if(len > 0){
					this.fileView.clear();
					for(var i = 0; i < len; i++){
						this.addFile(data[i]);
					}
					this.listView.add(this.fileView);
				}else{
					this.listView.add(this.emptyView);
				}
				return ;
			}
			if(type == "groupAdd"){
				this.groupController.loadData(this._groupListUrl);
				return ;
			}
			if(type == "groupDelete"){
				this._groupSelect = -1;
				this.groupController.loadData(this._groupListUrl);
				return ;
			}
			if(type == "fileDelete"){
				var value = this._items[this._groupSelect].ele.value;
				if(this._fileListUrl != null && this._fileListUrl.trim() != ""){
					this.fileController.loadData(this._fileListUrl+"?group="+value);
				}
				return ;
			}
		};
		
		FileView.prototype._initPageList = function(){
			var view = new Ele.Layout("ele_file_content");
			var barView = new Ele.HLayout("ele_file_content_bar");
			var left = new Ele.Layout("ele_file_content_bar_edge");
			var center = new Ele.Layout("ele_file_content_bar_center");
			center.setHtml("文件列表");
			var right = new Ele.Layout("ele_file_content_bar_edge");
			right.setAlign("right");
			var context = this;
			var mn_add = new Ele.IconLabel({text:"添加文件",icon:Ele._pathPrefix+"ele/assets/64/icon_add.png",onclick:function (){
				context._pages.pushView(context._initPageAdd());
			}});
			var mn_delete = new Ele.IconLabel({text:"删除该分组",icon:Ele._pathPrefix+"ele/assets/64/icon_remove.png",onclick:function (){
				context.confirm.setMsg("确认要删除该分组吗？");
				context.confirm.setSureHandler(function(){
					var value = context._items[context._groupSelect].ele.value;
					if(context._groupDeleteUrl != null && context._groupDeleteUrl.trim() != ""){
						context.gDeleteController.loadData(context._groupDeleteUrl+"?group="+value);
						return ;
					}
					if(typeof(context._viewEvent) == "function"){
						context._viewEvent("groupDelete", {group:value});
					}
				});
				context.confirm.show();
			}});
			if(this.permission != null && this.permission.length == 7 && this.permission.charAt(2) == '1'){
				left.add(mn_delete);
			}
			if(this.permission != null && this.permission.length == 7 && this.permission.charAt(4) == '1'){
				right.add(mn_add);
			}
			
			barView.add(left, {width:"40%"});
			barView.add(center, {width:"20%"});
			barView.add(right, {width:"40%"});
			view.add(barView);
			this.listView = new Ele.Layout("ele_file_content_body ele_scrollbar");
			this.fileView = new Ele.Layout("ele_file_list_view");
			this.emptyView = new Ele.VLayout("ele_file_empty");
			var emptyImage = new Ele.Img(Ele._pathPrefix+"ele/assets/empty.svg","ele_file_empty_image");
			var label = new Ele.Label("暂无数据");
			this.emptyView.add(emptyImage,{padding:"96px 0 0 0"});
			this.emptyView.add(label);
			this.listView.add(this.emptyView);
			view.add(this.listView);
			return view;
		};
		
		FileView.prototype._initPageAdd = function(){
			var view = new Ele.Layout("ele_file_content");
			var barView = new Ele.HLayout("ele_file_content_bar");
			var left = new Ele.Layout("ele_file_content_bar_edge");
			var center = new Ele.Layout("ele_file_content_bar_center");
			center.setHtml("添加文件");
			var right = new Ele.Layout("ele_file_content_bar_edge");
			right.setAlign("right");
			var context = this;
			var mn_back = new Ele.IconLabel({text:"返回",icon:Ele._pathPrefix+"ele/assets/64/icon_previous.png",onclick:function (isRoot, data){
				context._pages.pullView();
			}});
			var mn_position = new Ele.IconLabel({text:"文件列表 / 添加文件",style:"ele_icon_label ele_icon_label_none",icon:Ele._pathPrefix+"ele/assets/64/icon_position.png"});
			right.add(mn_position);
			left.add(mn_back);
			barView.add(left, {width:"40%"});
			barView.add(center, {width:"20%"});
			barView.add(right, {width:"40%"});
			view.add(barView);
			var body = new Ele.Layout("ele_file_content_body ele_scrollbar");
			var form = new Ele.Layout("ele_file_form");
			var formView = new Ele.Views.FormView();
			var textBoxItem = new Ele.Views.TextBoxItem({
				name:"fileName",
				text:"文件名称",
				hint:"请输入",
			});
			textBoxItem.validateNotEmpty();
			var fileItem = new Ele.Views.FileItem({
				name:"file",
				text:"文件",
			});
			fileItem.validateNotEmpty();
			formView.setEnctypeMfd();
			formView.addItem(textBoxItem);
			formView.addItem(fileItem);
			form.add(formView);
			
			var btnView = new Ele.HLayout("ele_file_form_button_panel");
			var reset = new Ele.Button({
				text:"重置",
				icon:Ele._pathPrefix+"ele/assets/64/icon_reset.png",
				onclick:function(){
					formView.reset();
					if(typeof(context._viewEvent) == "function"){
						context._viewEvent("reset", {});
					}
				}
			});
			var submit = new Ele.Button({
				text:"提交",
				icon:Ele._pathPrefix+"ele/assets/64/icon_submit.png",
				onclick:function(){
					if(!formView.validate()){
						return ;
					}
					if(context._uploadUrl != null && context._uploadUrl.trim() != ""){
						formView.setAction(context._uploadUrl+"?group="+context._items[context._groupSelect].ele.value);
						formView.submitFormAjax(function(res){
							var result = JSON.parse(res);
							if(result.resCode != 1000 && context._errorEvent != null){
								var error = {
									resCode:result.resCode,
									resMsg:result.resMsg
								};
								context._errorEvent(error);
								return ;
							}
							context._pages.pullView();
							var value = context._items[context._groupSelect].ele.value;
							if(context._fileListUrl != null && context._fileListUrl.trim() != ""){
								context.fileController.loadData(context._fileListUrl+"?group="+value);
							}
						});
						return ;
					}
					if(typeof(context._viewEvent) == "function"){
						context._viewEvent("upload", {formView:formView});
					}
				}
			});
			btnView.add(reset, {padding:"0 0 0 176px"});
			btnView.add(submit, {padding:"0 0 0 16px"});
			form.add(btnView);
			
			body.add(form);
			
			view.add(body);
			return view;
		};
		
		FileView.prototype._initPageEdit = function(file){
			var view = new Ele.Layout("ele_file_content");
			var barView = new Ele.HLayout("ele_file_content_bar");
			var left = new Ele.Layout("ele_file_content_bar_edge");
			var center = new Ele.Layout("ele_file_content_bar_center");
			center.setHtml("修改文件");
			var right = new Ele.Layout("ele_file_content_bar_edge");
			right.setAlign("right");
			var context = this;
			var mn_back = new Ele.IconLabel({text:"返回",icon:Ele._pathPrefix+"ele/assets/64/icon_previous.png",onclick:function (isRoot, data){
				context._pages.pullView();
			}});
			var mn_position = new Ele.IconLabel({text:"文件列表 / 修改文件",style:"ele_icon_label ele_icon_label_none",icon:Ele._pathPrefix+"ele/assets/64/icon_position.png"});
			right.add(mn_position);
			left.add(mn_back);
			barView.add(left, {width:"40%"});
			barView.add(center, {width:"20%"});
			barView.add(right, {width:"40%"});
			view.add(barView);
			var body = new Ele.Layout("ele_file_content_body ele_scrollbar");
			var form = new Ele.Layout("ele_file_form");
			var imageView = new Ele.Layout("ele_file_editfile_view");
			var image = new Ele.Img(file.url, "ele_file_editfile_image");
			imageView.add(image);
			form.add(imageView);
			
			var formView = new Ele.Views.FormView();
			var textBoxItem = new Ele.Views.TextBoxItem({
				name:"fileName",
				text:"文件名称",
				hint:"请输入",
				value:file.name
			});
			textBoxItem.validateNotEmpty();
			
			formView.appendFormData("file", file.id);
			formView.addItem(textBoxItem);
			form.add(formView);
			
			var btnView = new Ele.HLayout("ele_file_form_button_panel");
			var reset = new Ele.Button({
				text:"重置",
				icon:Ele._pathPrefix+"ele/assets/64/icon_reset.png",
				onclick:function(){
					formView.reset();
					if(typeof(context._viewEvent) == "function"){
						context._viewEvent("reset", {});
					}
				}
			});
			var submit = new Ele.Button({
				text:"提交",
				icon:Ele._pathPrefix+"ele/assets/64/icon_submit.png",
				onclick:function(){
					if(!formView.validate()){
						return ;
					}
					
					if(context._updateUrl != null && context._updateUrl.trim() != ""){
						formView.setAction(context._updateUrl);
						formView.submitAjax(function(res){
							var result = JSON.parse(res);
							if(result.resCode != 1000 && context._errorEvent != null){
								var error = {
									resCode:result.resCode,
									resMsg:result.resMsg
								};
								context._errorEvent(error);
								return ;
							}
							context._pages.pullView();
							var value = context._items[context._groupSelect].ele.value;
							if(context._fileListUrl != null && context._fileListUrl.trim() != ""){
								context.fileController.loadData(context._fileListUrl+"?group="+value);
							}
						});
						return ;
					}
					if(typeof(context._viewEvent) == "function"){
						context._viewEvent("fileUpdate", {file:file.id});
					}
				}
			});
			btnView.add(reset, {padding:"0 0 0 176px"});
			btnView.add(submit, {padding:"0 0 0 16px"});
			form.add(btnView);
			
			body.add(form);
			
			view.add(body);
			return view;
		};
		
		this._init();
	};
})();