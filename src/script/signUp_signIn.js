// Опции для установления cookie
options = {
  expires:'',
  path: '/',
  domain: ''
};

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
 * Устанавливаем cookie и записываем в базу данных
 * @param {string} name - Название cookie 
 * @param {string} value - Значение cookie 
 * @param {Object} options - Опции для установления cookie
 */
function setCookie(name, value, options) {
  options = options || {};
  var expires = options.expires;
  if (typeof expires == "number" && expires) {
    var d = new Date();
    d.setTime(d.getTime() + expires * 1000);
    expires = options.expires = d;
  }
  if (expires && expires.toUTCString) {
    options.expires = expires.toUTCString();
  }
  value = encodeURIComponent(value);
  var updatedCookie = name + "=" + value;
  for (var propName in options) {
    updatedCookie += "; " + propName;
    var propValue = options[propName];
    if (propValue !== true) {
      updatedCookie += "=" + propValue;
    }
  }
  document.cookie = updatedCookie;
  return updatedCookie;
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
 * Записывает данные формы регистрации в базу данных и очищает форму
 */
function sendValues() {
  var signUpFields = $('.formOut').serialize();
  $.ajax({
    url: 'http://localhost:3000/reg',
    type: 'POST',
    data: signUpFields,
    success: function() {
      $('.signUpForm__input').val('');
      $('#empty').attr('selected', 'selected');
      $('#submit').attr('disabled', 'disabled').removeClass('registerForm__submit').addClass('registerForm__disabled');
      $('#submit').empty().text('Вы зарегистрированы');
    },
    error: function() {
      $('#submit').empty().text('Ошибка регистрации');
    }
  });
}

/**
 * Авторизует пользователя по логину и паролю
 */
function sendCheckValues() {
  var userData = $('.myAccountOut').serializeArray();
  var username = userData[0].value;
  var userpass = userData[1].value;
  var cookie = userData[2];
  var mess = message.usercheck;
  var userCookie;

  // Если пользователь входит с логином администратора вызываем функцию проверки прав администратора
  if (username === 'admin') {
    checkAdmin(username, userpass);
  }
  // Если пользователь поставил галочку "запомнить", формируем cookie
  if(cookie) {
    userCookie = setCookie(username, userpass, options);
  }
  // Ищем пользователя по логину и паролю
  $.ajax({
    url: 'http://localhost:3000/reg?user_login=' + username + '&password=' + userpass,
    dataType: 'json',
    success: function(result) {
      // Если пользователь найден в базе
      if (result.length !== 0) {
        var id = result[0].id;
        // Если не поставлена галочка "запомнить" записываем в базу, что сессия открыта и сообщаем об авторизации
        if (!cookie) {
          $.ajax({
            url: 'http://localhost:3000/reg/' + id,
            type: 'PATCH',
            headers: {
              'content-type': 'application/json',
            },
            data: JSON.stringify({
              session: 'on',
            }),
            success: function() {
              $('#submitSignIn').attr('disabled', 'disabled').removeClass('registerForm__submit').addClass('registerForm__disabled');
              $('#submitSignIn').empty().text('Вы авторизованы');
              $('.myAccount').attr({id: 'userid' + id});
              $('#goToSignUp').css('display', 'none');
              $('#goToYourCart').css('display', 'block');
            },
            error: function() {
              console.log('error');
            }
          });
         } else {
           // Если поставлена галочка "запомнить", записываем cookie и записываем, что сессия открыта
            $.ajax({
              url: 'http://localhost:3000/reg/' + id,
              type: 'PATCH',
              headers: {
                'content-type': 'application/json',
              },
              data: JSON.stringify({
                cookie: userCookie,
                session: 'on',
              }),
              success: function() {
                $('#submitSignIn').attr('disabled', 'disabled').removeClass('registerForm__submit').addClass('registerForm__disabled');
                $('#submitSignIn').empty().text('Вы авторизованы');
                $('.myAccount').attr({id: 'userid' + id});
                $('#goToSignUp').css('display', 'none');
                $('#goToYourCart').css('display', 'flex');
              },
              error: function() {
                console.log('error');
              }
            });
         }
      } else {
        // Если пользователь в базе не найден, выводим сообщение об ошибке
        $('.myAccountOut__input').addClass('invalid');
        var $hintWrap = $('<div />', {class:'invalid-feedback'}).text(message);
        $hintWrap.insertAfter('.myAccountOut__input').text(mess);
      }
    },
    error: function() {
      console.log('error');
    } 
  });
  // Приводим поля формы авторизации в первоначальное состояние
  $('.myAccountOut__input').val('');
  $('.remember').attr('checked', 'checked');
}

/**
 * Проверяет права администратора
 * @param {string} username - логин администратора
 * @param {string} userpass - пароль администратора
 */
function checkAdmin(username, userpass) {
  var mess = message.usercheck;

  $.ajax({
    url: 'http://localhost:3000/reg?user_login=' + username + '&password=' + userpass,
    dataType: 'json',
    success: function(result) {
      // Если пользователь найден в базе
      if (result.length !== 0) {
        var id = result[0].id;
        // Если не поставлена галочка "запомнить" записываем в базу, что сессия открыта и сообщаем об авторизации
          $.ajax({
            url: 'http://localhost:3000/reg/' + id,
            type: 'PATCH',
            headers: {
              'content-type': 'application/json',
            },
            data: JSON.stringify({
              session: 'on',
            }),
            success: function() {
              $('#submitSignIn').attr('disabled', 'disabled').removeClass('registerForm__submit').addClass('registerForm__disabled');
              $('#submitSignIn').empty().text('Вы авторизованы');
              $('.myAccount').attr({id: 'userid' + id});
              $('#goToYourCart').remove();
              // $('#goToSignUp').removeAttr('id').attr({id: 'goToUserCart'}).empty().text('Go to your cart');
              var $button = $('<a />', {
                id: 'goToAdminPanel',
                class: 'myAccountSignIn__signUp registerForm__submit',
                href: 'admin.html',
              }).text('go to admin panel');
              $('.myAccountOut').append($button);
            },
            error: function() {
              console.log('error');
            }
          });
      } else {
        // Если пользователь в базе не найден, выводим сообщение об ошибке
        $('.myAccountOut__input').addClass('invalid');
        var $hintWrap = $('<div />', {class:'invalid-feedback'});
        $hintWrap.insertAfter('.myAccountOut__input');
      }
    },
    error: function() {
      console.log('error');
    } 
  });
  // Приводим поля формы авторизации в первоначальное состояние
  $('.myAccountOut__input').val('');
  $('.remember').attr('checked', 'checked');
}

/**
 *  Авторизует пользователя по эл.почте и паролю
 */
function sendCheckValuesMail() {
  var userData = $('.inputRightForm').serializeArray();
  var usermail = userData[0].value;
  var userpass = userData[1].value;
  var mess = message.usercheck;
  $.ajax({
    url: 'http://localhost:3000/reg?password=' + userpass + '&email=' + usermail,
    dataType: 'json',
    success: function(result) {
      var id = result[0].id;
      if (result.length !== 0) {
        // Если пользователь найден, записываем, что сессия открыта
        $.ajax({
          url: 'http://localhost:3000/reg/' + id,
          type: 'PATCH',
          headers: {
            'content-type': 'application/json',
          },
          data: JSON.stringify({
            session: 'on',
          }),
          success: function() {
            $('.inputSubmitRight').empty().val('Вы авторизованы');
          },
          error: function() {
            console.log('error');
          }
        });
      } else {
        // Если пользователь не найден, выводим сообщение об ошибке
        $('.inputRight__input').addClass('invalid');
        var $hintWrap = $('<div />', {class:'invalid-feedback'}).text(message);
        $hintWrap.insertAfter('.inputRight__input').text(mess);
      }
    },
    error: function() {
      console.log('error');
    }
  });
  // Очищаем поля формы
  $('.inputRight__input').val('');
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
          $('.editForm__input').val('');
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

(function($) {
  $(function() {
    // При открытии страницы скрываем форму регистрации
    $('.overlay').css('display', 'none');
    $('.editForm').css('display', 'none');
    $('.formOut').css('display', 'none');
    $('.myAccountOut').removeClass('active');
    $('.myAccountIn').removeClass('active');

    // По клику на кнопку "continue" на странице checkout или на кнопку "sign up" вызываем форму регистрации
    $('.inputSubmitLeft, #goToSignUp').on('click', function(e) {
      $('.myAccountOut').removeClass('active');
      $('.myAccountIn').removeClass('active');
  
      $('.overlay').css('display', 'block');
      $('.formOut').css('display', 'flex');
      $('.signUpForm__input').val('').removeClass('invalid').next('.invalid-feedback').remove();
      $('#gender').removeClass('invalid').next('.invalid-feedback').remove();
      $('#empty').attr('selected', 'selected');
      $('#submit').empty().text('Sign up');
      e.preventDefault();
    });

    // По клику на подложку или крестик закрываем форму и убираем подложку
    $('.signUpForm__close, .overlay').on('click', function() {
      $('.overlay, .signUpForm').css('display', 'none');
    });

    // По клику на кнопку "My Account" вызываем форму входа.выхода в/из личного кабинета
    $('.myAccount').on('click', function(e) {
      if ($('.myAccount').attr('id')) {
        $('.myAccountIn').addClass('active');
        $('.myAccountOut').removeClass('active');
        $('#goToYourCart').css('display', 'none');

      } else {
        $('.myAccountIn').removeClass('active');
        $('.myAccountOut').addClass('active');
        $('.myAccountOut__input').val('').removeClass('invalid').next('.invalid-feedback').remove();
        $('.remember').attr('checked', 'checked');
        $('#submitSignIn').empty().text('Sign in');
        $('#goToYourCart').css('display', 'none');
      }
      e.preventDefault();
    });

    // По клику на крестик или вне формы закрываем форму входа в личный кабинет
    $('body').on('click', function(e) {
      var $formElems = $(e.target).parents('.registerForm');
      var $button = $(e.target).parents('.myAccount');
      var close = $(e.target).hasClass('registerForm__close');

      if ($formElems.length === 0 && $button.length === 0) {
        if ($('.registerForm.active')) {
          $('.registerForm').removeClass('active');
        } 
      } else if (close === true) {
        if ($('.registerForm.active')) {
          $('.registerForm').removeClass('active');
        }
      }
    });

    // Валидируем форму регистрации перед отправкой и передаем данные для отправки через ajax
    $('.formOut').on('click', '.signUpForm__submit', function(e) {
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
      if ($('.formOut').find('.invalid').length === 0 && $('#gender').val() !== '') {
        sendValues();
      } else console.log('error');
    });

    // Валидируем форму авторизации и передаем данные для сравнения с базой черех ajax
    $('.myAccountOut').on('click', '.myAccountOut__submit', function(e) {
      var $input = $('.myAccountOut__input');
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
      if ($('.myAccountOut').find('.invalid').length === 0) {
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
          $('#logout').attr('disabled', 'disabled').removeClass('registerForm__submit').addClass('registerForm__disabled');
          $('#logout').empty().text('Вы вышли из личного кабинета');
          $('#editData, #goToYourCartIn, #writeReview, #backToShopping').attr('disabled', 'disabled').removeClass('registerForm__submit').text('').addClass('editData__logout');
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
        $('.myAccountOut').removeClass('active');
        $('.myAccountIn').removeClass('active');
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

    

  });
})(jQuery);
