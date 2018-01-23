wo_overlay_loader();

function detectmob() {
    if( navigator.userAgent.match(/Android/i)
        || navigator.userAgent.match(/webOS/i)
        || navigator.userAgent.match(/iPhone/i)
        || navigator.userAgent.match(/iPad/i)
        || navigator.userAgent.match(/iPod/i)
        || navigator.userAgent.match(/BlackBerry/i)
        || navigator.userAgent.match(/Windows Phone/i)
    ){
        return true;
    }
    else {
        return false;
    }
}

function NameBro() {
    var ua = navigator.userAgent;

    if (ua.search(/MSIE/) != -1) return 'ie';
    if (ua.search(/Firefox/) != -1) return 'firefox';
    if (ua.search(/Opera/) != -1) return 'opera';
    if (ua.search(/Chrome/) != -1) return 'chrome';
    if (ua.search(/Safari/) != -1) return 'safari';
    if (ua.search(/Konqueror/) != -1) return 'konqueror';
    if (ua.search(/Iceweasel/) != -1) return 'debian';
    if (ua.search(/SeaMonkey/) != -1) return 'monkey';

    // Браузеров очень много, все вписывать смысле нет, Gecko почти везде встречается
    if (ua.search(/Gecko/) != -1) return 'Gecko';

    // а может это вообще поисковый робот
    return "unknow";
}

var bro = NameBro();

//Убираем слэш
function _slash(a) {
    return a.replace(/[/]?(.*?)[/]*$/, "$1");
}

//Ставим адресс
function _push( page ) {


    var nowPage = decodeURI( _slash(window.location.pathname.toString()) );
    var page = _slash( page );

    if( nowPage == page ) {

        return;
    }


    if( bro != "ie" ) { window.history.pushState({page: page, type: "page"}, document.title, '/'+page); } else { window.location.hash = page; }


}

//Анимация загрузки
function wo_overlay_loader(status, cb) {

    if( !status ) {

        $("#wo-overlay-loader").fadeIn(100, function() {

            if( cb ) cb();

        });

    } else if( status ) {

        setTimeout(function() {

            $(".wo-overlay-loader").fadeOut(100, function() {

                if( cb ) cb();

            });


        }, 2000);

    }

}

//Анимация загрузки в Header
function wo_header_loader(status) {

    if( !status ) {

        $(".site_header").prepend('<div class="wo-header-loader">'+

            '<div class="line"></div>'+
            '<div class="line"></div>'+
            '<div class="line"></div>'+

            '</div>');

        $(".wo-header-loader").fadeIn(100);

    } else if( status ) {

        $(".wo-header-loader").fadeOut(100, function() {

            $(this).remove();

        })

    }

}

//Dropdown
function wo_dropdown(e, t) {

    if( t ) {

        var $this = $(t);

        if( $this.parents(".dropdown").length ) {

            var $target = $this.parents(".dropdown").find($this.attr("wo-dropdown"));

        } else {

            var $target = $($this.attr("wo-dropdown"));

        }


    } else {

        var $target = $(e.target);

    }


    var active = false;
    if( $target.hasClass("dropdown_target-active") ) var active = true;

    $(".dropdown").removeClass("dropdown-active");
    $(".dropdown_target-active").removeClass("dropdown_target-active dropdown_menu_top");

    if( !active && $target.hasClass("dropdown_target") ) {

        var $dropdown = $target.parents(".dropdown");

        $dropdown.addClass("dropdown-active");
        $target.addClass("dropdown_target-active");

        if( $("body").width() < $target.outerWidth(true) + $target.offset().left ) {

            $dropdown.css({"justify-content": "flex-end"});

        } /*else if( $target.offset().left <= 0 ) {

         $dropdown.css({"justify-content": "flex-start"});

         }*/

        if( window.screen.height < $target.outerHeight(true) + $target[0].getBoundingClientRect().top ) {

            $target.addClass("dropdown_menu_top");

        } else $target.removeClass("dropdown_menu_top");

    }

}

$(document).on("click", "*[wo-dropdown]", function (e) {

    wo_dropdown(e, this);

});

