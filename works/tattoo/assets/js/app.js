function loaded() {

    setTimeout(function() {

        $(".cover").addClass("cover-animated");
        $(".site_header-fixed").addClass("site_header-fixed-ready");

    }, 1000);

}

function wo_init() {

    $("#home").css({"height": $(window).height() + "px"});

    $("#body").removeClass("one_scroll");
    $(".site_header").removeClass("site_header-fixed").removeClass("site_header-dark").removeClass("site_header-white");



    $("#gallery-container").height('auto');
    wo_gallery();

    wo_overlay_loader(true, loaded);

    $(window).resize(function() {

        wo_gallery();

    });

    $(window).scroll(function() {

        get_current_page();

    });

}

get_current_page_timeout = false;
function get_current_page() {

    if( get_current_page_timeout ) clearTimeout(get_current_page_timeout);

    get_current_page_timeout = setTimeout(function () {

        var scroll_top = $("html").scrollTop() ? $("html").scrollTop() : $("body").scrollTop();
        var window_height = $(window).height();

        if( $(window).width() <= 420 ) {

            if( scroll_top > 100 ) $(".site_header").addClass("site_header-active");
            else $(".site_header").removeClass("site_header-active");

        }

        if( scroll_top < window_height/2 ) {

            $(".main_wrapper .frame[one-page-current='true']").attr({"one-page-current": ""});
            $("#home").attr({"one-page-current": "true"});

            $(".site_header_menu .item-active").removeClass("item-active");
            $(".site_header_menu .item[page='home']").addClass("item-active");


        } else {

            $(".main_wrapper .frame").each(function(i) {

                if( scroll_top - window_height/2 < $(this).offset().top  ) {

                    $(".main_wrapper .frame[one-page-current='true']").attr({"one-page-current": ""});
                    $(this).attr({"one-page-current": "true"});

                    $(".site_header_menu .item-active").removeClass("item-active");
                    $(".site_header_menu .item[page='"+$(this).attr("id")+"']").addClass("item-active");

                    _push('#'+$(this).attr("id"));

                    return false;
                }

            });

        }



    }, 100);

}

function goPage(an) {

    if( !an ) return;
    var anchor = "#"+an;

    if( $(document).width() > 1100 ) {

        $(".main_wrapper").onePageScroll('anchor', anchor);

    } else {

        var t = $(anchor).offset().top;
        $("body, html").animate({"scrollTop": t - 80 +"px"}, 300);

        $(".site_header_menu .item-active").removeClass("item-active");
        $(".site_header_menu .item[page='"+an+"']").addClass("item-active");

        _push(anchor);

    }


    $(".site_header_menu").removeClass("site_header_menu-visible");
    $(".site_header__burger").removeClass("burger-active");

}

function one_scroll_set() {

    $("#body").addClass("one_scroll");
    $(".site_header").addClass("site_header-fixed");

    $(".main_wrapper").onePageScroll({
        selector: ".frame",
        startPage: 1,
        duration: 500,
        easing: 'ease-out',
        horizontal: false,
        keyboard: true,

        onInit: function() {

            wo_gallery();

            wo_overlay_loader(true, loaded);

        },

        onResize: function() {

            wo_gallery();

            if( $(window).width() < 1100 ) $(".main_wrapper").onePageScroll('destroy');

        },

        onDestroy: function() {

            wo_gallery();
            wo_init();

        }
    });

}

//SideBar
function header_menu() {

    var $header_menu = $(".site_header_menu");

    if( $header_menu.hasClass("site_header_menu-visible") ) {

        $header_menu.removeClass("site_header_menu-visible");
        $(".site_header__burger").removeClass("burger-active");

    } else {

        $header_menu.addClass("site_header_menu-visible");
        $(".site_header__burger").addClass("burger-active");

    }

}


