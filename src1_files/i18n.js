var translations = {};
function t(msg){
    if(typeof(translations[msg]) != 'undefined'){
        return translations[msg];
    }
    return msg;
}


jQuery(document).on('click','a.i18n-hide-translation-container',function(){
    jQuery(this).parents('.i18n-translation-textbox').hide();
});
jQuery(document).on('click','a.i18n-show-translation-container',function(){
    jQuery(this).parent().find('.i18n-translation-textbox').show();
});