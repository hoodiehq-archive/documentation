# hoodie.store
> **version:**      *> 0.1.0* <br />
> **source:**       *hoodie/src/hoodie/???.js*<br />

***<br />after reading this you will know***
> - how to listen and use events

## Introduction

## Methods

- [on](#on)
- [one](#one)
- [trigger](#trigger)
- [off](#off)
- [bind](#bind)
- [unbind](#unbind)

### store()
> **version:**      *> 0.2.0*

*Getting access to the store or scoped access if a type is defined.*

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

It is most likely, that your application will have more than one type of store object. Even if you have just a single object hoodie.store(type) comes handy. Say you have to work with objects of the type todo, you usually do something like the following:

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

For the call like illustrated in the last example, only a minimal subset of functions will be available on the created store context. Every method those purpose is to target more than one stored object, will be left out (f.e. findAll). This is because we already specified a particular object form the store to work with.

