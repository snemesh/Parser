/**
 * Login Popups Functions
 * @constructor
 */
var LoginPopups = function()
{
    var self = this;

    this.validEmail = function(email)
    {
        return email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    }

    this.emptyEmail = function(email)
    {
        return email == '';
    }

    /**
     * Check if email is free
     * @param email
     * @returns int 1 or 0
     */
    this.freeEmail = function(email)
    {
        var result = 0;

        jQuery.ajax({
            type: "POST",
            url: '/aj/is-free-email/',
            data: {email: email},
            async: false,
            success: function(res){
                result = parseInt(res);
            },
            dataType: 'html'
        });

        return result;
    }

    /**
     * Check if email is rejected (in black list)
     * @param email
     * @returns int 1 or 0
     */
    this.rejectedEmail = function(email)
    {
        var result = 0;

        jQuery.ajax({
            type: "POST",
            url: '/aj/is-rejected-email/',
            data: {email: email},
            async: false,
            success: function(res){
                result = parseInt(res);
            },
            dataType: 'html'
        });

        return result;
    }

    /**
     * No Email Popup (if user has no email for some reasons)
     * @type {{popupId: string, storageVarName: string, init: Function, showPopup: Function, assignEvents: Function, setFlag: Function, getFlag: Function}}
     */
    this.noEmailPopup = {
        popupId: '#no-email-popup',
        storageVarName: 'no_email_popup_show',

        init: function ()
        {
            if (jQuery(this.popupId).length/* && this.getFlag()*/)
            {
                this.showPopup();
            }
        },
        showPopup: function()
        {
            jQuery(this.popupId).show();
            this.assignEvents();
        },
        assignEvents: function()
        {
            jQuery(this.popupId + ' .close').click(function(e){
                e.preventDefault();
                jQuery(self.noEmailPopup.popupId).hide();
                //self.noEmailPopup.setFlag(0); // wont show in future
            });

            jQuery(this.popupId + ' form').submit(function(e){
                e.preventDefault();
                var email = jQuery(self.noEmailPopup.popupId + ' :text').val();

                jQuery.post('/aj/set-user-email/', {email: email}, function(res){
                    if (res == 'ok')
                    {
                        jQuery(self.noEmailPopup.popupId + ' .close').click();
                        self.successPopup.showPopup();
                    }
                    else
                    {
                        jQuery(self.noEmailPopup.popupId + ' .errors').text(res);
                    }
                });
            });
        },
        setFlag: function(value)
        {
            if (jQuery.jStorage.storageAvailable())
                jQuery.jStorage.set(this.storageVarName, value);
            else
            {
                setCookie(this.storageVarName, value, new Date(new Date().getTime()+(3600*24*364*1000)), '/', hl_domain); // 1 year
            }
        },
        getFlag: function()
        {
            return jQuery.jStorage.storageAvailable() ? jQuery.jStorage.get(this.storageVarName, 1) : getCookie(this.storageVarName);
        }
    }

    /**
     * No Email Social Popup (offer to setup email while logging thru social)
     * @type {{popupId: string, sid: null, init: Function, setSid: Function, showPopup: Function, popupExists: Function, onClose: Function, onSubmit: Function}}
     */
    this.noEmailSocialPopup =
    {
        popupId: '#no-email-social-popup',
        sid: null,

        init: function()
        {
            if (self.noEmailSocialPopup.popupExists())
            {
                // set current social id
                self.noEmailSocialPopup.setSid(jQuery(this.popupId).data('type'));

                // check if extended popup has nedd already showed
                var before_entered_email = self.noEmailSocialPopupExtended.getEmail();

                // show it again
                if (before_entered_email)
                {
                    self.noEmailSocialPopupExtended.setEmail(before_entered_email);
                    self.noEmailSocialPopupExtended.showPopup();
                }
                else // or main popup
                {
                    self.noEmailSocialPopup.showPopup()
                }
            }
            else // main popup not exist, clear stored email
            {
                self.noEmailSocialPopupExtended.setEmail(null);
            }
        },
        setSid: function(sid)
        {
            this.sid = sid;
        },
        showPopup: function()
        {
            var popup = jQuery(this.popupId);

            jQuery.blockUI({
                message: popup,
                css: {
                    border: 0,
                    left: (jQuery(window).width() - popup.width()) / 2,
                    top: (jQuery(window).height() - popup.height()) / 2,
                    textAlign: 'left',
                    cursor: 'default'
                }
            });

            this.assignEvents();
        },
        assignEvents: function()
        {
            // close event
            jQuery(this.popupId + ' .close').click(function(e){
                e.preventDefault();
                self.noEmailSocialPopup.onClose();
            });

            // form submited
            jQuery(this.popupId + ' form').submit(function(e){
                e.preventDefault();
                self.noEmailSocialPopup.onSubmit(jQuery(this), self.noEmailSocialPopup.popupId);
            });
        },
        popupExists: function()
        {
            return jQuery(this.popupId).length;
        },
        onClose: function()
        {
            console.log('login validation popup closed');

            setCookie(noemail_close_popup_cookie, 1, null, '/', hl_domain);
            jQuery.unblockUI();
        },
        onSubmit: function(formObj, popupId)
        {
            var err_block = formObj.find('.errors');
            var email = jQuery.trim(formObj.find(':text').val());

            err_block.text('');

            if (self.emptyEmail(email))
            {
                err_block.text(self.errors.email_empty);
                formObj.find(':text').focus();
            }
            else if (!self.validEmail(email))
            {
                err_block.text(self.errors.email_invalid);
            }
            else
            {
                var popup = jQuery(popupId);

                // block popup while processing
                popup.block({ message: '<img src="/img/s/wait.gif" style="margin:0 auto;display:block;float:none">', css: { border: '0', backgroundColor: 'none'}});

                if (self.freeEmail(email))
                {
                    if (self.rejectedEmail(email))
                    {
                        popup.unblock();
                        err_block.text(self.errors.email_rejected);
                    }
                    else
                    {
                        savePopupUserEmail(email); // save entered email

                        // allow script properly create and login new account, the reload
                        jQuery.get('/aj/dummy/', function () { location.reload(); });
                    }
                }
                else // email exist, show extended popup
                {
                    popup.unblock();
                    self.noEmailSocialPopupExtended.setEmail(email);
                    self.noEmailSocialPopupExtended.showPopup();
                }
            }
        }
    }

    /**
     * No Email Social Popup Extended (if entered email exists)
     * @type {{email: null, popupId: string, storageVarName: string, onSubmit: Function, showPopup: Function, setEmail: Function, getEmail: Function, onClose: Function}}
     */
    this.noEmailSocialPopupExtended =
    {
        // properties
        email: null,
        popupId: '#exist-email-social-popup',
        storageVarName: 'exist_email_popup_value',

        //methods
        onSubmit: function(formObj)
        {
            var err_block = formObj.find('.errors');
            var email = jQuery.trim(formObj.find(':hidden').val());
            var pass = jQuery.trim(formObj.find(':password').val());

            err_block.html('');

            if (pass == '')
            {
                formObj.find(':password').focus();
                return false;
            }

            jQuery.post('/aj/login/', {login: email, password: pass, return_only_status: 1}, function(status){
                var status = parseInt(status);

                if (status == 1) // success login
                {
                    jQuery.post('/profile/ajax/linkSocial/', {sid: self.noEmailSocialPopup.sid}, function(res){
                        if (res == 'ok')
                        {
                            self.noEmailSocialPopupExtended.onClose();
                            location.reload();
                        }
                        else
                        {
                            err_block.html(self.errors.social_link_unknown_error);
                        }
                    });
                }
                else if (status == -1)
                {
                    err_block.html(self.errors.login_wrong_passw);
                }
                else if (status == -2)
                {
                    err_block.html(self.errors.login_empty_passw);
                }
                else if (status == 2)
                {
                    err_block.html(self.errors.login_banned);
                }
                else
                {
                    err_block.html(self.errors.login_unconfirmed);
                }
            });
        },
        showPopup: function()
        {
            if (!this.email)
            {
                console.log('No email set for noEmailSocialPopupExtended');
                return null;
            }

            if (!self.noEmailSocialPopup.sid)
            {
                console.log('No sid set for noEmailSocialPopup');
                return null;
            }

            var ob = this;
            var popup = jQuery(this.popupId);

            // set email in some places
            jQuery(this.popupId + ' [data-id="email"]').val(this.email).html(this.email);

            var social_name;
            switch(parseInt(self.noEmailSocialPopup.sid))
            {
                case 1: social_name = 'Facebook'; break;
                case 2: social_name = 'VKontakte'; break;
                case 3: social_name = 'Twitter'; break;
                case 4: social_name = 'Google+'; break;
            }

            jQuery(this.popupId + ' [data-id="soc_name"]').html(social_name);

            jQuery.blockUI({
                message: popup,
                css: {
                    border: 0,
                    left: (jQuery(window).width() - popup.width()) / 2,
                    top: (jQuery(window).height() - popup.height()) / 2,
                    textAlign: 'left',
                    cursor: 'default'
                }
            });

            // close event
            jQuery(this.popupId + ' .close-x').click(function(e){ e.preventDefault(); ob.onClose(); });

            // New account form
            jQuery(this.popupId + ' form[data-form="email"]').submit(function(e){
                e.preventDefault();
                self.noEmailSocialPopup.onSubmit(jQuery(this), ob.popupId); // call from parent
                setSocialAuthFlag(self.noEmailSocialPopup.sid);
            });

            // Login form
            jQuery(this.popupId + ' form[data-form="pass"]').submit(function(e){
                e.preventDefault();
                ob.onSubmit(jQuery(this));
                setSocialAuthFlag(self.noEmailSocialPopup.sid);
            });
        },
        /**
         * Set email for popup purposes
         * @param string email
         */
        setEmail: function(value)
        {
            setCookie(this.storageVarName, value, null, '/', hl_domain);
            this.email = value;
        },
        getEmail: function()
        {
            return getCookie(this.storageVarName);
        },
        onClose: function()
        {
            this.setEmail(null);
            self.noEmailSocialPopup.onClose();
        }
    };

    /**
     * Offer to link user account with socials
     * @type {{popupId: string, storageVarName: string, init: Function, setFlag: Function, getFlag: Function}}
     */
    this.socialLinkOfferPopup = {
        popupId: '#social-link-offer-popup',
        storageVarName: 'show_soc_popup',

        init: function()
        {
            var ob = this;

            // check if need to show (default - yes)
            if (this.getFlag() && !isUISmallVersion())
            {
                // show
                jQuery(this.popupId).fadeIn('fast');

                jQuery(document).on('click', this.popupId + ' a.close', function(e){
                    e.preventDefault();
                    ob.setFlag(0); // no need to show in future
                    jQuery(ob.popupId).hide();
                });

                jQuery(document).on('click', this.popupId + ' span a', function(e){
                    e.preventDefault();
                    ob.setFlag(0); // no need to show in future
                    location.href = jQuery(this).attr('href');
                });
            }
        },
        setFlag: function(value)
        {
            if (jQuery.jStorage.storageAvailable())
                jQuery.jStorage.set(this.storageVarName, value);
            else
            {
                setCookie(this.storageVarName, value, new Date(new Date().getTime()+(3600*24*364*1000)), '/', hl_domain); // 1 year
            }
        },
        getFlag: function()
        {
            return jQuery.jStorage.storageAvailable() ? jQuery.jStorage.get(this.storageVarName, 1) : getCookie(this.storageVarName);
        }
    };

    /**
     * Success popup (baloon)
     * @type {{popupId: string, showPopup: Function}}
     */
    this.successPopup =
    {
        popupId: '#login-popup-ok',
        closeTimeout: 2000,

        showPopup: function()
        {
            jQuery(this.popupId).fadeIn('slow', function(){ setTimeout(function(){ jQuery(self.successPopup.popupId).fadeOut('fast'); }, self.successPopup.closeTimeout); });
        }
    }

    /**
     * Errors
     */
    this.errors = {
        email_rejected: t('Извините, данный адрес не может быть использован. Пожалуйста, укажите другой.'),
        email_empty: t('Вы ничего не ввели.'),
        email_invalid: t('Некорректный email.'),
        login_banned: t('Вход заблокирован.'),
        login_unconfirmed: t('Извините, учетная запись с указанным e-mail еще не активирована.'),
        login_wrong_passw: t('Извините, вы ввели неправильный пароль. Если вы забыли свой пароль, вы можете его ') + '<a href="/user/reminder/">' + t('изменить') + '</a>.',
        login_empty_passw: t('Поле пароль не может быть пустым. Если вы забыли пароль, мы можем вам его ') + '<a href="/user/reminder/">' + t('напомнить') + '</a>.',
        social_link_unknown_error: t('Не удалось связать аккаунт с социальной сетью. Попробуйте повторить вход с использованием данной сети.')
    }

}
