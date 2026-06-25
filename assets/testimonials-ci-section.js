(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var testimonials = document.querySelectorAll(".testimonial-section");
    if (!testimonials.length) {
      return;
    }

    testimonials.forEach(function (section) {
      section.classList.add("testimonial-loaded");
    });
  });
})();
