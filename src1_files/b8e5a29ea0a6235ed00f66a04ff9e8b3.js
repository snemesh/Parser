LoadOnDemand = function(passed_opts)
{
    var $ = jQuery;
    var $doc = $(document);
    var $win = $(window);
    
    this.defaultOpts = { progressClassName: 'in-process', triggerEvent:'click', triggerElSelector: false };

    var loader = this;
    
    this.process = function(passed_opts)
    {
        var opts = {};
        
        $.extend(opts, this.defaultOpts, passed_opts);
        
        if ( opts.triggerElSelector )
          {
            var nspace = '.to'+opts.triggerElSelector.replace('.','');
            
            switch( opts.triggerEvent )
            {
                case 'click':
                    
                $doc.on('click' + nspace,opts.triggerElSelector, function(event){  
                                          event.preventDefault();
                                          event.stopPropagation();
                                          $doc.off('click' + nspace);
                                          var clicked_el = $(this).addClass(opts.progressClassName);

                                          waitForIt = function()
                                          {
                                              if ( $(opts.waitForSelector).length )
                                                {
                                                      clearInterval(interval_mark);
                                                      setTimeout(function(){ clicked_el.removeClass(opts.progressClassName).trigger('click');  }, 50);
                                                };                                
                                          };

                                          var interval_mark = setInterval(waitForIt, 100);

                                          loader.loadAll(opts,$);
                                      });
                 break;                 
                 case 'scroll':
                            
                            var el = false;
                            
                            $win.on('scroll' + nspace, function(){
                                if ( !el && !$(opts.triggerElSelector).length ) return;
                                if ( !el ) el = $(opts.triggerElSelector);
                                var el_bottom = el.offset().top + el.height();
                                var docViewBottom = jQuery(window).scrollTop() + jQuery(window).height();
                                if ( el_bottom < docViewBottom ) 
                                { 
                                    $win.off('scroll' + nspace);
                                    loader.loadAll(opts,$);
                                } 

                       });                    
            }
          }
          
        else 
        {
                                  loader.loadAll(opts,$);          
        }
    };
    
    if ( passed_opts )
        {
            this.process(passed_opts);
        }
 

};

LoadOnDemand.prototype.loadScript = function(s_opts)
{
        var js = document.createElement('script');
            js.className = s_opts.className||'';

            if ( s_opts.attributes )
                {
                          var attrs = s_opts.attributes;  
                          for ( var i in attrs )
                            {
                                if (!attrs.hasOwnProperty(i)) return;
                                js.setAttribute(i,attrs[i]);  
                            }
                }

            js.src = s_opts.src;
            js.type = "text/javascript";

        var fjs = document.getElementsByTagName('script')[0];
        fjs.parentNode.insertBefore(js, fjs);     
};

LoadOnDemand.prototype.loadContent = function(c_opts, $)
{
    var src = c_opts.src||'./';
    var data = c_opts.data||{};
    var parentEl = c_opts.parentEl||$('body');
    var precedingEl = c_opts.precedingEl||false;
    var followingEl = c_opts.followingEl||false;
    $.post(src,data, function(data){ if ( precedingEl ) precedingEl.after(data);
                                     else if(followingEl) followingEl.before(data);
                                     else  parentEl.append(data);  });   
};

LoadOnDemand.prototype.loadAll = function(opts,$)
    {
      if ( opts.content )
        {
            this.loadContent(opts.content, $);
        };      
    
      if ( opts.scripts )
          {
              for( var i=0;i<opts.scripts.length;i++ )
                  {
                      this.loadScript(opts.scripts[i]);
                  }
          };        
    };
;jQuery(function($){

    var finlineDemandOptions = {
        triggerElSelector:'.js-finline-order-button, [href=#finlineOrder]',
        waitForSelector:'.js-finline-loader',
        scripts:[ { 'className' :"js-finline-loader",
                    'attributes':{ 'data-partner':36 },
                    'src'       :"http://partner.finline.com.ua/static/js/hotloader.min.js"}
               ]
    };

    new LoadOnDemand(finlineDemandOptions);

});


