window.onload = init;
var winner;
var ajax;
function init(){
	Ele.initPath("EleJs");//本地根目录下的文件夹，线上无二级目录可忽略
	//部分组件加载 减少http资源开销
	Ele.loadComponent(['WinInner','Ajax'],function(){
		winner = new Ele.Utils.WinInner();
		ajax = new Ele.Utils.Ajax();
		initPage();
		winner.addResizeHandler(function(){
			initPage();
		});
	});
}

function initPage(){
	var fs = winner.getWidth() / 24;
	if(fs < 46){
		fs = 46;
	}
	document.getElementsByTagName("html")[0].style.fontSize = fs+"px";
}

function submit(){
	//提交验证忽略，模拟提交
	//默认post提交
	ajax.setParameter("name=ele&passwd=123");
	ajax.request("login.json",function(res){
		console.log(res);
		alert(res);
	});
}

//回车登录
function enterlogin(event){
	if (event.keyCode == 13){
		event.returnValue=false;
		event.cancel = true;
		submit();
	}
}