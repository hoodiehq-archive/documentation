# hoodie.store
> **version:**      *> 0.1.0* <br />
> **source:**       *hoodie/src/hoodie/store.js*<br />

***<br />after reading this you will know***
> - how to create data
> - how to read data
> - how to update data
> - how to listen to store events

## Introduction

This modules defines the API that `hoodie.store` (local store) and `hoodie.open`
(remote store) implement to assure a coherent API. It also implements some
basic validations.

###### Notes
> - storing and accessing objects with hoodie always means accessing your personal, local objects.
> - All stored data has a fixed association to the user who created them. So you won't be able to access other user's data by default.
> - in order save objects to the server's store, you need to be logged in with a valid user. Learn more about the hoodie user system at [`hoodie.account`](./hoodie.account.md).

## The General `options` Parameter

Most of the `hoodie.store` functions come with an `options` parameter, that is always passed as last parameter of a function call. This parameter was created to pass optional configurations to the certain function call. Like the following.

```javascript
hoodie.store('todo').remove(id, {silent: true})
```

The options that are available for most of these methods are listed below. For details on `options` parameters of particular functions, please see the section of the particular function itself.

| Option        | Values           | Default | Description  |
| ------------- |-----------------| --------| -------------|
| silent        | `true`, `false`  | false   | If set to `true`, this will stop the triggers from sending events about store changes. Otherwise the store informs all listeners, when events like addig or removing a data object occurs. Using the silent option might be interesting in cases you don't want to inform the event listeners about store changes. For instance when setting up the store for the first time or just storing application irrelevant meta/configuration data. |


## Methods

