var  highlightcolor='#c1ebff';
//此处clickcolor只能用win系统颜色代码才能成功,如果用#xxxxxx的代码就不行,还没搞清楚为什么:(
var  clickcolor='#51b2f6';
function  changeto(){
	source=event.srcElement;
	if  (source.tagName=="TR"||source.tagName=="TABLE")
		return;
	while(source.tagName!="TD")
	source=source.parentElement;
	source=source.parentElement;
	cs  =  source.children;
	if(cs[1]!=undefined){
		if  (cs[1].style.backgroundColor!=highlightcolor&&source.id!="nc"&&cs[1].style.backgroundColor!=clickcolor)
			for(i=0;i<cs.length;i++){
				if(cs[i]!=undefined)
				cs[i].style.backgroundColor=highlightcolor;
			}
	}
}

function  changeback(){
	if  (event.fromElement.contains(event.toElement)||source.contains(event.toElement)||source.id=="nc")
	return
	if  (cs[1]!=undefined&&event.toElement!=source&&cs[1].style.backgroundColor!=clickcolor)
	//source.style.backgroundColor=originalcolor
	for(i=0;i<cs.length;i++){
		if(cs[i]!=undefined)
		cs[i].style.backgroundColor="";
	}
}

function  clickto(){
	source=event.srcElement;
	if  (source.tagName=="TR"||source.tagName=="TABLE")
		return;
	while(source.tagName!="TD")
	source=source.parentElement;
	source=source.parentElement;
	cs  =  source.children;
	//alert(cs.length);
	if  (cs[1]!=undefined&&cs[1].style.backgroundColor!=clickcolor&&source.id!="nc")
	for(i=0;i<cs.length;i++){
		if(cs[i]!=undefined)
		cs[i].style.backgroundColor=clickcolor;
	}
	else
	for(i=0;i<cs.length;i++){
		if(cs[i]!=undefined)
		cs[i].style.backgroundColor="";
	}
}

//添加用例
function addparavalue(){
	var result = document.getElementsByName("checkbox_casecode");
	var j = 0,str;
	for(var i=0;i<result.length;i++){
		if(result[i].checked){
			j=j+1;
			str = result[i].value;
		}
	}
	if(j>1){
		$.ligerDialog.warn("只能选中一个接口模板！");
		return;
	}
	window.location.href='addvalue.jsp?caseCode='+str;
}

//查看用例列表
function valuelist(){
	var result = document.getElementsByName("checkbox_casecode");
	var j = 0,str;
	for(var i=0;i<result.length;i++){
		if(result[i].checked){
			j=j+1;
			str = result[i].value;
		}
	}
	if(j>1){
		$.ligerDialog.warn("只能选中一个接口模板！");
		return;
	}
	if(j==0){
		window.location.href='valuelist.jsp';
		return;
	}
	window.location.href='valuelist.jsp?caseCode='+str;
}

function checkIsInterger(num){
	var arr =  /^\+?[1-9][0-9]*$/.test(num);
    return arr;
}

function paraSizeIsShow(obj){
	var paratype = document.getElementsByName("paraType");
	for(var i=0;i<paratype.length;i++){
		if(obj == paratype[i]){
			document.getElementsByName("casePara")[i].disabled="";
			if(obj.value=='BYTES'){
				document.getElementsByName("paraSize")[i].value="";
				document.getElementsByName("paraSize")[i].disabled="";
			}else if(obj.value=='char[]'){
				document.getElementsByName("paraSize")[i].value="";
				document.getElementsByName("paraSize")[i].disabled="";
			}else if(obj.value=='BYTE'){
				document.getElementsByName("paraSize")[i].value="1";	
				document.getElementsByName("paraSize")[i].disabled="disabled";
			}else if(obj.value=='char'){
				document.getElementsByName("paraSize")[i].value="1";	
				document.getElementsByName("paraSize")[i].disabled="disabled";
			}else if(obj.value=='WORD'){
				document.getElementsByName("paraSize")[i].value="2";	
				document.getElementsByName("paraSize")[i].disabled="disabled";
			}else if(obj.value=='DWORD'){
				document.getElementsByName("paraSize")[i].value="4";	
				document.getElementsByName("paraSize")[i].disabled="disabled";
			}else if(obj.value=='INT'){
				document.getElementsByName("paraSize")[i].value="4";	
				document.getElementsByName("paraSize")[i].disabled="disabled";
			}else if(obj.value=='long'){
				document.getElementsByName("paraSize")[i].value="4";	
				document.getElementsByName("paraSize")[i].disabled="disabled";
			}else if(obj.value=='long long'){
				document.getElementsByName("paraSize")[i].value="8";	
				document.getElementsByName("paraSize")[i].disabled="disabled";
			}else if(obj.value=='short'){
				document.getElementsByName("paraSize")[i].value="2";	
				document.getElementsByName("paraSize")[i].disabled="disabled";
			}else if(obj.value=='BYTECount'){
				document.getElementsByName("paraSize")[i].value="";
				document.getElementsByName("paraSize")[i].disabled="";
			}else if(obj.value=='WORDCount'){
				document.getElementsByName("paraSize")[i].value="";
				document.getElementsByName("paraSize")[i].disabled="";
			}else{
				document.getElementsByName("paraSize")[i].value="";	
				document.getElementsByName("paraSize")[i].disabled="disabled";
			}
		}
	}
}

function loaddings(path){
	var mask="<div id='divm'></div>";
    var loading="<div id='divlo'><div><img src='"+path+"/images/bigloading.gif'/></div></div>"
    $("body").prepend(loading).prepend(mask);
    $("#divlo").css("position","absolute").css("width","48px").css("height","48px").css("background-color","#fff").css("text-align","center").css("z-index","9999").css("top","250px").css("left","350px");
    $("#divm").width($(document).width()).height($(document).height()).css("filter","alpha(opacity=60)").css("-moz-opacity","0.4").css("position","absolute").css("z-index","10");
}

function loaddingend(){
	document.getElementById("divm").style.display="none"; 
	document.getElementById("divlo").style.display="none"; 
}
function divclose(){
	 var dialog = frameElement.dialog;
    dialog.close();//关闭dialog 
}

var getElementsByName = function(tag, name){  
    var returns = document.getElementsByName(name);  
    if(returns.length > 0) return returns;  
    returns = new Array();  
    var e = document.getElementsByTagName(tag);  
    for(var i = 0; i < e.length; i++){  
        if(e[i].getAttribute("name") == name){  
            returns[returns.length] = e[i];  
        }  
    }  
    return returns;  
}
//设置cookie
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}
//获取cookie
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
    }
    return "";
}
//清除cookie  
function clearCookie(name) {  
    setCookie(name, "", -1);  
}
