var toolbar_class = 'toolbar-user';
var small_toolbar_class = 'small-toolbar';
var toolbar_cnt_type = null;

var toolbarPosition = 'bottom';

jQuery(document).ready(function($)
{
    if(position == 'top'){
        toolbarPosition = 'top';
    }

    expandTopToolbarFix(toolbarPosition);

    function correctingTopPaddingForToolbar(){

        var top = (jQuery('.toolbar-user.top-position:visible').length)?'20px':'0';

        if(jQuery('#show-toolbar-button:visible').length){
            jQuery('#show-toolbar-button').css('top',top);
        }

        if(jQuery('#good-info-b:visible').length){
            jQuery('#good-info-b').css('top',top);
        }

        if(jQuery('#js-price-sort:visible').length){
            if(jQuery('#js-price-sort').css('position') == 'fixed'){
                jQuery('#js-price-sort').css('top',top);
            }
        }
    }

    function showToolbar()
    {
        var show_toolbar = $.jStorage.get('show_toolbar', 1);

        if (show_toolbar)
        {
            correctingTopPaddingForToolbar();
            $('.' + toolbar_class).not('.'+small_toolbar_class).show();
        }
        else 
        {
            $('.'+small_toolbar_class).show();
        }
    }

    function restoreTollbar()
    {
        $.jStorage.set('show_toolbar', 1);
        
        $('.' + toolbar_class).not('.'+small_toolbar_class).show();
        $('.'+small_toolbar_class).hide();

        correctingTopPaddingForToolbar();
    }

    function minimazeTollbar()
    {
        $.jStorage.set('show_toolbar', 0);
        
        $('.' + toolbar_class).not('.'+small_toolbar_class).hide();
        $('.'+small_toolbar_class).show();

        correctingTopPaddingForToolbar();
    }

    function upButton()
    {
        if ($(document).scrollTop() > 800)
        {
            if (!$('.block-arr-up').is(':visible'))
                $('.block-arr-up').fadeIn('slow');
        }
        else
        {
            $('.block-arr-up').hide();
        }
    }

    $(document).scroll(function(){
        upButton();
    });
    upButton();

    $('.block-arr-up').click(function(e){
        e.preventDefault();
        $('html, body').animate({scrollTop: 0}, 400);
    });

    $('.' + small_toolbar_class ).click(function(e){
        e.preventDefault();
        restoreTollbar();
        expandTopToolbarFix(toolbarPosition);
    });

    $('.' + toolbar_class + ' a.hide').click(function(e){
        e.preventDefault();
        minimazeTollbar();
        constrictTopToolbarFix();
    });

    // get counters
    updToolbarCounters(null);

    $(document).ajaxComplete(function(){
       showToolbar();
    });

    // show tab
    $('.' + toolbar_class + ' .div-float .title-span').click(function(e){
        e.preventDefault();

        var parent = $(this).parents('.div-float');
        var type = $(this).data('type');

        if (typeof(type) == 'undefined')
        {
            location.href = $(this).attr('href');
            return false;
        }



        if(type.substr(0, 13) == 'profile_list_'){
            var typeArr = type.split('_');
            if(typeof(typeArr[2]) == 'undefined'){
                return false;
            }
            type = 'profile/'+typeArr[2];
        }

        parent.toggleClass('open-box');
        $('.' + toolbar_class + ' .div-float').not(parent).removeClass('open-box');

        var inner = parent.find('.submenu-toolbar');
        $('.' + toolbar_class + ' .div-float .submenu-toolbar').not(inner).hide();
        inner.toggle();

        if (inner.css('display') == 'block' && !inner.hasClass('loaded'))
        {
            inner.html('<img src="/img/s/v3/preloader.gif" style="display: block; margin:80px auto"/>');
            jQuery.post('/aj/toolbar/'+type+'/', {}, function(html){
                inner.html(html);
                inner.addClass('loaded');
                inner.find('#scrollbar1').tinyscrollbar();
                inner.find(':checkbox').styler();
            }, 'html');
            
        }
    });

    // del cookie card from cmp
    $(document).on('click','.' + toolbar_class + ' .del.cookie', function(e){
        e.preventDefault();
        var obj = jQuery(this).parents('.cmprow');
        var obj_prn = obj.parents('#compare_it_toolbar');

        // remove from cookie
        var thecookie = getCookie("gd_cmp");
        var arr = thecookie.split(',');
        var i = arr.indexOf(obj.data('cid')+'');
        arr.splice(i,1);

        setCookie('gd_cmp', arr.join(','), null, '/', hl_domain);

        var compare_item_del_btn = jQuery('[data-cmp_id='+obj.data('cid')+'] a.del');
        if(compare_item_del_btn.length){
            delCompareItem(compare_item_del_btn,false);
        }

        var cnt = 0;
        obj_prn.find('.cmprow').each(function(){
            cnt++;
        });

        obj.remove();

        if ((cnt-1) == 0)
        {
            var cmp_lists = obj_prn.parents('.overview');
            obj_prn.parents('.cmp_mainrow').remove();

            if(!cmp_lists.find('.cmp_mainrow').length){
                cmp_lists.html('<span class="not-tovar">Ваш список «Сравнения» пуст.</span>');
            }

            var cmp_block_count = jQuery('[data-type=cmp] span');
            cmp_block_count.text(parseInt(cmp_block_count.text(),10) - 1);
        }

        if((cnt-1) == 1){
            obj_prn.find('.cmp-link').remove();
        }
        else{

            var lnk = '';
            obj_prn.find('.cmprow').each(function(){
                lnk += '-' + jQuery(this).data('cid');
            });

            obj_prn.find('.cmp-link').length && obj_prn.find('.cmp-link').attr('onclick', obj_prn.find('.cmp-link').attr('onclick').replace(/\?s=[0-9-]+/, '?s=' + lnk.substring(1)));
        }
    });

    // del saved card from cmp
    $(document).on('click','.' + toolbar_class + ' .del.saved', function(e){
        e.preventDefault();

        var obj = jQuery(this).parents('.cmprow');
        var obj_prn = obj.parents('#compare_it_toolbar');
        var cid = obj.data('cid');
        var cmpid = obj_prn.data('cmpid');

        var cnt = 0;
        obj_prn.find('.cmprow').each(function(){
            cnt++;
        });

        if(cnt == 1){
            if(confirm("Это последний элемент в списке. Хотите удалить список?")){
                jQuery.post('/profile/ajax/comparisonDelList/', { cmpid: cmpid}, function(res){
                    if(res == 'ok'){
                        obj_prn.parents('.cmp_mainrow').remove();
                        var cmp_block_count = jQuery('[data-type=cmp] span');
                        cmp_block_count.text(parseInt(cmp_block_count.text(),10) - 1);

                        var cmp_lists = jQuery('[data-type=cmp]').parents('.div-float').find('.overview');
                        if(!cmp_lists.find('.cmp_mainrow').length){
                            cmp_lists.html('<span class="not-tovar">Ваш список «Сравнения» пуст.</span>');
                        }
                    }
                });

            }
            return;
        }

        obj.remove();

        if(cnt > 1){
            jQuery.post('/profile/ajax/comparsionsCardDel/', { cid: cid, cmpid: cmpid}, function(res){
                if (res === 'ok')
                {
                    var lnk = '';
                    obj_prn.find('.cmprow').each(function(){
                        lnk += '-' + jQuery(this).data('cid');
                    });
                    if(cnt > 2){
                    obj_prn.find('.cmp-link').attr('onclick', obj_prn.find('.cmp-link').attr('onclick').replace(/\?s=[0-9-]+/, '?s=' + lnk.substring(1)));
                    }else{
                        obj_prn.find('.cmp-link').remove();
                    }
                }
            });
        }
    });

    //save cmp (show form)
    $(document).on('click','.' + toolbar_class + ' .save-comparsion', function(e){
        e.preventDefault();
        $(this).parent().hide();
        $(this).parents('.save_cmp_blk').find('.save-in-profile').show();
        $(this).parents('.save_cmp_blk').find(':text').focus();
    });

    // save cmp cancel
    $(document).on('click','.' + toolbar_class + ' .save_cmp_cancel', function(e){
        e.preventDefault();
        $(this).parents('.save-in-profile').hide();
        $(this).parents('.save_cmp_blk').find('.item-menu').show();
    });

    // save cmp
    $(document).on('submit','.' + toolbar_class + ' .save-in-profile form', function(e){
        e.preventDefault();

        var frm = $(this);
        var title = $.trim(frm.find(':text').val());
        var ids = [];

        frm.parents('.cmp_mainrow').find('.cmprow').each(function(){
            ids.push($(this).data('cid'));
        });

        if (title && ids.length)
        {
            $.post('/profile/ajax/saveComparsion/', {title: title, card_ids: ids}, function(res){
                if (res == 'ok')
                {
                    $.post('/profile/ajax/getUserLastCmpId/', null, function(id){
                        frm.parents('.cmp_mainrow').find('#compare_it_toolbar').data('cmpid', id);
                    });

                    frm.find(':text').val('');
                    frm.parent().hide();
                    frm.parents('.save_cmp_blk').find('.item-menu b').text(title);
                    frm.parents('.save_cmp_blk').find('.item-menu a').remove();
                    frm.parents('.save_cmp_blk').find('.item-menu').append('Сохранен');
                    frm.parents('.save_cmp_blk').find('.item-menu').show();
                    frm.parents('.cmp_mainrow').find('.cmprow .del').removeClass('cookie').addClass('saved');

                    // delete saved cmp from cookie
                    thecookie = getCookie("gd_cmp");
                    var arr = thecookie.split(',');
                    for (var k in ids)
                    {
                        var i = arr.indexOf(ids[k]);
                        arr.splice(i,1);
                    }
                    setCookie('gd_cmp', arr.join(','), null, '/', hl_domain);
                    
                    $(this).parents('.save-in-profile').hide();
                    $(this).parents('.save_cmp_blk').find('.item-menu').show();
                }
                else if (res == 'exist')
                {
                    frm.find('.errors').html(t('Сравнение с таким названием уже существует.'));
                }
            });
        }
        else
        {
            frm.find('.errors').html(t('Вы не ввели название.'));
        }


    });
    
    
    // search in one shop button
    $(document).on('click','.do_buylist', function(e){
        e.preventDefault();
        var ids = [];

        $('.' + toolbar_class + ' ul.one-shops :checkbox').each(function(){
            if ($(this).is(':checked')) ids.push($(this).val());
        });

        if (ids.length > 1)
        {
            var href = '/buymatrix/';
            if ($(this).hasClass('unauth')) href += 'suitable/';
            ids = ids.join('-');

            $.post('/buymatrix/isresults/'+($(this).hasClass('unauth')?'2':'1')+'/'+ids+'/', null, function(res){
                if (res == '1')
                {
                    location.href = href + ids + '/';
                }
                else
                    showBuylistNoResultsPopup();
            });
        }
        else if (ids.length == 1)
        {
            alert(t('Для использования сервиса "Найти в одном магазине" необходимо отметить как минимум два товара.'));
        }
        else if (ids.length < 1)
        {
            alert(t('Вы не выбрали ни одного товара. Для использования сервиса "Найти в одном магазине" необходимо отметить как минимум два товара.'));
        }
    });

    // synchronize and save checkbox conditions in tab buylist and profile buylist
    $(document).on('change','.' + toolbar_class + ' .one-shops input[name="buylist"], .lines-profile.search-one-shop input.buylist-item-cb', function(e){

        var buylist_unchecked = getCookie('buylist_unchecked');
        buylist_unchecked = !buylist_unchecked ?  new Array() : buylist_unchecked.split(',');

        var key = $.inArray($(this).val(), buylist_unchecked);

        var pr_inp = $('.lines-profile.search-one-shop input.buylist-item-cb[value="'+$(this).val()+'"]').not($(this));
        var to_inp = $('.' + toolbar_class + ' .one-shops input[value="'+$(this).val()+'"]').not($(this));

        if (!$(this).is(':checked') && key === -1)
        {
            pr_inp.removeAttr('checked').trigger('refresh');
            to_inp.removeAttr('checked').trigger('refresh');
            buylist_unchecked.push($(this).val());
        }
        else if (key >= 0)
        {
            pr_inp.attr('checked', 'true').trigger('refresh');
            to_inp.attr('checked', 'true').trigger('refresh');
            buylist_unchecked.splice(key, 1);
        }

        //console.log(buylist_unchecked);
        var cookieTime = new Date().getTime()+(1000*60*60*24*700);
        setCookie('buylist_unchecked', buylist_unchecked, new Date(cookieTime), '/', hl_domain);
    });

    // synchronize and save checkbox conditions in tab buylist and profile buylist
    $(document).on('click','.clear-buylist', function(e){
        e.preventDefault();
        if (confirm(t('Очистить список «Найти в одном магазине»?')))
        {
            jQuery.post('/aj/toolbar/buylist_clear/', null, function(){
                if (document.location.href.indexOf('buymatrix') > 0)
                    document.location.href = '/';
                else
                {
                    toolbar_cnt_type = 'buy';
                    updToolbarTab();
                }
            });
        }
    });

    $(document).on('click','.clear-bookmarks', function(e){
        e.preventDefault();
        if (confirm(t('Очистить список «Закладки»?')))
        {
            jQuery.post('/aj/toolbar/bookmarks_clear/', null, function(){
                toolbar_cnt_type = 'bookmarks';
                updToolbarTab();
            });
        }
    });

    jQuery('.' + toolbar_class).on('click', '.js-clear-visited', function(event){
        event.preventDefault();
        if (confirm(t('Очистить список «Просмотренные»?'))) {
            jQuery.post('/aj/toolbar/visited_clear/', null, function(){
                toolbar_cnt_type = 'visited';
                updToolbarTab();
            });
        }
    });

    jQuery('.' + toolbar_class).on('click', '.js-clear-cmp', function(event){
        event.preventDefault();
        if (confirm(t('Очистить список «Сравнения»?'))) {
            jQuery.post('/aj/toolbar/cmp_clear/', null, function(){
                toolbar_cnt_type = 'cmp';
                updToolbarTab();
            });
        }
    });

    jQuery('.' + toolbar_class).on('click', '.js-clear-queries', function(event){
        event.preventDefault();
        if (confirm(t('Очистить список «Поиск»?'))) {
            jQuery.post('/aj/toolbar/queries_clear/', null, function(){
                toolbar_cnt_type = 'queries';
                updToolbarTab();
            });
        }
    });

    // hide tabs if click out of zone
    $(document.body).mousedown(function(event)
    {
        if (!$(event.target).parents('.' + toolbar_class).length)
        {
            closeToolbarTabs();
        }
    });
});

