/***
 * ����ԭ���������������ʾJquery���
 * ��дʱ�䣺2012��11��14��
 * version:manhua_hoverTips.js
***/
$(function() {
	$.fn.manhua_hoverTips = function(options) {
		var defaults = {					
			position : "t",			//��ͷָ����(t)����ͷָ����(b)����ͷָ����(l)����ͷָ����(r)
			value : 23				//С��ͷƫ����ߺ��ϱߵ�λ��			
			
		};
		var options = $.extend(defaults,options);	
		
		var bid = parseInt(Math.random()*100000);	
		var $this = $(this);
		$("body").prepend('<div class="docBubble" id="btip'+bid+'"><i class="triangle-'+options.position+'"></i><div class="tl"><div class="inner"><div class="cont"></div></div></div><div class="tr"></div><div class="bl"></div></div>');
		var $btip = $("#btip"+bid);
		var $btipClose = $("#btipc"+bid);		
		var offset,h ,w ;	
		var timer;
		$this.die().live("mousemove",function(){
			clearInterval(timer);
			offset = $(this).offset();
			h = $(this).height();
			w = $(this).width();			
			$(".cont").html($(this).attr("tips"));
			
			switch(options.position){
				case "t" ://�����������ʱ��
					$(".triangle-t").css('left',options.value);
					$btip.css({ "left":offset.left-200  ,  "top":offset.top+h+14  }).show();
					break;
				case "b" ://�����������ʱ��
					$(".triangle-b").css('left',options.value);
					$btip.css({ "left":offset.left ,  "top":offset.top-h-7-$btip.height()  }).show();
					break;
				case "l" ://��������ߵ�ʱ��		
					$(".triangle-l").css('top',options.value);
					$btip.css({ "left":offset.left+w+10  ,  "top":offset.top+h/2-7-options.value }).show();
					break;
				case "r" ://�������ұߵ�ʱ��			
					$(".triangle-r").css('top',options.value);
					$btip.css({ "left":offset.left-20-$btip.width()  ,  "top":offset.top+h/2-7-options.value }).show();
					break;
			}
				
		});
		$this.live("mouseout",function(){
			timer = setInterval(function (){
				 $btip.hide();
			}, 10);
		});
		
		$btip.live("mousemove",function(){
			clearInterval(window.timer);
			$btip.show();
		});
		$btip.live("mouseout",function(){
			$btip.hide();
		});
		$btipClose.live("click",function(e){
		  $btip.hide();	
		});		
	}
});