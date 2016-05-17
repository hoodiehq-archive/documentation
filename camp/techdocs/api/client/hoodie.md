---
layout: layout-api
locales: camp
---
# hoodie
**version:**      *> 0.1.0*

## Introduction

This document describes the functionality of the hoodie base object. It provides a number of helper methods dealing with event handling and connectivity, as well as a unique id generator and a means to set the endpoint which Hoodie communicates with.

<a id="top"></a>

### Properties

- [baseUrl](#baseUrl)

### Methods

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
### [hoodie.baseUrl](#baseUrl)
**version:**    *> 0.2.0*

**Reveals Hoodie's base URL**

```javascript
hoodie.baseUrl
```

The **hoodie.baseUrl** property is automatically set on initialization, but you can override it when you initialise Hoodie, and provide your own endpoint. This means you can conveniently use the same data store for multiple apps, if you want to.

##### Example

Default initialisation of Hoodie

```javascript
hoodie = new Hoodie();
hoodie.baseUrl; // ''
```

Specifying your own endpoint

```javascript
hoodie = new Hoodie('http://myhoodieapp.com');
hoodie.baseUrl; // 'http://myhoodieapp.com'
```

<a id="id"></a>
### [id()](#id)
**version:**      *> 0.2.0*

**Returns a unique, persistent identifier for the current user.**

```javascript
hoodie.id();
```

Each user is assigned a random, unique ID when they first visit your Hoodie app, even before signup. They are, in this state, **anonymous users**. Their ID and their data will only be persisted locally.

When they sign up, their ID becomes permanently bound to their user account. After every single time they sign out again, **hoodie.id()** returns a new, unique value in their client, because they are now de facto a new, anonymous user again.

#### Example
```javascript
hoodie.id(); // "i67s6sm"
hoodie.account.signIn(username, password)
  .done(function() {
    hoodie.id(); // "vley9kp"
});
```

<a id="on"></a>
### [on()](#on)
**version:**      *> 0.2.0*

**Adds an event handler for the specified events**

```javascript
hoodie.on('event', eventHandler);
```

| option       | type     | description                        | required |
|:------------ |:-------- |:---------------------------------- |:-------- |
| event        | String   | Custom event identifier            | yes      |
| eventHandler | Function | Function handling triggered event  | yes      |

Hoodie informs you about a lot of internal events, such as data being added, removed or changed, or a user signing in or out. These can be listened to with **on()**. You can also register listeners for events you created and triggered yourself. See [trigger](#trigger) for more on this.

#### A Note on the Event Identifier Format

Hoodie store event identifiers always come in the same format:

```javascript
object-type:object-id:event-type
```

The **event-type** is mandatory. If you want to listen for more than one event type at once, use the **change** type, which fires on *add*, *update* and *remove*.

**object-type** and **object-id** are optional: Omitting **object-type** listens to all objects in the store, specifying it listens only to objects of that type. Omitting the **object-id** listens to events from all objects of a type. If you *do* specify an object id, you'll only receive events from that one specific object.

You can find more detailed explanations and examples in the [hoodie.store event docs](/en/techdocs/api/client/hoodie.store.html#storeevents).

**In scoped stores**, which are stores which can only contain objects of one type, **the type parameter should be omitted**, because it's implicit.

#### Examples

**Listening for a new todo object:**

```javascript
hoodie.store.on('todo:add', function(newTodoObject) {
  console.log('A todo has been added => ', newTodoObject);
});
```

Note that you're calling **on()** from **hoodie.store**, not from **hoodie** itself.

**Listening for changes in a scoped store:**

```javascript
var todoStore = hoodie.store('todo');
todoStore.on('change', function(changedTodoObject) {
  console.log('A todo has been changed => ', changedTodoObject);
});
```

As you can see, this store is scoped to contain only objects with the type **todo**, so there'd be no point in specifying the object type in the event listener.

**Listening for user authentication:**

```javascript
hoodie.account.on('signin', function(username) {
  console.log('Hello there, '+ username);
});
```

Note that for authentication events, you're calling **on()** from **hoodie.account**, not from **hoodie** itself. [Here's a complete list of all account events](/en/techdocs/api/client/hoodie.account.html#accountevents).


<a id="one"></a>
### [one()](#one)
**version:**      *> 0.2.0*

**Binds a one-time event handler to the specified event. Once the event has been caught, the listener will be unbound automatically.**

```javascript
hoodie.one('event', eventHandler);
```

| option       | type     | description                        | required |
|:------------ |:-------- |:---------------------------------- |:-------- |
| event        | String   | Custom event identifier            | yes      |
| eventHandler | Function | Function handling triggered event  | yes      |

This works exactly like **on()** does, just once.

<a id="off"></a>
### [off()](#off)
**version:**      *> 0.2.0*

**Unbind all event handlers from a certain event.**

```javascript
hoodie.off('event');
```

| option     | type   | description             | required |
|:---------- |:------ |:----------------------- |:-------- |
| event      | String | custom event identifier | yes      |

Opposite of **on()**. You don't have to specify the handler function, only the event identifier.

#### Example

Adding a listener for a custom event, but unsubscribing before it is triggered.

```javascript
var todoStore = hoodie.store('todo');

todoStore.on('todo:completed', function(completedTodo) {
  // this will never be reached
});

// this unsubscribes the previously
// subscribed event handler
todoStore.off('todo:completed');

// Therefore, this does nothing
todoStore.trigger('todo:completed', completedTodo);

```

<a id="trigger"></a>
### [trigger()](#trigger)

**version:**      *> 0.2.0*

**Triggers a certain event. This includes both custom and predefined events.**

```javascript
hoodie.trigger('event', param, param, param ...);
```

| option     | type   | description                                             | required |
|:---------- |:------ |:------------------------------------------------------- |:-------- |
| event      | String | Event identifier                                        | yes      |
| param      | Object | Detail information the event will pass to the listeners | no       |

**trigger()** lets you trigger events, both ones native to Hoodie (such as *add* or *change*), but also custom ones you define yourself.

**Note:** starting with the second parameter, you can pass an unlimited amount of additional information along with the event. Well, <a href="http://stackoverflow.com/questions/22747068/is-there-a-max-number-of-arguments-javascript-functions-can-accept/22747272#22747272" target="_blank">unlimited-ish</a>.

#### Example

Triggering a custom **:completed** event

```javascript
var todoStore = hoodie.store('todo');

function markAsCompleted(todo) {
  // mark a todo as completed and trigger a custom completed event
  todo.completed = true;
  todoStore.trigger('todo:completed', todo, new Date());
}

todoStore.on('todo:completed', function(completedTodo, completionDate) {
  console.log(completedTodo.title, ' was completed on ', completionDate);
});

todoStore.findAll().done(function(allTodos) {
  // Find all todos, take the first one,
  // and mark it as completed
  markAsCompleted(allTodos[0]);
});

```

**Important**: if you register an event handler with a scoped store, as in **hoodie.store('todo').on()**,  a generic **hoodie.store.trigger()** will not reach that scoped store listener. The example will make it clearer:

#### Using trigger() with Scoped Stores

```javascript
var todoStore = hoodie.store('todo');

todoStore.on('trigger-test', function(num) {
  // will not be called by the first trigger
  console.log('triggered by', num);
});

// Will not work
hoodie.store.trigger('trigger-test', 'number 1');
// Works
todoStore.trigger('trigger-test', 'number 2');
// Also works
hoodie.store('todo').trigger('trigger-test', 'number 3');

```

<a id="request"></a>
### [request()](#request)

**version:**      *> 0.2.0*

**Sends a request**

```javascript
hoodie.request(type, url, options);
```

| option     | type     | description                                | required |
|:---------- |:-------- |:------------------------------------------ |:-------- |
| type       | string   | http verb, e.g. get, post, put or delete   | yes      |
| url        | string   | relative path or absolute URL.             | yes      |
| options    | object   | compare <a href="http://api.jquery.com/jquery.ajax/" target="_blank">http://api.jquery.com/jquery.ajax</a> | no       |


##### Example
```javascript
hoodie.request('get', 'http://example.com/something')
  .done(renderSomething)
  .fail(handleError);

```


<a id="open"></a>
### [open()](#open)

**version:**      *> 0.2.0*

**Interacts with a remote database**

```javascript
hoodie.open('db-name');
```

Use this to connect to a database other than the current user's database, which is the default behaviour. This could, for example, be a public, read-only database containing global config data for your app, or a public chatroom for logged-in users, or some similar store with shared information.

Hoodie doesn't natively provide a way to make these (it only gives you the user databases), but you could use this in conjunction with [plugins](/en/plugins/) or some other server-side code.

| option     | type     | description            | required |
|:---------- |:-------- |:---------------------- |:-------- |
| name       | string   | name of the database   | yes      |


##### Example
```javascript
var chat = hoodie.open('chatroom');
chat.findAll('message')
  .done(renderMessages)
  .fail(handleError);

```


<a id="checkConnection"></a>
### [checkConnection()](#checkConnection)

**version:**      *> 0.2.0*

**Sends request to the Hoodie Server to check if it is reachable**

```javascript
hoodie.checkConnection();
```

Returns a promise. On **fail()**, it will include an error object with details.

##### Example
```javascript
hoodie.checkConnection()
  .done(renderGreenLight)
  .fail(renderRedLight);

```


<a id="isConnected"></a>
### [isConnected()](#isConnected)

**version:**      *> 0.2.0*

**Returns true if Hoodie backend can currently be reached, otherwise false**

```javascript
hoodie.isConnected();
```

##### Example
```javascript
if (hoodie.isConnected()) {
  alert('Looks like you are online!');
} else {
  alert('You are offline!');
}

```


<a id="extend"></a>
### extend()

**version:**      *> 0.2.0*

**Extend the hoodie API with new functionality**

```javascript
hoodie.extend(plugin);
```

| option     | type     | description                                                             | required |
|:---------- |:-------- |:----------------------------------------------------------------------- |:-------- |
| plugin     | function | extend the frontend API with whatever logic your plugin wants to expose | yes      |

Used when writing Hoodie plugins, gives you the means to extend the frontend API of Hoodie to expose methods to use your plugin. [Check out this detailed guide to writing your own plugins](/en/plugins/tutorial.html).

##### Example
```javascript
hoodie.extend(function(hoodie, lib, util) {
  hoodie.sayHi = function() {
    alert('say hi!');
  };
});

hoodie.sayHi(); // shows alert

```


## Onward!

Now head on over to the exciting stuff: the [account](/en/techdocs/api/client/hoodie.account.html) and [store](/en/techdocs/api/client/hoodie.store.html) docs! Learn how to sign up users and let them store data, any many other cool things.

We hope this API guide was helpful! If not, please let us help you <a href="http://hood.ie/chat" target="_blank">on IRC or Slack</a>.

We also have an <a href="http://faq.hood.ie" target="_blank">FAQ</a> that could prove useful if things go wrong.

If you find this guide in error or out of date, you could also <a href="https://github.com/hoodiehq/documentation/issues" target="_blank">open an issue</a> or submit a pull request with your corrections to <a href="https://github.com/hoodiehq/documentation/blob/gh-pages/en/techdocs/api/client/hoodie.md" target="_blank">this file</a>.