;jQuery(function($){
    var filter_switch = function(event)
                        {
                          var elt = $(this);

                          event.stopPropagation();
                          event.preventDefault();
                          
                          var group_class = 'group-'+elt.data('group');
                          
                          var all_blocks = $('.'+group_class).hide();
                          if (elt.hasClass('to-more'))
                              {
                                  
                                  var top_more = all_blocks.filter('.top-more-list,.top-more-title');
                                  
                                  if ( top_more.length )
                                      {
                                          top_more.show();
                                      }
                                  else
                                      {
                                        all_blocks.filter('.full-list,.full-title').show();
                                      }
                                  
                              }
                          if (elt.hasClass('to-full'))
                              {
                                  all_blocks.filter('.full-list,.full-title').show();                                  
                              }
                          if (elt.hasClass('to-top-main'))
                              {
                                 all_blocks.filter('.top-main-list,.top-main-title').show();
                              }                              
                        };
    
    $('div.all-filters').on('click','a.switcher',filter_switch);
    $('.scroll-pane').each(function(index,el){$(el).jScrollPane({scrollScreen:false});$(el).parent().hide();});
    
    $('a.switcher').show();
    
    $('.top-main-list').each(function(index,el)
                                {var el = $(el); 
                                 el.show(); 
                                 var linked_elts = $('.group-'+el.data('group')); 
                                 //console.log(linked_elts);
                                 linked_elts.filter('.full-list,.full-title').hide();
                                 linked_elts.filter('.top-main-title').show();
                                });
});
//======================= GA =======================
var HotlineGA = function(gd_title)
{
    this.view_complete = false;
    
    this.selectors = {  filter_button:".credits-online.bl_filter", 
                        side_button:".credits-online.page-catalog"};
    
    this.$filter_button = jQuery(this.selectors.filter_button); 
    this.$side_button   = jQuery(this.selectors.side_button);
    
    var self = this;
    
    this.track = function(location, action){ _gaq.push(['_trackEvent', 'Credit', action, 'catalog ' + location ]); };//gd_title
    
    if (this.$filter_button.length)
        {
            var fltr_btn_bottom = this.$filter_button.offset().top + this.$filter_button.height();
        
            this.$filter_button.click(function(ev){ if( ev&&ev.isTrigger ) return; self.track('filter','Click'); });
            jQuery(document).on('scroll', function(){  
                if ( self.view_complete ) return;
                                       
                 var docViewBottom = jQuery(window).scrollTop() + jQuery(window).height();               
                
                 if ( fltr_btn_bottom < docViewBottom ) 
                 { 
                     self.view_complete = true;
                     self.track('filter','View');
                 } 
                 
            });
        }
        
    if (this.$side_button.length)
        {
            this.$side_button.click(function(ev){ if( ev&&ev.isTrigger ) return; self.track('side','Click'); });
            this.track('side', 'View');
        }
        
        
};
;jQuery(function($){
    
    var $check_items = $('span[id^="gd_cmp_"]'),
        check_item_click = function(){
            var $this = jQuery(this);
            storeCookie($this.prev().get()[0]);
           var seriesid = $this.prev().data('seriesid');
           sndReq($this.prev().data('sectionid'), seriesid || 0);

           if ($this.prev().attr('checked'))
               jQuery('input[id="'+$this.attr('id')+'"]').not($this).attr('checked', 1).trigger('refresh');
           else
               jQuery('input[id="'+$this.attr('id')+'"]').not($this).removeAttr('checked').trigger('refresh');           
        };
    
    $check_items.each(function(index,elt){
        var $elt = $(elt),
            $checkbox = $elt.prev(),
            id = $checkbox.val(),
            $cmp_text = $elt.siblings('.compare-text'),
            $cmp_link = $elt.siblings('.compare-link').click(function(e){e.preventDefault();e.stopPropagation();cmp_move_to_page();}),
            $cmp_link_cnt = $cmp_link.find('.compare-link-cnt');
            $elt.click(check_item_click);
            
            $(document).on('compare.update', function(event, new_cnt, compared_items)
                                                    { 
                                                        $cmp_link_cnt.text(new_cnt);
                                                        
                                                        if ( $.inArray(id,compared_items) === -1 && $checkbox.is(':checked') )
                                                        {
                                                            $checkbox.attr('checked',false).trigger('refresh');
                                                        }
                                                        
                                                        if ( $checkbox.is(':checked')&&compared_items.length>0 )
                                                        {
                                                            $cmp_text.hide();
                                                            $cmp_link.show();
                                                        }
                                                        else
                                                        {
                                                            $cmp_text.show();
                                                            $cmp_link.hide();
                                                        }
                                                    });
    });
    
});

function sndReq(sid,series_id) {

    onlySndReq(sid,series_id);

    // if  toolbar function exists
    if (typeof(updToolbarCounters) === 'function')
    {
        toolbar_cnt_type = 'cmp';
        updToolbarTab();
    }
}
function onlySndReq(sid,series_id){
    series_id = series_id || 0;
    r = Math.round((Math.random() * (10000000 - 1)));
    http.open("get", "/aj/gd_cmp/" + sid + "/"+series_id+"/"+"?r=" + r);
    http.onreadystatechange = handleResponse;
    http.send(null);
}

function delCompareItem(obj,needUpdToolbar){
//    event.stopPropagation();
//    event.preventDefault();
    var delLink = jQuery(obj),
        dataParams = delLink.data();

    switch(true){
        case(dataParams.del_card_id === undefined):
        case(dataParams.del_series_id === undefined):
        case(dataParams.del_section_id === undefined):
            return false;
    }

    storeCookie({checked:false,value:dataParams.del_card_id});

    if(needUpdToolbar){
        sndReq(dataParams.del_section_id,dataParams.del_series_id);
    }else{
        onlySndReq(dataParams.del_section_id,dataParams.del_series_id);
    }
}

function handleResponse() {

    if(http.readyState === 4){

        response = http.responseText;
        document.getElementById("compare_it").innerHTML = response;
	var first_val_end_pos = response.indexOf("-->"),
            second_val_start_pos = first_val_end_pos + "--><!--".length;
        
        quantity_compared_items = response.substring(4, first_val_end_pos),
        compared_items_str = response.substring(second_val_start_pos, response.indexOf("-->",second_val_start_pos));
        
        
        jQuery(document).trigger('compare.update',[quantity_compared_items,compared_items_str.split('-')]);
    }
}

// ---------------

var quantity_compared_items = 0;

