# Welcome to Hoodie

This document explains the Hoodieverse.


## What is Hoodie?

Hoodie is framework for frontend web applications that abstracts away the backend. If you love working in jQuery, Backbone, Dojo, Ember, or any other frontend framework, but *dread* backend work, Hoodie is for you.

> Hoodie, look ma, no backend!

Hoodie gives your frontend code superpowers, by allowing you to do things that only a backend can do (user accounts, emails, payments, etc.).

All of Hoodie is accessible through a simple script include:

    <script src="hoodie.js"></script>
    <script type="javascript">
      var hoodie = new Hoodie("https://api.hoodieapps.com");
    </script>

Hoodie is a frontend abstraction of a generic backend web service. Hoodie is agnostic to your choice of frontend application framework.

For example, you can use jQuery for your web app, Hoodie for your connection to the backend, say, instead of raw `jQuery.xhr`. You can also use Backbone on top of Hoodie, or any other framework, even vanilla.js.


## Hoodie Architecture

Hoodie consists of the two parts that make up every web architecture, the Hoodie frontend and the Hoodie backend.

The Hoodie frontend is encapsulated in the `hoodie.js` file that you include in your application.

The Hoodie frontend communicates to the Hoodie backend over HTTPS. The Hoodie backend is provided by a Hoodie hosting service of your choice, or by yourself.

Our reference implementation for the Hoodie backend is in Node.js and CouchDB. But if you prefer a different stack, all you need to do is to implement the Hoodie frontend specs in your backend of choice.

    -------------
    | Your App  | \
    |-----------|  \
    | jQuery UI |   \
    |-----------|    Frontend
    | jQuery    |   /
    |-----------|  /
    | hoodie.js | /
         ^
         | HTTPS
         v
    | Hoodie    |  Backend
    |-----------|
    | Node.js   |
    |-----------|
    | CouchDB   |
    -------------


### Hoodie Core

Hoodie is designed like an onion: a strong core and layers of modules that extend the basic feature set. At the center of Hoodie is an efficient object synchronisation system. Everything else is built on top. [TODO, find better analogy]

Hoodie gives you unified access to various in-browser storage systems. If you make use of that (and we suggest you do), you get data synchronisation with the server for free. The key implications here are:

 - Data is immediately available to the client. No need to wait around for any server requests.
 - Improved user experience through mitigated server-latency.
 - Hoodie apps are offline capable by default.

See the [Hoodie Core Storage](core-storage.md) documentation for more details.


## Modules

On top of the Core Storage system exists a layer of various Modules. Modules enable a specific feature for your app. All Modules share the same architecture. Some Modules can depend on others for specific features (we’ll show you an example in a second).

The first Module is the User Module. The majority of web applications have a way for people to sign up, or when they are signed up, to sign in Once you have a sign up, users need to be able to reset their password. Some applications required an email-verification before they allow the creation of a new account.

The User Module gives you an easy API to start all these actions:

    hoodie.account.signUp('email@example.com', 'secret passphrase');
    hoodie.account.signIn('email@example.com', 'secret passphrase');
    hoodie.account.resetPassword('email@example.com');

Account verification and password forget require the sending of emails. The Email Module takes care of that. This is an example where one Module depends on another for some of its work.

Modules are activated in the [Hoodie Application Admin Interface]() that we’ll explain next.

Other modules include Payments, Receive Email, Data Sharing. Refer to the [List of Hoodie Modules]() for others.



## The Application Admin Interface

Each Hoodie application automatically gets an Admin interface. The Hoodie Application Admin Interface gives you access to various pieces of configuration for your Hoodie Front- and Backend.

The Interface allows you to manage the Modules for your application. You can enable and disable Modules at will, and change their configurations.

For example, you can customise email templates that are sent out to your users, or create payment plans that your users can sign up for.

The Hoodie Admin Interface has access to the [List of Hoodie Modules]() and you can add new Modules at any time.

See the [Hoodie Application Admin Interface]() for further details.



## Open Source

[The source code for Hoodie is available on GitHub](http://github.com/hoodiehq) under the Apache License 2.0.