window.onload = init;
function init(){
	//ELE 不在根目录时设置前缀路径
	Ele.initPath("EleJs");
	Ele.load(function(){
		console.log("ele .load ...");
		//创建一个面板
	});
}