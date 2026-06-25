!(function ($) {
  $(function () {
    $(".menu").click(function () {
      $("body").addClass("navShown");
      $(".mobile-nav").fadeIn();
    });
    $(".close-btn").click(function () {
      $("body").removeClass("navShown");
      $(".mobile-nav").fadeOut();
    });
    $(".has-sub-nav").mouseenter(function () {
      $("body").addClass("subnav-shown");
      $(".dropdown-wrap").show();
    });
    $(".has-sub-nav").mouseleave(function () {
      $("body").removeClass("subnav-shown");
      $(".dropdown-wrap").hide();
    });
    $(".cart").click(function (e) {
      e.stopPropagation();
      $("body").addClass("cartShown");
    });
    $(".cart-back").click(function () {
      $("body").removeClass("cartShown");
    });
    $("body").click(function () {
      $("body").removeClass("cartShown");
    });
    $(".cart-item.cart, .your-cart-wrap").click(function (e) {
      e.stopPropagation();
    });

    $('[name="gift"]').change(function () {
      if ($(this).is(":checked")) {
        // Do something...
        $(".gift-wrap .input-row-wrap").slideDown();
      } else {
        $(".gift-wrap .input-row-wrap").slideUp();
      }
    });

    // if ($('.sticky-cart').length) {
    //     var btnDistance = $('.add-cart-btn').offset().top;

    //     $(window).on('scroll', function () {
    //         var scrollY = $(this).scrollTop();
    //         if (scrollY > btnDistance) {
    //             $('.sticky-cart').show();
    //             $('body').addClass('sticky-visible');
    //             $('.a-wrapper').css('bottom', '110px');
    //         } else {
    //             $('.sticky-cart').hide();
    //             $('body').removeClass('sticky-visible');
    //         }

    //     })
    // }

    // Plugin
    $.fn.isInViewport = function () {
      if (!this.length) {
        return false;
      }
      var elementTop = this.offset().top;
      var elementBottom = elementTop + this.outerHeight();

      var viewportTop = $(window).scrollTop();
      var viewportBottom = viewportTop + $(window).height();

      return elementBottom > viewportTop && elementTop < viewportBottom;
    };

    // Cache elements
    var $addCartBtn = $(".add-cart-btn");
    var $stickyCart = $(".sticky-cart");
    var $body = $("body");
    var $wrapper = $(".a-wrapper");

    // Run only if element exists
    if ($addCartBtn.length) {
      $(window).on("resize scroll", function () {
        if ($addCartBtn.isInViewport()) {
          $stickyCart.hide();
          $body.removeClass("sticky-visible");
          $wrapper.css("bottom", "");
        } else {
          $stickyCart.show();
          $body.addClass("sticky-visible");
          $wrapper.css("bottom", "110px");
        }
      });
    }

    if ($(window).width() < 991) {
      $(".logos-item-wrap").marquee({
        direction: "left",
        duration: 10000,
        gap: 50,
        delayBeforeStart: 0,
        duplicated: true,
        startVisible: true,
      });
    }

    var window_width = $(window).width();
    if (window_width <= 1024) {
      if ($(".product-item-wrap").length) {
        $(".product-item-wrap").slick({
          slidesToShow: 2,
          slidesToScroll: 1,
          autoplay: true,
          arrows: false,
          dots: false,
          responsive: [
            {
              breakpoint: 1030,
              settings: {
                slidesToShow: 3,
                slidesToScroll: 1,
              },
            },
            {
              breakpoint: 991,
              settings: {
                slidesToShow: 2,
                slidesToScroll: 1,
              },
            },
            {
              breakpoint: 767,
              settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
              },
            },
          ],
        });

        $(window).on("resize", function () {
          $(".product-item-wrap").slick("resize");
        });
      }
    }

    if ($(".slide-into-wrap-item").length) {
      $(".slide-into-wrap-item").slick({
        autoplay: true,
        autoplaySpeed: 1500,
        slidesToShow: 1,
        slidesToScroll: 1,
        mobileFirst: true,
        arrows: false,
        dots: false,
        responsive: [
          {
            breakpoint: 768,
            settings: "unslick",
          },
        ],
      });

      $(window).on("resize", function () {
        $(".slide-into-wrap-item").slick("resize");
      });
    }

    $(".ups__testimonials").slick({
      autoplay: true,
      autoplaySpeed: 3000,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      adaptiveHeight: true,
      dots: true,
      // asNavFor: '.ups__testimonials-logo'
    });
    // $('.ups__testimonials-logo').slick({
    //     autoplay: true,
    //     slidesToShow: 3,
    //     slidesToScroll: 1,
    //     focusOnSelect: true,
    //     arrows: false,
    //     dots:false,
    //     centerMode: false,
    //     asNavFor: '.ups__testimonials'
    // })

    $(".custom-dropdown__page").click(function () {
      $(this).parent().find(".custom-dropdown-items").toggleClass("show");
    });

    // review-wrap

    $(".review-item-wrap").slick({
      autoplay: false,
      autoplaySpeed: 1500,
      slidesToShow: 3,
      slidesToScroll: 1,
      infinite: true,
      arrows: false,
      dots: false,
      responsive: [
        {
          breakpoint: 1025,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 992,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 481,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          },
        },
      ],
    });

    var article_height = $(".article__right").height();
    $(document).on("scroll", function () {
      var current_scroll = $(document).scrollTop();
      var my_progress = (current_scroll * 100) / article_height;
      $(".article__top-progress").css("width", my_progress + "%");
    });

    $(".reset-pass").click(function (e) {
      e.preventDefault();
      $(".customer__login").addClass("show-reset");
    });
    $(".back-to-login").click(function (e) {
      e.preventDefault();
      $(".customer__login").removeClass("show-reset");
    });

    var my_country = $(".address-country").attr("data-default");
    $(".address-country").val(my_country);

    $(".customer__nav-url").click(function (e) {
      e.preventDefault();
      var my_tab = $(this).attr("data-target");
      $(".customer__nav-url").removeClass("active");
      $(this).addClass("active");
      $(".customer__tab-content").removeClass("active");
      $(my_tab).addClass("active");
    });

    // submit register check form
    // var $form = $('#create_customer');
    // var $checkbox = $('#agree');
    // var filled_fields = [];
    // $('.customer__input').each(function(){
    //     var my_info = $(this).val();
    //     filled_fields.push(my_info);
    // })

    // $('.register-btn').click(function(e){
    //     e.preventDefault();
    //     console.log(filled_fields);
    //     if(!$checkbox.is(':checked')) {
    //         alert('Please confirm!');
    //     }else{
    //         $form.submit();
    //     }
    // })

    // $form.on('submit', function(e) {
    //     e.preventDefault();
    //     if(!$checkbox.is(':checked')) {
    //         alert('Please confirm!');
    //     }
    // });

    // $(".shop-accordion-item").eq(0).addClass("accordion-active")
    // $('.shop-accordion-item').eq(0).find(".shop-accordion-content").slideDown();
    $(".shop-accordion-item").each(function () {
      var $this = $(this);
      $this.find(" > h6").on("click touch", function () {
        $(".shop-accordion-item").removeClass("accordion-active");
        $(".shop-accordion-content").slideUp();
        if ($this.find(".shop-accordion-content:visible").length) {
          $(".shop-accordion-item").removeClass("accordion-active");
          $(".shop-accordion-content").slideUp();
        } else {
          $this.addClass("accordion-active");
          $(".shop-accordion-content").slideUp();
          $this.find(" > .shop-accordion-content").slideDown();
        }
      });
    });

    if ($(".shop-item-wrap").length) {
      $(".shop-item-wrap").slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        mobileFirst: true,
        arrows: true,
        autoplay: false,
        autoplaySpeed: 2000,
        infinite: true,
        dots: true,
        responsive: [
          {
            breakpoint: 768,
            settings: "unslick",
          },
        ],
      });

      $(window).on("resize", function () {
        $(".shop-item-wrap").slick("resize");
      });
    }

    if ($(window).width() < 991) {
      $(".tab-mobi-text").click(function () {
        $(".tab-trigger ul").slideToggle();
      });
      $(".tab-trigger ul li a").click(function () {
        $(".tab-trigger ul").slideUp();
      });
    }

    // $('.tab-trigger ul li').click(function () {
    //     $('.tab-trigger ul li').removeClass('tab-active');
    //     $(this).addClass('tab-active');
    //     $('.tab-item').hide();

    //     var activeTab = $(this).find('a').attr('href');
    //     $(activeTab).fadeIn();
    //     return false;
    // });
  });
})(jQuery);

