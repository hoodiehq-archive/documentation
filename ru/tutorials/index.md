---
layout: layout-tutorials
locales: ru
---

# Начало работы с hoodie - Часть 2

### 0. Создание приложения

Создадим новое приложение с Hoodie! Если вы начинаете с уже созданного, убедитесь что находитесь в корневом каталоге приложения, а не в www, node_modules итп

Чтобы узнать, где вы находитесь, наберите
<pre><code>$ pwd</code></pre>

Чтобы перейти на уровень выше
<pre><code>$ cd ..</code></pre>

Хотите создать новое приложени? Конечно!
<pre><code>$ hoodie new hoodietut</code></pre>

Hodie создаст новое приложение со всеми нужными зависимостями.

### 1. Запуск приложения и тестирование

Снова в коммандной строке намерите ...

<pre><code>$ cd hoodietut
$ hoodie start
</code></pre>

Эта комманда откроет страницу с приложением в браузере.

### 2. Игра с приложением

Демонстрационное приложение показывает, что вы можете сделать с hoodie. Вымогли заметить, что оно выглядит как приложение на Bootstrap. Хотя приложение использует Bootstrap, но Hoodie не зависит от него или другого CSS фреймворка.

Вверхнем правом углу можно видеть кнопку “Sign Up”. Нажмите на неё и создайте аккаунт со своим именем и паролем. Сразу после этого вы должы быть автоматически залогинены, в результате чего выши TODO будут записаны.

Создайте несколько todo, проверьте что они сохраняются между обновлением страницы.

Приятно видеть работающее приложение всего после двух шагов!


### 3. CouchDB и администрирование

Наше приложение уже должно быть запущено. Откроем ещё две вкладки для CouchDB и админки.

```
http://127.0.0.1:6003/_utils
http://127.0.0.1:6002/
```

Мы сейчас не будем использовать администрирование *(:6002)* , однако хорошо знать что оно работает.  CouchDB нужен для того чтобы наблюдать магию Hoodie.


### 4. Начнём развивать наше приложение

За несколько следующих шагов мы добавим приоритеты нашим TODO, а также отсортируем их.

Откроем редактор в каталоге, созданном ранее. Вы должны увидеть каталоги **data**, **node_modules** и **www**. 

Мы будем работать в каталоге **assets** внутри **www**.

### 5. Отредактируем первые файлы Hoodie приложения

Для начала скопируем несколько файлов. В **/hoodietut/www/** скопируем **index.html** и назовём копию **new.html**. В **/www/assets/** скопируем **main.js** и назовём копию **new.js**.

Теперь откроем **new.html** и в последней строке должно быть ...

<pre><code>&lt;script src="assets/main.js">&lt;/script></code></pre>

Поменяем **main.js** на **new.js** ...

<pre><code>&lt;script src="assets/new.js">&lt;/script></code></pre>

Откроем новую вкладку в браузере и перейдём на ...

<pre><code>http://127.0.0.1:6001/new.html</code></pre>

Это покажет созданный вами файл.

В первой части **&lt;body>** вы можете увидеть строку “hoodie playground”. Изменим на “my first hoodie app”. После обновления страницы вы можете увидеть изменения.


### 6. Кнопка

Демо-приложение позволяет создавать TODO по нажатию на ENTER. Это хорошо работает для единственного поля ввода, но предпочтительным является иметь кнопку для добавления.

Сперва добавим кнопку в файле **new.html**. Найдите текстовое поле ввода с id **todoinput**. Сразу за ним добавим кнопку с id **addBut**:

<pre><code>&lt;button id="addBut">Add&lt;/button></code></pre>

Затем, изменим **new.js** так, чтобы новые TODO создавались по клику на эту кнопку. Замените 6 линий следом за **// handle creating a new task** на ...

<pre><code> // handle creating a new task
$('#addBut').on('click', function() {
  hoodie.store.add('todo', {title: $("#todoinput").val()});
  $("#todoinput").val('');
});
</code></pre>

Первая строка добавляет событи клика по нашей кнопке. Когда кнопка нажата, вызывается метод **hoodie.store.add**. Третья строка очищает наше поле ввода.

Save these files and run your modified app at:

<pre><code>http://127.0.0.1:6001/new.html</code></pre>

Enter a new task. You should see it rendered after clicking the “Add” button.

### 7. Understanding Type

Type is an important convention to understand when working with Hoodie or CouchDB. Type is a convention to deal with the lack of schemas in CouchDB.

In CouchDB the same database can contain a wide variety of different records. For example, you might have records on people and records on location. Type is used to distinguish one record from another. So the people records would have fields like **first name**, **last name**, etc. and a record called **type** with a value of **people**. The location record would have fields like **street**, **country**, etc. and a record called **type** with a value of **location**.

Hoodie uses type the same way. It is a way to store different ‘types’ of records in the same database. In this demo only the “todo” type will be used.

So while type is not critical for this application, more complex applications will have several types.


### 8. Adding Priority

Adding a priority requires a new input element. Add a **&lt;select>** input before the button we added above in **new.html**:

<pre><code>&lt;select id="priorityinput" class="form-control">
  &lt;option>1&lt;/option>
  &lt;option selected="selected">2&lt;/option>
  &lt;option>3&lt;/option>
&lt;/select>
&lt;button id="addBut">Add&lt;/button>
</code></pre>

Then modify the **#addBut** click method in **new.js** to store the priority:

<pre><code>// handle creating a new task
$('#addBut').on('click', function() {
  hoodie.store.add('todo', {
  title: $("#todoinput").val(),
  priority: $("#priorityinput").val()
  });
  $("#todoinput").val('');
});
</code></pre>

Again in **new.js** modify the **paint** function to show the priority:

Change ...

<pre><code>+ collection[i].title +</code></pre>

to ...

<pre><code>+ collection[i].priority + ' ' + collection[i].title +</code></pre>

At this point you should start seeing that each task listed is prefaced by a priority. Hoodie makes it pretty easy to add new fields to a store.

If you haven't ticked off all the old tasks ("old" meaning tasks which were created before we added the priority menu), those will now render "undefined" in place of a priority. Now is a good time to tick off thoses old tasks until only tasks with a priority remain.


### 9. Sort By Priority

Our todo list would look a lot nicer if it was also listed by our new priority. So let’s change the sorting method in **new.js**:

Replace ...

<pre><code>return ( a.createdAt > b.createdAt ) ? 1 : -1;</code></pre>

... with ...

<pre><code>return ( a.priority > b.priority ) ? 1 : -1;</code></pre>

Now your number one priorities show first and you hopefully got a good first impression on the hoodie way of development.

If you would love to see another tutorial, check out [the time tracker](../tutorials/timetracker.html).
