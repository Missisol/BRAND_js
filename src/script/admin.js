/**
 * Формирует и выводит список отзывов для модерации.
 */
function makeModerationList() {
  $('.listWrap').empty();

  $.ajax({
    url: 'http://localhost:3000/add',
    dataType: 'json',
    success: function (add) {
      var $ul = $('<ul />');
      add.forEach(function (review) {
        var $li = $('<li />', {class: 'oneReview'});
        if (review.status === 'appruve') {
          $li.addClass('appruveLi');
        } else if (review.status === 'delete') {
          $li.addClass('deleteLi');
        }

        var $id = $('<div />', {class: 'idReview', text: "#" + review.id});
        var $p = $('<p />', {class: 'textReview', text: review.text});
        
        var $buttonWrap;
        if (review.status === 'add') {
          $buttonWrap = $('<div />', {class: 'buttonWrap'});
        var $buttonAppruve = $('<button />', {
          'data-id': review.id, 
          class: 'appruve', 
          text: 'Одобрить отзыв'});
        var $buttonDelete = $('<button />', {
          'data-id': review.id, 
          class: 'delete', 
          text: 'Удалить отзыв'});
          $buttonWrap.append($buttonAppruve).append($buttonDelete);
        }
        
        $li.append($id).append($p).append($buttonWrap);
        $ul.append($li);
      });
      $('.listWrap').append($ul);
      getMessage('Полный список отзывов для модерации');
    },
    error: function() {
      getMessage('Произошла ошибка');
    }
  });
}

/**
 * Формирует и выводит список одобренных отзывов.
 */
function makeAppruveList() {
  $('.listWrap').empty();

  $.ajax({
    url: 'http://localhost:3000/add',
    dataType: 'json',
    success: function (add) {
      var $ul = $('<ul />');
      add.forEach(function (review) {
        if (review.status === 'appruve') {
          var $li = $('<li />', {class: 'oneReview'});
          var $id = $('<div />', {class: 'idReview', text: "#" + review.id});
          var $p = $('<p />', {class: 'textReview', text: review.text});
          $li.append($id).append($p);
          $ul.append($li);
        } 
      });
      $('.listWrap').append($ul);
      getMessage('Список одобренных отзывов');
    },
    error: function() {
      getMessage('Произошла ошибка');
    }
  });
}

/**
 * Добавляет отзыв, введенный пользователем в базу данных.
 * @param {string} text - Текст, введенный пользователем.
 */
function addReview(text) {
  $.ajax({
    url: 'http://localhost:3000/add',
    type: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    data: JSON.stringify({
      text: text,
      status: 'add',
    }),
    success: function(data) {
      $('#textarea').val('');
      getMessage('Ваш отзыв был передан на модерацию');
    },
    error: function() {
      getMessage('Произошла ошибка');
    }
  });
  }

  /**
   * Выводит пользовательские сообщения.
   * @param {string} text - Текст сообщения для вывода.
   */
function getMessage(text) {
  if ($('.message')) {
    $('.message').remove();
  }
  var $message = $('<div />', {class: 'message'});
  // $('.reviewWrap').append($message);
    $message.append(text);
    $message.insertAfter($('.reviewWrap'));
}

/**
 * Изменяет статус отзыва на одобренный и дублирует запись в базу одобренных отзывов.
 * @param {Object} data - Объект с параметрами отзыва. 
 */
function makeAppruveData(data) {
  if (data.status === 'add') {
    $.ajax({
      url: 'http://localhost:3000/appruve',
      type: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      data: JSON.stringify({
        id: data.id,
        text: data.text,
      }),
      error: function() {
        getMessage('Произошла ошибка');
      }
    });
    $.ajax({
      url: 'http://localhost:3000/add/' + data.id,
      type: 'PATCH',
      headers: {
        'content-type': 'application/json',
      },
      data: JSON.stringify({
        'status': 'appruve'
      }),
      error: function() {
        getMessage('Произошла ошибка');
      }
    });
  }
}

/**
 * Изменяет статус отзыва на "удален".
 * @param {Object} data - Объект с параметрами отзыва. 
 */
function makeDeleteData(data) {
  if (data.status === 'add') {
    $.ajax({
      url: 'http://localhost:3000/add/' + data.id,
      type: 'PATCH',
      headers: {
        'content-type': 'application/json',
      },
      data: JSON.stringify({
        'status': 'delete'
      }),
      error: function() {
        getMessage('Произошла ошибка');
      }
    });
  }
}

/**
 * Безвозвратно удаляет из базы неодобренные отзывы.
 */
