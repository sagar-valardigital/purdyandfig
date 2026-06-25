var Purdy = {
  updateQuantity(line, qty, event = false) {
    $(event.target).addClass("loading");
    fetch(window.Shopify.routes.root + "cart/change.js", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        quantity: qty,
        line: line,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        // fire javascript event on window
        $(event.target).removeClass("loading");
        window.dispatchEvent(
          new CustomEvent("cart-updated", {
            detail: data,
          })
        );
        Purdy.CartCountUpdate();
      })
      .catch((error) => {
        $(event.target).removeClass("loading");
        console.error("Error:", error);
      });
  },
  updateQuantityWithDiscount(line, qty, event = false) {
    const getDiscountCode = (bundleCount) => {
      switch (bundleCount) {
        case 1:
          return "CHRISTMASBUNDLE";
        case 2:
          return "CHRISTMASBUNDLE2";
        default:
          return "CHRISTMASBUNDLE3";
      }
    };

    const countChristmasBundles = (cartItems) => {
      return cartItems.reduce((count, item) => {
        return item.handle === "christmas-scent-bundle" ? count + item.quantity : count;
      }, 0);
    };

    $(event.target).addClass("loading");
    fetch(window.Shopify.routes.root + "cart/change.js", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        quantity: qty,
        line: line,
      }),
    })
      .then((response) => response.json())
      .then((cartData) => {
        const checkoutForm = document.querySelector('form[name="checkout_form"]');
        if (checkoutForm) {
          const discountInput = checkoutForm.querySelector('input[name="discount"]');
          if (discountInput) {
            const bundleCount = countChristmasBundles(cartData.items);
            const christmasDiscountCode = getDiscountCode(bundleCount);

            // Get existing discounts and replace/add Christmas discount
            let discounts = discountInput.value.split(",").filter(Boolean);

            // Remove any existing Christmas bundle discount
            discounts = discounts.filter((d) => !d.startsWith("CHRISTMASBUNDLE"));

            // Add new Christmas discount if bundles exist
            if (bundleCount > 0) {
              discounts.push(christmasDiscountCode);
            }

            const uniqueDiscounts = [...new Set(discounts)].join(",");

            if (uniqueDiscounts) {
              return fetch("/checkout/?discount=" + encodeURIComponent(uniqueDiscounts), {
                method: "GET",
                headers: {
                  Accept: "application/json",
                },
              }).then(() => cartData);
            }
          }
        }
        return cartData;
      })
      .then((cartData) => {
        $(event.target).removeClass("loading");
        window.dispatchEvent(
          new CustomEvent("cart-updated", {
            detail: cartData,
          })
        );
        Purdy.CartCountUpdate();
      })
      .catch((error) => {
        $(event.target).removeClass("loading");
        window.dispatchEvent(
          new CustomEvent("cart-updated", {
            detail: "",
          })
        );
        console.error("Error:", error);
      });
  },
  AddToCartWithDiscount(formdata, togglecart = true, eventdata = false, event = false) {
    event.preventDefault();
    $(event.target).addClass("loading");
    let formData = new FormData(formdata);
    let discount = formData.get("discount");

    if (formData.get("purchase_type") === "subscription") {
      formData = new FormData(formdata);
    } else {
      formData.delete("selling_plan");
    }

    fetch("/cart/add.js", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((cartData) => {
        const checkoutForm = document.querySelector('form[name="checkout_form"]');
        if (checkoutForm) {
          const discountInput = checkoutForm.querySelector('input[name="discount"]');
          if (discountInput) {
            const existingDiscounts = discountInput.value.split(",").filter(Boolean);
            const allDiscounts = [...existingDiscounts];

            if (discount) {
              allDiscounts.push(discount);
            }

            const uniqueDiscounts = [...new Set(allDiscounts)].join(",");

            if (uniqueDiscounts) {
              return fetch("/checkout/?discount=" + encodeURIComponent(uniqueDiscounts), {
                method: "GET",
                headers: {
                  Accept: "application/json",
                },
              }).then(() => cartData);
            }
          }
        }
        return cartData;
      })
      .then((cartData) => {
        window.dispatchEvent(new CustomEvent("product:added", { detail: cartData }));
        if (togglecart) {
          window.dispatchEvent(new CustomEvent("toggle-cart", { detail: cartData }));
        }
        window.dispatchEvent(new CustomEvent("cart-updated", { detail: cartData }));
        Purdy.CartCountUpdate();
        $(event.target).removeClass("loading");
      })
      .catch((error) => {
        window.dispatchEvent(new CustomEvent("product:added", { detail: "" }));
        if (togglecart) {
          window.dispatchEvent(new CustomEvent("toggle-cart", { detail: "" }));
        }
        window.dispatchEvent(new CustomEvent("cart-updated", { detail: "" }));
        Purdy.CartCountUpdate();
        $(event.target).removeClass("loading");
        console.error("Error:", error);
      });
  },
  AddToCartWithDiscountChristmas(formdata, togglecart = true, eventdata = false, event = false) {
    event.preventDefault();
    $(event.target).addClass("loading");
    let formData = new FormData(formdata);
    let discount = formData.get("discount");

    const getDiscountCode = (bundleCount) => {
      switch (bundleCount) {
        case 1:
          return "CHRISTMASBUNDLE";
        case 2:
          return "CHRISTMASBUNDLE2";
        default:
          return "CHRISTMASBUNDLE3";
      }
    };

    const countChristmasBundles = (cartItems) => {
      return cartItems.reduce((count, item) => {
        return item.handle === "christmas-scent-bundle" ? count + item.quantity : count;
      }, 0);
    };

    if (formData.get("purchase_type") === "subscription") {
      formData = new FormData(formdata);
    } else {
      formData.delete("selling_plan");
    }

    fetch("/cart/add.js", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((cartData) => {
        return fetch("/cart.js")
          .then((response) => response.json())
          .then((fullCartData) => {
            const bundleCount = countChristmasBundles(fullCartData.items);
            const isAddingBundle = formData.get("handle") === "christmas-scent-bundle";
            const adjustedBundleCount = isAddingBundle ? bundleCount - 1 : bundleCount;
            const newDiscountCode = getDiscountCode(adjustedBundleCount);

            const checkoutForm = document.querySelector('form[name="checkout_form"]');
            if (checkoutForm) {
              const discountInput = checkoutForm.querySelector('input[name="discount"]');
              if (discountInput) {
                const existingDiscounts = discountInput.value.split(",").filter(Boolean);
                const allDiscounts = [...existingDiscounts];

                if (discount) {
                  allDiscounts.push(discount);
                }
                if (newDiscountCode) {
                  allDiscounts.push(newDiscountCode);
                }

                const uniqueDiscounts = [...new Set(allDiscounts)].join(",");

                if (uniqueDiscounts) {
                  return fetch("/checkout/?discount=" + encodeURIComponent(uniqueDiscounts), {
                    method: "GET",
                    headers: {
                      Accept: "application/json",
                    },
                  }).then(() => cartData);
                }
              }
            }
            return cartData;
          });
      })
      .then((cartData) => {
        window.dispatchEvent(new CustomEvent("product:added", { detail: cartData }));
        if (togglecart) {
          window.dispatchEvent(new CustomEvent("toggle-cart", { detail: cartData }));
        }
        window.dispatchEvent(new CustomEvent("cart-updated", { detail: cartData }));
        Purdy.CartCountUpdate();
        $(event.target).removeClass("loading");
      })
      .catch((error) => {
        $(event.target).removeClass("loading");
        window.dispatchEvent(new CustomEvent("product:added", { detail: "" }));
        if (togglecart) {
          window.dispatchEvent(new CustomEvent("toggle-cart", { detail: "" }));
        }
        window.dispatchEvent(new CustomEvent("cart-updated", { detail: "" }));
        Purdy.CartCountUpdate();
        console.error("Error:", error);
      });
  },
  AddToCartWithDiscountChristmasPF(formdata, togglecart = true, eventdata = false, event = false) {
    event.preventDefault();
    $(event.target).addClass("loading");
    let formData = new FormData(formdata);
    let discount = formData.get("discount");

    const getDiscountCode = (bundleCount) => {
      switch (bundleCount) {
        case 1:
          return "CHRISTMASBUNDLE253";
        case 2:
          return "CHRISTMASBUNDLE253x2";
        default:
          return "CHRISTMASBUNDLE253x3";
      }
    };

    const countChristmasBundles = (cartItems) => {
      return cartItems.reduce((count, item) => {
        return item.handle === "christmas-scent-bundle" ? count + item.quantity : count;
      }, 0);
    };

    if (formData.get("purchase_type") === "subscription") {
      formData = new FormData(formdata);
    } else {
      formData.delete("selling_plan");
    }

    fetch("/cart/add.js", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((cartData) => {
        return fetch("/cart.js")
          .then((response) => response.json())
          .then((fullCartData) => {
            const bundleCount = countChristmasBundles(fullCartData.items);
            const isAddingBundle = formData.get("handle") === "christmas-scent-bundle";
            const adjustedBundleCount = isAddingBundle ? bundleCount - 1 : bundleCount;
            const newDiscountCode = getDiscountCode(adjustedBundleCount);

            const checkoutForm = document.querySelector('form[name="checkout_form"]');
            if (checkoutForm) {
              const discountInput = checkoutForm.querySelector('input[name="discount"]');
              if (discountInput) {
                const existingDiscounts = discountInput.value.split(",").filter(Boolean);
                const allDiscounts = [...existingDiscounts];

                if (discount) {
                  allDiscounts.push(discount);
                }
                if (newDiscountCode) {
                  allDiscounts.push(newDiscountCode);
                }

                const uniqueDiscounts = [...new Set(allDiscounts)].join(",");

                if (uniqueDiscounts) {
                  return fetch("/checkout/?discount=" + encodeURIComponent(uniqueDiscounts), {
                    method: "GET",
                    headers: {
                      Accept: "application/json",
                    },
                  }).then(() => cartData);
                }
              }
            }
            return cartData;
          });
      })
      .then((cartData) => {
        window.dispatchEvent(new CustomEvent("product:added", { detail: cartData }));
        if (togglecart) {
          window.dispatchEvent(new CustomEvent("toggle-cart", { detail: cartData }));
        }
        window.dispatchEvent(new CustomEvent("cart-updated", { detail: cartData }));
        Purdy.CartCountUpdate();
        $(event.target).removeClass("loading");
      })
      .catch((error) => {
        $(event.target).removeClass("loading");
        window.dispatchEvent(new CustomEvent("product:added", { detail: "" }));
        window.dispatchEvent(new CustomEvent("toggle-cart", { detail: "" }));
        window.dispatchEvent(new CustomEvent("cart-updated", { detail: "" }));
        Purdy.CartCountUpdate();
        console.error("Error:", error);
      });
  },
  updateQuantityWithDiscountPF(line, qty, event = false) {
    const getDiscountCode = (bundleCount) => {
      switch (bundleCount) {
        case 1:
          return "CHRISTMASBUNDLE253";
        case 2:
          return "CHRISTMASBUNDLE253x2";
        default:
          return "CHRISTMASBUNDLE253x3";
      }
    };

    const countChristmasBundles = (cartItems) => {
      return cartItems.reduce((count, item) => {
        return item.handle === "christmas-scent-bundle" ? count + item.quantity : count;
      }, 0);
    };

    $(event.target).addClass("loading");
    fetch(window.Shopify.routes.root + "cart/change.js", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        quantity: qty,
        line: line,
      }),
    })
      .then((response) => response.json())
      .then((cartData) => {
        const checkoutForm = document.querySelector('form[name="checkout_form"]');
        if (checkoutForm) {
          const discountInput = checkoutForm.querySelector('input[name="discount"]');
          if (discountInput) {
            const bundleCount = countChristmasBundles(cartData.items);
            const christmasDiscountCode = getDiscountCode(bundleCount);

            // Get existing discounts and replace/add Christmas discount
            let discounts = discountInput.value.split(",").filter(Boolean);

            // Remove any existing Christmas bundle discount
            discounts = discounts.filter((d) => !d.startsWith("CHRISTMASBUNDLE"));

            // Add new Christmas discount if bundles exist
            if (bundleCount > 0) {
              discounts.push(christmasDiscountCode);
            }

            const uniqueDiscounts = [...new Set(discounts)].join(",");

            if (uniqueDiscounts) {
              return fetch("/checkout/?discount=" + encodeURIComponent(uniqueDiscounts), {
                method: "GET",
                headers: {
                  Accept: "application/json",
                },
              }).then(() => cartData);
            }
          }
        }
        return cartData;
      })
      .then((cartData) => {
        $(event.target).removeClass("loading");
        window.dispatchEvent(
          new CustomEvent("cart-updated", {
            detail: cartData,
          })
        );
        Purdy.CartCountUpdate();
      })
      .catch((error) => {
        $(event.target).removeClass("loading");
        window.dispatchEvent(
          new CustomEvent("cart-updated", {
            detail: "",
          })
        );
        console.error("Error:", error);
      });
  },
  AddToCart(formdata, togglecart = true, eventdata = false, event = false) {
    $(event.target).addClass("loading");
    let formData = new FormData(formdata);
    if (formData.get("purchase_type") == "subscription") {
      formData = new FormData(formdata);
    } else {
      formData = new FormData(formdata);
      formData.delete("selling_plan");
    }
    console.log(formData);
    fetch(window.Shopify.routes.root + "cart/add.js", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((response) => {
        $(event.target).removeClass("loading");
        if (togglecart) {
          window.dispatchEvent(
            new CustomEvent("toggle-cart", {
              detail: response,
            })
          );
        }
        window.dispatchEvent(
          new CustomEvent("cart-updated", {
            detail: response,
          })
        );

        Purdy.CartCountUpdate();
        if (eventdata) {
          window.ga("send", {
            hitType: "event",
            eventCategory: "cart",
            eventAction: "upsell purchase",
            eventLabel: eventdata,
          });
        }
      })
      .catch((error) => {
        $(event.target).removeClass("loading");
        console.error("Error:", error);
      });
  },
  CartCountUpdate() {
    fetch(window.Shopify.routes.root + "cart.js", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        window.dispatchEvent(
          new CustomEvent("cart:updated", {
            detail: data,
          })
        );
        if (data["item_count"] > 0) {
          $(".cart-item-count").text(data["item_count"]);
        } else {
          $(".cart-item-count").text("");
        }
      });
  },
  VariantUpdate(e, formdata) {
    let formData = new FormData(formdata);
    let imageid = e.target.getAttribute("data-image");
    let varprice = e.target.getAttribute("data-price");
    let subprice = e.target.getAttribute("data-subprice");
    let variant_includes_text = e.target.getAttribute("data-includes");
    let selling_plan_id = e.target.getAttribute("data-plan-id");

    $('input[name="selling_plan"]').val(selling_plan_id);
    $(".variant-includes-text").text(variant_includes_text);
    if (formData.get("purchase_type") == "subscription") {
      $(".pf-product-price").html(subprice);
    } else {
      $(".pf-product-price").html(varprice);
    }

    if (imageid) {
      $(".main-product-img").removeClass("slick-current slick-active");
      $("img[data-id=" + imageid + "]")
        .closest(".main-product-img")
        .addClass("slick-current slick-active");
    }
  },
  PurdyCheckout(formdata, discount, event) {
    $(event.target).addClass("loading");
    let formData = new FormData(formdata);
    if (formData.get("purchase_type") == "subscription") {
      formData = new FormData(formdata);
    } else {
      formData = new FormData(formdata);
      formData.delete("selling_plan");
    }
    console.log(formData);
    fetch(window.Shopify.routes.root + "cart/add.js", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((response) => {
        window.location.href = "/discount/" + discount + "?redirect=%2Fcheckout";
      })
      .catch((error) => {
        $(event.target).removeClass("loading");
        console.error("Error:", error);
      });
  },
  CheckoutLanding(formdata, event) {
    event.preventDefault();
    $(event.target).closest(".btn-loader").addClass("loading");
    let formData = new FormData(formdata);
    var discount = formData.get("discount");
    if (formData.get("purchase_type") == "subscription") {
      formData = new FormData(formdata);
      if ($(event.target).attr("data-discount")) {
        discount = $(event.target).attr("data-discount");
      }
    } else {
      formData = new FormData(formdata);
      formData.delete("selling_plan");
      if ($(event.target).attr("data-discount")) {
        discount = $(event.target).attr("data-discount");
      }
    }

    console.log(formData);
    fetch(window.Shopify.routes.root + "cart/add.js", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((response) => {
        $(event.target).closest(".btn-loader").removeClass("loading");
        if (discount != "") {
          window.location.href =
            "/discount/" + discount + "?redirect=%2Fcheckout?discount=" + discount;
        } else {
          window.location.href = "/checkout/";
        }
      })
      .catch((error) => {
        $(event.target).removeClass("loading");
        console.error("Error:", error);
      });
  },
  CheckoutLandingV2(formdata, event) {
    event.preventDefault();
    $(event.target).addClass("loading");
    let formData = new FormData(formdata);

    // Retrieve or initialize discount information
    let discount = formData.get("discount");

    if (formData.get("purchase_type") == "subscription") {
      if ($(event.target).attr("data-discount")) {
        discount = $(event.target).attr("data-discount");
      }
    } else {
      formData.delete("selling_plan");
    }
    console.log("form data ======");
    formData.forEach((value, key) => {
      console.log(key, value);
    });
    console.log("form data end ======");

    // Fetch discount information from cart.js
    fetch(window.Shopify.routes.root + "cart.js")
      .then((response) => response.json())
      .then((cart) => {
        // Initialize a set to hold all unique discount titles
        let allDiscounts = new Set();

        // Loop through each item and add their discounts to the set
        cart.items.forEach((item) => {
          item.discounts.forEach((discountItem) => {
            allDiscounts.add(discountItem.title);
          });
        });

        // Convert the set of discounts to a comma-separated string
        let discountsString = Array.from(allDiscounts).join(",");

        // Update 'discount' if different
        if (discountsString && discount !== discountsString) {
          if (discount) {
            discount = discount + "," + discountsString;
          } else {
            discount = discountsString;
          }
        }

        // Proceed with adding to cart
        fetch(window.Shopify.routes.root + "cart/add.js", {
          method: "POST",
          body: formData,
        })
          .then((response) => response.json())
          .then((response) => {
            console.log("response from add to cart", response);
            $(event.target).removeClass("loading");
            if (discount != "") {
              window.location.href = "/checkout?discount=" + discount;
            } else {
              window.location.href = "/checkout/";
            }
          })
          .catch((error) => {
            $(event.target).removeClass("loading");
            console.error("Error:", error);
          });
      })
      .catch((error) => {
        $(event.target).removeClass("loading");
        console.error("Failed to fetch cart data:", error);
      });
  },
};

$(document).ready(function () {
  $('input[name="purchase_type"]').on("change", function () {
    $("#main-selling-plan").removeAttr("disabled", "disabled");
    let value = $(this).val();
    $(".product-buy-type").html(value);
    if ($('input[name="purchase_type"]:checked').val() == "subscription") {
      let subprice = $(this).data("subprice");
      let compareprice = $(this).data("compareprice");
      $(".sub-one-switch").html("Don’t want to subscribe? <b>One time purchase</b>");
      $(".pf-product-price").html(subprice);
      if (subprice == compareprice) {
        $(".del-price").html("");
      } else {
        $(".del-price").html(compareprice);
      }
    } else {
      $("#main-selling-plan").attr("disabled", "disabled");
      let subprice = $(this).data("subprice");
      let compareprice = $(this).data("compareprice");
      $(".pf-product-price").html(subprice);
      $(".sub-one-switch").html("<b>Subscribe and Save 50%</b>");
      if (subprice == compareprice) {
        $(".del-price").html("");
      } else {
        $(".del-price").html(compareprice);
      }
    }
  });

  $(".sub-one-switch").click(function () {
    if ($('input[name="purchase_type"]:checked').val() == "subscription") {
      $(this).html("<b>Subscribe & Save 50%</b>");
      $("#onetime").prop("checked", true);
      let subprice = $("#onetime").data("subprice");
      $(".pf-product-price").html(subprice);
    } else {
      $(this).html("Don't want to subscribe? <b>One time purchase</b>");
      $("#bundle").prop("checked", true);
      let subprice = $("#bundle").data("subprice");
      $(".pf-product-price").html(subprice);
    }
  });

  function playvideo() {
    var link = document.getElementById("video").src;
    link = link + "?autoplay=1";
    console.log(link);
    document.getElementById("image-video").style.display = "none";
    document.getElementById("video-text").style.display = "none";
    document.getElementById("video").src = link;
  }

  $(".menu-toggle").click(function () {
    $("body").toggleClass("overflow-hide");
    $(".mobile-menu").toggleClass("show");
    $(this).toggleClass("open");
  });

  $(".client-slider").slick({
    arrows: false,
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    prevArrow:
      '<img class="slick-arrow slick-prev" src="//cdn.shopify.com/s/files/1/0567/5951/7299/t/4/assets/arrow.png?v=55436783318444721021650475398"/>',
    nextArrow:
      '<img class="slick-arrow slick-next" src="//cdn.shopify.com/s/files/1/0567/5951/7299/t/4/assets/arrow.png?v=55436783318444721021650475398"/>',
  });

  $(".reviews-slider").slick({
    arrows: true,
    dots: false,
    infinite: false,
    speed: 300,
    slidesToShow: 3,
    prevArrow:
      '<img class="slick-arrow slick-prev" src="//cdn.shopify.com/s/files/1/0567/5951/7299/t/4/assets/arrow.png?v=55436783318444721021650475398"/>',
    nextArrow:
      '<img class="slick-arrow slick-next" src="//cdn.shopify.com/s/files/1/0567/5951/7299/t/4/assets/arrow.png?v=55436783318444721021650475398"/>',
    responsive: [
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 560,
        settings: {
          speed: 1000,
          slidesToShow: 1,
          centerMode: true,
          centerPadding: "30px",
          dots: true,
        },
      },
    ],
  });
  $(" .choose-scent-block").slick({
    arrows: true,
    dots: false,
    infinite: true,
    speed: 300,
    centerMode: true,
    centerPadding: "70px",
    slidesToShow: 3,
    prevArrow:
      '<img class="slick-arrow slick-prev" src="//cdn.shopify.com/s/files/1/0567/5951/7299/t/4/assets/arrow.png?v=55436783318444721021650475398"/>',
    nextArrow:
      '<img class="slick-arrow slick-next" src="//cdn.shopify.com/s/files/1/0567/5951/7299/t/4/assets/arrow.png?v=55436783318444721021650475398"/>',
    responsive: [
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 2,
          centerPadding: "30px",
        },
      },
      {
        breakpoint: 560,
        settings: {
          slidesToShow: 1,
          centerPadding: "30px",
        },
      },
    ],
  });

  if ($(window).width() < 768) {
    $(".mobile-slider-block").slick({
      arrows: true,
      dots: false,
      infinite: false,
      speed: 0,
      slidesToShow: 1,
      prevArrow:
        '<img class="slick-arrow slick-prev" src="//cdn.shopify.com/s/files/1/0567/5951/7299/t/4/assets/arrow.png?v=55436783318444721021650475398"/>',
      nextArrow:
        '<img class="slick-arrow slick-next" src="//cdn.shopify.com/s/files/1/0567/5951/7299/t/4/assets/arrow.png?v=55436783318444721021650475398"/>',
      asNavFor: ".mobile-nav-slider-block",
    });
    $(".mobile-nav-slider-block").slick({
      asNavFor: ".mobile-slider-block",
      dots: false,
      centerMode: false,
      focusOnSelect: true,
      vertical: true,
      verticalSwiping: true,
      slidesToShow: 4,
      slidesToScroll: 4,
      speed: 0,
      infinite: true,
    });
  }

  $(window).on("scroll", function () {
    var $nav = $(".header");
    var $filter = $(".collection-filter-top");
    var annoucment = $(".annoucment-bar").height();
    if (annoucment === undefined) {
      $nav.toggleClass("onscroll", $(this).scrollTop() > 60);
      $filter.toggleClass("onscroll", $(this).scrollTop() > 60);
      $("body.collection-page").toggleClass("onscroll", $(this).scrollTop() > 60);
    } else {
      $nav.toggleClass("onscroll", $(this).scrollTop() > annoucment);
      $filter.toggleClass("onscroll", $(this).scrollTop() > annoucment);
      $("body.collection-page").toggleClass("onscroll", $(this).scrollTop() > annoucment);
    }
  });

  $(window).on("scroll", function () {
    $(".scroll-section").each(function () {
      if (isScrolledIntoView($(this))) {
        $(this).addClass("on-screen");
      }
    });
  });

  function isScrolledIntoView(elem) {
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();

    var elemTop = $(elem).offset().top + 100;
    var elemBottom = elemTop + $(elem).height();

    return elemTop < docViewBottom;
  }

  if ($(".product-gallery-thumb").length || $(".product-gallery-thumb-vertical").length) {
    $(".product-gallery").slick({
      arrows: true,
      dots: true,
      infinite: false,
      speed: 300,
      fade: true,
      slidesToShow: 1,
      prevArrow: '<div class="slick-arrow slick-prev"></div>',
      nextArrow: '<div class="slick-arrow slick-next"> </div>',
      asNavFor: ".product-gallery-thumb, .product-gallery-thumb-vertical",
    });

    if ($(".product-gallery-thumb").length) {
      $(".product-gallery-thumb").slick({
        slidesToShow: 4,
        slidesToScroll: 1,
        asNavFor: ".product-gallery",
        dots: false,
        focusOnSelect: true,
      });
    }

    if ($(".product-gallery-thumb-vertical").length) {
      $(".product-gallery-thumb-vertical").slick({
        slidesToShow: 5,
        slidesToScroll: 1,
        asNavFor: ".product-gallery",
        dots: false,
        focusOnSelect: true,
        vertical: true,
        verticalSwiping: true,
        responsive: [
          {
            breakpoint: 768,
            settings: {
              vertical: false,
              verticalSwiping: false,
            },
          },
        ],
      });
    }
  } else {
    $(".product-gallery").slick({
      arrows: true,
      dots: true,
      infinite: false,
      speed: 300,
      fade: true,
      slidesToShow: 1,
      prevArrow: '<div class="slick-arrow slick-prev"></div>',
      nextArrow: '<div class="slick-arrow slick-next"> </div>',
    });
  }

  $(".product-varient-selection label").click(function () {
    var varient = $(this).data("value");
    $(".sticky-addtocart .p-title h2 span").html(varient + " ");
    var color = $(this).data("color");
    $(".product-detail-section,.sticky-addtocart").css("background-color", color);
  });

  $(".show-popup").click(function () {
    let popupID = $(this).data("popup");
    popupID = "#" + popupID;
    $(".popup").removeClass("show");
    $("body").removeClass("overflow-hide");
    $(popupID).addClass("show");
    $("body").toggleClass("overflow-hide");
  });
  $(".close-popup,.popup-overlay").click(function () {
    $(this).parents(".popup").removeClass("show");
    $("body").toggleClass("overflow-hide");
  });

  $(".reviews-slider-2").slick({
    arrows: false,
    dots: false,
    infinite: false,
    speed: 300,
    slidesToShow: 3,
    responsive: [
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 2,
          dots: true,
        },
      },
      {
        breakpoint: 560,
        settings: {
          speed: 1000,
          slidesToShow: 1,
          dots: true,
        },
      },
    ],
  });
  $(".best-seller-slide-2").slick({
    autoplay: false,
    autoplaySpeed: 1500,
    slidesToShow: 4,
    slidesToScroll: 1,
    infinite: false,
    arrows: false,
    dots: false,
    responsive: [
      {
        breakpoint: 1025,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 3,
          dots: true,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          dots: true,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 481,
        settings: {
          slidesToShow: 1,
          dots: true,
          slidesToScroll: 1,
        },
      },
    ],
  });
  $(".insta-blocks-2").slick({
    autoplay: true,
    pauseOnHover: true,
    autoplaySpeed: 2000,
    slidesToShow: 3,
    slidesToScroll: 1,
    infinite: true,
    arrows: true,
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
          dots: true,
          slidesToScroll: 1,
          autoplay: true,
          autoplaySpeed: 2000,
        },
      },
      {
        breakpoint: 578,
        settings: {
          slidesToShow: 1,
          dots: true,
          slidesToScroll: 1,
          centerMode: true,
          centerPadding: "15px",
        },
      },
    ],
  });

  $(".insta-slider").slick({
    autoplay: false,
    autoplaySpeed: 1500,
    slidesToShow: 3,
    slidesToScroll: 1,
    infinite: true,
    arrows: false,
    dots: true,
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

  document.addEventListener("cart-count-updated", function () {
    $("span.progress-bar").attr(
      "style",
      "width:" + $(".pf-min-cart").attr("data-cart-init") + "%;"
    );
    setTimeout(function () {
      let cart_progress = $(".min-cart-wrapper").attr("data-shipping-progress");
      $(".pf-min-cart").attr("data-cart-init", cart_progress);
      $("span.progress-bar").attr("style", "width:" + cart_progress + "%;");
    }, 500);
  });

  $(".logo-slider").slick({
    arrows: true,
    dots: false,
    infinite: false,
    speed: 300,
    slidesToShow: 3,
    slidesToScroll: 1,
    prevArrow:
      '<img class="slick-arrow slick-prev" src="https://cdn.shopify.com/s/files/1/0360/1347/3931/files/gray-arrow-left.png?v=1674798772">',
    nextArrow:
      '<img class="slick-arrow slick-next" src="https://cdn.shopify.com/s/files/1/0360/1347/3931/files/gray-arrow-left.png?v=1674798772">',
    responsive: [
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 560,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  });
  $(".lander-reviews-slider").slick({
    arrows: true,
    dots: false,
    infinite: false,
    speed: 300,
    slidesToShow: 3,
    prevArrow:
      '<img class="slick-arrow slick-prev" src="https://cdn.shopify.com/s/files/1/0360/1347/3931/files/gray-arrow-left.png?v=1674798772">',
    nextArrow:
      '<img class="slick-arrow slick-next" src="https://cdn.shopify.com/s/files/1/0360/1347/3931/files/gray-arrow-left.png?v=1674798772">',
    responsive: [
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 560,
        settings: {
          speed: 1000,
          slidesToShow: 1,
          centerMode: true,
          centerPadding: "30px",
        },
      },
    ],
  });
  if ($(window).width() < 768) {
    $(".lander-mobile-slider").slick({
      arrows: true,
      dots: false,
      speed: 300,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 2500,
      infinite: true,
      prevArrow:
        '<img class="slick-arrow slick-prev" src="https://cdn.shopify.com/s/files/1/0360/1347/3931/files/gray-arrow-left.png?v=1674798772">',
      nextArrow:
        '<img class="slick-arrow slick-next" src="https://cdn.shopify.com/s/files/1/0360/1347/3931/files/gray-arrow-left.png?v=1674798772">',
    });

    $(".lander-mobile-slider-manual").slick({
      arrows: true,
      dots: false,
      speed: 300,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: false,
      autoplaySpeed: 2500,
      infinite: true,
      prevArrow:
        '<img class="slick-arrow slick-prev" src="https://cdn.shopify.com/s/files/1/0360/1347/3931/files/gray-arrow-left.png?v=1674798772">',
      nextArrow:
        '<img class="slick-arrow slick-next" src="https://cdn.shopify.com/s/files/1/0360/1347/3931/files/gray-arrow-left.png?v=1674798772">',
    });
  }

  $(document).ready(function () {
    $("body").on("click", ".click-scroll", function (event) {
      event.preventDefault();
      var hash = $(this).data("target");
      var position = $(this).data("top") || 0;
      if ($("#" + hash).length) {
        $("html, body").animate(
          {
            scrollTop: $("#" + hash).offset().top - position,
          },
          300
        );
      }
    });

    var scent = $(".new-varient-design input:checked").data("name");
    $(".var-scent-name").html(scent);
  });
  $(document).on("change", function () {
    var scent = $(".new-varient-design input:checked").data("name");
    $(".var-scent-name").html(scent);
  });

  var img_height = $(".bottom-select-scents .choose-scent-block .scent-img").height();
  let next_img_height = img_height / 2 - 15;
  let prev_img_height = img_height / 2;

  $(".bottom-select-scents .choose-scent-block .slick-next").css("top", next_img_height + "px");
  $(".bottom-select-scents .choose-scent-block .slick-prev").css("top", prev_img_height + "px");

  var top_img_height = $(".top-select-scent .choose-scent-block .scent-img").height();
  let next_top_img_height = top_img_height / 2 - 15;
  let prev_top_img_height = top_img_height / 2;
  console.log(top_img_height);
  $(".top-select-scent .choose-scent-block .slick-next").css("top", next_top_img_height + "px");
  $(".top-select-scent .choose-scent-block .slick-prev").css("top", prev_top_img_height + "px");

  var helpers = {
    addZeros: function (n) {
      return n < 10 ? n : "" + n;
    },
  };

  function sliderInit() {
    var $slider = $(".blend-popup-slider");
    $slider.each(function () {
      var $sliderParent = $(this).parent();
      $(this).slick({
        arrows: true,
        dots: false,
        infinite: true,
        speed: 100,
        touchThreshold: 100,
        slidesToShow: 1,
        centerMode: true,
        centerPadding: "250px",
        prevArrow: '<span class="blend-slide-arrow blend-left"></span>',
        nextArrow: '<span class="blend-slide-arrow blend-right"></span>',

        responsive: [
          {
            breakpoint: 991,
            settings: {
              centerPadding: "150px",
            },
          },
          {
            breakpoint: 560,
            settings: {
              centerPadding: "50px",
            },
          },
        ],
      });

      if ($(this).find(".item").length > 1) {
        $(this).siblings(".slides-numbers").show();
      }

      $(this).on("afterChange", function (event, slick, currentSlide) {
        $sliderParent.find(".slides-numbers .active").html(helpers.addZeros(currentSlide + 1));
      });

      var sliderItemsNum = $(this).find(".slick-slide").not(".slick-cloned").length;
      $sliderParent.find(".slides-numbers .total").html(helpers.addZeros(sliderItemsNum));
    });
  }

  sliderInit();

  $(".multi-product").on("click", function () {
    var target = $(this).data("target");
    var link = $(this).children("label").data("product");
    $(".product1,.product2").addClass("height-0");
    $(".section").addClass("d-none");
    if (target == "product1") {
      $(".section:first").removeClass("d-none");
    } else {
      $(".section:last").removeClass("d-none");
    }
    let purchase_target = $("." + target).find('input[name="purchase_type"]:checked');
    $("." + target).removeClass("height-0");
    let value = purchase_target.val();
    $(".product-buy-type").html(value);
    if ($('input[name="purchase_type"]:checked').val() == "subscription") {
      let subprice = $(purchase_target).data("subprice");
      let compareprice = $(purchase_target).data("compareprice");
      $(".sub-one-switch").html("Don’t want to subscribe? <b>One time purchase</b>");
      $(".pf-product-price").html(subprice);
      if (subprice == compareprice) {
        $(".del-price").html("");
      } else {
        $(".del-price").html(compareprice);
      }
    } else {
      $("#main-selling-plan").attr("disabled", "disabled");
      let subprice = $(purchase_target).data("subprice");
      let compareprice = $(purchase_target).data("compareprice");
      $(".pf-product-price").html(subprice);
      $(".sub-one-switch").html("<b>Subscribe and Save 50%</b>");
      if (subprice == compareprice) {
        $(".del-price").html("");
      } else {
        $(".del-price").html(compareprice);
      }
    }
  });

  $(".blend-popup").on("click", function () {
    $(".blends-popup").addClass("show");
    var currentSlide = $(this).data("target");
    var slideno = $(this).data("index");
    $(".blend-popup-slider").slick("slickGoTo", slideno - 1);
    var topPosition = $(".blend-popup-slider").position().top;
    var height = $(".blend-popup-slider").height();
    var pos = topPosition + height + 8;

    $(".slides-numbers").css("top", pos);
  });
  $(".blends-popup .overlay,.close-blend-popup").on("click", function () {
    $(".blends-popup").removeClass("show");
  });

  $(".pf-min-cart").on("click", ".checkout-btn", function () {
    $(this).addClass("loading");
  });

  $(".bundle-down-arrow").click(function () {
    $(this).toggleClass("open");
    $(".bundle-added-products-section").toggleClass("show");
  });
  $(".submenu-toggle").click(function () {
    $(".have-submenu").toggleClass("open");
  });

  $(".single-flow-popup").on("click", function () {
    var popup = $(this).data("popup");
    $("." + popup).addClass("show");
    var currentSlide = $(this).data("target");
    var slideno = $(this).data("index");
    $(".blend-popup-slider").slick("slickGoTo", slideno - 1);
    var topPosition = $(".blend-popup-slider").position().top;
    var height = $(".blend-popup-slider").height();
    var pos = topPosition + height + 8;
  });
  $(".single-flow-popup-wrapper .overlay,.close-blend-popup").on("click", function () {
    $(".single-flow-popup-wrapper").removeClass("show");
  });

  $(".toggle-products").click(function () {
    $(".added-bundle-item-wrapper").toggleClass("show");
  });
  $(".bundle-tab-label").click(function () {
    var tab = $(this).data("tab");
    var target = $(this).data("target");
    console.log(tab);
    console.log(target);
    $("." + tab).removeClass("active");
    $(this).addClass("active");
    $("." + target).addClass("active");
  });

  if ($(window).width() < 768) {
    $(".categories-mobile-slider").slick({
      arrows: true,
      dots: true,
      speed: 300,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 5500,
      centerMode: true,
      centerPadding: "30px",
      infinite: false,
      prevArrow:
        '<img class="slick-arrow slick-prev" src="https://cdn.shopify.com/s/files/1/0360/1347/3931/files/carbon_chevron-left.png?v=1693892051">',
      nextArrow:
        '<img class="slick-arrow slick-next" src="https://cdn.shopify.com/s/files/1/0360/1347/3931/files/carbon_chevron-right.png?v=1693892051">',
    });
  }

  $(".gp-4-product-gallery").slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    fade: true,
    asNavFor: ".gp-4-product-gallery-thumb",
    nextArrow:
      '<img src="https://cdn.shopify.com/s/files/1/0360/1347/3931/files/arrow_forward_ios.png?v=1699583960" class="slick-arrow slick-next gp-4-arrow">',
    prevArrow:
      '<img src="https://cdn.shopify.com/s/files/1/0360/1347/3931/files/arrow_forward_ios_1.png?v=1699583961" class="slick-arrow slick-prev gp-4-arrow">',
  });
  $(".gp-5-product-gallery").not(".slick-initialized").slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    fade: true,
    dots: true,
    nextArrow:
      '<div class="slick-arrow slick-next gp-4-arrow"><svg width="31" height="31" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg"><path id="expand_circle_right" d="M18.2025 15.1328L12.9899 20.3454L13.9621 21.3593L20.1886 15.1328L13.9621 8.90631L12.9899 9.92019L18.2025 15.1328ZM15.6814 30.1328C13.6071 30.1328 11.657 29.7392 9.83095 28.952C8.00492 28.1648 6.41652 27.0918 5.06574 25.7331C3.71499 24.3743 2.64564 22.7863 1.8577 20.9691C1.06975 19.1519 0.675781 17.2083 0.675781 15.1384C0.675781 13.0641 1.06938 11.114 1.85657 9.28798C2.6438 7.46195 3.71216 5.87355 5.06166 4.52277C6.41116 3.17202 7.99806 2.10267 9.82236 1.31473C11.6467 0.526786 13.596 0.132812 15.6702 0.132812C17.7444 0.132812 19.6899 0.526409 21.5067 1.3136C23.3235 2.10083 24.9119 3.16919 26.2719 4.51869C27.6319 5.86819 28.7059 7.45509 29.4939 9.2794C30.2818 11.1037 30.6758 13.053 30.6758 15.1272C30.6758 17.1972 30.2822 19.1416 29.495 20.9605C28.7078 22.7794 27.6348 24.3689 26.276 25.7289C24.9173 27.089 23.3304 28.163 21.5153 28.9509C19.7002 29.7388 17.7556 30.1328 15.6814 30.1328ZM15.6758 28.7226C19.4564 28.7226 22.6665 27.4028 25.3061 24.7631C27.9457 22.1236 29.2655 18.9135 29.2655 15.1328C29.2655 11.3479 27.9457 8.13674 25.3061 5.49927C22.6665 2.8618 19.4564 1.54306 15.6758 1.54306C11.8909 1.54306 8.67968 2.8618 6.04224 5.49927C3.40477 8.13674 2.08603 11.3479 2.08603 15.1328C2.08603 18.9135 3.40477 22.1236 6.04224 24.7631C8.67968 27.4028 11.8909 28.7226 15.6758 28.7226Z" fill="#2D469E"/></svg></div>',
    prevArrow:
      '<div class="slick-arrow slick-prev gp-4-arrow"><svg width="31" height="31" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg"><path id="expand_circle_right" d="M12.8063 15.5742L18.0189 10.3616L17.0467 9.34772L10.8202 15.5742L17.0467 21.8007L18.0189 20.7868L12.8063 15.5742ZM15.3274 0.57422C17.4017 0.57422 19.3518 0.967814 21.1778 1.75501C23.0039 2.54223 24.5923 3.61522 25.943 4.97397C27.2938 6.33272 28.3631 7.9207 29.1511 9.73793C29.939 11.5551 30.333 13.4987 30.333 15.5686C30.333 17.6429 29.9394 19.593 29.1522 21.4191C28.365 23.2451 27.2966 24.8335 25.9471 26.1843C24.5976 27.535 23.0107 28.6044 21.1864 29.3923C19.3621 30.1802 17.4128 30.5742 15.3386 30.5742C13.2643 30.5742 11.3188 30.1806 9.50209 29.3934C7.68531 28.6062 6.09691 27.5378 4.73688 26.1883C3.37685 24.8388 2.30287 23.2519 1.51492 21.4276C0.726979 19.6033 0.333007 17.654 0.333006 15.5798C0.333006 13.5098 0.726601 11.5654 1.5138 9.74651C2.30102 7.9276 3.37401 6.33812 4.73276 4.97809C6.0915 3.61807 7.67842 2.54408 9.4935 1.75614C11.3086 0.968191 13.2532 0.57422 15.3274 0.57422ZM15.333 1.98447C11.5524 1.98447 8.34226 3.30428 5.70267 5.94389C3.06306 8.58347 1.74326 11.7936 1.74326 15.5742C1.74326 19.3591 3.06306 22.5703 5.70267 25.2078C8.34226 27.8452 11.5524 29.164 15.333 29.164C19.1179 29.164 22.3291 27.8452 24.9665 25.2078C27.604 22.5703 28.9228 19.3591 28.9228 15.5742C28.9228 11.7936 27.604 8.58347 24.9665 5.94389C22.3291 3.30428 19.1179 1.98447 15.333 1.98447Z" fill="#2D469E"/></svg></div>',
  });
  $(".gp-4-product-gallery-thumb").slick({
    slidesToShow: 5,
    slidesToScroll: 1,
    asNavFor: ".gp-4-product-gallery",
    dots: false,
    centerMode: false,
    focusOnSelect: true,
    infinite: true,
    arrows: false,
  });

  $(".social-videos-slider").slick({
    slidesToShow: 4,
    slidesToScroll: 1,
    dots: true,
    infinite: false,
    arrows: true,
    nextArrow:
      '<img src="https://cdn.shopify.com/s/files/1/0360/1347/3931/files/Button.png?v=1723267461" class="slick-arrow slick-next gp-4-arrow">',
    prevArrow:
      '<img src="https://cdn.shopify.com/s/files/1/0360/1347/3931/files/Button_a82f79a0-1e21-4c5f-a5ec-e1eb44a238ad.png?v=1723267531" class="slick-arrow slick-prev gp-4-arrow">',
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  });

  $(".review-slider-3").slick({
    slidesToShow: 2,
    slidesToScroll: 1,
    dots: false,
    infinite: true,
    arrows: true,
    prevArrow: $(".rs-left"),
    nextArrow: $(".rs-right"),
    responsive: [
      {
        breakpoint: 991,
        settings: {
          dots: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: true,
        },
      },
    ],
  });

  $(".testimonial-cards-slider").slick({
    slidesToShow: 3,
    slidesToScroll: 1,
    dots: true,
    infinite: true,
    arrows: true,
    prevArrow: $(".tc-prev"),
    nextArrow: $(".tc-next"),
    responsive: [
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          dots: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: true,
        },
      },
    ],
  });

  if ($(window).width() < 991) {
    $(".tss-slider").slick({
      slidesToShow: 2,
      slidesToScroll: 1,
      dots: true,
      infinite: true,
      arrows: true,
      centerMode: true,
      nextArrow:
        '<span class="slick-arrow slick-next gp-4-arrow"><img src="https://cdn.shopify.com/s/files/1/0360/1347/3931/files/expand_circle_right.svg?v=1703042252" class=""></span>',
      prevArrow:
        '<span class="slick-arrow slick-prev gp-4-arrow"><img src="https://cdn.shopify.com/s/files/1/0360/1347/3931/files/expand_circle_left.svg?v=1703042253" class=""></span>',

      responsive: [
        {
          breakpoint: 560,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          },
        },
      ],
    });
  }

  if ($(window).width() < 1100) {
    $(".accordion-blocks-slider").slick({
      slidesToShow: 3,
      slidesToScroll: 1,
      dots: false,
      infinite: false,
      arrows: true,
      nextArrow:
        '<img src="https://cdn.shopify.com/s/files/1/0360/1347/3931/files/expand_circle_right.svg?v=1703042252" class="slick-arrow slick-next gp-4-arrow">',
      prevArrow:
        '<img src="https://cdn.shopify.com/s/files/1/0360/1347/3931/files/expand_circle_left.svg?v=1703042253" class="slick-arrow slick-prev gp-4-arrow">',
      responsive: [
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
            dots: true,
          },
        },
        {
          breakpoint: 560,
          settings: {
            slidesToShow: 1.1,
            slidesToScroll: 1,
            dots: true,
          },
        },
      ],
    });
  }

  $(".t-video-play").on("click", function () {
    event.preventDefault();
    var target = $(this).data("target");
    $("#" + target).trigger("play");
    $("#" + target).attr("controls", "");
    $(this).addClass("d-none");
  });
  $(".intro-video-play").on("click", function () {
    event.preventDefault();
    var target = $(this).data("target");
    $("#" + target).trigger("play");
    $("#" + target).attr("controls", "");
    $("#" + target).removeAttr("muted");
    $("#" + target).removeAttr("loop");
    $("#" + target).removeAttr("autoplay");
    $(this).addClass("d-none");
  });

  var videoHeight = $(".social-video-wrapper").height();
  $(".social-video-wrapper video").css("height", videoHeight);

  var slidervideoHeight = $(".gp-4-product-gallery .main-product-img").height();
  $(".gp-4-product-gallery .main-product-img video").css("height", slidervideoHeight);

  var slidervideoHeight2 = $(".gp-5-product-gallery .main-product-img").height();
  $(".gp-5-product-gallery .main-product-img video").css("height", slidervideoHeight2);

  $(".toggle-option").click(function () {
    var image = $(this).data("image");
    $(".toggle-option").removeClass("active");
    $(this).addClass("active");
    $("video.toggle-image").attr("src", image);
  });

  if ($(window).width() < 768) {
    $(".make-accordion details").removeAttr("open");
    $(".make-accordion details.stay-open").attr("open", "");
  }

  $(".gp-5-variant-li input").on("change", function () {
    var variantClass = $(this).data("variantclass");
    var delPrice = $(this).data("price");
    var sellPrice = $(this).data("subprice");
    var sellingPlan = $(this).data("planid");
    var variantID = $(this).data("variantid");
    var discount = $(this).data("discount");
    var variantName = $(this).data("name");
    var section = $(this).data("section");
    var itemId = $(this).attr("data-item-id");
    var itemName = $(this).attr("data-item-name");
    $("#" + section + " .link-to-variant").removeClass("show");
    $("#" + section + " .link-to-variant." + variantClass).addClass("show");
    $("#" + section + " .gp-5-del-price").html(delPrice);
    $("#" + section + " .gp-5-sell-price").html(sellPrice);
    $("#" + section + " .input_selling_plan").val(sellingPlan);
    $("#" + section + " .input_variant_id").val(variantID);
    $("#" + section + " .discout_input").val(discount);
    $("#" + section + " .ga4-checkout-btn").attr("data-item-id", itemId);
    $("#" + section + " .ga4-checkout-btn").attr("data-item-name", itemName);
    $("#" + section + " .ga4-checkout-btn").attr("data-price", sellPrice);
    jumpBack();
  });

  var header = $(".annoucment_bar_2");
  var headerHeight = header.outerHeight();
  var lastScrollTop = 0;

  $(window).scroll(function () {
    var currentScrollTop = $(this).scrollTop();

    // Check if the user is scrolling down
    if (currentScrollTop > lastScrollTop) {
      // Scrolling down, make the header sticky
      header.removeClass("sticky");
    } else {
      // Scrolling up, show the header
      header.addClass("sticky");
    }

    lastScrollTop = currentScrollTop;
  });

  function jumpBack() {
    setTimeout(function () {
      $(".gp-5-product-gallery").slick("slickGoTo", 0);
    }, 300);
  }

  $("input.buy_plan_radio").on("change", function () {
    var variantId = $(this).data("id");
    var itemId = $(this).data("item-id");
    var buyoption = $(this).data("option");
    var section = $(this).data("section");
    var discount = $(this).data("discount");
    var price = $(this).data("price");
    $("#" + section + " input.input_variant_id").val(variantId);
    $("#" + section + " .gp-10-buyoption-input").val(buyoption);
    $("#" + section + " .discout_input").val(discount);
    $("#" + section + " .ga4-checkout-btn").attr("data-item-id", itemId);
    $("#" + section + " .ga4-checkout-btn").attr("data-price", price);
    if (buyoption == "oneoff") {
      $("#" + section + " .checkout-starterkit-btn").addClass("oneoff_buy_option");
      $("#" + section + " .media_tag").addClass("d-none");
    } else {
      $("#" + section + " .checkout-starterkit-btn").removeClass("oneoff_buy_option");
      $("#" + section + " .media_tag").removeClass("d-none");
    }
  });

  $(".gp-5-variant-li input").on("change", function () {
    var disable = $(this).attr("data-disabled");
    var section = $(this).attr("data-section");
    var subDiscount = $(this).attr("data-discount");
    var oneDiscount = $(this).attr("data-discount-one-time");
    var variant1 = $(this).attr("data-variantid");
    var variant2 = $(this).attr("data-variantid-2");
    var plan1 = $(this).attr("data-planid");
    var plan2 = $(this).attr("data-planid-2");
    var sku1 = $(this).attr("data-sku-1");
    var sku2 = $(this).attr("data-sku-2");
    const switchVariantClass = $(this).data("variantclass");

    var itemName = $(this).attr("data-item-name");
    if (disable === "disabled") {
      $("#" + section + "  .gp-10-onetime.gp-10-input-buy").addClass("disabled");
    } else {
      $("#" + section + "  .gp-10-onetime.gp-10-input-buy").removeClass("disabled");
    }

    $("#" + section + " .gp-10-subscribe input").attr("data-discount", subDiscount);
    $("#" + section + " .gp-10-onetime input").attr("data-discount", oneDiscount);
    $("#" + section + " .discout_input").val(subDiscount);

    $("#" + section + " .gp-10-subscribe input").attr("data-planid", plan1);
    $("#" + section + " .gp-10-subscribe input").attr("data-variantid", variant1);
    $("#" + section + " .gp-10-subscribe input").attr("data-id", variant1);
    $("#" + section + " .gp-10-subscribe input").attr("data-sku", sku1);
    $("#" + section + " .gp-10-subscribe input").attr("data-item-id", sku1);
    $("#" + section + " .input_variant_id").val(variant1);
    $("#" + section + " .input_selling_plan").val(plan1);
    $("#" + section + " .gp-10-onetime input").attr("data-planid", plan2);
    $("#" + section + " .gp-10-onetime input").attr("data-variantid", variant2);
    $("#" + section + " .gp-10-onetime input").attr("data-id", variant2);
    $("#" + section + " .gp-10-onetime input").attr("data-sku", sku2);
    $("#" + section + " .gp-10-onetime input").attr("data-item-id", sku2);
    $("#" + section + " .ga4-checkout-btn").attr("data-item-id", sku1);
    $("#" + section + " .gp-10-input-buy input").attr("data-item-name", itemName);
    if ($(".switch_scents").length > 0) {
      $(".switch_scents .link-to-variant").removeClass("show");
      $(".switch_scents .link-to-variant." + switchVariantClass).addClass("show");
      setTimeout(function () {
        $(".switch_scents .tss-slider").slick("slickGoTo", 0);
      }, 200);
    }

    // Get the current selected plan
    const currentPlanOption = $(".buy_plan_radio:checked").data("option");

    // Mapping for the currentPlanOption in case we have more plans in the future
    const planInputClassMap = {
      subscription: ".gp-10-subscribe input",
      oneoff: ".gp-10-refill-only input",
    };

    // Get the class for the current selected plan by referring to the mapping, if not available default to subscribe
    const planInputSelector = planInputClassMap[currentPlanOption] || ".gp-10-subscribe input";
    const $planInput = $("#" + section + " " + planInputSelector);

    const $subscribeInput = $("#" + section + " .gp-10-subscribe input");

    // Uncheck all plan radio buttons
    $("#" + section + " .buy_plan_radio").prop("checked", false);

    // Trigger click event on the planInput
    if ($planInput.length > 0) {
      $subscribeInput.trigger("click");
      $planInput.trigger("click");
    } else {
      // If selected planInput doesn't exist, then select subscribe.
      // This is possibly a redundant check but using in case of errors in the planInputClassMap
      if ($subscribeInput.length > 0) {
        $subscribeInput.trigger("click");
      }
    }
  });

  $(".gp-14 .gp-10-input-buy input").on("change", function () {
    event.preventDefault();
    var section = $(this).attr("data-section");
    var discount = $(this).attr("data-discount");
    var variantid = $(this).attr("data-variantid");
    var planid = $(this).attr("data-planid");
    var sku = $(this).attr("data-sku");
    $("#" + section + " .discout_input").val(discount);
    $("#" + section + " .input_variant_id").val(variantid);
    $("#" + section + " .input_selling_plan").val(planid);
    $("#" + section + " .ga4-checkout-btn").attr("data-item-id", sku);
  });

  if ($(".switch_scents").length > 0) {
    $(".switch_scents .slick-next")
      .off("click")
      .on("click", function (e) {
        e.preventDefault();

        let parentSlider = $(this).parent(".tss-slider");
        $(".switch_scents .scent-accordion").removeAttr("open");
        $("html, body").animate(
          {
            scrollTop: parentSlider.offset().top,
          },
          50
        );

        setTimeout(function () {
          parentSlider.slick("slickNext");
          console.log("slide changed");
        }, 500);
      });

    $(".switch_scents .slick-prev")
      .off("click")
      .on("click", function (e) {
        e.preventDefault();

        let parentSlider = $(this).parent(".tss-slider");
        $(".switch_scents .scent-accordion").removeAttr("open");
        $("html, body").animate(
          {
            scrollTop: parentSlider.offset().top,
          },
          50
        );

        setTimeout(function () {
          parentSlider.slick("slickPrev");
          console.log("slide changed");
        }, 500);
      });

    $(".switch_scents .tss-slider").on("swipe", function (event, slick, direction) {
      $(".switch_scents .scent-accordion").removeAttr("open");
    });
  }

  function RefreshTheCart() {
    fetch(window.Shopify.routes.root + "cart.js", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((response) => {
        let getcartcountvalue = document.getElementsByClassName("cart-item-count")[0].innerText;
        if (
          response.items.length > 0 &&
          (!getcartcountvalue || response.item_count > getcartcountvalue)
        ) {
          window.dispatchEvent(
            new CustomEvent("cart-updated", {
              detail: response,
            })
          );
          Purdy.CartCountUpdate();
        }
      });
  }

  window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
      RefreshTheCart();
    }
  });

  window.addEventListener("load", (event) => {
    RefreshTheCart();
  });

  document.querySelectorAll(".see-more-blend--container").forEach((container) => {
    container.addEventListener("click", () => {
      container.classList.toggle("open");
    });
  });

  $(document).ready(function () {
    $("body").on("click", ".m-click-scroll", function (event) {
      var isMobile = window.innerWidth <= 768;

      var hash = $(this).data("target");
      var position = isMobile ? $(this).data("m-top") || 0 : $(this).data("top") || 0;

      console.log("isMobile", isMobile, "position", position, "hash", hash);

      if ($("#" + hash).length) {
        $("html, body").animate(
          {
            scrollTop: $("#" + hash).offset().top - position,
          },
          300
        );
      }
    });

    function updateSelectedPlan(scent_type, order) {
      const selectedScentType = scent_type;
      const selectedIndexOrder = order;
      const otherScentType = selectedScentType === "s1" ? "s2" : "s1";

      // Find and check the corresponding radio in the other tab
      const correspondingRadio = document.querySelector(
        `.buy_plan_radio[data-scent-type="${otherScentType}"][data-index-order="${selectedIndexOrder}"]`
      );

      if (correspondingRadio) {
        correspondingRadio.checked = true;
      }

      // correspondingRadio Plan Selector
      const correspondingScentType = $(correspondingRadio).data("scent-type");
      var galleryClass_c = $(correspondingRadio).data("gallery");
      var variantID = $(correspondingRadio).data("variantid");
      var sellingPlan = $(correspondingRadio).data("planid");
      var sellingType = $(correspondingRadio).data("plantype");
      var variantSKU = $(correspondingRadio).data("sku");
      var variantPrice = $(correspondingRadio).data("price");
      var variantDeletedPrice = $(correspondingRadio).data("deleted-price");
      var variantDiscount = $(correspondingRadio).data("discount");

      $(".form_" + correspondingScentType + " " + "  .input_variant_id").val(variantID);
      $(".form_" + correspondingScentType + " " + "  .input_selling_plan").val(sellingPlan);
      $(".form_" + correspondingScentType + " " + "  .discout_input").val(variantDiscount);
      $(".form_" + correspondingScentType + " " + "  .gp--del-price").text(variantDeletedPrice);
      $(".form_" + correspondingScentType + " " + "  .gp--sell-price").text(variantPrice);
      $(".form_" + correspondingScentType + " " + " .gp--buyoption-input").val(sellingType);
      $(".form_" + correspondingScentType + ".gp--product-variant").data("gallery", galleryClass_c);
      var ninja = $(".form_" + correspondingScentType + ".gp--product-variant").data("gallery");
      console.log("Crosponding : " + ninja);
    }

    $('.buy--plan input[type="radio"].buy_plan_radio').on("change", function () {
      if ($(this).is(":checked")) {
        let scent_type = $(this).data("scent-type");
        let order = $(this).data("index-order");
        updateSelectedPlan(scent_type, order);
        var galleryClass_p = $(this).data("gallery");
        var variantID = $(this).data("variantid");
        var sellingPlan = $(this).data("planid");
        var sellingType = $(this).data("plantype");
        var variantSKU = $(this).data("sku");
        var variantname = $(this).data("item-name");
        var variantPrice = $(this).data("price");
        var variantDeletedPrice = $(this).data("deleted-price");
        var variantDiscount = $(this).data("discount");
        //console.log('clicked' + galleryClass);
        $(".form_" + scent_type + " " + "  .input_variant_id").val(variantID);
        $(".form_" + scent_type + " " + "  .input_selling_plan").val(sellingPlan);
        $(".form_" + scent_type + " " + "  .discout_input").val(variantDiscount);
        $(".form_" + scent_type + " " + "  .gp--del-price").text(variantDeletedPrice);
        $(".form_" + scent_type + " " + "  .gp--sell-price").text(variantPrice);
        $(".form_" + scent_type + " " + " .gp--buyoption-input").val(sellingType);
        $(".form_" + scent_type + " " + " .ga4-checkout-btn").attr("data-item-id", variantSKU);
        $(".form_" + scent_type + " " + " .ga4-checkout-btn").attr("data-item-name", variantname);
        $(`.form_${scent_type}.gp--product-variant`).data("gallery", galleryClass_p);
        $(".gp--product-gallery .link-to-variant").removeClass("show");
        $(".gp--product-gallery .link-to-variant.g_" + galleryClass_p).addClass("show");
        var ninja = $(`.form_${scent_type}.gp--product-variant`).data("gallery");
        console.log("Clicked : " + ninja);
        if (sellingType === "payg") {
          $(".buy-text").text("BUY ONCE");
          $(".gp--del-price").hide();
        } else {
          $(".buy-text").text("TRY IT RISK FREE");
          $(".gp--del-price").show();
        }
      }
    });

    $(".gp--product-variant").on("change", function () {
      if ($(this).is(":checked")) {
        var variantClass = $(this).data("variantclass");
        var gallery_v = $(this).data("gallery");

        $(".link-to-variant").removeClass("show");
        $(".link-to-variant." + variantClass).addClass("show");
        $(".gp--product-gallery .link-to-variant.g_" + gallery_v).addClass("show");
      }
    });

    $(".rpb-slider").slick({
      dots: false,
      infinite: false,
      speed: 300,
      slidesToShow: 4,
      slidesToScroll: 4,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
            infinite: true,
            dots: true,
          },
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
            dots: true,
          },
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            dots: true,
          },
        },
      ],
    });

    $(".rpb-slider-black-friday").slick({
      dots: false,
      infinite: false,
      speed: 300,
      slidesToShow: 4,
      slidesToScroll: 4,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
            infinite: true,
            dots: false,
          },
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
            dots: false,
          },
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1.3,
            slidesToScroll: 1,
            dots: false,
          },
        },
      ],
    });
  });
});

