
var oldAjax = $.ajax;
$.ajax = function(option) {
    // Do your magic.
    if (option.type == 'POST' || option.type == 'post') {
        /* 防止短期多次提交 */
        /*
        if (window.NO_POST) {
            return;
        }
        window.NO_POST = true;
        setTimeout(function() {
            window.NO_POST = false;
        }, 1000);
        */

        var wait_f = function() {
            $('body').append('<div class="k_saving_musk"></div>');
        }
        var cancel_f = function() {
            $(".k_saving_musk").remove();
        }

        wait_f();
        var success_callback = option.success || function() {},
            fail_callback = option.error || function() {};
        option.success = function() {
            cancel_f();
            success_callback.apply($, arguments);
        }
        option.error = function() {
            cancel_f();
            fail_callback.apply($, arguments);
        }
    }
    return oldAjax.apply($, arguments);
}

//
//param:元素ID
function loadname(param,action,value,platform){
   		//取得输入框JQuery对象 
			var $searchInput = $(param); 
			var $search_depend = $(value); 
			//关闭浏览器提供给输入框的自动完成 
			$searchInput.attr('autocomplete','off'); 
			//创建自动完成的下拉列表，用于显示服务器返回的数据,插入在搜索按钮的后面，等显示的时候再调整位置 
			var $autocomplete = $('<div class="autocomplete"></div>') 
			.hide() 
			.insertAfter(param);
			
			//清空下拉列表的内容并且隐藏下拉列表区 
			var clear = function(){ 
			$autocomplete.empty().hide(); 
			}; 
			//注册事件，当输入框失去焦点的时候清空下拉列表并隐藏 
			$searchInput.blur(function(){ 
			setTimeout(clear,500); 
			}); 
			//下拉列表中高亮的项目的索引，当显示下拉列表项的时候，移动鼠标或者键盘的上下键就会移动高亮的项目，想百度搜索那样 
			var selectedItem = null; 
			//timeout的ID 
			var timeoutid = null; 
			//设置下拉项的高亮背景 
			var setSelectedItem = function(item){ 
			//更新索引变量 
			selectedItem = item ; 
			//按上下键是循环显示的，小于0就置成最大的值，大于最大值就置成0 
			if(selectedItem < 0){ 
			selectedItem = $autocomplete.find('li').length - 1; 
			} 
			else if(selectedItem > $autocomplete.find('li').length-1 ) { 
			selectedItem = 0; 
			} 
			//首先移除其他列表项的高亮背景，然后再高亮当前索引的背景 
			$autocomplete.find('li').removeClass('highlight') 
			.eq(selectedItem).addClass('highlight'); 
			}; 

			var ajax_request = function(){ 
			//ajax服务端通信 
			$.ajax({
			 
			'url':'/uiautomation/indexshow', //服务器的地址 
			'data':{'search-text':$searchInput.val().split(";")[$searchInput.val().split(";").length-1],'action':action,'value':$search_depend.val(),'platform':platform}, //参数 
			'dataType':'json', //返回数据类型 
			'type':'POST', //请求类型 
			'success':function(data){ 
			if(data.length) {
			data[data.length]="test";
					
			//遍历data，添加到自动完成区 
			$.each(data, function(index,term) { 
			//创建li标签,添加到下拉列表中 
			$('<ul></ul>').appendTo($autocomplete)
			$('<li></li>').text(term).appendTo($autocomplete)
			.addClass('clickable') 
			.hover(function(){ 
			//下拉列表每一项的事件，鼠标移进去的操作 
			$(this).siblings().removeClass('highlight'); 
			$(this).addClass('highlight'); 
			selectedItem = index; 
			},function(){ 
			//下拉列表每一项的事件，鼠标离开的操作 
			$(this).removeClass('highlight'); 
			//当鼠标离开时索引置-1，当作标记 
			selectedItem = -1; 
			}) 
			.click(function(){ 
			//鼠标单击下拉列表的这一项的话，就将这一项的值添加到输入框中 
				var list =  $searchInput.val().split(";");
				var str = '';
				//$searchInput.val('');
				if (list.length<2){
					$searchInput.val('');
					}
					else{
						for(i=0;i<list.length-1;i++){
							str +=list[i]+';';
							}
							$searchInput.val(str);
						}
			if(action){
				$searchInput.val(term);
				}
				else{
			$searchInput.val($searchInput.val()+term+";"); 
			}
			//清空并隐藏下拉列表 
			$autocomplete.empty().hide(); 
			}); 
			});//事件注册完毕 
			//设置下拉列表的位置，然后显示下拉列表 
			
			
			var ypos = $searchInput.position().top+23; 
			var xpos = $searchInput.position().left; 
			height = 27*(data.length+1) +"px";
			$autocomplete.css('width',$searchInput.css('width'));
			$autocomplete.css('height',height);  
			//$autocomplete.css({'position':'relative','left':xpos + "px",'top':ypos +"px"}); 
			$autocomplete.css({'position':'relative','left':xpos + "px",'top':ypos +"px"}); 
			setSelectedItem(0); 
			//显示下拉列表 
			$autocomplete.show(); 
			} 
			} 
			}); 
			}; 

			//对输入框进行事件注册 
			$searchInput 
			.keyup(function(event) { 
			//字母数字，退格，空格 
			if(event.keyCode > 40 || event.keyCode == 8 || event.keyCode ==32) { 
			//首先删除下拉列表中的信息 
			$autocomplete.empty().hide(); 
			clearTimeout(timeoutid); 
			timeoutid = setTimeout(ajax_request,100); 
			} 
			else if(event.keyCode == 38){ 
			//上 
			//selectedItem = -1 代表鼠标离开 
			if(selectedItem == -1){ 
			setSelectedItem($autocomplete.find('li').length-1); 
			} 
			else { 
			//索引减1 
			setSelectedItem(selectedItem - 1); 
			} 
			event.preventDefault(); 
			} 
			else if(event.keyCode == 40) { 
			//下 
			//selectedItem = -1 代表鼠标离开 
			if(selectedItem == -1){ 
			setSelectedItem(0); 
			} 
			else { 
			//索引加1 
			setSelectedItem(selectedItem + 1); 
			} 
			event.preventDefault(); 
			} 
			}) 
			.keypress(function(event){ 
			//enter键 
			if(event.keyCode == 13) { 
			//列表为空或者鼠标离开导致当前没有索引值 
			if($autocomplete.find('li').length == 0 || selectedItem == -1) { 
			return; 
			} 
				var list =  $searchInput.val().split(";");
				var str = '';
				//$searchInput.val('');
				if (list.length<2){
					$searchInput.val('');
					}
					else{
						for(i=0;i<list.length-1;i++){
							str +=list[i]+';';
							}
							$searchInput.val(str);
						}
						
						if(action){
				$searchInput.val($autocomplete.find('li').eq(selectedItem).text());
				}
				else{
			$searchInput.val($searchInput.val()+$autocomplete.find('li').eq(selectedItem).text()+";"); 
			}
						
			
			//$searchInput.val($autocomplete.find('li').eq(selectedItem).text()); 
			$autocomplete.empty().hide(); 
			event.preventDefault(); 
			} 
			}) 
			.keydown(function(event){ 
			//esc键 
			if(event.keyCode == 27 ) { 
			$autocomplete.empty().hide(); 
			event.preventDefault(); 
			} 
			});

			$(window).resize(function() { 
			var ypos = $searchInput.position().top+23; 
			var xpos = $searchInput.position().left; 
			$autocomplete.css('width',$searchInput.css('width')); 
			$autocomplete.css({'position':'absolute','left':xpos + "px",'top':ypos +"px",'z-index':999}); 
			}); 
   
    } 
function getUrlParam(paramname,purl) {
          var reg = new RegExp("([&|?])" + paramname + "=([^&]*)(&|$)");
          var r = purl.match(reg); 
          if (r != null)
          {
          return unescape(r[2]);
          }
          return null;      
          }
function unique(arr) {
  var ret = []
  var hash = {}
 
  for (var i = 0; i < arr.length; i++) {
    var item = arr[i]
    var key = typeof(item) + item
    if (hash[key] !== 1) {
      ret.push(item)
      hash[key] = 1
    }
  }
 
  return ret
}

function exclud(arr,sonarr) {
  var ret = []
  try {
  for (var i = 0; i < arr.length; i++) {
    var item = g_child[arr[i]].data['Rows'];
    for (var j = 0; j < item.length; j++) {
    index = inarray(sonarr,item[j].id)
    if (index!=-1){
    
    ret = sonarr.splice(index,1)}
    }
    
  }
  }
  catch(e){}
 
  return sonarr
}

function showbug(id){
    title = '责任Bug详情';
    url = "/clientmanage_v2/has_score/?id=" + id + "&type=showbug";
    opendialog(title,url,true,false,false,'',500,820)
    //opendialog('Bug详情',"/clientmanage_v2/pmsedit_v2/?id=" + id + "&action=show_buglist",500,820)    
}

function AsyncData(url,data){
    var modes;
    $.ajax({
            url : url,
            type : 'post',
            data : data,
            async:false, 
            dataType : 'json',
            success : function(data){
            modes = data;
        },
        error : function(data, status, e){
            alert('服务器异常!');
        }
        });
    return modes;
    }
function check_status(id,current_status) {
    h = '';
    data = {
        'action': 'get_status',
        'id': id

    },
    status = AsyncData("/clientmanage_v2/pmsedit_v2/", data);
    status_list = status.split(',');
        for (i = 0; i < status_list.length; i++) {
        if (status_list[i]!= current_status ) {
            if (i>0){
                id_list = id.split(',')
                $.ligerDialog.warn("需求ID:"+id_list[i]+"已经不处于"+current_status+"，不支持此操作");
                return false
            }
            $.ligerDialog.warn("需求ID:"+id.toString()+"已经不处于"+current_status+"，不支持此操作");
            return false
        }
        }
    return true
}
function rowAttrRender(rowdata,rowid)
    {
        if (rowdata.is_pause == 1 || rowdata.pmsphase__is_pause == 1 )
            {
            return "style='background:rgba(113,113,116,0.34);'";
            }
        return "";
    }
function tooltip() {
    try {
        $('[data-toggle="tooltip"]').ligerTip({ width: 350,auto:true });
        $('[data-toggle-2="tooltip"]').ligerTip({ width: 350,auto:true });
        $('[data-toggle-3="tooltip"]').tooltip();
        $('[data-toggle="bootstrap-tooltip"]').tooltip();
    } catch(e) {
        $('[data-toggle="tooltip"]').tooltip();
    }
    try{
        $('[data-toggle="bootstrap-popover"]').popover();
    }
    catch (e){

    }
}
function rowAttr(rowdata,rowid)
    {
        if (rowdata.stage == "已完成" ||rowdata.stage == "取消")
            {
            return "style='background:rgba(113, 113, 116, 0.45);'";
            }
        return "";
    }
function escape_str(base_str) {
            var regStr = new RegExp("/~","g");
            var regStr1 = new RegExp("/@","g");
            var regStr2 = new RegExp("/!","g");
            var regStr3 = new RegExp("%%","g");
            var regStr4 = new RegExp("/,","g");
            var regStr5 = new RegExp("/:","g");
            var regStr6 = new RegExp("@","g");
            new_str = base_str.replace(regStr,"&").replace(regStr1,"\n").replace(regStr2,"\\").replace(regStr3,"\'").replace(regStr4,">").replace(regStr5,"<").replace(regStr6,'"');
            return new_str;
          }

function Mention(url,data,title1,url1,title2,url2,flag){
    $.ajax({
            url: url,
            type: 'post',
            data: data,
            dataType: 'json',
            success: function(data) {

                if (data.status == 1) {
                if (flag == '1'){
                    url1 = url1 + data.id;
                    opendialog(title1,url1,true,true,true,'mention',570,1100);}
                //opendialog(title1,url1,570,1100); 
                else if (flag == '2'){
                    opendialog(title1,url1,true,true,true,'storage',570,1100);
                    
                }
                } 
                else if (data.status == 2){
                    
                    $.ligerDialog.warn(data.error);
                }
                else{
                    $.ligerDialog.error(data.error);
                }
            },
            error: function(data, status, e) {
                alert('服务器异常!');
            }
        });
    
    
}
function gray_pass(id) {

url = "/clientmanage_v2/testedit/";
data = {
        'action': 'is_storage',
        'id': id,
            };
title1 = '提审';
url1 = "/clientmanage_v2/testedit/?id=" + id + "&" + "type=storage";
title2 = '信息补充';
url2 = "/clientmanage_v2/testedit/?type=add_information&mention_id="+id+"&id=";
Mention(url,data,title1,url1,title2,url2,'2')	
 
    }
function mention_product(id,splitid) {

url = "/clientmanage_v2/waitmentionedit/";
data = {
                'action': 'is_mention',
                'id': id,
                'splitid':splitid
            };
title1 = '产品验收';
url1 = "/clientmanage_v2/waitmentionedit/?splitid=" +splitid+ "&type=mention&flag=product"+"&id=";
title2 = '信息补充';
url2 = "/clientmanage_v2/waitmentionedit/?splitid=" +splitid+ "&type=add_information"+ "&mention_id="+id+"&id=";
Mention(url,data,title1,url1,title2,url2,'1')
      }
function mention_gray(id,splitid) {

url = "/clientmanage_v2/waitmentionedit/";
data = {
                'action': 'is_mention',
                'flag': 'gray',
                'id': id,
                'splitid':splitid
            };
title1 = '灰度提测';
url1 = "/clientmanage_v2/waitmentionedit/?splitid=" +splitid+ "&type=mention&flag=gray"+"&id=";
title2 = '信息补充';
url2 = "/clientmanage_v2/waitmentionedit/?splitid=" +splitid+ "&type=add_information"+ "&mention_id="+id+"&id=";
Mention(url,data,title1,url1,title2,url2,'1')
      }
function mention(id,splitid) {

url = "/clientmanage_v2/waitmentionedit/";
data = {
                'action': 'is_mention',
                'id': id,
                'splitid':splitid
            };
title1 = '提测';
url1 = "/clientmanage_v2/waitmentionedit/?splitid=" +splitid+ "&type=mention"+"&id=";
title2 = '信息补充';
url2 = "/clientmanage_v2/waitmentionedit/?splitid=" +splitid+ "&type=add_information"+ "&mention_id="+id+"&id=";
Mention(url,data,title1,url1,title2,url2,'1')
      }
