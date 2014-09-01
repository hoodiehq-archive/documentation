# hoodie
> **version:**      *> 0.1.0* <br />
> **source:**       *hoodie/src/hoodie/???.js*<br />

***<br />after reading this you will know***
> - how to listen and use events

## Introduction

This document describes the functionality of the hoodie base object.

## Methods

- [bind](#bind)
- [trigger](#trigger)
- [unbind](#unbind)
- [one](#one)
- [on](#on)
- [off](#off)

### bind()
> - **version:**      *> 0.2.0*

*Bind an event handler to a certain event so you get informed in case it gets triggered.*

```javascript
hoodie.bind('event', eventHandler);
```

| option     | type   | description     | required |
| ---------- |:------:|:---------------:|:--------:|
| event        | String   | custom event identifier            | yes |
| eventHandler | Function | Function handling triggered event. | yes |

Hoodie informs you about several things happening. For instance every time a store object has been added, saved or removed. In order to catch those messages you can register a function for handling those events. Those functions are called **eventHandlers**. You can register also for events you created and triggered yourself. See [trigger](#trigger) for further information.

<br />
###### Example
```javascript
hoodie.store.on('event', function(createdTodo) {
	console.log('A todo has been added => ', createdTodo);
});
```

### trigger

> - **version:**      *> 0.2.0*

*Trigger a certain event. This includes custom and predefined events.*

```javascript
hoodie.trigger('event', param, param, param ...);
```

| option     | type   | description     | required |
| ---------- |:------:|:---------------:|:--------:|
| event      | String | custom event identifier.                                 | yes |
| param      | Object | Detail information the event will pass to the listeners. | no |

Since you can listen for store events using [bind](#bind) or [on](#on), this gives you the opportunity to send events of your own to the listeners. This includes the standard events as mentionend in for instance [hoodie.store.on](/techdocs/api/client/hoodie.store.html) as well as your personal custom events. Imagine you want to trigger an event when a todo is done. This could look something similiar to this:

<br />
###### Example
```javascript
var todoStore = hoodie.store('todo');

function markAsDone(todo) {
  // mark todo as done and trigger a custom done event
  todo.done = true;
  todoStore.trigger('todo:done', todo, new Date());
}

todoStore.on('todo:done', function(doneTodo, t) {
  console.log(doneTodo.title, ' was done', t);
});

todoStore.findAll().then(function(allTodos) {
  // take the first todo in list
  // and mark it as done
  markAsDone(allTodos[0]);
});
```

<br />
####### Notes
> - it is a good idea to stick to an overall sane convention like 'object-type:what-happened' or 'what-happened' for event the descriptor.
> - starting with the second parameter you are allowed to pass an unlimited amount of detail information.
> - if you register an event handler with `hoodie.store('todo').on` and trigger the event just with `hoodie.store.trigger`, the previously registered event handler will never been called.

<br />
###### Examples
```javascript
	var todoStore = hoodie.store('todo');

	todoStore.on('trigger-test', function(num) {
		// will only be called by the second trigger
		console.log('triggered by', num);
	});

	hoodie.store.trigger('trigger-test', 'number one');
	todoStore.trigger('trigger-test', 'number two');
	hoodie.store(hoodie).trigger('trigger-test', 'number three');
```

### unbind()
> - **version:**      *> 0.2.0*

*Unbind all eventhandlers from a certain event. The events won't be triggered anymore.*

```javascript
hoodie.unbind('event');
```

| option     | type   | description     | required |
| ---------- |:------:|:---------------:|:--------:|
| event      | String | custom event identifier. | yes |

```javascript
hoodie.on('event', eventHandler);
```

While `hoodie.store.bind` subscribes an handler function to a certain event `hoodie.store.unbind` does the opposite and will unsubscribe all previously registered handlers for the given event.

<br />
###### Example

```javascript
var todoStore = hoodie.store('todo');
todoStore.on('todo:done', function(doneTodo, t) {
  // this will never be reached
});

todoStore.on('todo:done', function(doneTodo, t) {
  // this will never be reached neither
});

// this unsubscribes both of the previously
// subscribed event handlers
todoStore.off('todo:done');

todoStore.findAll().then(function(allTodos) {
  todoStore.trigger('todo:done', allTodos[0], new Date());
});
```

### one()
> - **version:**      *> 0.2.0*

*Is the one-time variant of [bind](#bind) plus [unbind](#unbind). Once the event has been caught, it will be unbound automatically.*

```javascript
hoodie.one('event', eventHandler);
```

| option     | type   | description     | required |
| ---------- |:------:|:---------------:|:--------:|
| event        | String   | custom event identifier            | yes |
| eventHandler | Function | Function handling triggered event. | yes |


### on()
> - **version:**      *> 0.2.0*

*Bind an event handler to a certain event so you get informed in case it gets triggered.*

```javascript
hoodie.on('event', eventHandler);
```

| option     | type   | description     | required |
| ---------- |:------:|:---------------:|:--------:|
| event        | String   | custom event identifier            | yes |
| eventHandler | Function | Function handling triggered event. | yes |

Alias for [bind](#bind).

### off()
> - **version:**      *> 0.2.0*

*Unbind all eventhandlers from a certain event. The events won't be triggered anymore.*

```javascript
hoodie.off('event');
```

| option     | type   | description     | required |
| ---------- |:------:|:---------------:|:--------:|
| event        | String   | custom event identifier            | yes |

Alias for [bind](#bind).
