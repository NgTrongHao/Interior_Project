
$(document).ready(function () {
    // Khởi tạo Slick carousel
    $(".single-carousel").slick({
        centerMode: true,
        centerPadding: '60px',
        arrows: true,
        // prevArrow: '<button class="slick-prev"><i class="fa fa-angle-left"></i></button>',
        // nextArrow: '<button class="slick-next"><i class="fa fa-angle-right"></i></button>',

        slidesToShow: 3,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    arrows: false,
                    centerMode: true,
                    centerPadding: '40px',
                    slidesToShow: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    arrows: false,
                    centerMode: true,
                    centerPadding: '40px',
                    slidesToShow: 2
                }
            }
        ]
    });





});
$(document).ready(function () {
    $(".staff-carousel").slick({
        centerMode: true,
        centerPadding: '20px',
        arrows: true,
        prevArrow: '<button class="slick-prev"><i class="fa fa-angle-left"></i></button>',
        nextArrow: '<button class="slick-next"><i class="fa fa-angle-right"></i></button>',
        slidesToShow: 3,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    arrows: true,
                    centerMode: true,
                    centerPadding: '20px',
                    slidesToShow: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    arrows: true,
                    centerMode: true,
                    centerPadding: '10px',
                    slidesToShow: 1
                }
            }
        ]
    });
});
