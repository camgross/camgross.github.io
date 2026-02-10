$(function () {
  $('[data-toggle="tooltip"]').tooltip();

  // Clean Blog: shrink navbar on scroll
  var mainNav = $('#mainNav');
  if (mainNav.length) {
    var navbarShrink = function () {
      if (window.scrollY === 0) {
        mainNav.removeClass('navbar-shrink');
      } else {
        mainNav.addClass('navbar-shrink');
      }
    };
    navbarShrink();
    $(window).on('scroll', navbarShrink);
  }
});