function mention_fixbug(id, splitid) {

    url = "/clientmanage_v2/waitmentionedit/";
    data = {
        'action': 'is_mention',
        'id': id,
        'splitid': splitid
    };
    title1 = '提测';
    url1 = "/clientmanage_v2/waitmentionedit/?splitid=" + splitid + "&type=mention" + "&id=";
    title2 = '信息补充';
    url2 = "/clientmanage_v2/waitmentionedit/?splitid=" + splitid + "&type=add_information" + "&mention_id=" + id + "&id=";
    Mention(url, data, title1, url1, title2, url2, '1')
}
function opendialog(title,url,has_ok_button,has_cancel_button,is_execute_callback,action) {
    var height = arguments[6] ? arguments[6] : 400;
    var width = arguments[7] ? arguments[7] : 800;
    var istop = arguments[8] ? arguments[8] : false;
    buttons = [];
    function callback_ok(item,dialog){
        dialog.frame.window.edit(action, {dialog: dialog});
    }
    function callback_cancel(item,dialog){
        dialog.hide();    
    }
    
    if (has_ok_button) {
        var buttons_protype = new Object();
        buttons_protype['text'] = "确定";
        if (is_execute_callback) {
            buttons_protype['onclick'] = callback_ok;
        }
        else {
            buttons_protype['onclick'] = callback_cancel;
        }
        buttons.push(buttons_protype);
    }
    if (has_cancel_button){
        var buttons_protype = new Object();
        buttons_protype['text'] = "取消";
        buttons_protype['onclick'] = callback_cancel;
        buttons.push(buttons_protype);
    }
    if(istop){
        return top.$.ligerDialog.open({
            height: height,
            width: width,
            title: title,
            url: url,
            showMax: false,
            showToggle: true,
            showMin: false,
            isResize: true,
            slide: false,
            buttons:buttons,
            allowClose:true,
        });		 
    }

    return $.ligerDialog.open({
            height: height,
            width: width,
            title: title,
            url: url,
            showMax: false,
            showToggle: true,
            showMin: false,
            isResize: true,
            slide: false,
            buttons:buttons,
            allowClose:true,


        });		 
}
function update_monitor(url,cb) {
    $.ajax({
        url: url,
        type: 'post',
        dataType: 'json',
        success: function(data) {
            if (data.status == 1) {

                if (cb) cb();

            }
        },
        error: function(data, status, e) {
            alert('服务器异常!');
        }
    });
}
function post(message,data,url, cb, no_alert){
    
    return $.ligerDialog.confirm(message, '提示', 
    function(yes)
    { 
        if(yes == true){
        $.ajax({
        url: url,
        type: 'post',
        data: data,
        dataType: 'json',
        success: function(data) {

        if (data.status == 1) {
            if(data.msg){
                $.ligerDialog.success(data.msg);
            }
            else if (!no_alert){
                $.ligerDialog.waitting('操作成功');
                setTimeout(function ()
                {
                    $.ligerDialog.closeWaitting();
                }, 500);
                
            }
            if (cb)         cb();
                try{
                    parent.window.g.refresh();
                }
                catch(err){
                    try {
                     if (window.g.refresh)      window.g.refresh();
                     else if (window.g.fetch)    window.g.fetch();
                    else    window['g'+window.NowGid].bootstrapTable('refresh');
                } catch(e) {
                    loadgridRefresh(g.options.page,g.options.pageSize,g.options.sortName,g.options.sortOrder);
                }
                }
                } else {
                    $.ligerDialog.error(data.error);
                    
                }
            },
            error: function(data, status, e) {
                alert('服务器异常!');
            }
        }); 
                        }
                    });

}
function check_ui_check(id) {
    h = ''
    data = {
        'action': 'get_ui_check_status',
        'id': id,

    },
    status = AsyncData("/clientmanage_v2/productreviewshow/", data);

        if (status == '0' ) {
            $.ligerDialog.warn("产品验收通过前请保证UI验收通过！");
            return false
        }

    return true
}
function check_is_dev(id) {
    h = ''
    data = {
        'action': 'get_is_dev',
        'id': id,

    },
    status = AsyncData("/clientmanage_v2/pmsedit_v2/", data);

        if (status == '0' ) {
            return true
        }

    return false
}
function product_pass(id) {

    title = '产品验收通过';
    url = "/clientmanage_v2/productreviewedit/?id=" + id + "&type=storage&cato=pass";
    if (!check_ui_check(id)) {
        return
    }
    //opendialog('产品验收不通过',"/clientmanage_v2/productreviewedit/?id=" + id + "&type=storage&cato=fail&patch="+patch);
    //if (!check_is_dev(id)){
    //    opendialog(title, url, true, false, true, id.toString(),250,450)
    //    
    //}
    //else{
        h = '确定验收通过吗?'
        data={
                'action': 'storage',
                'id': id,
                'cato':'pass',
            },
        post(h,data,"/clientmanage_v2/productreviewshow/");
        
    //}

}
function ui_check(id) {
    h = '确定UI验收通过吗?'
    data={
                'action': 'ui_check',
                'id': id,
                'cato':'pass',
            },
    post(h,data,"/clientmanage_v2/productreviewshow/");
}
function follow(id) {
    h = '确定关注这条任务吗?'
    data={
                'action': 'follow',
                'id': id,
            },
            post(h,data,"/clientmanage_v2/pmsedit_v2/")
}
function cancel_follow(id) {
    h = '确定取消关注这条任务吗?'
    data={
                'action': 'cancel_follow',
                'id': id,
            },
            post(h,data,"/clientmanage_v2/pmsedit_v2/")
}
function pms_cancel_follow(id) {
    h = '确定取消关注这条需求吗?';
    post(h,{},"/clientmanage_v2/pms/set?type=cancel_follow&id="+id)
}
function Close(id) {
    close_pms(id);
}
function product_fail(id) {
    var patch = arguments[1] ? arguments[1] : '';
    title = '产品验收不通过';
    url = "/clientmanage_v2/productreviewedit/?id=" + id + "&type=storage&cato=fail&patch="+patch;
    
    //opendialog('产品验收不通过',"/clientmanage_v2/productreviewedit/?id=" + id + "&type=storage&cato=fail&patch="+patch);
    opendialog(title,url,true,false,true,id.toString())
    
}

function product_require_add() {


    title = '新增需求';
    url = '/clientmanage_v2/pmsedit_v2/?type=add&is_dev=0';
    
    //opendialog('产品验收不通过',"/clientmanage_v2/productreviewedit/?id=" + id + "&type=storage&cato=fail&patch="+patch);
    //window.pms = opendialog(title,url,true,true,true,'add',600,800)
    window.open(url, '_blank');
}
function tech_require_add() {


    title = '新增需求';
    url = '/clientmanage_v2/pmsedit_v2/?type=add&is_dev=1';
    
    //opendialog('产品验收不通过',"/clientmanage_v2/productreviewedit/?id=" + id + "&type=storage&cato=fail&patch="+patch);
    //window.tech = opendialog(title,url,true,true,true,'add',600,800)
    window.open(url, '_blank');
}


function newtab(url) {
    window.open(url, '_blank');
}
                

function pms_change_dev(id) {

    data={
            'action': 'search_version',
            'id': id,
        },
    $.ajax({
            url: '/clientmanage_v2/productreviewshow/',
            type: 'post',
            data: data,
            dataType: 'json',
            success: function(data) {
            if (data.status == 1) {
                h = '确定需求变更吗?';
                 
                data={
                            'action': 'pms_change_dev',
                            'id': id,
                        },
                        
                post(h,data,"/clientmanage_v2/developedit/");
                } 
            else {
                    $.ligerDialog.error(data.error);
                    try{
                        parent.window.g.refresh();
                    }
                    catch(err){
                        window.g.refresh();
                    }
                }
            },
            error: function(data, status, e) {
                alert('服务器异常!');
            }
        });
            
            
}
function interface_uncomplete(id) {

    h = '确定接口开发未完成吗?';
    data={
                'action': 'interface_uncomplete',
                'id': id,
            },
            post(h,data,"/clientmanage_v2/developedit/");            
}
function interface_complete(id) {

    h = '确定接口开发完成吗?';
    data = {
        'action': 'storage',
    };
    post(h,data,"/clientmanage_v2/interfaceshow/21/"+id);            
}
function get_total_work(id) {
    h = ''
    data = {
        'action': 'get_total_work',
    },
    total_work = AsyncData("/clientmanage_v2/waittestshow/"+id, data);

    return total_work
}
function test_receive(id) {

    total_work = get_total_work(id);
    h = ''
    if (total_work>=2){h+="您当前的并行测试任务有"+total_work+"个,请评估确定是否领取此任务?"}
    else{h += '确定领取吗?';}
    data = {
        'action': 'storage',
    };
    post(h,data,"/clientmanage_v2/waittestshow/"+id);            
}
function interface_pass(id) {

    h = '确定接口测试通过吗?';
    data={
        'action': 'storage',
    }, 
    post(h,data,"/clientmanage_v2/interfaceshow/22/"+id);            
}
function interface_unpass(id) {

    h = '确定接口测试未通过吗?';
    data={
                'action': 'interface_unpass',
                'id': id,
            },
            post(h,data,"/clientmanage_v2/waitmentionedit/");        
}
function interface_online(id) {

    h = '确定接口已上线吗?';
    data={
                'action': 'storage',
            }, 
    post(h,data,"/clientmanage_v2/interfaceshow/23/"+id);            
}
var status_map = { 10: '测试中', 101: '回归BUG' };
function test_pass(id) {
    title = '通过';
    url = "/clientmanage_v2/testedit/?id=" + id + "&type=check&cato=pass";
    opendialog(title,url,true,true,true,id.toString())
}
function test_fail(id,status) {

    title = '打回';
    url = "/clientmanage_v2/testedit/"+status+"?id=" + id + "&type=check&cato=fail";
    opendialog(title,url,true,true,true,id.toString())
}
function interface_unonline(id,status) {

    h = '确定接口未上线吗?';
        data={
                'action': 'unonline',
                'id': id,
            }, 
    post(h,data,"/clientmanage_v2/testedit/"+status); 
}
function test_smoke_fail(id,status) {

    title = '阻塞打回';
    url = "/clientmanage_v2/testedit/"+status+"?id=" + id + "&type=check&cato=smoke_fail";
    opendialog(title,url,true,true,true,id.toString())
}
function test_product_fail(id,status) {

    title = '打回产品';
    url = "/clientmanage_v2/testedit/"+status+"?id=" + id + "&type=check&cato=test_product_fail";
    opendialog(title,url,true,true,true,id.toString())
}
function design_fail(id) {

    opendialog('打回',"/clientmanage_v2/designedit/?id=" + id + "&type=check")
}
function designreview_fail(id) {

    opendialog('打回',"/clientmanage_v2/designreviewedit/?id=" + id + "&type=check")
}
function codereview_fail(id) {

    opendialog('打回',"/clientmanage_v2/codereviewedit/?id=" + id + "&type=check")
}
function show_record(id) {
    title = '需求详情';
    url = "/clientmanage_v2/pmsedit_v2/?type=show_record&id="+id;
    //window.pms = opendialog(title,url,true,true,true,'show_record',570,800)
    window.open(url, '_blank');

    //opendialog('需求详情',"/clientmanage_v2/pmsedit_v2/?type=show_record&id="+id,570,800)
  }
  function show_tech_record(id) {
    title = '需求详情';
    url = "/clientmanage_v2/dev_pmsedit/?type=show_record&id="+id;
    //opendialog(title,url,true,true,true,'show_record',570,800)
    window.open(url, '_blank');

    //opendialog('需求详情',"/clientmanage_v2/pmsedit_v2/?type=show_record&id="+id,570,800)
  }
function is_add_big_develop(rowindex) {
	if (!confirm('确定要合并吗?')) {
            return false;
        }
    $.ajax({
        url: "/clientmanage_v2/integratedphaseedit/",
        type: 'POST',
        dataType: 'json',
        data : {'action':'add_big_develop','data':JSON.stringify(rowindex)},
        success: function(data) {

            if(data.status == 1){
              
               loadgridRefresh(g.options.page,g.options.pageSize,g.options.sortName,g.options.sortOrder);
        }
        else{
        alert(data.error);
        }
      },
        error: function(data, status, e) {
            alert('服务器异常!');
        }
    });
}
  function show_other_record(id) {
    opendialog('需求详情',"/servermanage/otherinterfacedevedit/?type=show_record&id="+id,false,false,false,'',570,800)
  }
    function show_html_record(id) {
    opendialog('需求详情',"/servermanage/htmldevedit/?type=show_record&id="+id,false,false,false,'',570,800)
  }
      function show_html_dev_record(id) {
    opendialog('需求详情',"/servermanage/plandevhtmledit/?type=show_record&id="+id,false,false,false,'',570,800)
  }
  function Show_require_record(id) {
      
    title = '需求详情';
    url = "/buried_point/buried_pointedit/?type=show_record&id="+id;
    window.open(url, '_blank');
    //opendialog('需求详情',"/buried_point/buried_pointedit/?type=show_record&id="+id,570,800)
  }
function transfer_reviewer(id,flag) {

    var flag = arguments[1] ? arguments[1] : '';
    //opendialog('转移处理人',"/clientmanage_v2/pmsedit_v2/?action=transfer_reviewer&id="+id+"&flag="+flag,400,400)
    title = '转移处理人';
    url = "/clientmanage_v2/pmsedit_v2/?action=transfer_reviewer&id="+id+"&flag="+flag;
    opendialog(title,url,true,true,true,id.toString(),400,400)
  }
function design_sumbit(id) {

    data={
                'action': 'storage',
                'id': id,
            },
    post('确定提交方案设计吗？',data,"/clientmanage_v2/design_back_edit/") 
    }
function code_review_sumbit(id) {

    data={
                'action': 'storage',
                'id': id,
            },
    post('确定提交代码审核吗？',data,"/clientmanage_v2/codereview_back/") 
    }
function productreview(id) {

    data={
                'action': 'check',
                'id': id,
            },
    post('确定产品验收吗？?',data,"/clientmanage_v2/developedit/") 
    }
function realease(id) {

    if (!check_status(id,'大集成任务')){return}
    url = "/clientmanage_v2/waitintegratedphaseedit/";
    data = {
        'action': 'is_storage',
        'id': id,
            };
    url2 = "/clientmanage_v2/waitintegratedphaseedit/"
    data2={
            'action': 'storage',
            'id': id,
        };
        $.ajax({
            url: url,
            type: 'post',
            data: data,
            dataType: 'json',
            success: function(data) {

                if (data.status == 1) {
                
                $.ajax({
                    url: url2,
                    type: 'post',
                    data: data2,
                    dataType: 'json',
                    success: function(data) {

                        if (data.status == 1) {
                        
                            try{
                                parent.window.g.refresh();
                            }
                            catch(err){
                                window.g.refresh();
                            }
                        } 
                        else{ 
                            
                            $.ligerDialog.error(data.error);
                            try{
                                parent.window.g.refresh();
                            }
                            catch(err){
                                window.g.refresh();
                            }
                        }

            },
            error: function(data, status, e) {
                alert('服务器异常!');
            }
        });
                } 
                else if (data.status == 2){
                    
                    $.ligerDialog.warn(data.error);
                }
                else if (data.status == 3){
                $.ligerDialog.confirm(data.error, '提示', 
                function(yes)
                    { 
                        if(yes == true){
                            $.ajax({
                            url: url2,
                            type: 'post',
                            data: data2,
                            dataType: 'json',
                            success: function(data) {

                                if (data.status == 1) {
                                    try{
                                        parent.window.g.refresh();
                                    }
                                    catch(err){
                                        window.g.refresh();
                                    }
                                } else {
                                    $.ligerDialog.error(data.error);
                                    try{
                                        parent.window.g.refresh();
                                    }
                                    catch(err){
                                        window.g.refresh();
                                    }
                                }
            },
            error: function(data, status, e) {
                alert('服务器异常!');
            }
        }); 
                        }
                    });
                }
            },
            error: function(data, status, e) {
                alert('服务器异常!');
            }
        });        
 
    }
function batch_edit_test_status(id){
    title = '修改测试状态';
    url = "/clientmanage_v2/integratedphaseedit/?type=batch_edit_test_status&id="+id;
    opendialog(title,url,true,true,true,'batch_edit_test_status')
    //opendialog('修改测试状态',"/clientmanage_v2/integratedphaseedit/?type=batch_edit_test_status&id="+id)
	
	
	}