var mac = 0;
if (navigator.userAgent.indexOf("Mac") > 0) {
  mac = 1;
} else {
  mac = 0;
}
if (1 == mac) {
  $("body").addClass("mac-os");
} else {
  $("body").addClass("win-os");
}

function increaseCount(e, el) {
  var input = el.previousElementSibling;
  var value = parseInt(input.value, 10);
  value = isNaN(value) ? 0 : value;
  value++;
  input.value = value;
}
function decreaseCount(e, el) {
  var input = el.nextElementSibling;
  var value = parseInt(input.value, 10);
  if (value > 1) {
    value = isNaN(value) ? 0 : value;
    value--;
    input.value = value;
  }
}

// $('.main-variant').change(function(){
//     var selected_price = $('.main-variant option:selected').attr('data-price');
//     var selected_variant = $('.main-variant option:selected').attr('discount-variant');

//     if(selected_plan == 'false'){
//         $('.variant-price').text($('.main-variant option:selected').attr('data-price'));
//         $('.subscribe-input-row span.hidden').text($('.main-variant option:selected').attr('data-price'));
//         $('.discounter-price').text($('.main-variant option:selected').attr('discount-price'));
//      }else{
//         $('.variant-price').text($('.main-variant option:selected').attr('discount-price'));
//         $('.discounter-price').text($('.main-variant option:selected').attr('discount-price'));
//         $('.subscribe-input-row span.hidden').text($('.main-variant option:selected').attr('data-price'));
//      }
//     $('.main-variant').attr('data-productid', selected_variant);
//     console.log(selected_price);
// })

