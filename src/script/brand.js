/**
 * Добавляет единицу товара в корзину
 * @param {Object} product - Объект купленного товара 
 */
function addToBasket(product) {
  // Определяем id купленного товара
  var id = product.id;
  // Ищем товар в корзине
  $.ajax({
    url: 'http://localhost:3000/basket?id=' + id,
    dataType: 'json',
    success: function(data) {
      if (data.length !== 0) {
        // Если товар есть, увеличиваем его количество
        $.ajax({
          url: 'http://localhost:3000/basket/' + id,
          type: 'PATCH',
          headers: {
            'content-type': 'application/json',
          },
          data: JSON.stringify({
            quantity: data[0].quantity + 1,
          }),
          success: function(product) {
            // Вызываем функцию счетчика товаров в корзине
            renderBasketProduct();
          },
          error: function() {
            // getMessage ('Произошла ошибка');
          }
        });
      } else {
        // Если товара нет, добавляем товар в корзину
        $.ajax({
          url: 'http://localhost:3000/basket',
          type: 'POST',
          headers: {
            'content-type': 'application/json',
          },
          data: JSON.stringify({
            id: id,
            name: product.name,
            price: product.price,
            min_url: product.min_url,
            quantity: 1,
          }),
          success: function() {
            // Вызываем функцию счетчика товаров в корзине
            renderBasketProduct();
          },
          error: function() {
            // getMessage ('Произошла ошибка');
          }
        });
      } 
    },
    error: function() {
      // getMessage ('Произошла ошибка');
    }
  });
}

/**
 * Удаляет единицу товара из корзины
 * @param {Object} product - Объект удаляемого товара 
 */
function removeFromBasket(product) {
   // Определяем id купленного товара
   var id = product.id;
   var quantity = product.quantity;
   // Ищем товар в корзине
   $.ajax({
     url: 'http://localhost:3000/basket/' + id,
     dataType: 'json',
    success: function(data) {
      if (data.quantity === 1) {
        $.ajax({
          url: 'http://localhost:3000/basket/' + id,
          type: 'DELETE',
          success: function() {
            renderBasketProduct();
          },
          error: function() {
            // getMessage ('Произошла ошибка');
          }
        });
      } else {
        $.ajax({
          url: 'http://localhost:3000/basket/' + id,
          type: 'PATCH',
          headers: {
            'content-type': 'application/json',
          },
          data: JSON.stringify({
            quantity: data.quantity - 1,
          }),
          success: function() {
            renderBasketProduct();
          },
          error: function() {
            // getMessage ('Произошла ошибка');
          }
        });
      }
    }
  });
}


/**
 * Считает количество товаров в корзине и создает счетчик
 */
function makeCounter() {
  $.ajax({
    url: 'http://localhost:3000/basket',
    dataType: 'json',
    success: function(data) {
      var quantityAll = 0;
      data.forEach(function(item) {
        quantityAll = quantityAll + item.quantity; 
        });
      if (quantityAll !== 0) {
      $('#quantityProduct').addClass('active').text(quantityAll);
      }
    },
  });
}

/**
 * Уменьшает количество купленного товара на складе
 * @param {Object} $product - Oбъект купленного товара
 */
function decreaseBase($product) {
  // Определяем id купленного товара
  var id = +$($product).attr('id');
  // Находим товар на складе
  $.ajax({
    url: 'http://localhost:3000/products/' + id,
    dataType: 'json',
    success: function(data) {
      // Если количество товара не равно 0, уменьшаем его количество
      if (data.quantity !== 0) {
        $.ajax({
          url: 'http://localhost:3000/products/' + id,
          type: "PATCH",
          headers: {
            'content-type': 'application/json',
          },
          data: JSON.stringify({
            quantity: data.quantity - 1,
          }),
        });
        // Вызываем функцию добавления товара в корзину
        addToBasket(data);
      } else {
        // Сообщаем пользователю, что товар закончился
        var a = $('#' + id + '.oneProductWrap .textAddToCart').text('The goods ended');
      }
    },
  });
}

/**
 * Увеличивает количество товара на складе при отказе покупателя от покупки
 * @param {string} id - id товара
 */
function increaseBase(id) {
  // Находим товар на складе
  $.ajax({
    url: 'http://localhost:3000/products/' + id,
    dataType: 'json',
    success: function(data) {
      $.ajax({
        url: 'http://localhost:3000/products/' + id,
        type: 'PATCH',
        headers: {
          'content-type': 'application/json',
        },
        data: JSON.stringify({
          quantity: data.quantity + 1,
        }),
      });
      // Вызываем функцию удаления товара из корзины
      removeFromBasket(data);
    }
  });
}

