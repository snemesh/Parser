if(typeof String.prototype.trim !== 'function') {
  String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, '');
  }
}
jQuery(document).ready(function($) {

    if(!Array.indexOf){
        Array.prototype.indexOf = function(obj){
            for(var i=0; i<this.length; i++){
                if(this[i]==obj){
                    return i;
                }
            }
        }
    }

    $.searchengine = {
        options: {
            cache: false //кешировать предыдущие апросы
        },
        _form: null,
        _strict_item: false,
        _isSubmit: false,
        _section: null,
        _type: 'all',
        setSection: function(section) {
            this._section = section;
        },
        setType: function(type) {
            this._type = type || 'all';
        },
        cache: {
            count: 0,
            response: null,
            request: null,
            get: function(request) {
                var option = $.searchengine.options.cache;
                if (!option) {
                    return false;
                }

                if (!this.request || this.request.term != request.term) {
                    return false;
                }

                if (typeof option == "number" && this.count >= option) {
                    return false;
                }
                this.count++;
                return this.response;
            },
            save: function(request, response) {
                this.count = 0;
                this.request = request;
                this.response = response;
            }
        },
        select: function(item) {
            window.location.assign(item.url);
        },

        filter: function(request, responce) {
            var _this = this;
            _this._strict_item = null;
            $.each(responce, function(index, value) {
                if (request.term.toLowerCase().trim() == value.label.toLowerCase().trim()) {
                    _this._strict_item = value;
                    return false;
                }
            });

            if (this._isSubmit) {
                if (_this._strict_item) {
                    // сохраняем поисковый запрос
                    saveSearchQuery(_this._strict_item.url, request.term);
                    
                    this.select(_this._strict_item);
                } else {
                    // сохраняем поисковый запрос
                    saveSearchQuery(this._form.attr('action'), request.term);

                    this._form.submit();
                }
                return false;
            }
            return true;
        },
        decorate: function(request, response) {

            function _decorate(term, text) {
                var subterms = term.split(' ');
                $.each(subterms, function(i, term) {
                    text = text.replace(
                        new RegExp(
                            "(?![^&;]+;)(?!<[^<>]*)(" +
                                $.ui.autocomplete.escapeRegex(term) +
                                ")(?![^<>]*>)(?![^&;]+;)", "gi"
                        ), "<strong>$1</strong>" );
                });
                return text;
            }

            var ru_str = ['А', 'Б', 'В','Г', 'Д','Е','Ё','Ж','З','И','Й','К','Л','М','Н','О','П','Р','С','Т','У','Ф','Х','Ц','Ч','Ш','Щ','Ъ','Ы','Ь','Э','Ю','Я','а','б','в','г','д','е','ё','ж','з','и','й','к','л','м','н','о','п','р','с','т','у','ф','х','ц','ч','ш','щ','ъ','ы','ь','э','ю','я', 'кс'];
            var en_str = ['A','B','V','G','D','E','JO','ZH','Z','I','J','K','L','M','N','O','P','R','S','T',
                'U','F','H','C','CH','SH','SHH',String.fromCharCode(35),'I',String.fromCharCode(39),'JE','JU',
                'JA','a','b','v','g','d','e','jo','zh','z','i','j','k','l','m','n','o','p','r','s','t','u','f',
                'h','c','ch','sh','shh',String.fromCharCode(35),'i',String.fromCharCode(39),'je','ju','ja', 'x'];

            function translit(org_str) {
                var tmp_str = [];
                for (var i = 0, l = org_str.length; i < l; i++) {
                    var s = org_str.charAt(i), n = ru_str.indexOf(s);

                    if(n >= 0) { tmp_str[tmp_str.length] = en_str[n]; }
                    else { tmp_str[tmp_str.length] = s; }
                }
                return tmp_str.join("");
            }

            return $.map(response, function(item, index) {
                item['value'] =  item['label'];
                //item['label'] = _decorate(translit(request.term), item['label']);
                item['label'] = _decorate(request.term, item['label']);
                return item;
            });
        },

        init: function() {
            var _this = this;

            this._form = $("#searchbox").parents('form:first');

            //modify renderer
            $.widget( "ui.autocomplete", $.ui.autocomplete, {
                _renderItem: function(ul, item) {
                    return $( "<li></li>" )
                        .data( "item.autocomplete", item )
                        .append( "<a>" + item.label + "</a>" )
                        .appendTo( ul );
                }
            });

            $("#searchbox").autocomplete({
                appendTo: '#live-search',
                source: function(request, callback) {
                    var response;

                    if (response = _this.cache.get(request)){
                        if (_this.filter(request, response)) {
                            callback(_this.decorate(request, response));
                        }
                    } else {
                        if (_this._type != 'all' && _this._section) {
                            request.type = _this._type;
                            request.section = _this._section;
                        }

                        $.ajax({
                            method: 'get',
                            dataType: 'json',
                            url:"/sr/autocomplete/",
                            data:request,
                            success:function(response) {
                             if(!response) response = [];
                            if (_this.filter(request, response)) {
                                    $.map(response, function(){

                                    });
                                    callback(_this.decorate(request, response));
                                }
                                _this.cache.save(request, response);
                            },
                            error: function(jqXHR, textStatus, errorThrown) {
                                /*if (console && console.log) {
                                    console.log(textStatus);
                                    console.log(errorThrown);
                                    console.log(jqXHR);
                                }*/
                            }
                        });

                    }
                },
                select: function (event, ui){
                    // сохраняем поисковый запрос
                    saveSearchQuery(ui.item.url, ui.item.value);

                    $.searchengine.select(ui.item);
                },
                focus:function(event,ui){$("#searchbox").val( $("<div/>").html(ui.item.label).text() );
                                         return false;},
                minLength: 2,
                delay: 300

            }).autocomplete( "instance" )._renderItem = function( ul, item ) {
                return $( "<li></li>" )
                    .data( "item.autocomplete", item )
                    .append( "<a>" + item.label + "</a>" )
                    .appendTo( ul );
            };

            $('#doSearch').click(function() {

                var defaultText = $('#searchbox').data('default');
                var val = $('#searchbox').val();
                 if (!val || val == defaultText) {
//                    alert('Не введен поисковый запрос');
                    return false;
                }

                _this._isSubmit = true;

                $("#searchbox").autocomplete('search');
                return false;
            });

            var selectror = $('.search-type');
            selectror.find('a').click(function() {
                var elm = $(this);
                var type = elm.data('type');
                var section = elm.data('section');

                //set state
                _this.setType(type);
                _this.setSection(section);
                if (type == 'section' && elm.data('action')) {
                    _this._form.attr('action', elm.data('action'));
                } else {
                    _this._form.attr('action', '/sr/');
                }

                //switch menu
                selectror.find('div').prepend(elm);
                selectror.find('span').text(elm.text());
                selectror.find('a').removeClass('one');
                elm.addClass('one');
            }).each(function() {
                var elm = $(this);
                    if (elm.data('selected') == 1) {
                        elm.click();
                    }
            });
        }
    };

    $.searchengine.init();

    function saveSearchQuery(url, q)
    {
        // сохраняем поисковый запрос
        $.ajax({
            async: false,
            type: 'POST',
            url: '/aj/toolbar/savequery/',
            data: {url: url, q: q}
        });
    }
});