---
layout: layout-api
locales: en
---
# hoodie.store
**version:**      *> 0.1.0* <br>
**source:**       *[hoodie.js/src/hoodie/store](https://github.com/hoodiehq/hoodie.js/tree/master/src/hoodie/store)*

If you want to do anything with data in Hoodie, this is where it happens.

**After reading this guide, you will know how to:**

- add objects
- find objects
- update objects
- remove objects
- react to objects changing

## Introduction

One of the core features of any web app is being able to store and retrieve data, and **hoodie.store** is your toolkit for any of these data-related operations. Hoodie is a bit special in that every user has their own private data store, which is private by default and syncs automatically between the users' clients and the server. Initially, your app will have no way to make data global or share it between users, but this functionality will be provided via [plugins](/en/plugins/). What it will do, however, is make sure each user's data is always synced between devices, and make sure all user data is available in the client for offline use.

#### Things you should know before continuing

If you haven't read up on how Hoodie works under the hood (sorry) and does all your data syncing, then [now would be a good time](/en/hoodieverse/how-hoodie-works.html). It's just a high-level guide that helps you understand the basic architecture and capabilities of Hoodie.

It is also important to understand the [concept of type in Hoodie](/en/tutorials/#understanding-type), since it informs nearly all operations with data.

Storing and accessing objects with Hoodie always means accessing your personal, local objects.

All stored objects have a fixed association to the user who created them. So you won't be able to access other users' objects by default.

In order to automatically sync objects to the server's store, you need to be logged in with a valid user. Learn more about the Hoodie user system at [**hoodie.account**](./hoodie.account.html).

<a id="top"></a>

### Methods

- [store.add()](#storeadd)
- [store.find()](#storefind)
- [store.findOrAdd()](#storefindoradd)
- [store.findAll()](#storefindall)
- [store.update()](#storeupdate)
- [store.updateOrAdd()](#storeupdateoradd)
- [store.updateAll()](#storeupdateall)
- [store.remove()](#storeremove)
- [store.removeAll()](#storeremoveall)
- [store.on()](#storeon)
- [store()](#store)

### Events
- [add](#add)
- [update](#update)
- [remove](#remove)
- [change](#change)
- [clear](#clear)

<a id="storeadd"></a>
### [store.add()](#storeadd)
**version:**      *> 0.2.0*

**Creates a new object in your local store.**

```javascript
hoodie.store.add(type, properties, options);
```

| option     | type   | description               | required |
|:---------- |:------ |:------------------------- |:-------- |
| type       | String | type of the object        | yes      |
| properties | Object | object properties to save | yes      |
| options.silent | Boolean  | If set to **true**, no events will be triggered from this call | no (default: false) |

If **properties.id** is set, it will be used as the object's id, otherwise the id will be generated automatically.

Returns a promise. If successful, it calls the **done** callback and passes in the new object. Hoodie will have added some additional properties: (*id* (unless you set it before), *createdBy*, *createdAt*, *updatedAt*). If something goes wrong, the **fail** callback will be called instead, and an error object passed in.

#### Example

```javascript
hoodie.store.add('todo', { title: 'Getting Coffee' })
	.done(function(todo) { /* success handling */ })
	.fail(function(error) { /* error handling */ });
```

<a id="storefind"></a>
### [store.find()](#storefind)
**version:**      *> 0.2.0*

**Searches the store for a stored object with a particular *type* and *id*.**

```javascript
hoodie.store.find(type, id);
```

| option     | type   | description               | required |
|:---------- |:------ |:-------------------------:|:--------:|
| type       | String | type of the object        | yes      |
| id         | String | id of the object to find  | yes      |

Returns a promise. If the object can be found, it calls the **done** callback and passes the object in.
If not, or if something else goes wrong, the **fail** callback will be called with the corresponding error.

#### Example

```javascript
hoodie.store.find('todo', 'hrmvby9')
	.done(function(todo) { /* success handling */ })
	.fail(function(error) { /* error handling */ });
```

<a id="storefindoradd"></a>
### [store.findOrAdd()](#storefindoradd)
**version:**      *> 0.2.0*

**A convenient combination of hoodie.store.find and hoodie.store.add.** Use this if you would like to work with a specific store object, but are unsure whether it already exists or not.

```javascript
hoodie.store.findOrAdd(type, id, properties, options);
```

| option     | type   | description                                 | required |
|:---------- |:------ |:------------------------------------------- |:-------- |
| type       | String | type of the object                          | yes      |
| id         | String | id of the object to find                    | no       |
| properties | Object | object to be created if no entry matches id | yes      |
| options.silent | Boolean  | If set to **true**, no events will be triggered from this call | no (default: false) |

Returns a promise. If the object is found, calls the **done** callback and passes the object in.
If not, an object with the specified **id** and **properties** is created. If something goes completely wrong, the **fail** callback will be called with the corresponding error.

A use case would be a config object for each user. If it already exists, you'll want to use that, but if it doesn't, you'll probably want to set some defaults.

#### Example

```javascript
var configDefaults = {
  language: 'en/en',
  appTheme: 'default'
};
var configId  = 'config';

hoodie.store
.findOrAdd('config', configId, configDefaults)
.done(function(userConfig) {
	console.log('Configuration for this user:', userConfig);
});
```

#### Notes
The **properties** parameter has no influence on the search itself. The only properties the
store will be searched for are the document's **type** and **id**.

<a id="storefindall"></a>
### [store.findAll()](#storefindall)
**version:**      *> 0.2.0*

**Retrieves all objects of a particular *type* from the store.**

```javascript
hoodie.store.findAll(type);
```

| option     | type   | description       | required |
|:---------- |:------ |:----------------- |:-------- |
| type       | String | type of the object| yes      |


##### Example

If you have a todo list app and you want to fetch all todo objects, this is what you'd use:

```javascript
hoodie.store.findAll('todo')
  .done(function(allTodos) {
    console.log(allTodos.length + ' todos found.');
  })
```

**findAll** also accepts a function as an argument. If that function returns true for an object in the store, it will be returned. **This effectively lets you write complex queries for the store.** In this simple example, assume all of our todo tasks have a key **status**, and we want to find all unfinished tasks:

```javascript
hoodie.store.findAll(function(object){
  if(object.type === "todo" && object.status === "open"){
    return true;
  }
}).done(function (unfinishedTodos) {
    console.log(allTodos.length + ' unfinished todos found.');
});
```

<a id="storeupdate"></a>
### [store.update()](#storeupdate)
**version:**      *> 0.2.0*

**Changes the passed attributes of an existing object, if it exists.**

```javascript
hoodie.store.update(type, id, changedProperties, options)
hoodie.store.update(type, id, updateFunction, options)
```

| option            | type   | description                         | required |
|:----------------- |:------ |:----------------------------------- |:-------- |
| type              | String | type of the object                  | yes      |
| id                | String | id of the target object             | no       |
| changedProperties | Object | new object values                   | no*      |
| updateFunction    | String | callback that gets called with the current properties. Must return new object. | no*  |
| options.silent    | Boolean  | If set to **true**, no events will be triggered from this call | no (default: false) |

__*__ The third parameter is required, but can be either **changedProperties**, which is an object containing changed properties, or **updateFunction**, which is a function that receives, modifies, and then returns the object.

Returns a promise. When object can be found, it gets updated and then
passed to the **done** callback. If it cannot be found or something goes
wrong, the **fail** callback gets called if an according error.

#### Example

Updating an object by passing an object with changed (or new) properties:

```javascript

/*
Assume the following 'todo' object:

{
  type:'todo',
	id:'abc456',
	title: 'Start learning Hoodie',
	done: false,
	dueDate: 1381536000
}
*/

hoodie.store('todo')
  .update('todo', 'abc4567', { done: true })
  .done(function(newTodo) {})
  .fail(function(error) {})
```

The **update** methods also accept a function instead of an object with changed properties, so you can manipulate existing values. This is useful when you're applying calculations to data or performing conditional updates. It will come in most handy when used with **hoodie.store.updateAll**.

#### Example

A store update with an update function instead of a properties object:

```javascript
hoodie.store.update('todo', 'abc456', function(todo) {
    // Apply update only if condition matches
    if( Math.random() > 0.5) {
      // set dueDate to right now
      todo.dueDate = Date.now();
    }
  })
  .done(function(newTodo) {})
  .fail(function(error) {})
```

<a id="storeupdateoradd"></a>
### [store.updateOrAdd()](#storeupdateoradd)
**version:**      *> 0.2.0*

**Updates an object with the passed properties or creates a new one if it doesn't exist.**

```javascript
hoodie.store.updateOrAdd(type, id, updateObject, options);
```

| option         | type    | description              | required |
|:-------------- |:------- |:------------------------ |:-------- |
| type           | String  | type of the object       | yes      |
| id             | String  | id of the target object  | yes      |
| updateObject   | Object  | new object values        | yes      |
| options.silent | Boolean | If set to **true**, no events will be triggered from this call | no (default: false) |

As with **store.findOrAdd()**, this is useful if you don't know whether your target object actually exists yet and you don't want to waste time checking first.

Returns a promise. If successful, it calls the **done** callback with the updated or new object stored with updated or new properties added to it (*id*, *createdBy*, *createdAt*, *updatedAt*). If something
goes wrong, the **fail** callback will be called instead and an error gets passed.

You could, technically, pass a function in place of the updateObject, and it will work as it does for **store.update()** and **store.updateAll()**, *but only if the object with the specified id exists*. If it doesn't, you'll generate an empty and useless object, because your update function has nothing to work with, and will therefore return nothing.

#### Example

```javascript
hoodie.store.updateOrAdd('userconfig', 'config', {
    language: 'de/de'
  })
  .done(function(configObject) {
  	console.log('Config saved: ', configObject);
  })
  .fail(function(error) {
    console.log('An error occurred: ', error);
  });
```

<a id="storeupdateall"></a>
### [store.updateAll()](#storeupdateall)
**version:**      *> 0.2.0*

**Updates all objects of a type at once**

```javascript
hoodie.store.updateAll(type, updateObject, options);
```

| option            | type    | description             | required |
|:----------------- |:------- |:----------------------- |:-------- |
| type              | String  | type of the object      | yes      |
| changedProperties | Object  | new object values       | no*      |
| updateFunction    | String  | callback that gets called with the current properties. Must return new object. | no*  |
| options.silent    | Boolean | If set to **true**, no events will be triggered from this call | no (default: false) |

__*__ The second parameter is required, but can be either **changedProperties**, which is an object containing changed properties, or **updateFunction**, which is a function that receives, modifies, and then returns the object.

#### Example

Mark all todos as completed

```javascript
hoodie.store.updateAll('todo', {
    done: true
  })
  .done(function(allTodos) {
  	console.log('Marked all todos as done', allTodos);
  });
```

<a id="storeremove"></a>
### [store.remove()](#storeremove)
**version:**      *> 0.2.0*

**Removes a single object from store**

```javascript
hoodie.store.remove(type, id, options);
```

| option     | type   | description                | required |
|:---------- |:------ |:-------------------------- |:-------- |
| type       | String | type of the object         | yes      |
| id         | String | id of the object to remove | yes      |
| options.silent | Boolean  | If set to **true**, no events will be triggered from this call | no (default: false) |

Returns a promise. When successful, the removed objects gets
passed to the **.done()** callback. If something goes wrong,
the **.fail()** callback gets called instead.

#### Example

```javascript
hoodie.store.remove('todo', 'abc456')
	.done(function(removedTodo) {})
	.fail(function(error) {});
```

<a id="storeremoveall"></a>
### [store.removeAll()](#storeremoveall)
**version:**      *> 0.2.0*

**Deletes all objects of the specified *type* from a user's store.**

```javascript
hoodie.store.removeAll(type, options);
```

| option         | type     | description        | required |
|:-------------- |:-------- |:------------------ |:-------- |
| type           | String   | type of the object | yes      |
| options.silent | Boolean  | If set to **true**, no events will be triggered from this call | no (default: false) |

Returns a promise. When successful, the removed objects get
passed to the **.done()** callback. If something goes wrong,
the **.fail()** callback gets called instead.

#### Example
```javascript
hoodie.store.removeAll('todo')
  .done(function(removedTodos) {})
  .fail(function(error) {})
```

<a id="storeon"></a>
### [store.on()](#storeon)
**version:**      *> 0.2.0*

**Adds a callback to store events.**

```javascript
hoodie.store.on(event, handler);
```

| option  | type     | description       | required |
|:------- |:-------- |:----------------- |:-------- |
| event   | String   | name of the event | yes      |
| handler | Function | Function that gets called each time the passed event occurs in store | yes |

Returns undefined.

Allows you to attach listeners to the store, so your interface can react to changing data. Highly relevant when building properly decoupled frontends, [as explained here](/en/tutorials/#updating-the-view), which will fully unlock the offline and cross-device syncing benefits of Hoodie.

**Important:** if you haven't yet, please read [the general guide to Hoodie events and their naming syntax](/en/techdocs/api/client/hoodie.html#on) to better understand how events are handled. This page also describes the [one()](/en/techdocs/api/client/hoodie.html#one) and [off()](/en/techdocs/api/client/hoodie.html#off) methods for attaching a one-time listener, and for detaching all listeners.

#### Example

Shows a different notification depending on whether a new note or todo has been added:

```javascript
hoodie.store.on('add', function(newObject) {
  if (newObject.type === 'todo') {
    showNewTodoAddedNotification();
  }
  if (newObject.type === 'note') {
    showNewNoteAddedNotification();
  }
});
```

You could also solve this with more specific listeners, one for each **type**:

```javascript
hoodie.store.on('todo:add', showNewTodoAddedNotification);
hoodie.store.on('note:add', showNewNoteAddedNotification);
```

<a id="store"></a>
### [store()](#store)
**version:**      *> 0.2.0*

**Creates a so-called *scoped store* instance that is scoped by *type*, or by *type* and *id*.**

```javascript
hoodie.store(type, id);
```

| option     | type   | description        | required |
|:---------- |:------ |:------------------ |:-------- |
| type       | String | type of the object | yes      |
| id         | String | index of store obj | no       |

It is quite likely that your application will have more than one type of store object, and at some point you'll want to stop fiddling with specifying object types all the time. **Scoped stores** provide a handy shortcut to the **hoodie.store** methods, pre-scoped to a specific object **type**, or even a specific object (when you pass in an **id**).

This means you can use **hoodie.store** methods directly on objects created with **hoodie.store()**.


#### Example

Usually you'd do something like this in your todo app:

```javascript
hoodie.store.add('todo', { title: 'Getting Coffee' })
.done(function () {
  hoodie.store.findAll('todo')
  .done(function(allTodos) { /* … */ })
})
```

Now, the following example uses a scoped store. Note that we've omitted the *type* parameter in the **add()** and **findAll()** calls, because it's implicit: the store is scoped to the **todo** type, there's only objects of that type in there.

```javascript
var todoStore = hoodie.store('todo');

todoStore.add({ title: 'Getting Coffee' })
.done(function(){
  todoStore.findAll()
  .done(function(allTodos) { /* … */ });
})
```

The benefits of this variant might not be super convincing at first glance, but apart from being more concise and DRYer, it's also less error prone: imagine fumbling the **type** of an **add()** function, and adding a bunch of **todo** objects by accident. Your app would continue to save the todos without errors, but they wouldn't show up in your interface, since your **on()** handlers only listen for the correctly-written type. You'd probably assume something was wrong with the display code, and go off bug-hunting in the completely wrong place.

As mentioned, you can also have store scoped to a single object, like so:

```javascript
var userConfig = hoodie.store( 'userConfig', 'config' );
```

**Important:** For a call like this, only a minimal subset of functions will be available on the created store context. You won't be able to call any method whose purpose is to target more than one stored object (ie. **findAll()**). Because that wouldn't make any sense.

## Store Events

**Important:** if you haven't yet, please read [the general guide to Hoodie events and their naming syntax](/en/techdocs/api/client/hoodie.html#on) to better understand how events are handled.

<a id="add"></a>
### [add](#add)
**version:**      *> 0.2.0*

**Is triggered when a new object has been added to the store.**

```javascript
hoodie.store.on('add', function(newObject) {});
```

The **add** event is triggered for any object that gets added to the user's store. If you want to react to new objects of a certain **type** only, you can prefix the event identifier with **type:add**, like so:

```javascript
hoodie.store.on('todo:add', function(newTodoObject) {});
```
<a id="update"></a>
### [update](#update)
**version:**      *> 0.2.0*

**Is triggered when an existing object has been updated.**

```javascript
hoodie.store.on('update',
    function(updatedObject){});
```

The **update** event is triggered for any object that gets updated in the user's store. If you want to react to objects of a certain **type** only, you can prefix the event identifier with **type:update**:

```javascript
hoodie.store.on('todo:update',
    function(updatedTodoObject) {});
```

If you are interested in updates to one specific object, you can specify an event identifier with an object id, like so:

```javascript
// config is the type, userconfig is the id
hoodie.store.on('config:userconfig:update',
  function(updatedUserConfig) {});
```
This listens to changes to a single object with the id **userconfig**, so when the user changes their UI font to Comic Sans, you can react immediately, and display an insult.


<a id="remove"></a>
### [remove](#remove)
**version:**      *> 0.2.0*

**Is triggered when an existing object has been removed.**

```javascript
hoodie.store.on('remove',
  function(removedObject){});
```

The **remove** event is triggered for any object that gets removed from the user's store. If you want to react to objects of a certain type only, you can prefix the event identifier with **type:remove**, like this:

```javascript
hoodie.store.on('todo:remove',
  function(removedTodoObject) {});
```

If you are interested in listening for one specific object's removal only, you can pass the object id into the event identifier:

```javascript
// config is the type, userconfig is the id
hoodie.store.on('config:userconfig:remove',
  function(removedUserConfig) {});
```

<a id="change"></a>
### [change](#change)
**version:**      *> 0.2.0*

**Is triggered when an existing object has been changed.**

```javascript
hoodie.store.on('change',
  function(eventName, changedObject){});
```

The **change** event is triggered for any object that gets *changed* in the user's store. The **eventName**, passed as the first parameter to the handler, is either **add**, **update** or **remove**. If you want to react to objects of a certain type only, you can prefix the event identifier with **type:change**:

```javascript
hoodie.store.on('todo:change',
  function(eventName, changedTodoObject) {});
```

If you are interested in one specific object only, you can also prefix the event identifier with **type:id:remove**:

```javascript
// config is the type, userconfig is the id
hoodie.store.on('config:userconfig:remove',
  function(eventName, removedUserConfig) {});
```

<a id="clear"></a>
### [clear](#clear)
**version:**      *> 0.2.0*

**Is triggered when the local store gets cleared entirely.**

```javascript
hoodie.store.on('clear', function(){});
```

The **clear** event is triggered when a user signed out, or called **hoodie.account.destroy()**. It is also triggered when the user signs in, to clear any existing local objects before loading the objects from the account the user signed into.

Note that no **remove** event is triggered when the store gets cleared, as the objects do not necessarily get removed from the user's account, but only from the local cache.

## Next Steps

Wow, excellent, you've reached the end of the core docs! The next logical step would be to [find out about Hoodie plugins](/en/plugins/). Have fun!

We hope this API guide was helpful! If not, please let us help you <a href="http://hood.ie/chat" target="_blank">on IRC or Slack</a>.

We also have an <a href="http://faq.hood.ie" target="_blank">FAQ</a> that could prove useful if things go wrong.

If you find this guide in error or out of date, you could also <a href="https://github.com/hoodiehq/documentation/issues" target="_blank">open an issue</a> or submit a pull request with your corrections to <a href="https://github.com/hoodiehq/documentation/blob/gh-pages/en/techdocs/api/client/hoodie.store.md" target="_blank">this file</a>.
