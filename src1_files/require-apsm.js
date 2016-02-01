admixRequire.config({
	baseUrl: (window.amCPath || (location.protocol === 'https:' ? 'https:' : 'http:') + '//cdn.admixer.net/') + 'scripts3/r'
});
admixRequire(['apsm'],function(aml){
	window.admixerML = aml;
});