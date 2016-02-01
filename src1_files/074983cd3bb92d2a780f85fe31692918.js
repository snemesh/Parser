/**
 * Created by troyan on 12.01.2015.
 */

$(document).ready(function() {
    save_user_filters();
    subscribe_uf();
    unsubscribe_uf();
    deluf();
    del_all_uf();
    unsub_uf_by_hash();
    delUserFilterInSection();
    saveCurrentFilter();
})

function save_user_filters() {
    $('#save_user_filter').bind('click', function() {
        //if($('#userLoggedButton').length > 0) {
        //    $('#userLoggedButton').click();
        //}
        //else {
            if($('#filter_name').val().length == 0 || $('#selected_filters').val().length == 0)
                return false;
            var url = window.location.href;
            var email_notify = 0;
            if($('#notifiy_by_email').is(':checked'))
                email_notify = 1;
            $.post(
                '/profile/ajax/SaveUserFilters/',
                {email_notify:email_notify, url:url, filters:$('#selected_filters').val(), f_name:$('#filter_name').val(), section_id:$('#section_id').val()},
                function(data) {
                    if(data.length > 0) {
                        $('.filter-save-profile').hide();
                        $('#save_in_selected_filter').hide();
                        $('.filter-save-profile-success').fadeIn();
                        var fName = $('#filter_name').val();
                        $('#filter_name').val('');
                        addUserFilterInFiltersList(data, fName);
                    }
                }
            );
        //}
        return false;
    })

    $('#save_in_prof_link').bind('click', function() {
        $(this).hide();
        $('.save-in-profile').fadeIn();
        return false;
    })

    $('#close_uf_form').bind('click', function() {
        $('.save-in-profile').hide();
        $('#save_in_prof_link').fadeIn();
        $('#filter_name').val('');
        return false;
    })

    $('#user_filter_popup_close').bind('click', function() {
        $('#user_filter_popup').fadeOut();
        var d = new Date();
        d.setMonth(d.getMonth() + 12);
        var an_domain = '.'+location.host;
        setCookie('user_filter_popup', 1, d, '/', an_domain);
        return false;
    })

    if($('#selected_filters').val() && !getCookie('user_filter_popup')) {
        $('#user_filter_popup').fadeIn();
    }
}

function subscribe_uf() {
    if($('.subscribe_uf').length > 0) {
        $('.subscribe_uf').bind('click', function() {
            var that = $(this);
            var uf_id = that.attr('id').split('-');
            $.post(
                '/profile/ajax/SubscribeUserFilter/',
                {uf_id:uf_id[1]},
                function(data) {
                    if(data == 'done') {
                        that.hide();
                        $('#unsub-'+uf_id[1]).fadeIn();
                    }
                }
            );
            return false;
        })
    }
}

function unsubscribe_uf() {
    if($('.unsubscribe_uf').length > 0) {
        $('.unsubscribe_uf').bind('click', function() {
            var that = $(this);
            var uf_id = that.attr('id').split('-');
            $.post(
                '/profile/ajax/UnsubscribeUserFilter/',
                {uf_id:uf_id[1]},
                function(data) {
                    if(data == 'done') {
                        that.hide();
                        $('#sub-'+uf_id[1]).fadeIn();
                    }
                }
            );
            return false;
        })
    }
}

function deluf() {
    if($('.delete_uf').length > 0) {
        $('.delete_uf').bind('click', function() {
            var uf_id = $(this).attr('id').split('-');
            $.post(
                '/profile/ajax/DelUf/',
                {uf_id:uf_id[1]},
                function(data) {
                    if(data == 'done') {
                        var that = $('.uf_block-'+uf_id[1]);
                        that.html('<p style="color: green; text-align: center; margin: 10px;">Фильтр успешно удален</p>');
                        setTimeout(function() {that.remove()}, 3000);
                        var uf_counter = parseInt((/[0-9]+/).exec($('.uf_counter span a i').text()));
                        $('.uf_counter span a i').text('('+(uf_counter-1)+')');
                    }
                }
            );
            return false;
        })
    }
}

