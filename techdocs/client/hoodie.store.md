# Hoodie.Store

*Source: hoodie/src/lib/store/scoped.js*

This class defines the API that `hoodie.store` (local store) and `hoodie.open` 
(remote store) implement to assure a coherent API. It also implements some
basic validations.

// TOOD add simple exmaple that shows basic usage, like we have on the website

## // TODO headline that explains stores are per-user

Hoodie Store works per-user. Storing data happens within a single user's context. All data you store into a particular instance of a store is only ever accessible by the user associated with the store.

The store is automatically synced with the Hoodie backend. It can be shared between different devices that log into Hoodie as the same user. Other users never explicitly see this data. To share data with other users or the public, see “Sharing Data” below.

The objects you save with the `hoodie.store` are saved to your browser's local data storage. This is one of the most important key concepts of Hoodie itself. Otherwise we would yet have still very limited possibilities to build offline first applications. Since Hoodie is also designed to also store data on the server side, there has to be a sync. Currently hoodie uses a custom sync solutoin to achieve this. In future releases, we will make use of [PouchDB](http://pouchdb.com).

Please note that generally, in order save objects to the server's store, you need to be logged in with a valid user. Learn more about the hoodie user system at [`Hoodie.User`](./hoodie.user.md).


### Scoped Stores

The returned API can be called as function returning a store scoped by the 
passed type, for example

<pre>
var todoStore = hoodie.store('todo');
    
todoStore.findAll().then(showAllTasks);
todoStore.update('id123', {done: true});
</pre>

// TODO: explain was “scoped store” means


### Sharing Data

