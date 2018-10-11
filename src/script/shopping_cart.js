/**
 *  Отображает товары в личном кабинете пользователя
 */
function renderShoppingCartProducts(url) {
  $('.shoppingCartProductWrap').empty();
  $('.subtotalAll').text('$' + 0);
  $('.grandtotal').text('$' + 0);

  $.ajax({
    // url: 'http://localhost:3000/userBasket',
    url: url,
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
          var $aAction =  $('<a />', {
            href: '#', 
            class: 'shoppingAction action',
            id: goods.id,
          });
          var $i = $('<i />', {class: 'fas fa-times-circle'});
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
          var url = 'http://localhost:3000/reg/' + id + '/userBasket';
          makeCounter(url);
          renderShoppingCartProducts(url);
        }
      });
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
 * Добавляет отзыв, введенный пользователем в базу данных.
 * @param {string} text - Текст, введенный пользователем.
 * @param {int} id - id авторизованного пользователя
 */
function addReview(text, id) {
  if ($('#message')) {
    $('#message').remove();
  }
  var $message = $('<div />', {id: 'message'});
  $('.buttonReviewWrap').append($message);
  $.ajax({
    url: 'http://localhost:3000/add',
    type: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    data: JSON.stringify({
      text: text,
      status: 'add',
      userId: id,
    }),
    success: function() {
      console.log('ok');
      $('#textReview').val('');
      $('#message').text('Your review has been moderated.');
      $('#message').fadeOut(4000);
          },
    error: function() {
      $('#message').text('Communication error');
      $('#message').fadeOut(4000);
    }
  });
}

  /**
 * Ввыводит список одобренных отзывов.
 */
function makeAppruveList() {
  $('#message').remove();
  $('.listWrap').remove();
  $.ajax({
    url: 'http://localhost:3000/appruve',
    dataType: 'json',
    success: function (add) {
      var $ul = $('<ul />');
      add.forEach(function (review) {
          var $li = $('<li />', {class: 'oneReview'});
          var $id = $('<div />', {class: 'idReview', text: "#" + review.id});
          var $p = $('<p />', {class: 'textReview', text: review.text});
          $li.append($id).append($p);
          $ul.append($li);
      });
      var $listWrap = $('<div />').addClass('listWrap');
      $listWrap.insertBefore('.shoppingCartHeader');
      $('.listWrap').append($ul);
    },
    error: function() {
      var $message = $('<div />', {id: 'message'});
      $('.buttonReviewWrap').append($message);
      $('#message').text('Communication error');
      $('#message').fadeOut(4000);
    }
  });
}

(function($) {
  $(function() {
    // При открытии страницы скрываем форму изменения данных
    $('.overlay').css('display', 'none');
    $('.editForm').css('display', 'none');
    $('#review').css('display', 'none');
    $('.buttonReviewWrap').css('display', 'none');
    
    // При открытии страницы устанавливаем на кнопке "MyAccount" id пользователя, 
    // у которого открыта сессия создаем счетчик товаров в корзине, 
    // рендерим товары в корзине в личном кабинете пользователя
    setSession();
    
    // Создаем карусель товаров в шапке.
    $('.carousel').slick({
      dots: true,
      infinite: true,
      speed: 300,
      slidesToShow: 1,
      adaptiveHeight: true
    });

    // При изменении количества товара в поле "quantity" изменяем счетчик общей суммы товара
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

    // Удаляем товары из личного кабинета по клику на крестик
    $('.shoppingCartProductWrap').on('click', function(e) {
      var $action = $(event.target).parent('.action');
      if ($action !== 0) {
        var q = 1;
        increaseBase($action.attr('id'), q);
      }
    });
    
     // При клике на кнопку "write a review" вызываем форму для отзыва
     $('#writeReview').on('click', function() {
      $('#review').css('display', 'flex');
      $('.buttonReviewWrap').css('display', 'flex');
      $('.myAccountSignIn').removeClass('active');
     });

     // При клике на кнопку отправки отзыва вызываем функцию сохранения отзыва в базе
     $('#submitReview').on('click', function(){
      var textReview = $('#textReview').val();
      var userId = $('.myAccount').attr('id').slice(6);
      console.log(textReview);
      if (textReview !== '') {
        addReview(textReview, userId);
      }
      event.preventDefault();
    });

    // По клику на крестик закрываем модуль отправки отзывов
    $('.review__close').on('click', function() {
      $('#review').css('display', 'none');
      $('.buttonReviewWrap').css('display', 'none');
      $('.listWrap').remove();
    });

    // По клику на кнопку "Показать все отзывы" вызываем функцию формирования списка одобренных отзывов.
    $('#allReview').on('click', function() {
      makeAppruveList();
    });
    
  });
})(jQuery);