$(".gift-input").click(function () {
  $(this).parent().parent().parent().toggleClass("gift-msg-show");
});

var selected_plan = $(".plan__input").attr("data-plan");

$(".plan__input").change(function () {
  selected_plan = $(".plan__input:checked").attr("data-plan");
  $(".plan__input:checked").each(function (index) {
    $(".subscribe-checkbox").removeClass("plan-bg-pink");
    $(this).parent().parent().addClass("plan-bg-pink");
  });

  if (selected_plan == "false") {
    $(".variant-price").text($(".main-variant option:selected").attr("data-price"));
  } else {
    $(".variant-price").text($(".main-variant option:selected").attr("discount-price"));
  }

  console.log(selected_plan);
});

$(".blog-post__tab-url").click(function (e) {
  e.preventDefault();
  var my_posts = $(this).attr("href");
  $(".blog-post__category").removeClass("active");
  $(my_posts).addClass("active");

  $(".blog-post__tab-url").removeClass("active");
  $(this).addClass("active");
});

$(".custom-dropdown-item").click(function (e) {
  e.preventDefault();
  var my_posts = $(this).attr("href");
  var selected_tag = $(this).text();
  $(".blog-post__category").removeClass("active");
  $(my_posts).addClass("active");

  $(".custom-dropdown-item").removeClass("active");
  $(this).addClass("active");
  $(".custom-dropdown__page span").text(selected_tag);
  $(".custom-dropdown-items").removeClass("show");
});
$(".subscription-frequency__selected").click(function (e) {
  e.stopPropagation();
  $(this).toggleClass("active");
});
$(document).click(function () {
  $(".subscription-frequency__selected").removeClass("active");
});

var selected_freq = $(".subscription-frequency__item.active").val();
$(".subscription-frequency__item").click(function () {
  selected_freq = $(this).attr("value");
  $("subscription-frequency__item").removeClass("active");
  $(this).addClass("active");
  $(".subscription-frequency__selected span").text($(this).text());
});

var sticky_selected_plan = $(".sticky_plan").attr("data-plan");
var sticky_variant = $(".sticky_plan:checked").attr("data-variant");
$(".sticky_plan").change(function () {
  sticky_selected_plan = $(".sticky_plan:checked").attr("data-plan");
  sticky_variant = $(".sticky_plan:checked").attr("data-variant");

  if (sticky_selected_plan == "false") {
    $(".sticky-cart-content-right em").text($(".sticky_plan:checked").attr("data-price"));
    $(".sticky-cart-content-right dfn").hide();
  } else {
    $(".sticky-cart-content-right em").text($(".sticky_plan:checked").attr("data-price"));
    $(".sticky-cart-content-right dfn").show();
  }

  console.log(sticky_selected_plan);
  console.log(sticky_variant);
});

