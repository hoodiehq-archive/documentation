---
layout: layout-api
locales: de
---
# hoodie
**version:**      *> 0.1.0* <br />


## Introduction

This document describes the functionality of the hoodie base object.

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

The **hoodie.baseUrl** property gets automatically set on initialization.


##### Example

<pre><code>hoodie = new Hoodie('http://myhoodieapp.com')
hoodie.baseUrl // 'http://myhoodieapp.com'

hoodie = new Hoodie()
hoodie.baseUrl // ''
</code></pre>


<a id="id"></a>
### id()
**version:**      *> 0.2.0*

*Returns a unique, persistent identifier for the current user.*

<pre><code>hoodie.id();</code></pre>

The first time **hoodie.id()** gets called, a unique
identifier gets generated for the current user, and persisted
in the browser's local store. When signing in to an account,
**hoodie.id()** will return the id of the new user.
On signout, hoodie.id() gets reset.

##### Example
<pre><code>hoodie.id(); // randomid123
hoodie.account.signIn(username, password)
  .done(function() {
    hoodie.id(); // randomid456
});
</code></pre>


<a id="on"></a>
### on()
**version:**      *> 0.2.0*

*Bind an event handler to a certain event so you get informed in case it gets triggered.*

<pre><code>hoodie.on('event', eventHandler); </code></pre>

| option     | type   | description     | required |
| ---------- |:------:|:---------------:|:--------:|
| event        | String   | custom event identifier            | yes |
| eventHandler | Function | Function handling triggered event. | yes |

Hoodie informs you about several things happening. For instance every time a store object has been added, saved or removed. In order to catch those messages you can register a function for handling those events. Those functions are called **eventHandlers**. You can register also for events you created and triggered yourself. See [trigger](#trigger) for further information.

##### Example
<pre><code>hoodie.store.on('event', function(createdTodo) {
  console.log('A todo has been added => ', createdTodo);
});
</code></pre>


<a id="one"></a>
### one()
**version:**      *> 0.2.0*

*Is the one-time variant of [on](#on) and [off](#off). Once the event has been caught, it will be unbound automatically.*

<pre><code>hoodie.one('event', eventHandler);</code></pre>

| option       | type     | description                        | required |
| ------------ |:--------:|:----------------------------------:|:--------:|
| event        | String   | custom event identifier            | yes      |
| eventHandler | Function | Function handling triggered event. | yes      |


<a id="off"></a>
### off()
**version:**      *> 0.2.0*

*Unbind all eventhandlers from a certain event. The events won't be triggered anymore.*

<pre><code>hoodie.off('event');</code></pre>

| option     | type   | description     | required |
| ---------- |:------:|:---------------:|:--------:|
| event      | String | custom event identifier. | yes |

<pre><code>hoodie.on('event', eventHandler);</code></pre>

While **hoodie.store.on** subscribes an handler function to a certain event **hoodie.store.off** does the opposite and will unsubscribe all previously registered handlers for the given event.

##### Example

<pre><code>var todoStore = hoodie.store('todo');
todoStore.on('todo:done', function(doneTodo, t) {
  // this will never be reached
});

todoStore.on('todo:done', function(doneTodo, t) {
  // this will never be reached neither
});

// this unsubscribes both of the previously
// subscribed event handlers
todoStore.off('todo:done');

todoStore.findAll().done(function(allTodos) {
  todoStore.trigger('todo:done', allTodos[0], new Date());
});
</code></pre>


<a id="trigger"></a>
### trigger()

**version:**      *> 0.2.0*

*Trigger a certain event. This includes custom and predefined events.*

<pre><code>hoodie.trigger('event', param, param, param ...);</code></pre>

| option     | type   | description     | required |
| ---------- |:------:|:---------------:|:--------:|
| event      | String | custom event identifier.                                 | yes |
| param      | Object | Detail information the event will pass to the listeners. | no |

Since you can listen for store events using [on](#on), this gives you the opportunity to send events of your own to the listeners. This includes the standard events as mentionend in for instance [hoodie.store.on](/de/techdocs/api/client/hoodie.store.html#storeon) as well as your personal custom events. Imagine you want to trigger an event when a todo is done. This could look something similiar to this:


##### Example
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
> - it is a good idea to stick to an overall sane convention like 'object-type:what-happened' or 'what-happened' for event the descriptor.
> - starting with the second parameter you are allowed to pass an unlimited amount of detail information.
> - if you register an event handler with **hoodie.store('todo').on** and trigger the event just with **hoodie.store.trigger**, the previously registered event handler will never been called.

##### Examples
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

*Send a request*

<pre><code>hoodie.request(type, url, options);</code></pre>

| option     | type     | description                                | required |
| ---------- |:--------:|:------------------------------------------:|:--------:|
| type       | string   | http verb, e.g. get, post, put or delete   | yes      |
| url        | string   | relative path or absolute URL.             | yes      |
| options    | object   | compare <a href="http://api.jquery.com/jquery.ajax/" target="_blank">http://api.jquery.com/jquery.ajax</a> | no       |


##### Example
<pre><code>hoodie.request('http://example.com/something')
  .done(renderSomething)
  .fail(handleError);
</code></pre>


<a id="open"></a>
### open()

**version:**      *> 0.2.0*

*Interact with a remote database*

<pre><code>hoodie.open('db-name');</code></pre>

| option     | type     | description            | required |
| ---------- |:--------:|:----------------------:|:--------:|
| name       | string   | name of the database   | yes      |


##### Example
<pre><code>var chat = hoodie.open('chatroom');
chat.findAll('message')
  .done(renderMessages)
  .fail(handleError);
</code></pre>


<a id="checkConnection"></a>
### checkConnection()

**version:**      *> 0.2.0*

*Sends request to the Hoodie Server to check if it is reachable*

<pre><code>hoodie.checkConnection();</code></pre>

##### Example
<pre><code>hoodie.checkConnection()
  .done(renderGreenLight)
  .fail(renderRedLight);
</code></pre>


<a id="isConnected"></a>
### isConnected()

**version:**      *> 0.2.0*

*Returns true if Hoodie backend can currently be reached, otherwise false*

<pre><code>hoodie.isConnected();</code></pre>

##### Example
<pre><code>if (hoodie.isConnected()) {
  alert('Looks like you are online!');
} else {
  alert('You are offline!');
}
</code></pre>


<a id="extend"></a>
### extend()

**version:**      *> 0.2.0*

*Extend the hoodie API with new functionality*

<pre><code>hoodie.extend(plugin);</code></pre>

| option     | type     | description     | required |
| ---------- |:--------:|:---------------:|:--------:|
| plugin     | function | extend the frontend API with whatever logic your plugin wants to expose | yes |



##### Example
<pre><code>hoodie.extend(function(hoodie, lib, util) {
  hoodie.sayHi = function() {
    alert('say hi!');
  };
});

hoodie.sayHi(); // shows alert
</code></pre>