function del_all_uf() {
    if($('.del_all_uf').length > 0) {
        $('.del_all_uf').bind('click', function() {
            if(confirm($(this).attr('data-deltext'))) {
                $.post(
                    '/profile/ajax/DelAllUf/',
                    {del:1},
                    function(data) {
                        if(data == 'done')
                            window.location.reload();
                    }
                );
            }
            return false;
        })
    }
}

function unsub_uf_by_hash() {
    $('.unsub_by_hash').bind('click', function() {
        $(this).unbind();
        $.post('/profile/ajax/UnsubscribeUserFilter/',
            {hash:$('#hash_uf').val(), user_id:$('#user_id_uf').val()},
            function(data) {
                if(data == 'done') {
                    $('.unsub_block').hide();
                    $('.unsub_block-success').show();
                    window.setTimeout(function(){window.location = '/'}, 10000);
                }
            }
        );
        return false;
    })
}

function delUserFilterInSection() {
    $(document).on('click','.delete_uf_in_section', function() {
        if(window.confirm($(this).attr('data-deltext'))) {
            var uf_id = $(this).attr('id').split('-');
            var that = $(this);
            $.post(
                '/profile/ajax/DelUf/',
                {uf_id: uf_id[1]},
                function (data) {
                    if (data == 'done') {
                        that.parent().fadeOut().remove();
                        var fIdinUrl = window.location.search.length;
                        if($('.delete_uf_in_section').length == 0 && fIdinUrl != 0) {
                            $('.my_filters_list_saved').fadeOut().remove();
                            window.location = $('#catalog_base_url').val() + '/';
                            return false;
                        }
                        else if($('.delete_uf_in_section').length == 0) {
                            $('.my_filters_list_saved').fadeOut();
                            return false;
                        }
                        else if(fIdinUrl > 0) {
                            var matchStr = 'ufid='+uf_id[1];
                            if(window.location.search.match(matchStr)) {
                                window.location = $('#catalog_base_url').val() + '/';
                            }
                        }

                    }
                }
            );
        }
        return false;
    })
}

function saveCurrentFilter() {
    $('#save_in_selected_filter').bind('click', function() {
        $.post(
            '/profile/ajax/SaveUserFilters/',
            {filters:$('#selected_filters').val(), uf_id:$('#cur_filter_id').val()},
            function(data) {
                switch(data) {
                    case '1': {
                        $('#save_in_selected_filter').hide();
                        $('#resave_uf_success').fadeIn();
                        var id = $('#cur_filter_id').val();
                        var fName = $('#deluf-' + id).prev().text();
                        updateUserFilterInFiltersList(id, fName);
                        break;
                    }
                    case '0': {
                        break;
                    }
                }
            }
        );
        return false;
    })
}

function addUserFilterInFiltersList(id, fName) {
    var filter_inserted_patter_return = replaceFilterPattern(id, fName);
    $('.my_filters_list_saved div div').append('<p>'+filter_inserted_patter_return+'</p>');
    $('.my_filters_list_saved').fadeIn();
    return false;
}
function updateUserFilterInFiltersList(id, fName) {
    var filter_inserted_patter_return = replaceFilterPattern(id, fName);
    var that = $('#deluf-' + id).parent();
    that.html(filter_inserted_patter_return);
    return false;
}

function replaceFilterPattern(id, fName) {
    var replacement = [];
    replacement['fid'] = id;
    var filterJson = jQuery.parseJSON($('#selected_filters').val());
    replacement['filters'] = filterJson[filterJson.length-1];
    replacement['filter_name'] = fName;
    var filter_inserted_patter_return = filter_inserted_patter.toString();
    for(var r in replacement) {
        var replacementText = new RegExp('#'+r+'#', 'g');
        filter_inserted_patter_return = filter_inserted_patter_return.replace(replacementText, replacement[r]);
    }
    return filter_inserted_patter_return;
}