$(document).ready(function () {
  function getUrlParameter(name) {
    name = name.replace(/\[/, "\\[").replace(/\]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
    var results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1]);
  }

  if (window.location.pathname.includes("/pages/memberoffer-blackfriday")) {
    const uParam = getUrlParameter("u");

    if (uParam === "mini") {
      setTimeout(function () {
        const $targetInput = $('input[data-index-order="2"]');
        if ($targetInput.length) {
          $targetInput.prop("checked", true).trigger("change");

          $('.buy--plan input[type="radio"].buy_plan_radio').trigger("change");

          const $targetElement = $("#starterkit-product");
          if ($targetElement.length) {
            $("html, body").animate(
              {
                scrollTop: $targetElement.offset().top + 120,
              },
              300
            );
          }
          $(".annoucment_bar_2").removeClass("sticky");
        }
      }, 200);
    } else if (uParam && uParam.startsWith("refills_")) {
      setTimeout(function () {
        // Extract slide index
        const slideIndex = parseInt(uParam.split("_")[1], 10);

        // Check if Slick Slider exists (assumes jQuery and Slick Slider are loaded)
        if (window.jQuery && window.jQuery.fn.slick) {
          const $slider = $(".slick-slider");
          if ($slider.length) {
            // Go to the specific slide (subtract 1 for 0-based indexing)
            setTimeout(function () {
              $slider.slick("slickGoTo", slideIndex - 1);
            }, 300);
          }
        }
        // Fallback for native implementation if not using Slick Slider
        else {
          const slides = document.querySelectorAll(".slick-slide");
          if (slides.length) {
            // Remove active classes
            slides.forEach((slide) => {
              slide.classList.remove("slick-active", "slick-current");
            });

            // Add active class to the specific slide
            setTimeout(function () {
              const targetSlide = slides[slideIndex - 1];
              if (targetSlide) {
                targetSlide.classList.add("slick-active", "slick-current");
              }
            }, 300);
          }
        }

        // Scroll to target element
        const $targetElement = $("#shopify-product-blocks");
        if ($targetElement.length) {
          $("html, body").animate(
            {
              scrollTop: $targetElement.offset().top + 120,
            },
            500
          );
        }
      }, 200);
    } else if (uParam === "mega") {
      setTimeout(function () {
        const $targetElement = $("#starterkit-product");
        $(".annoucment_bar_2").removeClass("sticky");
        if ($targetElement.length) {
          $("html, body").animate(
            {
              scrollTop: $targetElement.offset().top,
            },
            500
          );
        }
      }, 200);
    }
  }

  if (window.location.href.includes("toggle=seasonal")) {
    const $scrollElement = $("#scroll-here-link-1");

    if ($scrollElement.length) {
      const $radioOption = $('input[data-option-index="2"]');

      if ($radioOption.length) {
        $radioOption.prop("checked", true);

        const $radioButtons = $('.gp-5-variant-li > input[type="radio"]');

        if ($radioButtons.length) {
          $radioButtons.prop("checked", true);
          $('.gp-5-variant-li > input[type="radio"]').trigger("change");

          console.log(
            `Successfully checked ${$radioButtons.length} radio buttons and triggered change events`
          );
        } else {
          console.warn(
            'Could not find any radio buttons inside elements with class "gp-5-variant-li"'
          );
        }
      } else {
        console.warn('Could not find radio button with data-option-index="2"');
      }
    } else {
      console.warn('Could not find element with ID "scroll-here-link-1"');
    }
  }
  // if (window.location.href.includes('?refill') || window.location.href.includes('&refill')) {
  //     const $scrollElement = $('#starterkit-product');
  //     const $signatureTab = $('input[data-scent-type="s2"][data-index-order=3]');

  //      $('html, body').animate({
  //              scrollTop: $scrollElement.offset().top + 120
  //      }, 300);

  //     setTimeout(function() {

  //       if ($scrollElement.length) {
  //         $('input[data-name="signature"]').prop('checked', true);
  //         $('input[data-name="signature"]').trigger('change');
  //         $signatureTab.prop('checked', true);
  //         $signatureTab.trigger('change');
  //       }

  //     }, 100);
  //   }

  // Multi Step buy box JS start

  $(document).ready(function () {
    if (
      $("body").hasClass("pf393") &&
      (window.location.href.includes("?preselected=seasonal") ||
        window.location.href.includes("&preselected=seasonal"))
    ) {
      const $scrollElement = $("#starterkit-product");
      const $seasonalTab = $('input.gp--product-variant[data-option-index="2"]');

      if ($scrollElement.length) {
        if ($seasonalTab.length) {
          $seasonalTab.prop("checked", true);
          $seasonalTab.trigger("change");
        }
      }
    }
  });
  $(document).on("change", ".ms-buy--plan input", function () {
    let dataFormValue = $(this).data("form");
    let dataGallery = $(this).data("gallery");
    let dataDeletedPrice = $(this).data("deleted-price");
    let dataPrice = $(this).data("price");
    let dataSku = $(this).data("sku");
    let dataVariantId = $(this).data("variantid");
    let dataDiscount = $(this).data("discount");
    let dataPlanId = $(this).data("planid");
    let dataPlanType = $(this).data("plantype");
    let dataItemName = $(this).data("item-name");

    $("#" + dataFormValue + " " + ".input_variant_id").val(dataVariantId);
    $("#" + dataFormValue + " " + ".discout_input").val(dataDiscount);
    $("#" + dataFormValue + " " + ".gp--buyoption-input").val(dataPlanType);
    $("#" + dataFormValue + " " + ".input_selling_plan").val(dataPlanId);
    $("#" + dataFormValue + " " + ".gp--sell-price").text(dataPrice);
    $("#" + dataFormValue + " " + ".deleted-price").text(dataDeletedPrice);

    $("#" + dataFormValue + " " + ".ga4-checkout-btn").attr("data-item-id", dataSku);
    $("#" + dataFormValue + " " + ".ga4-checkout-btn").attr("data-item-type", dataPlanType);
    $("#" + dataFormValue + " " + ".ga4-checkout-btn").attr("data-price", dataPrice);
    $("#" + dataFormValue + " " + ".ga4-checkout-btn").attr("data-item-name", dataItemName);

    if (dataPlanType === "subscription") {
      $("#" + dataFormValue + " " + ".buy-text").text("TRY IT RISK FREE");
      $("#" + dataFormValue + " " + ".ga4-checkout-btn").attr(
        "data-event-label",
        "try_it_risk_free"
      );
    } else {
      $("#" + dataFormValue + " " + ".buy-text").text("BUY ONCE");
      $("#" + dataFormValue + " " + ".ga4-checkout-btn").attr("data-event-label", "buy_once");
    }

    $(".step-gallery.step-2 .link-to-plan").removeClass("show");
    $(".step-gallery.step-2 .g_" + dataGallery).addClass("show");
  });

  // if (window.location.href.includes('?seasonal') || window.location.href.includes('&seasonal')) {
  //     const $scrollElement = $('#starterkit-product');
  //     const $seasonalTab = $('input[data-scent-type="s1"][data-index-order=3]');

  //      $('html, body').animate({
  //              scrollTop: $scrollElement.offset().top + 120
  //      }, 300);

  //     setTimeout(function() {

  //       if ($scrollElement.length) {
  //         $('input[data-name="seasonal"]').prop('checked', true);
  //         $('input[data-name="seasonal"]').trigger('change');
  //         $seasonalTab.prop('checked', true);
  //         $seasonalTab.trigger('change');
  //       }

  //     }, 100);
  //   }

  // 341 slider
  if ($(".product-gallery-341-1").children(".main-product-img").length) {
    $(".product-gallery-341-1").slick({
      arrows: false,
      dots: false,
      infinite: true,
      speed: 300,
      fade: true,
      slidesToShow: 1,
      prevArrow: '<div class="slick-arrow slick-prev"></div>',
      nextArrow: '<div class="slick-arrow slick-next"> </div>',
      asNavFor: ".product-gallery-thumb-341-1",
    });
    $(".product-gallery-thumb-341-1").slick({
      slidesToShow: 5,
      slidesToScroll: 1,
      asNavFor: ".product-gallery-341-1",
      dots: false,
      focusOnSelect: true,
      infinite: true,
    });
  }
  if ($(".product-gallery-341-2").children(".main-product-img").length) {
    $(".product-gallery-341-2").slick({
      arrows: false,
      dots: false,
      infinite: true,
      speed: 300,
      fade: true,
      slidesToShow: 1,
      prevArrow: '<div class="slick-arrow slick-prev"></div>',
      nextArrow: '<div class="slick-arrow slick-next"> </div>',
      asNavFor: ".product-gallery-thumb-341-2",
    });
    $(".product-gallery-thumb-341-2").slick({
      slidesToShow: 5,
      slidesToScroll: 1,
      asNavFor: ".product-gallery-341-2",
      dots: false,
      focusOnSelect: true,
      infinite: true,
    });
  }
  $(".banner-slider-343").slick({
    arrows: false,
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    draggable: false,
    swipe: false,
    swipeToSlide: false,
    touchMove: false,
    accessibility: false,
    autoplay: true,
    autoplaySpeed: 2000,
  });
  $(".revolutionise-slider").slick({
    arrows: true,
    dots: false,
    infinite: false,
    speed: 300,
    slidesToShow: 5,
    prevArrow:
      '<img class="slick-arrow slick-prev" src="https://cdn.shopify.com/s/files/1/0360/1347/3931/files/Button-left.png?v=1749735474"/>',
    nextArrow:
      '<img class="slick-arrow slick-next" src="https://cdn.shopify.com/s/files/1/0360/1347/3931/files/Button-right.png?v=1749735474"/>',
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1.3,
          slidesToScroll: 1,
          centerPadding: "20%",
        },
      },
    ],
  });
  $(".press-slider").slick({
    arrows: true,
    dots: false,
    infinite: true,
    speed: 300,
    slidesToShow: 3,
    centerMode: true,
    centerPadding: "0px",
    prevArrow: '<div class="slick-arrow slick-prev"></div>',
    nextArrow: '<div class="slick-arrow slick-next"></div>',
    responsive: [
      {
        breakpoint: 560,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: true,
          centerPadding: "20%",
        },
      },
    ],
  });

  $(".press-slider").on("afterChange", function (event, slick, currentSlide) {
    const currentImage = document.querySelector(".press-slide.slick-current .press-image");

    if (currentImage) {
      const title = currentImage.getAttribute("data-title");
      const content = currentImage.getAttribute("data-content");

      $(".press-heading").text(title);
      $(".press-details").text(content);
    } else {
      console.log("Current image not found.");
    }
  });
  if (window.location.href.includes("?refills") || window.location.href.includes("&refills")) {
    const $scrollElement = $("#starterkit-product");
    const $signatureTab = $('input[data-scent-type="s2"][data-index-order=3]');

    $("html, body").animate(
      {
        scrollTop: $scrollElement.offset().top + 120,
      },
      300
    );

    $(".step-1.step-gallery").addClass("height-0");
    $(".step-1.select-scents").addClass("height-0");
    $(".step-2.step-gallery").removeClass("height-0");
    $(".step-2.select-Plan").removeClass("height-0");
    $(".step-2.step-gallery .link-to-plan").removeClass("show");
    $(".ms-plan-wrapper .link-to-variant").removeClass("show");
    $(".link-to-variant.seasonal-scents-1.pf-173-nature").removeClass("show");
    $(".step-2.step-gallery .link-to-plan.g_variant_6").addClass("show");
    $(".ms-plan-wrapper .link-to-variant.variant_2").addClass("show");
    $(".link-to-variant.seasonal-scents-1.pf-173-nature.variant_4").addClass("show");
    $(".pf-173-nature.variant_2").addClass("show");
    $(".pf-173-nature.variant_1").removeClass("show");
    if ($scrollElement.length) {
      $signatureTab.prop("checked", true);
      $signatureTab.trigger("change");
      $(".guarantee-sub-text").hide();
    }
  }

  if (window.location.href.includes("?seasonal") || window.location.href.includes("&seasonal")) {
    const $scrollElement = $("#starterkit-product");
    const $seasonalTab = $('input[data-scent-type="s1"][data-index-order=3]');

    $("html, body").animate(
      {
        scrollTop: $scrollElement.offset().top + 120,
      },
      300
    );

    $(".step-1.step-gallery").addClass("height-0");
    $(".step-1.select-scents").addClass("height-0");
    $(".step-2.step-gallery").removeClass("height-0");
    $(".step-2.select-Plan").removeClass("height-0");
    $(".step-2.step-gallery .link-to-plan").removeClass("show");
    $(".ms-plan-wrapper .link-to-variant").removeClass("show");
    $(".step-2.step-gallery .link-to-plan.g_variant_3").addClass("show");
    $(".ms-plan-wrapper .link-to-variant.variant_1").addClass("show");
    $(".link-to-variant.seasonal-scents-1.pf-173-nature").removeClass("show");
    $(".link-to-variant.seasonal-scents-1.pf-173-nature.variant_1").addClass("show");

    if ($scrollElement.length) {
      $seasonalTab.prop("checked", true);
      $seasonalTab.trigger("change");
      $(".guarantee-sub-text").hide();
    }
  }

  if (window.location.href.includes("?usrefills") || window.location.href.includes("&usrefills")) {
    const $ScrollElement_US = $("#starterkit-product");
    const $TargetElement_US = $('input[data-scent-type="s1"][data-index-order=3]');

    $("html, body").animate(
      {
        scrollTop: $ScrollElement_US.offset().top + 120,
      },
      300
    );

    if ($TargetElement_US.length) {
      $TargetElement_US.prop("checked", true).trigger("change");
      setTimeout(function () {
        $('.buy--plan input[type="radio"].buy_plan_radio').trigger("change");
      }, 100);
    }
  }
});

function initPFProductSliders() {
  $(".slider__block").each(function () {
    const $block = $(this);
    const $main = $block.find(".multi-gallery-slider");
    const $thumb = $block.find(".multi-gallery-slider-thumbnail");

    $main.slick({
      arrows: false,
      dots: false,
      infinite: true,
      speed: 300,
      fade: true,
      slidesToShow: 1,
      prevArrow: '<div class="slick-arrow slick-prev"></div>',
      nextArrow: '<div class="slick-arrow slick-next"> </div>',
      asNavFor: $thumb,
    });

    $thumb.slick({
      slidesToShow: 6,
      slidesToScroll: 1,
      asNavFor: $main,
      dots: false,
      focusOnSelect: true,
      infinite: true,
    });
  });
}

$(document).ready(function () {
  initPFProductSliders();
});

window.Purdy = Purdy;