There are a number of [Hoodie Plugins](http://) that allow for various types of fine-grained data sharing. Each one offers a different level of data privacy:

* [hoodie-plugin-shares](https://github.com/hoodiehq/hoodie-plugin-shares) share particular store objects, with particular rights to particular people. Also can invite people by mail.
* [hoodie-plugin-global-share](https://github.com/hoodiehq/hoodie-plugin-global-share) shares particular store objects to all people within the same application.
* [hoodie-plugin-punk](https://github.com/olizilla/hoodie-plugin-punk) share just everything to everyone within the same application.

**Attention!** Please note that most of these are community contributions and may have flaws or are just outdated. Always feel free to adopt an ophaned plugin of contribute your own.



## The General `options` Parameter

Most of the `hoodie.store` functions come with an `options` parameter, that is always passed as last parameter of a function call. This parameter was created to pass optional configurations to the certain function call. Like the following.

<pre>
  hoodie.store('todo').remove(id, {silent: true})
</pre>

The options that are available for most of these methods are listed below. For details on `options` parameters of particular functions, please see the section of the particular function itself.

| Option        | Values           | Default | Description  |
| ------------- |:----------------:| -------:| ------------:|
| silent        | `true`, `false`  | false   | If set to `true`, this will stop the triggers from sending events about store changes. Otherwise the store informs all listeners, when events like adding or removing a data object occurs. Using the silent option might be interesting in cases you don't want to inform the event listeners about store changes. For instance when setting up the store for the first time or just storing application irrelevant meta/configuration data. |



## Methods


### save

`hoodie.store.save(type, _id_, properties)`

Creates or replaces an an eventually existing object in the store, that is of the same `type` and the same `id`.

When the `id` is of value *undefined*, the passed object will receive an automatically generated id.

**IMPORTANT**: If you want to just to partially update an existing object, please see `hoodie.store.update(type, id, objectUpdate)`. The method `hoodie.store.save` will completely replace an existing object.

<pre>
var todoStore = hoodie.store('todo');

// this will create a new todo
todoStore.save(undefined, {title: 'Getting Coffee', done: false });
todoStore.save('abc4567', {title: 'Still Getting Coffee', done: false });
</pre>

### add

`hoodie.store.add(type, properties)`

Creates a new entry in the store. It is the shorter version of a complete save. This means you can not pass the id of an existing property. In fact `hoodie.store.add` will force `hoodie.store.save` to create a new object with the passed object properties of the `properties` parameter.

// NOTE: I don’t understand the difference between save() and add()

<pre>
hoodie.store
  .add('todo', { title: 'Getting Coffee' })
  .done(function(todo) { /* success handling */ });
  .fail(function(todo) { /* error handling */ });
</pre>

### find

`hoodie.store.find(id)`

Searches the store for a stored object with a particular `id`. Returns a promise so success and failure can be handled. A failure occurs for example when no object

// TODO: unfinished sentence, what is an error condition? Is no-results an error condition?

<pre>
hoodie.store('todo')
  .find('hrmvby9')
  .done(function(todo) { /* success handling */ });
  .fail(function(todo) { /* error handling */ });
</pre>

### findOrAdd

`hoodie.store.findOrAdd(type, id, properties)`

This is a convenient combination of hoodie.store.find and hoodie.store.add. Use can
use if you would like to work with a particular object, of which you don't know whether it exists. Which cases would be worth using this? 
Well for example if you want to read a particular settings object, you want to 
work with in a later step.

<pre>
// pre-conditions: You already read a user's account object.
var configBlueprint = { language: 'en/en', appTheme: 'default' };
var configId        = account.id + '_config';

hoodie.store
  .findOrAdd('custom-config', configId, configBlueprint)
  .done(function(appConfig) { 
    console.log('work with config', appConfig) 
  });
</pre>

hoodie.store.findOrAdd takes three arguments here. All of them are required.

 * `type`       => The kind of document you want to search the store for.
 * `id`         => The unique id of the document to search the store for.
 * `properties` => The blueprint of the document to be created, in case nothing could be found.

The important thing to notice here is, that the `properties` parameter has no 
influence on the search itself. Unlike you may have used store searches 
with other frameworks, this will **not** use the `properties` parameter 
as further conditions to match a particular store entry. The only conditions the
store will be searched for are the document `type` and `id`.

Just to demonstrates the convenience of hoodie.store.findOrAdd, the below example
illustrates the more complex alternative way of find and add:

<pre>
// IMPORTANT: BAD VARIATION. USE `createOrAdd` INSTEAD
  
// pre-conditions: You already read a user's account object.
var defaultConfig = {language: 'en/en', appTheme: 'default'},
  configId      = account.id + '_config';

hoodie.store
  .find('custom-config', configId, configBlueprint)
  .done(function(appConfig) {
    console.log('work with config', appConfig);

    if(appConfig === undefined) {
      hoodie.store
        .add('custom-config', bluePrint)
        .done(function(newConfig) {
          // work with the newConfig here
        });
            }
  });
        
// IMPORTANT: BAD VARIATION. USE `createOrAdd` INSTEAD
</pre>

### findAll

`hoodie.store.findAll(type)`
`hoodie.store(type).findAll()`

With this you can retrieve all objects of a particular `type` from the store. Todos for instance. Given, that you already have existing todo objects stored, you can retrieve all of them like in the following example.

<pre> 

var todoStore = hoodie.store('todo');

todoStore
    .findAll()
    .then(function(allTodos) {
        allTodos.forEach(function(oneTodo) {
            console.log('found', oneTodo);
        });
    })
    .done(function() {
        console.log('successfully finished findAll');
    });
    
</pre>

What you really have to recognized here is that there is a mayor difference between the methods `then` and `done`. While `done` suggests that you can handle all the retrieved objects with it, actually it is `then` where `findAll` will deliver your data to. `done` on the other hand gets called when all other `then` calls have been passed. This allows you to use your found objects in multiple ways at once:

<pre>
var todoStore = hoodie.store('todo');

console.log(todoStore.findAll());

todoStore
    .findAll()
    .then(function(allTodos) {
        // get an array with all things 
        // you have on your todo list
        return allTodos.map(function(todo) {
           return todo.title;
        });
    })
    .then(function(titles) {
        // print out all the things you have todo
        titles.forEach(function(title) {
            console.log('You have to => ', title);
        });
    })
    .done(function() {
        // this gets called on the end
        console.log('successfully finished findAll');
    });
</pre>

There aren't any [callback closure functions](http://), like many other JavaScript libraries use to work with asynchronous flows. Hoodie uses so called **promises** to handle async flows. If you would like to now more about promises in hoodie, please see the [Hoodie promises Section](http://) for further details.

### update

`hoodie.store.update(type, id, properties)`
`hoodie.store.update(type, id, updateFunction)`
`hoodie.store(type).update(id, properties)`
`hoodie.store(type).update(id, updateFunction)`

In contrast to `.save`, the `.update` method does not replace the stored object,
but only changes the passed attributes of an existing object, if it exists. By this you are able to just update particular parts/attributes of your object. This is great for updating objects that are very large in bytes.

<pre>
// Example for store updates 
// using JavaScript plain objects as update parameter.
//
// A todo object could look like this:
//
// {  
//  id:'abc4567',
//  title: 'Start learning Hoodie', 
//  done: false,
//  dueDate: 1381536000
// }

var todoStore = hoodie.store('todo');

todoStore
    .findAll()
    .then(function(allTodos) {
        // just pick the first todo we can get
        var originTodo = allTodos.pop();

        console.log(originTodo.id, '=>', originTodo.dueDate)

        // update the picked todo and update it's dueDate to now
        todoStore
            .update(originTodo.id, { dueDate:(Date.now()) })
            .then(function(updatedTodo) {
                // beyond this point, please work with updatedTodo
                // instead of the originTodo, because originTodo 
                // is outdated.
                console.log(updatedTodo.id, '=>', updatedTodo.dueDate);
            });

        // update the picked todo and update it's dueDate to now
        todoStore
            .update('ID DOES NOT EXIST', { dueDate:(Date.now()) })
            .then(function(updatedTodo) {
                console.log('will never happen.');
            })
            .fail(function(error) {
                console.log('the update failed with', error);
            });
    });
</pre>

The example updates the todo object, which owns the `dueDate` of the first found todo object to `Date.now()`, which is the timestamp of right now. Every other attribute stays the same.

Further the example contains another example where we try to update an object, whose ID does not exist. This shall demostrate, how you can handle errors during updates. 

The `update` methods have a certain speciality. Beside that you can pass a plain JavaScript object with attributes updates, you can also pass a function, that manipulates the the object matched by the given `id`.

Cases when this advantage can be very useful are applying calculations or for conditioned updates. This will come mist handy when combined with `hoodie.store.updateAll`.

<pre>
// example for store updates 
// using functions as update parameter

var todoStore = hoodie.store('todo');

todoStore
    .findAll()
    .then(function(allTodos) {
        // just pick the first todo we can get
        var originTodo = allTodos.pop();

        todoStore.update(originTodo.id, function(oneTodo) {

            // Apply update only if conditions matches.
            if( Math.random() > 0.5) {
                // set dueDate to: right now
                oneTodo.dueDate = Date.now();
            }

            return oneTodo;
        }).then(function(updatedTodo) {
            console.log('update success', updatedTodo);
        }).fail(function(error) {
            console.log('failed update with', error);
        });

    });
</pre>

### updateAll

`hoodie.store.updateAll(updateObject)`
`hoodie.store(type).updateAll(updateObject)`

Update all will update all your objects of a specific store. The changes to be applied are defined by an update object. Just configure the specific attributes to the values the way you want to have your objects updated.

<pre>
var todoStore = hoodie.store('todo'),
    objectUpdate = {done: true};

todoStore
  .updateAll(objectUpdate)
  .then(function(updates) {
    console.log('the following todos are done', updates);
  });
</pre>

Like with `hoodie.store.update` you can pass an update function instead of an update object. So if you want update only a particular set of store objects, passing an update function is your friend. This is what comes close to a WHERE clause you may probably now from SQL. When using an update function to modify stored data, please make sure, to return the updated object at the end of the update function.

<pre>
var todoStore  = hoodie.store('todo'),
  updateFunc = function(todo) {
    if(todo.done != true) {
      todo.done = true;
    }
    
    return todo;
  };

todoStore
  .updateAll(updateFunc)
  .then(function(updates) {
    console.log('the following todos are done', updates);
  });
</pre>

### remove

`hoodie.store.remove(id)`
`hoodie.store(type).remove(id)`

This simple deletes one entriy of the defined `type` identified by it's `id` from a user's store. Please be aware that the data gets deleted immediately.

<pre>
// deletes the first found entry from the todo store

var todoStore = hoodie.store('todo'),
  todo;

todoStore
  .findAll()
  .then(function(todos) {
    var todo = todos[0];

    todoStore
      .remove(todo.id)
      .then(function(removedTodos) {
        console.log(removedTodos);
      })
      .fail(function(error) {
        console.log('Error while removing todo', error);
      });
});
</pre>

### removeAll

`hoodie.store.remove()`
`hoodie.store(type).removeAll()`

This simple deletes all entries of the defined `type` from a user's store. Please be aware that the data gets deleted immediately.

<pre>
// deletes all objects from store

var todoStore = hoodie.store('todo');

todoStore
  .removeAll()
  .then(function(removedTodos) {
    console.log(removedTodos);
});
</pre>

### on

`hoodie.store.on(event, handlerFunction)`

The `hoodie.store` informs you about several things happening with the stored objects. In order to catch those messages you can register a function for handling those events. Those functions are also called **event handlers**.

Here is a list of events `hoodie.store` emits and you can listen to:


| Event       | Example        | Description |
|-------------|----------------|------------|
| **add**        | 'todo:add'     | A new object has been added to the store.|
| **update**     | 'todo:update'  | An existing object has been updated from the store.|
| **remove**     | 'todo:add'     | An existing object has been removed from the store.|

As the above table already describes, the event messages are emitted as type `string`. Please note the format of the event message is always **type of store object** followed by a **:** and the type of the event. So if you listen to the event for a **todo* store object, you would have to listen to **todo:add**.

<pre>

hoodie.store.on('todo:add', function(createdTodo) {
  console.log('A todo has been added => ', createdTodo);
});

hoodie.store.on('todo:remove', function(removedTodo) {
  console.log('A todo has been removed => ', removedTodo);
});

hoodie.store.on('todo:update', function(updatedTodo) {
  console.log('A todo has been updated => ', updatedTodo);
});

</pre>

One of the major reasons, you usually want to get informed about store changes is, that you application can react and adapt to those changes. If you are creating a new store object with (`hoodie.store.add`)[http://] for instance, your application would want to know about that change, so it can update it's current data and views. Just calling (`hoodie.store.add`)[http://] alone will have no update effect on the displayed data. The same goes for `update` and `remove`.

The event handlers of the above examples are only expecting to be called with a single function parameter. Please note that this only applies in the example. Depending on the type of the event, it is also possible to receive two or more parameters.

If you are already familiar with the (concept of synchronization)[http://] you are probably wondering now, if those event handlers are also called when the local receives changes concerning the data store. The answer here is: Yes, the events got also emitted when sync happens.

You can also listen to custom events you trigger by yourself. See `hoodie.store.trigger` for more details on how to do that.

### one

`hoodie.store.one` is a special form of `hoodie.store.on` which will be executed only once, when the event has been caught. After that, it'll automatically unsubscribe from the event. This might be usefull in cases you want to handle an event only once. When waiting for the initial data for instance.


### trigger

`hoodie.store.trigger(event, paramOne, ..., paramN)`

Since you can listen for store events using `hoodie.store.on` or `hoodie.store.bind`, the `hoodie.store.trigger` function gives you the opportunity to send events of your own to the listeners. This includes the standard events as mentionend in the `hoodie.store.on` section as well as your personal custom events. Imagine you want to trigger an event when a todo is done. This could look something similiar to this:

<pre>
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
</pre>

There are two important things concerning the parameters:

1) The first parameter of 'hoodie.store.trigger' is usually a string that names the event. To keep the event handling sane, it is a good idea to stick to an overall convention like 'object-type:what-happened' or 'what-happened'. The event descriptor is required.

2) Starting with the second parameter you are allowed to pass an unlimited amount of detail information. This usually means you pass the object or an collection of objects, that has been changed. When you want to pass multiple objects at the same time, we encourage using an Array/Collection instead of an endless parameter list. Depending on what kind of event message you want to trigger, you have to decide yourself what details you have to pass, though it usually won't be more than just a couple. Feel completely free to decide here.

It is also very important to keep track of the the contexts you are listening and triggering on. Custom event handling is always applied per instance. So that if you register an event handler with `hoodie.store('todo').on` and trigger the event just with `hoodie.store.trigger`, the previously registered event handler is never been called.


<pre>
  var todoStore = hoodie.store('todo');
  
  todoStore.on('trigger-test', function(num) {
    // will only be called by the second trigger
    console.log('triggered by', num);
  });
  
  hoodie.store.trigger('trigger-test', 'number one');
  todoStore.trigger('trigger-test', 'number two');
  hoodie.store(hoodie).trigger('trigger-test', 'number three');
</pre>

### off

While `hoodie.store.on` subscribes an handler function to a certain event `hoodie.store.off` does the opposite and will unsubscribe all previously registered handlers for the given event.

<pre>
var todoStore = hoodie.store('todo');
todoStore.on('todo:done', function(doneTodo, t) {
  // this will never be reached, neither
});

todoStore.on('todo:done', function(doneTodo, t) {
  // this will never be reached either
});

// this unsubscribes both of the previously 
// subscribed event handlers
todoStore.off('todo:done');

todoStore.findAll().then(function(allTodos) {
  todoStore.trigger('todo:done', allTodos[0], new Date());
});
</pre>  

### store
`hoodie.store(_type_, _id_)`


It is possble, that your application will have more than one type of store object. Even if you have just a single object `hoodie.store(type)` comes handy. Say you have to work with objects of the type `todo`, you usually
do something like the following:

<pre>
hoodie.store.add('todo', { title: 'Getting Coffee' });
hoodie.store.findAll('todo').done(function(allTodos) { /* ... */ });
</pre>

The `hoodie.store` method offers you a short handle here, so you can create
designated store context objects to work with:

<pre>
var todoStore = hoodie.store('todo');

todoStore.add({ title: 'Getting Coffee' });
todoStore.findAll().done(function(allTodos) { /*...*/ });
</pre>

The benefit of this variant might not be clear at first glance. The primary benefit is, that you must set your object type only once. So in case you want to rename you object type *"todo"* to *"things-to-be-done"* in a later phase of development, you have to change this in significantly fewer areas on you application code. By this you also avoid typos by reducing the amount of occurrences, where you can make the mistake at.

Imagine having the type of *"todoo"* with a double o at the end. This would be a 
dramatic bug if it comes to storing a new todo object, because when reading all
"todo" (with single o this time) the new entries can't be found.

You can also create a very particular store, to work with access to just one specific stored object.

<pre>
var singleStore = hoodie.store( 'todo', 'id123' );
</pre>

For the call like illustrated in the last example, only a minimal subset of functions will be available on the created store context. Every method those purpose is to target more than one stored object, will be left out (f.e. findAll). This is because we already specified a particular object form the store to work with.

### validate

`hoodie.store.validate(object, _options_)`

By default `hoodie.store.validate` only checks for a valid object `type` and object `id`. The `type` as well as the `id` may not contain any slash ("/"). 
This is due to the format, hoodie stores your object into the database.
Every stored database entry has an internal identifier. It is a combination of both, formatted as *"type/id"*. Therefore it is absolutely not permitted to have a slashes in either of them.

All other characters are allowed, though it might be the best, to stick with
alphabetical characters and numbers. But you are still free to choose.

If `hoodie.store.validate` returns nothing, the passed **object** is valid. 
Otherwise it returns an **[HoodieError]<#>**.


### bind

`hoodie.store.on` is an alias for `hoodie.store.bind`. Please see `hoodie.store.on` for details.

### unbind

`hoodie.store.off` is an alias for `hoodie.store.unbind`. Please see `hoodie.store.off` for details.


## Code Example

<pre>
</pre>