$(document).on("click", function (e) {

    var $this = $(e.target);

    if( $this.hasClass("dropdown_target-active") || $this.parents(".dropdown_target-active").length || $this.attr("wo-dropdown") || $this.parents("*[wo-dropdown]").length ) return;
    else {

        wo_dropdown(e);

    }

});



//Bounce
var wo_bounce_timeout = false;

function wo_bounce($this) {

    $this.find('.wo-bounce').remove();

}

$(document).on("mousedown", "*[wo-bounce-click]", function() {

    var $this = $(this);

    if( wo_bounce_timeout ) clearTimeout(wo_bounce_timeout);
    $this.find(".wo-bounce").remove();

    $this.append('<span class="wo-bounce"></span>');

}).on("mouseup", "*[wo-bounce-click]", function() {

    var $this = $(this);

    window.wo_bounce_timeout = setTimeout(function() {

        wo_bounce($this);

    }, 500);

});

$(document).on("mouseenter", "*[wo-bounce-hover]", function() {

    var $this = $(this);

    $this.find(".wo-bounce").remove();

    $this.append('<span class="wo-bounce"></span>');

}).on("mouseleave", "*[wo-bounce-hover]", function() {

    var $this = $(this);

    $this.find(".wo-bounce").remove();

});


//Counter
(function( $ ){


    $.fn.counter = function(n, s) {


        for( i=0; i < this.length; i++ ) {

            $this = $(this[i]);


            if( !s ) var selector = ".quantity";
            else var selector = s;

            var $quantity = $this.find(selector);
            var _quantity = $quantity[0];


            if( typeof n != "number" ) {

                if( _quantity.numb ) {

                    if( n == "+" ) ++_quantity.numb;
                    else if( n == "-" ) --_quantity.numb;

                } else {

                    if( n == "+" ) _quantity.numb = Number( $quantity.text() ) + 1;
                    else if( n == "-" ) _quantity.numb = Number( $quantity.text() ) - 1;

                }

            } else _quantity.numb = n;


            $quantity.stop().animate({"top": "-100%"}, 500, function() {

                var $this = $(this);


                $this.text(this.numb);

                $this.css({"top":"100%"});
                $this.animate({"top": "0"}, 100);

            });

        }


        return this;

    }


})( jQuery );


//Popup
$(document).on("click", ".wo-popup", function(e) {

    if( $(e.target).hasClass('wo-popup') ) wo_dialogClose(this);
    else return true;

});

//Закрываем PopUp
//Или удаляем, если deleteDialog = true
function wo_dialogClose( dialog, deleteDialog ) {

    if( deleteDialog ) var deleteDialog = false;

    if( typeof dialog == 'string') var dialog = $(dialog);
    else if( typeof dialog == 'object' && $(dialog).hasClass("wo-popup") ) var dialog = $(dialog);
    else if( typeof dialog == 'object' ) var dialog = $(dialog).parents(".wo-popup");
    else var dialog = $(".wo-popup");

    dialog.css({"display":"flex"}).fadeOut(100, function() {

        if( !$(".wo-popup:visible").length ) $("body").css({"overflow":"auto"});
        dialog.removeClass("wo-active-dialog");

        if( deleteDialog ) dialog.remove();

    });



}

//Показываем PopUp
function wo_dialogShow(dialog) {

    $("body").css({"overflow":"hidden"});

    if( typeof dialog == 'string') var dialog = $(dialog);
    else if( typeof dialog == 'object' && $(dialog).hasClass("wo-popup") ) var dialog = $(dialog);
    else if( typeof dialog == 'object' ) var dialog = $(dialog).parents(".wo-popup");
    else var dialog = $(".wo-popup");

    dialog.css({"display":"flex", "opacity": 0}).fadeTo(500, 1, function() {

        dialog.addClass("wo-active-dialog");

    });



}

//Формируем диалог
//параметр type - класс для стилизации: warning и т.д.
//buttons - массив обьектов, кнопки которые будут отображаться снизу
//buttons: {text:"My button", callback:alert('Hello World!'), href: "http://site.com", blank: true/false}
//Например wo_dialog("Hello", false, [{text: "Wow", href: "http://google.com", blank: true}], "warning")

