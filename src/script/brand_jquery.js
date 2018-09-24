(function($){
  $(function(){
    // Создаем карусель товаров в шапке.
    $('.carousel').slick({
      dots: true,
      infinite: true,
      speed: 300,
      slidesToShow: 1,
      adaptiveHeight: true
    });

    // Создаем слайдер на странице Products.
    $('#sliderRange').slider({
      range: true,
      animate: "slow",
      max: 500,
      values: [52, 400]
    });

    // Выводим значения ползунков.
    $('#sliderRange').slider({
      slide: function(event, ui) {
        if (ui.handleIndex === 0) {
          $('output#rangeLeft').text('$' + ui.value);
        } else if (ui.handleIndex === 1) {
          $('output#rangeRight').text('$' + ui.value);
        }
      }
    });
  });
})(jQuery);