function expandTopToolbarFix(toolbarPosition){

    if(toolbarPosition == 'top' && $.jStorage.get('show_toolbar',1)){
        $('.toolbarTop').length || $('.ad_ban_4').addClass('toolbarTop');

        if($("#lightbox-form").length)
            $('#padding_block').length || $("#lightbox-form").after($("<div id='padding_block' style='height:20px'></div>"));
        else
            $('#padding_block').length || $("<div id='padding_block' style='height:20px'></div>").prependTo($('body'));
    }
}

function constrictTopToolbarFix(){

    if(!$.jStorage.get('show_toolbar')){
        $('.toolbarTop').length && $('.ad_ban_4').removeClass('toolbarTop');
        $('#padding_block').length && $('#padding_block').remove();
    }
}

function closeToolbarTabs()
{
    jQuery('.' + toolbar_class + ' .submenu-toolbar').hide();
    jQuery('.' + toolbar_class + ' .div-float').removeClass('open-box');
}

// update tab cnt, clear tab content and remove 'loaded' flag (so tab's content will reload on open)
function updToolbarTab()
{
    if (toolbar_cnt_type)
    {
        jQuery('.' + toolbar_class + ' .div-float .title-span').each(function(){
            var key = jQuery(this).data('type');
            if(key == toolbar_cnt_type)
            {
                jQuery(this).parents('.div-float').find('.submenu-toolbar').removeClass('loaded').html('');
                updToolbarCounters(toolbar_cnt_type);
                closeToolbarTabs();
            }
        });
    }
}