function storeCookie(cbox) {

    thecookie = readCookie("gd_cmp=");

    if (cbox.checked) {
        if (quantity_compared_items > 9) {

	    alert("ћожет быть выбрано не более 10 устройств");
	    v = "gd_cmp_" + cbox.value;
	    w = document.getElementById(v);
	    if (w) w.checked = false;
	    return;
	}
	var cookie_content = "gd_cmp" + "=" + thecookie + "," + cbox.value + "; path=/; domain="+hl_domain;
        document.cookie = cookie_content;
        
        updated_cookie = readCookie("gd_cmp=");
        
        if ( updated_cookie === thecookie )
        {
            cmp_remove_cookie('gd_cmp');
            document.cookie = cookie_content;
        }

    } else {

	newCookie = thecookie.replace("," + cbox.value, "");
	document.cookie = "gd_cmp" + "=" + newCookie + "; path=/; domain="+ hl_domain;

	/*v = "gd_cmp_" + cbox.value;
	w = document.getElementById(v);
	if (w) w.checked = false;*/
    }
}

function readCookie(theCookie) {

    var value = 0;
    var allcookies = document.cookie;
    var pos = allcookies.indexOf(theCookie);
    if (pos != -1) {

	var start = pos + theCookie.length;
	var end = allcookies.indexOf(";", start);
	if (end == -1) end = allcookies.length;
	var value = allcookies.substring(start, end);
	value = unescape(value);
    }
    return (value);
}

function removeCookie(id) {

    thecookie = readCookie("gd_cmp=");

    var arr = thecookie.split(',');
    var i = arr.indexOf(id);
    arr.splice(i,1);

    document.cookie = "gd_cmp" + "=" + arr.join(',') + "; path=/; domain="+ hl_domain;
}

function uncheckGoods(a) {

    b = a.split("-");
    for (i = 0; i < b.length; i++)
    {
        removeCookie(b[i]);
        //jQuery("input#gd_cmp_" + b[i]).attr('checked',false).trigger('refresh');
    }
    document.getElementById("compare_it").innerHTML = "";
    
    //jQuery(document).trigger('compare.update',[0,[]]);
}

//=======[ M A N A G E R ]=============================
CompareLinksManager = function(compare_limit,outer_cmp_ids)
{
 this.compareLimit = compare_limit;
 this.categs = {};
 this.init = function(){
                   var self = this;
                   jQuery('p.add-del').each(function(index,dom_elt){
                                                        var i = new CompareItem(index,dom_elt,self);
                                                        self.categs[i.categ]||(self.categs[i.categ] = new CompareCategory(i.categ,outer_cmp_ids[i.categ]));
                                                        self.categs[i.categ].addItem(i);
                                                        })
             }

 this.isAllowAdd = function(item){
    var categ_cnt = this.categCount(item.categ);
    return categ_cnt<this.compareLimit;
 }

 this.categCount = function(categ_id){
    return this.categs[categ_id].getCmpCount();
 }

 this.categRefresh = function(categ_id){
    this.categs[categ_id].refresh();
 }

 this.init();

}

//=======[ C A T E G O R Y ]===========================
CompareCategory = function(cat_id,outer_items)
{
  this.cat_id = cat_id;
  this.outer_items = outer_items||[];
  this.diff_cnt = this.outer_items.length||0;
  this.items=[];
}

CompareCategory.prototype.addItem = function(item){this.items.push(item)}

CompareCategory.prototype.getCmpCount = function(){
    var count = null;

    jQuery.each(this.items,function(index,item){count+=item.isCompared?1:0})

    return count+this.diff_cnt;
}

CompareCategory.prototype.refresh = function(){
    var cmp_count = this.getCmpCount();
    var go_txt = "(сравнить:" + cmp_count+")";
    var go_href = this.getCompareHref();
    jQuery.each(this.items,function(index,item)
                            {
                              if(item.isCompared&&cmp_count>1){
                                    jQuery(item.go_elt).html(go_txt).attr('href',go_href).show();

                                    jQuery(item.say_one_elt).hide();

                              }
                              if(item.isCompared&&cmp_count==1){
                                    jQuery(item.say_one_elt).show();
                                    jQuery(item.go_elt).hide();
                              }

                            });
}

CompareCategory.prototype.getCompareHref = function(){

    var href_items = [].concat(this.outer_items);
    jQuery.each(this.items,function(index,item){if(item.isCompared) href_items.push(item.cid)});

    return "/gd/"+this.cat_id+"/cmp/?s="+href_items.join('-');
}

//=======[ I T E M ]===================================
CompareItem = function(index,dom_elt,manager)
{
 this.manager = manager;
 this.container_elt = dom_elt;
 this.go_elt = jQuery(dom_elt).find('a.cmp_go');
 this.say_one_elt = jQuery(dom_elt).find('i.cmp_one');
 this.del_elt = jQuery(dom_elt).find('a.cmp_del');
 this.add_elt = jQuery(dom_elt).find('a.cmp_add');

 this.isCompared = this.initStatus();

 this.cid = this.getCid();
 this.categ = this.getCategory();

 this.initActions();

 }
CompareItem.prototype.getCid = function(){
    return jQuery(this.container_elt).attr('id').replace(/.*ci/,'');
}
CompareItem.prototype.getCategory = function(){
    return jQuery(this.container_elt).attr('id').replace(/ci.*/,'').replace('ca','');
}
CompareItem.prototype.initStatus = function(){
    return jQuery(this.container_elt).hasClass('Compared');
}

