(function(){
	var DateFormat = Ele.Utils.DateFormat = function(pattern){
		this.eleType = "util";
		this._pattern;
	
		//按照pattern解析日期
		DateFormat.prototype.format = function(date) {
			if(!(date instanceof Date)){
				return ;
			}
			var o = {
				"M+" : date.getMonth()+1, //月份
				"d+" : date.getDate(), //日
				"H+" : date.getHours(), //小时
				"m+" : date.getMinutes(), //分
				"s+" : date.getSeconds(), //秒
				"S" : date.getMilliseconds() //毫秒
			};
			var week = {"0" : "\u65e5","1" : "\u4e00","2" : "\u4e8c","3" : "\u4e09","4" : "\u56db","5" : "\u4e94","6" : "\u516d"};
			var fmt = this._pattern;
			if(/(y+)/.test(fmt)){
				fmt = fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
			}
			if(/(E+)/.test(fmt)){
				fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "\u661f\u671f" : "\u5468") : "") +week[date.getDay()+""]);
			}
			if(/(q+)/.test(fmt)){
				var q = (Math.floor((date.getMonth()+3)/3));
				fmt = fmt.replace(RegExp.$1, RegExp.$1.length > 1?("Q"+q):q);
			}
			for(var i in o){
				if( new RegExp("("+ i +")").test(fmt)){
					fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[i]) : (("00"+ o[i]).substr((""+ o[i]).length)));
				}
			}
			//涉及小m，最后封装
			if(/(h+)/.test(fmt)){
				var step = date.getHours() > 12 ? "pm " : "am ";
				var h = date.getHours()%12 == 0 ? 12 : date.getHours()%12, //小时
				fmt = fmt.replace(RegExp.$1, step + ((RegExp.$1.length == 1) ? (h) : (("00"+ h).substr((""+ h).length))));
			}
			return fmt;
		};
		//按照pattern解析日期
		DateFormat.prototype.parse = function(dateString) {
			var fmt = this._pattern;
			if(dateString.length < fmt.length){
				throw new Error("'"+dateString+"' content length must equals or more than pattern:"+fmt);
				return null;
			}
			if(/(h+)/.test(fmt)){
				//时间加3
				if(dateString.length + 3 < fmt.length){
					throw new Error("'"+dateString+"' content with 'h' length must more than pattern:"+fmt);
					return null;
				}
			}
			
			var startIndex;
			var len;
			var year;
			var mouth;
			var day;
			var hour;
			var minutes;
			var seconds;
			
			var o = /(y|M|d|H|h|m|s|S|E|q)/;
			var p = {
				"M":{name:"mouth", value:null},
				"d":{name:"day", value:null},
				"H":{name:"hour", value:null},
				"m":{name:"minutes", value:null},
				"s":{name:"seconds", value:null}
			}
			
			for(var i = 0; i < fmt.length; ){
				var ch = fmt.charAt(i);
				//年份处理
				if(ch == 'y'){
					//获取连续的长度
					/(y+)/.test(fmt);
					len = RegExp.$1.length;
					//截取数据
					startIndex = fmt.indexOf(RegExp.$1);
					year = dateString.substring(startIndex, startIndex + len);
					if(len < 4){
						var now = new Date();
						year = (now.getFullYear()+"").substring(startIndex, startIndex + (4 - RegExp.$1.length)) + year;
					}
					if(year.trim() == "" || isNaN(year)){
						throw new Error("year parse error:"+year);
					}
					year = parseInt(year);
					
					i += len;
					continue;
				}
				if(ch == 'h'){
					//获取连续的长度
					/(h+)/.test(fmt);
					len = RegExp.$1.length;
					
					//截取数据
					startIndex = fmt.indexOf(RegExp.$1);
					//获取am pm后规范格式
					var ap = dateString.substring(startIndex, startIndex + 2);
					dateString = dateString.substring(0, startIndex) + dateString.substring(startIndex + 3, dateString.length);
					fmt.charAt(startIndex + 1);
					if(len < 2){
						if(startIndex == fmt.length - 1){
							if(dateString.length > fmt.length){
								p['H'].value = dateString.substring(startIndex, startIndex + 2);
							}else{
								p['H'].value = dateString.substring(startIndex, startIndex + 1);
							}
						}else{
							//检测下一位是否具有分隔符
							if(o.test(fmt.charAt(startIndex + 1))){
								throw new Error("single hour format need divider.");
							}
							//数据后面1-2位必须拥有对应分隔符号
							if(fmt.charAt(startIndex + 1) != dateString.charAt(startIndex + 1) && fmt.charAt(startIndex + 1) != dateString.charAt(startIndex + 2)){
								throw new Error("single "+p[item].name+" format data divider not found,data:"+dateString);
							}
							//确定日期数据是几位
							if(dateString.charAt(startIndex + 1).trim() !="" && !isNaN(dateString.charAt(startIndex + 1)) && fmt.charAt(startIndex + 1) != dateString.charAt(startIndex + 1)){
								//非分隔字符亦非且是数字则认定为是单项扩展数据
								p['H'].value = dateString.substring(startIndex, startIndex + 2);
								//数据更改，防止数据错位
								dateString = dateString.substring(0, startIndex) +"h"+ dateString.substring(startIndex + 2, dateString.length);
							}else{
								p['H'].value = dateString.substring(startIndex, startIndex + 1);
							}
						}
					}else{
						if(startIndex == dateString.length - 1){
							throw new Error("'"+RegExp.$1+"' double parse error to '"+dateString.charAt(dateString.length - 1)+"'");
						}
						if(dateString.charAt(startIndex).trim() == "" || dateString.charAt(startIndex + 1).trim() == ""){
							throw new Error("'"+RegExp.$1+"' double parse error to '"+dateString.substring(startIndex, startIndex + 2)+"'");
						}
						if(isNaN(dateString.charAt(startIndex)) || isNaN(dateString.charAt(startIndex + 1))){
							throw new Error("'"+RegExp.$1+"' double parse error to '"+dateString.substring(startIndex, startIndex + 2)+"'");
						}
						//仅取最大值2位
						p['H'].value = dateString.substring(startIndex, startIndex + 2);
					}
					
					if(p['H'].value.trim() == "" || isNaN(p['H'].value)){
						throw new Error("hour parse error:"+p['H'].value);
					}
					p['H'].value = parseInt(p['H'].value);
					
					if(ap == "pm"){
						p['H'].value = p['H'].value + 12;
					}
					i += len;
					continue;
				}
				
				//月、日、时分秒批量处理
				var isFind = false;
				for(var item in p){
					if(ch != item){
						continue;
					}
					isFind = true;
					//获取连续的长度
					new RegExp("("+ item +"+)").test(fmt);
					len = RegExp.$1.length;
					
					//截取数据
					startIndex = fmt.indexOf(RegExp.$1);
					if(len < 2){
						//最后一位
						if(startIndex == fmt.length - 1){
							if(dateString.length > fmt.length){
								p[item].value = dateString.substring(startIndex, startIndex + 2);
							}else{
								p[item].value = dateString.substring(startIndex, startIndex + 1);
							}
						}else{
							//检测下一位是否具有分隔符
							if(o.test(fmt.charAt(startIndex + 1))){
								throw new Error("single "+p[item].name+" format need divider.");
							}
							//数据后面1-2位必须拥有对应分隔符号
							if(fmt.charAt(startIndex + 1) != dateString.charAt(startIndex + 1) && fmt.charAt(startIndex + 1) != dateString.charAt(startIndex + 2)){
								throw new Error("single "+p[item].name+" format data divider not found,data:"+dateString);
							}
							//确定日期数据是几位
							if(dateString.charAt(startIndex + 1).trim() !="" && !isNaN(dateString.charAt(startIndex + 1)) && fmt.charAt(startIndex + 1) != dateString.charAt(startIndex + 1)){
								//非分隔字符亦非且是数字则认定为是单项扩展数据
								p[item].value = dateString.substring(startIndex, startIndex + 2);
								//数据更改，防止数据错位
								dateString = dateString.substring(0, startIndex) +item+ dateString.substring(startIndex + 2, dateString.length);
							}else{
								p[item].value = dateString.substring(startIndex, startIndex + 1);
							}
						}
					}else{
						if(startIndex == dateString.length - 1){
							throw new Error("'"+RegExp.$1+"' double parse error to '"+dateString.charAt(dateString.length - 1)+"'");
						}
						if(dateString.charAt(startIndex).trim() == "" || dateString.charAt(startIndex + 1).trim() == ""){
							throw new Error("'"+RegExp.$1+"' double parse error to '"+dateString.substring(startIndex, startIndex + 2)+"'");
						}
						if(isNaN(dateString.charAt(startIndex)) || isNaN(dateString.charAt(startIndex + 1))){
							throw new Error("'"+RegExp.$1+"' double parse error to '"+dateString.substring(startIndex, startIndex + 2)+"'");
						}
						//仅取最大值2位
						p[item].value = dateString.substring(startIndex, startIndex + 2);
					}
					if(p[item].value.trim() == "" || isNaN(p[item].value)){
						throw new Error(p[item].name+" parse error:"+p[item].value);
					}
					p[item].value = parseInt(p[item].value);
					
					i += len;
					break;
				}
				
				//没有找到抬走下一位
				if(!isFind){
					i ++;
				}
			}
			
			return new Date(year, parseInt(p["M"].value) - 1, p["d"].value, p["H"].value, p["m"].value, p["s"].value);
		};
	
		DateFormat.prototype.setPattern = function(pattern){
			if(typeof(pattern) == "string"){
				this._pattern = pattern;
			}
		};
		
		DateFormat.prototype.getPattern = function(){
			return this._pattern;
		};
		
		DateFormat.prototype._init = function(){
			this._pattern ="yyyy-MM-dd";
			if(typeof(pattern) == "string"){
				this._pattern = pattern;
			}
		};
		
		this._init();
	}
})();