/**
 * Выводит карточки товаров на странице.
 */
function renderProducts() {
  $.ajax({
    url: 'http://localhost:3000/products?_start=17&_limit=4',
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

/**
 * Проставляет на кнопке "MyAccount" id пользователя, у которого открыта сессия, при открытии страницы его личного кабинета
 */
function setSession() {
  $.ajax({
    url: 'http://localhost:3000/reg',
    dataType: 'json',
    success: function(result) {
      $.each(result, function(key, arr) {
        if (arr.session === 'on') {
          var id = arr.id;
          $('.myAccount').attr({id: 'userid' + id});
        }
      });
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
    
    // Выводим карточки товаров на странице
    renderProducts();

    // При открытии страницы вызываем функцию проверки и установления сессии пользователя
    setSession();

    // В случае неудачного завершения запроса к серверу выводим сообщение об ошибке
    $(document).ajaxError(function() {
      $('.products').addClass('error').text('Произошла ошибка получения данных с сервера');
    });

    // По клику на поле выбора цветов создаем список цветов для выбора
    $('.chooseColor').on('click', function() {
      $('.chooseCategory__color').empty().addClass('active');
      $.get({
        url: 'http://localhost:3000/var_color',
        dataType: 'json',
        success: function(variants) {
          variants.forEach(function(variant) {
            var $li = $('<li />', {id: 'color' + variant.id}).text(variant.color);
            $('.chooseCategory__color').append($li);
          });
        }
      });
    });

    $('.chooseCategory__color').on('click', 'li', function() {
      var text = $(event.target).text();
      var id = $(event.target).attr('id');
      $('.chooseColor').empty().text(text).attr('id', id);
      $('.chooseCategory__color').empty().removeClass('active');
      $('#detChooseColor').removeAttr('open');

      var colorId = id.slice(5);
      $.ajax({
        url: 'http://localhost:3000/var_color/' + colorId + '?_embed=var_size',
       dataType: 'json',
       success: function(products) {
         console.log(products.var_size);
       },
       error: function() {
         console.log('error');
       }
      });
    });

  });
})(jQuery);