function updToolbarCounters(type)
{
    // get counters
    jQuery.post('/aj/toolbar/tab_counts/', {type: type}, function(cnt){
        jQuery('.' + toolbar_class + ' .div-float .title-span').each(function(){
            var key = jQuery(this).data('type');
            if(typeof(cnt[key]) != 'undefined')
            {
                jQuery(this).find('span').text(cnt[key]);
            }
        });
    }, 'json');
}

function showBuylistNoResultsPopup()
{
    var $popup = jQuery('#buylist-noresults-popup');

    $popup.css({
        top: '40%',
        left: (jQuery(window).width() - $popup.width())/2 + 'px'
    }).show();

    $popup.find('.close').click(function() { $popup.hide(); });

    jQuery(document.body).mousedown(function(event)
    {
        if (!$(event.target).parents('#buylist-noresults-popup').length)
        {
            $popup.hide();
        }
    });
}

function array_to_cmp_cookie()
{
    var cookieStr = readCookie("gd_cmp="),
          cmp_ids = (cookieStr)?cookieStr.split(','):[];
    jQuery.each(cmp_list,function(index,item){
        if(jQuery.inArray(item+"", cmp_ids) == -1/* && item != 0*/){
            cmp_ids.push(item+"");
        }
    });

  document.cookie = 'gd_cmp' + '=' + cmp_ids.join(',') + '; path=/; domain=' + hl_domain;
}


