BRAND_js
----
## Корзина и каталог

### Получение списка товаров
При открытии страниц (домашняя страница, "Products.html" и "Single_page.html") выводится список продуктов отсортированный по количеству единиц товара, начиная с заданного номера единицы товара. 

    - На домашней странице реализован вывод всего списка товаров при нажатии на кнопку "Browse All Product".
    
    - На странице "Products.html" реализовано:
        - вывод всего списка товаров при нажатии на кнопку "View All";
        - сортировка товаров по названию, цене, бренду и цвету при выборе одной  из этих категорий в поле "Sort By";
        - вывод разного количества товаров на странице при выборе одной из категорий в поле "Show".

### Добавление товара в корзину
При нажатии на кнопку "Add to Cart", появляющуюся на активной карточке товара, товар добавляется в корзину. Если пользователь авторизован, товар добавляется в его корзину. Если пользователь не авторизован, товар добавляется в корзину, не привязанную к пользователю. При помещении товара в корзину уменьшается количество этого товара на складе. Если товар на складе заканчивается, сообщение об этом выводится при нажатии на кнопку "Add to Cart".

### Удаление товара из корзины
Удаление единицы товара из корзины реализовано в окне корзины, появляющемся при нажатии иконки корзины, расположенной рядом с кнопкой входа в аккаунт, и на страницы корзины в аккаунте пользователя. Удаление единицы товара происходит при нажатии на крестик. При удалении товара из корзины увеличивается его количество на складе.

### Получение корзины пользователя
Товары в корзине пользователя выводятся на странице корзины в аккаунте пользователя. Также они выводятся в окне корзины, появляющемся при нажатии иконки корзины, расположенной рядом с кнопкой входа в аккаунт.

### Разные варианты товаров
На странице "Single_page.html" при выборе цвета и размера могут быть получены разные варианты товара.

## Личный кабинет

### Регистрация пользователя
Форма регистрации пользователя может быть вызвана на странице "Сheckout.html" при нажатии на кнопку "Continue" в разделе регистрации. Также к регистрации можно перейти на любой странице сайта: при нажатии на кнопку "My Account" появляется выпадающее меню, содержащее кнопку перехода к регистрации "Sign up". При корректном заполнении полей происходит регистрация пользователя с присвоением id.

### Авторизация пользователя
Меню авторизации пользователя вызывается на любой странице сайта при нажатии на кнопку "My Account". Если при авторизации была проставлена галочка в поле "Запомнить", то будут записаны cookie.
При успешной авторизации в базе проставляется статус открытой сессии.

### Изменение данных пользователя
Форма изменения данных авторизованного пользователя может быть вызвана на любой странице сайта из меню личного кабинета (вызывается при нажатии на кнопку "My Account") при нажатии на кнопку "Edit data". При корректном заполнении одного или нескольких полей формы данные пользователя будут изменены.

### Выход из аккаунта 
Выход из аккаунта пользователя осуществляется из меню личного кабинета (вызывается при нажатии на кнопку "My Account") на любой странице сайта при нажатии на кнопку "Log out".
При выходе из аккаунта в базе проставляется статус закрытия сессии.

## Отзывы пользователей

### Добавление и просмотр отзывов 
Авторизованный пользователь может написать отзыв, а также просмотреть все отзывы, оставленные пользователями и успешно прошедшие модерацию. Клиентский модуль работы с отзывами может быть вызван на странице личного кабинета "Shopping_cart.html" из меню личного кабинета (вызывается при нажатии на кнопку "My Account") при нажатии на кнопку "Write a review". 

### Модерация отзывов
Модерация отзывов производится администратором. Модуль работы с отзывами доступен администратору после его авторизации (логин "admin", пароль "adminus"). После успешной авторизации в меню личного кабинета появляется кнопка "go to admin panel". Модерация отзывов производится на странице "Admin.html". Модуль сбора отзывов позволяет просмотреть все отзывы, оставленные пользователями, одобрить отзыв, проставить на отзыве статус для удаления, а также удалить отзыв, не прошедший модерацию. Выход из модуля осуществляется из меню личного кабинета (вызывается при нажатии на кнопку "My Account").