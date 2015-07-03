---
layout: layout-api
locales: ru
---
# hoodie
**version:**      *> 0.1.0* <br />


## Introduction

Этот документ описывает функциональность базового объекта hoodie

### Properties

- [baseUrl](#baseUrl)

## Methods

- [id](#id)
- [on](#on)
- [one](#one)
- [off](#off)
- [trigger](#trigger)
- [request](#request)
- [open](#open)
- [checkConnection](#checkConnection)
- [isConnected](#isConnected)
- [extend](#extend)


<a id="baseUrl"></a>
### hoodie.baseUrl
**version:**    *> 0.2.0*

<pre><code>hoodie.baseUrl</code></pre>

Свойство **hoodie.baseUrl** автоматически устанавливается в момент инициализации.


##### Пример

<pre><code>hoodie = new Hoodie('http://myhoodieapp.com')
hoodie.baseUrl // 'http://myhoodieapp.com'

hoodie = new Hoodie()
hoodie.baseUrl // ''
</code></pre>


<a id="id"></a>
### id()
**version:**      *> 0.2.0*

*Возвращает уникальный идентификатор текущего пользователя.*

<pre><code>hoodie.id();</code></pre>

Когда **hoodie.id()** вызывается впервые, для текущего пользователя создаётся
уникальный идентификатор, он хранится в localStorage. Когда происходит вход в аккаунт
**hoodie.id()** возвращает идентификатор.
При логауте, hoodie.id() сбрасывается.

##### Пример
<pre><code>hoodie.id(); // randomid123
hoodie.account.signIn(username, password)
  .done(function() {
    hoodie.id(); // randomid456
});
</code></pre>


<a id="on"></a>
### on()
**version:**      *> 0.2.0*

*Инициализирует наблюдатель (обработчик) события.*

<pre><code>hoodie.on('event', eventHandler); </code></pre>

| option     | type   | description     | required |
| ---------- |:------:|:---------------:|:--------:|
| event        | String   | custom event identifier            | yes |
| eventHandler | Function | Function handling triggered event. | yes |

Hoodie информирует вас о различных событиях. В частности, когда объект создаётся, изменяется или удаляется из хранилища. Чтобы обработать эти события используется функция-обработчик. Вы можете регистрировать также обработчики собственных событий и вызывать их вручную. Подробней об этом: [trigger](#trigger).

##### Пример
<pre><code>hoodie.store.on('event', function(createdTodo) {
  console.log('Запись добавлена => ', createdTodo);
});
</code></pre>


<a id="one"></a>
### one()
**version:**      *> 0.2.0*

* Это одноразовый вариант [on](#on) и [off](#off). Событие обработается только один раз.

<pre><code>hoodie.one('event', eventHandler);</code></pre>

| параметр     | тип      | описание                           | обязательно |
| ------------ |:--------:|:----------------------------------:|:-----------:|
| event        | String   | имя события                        | да          |
| eventHandler | Function | обработчик                         | да          |


<a id="off"></a>
### off()
**version:**      *> 0.2.0*

* Отключает обработчики. *

<pre><code>hoodie.off('event');</code></pre>

| option     | тип   | описание     | необходимо |
| ---------- |:------:|:---------------:|:--------:|
| event      | String | имя события | да |

<pre><code>hoodie.on('event', eventHandler);</code></pre>

Если **hoodie.store.on** подписывается на событие, то  **hoodie.store.off** делает противоположное.

##### Пример

<pre><code>var todoStore = hoodie.store('todo');
todoStore.on('todo:done', function(doneTodo, t) {
  // Это никогда не вызовется
});

todoStore.on('todo:done', function(doneTodo, t) {
  // Это также
});

// Это отписывает ото всех обработчиков
todoStore.off('todo:done');

todoStore.findAll().done(function(allTodos) {
  todoStore.trigger('todo:done', allTodos[0], new Date());
});
</code></pre>


<a id="trigger"></a>
### trigger()

**version:**      *> 0.2.0*

*Вызывает указанное событие. Включая кастомные и предопределённые события.*

<pre><code>hoodie.trigger('event', param, param, param ...);</code></pre>

| option     | type   | description     | required |
| ---------- |:------:|:---------------:|:--------:|
| event      | String | custom event identifier.                                 | yes |
| param      | Object | Detail information the event will pass to the listeners. | no |

Данный метод позволяет вызывать обработчики, подписанные на события с помощью метода [on](#on). Это касается как стандартных типов событий, описанных в [hoodie.store.on](/techdocs/api/client/hoodie.store.html#storeon), так и ваших собственных (кастомных) событий. Допустим, вы хотите вызвать событие, когда задача выполнена:


##### Пример
<pre><code>var todoStore = hoodie.store('todo');

function markAsDone(todo) {
  // mark todo as done and trigger a custom done event
  todo.done = true;
  todoStore.trigger('todo:done', todo, new Date());
}

todoStore.on('todo:done', function(doneTodo, t) {
  console.log(doneTodo.title, ' was done', t);
});

todoStore.findAll().done(function(allTodos) {
  // take the first todo in list
  // and mark it as done
  markAsDone(allTodos[0]);
});
</code></pre>

##### Notes
> - Хорошая идея - придерживаться соглашений в наименовании, вида: 'object-type:what-happened' или 'what-happened'
> - Начиная со второго параметра вы можете передать любые дополнительные данные для события.
> - Если вы зарегистрировали обработчик **hoodie.store('todo').on** и вызываете его через **hoodie.store.trigger**, предыдущий зарегистрированный обработчик не вызывается.

##### Примеры
<pre><code>var todoStore = hoodie.store('todo');

todoStore.on('trigger-test', function(num) {
  // will only be called by the second trigger
  console.log('triggered by', num);
});

hoodie.store.trigger('trigger-test', 'number 1');
todoStore.trigger('trigger-test', 'number 2');
hoodie.store(hoodie).trigger('trigger-test', 'number 3');
</code></pre>


<a id="request"></a>
### request()

**version:**      *> 0.2.0*

*Отправляет запрос*

<pre><code>hoodie.request(type, url, options);</code></pre>

| option     | type     | description                                | required |
| ---------- |:--------:|:------------------------------------------:|:--------:|
| type       | string   | http verb, e.g. get, post, put or delete   | yes      |
| url        | string   | relative path or absolute URL.             | yes      |
| options    | object   | compare <a href="http://api.jquery.com/jquery.ajax/" target="_blank">http://api.jquery.com/jquery.ajax</a> | no       |


##### Пример
<pre><code>hoodie.request('http://example.com/something')
  .done(renderSomething)
  .fail(handleError);
</code></pre>


<a id="open"></a>
### open()

**version:**      *> 0.2.0*

*Подключается к базе*

<pre><code>hoodie.open('db-name');</code></pre>

| option     | type     | description            | required |
| ---------- |:--------:|:----------------------:|:--------:|
| name       | string   | name of the database   | yes      |


##### Пример
<pre><code>var chat = hoodie.open('chatroom');
chat.findAll('message')
  .done(renderMessages)
  .fail(handleError);
</code></pre>


<a id="checkConnection"></a>
### checkConnection()

**version:**      *> 0.2.0*

*Проверяет доступность сервера*

<pre><code>hoodie.checkConnection();</code></pre>

##### Пример
<pre><code>hoodie.checkConnection()
  .done(renderGreenLight)
  .fail(renderRedLight);
</code></pre>


<a id="isConnected"></a>
### isConnected()

**version:**      *> 0.2.0*

*Возвращает true, если бэкенд Hoodie доступен*

<pre><code>hoodie.isConnected();</code></pre>

##### Пример
<pre><code>if (hoodie.isConnected()) {
  alert('Looks like you are online!');
} else {
  alert('You are offline!');
}
</code></pre>


<a id="extend"></a>
### extend()

**version:**      *> 0.2.0*

*Расширяет API hoodie новой функциональностью*

<pre><code>hoodie.extend(plugin);</code></pre>

| option     | type     | description     | required |
| ---------- |:--------:|:---------------:|:--------:|
| plugin     | function | extend the frontend API with whatever logic your plugin wants to expose | yes |



##### Пример
<pre><code>hoodie.extend(function(hoodie, lib, util) {
  hoodie.sayHi = function() {
    alert('say hi!');
  };
});

hoodie.sayHi(); // shows alert
</code></pre>
