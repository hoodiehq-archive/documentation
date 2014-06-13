# Hoodie.Store

*Source: hoodie/src/lib/store/scoped.js*

This class defines the API that `hoodie.store` (local store) and `hoodie.open` 
(remote store) implement to assure a coherent API. It also implements some
basic validations.

The returned API can be called as function returning a store scoped by the 
passed type, for example

<pre>
    var taskStore = hoodie.store( 'task' );
    
    taskStore.findAll().then( showAllTasks );
    taskStore.update( 'id123', {done: true} );
</pre>


## Methods

### store
`hoodie.store(_type_, _id_)`

It is most likely, that your application will have more than one type of store object. Even if you have just a single object `hoodie.store(type)` 
comes handy. Say you have to work with objects of the type `todo`, you usually
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

The benefit of this variant might not be clear at first glance. The primary benefit is, that you must set your object type only 
once. So in case you want to rename you object type *"todo"* to *"things-to-be-done"*
in a later phase of development, you have to change this in significantly fewer
areas on you application code. By this you also avoid typos by reducing the 
amount of occurrences, where you can make the mistake at.

Imagine having the type of *"todoo"* with a double o at the end. This would be a 
dramatic bug if it comes to storing a new todo object, because when reading all
"todo" (with single o this time) the new entries can't be found.

You can also create a very particular store, to work with access to just one specific stored object.

<pre>
    var singleStore = hoodie.store( 'task', 'id123' );
</pre>

For the call like illustrated in the last example, only a minimal subset of functions will be available on the created store context. Every method those purpose is to target more than one stored object, will be left out (f.e. findAll). This is because we already specified a particular object form the store to work with.

### validate

`hoodie.store.validate(object, _options_)`

By default `hoodie.store.validate` only checks for a valid object `type` and object `id`. The `type` as well as the `id` may not contain any slash ("/"). 
This is due to the format, hoodie stores your object into the database.
Every stored database entry has an internal identifier. It is a combination of both, formatted as *"type/id"*. Therefore it is absolutely permitted to have a slashes in neither of both.

All other characters are allowed, though it might be the best, to stick with
alphabetical characters and numbers. But you are still free to choose.


If `hoodie.store.validate` returns nothing, the passed **object** is valid. 
Otherwise it returns an **[HoodieError]<#>**.


### save

`hoodie.store.save(type, _id_, properties)`

Creates or replaces an an eventually existing object in the store, that is of the same `type` and the same `id`.

When the `id` is of value *undefined*, the passed object will be created from scratch.

**IMPORTANT**: If you want to just to partially update an existing object, please see `hoodie.store.update(type, id, objectUpdate)`. The method `hoodie.store.save` will completely replace an existing object.

<pre>
	var carStore = hoodie.store('car');
	
	carStore.save(undefined, {color: 'red'});
	carStore.save(abc4567', {color: 'red'});
</pre>

### add

`hoodie.store.add(type, properties)`

Creates a new entry in your local store. It is the shorter version of a complete save. This means you can not pass the id of an existing property. In fact `hoodie.store.add` will force `hoodie.store.save` to create a new object with the passed object properties of the `properties` parameter.

<pre>
    hoodie.store
    	.add('todo', { title: 'Getting Coffee' })
    	.done(function(todo) { /* success handling */ });
    	.fail(function(todo) { /* error handling */ });
</pre>

### find

`hoodie.store.find(id)`

Searches the store for a stored object with a particular `id`. Returns a promise so success and failure can be handled. A failure occurs for example when no object

<pre>
	hoodie.store('todo')
    	.find('hrmvby9')
    	.done(function(todo) { /* success handling */ });
    	.fail(function(todo) { /* error handling */ });
</pre>


### findOrAdd

`hoodie.store.findOrAdd(type, id, properties)`

This is a convenient combination of hoodie.store.find and hoodie.store.add. Use can
use if you would like to work with a particular store object, which existence 
you are not sure about yet. Which cases would be worth using this? 
Well for example if you want to read a particular settings object, you want to 
work with in a later step.

<pre>
    // pre-conditions: You already read a user's account object.
    var configBlueprint = { language: 'en/en', appTheme: 'default' };
    var configId        = account.id + '_config';

    hoodie.store
        .findOrCreate('custom-config', configId, configBlueprint)
        .done(function(appConfig) { console.log('work with config', appConfig) });
</pre>

hoodie.store.findOrCreate takes three arguments here. All of them are required.

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
	// IMPORTANT: BAD VARIATION
	
    // pre-conditions: You already read a user's account object.
    var defaultConfig = {language: 'en/en', appTheme: 'default'};
    var configId      = account.id + '_config';

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
        
	// IMPORTANT: BAD VARIATION
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

What you really have to recognized here is that there is a mayor difference between the methods `then` and `done`. While `done` suggests that you can handle all the retrieved objects with it, actually it is `then` where `findAll` will deliver your data to. `done` on the other hand gets called when all other `then` calls have been passed. Yes you can utilize this mechanism to work with your data in several steps.

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

In contrast to `.save`, the `.update` method does not replace the stored object,
but only changes the passed attributes of an existing object, if it exists

both a hash of key/values or a function that applies the update to the passed
object can be passed.

<pre>
	hoodie.store.update('car', 'abc4567', {sold: true})
	hoodie.store.update('car', 'abc4567', function(obj) { obj.sold = true })
</pre>


### updateAll

### remove

### removeAll

### decoratePromises

### trigger

### on

### unbind


## Code Example

<pre>
</pre>