CompareItem.prototype.initActions = function(){
    var self = this;
    jQuery(this.add_elt).click(function(e){
                                  e.preventDefault();
                                  if (!self.manager.isAllowAdd(self)) {alert(' оличество товаров дл€ сравнени€ не может превышать '+self.manager.compareLimit);return};

                                  jQuery(self.add_elt).parent().hide();
                                  jQuery(self.del_elt).parent().show();

                                  self.isCompared = true;
                                  jQuery(self.container_elt).addClass('Compared');

                                  self.manager.categRefresh(self.categ);

                                  storeCookie({'checked':self.isCompared,'value':self.cid});
                                })
    jQuery(this.del_elt).click(function(e){
                                  e.preventDefault();

                                  jQuery(self.add_elt).parent().show();
                                  jQuery(self.del_elt).parent().hide();
                                  self.isCompared = false;
                                  jQuery(self.container_elt).removeClass('Compared');

                                  self.manager.categRefresh(self.categ);

                                  storeCookie({'checked':self.isCompared,'value':self.cid});

                                });
};

function cmp_remove_cookie(name)
{
    var date = new Date();
    document.cookie = name + '=; expires='+date.toGMTString()+';path=/';
}

function cmp_move_to_page()
{   
    var rg = /((http:\/\/(www\.)?)?\w+\.[\w-]+(\.[\w-]+)?\/[\w-]+\/([\w-]+)\/).*/,
    new_location = rg.exec(document.location.href)[1]+'cmp/?s='+compared_items_str;

    var win = window.open(new_location, "_blank");
    win.focus();
    //document.location = new_location;
};
var toolTipTimeLine = new Array(0, 1, 0, 0, 2);
var toolTipWindows = new Array();
var toolTipIid = setInterval('toolTipInterrupt()', 200);

function toolTipInterrupt() {
    if (toolTipWindows.length) {
	for (i = 0; i < toolTipWindows.length; i++) {
	    if (toolTipWindows[i][0] < toolTipTimeLine.length && toolTipWindows[i][3]) { // If it is not the end and running
		c = toolTipTimeLine[toolTipWindows[i][0]];
		if (c == 1) {
			var scroll = jQuery(document).scrollTop();
            subobj = document.getElementById(toolTipWindows[i][2]);
            //дл€ задачи 18818
			subobj.style.left = parseInt(toolTipGetPosOffset(toolTipWindows[i][1], "left")) +90 +toolTipWindows[i][4]+ "px";
			//subobj.style.left = jQuery(toolTipWindows[i][1]).position().left +20 +"px";
            subobj.style.top = parseInt(toolTipGetPosOffset(toolTipWindows[i][1], "top"))  -toolTipWindows[i][5]-scroll+ "px";
			//subobj.style.top = jQuery(toolTipWindows[i][1]).position().top - 13 + "px";
		    subobj.style.display = "block";
			subobj.style.position = "fixed";
			//subobj.style.position = "absolute";
            toolTipWindows[i][3] = 0;
		}
		if (c == 2) {
		    document.getElementById(toolTipWindows[i][2]).style.display = "none";
		}
		toolTipWindows[i][0]++;
	    }
	}
    }
}

function toolTipSet(curobj, subobj, leftoffset, topoffset) {
    flag = 1;
    if (toolTipWindows.length) { // Array is not empty
	for (i = 0; i < toolTipWindows.length; i++) {
	    if (toolTipWindows[i][2] == subobj) { // Array has line already
        //кр€калка
        toolTipWindows[i][1] = curobj;
        //кр€ кр€...
        
		if (toolTipWindows[i][0] == toolTipTimeLine.length) toolTipWindows[i][0] = 0; // End? Go to begin
		else toolTipWindows[i][0] = 1; // Middle? Go to nearly begin
		toolTipWindows[i][3] = 1; // Show must go on!
		flag = 0; // Do not add a new line
		break;
	    }
	}
    }
    if (flag) toolTipWindows[toolTipWindows.length] = new Array(0, curobj, subobj, 1, leftoffset, topoffset); // counter, curobj, subobj, running(1)/stopped(0)
}

function toolTipCount(subobj, what) {
    for (i = 0; i < toolTipWindows.length; i++) {
	if (toolTipWindows[i][2] == subobj) {
	    if (what == "stop") {
		toolTipWindows[i][3] = 0;
	    } else { // continue
		toolTipWindows[i][0] = 2;
		toolTipWindows[i][3] = 1;
	    }
	    break;
	}
    }
}

function toolTipGetPosOffset(overlay, offsettype) {
    //console.log(jQuery(overlay).offset().left);
    var totaloffset = (offsettype == "left") ? jQuery(overlay).offset().left : jQuery(overlay).offset().top;
    return totaloffset;
}