// ------------------ Variant selection on change ----------------------\\

var my_pick = {};
if ($("select.styled-select").length) {
  $("select.styled-select").selectric({
    onChange: function (element) {
      $(element).change();
      var variant = "";
      console.log($(this).val());
      $(".selected-product").each(function (index) {
        my_pick[index] = $(this).val();
        variant += "[option" + index + '="' + my_pick[index] + '"]';
      });

      console.log(variant);

      $(".main-variant option").attr("selected", false);
      $(variant).attr("selected", true);

      var selected_price = $(".main-variant option:selected").attr("data-price");
      var selected_variant = $(".main-variant option:selected").attr("discount-variant");
      var my_chosen_variant = $(".main-variant option:selected").attr("value");

      if (
        my_chosen_variant == "18363528806465" ||
        my_chosen_variant == "32056871747649" ||
        my_chosen_variant == "39358711431233" ||
        my_chosen_variant == "39358711595073" ||
        my_chosen_variant == "39934518722625" ||
        my_chosen_variant == "39934518952001"
      ) {
        selected_plan = "false";
        $(".only-subscription .plan__input").prop("checked", false);
        $(".only-once .plan__input").prop("checked", true);
        $(".plan-bg-pink").removeClass("plan-bg-pink");
        $(".subcribe-wrap").addClass("hide-subscription");
      } else {
        $(".subcribe-wrap").removeClass("hide-subscription");
      }

      if (selected_plan == "false") {
        $(".variant-price").text($(".main-variant option:selected").attr("data-price"));
        $(".subscribe-input-row span.hidden").text(
          $(".main-variant option:selected").attr("data-price")
        );
        $(".discounter-price").text($(".main-variant option:selected").attr("discount-price"));
      } else {
        $(".variant-price").text($(".main-variant option:selected").attr("discount-price"));
        $(".discounter-price").text($(".main-variant option:selected").attr("discount-price"));
        $(".subscribe-input-row span.hidden").text(
          $(".main-variant option:selected").attr("data-price")
        );
      }
      $(".main-variant").attr("data-productid", selected_variant);
      console.log(selected_price);
      console.log("chosen var:" + my_chosen_variant);
    },
  });
}

// ------------------ End of variant selection on change ----------------------\\

$(".single-atc").click(function (e) {
  e.preventDefault();
  $(this).parent().addClass("loading");

  var selected_subscription_variant = $(".main-variant").attr("data-productid");
  selected_subscription_variant = parseInt(selected_subscription_variant);
  console.log("selected variant: " + selected_subscription_variant);

  if (selected_plan == "false") {
    data = $(".shopify-product-form").serialize();
  } else {
    data = {
      id: selected_subscription_variant,
      quantity: $(".input-num").val(),
      properties: {
        subscription_id: 1,
        shipping_interval_frequency: $(".shipping-frequency").val(),
        shipping_interval_unit_type: shipping_interval_unit_type,
      },
    };
  }

  $.ajax({
    type: "POST",
    url: "/cart/add.js",
    dataType: "json",
    //   data: $('.shopify-product-form').serialize(),
    data: data,
    success: function (data) {
      get_cart_details();
      reChargeProcessCart();
    },
    error: "addToCartFail",
  });
});

$(".single-sticky-atc").click(function (e) {
  e.preventDefault();
  $(this).parent().addClass("loading");

  if (sticky_selected_plan == "false") {
    data = {
      id: sticky_variant,
      quantity: 1,
    };
  } else {
    data = {
      id: sticky_variant,
      quantity: 1,
      properties: {
        shipping_interval_frequency: selected_freq,
        shipping_interval_unit_type: shipping_interval_unit_type,
      },
    };
  }

  $.ajax({
    type: "POST",
    url: "/cart/add.js",
    dataType: "json",
    data: data,
    success: function (data) {
      get_cart_details();
      reChargeProcessCart();
    },
    error: "addToCartFail",
  });
});

