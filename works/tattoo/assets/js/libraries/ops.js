/*

 One ScrollPage

 */
;(function(factory) {

    'use strict';

    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports !== 'undefined') {
        module.exports = factory(require('jquery'));
    } else {
        factory(jQuery);
    }

}(function($) {

    'use strict';

    var OPS = window.OPS || {};

    OPS = (function() {



        function OPS(element, settings) {

            var _ = this;

            //Устанавливаем настройки
            settings.$this = $(element);
            settings.refreshResizeTimeOut = false;
            settings.onePageFlag = false;
            settings._scrolled = 0;
            settings.documentClick = false;


            _.settings = mergeSettings(settings);
            _.settings.currentPage = _.settings.startPage;
            _.settings.$childrens = typeof _.settings.selector === 'string' ? $(_.settings.selector) : _.settings.selector;



            $.extend(_, _.settings);

            _.init();


        }

        return OPS;

    }());


    function mergeSettings(options) {

        const settings = {
            selector: '.frame',
            duration: 200,
            keyboard: true,
            easing: 'ease-out',
            horizontal: false,
            startPage: 1,
            onInit: function() {},
            onChange: function() {},
            onResize: function() {},
            onDestroy: function() {},
        };

        var userSttings = options;
        for (var attrname in userSttings) {
            settings[attrname] = userSttings[attrname];
        }

        return settings;

    }



    //Initialize the plugin
    OPS.prototype.init = function() {

        var _ = this;

        _.renderPag();

        $("body, html").css({"overflow": "hidden"}).scrollTop(0);


        //Set transition
        _.$this.css({"transition": "top "+ (_.duration/1000) + "s, left "+ (_.duration/1000) + "s "+ _.easing +", "+ _.$this.css('transition') });

        //If horizontal scroll
        if( _.horizontal === true ) _.$this.addClass("ops-horizontal");
        else _.$this.addClass("ops-vertical");



        //Set start page
        if( !window.location.hash ) _.setPage('page', _.startPage);
        else _.anchor(window.location.hash);


        //Вешаем событие прокрутки
        _.$this.bind("mousewheel", _, _.controller);

        //Вешаем событие touch
        _.$this.bind("touchstart", _, _.touch);

        //Изменился размер окна
        $(window).bind("resize", _, _.windowResize);

        //Кнопки PgUp, PgDwn, Up, Down
        $(document).on("keydown", _, _.keydown);

        _.onInit.call(_);

    }


    OPS.prototype.destroy = function() {

        var _ = this;

        $("body, html").css({"overflow": "auto"});
        _.$this.css({"transition": ""});

        _.$this.unbind("mousewheel", _.controller);

        //Вешаем событие прокрутки
        _.$this.unbind("mousewheel", _.controller);

        //Вешаем событие touch
        _.$this.unbind("touchstart", _.touch);

        //Изменился размер окна
        $(window).unbind("resize", _.windowResize);

        //Кнопки PgUp, PgDwn, Up, Down
        $(document).unbind("keydown", _.keydown);

        $("body, html").scrollTop( _.$this.position().top * -1 );
        _.$this.css({"top": 0});

        _.onDestroy.call(_);

    }



    //Create pagination
    OPS.prototype.renderPag = function() {

        var _ = this;
        //var $body = $("body");


        //Делаем пагинацию
        if( _.$childrens.length ) {

            //$body.prepend('<div id="ops-pagination" class="ops-pagination"><div class="wrap"> <span class="runner" style="transition: top '+ (_.duration/1000) +'s,left '+ (_.duration/1000) +'s '+ _.easing +'"></span> </div></div>');

            //var $pagesWrap = $(".site_header_menu");
            //var points = '';

            /*_.$childrens.each(function(i) {

                var $t = $(this);

                points += '<div class="ops-pagination_item" page="'+ i +'"> <div class="point"></div> <div class="hint">'+$t.attr("one-page-hint")+'</div> </div>';


            });*/


            $(".site_header_menu .item:first").addClass("item-active");

            //$(".site_header_menu .item").bind("click", _, _.pagesNavEvent);

            //$pagesWrap.append(points).find(".ops-pagination_item").bind("click", _, _.pagesNavEvent);


            //If horizontal scroll
            //if( _.horizontal == true ) $("#ops-pagination").addClass("ops-pg-horizontal");
            //else $("#ops-pagination").addClass("ops-pg-vertical");


            //Наводим курсор на пагинацию
            /*$(document).on("mouseover", "#ops-pagination .ops-pagination_item", function(e) {

                var runner = $("#ops-pagination .runner");
                if( _.horizontal == false ) runner.css({"top": $(this).position().top +7 +"px" });
                else runner.css({"left": $(this).position().left +8 +"px" });

            }).on("mouseleave", "#ops-pagination .ops-pagination_item", function(e) {

                var runner = $("#ops-pagination .runner");
                if( _.horizontal == false ) runner.css({"top": $("#ops-pagination .active").position().top +7 +"px" });
                else runner.css({"left": $("#ops-pagination .active").position().left +8 +"px" });

            });*/



        }

    }



    //Scrolling
    OPS.prototype.setPage = function( difference, page ) {

        var _ = this;
        var $this = _.$this;

        if( _.onePageFlag ) return false;

        _.onePageFlag = true;


        var $currentPage = $this.find( _.selector +"[one-page-current='true']");

        if( page !== undefined ) {

            if(page == 0 ) var page = 1;

            if( page > _.$childrens.length ) var page = _.$childrens.length;


            if( _.currentPage == page ) var difference = 'refresh';
            --page;

        }


        //Переходим на страницу
        if( difference == 'page' && page !== undefined ) {


            var $nextPage = $( _.$childrens[page] );

        }



        //Если требуется корректировка
        else if( difference == 'refresh' ) {

            var $nextPage = $currentPage;


        }

        else if( difference < 0 ) {



            var $nextPage = $currentPage.next( _.selector );

        } else if( difference >= 0 ) {



            var $nextPage = $currentPage.prev( _.selector );

        }


        if( $nextPage.length && ( $nextPage.attr("one-page-current") !== 'true' || difference == 'refresh' ) ) {


            if( _.horizontal == false ) $this.css({"top": -$nextPage.position().top });
            else $this.css({"left": -$nextPage.position().left });

            if( $nextPage.attr("navigation") ) {

                $(".site_header").removeClass("site_header-dark").removeClass("site_header-white").addClass( 'site_header-' + $nextPage.attr("navigation") );


            }

            $currentPage.attr({"one-page-current": ""});
            $nextPage.attr({"one-page-current": "true"});


            var id = $nextPage.attr("id");

            //_push('#'+id);
            //window.location.hash = '#'+id;


            $(".site_header_menu .item-active").removeClass("item-active");
            $( $(".site_header_menu .item")[$nextPage.index()] ).addClass("item-active");

            /*if( $("#ops-pagination").is(":visible") ) {

                var runner = $("#ops-pagination .runner");
                if( _.horizontal == false ) runner.css({"top": $("#ops-pagination .active").position().top +7 +"px" });
                else runner.css({"left": $("#ops-pagination .active").position().left +8 +"px" });

            }*/




            setTimeout( function() {
                _.onePageFlag = false;
                _._scrolled = (_.horizontal) ? $this.offset().left : $this.offset().top;
                _.currentPage = $nextPage.index() + 1;
                _.onChange.call(_);
            }, _.duration );

        } else {

            _.onePageFlag = false;

        }

    }


    OPS.prototype.touch = function(_) {

        var _ = _.data;

        var $this = _.$this;

        _.documentClick = true;

        var touch = event.targetTouches[0];


        if( _.horizontal == false ) {
            var touchStart = touch.pageY;
            var startC = touch.pageY - $this.position().top;
        }
        else {
            var touchStart = touch.pageX;
            var startC = touch.pageX - $this.position().left;
        }

        var d = $(document);

        var touchMove = function(e) {

            _.documentClick = false;

            var touch = e.targetTouches[0];


            if( _.horizontal == false ) {

                var top = touch.pageY - startC;
                $this.css({"top": top+"px"});

            }
            else {

                var left = touch.pageX - startC;
                $this.css({"left": left+"px"});

            }


        }

        var touchUp = function(e) {

            $this = _.$this;

            d.unbind("touchmove", touchMove);

            if (e.type == "click") _.documentClick = true;
            if ( _.documentClick ){

                return;

            }


            var $current = $(_.selector +"[one-page-current='true']");
            var bound = $current[0].getBoundingClientRect();


            var calcPage = function(e) {




                if( _.horizontal == false ) {

                    var touchEnd = e.changedTouches[0].pageY;
                    var of_t = ( $this.offset().top < 0 ) ? ($this.offset().top*-1) : 0;

                    var page = Math.ceil( of_t / $current.height() );

                }
                else {

                    var touchEnd = e.changedTouches[0].pageX;
                    var of_l = ( $this.offset().left < 0 ) ? ($this.offset().left*-1) : 0;

                    var page = Math.ceil( of_l / $current.width() );

                }


                var diff = touchStart - touchEnd;


                if( touchStart == touchEnd ) return;


                //Листаем вправо
                if( diff > 0 ) {

                    if( page == _.currentPage ) ++page;

                }

                _.setPage('page', page);


            }


            setTimeout(function() {

                calcPage(e);

            }, _.duration);


            d.unbind("touchmove", touchMove);

            d.unbind("click touchend", touchUp);




        }

        d.bind("touchmove", touchMove);

        d.bind("click touchend", touchUp);


    }


    //Main controller
    OPS.prototype.controller = function(diff) {


        if( typeof diff == 'object' ) {

            var _ = diff.data;
            var difference = diff.deltaY;

        } else {

            var _ = this;
            var difference = diff;

        }




        if( _.onePageFlag ) return false;

        if( _.scrollingTimeOut ) {

            clearTimeout( _.scrollingTimeOut );

        }


        _.scrollingTimeOut = setTimeout(function() {

            if( ! _.onePageFlag ) _.setPage( difference );

        }, 10);

    }

    //Keyboard
    OPS.prototype.keydown = function(_) {

        var _ = _.data;

        if( _.keyboard == false ) return;

        var code = event.keyCode;

        //Если PgUp или Up
        if( (code == 38 && ! _.horizontal) || (code == 37 &&  _.horizontal) || code == 33 ) {

            _.controller( 1 );

        }

        //Если PgDwn или Down
        else if( (code == 40 && ! _.horizontal) || (code == 39 &&  _.horizontal) || code == 34 ) {

            _.controller( -1 );

        }

    }

    //Pagination
    OPS.prototype.pagesNavEvent = function(_) {

        var _ = _.data;


        var $t = $(this);
        if( $t.hasClass("active") ) return;

        var page = $t.attr("page");

        //alert( page )

        $(".site_header_menu .item-active").removeClass("item-active");
        $( $(".site_header_menu .item")[page] ).addClass("item-active");

        _.setPage( 'page', page );

    }

    //The window size has changed
    OPS.prototype.windowResize = function(_) {

        var _ = _.data;

        if( _.refreshResizeTimeOut ) clearTimeout( _.refreshResizeTimeOut );

        _.refreshResizeTimeOut = setTimeout( function() {

            _.controller( 'refresh' );
            _.onResize.call(_);

        }, 100);

    }

    //Get scrolled var
    OPS.prototype.scrolled = function() {

        return this._scrolled;

    }

    //Get current page
    OPS.prototype.current = function() {

        return this.currentPage;

    }

    //Prev Page
    OPS.prototype.prev = function() {

        var _ = this;

        _.controller(1);

    }

    //Prev Page
    OPS.prototype.next = function() {

        var _ = this;

        _.controller(-1);

    }

    //First Page
    OPS.prototype.first = function() {

        var _ = this;

        _.setPage('page', 0);

    }

    //Last Page
    OPS.prototype.last = function() {

        var _ = this;

        _.setPage('page', _.$childrens.length );

    }

    //Pass on the anchor
    OPS.prototype.anchor = function(anchor) {

        var _ = this;

        var page = _.$this.find( anchor ).index();

        ++page;

        if( page !== -1 )_.setPage( 'page', page );

    }





    $.fn.onePageScroll = function() {

        var _ = this,
            opt = arguments[0],
            args = Array.prototype.slice.call(arguments, 1),
            l = _.length,
            i,
            ret;

        for (i = 0; i < l; i++) {

            if (typeof opt == 'object' || typeof opt == 'undefined')
                _[i].onePageScroll = new OPS(_[i], opt);

            else
                ret = _[i].onePageScroll[opt].apply(_[i].onePageScroll, args);

            if (typeof ret != 'undefined') return ret;

        }

        return _;
    };

}));