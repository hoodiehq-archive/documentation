# Hoodie.Store

This class defines the API that hoodie.store (local store) and hoodie.open 
(remote store) implement to assure a coherent API. It also implements some
basic validations.

The returned API can be called as function returning a store scoped by the 
passed type, for example

<pre>
    var taskStore = hoodie.store('task');
    taskStore.findAll().then( showAllTasks );
    taskStore.update('id123', {done: true});
</pre>

## Methods

### hoodie.store(_id_, _type_)

It is most likely, that your application will have more than one type of object
to be stored. Even if you have just a single object **hoodie.store(type)** 
comes handy. Say you have to work with objects of the type **todo**, you usually
do things like the following:

<pre>
    hoodie.store.add('todo', { title: 'Getting Coffee' });
    hoodie.store.findAll('todo').done(function(allTodos) { /*...*/ });
</pre>

And right

The **hoodie.store** method offers you a short handle here, so you can create
designated store context objects to work with:

<pre>
    var todoStore = hoodie.store('todo');

    todoStore.add({ title: 'Getting Coffee' });
    todoStore.findAll().done(function(allTodos) { /*...*/ });
</pre>

In the later example the benefit of this variant might not be clear at 
first glance. The primary benefit is, that you must set your object type only 
once. So in case you want to rename you object type "todo" to "things-to-be-done"
in a later phase of development, you have to change this in signigicatly fewer 
areas on you application code. By this you also avoid typos by reducing the 
amount of occurencies, where you can make the mistake at. 

Imagine having the typof "todoo" with a double o at the end. This would be a 
dramatic bug if it comes to storing a new todo object, because when reading all
"todo" (with single o this time) the new entries can't be found.

### hoodie.store.validate(object, _options_)

By default, *hoodie.store.validate* only checks for a valid object **type** and object **id**. The **type** as well as the **id** may not contain any slash ("/"). 
This is due to the format, hoodie stores your object into the database.
Every stored database entry has an internal identifier. It is a combination of both, formated as "type/id". Therefore it is absolutely permitted to have a slashes in neither of both.

All other characters are allowed, though it might the most sense to stick with
alphabetical characters and numbers. But you are still free to choose.

<pre>
	    
</pre>


If **hoodie.store.validate** returns nothing, the passed **object** is valid. 
Otherwise it returns an **[HoodieError]<#>**.


(...)

### save

### add

Creates a new entry in your local store.

<pre>
    hoodie.store.add('todo', { title: 'Getting Coffee' });
</pre>

### find

### findOrAdd

*hoodie.store.findOrAdd(type, id, properties)*

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

 * **type**       => The kind of document you want to search the store for.
 * **id**         => The unique id of the document to search the store for.
 * **properties** => The blueprint of the document to be created, in case nothing could be found.

The important thing to notice here is, that the **properties** parameter has no 
influence on the search itself. Unlike you may have used store searches 
with other frameworks, this will **not** use the **properties** parameter 
as futher conditions to match a particular store entry. The only conditions the
store will be searched for are the document **type** and **id**.

Just to demonstrates the convenience of hoodie.store.findOrAdd, the belowth example
illustrates the more complex alternative way of find and add:

<pre>
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
                        // work witht he newConfig here
                    });
            }
        });
</pre>


### findAll

### update

### updateAll

### remove

### removeAll

### decoratePromises

### trigger

### on

### unbind

