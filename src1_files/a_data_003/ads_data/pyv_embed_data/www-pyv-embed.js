(function(){var l=this;function m(a){a=a.split(".");for(var b=l,c;c=a.shift();)if(null!=b[c])b=b[c];else return null;return b}
function n(a){var b=typeof a;if("object"==b)if(a){if(a instanceof Array)return"array";if(a instanceof Object)return b;var c=Object.prototype.toString.call(a);if("[object Window]"==c)return"object";if("[object Array]"==c||"number"==typeof a.length&&"undefined"!=typeof a.splice&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("splice"))return"array";if("[object Function]"==c||"undefined"!=typeof a.call&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("call"))return"function"}else return"null";
else if("function"==b&&"undefined"==typeof a.call)return"object";return b}
function aa(a){return null!=a}
function p(a){return"array"==n(a)}
function q(a){return"string"==typeof a}
function r(a){return"function"==n(a)}
function ba(a){var b=typeof a;return"object"==b&&null!=a||"function"==b}
function t(a,b){var c=Array.prototype.slice.call(arguments,1);return function(){var b=c.slice();b.push.apply(b,arguments);return a.apply(this,b)}}
var ca=Date.now||function(){return+new Date};
function u(a,b){var c=a.split("."),d=l;c[0]in d||!d.execScript||d.execScript("var "+c[0]);for(var f;c.length&&(f=c.shift());)c.length||void 0===b?d[f]?d=d[f]:d=d[f]={}:d[f]=b}
function v(a,b){function c(){}
c.prototype=b.prototype;a.C=b.prototype;a.prototype=new c;a.prototype.constructor=a;a.base=function(a,c,e){for(var g=Array(arguments.length-2),h=2;h<arguments.length;h++)g[h-2]=arguments[h];return b.prototype[c].apply(a,g)}}
;var w;var da=String.prototype.trim?function(a){return a.trim()}:function(a){return a.replace(/^[\s\xa0]+|[\s\xa0]+$/g,"")},ea=/&/g,fa=/</g,ga=/>/g,ha=/"/g,ia=/'/g,ka=/\x00/g,la=/[\x00&<>"']/;
function ma(a){var b=new RegExp("/".replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g,"\\$1").replace(/\x08/g,"\\x08"),"");return a.replace(b,"")}
function na(a,b){return a<b?-1:a>b?1:0}
;var oa=Array.prototype.indexOf?function(a,b,c){return Array.prototype.indexOf.call(a,b,c)}:function(a,b,c){c=null==c?0:0>c?Math.max(0,a.length+c):c;
if(q(a))return q(b)&&1==b.length?a.indexOf(b,c):-1;for(;c<a.length;c++)if(c in a&&a[c]===b)return c;return-1},pa=Array.prototype.forEach?function(a,b,c){Array.prototype.forEach.call(a,b,c)}:function(a,b,c){for(var d=a.length,f=q(a)?a.split(""):a,e=0;e<d;e++)e in f&&b.call(c,f[e],e,a)},qa=Array.prototype.filter?function(a,b,c){return Array.prototype.filter.call(a,b,c)}:function(a,b,c){for(var d=a.length,f=[],e=0,g=q(a)?a.split(""):a,h=0;h<d;h++)if(h in g){var k=g[h];
b.call(c,k,h,a)&&(f[e++]=k)}return f},ra=Array.prototype.map?function(a,b,c){return Array.prototype.map.call(a,b,c)}:function(a,b,c){for(var d=a.length,f=Array(d),e=q(a)?a.split(""):a,g=0;g<d;g++)g in e&&(f[g]=b.call(c,e[g],g,a));
return f};function sa(a){if(a.classList)return a.classList;a=a.className;return q(a)&&a.match(/\S+/g)||[]}
function ta(a){a.classList?a=a.classList.contains("playing"):(a=sa(a),a=0<=oa(a,"playing"));return a}
function ua(){var a=document.body;a.classList?a.classList.add("playing"):ta(a)||(a.className+=0<a.className.length?" playing":"playing")}
function va(){var a=document.body;a.classList?a.classList.remove("playing"):ta(a)&&(a.className=qa(sa(a),function(a){return"playing"!=a}).join(" "))}
;function x(a,b,c){for(var d in a)b.call(c,a[d],d,a)}
function wa(a){var b=xa,c;for(c in b)if(a.call(void 0,b[c],c,b))return c}
;var y;a:{var ya=l.navigator;if(ya){var za=ya.userAgent;if(za){y=za;break a}}y=""}function z(a){return-1!=y.indexOf(a)}
;function A(){this.f="";this.h=Aa}
A.prototype.I=!0;A.prototype.H=function(){return this.f};
function Ba(a){if(a instanceof A&&a.constructor===A&&a.h===Aa)return a.f;n(a);return"type_error:SafeUrl"}
var Ca=/^(?:(?:https?|mailto|ftp):|[^&:/?#]*(?:[/?#]|$))/i,Aa={};function Da(a){var b=new A;b.f=a;return b}
Da("about:blank");function B(){this.f="";this.h=Ea}
B.prototype.I=!0;B.prototype.H=function(){return this.f};
function Fa(a){if(a instanceof B&&a.constructor===B&&a.h===Ea)return a.f;n(a);return"type_error:SafeHtml"}
var Ea={};function C(a){var b=new B;b.f=a;return b}
C("<!DOCTYPE html>");C("");C("<br>");function D(a,b){this.x=void 0!==a?a:0;this.y=void 0!==b?b:0}
D.prototype.round=function(){this.x=Math.round(this.x);this.y=Math.round(this.y);return this};var Ga=z("Opera")||z("OPR"),E=z("Trident")||z("MSIE"),Ha=z("Edge"),Ia=Ha||E,F=z("Gecko")&&!(-1!=y.toLowerCase().indexOf("webkit")&&!z("Edge"))&&!(z("Trident")||z("MSIE"))&&!z("Edge"),G=-1!=y.toLowerCase().indexOf("webkit")&&!z("Edge");function Ja(){var a=y;if(F)return/rv\:([^\);]+)(\)|;)/.exec(a);if(Ha)return/Edge\/([\d\.]+)/.exec(a);if(E)return/\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/.exec(a);if(G)return/WebKit\/(\S+)/.exec(a)}
function Ka(){var a=l.document;return a?a.documentMode:void 0}
var La=function(){if(Ga&&l.opera){var a;var b=l.opera.version;try{a=b()}catch(c){a=b}return a}a="";(b=Ja())&&(a=b?b[1]:"");return E&&(b=Ka(),b>parseFloat(a))?String(b):a}(),Ma={};
function K(a){var b;if(!(b=Ma[a])){b=0;for(var c=da(String(La)).split("."),d=da(String(a)).split("."),f=Math.max(c.length,d.length),e=0;0==b&&e<f;e++){var g=c[e]||"",h=d[e]||"",k=RegExp("(\\d*)(\\D*)","g"),H=RegExp("(\\d*)(\\D*)","g");do{var I=k.exec(g)||["","",""],J=H.exec(h)||["","",""];if(0==I[0].length&&0==J[0].length)break;b=na(0==I[1].length?0:parseInt(I[1],10),0==J[1].length?0:parseInt(J[1],10))||na(0==I[2].length,0==J[2].length)||na(I[2],J[2])}while(0==b)}b=Ma[a]=0<=b}return b}
var Na=l.document,Oa=Na&&E?Ka()||("CSS1Compat"==Na.compatMode?parseInt(La,10):5):void 0;!F&&!E||E&&9<=+Oa||F&&K("1.9.1");E&&K("9");function Pa(a,b){var c;b instanceof A?c=b:(c=b,c instanceof A||(c=c.I?c.H():String(c),Ca.test(c)||(c="about:invalid#zClosurez"),c=Da(c)));a.href=Ba(c)}
;function L(a){return 9==a.nodeType?a:a.ownerDocument||a.document}
function Qa(a){return Ra(a,function(a){if(a="A"==a.nodeName)a=!0;return a},void 0)}
function Ra(a,b,c){for(var d=0;a&&(null==c||d<=c);){if(b(a))return a;a=a.parentNode;d++}return null}
function M(a){this.f=a||l.document||document}
M.prototype.createElement=function(a){return this.f.createElement(a)};
M.prototype.contains=function(a,b){if(!a||!b)return!1;if(a.contains&&1==b.nodeType)return a==b||a.contains(b);if("undefined"!=typeof a.compareDocumentPosition)return a==b||!!(a.compareDocumentPosition(b)&16);for(;b&&a!=b;)b=b.parentNode;return b==a};var Sa=m("yt.dom.getNextId_");if(!Sa){Sa=function(){return++Ta};
u("yt.dom.getNextId_",Sa);var Ta=0};var N=window.yt&&window.yt.config_||window.ytcfg&&window.ytcfg.data_||{};u("yt.config_",N);u("yt.tokens_",window.yt&&window.yt.tokens_||{});var Ua=window.yt&&window.yt.msgs_||m("window.ytcfg.msgs")||{};u("yt.msgs_",Ua);function Va(a){Wa(N,arguments)}
function O(a,b){return a in N?N[a]:b}
function Xa(a){return a&&window.yterr?function(){try{return a.apply(this,arguments)}catch(d){var b=d,c=m("yt.logging.errors.log");c?c(b,void 0):(c=O("ERRORS",[]),c.push([b,void 0]),Va("ERRORS",c));throw d;}}:a}
function Wa(a,b){if(1<b.length){var c=b[0];a[c]=b[1]}else{var d=b[0];for(c in d)a[c]=d[c]}}
;function P(a){this.type="";this.state=this.source=this.data=this.currentTarget=this.relatedTarget=this.target=null;this.charCode=this.keyCode=0;this.shiftKey=this.ctrlKey=this.altKey=!1;this.clientY=this.clientX=0;this.changedTouches=null;if(a=a||window.event){this.event=a;for(var b in a)b in Ya||(this[b]=a[b]);(b=a.target||a.srcElement)&&3==b.nodeType&&(b=b.parentNode);this.target=b;if(b=a.relatedTarget)try{b=b.nodeName?b:null}catch(c){b=null}else"mouseover"==this.type?b=a.fromElement:"mouseout"==
this.type&&(b=a.toElement);this.relatedTarget=b;this.clientX=void 0!=a.clientX?a.clientX:a.pageX;this.clientY=void 0!=a.clientY?a.clientY:a.pageY;this.keyCode=a.keyCode?a.keyCode:a.which;this.charCode=a.charCode||("keypress"==this.type?this.keyCode:0);this.altKey=a.altKey;this.ctrlKey=a.ctrlKey;this.shiftKey=a.shiftKey}}
P.prototype.preventDefault=function(){this.event&&(this.event.returnValue=!1,this.event.preventDefault&&this.event.preventDefault())};
P.prototype.stopPropagation=function(){this.event&&(this.event.cancelBubble=!0,this.event.stopPropagation&&this.event.stopPropagation())};
var Ya={stopImmediatePropagation:1,stopPropagation:1,preventMouseEvent:1,preventManipulation:1,preventDefault:1,layerX:1,layerY:1,scale:1,rotation:1,webkitMovementX:1,webkitMovementY:1};var xa=m("yt.events.listeners_")||{};u("yt.events.listeners_",xa);var Za=m("yt.events.counter_")||{count:0};u("yt.events.counter_",Za);function $a(a,b,c,d){return wa(function(f){return f[0]==a&&f[1]==b&&f[2]==c&&f[4]==!!d})}
function Q(a,b,c,d){if(a&&(a.addEventListener||a.attachEvent)){d=!!d;var f=$a(a,b,c,d);if(!f){var f=++Za.count+"",e=!("mouseenter"!=b&&"mouseleave"!=b||!a.addEventListener||"onmouseenter"in document),g;g=e?function(d){d=new P(d);if(!Ra(d.relatedTarget,function(b){return b==a}))return d.currentTarget=a,d.type=b,c.call(a,d)}:function(b){b=new P(b);
b.currentTarget=a;return c.call(a,b)};
g=Xa(g);xa[f]=[a,b,c,g,d];a.addEventListener?"mouseenter"==b&&e?a.addEventListener("mouseover",g,d):"mouseleave"==b&&e?a.addEventListener("mouseout",g,d):"mousewheel"==b&&"MozBoxSizing"in document.documentElement.style?a.addEventListener("MozMousePixelScroll",g,d):a.addEventListener(b,g,d):a.attachEvent("on"+b,g)}}}
;function ab(a){a=String(a);if(/^\s*$/.test(a)?0:/^[\],:{}\s\u2028\u2029]*$/.test(a.replace(/\\["\\\/bfnrtu]/g,"@").replace(/(?:"[^"\\\n\r\u2028\u2029\x00-\x08\x0a-\x1f]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)[\s\u2028\u2029]*(?=:|,|]|}|$)/g,"]").replace(/(?:^|:|,)(?:[\s\u2028\u2029]*\[)+/g,"")))try{return eval("("+a+")")}catch(b){}throw Error("Invalid JSON string: "+a);}
;function bb(){}
var cb=[];function R(a){var b=db;if(a<b.j){a+=b.l;var c=b.f[a];return c===cb?b.f[a]=[]:c}c=b.h[a];return c===cb?b.h[a]=[]:c}
bb.prototype.toString=function(){return this.f.toString()};function eb(a){a||(a=[]);this.l=-1;this.f=a;a:{if(this.f.length){a=this.f.length-1;var b=this.f[a];if(b&&"object"==typeof b&&!p(b)){this.j=a- -1;this.h=b;break a}}this.j=Number.MAX_VALUE}}
v(eb,bb);function fb(a){fb[" "](a);return a}
fb[" "]=function(){};function gb(a,b){for(var c in a)Object.prototype.hasOwnProperty.call(a,c)&&b.call(void 0,a[c],c,a)}
function ib(){var a=jb;if(!a)return"";var b=/.*[&#?]google_debug(=[^&]*)?(&.*)?$/;try{var c=b.exec(decodeURIComponent(a));if(c)return c[1]&&1<c[1].length?c[1].substring(1):"true"}catch(d){}return""}
;function kb(a,b,c){a.addEventListener?a.addEventListener(b,c,!1):a.attachEvent&&a.attachEvent("on"+b,c)}
;function lb(a,b,c,d,f,e){try{if((d?a.j:Math.random())<(f||a.h)){var g=a.f+b+nb(c),g=g.substring(0,2E3);"undefined"===typeof e?ob(g):ob(g,e)}}catch(h){}}
function nb(a){var b="";gb(a,function(a,d){if(0===a||a)b+="&"+d+"="+encodeURIComponent(String(a))});
return b}
function ob(a,b){l.google_image_requests||(l.google_image_requests=[]);var c=l.document.createElement("img");if(b){var d=function(a){b(a);a=d;c.removeEventListener?c.removeEventListener("load",a,!1):c.detachEvent&&c.detachEvent("onload",a);a=d;c.removeEventListener?c.removeEventListener("error",a,!1):c.detachEvent&&c.detachEvent("onerror",a)};
kb(c,"load",d);kb(c,"error",d)}c.src=a;l.google_image_requests.push(c)}
;function pb(a,b,c){this.m=a;this.l=b;this.f=c;this.j=this.h}
function qb(a,b,c){this.message=a;this.f=b||"";this.h=c||-1}
function rb(a,b){var c;try{c=b()}catch(e){var d=a.f;try{var f=sb(e),d=a.j.call(a,"osd_proto::reqm_int",f,void 0,void 0)}catch(g){a.h("pAR",g)}if(!d)throw e;}finally{}return c}
function tb(a){var b=ub;return function(){var c=arguments;return rb(b,function(){return a.apply(void 0,c)})}}
pb.prototype.h=function(a,b,c,d,f){var e={};e.context=a;b instanceof qb||(b=sb(b));e.msg=b.message.substring(0,512);b.f&&(e.file=b.f);0<b.h&&(e.line=b.h.toString());a=l.document;e.url=a.URL.substring(0,512);e.ref=a.referrer.substring(0,512);if(d)try{d(e)}catch(g){}lb(this.m,f||this.l,e,!1,c);return this.f};
function sb(a){var b=a.toString();a.name&&-1==b.indexOf(a.name)&&(b+=": "+a.name);a.message&&-1==b.indexOf(a.message)&&(b+=": "+a.message);if(a.stack){var c=a.stack,d=b;try{-1==c.indexOf(d)&&(c=d+"\n"+c);for(var f;c!=f;)f=c,c=c.replace(/((https?:\/..*\/)[^\/:]*:\d+(?:.|\n)*)\2/,"$1");b=c.replace(/\n */g,"\n")}catch(e){b=d}}return new qb(b,a.fileName,a.lineNumber)}
;var vb=document,S=window;var wb,ub;wb=new function(){this.f="http"+("http:"===S.location.protocol?"":"s")+"://pagead2.googlesyndication.com/pagead/gen_204?id=";this.h=.01;this.j=Math.random()};
ub=new pb(wb,"jserror",!0);var xb=/^(?:([^:/?#.]+):)?(?:\/\/(?:([^/?#]*)@)?([^/#?]*?)(?::([0-9]+))?(?=[/#?]|$))?([^?#]+)?(?:\?([^#]*))?(?:#(.*))?$/;function yb(a){return a?decodeURI(a):a}
function zb(a,b,c,d){for(var f=c.length;0<=(b=a.indexOf(c,b))&&b<d;){var e=a.charCodeAt(b-1);if(38==e||63==e)if(e=a.charCodeAt(b+f),!e||61==e||38==e||35==e)return b;b+=f+1}return-1}
var Ab=/#|$/,Bb=/[?&]($|#)/;var Cb=[0,2,1],Db=null;function Eb(){var a=window.event||Db;if(!a)return null;var b;(b=a.which?1<<Cb[a.which-1]:a.button)&&a.shiftKey&&(b|=8);b&&a.altKey&&(b|=16);b&&a.ctrlKey&&(b|=32);return b}
document.addEventListener&&document.addEventListener("mousedown",function(a){Db=a},!0);
window.mb=function(a){if(a){var b=Eb();if(b)if(window.css)css(a.id,"mb",b,void 0,void 0);else if(a){var c=a.href,d=c.indexOf("&mb=");if(0>d)b=c+"&mb="+b;else var d=d+4,f=c.indexOf("&",d),b=0<=f?c.substring(0,d)+b+c.substring(f):c.substring(0,d)+b;a.href=2E3<b.length?c:b}}};function T(){this.j=this.j;this.f=this.f}
T.prototype.j=!1;T.prototype.dispose=function(){this.j||(this.j=!0,this.D())};
T.prototype.D=function(){if(this.f)for(;this.f.length;)this.f.shift()()};
function Fb(a){a&&"function"==typeof a.dispose&&a.dispose()}
;var Gb=!E||9<=+Oa,Hb=E&&!K("9");!G||K("528");F&&K("1.9b")||E&&K("8")||Ga&&K("9.5")||G&&K("528");F&&!K("8")||E&&K("9");function Ib(a,b){this.type=a;this.currentTarget=this.target=b;this.defaultPrevented=this.h=!1}
Ib.prototype.stopPropagation=function(){this.h=!0};
Ib.prototype.preventDefault=function(){this.defaultPrevented=!0};function U(a,b){Ib.call(this,a?a.type:"");this.relatedTarget=this.currentTarget=this.target=null;this.charCode=this.keyCode=this.button=this.screenY=this.screenX=this.clientY=this.clientX=0;this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1;this.f=this.state=null;a&&this.init(a,b)}
v(U,Ib);
U.prototype.init=function(a,b){var c=this.type=a.type,d=a.changedTouches?a.changedTouches[0]:null;this.target=a.target||a.srcElement;this.currentTarget=b;var f=a.relatedTarget;if(f){if(F){var e;a:{try{fb(f.nodeName);e=!0;break a}catch(g){}e=!1}e||(f=null)}}else"mouseover"==c?f=a.fromElement:"mouseout"==c&&(f=a.toElement);this.relatedTarget=f;null===d?(this.clientX=void 0!==a.clientX?a.clientX:a.pageX,this.clientY=void 0!==a.clientY?a.clientY:a.pageY,this.screenX=a.screenX||0,this.screenY=a.screenY||
0):(this.clientX=void 0!==d.clientX?d.clientX:d.pageX,this.clientY=void 0!==d.clientY?d.clientY:d.pageY,this.screenX=d.screenX||0,this.screenY=d.screenY||0);this.button=a.button;this.keyCode=a.keyCode||0;this.charCode=a.charCode||("keypress"==c?a.keyCode:0);this.ctrlKey=a.ctrlKey;this.altKey=a.altKey;this.shiftKey=a.shiftKey;this.metaKey=a.metaKey;this.state=a.state;this.f=a;a.defaultPrevented&&this.preventDefault()};
U.prototype.stopPropagation=function(){U.C.stopPropagation.call(this);this.f.stopPropagation?this.f.stopPropagation():this.f.cancelBubble=!0};
U.prototype.preventDefault=function(){U.C.preventDefault.call(this);var a=this.f;if(a.preventDefault)a.preventDefault();else if(a.returnValue=!1,Hb)try{if(a.ctrlKey||112<=a.keyCode&&123>=a.keyCode)a.keyCode=-1}catch(b){}};var Jb="closure_listenable_"+(1E6*Math.random()|0),Kb=0;function Lb(a,b,c,d,f){this.listener=a;this.f=null;this.src=b;this.type=c;this.B=!!d;this.h=f;this.key=++Kb;this.o=this.A=!1}
function Mb(a){a.o=!0;a.listener=null;a.f=null;a.src=null;a.h=null}
;function Nb(a){this.src=a;this.f={};this.h=0}
Nb.prototype.remove=function(a,b,c,d){a=a.toString();if(!(a in this.f))return!1;var f=this.f[a];b=Ob(f,b,c,d);return-1<b?(Mb(f[b]),Array.prototype.splice.call(f,b,1),0==f.length&&(delete this.f[a],this.h--),!0):!1};
Nb.prototype.removeAll=function(a){a=a&&a.toString();var b=0,c;for(c in this.f)if(!a||c==a){for(var d=this.f[c],f=0;f<d.length;f++)++b,Mb(d[f]);delete this.f[c];this.h--}return b};
function Ob(a,b,c,d){for(var f=0;f<a.length;++f){var e=a[f];if(!e.o&&e.listener==b&&e.B==!!c&&e.h==d)return f}return-1}
;var Pb="closure_lm_"+(1E6*Math.random()|0),Qb={},Rb=0;
function Sb(a,b,c,d,f){if(p(b)){for(var e=0;e<b.length;e++)Sb(a,b[e],c,d,f);return null}c=Tb(c);if(a&&a[Jb])a=Ub(a,b,c,d,f);else{e=c;if(!b)throw Error("Invalid event type");c=!!d;var g=Vb(a);g||(a[Pb]=g=new Nb(a));var h=g,k=b.toString(),g=h.f[k];g||(g=h.f[k]=[],h.h++);var H=Ob(g,e,d,f);-1<H?(d=g[H],d.A=!1):(d=new Lb(e,h.src,k,!!d,f),d.A=!1,g.push(d));if(!d.f){f=Wb();d.f=f;f.src=a;f.listener=d;if(a.addEventListener)a.addEventListener(b.toString(),f,c);else if(a.attachEvent)a.attachEvent(Xb(b.toString()),
f);else throw Error("addEventListener and attachEvent are unavailable.");Rb++}a=d}return a}
function Wb(){var a=Yb,b=Gb?function(c){return a.call(b.src,b.listener,c)}:function(c){c=a.call(b.src,b.listener,c);
if(!c)return c};
return b}
function Zb(a){if("number"!=typeof a&&a&&!a.o){var b=a.src;if(b&&b[Jb])b.f(a);else{var c=a.type,d=a.f;b.removeEventListener?b.removeEventListener(c,d,a.B):b.detachEvent&&b.detachEvent(Xb(c),d);Rb--;if(c=Vb(b)){var d=a.type,f;if(f=d in c.f){f=c.f[d];var e=oa(f,a),g;(g=0<=e)&&Array.prototype.splice.call(f,e,1);f=g}f&&(Mb(a),0==c.f[d].length&&(delete c.f[d],c.h--));0==c.h&&(c.src=null,b[Pb]=null)}else Mb(a)}}}
function Xb(a){return a in Qb?Qb[a]:Qb[a]="on"+a}
function $b(a,b,c,d){var f=!0;if(a=Vb(a))if(b=a.f[b.toString()])for(b=b.concat(),a=0;a<b.length;a++){var e=b[a];e&&e.B==c&&!e.o&&(e=ac(e,d),f=f&&!1!==e)}return f}
function ac(a,b){var c=a.listener,d=a.h||a.src;a.A&&Zb(a);return c.call(d,b)}
function Yb(a,b){if(a.o)return!0;if(!Gb){var c=b||m("window.event"),d=new U(c,this),f=!0;if(!(0>c.keyCode||void 0!=c.returnValue)){a:{var e=!1;if(0==c.keyCode)try{c.keyCode=-1;break a}catch(k){e=!0}if(e||void 0==c.returnValue)c.returnValue=!0}c=[];for(e=d.currentTarget;e;e=e.parentNode)c.push(e);for(var e=a.type,g=c.length-1;!d.h&&0<=g;g--){d.currentTarget=c[g];var h=$b(c[g],e,!0,d),f=f&&h}for(g=0;!d.h&&g<c.length;g++)d.currentTarget=c[g],h=$b(c[g],e,!1,d),f=f&&h}return f}return ac(a,new U(b,this))}
function Vb(a){a=a[Pb];return a instanceof Nb?a:null}
var bc="__closure_events_fn_"+(1E9*Math.random()>>>0);function Tb(a){if(r(a))return a;a[bc]||(a[bc]=function(b){return a.handleEvent(b)});
return a[bc]}
;function V(a){T.call(this);this.l=a;this.h={}}
v(V,T);var cc=[];function Ub(a,b,c,d,f){p(c)||(c&&(cc[0]=c.toString()),c=cc);for(var e=0;e<c.length;e++){var g=Sb(b,c[e],d||a.handleEvent,f||!1,a.l||a);if(!g)break;a.h[g.key]=g}return a}
V.prototype.removeAll=function(){x(this.h,function(a,b){this.h.hasOwnProperty(b)&&Zb(a)},this);
this.h={}};
V.prototype.D=function(){V.C.D.call(this);this.removeAll()};
V.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented");};function W(a,b,c){T.call(this);this.l=a;this.F=b;this.J=c;this.v=0;this.h={};this.m=new V(this);a=t(Fb,this.m);this.j?a.call(void 0):(this.f||(this.f=[]),this.f.push(a));dc(this)}
v(W,T);function dc(a){pa(a.J,function(a){Ub(this.m,a.element,"mousedown",this.K,!0);Ub(this.m,a.element,"mouseup",t(this.M,a),!0)},a);
Ub(a.m,a.F,"mouseenter",a.L,void 0)}
function ec(a,b){x(a.h,function(a,d){for(var f=b,e=f.search(Ab),g=0,h,k=[];0<=(h=zb(f,g,d,e));)k.push(f.substring(g,h)),g=Math.min(f.indexOf("&",h)+1||e,e);k.push(f.substr(g));f=[k.join("").replace(Bb,"$1"),"&",d];null!=a&&f.push("=",encodeURIComponent(String(a)));f[1]&&(e=f[0],g=e.indexOf("#"),0<=g&&(f.push(e.substr(g)),f[0]=e=e.substr(0,g)),g=e.indexOf("?"),0>g?f[1]="?":g==e.length-1&&(f[1]=void 0));b=f.join("")});
return b}
W.prototype.K=function(){this.G=ca()};
W.prototype.M=function(a,b){var c=a.element;1==(this.l&1)&&(0==this.v&&this.v++,this.h.nm=this.v);2==(this.l&2)&&(this.h.nb=a.N);if(8==(this.l&8)){var d=this.F,f=L(d),e=new D(0,0),g;g=f?L(f):document;var h;(h=!E||9<=+Oa)||(h="CSS1Compat"==(g?new M(L(g)):w||(w=new M)).f.compatMode);if(d!=(h?g.documentElement:g.body)){var k;b:{try{k=d.getBoundingClientRect()}catch(H){k={left:0,top:0,right:0,bottom:0};break b}E&&d.ownerDocument.body&&(d=d.ownerDocument,k.left-=d.documentElement.clientLeft+d.body.clientLeft,
k.top-=d.documentElement.clientTop+d.body.clientTop)}d=(f?new M(L(f)):w||(w=new M)).f;f=d.scrollingElement?d.scrollingElement:G||"CSS1Compat"!=d.compatMode?d.body||d.documentElement:d.documentElement;d=d.parentWindow||d.defaultView;f=E&&K("10")&&d.pageYOffset!=f.scrollTop?new D(f.scrollLeft,f.scrollTop):new D(d.pageXOffset||f.scrollLeft,d.pageYOffset||f.scrollTop);e.x=k.left+f.x;e.y=k.top+f.y}this.h.nx=Math.round(b.clientX-e.x);this.h.ny=Math.round(b.clientY-e.y)}16==(this.l&16)&&null!=this.G&&(e=
ca()-this.G,this.h.clkt=e);512==(this.l&512)&&(e=Eb())&&(this.h.mb=e);"A"==c.tagName.toUpperCase()&&Pa(c,ec(this,c.href))};
W.prototype.L=function(){this.v++};if(vb&&vb.URL){var jb=vb.URL,fc=!(jb&&0<ib().length);ub.f=fc};function gc(a,b){this.h=a||0;this.f=b||""}
gc.prototype.match=function(a){return(this.h||this.f)&&(a.h||a.f)?this.f||a.f?this.f==a.f:this.h||a.h?this.h==a.h:!1:!1};
gc.prototype.toString=function(){var a=""+this.h;this.f&&(a+="-"+this.f);return a};
function hc(a){var b=[];x(a,function(a,d){var f=encodeURIComponent(d),e=a;q(e)&&(e=encodeURIComponent(e));b.push(f+"="+e)});
return b.join("\n")}
var ic=0,jc=0;function kc(){var a=0,b=S;try{if(b&&b.Goog_AdSense_getAdAdapterInstance)return b}catch(c){}for(;b&&5>a;){try{if(b.google_osd_static_frame)return b}catch(c){}try{if(b.aswift_0&&b.aswift_0.google_osd_static_frame)return b.aswift_0}catch(c){}a++;b=b!=b.parent?b.parent:null}return null}
function lc(a,b,c,d,f){if(10<jc)S.clearInterval(ic);else if(++jc,S.postMessage&&(b.h||b.f)){var e=kc();if(e){var g={};b.h&&(g[4]=b.h);b.f&&(g[12]=b.f);g[0]="goog_request_monitoring";g[6]=a;g[16]=c;d&&d.length&&(g[17]=d.join(","));f&&(g[19]=f);try{var h=hc(g);e.postMessage(h,"*")}catch(k){}}}}
;function mc(a,b,c){if(c.data){var d=c.data;if(q(d)){c={};for(var d=d.split("\n"),f=0;f<d.length;f++){var e=d[f].indexOf("=");if(!(0>=e)){var g=+d[f].substr(0,e),e=d[f].substr(e+1);switch(g){case 5:case 8:case 11:case 15:case 16:case 18:e="true"==e;break;case 4:case 7:case 6:case 14:case 20:case 21:case 22:case 23:e=+e;break;case 3:case 19:if(r(decodeURIComponent))try{e=decodeURIComponent(e)}catch(h){throw Error("Error: URI malformed: "+e);}break;case 17:e=ra(decodeURIComponent(e).split(","),Number)}c[g]=
e}}c=c[0]?c:null}else c=null;c&&(d=new gc(c[4],c[12]),a&&a.match(d)&&"goog_update_data"==c[0]&&(a=c[7],"number"==typeof a&&b(a)))}}
;var nc={"pyv-embed":2,"pyv-embed-container":2,"pyv-embed-channel-image-overlay":19,"pyv-embed-channel-name-overlay":20,"pyv-embed-channel-banner-overlay":9,"pyv-embed-overlay":21,"pyv-embed-headline-overlay":0,"pyv-embed-description-overlay":7},oc=!1,pc=!1,X=null,db=new eb,Y=null,qc=!1,rc=null,sc=null;function tc(){var a=0;Z("osd-1")?a=.01:Z("osd-25")?a=.25:Z("osd-50")?a=.5:Z("osd-75")&&(a=.75);null!=sc&&qc&&!oc&&(sc>=a?Y.playVideo():Y.pauseVideo())}
function uc(){var a=15E3-1E3*Y.getCurrentTime();return 0<=a?a:0}
function vc(){Y.mute();Z("osd")?(qc=!0,tc()):Y.playVideo()}
function wc(a){if(Z("osd"))switch(a.data){case YT.PlayerState.PLAYING:null===X&&(0==uc()?xc():(ua(),X=l.setTimeout(xc,uc())));break;case YT.PlayerState.PAUSED:null!=X&&(l.clearTimeout(X),X=null);0==uc()&&xc();break;case YT.PlayerState.ENDED:va(),oc=!0}else switch(a.data){case YT.PlayerState.PLAYING:pc||(ua(),l.setTimeout(xc,15E3),pc=!0);break;case YT.PlayerState.ENDED:va()}}
function xc(){va();oc=!0;Y.stopVideo()}
function yc(){var a=O("PLAYER_CONFIG",void 0),b=O("VIDEO_ID",void 0),c=O("HOST",void 0);ba(a)&&q(b)&&ba(YT)&&r(YT.ready)&&r(YT.Player)&&YT.ready(function(){var d={height:"100%",width:"100%",videoId:b,playerVars:a,events:{onReady:vc,onStateChange:wc}};q(c)&&(d.host=c);Y=new YT.Player("iframe-player",d)})}
function zc(a){sc=a;null===Y?yc():tc()}
function Ac(){var a=R(1);yb(a.match(xb)[3]||null)||(0==a.lastIndexOf("/",0)&&(a=ma(a)),a="https://googleads.g.doubleclick.net/"+a);var b=[],c=0;aa(R(2))&&(c=R(2));x(nc,function(c,f){var e;e=document;if((e=q(f)?e.getElementById(f):f)&&(Z("background_click")||document.body.id!=f)&&(Z("container_click")||"pyv-embed-container"!=f)){var g=Z("background_click")||Z("container_click");"a"==e.nodeName.toLowerCase()?(Pa(e,a),g||Q(e,"click",Bc,!0)):(Q(e,"click",t(Cc,a)),Q(e,"click",Bc,!0));b.push({element:e,
N:c})}});
document.body&&!Z("dss")&&(rc=new W(c,document.body,b))}
function Z(a){var b=O("RENDERING_EXPERIMENTS")||[];return p(b)&&0<=oa(b,a)}
function Cc(a,b){var c;c=b||window.event;c=c.target||c.srcElement;3==c.nodeType&&(c=c.parentNode);if(a&&c&&!Qa(c)){c=b||window.event;c.cancelBubble=!0;c.stopPropagation&&c.stopPropagation();null!=rc&&(a=ec(rc,a));var d=a,f={target:"_blank"};c=window;var e;d instanceof A?e=Ba(d):e="undefined"!=typeof d.href?d.href:String(d);var d=f.target||d.target,g=[],h;for(h in f)switch(h){case "width":case "height":case "top":case "left":g.push(h+"="+f[h]);break;case "target":case "noreferrer":break;default:g.push(h+
"="+(f[h]?1:0))}h=g.join(",");if((z("iPhone")&&!z("iPod")&&!z("iPad")||z("iPad")||z("iPod"))&&c.navigator&&c.navigator.standalone&&d&&"_self"!=d)h=c.document.createElement("A"),h.setAttribute("href",e),h.setAttribute("target",d),f.noreferrer&&h.setAttribute("rel","noreferrer"),e=document.createEvent("MouseEvent"),e.initMouseEvent("click",!0,!0,c,1),h.dispatchEvent(e);else if(f.noreferrer){if(h=c.open("",d,h))Ia&&-1!=e.indexOf(";")&&(e="'"+e.replace(/'/g,"%27")+"'"),h.opener=null,la.test(e)&&(-1!=
e.indexOf("&")&&(e=e.replace(ea,"&amp;")),-1!=e.indexOf("<")&&(e=e.replace(fa,"&lt;")),-1!=e.indexOf(">")&&(e=e.replace(ga,"&gt;")),-1!=e.indexOf('"')&&(e=e.replace(ha,"&quot;")),-1!=e.indexOf("'")&&(e=e.replace(ia,"&#39;")),-1!=e.indexOf("\x00")&&(e=e.replace(ka,"&#0;"))),e=C('<META HTTP-EQUIV="refresh" content="0; url='+e+'">'),h.document.write(Fa(e)),h.document.close()}else c.open(e,d,h)}}
function Bc(){lb(wb,"pyv_user_click",{},!0,.1,void 0)}
;u("yt.setConfig",Va);u("yt.setMsg",function(a){Wa(Ua,arguments)});
Q(window,"load",function(){Z("osd")||yc()});
Q(window,"message",function(a){try{var b=ab(a.data)}catch(c){return}p(b)&&(db=new eb(b),aa(R(1))&&(Ac(),Z("osd")&&aa(R(3))&&(a=window,b=R(3),b=new gc(b,null),b.h||b.f)))&&(kb(a,"message",t(mc,b,zc)),ic=S.setInterval(tb(t(lc,2,b,void 0,void 0,void 0)),500))});})();