function developcpmlpete_back(id) {
    if (!check_status(id,'研发完成')){return}
    title = '研发完成打回';
    url = "/clientmanage_v2/developcompleteedit/?id=" + id + "&type=check";
    opendialog(title,url,true,true,true,id.toString())
    //opendialog('研发完成打回',"/clientmanage_v2/developcompleteedit/?id=" + id + "&type=check")
}
function read_developcpmlpete_message(id) {
    title = '研发完成结果';
    url = "/clientmanage_v2/pmsedit_v2/?id=" + id + "&action=developcpmlpete_result";
    opendialog(title,url,true,false,false)
    //opendialog('研发完成结果',"/clientmanage_v2/pmsedit_v2/?id=" + id + "&action=developcpmlpete_result") 
    }
function read_wait_sprint_message(id) {
    title = '打回原因';
    url = "/clientmanage_v2/pmsedit_v2/?id=" + id + "&action=sprint_result";
    opendialog(title, url, true, false, false)
    //opendialog('产品审核详情',"/clientmanage_v2/pmsedit_v2/?id=" + id + "&action=product_result")
}
function inter_mention(id) {
    title = '大集成提测';
    url = "/clientmanage_v2/integratedphaseedit/?id=" + id + "&" + "type=mention";
    opendialog(title,url,true,true,true,'mention',570,1100)
        //opendialog('大集成提测',"/clientmanage_v2/integratedphaseedit/?id=" + id + "&" + "type=mention",900,1100)    
 
    }
function designreview(id) {


    data={
                'action': 'storage',
                'id': id,
            },
	post('确定通过审核吗?',data,"/clientmanage_v2/designreviewshow/")
		 
    }
function merge_to_gray(id) {

$.ligerDialog.open({
    url: '/static/mergr_gray.htm', 
    height: 400,
    width: 600, 
    buttons: [ { text: '确定', onclick: function (item, dialog) {
    gray_branch = dialog.frame.$("input[name=gray_branch]").val();
    fun_point = dialog.frame.$("textarea[name=fun_point]").val();
    select_value = dialog.frame.getValue();
    $.ajax({
        url: "/clientmanage_v2/pmsedit_v2/",
        type: 'post',
        data: {
            'action': 'merge_to_gray',
            'gray_branch':gray_branch,
            'fun_point':fun_point,
            'select_value':select_value,
            'id':id,
        },
        dataType: 'json',
        success: function(data) {
            dialog.close();
            if (data.status == 1) {
                try{
                    parent.window.g.refresh();
                }
                catch(err){
                    window.g.refresh();
                }
            } 
            
            else {
                $.ligerDialog.error(data.error);
                try{
                    parent.window.g.refresh();
                }
                catch(err){
                    window.g.refresh();
                }
            }
        },
        error: function(data, status, e) {
            dialog.close();
            alert('服务器异常!');
        }
    });
    } }, { text: '取消', onclick: function (item, dialog) {
    dialog.close(); } 
    } ] 
                    });

    }
function Show_intergrate_record(id) {
    title = '大集成详情页';
    url = "/clientmanage_v2/integratedphaseedit/?type=show_intergrate_record&id="+id;
    opendialog(title,url,true,true,true,id.toString(),600,800)
    //opendialog('大集成详情页',"/clientmanage_v2/integratedphaseedit/?type=show_intergrate_record&id="+id,800,800)

}
function gray_independent(id) {
    if (!check_status(id,'灰度中')){return}
    if (!is_pause(id)) {
        return
    }
    data={
                'action': 'check',
                'id': id,
            },
	post('确定独立灰度通过吗?',data,"/clientmanage_v2/grayshow/")
    //opendialog('灰度打回',"/clientmanage_v2/grayedit/?id=" + id + "&type=check")
}

function is_add_big_develop(rowindex) {
	if (!confirm('确定要合并吗?')) {
            return false;
        }
    $.ajax({
        url: "/clientmanage_v2/integratedphaseedit/",
        type: 'POST',
        dataType: 'json',
        data : {'action':'add_big_develop','data':JSON.stringify(rowindex)},
        success: function(data) {

            if(data.status == 1){
              
               window.g.refresh();
        }
        else{
            alert(data.error);
        }
      },
        error: function(data, status, e) {
            alert('服务器异常!');
        }
    });
}
function gray_fail(id) {
    if (!check_status(id,'灰度中')){return}
    title = '灰度打回';
    url = "/clientmanage_v2/grayedit/?id=" + id + "&type=check";
    opendialog(title,url,true,true,true,id.toString())
    //opendialog('灰度打回',"/clientmanage_v2/grayedit/?id=" + id + "&type=check")
}
function inter_fail(id) {
    if (!check_status(id,'大集成')){return}
    title = '大集成打回';
    url = "/clientmanage_v2/integratedphaseedit/?id=" + id + "&type=check";
    opendialog(title,url,true,true,true,id.toString())
    //opendialog('大集成打回',"/clientmanage_v2/integratedphaseedit/?id=" + id + "&type=check")
}
function read_test_message(id) {
    title = '测试结果';
    url = "/clientmanage_v2/pmsedit_v2/?id=" + id + "&action=test_result";
    opendialog(title,url,true,false,false)
    //opendialog('测试结果',"/clientmanage_v2/pmsedit_v2/?id=" + id + "&action=test_result") 
    }
function read_design_message(id) {
    title = '设计方案';
    url = "/clientmanage_v2/pmsedit_v2/?action=transfer_reviewer&id="+id+"&flag="+flag;
    opendialog(title,url,true,true,true,id.toString(),400,400)
   // opendialog('设计方案',"/clientmanage_v2/pmsedit_v2/?id=" + id + "&action=design_result") 
    }
function read_design_review_message(id) {
    title = '设计方案审核';
    url = "/clientmanage_v2/pmsedit_v2/?action=transfer_reviewer&id="+id+"&flag="+flag;
    opendialog(title,url,true,true,true,id.toString(),400,400)
    //opendialog('设计方案审核',"/clientmanage_v2/pmsedit_v2/?id=" + id + "&action=design_review_result") 
    }
function read_code_review_message(id) {
    title = '代码方案审核';
    url = "/clientmanage_v2/pmsedit_v2/?action=transfer_reviewer&id="+id+"&flag="+flag;
    opendialog(title,url,true,true,true,id.toString(),400,400)
    //opendialog('代码方案审核',"/clientmanage_v2/pmsedit_v2/?id=" + id + "&action=code_review_result") 
    }
function read_gray_message(id) {
    title = '灰度结果';
    url = "/clientmanage_v2/pmsedit_v2/?id=" + id + "&action=gray_result";
    opendialog(title,url,true,false,false)
    //opendialog('灰度结果',"/clientmanage_v2/pmsedit_v2/?id=" + id + "&action=gray_result") 
    }
function read_verify_message(id) {
    title = '审核结果';
    url = "/clientmanage_v2/pmsedit_v2/?id=" + id + "&action=verify_result";
    opendialog(title,url,true,false,false)
    //opendialog('审核结果',"/clientmanage_v2/pmsedit_v2/?id=" + id + "&action=verify_result") 
    }
function read_inter_message(id) {
    title = '大集成结果';
    url = "/clientmanage_v2/pmsedit_v2/?id=" + id + "&action=inter_result";
    opendialog(title,url,true,false,false)
    //opendialog('大集成结果',"/clientmanage_v2/pmsedit_v2/?id=" + id + "&action=inter_result") 
    }
function codereview(id) {

    title = '代码审核';
    url = "/clientmanage_v2/codereviewedit/?id=" + id + "&type=storage";
    opendialog(title,url,true,true,true,id.toString(),400,400)
    //opendialog('代码审核',"/clientmanage_v2/codereviewedit/?id=" + id + "&type=storage")    	 
    } 
function develop_work_load(id) {
    title = '填写贡献量';
    url = "/clientmanage_v2/pmsedit_v2/?id=" + id + "&action=develop_work_load";
    opendialog(title,url,true,true,true,id.toString(),330,400)
    //opendialog('填写贡献量',"/clientmanage_v2/pmsedit_v2/?id=" + id + "&action=develop_work_load",600,800)     
    }    
function design(id) {

    title = '设计审核';
    url = "/clientmanage_v2/designedit/?id=" + id + "&type=storage";
    opendialog(title,url,true,true,true,'storage')
    //opendialog('设计审核',"/clientmanage_v2/designedit/?id=" + id + "&type=storage")    
    }
function pms_change(id) {

    title = '提交';
    url = "/clientmanage_v2/pms_changeedit/?id=" + id + "&type=storage";
    opendialog(title,url,true,true,true,'storage')
    //opendialog('提交',"/clientmanage_v2/pms_changeedit/?id=" + id + "&type=storage")    
    }
function read_product_message(id) {
    title = '产品审核详情';
    url = "/clientmanage_v2/pmsedit_v2/?id=" + id + "&action=product_result";
    opendialog(title,url,true,false,false)
    //opendialog('产品审核详情',"/clientmanage_v2/pmsedit_v2/?id=" + id + "&action=product_result")
    }
function verify_pass(id) {
    if (!check_status(id,'大集成审核')){return}
    pass(id,'pass');
}


function verify_fail(id) {
    if (!check_status(id,'大集成审核')){return}
    pass(id,'refuse');
}


function pass(id,type) {   
    
    $.ajax({
            url: "/clientmanage_v2/integratedverifyedit/",
            type: 'post',
            data: {
                'action': 'is_pass',
                'id': id
            },
            dataType: 'json',
            success: function(data) {
                if (data.status == 1) {
                    title = '审核详情';
                    url = "/clientmanage_v2/integratedverifyedit/?id=" + id + "&type="+type+ "&query="+data.query;
                    opendialog(title,url,true,true,true,id.toString(),500,800)
                    }
                else{
                    $.ligerDialog.error(data.error);
                }
                },
            error: function(data, status, e) {
                alert('服务器异常!');
            }
        });
    
    
        
    }
function onselect(rowdata, rowid, rowobj){
//        if(rowdata.is_pause == 1 || rowdata.pmsphase__is_pause == 1) 
//    {f_search();return false}
    //arrayCheckObj.push(rowdata.pmsphase__id);
    arrayCheckObj.push(rowdata.id);
    arrayCheckObj = unique(arrayCheckObj);

    
    index = rowdata.__index;
    g._buildPager(arrayCheckObj.length);
    //f_search();
    
}
function onunselect(rowdata, rowid, rowobj){
    arrayCheckObj = unique(arrayCheckObj);
    for (i=0;i<arrayCheckObj.length;i++) {
          if ( rowdata.id == arrayCheckObj[i] ) 
          {
            arrayCheckObj.splice(i, 1);
            
            }
    }
    g._buildPager(arrayCheckObj.length);
}
function f_isChecked(rowdata) {
    arrayCheckObj = unique(arrayCheckObj);
    for (i=0;i<arrayCheckObj.length;i++) {
        if ( rowdata.id == arrayCheckObj[i] ) return true;
    }
    return false;
}
        
function show_buglist(id){
    title = 'Bug详情';
    url = "/clientmanage_v2/pmsedit_v2/?id=" + id + "&action=show_buglist";
    opendialog(title,url,true,false,false,'',500,820)
    //opendialog('Bug详情',"/clientmanage_v2/pmsedit_v2/?id=" + id + "&action=show_buglist",500,820)    
}        
        
function show_active_buglist(id){
    title = '激活Bug详情';
    url = "/clientmanage_v2/pmsedit_v2/?id=" + id + "&action=show_active_buglist";
    opendialog(title,url,true,false,false,'',500,820)
    //opendialog('激活Bug详情',"/clientmanage_v2/pmsedit_v2/?id=" + id + "&action=show_active_buglist",500,820)    
}
function show_prioritybug(id){
    title = '中高优先级Bug详情';
    url = "/clientmanage_v2/pmsedit_v2/?id=" + id + "&action=show_prioritybug";
    opendialog(title,url,true,false,false,'',500,820)
}
function show_serve_buglist(id){
    title = 'Bug详情';
    url = "/servermanage/interfacedevedit/?id=" + id + "&type=show_buglist";
    opendialog(title,url,true,false,false,'',500,820)
    //opendialog('Bug详情',"/clientmanage_v2/pmsedit_v2/?id=" + id + "&action=show_buglist",500,820)    
}        
function show_serve_active_buglist(id){
    title = '激活Bug详情';
    url = "/servermanage/interfacedevedit/?id=" + id + "&type=show_active_buglist";
    opendialog(title,url,true,false,false,'',500,820)
    //opendialog('激活Bug详情',"/clientmanage_v2/pmsedit_v2/?id=" + id + "&action=show_active_buglist",500,820)    
}
function revocation(record, rowindex, value, column){
    
    var h = "";
    h += "<a href='javascript:retreat(" + record.id + ")'>撤销</a> ";
    return h;
}
function publish(id,reason) {

    $.ajax({
            url: "/clientmanage_v2/pmsedit_v2/",
            type: 'post',
            data: {
                'action': 'publish_auth',
                'id': id
            },
            dataType: 'json',
            success: function(data) {

            if (data.status == 1) {
            title = '发布需求';
            url = "/clientmanage_v2/pmsedit_v2/?id=" + id + "&action=publish&reason="+reason;
            opendialog(title,url,true,true,true,id.toString(),300,800)

                  
                } else {
                    $.ligerDialog.error(data.error);
                    try{
                        parent.window.g.refresh();
                    }
                    catch(err){
                        window.g.refresh();
                    }
                }
            },
            error: function(data, status, e) {
                alert('服务器异常!');
            }
        });
    } 
function pause(id,bool){
    if (bool) {
        data={
            'action': 'start',
            'id': id,
        };
        Confirm('确定要取消阻塞吗?', function() {
            $ajax({
                url:    '/clientmanage_v2/sprintedit/',
                type:   'POST',
                data:   data,
            })
        })
	    //post('确定要取消阻塞吗?',data,"/clientmanage_v2/sprintedit/")
    } else {
        title = '阻塞需求';
        url = "/clientmanage_v2/sprintedit/?id=" + id + "&" + "type=pause";
        opendialog(title,url,true,true,true,id.toString(),450,800)
    }
}
function start(id){
    
        data={
                'action': 'start',
                'id': id,
            },
    post('确定要取消阻塞吗?',data,"/clientmanage_v2/sprintedit/")
}
function close_pms(id,action,index) {
        var action = arguments[1] ? arguments[1] : 'close_auth';
        var index = arguments[2] ? arguments[2] : 0;
        $.ajax({
            url: "/clientmanage_v2/pmsedit_v2/",
            type: 'post',
            data: {
                'action': action,
                'id': id
            },
            dataType: 'json',
            success: function(data) {
            if (data.status == 1) {
            title = '关闭任务';
            url = "/clientmanage_v2/pmsedit_v2/?id=" + id + "&action="+action.slice(0, -5)+"&index="+index;
            opendialog(title,url,true,true,true,id.toString(),300,780)

                  
                } else {
                    $.ligerDialog.error(data.error);
                    loadgridRefresh(g.options.page,g.options.pageSize,g.options.sortName,g.options.sortOrder);
                }
            },
            error: function(data, status, e) {
                alert('服务器异常!');
            }
        });
    } 
