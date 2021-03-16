window.onload = init;

var ajax;

function init(){
	//ELE 不在根目录时设置前缀路径
	Ele.initPath("EleJs");
	
	Ele.load(function(){
		ajax = new Ele.Utils.Ajax();
	});
}

function openPage(page){
	window.open("showcase/"+page);
}
function loadPage(page){
	ajax.request(page, function(res){
		if(res.indexOf('<script>') != -1){
			var arr = res.split('<script>');
			document.getElementById("content_view").innerHTML = arr[0];
			var earr = arr[1].split('</script>');
			eval(earr[0]);
		}
		
	});
}
