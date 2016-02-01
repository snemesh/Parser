admixDefine(
	(function(){
		var res = [];
		if (typeof JSON !== 'object') {
			res.push('plugins/JSON');
		}
		if (![].indexOf) {
			res.push('plugins/indexOf');
		}
		return res;
	})(),
	function () {
		if (!window.adVersions) {
			window.adVersions = {};
		}
		var aml;
		if (!window.console) {
			window.console = {
				log: function () {
				},
				debug: function () {
				},
				time: function () {
				},
				timeEnd: function () {
				}
			};
		}
		var w = window, d = document;
		var protocol = /https/i.test(location.protocol) ? "https:" : "http:";
		w.admixerML = {version: '1.0', date: '2014-07-22'};
		w.amSlots = (w.amSlots || []);
		w.amResp = w.amResp || [];

		aml = w.admixerML;
		aml.protocol = protocol;
		aml.pvTime = new Date().getTime();

		aml.settings = {};
		aml.settings.preview = (w.amPreview || false);
		aml.settings.screen = (w.amScreen || false);
		aml.helpers = {};
		aml.h = aml.helpers;
		aml.openRTB = {};
		aml.template = {};
		aml.plugins = {
			'cml': 0/*,
			'TweenMax.min': 1,
			'html2canvas':1*/
		};
		aml.BO = {};
		aml.onloadArr = [];
		aml.cdnPath = w.cdnPath;
		aml.seats = [];
		aml.renderedCallback = aml.renderedCallback || {};

		aml.crevtPath = "";
		aml.invPathT = w.invPathT && w.invPathT.replace(/http:|https:/i,protocol) || protocol + '//inv-t.admixer.net/';
		aml.invPathB = w.invPathB && w.invPathB.replace(/http:|https:/i,protocol) || protocol + '//inv-nets.admixer.net/';
		aml.invSet = w.amInvPath && /inv-nets/i.test(w.amInvPath) ? 'inv-nets' : 'inv-t';
		aml.amCPath = (w.amCPath || protocol + '//cdn.admixer.net/');
		aml.amCPath = aml.amCPath.replace(/az703203\.vo\.msecnd\.net/,'cdn.admixer.net');
		aml.amClosePath = aml.amCPath + 'scripts3/templates/close.png';

		aml.teasers_allTeasersPage = 'http://market.admixer.net/ads';
		aml.teasers_allTeasersLabel = 'Все объявления';
		aml.teasers_publicSiteUrl = 'http://market.admixer.net';
		aml.teasers_publicSiteName = 'market.admixer.net';
		aml.frameContainer = (function(w){
			if (w !== w.parent) {
				try{
					if (w.parent.document){
						var _frames = w.parent.document.getElementsByTagName('iframe');
						for (var i = 0, ln = _frames.length; i < ln; i++) {
							if (_frames[i].contentWindow === w) {
								return _frames[i];
							}
						}
						return false;
					}
				}catch(_error){
					return false;
				}
			}
			else {
				return false;
			}
		})(window);

		aml.generateClickTag = function (bo) {
			var result = "";
			var t_events = bo && bo.t_events;
			if (t_events instanceof Object) {
				for (var key in t_events) {
					if (t_events.hasOwnProperty(key) && key.toLowerCase() === "click") {
						var arr = t_events[key];
						if (arr instanceof Array) {
							for (var i = 0, ln = arr.length; i < ln; i++) {
								var url = arr[i] && arr[i].u || arr[i];
								if (/inv-nets\.admixer\.net/i.test(url)) {
									result = url.replace(/crevt\.aspx/i, "click.aspx").replace(/^(https:\/\/|\/\/)/i, "http:\/\/");
									break;
								}
							}
						}
						break;
					}
				}
			}
			return result;
		};
		aml.frameTemplate = {
			'admixerStar' : {
				't' : 'bottom',
				'l' : 'right',
				'html' : '<a href="http://sales.admixer.net/?utm_source=cpc&amp;utm_medium=admixer&amp;utm_campaign=plashka" class="admixer_logo" target="_blank" onmouseover="this.children[0].style.display=\'none\'; this.children[1].style.display=\'block\';" onmouseout="this.children[0].style.display=\'block\'; this.children[1].style.display=\'none\';" style="bottom: 0px; position: absolute; right: 0px; height: 15px; z-index: 2; display: block; overflow: hidden; background: white;"><span class="admixer_logo_pic" style="display: block;"><img alt="Admixer" style="border: none;" src="' + (location.protocol === 'https:' ? 'https:' : 'http:') + '//az703203.vo.msecnd.net/scripts3/plugins/svg/small.svg?v=1"></span><span class="admixer_logo_pic_big" style="display: none;"><img alt="Admixer" style="border: none;" src="' + (location.protocol === 'https:' ? 'https:' : 'http:') + '//az703203.vo.msecnd.net/scripts3/plugins/svg/big.svg?v=1"></span></a>'
			},
			'TNS' : {
				't' : 'bottom',
				'l' : 'right',
				'script' : '' +
				'(function(){' +
				'var s = document.createElement("script"),' +
				'p = document.getElementsByTagName("script"),' +
				'l = p.length;s.async = true;' +
				's.type = "text/javascript";' +
				's.src = ("https:" == location.protocol ? "https:" : "http:") + "//source.mmi.bemobile.ua/cm/cmeter_an.js#tnscm_adn=admixer&uid=[e=aml.AdmVisGuid]&fp=[e=bo.item && bo.item.imageUrl]";' +
				'p[l-1].parentNode.insertBefore(s, p[l-1].nextSibling);' +
				'})()'
			}
		};
		aml.helpers.preventDefault = function(_event){
			if (_event) {
				_event.returnValue = false;
				_event.cancelBubble = true;
				if (_event.preventDefault) {
					_event.preventDefault();
				}
				if (_event.stopPropagation) {
					_event.stopPropagation();
				}
			}
		};
		aml.helpers.scrollKeys = {37: 1, 38: 1, 39: 1, 40: 1};
		aml.helpers.preventForKeys = function(_event,keys){
			if (keys[_event.keyCode]) {
				aml.helpers.preventDefault(_event);
				return false;
			}
		};
		aml.helpers.disableScroll = function(_w_) {
			if (_w_.addEventListener) // older FF
				_w_.addEventListener('DOMMouseScroll', aml.helpers.preventDefault, false);
			_w_.onwheel = aml.helpers.preventDefault; // modern standard
			_w_.onmousewheel = document.onmousewheel = aml.helpers.preventDefault; // older browsers, IE
			_w_.ontouchmove  = aml.helpers.preventDefault; // mobile
			_w_.document.onkeydown  = function(_event){
				aml.helpers.preventForKeys(_event,aml.helpers.scrollKeys);
			};
		};

		aml.helpers.enableScroll = function(_w_) {
			if (_w_.removeEventListener)
				_w_.removeEventListener('DOMMouseScroll', aml.helpers.preventDefault, false);
			_w_.onmousewheel = document.onmousewheel = null;
			_w_.onwheel = null;
			_w_.ontouchmove = null;
			_w_.document.onkeydown = null;
		};
		aml.helpers.JSON = JSON;
		aml.helpers.getElementsByClassName = function(from,cls){
			var result = [];
			if (from.getElementsByClassName) {
				result =  from.getElementsByClassName(cls);
			}
			else {
				var elems = from.getElementsByTagName("*");
				for (var i = 0, ln = elems.length; i < ln; i++) {
					var clsList = elems[i].className.split(" ");
					if (clsList.indexOf(cls) > -1) {
						result.push(elems[i]);
					}
				}
			}
			return result;
		};
		/*aml.helpers.indexOf = function(arr,str){
			var result = -1;
			if (arr.indexOf) {
				result = arr.indexOf(str);
			}
			else {
				for (var i = 0,ln = arr.length; i < ln; i++) {
					if (arr[i] === str) {
						result = i;
						break;
					}
				}
			}
			return result;
		};*/
		aml.helpers.attach = function (obj, name, callback) {
			if (obj.addEventListener) {
				obj.addEventListener(name, callback);
			}
			else if (obj.attachEvent) {
				obj.attachEvent("on" + name, callback);
			}
		};
		aml.helpers.tooltip = {
			_tooltip : (function(){
				var t = document.createElement('div');
				t.style.position = 'absolute';
				t.style.background = 'rgb(250,230,200)';
				t.style.color = 'black';
				//t.style.border = '2px solid gray';
				t.style.display = 'inline-block';
				t.style.webkitTransition = 'opacity 0.2s linear';
				t.style.mozTransition = 'opacity 0.2s linear';
				t.style.msTransition = 'opacity 0.2s linear';
				t.style.oTransition = 'opacity 0.2s linear';
				t.style.transition = 'opacity 0.2s linear';
				t.style.borderRadius = '50px';
				t.style.paddingTop = '3px';
				t.style.paddingBottom = '3px';
				t.style.paddingLeft = '5px';
				t.style.paddingRight = '5px';
				t.style.fontFamily = 'monospace';
				t.style.fontSize = '12px';
				t.style.maxWidth = '100px';
				t.style.maxHeight = '100px';
				t.style.zIndex = 999999;
				t.style.opacity = 0;
				var w = window;
				var test = function(_w){
					try{
						if (_w.parent !== _w && _w.parent.document){
							w = _w.parent;
							test(w);
						}
					}catch(_error){};
				};
				test(w);
				if (w.document.body) {
					w.document.body.appendChild(t);
				} else {
					aml.helpers.attach(w,'load',function(){
						w.document.body.appendChild(t);
					});
				}
				return t;
			})(),
			show : function(params){
				var el = params.elem;
				var txt = params.text;
				var t = aml.helpers.tooltip._tooltip;
				if (!el || !txt) {
					return;
				}
				var w = window;
				var elw = el.offsetWidth;
				var top = 0;
				var left = 0;
				var test = function(){
					var _doc = el.ownerDocument;
					var _w = _doc.defaultView || _doc.parentWindow;
					var res = aml.eventsQ.check(el,_w);
					top += res.top;
					left += res.left;
					if (_w !== _w.parent) {
						try{
							if (_w.parent.document) {
								el = (function(){
									var _frm = _w.parent.document.getElementsByTagName('iframe');
									for (var i = 0,ln = _frm.length; i < ln; i++) {
										if (_frm[i].contentWindow === _w) {
											w = _w.parent;
											return _frm[i]
										}
									}
								})();
								test();
							}
						}catch(_error){}
					}
				};
				test();
				//var obj = aml.eventsQ.check(el,'position');
				t.textContent = txt;
				t.style.left = left + (elw - t.offsetWidth) / 2 + 'px';
				t.style.top = top - t.offsetHeight - 5 + 'px';
				t.style.opacity = 1;
			},
			hide : function(){
				var t = aml.helpers.tooltip._tooltip;
				t.style.opacity = 0;
			}
		};

		aml.helpers.guid = function () {
			function _p8(s) {
				var p = (Math.random().toString(16) + "000000000").substr(2, 8);
				return s ? "-" + p.substr(0, 4) + "-" + p.substr(4, 4) : p;
			}

			return _p8() + _p8(true) + _p8(true) + _p8();
		};
		aml.helpers.getFlashVer = function () {
			if (window.ActiveXObject) {
				var a = {};
				a.control = null;
				try {
					a.control = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
				}
				catch (e) {
				}
				if (a.control) {
					var version = a.control.GetVariable('$version').substring(4);
					version = version.split(',');
					version = parseFloat(version[0] + '.' + version[1]);
					delete a.control;
					return version;
				}
			}
			else if (typeof navigator.plugins['Shockwave Flash'] !== 'undefined') {
				var words = navigator.plugins['Shockwave Flash'].description.split(' ');
				var aword;
				for (var i = 0; i < words.length; ++i) {
					if (isNaN(parseInt(words[i]))) {
						continue;
					}
					aword = words[i];
				}
				return aword;
			}
			return 0;
		};

		aml.helpers.decodeUrl = (function () {
			if (w.decodeURIComponent) {
				return w.decodeURIComponent;
			}
			else {
				return w.unescape;
			}
		})();

		aml.helpers.encodeUrl = (function () {
			if (w.encodeURIComponent) {
				return w.encodeURIComponent;
			}
			else {
				return w.escape;
			}
		})();
		aml.helpers.detach = function (obj, name, callback) {
			if (obj.removeEventListener) {
				obj.removeEventListener(name, callback);
			}
			else if (obj.detachEvent) {
				obj.detachEvent("on" + name, callback);
			}
		};
		aml.helpers.ready = function (callback) {
			if (typeof callback !== "function") {
				return;
			}
			var clb = function () {
				if (/loaded|complete/i.test(d.readyState)) {
					aml.helpers.detach(d, "readystatechange", clb);
					callback();
				}
			};
			if (/loaded|complete/i.test(d.readyState)) {
				callback();
			}
			else {
				aml.helpers.attach(d, "readystatechange", clb);
			}
		};
		aml.work = function (index, step, distance, el, _side, h, callback) {
			if (aml.type == 'hide') {
				index -= step;
			}
			if (aml.type == 'show') {
				index += step;
			}
			for (var i = 0, ln = el.length; i < ln; i++) {
				el[i].style[_side] = index + 'px';
			}
			if (index > h && index < h + distance) {
				setTimeout(function () {
					aml.work(index, step, distance, el, _side, h, callback);
				}, 10);
			}
			else if (callback instanceof Function) {
				callback();
			}
		};
		aml.toggle = function (h, distance, el, type, time, side, callback) {
			try {
				h = h * 1;
				var _side;
				if (side == 'down' || side == 'top') {
					_side = 'height';
					if (side == 'down') {
						el[0].style.bottom = '';
						el[0].style.top = '0px';
					}
					else {
						el[0].style.bottom = '0px';
						el[0].style.top = '';
					}
				}
				else if (side == 'left' || side == 'right') {
					_side = 'width';
					if (side == 'left') {
						el[0].style.left = '';
						el[0].style.right = '0px';
					}
					else {
						el[0].style.left = '0px';
						el[0].style.right = '';
					}
				}
				var index = parseFloat(el[0].style[_side]);
				var step = distance / (time / 10);
				if (aml.type == type && (Math.abs(h - index) < step)) {
					return;
				}
				if (Math.abs(h - index + distance) < step && type == "show") {
					step = Math.abs(h - index + distance);
				}
				if (Math.abs(h - index) < step && type == "hide") {
					step = Math.abs(h - index);
				}
				if (index < h) {
					index = h;
				}
				if (index > h + distance) {
					index = h + distance;
				}
				aml.type = type;
				aml.work(index, step, distance, el, _side, h, callback);
			} catch (e) {
			}
		};
		aml.trackList = {
			"adClick": "click",
			"adTrackClick": "click",
			"adExpand": "expandbyuser",
			"adExpandAuto": "autoexpand",
			"adCollapse": "collapsebyuser",
			"adCollapseAuto":"autocollapse",
			"adFullscreen":"fullscreen",
			"adVastEvent": {
				"25": "firstquartile",
				"50": "midpoint",
				"75": "thirdquartile",
				"100": "complete"
			},
			"adFSHtml" : 'fullsreenhtml',
			"adFSHtmlExit" : 'exitfullscreenhtml',
			"adPlay": "start",
			"adSlide": "slide",
			"adPause": "pause",
			"adSoundOn": "unmute",
			"adSoundOff": "mute",
			"adResume": "resume",
			"adSkip": 'skip',
			"adClose": "close",
			"kill": "close",
			"adView": "view",
			"adConfirm": 'confirmview'
		};
		aml.trackUrls = {
			view : 'cet=4',
			confirmview : 'cet=9',
			click : 'cet=8',
			autoexpand : 'cet=5&rm=0',
			expandbyuser : 'cet=5&rm=1',
			autocollapse : 'cet=5&rm=2',
			collapsebyuser : 'cet=5&rm=3',
			close : 'cet=5&rm=4',
			slide : 'cet=5&rm=5',
			fullsreenhtml : 'cet=5&rm=6',
			exitfullscreenhtml : 'cet=5&rm=7',
			start : 'cet=7&vast=1',
			firstquartile : 'cet=7&vast=2',
			midpoint : 'cet=7&vast=3',
			thirdquartile : 'cet=7&vast=4',
			complete : 'cet=7&vast=5',
			mute : 'cet=7&vast=6',
			unmute : 'cet=7&vast=7',
			pause : 'cet=7&vast=8',
			resume : 'cet=7&vast=10',
			fullscreen : 'cet=7&vast=11',
			skip : 'cet=7&vast=17'
		};
		aml.API = function (command, arg, id) {
			command = command.split(",");
			if (command.length > 1) {
				for (var i = 0, ln = command.length; i < ln; i++) {
					aml.API(command[i],arg,id);
				}
				return;
			}
			else {
				command = command[0];
			}
			var events = aml.eventsQ.evtArr[id];
			var list = aml.trackList;
			var fName = id + "_DoFSCommand";
			aml.eventsQ.sendPixelsByEventType(events, (list[command] && list[command][arg] || list[command]));
			if (w[fName] && w[fName].callback && w[fName].callback[command]) {
				var arr = w[fName].callback[command];
				for (var i = arr.length - 1; i > -1; i--) {
					if (typeof arr[i] === "function" && arr[i](arg) === false) {
						break;
					}
				}
			}
		};

		aml.sendPixel = function (u) {
			u = u.replace(/https?\:/i, aml.protocol);
			var a_zp = document.createElement('IMG');
			u = u.replace('[TIMESTAMP]', new Date().getTime());
			var admGuid = (aml.admGuid || '');
			if (u.indexOf('$admguid$') > 0) {
				u = u.replace('$admguid$', admGuid);
			}
			a_zp.src = u;
			a_zp.width = 1;
			a_zp.height = 1;
			a_zp.style.width = '1px';
			a_zp.style.height = '1px';
			a_zp.style.position = 'absolute';
			a_zp.style.top = '-10000px';
			a_zp.style.left = '0px';
			document.body.appendChild(a_zp);
		};

		aml.loadScript = function (url, callback,params) {
			var proto = aml.protocol;
			url = url.replace(/https?\:/i, proto);
			if (!/dsp\.aspx/i.test(url)) {
				var name = url.match(/[^/]+$/)[0];
				url = url + "?v=" + adVersions[name];
			}
			var s = document.createElement('script');
			s.async = true;
			s.type = 'text/javascript';
			s.src = url;
			if (params && params instanceof Object) {
				for (var key in params) {
					if (params.hasOwnProperty(key)) {
						s.setAttribute(key,params[key]);
					}
				}
			}
			if (callback) {
				s.onreadystatechange = s.onload = function () {
					var state = s.readyState;
					if (!callback.done && (!state || /loaded|complete/.test(state))) {
						callback.done = true;
						callback();
					}
				};
			}
			var node = document.getElementsByTagName('script')[0];
			node.parentNode.insertBefore(s, node);
		};
		aml.loadPlugins = function () {
			for (var key in aml.plugins) {
				if (aml.plugins[key] === 1) {
					admixRequire(['plugins/' + key],function(res){
						if (res.moduleName && !aml[res.moduleName]) {
                            aml[res.moduleName] = res;
                        }
						if (res && res.renderBanners) {
							res.renderBanners();
						}
					});
				}
			}
		};
		aml.clear = function(id){
			if (!id) return;
			var evtArr,ph,iframe,index;
			id = id instanceof Array
					? id
					: id.toLowerCase() === 'all'
					? Object.keys(aml.eventsQ.evtArr)
					: [id];
			for (var i = 0,ln = id.length; i < ln; i++) {
				if (aml.eventsQ.evtArr[id[i]]) {
					evtArr = aml.eventsQ.evtArr[id[i]];
					ph = evtArr.bo.ph;
					aml.proceedSingle(evtArr);
					ph.style.width = ph.style.height = '0px';
					ph.style.position = '';
					if (aml.HTML5Sources && aml.HTML5Sources.length) {
						iframe = ph.getElementsByTagName('iframe')[0];
						try {
							iframe = iframe.contentWindow;
						}catch(_error){
							iframe = false;
						}
						if (iframe) {
							index = aml.HTML5Sources.indexOf(iframe);
							if (index > -1) {
								aml.HTML5Sources.splice(index,2);
							}
						}
					}
					ph.innerHTML = '';
					delete aml.eventsQ.evtArr[id[i]];
				}
			}
		};

		aml.getRandomInt = function(min, max) {
			return Math.floor(Math.random() * (max - min + 1)) + min;
		};
		aml.proceedSPResponse = function (resp) {
			if (!resp || !resp.seatbid || resp.seatbid.length == 0) {
				if (w.amResp && w.amResp[0]) {
					resp = w.amResp[0];
					w.amResp.splice(0,1);
				} else {
					return;
				}
			}
			if (resp.ext && resp.ext.AdmVisGuid) {
				aml.AdmVisGuid = resp.ext.AdmVisGuid;
			}
			var positions = {};
			var seatsCount = 0;
			var seats = [];

			for (var i = 0; i < resp.seatbid.length; i++) {

				var s = resp.seatbid[i];

				if (!s.bid || s.bid.length == 0) {
					continue;
				}

				var ph = d.getElementById(s.seat);

				if (!ph) {
					continue;
				}
				s.ph = ph;
				s.zoneParams = resp && s.seat && resp.ext && resp.ext.zones && resp.ext.zones[s.seat] || null;
				seats.push(s);
				if (s.group === 1 && s.ext && s.ext.api == "admixer-teasers") {
					s.type = "teaser";
					aml.plugins.teasers = 1;
				}
				else {
					s.type = "banner";
					aml.plugins.cml = 1;
				}

			}
			if (resp.ext) {
				aml.cLat = resp.ext.cLat || '';
				aml.cLon = resp.ext.cLon || '';
			}
			aml.seats = aml.seats.concat(seats);
			aml.eventsQ.init();
			aml.loadPlugins();
		};
		aml.openRTB.device_obj = function () {
			var result = {};
			if (navigator) {
				result.ua = navigator.userAgent;
			}
			result.flashver = aml.helpers.getFlashVer();
			return result;
		};

		aml.openRTB.site_obj = function () {
			var result = {};
			result.page = aml.helpers.encodeUrl(document.URL);
			result.ref = aml.helpers.encodeUrl(document.referrer);
			return result;
		};

		aml.openRTB.banner_obj = function (amsl) {
			var result = {};
			if (amsl.item) {
				result.id = amsl.item;
			}
			return result;
		};

		aml.openRTB.imp_obj = function (amSlot) {
			if (!amSlot) {
				return;
			}
			var result = {};
			result.id = aml.helpers.guid();
			if (!aml.settings.preview) {
				result.tagid = amSlot.z;
			}
			result.ext = {};
			result.ext.ph = amSlot.ph;
			if (amSlot.item) {
				result.banner = aml.openRTB.banner_obj(amSlot);
			}
			if (amSlot.profile) {
				result.ext.profile = amSlot.profile;
			}
			if (amSlot.badv) {
				result.badv = amSlot.badv;
			}
			return result;
		};

		/*aml.getSlotByPh = function (ph) {
		 for (var i = 0; i < w.amSlots.length; i++) {
		 if (w.amSlots[i].ph == ph) {
		 return w.amSlots[i];
		 }


		 }
		 return null;
		 };*/

		aml.generateRequestObject = function (slt) {
			var arr;
			//var arr = w.amSlots;
			if (slt && slt.length > 0) {
				arr = slt;
			}
			else {
				return false;
			}
			if (slt && slt.ph && slt.ph.id) {
				for (var q = 0, qln = arr.length; q < qln; q++) {
					if (arr[q].ph == slt.ph.id) {
						arr = [arr[q]];
						break;
					}
				}
			}
			if (!arr || arr.length < 1) {
				return;
			}
			var result = {};
			result.id = aml.helpers.guid();
			result.site = aml.openRTB.site_obj();
			result.device = aml.openRTB.device_obj();
			result.imp = [];

			for (var i = 0; i < arr.length; i++) {
				var slot = arr[i];

				/*if (slot.item_content && slot.ph) {
				 aml.renderBanner(slot.item_content, slot.ph);
				 continue;
				 }

				 if (!slot.ph) {
				 continue;
				 }

				 if (!aml.settings.preview && (!slot.ph)) {
				 continue;
				 }
				 else if (aml.settings.preview && (!slot.item)) {
				 continue;
				 }*/

				var im = aml.openRTB.imp_obj(slot);
				result.imp.push(im);
			}

			result.allimps = result.imp.length;
			return result;
		};
		/*aml.renderBanner = function (json, ph) {
		 if (!json || !ph) {
		 return;
		 }

		 var json = JSON.parse(json);

		 var resp = {};
		 resp.seatbid = [];
		 var seat = {seat: ph};
		 resp.seatbid.push(seat);
		 seat.bid = [];
		 var bid = {};
		 bid.ext = {};
		 bid.ext.Settings = json;
		 seat.bid.push(bid);
		 aml.proceedSPResponse(resp);
		 };*/

		aml.serveSlots = function (slt) {
			w.amTSlots = w.amTSlots || [];
			if (!w.amSlots || w.amSlots.length < 1) {
				return;
			}
			var slotsT = [].constructor();
			var slotsB = [].constructor();
			for (var i = 0, ln = w.amSlots.length; i < ln; i++) {
				if (w.amSlots[i].renderedCallback) {
					aml.renderedCallback[w.amSlots[i].ph] = w.amSlots[i].renderedCallback;
				}
				if (!w.amSlots[i].i) {
					w.amSlots[i].i = aml.invSet;
				}
				if (w.amSlots[i].i === 'inv-nets') {
					slotsB.push(w.amSlots[i]);
				}
				else {
					slotsT.push(w.amSlots[i]);
				}
			}
			w.amSlots.length = 0;
			var sender = window.admixSender || 'admixer';
			if (slotsT.length > 0) {
				w.amTSlots = w.amTSlots.concat(slotsT);
				/*var bidRequestT = aml.generateRequestObject(slotsT);
				 if (!bidRequestT || !bidRequestT.imp || bidRequestT.imp.length == 0) {
				 return;
				 }
				 var iuT = aml.invPathT;
				 iuT += '/dsp.aspx?sender=' + sender + '&rct=4';
				 if (typeof JSON !== "undefined") {
				 iuT += '&data=' + aml.helpers.encodeUrl(JSON.stringify(bidRequestT));
				 }
				 iuT += '&rnd=' + Math.random() * 10000000000000000;
				 aml.loadScript(iuT);*/
			}
			if (slotsB.length > 0) {
				var bidRequestB = aml.generateRequestObject(slotsB);

				if (!bidRequestB || !bidRequestB.imp || bidRequestB.imp.length == 0) {
					return;
				}

				var iuB = aml.invPathB;
				iuB += '/dsp.aspx?sender=' + sender + '&rct=4';
				if (typeof JSON !== "undefined") {
					iuB += '&data=' + aml.helpers.encodeUrl(JSON.stringify(bidRequestB));
				}
				iuB += '&rnd=' + Math.random() * 10000000000000000;
				aml.loadScript(iuB);
			}

			/*for (var i = 0; i < w.amSlots.length; i++) {
			 var slot = w.amSlots[i];

			 if (slot.preview) {

			 }
			 }*/
		};

		/*aml.proceedSeat = function (s) {
		 if (s.group === 1 && s.ext.api === "admixer-teasers") {
		 aml.ensurePlugin(null, null, 'teasers', function (p) {
		 p.proceedSeat(s, false);
		 });
		 }
		 else {
		 aml.ensurePlugin(null, null, 'cml', function (p) {
		 p.proceedSeat(s, false);
		 });
		 }
		 };*/


		aml.eventsQ = {};
		aml.eventsQ.evtArr = {};
		aml.eventsQ.registerBanner = function (bo, slotId) {
			var evts = aml.eventsQ.evtArr;
			var bEvents = aml.eventsQ.evtArr[slotId];
			//if (!bEvents) {
			bEvents = {bo: bo,mouseover: false,inViewPercent: 0,pageViewDuration: 0, pageFocusDuration: 0,bannerInViewDuration: 0,bannerCursorOverDuration: 0,lastCheckTime: (new Date()).getTime(), wasSentHash: {}};
			aml.eventsQ.evtArr[slotId] = bEvents;
			//}
		};
		aml.eventsQ.firstPercentCheck = function(bEvents,ph){
			var percent = aml.eventsQ.check(ph);
			if (percent || percent === 0) {
				bEvents.inViewPercent = percent;
			} else {
				setTimeout(function(){
					aml.eventsQ.firstPercentCheck(bEvents,ph);
				},100)
			}
		};
		aml.eventsQ.registerRender = function(bo,callback){
			//check('enter_render');
			if (!bo) return;
			var id = bo.phId || bo.id;
			var bEvents = aml.eventsQ.evtArr[id];
			if (bEvents) {
				aml.eventsQ.firstPercentCheck(bEvents,bo.ph);
				if (typeof callback === "function") {
					bEvents.viewCallback = callback;
					callback(bEvents.inViewPercent);
				}
			}
			if (typeof aml.renderedCallback[id] === 'function') {
				aml.renderedCallback[id](bo);
				aml.renderedCallback[id] = null;
			}
			if (bo.ph && bo.frameTemplate && aml.frameTemplate) {
				var tmpl = bo.frameTemplate.split(',');
				for (var i = 0,ln = tmpl.length; i < ln; i++){
					if (aml.frameTemplate[tmpl[i]]){
						var _div = document.createElement(aml.frameTemplate[tmpl[i]].html ? 'div' : 'script');
						_div.style.position = 'absolute';
						_div.style.zIndex = 999999999999999999;
						_div.style[ aml.frameTemplate[tmpl[i]].t] = 0;
						_div.style[ aml.frameTemplate[tmpl[i]].l] = 0;
						_div[aml.frameTemplate[tmpl[i]].html ? 'innerHTML' : 'textContent'] = (aml.frameTemplate[tmpl[i]].html || aml.frameTemplate[tmpl[i]].script).replace(/\[e=(.+?)]/g,function(all,ex){
							return Function.call({},'aml','bo','return ' + ex + ';').call(window,aml,bo);
						});
						bo.ph.appendChild(_div);
					}
				}
			}
			aml.API('adView',[],bo.phId);
		};
		aml.eventsQ.findW = function(w,el){
			var canHack;
			var _w = w;
			if (_w !== window.parent) {
				try {
					if (window.parent.document) {
						canHack = true;
					}
					var _doc = window.parent.document;
					var _frames = _doc.getElementsByTagName('iframe');
					for (var i = 0, ln = _frames.length; i < ln; i++) {
						var _frame = _frames[i];
						if (_frame.contentWindow === window) {
							el = _frame;
							_w = window.parent;
							break;
						}
					}
					return (aml.eventsQ.findW(_w,el));
				}catch(_error){
					return {w : _w, el : el};
				}
			}
			else {
				return {w : _w, el : el};
			}
		};
		aml.eventsQ.check = function(el,_ww) {
			var _w = _ww || window;
			if (!_ww) {
				var obj = aml.eventsQ.findW(_w,el);
				_w = obj.w;
				el = obj.el;
			}
			var rect,style,elStyle;
			try {
				rect = el.getBoundingClientRect();
				//style = getComputedStyle(el);
			} catch (e) {
				return 100;
			}
			var top = rect.top,
				left = rect.left,
				width = rect.right - left,
				height = rect.bottom - top,
				bottom = _w.innerHeight - height - top,
				right = _w.innerWidth - width - left,
				P = width * height;
			height += top < 0 ? top : 0;
			height += bottom < 0 ? bottom : 0;
			width += left < 0 ? left : 0;
			width += right < 0 ? right : 0;
			var nP = width * height;
			if (_ww) {
				return {
					left: left,
					top: top
				}
			}
			//console.log(nP / P * 100);
			return nP / P * 100;

		};
		aml.eventsQ.inViewCheck = function(){
			if (aml.eventsQ.chechTimeout) {
				clearTimeout(aml.eventsQ.chechTimeout);
			}
			aml.eventsQ.chechTimeout = setTimeout(function(){
				for (var key in aml.eventsQ.evtArr) {
					if (aml.eventsQ.evtArr.hasOwnProperty(key)) {
						var visible = aml.eventsQ.visibility();
						var val = aml.eventsQ.evtArr[key];
						var el = val.bo.ph || document.getElementById(key);
						if (el && val){
							val.inViewPercent = aml.eventsQ.check(el);
							if (typeof val.viewCallback === "function") {
								val.viewCallback(val.inViewPercent);
							}
						}
					}
				}
				aml.eventsQ.chechTimeout = null;
			},300);
		};
		aml.eventsQ.visibility = (function () {
			var stateKey, eventKey, keys = {
				hidden: "visibilitychange",
				webkitHidden: "webkitvisibilitychange",
				mozHidden: "mozvisibilitychange",
				msHidden: "msvisibilitychange"
			};
			for (stateKey in keys) {
				if (stateKey in document) {
					eventKey = keys[stateKey];
					break;
				}
			}
			return function () {
				return !document[stateKey];
			};
		})();
		var __w = window;
		if (window !== window.parent) {
			try {
				if (window.parent.document) {
					__w = window.parent;
				}
			}catch(_error){};
		}
		aml.helpers.attach(__w,"scroll",aml.eventsQ.inViewCheck);
		aml.helpers.attach(__w,"resize",aml.eventsQ.inViewCheck);
		aml.eventsQ.onViewPortChanged = function (phId, pos) {
			var evts = aml.eventsQ.evtArr;
			var bEvents = aml.eventsQ.evtArr[phId];
			if (!bEvents) {
				return;
			}
			if (pos > 50) {

				if (!bEvents.lastInViewTime) {
					bEvents.lastInViewTime = new Date().getTime();
				}
				if (!bEvents.firstInViewTime) {
					bEvents.firstInViewTime = new Date().getTime();
				}
				else {
					if ((new Date().getTime() - bEvents.firstInViewTime) > 1000) {
						aml.eventsQ.sendPixelsByEventType(bEvents, 'confirmview');
					}
				}
			}
			else {
				if (bEvents.lastInViewTime) {
					bEvents.totalInViewTime += (new Date().getTime() - bEvents.lastInViewTime);
					bEvents.lastInViewTime = null;
					if (bEvents.totalInViewTime > 1000) {
						aml.eventsQ.sendPixelsByEventType(bEvents, 'confirmview');
					}
				}
			}
		};

		aml.eventsQ.onMouseEnterChanged = function (phId, pos) {
			var evts = aml.eventsQ.evtArr;
			var bEvents = aml.eventsQ.evtArr[phId];
			if (!bEvents) {
				return;
			}
			bEvents.mouseover = pos;
		};

		aml.eventsQ.sendPixelsByEventType = function (bEvents, eventType) {
			if (!bEvents || bEvents.wasSentHash[eventType]) {
				return;
			}
			if ( (eventType === "collapsebyuser" || eventType === "autocollapse") && (!bEvents.wasSentHash.expandbyuser && !bEvents.wasSentHash.autoexpand)) {
				return;
			}
			if (bEvents.bo && bEvents.bo.zoneParams && bEvents.bo.zoneParams.cbcf) {
				if (eventType === 'view') {
					return;
				} else if (eventType === 'confirmview') {
					bEvents.bo.zoneParams.cbcf = false;
					aml.eventsQ.sendPixelsByEventType(bEvents, 'view');
				}
			}
			if (eventType === "confirmview" && !bEvents.wasSentHash.view) {
				return;
			}
			bEvents.wasSentHash[eventType] = true;
			var bo = bEvents.bo;
			if (bo.t_events && bo.t_events[eventType]) {
				var arr = bo.t_events[eventType];
				for (var i = 0; i < arr.length; i++) {
					if (!arr[i].u) {
						continue;
					}
					var _split = arr[i].u.split(':');
					if (_split[0] === 'function') {
						_split.splice(0,1);
						Function.call({} ,_split.join(':')).call(window);
					} else {
						aml.sendPixel(arr[i].u);
					}
				}
				if (window.clicktracking && eventType === "click") {
					aml.sendPixel(window.clicktracking);
				}
			}
		};
		aml.eventsQ.init = function () {
			var q = aml.eventsQ;
			if (q.isInitialized) {
				return;
			}
			q.isInitialized = true;
			var w = window;
			aml.helpers.attach(w, "unload", q.proceed);
			aml.helpers.attach(w, "pagehide", q.proceed);
			aml.eventsQ.interval = setInterval(function(){
				var evt = aml.eventsQ.evtArr;
				for (var key in evt){
					if (evt.hasOwnProperty(key)) {
						var bEvents = evt[key];
						var visible = aml.eventsQ.visibility();
						var time = (new Date()).getTime();
						var diff = time - bEvents.lastCheckTime;
						bEvents.pageViewDuration += diff;
						if (visible) {
							bEvents.pageFocusDuration += diff;
							if (bEvents.bo.zoneParams && bEvents.bo.zoneParams.vaPerc) {
								if (bEvents.inViewPercent > bEvents.bo.zoneParams.vaPerc) {
									bEvents.bannerInViewDuration += diff;
									if (bEvents.mouseover) {
										bEvents.bannerCursorOverDuration += diff;
									}
									if (bEvents.bo.zoneParams && bEvents.bo.zoneParams.vaMs) {
										if (bEvents.bo.zoneParams.vaMs < bEvents.bannerInViewDuration) {
											aml.eventsQ.sendPixelsByEventType(bEvents,"confirmview");
										}
									}
									else if ( bEvents.bannerInViewDuration > 1000) {
										aml.eventsQ.sendPixelsByEventType(bEvents,"confirmview");
									}
								}
							}
							else if (bEvents.inViewPercent > 40) {
								bEvents.bannerInViewDuration += diff;
								if (bEvents.mouseover) {
									bEvents.bannerCursorOverDuration += diff;
								}
								if (bEvents.bo.zoneParams && bEvents.bo.zoneParams.vaMs) {
									if (bEvents.bo.zoneParams.vaMs < bEvents.bannerInViewDuration) {
										aml.eventsQ.sendPixelsByEventType(bEvents,"confirmview");
									}
								}
								else if ( bEvents.bannerInViewDuration > 1000) {
									aml.eventsQ.sendPixelsByEventType(bEvents,"confirmview");
								}
							}
						}
						bEvents.lastCheckTime = time;
					}
				}
			},100);
		};


		aml.eventsQ.proceed = function () {
			var eTime = new Date().getTime();
			var q = aml.eventsQ;
			var evts = aml.eventsQ.evtArr;
			//aml.eventsQ.sended = aml.eventsQ.sended || {};
			for (var i in evts) {
				var bEvents = evts[i];
				aml.proceedSingle(bEvents);
			}

		};
		aml.proceedSingle = function(bEvents){
			if (!bEvents.bo || bEvents.wasSent) {
				return;
			}
			var bo = bEvents.bo;
			if (!bo.adId) {
				return;
			}
			bEvents.wasSent = true;
			//var uT = aml.invPathT + '/view.aspx?type=10&item=' + bo.adId + '&pvdur=' + bEvents.pageViewDuration + '&pfdur=' + bEvents.pageFocusDuration + '&avdur=' + bEvents.bannerInViewDuration + '&codur=' + bEvents.bannerCursorOverDuration + "&exdur=" + 0;
			var uB = aml.invPathB + '/view.aspx?type=10&item=' + bo.adId + '&pvdur=' + bEvents.pageViewDuration + '&pfdur=' + bEvents.pageFocusDuration + '&avdur=' + bEvents.bannerInViewDuration + '&codur=' + bEvents.bannerCursorOverDuration + "&exdur=" + 0;
			aml.sendPixel(uB);
			//aml.eventsQ.sended[i] = 1;
		};
		aml.style = function(id,params){
			var elem = document.getElementById(id);
			var elem2 = elem.getElementsByTagName('*')[0];
			if (elem && elem2 && params) {
				for (var key in params) {
					if (params.hasOwnProperty(key)) {
						try{
							elem.style[key] = params[key];
							elem2.style[key] = params[key];
						} catch(_error){}
					}
				}
			}
		};
		aml.HTML5Sources = [];
		aml.messageListener = function(message){
			var data = message.data;
			try {
				data = JSON.parse(data);
			}catch (_error){}
			if (data.HTML5API) {
				var api = data.HTML5API;
				var source = message.source;
				var index = aml.HTML5Sources.indexOf(source);
				var sourceObj;
				if (index === -1) {
					sourceObj = {};
					aml.HTML5Sources.push(source);
					aml.HTML5Sources.push(sourceObj);
				} else {
					sourceObj = aml.HTML5Sources[index + 1];
				}
				if (api.call) {
					var callArr = api.call;
					for (var i = 0, ln = callArr.length; i < ln; i++) {
						Function.call(window,'aml','cml','tween','h2c','sw','self','args',"" +
						"var result = " + callArr[i].method + ".apply(this,args);" +
						"if (result && result.toString && result.toString() === '[object Object]'){" +
						"	for (var key in result) {" +
						"		if (result.hasOwnProperty(key)){" +
						"			self[key] = result[key];" +
						"		}" +
						"	}" +
						"}" +
						"").call(source,aml,aml.cml,aml.TweenMax,aml.html2canvas,message.source,sourceObj,callArr[i].arguments || []);
					}
				}
			}
		};
		aml.helpers.attach(window,'message',aml.messageListener);
		//aml.serveSlots();
		setInterval(function(){
			aml.serveSlots();
			aml.proceedSPResponse();
		},100);
		return aml;
	}
);