function toolTipShowAbove(curobj, subobj, leftoffset, additionalHeight){
    if(!additionalHeight){
        additionalHeight = 0;
    }
    var ownHeight = jQuery('#'+subobj).height();
    var targetHeight = jQuery(curobj).height();

    toolTipSet(curobj, subobj, leftoffset, ownHeight+targetHeight+additionalHeight);



};/*! jQuery Mobile v1.2.0 jquerymobile.com | jquery.org/license */
(function(a,b,c){typeof define=="function"&&define.amd?define(["jquery"],function(d){return c(d,a,b),d.mobile}):c(a.jQuery,a,b)})(this,document,function(a,b,c,d){(function(a){a.event.special.throttledresize={setup:function(){a(this).bind("resize",c)},teardown:function(){a(this).unbind("resize",c)}};var b=250,c=function(){f=(new Date).getTime(),g=f-d,g>=b?(d=f,a(this).trigger("throttledresize")):(e&&clearTimeout(e),e=setTimeout(c,b-g))},d=0,e,f,g})(a),function(a,c){a.extend(a.support,{orientation:"orientation"in b&&"onorientationchange"in b})}(a),function(a,b){function o(){var a=g();a!==h&&(h=a,d.trigger(e))}var d=a(b),e="orientationchange",f,g,h,i,j,k={0:!0,180:!0};if(a.support.orientation){var l=b.innerWidth||a(b).width(),m=b.innerHeight||a(b).height(),n=50;i=l>m&&l-m>n,j=k[b.orientation];if(i&&j||!i&&!j)k={"-90":!0,90:!0}}a.event.special.orientationchange=a.extend({},a.event.special.orientationchange,{setup:function(){if(a.support.orientation&&!a.event.special.orientationchange.disabled)return!1;h=g(),d.bind("throttledresize",o)},teardown:function(){if(a.support.orientation&&!a.event.special.orientationchange.disabled)return!1;d.unbind("throttledresize",o)},add:function(a){var b=a.handler;a.handler=function(a){return a.orientation=g(),b.apply(this,arguments)}}}),a.event.special.orientationchange.orientation=g=function(){var d=!0,e=c.documentElement;return a.support.orientation?d=k[b.orientation]:d=e&&e.clientWidth/e.clientHeight<1.1,d?"portrait":"landscape"},a.fn[e]=function(a){return a?this.bind(e,a):this.trigger(e)},a.attrFn&&(a.attrFn[e]=!0)}(a,this),function(a,b){var d={touch:"ontouchend"in c};a.mobile=a.mobile||{},a.mobile.support=a.mobile.support||{},a.extend(a.support,d),a.extend(a.mobile.support,d)}(a),function(a,b,c,d){function x(a){while(a&&typeof a.originalEvent!="undefined")a=a.originalEvent;return a}function y(b,c){var e=b.type,f,g,i,k,l,m,n,o,p;b=a.Event(b),b.type=c,f=b.originalEvent,g=a.event.props,e.search(/^(mouse|click)/)>-1&&(g=j);if(f)for(n=g.length,k;n;)k=g[--n],b[k]=f[k];e.search(/mouse(down|up)|click/)>-1&&!b.which&&(b.which=1);if(e.search(/^touch/)!==-1){i=x(f),e=i.touches,l=i.changedTouches,m=e&&e.length?e[0]:l&&l.length?l[0]:d;if(m)for(o=0,p=h.length;o<p;o++)k=h[o],b[k]=m[k]}return b}function z(b){var c={},d,f;while(b){d=a.data(b,e);for(f in d)d[f]&&(c[f]=c.hasVirtualBinding=!0);b=b.parentNode}return c}function A(b,c){var d;while(b){d=a.data(b,e);if(d&&(!c||d[c]))return b;b=b.parentNode}return null}function B(){r=!1}function C(){r=!0}function D(){v=0,p.length=0,q=!1,C()}function E(){B()}function F(){G(),l=setTimeout(function(){l=0,D()},a.vmouse.resetTimerDuration)}function G(){l&&(clearTimeout(l),l=0)}function H(b,c,d){var e;if(d&&d[b]||!d&&A(c.target,b))e=y(c,b),a(c.target).trigger(e);return e}function I(b){var c=a.data(b.target,f);if(!q&&(!v||v!==c)){var d=H("v"+b.type,b);d&&(d.isDefaultPrevented()&&b.preventDefault(),d.isPropagationStopped()&&b.stopPropagation(),d.isImmediatePropagationStopped()&&b.stopImmediatePropagation())}}function J(b){var c=x(b).touches,d,e;if(c&&c.length===1){d=b.target,e=z(d);if(e.hasVirtualBinding){v=u++,a.data(d,f,v),G(),E(),o=!1;var g=x(b).touches[0];m=g.pageX,n=g.pageY,H("vmouseover",b,e),H("vmousedown",b,e)}}}function K(a){if(r)return;o||H("vmousecancel",a,z(a.target)),o=!0,F()}function L(b){if(r)return;var c=x(b).touches[0],d=o,e=a.vmouse.moveDistanceThreshold,f=z(b.target);o=o||Math.abs(c.pageX-m)>e||Math.abs(c.pageY-n)>e,o&&!d&&H("vmousecancel",b,f),H("vmousemove",b,f),F()}function M(a){if(r)return;C();var b=z(a.target),c;H("vmouseup",a,b);if(!o){var d=H("vclick",a,b);d&&d.isDefaultPrevented()&&(c=x(a).changedTouches[0],p.push({touchID:v,x:c.clientX,y:c.clientY}),q=!0)}H("vmouseout",a,b),o=!1,F()}function N(b){var c=a.data(b,e),d;if(c)for(d in c)if(c[d])return!0;return!1}function O(){}function P(b){var c=b.substr(1);return{setup:function(d,f){N(this)||a.data(this,e,{});var g=a.data(this,e);g[b]=!0,k[b]=(k[b]||0)+1,k[b]===1&&t.bind(c,I),a(this).bind(c,O),s&&(k.touchstart=(k.touchstart||0)+1,k.touchstart===1&&t.bind("touchstart",J).bind("touchend",M).bind("touchmove",L).bind("scroll",K))},teardown:function(d,f){--k[b],k[b]||t.unbind(c,I),s&&(--k.touchstart,k.touchstart||t.unbind("touchstart",J).unbind("touchmove",L).unbind("touchend",M).unbind("scroll",K));var g=a(this),h=a.data(this,e);h&&(h[b]=!1),g.unbind(c,O),N(this)||g.removeData(e)}}}var e="virtualMouseBindings",f="virtualTouchID",g="vmouseover vmousedown vmousemove vmouseup vclick vmouseout vmousecancel".split(" "),h="clientX clientY pageX pageY screenX screenY".split(" "),i=a.event.mouseHooks?a.event.mouseHooks.props:[],j=a.event.props.concat(i),k={},l=0,m=0,n=0,o=!1,p=[],q=!1,r=!1,s="addEventListener"in c,t=a(c),u=1,v=0,w;a.vmouse={moveDistanceThreshold:10,clickDistanceThreshold:10,resetTimerDuration:1500};for(var Q=0;Q<g.length;Q++)a.event.special[g[Q]]=P(g[Q]);s&&c.addEventListener("click",function(b){var c=p.length,d=b.target,e,g,h,i,j,k;if(c){e=b.clientX,g=b.clientY,w=a.vmouse.clickDistanceThreshold,h=d;while(h){for(i=0;i<c;i++){j=p[i],k=0;if(h===d&&Math.abs(j.x-e)<w&&Math.abs(j.y-g)<w||a.data(h,f)===j.touchID){b.preventDefault(),b.stopPropagation();return}}h=h.parentNode}}},!0)}(a,b,c),function(a,b,d){function j(b,c,d){var e=d.type;d.type=c,a.event.handle.call(b,d),d.type=e}a.each("touchstart touchmove touchend tap taphold swipe swipeleft swiperight scrollstart scrollstop".split(" "),function(b,c){a.fn[c]=function(a){return a?this.bind(c,a):this.trigger(c)},a.attrFn&&(a.attrFn[c]=!0)});var e=a.mobile.support.touch,f="touchmove scroll",g=e?"touchstart":"mousedown",h=e?"touchend":"mouseup",i=e?"touchmove":"mousemove";a.event.special.scrollstart={enabled:!0,setup:function(){function g(a,c){d=c,j(b,d?"scrollstart":"scrollstop",a)}var b=this,c=a(b),d,e;c.bind(f,function(b){if(!a.event.special.scrollstart.enabled)return;d||g(b,!0),clearTimeout(e),e=setTimeout(function(){g(b,!1)},50)})}},a.event.special.tap={tapholdThreshold:750,setup:function(){var b=this,d=a(b);d.bind("vmousedown",function(e){function i(){clearTimeout(h)}function k(){i(),d.unbind("vclick",l).unbind("vmouseup",i),a(c).unbind("vmousecancel",k)}function l(a){k(),f===a.target&&j(b,"tap",a)}if(e.which&&e.which!==1)return!1;var f=e.target,g=e.originalEvent,h;d.bind("vmouseup",i).bind("vclick",l),a(c).bind("vmousecancel",k),h=setTimeout(function(){j(b,"taphold",a.Event("taphold",{target:f}))},a.event.special.tap.tapholdThreshold)})}},a.event.special.swipe={scrollSupressionThreshold:30,durationThreshold:1e3,horizontalDistanceThreshold:30,verticalDistanceThreshold:75,setup:function(){var b=this,c=a(b);c.bind(g,function(b){function j(b){if(!f)return;var c=b.originalEvent.touches?b.originalEvent.touches[0]:b;g={time:(new Date).getTime(),coords:[c.pageX,c.pageY]},Math.abs(f.coords[0]-g.coords[0])>a.event.special.swipe.scrollSupressionThreshold&&b.preventDefault()}var e=b.originalEvent.touches?b.originalEvent.touches[0]:b,f={time:(new Date).getTime(),coords:[e.pageX,e.pageY],origin:a(b.target)},g;c.bind(i,j).one(h,function(b){c.unbind(i,j),f&&g&&g.time-f.time<a.event.special.swipe.durationThreshold&&Math.abs(f.coords[0]-g.coords[0])>a.event.special.swipe.horizontalDistanceThreshold&&Math.abs(f.coords[1]-g.coords[1])<a.event.special.swipe.verticalDistanceThreshold&&f.origin.trigger("swipe").trigger(f.coords[0]>g.coords[0]?"swipeleft":"swiperight"),f=g=d})})}},a.each({scrollstop:"scrollstart",taphold:"tap",swipeleft:"swipe",swiperight:"swipe"},function(b,c){a.event.special[b]={setup:function(){a(this).bind(c,a.noop)}}})}(a,this)});var form;
jQuery(function($){
    var $doc = $(document);

    // go to buylist
    $(document).on('click','.addtolists-go-buylist', function(e){
        e.preventDefault();

        var auth = $(this).hasClass('unauth') ? 0 : 1;

        jQuery.post('/aj/toolbar/buylist_get_data/', null, function(link){
            var ids = link;
            if (ids)
            {
                var buylist_unchecked = readCookie('buylist_unchecked=');
                buylist_unchecked = !buylist_unchecked ?  [] : buylist_unchecked.split(',');

                ids = ids.split('-');

                var new_ids = [];

                for (var i in ids)
                {
                    if ($.inArray(ids[i], buylist_unchecked) < 0)
                        new_ids.push(ids[i]);
                }

                ids = new_ids;

                if (ids.length < 2) alert(t('ƒл€ использовани€ сервиса "Ќайти в одном магазине" необходимо отметить как минимум два товара.'));
                else
                {
                    ids = ids.join('-');
                    $.post('/buymatrix/isresults/'+(!auth?2:1)+'/'+ids+'/', null, function(res){
                        if (res == '0')
                        {
                            showBuylistNoResultsPopup();
                        }
                        else location.href = '/buymatrix/' + (!auth?'suitable/':'') + ids + '/';
                    });
                }
            }

        }, 'json');
    });

    $doc.on('change', '.add-list-form :checkbox',function(e){
        e.preventDefault();

        form = $(this).parents('.add-list-form');

        form.block({ message:'', overlayCSS: { opacity: '0.1'}});

        var data = {custom: []};

        data['card_id'] = form.find('input[name="card_id"]').val();

        if ($(this).attr('name') === 'bookmarks')
        {
            data['bm'] = 1;
            toolbar_cnt_type = 'bookmarks';
        }
        else if ($(this).attr('name') === 'atone')
        {
            data['at'] = 1;
            toolbar_cnt_type = 'buy';
        }
        else
        {
            data['custom'].push($(this).attr('class').split('_')[2]);
        }

        data['status'] = $(this).attr('checked') ? 'add' : 'remove';

        var curr_cnt = parseInt($(this).parent().find('a span').text());
        $(this).parent().find('a span').text(data['status'] == 'add' ? curr_cnt+1 : (curr_cnt-1<0?0:curr_cnt-1));

        addToCustomList(data, false);
        //$(this).attr('disabled', true).trigger('refresh');
    });

    $doc.on('click', '.add-list-form .cbx-lnk', function(e){
        e.preventDefault();
        $(this).parent().find(':checkbox').click();
    });

    $doc.on('click','.add-to-list',function(e){
        e.preventDefault();
        $list_open_elt = $(this).parents('.list-add-open');
        showAddToListForm($list_open_elt.attr('id'), $list_open_elt.data('id'));
    });

    $doc.on('focus','.add-custom-list2 :text', function(){
       $(this).parent().find(':submit').removeClass('input-edit');
    });

    $doc.on('mouseleave','.add-list-form', function(){
       $(this).hide();
    });

    $doc.on('submit','.add-custom-list2 form', function(e){
        e.preventDefault();

        form = $(this).parents('.add-list-form');

        var new_list = $.trim(form.find(':text').val());

        if (!new_list)
        {
            return false;
        }

        form.block({ message:'', overlayCSS: { opacity: '0.1'}});

        form.find(':text').blur();
        var data = {custom: [], card_id: form.find('input[name="card_id"]').val()};

        $.ajax({
            type: "POST",
            url: '/profile/ajax/addList/',
            data: {title: new_list},
            async: false,
            success: function(res){
                if (res)
                {
                    var list_id = $(res).attr('id').substring(2);
                    data['custom'].push(list_id);
                    data['status'] = 'add';

                    // in profile
                    if ($('.personal-list').length)
                    {
                        $('.personal-list').append(res);
                        setDragDrop();
                        $('#cl'+list_id+' span i').html('(1)');
                    }

                    // убираем флаг чтобы следующие формы снова грузились (т.к. добавлен новый список)
                    var id = form.parents('.list-add-open').attr('id').substring(3);
                    $('.list-add-open[id!="alf'+id+'"] .add-list-form').removeClass('loaded');
                    $('.list-add-open[id!="alf'+id+'"] .add-list-form .loader').show();
                    $('.list-add-open[id!="alf'+id+'"] .add-list-form .cont').hide();

                    $('.list-add-open[id="alf'+id+'"] .custom-lists').append('<div><input type="checkbox" class="cl_inp_'+list_id+'" name="custom['+list_id+']" checked="true"/><a href="#" class="cbx-lnk">' + $('<div/>').text(new_list).html() + ' (<span>1</span>)</a><a href="/profile/lists/custom/'+list_id+'/" class="arr">&nbsp;</a></div>');
                    $('.list-add-open[id="alf'+id+'"] input.cl_inp_'+list_id).styler();

                    form.find(':text').val('');
                    addToCustomList(data, true);
                }
            },
            dataType: 'html'
        });
    });
});

