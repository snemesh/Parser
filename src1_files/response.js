
function otzyv_validate() {
    emailRegExp = /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.([a-z]){2,4})$/;
    d = document.fotzyv.what.value == 0 || (document.fotzyv.what.value == 3 && !document.fotzyv.response.value) /*|| !document.fotzyv.name.value || !emailRegExp.test(document.fotzyv.email.value) || !document.fotzyv.response.value*/ ? true : false;
    a = document.getElementById("otzyv_submit");
    if (a) a.disabled = d;
}

function otzyv_send() {
    sndReqOtzyv('?id=' + document.fotzyv.lid.value + '&what=' + document.fotzyv.what.value + '&name=' + document.fotzyv.name.value + '&email=' + document.fotzyv.email.value + '&response=' + document.fotzyv.response.value.replace(/\n/g, "%0A") + '&bye=' + document.fotzyv.bye.value);
}

function otzyv_thanks() {
    otzyv_close();
    alert("Ваш отзыв получен. Спасибо!");
}

function otzyv(obj, id, firm, title) {
    a = document.getElementById("otzyv");
    if (a) {
        a.style.left = getposOffset(obj, "left") + 100 - 350 + 20 + "px";
        a.style.top = getposOffset(obj, "top") - 17 - 2  + "px";
        a.style.display = "block";
        document.fotzyv.what.selectedIndex = 0;
        document.fotzyv.response.value = "";
        document.getElementById("response_firm").innerHTML = firm;
        document.getElementById("response_title").innerHTML = title;
        document.fotzyv.lid.value = id;
    }
}

function otzyv_close() {
    a = document.getElementById("otzyv");
    if (a) a.style.display = "none";
    a = document.getElementById("otzyv_submit");
    if (a) a.disabled = true;
    document.fotzyv.what.selectedIndex = 0;
}

function sndReqOtzyv(i) {
    r = Math.round((Math.random() * (10000000 - 1)));
    http.open("get", "/aj/response/" + i + "&r=" + r);
    http.onreadystatechange = handleResponseOtzyv;
    http.send(null);
}

function handleResponseOtzyv() {
    if(http.readyState == 4){
        otzyv_thanks();
    }
}

jQuery(document).ready(function($) {
    // На некоторых страницах подпись происходит до 7 раз.
    //Поэтому перед очередной подписью делаю отписку слушателей
    

	 $('div.container, ul.shop-r-box').
        off(".hltip").
        on('mouseenter.hltip','.pic-tooltip,.tooltip,.pic-tooltip2',
            function(){
                var _this = $(this);
                var disabled = _this.data('disabled') || "";
                if (disabled) {
                    return false;
                }

               var span = _this.data('tooltip') || _this.find('span')|| _this.closest('span');
                if (!_this.data('tooltip')) {
                    _this.data('tooltip', span);
                }

                // tooltip content
                var position = _this.data('position');
                if (!_this.data('image'))
                    {
                        var pic = _this.attr('hlTip');

                        var image = new Image();
                        image.src = pic;
                        image.alt = "";
                        //jQuery(image).css({'max-width':'300px','max-height':'300px'});

                        var imgLoaded = function(){
                            span.html('').append(image);
                            setPosition();
                        }

                        var ieInfo = /(msie) ([\w.]+)/.exec(navigator.userAgent) || [];
                        ieInfo[2] = ieInfo[2] || "0";
                        if( (ieInfo && ieInfo[2].substr(0,1) == 7) || (ieInfo[2].substr(0,1) == 8) ){
                            function testImg(){
                                if(image.complete != null && image.complete == true){ 
                                        imgLoaded();
                                        return;
                                }
                                setTimeout(testImg, 200);
                            }
                            setTimeout(testImg, 200);
                        }else{
                            $(image).load(imgLoaded)
                        }
                        
                        _this.data('image', image);
                    }
    
                var userDeviceArray = [ 
                    {device: 'Tablet OS', platform: /Tablet OS/},
                    {device: 'Linux', platform: /Linux/},   
                    {device: 'Windows', platform: /Windows NT/},
                    {device: 'Macintosh', platform: /Macintosh/}
                ];
                var platform = navigator.userAgent;
                function getPlatform() {
                    for (var i in userDeviceArray) {
                        if (userDeviceArray[i].platform.test(platform)) {
                            span.show();
                            setPosition();
                        return userDeviceArray[i].device;
                        }
                    }
                }

            getPlatform();            
            
            function setPosition() {

                    if (span.is(':hidden')) {
                        return false;
                    }

                    $('body').append(span);
                    var pos = _this.offset();
                    var x, y,
                        offsetX = 15, // смещение относительно курсора по оси X
                        offsetY = 15; // смещение относительно курсора по оси Y

                    x = pos.left + offsetX+_this.width();
                    y = pos.top - span.outerHeight(true);

                    if (y < $(window).scrollTop()) {
                        y = $(window).scrollTop()+10;
                    }
                    var right_border = x + span.outerWidth(true) + 50;
                    if (right_border > $('body').width()) {
                        // разворачиваем влево
                        var _x = x - span.outerWidth(true) - offsetX-_this.width();
                        if (_x > 0) {
                            x =_x;
                        }
                    } else {
                        x = x + offsetX;
                    }


                    span.css({
                        left: x,
                        top: y + offsetY,
                        position: 'absolute',
                        'z-index': 100,
                        'background': 'none repeat scroll 0 0 #FFFFFF',
                        'border': '1px dotted #C0C0C0',
                        'display':'block'
                    });
                    return true;
                }        


                }).
      on('mouseleave.hltip','.pic-tooltip,.tooltip',
            function(){
                if ($(this).data('disabled')) {
                    return false;
                }
                var span = $(this).data('tooltip');
                span.hide();                
            }
        ).
	  on('mouseenter.hltip','.pic-tooltip2,.tooltip,.pic-tooltip',
            function(){
                var _this = $(this);
                var disabled = _this.data('disabled') || "";
                if (disabled) {
                    return false;
                }        

                var pic = _this.attr('hlTip');
                var img = _this.find('img:first')
				
                /*
				if (pic)
				{
                    _this.attr('hlTip',img.attr('src'));
					img.attr('src',pic);
				}
                */
            }
        ).
		on('mouseleave.hltip','.pic-tooltip2,.tooltip,.pic-tooltip',
            function(){
			    var _this = $(this);
				
                var pic = _this.attr('hlTip');
                var img = _this.find('img:first')
				
                /*
				if (pic)
				{
                    _this.attr('hlTip',img.attr('src'));
					img.attr('src',pic);
				}  
                */
            }
        );
		





});