function makeRemovingData() {
  $.ajax({
    url: 'http://localhost:3000/add',
    dataType: 'json',
    success: function(data) {
      data.forEach(function(review) {
        var id = review.id;
        if (review.status === 'delete') {
          $.ajax({
            url: 'http://localhost:3000/add/' + id,
            type: 'DELETE',
            success: function() {
              // makeModerationList();
            }
          });
        }
      });
      getMessage('Неодобренные отзывы безвозвратно удалены');
      },
      error: function() {
        getMessage('Произошла ошибка');
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
        }
      });
    }
  });
}

(function($){
  $(function(){
    // При открытии страницы вызываем функцию проверки и установления сессии пользователя
    setSession();


    $('<button />', {id: 'moderationList', class: 'button', text: 'Показать все отзывы для модерации'}).appendTo('.reviewWrap');
    $('<button />', {id: 'appruveList', class: 'button', text: 'Показать одобренные отзывы'}).appendTo('.reviewWrap');
    $('<button />', {id: 'removeData', class: 'button', text: 'Безвозвратно удалить неодобренные отзывы'}).appendTo('.reviewWrap');
    $('#submit').on('click', function(){
      var textReview = $('#textarea').val();
      if (textReview !== '') {
        addReview(textReview);
      }
    });

    // По клику на кнопку "Показать все отзывы для модерации" вызываем функцию формирования списка отзывов для модерации.
    $('#moderationList').on('click', function() {
      $('#appruveList').removeClass('active');
      $('#removeData').removeClass('active');
      $('#moderationList').addClass('active');
      makeModerationList();
    });

    // По клику на кнопку "Показать одобренные отзывы" вызываем функцию формирования списка одобренных отзывов.
    $('#appruveList').on('click', function() {
      $('#appruveList').addClass('active');
      $('#removeData').removeClass('active');
      $('#moderationList').removeClass('active');
      makeAppruveList();
    });

    // По клику на кнопку "Безвозвратно удалить неодобренные отзывы" вызываем функцию удаления неодобренных отзывов.
    $('#removeData').on('click', function() {
      $('#appruveList').removeClass('active');
      $('#removeData').addClass('active');
      $('#moderationList').removeClass('active');
      makeRemovingData();
    });

    // При клике на div с классом reviewWrap убираем список отзывов (очищаем тег-обертку, в которой лежат теги с отзывами).
    $('.reviewWrap').on('click', function() {
      $('.listWrap').empty();
    });

    // По клику на кнопку "Одобрить отзыв", находим нужный id, по нему находим тег li, 
    // в котором лежит одобренный отзыв. Добавляем тегу класс для окраски в зеленый цвет,
    // делаем кнопки неактивными. Передаем данные в функцию для изменения записи в базе.
    $('.listWrap').on('click', '.appruve', function() {
        var id = $(this).attr('data-id');
        $(this).attr('desabled');
        $.ajax({
        url: 'http://localhost:3000/add/' + id,
        type: "PATCH",
        headers: {
          'content-type': 'application/json',
        },
        success: function(data) {
          var $li = $('.listWrap [data-id="' + id + '"]').parent().parent();
          $li.addClass('appruveLi');

          var $button = $('.buttonWrap [data-id="' + id + '"]');
          $button.attr('desabled', '').addClass('desabledButton');

          makeAppruveData(data);
        },
        error: function() {
          getMessage('Произошла ошибка');
        }
      });
    });

    // По клику на кнопку "Удалить отзыв", находим нужный id, по нему находим тег li, 
    // в котором лежит одобренный отзыв. Добавляем тегу класс для окраски в розовый цвет,
    // делаем кнопки неактивными. Передаем данные в функцию для изменения записи в базе.
    $('.listWrap').on('click', '.delete', function() {
        var id = $(this).attr('data-id');
        $(this).attr('desabled');
        $.ajax({
        url: 'http://localhost:3000/add/' + id,
        type: "PATCH",
        headers: {
          'content-type': 'application/json',
        },
          success: function(data) {
            var $li = $('.listWrap [data-id="' + id + '"]').parent().parent();
            $li.addClass('deleteLi');

            var $button = $('.buttonWrap [data-id="' + id + '"]');
            $button.attr('desabled', '').addClass('desabledButton');

            makeDeleteData(data);
          },
          error: function() {
            getMessage('Произошла ошибка');
          }
      });
    });

    // По клику на кнопку "My Account" вызываем форму выхода из личного кабинета
    $('.myAccount').on('click', function(e) {
        $('.myAccountIn').addClass('active');

      e.preventDefault();
    });

    // По клику на кнопку "Log out" удаляем на кнопке "MyAccount" id пользователя
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
          $(location).attr('href', "index.html");
        },
        error: function() {
          console.log('error');
        }
      });
      e.preventDefault();
    });


  });
})(jQuery);
