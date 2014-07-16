---
layout: layout
---

# Behind the Magic – a detailed explanation how Hoodie works

This tutorial shows you how exactly all parts of Hoodie work together to create a seamless, consistent user experience.

## Table of Content
- <a href="#all-parts-of-hoodie">All parts of Hoodie</a>
- <a href="#how-it-works-example-sending-an-email">How it works: example – sending an email</a>

### All parts of Hoodie
When we build an app with Hoodie, we have three parts: frontend, backend, and they’re connected with each other through the Hoodie sync.
<p><img src="http://blog.hood.ie/wp-content/uploads/2014/07/Screen-Shot-2014-07-16-at-14.24.53.png" width="50%" height="50%"></p>

In the frontend, you have your app...
<p><img src="http://blog.hood.ie/wp-content/uploads/2014/07/Screen-Shot-2014-07-16-at-14.25.04.png" width="50%" height="50%"></p>

The app always only talks to the Hoodie API, never directly to the server-side code, database or even in-browser storage.
<p><img src="http://blog.hood.ie/wp-content/uploads/2014/07/Screen-Shot-2014-07-16-at-14.25.13.png" width="50%" height="50%"></p>

You can replace localstorage with any in-browser storage of your choice.
<p><img src="http://blog.hood.ie/wp-content/uploads/2014/07/Screen-Shot-2014-07-16-at-14.25.23.png" width="50%" height="50%"></p>

And at this point, you could already stop if you wanted. This, by itself, is already enough for an app. Still, if you want to bring this entire thing online now, you'll need something in addition.

Hoodie relies on [CouchDB](http://couchdb.apache.org), the database that replicates. In CouchDB, each user has their own private database which only they can access. And all data is private by default, but it can be shared to the public if the user decides to.
<p><img src="http://blog.hood.ie/wp-content/uploads/2014/07/Screen-Shot-2014-07-16-at-14.25.37.png" width="50%" height="50%"></p>

There are plugins based on node.js that bring Hoodie’s core features:
* user signup and administration
* data storage
* data loading & sync
* data shares
* emails
* payments. 

These plugins are Hoodie's core plugins. In addition, anyone can build plugins themselves to extend Hoodie's core (see tutorial for [building plugins to extend Hoodie](https://github.com/hoodiehq/documentation/blob/gh-pages/tutorials/hoodie-plugin-tutorial/index.md)).
<p><img src="http://blog.hood.ie/wp-content/uploads/2014/07/Screen-Shot-2014-07-16-at-14.25.46.png" width="50%" height="50%"></p>

This means: with Hoodie, frontend and backend never talk directly to each other. They only leave each other messages and tasks.
it’s all very loosely-coupled and event-based, which means it can be interrupted at any stage without breaking. It’s designed for eventual consistency.
<p><img src="http://blog.hood.ie/wp-content/uploads/2014/07/Screen-Shot-2014-07-16-at-14.25.59.png" width="50%" height="50%"></p>

--------

### How it works, example: sending an email

Let’s see how this works when an email is moving through the system:

1.  The App in which the data is entered gives the data to hoodie.store which stores it in localStorage. 
2.  and then we wait. If the user is not online at the moment, the data just stays in localStorage and waits there.
3.  As soon as the user is online, the email is being synced with the database and the Hoodie email plugin gets the task to send it out.

<p><img src="http://blog.hood.ie/wp-content/uploads/2014/07/Screen-Shot-2014-07-16-at-14.25.46.png" width="50%" height="50%"></p>