$(document).on("click", ".card-atc", function (e) {
  e.preventDefault();
  $(this).parent().addClass("loading");
  var my_form = $(this).parent();
  $.ajax({
    type: "POST",
    url: "/cart/add.js",
    dataType: "json",
    data: $(my_form).serialize(),
    success: function (data) {
      get_cart_details();
    },
    error: "addToCartFail",
  });
});

$(".upsell-btn").click(function (e) {
  e.preventDefault();
  $(this).parent().addClass("loading");
  $.ajax({
    type: "POST",
    url: "/cart/add.js",
    dataType: "json",
    data: $(".upsell-product").serialize(),
    success: function (data) {
      get_cart_details();
    },
    error: "addToCartFail",
  });

  $(this).parent().parent().parent().parent().remove();
});

// ----------------- Get cart details -------------\\
function get_cart_details() {
  $.getJSON("/cart.js", function (cart) {
    // The cart data
    var drawer_item_html = "";
    var cart_items = cart.items;
    var total_items = cart.item_count;
    product_total_price = cart.total_price;
    console.log(product_total_price);
    // shipping_bar_message();
    $("body").addClass("cartShown");
    $(".cart").removeClass("cart-empty");
    $(".total-cost span").text(
      my_Shop_Currency +
        (product_total_price * 0.01).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    );

    $(".chk-btn").removeClass("active");
    $(".regular-chk-btn").addClass("active");

    var shipping_required = (free_shipping_goal - product_total_price * 0.01).toFixed(0);
    var shipping_progress = (product_total_price * 0.01 * 100) / free_shipping_goal;
    $(".cart-progress div").css("width", shipping_progress + "%");
    if (shipping_required >= 1) {
      $(".product-cart-title h6").html(
        'SPEND <em class="shipping_purchase-more">' +
          my_Shop_Currency +
          shipping_required +
          "</em> MORE TO GET FREE SHIPPING"
      );
      $(".free-ship-bottom-txt").text("");
    } else {
      $(".product-cart-title h6").html(
        '<em class="shipping_purchase-more"></em> ' + free_shipping_message
      );
      $(".free-ship-bottom-txt").text("INCLUDES FREE SHIPPING!");
    }

    $(".add-cart-btn").removeClass("loading");
    $(".sticky-cart-btn ").removeClass("loading");
    $(".shopify-product-form").removeClass("loading");

    console.log(cart);
    for (var i = 0; i <= cart_items.length; i++) {
      var product_image = cart_items[i].image;
      var product_name = cart_items[i].product_title;
      var product_id = cart_items[i].id;
      var product_name_handlize = product_name.replace(/ /g, "-").toLowerCase();
      var product_variant_option_name = cart_items[i].options_with_values[0].name;
      var product_variant_option_value = cart_items[i].options_with_values[0].value;
      var product_variant = cart_items[i].variant_title;
      var product_quantity = cart_items[i].quantity;
      var product_price = cart_items[i].price;
      // var product_price_formatted = numberWithCommas(product_price);
      var product_variant_id = cart_items[i].variant_id;
      var product_url = cart_items[i].url;
      var product_key = cart_items[i].key;
      var da_product_total_price = cart_items[i].final_line_price;
      var properties = cart_items[i].properties;
      if (properties != null) {
        var subscription_frequency = cart_items[i].properties.shipping_interval_frequency;
        subscription_frequency = parseInt(subscription_frequency);
        if (subscription_frequency >= 2) {
          var pluralize = "s";
        } else {
          var pluralize = "";
        }
        var subscription_frequency_type = cart_items[i].properties.shipping_interval_unit_type;
        if (subscription_frequency_type != undefined) {
          $(".chk-btn").removeClass("active");
          $(".recharge-chk-btn").addClass("active");
        }
      }

      console.log(product_id);
      console.log("freq: " + subscription_frequency);
      console.log("freq type: " + subscription_frequency_type);

      $("." + product_id).addClass("upsell__added");

      // ------------- Add HTML item here -------------//
      drawer_item_html += ' <div class="cart-product-item">';
      drawer_item_html += ' <div class="cart-item-thumb">';
      drawer_item_html += "  <figure>";
      drawer_item_html += ' <img src="' + product_image + '"/>';
      drawer_item_html += " </figure>";
      drawer_item_html += "</div>";
      drawer_item_html += '<div class="cart-item-title">';
      drawer_item_html += '<div class="cart-product-item-content">';
      drawer_item_html += "<h6>" + product_name + "</h6>";
      if (product_variant != null) {
        drawer_item_html += "<span>" + product_variant + "</span>";
      }

      if (subscription_frequency) {
        drawer_item_html +=
          "<span> Subscription: every " +
          subscription_frequency +
          " " +
          subscription_frequency_type +
          pluralize +
          "</span>";
      }
      drawer_item_html += '<div class="checkbox-item">';
      drawer_item_html += " </div>";
      drawer_item_html += " </div>";
      drawer_item_html += '<div class="cart-item-qty">';
      drawer_item_html += '<div class="product-quantity flex">';
      drawer_item_html += '<div class="product-description-counter-counter flex">';
      drawer_item_html += '<span class="button" onclick="decreaseItemCount(event, this)">-</span>';
      drawer_item_html +=
        '<input class="input-num"  name="updates[' +
        product_variant_id +
        ']" type="number" data-id="' +
        product_variant_id +
        '"  id="updates_' +
        product_key +
        '" value="' +
        product_quantity +
        '">';
      drawer_item_html +=
        '<span class="button up-btn" onclick="increaseItemCount(event, this)">+</span>';
      drawer_item_html += "</div>";
      drawer_item_html += '<div class="remove-cta">';
      drawer_item_html +=
        '<a href="#" data-id="' +
        product_variant_id +
        '" onclick="removeItem(event, this)">Remove</a>';
      drawer_item_html += "</div>";
      drawer_item_html += "</div>";
      drawer_item_html += ' <div class="total-amount flex">';
      drawer_item_html +=
        '<span data-id="' +
        product_variant_id +
        '">' +
        my_Shop_Currency +
        (da_product_total_price * 0.01).toFixed(2) +
        "</span>";
      drawer_item_html += "</div>";
      drawer_item_html += "</div>";
      drawer_item_html += "</div>";
      drawer_item_html += "</div>";

      $(".cart-product-items").html(drawer_item_html);

      setTimeout(function () {
        $(".product-single-hero-item").removeClass("loading");
      }, 1000);
    }
  });
}