var wo_dialogID = 0;
function wo_dialog(title, content, buttons, type, dark ) {

    //Стилизация фона
    if( !dark ) var overlay = 'wo-white-popup-bg';
    else var overlay = 'wo-dark-popup-bg';

    if( !type ) var type = '';

    //ID диалога
    wo_dialogID++;

    if( content ) var content = '<div class="wo-dialog-content">'+ content +'</div>';
    else var content = '';

    var bottom = '';

    if( !buttons ) var bottom = '<div class="wo-btn wo-btn_sm wo-btn_link" onclick="wo_dialogClose(this, true);">Закрыть</div>';
    else {

        buttons.forEach(function(item) {


            if( item.callback ) var callback = 'onclick="'+ item.callback +'"';
            else var callback = '';

            if( !item.type ) item.type = '';

            var btn = '<div class="wo-btn wo-btn_sm '+item.type+'" '+callback+'>'+item.text+'</div>';

            if( item.blank ) var target = "_blank";
            else var target = "_self";

            if( item.href ) var btn = '<a target="'+ target +'" href="'+ item.href +'">'+ btn +'</a>';

            bottom = bottom + btn;

        });

    }

    if( title ) var head = '<div class="wo-popup-head '+type+' clear">'+
        '<div class="title left">'+ title +'</div>'+
        '</div>';
    else var head = '';

    //Шаблон диалога
    var dialog = '<div id="wo-dialog-'+wo_dialogID+'" class="wo-popup '+ overlay +' fixed_overlay">'+
        '<div class="wo-popup-dialog">'+

        head+

        content+

        '<div class="wo-dialog-bottom flex-end-center">'+


        bottom+


        '</div>'+
        '</div>'+
        '<div>';


    //Добавляем диалог
    $('body').append( dialog );

    //Показываем диалог
    wo_dialogShow( '#wo-dialog-'+wo_dialogID );

}


/*
 Чек-бокс
 checked - отметить чек-бокс:true, false, auto (если auto, то toggle checked)
 preventMulti - если отмечаем принудительно, предотвратить выделение всех чек-боксов
 */
function wo_toggleCheckBox( what, checked, preventMulti ) {

    if( !checked ) var checked = 'auto';
    if( !preventMulti ) var preventMulti = false;

    if( typeof what == 'string' || ( typeof what == 'object' && !what.length ) ) var t = $(what);
    else if( typeof what == 'object' ) var t = what;


    if( t.hasClass('wo-checkbox') ) {

        var input = t;

    } else {

        var input = t.find('.wo-checkbox');

    }


    if( checked === false || ( checked === 'auto' && input.hasClass("wo-checkbox-checked") ) ) {

        input.removeClass("wo-checkbox-checked").prop( "checked", false );

    } else if( checked === true || ( checked === 'auto' && !input.hasClass("wo-checkbox-checked") ) ) {

        input.addClass("wo-checkbox-checked").prop( "checked", true );

    }



    //Выбираем несколько check-box
    var multi = input.attr("multi-check");
    if( multi && !preventMulti ) {

        var block = $(multi);

        //Счетчик выделенныъ элементов
        var counter = $(input.attr("wo-checkbox-counter"));
        var quantity = counter.find(".quantity");



        if( input.hasClass("wo-checkbox-checked") ) {

            block.find(".wo-checkbox").addClass("wo-checkbox-checked").prop( "checked", true );

            counter.fadeIn(100);

        } else {

            block.find(".wo-checkbox").removeClass("wo-checkbox-checked").prop( "checked", false );

            //Если ничего не выделено, то прячем счетчик
            counter.fadeOut(100);

        }

        //Обновляем счетчик
        quantity.text( block.find(".wo-checkbox-checked").length );

    }

}

//Вешаем обработчик
$(document).on("click", "*[wo-checkbox]", function() {

    wo_toggleCheckBox( this );

});