/**
 * Создает выпадающую корзину
 */
function renderBasketProduct() {
  $('.userBasketdropDown__userBasketProductsWrap').empty();
  $.ajax({
    url: 'http://localhost:3000/basket',
    dataType: 'json',
    success: function(result) {
      if (result.length !== 0) {
        var totalSum = 0;
        var quantityAll = 0;
        result.forEach(function(goods) {
          // Считаем общую сумму продуктов.
          totalSum += +goods.price * +goods.quantity;
          quantityAll = quantityAll + goods.quantity; 
          // Создаем div - обертку для карточки товара.
          var $oneProduct = $('<div />').addClass('userBasketOneProduct');
          // Создаем ссылку с вложенной картинкой товара.
          var $aImg = $('<a />', {href: '#'}).addClass('userBasketOneProductImg');
          var $img = $('<img>', {
                      src: goods.min_url,
                      alt: goods.name,
                    });
          $aImg.append($img);
          //Создаем ссылку для названия товара.
          var $aNameProduct = $('<a />', {href: '#'}).addClass('userBasketOneProductText__nameProduct').text(goods.name);
          // Создаем div для звездочек.
          var $stars = $('<div />').addClass('stars');
          var $aStars = $('<a />', {href: '#'});
          for (var i =0; i < 5; i++) {
            var $iStar = $('<i />').addClass('fas fa-star');
            $aStars.append($iStar);
          }
          $stars.append($aStars);
          // Создаем тег p для вывода количества товара и цены товара.
          var $p = $('<p />').html(goods.quantity + '<span> x </span>' + '$' + goods.price);
          //Создаем обертку для текста.
          var $userBasketOneProductText = $('<div />').addClass('userBasketOneProductText');
          // Создаем кнопку для удаления товара.
          var $abutton = $('<a />', {
                            href: '#',
                            class: 'shoppingAction',
                            id: goods.id,
                          });
          var $iFont = $('<i />').addClass('fas fa-times-circle');
          $abutton.append($iFont);
          // Создаем структуру карточки.
          $userBasketOneProductText.append($aNameProduct).append($stars).append($p);
          $oneProduct.append($aImg).append($userBasketOneProductText).append($abutton);
          $('.userBasketdropDown__userBasketProductsWrap').append($oneProduct);
        });
        $('#userBasketSum').text('$' + totalSum);
        $('#quantityProduct').addClass('active').text(quantityAll);
        // makeCounter();
      } else {
        $('.userBasketdropDown__userBasketProductsWrap').text('Your cart is empty');
        $('#userBasketSum').text('$' + 0);
        $('#quantityProduct').addClass('active').text(0);
      }
    },
  });
}

(function($) {
  $(function() {
    // При клике на кнопку купить на товаре проверяем, что нажата кнопка "добавить в корзину"
    $('.products').on('click', function(event) {
      var $product = $(event.target).parents('.addToCartWrap').parents('.oneProductWrap');
      if ($product.length !== 0) {
        // Вызываем функцию уменьшения количества продуктов на складе
        decreaseBase($product);
      }
    });

     // При клике на картинку корзины рисуем корзину и ставим ей класс active
    $('.userBasket > a').on('click', function(event) {
      renderBasketProduct();

      if ($('.userBasket').attr('class') !== 'active') {
        $('.userBasket').addClass('active');
      }
    });

    // Закрываем выпадающую корзину, если клик не на корзину и не на кнопку купить товар на товаре.
    $('body').on('click', function() {
      var $basket = $(event.target).parents('.userBasket');
      var $button = $(event.target).parents('.addToCartWrap');
      if ($basket.length === 0 && $button.length === 0) {
        if ($('.userBasket.active')) {
          $('.userBasket').removeClass('active');
        }
      }
    });

    // Удаляем товар при клике на кнопку удаления товара в выпадающей корзине.
    $('.userBasketdropDown__userBasketProductsWrap').on('click', function() {
      var $shoppingAction = $(event.target).parent('.shoppingAction');
      if ($shoppingAction !== 0) {
        increaseBase($shoppingAction.attr('id'));
      }
    });
    
    // В случае неудачного завершения запроса к серверу выводим сообщение об ошибке
    $(document).ajaxError(function() {
      $('.products').addClass('error').text('Произошла ошибка получения данных с сервера');
    });

  });
})(jQuery);