function increaseItemCount(e, el) {
  var myElement = el;
  var $input = myElement.previousElementSibling;
  var value = parseInt($input.value);
  if (value < 100) {
    value = value + 1;
  } else {
    value = 100;
  }
  $input.value = value;
  change_qty($input);
}

function decreaseItemCount(e, el) {
  var $input = el.nextElementSibling;
  var value = parseInt($input.value);
  if (value > 1) {
    value = value - 1;
  } else {
    value = 0;
    $(el).parent().parent().parent().parent().parent().remove();
  }
  $input.value = value;
  change_qty($input);
}

function change_qty($input) {
  var variant_id = $($input).attr("data-id");
  var quantity = $($input).val();
  var data = { updates: {} };
  data.updates[variant_id] = quantity;
  jQuery.ajax({
    type: "POST",
    url: "/cart/update.js",
    data: data,
    dataType: "json",
    success: function (res) {
      product_total_price = res.items_subtotal_price;
      var pro_data = res.items;
      console.log(res);
      var price = res.total_price;
      price = price / 100;
      var tot_qty = res.item_count;
      var the_line_price = res.final_line_price;

      $(".total-cost span").text(
        my_Shop_Currency +
          (product_total_price * 0.01).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      );

      var shipping_required = (free_shipping_goal - product_total_price * 0.01).toFixed(0);
      var shipping_progress = (product_total_price * 0.01 * 100) / free_shipping_goal;

      $(".cart-progress div").css("width", shipping_progress + "%");
      if (shipping_required >= 1) {
        $(".product-cart-title h6").html(
          'SPEND <em class="shipping_purchase-more">' +
            my_Shop_Currency +
            shipping_required +
            "</em> MORE TO GET FREE SHIPPING"
        );
        $(".shipping__confirmation").text("");
      } else {
        $(".product-cart-title h6").html(
          '<em class="shipping_purchase-more"></em> ' + free_shipping_message
        );
        $(".shipping__confirmation").text("INCLUDES FREE SHIPPING!");
      }

      jQuery.each(pro_data, function (index, item) {
        var spe_price = item.final_line_price;
        spe_price = spe_price / 100;
        if (item.id == variant_id) {
          $(".total-amount span[data-id=" + item.id + "]").html(
            my_Shop_Currency + spe_price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          );
        }
      });

      if (tot_qty >= 1) {
        // $('.cart-empty').removeClass('cart__blank');
      } else {
        // $('.cart-empty').addClass('cart__blank');
        $(".cart").addClass("cart-empty");
      }

      // shipping_bar_message();
    },
  });
}