//Вешаем обработчик на multi-checkbox, если нет чекнутых, то снимаем выделение с общего checkbox
$(document).on("click", "*[multi-checkbox-target]", function() {

    var multi = $(this).attr("multi-checkbox-target");
    var block = $(multi);

    var input = $("*[multi-check='"+multi+"']");

    //Счетчик выделенныъ элементов
    var counter = $(input.attr("wo-checkbox-counter"));
    var quantity = counter.find(".quantity");

    if( !input.hasClass('wo-checkbox') ) {

        var input = input.find('.wo-checkbox');

    }

    //Обновляем счетчик
    quantity.text( block.find(".wo-checkbox-checked").length );

    if( !block.find(".wo-checkbox-checked").length  ) {

        input.removeClass("wo-checkbox-checked").prop( "checked", false );
        input.removeClass("wo-checkbox-half");

        //Если ничего не выделено, то прячем счетчик
        counter.fadeOut(100);

    } else if( block.find(".wo-checkbox-checked").length != block.find(".wo-checkbox").length ) {

        input.addClass("wo-checkbox-half");

        counter.fadeIn(100);

    } else {

        input.addClass("wo-checkbox-checked").prop( "checked", true );
        input.removeClass("wo-checkbox-half");

        counter.fadeIn(100);

    }

});













//---------HINTS------------//

/*

 Для использования плагина, необходимо задать wo-hint атрибут элементу, например:
 <div wo-hint="Hello World">
 По умолчанию выравнивание проихсодит автоматически, но можно его установить
 при помощи атрибута wo-hint-align="top/bottom/center left/right/center"

 */

var hintID = 0;
var hintTimeout = false;
$(document).on("mouseenter", '*[wo-hint]', function (event) {


    if( detectmob() ) return;

    var t = $(this);

    var hint_hide_time = 2000;

    var text = t.attr("wo-hint");
    var align = t.attr("wo-hint-align");
    var id = t.attr("wo-hint-id");

    var rect = this.getBoundingClientRect();



    //ID подсказки
    var id = ++hintID;

    //Задаем ID И добавляем подсказку
    t.attr({"wo-hint-id": id});

    if( $("body").prepend('<div id="wo-hint'+id+'" class="wo-hint">'+text+'</div>') ) {

        var hint = $("#wo-hint"+id);

    }





    var top = rect.top + $("body, html").scrollTop();
    var left = rect.left;



    //Выравниванеи подсказки
    var correct = 15;

    if( align ) {

        var align = align.split(" ");
        if( !align[1] ) align[1] = align[0];


        //По вертикали
        if( align[0] == 'top' && top - hint.outerHeight() - correct > correct ) {

            var top = top - hint.outerHeight() - correct;
            hint.addClass("wo-top-hint");

        } else if( align[0] == 'bottom' && top + t.outerHeight() + correct < window.screen.height - correct ) {

            var top = top + t.outerHeight() + correct;
            hint.addClass("wo-bottom-hint");

        } else {

            var top = top + t.outerHeight()/2 - hint.outerHeight()/2;

        }


        //По горизонтали
        if( align[1] == 'left' && left - hint.outerWidth() - correct > correct ) {

            var left = left - hint.outerWidth() - correct;
            hint.addClass("wo-left-hint");

        } else if( align[1] == 'right' && left + t.outerWidth() + correct < window.screen.width - correct ) {

            var left = left + t.outerWidth() + correct;
            hint.addClass("wo-right-hint");

        } else {

            var left = left + t.outerWidth()/2 - hint.outerWidth()/2;

        }

        //Выравниваем автоматически
    } else {



        //По вертикали
        var top = top + t.outerHeight()/2 - hint.outerHeight()/2;




        //По горизонтали
        if( left - hint.outerWidth() - correct > correct ) {

            var left = left - hint.outerWidth() - correct;
            hint.addClass("wo-left-hint");

        } else if( left + t.outerWidth() + correct < window.screen.width - correct ) {

            var left = left + t.outerWidth() + correct;
            hint.addClass("wo-right-hint");

        }

    }

    if( hintTimeout ) clearTimeout(hintTimeout);
    window.hintTimeout = setTimeout(function() {

        hint.css({"top": top+"px", "left": left+"px"}).fadeTo(100, 1);

        //Прячем подсказку
        window.hintTimeout = setTimeout(function() {

            hint.stop().fadeOut(100, function() {

                hint.remove();

            });

        }, hint_hide_time);

    }, 200);




}).on("mouseleave", '*[wo-hint]', function () {

    if( hintTimeout ) clearTimeout(hintTimeout);

    var t = $(this);
    var id = t.attr("wo-hint-id");
    var hint = $("#wo-hint"+id);

    hint.stop().fadeOut(100, function() {

        hint.remove();

    });



});




//---------HINTS
