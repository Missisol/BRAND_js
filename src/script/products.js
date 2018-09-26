/**
 * Выводит карточки товаров на странице.
 */
function renderProducts(url) {
  $('.products').empty();
  $.ajax({
    url: url,
    dataType: 'json',
    success: function(result, status, xhr) {
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

/**
 * Создает элемент паджинации
 * @param {string} a - Номер страницы, на который кликнул пользователь 
 */
function makePagination(a) {
  $('.page').remove();
  var activePageId = a;
  var first;
  if (activePageId > 1) {
    first = activePageId;
  } else first = 2;

  $.ajax({
    url: 'http://localhost:3000/products',
    dataType: 'json',
    success: function(result) {
      var amountPage = Math.ceil(result.length / 9);
      $('.last').attr('id', amountPage).text(amountPage);
     
      if (first === 2) {
        for (var i = first; i <= 4; i++) {
          $('<a />', {href: '#', id: i, class: 'page'}).text(i).insertBefore('.last');
        }
        $('<a />', {href: '#', class: 'page'}).text('...').insertBefore('.last');
        $('.pagination').children('a').removeClass('active');
        $('.pagination').children('#' + activePageId).addClass('active');
      } else if (first > 2 && first <= amountPage - 3) {
        $('<a />', {href: '#', class: 'page'}).text('...').insertBefore('.last');
        for (var j = first, k = 1; j < amountPage, k <= 3; j++, k++) {
          $('<a />', {href: '#', id: j, class: 'page'}).text(j).insertBefore('.last');
        }
        $('<a />', {href: '#', class: 'page'}).text('...').insertBefore('.last');
        $('.pagination').children('a').removeClass('active');
        $('.pagination').children('#' + activePageId).addClass('active');
      } else if (first >= amountPage - 3) {
        $('<a />', {href: '#', id: 'point', class: 'page'}).text('...').insertAfter('#1');
        for (var l = amountPage - 1; l >= amountPage - 3; l--) {
          $('<a />', {href: '#', id: l, class: 'page'}).text(l).insertAfter('#point');
        }
        $('.pagination').children('a').removeClass('active');
        $('.pagination').children('#' + activePageId).addClass('active');
      }
    }
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

    // Выводим элемент паджинации и карточки товаров на странице
    makePagination('1');
    renderProducts('http://localhost:3000/products?_page=1&_limit=9');

    // При клике на номер страницы определяе url и передает в функцию вывода карточек товаров
    $('.pagination').on('click', 'a', function() {
      var activePageId = $(this).attr('id');
      makePagination(activePageId);
      var url = 'http://localhost:3000/products?_page=' + activePageId + '&_limit=9';
      renderProducts(url);
    });

    // При нажатии на кнопку "посмотреть все" выводит на странице все продукты
    $('.buttonViewAll').on('click', function() {
      renderProducts('http://localhost:3000/products');
    });

    // В случае неудачного завершения запроса к серверу выводим сообщение об ошибке
    $(document).ajaxError(function() {
      $('.products').addClass('error').text('Произошла ошибка получения данных с сервера');
    });
  });
})(jQuery);












