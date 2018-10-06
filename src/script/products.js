var category = {
  'Name': 'http://localhost:3000/products?_sort=name',
  'Price': 'http://localhost:3000/products?_sort=price',
  'Brand': 'http://localhost:3000/products?_sort=brand',
  'Color': 'http://localhost:3000/products?_sort=color',
};

var interval = {
  ' 09': 'http://localhost:3000/products?_page=1&_limit=9',
  ' 18': 'http://localhost:3000/products?_page=1&_limit=18', 
  ' 27': 'http://localhost:3000/products?_page=1&_limit=27',
  'all': 'http://localhost:3000/products',
};

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
 * Создает элемент паджинации и вызывает функцию вывода карточек товаров на странице
 * @param {string} clickId - id страницы, на который кликнул пользователь 
 * @param {string} activeId - id текущей активной страницы 
 * @param {string} num - количество карточек товара, выводимых на страницы 
 */
function makePagination(clickId, activeId, num) {
  var clickPageId = clickId;
  var activePageId = +activeId;
  $('.page').remove();
  $.ajax({
    url: 'http://localhost:3000/products',
    dataType: 'json',
    success: function(result) {
      var amountPage = Math.ceil(result.length / 9);
        if (clickPageId === 'prev') {
          if (activePageId > 1) {
            activePageId--;
          } else activePageId = 1; 
        } else if (clickPageId === 'next') {
          if (activePageId < amountPage) {
            activePageId++;
          } else activePageId = amountPage;
        } else activePageId = clickPageId;
    

      $('.last').attr('id', amountPage).text(amountPage);

      if (amountPage <= 5) {
        for (var i = 2; i <= amountPage - 1; i++) {
          $('<a />', {href: '#', id: i, class: 'page'}).text(i).insertBefore('.last');
        }
        $('.pagination').children('a').removeClass('active');
        $('.pagination').children('#' + activePageId).addClass('active');
      }

      var url = 'http://localhost:3000/products?_page=' + activePageId + '&_limit=' + 9;
      renderProducts(url);
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

    // Выводим элемент пагинации и карточки товаров на странице
    makePagination('1', '1', 9);

    // При открытии страницы вызываем функцию проверки и установления сессии пользователя
    setSession();

    // При клике на номер страницы определяе url и передает в функцию вывода карточек товаров
    $('.pagination').on('click', 'a', function() {
      var num = 9;
      var clickPageId = $(this).attr('id');
      var activePageId = $('.pagination').children('.active').attr('id');
      console.log(activePageId);
      makePagination(clickPageId, activePageId, num);
    });

    // При нажатии на кнопку "посмотреть все" выводит на странице все продукты
    $('.buttonViewAll').on('click', function() {
      renderProducts('http://localhost:3000/products');
    });

    // По клику на кнопку сортировки по категориям выводим список категорий
    $('#aSortCat').on('click', function() {
      $('#aSortCat').css('color', 'transparent');
      var $ul = $('<ul />').attr('id', 'ulSortCat');
      for (var key in category) {
        var $li = $('<li />', {
          text: key,
          class: 'liSortCat',
          'data-set_url': category[key],
        });
        $ul.append($li);
      }
      $('#sortByCategory').append($ul);

      event.preventDefault();
    });

    // По клику не на кнопку сортировки удаляем список сортировки
    $('body').on('click', function() {
      var $target = $(event.target).parents('#sortByCategory');
      if ($target.length === 0) {
        $('#ulSortCat').remove();
      }

      event.preventDefault();
    });

    // При выборе категории сортировки получает data-атрибут сортировки 
    // и передает url в функцию вывода карточек продуктов
    $('#sortByCategory').on('click', '.liSortCat', function() {
      var text = $(event.target).text();
      var url = $(event.target).attr('data-set_url');

      $('#aSortCat').text(text).css('color', '#4e4e4e');
      $('#ulSortCat').remove();
      renderProducts(url);

      event.preventDefault();
    });

    // По клику на кнопку "show" выводим список количества показываемых карточек
    $('#aSortPage').on('click', function() {
      $('#aSortPage').css('color', 'transparent');
      var $ul = $('<ul />').attr('id', 'ulSortPage');
      for (var key in interval) {
        var $li = $('<li />', {
          text: key,
          class: 'liSortPage',
          'data-set_url': interval[key],
        });
        $ul.append($li);
      }
      $('#sortByPage').append($ul);

      event.preventDefault();
    });

    // По клику не на кнопку сортировки удаляем список сортировки
    $('body').on('click', function() {
      var $target = $(event.target).parents('#sortByPage');
      if ($target.length === 0) {
        $('#ulSortPage').remove();
      }

      event.preventDefault();
    });

    // При выборе категории сортировки получает data-атрибут сортировки 
    // и передает url в функцию вывода карточек продуктов
    $('#sortByPage').on('click', '.liSortPage', function() {
      var text = $(event.target).text();
      var url = $(event.target).attr('data-set_url');

      $('#aSortPage').text(text).css('color', '#4e4e4e');
      $('#ulSortPage').remove();
      renderProducts(url);

      event.preventDefault();
    });

    $('.categoryDetails').on('click', function() {
      var $target = $(event.target).parents('.categoryDetails');
      if ($($target).attr('open')) {
        $($target).removeAttr('open');
      } else $($target).attr('open', 'open');
    });

  });
})(jQuery);












