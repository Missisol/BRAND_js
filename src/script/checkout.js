(function($) {
  $(function() {
    // Создаем карусель товаров в шапке.
    $('.carousel').slick({
      dots: true,
      infinite: true,
      speed: 300,
      slidesToShow: 1,
      adaptiveHeight: true
    });
  });
})(jQuery);
