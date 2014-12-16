---
layout: layout-api
locales: de
---
# hoodie.store
**version:**      *> 0.1.0* <br />
**source:**       *hoodie/src/hoodie/store.js*<br />

***<br />after reading this you will know***
> - how to add objects
> - how to find objects
> - how to update objects
> - how to remove objects
> - how to react on object changes

## Introduction

This modules defines the API that **hoodie.store** provides to add, find,
update and remove objects. You can listen to object changes, e.g.
to update your apps user interface. **hoodie.store** is user-specific,
that means that a user can only access the objects of the current account.
It works anonymously, too. Once signed up using the **hoodie.account** api,
all objects get synchronized automatically, so it can be accessed from
different devices.

##### Notes
> - storing and accessing objects with hoodie always means accessing your personal, local objects.
> - all stored objects have a fixed association to the user who created them. So you won't be able to access other user's objects by default.
> - in order save objects to the server's store, you need to be logged in with a valid user. Learn more about the hoodie user system at [**hoodie.account**](./hoodie.account.html).


## Methods

- [store.add()](#storeadd)
- [store.find()](#storefind)
- [store.findOrAdd()](#storefindoradd)
- [store.findAll()](#storefindall)
- [store.update()](#storeupdate)
- [store.updateAll()](#storeupdateall)
- [store.remove()](#storeremove)
- [store.removeAll()](#storeremoveall)
- [store.on()](storeon)
- [store()](#store)

## Events [>>](#storeevents)
- add
- update
- remove
- change
- clear

<a id="storeadd"></a>
### store.add()
**version:**      *> 0.2.0*

Creates a new objects in your local store. If **properties.id** is set, it will be used as the object's id, otherwise it gets auto generated.

<pre><code>hoodie.store.add('type', properties, options);</code></pre>

| option     | type   | description     | required |
| ---------- |:------:|:---------------:|:--------:|
| type       | String | type of the store         | yes |
| properties | Object | object properties to save | yes |
| options.silent | Boolean  | If set to **true**, no events will be triggered from this call | no (default: false) |

Returns a promise. If succesful, it calls the **done** callback with the new object stored with new properties 
added to it (id (unless set before), createdBy, createdAt, updatedAt). If something
goes wrong, the **fail** callback will be called instead and an error gets passed.

##### Example

<pre><code>hoodie.store.add('todo', { title: 'Getting Coffee' })
	.done(function(todo) { /* success handling */ });
	.fail(function(error) { /* error handling */ });
</code></pre>

<a id="storefind"></a>
### store.find()
**version:**      *> 0.2.0*

Searches the store for a stored object with a particular **type** and **id**.

<pre><code>hoodie.store.find('type', 'id');</code></pre>

| option     | type   | description     | required |
| ---------- |:------:|:---------------:|:--------:|
| type       | String | type of the store         | yes |
| id         | String | id of the object to find  | yes |

Returns a promise. If the object can be found, it calls the **done** callback and passet it.
If not, or if something goes wrong, the **fail** callback will be called with the
according error.

##### Example

<pre><code>hoodie.store('todo').find('hrmvby9')
	.done(function(todo) { /* success handling */ });
	.fail(function(error) { /* error handling */ });
</code></pre>

<a id="storefindoradd"></a>
### store.findOrAdd()
**version:**      *> 0.2.0*

This is a convenient combination of hoodie.store.find and hoodie.store.add. You can
use this if you would like to work with a particular store object, which existence
you are not sure about yet.

<pre><code>hoodie.store.findOrAdd('type', 'id', properties, options);</code></pre>

| option     | type   | description     | required |
| ---------- |:------:|:---------------:|:--------:|
| type       | String | type of the store                           | yes |
| id         | String | id of the object to find                    | no  |
| properties | Object | object to be created if no entry matches id | yes |
| options.silent | Boolean  | If set to **true**, no events will be triggered from this call | no (default: false) |

Returns a promise. If the object can be found, it calls the **done** callback and passet it.
If not, it gets created with the passed **id** and **properties**. If something goes wrong,
the **fail** callback will be called with the according error.

Which cases would be worth using this? Well for example if you want to read a particular settings object,
ou want to work with in a later step.

##### Example

<pre><code>// pre-conditions: You already read a user's account obj.
var configBlueprint = { 
  language: 'en/en', 
  appTheme: 'default' 
};
var configId        = 'app';

hoodie.store
.findOrAdd('config', configId, configBlueprint)
.done(function(appConfig) {
	console.log('work with config', appConfig)
});
</code></pre>

##### Notes
- The **properties** parameter has no influence on the search itself.
Unlike you may have used store searches with other frameworks, this will **not** use the **properties** parameter
as further conditions to match a particular store entry. The only conditions the
store will be searched for are the document's **type** and **id**.

<a id="storefindall"></a>
### store.findAll()
**version:**      *> 0.2.0*

Retrieve all objects of a particular **type** from the store.

<pre><code>hoodie.store.findAll('type');</code></pre>

| option     | type   | description     | required |
| ---------- |:------:|:---------------:|:--------:|
| type       | String | type of the store | yes |

Todos for instance. Given, that you already have existing todo objects stored,
you can retrieve all of them like shown in the following example.

##### Example

<pre><code>hoodie.store.findAll('todo')
    .done(function(allTodos) {
        console.log(oneTodo.length + ' todos found');
    })
</code></pre>

<a id="storeupdate"></a>
### store.update()
**version:**      *> 0.2.0*

Changes the passed attributes of an existing object, if it exists.

<pre><code>hoodie.store.update('type', 'id', changedProperties)
hoodie.store.update('type', 'id', updateFunction)
</code></pre>

| option     | type   | description     | required |
| ---------- |:------:|:---------------:|:--------:|
| type           | String | type of the store                   | yes |
| changedProperties     | Object | new object values                   | no*  |
| updateFunction | String | callback that gets called with the current properties. Must return new object. | no*  |
| options.silent | Boolean  | If set to **true**, no events will be triggered from this call | no (default: false) |

<small>* The 3rd parameter is required. It must either be an object of the changed properties, or an update function as described above.
Returns a promise. When object can be found, it gets updated and then
passed to the **.done** callback. If it cannot be found or something goes
wrong, the **.fail** callback gets called if an according error. </small>

##### Example

<pre><code>/* Example for store updates 
Using JavaScript plain object as update parameter.

A todo object could look like this:

{
  type:'todo',
	id:'abc4567',
	title: 'Start learning Hoodie',
	done: false,
	dueDate: 1381536000
}
*/

hoodie.store('todo')
  .update('todo', 'abc4567', { done: true })
  .done(function(newTodo) {})
  .fail(function(error) {})
</code></pre>

The **update** methods have a certain speciality. Beside that you can pass a plain JavaScript object with attributes updates, you can also pass a function, that manipulates the the object matched by the given **id**.

Cases when this advantage can be very useful are applying calculations or for conditional updates. This will come mist handy when combined with **hoodie.store.updateAll**.

##### Example

<pre><code>/* example for store updates
using functions as update parameter
*/

hoodie.store.update('todo', 'abc4567', function(oneTodo) {
      // Apply update only if conditions matches.
      if( Math.random() > 0.5) {
          // set dueDate to: right now
          oneTodo.dueDate = Date.now();
      }

      return oneTodo;
  })
  .done(function(newTodo) {})
  .fail(function(error) {})
</code></pre>

<a id="storeupdateall"></a>
### store.updateAll()
**version:**      *> 0.2.0*

Update all your objects of a specific store.

<pre><code>hoodie.store.updateAll(type, updateObject);</code></pre>

| option     | type   | description     | required |
| ---------- |:------:|:---------------:|:--------:|
| type           | String | type of the store                   | yes |
| changedProperties     | Object | new object values                   | no*  |
| updateFunction | String | callback that gets called with the current properties. Must return new object. | no*  |
| options.silent | Boolean  | If set to **true**, no events will be triggered from this call | no (default: false) |

<small>* The 3rd parameter is required. It must either be an object of the changed properties, or an update function as described above. Returns a promise. When successful, all found and updated objects will be
passed to the **.done()** callback. If something goes wrong, the **.fail()**
callback gets called instead. </small>

##### Example

<pre><code>hoodie.store.updateAll('todo', objectUpdate)
  .done(function(updates) {
  	console.log('the following todos are done', updates);
  });</code></pre>


<a id="storeremove"></a>
### store.remove()
**version:**      *> 0.2.0*

Removes one object from store

<pre><code>hoodie.store.remove('type', 'id');</code></pre>

| option     | type   | description                | required |
| ---------- |:------:|:--------------------------:|:--------:|
| type       | String | type of the store          | yes |
| id         | String | id of the object to remove | yes |
| options.silent | Boolean  | If set to **true**, no events will be triggered from this call | no (default: false) |

Returns a promise. When successful, the removed objects gets
passed to the **.done()** callback. If something goes wrong,
the **.fail()** callback gets called instead.

##### Example

<pre><code>hoodie.store.remove('todo', 'abc4567')
	.done(function(removedTodo) {})
	.fail(function(error) {});
</code></pre>

<a id="storeremoveall"></a>
### store.removeAll()
**version:**      *> 0.2.0*

Deletes all entries of the passed **type** from a user's store.

<pre><code>hoodie.store.removeAll('type'); </code></pre>

| option         | type     | description     | required |
| -------------- |:--------:|:---------------:|:--------:|
| type           | String   | type of the store | yes |
| options.silent | Boolean  | If set to **true**, no events will be triggered from this call | no (default: false) |

Returns a promise. When successful, the removed objects gets
passed to the **.done()** callback. If something goes wrong,
the **.fail()** callback gets called instead.

##### Example
<pre><code>hoodie.store.removeAll('todo')
  .done(function(removedTodos) {})
  .fail(function(error) {})
</code></pre>


<a id="storeon"></a>
### store.on()
**version:**      *> 0.2.0*

Adds callback to store events.

<pre><code>hoodie.store.on('event', handler);</code></pre>

| option  | type     | description       | required |
| ------- |:--------:|:-----------------:|:--------:|
| event   | String   | name of the event | yes |
| handler | Function | Function that gets called each time the passed event occurs in store | yes |

Returns undefined.

##### Example
<pre><code>hoodie.store.on('add', function(newObject) {
  if (newObject.type === 'todo') {
    showNewTodoAddedNotification();
  }
  if (newObject.type === 'note') {
    showNewNoteAddedNotification();
  }
});
hoodie.store.on('todo:add', showNewTodoAddedNotification);
hoodie.store.on('note:add', showNewNoteAddedNotification);
</code></pre>

<a id="store"></a>
### store()
**version:**      *> 0.2.0*

Creates a store instance that is scoped by type, or by type &amp; id.

<pre><code>hoodie.store('type', 'id');</code></pre>

| option     | type   | description        | required |
| ---------- |:------:|:------------------:|:--------:|
| type       | String | type of the store  | yes      |
| id         | String | index of store obj | no       |

##### Example

It is most likely, that your application will have more than one type of store objects. Even if you have just a single object hoodie.store(type) comes handy. Say you have to work with objects of the type todo, you usually do something like the following:

<pre><code>hoodie.store.add('todo', { title: 'Getting Coffee' });
hoodie.store.findAll('todo')
  .done(function(allTodos) { /* ... */ });
</code></pre>

The hoodie.store method offers you a short handle here, so you can create designated store context objects to work with:

<pre><code>var todoStore = hoodie.store('todo');

todoStore.add({ title: 'Getting Coffee' });
todoStore.findAll()
  .done(function(allTodos) { /*...*/ });
</code></pre>

The benefit of this variant might not be clear at first glance. The primary benefit is, that you must set your object type only once. So in case you want to rename you object type "todo" to "things-to-be-done" in a later phase of development, you have to change this in significantly fewer areas on you application code. By this you also avoid typos by reducing the amount of occurrences, where you can make the mistake at.

Imagine having the type of "todoo" with a double o at the end. This would be a dramatic bug if it comes to storing a new todo object, because when reading all "todo" (with single o this time) the new entries can't be found.

You can also create a very particular store, to work with access to just one specific stored object.

<pre><code>var singleStore = hoodie.store( 'todo', 'id123' );</code></pre>

For the call like illustrated in the last example, only a minimal subset of functions will be available on the created store context. Every method those purpose is to target more than one stored object, will be left out (e.g. findAll). This is because we already specified a particular object form the store to work with.

<br />

<a id="storeevents"></a>
## Store Events

### add
**version:**      *> 0.2.0*

Gets triggered when a new object has been added to the store.

<pre><code>hoodie.store.on('add', function(newObject) {});</code></pre>

The **add** event gets triggered for any object get gets added to the user's store.
If you want to react to new objects of a certain type only, you can prefix
it with **type:add**, like so

<pre><code>hoodie.store.on('todo:add', function(newTodoObject) {});</code></pre>

### update
**version:**      *> 0.2.0*

Gets triggered when an existing object has been updated.

<pre><code>hoodie.store.on('update', 
    function(updatedObject){});</code></pre>

The **update** event gets triggered for any object get gets updated in the user's store. If you want to react to objects of a certain type only, you can prefix it with **type:update**, like:

<pre><code>hoodie.store.on('todo:update', 
    function(updatedTodoObject) {});</code></pre>

If you are interested into one specifc object only, you can also prefix
it with **type:id:update**, like so

<pre><code>// config is the type, app is the id
hoodie.store.on('config:app:update',  
  function(updatedAppConfig) {});</code></pre>


### remove
**version:**      *> 0.2.0*

Gets triggered when an existing object has been removed.

<pre><code>hoodie.store.on('remove', 
  function(removedObject){});</code></pre>

The **remove** event gets triggered for any object get gets removed in the user's store. If you want to react to objects of a certain type only, you can prefix it with **type:remove**, like:

<pre><code>hoodie.store.on('todo:remove', 
  function(removedTodoObject) {});</code></pre>

If you are interested into one specifc object only, you can also prefix
it with **type:id:remove**, like:

<pre><code>// config is the type, app is the id
hoodie.store.on('config:app:remove', 
  function(removedAppConfig) {});</code></pre>


### change
**version:**      *> 0.2.0*

Gets triggered when an existing object has been changed.

<pre><code>hoodie.store.on('change', 
  function(eventName, changedObject){});</code></pre>

The **change** event gets triggered for any object get gets changed in the user's store. The **eventName** gets passed as first parameter to the handler, wich is either **add**, **update** or **remove**. If you want to react to objects of a certain type only, you can prefix it with **type:change**, like:

<pre><code>hoodie.store.on('todo:change', 
  function(eventName, changedTodoObject) {});</code></pre>

If you are interested into one specifc object only, you can also prefix
it with **type:id:remove**, like:

<pre><code>// config is the type, app is the id
hoodie.store.on('config:app:remove', 
  function(eventName, removedAppConfig) {});</code></pre>


### clear
**version:**      *> 0.2.0*

Gets triggered when the local store gets cleared entirely.

<pre><code>hoodie.store.on('clear', function(){});</code></pre>

The **clear** event gets triggered when a user signed out, or called **hoodie.account.destroy()**. It gets also triggered when the user signs in, to clear up the local objects before loading the objects of the account the user signed into.

Note that no **remove** events get triggered when the store gets cleared,
as the objects do not necessarly get removed for the user's account, but
only from the local cache.
