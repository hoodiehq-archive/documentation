---
layout: layout
---

# Hoodie.Task

This class defines the API that hoodie.store (local store) and hoodie.open
(remote store) implement to assure a coherent API. It also implements some
basic validations.

The returned API can be called as function returning a store scoped by the
passed type, for example

<pre>
    var taskStore = hoodie.store('task');
    taskStore.findAll().done( showAllTasks );
    taskStore.update('id123', {done: true});
</pre>


## Class Methods

### store

It is most likely, that your application will have more than one type of object
to we stored. Even if you have just a single object

## Instance Methods

### validate

### save

### add

Creates a new entry in your local store.

<pre>
    hoodie.store.add('todo', { title: 'Getting Coffee' });
</pre>

### find

### findOrAdd

***hoodie.store.findOrAdd(type, id, properties)***

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
as further conditions to match a particular store entry. The only conditions the
store will be searched for are the document **type** and **id**.

Just to demonstrates the convenience of hoodie.store.findOrAdd, the below example
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
                            // work with the newConfig here
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