function wo_gallery() {

    $gallery_active = $(".gallery-active");
    $items = $gallery_active.find(".item");

    var max_height = $("#works").outerHeight() + $("#works").offset().top - $gallery_active.offset().top - 25;

    var gallery_width = $gallery_active.outerWidth();


    if( $(window).width() < 1100 && (gallery_width < 800) || $items.length === 2 ) {

        if(  $(window).width() > 600 ) {

            var prop = gallery_width/2;


        } else {

            var prop = gallery_width;

        }

        $items.width( prop ).height( prop );


    } else {

        if( $(window).width() >= 1100 && max_height * 2 < gallery_width ) {

            var item_width = max_height / 2;
            $items.height( item_width );
            $items.width( item_width );

        } else {

            $items.height( gallery_width/4 );
            $items.width( gallery_width/4 );

        }


    }

    if( $(window).width() >= 1100) $("#gallery-container").css({"height": max_height +"px"});



}

//Галлерея работ
function wo_gallery_show(t) {

    $gallery = $("#gallery-overlay");

    if( t === 'next' ) {

        var $this = $(".gallery-active .item-active").next(".item");
        if( !$this.length ) var $this = $(".gallery-active .item:first-child");

    } else if( t === 'prev' ) {

        var $this = $(".gallery-active .item-active").prev(".item");
        if( !$this.length ) var $this = $(".gallery-active .item:last-child");

    } else if( t === 'close' ) {

        $gallery.fadeOut(100);
        $("#gallery-container .item-active").removeClass("item-active");
        $(".gallery-image").removeClass("gallery-image-active").css({"position": "absolute"});
        $(".main_wrapper").removeClass("main_wrapper-blured");
        return true;

    }

    else var $this = $(t);


    $("#gallery-container .item-active").removeClass("item-active");
    $this.addClass("item-active");

    var src = $this.attr("image");

    $(".gallery-image").fadeOut(100, function() {

        $(this).remove();

        $(".gallery-image-wrapper").append('<img class="gallery-image" src="'+src+'"/>');
        $(".gallery-image").fadeIn(100, function() {

            $(this).addClass("gallery-image-active");

        });

    });


    $gallery.fadeIn(100);
    $(".main_wrapper").addClass("main_wrapper-blured");

}

function showGallery(g) {

    if( !g ) return false;

    var $gallery = $("#gallery-container .items[gallery='"+ g +"']");

    $("#gallery-tabs .tab-active").removeClass("tab-active");
    $("#gallery-tabs .tab[gallery='"+ g +"']").addClass("tab-active");



    $(".gallery-active").removeClass('gallery-active');
    $gallery.addClass('gallery-active');
    wo_gallery();

}


var gi_move = function(e) {

    var $image = $(".gallery-image");

    var pageX = (e.type === 'mousemove') ? e.pageX : e.targetTouches[0].pageX;

    var left = pageX - g_start_position;

    $image.addClass("gallery-image-moved");

    $image.css({"left": left+"px"});

    e.preventDefault();
    return false;


};

var gi_mouseup = function(e) {

    var g_touch_end = (e.type === 'mouseup') ? e.pageX : e.changedTouches[0].pageX;

    if( g_touch_start > g_touch_end ) {

        wo_gallery_show('next');

    } else if( g_touch_start < g_touch_end ) {

        wo_gallery_show('prev');

    } else {

        wo_gallery_show('prev');

    }

    $(".gallery-image-moved").fadeOut(100);



    $document.unbind("mousemove touchmove", gi_move);
    $document.unbind("mouseup touchend", gi_mouseup);

    e.preventDefault();
    return false;


};

$(document).on("mousedown touchstart", ".gallery-image", function(e) {

    $document = $(this);
    var $image = $(".gallery-image");

    g_touch_start = (e.type === 'mousedown') ? e.pageX : e.changedTouches[0].pageX;
    g_start_position = g_touch_start - $image.offset().left;

    //var g_touch_start_y = (e.type === 'mousedown') ? e.pageY : e.changedTouches[0].pageY;
    $image.css({"top": $image.offset().top +"px"});


    $document.bind("mousemove touchmove", gi_move);
    $document.bind("mouseup touchend", gi_mouseup);

    e.preventDefault();
    return false;

});