/**
* @method: delete_in_object_array
* @desc: 从[object, ...]中删除
* @params: 
* 
*/
function delete_in_object_array(data, pair) {
    var indexes = [];
    for(var i = 0; i < data.length; i++) {
        var matched = true;
        for (var key in pair) {
            if (data[i][key] != pair[key]) {
                matched = false;
                break;
            }
        }
        if (matched) {
            data.splice(i, 1);
            indexes.push(i);
        }
    }
    return indexes;
}


/**
* @method: capsFirstChar
* @desc: 字符串的首字母大写
* @params: 
* 
*/
function capsFirstChar(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


/**
* @method: asyncGetData
* @desc:    异步获取数据
* @params: 
*   expr:   需要获取数据的对象或者函数
*   url:    获取数据的地址
*/
function asyncGetData(expr, url, param, type, cb) {
    var param = param || {},
        type = type || 'GET';
    var data;
    $.ajax({
        url:    url,
        data:   param,
        type :  type,
        dataType : 'json',
        success : function(resp) {
            if (resp.status) {
                data = resp.data;
                if (typeof expr == 'function') expr(data)
                else    expr = data
            }
            else {
                data = resp;
                if (typeof expr == 'function') expr(data)
                else    expr = data
            }
            cb && cb()
        },
        error:  function() {
            console.log('async fetch '+url+ ' 失败')
        }
    })
    return data
}

function getAsyncData(url,action,ligerid,value){
    //url:"/clientmanage_v2/pmsedit_v2/"
    $.ajax({
        url : url,
        type : 'post',
        
        data : {'action':action,'data':value,},

        dataType : 'json',
        success : function(data){
        var combo = liger.get(ligerid);
        combo.set('data', data);
        },
        error : function(data, status, e){
            alert('服务器异常!');
        }
        });
    }
function ifReallyDo(message, option) {
    var dialog = $.ligerDialog.confirm(message, '提示', function(yes) { 
        if(yes == true) {
            $.ajax({
                url:    option.url,
                type:   option.type || 'post',
                data:   option.data,
                dataType: 'json',
                success: function(data) {
                    if (data.status) {
                        option.succ_cb && option.succ_cb(data);
                        dialog.close();
                    } else {
                        $.ligerDialog.error(data.error);
                    }
                },
                error: function(data, status, e) {
                    dialog.close();
                    if (option.fail_cb) 
                        option.fail_cb(data)
                    else 
                        $.ligerDialog.error('网络或服务器异常');
                }
            }); 
        }
    });
}
function toggleVersion(rowdata, rowindex, value, column) {
    var id = rowdata.plan_dev_id || rowdata.id;
    var url = "/servermanage/plandevinterfaceedit/next_version/"+id;
    var action = "nextversion";
        if (rowdata.nextversion == 1) {
    
        var message = "确定不再标记为核心需求吗?";
        } 
        else if (rowdata.nextversion ==0) {
            var message = "是否将此需求标记为核心需求?";
        }
        ifReallyDo(message, {
            'url': url,
            'data': {
                
                'action':   action
            },
            'succ_cb':  function() {
                window.If_All ? showall() : f_search(); 
            }
        });       
    return false; // 防止多次事件触发
}


/**
* @method: bfFindLeafs
* @desc: 深度优先查找所有叶子节点
* @params: 
*   要求叶子节点在children属性上
*/
function bfFindLeafs(root) {
    if (Array.isArray(root)) {
        var queue = [].concat(root)
    } else {
        var queue = [root];
    }

    var results = [];
    while (queue.length > 0) {
        var item = queue.shift();
        if (item.children && item.children.length > 0) {
            queue = queue.concat(item.children)
        } else {
            results.push(item)
        }
    }
    return results;
}


function getArrayMiddle(a) {
    var middle = a.length / 2;
    var x = Array.prototype.slice.call(a, middle, middle+1);
    return x[0]

}

function getArrayEnd(a) {
    return a[a.length-1];
}


function makeqrcode (result_id,install_pack,platform,resource) {
    dialog = $.ligerDialog.open({
        height: 390,
        width: 330,
        title: '二维码',
        url: '/continuous_integration/report_show'+"?install_pack="+install_pack+"&platform="+platform+"&id="+result_id+"&resource="+resource,
        showMax: false,
        showToggle: true,
        showMin: false,
        isResize: true,
        slide: false,

    });
}

function $ajax(option) {
    var succCb = option.success;
    var option = $.extend(
        option, {
            success:    function(resp) {

                try {
                    resp = JSON.parse(resp)
                } catch(e) {
                }
                if (resp.status == 0) {
                    if ($.ligerDialog) 
                        $.ligerDialog.error(resp.error)
                    else 
                        window.Alert(0, resp.error)
                }
                else if (resp.status == 1) {
                    succCb && succCb(resp.data)
                }

                else if (typeof resp == 'string' && resp.indexOf('<title>登录</title>')>=0) 
                    window.Alert(0, '请刷新页面')
                else    
                    succCb && succCb(resp)
            },
            error:  function() {
                window.Alert(0, '服务器或网络问题');
                //$.ligerDialog.error('服务器或网络问题')
            }
        }
    );
    return $.ajax(option);
}


/**
* @method: getLatestPeriods
* @desc:    获取最近若干个统计周期(如，月，季度)
* @params: 
*       bench:  ''      基准
*       kind:   'month' | 'quarter' 
*       n:      数量
* @ps:  依赖moment.js
*/
function getLatestPeriods(bench, kind, n) {
    var results = [],
        start = '';

    if (bench) {
        var end = moment(bench)
    } else {
        var end = moment()
    }

    if (kind == 'month') {
        while (n-- > 0) {
            end_str = end.format('YYYY-MM-DD');
            start = end.startOf('month');
            start_str = start.format('YYYY-MM-DD');
            results.push([start_str, end_str]);
            end = start.subtract(1, 'days');
        }
    } else if (kind == 'quarter') {
        while (n-- > 0) {
            end_str = end.format('YYYY-MM-DD');
            start = end.startOf('quarter');
            start_str = start.format('YYYY-MM-DD');
            results.push([start_str, end_str]);
            end = start.subtract(1, 'days');
        }
    }
    return results.sort()
}


/**
* @method: judgePeriod
* @desc:    判断周期
* @params: 
*       start:  起始时间
*       end:    结束时间
* @ps:  依赖moment.js
*       end > start
*/
function judgePeriod(start, end, period) {
    var start_moment = moment(start),
        end_moment = moment(end).add(1, 'days');
    
    if (period == 'M') {
        return start_moment.format('YYYY-MM');
    } else if (period == 'Q') {
        return start_moment.format('YYYY-Q');
    }

    var diff = end_moment.diff(start_moment, 'month');
    switch(diff) {
        case 0:         // 月
        case 1:         
            return start_moment.format('YYYY-MM');
        case 2:         // 季度
        case 3:         
            return start_moment.format('YYYY-Q');
    }
}


/**
* @method: dateFloor
* @desc:    日期取向下取证
* @params: 
*       date_,  日期, moment类型
*       unit，  按日、时、分取
* @ps:  依赖moment.js
*/
function dateFloor(d, unit) {
    if (unit == 'date') {
        d = d.startOf('day')
    } else if (unit == 'hour') {
        d = d.startOf('hour')
    } else {
        d = d.startOf('minute')
    }
    return d
}


/**
* @method: dateRound
* @desc: 
* @params: 
* @ps:  依赖moment.js
* 
*/
function dateRound(d, unit) {
    if (unit == 'date') {
        d = d.endOf('day')
    } else if (unit == 'hour') {
        d = d.endOf('hour')
    } 
    return d
}

function getAsyncData(url,action,ligerid,value){
    //url:"/clientmanage_v2/pmsedit_v2/"
    $.ajax({
        url : url,
        type : 'post',
        
        data : {'action':action,'data':value,},

        dataType : 'json',
        success : function(data){
        var combo = liger.get(ligerid);
        combo.set('data', data);
        },
        error : function(data, status, e){
            alert('服务器异常!');
        }
        });
    }

function inherits(clazz, baseClazz) {
    var clazzPrototype = clazz.prototype;
    function F() {}
    F.prototype = baseClazz.prototype;
    clazz.prototype = new F();

    for (var prop in clazzPrototype) {
        clazz.prototype[prop] = clazzPrototype[prop];
    }
    clazz.constructor = clazz;
}

(function() {
    if ( typeof Object.id == "undefined" ) {
        var id = 0;

        Object.id = function(o) {
            if ( typeof o.__uniqueid == "undefined" ) {
                Object.defineProperty(o, "__uniqueid", {
                    value: ++id,
                    enumerable: false,
                    // This could go either way, depending on your 
                    // interpretation of what an "id" is
                    writable: false
                });
            }

            return o.__uniqueid;
        };
    }
})();

function MakeQRCode(rowindex) { // 内网二维码
    var record = g.getRow(rowindex);
    var id = record.id;
    if (record.result_id){
        id = record.result_id;
    }
    makeqrcode(id,record.install_pack,record.platform,'internal');
}

function MakeQRCode_v2(result_id,qrcode,platform) { // 内网二维码
    makeqrcode(result_id,qrcode,platform,'internal');
}

function MakeexQRCode(rowindex) { // 外网二维码
    var record = g.getRow(rowindex);
    var id = record.id;
    if (record.result_id){
        id = record.result_id;
    }
    makeqrcode(record.id,record.exteral_install_pack,record.platform,'external');
}

function makeqrcode(id,install_pack,platform,resource) {
    dialog = $.ligerDialog.open({
                            height: 390,
                            width: 330,
                            title: '二维码',
                            url: '/continuous_integration/report_show'+"?install_pack="+install_pack+"&platform="+platform+"&id="+id+"&resource="+resource,
                            showMax: false,
                            showToggle: true,
                            showMin: false,
                            isResize: true,
                            slide: true,
                        });
}

function show_ci_result(rowdata, rowindex, value) {
    var h = "";
    if (rowdata.exteral_install_pack != "") {
        if (rowdata.exteral_install_pack == 0) {
            h += "正在生成二维码..."
        }
        else {
            h += "<a href='javascript:MakeexQRCode(" + rowindex + ")'>外网二维码</a> ";
        }
    }
    function endsWith(str, suffix) {
        return str.indexOf(suffix, str.length - suffix.length) !== -1;
    }

    // 兼容老数据
    if(((rowdata.platform == "Android")&&rowdata.install_pack!="" )||((rowdata.platform == "iOS" || rowdata.platform == "iPad")&&rowdata.install_pack.indexOf("itms")!=-1)){
        h += "<a href='javascript:MakeQRCode(" + rowindex+ ")'>内网二维码</a> ";
    }

    try {
        if (rowdata.result_detail == "") {
            return h;
        }
        resultDetail = JSON.parse(rowdata.result_detail);
        for (var i = 0; i < resultDetail.length; i++) {
            if (!("report" in resultDetail[i])) {
                continue;
            }
            var style = "style='color:red'";
            if (resultDetail[i].result) {
                style = "style='color:blue'"
            }
            if (resultDetail[i].name.indexOf("日志") >= 0 ||resultDetail[i].name=="安装包比较") {
                h += "<a " + style + " href='" + resultDetail[i].report + "' target='_blank')'>" + resultDetail[i].name + "</a> ";
            }
            else if (resultDetail[i].name.indexOf("二维码") >= 0) {
                h += "<a href='javascript:MakeQRCode(" + rowindex + ")'>内网二维码</a> ";
            }
            else if (endsWith(resultDetail[i].report, ".zip") || endsWith(resultDetail[i].report, ".log") || endsWith(resultDetail[i].report, ".ipa")) {
                h += "<a " + style + " href=" + resultDetail[i].report + " >" + resultDetail[i].name + " </a>";
            } else if (resultDetail[i].taskname == 'TaskUiReplay') {
                h += "<a " + style + " href='javascript:report2(\"" + resultDetail[i].report + "\")'>" + resultDetail[i].name + "</a> ";
            } else {
                h += "<a " + style + " href='javascript:report(\"" + resultDetail[i].report + "\")'>" + resultDetail[i].name + "</a> ";
            }
        } // for
    } catch (e) {
    }
    return h;
}

function show_ci_result_qrcode(rowdata, rowindex, value, column) {
    var h = "";
    // 兼容老数据
    if(((rowdata.platform == "Android")&&rowdata.install_pack!="" )||((rowdata.platform == "iOS" || rowdata.platform == "iPad")&&rowdata.install_pack.indexOf("itms")!=-1)){
        h += "<a href='javascript:MakeQRCode(" + rowindex+ ")'>内网二维码</a> ";
    }
    try {
        if (rowdata.result_detail == "") {
            return h;
        }
        resultDetail = JSON.parse(rowdata.result_detail);
        for (var i = 0; i < resultDetail.length; i++) {
            if (resultDetail[i].name.indexOf("二维码") >= 0) {
                h += "<a href='javascript:MakeQRCode(" + rowindex + ")'>内网二维码</a> ";
                break;
            }
        }
    } catch (e) {
    }
    return h;
}
    function read_reason_desc(id) {
        title = '打回原因';
        url = "/clientmanage_v2/pmsedit_v2/?id=" + id + "&action=result_desc";
        opendialog(title, url, true, false, false)

    }
var PmsServer = {
    _check : function (check_params) {
        var result=false;
        var url = "/clientmanage_v2/server/get";
        var post_data = check_params;
        $.ajax({
            url: url,
            type: 'get',
            data: post_data,
            async: false,
            dataType: 'json',
            success: function (data) {
                if (data.status == 1) {
                    result=true;
                } else if (data.status == 2) {
                    result=false;
                } else {
                    //alert(data.error);
                    $.ligerDialog.error(data.error);
                    event.preventDefault(); 
                }
            },
            error: function (data, status, e) {
                window.location.reload();
            }
        });
        return result;
    },
    _check_current_review:function(action_name, id){
        Prompt("/clientmanage_v2/server/show", {"type": "check_current_review", "id": id}, function () {
        var data = $('#prompt_dialog').data('get-data')();
        var action_data = {"pms": {"reason": data.reason}};
        PmsServer.do_action(action_name, id, action_data, true);
    });
    },
    check_current_reviewer: function (id,status_id,cb) {
        var check_params = {"type": "check_current_reviewer", "id": id, "status_id": status_id};

        if (PmsServer._check(check_params)) {
            Prompt("/clientmanage_v2/server/show", {"type": "check_current_review", "id": id}, function () {
        var data = $('#prompt_dialog').data('get-data')();
        var action_data = {"pms": {"reason": data.reason}};
        return cb && cb(); 
        });    
        }
        else{
            return true
        }
        
    },
    check_status: function (id, status_id) {
        var check_params = {"type": "check_status", "id": id, "status_id": status_id};
        return PmsServer._check(check_params);
    },
    check_testcase: function (id) {
        var check_params = {"type": "is_finish_testcase_design", "id": id};
        return PmsServer._check(check_params);
    },
    post: function (url, data, cb) {
        var msg = "";
        $.ajax({
            url: url,
            type: 'post',
            data: data,
            async: false,
            dataType: 'json',
            success: function (data) {
                if (data.status == 1) {
                    msg = data.msg;
                    cb && cb();
                } else {
                    $.ligerDialog.error(data.error);
                }
            },
            error: function (data, status, e) {
                $.ligerDialog.error('服务器异常!');
                //Alert('服务器异常!');
            }
        });
        return msg;
    },
    upload_file: function (file_data, pms_id, source) {
        var rtn_info = null;
        var path = "pmsphase";
        if (source) path=source;
        var formData = new FormData();
        formData.append("files", file_data);
        $.ajax({
            url:  '/clientmanage_v2/file/set/' + path + "?id="+pms_id,
            type: 'POST',
            data: formData,
            async: false,
            processData: false,
            contentType: false,
            success: function (data) {
                if (data.status == 1) {
                    rtn_info = data;
                } else {
                    Alert(data.error);
                }
            },
            error: function (data, status, e) {
                Alert('服务器异常!');
            }
        });
        return rtn_info;
    },
    _do_action: function (url, action_name, id, action_data, no_confirm, cb) {
        if (!action_data) {
            action_data = {};
        }
        var data = {"action": action_name, "id": id, "data": JSON.stringify(action_data)};
        var rtn_msg = "";
        if (no_confirm) {
            rtn_msg = PmsServer.post(url, data, cb);
            if (rtn_msg){
                //alert(rtn_msg);
                //$.ligerDialog.success(rtn_msg);
            }
        } else {
            Confirm('确定要提交吗?', function () {
                rtn_msg = PmsServer.post(url, data, cb);
                if (rtn_msg) {
                    //alert(rtn_msg);
                    //$.ligerDialog.success(rtn_msg);
                }
            });
        }
    },
    ui_check :function (action_name,id) {

        data={
                    'action': action_name,
                    'id': id,
                    'cato':'pass',
        },
        Confirm('确定UI验收通过吗?', function () {
                rtn_msg = PmsServer.post("/clientmanage_v2/productreviewshow/", data);
                if (rtn_msg) {
                    //alert(rtn_msg);
                    //$.ligerDialog.success(rtn_msg);
                }
            });
    },

    handle:function(id){
        Confirm('确定开始执行吗?', function () {
            rtn_msg = PmsServer.post("/clientmanage_v2/server/handle/"+id);
        });
    },
    do_action: function (action_name, id, action_data, no_confirm, cb){
        PmsServer._do_action("/clientmanage_v2/server/action", action_name, id, action_data, no_confirm, cb)
    },
    _release:function (action_name, id){
        url = "/clientmanage_v2/waitintegratedphaseedit/";
         data = {
             'action': 'is_storage',
             'id': id,
         };

         url2 = "/clientmanage_v2/waitintegratedphaseedit/"
         data2 = {
             'action': 'storage',
             'id': id,
         };
         $.ajax({
             url: url,
             type: 'post',
             data: data,
             dataType: 'json',
             success: function (data) {
                 if (data.status == 1) {

                     $.ajax({
                         url: url2,
                         type: 'post',
                         data: data2,
                         dataType: 'json',
                         success: function (data) {

                             if (data.status == 1) {

                                 try {
                                     parent.window.g.refresh();
                                 }
                                 catch (err) {
                                     window.g.refresh();
                                 }
                             }
                             else {

                                 $.ligerDialog.error(data.error);
                                 try {
                                     parent.window.g.refresh();
                                 }
                                 catch (err) {
                                     window.g.refresh();
                                 }
                             }

                         },
                         error: function (data, status, e) {
                             alert('服务器异常!');
                         }
                     });
                 }
                 else if(data.status == 2){
                     $.ligerDialog.confirm(data.error, function (yes) {
                         if(yes){
                             $.ajax({
                         url: url2,
                         type: 'post',
                         data: data2,
                         dataType: 'json',
                         success: function (data) {

                             if (data.status == 1) {

                                 try {
                                     parent.window.g.refresh();
                                 }
                                 catch (err) {
                                     window.g.refresh();
                                 }
                             }
                             else {

                                 $.ligerDialog.error(data.error);
                                 try {
                                     parent.window.g.refresh();
                                 }
                                 catch (err) {
                                     window.g.refresh();
                                 }
                             }

                         },
                         error: function (data, status, e) {
                             alert('服务器异常!');
                         }
                     });
                         }

                     });
                 }
                 else{
                     $.ligerDialog.error(data.error);
                 }
             },
             error: function (data, status, e) {
                 alert('服务器异常!');
             }
         });
    },
     release: function (action_name, id, cb) {
        Confirm("确定合入大集成吗？", PmsServer._release.bind(this,action_name, id), cb )
     },
     static_analysis: function (action_name, id, cb) {

        PmsServer._do_action("/clientmanage_v2/server/static_analysis",action_name, id, null, null, cb);

     },
    send_review_product: function (action_name, id, cb) {
        Prompt("/clientmanage_v2/server/show", {"type": action_name, "id": id}, function () {
            var pms_data = $('#prompt_dialog').data('get-data')();
            var action_data = {"pms":pms_data};

            var remarks_file = document.getElementById("remarks_file").files[0];
            if (remarks_file) {
                var file_info = PmsServer.upload_file(remarks_file, id, "pmsphase");
                if (!file_info) return;
                action_data["pms"]["attachment_id"] = file_info["attachment_id"];
            }
            PmsServer.do_action(action_name, id, action_data, true, cb);
        });
    },
    assigned_test: function (action_name, id, cb) {
        Prompt("/clientmanage_v2/server/show", {"type": "assigned_test", "id": id}, function () {
            var data = $('#prompt_dialog').data('get-data')();
            var action_data = {"pms": {"tester": data.tester,"testtotaltime":data.testtotaltime,"remarks":data.remarks}};
            PmsServer.do_action(action_name, id, action_data, true, cb);
        });
    },
    assigned_testcase_reviewer: function (action_name, id, cb) {
        if (!PmsServer.check_testcase(id)) return;
        Prompt("/clientmanage_v2/server/show", {"type": "assigned_testcase_reviewer", "id": id}, function () {
            var data = $('#prompt_dialog').data('get-data')();
            var action_data = {"pms": {"test_case_reviewer": data.test_case_reviewer}};
            PmsServer.do_action(action_name, id, action_data, true, cb);
        });
    },
    success_remarks: function (action_name, id, cb) {
        Prompt("/clientmanage_v2/server/show", {"type": "success_remarks", "id": id}, function () {
            var action_data = {"pms": {}}
            var remarks = $('.modal-dialog').find('[name="remarks"]').val();
            if(remarks){
                action_data["pms"]["remarks"] = remarks;
            }
            var remarks_file = document.getElementById("remarks_file").files[0];
            if (remarks_file) {
                var file_info = PmsServer.upload_file(remarks_file, id, "pmsphase");
                if (!file_info) return;
                action_data["pms"]["attachment_id"] = file_info["attachment_id"];
            }
            PmsServer.do_action(action_name, id, action_data, true, cb);
        });
    },
    fill_fail_reason: function (action_name, id, cb) {
        Prompt("/clientmanage_v2/server/show", {"type": "fail_reason", "id": id}, function () {
            var fail_reason= $('.modal-dialog').find('[name="fail_reason"]').val();
            var action_data = {"reason_desc": fail_reason};
            PmsServer.do_action(action_name, id, action_data, true, cb);
        });
    },
    online_publish_deploy: function (action_name, id, cb) {
        Prompt("/clientmanage_v2/server/show", {"type": "online_publish_deploy", "id": id}, function () {
            var estimated_work_load= $('.modal-dialog').find('[name="estimated_work_load"]').val();
            var develop_work_load_description = $('.modal-dialog').find('[name="develop_work_load_description"]').val();
            var action_data = {"pms":{"estimated_work_load": estimated_work_load,
                                      "develop_work_load_description": develop_work_load_description}};
            PmsServer.do_action(action_name, id, action_data, true, cb);
        });
    },
    online_publish_review: function (action_name, id, cb) {
        Prompt("/clientmanage_v2/server/show", {"type": "online_publish_review", "id": id}, function () {
            var base_test_work_load= $('.modal-dialog').find('[name="base_test_work_load"]').val();
            var test_work_load_description = $('.modal-dialog').find('[name="test_work_load_description"]').val();
            var action_data = {"pms":{"base_test_work_load": base_test_work_load,
                                      "test_work_load_description": test_work_load_description}};
            PmsServer.do_action(action_name, id, action_data, true, cb);
        });
    },
    fail_review_product: function (action_name, id, cb) {
        Prompt("/clientmanage_v2/server/show", {"type": "fail_review_product","action":action_name,"id": id}, function (rtn_data) {
            //$.ligerDialog.success(rtn_data);
            cb && cb();
        });
    },
    fill_fail_test_reason: function (action_name, id, cb) {
        Prompt("/clientmanage_v2/server/show", {"type": "fill_fail_test_reason","action":action_name,"id": id}, function (rtn_data) {
            //$.ligerDialog.success(rtn_data);
            cb && cb();
        });
    },
    confirm_by_current_reviewer(actions, id, wait_confirm_user, wait_confirm_role, cb){
        Prompt("/clientmanage_v2/server/show", {"type": "confirm_by_current_reviewer","action":actions,"id": id, "wait_confirm_user":wait_confirm_user,"wait_confirm_role":wait_confirm_role},
            function (rtn_data) {
            if (rtn_data) {
                //$.ligerDialog.success(rtn_data);
            }
            cb && cb();
        });
    },
    client_send_product_review : function (action_name, id, cb) {
        Prompt("/clientmanage_v2/server/show", {"type": "client_send_product_review", "id": id, "action": action_name, "title":"提测"}, function (rtn_data) {
            if (rtn_data) {
                //$.ligerDialog.success(rtn_data);
            }
            cb && cb();
        });
    },
    finish_prepublish_deploy: function (action_name, id, cb) {
        Prompt("/clientmanage_v2/server/show", {"type": "finish_prepublish_deploy", "id": id}, function () {
            var test_prepublish_environment= $('.modal-dialog').find('[name="test_prepublish_environment"]').val();
            var action_data = {"pms":{"test_prepublish_environment": test_prepublish_environment}};
            PmsServer.do_action(action_name, id, action_data, true, cb);
        });
    },
    codereview : function (action_name, id, cb) {
        Prompt("/clientmanage_v2/server/show", {"type": "codereview", "id": id, "action": action_name}, function (rtn_data) {
            if (rtn_data) {
                //$.ligerDialog.success(rtn_data);
            }
            cb && cb();
        });
    },
    test_test_success: function (action_name, id, cb) {
        Prompt("/clientmanage_v2/server/show", {"type": "test_test_success", "id": id, "action": action_name},function (rtn_data) {
            if (rtn_data) {
               // $.ligerDialog.success(rtn_data);
            }
            cb && cb();
        });
    },
    merge_to_gray:function (action_name, id, cb) { // 打回
        Prompt("/clientmanage_v2/server/show", {"type": action_name, "id": id, "action": action_name, "title":"MergeRequest"}, function (rtn_data) {
                if (rtn_data) {
                    //$.ligerDialog.success(rtn_data);
                }
                cb && cb();
            }
        );
    },
    publish:function (action_name, id, cb) { // 打回
        Prompt("/clientmanage_v2/server/show", {"type": action_name, "id": id}, function () {
            cb && cb();
        });
    },
    open_url:function (url, id, cb) {
         window.open(url);
    },

    open_qrcode:function (url, id, pms_name) {
         Prompt(url, {"title": pms_name,"no_validate":true});
    },
    do_action_v2: function (args) {
        var cb = args.cb;
        if (cb)cb =eval(args.cb);
        if(!args.do_action) args.do_action = "do_action";
        if(args.do_action == "do_action"){
            PmsServer.do_action(args.action, args.id, args.action_data, args.no_confirm, cb)
        } else if (args.do_action == "prompt") {
            var url = args.url;
            if(!args.url) url="/clientmanage_v2/server/show";
            Prompt(url, args.option, function (rtn_data) {
                if (rtn_data) {
                    //$.ligerDialog.success(rtn_data);
                }
                cb && cb();
            });
        } else if (args.do_action == "protocol_review"){
            Pms.protocol_review(args.id, args.with_id,  cb);
        } else if (args.do_action =="confirm_by_current_reviewer") {
            PmsServer.confirm_by_current_reviewer(args.action, args.id, args.user, args.role, cb);
        } else if (args.do_action == "compatible_confirm"){
            window.compatibleConfir(args.id, args.platform_id, args.user, cb);
        } else if (args.do_action == "close_pms"){
            close_pms(args.id);
        } else if (args.do_action == "open_url"){
            var url = args.url;
            if (!url){ url=args.action};
            window.open(url);
        } else if (args.do_action == "open_qrcode"){
            var url = args.action;
            var url = url.replace(/\\"/g, "");
            var pms_name = args.pms_name?args.pms_name:args.params;
            Prompt(url, {"title": pms_name,"no_validate":true});
        } else {
            var fun_action = eval("PmsServer." + args.do_action);
            fun_action(args.action, args.id, cb);
        }
    },
};


var Inte = {
    do_action_v2: function (args) {
        var cb = args.cb;
        if (cb)cb =eval(args.cb);
        if(args.do_action == "do_action"){
            Inte.do_action(args.action, args.id, args.action_data, args.no_confirm, cb)
        } else {
            var fun_action = eval("Inte." + args.action_name);
            fun_action(args.action, args.id, cb);
        }
    },
    do_action: function (action_name, id, action_data, no_confirm, cb) {
        PmsServer._do_action("/clientmanage_v2/inte/action", action_name, id, action_data, no_confirm, cb);
        //Pms.old_do_action(action_name, id, action_data);
    },
}

var TestIntegrate = {
    passTestinteroption: function(testintegratedetail_id, reviewer, cb) {
        Confirm('是否确认测试通过?', function() {
            $ajax({
                url:    '/clientmanage_v2/test/integrate/set/pass_checkoption',
                type:   'POST',
                data:   {
                    id:    testintegratedetail_id,
                    reviewer: reviewer
                },
                success : function () {
                    cb && cb();
                }
            })
        })
    }
}

var PmsTask = {
    finishPmsTask: function (id, cb) {
        Confirm('是否确认任务已完成?', function() {
            $ajax({
                url:    '/clientmanage_v2/pmstask/set/finish',
                type:   'POST',
                data:   {
                    id:    id
                },
                success : function () {
                    cb && cb();
                }
            })
        })
    },
    finishInteTask: function (id, cb) {
        Confirm('是否确认任务已抽查完成?', function() {
            $ajax({
                url:    '/clientmanage_v2/pmstask/set/finishinte',
                type:   'POST',
                data:   {
                    id:    id
                },
                success : function () {
                    cb && cb();
                }
            })
        })
    },
    editPmsTask : function (id) {
        Prompt("/clientmanage_v2/pmstask/show/edit", {"id": id}, function (rtn_data) {
        });
    },
    closePmsTask : function (id, cb) {
        Confirm('是否确认关闭该任务?', function() {
            $ajax({
                url:    '/clientmanage_v2/pmstask/set/close',
                type:   'POST',
                data:   {
                    id:    id
                },
                success : function () {
                    cb && cb();
                }
            })
        })
    },
    showLog : function (id) {
        Prompt("/clientmanage_v2/pmstask/show/log", {"id": id}, function (rtn_data) {
            if (rtn_data) {
                $.ligerDialog.success(rtn_data);
            }
        },'',true,true);
    },
}

var Buri = {
    do_action_v2: function (args) {
        var cb = args.cb;
        if (cb)cb =eval(args.cb);
        if(!args.do_action || args.do_action == "do_action"){
            Buri.do_action(args.action, args.id, args.action_data, args.no_confirm, cb)
        } else {
            var fun_action = eval("Buri." + args.do_action);
            fun_action(args.action, args.id, cb);
        }
    },
    do_action: function (action_name, id, action_data, no_confirm, cb) {
        PmsServer._do_action("/buried_point/action", action_name, id, action_data, no_confirm, cb);
    },

    fill_fail_reason: function (action_name, id, cb) {
        Prompt("/clientmanage_v2/server/show", {"type": "fail_reason", "id": id}, function () {
            var fail_reason= $('.modal-dialog').find('[name="fail_reason"]').val();
            var action_data = {"reason_desc": fail_reason};
            Buri.do_action(action_name, id, action_data, true, cb);
        });
    },
}
var BuriData = {
    do_action_v2: function (args) {
        var cb = args.cb;
        if (cb)cb =eval(args.cb);
        if(!args.do_action || args.do_action == "do_action"){
            BuriData.do_action(args.action, args.id, args.action_data, args.no_confirm, cb)
        } else {
            var fun_action = eval("BuriData." + args.do_action);
            fun_action(args.action, args.id, cb);
        }
    },
    do_action: function (action_name, id, action_data, no_confirm, cb) {
        PmsServer._do_action("/buried_point/data_edit", action_name, id, action_data, no_confirm, cb);
    },

    allot : function (action_name, id, cb) {
        Prompt("/buried_point/data_edit", {"type": "allot", "id": id, "action": action_name, "title":"分配"}, function (rtn_data) {
            if (rtn_data) {
                //$.ligerDialog.success(rtn_data);
            }
            cb && cb();
        });
    },

    sendreview : function (action_name, id, cb) {
        Prompt("/buried_point/data_edit", {"type": "sendreview", "id": id, "action": action_name, "title":"提测"}, function (rtn_data) {
            if (rtn_data) {
                //$.ligerDialog.success(rtn_data);
            }
            cb && cb();
        });
    },

    fill_fail_reason: function (action_name, id, cb) {
        Prompt("/clientmanage_v2/server/show", {"type": "fail_reason", "id": id}, function () {
            var fail_reason= $('.modal-dialog').find('[name="fail_reason"]').val();
            var action_data = {"reason_desc": fail_reason};
            BuriData.do_action(action_name, id, action_data, true, cb);
        });
    },
}
var Pms = {
    do_action_v2: function (args) {
        var cb = args.cb;
        if (cb)cb =eval(args.cb);
        if(args.do_action == "do_action"){
            Pms.do_action(args.action, args.id, args.action_data, args.no_confirm, cb)
        } else {
            var fun_action = eval("Pms." + args.do_action);
            fun_action(args.action, args.id, cb);
        }
    },
    do_action: function (action_name, id, action_data, no_confirm, cb){
        PmsServer._do_action("/clientmanage_v2/pms/action", action_name, id, action_data, no_confirm, cb);
        //Pms.old_do_action(action_name, id, action_data);
    },
    close :function (id) { // 关闭
        Prompt("/clientmanage_v2/pms/show", {"type": "close", "id": id}, function () {
        });
    },
    assigned_product_reviewer: function (action_name, id, cb) {
        Prompt("/clientmanage_v2/pms/show", {"type": "assigned_product_reviewer", "id": id}, function () {
            var data = $('#prompt_dialog').data('get-data')();
            var action_data = {"pms": {"product_reviewer": data.product_reviewer,
                                        "remarks": data.remarks}};
            Pms.do_action(action_name, id, action_data, true);
            cb && cb();
        });
    },
    split_task : function (action_name, id, cb) {
        Prompt("/clientmanage_v2/pms/show", {"type": "split_task", "id": id}, function () {
            cb && cb();
        });
    },
    waitdev: function (action_name, id) {
        id_list = id.toString().split(',');
        for (i = 0; i < g.data["Rows"].length; i++) {
            rowdata = g.data["Rows"][i]
            for (j = 0; j <= id_list.length; j++)
                if (rowdata['id'] == id_list[j]) {
                    if (rowdata['work_load'] == 0 && rowdata['platform_id'] != 6) {
                        $.ligerDialog.warn('需求ID：' + id_list[j] + '请先补充预估开发人日再投入开发！');
                        return;
                    }
                }
        }
        title = '提需求';
        url = "/clientmanage_v2/dev_pmsedit/?id=" + id + "&" + "type=storage",
        opendialog(title, url, true, true, true, 'receive_serve', 400, 800)
    },
    review_back :function (action_name, id, cb) { // 打回
        Prompt("/clientmanage_v2/server/show", {"type": "fail_reason", "id": id}, function () {
            var fail_reason= $('.modal-dialog').find('[name="fail_reason"]').val();
            var action_data = {"reason_desc": fail_reason};
            Pms.do_action(action_name, id, action_data, true);
            cb && cb();
        });
    },
    protocol_review :function (id, with_id, cb) {
        Prompt("/clientmanage_v2/pms/show", {"type": "protocol_review", "id": id, "with_id":with_id}, function () {
            cb && cb();
        });
    },
    confirm_protocol_review: function (protocolreview_id, pmsphase_id, reviewer, cb) {
        Confirm("已经确定接口协议?", function () {
            var data = {"protocolreview_id":protocolreview_id, "pmsphase_id":pmsphase_id, "reviewer": reviewer};
            PmsServer.post("/clientmanage_v2/pms/set?type=confirm_protocol_review", data);
            cb && cb();
        })
    }
};

var PmsPhaseUI = {
    receive: function (id, cb) { // 领取
        Prompt("/clientmanage_v2/server/show", {"type": "receive_ui", "id": id}, function (rtn_data) {
            if (rtn_data) {
                //$.ligerDialog.success(rtn_data);
            }
            cb && cb();
        });
    }
};

var PmsPhaseTest = {
    operation: function (id, operation_id, cb) { 
        Prompt("/clientmanage_v2/server/show", {"type": "receive_test_task", "id": id, "operation_id":operation_id}, function (rtn_data) {
            if (rtn_data) {
                //$.ligerDialog.success(rtn_data);
            }
            cb && cb();
        });
    }
};

var billing = {
    develop_work_load : function (id, cb) {
        Prompt("/clientmanage_v2/billing/show", {"type": "develop_work_load", "id": id}, function (rtn_data) {
            if (rtn_data) {
                //$.ligerDialog.success(rtn_data);
            }
            try {
                window.g.bootstrapTable('clearSelection', id);
            } catch (err){}
            cb && cb();
        });
    },
    self_work_load : function (id, cb) {
        Prompt("/clientmanage_v2/billing/show", {"type": "self_work_load", "id": id}, function (rtn_data) {
            if (rtn_data) {
                //$.ligerDialog.success(rtn_data);
            }
            cb && cb();
        });
    },
    retreat : function (id) {
        Prompt("/clientmanage_v2/billing/show", {"type": "retreat", "id": id}, function (rtn_data) {
            if (rtn_data) {
                $.ligerDialog.success(rtn_data);
            }
        });
    },
    change_work_load : function (id) {
        Prompt("/clientmanage_v2/billing/show", {"type": "change_work_load", "id": id}, function (rtn_data) {
            if (rtn_data) {
                $.ligerDialog.success(rtn_data);
            }
        });
    },
    show_log : function (id) {
        Prompt("/clientmanage_v2/billing/show", {"type": "show_log", "id": id}, function (rtn_data) {
            if (rtn_data) {
                $.ligerDialog.success(rtn_data);
            }
        },'',true,true);
    },
}

var PmsCookie = {
    cookie: function (name, value, options) {
        if (typeof value != 'undefined') { // name and value given, set cookie
            options = options || {};
            if (value === null) {
                value = '';
                options.expires = -1;
            }
            var expires = '';
            if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
                var date;
                if (typeof options.expires == 'number') {
                    date = new Date();
                    date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
                } else {
                    date = options.expires;
                }
                expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
            }
            var path = options.path ? '; path=' + options.path : '';
            var domain = options.domain ? '; domain=' + options.domain : '';
            var secure = options.secure ? '; secure' : '';
            document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
        } else { // only name given, get cookie
            var cookieValue = null;
            if (document.cookie && document.cookie != '') {
                var cookies = document.cookie.split(';');
                for (var i = 0; i < cookies.length; i++) {
                    var cookie = jQuery.trim(cookies[i]);
                    // Does this cookie string begin with the name we want?
                    if (cookie.substring(0, name.length + 1) == (name + '=')) {
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            }
            return cookieValue;
        }
    },
    _build_url_cookie_key: function (url_path) {
        var x = url_path;
        if(x.indexOf("/") == 0){
             x=x.substr(1);
        }
        x = x.replace("&", "_").replace("=","-");
        x =  "query_" + x + '_0301'
        return x;
    },
    get_query_params: function (url_path) {
        var key =  PmsCookie._build_url_cookie_key(url_path);
        var cookie_value = PmsCookie.cookie(key);
        if (cookie_value) {
            if (cookie_value.indexOf("?")<0 && url_path.indexOf("?")<0){
                cookie_value = "?" + cookie_value;
            }
            return cookie_value;
        }
        return "";
    },
    set_query_params: function (url_path, values) {
        var key = PmsCookie._build_url_cookie_key(url_path);
        PmsCookie.cookie(key, values, {"expires": 7, "path":"/"});
    },
    del_query_params: function (url_path){
        var key = PmsCookie._build_url_cookie_key(url_path);
        PmsCookie.cookie(key, null, {path:"/"});
    }
};

/**
* @method:  BuriedPoint
* @desc:    埋点相关操作
* @params: 
* 
*/
window.BuriedPoint = {
    f_add:  function(id, platform_id) {
        if(id)  {
            title = '复制需求';
            url = "/buried_point/buried_pointedit/?id=" + id + "&type=copy&cato=pms&platform_id="+platform_id;
            dialog = opendialog(title,url,true,true,true,'copy',600,800,true)
        } else{
            title = '新增埋点需求';
            url = '/buried_point/buried_pointedit/?type=add&from=1&cato=pms&platform_id='+platform_id;
            opendialog(title,url,true,true,true,'add',600,800,true)
        }
    },
    modify:  function(id, content_id, platform_id, binding,cb) {
        Prompt("/buried_point/buried_pointedit/show", {"type": "modify", "id": id, "content_id": content_id, "binding": binding, "platform_id": platform_id, "title":"请选择需要绑定的任务"}, function (rtn_data) {
            if (rtn_data) {
                cb(rtn_data.is_binding);
                $.ligerDialog.success(rtn_data.info);
            }
        });
    },
    cb:  function(data) {
        var modules = [window.PmsAspect];
        if (modules.length > 0) {
            if (!modules[0].model.statistics) {
                modules[0].$set('model.statistics', []);
            }
            modules[0].model.statistics.push(data.id);
        }
    }, 
    del:    function(id, platform_id, cb) {
        if (!confirm('确定要删除吗?')) {
            return false;
        }
        $.ajax({
            url: "/buried_point/buried_pointshow/",
            type: 'post',
            data: {
                'action': 'delete',
                'id': id,
                'platform_id':  platform_id,
                'pms_id':   window.ID
            },
            dataType: 'json',
            success: function(data) {

                if (data.status == 1) {
                    cb();
                    window.Alert(1, '删除埋点成功');
                    /*
                    if (window.ID) {
                        // 编辑需求时，这时已经删除，所有最好刷新页面，给用户明显提示
                        // 新增需求时，删除只是表示之后不增加，不用刷新页面
                        window.location.href = window.location.href;    // 刷新
                    }
                    */
                } else {
                    window.Alert(0, data.error);
                }
            },
            error: function(data, status, e) {
                alert('服务器异常!');
            }
        });
    }
};
function alert_emergency(){

    var msg="紧急需求流程：<br>1）提测人员提前知会测试负责人（手机酷狗：李毅）<br>2）提测人员发送申请邮件，说明紧急原因，邮件接收人：部门负责人、测试负责人，抄送人：广告相关人员<br>3）部门负责人审批邮件<br>4）审批通过后，提测人员在MTP提测需求<br>5）测试负责人提高优先级并安排测试。<br>注：下班前提测，当天测试完毕，下班后提测，隔天测试完毕<br>";

     var   $alert = $(`<div class="alert alert-success" id="dialog-alert">
                <button type="button" class="close" data-dismiss="alert">x</button>
                <strong><p align="left"></p></strong>
                <span></span>
            </div>
        `);
    $alert.appendTo('body');
    $alert.alert();
    $alert.removeClass('alert-success').addClass('alert-danger');
    $alert.find('p').html(msg);
    $alert.fadeTo(2000000, 1000000).slideUp(1000000, function(){
        $alert.slideUp(1000000);
    })
}
/**
* @method: Alert
* @desc:    弹提示框
* @params:  type:   0 表示错误提示；1表示成功提示
*           msg:    提示内容
*/
function Alert_not_fade(type, msg) {
    var $alert = $("#dialog-alert1");
    if ($alert.length < 1) {
        $alert = $(`<div class="alert alert-success" id="dialog-alert1">
                <button type="button" class="close" data-dismiss="alert">x</button>
                <strong></strong>
                <span></span>
            </div>
        `);
        $alert.appendTo('body');
    }
    $alert.alert();
    if (type) {
        $alert.removeClass('alert-danger').addClass('alert-success');
    } else {
        $alert.removeClass('alert-success').addClass('alert-danger');
    }
    $alert.find('strong').html(msg);
    $alert.fadeTo(2000, 1000).slideUp(1000, function(){
        $alert.slideUp(1000);
    })
}
/**
* @method: Alert
* @desc:    弹提示框
* @params:  type:   0 表示错误提示；1表示成功提示
*           msg:    提示内容 
*/
function Alert(type, msg) {
    var $alert = $("#dialog-alert");
    if ($alert.length < 1) {
        $alert = $(`<div class="alert alert-success fade" id="dialog-alert">
                <button type="button" class="close" data-dismiss="alert">x</button>
                <strong></strong>
                <span></span>
            </div>
        `);
        $alert.appendTo('body');
    } 
    $alert.alert();
    if (type) {
        $alert.removeClass('alert-danger').addClass('alert-success');
    } else {
        $alert.removeClass('alert-success').addClass('alert-danger');
    }
    $alert.find('strong').html(msg);
    $alert.fadeTo(2000, 1000).slideUp(1000, function(){
        $alert.slideUp(1000);
    })
}

function Confirm(msg, cb1, cb2, norefresh) {
    let $dialog = $('#confirm_dialog');
    if ($dialog.length < 1) {
        $dialog = $(`<div id="confirm_dialog" class="modal fade" tabindex="-1" role="dialog">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                            <h4 class="modal-title"></h4>
                        </div>
                        <div class="modal-body">
                            <p></p>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
                            <button type="button" class="btn btn-primary sure">确定</button>
                        </div>
                    </div>
                </div>
            </div>
        `);
        $dialog.appendTo('body');
    }

    $dialog.find('p').html('');
    $dialog.find('h4').html(msg);
    $dialog.modal('show');

    var callback = function() {
        $dialog.modal('hide');
        cb1();
        if (!norefresh) {
            setTimeout(function() {
                try {
                    if (window.g.refresh) window.g.refresh();
                    else    window.g.fetch();
                } catch (e) {
                    try {
                        loadgridRefresh(g.options.page, g.options.pageSize, g.options.sortName, g.options.sortOrder);
                    } catch(e) {}
                }
            }, 500)
        }
    };
    $dialog.find('.sure').off('click').on('click', callback);
}

/**
* @method: Prompt2
* @desc: 弹出表格框
* @params: 
*   url:    返回form字符串的
*   option: 提交url上参数
*   cb1:    提交后的回调函数
*   cb2:    提交前的回调函数
*   norefresh:  是否不刷新外面表格
* @ps:
*   如果有window.getPromptData函数，会以此函数来提取要提交的数据内容
*/
function Prompt2(url, option, cb1, cb2, norefresh, noajax) {
    let $dialog = $('#prompt_dialog2');
    if ($dialog.length < 1) {
        $dialog = $(`<div id="prompt_dialog2" class="modal fade" tabindex="-1" role="dialog" style="overflow-y: auto">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                            <h4 class="modal-title"></h4>
                        </div>
                        <div class="modal-body">
                            <p style="text-align: center;"></p>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
                            <button type="button" class="btn btn-primary sure" data-loading-text="正在保存">确定</button>
                        </div>
                    </div>
                </div>
            </div>
        `);
        $dialog.appendTo('body');
    }


    $dialog.removeData();

    function _validate() {
        if ($dialog.data('validate')) {
            var valid = $dialog.data('validate')();
        } else {
            let $form = $dialog.find('form');
            var notvalid = false;
            if ($form.length > 1) {
                $form.each( (i, one) => {
                    if (_form_validate($(one)))      notvalid=true
                })
            } else {
                notvalid = _form_validate($form)
            }
            var valid = !notvalid;
        }
        return valid;
    }

    function _form_validate($form_) {
        if ($form_.validator) {
            let notvalid = $form_.validator('validate')
                .data('bs.validator').hasErrors();
            return notvalid;
        }  else {
            return false;
        }
    }

    $dialog.find('.error_msg').remove();
    $dialog.find('.sure').off('click').on('click', function() {
        try{
            if(option.no_validate){
                $dialog.modal('hide');
                return false;
            }
        }
        catch(err){

        }

        var valid = _validate();
        if (!valid) {
            $dialog.data('show-invalid') && $dialog.data('show-invalid')();
            return false;
        }

        /* 看有没有提供自己特定地获取数据的方法 */
        let $form = $dialog.find('form');
        if ($dialog.data('get-data')) {
            var data = $dialog.data('get-data')();
        } else {
            var data = $form.serialize();
        }
        if(noajax){
            $dialog.modal('hide');
            return false;
        }
        let $submit = $dialog.find('.sure');
        $submit.button('loading');
        $dialog.find('.error_msg').remove();
        $.ajax({
            url:    $form.attr('action'),
            type:   'POST',
            data:   data,
            success:    function(resp) {
                if (resp.status == 0) {
                    $dialog.find('.modal-footer').append(`<span class="error_msg">提示：${resp.error}</span>`)
                } else {
                    var rtn_data = resp.data || resp;
                    $dialog.modal('hide');
                    cb1 && cb1(rtn_data);
                    if (!norefresh) {
                        if (window.g) {
                            try {
                                if (window.g.refresh) window.g.refresh()
                                else if (window.g.fetch) window.g.fetch()
                                else    {
                                    window['g'+window.NowGid].bootstrapTable('refresh');
                                    if (window['gg' + gid]) {
                                        window['gg' + gid].fetch()
                                    }
                                }
                            } catch(e) {
                                try {
                                    loadgridRefresh(g.options.page,g.options.pageSize,g.options.sortName,g.options.sortOrder);
                                } catch(e) {
                                }
                            }
                        } else {
                            try{
                                var gid = window.NowGid;
                                window['g'+gid].bootstrapTable('refresh');
                                if (window['gg' + gid]) {
                                    window['gg' + gid].fetch()
                                }
                            } catch (e){
                            }
                        }
                    }
                }
            },
            error:  function() {
                $dialog.find('.modal-footer').append(`<span class="error_msg">提示：服务器异常</span>`)
            }
        })
        setTimeout(function() {
            $submit.button('reset');
        }, 3*1000)
    });

    function showup(str) {
        $dialog.find('h4').html('');
        if (typeof str == 'string') {
            $dialog.find('p').html(str);
        } else {
            $dialog.find('p').html(str.html()); // dom
        }
        if(option.title){
            $dialog.find('h4').html(option.title);
            delete option["title"];
        }
        cb2 && cb2();
        $dialog.modal({
            keyboard: false,
            backdrop: 'static'
        });
    }

    if (typeof url == 'object') {
        let dom = url;
        showup(dom);
    } else {
        /* 看是url 还是 html标签 */
        if (!/\<|\>/g.test(url)) {
            $ajax({
                url:    url,
                data:   option,
                type:   'GET',
                success:    function(str) {
                    showup(str);
                }
            })
        } else {
            let str = url;
            showup(str);
        }
    }
}

/**
* @method: Prompt
* @desc: 弹出表格框
* @params:
*   url:    返回form字符串的
*   option: 提交url上参数
*   cb1:    提交后的回调函数
*   cb2:    提交前的回调函数
*   norefresh:  是否不刷新外面表格
* @ps:
*   如果有window.getPromptData函数，会以此函数来提取要提交的数据内容
*/
function Prompt(url, option, cb1, cb2, norefresh, noajax) {
    let $dialog = $('#prompt_dialog');
    if ($dialog.length < 1) {
        $dialog = $(`<div id="prompt_dialog" class="modal fade" tabindex="-1" role="dialog" style="overflow-y: auto">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                            <h4 class="modal-title"></h4>
                        </div>
                        <div class="modal-body">
                            <p style="text-align: center;"></p>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
                            <button type="button" class="btn btn-primary sure" data-loading-text="正在保存">确定</button>
                        </div>
                    </div>
                </div>
            </div>
        `);
        $dialog.appendTo('body');
    }
    $dialog.removeData();

    function _validate() {
        if ($dialog.data('validate')) {
            var valid = $dialog.data('validate')();
        } else {
            let $form = $dialog.find('form');
            var notvalid = false;
            if ($form.length > 1) {
                $form.each( (i, one) => {
                    if (_form_validate($(one)))      notvalid=true
                })
            } else {
                notvalid = _form_validate($form)
            }
            var valid = !notvalid;
        }
        return valid;
    }

    function _form_validate($form_) {
        if ($form_.validator) {
            let notvalid = $form_.validator('validate')
                .data('bs.validator').hasErrors();
            return notvalid;
        }  else {
            return false;
        }
    }

    $dialog.find('.error_msg').remove();
    $dialog.find('.sure').off('click').on('click', function() {
        try{
            if(option.no_validate){
                $dialog.modal('hide');
                return false;
            }
        }
        catch(err){

        }

        var valid = _validate();
        if (!valid) {
            $dialog.data('show-invalid') && $dialog.data('show-invalid')();
            return false;
        }

        /* 看有没有提供自己特定地获取数据的方法 */
        let $form = $dialog.find('form');
        if ($dialog.data('get-data')) {
            var data = $dialog.data('get-data')();
        } else {
            var data = $form.serialize();
        }
        if(noajax){
            $dialog.modal('hide');
            return false;
        }
        let $submit = $dialog.find('.sure');
        $submit.button('loading');
        $dialog.find('.error_msg').remove();
        $.ajax({
            url:    $form.attr('action'),
            type:   'POST',
            data:   data,
            success:    function(resp) {
                $submit.button('reset');
                if (resp.status == 0) {
                    $dialog.find('.modal-footer').append(`<span class="error_msg">提示：${resp.error}</span>`)
                } else {
                    var rtn_data = resp.data || resp;
                    $dialog.modal('hide');
                    cb1 && cb1(rtn_data);
                    if (!norefresh) {
                        if (window.g) {
                            try {
                                if (window.g.refresh) window.g.refresh()
                                else if (window.g.fetch) window.g.fetch()
                                else    {
                                    window['g'+window.NowGid].bootstrapTable('refresh');
                                    if (window['gg' + gid]) {
                                        window['gg' + gid].fetch()
                                    }
                                }
                            } catch(e) {
                                try {
                                    loadgridRefresh(g.options.page,g.options.pageSize,g.options.sortName,g.options.sortOrder);
                                } catch(e) {
                                }
                            }
                        } else {
                            try{
                                var gid = window.NowGid;
                                window['g'+gid].bootstrapTable('refresh');
                                if (window['gg' + gid]) {
                                    window['gg' + gid].fetch()
                                }
                            } catch (e){
                            }
                        }
                    }
                }
            },
            error:  function() {
                $submit.button('reset');
                $dialog.find('.modal-footer').append(`<span class="error_msg">提示：服务器异常</span>`)
            }
        })
    });

    function showup(str) {
        $dialog.find('h4').html('');
        if (typeof str == 'string') {
            $dialog.find('p').html(str);
        } else {
            $dialog.find('p').html(str.html()); // dom
        }
        if(option.title){
            $dialog.find('h4').html(option.title);
            delete option["title"];
        }
        cb2 && cb2();
        $dialog.modal({
            keyboard: false,
            backdrop: 'static'
        });
    }

    if (typeof url == 'object') {
        let dom = url;
        showup(dom);
    } else {
        /* 看是url 还是 html标签 */
        if (!/\<|\>/g.test(url)) {
            $ajax({
                url:    url,
                data:   option,
                type:   'GET',
                success:    function(str) {
                    showup(str);
                }
            })
        } else {
            let str = url;
            showup(str);
        }
    }
}
/**
* @method: Prompt
* @desc: 弹出表格框
* @params:
*   url:    返回form字符串的
*   option: 提交url上参数
*   cb1:    提交后的回调函数
*   cb2:    提交前的回调函数
*   norefresh:  是否不刷新外面表格
* @ps:
*   如果有window.getPromptData函数，会以此函数来提取要提交的数据内容
*/
function Prompt_rtn_data(url, option, cb1, cb2, norefresh) {
    let $dialog = $('#prompt_dialog');
    if ($dialog.length < 1) {
        $dialog = $(`<div id="prompt_dialog" class="modal fade" tabindex="-1" role="dialog">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                            <h4 class="modal-title"></h4>
                        </div>
                        <div class="modal-body">
                            <p></p>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
                            <button type="button" class="btn btn-primary sure" data-loading-text="正在保存">确定</button>
                        </div>
                    </div>
                </div>
            </div>
        `);
        $dialog.appendTo('body');
    }
    $dialog.removeData();

    function _validate() {
        if ($dialog.data('validate')) {
            var valid = $dialog.data('validate')();
        } else {
            let $form = $dialog.find('form');
            var notvalid = false;
            if ($form.length > 1) {
                $form.each( (i, one) => {
                    if (_form_validate($(one)))      notvalid=true
                })
            } else {
                notvalid = _form_validate($form)
            }
            var valid = !notvalid;
        }
        return valid;
    }

    function _form_validate($form_) {
        if ($form_.validator) {
            let notvalid = $form_.validator('validate')
                .data('bs.validator').hasErrors();
            return notvalid;
        }  else {
            return false;
        }
    }

    $dialog.find('.sure').off('click').on('click', function() {
        var valid = _validate();
        if (!valid) {
            $dialog.data('show-invalid') && $dialog.data('show-invalid')();
            return false;
        }

        /* 看有没有提供自己特定地获取数据的方法 */
        let $form = $dialog.find('form');
        if ($dialog.data('get-data')) {
            var data = $dialog.data('get-data')();
        } else {
            var data = $form.serialize();
        }

        let $submit = $dialog.find('.sure');
        $submit.button('loading');
        $dialog.modal('hide');
        cb1 && cb1(data);
        setTimeout(function() {
            $submit.button('reset');
        }, 3*1000)
    });

    function showup(str) {
        $dialog.find('h4').html('');
        if (typeof str == 'string') {
            $dialog.find('p').html(str);
        } else {
            $dialog.find('p').html(str.html()); // dom
        }
        cb2 && cb2();
        $dialog.modal({
            keyboard: false,
            backdrop: 'static'
        });
    }

    if (typeof url == 'object') {
        let dom = url;
        showup(dom);
    } else {
        /* 看是url 还是 html标签 */
        if (!/\<|\>/g.test(url)) {
            $ajax({
                url:    url,
                data:   option,
                type:   'GET',
                success:    function(str) {
                    showup(str);
                }
            })
        } else {
            let str = url;
            showup(str);
        }
    }
}
/**
* @method:  Repausetime
* @desc:    重新设定新的解除时间
* @params: 
* 
*/
function Repausetime(rowdata, Vue, oldtime) {
    let id = rowdata.pmsphase__id || rowdata.id;
    let url = `/clientmanage_v2/pmsphase/repause/${id}/`;
    var form = `
        <form id="pause_reset_form" action=${url} method="POST" class="form-horizontal" data-toggle="validator">
            <div class="form-group row">
                <label class="col-sm-4 control-label">新阻塞解除时间</label>
                <div class="col-sm-6">
                    <datetimepicker :value.sync="freetime" required></datetimepicker>
                </div>
            </div>
        </form>
    `;
    window.Prompt(form, '', function() {
        Alert(1, '重设成功');
    }, function() {
        
        var f = function(Vue, Datetimepicker) {
            var vue = new Vue({
                el:         '#pause_reset_form',
                components: {
                    'datetimepicker':   Datetimepicker,
                }
            });
            $('#prompt_dialog').data('get-data', function() {
                let data = Object.assign({}, vue.$data);
                return data;
            });
        }

        if (typeof define === 'function') {
            require([
                "vue",
                "component/datetimepicker",
            ], f)
        } else {
            f(Vue, Datetimepicker);
        }
    });
}


/*
 * 右键响应函数
 */
function toggleCurrentVersion(component, rowdata, cb) {
    let id = rowdata.pmsphase__id || rowdata.pmsphase_id || rowdata.id,
        platform_id = rowdata.platform__id || rowdata.platform_id;
    if (!rowdata.is_current) {
        Confirm('是否移入当前版本视图', function() {
            $ajax({
                url:    '/clientmanage_v2/version/incurrent/',
                type:   'POST',
                data:   {
                    pmsphase_id:    id,
                    platform_id:    platform_id,
                },
                success:    (msg) => {
                    Alert(1, '移入成功');
                    cb && cb();
                }
            })
        })
    } else {
        Confirm('是否移出当前版本视图', function() {
            $ajax({
                url:    '/clientmanage_v2/version/outcurrent/',
                type:   'POST',
                data:   {
                    pmsphase_id:    id,
                },
                success:    () => {
                    Alert(1, '移出成功');
                    cb && cb()
                }
            })
        })
    }
}
function triggerNextVersionRed(component, rowdata, cb) {
    if(rowdata.score == 8){
        triggerNextVersionOut(component, rowdata, cb);
    }
    else{
        triggerNextVersionIn(component, rowdata, 0,  cb)
    }
}

function triggerNextVersionBlue(component, rowdata, cb) {
    if(rowdata.score == 4){
        triggerNextVersionOut(component, rowdata, cb);
    }
    else{
        triggerNextVersionIn(component, rowdata, 1,  cb)
    }
}

function triggerNextVersionYellow(component, rowdata, cb) {
    if(rowdata.score == 3.5){
        triggerNextVersionOut(component, rowdata, cb);
    }
    else{
        triggerNextVersionIn(component, rowdata, 2,  cb)
    }
}
function triggerCorePms(component, rowdata, cb) {
    let id = rowdata.id;
        if (rowdata.in_version) {
            Confirm("是否移出核心需求?", function() {
                $ajax({
                    'url': '/clientmanage_v2/version/out/',
                    'type': 'post',
                    'data': {
                        id_list:    JSON.stringify([id]),
                    },
                    'success':  function() {
                        cb && cb();
                    }
                })
            })
        } else {
            Confirm("是否移入核心需求?", function() {
                $ajax({
                    'url': '/clientmanage_v2/version/in/',
                    'type': 'post',
                    'data': {
                        id_list:    JSON.stringify([id]),
                    },
                    'success':  function() {
                        cb && cb();
                    }
                })
            })
        }
        return false; // 防止多次事件触发
    
}
function  triggerNextVersionOut(component, rowdata, cb) {
    var url = "/clientmanage_v2/next_version/pms/"+rowdata.id+"/out/";
    var self = this;
    Confirm("确定取消插旗?", function() {
        $ajax({
            'url':      url,
            'type':     'post',
            'data':     {
                'next_version__id': rowdata.next_version,
                'action':   'pms_out_nextversion',
            },
            'success':  function() {
                cb && cb();
            }
        })
    });
}

function triggerNextVersionIn(component, rowdata, rankid,  cb) {
    var url = "/clientmanage_v2/next_version/pms/"+rowdata.id+"/in/",
        platform_id = rowdata.platform_id;
    var self = this;
    var text;
    switch(rankid) {
        case 1:     text = '插蓝旗';    break;
        case 2:     text = '插黄旗';    break;
        default:    text = '插旗';      break;
    }
    Confirm(`确定要${text}吗?`, function() {
        $ajax({
            'url': url,
            'type': 'post',
            'data': {
                'platform_id': platform_id,
                'action':   'pms_in_nextversion',
                'rank_id':  rankid
            },
            'success':  function() {
                cb && cb();
            }
        })
    })
}
/* 修改需求优先级 */
function changePmsPriority(component, rowdata) {
    var form = `
        <form id="urgency_form" action='/clientmanage_v2/pms/set/?type=set_urgency&id=${rowdata.id}'>
            <div class="form-group row">
                <label class="col-sm-2 control-label">优先级</label>
                <div class="col-sm-9">
                    <label>
                        <input type="radio" name="urgency" value=1> 
                        1
                    </label>
                    <label>
                        <input type="radio" name="urgency" value=2> 
                        2
                    </label>
                    <label>
                        <input type="radio" name="urgency" value=3> 
                        3
                    </label>
                </div>
            </div>
        </form>
    `;
    window.Prompt(form, '', function() {
        window.Alert(1, '设置成功');
    });
    $('#urgency_form').find("[value="+rowdata.urgency+"]").attr("checked", true);
}



/**
* @method: ParseQueryString
* @desc:    解析querystring
* @params: 
* @return:  返回字典  
*/
function ParseQueryString() {
    var urlParams;
    (window.onpopstate = function () {
        var match,
            pl     = /\+/g,  // Regex for replacing addition symbol with a space
            search = /([^&=]+)=?([^&]*)/g,
            decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
            query  = window.location.search.substring(1);

        urlParams = {};
        while (match = search.exec(query))
           urlParams[decode(match[1])] = decode(match[2]);
    })();
    return urlParams;
}

/**     
* @desc: JQuery扩展方法
* @params: 
* 
*/
/* 动画方法 */
$.fn.extend({
    animateCss: function (animationName, option) {
        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        this.addClass('animated ' + animationName).one(animationEnd, function(e) {
            $(this).removeClass('animated ' + animationName);
            if (option && option.end) 
                option.end(e)
        });
    },
    Confirm:    function(msg, cb1, cb2) {
        this.confirmation({
            title:      msg,
            btnOkClass: 'btn btn-sm btn-primary',
            btnOkLabel: '确定',
            btnCancelLabel: '取消',
            onConfirm:  cb1,
            onCancel:   cb2,
        })
    },
});

function parse_Obj(obj) {
    ret_list = [];
    for(i = 0 ; i< obj.length ; i++){
        ret_list.push(obj[i].id)
    } 
    return ret_list;
}

function parseDom(arg) {
    var objE = document.createElement("div");objE.innerHTML = arg;return objE.childNodes;
};


/* 动态加载script方法 */
function AddScripts(srclist, callback) {
    var count = 0,
        all = srclist.length;
    srclist.forEach(function(src) {
        var s = document.createElement( 'script' );
        s.setAttribute('src', src);
        s.onload = function() {
            if (++count == all) callback && callback()
        }
        document.body.appendChild(s);
    })
}

/* 动态加载css方法 */
function AddCss(srclist) {
    srclist.forEach(function(src) {
        var link = document.createElement('link');
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('type', 'text/css');
        link.setAttribute('href', src);
        document.getElementsByTagName('head')[0].appendChild(link)
    })
}

var DateUtil=function(){
    /***
     * 获得当前时间
     */
    this.getCurrentDate=function(){
        return new Date();
    };
    /***
     * 获得本周起止时间
     */
    this.getCurrentWeek=function(){
        //起止日期数组
        var startStop=new Array();
        //获取当前时间
        var currentDate=this.getCurrentDate();
        //返回date是一周中的某一天
        var week=currentDate.getDay();
        //返回date是一个月中的某一天
        var month=currentDate.getDate();

        //一天的毫秒数
        var millisecond=1000*60*60*24;
        //减去的天数
        var minusDay=week!=0?week-1:6;
        //alert(minusDay);
        //本周 周一
        var monday=new Date(currentDate.getTime()-(minusDay*millisecond));
        //本周 周日
        var sunday=new Date(monday.getTime()+(6*millisecond));
        //添加本周时间
        startStop.push(monday);//本周起始时间
        //添加本周最后一天时间
        startStop.push(sunday);//本周终止时间
        //返回
        return startStop;
    };

    /***
     * 获得本月的起止时间
     */
    this.getCurrentMonth=function(){
        //起止日期数组
        var startStop=new Array();
        //获取当前时间
        var currentDate=this.getCurrentDate();
        //获得当前月份0-11
        var currentMonth=currentDate.getMonth();
        //获得当前年份4位年
        var currentYear=currentDate.getFullYear();
        //求出本月第一天
        var firstDay=new Date(currentYear,currentMonth,1);


        //当为12月的时候年份需要加1
        //月份需要更新为0 也就是下一年的第一个月
        if(currentMonth==11){
            currentYear++;
            currentMonth=0;//就为
        }else{
            //否则只是月份增加,以便求的下一月的第一天
            currentMonth++;
        }


        //一天的毫秒数
        var millisecond=1000*60*60*24;
        //下月的第一天
        var nextMonthDayOne=new Date(currentYear,currentMonth,1);
        //求出上月的最后一天
        var lastDay=new Date(nextMonthDayOne.getTime()-millisecond);

        //添加至数组中返回
        startStop.push(firstDay);
        startStop.push(lastDay);
        //返回
        return startStop;
    };

    /**
     * 得到本季度开始的月份
     * @param month 需要计算的月份
     ***/
    this.getQuarterSeasonStartMonth=function(month){
        var quarterMonthStart=0;
        var spring=0; //春
        var summer=3; //夏
        var fall=6;   //秋
        var winter=9;//冬
        //月份从0-11
        if(month<3){
            return spring;
        }

        if(month<6){
            return summer;
        }

        if(month<9){
            return fall;
        }

        return winter;
    };

    /**
     * 获得该月的天数
     * @param year年份
     * @param month月份
     * */
    this.getMonthDays=function(year,month){
        //本月第一天 1-31
        var relativeDate=new Date(year,month,1);
        //获得当前月份0-11
        var relativeMonth=relativeDate.getMonth();
        //获得当前年份4位年
        var relativeYear=relativeDate.getFullYear();

        //当为12月的时候年份需要加1
        //月份需要更新为0 也就是下一年的第一个月
        if(relativeMonth==11){
            relativeYear++;
            relativeMonth=0;
        }else{
            //否则只是月份增加,以便求的下一月的第一天
            relativeMonth++;
        }
        //一天的毫秒数
        var millisecond=1000*60*60*24;
        //下月的第一天
        var nextMonthDayOne=new Date(relativeYear,relativeMonth,1);
        //返回得到上月的最后一天,也就是本月总天数
        return new Date(nextMonthDayOne.getTime()-millisecond).getDate();
    };

    /**
     * 获得本季度的起止日期
     */
    this.getCurrentSeason=function(){
        //起止日期数组
        var startStop=new Array();
        //获取当前时间
        var currentDate=this.getCurrentDate();
        //获得当前月份0-11
        var currentMonth=currentDate.getMonth();
        //获得当前年份4位年
        var currentYear=currentDate.getFullYear();
        //获得本季度开始月份
        var quarterSeasonStartMonth=this.getQuarterSeasonStartMonth(currentMonth);
        //获得本季度结束月份
        var quarterSeasonEndMonth=quarterSeasonStartMonth+2;

        //获得本季度开始的日期
        var quarterSeasonStartDate=new Date(currentYear,quarterSeasonStartMonth,1);
        //获得本季度结束的日期
        var quarterSeasonEndDate=new Date(currentYear,quarterSeasonEndMonth,this.getMonthDays(currentYear, quarterSeasonEndMonth));
        //加入数组返回
        startStop.push(quarterSeasonStartDate);
        startStop.push(quarterSeasonEndDate);
        //返回
        return startStop;
    };
    /**
     * 获得本季度的起止日期,起始日期为季度开始日期，结束日期为当天
     */
    this.getCurrentSeason_v2=function(){
        //起止日期数组
        var startStop=new Array();
        //获取当前时间
        var currentDate=this.getCurrentDate();
        //获得当前月份0-11
        var currentMonth=currentDate.getMonth();
        //获得当前年份4位年
        var currentYear=currentDate.getFullYear();
        //获得本季度开始月份
        var quarterSeasonStartMonth=this.getQuarterSeasonStartMonth(currentMonth);
        //获得本季度结束月份
        var quarterSeasonEndMonth=quarterSeasonStartMonth+2;

        //获得本季度开始的日期
        var quarterSeasonStartDate=new Date(currentYear,quarterSeasonStartMonth,1);
        //获得本季度结束的日期
        var quarterSeasonEndDate=new Date(currentYear,quarterSeasonEndMonth,this.getMonthDays(currentYear, quarterSeasonEndMonth));
        //加入数组返回
        startStop.push(quarterSeasonStartDate);
        startStop.push(currentDate);
        //返回
        return startStop;
    };
    /***
     * 得到本年的起止日期
     *
     */
    this.getCurrentYear=function(){
        //起止日期数组
        var startStop=new Array();
        //获取当前时间
        var currentDate=this.getCurrentDate();
        //获得当前年份4位年
        var currentYear=currentDate.getFullYear();

        //本年第一天
        var currentYearFirstDate=new Date(currentYear,0,1);
        //本年最后一天
        var currentYearLastDate=new Date(currentYear,11,31);
        //添加至数组
        startStop.push(currentYearFirstDate);
        startStop.push(currentYearLastDate);
        //返回
        return startStop;
    };

    /**
     * 返回上一个月的第一天Date类型
     * @param year 年
     * @param month 月
     **/
    this.getPriorMonthFirstDay=function(year,month){
        //年份为0代表,是本年的第一月,所以不能减
        if(month==0){
            month=11;//月份为上年的最后月份
            year--;//年份减1
            return new Date(year,month,1);
        }
        //否则,只减去月份
        month--;
        return new Date(year,month,1);;
    };

    /**
     * 获得上一月的起止日期
     * ***/
    this.getPreviousMonth=function(){
        //起止日期数组
        var startStop=new Array();
        //获取当前时间
        var currentDate=this.getCurrentDate();
        //获得当前月份0-11
        var currentMonth=currentDate.getMonth();
        //获得当前年份4位年
        var currentYear=currentDate.getFullYear();
        //获得上一个月的第一天
        var priorMonthFirstDay=this.getPriorMonthFirstDay(currentYear,currentMonth);
        //获得上一月的最后一天
        var priorMonthLastDay=new Date(priorMonthFirstDay.getFullYear(),priorMonthFirstDay.getMonth(),this.getMonthDays(priorMonthFirstDay.getFullYear(), priorMonthFirstDay.getMonth()));
        //添加至数组
        startStop.push(priorMonthFirstDay);
        startStop.push(priorMonthLastDay);
        //返回
        return startStop;
    };


    /**
     * 获得上一周的起止日期
     * **/
    this.getPreviousWeek=function(){
        //起止日期数组
        var startStop=new Array();
        //获取当前时间
        var currentDate=this.getCurrentDate();
        //返回date是一周中的某一天
        var week=currentDate.getDay();
        //返回date是一个月中的某一天
        var month=currentDate.getDate();
        //一天的毫秒数
        var millisecond=1000*60*60*24;
        //减去的天数
        var minusDay=week!=0?week-1:6;
        //获得当前周的第一天
        var currentWeekDayOne=new Date(currentDate.getTime()-(millisecond*minusDay));
        //上周最后一天即本周开始的前一天
        var priorWeekLastDay=new Date(currentWeekDayOne.getTime()-millisecond);
        //上周的第一天
        var priorWeekFirstDay=new Date(priorWeekLastDay.getTime()-(millisecond*6));

        //添加至数组
        startStop.push(priorWeekFirstDay);
        startStop.push(priorWeekLastDay);

        return startStop;
    };

    /**
     * 得到上季度的起始日期
     * year 这个年应该是运算后得到的当前本季度的年份
     * month 这个应该是运算后得到的当前季度的开始月份
     * */
    this.getPriorSeasonFirstDay=function(year,month){
        var quarterMonthStart=0;
        var spring=0; //春
        var summer=3; //夏
        var fall=6;   //秋
        var winter=9;//冬
        //月份从0-11
        switch(month){//季度的其实月份
        case spring:
            //如果是第一季度则应该到去年的冬季
              year--;
              month=winter;
            break;
        case summer:
            month=spring;
            break;
        case fall:
            month=summer;
            break;
        case winter:
            month=fall;
            break;

        };

        return new Date(year,month,1);
    };

    /**
     * 得到上季度的起止日期
     * **/
    this.getPreviousSeason=function(){
        //起止日期数组
        var startStop=new Array();
        //获取当前时间
        var currentDate=this.getCurrentDate();
        //获得当前月份0-11
        var currentMonth=currentDate.getMonth();
        //获得当前年份4位年
        var currentYear=currentDate.getFullYear();
        //上季度的第一天
        var priorSeasonFirstDay=this.getPriorSeasonFirstDay(currentYear, currentMonth);
        //上季度的最后一天
        var priorSeasonLastDay=new Date(priorSeasonFirstDay.getFullYear(),priorSeasonFirstDay.getMonth()+2,this.getMonthDays(priorSeasonFirstDay.getFullYear(), priorSeasonFirstDay.getMonth()+2));
        //添加至数组
        startStop.push(priorSeasonFirstDay);
        startStop.push(priorSeasonLastDay);
        return startStop;
    };

    /**
     * 得到去年的起止日期
     * **/
    this.getPreviousYear=function(){
        //起止日期数组
        var startStop=new Array();
        //获取当前时间
        var currentDate=this.getCurrentDate();
        //获得当前年份4位年
        var currentYear=currentDate.getFullYear();
            currentYear--;
        var priorYearFirstDay=new Date(currentYear,0,1);
        var priorYearLastDay=new Date(currentYear,11,1);
        //添加至数组
        startStop.push(priorYearFirstDay);
        startStop.push(priorYearLastDay);
        return startStop;
    };
};

/**
 * 换行符，转成<br>
 * @param value
 * @returns {*}
 */
function formatter_n2br(value) {
    if (typeof(value) != "undefined" && value.indexOf("<")<0) {
        var k = value;
        value = k.replace(/\n/ig, "<br>");
    }
    return value;
}