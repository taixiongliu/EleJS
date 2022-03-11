(function(){
	var Descartes = Ele.Utils.Descartes = function() {
		this.eleType = "util";
		this.array = [];
	
		Descartes.prototype.addArray = function(array) {
			this.array.push(array);
		};
		Descartes.prototype.toStringDescartes = function() {
			var arr = [];
			for(var i in this.array){
				var yet = this.array[i];
				if(i == 0){
					for(var j in yet){
						arr.push(yet[j]);
					}
				}else{
					arr = this.copyString(arr, yet);
				}
			}
			return arr;
		};
		
		Descartes.prototype.copyString = function(arr, yet) {
			var temp = [];
			for(var i in arr){
				for(var j in yet){
					temp.push(arr[i] + yet[j]);
				}
			}
			return temp;
		};
		Descartes.prototype.toArrayDescartes = function() {
			var arr = [];
			for(var i in this.array){
				var yet = this.array[i];
				if(i == 0){
					for(var j in yet){
						arr.push([yet[j]]);
					}
				}else{
					arr = this.copyArray(arr, yet);
				}
			}
			return arr;
		};
		
		Descartes.prototype.copyArray = function(arr, yet) {
			var temp = [];
			for(var i in arr){
				for(var j in yet){
					temp.push(this.appendArray(arr[i], yet[j]));
				}
			}
			return temp;
		};
		
		Descartes.prototype.appendArray = function(arr, item) {
			var temp = [];
			for(var i in arr){
				temp.push(arr[i]);
			}
			temp.push(item);
			return temp;
		};
	};
})();
