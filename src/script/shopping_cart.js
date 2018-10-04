// Правила проверки данных в полях формы регистрации
var rules = {
  name: /[a-zа-я]+/i,
  password: /[\wа-я]{6}/,
  creditCard: /^\d{7}-\d{4}-\d{6}-\d{3}$/,
  email: /^[a-z0-9]+[.-]?[a-z0-9]+@[a-z]+\.[a-z]+/i,
};

// Подсказки для пользователя при неуспешной валидации полей формы регистрации
var message = {
  empty: 'Поле не должно быть пустым',
  name: 'Поле должно содержать только буквы',
  password: 'Длина пароля должна быть не меньше 6 символов',
  creditCard: 'Введите номер карты в формате 1234567-1234-123456-123',
  email: 'Введите e-mail в формате mymail@mail.ru или my.mail@mail.ru или my_mail@mail.ru',
};

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
 * В случае неуспешной валидации полей формы регистрации устанавливает класс 'invalid'
 * и создает элемент с подсказкой для правильного заполнения полей
 * @param {string} message - подсказка для пользователя
 * @param {HTMLElement} inputEl - Поле, по которому валидация неуспешна 
 */
function setInvalidField(message, inputEl) {
  $(inputEl).addClass('invalid');
  var $hintWrap = $(inputEl).next('.invalid-feedback');
  if ($hintWrap.length === 0) {
    $hintWrap = $('<div />', {class:'invalid-feedback'}).text(message);
    $hintWrap.insertAfter(inputEl);
  } else {
    $hintWrap.text(message);
  }
}

/**
 * Записывает измененные пользователем данные в базу данных и очищает форму
 */
function sendEditValues() {
  var editFields = $('.editForm').serializeArray();
  var userid = $('.myAccount').attr('id').slice(6);
  $.ajax({
    url: 'http://localhost:3000/reg/' + userid,
    dataType: 'json',
    success: function(result) {
      for (var i = 0; i < editFields.length; i++) {
        if (editFields[i].value === '') {
          for (var index in result) {
            if (editFields[i].name === index) {
              editFields[i].value = result[index];
            }
          }
        }
      }
      $.ajax({
        url: 'http://localhost:3000/reg/' + userid,
        type: 'PATCH',
        data: editFields,
        success: function() {
          $('.editUpForm__input').val('');
          $('#submitEdit').attr('disabled', 'disabled').removeClass('registerForm__submit').addClass('registerForm__disabled');
          $('#submitEdit').empty().text('Данные успешно изменены');
        },
        error: function() {
          $('#submitEdit').empty().text('Ошибка записи данных');
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

    // По клику на кнопку "My Account" вызываем меню личного кабинета
    $('.myAccount').on('click', function(e) {
      if ($('.myAccountSignIn').attr('class') !== 'active') {
        $('.myAccountSignIn').addClass('active');
      }
      e.preventDefault();
    });

    // По клику на крестик или вне формы закрываем форму входа в личный кабинет
    $('body').on('click', function(e) {
      var $formElems = $(e.target).parent('.myAccountSignIn');
      var $button = $(e.target).parents('.myAccount');
      var close = $(e.target).hasClass('myAccountSignIn__close');

      if ($formElems.length === 0 && $button.length === 0) {
        if ($('.myAccountSignIn.active')) {
          $('.myAccountSignIn').removeClass('active');
        } 
      } else if (close === true) {
        if ($('.myAccountSignIn.active')) {
          $('.myAccountSignIn').removeClass('active');
        }
      }
    });

    // По клику на кнопку "Log out" удаляем на кнопке "MyAccount" id пользователя и удаляем товары в личном кабинете
    $('#logout').on('click', function(e) {
      var userid = $('.myAccount').attr('id').slice(6);
      $.ajax({
        url: 'http://localhost:3000/reg/' + userid,
        type: 'PATCH',
        headers: {
          'content-type': 'application/json',
        },
        data: JSON.stringify({
          session: 'off',
        }),
        success: function() {
          $('.myAccount').removeAttr('id');
          $('.shoppingCartProductWrap').empty();
          $('#logout').attr('disabled', 'disabled').removeClass('registerForm__submit').addClass('registerForm__disabled');
          $('#logout').empty().text('Вы вышли из личного кабинета');
          $('#editData, #writeReview, #backToShopping').attr('disabled', 'disabled').removeClass('registerForm__submit').text('').addClass('editData__logout');
        },
        error: function() {
          console.log('error');
        }
      });
      e.preventDefault();
    });

    // При клике на кнопку "edit data" вызываем форму изменения данных
    $('#editData').on('click', function(e) {
      $('.overlay').css('display', 'block');
      $('.editForm').css('display', 'flex');
      $('.editForm__input').val('').removeClass('invalid').next('.invalid-feedback').remove();
      $('#submitEdit').attr('disabled', 'disabled').removeClass('registerForm__submit').addClass('registerForm__disabled');
      $('#submitEdit').empty().text('Save edit');
      e.preventDefault();
    });

    // По клику на подложку или крестик закрываем форму изменения данных и убираем подложку
    $('.editForm__close, .overlay').on('click', function() {
      $('.overlay, .editForm').css('display', 'none');
    });

    // Если пользователь начал заполнять одно из полей формы, делаем кнопку отправки активной
    var symbols = 0;
    $('.editForm__input').on({'keydown': function(e){
        $('#submitEdit').removeAttr('disabled').removeClass('registerForm__disabled').addClass('registerForm__submit');
        if (e.which !== 8) {
          symbols++;
        } else if (e.which ===8 && symbols > 0) {
          symbols--;
        } else symbols = 0;

        if (symbols === 0) {
          $('#submitEdit').attr('disabled', 'disabled').removeClass('registerForm__submit').addClass('registerForm__disabled');
        } else  {
          $('#submitEdit').removeAttr('disabled').removeClass('registerForm__disabled').addClass('registerForm__submit');
        } 
      },
    });

    //Валидируем форму регистрации перед отправкой и передаем данные для отправки через ajax
    $('.editForm').on('click', '#submitEdit', function(e) {
      var mess;
      $.each(rules, function(index, rule) {
        var $fields = $('[data-validation_rule=' + index + ']');
        $fields.each(function(key, field) {
          if(rule.test(field.value)) {
            $(field).removeClass('invalid');
            $(field).next('.invalid-feedback').remove();
          } else if (field.value !== '') {
            mess = message[index];
            setInvalidField(mess, field);
          } 
        });
      });
      e.preventDefault();
      if ($('.editForm').find('.invalid').length === 0) {
        sendEditValues();
      } else console.log('error');
    });
    
    // Удаляем товары из личного кабинета по клику на крестик
    $('.shoppingCartProductWrap').on('click', function(e) {
      var $action = $(event.target).parent('.action');
      if ($action !== 0) {
        var q = 1;
        increaseBase($action.attr('id'), q);
      }
    });
    
    // При нажатии на кнопку "continue shopping" переходим на страницу "products"
    $('#backToShopping').on('click', function() {
      $(location).attr('href', 'http://127.0.0.1:8080/products.html');
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
