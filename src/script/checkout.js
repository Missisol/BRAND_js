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

// Записывает данные формы регистрации в базу данных
function sendValues() {
  var signUpFields = $('.signUpForm').serialize();
  $.ajax({
    url: 'http://localhost:3000/reg',
    type: 'POST',
    data: signUpFields,
    success: function() {
      $('.signUpForm__input').val('');
      $('#empty').attr('selected', 'selected');
      if (!$('.remember').is(':checked')) {
        $('.remember').prop('checked', true);
      }
    },
    error: function() {
      $('#submit').empty().text('Ошибка регистрации');
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

    $('.overlay').css('display', 'none');
    $('.signUpForm').css('display', 'none');


    // По клику на кнопку "continue" вызываем форму регистрации
    $('.inputSubmitLeft').on('click', function(e) {
      $('.overlay').css('display', 'block');
      $('.signUpForm').css('display', 'flex');
      $('.remember').attr('checked', 'checked');
      e.preventDefault();
    });

    // По клику на подложку или крестик закрываем форму и убираем подложку
    $('.signUpForm__close, .overlay').on('click', function() {
      $('.overlay, .signUpForm').css('display', 'none');
    });

    // Валидирует форму регистрации перед отправкой и передает данные для отправки через ajax
    $('.signUpForm').on('click', '.signUpForm__submit', function(e) {
      var mess;
      var $el = $('#gender');
      if ($el.val() === '') {
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

  });
})(jQuery);