function updateToolbarCnt(type, actionNum){
    var toolbar_cnt_block = $('.' + toolbar_class + ' .title-span[data-type="'+type+'"] span'),
                      cnt = parseInt(toolbar_cnt_block.text(),10),
           double_selector = '';

    if(!(type == 'cmp' && actionNum === 1 && cnt === 1)){
      cnt += actionNum; // 1 or -1
      cnt = cnt < 0 ? 0 : cnt;
      toolbar_cnt_block.text(cnt);

        switch(true){
            case(type == 'buy'):
                double_selector = '.addrem';
                var visible = $(double_selector+':visible'),
                     hidden = $(double_selector+':hidden'),
                     parent = visible.parent(),
                   gotolink = $('.add-in-one.go');

                $(double_selector).find('span').text(cnt);

                gotolink.hide();
                actionNum > 0 && cnt > 1 && gotolink.show();

                parent.toggleClass('rem');

                toggleVisibility(visible,hidden);

            break;
            case(type == 'bookmarks'):
                var bookmarksBlock = $('#tx-bookmarks-block'),
                              link = bookmarksBlock.find('a'),
                          cur_text = link.text();

                link.text(link.data('alt-text'));
                link.data('alt-text', cur_text);
                bookmarksBlock.toggleClass('rem');
            break;
        }
    }

    toolbar_cnt_block.parents('.div-float').find('.submenu-toolbar').removeClass('loaded');
}

function toggleVisibility(visible, hidden){
    visible.hide();
    hidden.show();
}

function updCustomToolbarTab(custom,status){
    var toolbar_cnt_block = jQuery('[data-type=profile_list_'+custom+']'),
        status = (status == 'add')? 1 : -1,
        toCnt = toolbar_cnt_block.find('span'),
        cnt = parseInt(toCnt.text(),10);

    toCnt.text(cnt+status);
    toolbar_cnt_block.parents('.div-float').find('.submenu-toolbar').removeClass('loaded');
}