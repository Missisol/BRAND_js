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
  gender: 'Заполните это поле',
  usercheck: 'Введен неверный логин или пароль'
};

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

// Записывает данные формы регистрации в базу данных и очищает форму
function sendValues() {
  var signUpFields = $('.signUpForm').serialize();
  $.ajax({
    url: 'http://localhost:3000/reg',
    type: 'POST',
    data: signUpFields,
    success: function() {
      $('.signUpForm__input').val('');
      $('#empty').attr('selected', 'selected');
      $('#submit').empty().text('Вы зарегистрированы');
    },
    error: function() {
      $('#submit').empty().text('Ошибка регистрации');
    }
  });
}

// Авторизует пользователя по логину и паролю
function sendCheckValues() {
  var userData = $('.myAccountSignIn').serializeArray();
  var username = userData[0].value;
  var userpass = userData[1].value;
  var cookie = userData[2];
  var mess = message.usercheck;
  $.ajax({
    url: 'http://localhost:3000/reg?user_login=' + username + '&password=' + userpass,
    dataType: 'json',
    success: function(result) {
      if (result.length !== 0) {
        var id = result[0].id;
        if (!cookie) {
          $('#submitSignIn').empty().text('Вы авторизованы');
          return;
         } else {
          $.ajax({
            url: 'http://localhost:3000/reg/' + id,
            type: 'PATCH',
            headers: {
              'content-type': 'application/json',
            },
            data: JSON.stringify({
              cookie: cookie.value,
            }),
            success: function() {
              $('#submitSignIn').empty().text('Вы авторизованы');
            },
            error: function() {
              console.log('error');
            }
          });
         }
      } else {
        $('.myAccountSignIn__input').addClass('invalid');
        var $hintWrap = $('<div />', {class:'invalid-feedback'}).text(message);
        $hintWrap.insertAfter('.myAccountSignIn__input').text(mess);
      }
    },
    error: function() {
      console.log('error');
    } 
  });
  $('.myAccountSignIn__input').val('');
  $('.remember').attr('checked', 'checked');
}

// Авторизует пользователя по эл.почте и паролю
function sendCheckValuesMail() {
  var userData = $('.inputRightForm').serializeArray();
  var usermail = userData[0].value;
  var userpass = userData[1].value;
  var mess = message.usercheck;
  $.ajax({
    url: 'http://localhost:3000/reg?password=' + userpass + '&email=' + usermail,
    dataType: 'json',
    success: function(result) {
      if (result.length !== 0) {
        $('.inputSubmitRight').empty().val('Вы авторизованы');
      } else {
        $('.inputRight__input').addClass('invalid');
        var $hintWrap = $('<div />', {class:'invalid-feedback'}).text(message);
        $hintWrap.insertAfter('.inputRight__input').text(mess);
      }
    },
    error: function() {
      console.log('error');
    }
  });
  $('.inputRight__input').val('');
}


(function($) {
  $(function() {
    // При открытии страницы скрываем форму регистрации
    $('.overlay').css('display', 'none');
    $('.signUpForm').css('display', 'none');

    // По клику на кнопку "continue" вызываем форму регистрации
    $('.inputSubmitLeft, #goToSignUp').on('click', function(e) {
      $('.overlay').css('display', 'block');
      $('.signUpForm').css('display', 'flex');
      $('.signUpForm__input').val('').removeClass('invalid').next('.invalid-feedback').remove();
      $('#gender').next('.invalid-feedback').remove();
      $('#empty').attr('selected', 'selected');
      $('#submit').empty().text('Sign up');
      e.preventDefault();
    });

    // По клику на подложку или крестик закрываем форму и убираем подложку
    $('.signUpForm__close, .overlay').on('click', function() {
      $('.overlay, .signUpForm').css('display', 'none');
    });

    // По клику на кнопку "My Account" вызываем форму регистрации
    $('.myAccount').on('click', function(e) {
      if ($('.myAccountSignIn').attr('class') !== 'active') {
        $('.myAccountSignIn').addClass('active');
      }
      $('.myAccountSignIn__input').val('').removeClass('invalid').next('.invalid-feedback').remove();
      $('.remember').attr('checked', 'checked');
      $('#submitSignIn').empty().text('Sign in');
      e.preventDefault();
    });

    // По клику на крестик или вне формы закрываем форму
    $('body').on('click', function(e) {
      var $formElems = $(e.target).parents('.myAccountSignIn');
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

    // Валидирует форму регистрации перед отправкой и передает данные для отправки через ajax
    $('.signUpForm').on('click', '.signUpForm__submit', function(e) {
      var mess;
      var $el = $('#gender');
      if ($el.val() === 'Choose') {
        mess = message.gender;
        setInvalidField(mess, $el);
      } else {
        $($el).removeClass('invalid');
        $($el).next('.invalid-feedback').remove();
      }
      $.each(rules, function(index, rule) {
        var $fields = $('[data-validation_rule=' + index + ']');
        $fields.each(function(key, field) {
         if(rule.test(field.value)) {
           $(field).removeClass('invalid');
           $(field).next('.invalid-feedback').remove();
          } else if (field.value !== '') {
            mess = message[index];
            setInvalidField(mess, field);
          } else {
            mess = message.empty;
            setInvalidField(mess, field);
          }
        });
      });
      e.preventDefault();
      if ($('.signUpForm').find('.invalid').length === 0 && $('#gender').val() !== '') {
        sendValues();
      } else console.log('error');
    });

    // Валидирует форму входа и передает данные для сравнения с базой черех ajax
    $('.myAccountSignIn').on('click', '.myAccountSignIn__submit', function(e) {
      var $input = $('.myAccountSignIn__input');
      var mess;
      $input.each(function(key, field) {
        if (field.value === '') {
          mess = message.empty;
          setInvalidField(mess, field);
        } else {
          $(field).removeClass('invalid');
          $(field).next('.invalid-feedback').remove();
        }
      });
      e.preventDefault();
      if ($('.myAccountSignIn').find('.invalid').length === 0) {
        sendCheckValues();
      } else console.log('error');
    });

    // По клику на кнопку "Log in"
    $('.inputRightForm').on('click', '.inputSubmitRight', function(e) {
      var $input = $('.inputRight__input');
      var mess;
      $input.each(function(key, field) {
        if (field.value === '') {
          mess = message.empty;
          setInvalidField(mess, field);
        } else {
          $(field).removeClass('invalid');
          $(field).next('.invalid-feedback').remove();
        }
      });
      e.preventDefault();
      if ($('.inputRightForm').find('.invalid').length === 0) {
        sendCheckValuesMail();
      } else console.log('error');
    });

  });
})(jQuery);
