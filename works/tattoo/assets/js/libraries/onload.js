$(document).ready(function() {



    //Вешаем атрибут на multi-checkbox
    $("*[multi-check]").each(function() {

        var multi = $(this).attr("multi-check");
        var block = $(multi);

        block.find(".wo-checkbox").attr({"multi-checkbox-target": multi });

    });

    ///////////

    //Инициализируем слайдер
    $('.reviews').slick({

        arrows: false,
        dots: true,
        autoplay: true,

    });

    //Галерея
    if( $(document).width() > 1100 ) {

        one_scroll_set();

    } else {

        wo_init();


    }








    ////////////////////////
    $(document).on("click", ".gallery-active .item", function() {

        wo_gallery_show(this);

    });


    $(document).on("mouseenter", ".site_header-fixed", function() {

        $(".main_wrapper").addClass("main_wrapper-blured");
        //if( $(this).hasClass("site_header-dark") ) $("#site_header_overlay_dark").css({"width": "100%", "opacity": 1});

    }).on("mouseleave click", ".site_header-fixed", function() {

        $(".main_wrapper").removeClass("main_wrapper-blured");
        //$("#site_header_overlay_dark").css({"width": "0", "opacity": 0});

    });


    $("img[alt='www.000webhost.com']").parent("a").parent("div").remove();

});
