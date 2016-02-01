admixDefine([],function(){
	return function (_b) {
		//window.onerror = function(_error){alert(_error)};
		var w = window;
		var d = document;
		var aml = admixerML;
		var encode = aml.helpers.encodeUrl;
		var decode = aml.helpers.decodeUrl;
		var getBlock = aml.cml.getLocalFlashHtml;
		var prevent = aml.helpers.preventDefault;
		var getMain = aml.cml.getLocalMain;
		var register = aml.eventsQ.registerRender;
		var disableScroll = aml.helpers.disableScroll;
		var enableScroll = aml.helpers.enableScroll;
		if (!_b) {
			return;
		}
		var bo = _b;
		var phId = bo.phId;
		var track = function(command,arg){
			aml.API(command,arg,phId);
		};
		try{
			if (w.frameElement) {
				bo.ph = document.body;
			}
		} catch(_error){}
		track("adView");
		register(bo);
		try{
			if (w.frameElement) {
				var cw = null,ch = null;
				setInterval(function(){
					try{
						var _d = w.frameElement.contentWindow.document.getElementsByTagName('div');
						if (_d && _d[0]) {
							_d = _d[0];
							var changed = false;
							if ( (cw !== _d.offsetWidth || ch !== _d.offsetHeight) && _d.offsetWidth > 0 && _d.offsetHeight > 0) {
								cw = _d.offsetWidth;
								w.frameElement.style.width = cw + 'px';
								ch = _d.offsetHeight;
								w.frameElement.style.height = ch + 'px';
								changed = true;
							}
							if (changed) {
								aml.eventsQ.inViewCheck();
							}
						}
					}catch(_error){}
				},200);
			}
		} catch(_error){}
		if (bo.inIframe) {
			var _ph = document.getElementById(bo.phId);
			_ph.innerHTML = '';
			_ph.appendChild(bo.iFrame);
			bo.iFrame.contentWindow.document.write(bo.code);
			bo.iFrame.contentWindow.document.close();
		}
		else {
			bo.iFrame.innerHTML = bo.code;
		}
	}
});