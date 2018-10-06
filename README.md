BRAND_js
----
## Корзина и каталог

### Получение списка товаров
При открытии страниц (домашняя страница, "products" и "single_page") выводится список продуктов отсортированный по количеству единиц товара, начиная с заданного номера единицы товара. 

    - На домашней странице реализован вывод всего списка товаров при нажатии на кнопку "Browse All Product".
    
    - На странице "products" реализовано:
    - вывод всего списка товаров при нажатии на кнопку "View All";
    - сортировка товаров по названию, цене, бренду и цвету при выборе одной  из этих категорий в поле "Sort By";
    - вывод разного количества товаров на странице при выборе одной из категорий в поле "Show".

### Добавление товара в корзину
При нажатии на кнопку "Add to Cart", появляющуюся на активной карточке товара, товар добавляется в корзину. Если пользователь залогинен, товар добавляется в его корзину. Если пользователь не залогинен, товар добавляется в корзину, не привязанную к пользователю. При помещении товара в корзину уменьшается количество этого товара на складе. Если товар на складе заканчивается, сообщение об этом выводится при нажатии на кнопку "Add to Cart".

### Удаление товара из корзины
Удаление единицы товара из корзины реализовано в окне корзины, появляющемся при нажатии иконки корзины, расположенной рядом с кнопкой входа в аккаунт, и на страницы корзины в аккаунте пользователя. Удаление единицы товара происходит при нажатии на крестик. При удалении товара из корзины увеличивается его количество на складе.

### Получение корзины пользователя
Товары в корзине пользователя выводятся на странице корзины в аккаунте пользователя. Также они выводятся в окне корзины, появляющемся при нажатии иконки корзины, расположенной рядом с кнопкой входа в аккаунт.

### Разные варианты товаров
Разные варинаты товаров могут быть получены 