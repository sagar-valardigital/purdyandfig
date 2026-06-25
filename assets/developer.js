$(document).ready(function () {
  $(".menu-toggle").click(function () {
    $("body").toggleClass("overflow-hide");
    $(".mobile-menu").toggleClass("show");
    $(this).toggleClass("open");
  });

  $(".cart-toggle").click(function () {
    $("body").addClass("overflow-hide");
    $(".pf-min-cart").addClass("open");
  });

  $(".cart-overlay").click(function () {
    $("body").removeClass("overflow-hide");
    $(".pf-min-cart").removeClass("open");
  });

  $(".client-slider").slick({
    arrows: false,
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    prevArrow: '<img class="slick-arrow slick-prev" src="images/arrow.png">',
    nextArrow: '<img class="slick-arrow slick-next" src="images/arrow.png">',
  });

  $(".reviews-slider").slick({
    arrows: true,
    dots: false,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    centerMode: true,
    centerPadding: "450px",
    prevArrow: '<img class="slick-arrow slick-prev" src="images/arrow.png">',
    nextArrow: '<img class="slick-arrow slick-next" src="images/arrow.png">',
    responsive: [
      {
        breakpoint: 1600,
        settings: {
          centerPadding: "350px",
        },
      },
      {
        breakpoint: 1400,
        settings: {
          centerPadding: "250px",
        },
      },
      {
        breakpoint: 1200,
        settings: {
          centerPadding: "150px",
        },
      },
      {
        breakpoint: 991,
        settings: {
          centerPadding: "35px",
        },
      },
      {
        breakpoint: 560,
        settings: {
          centerPadding: "25px",
        },
      },
    ],
  });

  if ($(window).width() < 768) {
    $(".choose-scent-block").slick({
      arrows: true,
      dots: true,
      infinite: true,
      speed: 300,
      slidesToShow: 1,
      prevArrow: '<img class="slick-arrow slick-prev" src="images/arrow.png">',
      nextArrow: '<img class="slick-arrow slick-next" src="images/arrow.png">',
    });
    $(".mobile-slider-block").slick({
      arrows: true,
      dots: true,
      infinite: true,
      speed: 300,
      slidesToShow: 1,
      prevArrow: '<img class="slick-arrow slick-prev" src="images/arrow.png">',
      nextArrow: '<img class="slick-arrow slick-next" src="images/arrow.png">',
    });
  }

  $(window).on("scroll", function () {
    const $nav = $(".header");
    const annoucment = $(".annoucment-bar").height();
    if (annoucment === undefined) {
      $nav.toggleClass("onscroll", $(this).scrollTop() > 60);
    } else {
      $nav.toggleClass("onscroll", $(this).scrollTop() > annoucment);
    }
  });

  $(window).on("scroll", function () {
    $(".scroll-section").each(function () {
      if (isScrolledIntoView($(this))) {
        $(this).addClass("on-screen");
      } else {
        $(this).removeClass("on-screen");
      }
    });
  });

  function isScrolledIntoView(elem) {
    const docViewTop = $(window).scrollTop();
    const docViewBottom = docViewTop + $(window).height();

    const elemTop = $(elem).offset().top + 100;
    const elemBottom = elemTop + $(elem).height();

    return elemTop < docViewBottom;
  }

  $(".product-gallery").slick({
    arrows: false,
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
  });

  $(".product-varient-selection label").click(function () {
    const varient = $(this).data("value");
    $(".sticky-addtocart .p-title h2 span").html(varient + " ");
    const color = $(this).data("color");
    $(".product-detail-section,.sticky-addtocart").css("background-color", color);
  });
});

function playvideo() {
  let link = document.getElementById("video").src;
  link = link + "?autoplay=1";
  console.log(link);
  document.getElementById("image-video").style.display = "none";
  document.getElementById("video-text").style.display = "none";
  document.getElementById("video").src = link;
}
