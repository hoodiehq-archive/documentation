---
layout: layout-api  
---
# hoodie
**version:**      *> 0.1.0* <br />


## Introduction

This document describes the functionality of the hoodie base object.

## Methods

- [bind](#bind)
- [trigger](#trigger)
- [unbind](#unbind)
- [one](#one)
- [on](#on)
- [off](#off)

<a id="bind"></a>
### bind()
**version:**      *> 0.2.0*

*Bind an event handler to a certain event so you get informed in case it gets triggered.*

<pre><code>hoodie.bind('event', eventHandler); </code></pre>

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

<a id="trigger"></a>
### trigger

**version:**      *> 0.2.0*

*Trigger a certain event. This includes custom and predefined events.*

<pre><code>hoodie.trigger('event', param, param, param ...);</code></pre>

| option     | type   | description     | required |
| ---------- |:------:|:---------------:|:--------:|
| event      | String | custom event identifier.                                 | yes |
| param      | Object | Detail information the event will pass to the listeners. | no |

Since you can listen for store events using [bind](#bind) or [on](#on), this gives you the opportunity to send events of your own to the listeners. This includes the standard events as mentionend in for instance [hoodie.store.on](/techdocs/api/client/hoodie.store.html#storeon) as well as your personal custom events. Imagine you want to trigger an event when a todo is done. This could look something similiar to this:


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

<a id="unbind"></a>
### unbind()
**version:**      *> 0.2.0*

*Unbind all eventhandlers from a certain event. The events won't be triggered anymore.*

<pre><code>hoodie.unbind('event');</code></pre>

| option     | type   | description     | required |
| ---------- |:------:|:---------------:|:--------:|
| event      | String | custom event identifier. | yes |

<pre><code>hoodie.on('event', eventHandler);</code></pre>

While **hoodie.store.bind** subscribes an handler function to a certain event **hoodie.store.unbind** does the opposite and will unsubscribe all previously registered handlers for the given event.

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

<a id="one"></a>
### one()
**version:**      *> 0.2.0*

*Is the one-time variant of [bind](#bind) plus [unbind](#unbind). Once the event has been caught, it will be unbound automatically.*

<pre><code>hoodie.one('event', eventHandler);</code></pre>

| option     | type   | description     | required |
| ---------- |:------:|:---------------:|:--------:|
| event        | String   | custom event identifier            | yes |
| eventHandler | Function | Function handling triggered event. | yes |


<a id="on"></a>
### on()
**version:**      *> 0.2.0*

*Bind an event handler to a certain event so you get informed in case it gets triggered.*

<pre><code>hoodie.on('event', eventHandler);</code></pre>

| option     | type   | description     | required |
| ---------- |:------:|:---------------:|:--------:|
| event        | String   | custom event identifier            | yes |
| eventHandler | Function | Function handling triggered event. | yes |

Alias for [bind](#bind).

<a id="off"></a>
### off()
**version:**      *> 0.2.0*

*Unbind all eventhandlers from a certain event. The events won't be triggered anymore.*

<pre><code>hoodie.off('event');</code></pre>

| option     | type   | description     | required |
| ---------- |:------:|:---------------:|:--------:|
| event        | String   | custom event identifier            | yes |

Alias for [bind](#bind).
