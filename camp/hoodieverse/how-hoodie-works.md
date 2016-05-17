---
layout: layout-hoodieverse
locales: camp
---
# Behind the Magic – How Hoodie Works

Hoodie has several components that work together in a somewhat atypical way to deliver our promise of simplicity, out-of-the-box syncing and offline capability.

Everything starts in the frontend, with your app. This is your user interface, your client side business logic etc.
<p><img src="../../src/img/how-hoodie-works/1.jpg" width="100%" height="auto"></p>

The app code only ever talks to the Hoodie frontend API, never directly to the server-side code, the database or even the in-browser storage.
<p><img src="../../src/img/how-hoodie-works/2.jpg" width="100%" height="auto"></p>

You can replace localstorage with any in-browser storage of your choice (in fact, we're in the process of replacing it with <a href="http://pouchdb.com" target="_blank">PouchDB</a>). Hoodie saves all data here first, before doing anything else. So if you're offline, your data is safely stored locally.
<p><img src="../../src/img/how-hoodie-works/3.jpg" width="100%" height="auto"></p>

This, by itself, is already enough for an app. But if you want to save your data remotely, or send an email, for example, you'll need a bit more.

Hoodie relies on <a href="http://couchdb.apache.org" target="_blank">CouchDB</a>, the database that replicates. We use it to sync data back and forth between the server and the clients, which is something that CouchDB happens to be really good at.
<p><img src="../../src/img/how-hoodie-works/4.jpg" width="100%" height="auto"></p>

*A small aside: In CouchDB, each user has their own private database which only they can access, so all user data is private by default. It can be shared to the public if the user decides to do so, but it can't happen by accident. This is why we'll often mention sharing and global data as a separate feature.*

Behind the Database, we have the actual server code, in the form of a small node.js core with various plugins running alongside it. These then act upon the data in the CouchDB, which then replicates the changes back to the clients.
<p><img src="../../src/img/how-hoodie-works/5.jpg" width="100%" height="auto"></p>

So Hoodie does **client &harr; database &harr; server** instead of the traditional **client &harr; server &harr; database**, and this is where many of its superpowers come from.

The clever bit is indicated by the dotted line in the middle: the connection between clients and server can be severed at any time without breaking the system. Frontend and backend never talk directly to each other, they only leave each other messages and tasks. It’s all very loosely-coupled and event-based, and designed for eventual consistency.

## Plugins

<a href="/en/plugins/tutorial.html">Hoodie is extendable</a> in all respects: you can extend the frontend library, the backend, and Hoodie's admin panel. Currently, these fundamentals come pre-installed:

* user signup and administration
* data storage
* data loading & sync
* data sharing
* sending emails

You can get up and running in the blink of an eye, but we've also given you the ability to dig deep and customise everything to your heart's content. But for now, let's watch some data move through this system…

### How data flows through Hoodie

Assume that we've built an app that includes a direct messaging plugin, so users can message each other. Here's how that would go:

1. User A writes a message to user B in the client and submits it
2. Hoodie saves the message into the in-browser storage (localstorage or PouchDB)
3. Hoodie will try to sync the message over to the CouchDB. If the client (<a href="https://twitter.com/karlwestin/status/608269861601558528" target="blank">or the server, for that matter</a>) is offline, Hoodie will automatically retry until it reaches consistency between the server and all clients (for example, A's phone and A's macbook)
4. When the message arrives in the CouchDB, the latter emits a *change event* that our direct messaging plugin will listen for, and act upon
5. The plugin copies the message over to user B's database, from where it will be synced to B's client devices' browser storage whenever they connect to the server again
6. In B's client, Hoodie will emit another *change event* when the message arrives, which the frontend user interface can listen to
7. The interface updates and shows B the new message. B can now take their device into an airplane, submarine or bunker, and will always be able to see the message on it, online or not

### So… cross-device sync is built in… and offline too?

Yep. Anything you build with Hoodie automatically handles syncing data between a user's multiple devices, and it also stores each users' data on these devices, so you can easily make it all available offline. And these aren't even extra features you have to invoke, this is just how Hoodie works.

### Working with change events

Just to make clear how ridiculously easy we made all this, let's look at how you'd implement updating your interface when your user [adds](/en/techdocs/api/client/hoodie.store.html#storeadd) a todo item to a fictional todo list application:

```javascript
// Storing the new todo item
$('.add-new-todo').click(function(event){
  hoodie.store.add('todo', {
    todovalue: $('.todo-input').val()
  });
});

```

Which we of course neatly decouple from:

```javascript
// displaying the new todo item
hoodie.store.on('add:todo', function(doc) {
  renderTodo(doc);
});
```
This listener fires whenever a new todo is added to the Hoodie store. **But the Hoodie store doesn't care *where* that todo came from**. And this is actually pretty amazing: the new todo could come from this client. It could come from some other client the user may have, like their phone. It might have come from a server side Hoodie plugin that reads some API somewhere and generates todos based on that. It might have come from a different plugin that allows users to assign each other todos. It literally doesn't make a difference to Hoodie, it's all handled with that same tiny bit of code.

Oh, and this covers re-syncing after losing connection to the server as well, of course.

And before I forget, this handles being offline completely in the first place, too.

*No sweat. We got this.*

Since you probably want to differentiate between local and remote todos, that's easy too:

```javascript
hoodie.store.on('add:todo', function(doc, options) {
  if (options.remote) {
    return renderRemoteTodo(doc);
  }
  renderTodo(doc);
});
```
But fundamentally, that's it. That's how you have your interface react to data changes in Hoodie. Simple, robust and powerful.

## Now go forth and make things!

Did this get you fired up? Then head to the [installation guide](/en/start/)!