- [store](#store)
- [validate](#storevalidate)
- [add](#storeadd)
- [findOrAdd](#storefindoradd)
- [findAll](#storefindall)
- [update](#storeupdate)
- [updateAll](#storeupdateall)
- [remove](#storeremove)
- [removeAll](#storeremoveall)

## Events
- [type:add](#event-typeadd)
- [type:update](#event-typeupdate)
- [type:remove](#event-typeremove)

## Deprecated
- [decoratePromises](storedecoratepromises)
- [save](#storesave)


### store()
> **version:**      *> 0.2.0*

*Creates a store instance that is scoped by type, or by type & id.*

```javascript
hoodie.store('type', 'id');
```

| option     | type   | description     | required |
| ---------- |:------:|:---------------:|:--------:|
| type       | String | type of the store  | yes   |
| id         | String | index of store obj | no    |
| options    | Object | ------------       | no    |

<br />
###### Example

It is most likely, that your application will have more than one type of store objects. Even if you have just a single object hoodie.store(type) comes handy. Say you have to work with objects of the type todo, you usually do something like the following:

```javascript
hoodie.store.add('todo', { title: 'Getting Coffee' });
hoodie.store.findAll('todo').done(function(allTodos) { /* ... */ });
```

The hoodie.store method offers you a short handle here, so you can create designated store context objects to work with:

```javascript
var todoStore = hoodie.store('todo');

todoStore.add({ title: 'Getting Coffee' });
todoStore.findAll().done(function(allTodos) { /*...*/ });
```

The benefit of this variant might not be clear at first glance. The primary benefit is, that you must set your object type only once. So in case you want to rename you object type "todo" to "things-to-be-done" in a later phase of development, you have to change this in significantly fewer areas on you application code. By this you also avoid typos by reducing the amount of occurrences, where you can make the mistake at.

Imagine having the type of "todoo" with a double o at the end. This would be a dramatic bug if it comes to storing a new todo object, because when reading all "todo" (with single o this time) the new entries can't be found.

You can also create a very particular store, to work with access to just one specific stored object.

```javascript
var singleStore = hoodie.store( 'todo', 'id123' );
```

For the call like illustrated in the last example, only a minimal subset of functions will be available on the created store context. Every method those purpose is to target more than one stored object, will be left out (e.g. findAll). This is because we already specified a particular object form the store to work with.

### store.validate()
> **version:**      *> 0.2.0*

*By default `hoodie.store.validate` only checks for a valid object `type` and object `id`. The `type` as well as the `id` may not contain any slash ("/").*

```javascript
hoodie.store.validate('type', object, options);
hoodie.store('type').validate(object, options);
```

| option     | type   | description     | required |
| ---------- |:------:|:---------------:|:--------:|
| type       | Object | data object to verify | yes |
| object     | Object | data object to verify | yes |
| options    | Object |    ------------       | no  |

<br />
###### Notes
- slashes for id or type are permitted.

All other characters are allowed, though it might be the best, to stick with
alphabetical characters and numbers. But you are still free to choose.

If `hoodie.store.validate` returns nothing, the passed **object** is valid.
Otherwise it returns an **[HoodieError]<#>**.

### store.save()
> **deprecated:**   *> 1.0*<br />
> **version:**      *> 0.2.0*

*Creates or replaces an an eventually existing object in the store, that is of the same `type` and the same `id`.*

###### Notes
- While it is still in the public API, it will be removed before 1.0, as it is destructive. Please use `store.add` and `store.update` instead.


```javascript
hoodie.store.save('type', 'id', properties, options);
hoodie.store('type').validate('id', properties, options);
```

| option     | type   | description     | required |
| ---------- |:------:|:---------------:|:--------:|
| type       | String | type of the store         | yes |
| id         | String | type of the store         | no  |
| properties | Object | object properties to save | yes |
| options    | Object |        ------------       | no  |

When the `id` is of value *undefined*, the passed object will be created from scratch.

If you want to just to partially update an existing object, please see `hoodie.store.update(type, id, objectUpdate)`. The method `hoodie.store.save` will completely replace an existing object.

<br />
###### Example

```javascript
var todoStore = hoodie.store('todo');

// this will create a new todo
todoStore.save(undefined, {title: 'Getting Coffee', done: false });
todoStore.save('abc4567', {title: 'Still Getting Coffee', done: false });
```

### store.add()
> **version:**      *> 0.2.0*

*Creates a new entry in your local store. It is the shorter version of a complete save. This means you can not pass the id of an existing property.*

```javascript
hoodie.store.add('type', properties, options);
hoodie.store('type').add(properties, options);
```

| option     | type   | description     | required |
| ---------- |:------:|:---------------:|:--------:|
| type       | String | type of the store         | yes |
| properties | Object | object properties to save | yes |
| options    | Object |        ------------       | no  |

In fact `hoodie.store.add` will force `hoodie.store.save` to create a new object with the passed object properties of the `properties` parameter.

<br />
###### Example

```javascript
hoodie.store
	.add('todo', { title: 'Getting Coffee' })
	.done(function(todo) { /* success handling */ });
	.fail(function(error) { /* error handling */ });
```

### store.find()
> **version:**      *> 0.2.0*

*Searches the store for a stored object with a particular `id`.*

```javascript
hoodie.store.find('type', 'id', options);
hoodie.store('type').find('id', options);
```

| option     | type   | description     | required |
| ---------- |:------:|:---------------:|:--------:|
| type       | String | type of the store         | yes |
| id         | String | id of the object to find  | yes |
| options    | Object |        ------------       | no  |

Returns a promise so success and failure can be handled. A failure occurs for example when no object

<br />
###### Example

```javascript
hoodie.store('todo')
	.find('hrmvby9')
	.done(function(todo) { /* success handling */ });
	.fail(function(error) { /* error handling */ });
```

### store.findOrAdd()
> **version:**      *> 0.2.0*

*This is a convenient combination of hoodie.store.find and hoodie.store.add. You can
use this if you would like to work with a particular store object, which existence
you are not sure about yet.*

```javascript
hoodie.store.findOrAdd('type', 'id', properties, options);
hoodie.store('type').findOrAdd('id', properties, options);
```

| option     | type   | description     | required |
| ---------- |:------:|:---------------:|:--------:|
| type       | String | type of the store                           | yes |
| id         | String | id of the object to find                    | no  |
| properties | Object | object to be created if no entry matches id | yes |
| options    | Object |                          ------------       | no  |

Which cases would be worth using this? Well for example if you want to read a particular settings object, you want to work with in a later step.

<br />
###### Example

```javascript
// pre-conditions: You already read a user's account object.
var configBlueprint = { language: 'en/en', appTheme: 'default' };
var configId        = account.id + '_config';

hoodie.store
	.findOrAdd('custom-config', configId, configBlueprint)
	.done(function(appConfig) {
		console.log('work with config', appConfig)
	});
```

<br />
###### Notes
> - the `properties` parameter has no influence on the search itself.

Unlike you may have used store searches with other frameworks, this will **not** use the `properties` parameter
as further conditions to match a particular store entry. The only conditions the
store will be searched for are the document's `type` and `id`.

### store.findAll()
> **version:**      *> 0.2.0*

*With this you can retrieve all objects of a particular `type` from the store.*

```javascript
hoodie.store.findAll('type');
hoodie.store('type').findAll();
```

| option     | type   | description     | required |
| ---------- |:------:|:---------------:|:--------:|
| type       | String | type of the store    | yes |
| options    | Object |   ------------       | no  |

Todos for instance. Given, that you already have existing todo objects stored, you can retrieve all of them like in the following example.

<br />
###### Example

```javascript

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

```

What you really have to recognized here is that there is a mayor difference between the methods `then` and `done`. While `done` suggests that you can handle all the retrieved objects with it, actually it is `then` where `findAll` will deliver your data to. `done` on the other hand gets called when all other `then` calls have been passed. Yes you can utilize this mechanism to work with your data in several steps.

<br />
###### Example

```javascript
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
```

There aren't any [callback closure functions](http://), like many other JavaScript libraries use to work with asynchronous flows. Hoodie uses so called **promises** to handle async flows. If you would like to now more about promises in hoodie, please see the [Hoodie promises Section](http://) for further details.

### store.update()
> **version:**      *> 0.2.0*

*In contrast to `.save`, the `.update` method does not replace the stored object, but only changes the passed attributes of an existing object, if it exists. Requires one of both: an properties or and update function.*

```javascript
hoodie.store.update('type', 'id', properties)
hoodie.store.update('type', 'id', updateFunction)
hoodie.store('type').update('id', properties)
hoodie.store('type').update('id', updateFunction)
```

| option     | type   | description     | required |
| ---------- |:------:|:---------------:|:--------:|
| type           | String | type of the store                   | yes |
| properties     | Object | object updates                      | no  |
| updateFunction | String | function doing object updates       | no  |
| options        | Object |   ------------                      | no  |

By this you are able to just update particular parts/attributes of your object. This is great for updating objects that are very large in bytes.

<br />
###### Example

```javascript
// Example for store updates
// using JavaScript plain objects as update parameter.
//
// A todo object could look like this:
//
// {
//	id:'abc4567',
//	title: 'Start learning Hoodie',
//	done: false,
//	dueDate: 1381536000
// }

var todoStore = hoodie.store('todo');

todoStore
    .findAll()
    .done(function(allTodos) {
        // just pick the first todo we can get
        var origininalTodo = allTodos.pop();

        console.log(origininalTodo.id, '=>', origininalTodo.dueDate)

        // update the picked todo and update it's dueDate to now
        todoStore
            .update(origininalTodo.id, { dueDate:(Date.now()) })
            .done(function(updatedTodo) {
                // beyond this point, please work with updatedTodo
                // instead of the origininalTodo, because origininalTodo
                // is outdated.
                console.log(updatedTodo.id, '=>', updatedTodo.dueDate);
            });

        // update the picked todo and update it's dueDate to now
        todoStore
            .update('ID DOES NOT EXIST', { dueDate:(Date.now()) })
            .done(function(updatedTodo) {
                console.log('will never happen.');
            })
            .fail(function(error) {
                console.log('the update failed with', error);
            });
    });
```

The example updates the todo object, which owns the `dueDate` of the first found todo object to `Date.now()`, which is the timestamp of right now. Every other attribute stays the same.

Further the example contains another example where we try to update an object, whose ID does not exist. This shall demostrate, how you can handle errors during updates.

The `update` methods have a certain speciality. Beside that you can pass a plain JavaScript object with attributes updates, you can also pass a function, that manipulates the the object matched by the given `id`.

Cases when this advantage can be very useful are applying calculations or for conditional updates. This will come mist handy when combined with `hoodie.store.updateAll`.

<br />
###### Example

```javascript
// example for store updates
// using functions as update parameter

var todoStore = hoodie.store('todo');

todoStore
    .findAll()
    .done(function(allTodos) {
        // just pick the first todo we can get
        var origininalTodo = allTodos.pop();

        todoStore.update(origininalTodo.id, function(oneTodo) {

            // Apply update only if conditions matches.
            if( Math.random() > 0.5) {
                // set dueDate to: right now
                oneTodo.dueDate = Date.now();
            }

            return oneTodo;
        }).done(function(updatedTodo) {
            console.log('update success', updatedTodo);
        }).fail(function(error) {
            console.log('failed update with', error);
        });

    });
```

### store.updateAll()
> **version:**      *> 0.2.0*

*updateAll will update all your objects of a specific store.*

```javascript
hoodie.store.updateAll(updateObject)
hoodie.store('type').updateAll(updateObject)
```

| option     | type   | description     | required |
| ---------- |:------:|:---------------:|:--------:|
| type           | String | type of the store                   | no |
| updateObject   | Object | object updates                      | yes |
| options        | Object |   ------------                      | no  |

The changes to be applied are defined by an update object. Just configure the specific attributes to the values the way you want to have your objects updated.

<br />
###### Example

```javascript
var todoStore    = hoodie.store('todo'),
	objectUpdate = {done: true};

todoStore
	.updateAll(objectUpdate)
	.done(function(updates) {
		console.log('the following todos are done', updates);
	});
````

Like with (hoodie.store.update)[storeupdate] you can pass an update function instead of an update object. So if you want update only a particular set of store objects, passing an update function is your friend. This is what comes close to a WHERE clause you may probably know from SQL. When using an update function to modify stored data, please make sure, to return the updated object at the end of the update function.

###### Example
```javascript
var todoStore  = hoodie.store('todo'),
	updateFunc = function(todo) {
		if(todo.done != true) {
			todo.done = true;
		}

		return todo;
	};

todoStore
	.updateAll(updateFunc)
	.done(function(updates) {
		console.log('the following todos are done', updates);
	});
```

### store.remove()
> **version:**      *> 0.2.0*

*This simple deletes one entriy of the defined `type` identified by it's `id` from a user's store.

```javascript
hoodie.store.remove('id')
hoodie.store('type').remove('id')
```

| option     | type   | description     | required |
| ---------- |:------:|:---------------:|:--------:|
| type           | String | type of the store         | no |
| id           | String | id of the object to remove | yes |

<br />
###### Notes
> - Please be aware that the data gets deleted immediately.

<br />
###### Example

```javascript
// deletes the first found entry from the todo store

var todoStore = hoodie.store('todo'),
	todo;

todoStore
	.findAll()
	.done(function(todos) {
		var todo = todos[0];

		todoStore
			.remove(todo.id)
			.done(function(removedTodos) {
				console.log(removedTodos);
			})
			.fail(function(error) {
				console.log('Error while removing todo', error);
			});
});
```

### store.removeAll()
> **version:**      *> 0.2.0*

*Deletes all entries of the defined `type` from a user's store.*

```javascript
hoodie.store.removeAll()
hoodie.store('type').removeAll()
```

| option     | type   | description     | required |
| ---------- |:------:|:---------------:|:--------:|
| type           | String | type of the store                   | no |
| options        | Object |   ------------                      | no  |

<br />
###### Notes
> - Please be aware that the data gets deleted immediately.

<br />
###### Example
```javascript
// deletes all objects from store

var todoStore = hoodie.store('todo');

todoStore
	.removeAll()
	.done(function(removedTodos) {
		console.log(removedTodos);
});
```

### Event 'type:add'
> **version:**      *> 0.2.0*

*Gets triggered when a new object of matching type/store has been added to the store.*

```javascript
hoodie.store.on('type:add', eventHandler);
```

| option     | type   | description     | required |
| ---------- |:------:|:---------------:|:--------:|
| event        | String   | Event identifier, consisting from type of object and ':add' | yes |
| eventHandler | Function | Function hanldling the triggered event.                     | yes |

The `hoodie.store` informs you about several things happening with the stored objects. In order to catch those messages you can register a function for handling those events. Those functions are also called **event handlers**.

<br />
###### Example
```javascript
hoodie.store.on('todo:add', function(createdTodo) {
	console.log('A todo has been created => ', createdTodo);
});
```

### Event 'type:update'
> **version:**      *> 0.2.0*

*Gets triggered when an existing object of matching type/store has been updated.*

```javascript
hoodie.store.on('type:update', eventHandler);
```

| option     | type   | description     | required |
| ---------- |:------:|:---------------:|:--------:|
| event        | String   | Event identifier, consisting from type of object and ':update' | yes |
| eventHandler | Function | Function hanldling the triggered event.                        | yes |

The `hoodie.store` informs you about several things happening with the stored objects. In order to catch those messages you can register a function for handling those events. Those functions are also called **event handlers**.

<br />
###### Example
```javascript
hoodie.store.on('todo:update', function(updatedTodo) {
	console.log('A todo has been updated => ', updatedTodo);
});
```

### Event 'type:remove'
> **version:**      *> 0.2.0*

*Gets triggered when an existing object of matching type/store has been removed.*

```javascript
hoodie.store.on('type:remove', eventHandler);
```

| option     | type   | description     | required |
| ---------- |:------:|:---------------:|:--------:|
| event        | String   | Event identifier, consisting from type of object and ':remove' | yes |
| eventHandler | Function | Function hanldling the triggered event.                        | yes |

The `hoodie.store` informs you about several things happening with the stored objects. In order to catch those messages you can register a function for handling those events. Those functions are also called **event handlers**.

<br />
###### Example
```javascript
hoodie.store.on('todo:remove', function(removedTodo) {
	console.log('A todo has been removed => ', removedTodo);
});
```

### store.remove()
> - **version:**      *> 0.2.0*
> - **deprecated:**   *soon*


