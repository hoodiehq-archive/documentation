---
layout: layout-api
locales: camp
---

# Hoodie.Task

This class defines the API that hoodie.store (local store) and hoodie.open
(remote store) implement to assure a coherent API. It also implements some
basic validations.

The returned API can be called as function returning a store scoped by the
passed type, for example

<pre><code>var taskStore = hoodie.store('task');
taskStore.findAll().done( showAllTasks );
taskStore.update('id123', {done: true});
</code></pre>

## Class Methods
- [store](#store)

## Instance Methods
- [validate](#validate)
- [save](#save)
- [add](#add)
- [find](#find)
- [findOrAdd](#findOrAdd)
- [findAll](#findAll)
- [update](#update)
- [updateAll](#updateAll)
- [remove](#remove)
- [removeAll](#removeAll)
- [decoratePromises](#decoratePromises)
- [trigger](#trigger)
- [on](#on)
- [unbind](#unbind)




## Class Methods
### store<a id="store"></a>

It is most likely, that your application will have more than one type of object
to we stored. Even if you have just a single object

## Instance Methods

<a id="validate"></a>
### validate

<a id="save"></a>
### save

<a id="add"></a>
### add

Creates a new entry in your local store.

<pre><code>hoodie.store.add('todo', { title: 'Getting Coffee' });</code></pre>

<a id="find"></a>
### find

<a id="findOrAdd"></a>
### findOrAdd

##### hoodie.store.findOrAdd(type, id, properties)

This is a convenient combination of hoodie.store.find and hoodie.store.add. Use can
use if you would like to work with a particular store object, which existence
you are not sure about yet. Which cases would be worth using this?
Well for example if you want to read a particular settings object, you want to
work with in a later step.

<pre><code>// pre-conditions: You already read a user's account obj.
var configBlueprint = { 
    language: 'en/en', 
    appTheme: 'default' 
};
var configId = account.id + '_config';

hoodie.store
    .findOrCreate(
        'custom-config', 
        configId, 
        configBlueprint
    )
    .done(function(appConfig) { 
        console.log('work with config', appConfig) 
    });
</code></pre>

hoodie.store.findOrCreate takes three arguments here. All of them are required.

 * **type**: The kind of document you want to search the store for.
 * **id**: The unique id of the document to search the store for.
 * **properties**: The blueprint of the document to be created, in case nothing could be found.

The important thing to notice here is, that the **properties** parameter has no
influence on the search itself. Unlike you may have used store searches
with other frameworks, this will **not** use the **properties** parameter
as further conditions to match a particular store entry. The only conditions the
store will be searched for are the document **type** and **id**.

Just to demonstrates the convenience of hoodie.store.findOrAdd, the below example
illustrates the more complex alternative way of find and add:

<pre><code>// pre-conditions: You already read a user's account obj.
var defaultConfig = {
    language: 'en/en', 
    appTheme: 'default'
};

var configId = account.id + '_config';

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
</code></pre>

<a id="findAll"></a>
### findAll

<a id="update"></a>
### update

<a id="updateAll"></a>
### updateAll

<a id="remove"></a>
### remove

<a id="removeAll"></a>
### removeAll

<a id="decoratePromises"></a>
### decoratePromises

<a id="trigger"></a>
### trigger

<a id="on"></a>
### on

<a id="unbind"></a>
### unbind
