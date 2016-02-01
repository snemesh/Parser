admixDefine(['apsm'],function(){

    var p = admixerML.cml = {};
    var aml = admixerML;
    if (!p) {
        p = {};
        p.initCallbacks = [];
        aml.cml = p;
    }
    p.ensurePlugin = aml.ensurePlugin;

    p.renderBanners = function () {
        var seats = admixerML.seats || [];
        for (var i = seats.length - 1;i > -1; i--) {
            var s = seats[i];
            if (s.type === "banner") {
                if (s.seat) {
                    aml.clear(s.seat);
                }
                try {
                    if (s.bid && s.bid[0] && s.bid[0].adm) {
                        s.bid[0].adm = JSON.parse(s.bid[0].adm);
                    }
                    if (s.bid && s.bid[0] && s.bid[0].ext && s.bid[0].ext.Settings) {
                        s.bid[0].ext.Settings = JSON.parse(s.bid[0].ext.Settings);
                    }
                    p.fillWithEvents(s.bid[0], s.bid[0].ext.Settings);
                }catch(_event){};
                var banner_obj = p.prepareBannerObject(s);
                if (banner_obj) {
                    if (banner_obj.items && banner_obj.items[0]) {
                        banner_obj.item = banner_obj.items[0];
                    }
                    var base = parseInt(banner_obj.items && banner_obj.items[0] && banner_obj.items[0].btId || 0);
                    if (s.zoneParams) {
                        banner_obj.zoneParams = banner_obj.zoneParams || {};
                        banner_obj.zoneParams.autoSound = (s.zoneParams.battr & 128) !== 128;
                        if (s.zoneParams.PluginTrackers) {
                            for (var q = 0,qn = s.zoneParams.PluginTrackers.length; q < qn; q++) {
                                var __item = s.zoneParams.PluginTrackers[q];
                                for (var key in __item) {
                                    if (__item.hasOwnProperty(key)) {
                                        var lKey = key.toLowerCase();
                                        banner_obj.t_events[lKey] = banner_obj.t_events[lKey] || [];
                                        var val = __item[key].replace(/\[exec=(.+?)]/g,function(all,ex){
                                            return Function.call({},'return ' + ex + ';').call();
                                        });
                                        banner_obj.t_events[lKey].push({u : val});
                                    }
                                }
                            }
                        }
                        banner_obj.zoneParams.cbcf = s.zoneParams.cbcf || null;
                        banner_obj.zoneParams.vaMs = parseInt(s.zoneParams.vaMs) || null;
                        banner_obj.zoneParams.vaPerc = parseInt(s.zoneParams.vaPerc) || null;
                    }
                    banner_obj.ph = s.ph;
                    banner_obj.ph.innerHTML = "";
                    banner_obj.ph.style.position = "relative";
                    if (banner_obj.templateId === 52 || banner_obj.templateId === 53) {
                        banner_obj.ph.style.width = banner_obj.ph.style.height = '0px';
                    }
                    else if (banner_obj.templateId !== 15) {
                        banner_obj.ph.style.width = (banner_obj.width || 0) + "px";
                        banner_obj.ph.style.height = (banner_obj.height || 0) + "px";
                    }
                    if (aml.frameContainer) {
                        aml.frameContainer.style.width = (banner_obj.width || 0) + "px";
                        aml.frameContainer.style.height = (banner_obj.height || 0) + "px";
                    }
                    banner_obj.ph.style.overflow = "hidden";
                    admixerML.helpers.attach(banner_obj.ph,"mouseover",(function(_id){
                        return function(){
                            admixerML.eventsQ.onMouseEnterChanged(_id,true);
                        }
                    })(banner_obj.phId));
                    admixerML.helpers.attach(banner_obj.ph,"mouseleave",(function(_id){
                        return function(){
                            admixerML.eventsQ.onMouseEnterChanged(_id,false);
                        }
                    })(banner_obj.phId));
                    admixerML.eventsQ.registerBanner(banner_obj,banner_obj.phId);
                    if (base === 0) {
                        if (banner_obj.templateId == 58 || banner_obj.templateId == 59){
                            banner_obj.templateId = 52;
                        }
                        admixRequire(['templates/' + banner_obj.templateId],(function(tmp){
                            var tmp_obj = tmp;
                            return function(temp){
                                temp(tmp_obj);
                            }
                        })(banner_obj));
                    } else {
                        admixRequire(['baseTemplates/' + base],(function(tmp){
                            var tmp_obj = tmp;
                            return function(temp){
                                temp(tmp_obj);
                            }
                        })(banner_obj));
                    }
                    if(/_snp$/i.test(banner_obj.phId)) {
                        aml.API('adView',[],banner_obj.phId);
                    }
                }
                seats.splice(i,1);
            }
        }
    };
    p.getLocalMain = function(_bo,css){
        var result = {};
        css = css || '';
        result.mainFrame = document.createElement('iframe');
        result.mainFrame.setAttribute('style','width:' + (_bo.items[0].width || 0) + 'px;height:' + (_bo.items[0].height || 0) + 'px;' + css);
        result.mainFrame.setAttribute("frameborder","0");
        result.mainFrame.setAttribute("scrolling","no");
        result.mainFrame.setAttribute("allowtransparency",true);
        result.attr = function(name,param,_to) {
            var item;
            if (_to === 'body') {
                item = result.mainFrame.contentWindow.document.body;
            }
            else {
                item = result.mainFrame;
            }
            if (param !== 'undefined') {
                if (name === 'style') {
                    var current = item.getAttribute(name);
                    current = current.replace(/;$/,'');
                    param = current  + ';' + param;
                    if (aml.frameContainer && result.mainFrame.contentWindow.document.body !== item) {
                        var _current = aml.frameContainer.getAttribute(name);
                        _current = _current.replace(/;$/,'');
                        var _param = param;
                        _param = _current  + ';' + _param;
                        aml.frameContainer.setAttribute(name,_param);
                    }
                }
                item.setAttribute(name,param);
            }
            else {
                return item.getAttribute(name);
            }
        };
        result.appendTo = function(elem){
            elem.appendChild(result.mainFrame);
        };
        result.write = function(str){
            result.mainFrame.contentWindow.document.write('<html><head></head><body>' + str + '</body></html>');
        };
        result.close = function(){
            result.mainFrame.contentWindow.document.close();
            for (var i = result._onClose.length - 1; i > -1; i--) {
                result._onClose[i]();
                result._onClose.splice(i,1);
            }
        };
        result.append = function(elem){
            result.mainFrame.contentWindow.document.body.appendChild(elem);
        };
        result._onClose = [];
        result.onClose = function(func){
            if (typeof func === 'function') {
                result._onClose.push(func);
            }
        };
        result.byId = function(id) {
            return result.mainFrame.contentWindow.document.getElementById(id);
        };
        return result;
    };
    p.getLocalImageHtml = function(adm_baner, index, css) {
        if (css instanceof Object) {
            css = JSON.stringify(css).replace(/"/g,"").replace(/,/g,";");
        }

        var html = "";

        html += '<img src="' + adm_baner.items[index].imageUrl + '" border="0" alt="' + '" style="' + css + '"/>';

        return html;
    };
    p.createElement = function(_obj){
        var _node;
        if (_obj.name === "flash") {
            var _o = document.createElement("object");
            var _e = document.createElement("embed");
            try{
                _o.appendChild(_e);
            }catch(_event){}
            _o.setAttribute("classid","clsid:D27CDB6E-AE6D-11cf-96B8-444553540000");
            _o.setAttribute("codeBase","http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab");
            _o.id = _e.name = _obj.params.id;
            _o.style.cssText = _e.style.cssText = _obj.params.css || "";
            p.createFs(_obj.params.id);
            _o.appendChild(p.createParam("Src",_obj.params.src));
            _o.appendChild(p.createParam("AllowScriptAccess","always"));
            _e.setAttribute("src",_obj.params.src);
            _e.setAttribute("allowscriptaccess","always");
            _e.setAttribute("align","middle");
            _e.setAttribute("pluginspage","http://www.macromedia.com/go/getflashplayer");
            _e.setAttribute("type","application/x-shockwave-flash");//. = _e.type = ;

            _node = _o;

        }
        else {
            _node = document.createElement(_obj.name);
            if (_obj.params) {
                for (var key in _obj.params) {
                    if (_obj.params.hasOwnProperty(key)) {
                        if (key === "css") {
                            _node.style.cssText = _obj.params[key];
                        }
                        else {
                            _node[key] = _obj.params[key];
                        }
                    }
                }
            }
        }
        return _node;
    };
    p.createParam = function(name,value){
        var _param = document.createElement("param");
        _param.name = name;
        _param.value = value;
        return _param;
    };
    p.createFs = function(id) {
        var fName = id + "_DoFSCommand";
        window[fName] = window[fName] || Function.call({},"command","arg","admixerML.API(command,arg,'" + id + "');");
        window[fName].callback = window[fName].callback || {};
        window[fName].addCallback = window[fName].addCallback || function(name,cb){
            window[fName].callback[name] = window[fName].callback[name] || [];
            window[fName].callback[name].push(cb);
        };
        /*window[fName].addCallback("adClick",
         function(url){
         var _u = url || cUrl;
         window.open(_u,"_blank");
         }
         );
         window[fName].addCallback("adClose",
         function(){
         var ph = document.getElementById(id);
         ph.parentNode.removeChild(ph);
         }
         );
         window[fName].addCallback("kill",
         function(){
         var ph = document.getElementById(id);
         ph.parentNode.removeChild(ph);
         }
         );
         window[fName].addCallback("adCollapse",
         function(){
         var min = ph.getElementsByClassName("minFlash");
         min = min && min[0];
         if (min && min.adCollapse) {
         min.adCollapse();
         }
         }
         );
         window[fName].addCallback("adExpand",
         function(){
         var max = ph.getElementsByClassName("maxFlash");
         max = max && max[0];
         if (max && max.adExpand) {
         max.adExpand();
         }
         }
         );*/
    };
    p.intitHTMLPlayer = function(v, cPath, doc, ph, video) {

        v.PlayVideo = function (elem, video) {
            if (!video)  {
                video = this.videoTag;
            }
            if (!elem) {
                elem = this.btn_pause;
            }
            video.play();
            elem.style.display = 'none';
        };

        v.MuteVideo = function (elem, video) {
            if (!video) {
                video = this.videoTag;
            }
            if (!elem) {
                elem = this.btn_sound;
            }
            if (video.muted) {
                elem.src = cPath + "/scripts3/plugins/video/img/unmute_cr.png";
                elem.title = 'Выключить звук';
            }
            if (!video.muted) {
                elem.src = cPath + "/scripts3/plugins/video/img/mute_cr.png";
                elem.title = 'Включить звук';
            }
            video.muted = !video.muted;
        };

        v.doPlayer = function () {
            v.all_div = doc.createElement("div");
            v.all_div.style.width = video.width + 'px';
            v.all_div.style.height = video.height + 'px';
            v.all_div.style.position = 'fixed';
            //v.all_div.style.display = 'inline-block';
            v.all_div.style.left = 'calc(50% - ' + v.all_div.style.width + '/2)';
            v.all_div.style.top = 'calc(50% - ' + v.all_div.style.height + '/2)';
            v.videoTag = doc.createElement("video");
            v.videoTag.width = video.width || 728;
            v.videoTag.height = video.height || 600;
            v.videoTag.style.backgroundColor = 'Black';
            v.videoTag.style.zIndex = '0';
            v.videoTag.preload = 'metadata';
            v.videoTag.id = 'video_' + ph;
            v.videoTag.src = video.imageUrl.replace(/\.flv/i,'.mp4');
            v.videoTag.muted = video.autoSound > 0 ? false : true;
            v.videoTag.autoplay = video.autoPlay > 0 && !video.videoInPage && !video.videoTakeOver ? true : false;
            v.videoTag.onpause = function(){
                if (v.btn_pause) {
                    v.btn_pause.style.display = '';
                }
            };
            v.videoTag.oncontextmenu = function() {
                //this.click();
                return false;
            };

            v.btn_pause = doc.createElement("img");
            v.btn_pause.src = cPath + "/scripts3/plugins/video/img/Play_cr.png"; v.btn_pause.title = 'Играть сначала';
            /*v.btn_pause.onclick = function(){
             v.PlayVideo(this, v.videoTag);
             }*/
            v.btn_pause.setAttribute('onmouseover', 'this.style.width = "96px";this.style.height = "96px";');
            v.btn_pause.setAttribute('onmouseout', 'this.style.width = "92px";this.style.height = "92px";');
            v.btn_pause.style.cursor = 'pointer';
            v.btn_pause.style.backgroundColor = '#CCD0DB';
            v.btn_pause.style.zIndex = '1';
            v.btn_pause.style.width = "96px";
            v.btn_pause.style.height = "96px";
            v.btn_pause.style.borderRadius = '8px';
            v.btn_pause.style.display = video.autoPlay > 0 && !video.videoInPage ? 'none' : '';
            v.btn_pause.style.position = 'absolute';
            v.btn_pause.style.left = 'calc(50% - ' + v.btn_pause.style.width + '/2)';
            v.btn_pause.style.top = 'calc(50% - ' + v.btn_pause.style.height + '/2)';

            v.btn_sound = doc.createElement("img");

            //v.videoTag.muted = true;
            v.btn_sound.src = cPath + "/scripts/plugins/video/img/" + (v.videoTag.muted ? '' : 'un') + "mute_cr.png";
            v.btn_sound.title = v.videoTag.muted ? 'Включить звук' : 'Выключить звук';


            /*if (cr.isWithSound && bn.IsMatchSiteFormatSound) {
             v.videoTag.muted = false;
             v.videoTag.volume = 0.3;
             v.btn_sound.src = asm.mirrorPath + "/scriptlib/video/img/unmute_cr.png";
             v.btn_sound.title = 'Âûêëþ÷èòü çâóê';
             }
             else {
             v.videoTag.muted = true;
             v.btn_sound.src = asm.mirrorPath + "/scriptlib/video/img/mute_cr.png";
             v.btn_sound.title = 'Âêëþ÷èòü çâóê';
             }
             */


            /*v.btn_sound.onclick = function(){
             v.MuteVideo(this, v.videoTag);
             }  */
            v.btn_sound.setAttribute('onmouseover', 'this.style.width = "22px";this.style.height = "22px";');
            v.btn_sound.setAttribute('onmouseout', 'this.style.width = "20px";this.style.height = "20px";');
            v.btn_sound.style.cursor = 'pointer';
            v.btn_sound.style.display = 'inline';
            v.btn_sound.style.backgroundColor = '#CCD0DB';
            v.btn_sound.style.borderRadius = '2px';
            v.btn_sound.style.width = "20px";
            v.btn_sound.style.height = "20px";
            v.btn_sound.style.zIndex = '1';
            v.btn_sound.style.position = 'absolute';
            v.btn_sound.style.right = '4px';
            v.btn_sound.style.bottom = '6px';
            v.btn_sound.style.display = '';


            v.btn_close = doc.createElement("img");
            v.btn_close.src = cPath + "/scripts/plugins/video/img/close.png";
            v.btn_close.title = 'Закрыть';
            //v.btn_close.setAttribute('onclick', v + '.stopVideoAdmixer()');
            v.btn_close.style.cursor = 'pointer';
            //v.btn_close.style.display = 'none';
            v.btn_close.style.backgroundColor = '#CCD0DB';
            v.btn_close.style.borderRadius = '2px';
            v.btn_close.style.width = "20px";
            v.btn_close.style.height = "20px";
            v.btn_close.style.top = '-25px';
            v.btn_close.style.right = '5px';
            v.btn_close.style.zIndex = '1';
            v.btn_close.style.position = 'absolute';

            v.center = doc.createElement("center");
            v.center.style.cssText = 'z-index:2; position:absolute; color: Black; font-size:11px; font-family:Helvetica; cursor:pointer; background-color:#CCD0DB; width: 200px; top:5px; border-radius: 2px; padding-top: 3px; padding-bottom: 4px;';
            v.center.innerHTML = 'Перейти на сайт рекламодателя';
            v.center.style.left = 'calc(50% - ' + v.center.style.width + '/2)';
            //v.center.style.display = 'none';
            v.all_div.appendChild(v.center);

            v.all_div.appendChild(v.btn_close);
            v.all_div.appendChild(v.btn_pause);
            v.all_div.appendChild(v.btn_sound);
            v.all_div.appendChild(v.videoTag);

            return v.all_div;
            //currPh.appendChild(v.all_div);

            /*if (!isPreview) {
             v.initAdsFor(tagUrl);
             }*/
        };
    };
    p.getLocalPlayer = function(_p){
        var av = {};
        av.container = null;
        av.player = null;

        av.duration = null;
        av.complete = false;
        av.started = false;
        av.onComplete = function(){};
        av.timeupdate = function(){};
        av.prevent = admixerML.helpers.preventDefault;
        av.interval = null;
        av.canSkip = false;
        av.show = {};
        av.def = function(){
            //av.player.video.src = "";
            //av.duration = null;
            //av.trackers = {};
            //av.wasSent = {};
            av.complete = false;
            av.started = false;
            if (av.interval) {
                window.clearInterval(av.interval);
                av.interval = null;
            }
            av.canSkip = false;
            av.player.progress(0);
            //av.player.showPause();
            //av.player.showUnmute();
        };
        av.track = function(name,attr){
            if (typeof av.eventTrack === 'function') {
                av.eventTrack(name,(attr|| ''));
            }
        };
        av.init = function(params){
            av.onComplete = params.onComplete || function(){};
            av.volume = params.volume / 100 || 0.5;
            av.container = params.container;
            av.eventTrack = params.eventTrack || {};
            av.src = params.src.replace(/(\.flv)$/i,'.mp4') || '';
            av.skipTime = params.skipTime > -1 ? params.skipTime : 5;
            av.show.fullscreen = params.fullscreen === 0 ? 0 : 1;
            av.show.skip = params.skip === 1 ? 1 : 0;
            av.onClickPlay = params.onClickPlay || function(){};
            av.onClickSkip = params.onClickSkip || function(){};
            var player = av.initPlayer();
            var container = params.container;
            player.appendTo(container);
            return player;
        };
        av.initWrap = function(){
            var wrap = document.createElement("div");
            wrap.style.width = "100%";
            wrap.style.height = "100%";
            wrap.style.background = "black";
            wrap.style.position = "absolute";
            wrap.style.top = "0px";
            wrap.style.left = "0px";
            wrap.style.zIndex = 999999;
            wrap.style.display = "";
            wrap.onclick = function(){av.track('adClick')};
            wrap.onselectstart = function(){return false;};
            return wrap;
        };
        av.initVideo = function(){
            var video = document.createElement("video");
            video.src = av.src;
            video.style.width = "100%";
            video.style.height = "100%";
            video.autoplay = false;
            video.controls = false;
            video.volume = av.volume;
            video.muted = true;
            video.oncontextmenu = function(){return false;};
            video.addEventListener("loadedmetadata",function(){
                av.duration = video.duration;
            });
            av.timeupdate = function(){
                var current = video.currentTime;
                var percent = (current / av.duration) * 100;
                if (percent >= 100) {
                    av.complete = true;
                    av.track("adVastEvent",100);
                    if (av.interval) {
                        window.clearInterval(av.interval);
                        av.interval = null;
                    }
                    av.player.video.currentTime = 0;
                    av.player.progress(0);
                    av.player.pause();
                    //av.player.hide();
                    av.onComplete();
                    return false;
                }
                else if (percent >= 75) {
                    av.track("adVastEvent",75);
                }
                else if (percent >= 50) {
                    av.track("adVastEvent",50);
                }
                else if (percent >= 25) {
                    av.track("adVastEvent",25);
                } else {
                    av.track("adPlay");
                }
                av.player.progress(percent);
                var time = current > av.skipTime ? "" : parseInt(av.skipTime - current) + 1;
                av.player.skipText("skip " + time);
                if (time === "" && current > 0) {
                    av.canSkip = true;
                }
            };
            /*video.addEventListener("play",function(){
             if (!av.started) {
             av.started = true;
             av.interval = setInterval(av.timeupdate,1000 / 60);
             }
             });*/
            return video;

        };
        av.initProgress = function(){
            var back = document.createElement("div");
            back.style.position = "absolute";
            back.style.margin = "auto auto auto auto";
            back.style.bottom = "4px";
            back.style.background = "gray";
            back.style.width = "95%";
            back.style.height = "5px";
            back.style.overflow = "hidden";
            back.style.borderRadius = "50px"
            back.style.left = "2.5%";
            back.style.zIndex = 1;
            var front = document.createElement("div");
            front.style.position = "absolute";
            front.style.left = "0px";
            front.style.top = "0px";
            front.style.background = "orange";
            front.style.height = "100%";
            front.style.width = "0%";
            back.appendChild(front);
            back.progress = function(num){
                front.style.width = num + "%";
            };
            return back;
        };
        av.initSkip = function(){
            var skip = document.createElement("div");
            skip.style.position = "absolute";
            skip.style.top = "6px";
            skip.style.right = "2.5%";
            skip.style.borderRadius = "50px";
            skip.style.background = "gray";
            skip.style.cursor = "pointer";
            skip.style.paddingLeft = "5px";
            skip.style.paddingRight = "5px";
            skip.onclick = function(_event){
                av.prevent(_event);
                if(!av.canSkip) {
                    return;
                }
                else {
                    av.track("adSkip");
                    av.player.video.currentTime = 0;
                    av.player.progress(0);
                    av.player.pause();
                    //av.player.hide();
                    document.cancelFullscreen();
                    av.onComplete(true);
                }
            };
            if (av.show.skip === 0) {
                skip.style.display = 'none';
            }
            skip.onmouseenter = function(){
                aml.helpers.tooltip.show({
                    elem : skip,
                    text : 'skip video'
                });
            };
            skip.onmouseleave = function(){
                aml.helpers.tooltip.hide();
            };
            return skip;
        };
        av.initControls = function(){
            var wrap = document.createElement("div");
            wrap.style.position = "absolute";
            wrap.style.left = "2.5%";
            wrap.style.bottom = "15px";
            var play = document.createElement("div");
            play.style.background = "gray";
            play.style.width = "20px";
            play.style.height = "20px";
            play.style.borderRadius = "60px";
            play.style.cursor = "pointer";
            play.style.position = "absolute";
            play.style.bottom = "0px";
            play.style.left = "0px";
            var _pl = document.createElement("div");
            _pl.style.position = "absolute";
            _pl.style.width = "0px";
            _pl.style.height = "0px";
            _pl.style.borderTop = "5px solid transparent";
            _pl.style.borderLeft = "10px solid white";
            _pl.style.borderBottom = "5px solid transparent";
            _pl.style.left = "50%";
            _pl.style.top = "50%";
            _pl.style.marginLeft = "-4px";
            _pl.style.marginTop = "-5px";
            _pl.style.display = "";
            play.appendChild(_pl);

            var _ps = document.createElement("div");
            _ps.style.position = "absolute";
            _ps.style.width = "4px";
            _ps.style.height = "10px";
            _ps.style.left = "50%";
            _ps.style.top = "50%";
            _ps.style.marginLeft = "-5px";
            _ps.style.marginTop = "-4px";
            _ps.style.display = 'none';
            _ps.style.borderLeft = _ps.style.borderRight = "3px solid white";
            play.appendChild(_ps);
            play.onclick = function(_event){
                av.prevent(_event);
                if (av.player.video.paused) {
                    av.player.play();
                    wrap.showPause();
                    if (!av.started) {
                        av.track("adPlay");
                    }
                    else {
                        av.track("adResume");
                    }
                }
                else {
                    av.track("adPause");
                    av.player.pause();
                    wrap.showPlay();
                }
                av.onClickPlay(av.player.video.paused);
            };
            play.onmouseover = function(){
                _pl.style.borderLeft = "10px solid cyan";
                _ps.style.borderLeft = _ps.style.borderRight = "3px solid cyan";
                if (av.player.video.paused) {
                    aml.helpers.tooltip.show({
                        elem : play,
                        text : 'play'
                    });
                }
                else {
                    aml.helpers.tooltip.show({
                        elem : play,
                        text : 'pause'
                    });
                }
            };
            play.onmouseleave = function(){
                _pl.style.borderLeft = "10px solid white";
                _ps.style.borderLeft = _ps.style.borderRight = "3px solid white";
                aml.helpers.tooltip.hide();
            };
            var sound = document.createElement("div");
            sound.style.background = "gray";
            sound.style.width = "20px";
            sound.style.height = "20px";
            sound.style.borderRadius = "60px";
            sound.style.cursor = "pointer";
            sound.style.position = "absolute";
            sound.style.bottom = "0px";
            sound.style.left = "25px";
            var _olr = document.createElement("div");
            _olr.style.position = "absolute";
            _olr.style.width = "0px";
            _olr.style.height = "0px";
            _olr.style.borderTop = "7px solid transparent";
            _olr.style.borderRight = "10px solid white";
            _olr.style.borderBottom = "7px solid transparent";
            _olr.style.left = "50%";
            _olr.style.top = "50%";
            _olr.style.marginLeft = "-8px";
            _olr.style.marginTop = "-7px";
            sound.appendChild(_olr);
            var _oll = document.createElement("div");
            _oll.style.position = "absolute";
            _oll.style.width = "0px";
            _oll.style.height = "0px";
            _oll.style.left = "50%";
            _oll.style.top = "50%";
            _oll.style.marginLeft = "-8px";
            _oll.style.marginTop = "-3px";
            _oll.style.border = "3px solid white";
            sound.appendChild(_oll);
            var _f1 = document.createElement("div");
            _f1.style.position = "absolute";
            _f1.style.width = "6px";
            _f1.style.height = "6px";
            _f1.style.left = "50%";
            _f1.style.top = "50%";
            _f1.style.marginLeft = "-3px";
            _f1.style.marginTop = "-3px";
            _f1.style.borderRight = "2px solid white";
            _f1.style.borderRadius = "60px";
            _f1.style.display = "none";
            sound.appendChild(_f1);
            var _f2 = document.createElement("div");
            _f2.style.position = "absolute";
            _f2.style.width = "10px";
            _f2.style.height = "10px";
            _f2.style.left = "50%";
            _f2.style.top = "50%";
            _f2.style.marginLeft = "-4px";
            _f2.style.marginTop = "-5px";
            _f2.style.borderRight = "2px solid white";
            _f2.style.borderRadius = "60px";
            _f2.style.display = "none";
            sound.appendChild(_f2);
            sound.onclick = function(_event){
                av.prevent(_event);
                if (av.player.video.muted) {
                    av.track("adSoundOn");
                    av.player.unmute();
                    wrap.showMute();
                }
                else {
                    av.track("adSoundOff");
                    av.player.mute();
                    wrap.showUnmute();
                }
            };
            sound.onmouseover = function(){
                _olr.style.borderRight = "10px solid cyan";
                _oll.style.border = "3px solid cyan";
                _f1.style.borderRight = "2px solid cyan";
                _f2.style.borderRight = "2px solid cyan";
                if (av.player.video.muted) {
                    aml.helpers.tooltip.show({
                        elem : sound,
                        text : 'sound On'
                    });
                }
                else {
                    aml.helpers.tooltip.show({
                        elem : sound,
                        text : 'sound Off'
                    });
                }
            };
            sound.onmouseleave = function(){
                _olr.style.borderRight = "10px solid white";
                _oll.style.border = "3px solid white";
                _f1.style.borderRight = "2px solid white";
                _f2.style.borderRight = "2px solid white";
                aml.helpers.tooltip.hide();
            };
            var full = document.createElement("div");
            full.style.background = "gray";
            full.style.width = "20px";
            full.style.height = "20px";
            full.style.borderRadius = "60px";
            full.style.cursor = "pointer";
            full.style.position = "absolute";
            full.style.bottom = "0px";
            full.style.left = "50px";
            full.style.overflow = "hidden";
            var _q1 = document.createElement("div");
            _q1.style.position = "absolute";
            _q1.style.width = "16px";
            _q1.style.height = "0px";
            _q1.style.borderTop = "1px solid white";
            _q1.style.left = "50%";
            _q1.style.top = "50%";
            _q1.style.marginLeft = "-8px";
            _q1.style.zIndex = 1;
            full.appendChild(_q1);
            var _q2 = document.createElement("div");
            _q2.style.position = "absolute";
            _q2.style.width = "0px";
            _q2.style.height = "16px";
            _q2.style.borderLeft = "1px solid white";
            _q2.style.left = "50%";
            _q2.style.top = "50%";
            _q2.style.marginTop = "-8px";
            _q2.style.zIndex = 1;
            full.appendChild(_q2);
            var _q3 = document.createElement("div");
            _q3.style.position = "absolute";
            _q3.style.width = "12px";
            _q3.style.height = "12px";
            _q3.style.border = "1px solid white";
            _q3.style.left = "50%";
            _q3.style.top = "50%";
            _q3.style.marginLeft = "-7px";
            _q3.style.marginTop = "-7px";
            _q3.style.msTransform = _q3.style.mozTransform = _q3.style.oTransform = _q3.style.webkitTransform = "rotate(45deg)";
            full.appendChild(_q3);
            var _q4 = document.createElement("div");
            _q4.style.position = "absolute";
            _q4.style.width = "20px";
            _q4.style.height = "5px";
            _q4.style.background = "gray";
            _q4.style.left = "50%";
            _q4.style.top = "50%";
            _q4.style.marginLeft = "-10px";
            _q4.style.marginTop = "-3px";
            _q4.style.msTransform = _q4.style.mozTransform = _q4.style.oTransform = _q4.style.webkitTransform = "rotate(45deg)";
            full.appendChild(_q4);
            var _q5 = document.createElement("div");
            _q5.style.position = "absolute";
            _q5.style.width = "20px";
            _q5.style.height = "5px";
            _q5.style.background = "gray";
            _q5.style.left = "50%";
            _q5.style.top = "50%";
            _q5.style.marginLeft = "-10px";
            _q5.style.marginTop = "-3px";
            _q5.style.msTransform = _q5.style.mozTransform = _q5.style.oTransform = _q5.style.webkitTransform = "rotate(-45deg)";
            full.appendChild(_q5);
            full.style.msTransform = full.style.mozTransform = full.style.oTransform = full.style.webkitTransform = "rotate(45deg)";
            full.onclick = function(_event){
                av.prevent(_event);
                if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.mozFullScreenElement && !document.msFullscreenElement) {
                    av.track("adFullscreenOn");
                    av.player.wrap.fullscreen();
                    _q1.style.borderTop = "1px solid white";
                    _q2.style.borderLeft = "1px solid white";
                    _q3.style.border = "1px solid white";
                }
                else {
                    av.track('adFullscreenOff');
                    document.cancelFullscreen();
                    _q1.style.borderTop = "1px solid white";
                    _q2.style.borderLeft = "1px solid white";
                    _q3.style.border = "1px solid white";
                }
            };
            full.onmouseover = function(){
                _q1.style.borderTop = "1px solid cyan";
                _q2.style.borderLeft = "1px solid cyan";
                _q3.style.border = "1px solid cyan";
            };
            full.onmouseleave = function(){
                _q1.style.borderTop = "1px solid white";
                _q2.style.borderLeft = "1px solid white";
                _q3.style.border = "1px solid white";
            };
            wrap.appendChild(play);
            wrap.appendChild(sound);
            wrap.appendChild(full);
            wrap.showPause = function(){
                _pl.style.display = "none";
                _ps.style.display = "";
            };
            wrap.showPlay = function(){
                _pl.style.display = "";
                _ps.style.display = "none";
            };
            wrap.showMute = function(){
                _f1.style.display = "";
                _f2.style.display = "";
            };
            wrap.showUnmute = function(){
                _f1.style.display = "none";
                _f2.style.display = "none";
            };
            wrap.hideFullscreen = function(){
                full.style.display = "none";
            };
            wrap.showFullscreen = function(){
                full.style.display = "";
            };
            return wrap;
        };
        av.initRepeat = function(){
            var wrap = document.createElement('div');
            var _pl;
            wrap.style.position = 'absolute';
            wrap.style.left = '50%';
            wrap.style.top = '50%';
            wrap.style.marginLeft = '-40px';
            wrap.style.marginTop = '-40px';
            wrap.style.background = 'rgba(255,255,255,0.5)';
            wrap.style.border = '2px solid rgba(0,0,0,0.2)';
            wrap.style.webkitBorderRadius = '100%';
            wrap.style.mozBorderRadius = '100%';
            wrap.style.msBorderRadius = '100%';
            wrap.style.oBorderRadius = '100%';
            wrap.style.borderRadius = '100%';
            wrap.style.width = '80px';
            wrap.style.height = '80px';
            wrap.style.textAlign = 'center';
            wrap.style.webkitBoxShadow = '0px 0px 5px 8px rgba(0, 0, 0, 0.5)';
            wrap.style.mozBoxShadow = '0px 0px 10px 8px rgba(0, 0, 0, 0.5)';
            wrap.style.msBoxShadow = '0px 0px 10px 8px rgba(0, 0, 0, 0.5)';
            wrap.style.oBoxShadow = '0px 0px 10px 8px rgba(0, 0, 0, 0.5)';
            wrap.style.boxShadow = '0px 0px 10px 8px rgba(0, 0, 0, 0.5)';
            wrap.style.cursor = 'pointer';
            wrap.onmouseenter = function(){
                wrap.style.borderColor = 'transparent';
                wrap.style.webkitBoxShadow = '0px 0px 10px 8px rgba(0, 0, 0, 0.3)';
                wrap.style.mozBoxShadow = '0px 0px 10px 8px rgba(0, 0, 0, 0.3)';
                wrap.style.msBoxShadow = '0px 0px 10px 8px rgba(0, 0, 0, 0.3)';
                wrap.style.oBoxShadow = '0px 0px 10px 8px rgba(0, 0, 0, 0.3)';
                wrap.style.boxShadow = '0px 0px 10px 8px rgba(0, 0, 0, 0.3)';
                wrap.style.background = 'rgba(255,255,255,0.7)';
                _pl.borderLeft = '20px solid rgba(0,0,0,0.5)';
                aml.helpers.tooltip.show({
                    elem : wrap,
                    text : 'play again'
                });
            };
            wrap.onmouseleave = function() {
                wrap.style.borderColor = 'rgba(0,0,0,0.2)';
                wrap.style.webkitBoxShadow = '0px 0px 10px 8px rgba(0, 0, 0, 0.5)';
                wrap.style.mozBoxShadow = '0px 0px 10px 8px rgba(0, 0, 0, 0.5)';
                wrap.style.msBoxShadow = '0px 0px 10px 8px rgba(0, 0, 0, 0.5)';
                wrap.style.oBoxShadow = '0px 0px 10px 8px rgba(0, 0, 0, 0.5)';
                wrap.style.boxShadow = '0px 0px 10px 8px rgba(0, 0, 0, 0.5)';
                wrap.style.background = 'rgba(255,255,255,0.5)';
                _pl.styleborderLeft = '20px solid rgba(0,0,0,0.8)';
                aml.helpers.tooltip.hide();
            };
            wrap.onclick = function(_event) {
                av.prevent(_event);
                //av.player.play();
                av.player.controls.children[0].click();
            };
            _pl = document.createElement('div');
            _pl.style.position = 'relative';
            _pl.style.top = '50%';
            _pl.style.left = '50%';
            _pl.style.marginTop = '-20px';
            _pl.style.marginLeft = '-5px';
            _pl.style.width = '0';
            _pl.style.height = '0';
            _pl.style.borderTop = '20px solid transparent';
            _pl.style.borderBottom = '20px solid transparent';
            _pl.style.borderLeft = '20px solid rgba(0,0,0,0.8)';
            wrap.style.display = 'none';
            wrap.appendChild(_pl);
            return wrap;
        };
        av.initPlayer = function(){
            if (av.player) {
                return;
            }
            var player = av.player = {};
            player.wrap = av.initWrap();
            player.video = av.initVideo();
            player.prog = av.initProgress();
            player.ski = av.initSkip();
            player.controls = av.initControls();
            player.repeat = av.initRepeat();
            player.appendTo = function(elem){
                elem.appendChild(player.wrap);
                return player;
            };
            player.hideBackground = function(){
                player.wrap.style.background = 'transparent';
            };
            player.showBackground = function(){
                player.wrap.style.background = 'black';
            };
            player.hideRepeat = function(){
                player.repeat.style.display = 'none';
            };
            player.showRepeat = function(){
                player.repeat.style.display = '';
            };
            player.hideVideo = function(){
                player.video.style.display = 'none';
                player.pause();
            };
            player.showVideo = function(){
                player.video.style.display = '';
            };
            player.hideProgress = function(){
                player.prog.style.display = 'none';
            };
            player.showProgress = function(){
                player.prog.style.display = '';
            };
            player.src = function(src){
                player.video.src = src;
                return player;
            };
            player.show = function(){
                player.wrap.style.display = "";
                return player;
            };
            player.hide = function(){
                player.wrap.style.display = "none";
                av.def();
                return player;
            };
            player.skipText = function(txt){
                player.ski.textContent = txt;
            };
            player.showControls = function(){
                player.controls.style.display = '';
            };
            player.hideControls = function(){
                player.controls.style.display = 'none';
            };
            player.play = function(){
                player.video.play();
                player.showPause();
                if (!av.interval) {
                    av.interval = setInterval(av.timeupdate,1000 / 60);
                }
                if (av.show.skip === 1) {
                    player.showSkip();
                }
                player.showControls();
                player.hideRepeat();
                player.showProgress();
                player.showVideo();
                player.showBackground();
                return player;
            };
            player.pause = function(){
                player.video.pause();
                player.showPlay();
                if (av.interval) {
                    clearInterval(av.interval);
                    av.interval = null;
                }
                return player;
            };
            player.progress = player.prog.progress;
            player.showPause = player.controls.showPause;
            player.showPlay = player.controls.showPlay;
            player.showMute = player.controls.showMute;
            player.showUnmute = player.controls.showUnmute;
            player.showSkip = function(){
                player.ski.style.display = '';
            };
            player.hideSkip = function(){
                player.ski.style.display = 'none';
            };
            player.mute = function(){
                player.video.muted = true;
                player.showUnmute();
            };
            player.unmute = function(){
                player.video.muted = false;
                player.showMute();
            };
            player.setTime = function(time){
                player.video.currentTime = time;
            };
            player.wrap.fullscreen = player.wrap.requestFullscreen || player.wrap.webkitRequestFullscreen || player.wrap.mozRequestFullScreen || player.wrap.msRequestFullscreen;
            if (!player.wrap.fullscreen || av.show.fullscreen === 0) {
                player.controls.hideFullscreen();
            }
            document.cancelFullscreen = document.cancelFullscreen || document.webkitCancelFullScreen || document.mozCancelFullScreen || document.msExitFullscreen || document.msCancelFullscreen;
            player.wrap.appendChild(player.video);
            player.wrap.appendChild(player.prog);
            player.wrap.appendChild(player.ski);
            player.wrap.appendChild(player.controls);
            player.wrap.appendChild(player.repeat);
            return player;
        };
        return av.init(_p);
    };
    p.getLocalFlashHtmlBase = function(adm_baner, index,css2,css) {
        /*if (clickTagName == undefined || clickTagName == "" || clickTagName == "undefined" ) {
         clickTagName = 'clickTag';
         }*/
        css = css || "";
        css2 = css2 || '';
        var ph = adm_baner.ph;
        var id = adm_baner.phId;
        var exClass = adm_baner.items[index] && adm_baner.items[index].cls || "";
        var fName = id + "_DoFSCommand";
        var cUrl = adm_baner.clickUrl;
        window[fName] = window[id + index + "_DoFSCommand"] = window[fName] || Function.call({},"command","arg","admixerML.API(command,arg,'" + adm_baner.phId + "');");
        window[fName].callback = window[fName].callback || {};
        window[fName].addCallback = window[fName].addCallback || function(name,cb){
            window[fName].callback[name] = window[fName].callback[name] || [];
            window[fName].callback[name].push(cb);
        };
        if (!window[fName].callback["adClick"]) {
            window[fName].addCallback("adClick",
                function(url){
                    var _u = url || cUrl;
                    window.open(_u,"_blank");
                }
            );
            window[fName].addCallback("adClose",
                function(){
                    ph.parentNode.removeChild(ph);
                }
            );
            window[fName].addCallback("kill",
                function(){
                    ph.parentNode.removeChild(ph);
                }
            );
        }
        if (index === -1) {
            return false;
        }
        var width = /%/.test(adm_baner.items[index].width) ? adm_baner.items[index].width : adm_baner.items[index].width + 'px';
        var height = /%/.test(adm_baner.items[index].height) ? adm_baner.items[index].height : adm_baner.items[index].height + 'px';
        var clickTagName = "someClick";
        var html = "";
        if (/http:\/\//i.test(adm_baner.cTag)){
            adm_baner.cTag = admixerML.helpers.encodeUrl(adm_baner.cTag);
        }
        var ctg_ = "clickTag=" + adm_baner.cTag + "&clicktag=" + adm_baner.cTag + "&link1=" + adm_baner.cTag + "&clickTAG=" + adm_baner.cTag;
        var type = 'application/x-shockwave-flash';
        var rendImg = "";
        var _img = "";
        if ( (!p.isFlashSupport() && adm_baner.items[3].frm === 'img') || adm_baner.items[index].frm === 'img') {
            var preIdx = index;
            if (adm_baner.items[index].frm !== 'img') {
                index = 3;
            }
            html += '<div onclick="';
            if (preIdx == 0) {
                if (adm_baner.items[1].width && adm_baner.items[1].height && adm_baner.items[1].frm) {
                    html += 'window.parent[\'' + fName + '\'](\'adExpand\');';
                } else if (adm_baner.items[2].width && adm_baner.items[2].height && adm_baner.items[2].frm) {
                    html += 'window.parent[\'' + fName + '\'](\'adFullscreen\');';
                } else {
                    html += 'window.parent[\'' + fName + '\'](\'adClick\');';
                }
            } else if (preIdx == 1) {
                if (adm_baner.items[2].width && adm_baner.items[2].height && adm_baner.items[2].frm) {
                    html += 'window.parent[\'' + fName + '\'](\'adFullscreen\');';
                } else if (adm_baner.items[0].width && adm_baner.items[0].height && adm_baner.items[0].frm) {
                    html += 'window.parent[\'' + fName + '\'](\'adCollapse\');window.parent[\'' + fName + '\'](\'adClick\');';
                } else {
                    html += 'window.parent[\'' + fName + '\'](\'adClick\');';
                }
            } else if (preIdx == 2) {
                html += 'window.parent[\'' + fName + '\'](\'adCollapse\');window.parent[\'' + fName + '\'](\'adClick\');';
            }
            html += '" style="position:absolute; left:0px; top:0px; width:' + width + '; height:' + height + '; ' + css2 + '">';
            html += '<img src="' + adm_baner.items[index].imageUrl + '" style="width:100%; height:100%;' + css + '"/>';
            html += '</div>';
            /*if (index === 0 && adm_baner.items[index].frm !== 'img') {
             type = "image/" + adm_baner.items[adm_baner.items.length - 1].imageUrl.match(/(jpg|jpeg|png|gif)$/)[1];
             index = adm_baner.items.length - 1;
             rendImg = 'onclick="window.top["' + fName + '"](\'adClick\');"';
             window[fName].addCallback("adExpandAuto",
             function(){
             setTimeout(function(){window[fName]('adCollapse');},500);
             }
             );
             }
             else if (adm_baner.items[index].frm !== 'img'){
             type = "image/" + adm_baner.items[adm_baner.items.length - 1].imageUrl.match(/(jpg|jpeg|png|gif)$/)[1];
             index = adm_baner.items.length - 1;
             rendImg = 'onclick="window.top["' + fName + '"](\'adCollapse\');window.top["' + fName + '"](\'adClick\');"';;
             }
             html += '<div style="position:absolute;left:0px;top:0px;';
             if (width) {
             html += ' width:' + width + ';';
             }
             if (height) {
             html += ' height:' + height + ';';
             }
             html += css2 + '"><img id="' + (id + preIdx) + '" src="' + adm_baner.items[index].imageUrl.replace(/https?:/,admixerML.protocol) + '" style="position:absolute;left:0px;top:0px;width:100%;height:100%;';
             if (css) {
             html += css;
             }
             html += '" ' + rendImg + ' /></div>';*/
            return html;
        }
        else {
            //var html = '<div class="flash" style="display: block; position: relative; z-index: 1; height:' + adm_baner.items[index].height + 'px; width:' + adm_baner.items[index].width + 'px;' + css + '">';
            //html += '<a>';
            html += '<script type="text/vbscript">Function ' + id + index + '_FSCommand(ByVal command, ByVal args)Call ' + id + index + '_DoFSCommand(command, args)End Function</script>';
            html += '<script type="text/javascript">window["' + id + index + '_DoFSCommand"]=function(command,arg){window.parent["' + id + '_DoFSCommand"](command,arg)}</script>';
            html += '<script type="text/javascript">';
            for (var key in admixerML.trackList) {
                if (admixerML.trackList.hasOwnProperty(key)) {
                    html += 'window["' + key + '"] = function(arg){window["' + id + index + '_DoFSCommand"]("' + key + '",arg)};\n';
                }
            }
            html += '</script>';
            html += '<div style="position:absolute;left:0px;top:0px;';
            if (width) {
                html += ' width:' + width + ';';
            }
            if (height) {
                html += ' height:' + height + ';';
            }
            html += css2 + '">';
            html += '<OBJECT classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" ';
            html += 'type="' + type + '" ' + rendImg + ' data="' + adm_baner.items[index].imageUrl.replace(/https?:/,admixerML.protocol) + '?' + clickTagName + '=' + adm_baner.cTag + '&' + ctg_ + '"';
            html += ' codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0" id="' + id + index + '" style="position:absolute;left:0px;top:0px;width:100%;height:100%;' + css + '" ';
            //if (adm_baner.items[index].width) {
            html += ' WIDTH="100%"';
            //}
            //if (adm_baner.items[index].height) {
            html += ' HEIGHT="100%" ';
            //}
            html += '>';
            html += '<param name="movie" value="' + adm_baner.items[index].imageUrl.replace(/https?:/,admixerML.protocol) + '?' + clickTagName + '=' + adm_baner.cTag + '&' + ctg_ + + '" />';
            html += '<param name="quality" value="high" />';
            html += '<param name="bgcolor" value="#ffffff" />';
            html += '<param name="play" value="true" />';
            html += '<param name="loop" value="true" />';
            html += '<param name="scale" value="noscale" />';
            html += '<param name="menu" value="true" />';
            html += '<PARAM NAME="Src" VALUE="' + adm_baner.items[index].imageUrl.replace(/https?:/,admixerML.protocol) + '?' + clickTagName + '=' + adm_baner.cTag + '&' + ctg_ + '" />';
            html += '<PARAM NAME=wmode VALUE="transparent" />';
            html += '<PARAM NAME="AllowScriptAccess" VALUE="always" />';
            html += '<param name="devicefont" value="false" />';
            html += '<EMBED allowScriptAccess="always" wmode="transparent" class="' + exClass + '" NAME="' + id + index + '" style="position:absolute;left:0px;top:0px;width:100%;height:100%;' + css +'" ';
            html += 'src="' + adm_baner.items[index].imageUrl.replace(/https?:/,admixerML.protocol);
            html += '?' + clickTagName + '=' + adm_baner.cTag + '&' + ctg_;
            html += '"';
            //if (adm_baner.items[index].width) {
            html += ' width="100%"';
            //}
            //if (adm_baner.items[index].height) {
            html += ' height="100%"';
            //}
            html += ' type="' + type + '" PLUGINSPAGE="http://www.macromedia.com/shockwave/download/index.cgi?P1_Prod_Version=ShockwaveFlash">';
            html += '</EMBED>';
            html += '</OBJECT>';
            html += '</div>';

            return html;
        }
    };
    p.getLocalFlashHtml = function(adm_baner, index,css2,css) {
        /*if (clickTagName == undefined || clickTagName == "" || clickTagName == "undefined" ) {
         clickTagName = 'clickTag';
         }*/
        css = css || "";
        css2 = css2 || '';
        var ph = adm_baner.ph;
        var id = adm_baner.phId;
        var exClass = adm_baner.items[index] && adm_baner.items[index].cls || "";
        var fName = id + "_DoFSCommand";
        var cUrl = adm_baner.clickUrl;
        /*adm_baner.items[index].imageUrl = adm_baner.items[index].imageUrl.replace(/https:/,'http:');
         admixerML.protocol = 'http:';*/
        /*var _script = document.createElement("script");
         _script.setAttribute("type","text/vbscript");
         _script.setAttribute("src",location.protocol + "//inv-nets.admixer.net/vb.aspx?id=" + id + "&rnd=" + Math.random());
         document.body.appendChild(_script);*/
        window[fName] = window[id + index + "_DoFSCommand"] = window[fName] || Function.call({},"command","arg","admixerML.API(command,arg,'" + adm_baner.phId + "');");
        window[fName].callback = window[fName].callback || {};
        window[fName].addCallback = window[fName].addCallback || function(name,cb){
            window[fName].callback[name] = window[fName].callback[name] || [];
            window[fName].callback[name].push(cb);
        };
        if (!window[fName].callback["adClick"]) {
            window[fName].addCallback("adClick",
                function(url){
                    var _u = url || cUrl;
                    window.open(_u,"_blank");
                }
            );
            window[fName].addCallback("adClose",
                function(){
                    ph.parentNode.removeChild(ph);
                }
            );
            window[fName].addCallback("kill",
                function(){
                    ph.parentNode.removeChild(ph);
                }
            );
            /*window[fName].addCallback("adCollapse",
             function(){
             var min = admixerML.htlpers.getEleph.getElementsByClassName("minFlash");
             min = min && min[0];
             if (min && min.adCollapse) {
             min.adCollapse();
             }
             }
             );
             window[fName].addCallback("adExpand",
             function(){
             var max = ph.getElementsByClassName("maxFlash");
             max = max && max[0];
             if (max && max.adExpand) {
             max.adExpand();
             }
             }
             );*/
        }
        if (index === -1) {
            return false;
        }
        var width = /%/.test(adm_baner.items[index].width) ? adm_baner.items[index].width : adm_baner.items[index].width + 'px';
        var height = /%/.test(adm_baner.items[index].height) ? adm_baner.items[index].height : adm_baner.items[index].height + 'px';
        var clickTagName = "someClick";
        var html = "";
        if (/http:\/\//i.test(adm_baner.cTag)){
            adm_baner.cTag = admixerML.helpers.encodeUrl(adm_baner.cTag);
        }
        var ctg_ = "clickTag=" + adm_baner.cTag + "&clicktag=" + adm_baner.cTag + "&link1=" + adm_baner.cTag + "&clickTAG=" + adm_baner.cTag;
        var type = 'application/x-shockwave-flash';
        var rendImg = "";
        var _img = "";
        if ( (!p.isFlashSupport() && adm_baner.items[adm_baner.items.length - 1].frm === 'img') || adm_baner.items[index].frm === 'img') {
            var preIdx = index;
            if (index === 0 && adm_baner.items[index].frm !== 'img') {
                type = "image/" + adm_baner.items[adm_baner.items.length - 1].imageUrl.match(/(jpg|jpeg|png|gif)$/)[1];
                index = adm_baner.items.length - 1;
                rendImg = 'onclick="window.parent[\'' + fName + '\'](\'adClick\');"';
                window[fName].addCallback("adExpandAuto",
                    function(){
                        setTimeout(function(){window[fName]('adCollapse');},500);
                    }
                );
            }
            else if (adm_baner.items[index].frm !== 'img'){
                type = "image/" + adm_baner.items[adm_baner.items.length - 1].imageUrl.match(/(jpg|jpeg|png|gif)$/)[1];
                index = adm_baner.items.length - 1;
                rendImg = 'onclick="window.parent[\'' + fName + '\'](\'adCollapse\');window.parent[\'' + fName + '\'](\'adClick\');"';
            }
            html += '<div style="position:absolute;left:0px;top:0px;';
            if (width) {
                html += ' width:' + width + ';';
            }
            if (height) {
                html += ' height:' + height + ';';
            }
            html += css2 + '"><img id="' + (id + preIdx) + '" src="' + adm_baner.items[index].imageUrl.replace(/https?:/,admixerML.protocol) + '" style="position:absolute;left:0px;top:0px;width:100%;height:100%; ';
            if (css) {
                html += css;
            }
            html += '" onclick="window.parent[\'' + fName + '\'](\'adCollapse\');window.parent[\'' + fName + '\'](\'adClick\');"' + rendImg + ' /></div>';
            return html;
        }
        else {
            //var html = '<div class="flash" style="display: block; position: relative; z-index: 1; height:' + adm_baner.items[index].height + 'px; width:' + adm_baner.items[index].width + 'px;' + css + '">';
            //html += '<a>';
            html += '<script type="text/vbscript">Function ' + id + index + '_FSCommand(ByVal command, ByVal args)Call ' + id + index + '_DoFSCommand(command, args)End Function</script>';
            html += '<script type="text/javascript">window["' + id + index + '_DoFSCommand"]=function(command,arg){window.parent["' + id + '_DoFSCommand"](command,arg)}</script>';
            html += '<script type="text/javascript">';
            for (var key in admixerML.trackList) {
                if (admixerML.trackList.hasOwnProperty(key)) {
                    html += 'window["' + key + '"] = function(arg){window["' + id + index + '_DoFSCommand"]("' + key + '",arg)};\n';
                }
            }
            html += '</script>';
            html += '<div style="position:absolute;left:0px;top:0px;';
            if (width) {
                html += ' width:' + width + ';';
            }
            if (height) {
                html += ' height:' + height + ';';
            }
            html += css2 + '">';
            html += '<OBJECT classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" ';
            html += 'type="' + type + '" ' + rendImg + ' data="' + adm_baner.items[index].imageUrl.replace(/https?:/,admixerML.protocol) + '?' + clickTagName + '=' + adm_baner.cTag + '&' + ctg_ + '"';
            html += ' codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0" id="' + id + index + '" style="position:absolute;left:0px;top:0px;width:100%;height:100%;' + css + '" ';
            //if (adm_baner.items[index].width) {
            html += ' WIDTH="100%"';
            //}
            //if (adm_baner.items[index].height) {
            html += ' HEIGHT="100%" ';
            //}
            html += '>';
            html += '<param name="movie" value="' + adm_baner.items[index].imageUrl.replace(/https?:/,admixerML.protocol) + '?' + clickTagName + '=' + adm_baner.cTag + '&' + ctg_ + + '" />';
            html += '<param name="quality" value="high" />';
            html += '<param name="bgcolor" value="#ffffff" />';
            html += '<param name="play" value="true" />';
            html += '<param name="loop" value="true" />';
            html += '<param name="scale" value="noscale" />';
            html += '<param name="menu" value="true" />';
            html += '<PARAM NAME="Src" VALUE="' + adm_baner.items[index].imageUrl.replace(/https?:/,admixerML.protocol) + '?' + clickTagName + '=' + adm_baner.cTag + '&' + ctg_ + '" />';
            html += '<PARAM NAME=wmode VALUE="transparent" />';
            html += '<PARAM NAME="AllowScriptAccess" VALUE="always" />';
            html += '<param name="devicefont" value="false" />';
            html += '<EMBED allowScriptAccess="always" wmode="transparent" class="' + exClass + '" NAME="' + id + index + '" style="position:absolute;left:0px;top:0px;width:100%;height:100%;' + css +'" ';
            html += 'src="' + adm_baner.items[index].imageUrl.replace(/https?:/,admixerML.protocol);
            html += '?' + clickTagName + '=' + adm_baner.cTag + '&' + ctg_;
            html += '"';
            //if (adm_baner.items[index].width) {
            html += ' width="100%"';
            //}
            //if (adm_baner.items[index].height) {
            html += ' height="100%"';
            //}
            html += ' type="' + type + '" PLUGINSPAGE="http://www.macromedia.com/shockwave/download/index.cgi?P1_Prod_Version=ShockwaveFlash">';
            html += '</EMBED>';
            html += '</OBJECT>';
            html += '</div>';

            return html;
        }
    };
    p.isFlashSupport = function() {
        var hasFlash = false;
        try {
            hasFlash = Boolean(new ActiveXObject('ShockwaveFlash.ShockwaveFlash'));
        } catch (exception) {
            hasFlash = (navigator.mimeTypes && navigator.mimeTypes['application/x-shockwave-flash'] && navigator.mimeTypes['application/x-shockwave-flash'].enabledPlugin);
        }
        return hasFlash;
    };
    try {
        p.skypeApi = window["$WLXRmAd"] || window.parent["$WLXRmAd"] || window.parent.parent["$WLXRmAd"];
    }
    catch(_error){};
    p.animate = function(params){
        if (params) {
            if (p.animate.timeoutId) {
                clearTimeout(p.animate.timeoutId);
                p.animate.timeoutId = null;
            }
            var elems = params.elems;
            delete params.elems;
            if (!(elems instanceof Array)) {
                elems = [elems];
            }
            for (var i = 0, ln = elems.length; i < ln; i++) {
                var index = p.animate.elems.indexOf(elems[i]);
                index = index > -1 ? index : (p.animate.elems.push(elems[i]) - 1);
                var  newObj = p.animate.createAnimationObject(params,elems[i]);
                p.animate.params[index] = newObj;
            }
            if (!p.animate.timeoutId) {
                p.animate.timeoutId = setTimeout(p.animate,1000 / 24);
            }
        }
        else {
            var els = p.animate.elems;
            var curTime = (new Date()).getTime();
            for (var i = els.length - 1; i > -1; i--) {
                var params = p.animate.params[i];
                var el = els[i];
                var percent = (curTime - params.start) / params.time;
                if (percent > 1) percent = 1;
                for (var key in params.to) {
                    if (params.to.hasOwnProperty(key)) {
                        var diff = (params.to[key] - params.from[key]) * percent;
                        el.style[key] = p.animate.toStyle(key, params.from[key] + diff);
                    }
                }
                if (percent === 1) {
                    p.animate.elems.splice(i,1);
                    if (typeof p.animate.params[i].callback == "function") {
                        p.animate.params[i].callback();
                    }
                    delete p.animate.params[i];
                }
            }
            if (p.animate.elems.length > 0) {
                p.animate.timeoutId = setTimeout(p.animate,1000 / 60);
            }
            else {
                p.animate.timeoutId = null;
            }
        }
    };
    p.animate.toStyle = function(key,val) {
        switch (key){
            case "left":
            case "right":
            case "top":
            case "bottom":
            case "width":
            case "height":
                return val + "px";
            default:
                return val;
        }
    };
    p.animate.nextStep = function(params){

    };
    p.animate.elems = [];
    p.animate.params = {};
    p.animate.timeoutId = null;
    window.getComputedStyle = window.getComputedStyle ? getComputedStyle :
        function(el) {
            return el.currentStyle || el.runtimeStyle || el.style;
        };
    p.animate.createAnimationObject = function (obj,el) {
        if (null == obj || "object" != typeof obj) return obj;
        var copy = obj.constructor();
        copy.from = {};
        copy.to = {};
        copy.start = (new Date()).getTime();
        var style = getComputedStyle(el);
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)){
                if (/^(time|callback)$/.test(attr)) {
                    copy[attr] = obj[attr];
                }
                else {
                    copy.to[attr] = obj[attr];
                    copy.from[attr] = parseFloat(style[attr]) || 0;
                }
            }
        }
        copy.time = copy.time || 0;
        return copy;
    };
    p.resizeInit = function(params){
        params.offsetLeft = params.offsetLeft || 0;
        params.offsetRight = params.offsetRight || 0;
        params.offsetTop = params.offsetTop || 0;
        params.offsetBottom = params.offsetBottom || 0;
        params.overlay = params.overlay || false;
        params.time = params.time || 0;
        if (this !== window && !params.ph) {
            params.ph = this;
        }
        if (!params.ph) {
            return {expand:function(){},collapse:function(){}}
        }
        if (params.ph.postMessage instanceof Function) {
            var frames = document.getElementsByTagName('iframe');
            for (var i = 0, ln = frames.length; i < ln; i++) {
                if (frames[i].contentWindow === params.ph) {
                    params.ph = frames[i].parentNode;
                    break;
                };
            }
        }
        if (p.skypeApi) {
            p.skypeApi.init({
                width : params.width,
                height: params.height,
                offsetLeft: params.offsetLeft,
                offsetTop: params.offsetTop,
                offsetRight: params.offsetRight,
                offsetBottom: params.offsetBottom
            });
            try {
                window.frameElement.style.width = window.frameElement.style.height = '100%';
            } catch (_error) {}
        }
        /*if (p.skypeApi) {
         params.ph.style.position = 'fixed';
         params.ph.style.left = '';
         params.ph.style.right = '0px';
         var item = params.ph.getElementsByTagName('iframe')[0] || params.ph.getElementsByTagName('div')[0];
         item.style.position = 'absolute';
         item.style.left = '';
         item.style.right = '0px';
         }*/
        try {
            if (window.parent !== window && window.parent.document && window.parent.document.getElementsByTagName) {
                var _d = window.parent.document;
                var iframe = _d.getElementsByTagName("iframe");
                var i = 0;
                while (iframe[i]) {
                    var _f = iframe[i];
                    if (_f && _f.contentWindow && _f.contentWindow === window) {
                        params.frame = _f;
                        break;
                    }
                    i++;
                }
                if (params.frame) {
                    if (params.overlay) {
                        params.frame.style.position = "absolute";
                        params.frame.style.top = params.frame.style.right = "0px";
                        params.frame.style.zIndex = 29999;
                        params.frame.parentNode.style.overflow = 'visible';
                        params.frame.parentNode.style.position = 'relative';
                        params.frame.parentNode.style.width = params.width + 'px';
                        params.frame.parentNode.style.height = params.height + 'px';
                    } else if (p.skypeApi) {
                        params.frame.parentNode.style.width = params.width + 'px';
                        params.frame.parentNode.style.height = params.height + 'px';
                    }
                } else {
                }
            }
        }catch(_error){}
        var _div = params.ph.getElementsByTagName('iframe')[0] || params.ph.getElementsByTagName('div')[0] || {'style' : {}};
        params.ph.style.width = _div.style.width = params.width + 'px';
        params.ph.style.height = _div.style.height = params.height + 'px';
        var retObj = {
            doExpand: false,
            doCollapse: false,
            expand : function(){
                if (retObj.doExpand) {
                    return;
                }
                retObj.doExpand = true;
                retObj.doCollapse = false;
                if (p.skypeApi) {
                    p.skypeApi.expand();
                }
                var div = params.ph.getElementsByTagName("iframe")[0] || params.ph.getElementsByTagName('div')[0];
                if (params.frame) {
                    div.style.width = (params.width + params.offsetRight + params.offsetLeft) + "px";
                    div.style.height = (params.height + params.offsetBottom + params.offsetTop) + "px";
                    div = params.frame;
                }
                var obj = {
                    elems : [div]
                };
                if (params.overlay) {
                    params.ph.style.overflow = "";
                    div.style.position = "absolute";
                    div.style.overflow = "hidden";
                    div.style.background = "transparent";
                    obj.left = params.offsetLeft * -1;
                    obj.width = params.width + params.offsetRight + params.offsetLeft;
                    obj.top = params.offsetTop * -1;
                    obj.height = params.height + params.offsetBottom + params.offsetTop;
                }
                else {
                    obj.elems.push(params.ph);
                    obj.width = params.width + params.offsetLeft + params.offsetRight;
                    obj.height = params.height + params.offsetTop + params.offsetBottom;
                }
                obj.callback = (function(callback){
                    return function(){
                        if (typeof callback === "function") {
                            callback();
                        }
                    }
                })(params.callback);
                obj.time = params.time || 0;
                p.animate(obj);
            },
            collapse : function(){
                if (retObj.doCollapse) {
                    return;
                }
                retObj.doCollapse = true;
                retObj.doExpand = false;
                if (p.skypeApi) {
                    p.skypeApi.collapse();
                }
                var div = params.ph.getElementsByTagName("iframe")[0] || params.ph.getElementsByTagName('div')[0];
                div.style.position = 'relative';
                if (params.frame) {
                    div.style.width = (params.width) + "px";
                    div.style.height = (params.height) + "px";
                    div = params.frame;
                }
                var obj = {
                    elems : [div],
                    width : params.width,
                    height: params.height,
                    left : 0,
                    top : 0,
                    callback: (function(el,callback){
                        return function(){
                            el.style.overflow = "hidden";
                            div.style.overflow = "";
                            if (typeof callback === "function") {
                                callback();
                            }
                        }
                    })(params.ph,params.callback)
                };
                if (!params.overlay){
                    obj.elems.push(params.ph);
                }
                obj.time = params.time || 0;
                p.animate(obj);
            },
            fullscreen : function(){
                /*if (p.skypeApi) {
                 p.skypeApi.expand();
                 }*/
                var div = params.ph.getElementsByTagName("iframe")[0] || params.ph.getElementsByTagName('div')[0];
                if (params.frame) {
                    div.style.width = (params.width + params.offsetRight + params.offsetLeft) + "px";
                    div.style.height = (params.height + params.offsetBottom + params.offsetTop) + "px";
                    div = params.frame;
                }
                var obj = {
                    elems : [div]
                };
                //if (params.overlay) {
                params.ph.style.overflow = "";
                div.style.position = "fixed";
                div.style.overflow = "hidden";
                div.style.background = "transparent";
                obj.left = 0;
                obj.width = window.innerWidth;
                obj.top = 0;
                obj.height = window.innerHeight;
                //}
                /*else {
                 obj.elems.push(params.ph);
                 obj.width = params.width + params.offsetLeft + params.offsetRight;
                 obj.height = params.height + params.offsetTop + params.offsetBottom;
                 }*/
                obj.callback = (function(callback){
                    return function(){
                        if (typeof callback === "function") {
                            callback();
                        }
                    }
                })(params.callback);
                obj.time = params.time || 0;
                p.animate(obj);
            }
        };
        return retObj;
    };

    p.fillWithEvents = function (b, ext, vastEv) {
        b.t_events = {};
        if (ext && ext.Events) {
            for (var i = 0; i < ext.Events.length; i++) {
                var ev = ext.Events[i];
                var ename = ev.Name.toLocaleLowerCase();
                b.t_events[ename] = (b.t_events[ename] || []);
                for (var j = 0; j < ev.Urls.length; j++) {
                    if (ev.Urls[j] != b.nurl) {
                        b.t_events[ename.replace(/vast_/i,"")].push({u: ev.Urls[j].replace(/\[timestamp]|%random%/i,Math.random())});
                    }
                }
            }
        }
        var _baseT = b.ext && b.ext.Trackers && b.ext.Trackers.base && b.ext.Trackers.base[0] && b.ext.Trackers.base[0] || false;
        if (!_baseT) {
            if (b.ext && b.ext.Trackers) {
                for (var ev in b.ext.Trackers) {
                    var ename = ev.toLocaleLowerCase();
                    b.t_events[ename] = (b.t_events[ename] || []);
                    for (var i = 0; i < b.ext.Trackers[ev].length; i++) {
                        if (b.ext.Trackers[ev][i] != b.nurl) {
                            b.t_events[ename.replace(/vast_/i,"")].push({u: b.ext.Trackers[ev][i].replace(/\[timestamp]|%random%/i,Math.random())});
                        }
                    }
                }
            }
        } else {
            for (var name in aml.trackUrls) {
                b.t_events[name] = (b.t_events[name] || []);
                b.t_events[name].push({u : (_baseT.replace(/_admixevts_/,aml.trackUrls[name]).replace(/\[e=(.+?)]/g,function(all,ex){
                    return Function.call({},'return ' + ex + ';').call();
                }))});
            }
        }

        if (vastEv) {
            for (var i = 0; i < vastEv.length; i++) {
                var ev = vastEv[i];
                var ename = ev.name.toLocaleLowerCase();
                b.t_events[ename] = (b.t_events[ename] || []);
                b.t_events[ename].push({ u: ev.name, t: ev.time });
            }
        }
        /*for (var i in b.t_events) {
         var ev = b.t_events[i];

         for (var j in ev) {
         if (!ev[j].u)
         continue;

         if (!ev[j].t) {
         if (b.duration) {
         if (i == 'view' || i == 'video_start')
         ev[j].t = 0;
         else if (i == 'vast_firstquartile')
         ev[j].t = slot.duration / 4;
         else if (i == 'vast_midpoint')
         ev[j].t = slot.duration / 2;
         else if (i == 'vast_thirdquartile')
         ev[j].t = slot.duration * 3 / 4;
         else if (i == 'vast_complete')
         ev[j].t = slot.duration - 1;
         }
         }
         }
         }*/
        return b.t_events;
    };

    p.getItemFormat = function (item) {
        if (item.Ext.indexOf('.') == -1) {
            item.Ext = '.' + item.Ext;
        }
        if (item.Ext == '.swf') {
            return 'flash';
        }
        else if (item.Ext == '.jpg' || item.Ext == '.png' || item.Ext == '.gif') {
            return 'img';
        }
        else if (item.Ext == '.flv' || item.Ext == '.mp4' || item.Ext == '.webm') {
            return 'video';
        }
    };


    p.prepareBannerObject = function (s) {
        var adm_baner = {};
        var b = s.bid[0];
        var ext = b.ext.Settings;
        var cdn = b.ext.Murl && b.ext.Murl.length > 5 && b.ext.Murl || ext && ext.CDNs[0] || '';
        var frameTemplate = b.ext.FrameTemplate || '';
        adm_baner.templateId = ext && ext.TemplateId || null;
        adm_baner.cdn = cdn;
        adm_baner.plashka = '';
        adm_baner.cdns = ext && ext.CDNs || [];
        adm_baner.folder = ext && ext.OId || b.adid;
        adm_baner.slot = s.seat;
        adm_baner.width = ext && ext.width || b.w;
        adm_baner.height = ext && ext.height || b.h;
        adm_baner.files = [];
        adm_baner.items = [];
        adm_baner.clickUrl = b.nurl;
        adm_baner.iurl = b.iurl;
        adm_baner.adId = b.adid;
        adm_baner.phId = s.seat;
        adm_baner.frameTemplate = b.ext.FrameTemplate || '';
        var bidadm;
        try {
            bidadm = JSON.parse(b.adm);
        }catch(e){}
        if ( (b.adm && !ext) || (ext && (!b.ext.Settings || ext.TemplateId == 27 || ext.TemplateId == 28) ) ) {
            var obj,code,inIframe = true;
            try{
                obj = ext;
                code = (function(){
                    var arr = obj.Items[0].Params;
                    var ln = arr.length;
                    for (var i = 0; i < ln; i++) {
                        if (arr[i].Name == "code") {
                            return arr[i].Value;
                        }
                    }
                })();
                inIframe = obj.TemplateId == 27 ? true : false;
            }catch (e){}
            if (ext && ext.TemplateId) {
                ext.TemplateId = null;
                adm_baner.templateId = null;
            }
            if (!code) {
                code = b.adm;
            }
            var _zone = s && s.zoneParams && s.zoneParams.zone || null;
            var ifr = inIframe && document.createElement('iframe') || document.getElementById(adm_baner.phId);
            ifr.setAttribute("frameborder","no");
            ifr.setAttribute("scrolling","no");
            ifr.setAttribute("allowtransparency","true");
            ifr.setAttribute("hidefocus","true");
            ifr.setAttribute("tabindex","-1");
            ifr.setAttribute("name",adm_baner.adId);
            ifr.setAttribute("marginwidth","0");
            if (_zone) {
                code += '' +
                '<script type="text/javascript">' +
                'var pushed = false;' +
                'window.parent.admixerML.helpers.attach(window,"message",function(message){' +
                '   try{' +
                '       var data = window.parent.admixerML.helpers.JSON.parse(message.data);' +
                '       if (data.admixerPush && !pushed) {' +
                '           pushed = true;' +
                '           data.admixerPush.z = "' + _zone + '";' +
                '           data.admixerPush.ph = "' + s.ph.id + '";' +
                '           data.admixerPush.i = "inv-nets";' +
                '           window.parent.amSlots.push(data.admixerPush);' +
                '       }' +
                '   } catch(_error) {}' +
                '});' +
                '</script>';
                ifr.setAttribute('data-zone',_zone);
                //ifr.setAttribute('data-phid', s.ph.id);
            }
            adm_baner.code = code;
            adm_baner.inIframe = inIframe;
            ifr.setAttribute("marginheight","0");
            ifr.style.visibility = "inherit";
            ifr.style.display = "block";
            ifr.style.zIndex = "0";
            ifr.style.width = adm_baner.width + 'px';
            ifr.style.height = adm_baner.height + 'px';
            adm_baner.iFrame = ifr;
            /*if (inIframe) {
             var _ph = document.getElementById(adm_baner.phId);
             _ph.innerHTML = '';
             _ph.appendChild(ifr);
             ifr.contentWindow.document.write(code);
             ifr.contentWindow.document.close();
             }
             else {
             ifr.innerHTML = code;
             }*/
            var trackers = b.ext.Trackers;
            if (trackers instanceof Object) {
                if (trackers.view && trackers.view[0] && !trackers.base) {
                    trackers.base = [trackers.view[0].replace(/cet=4/i,'_admixevts_')];
                }
                /*for (var i in trackers) {
                 if (i.toLocaleLowerCase() != "click" && i.toLocaleLowerCase() != "base"){
                 for (var q = 0, ln = trackers[i].length; q < ln; q++) {
                 admixerML.sendPixel(trackers[i][q]);
                 }
                 }
                 }*/
            }
            //TODO return;
        } else {
        }






        var vst = null;

        if (ext && ext.Params) {
            for (var i = 0; i < ext.Params.length; i++) {
                var param = ext.Params[i];
                adm_baner[param.Name] = param.Value;
            }
        }

        if (ext && ext.OId && !adm_baner.oId) {
            adm_baner.oId = ext.OId;
        }
        if ( ext && (ext.TemplateId == 10 || ext.TemplateId == 11 || ext.TemplateId == 12)) {
            adm_baner.videoItems = {
                pause: aml.amCPath + 'scripts3/video/img/Pause.png',
                play: aml.amCPath + 'scripts3/video/img/Play.png',
                zoom: aml.amCPath + 'scripts3/video/img/Zoom.png',
                skip: aml.amCPath + 'scripts3/video/img/Decline.png',
                sound: aml.amCPath + 'scripts3/video/img/Sound.png'
            };

            ext.videoType = '1';
            for (var i = 0; i < ext.Items.length; i++) {
                var item = ext.Items[i];
                var url = /^http/i.test(item.Name) ? item.Name : cdn + '/' + ext.OId + '/' + item.Name;
                adm_baner.items[i] = { frm: p.getItemFormat(item), imageUrl: url, ext: item.Ext, types: item.Types };
                if (item.Params) {
                    for (var j = 0; j < item.Params.length; j++) {
                        var param = item.Params[j];
                        adm_baner[param.Name] = param.Value;
                    }
                }
                adm_baner.items[i].imageUrl =   adm_baner.items[i].inputUrl && adm_baner.items[i].inputUrl.toLowerCase() == "true" && adm_baner.items[i].videoUrl.replace(/https?:/i,admixerML.protocol) ||
                adm_baner.items[i].imageUrl;
                var h = adm_baner.items[i].height;
                var w = adm_baner.items[i].width;
                if (w && i == 0)
                    adm_baner.width = w;
                if (h && i == 0)
                    adm_baner.height = h;
            }
            if (adm_baner.items[0].duration)
                adm_baner.duration = adm_baner.items[0].duration;

            if (b.adm) {
                vst = p.fromVast(b.adm);
                adm_baner.clickUrl = vst.click;
                adm_baner.files = vst.file_sources;
                adm_baner.duration = vst.duration;
            }
        }
        else if (ext){


            for (var i = 0; i < ext.Items.length; i++) {
                var item = ext.Items[i];
                adm_baner.items[i] = { frm: p.getItemFormat(item), imageUrl: cdn + '/' + ext.OId + '/' + item.Name + item.Ext };
                if (item.Params) {
                    for (var j = 0; j < item.Params.length; j++) {
                        var param = item.Params[j];
                        adm_baner.items[i][param.Name] = param.Value;
                    }
                }
                adm_baner.items[i].imageUrl =   adm_baner.items[i].inputUrl && adm_baner.items[i].inputUrl.toLowerCase() == "true" && adm_baner.items[i].videoUrl.replace(/https?:/i,admixerML.protocol) ||
                adm_baner.items[i].imageUrl;
                var h = adm_baner.items[i].height;
                var w = adm_baner.items[i].width;
                /*if (w && (adm_baner.items[i].isAutoExpand == undefined || adm_baner.items[i].isAutoExpand > 0) )
                 adm_baner.width = w;
                 if (h && (adm_baner.items[i].isAutoExpand == undefined || adm_baner.items[i].isAutoExpand > 0))
                 adm_baner.height = h;*/
                if (w && i == 0 )
                    adm_baner.width = w;
                if (h && i == 0)
                    adm_baner.height = h;
            }
            adm_baner.track_events = b.ext.Trackers;
        }

        adm_baner.t_events = p.fillWithEvents(b, ext, vst);
        /*if (aml.settings.preview) {
         adm_baner.t_events = null;
         adm_baner.track_events = null;
         adm_baner.clickUrl = "http://admixer.net";
         adm_baner.iurl = "http://admixer.net";
         if (typeof (fillAdmixerCI) != 'undefined') {
         fillAdmixerCI(ext);
         }
         }*/

        adm_baner.cTag = aml.generateClickTag(adm_baner);

        return adm_baner;
    };

    p.isAutoExp = false;
    p.moduleName = 'cml';
    return p;
    //p.renderBanners();
});