function addToCustomList(data, new_list)
{
    jQuery.post('/profile/ajax/addToLists/', data, function(res){
        if (res === 'ok' && typeof(updateListCounters) === 'function')
        {
            updateListCounters(data, new_list);
        }

        // if  toolbar function exists
        if (typeof(updToolbarCounters) === 'function')
        {
            updToolbarTab();
        }

        if(data.custom.length)
        {
            updCustomToolbarTab(data.custom[0],data.status);
        }

        if (form) form.unblock();
    });
}


function showAddToListForm(id, card_id)
{
    var form = jQuery('#'+id+' .add-list-form');

    if (form.css('display') === 'block')
    {
        form.hide();
        return false;
    }
    else
    {
        form.show();

        closeAddToListForm(id);
        if (form.hasClass('loaded'))
            return false;
    }

    getBmAndAtCounts(form);

    // only for authorized
    if (!form.hasClass('unauth') && form.find('.custom-lists').length)
    {
        jQuery.ajax({
            type: "POST",
            url: '/profile/ajax/getCustomLists/',
            data: null,
            async: false,
            success: function(res){
                if (res)
                {
                    form.find('.custom-lists').html('');
                    for (var i=0; i < res.length; i++)
                    {
                        form.find('.custom-lists').append('<div><input type="checkbox" class="cl_inp_'+res[i]['id']+'" name="custom['+res[i]['id']+']" /><a class="cbx-lnk" href="#">' + res[i]['title'] + ' (<span>'+res[i]['cnt']+'</span>)</a><a href="/profile/lists/custom/'+res[i]['id']+'/" class="arr">&nbsp;</a></div>');
                    }
                }
            },
            dataType: 'json'
        });
    }

    jQuery.post('/profile/ajax/checkInList/', {card_id: card_id}, function(res){
        if (res.bookmarks) form.find('input[name="bookmarks"]').attr('checked', '1').trigger('refresh');
        if (res.atone) form.find('input[name="atone"]').attr('checked', '1').trigger('refresh');

        if (res.custom.length)
        {
            for (var i in res.custom)
                form.find('input.cl_inp_'+res.custom[i].id).attr('checked', '1');
        }

        form.find('input').styler();
        form.find('.loader').hide();
        form.find('.cont').show();
        form.addClass('loaded');
    }, 'json');
}