function removeItem(e, el) {
  var variant_id = $(el).attr("data-id");
  console.log(variant_id);
  var data = { updates: {} };
  data.updates[variant_id] = "0";
  jQuery.ajax({
    type: "POST",
    url: "/cart/update.js",
    data: data,
    dataType: "json",
    success: function (res) {
      product_total_price = res.items_subtotal_price;
      var pro_data = res.items;
      var price = res.total_price;
      price = price / 100;
      var tot_qty = res.item_count;

      $(".total-cost span").text(
        my_Shop_Currency +
          (product_total_price * 0.01).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      );

      var shipping_required = (free_shipping_goal - product_total_price * 0.01).toFixed(2);
      var shipping_progress = (product_total_price * 0.01 * 100) / free_shipping_goal;

      $(".cart-progress div").css("width", shipping_progress + "%");
      if (shipping_required >= 1) {
        $(".product-cart-title h6").html(
          'SPEND <em class="shipping_purchase-more">' +
            my_Shop_Currency +
            shipping_required +
            "</em> MORE TO GET FREE SHIPPING"
        );
        $(".free-ship-bottom-txt").text("");
      } else {
        $(".product-cart-title h6").html(
          '<em class="shipping_purchase-more"></em> ' + free_shipping_message
        );
        $(".free-ship-bottom-txt").text("INCLUDES FREE SHIPPING!");
      }

      if (tot_qty >= 1) {
        $(".cart-empty").removeClass("cart__blank");
      } else {
        // $('.cart-empty').addClass('cart__blank');
        $(".cart").addClass("cart-empty");
      }
    },
  });
  $(el).parent().parent().parent().parent().parent().remove();
}

$("ul.sub-nav.shop > li > a.has-sub-items").click(function (e) {
  e.preventDefault();
  console.log("cliced");
  $(this).parent().toggleClass("show-menu");
});

$(".cart-item-search").click(function () {
  $(".header__search ").toggleClass("show");
});
$(".header__search-close").click(function () {
  $(".header__search ").removeClass("show");
});

// recharge cart

$(".recharge-chk-btn").click(function (e) {
  e.preventDefault();
  reChargeProcessCart();
  window.top.location.href = checkout_url;
});
$(".regular-chk-btn").click(function (e) {
  e.preventDefault();
  window.top.location.href = "/checkout";
});

$(".accordion-section__content-title").click(function () {
  $(this).next().slideToggle();
  $(this).toggleClass("active");
});

$(".page-subscription .scroll-btn").click(function () {
  $("html, body").animate(
    {
      scrollTop: $("#the_subscription").offset().top - 100,
    },
    1000
  );
});

(function ($) {
  $(document).ready(function () {
    var $sliders = $(".pf-review-slick");

    if (!$sliders.length || typeof $.fn.slick !== "function") {
      return;
    }

    $sliders.each(function () {
      var $slider = $(this);
      var $progressFill = $slider
        .closest(".pf-review-slider-wrapper")
        .find(".pf-review-progress-fill");

      var totalSlides = parseInt($slider.data("total-slides"), 10) || 1;

      $slider.slick({
        slidesToShow: 3,
        slidesToScroll: 1,
        infinite: false,
        arrows: false,
        dots: false,
        responsive: [
          {
            breakpoint: 1024,
            settings: { slidesToShow: 2 },
          },
          {
            breakpoint: 768,
            settings: "unslick",
          },
        ],
      });

      if ($progressFill.length) {
        $slider.on("beforeChange", function (event, slick, current, next) {
          var segment = 100 / totalSlides;
          var translate = next * segment;
          $progressFill.css({
            width: segment + "%",
            transform: "translateX(" + translate + "%)",
          });
        });

        // Init
        $progressFill.css({ width: 100 / totalSlides + "%" });
      }
    });
  });
})(window.jQuery);
