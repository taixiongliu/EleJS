window.onload = init;
var ajax;
var alert;
function init(){
	Ele.initPath("EleJs");//本地根目录下的文件夹，线上无二级目录可忽略
	Ele.initView("mainView");
	Ele.load(function(rootView){
		ajax = new Ele.Utils.Ajax();
		alert = new Ele.Alert();
	});
}

function submit(){
	alert.setMsg("提示");
	alert.show();
	return ;
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