function getBmAndAtCounts(inner)
{
    if (inner.find('input[name="bookmarks"]').length || inner.find('input[name="atone"]').length)
    {
        jQuery.post('/profile/ajax/getBmAndAtCount/', null, function(res){
            inner.find('input[name="bookmarks"]').parent().find('a span').html(res.bm_cnt);
            inner.find('input[name="atone"]').parent().find('a span').html(res.at_cnt);
        }, 'json');
    }
}

function closeAddToListForm(excludeId)
{
    //hide all others

    if (excludeId)
        jQuery('.list-add-open[id!="'+excludeId+'"] .add-list-form').hide();
    else
        jQuery('.list-add-open .add-list-form').hide();
};    var ScrollWrapper = function($,params)
    {
        var params = params||{};
        this.default_params = { 
                                scroll:true,
                                swipe:false,        
                                resize_sensitive:true,
                                width:{init:445,min:150,max:445,subtrahend:855},
                                main_selector:'.series-scrl>.r-sh',
                                content_selector:'.series-scroll',
                                template:{container:'<div class="viewport"></div>',
                                          sub_container:'<div class="overview"></div>',
                                          scrollbar:'<div class="left-arr"></div><div class="scrollbar"><div class="track"><div class="thumb"><div class="end"></div></div></div></div><div class="right-arr"></div>'  
                                        },
                                onMove: null,
                                scrollbarWidthFix: 40,
                                resizeBlock : {block: window, minSizeFix: 0, maxSizeFix: 0}
                               };
        this.params = $.extend(this.params,this.default_params,params);
        this.elements = $(this.params.main_selector);
        
        var self = this;
        
        this.init = function()
        {
            this.elements.css({"overflow-x":"hidden"});
            this.elements.each(function(index,el)
            {
                var $el             =   $(el);
                var $content        =   $el.find(self.params.content_selector);

                var $container      =   $(self.params.template.container);
                var $sub_container  =   $(self.params.template.sub_container);

                $container.append($sub_container.append($content)).appendTo($el);
                $el.append(self.params.template.scrollbar);

                self.updateHeight($sub_container,$container);

                $el.tinyscrollbar({ axis: 'x',
                                    scroll:self.params.scroll,
                                    swipe:self.params.swipe,
                                    size: self.params.width.init});

                if (typeof(self.params.onMove) == 'function')
                {
                    $el.bind("move", function(event, move_props)
                    {
                        self.params.onMove(event, move_props);
                    });
                }
            });

            
            this.onResize();
            
            return this;
        };
        
        this.initEvents = function()
        {
          if (this.params.resize_sensitive)
              {
                $(window).resize(function(){ self.onResize();  });
                //this.onResize();
              }  
            
        };
        
        this.updateHeight = function($sub_container,$container)
        {
            if ( !$container ) $container = $sub_container.parent();
            $container.height($sub_container.height());
        };
        
        this.onResize = function()
        {
            var w_width = $(this.params.resizeBlock.block).width(), new_width;

            new_width = w_width-this.params.width.subtrahend;

            if ( new_width<(this.params.width.min+this.params.resizeBlock.minSizeFix) ) new_width = this.params.width.min;
            else if ( new_width>(this.params.width.max-this.params.resizeBlock.maxSizeFix) ) new_width = this.params.width.max;

            this.updateWidth(new_width);
        };
        
        this.onUpdateHeight = function()
        {
            this.elements.each(function(index,el){
                self.updateHeight($(el).find('.overview'));
            });              
        };
        
        
        this.updateWidth = function(width)
        {
            this.elements.each(function(index,el){
                var $el             =   $(el),
                    $box            =   $el.closest('.series-box'),
                    update_width    =   width,
                    $content        =   $el.find(self.params.content_selector),
                    content_width   =   $content.width();
                
                //var narrow_callback = function(is_short){ if (is_short ) $box.addClass('short'); else $box.removeClass('short');};
                var narrow_callback = function(is_short){ $box.toggleClass('short', is_short);};
                
                if ( content_width<update_width && content_width < $el.find('.viewport').width() )
                {
                    update_width+=20;//magic constant
                    $content.width(update_width);
                }

                //console.log('update width to',width);
                $content.width(update_width);
                $el.width(update_width);
                $el.parent().width(update_width);
                $el.find('.viewport').width(update_width);

                $el.tinyscrollbar_update('relative', update_width-self.params.scrollbarWidthFix, narrow_callback);
            });            
        };
        
        
        
        this.init()
            .initEvents();
    };
    




