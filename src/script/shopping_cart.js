// Отображает товары в личном кабинете пользователя
function renderShoppingCartProducts() {
  $('.shoppingCartProductWrap').empty();
  $.ajax({
    url: 'http://localhost:3000/basket',
    dataType: 'json',
    success: function(result) {
      if (result.length !== 0) {
        var totalSum = 0;
        result.forEach(function(goods) {
          var sum = goods.price * goods.quantity;
          // Считаем общую сумму продуктов
          totalSum += +sum;
          // Создаем структуру карточки товара
          var $oneProduct = $('<div />').addClass('shoppingCartProduct');
          var $divLeft = $('<div />').addClass('shoppingCartProductLeft');
          var $divRight = $('<div />').addClass('shoppingCartProductRight');
          // Создаем ссылку с изображением товара
          var $aImg = $('<a />', {href: '#'}).addClass('shoppingCartProductLeft_img');
          var $img = $('<img>', {
                      src: goods.md_url,
                      alt: goods.name,
                    });
          $aImg.append($img);
          // Создаем структуру описания товара
          var $descriptionWrap = $('<div />').addClass('shoppingCartProductLeft__description');
          var $a =  $('<a />', {href: '#'});
          var $h5 = $('<h5 />').text(goods.name);
          $a.append($h5);
          var $pColor = $('<p />').text('Color:');
          var $spanColor = $('<span />').text('Red');
          $pColor.append($spanColor);
          var $pSize = $('<p />').text('Size:');
          var $spanSize = $('<span />').text('Xll');
          $pSize.append($spanSize);
          $descriptionWrap.append($a).append($pColor).append($pSize);
          $divLeft.append($aImg).append($descriptionWrap);
          // Создаем таблицу данных о товаре
          var $pPrice = $('<p />', {
            class: 'unitePrice', 
            id: 'unitePrice' + goods.id})
            .text('$' + goods.price);
          var $inputNum = $('<input />', {
                            type: 'number',
                            class: 'quantity',
                            min: 0,
                            value: goods.quantity,
                            id: goods.id,
                          });
          var $pShipping = $('<p />', {class: 'shipping'}).text('FREE');
          var $pSubtotal = $('<p />', {
            class: 'subtotal', 
            id: 'subtotal' + goods.id})
            .text('$' + sum);
          var $aAction =  $('<a />', {href: '#', class: 'shoppingAction'});
          var $i = $('<i />', {
            class: 'fas fa-times-circle', 
            id: 'fas' + goods.id});
          $aAction.append($i);
          $divRight.append($pPrice).append($inputNum).append($pShipping).append($pSubtotal).append($aAction);
          // Соединяем части карточки
          $oneProduct.append($divLeft).append($divRight);
          $('.shoppingCartProductWrap').append($oneProduct);
        });
        $('.subtotalAll').text('$' + totalSum);
        $('.grandtotal').empty().text('$' + totalSum);
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

    // Создаем счетчик товаров в корзине
    makeCounter();
    renderShoppingCartProducts();

    // При изменении количества товара в инпутах изменяем количество товара в корзине
    $('.shoppingCartProductWrap').on('change', '.quantity', function(e) {
      var id = $(e.target).attr('id');
      var newQuantity = $(e.target).val();
      var price = +$('#unitePrice' + id).text().slice(1);
      var newSum = price * newQuantity;
      $('#subtotal' + id).text('$' + newSum);
      var totalSum = 0;
      var $subtotals = $('.subtotal');
      $subtotals.each(function(key, item) {
        totalSum += +$(item).text().slice(1);
      });
      $('.subtotalAll').text('$' + totalSum);
      $('.grandtotal').text('$' + totalSum);
    });

    //1. При клике на крестик надо удалять товар: убрать товар на склад.
    // 2. Сделать недоступной открытие выпадающей корзины на стр. shopping_cart
    //   $.ajax({
    //     url: 'http://localhost:3000/basket/' + id,
    //     dataType: 'json',
    //     success: function(data) {
    //       var oldQuantity = data.quantity;
    //       var delta = newQuantity - oldQuantity;
    //       if (delta > 0) {
    //         decreaseBase(data, delta);
    //       } else increaseBase(id, delta);
    //     },
    //     error: function() {
    //       console.log('error');
    //     }
    //   });
    //   renderShoppingCartProducts();

    //   e.preventDefault();
    // });

  });
})(jQuery);
