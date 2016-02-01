window.amSlots = window.amSlots || [];
if (window.admixZArr && window.admixZArr.length > 0) {
	for (var i = 0, ln = window.admixZArr.length; i < ln; i++) {
		var clone = {};
		if (window.admixZArr[i].z) clone.z = window.admixZArr[i].z;
		if (window.admixZArr[i].item) clone.item = window.admixZArr[i].item;
		if (window.admixZArr[i].ph) clone.ph = window.admixZArr[i].ph;
		if (window.admixZArr[i].renderedCallback) clone.renderedCallback = window.admixZArr[i].renderedCallback;
		clone.i = "inv-nets";
		window.amSlots.push(clone);
	};
};
window.admixZArr = {
	"push" : function(obj) {
		obj.i = 'inv-nets';		return window.amSlots.push(obj);
	}
};
window.admixSender = 'admixerold';
window.admixerSm = window.admixerSm || {};
var _proto = location.protocol === 'https:' ? 'https:' : 'http:';
window.amCPath = window.amCPath || (_proto + '//cdn.admixer.net/');
admixerSm.start = function(){};
if (!window.amlInsert) {
	window.amCPath = window.amCPath.replace(/az703203\.vo\.msecnd\.net/,'cdn.admixer.net');
	var vc = document.createElement("script");
	vc.async = true;
	vc.src =  window.amCPath + 'scripts3/require.js';//loaderPath;
	vc.setAttribute('data-main',window.amCPath + 'scripts3/r/require-apsm.js');
	var node = document.getElementsByTagName('script')[0];
	node.parentNode.insertBefore(vc, node);
}
