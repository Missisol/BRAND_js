/**
 * Выводит карточки товаров на странице.
 */
function renderProducts() {
  $.ajax({
    url: 'http://localhost:3000/products?_page=1&_limit=9',
    dataType: 'json',
    success: function(result) {
      result.forEach(function(product) {
        // Создаем обертку карточки продукта
        var $oneProductWrap = $('<div />', {
                                id: product.id,
                                class: 'oneProductWrap',
                                'data-name': product.name,
                                'data-price': product.price,
                                'data-image_min_url': product.min_url,
                              });
        // Создаем элемент продукта
        var $oneProduct = $('<a />', {href: '#'}).addClass('oneProduct');
        // Создаем изображение продукта
        var $imgProduct = $('<img>', {
                            class: 'imageOneProduct', 
                            src: product.src,
                            alt: product.name,
                          });
        // Создаем элемент для описания и центы продукта
        var $textProduct = $('<div />').addClass('textProduct');
                var $pTextProduct = $('<p />').text(product.name);
        var $spanTextProduct = $('<span />').text('$' + product.price);
        $textProduct.append($pTextProduct).append($spanTextProduct);
        // Добавляем изображение и текст в элемент продукта
        $oneProduct.append($imgProduct).append($textProduct);
        // Создаем обертку кнопки добавления в корзину
        var $addToCartWrap = $('<div />').addClass('addToCartWrap');
        // Создаем кнопку
        var $addToCart = $('<a />', {href: '#'}).addClass('addToCart');
        var $imgCart = $('<img />', {
          src: 'images/index/feturedItems/basket_white.svg',
          alt: 'basket',
        });
        var $textAddToCart = $('<div />').addClass('textAddToCart').text('Add to Cart');
        // Добавляем изображение и текст на кнопку
        $addToCart.append($imgCart).append($textAddToCart);
        $addToCartWrap.append($addToCart);
        // Добавляем элемент продукта и кнопку в обертку карточки продукта
        $oneProductWrap.append($oneProduct).append($addToCartWrap);
        $('.products').append($oneProductWrap);
      });
    },
  });
}

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
    
    // Создаем слайдер
    $('#sliderRange').slider({
      range: true,
      animate: "slow",
      max: 500,
      values: [52, 400]
    });

    // Выводим значения ползунков
    $('#sliderRange').slider({
      slide: function(event, ui) {
        if (ui.handleIndex === 0) {
          $('output#rangeLeft').text('$' + ui.value);
        } else if (ui.handleIndex === 1) {
          $('output#rangeRight').text('$' + ui.value);
        }
      }
    });

    // Выводим карточки товаров на странице
    renderProducts();

    // В случае неудачного завершения запроса к серверу выводим сообщение об ошибке
    $(document).ajaxError(function() {
      $('.products').addClass('error').text('Произошла ошибка получения данных с сервера');
    });

  });
})(jQuery);












