var login_url = window.location.href;
var social_login_callback;
var selected_social_ident;

if(login_url.indexOf('#')>0){
    var pos = login_url.indexOf('#');
    login_url= login_url.substring(0,pos);
}

function social_login_proccess_success()
{
    // set login flag
    if (selected_social_ident) setSocialAuthFlag(selected_social_ident);

    if (typeof(social_login_callback) == 'function')
    {
        social_login_callback();
    }
    else
    {
        window.location.href = login_url;
    }
}

function FB_login(callback) {
    social_login_callback = callback;
    selected_social_ident = 'FB';

    FB.init({ appId: social_app_ids['1'], status: true, cookie: true, xfbml: true, oauth: true, version: 'v2.0' });
    FB.login(function(response) {
        if (response.authResponse)
        {
            social_login_proccess_success();
        } else {}
    }, { scope:'manage_pages,publish_stream,email' });
    return false;
}


function VK_login(callback) {
    social_login_callback = callback;
    selected_social_ident = 'VK';

    VK.init({ apiId: social_app_ids['2'], scope: 'offline,wall'});
    VK.Auth.login(function(response) {
        if (response.session) {
            //console.log(response.session);
            social_login_proccess_success();
        }
    });
    return false;
}

/*
function VK_login(callback) {
    social_login_callback = callback;
    var vw = window.open('https://oauth.vk.com/authorize?client_id=4494300&scope=offline,wall&redirect_uri=http://hotline3.lobachev.dev/aj/social-auth/vk-auth/&response_type=code', 'vk_auth', 'width=700,height=500');
    return false;
}*/

function TW_login(callback) {
    social_login_callback = callback;
    selected_social_ident = 'Twitter';

    jQuery.get('/aj/social-auth/twitter-authurl/', function(url)
    {
        window.open(url, 'tw_auth');
    });
}

// calls when login window is closed
function TW_login_success()
{
    social_login_proccess_success();
}

var gplus_auth_started;
function GPlus_login(callback)
{
    gplus_auth_started = false;
    social_login_callback = callback;
    selected_social_ident = 'GPlus';

    var additionalParams = {
        callback: function (authResult){

            if (!gplus_auth_started && authResult['access_token'])
            {
                if (authResult['status']['signed_in'])
                {
                    if (authResult['status']['method'] == 'PROMPT')
                    {
                        gplus_auth_started = true;
                        
                        var arr = {
                            access_token: authResult['access_token'],
                            token_type: authResult['token_type'],
                            expires_in: authResult['expires_in'],
                            id_token: authResult['id_token'],
                            created: authResult['issued_at']
                        };

                        jQuery.post('/aj/social-auth/gplus-auth/', arr, function()
                        {
                            social_login_proccess_success();
                        });
                    }
                }
            }
        },
        clientid: social_app_ids['4'],
        cookiepolicy: 'none',
        scope: 'https://www.googleapis.com/auth/plus.login'
    };

    gapi.auth.signIn(additionalParams);
}


function isSocialsValid(sids)
{
    var error = false;
    var cb = function(){};

    jQuery.ajax({
        type: "POST",
        async: false,
        url: '/aj/social-valid-tokens/',
        dataType: 'json',
        data: { sids: sids},
        success: function(sids_validity)
        {
            for (var i in sids_validity)
            {
                if (sids_validity[i] == 0)
                {
                    error = true;

                    if (i == 1)
                    {
                        FB_login(cb);
                    }
                    else if (i == 2)
                    {
                        VK_login(cb);
                    }
                    else if (i == 3)
                    {
                        TW_login(cb);
                    }
                    else if (i == 4)
                    {
                        GPlus_login(cb);
                    }
                }
            }
        }
    });

    return error ? false : true;
}

// Ставит флаг перед публикацией отзыва на хотлайне что нужно постить на стену ВК (после успешной публикации отзыва)
function VKSetPostFlag(val)
{
    jQuery.jStorage.set('vk_need_post', val, {TTL: 1000*60*2});
}

// get flag one time
function VKGetPostFlag()
{
    var flag = jQuery.jStorage.get('vk_need_post', 0);
    jQuery.jStorage.deleteKey('vk_need_post');

    return flag;
}

// wall posting
function VKPost(data)
{
    if (data && typeof(data['owner_id']) != 'undefined')
    {
        window.vkAsyncInit = function() {
            VK.init({ apiId: social_app_ids['2']});
            VK.api('wall.post', data, function(e){

            });
        };
    }
}

function setSocialAuthFlag(sident)
{
    setCookie(social_auth_flag_cookie_name, sident, new Date(new Date().getTime()+150000), '/', hl_domain);

    // also reset closed popup flag
    setCookie(noemail_close_popup_cookie, 0, new Date(new Date().getTime()-100), '/', hl_domain);
}

function clearSocialAuthFlag()
{
    setCookie(social_auth_flag_cookie_name, 0, new Date(new Date().getTime()-100), '/', hl_domain);
}

function savePopupUserEmail(email)
{
    setCookie(social_auth_email_cookie_name, email, null, '/', hl_domain); // write email into cookie
}