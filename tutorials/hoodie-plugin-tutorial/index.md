---
layout: layout-get-help
---

## Very Important:

This tutorial is still a work in progress.
If you have any trouble, please ping us on irc.freenode.net/#hoodie or file an issue.

Thank you! &lt;3


## Table of Content

##### 1. Introduction
- <a href="#introduction">Intro</a>
- <a href="#what-is-a-hoodie-plugin">What is a Hoodie plugin?</a>
- <a href="#what-can-a-hoodie-plugin-do">What can a Hoodie plugin do?</a>

##### 2. Prerequisites
- <a href="#prerequisites">Prerequisites</a>
- <a href="#the-hoodie-architecture">The Hoodie Architecture</a>
- <a href="#the-plugin-api-and-tasks">The Plugin API and Tasks</a>

##### 3. Build a plugin
- <a href="#lets-build-a-direct-messaging-plugin">Let's Build a Direct Messaging Plugin</a>
- <a href="#how-will-this-work">How Will this Work?</a>
- <a href="#where-to-start">Where to Start</a> <br/><br />
- <a href="#structuring-a-plugin">Structuring a Plugin</a><br /><br />
- <a href="#the-direct-messaging-plugins-frontend-component">The Direct Messaging Plugin's Frontend Component</a>
- <a href="#the-direct-messaging-plugins-backend-component">The Direct Messaging Plugin's Backend Component</a>
- <a href="#extending-admin-dashboard-with-your-plugins-own-admin-panel">Extending Admin Dashboard with your Plugin's own Admin Panel</a>
<br /><br />
- <a href="#the-packagejson"> The package.json </a>

##### 4. Testing
- <a href="#writing-tests">Writing tests</a>

##### 5. Deployment
- <a href="#deploying-your-plugin-to-npm">Deploying your Plugin to NPM</a>

##### 6. Start with the template
- <a href="#template-to-start">Start with the template</a>


## Introduction

Hoodie's API offers a small set of core features that handle data storage, sync and authentication. All other functionality you may need can be added by building plugins. Our goal is to so make Hoodie as extensible as possible, while keeping the core tiny, so you can add the modules _you_ need and just them.

### What can Hoodie plugins do?

In short, anything Hoodie can do. A plugin can work in Hoodie's Node.js backend and manipulate the database or talk to other services, it can extend the Hoodie frontend library's API, and it can appear in the admin dashboard that each Hoodie app has, and extend that with new stats, configurations and whatever else you can think of.

### Example plugins

You could …

- log special events and send out emails to yourself whenever something catastrophic / wonderful happens (a bit like your own IFTTT for your app)
- make Node.js resize any images uploaded to your app, generate a couple of thumbnail versions, save them to S3 or another server and reference them in your database
- securely authenticate your users with services like Twitter or GitHub and exchange data
- extend Hoodie so signed-up users can send direct messages to each other

## Prerequisites: preparations for getting started

All you need for writing a Hoodie plugin is a running Hoodie app. Your plugin lives directly in the app's `node_modules` directory and must be referenced in its `package.json`, just like any other npm module. You don't have to register and maintain it as an npm module once it is complete.
(As we'd like to be able to use npm's infrastructure for helping people find and install Hoodie plugins in the longterm, we still want to encourage you to use it as well, this would help the community a lot. We'll explain how to do this at the end of this document.)

### The Hoodie Architecture

If you haven't seen it yet, now is a good time to browse through [the explanation of the Hoodie stack](http://hood.ie/intro.html), and how it differs from what you might be used to. One of Hoodie's most powerful features is that it is offline first, which means all Hoodie-applications (and therefore also your plugin) work anytime, regardless of the user's connection status. This works because we don't let the frontend send tasks to the backend directly in Hoodie-Apps. Instead, the frontend deposits tasks in the database, which is both local and remote, and syncs whenever it can (which means: whenever it detects internet connection; if there's none, it doesn't care). After sync, these tasks are picked up by the backend, which acts accordingly to what it's told to do by the tasks. When completed, the database emits corresponding events, which then the frontend can act upon.
Thus, we provide you with a Plugin API that handles generating and managing these tasks, writing stuff to user databases and so all other things you may need for building _your_ plugin.

### Which components do Plugins have?

Hoodie plugins have three distinct parts, and you will need at least one of them (depending on what you want your plugin to do). They are:

- __A frontend component__ that extends the Hoodie API in your frontend, written in Javascript.
- __A backend component__ that exports the server / database functionality to the plugin, written in Node.js.
- __An admin view__, which is an interface written in HTML, CSS and JS, that appears in your Hoodie admin dashboard to give you the option to interact with the user e.g. configurate the plugin.

### The Plugin API and Tasks

Currently, the only way to get the backend component of a plugin to do anything is with a task. A task is a slightly special object that can be saved into the database from the Hoodie frontend. Your plugin's backend component can listen to the events emitted when a task appears, and then do whatever it is you want it to do. You could create a task to send a private message in the frontend, for example:

    hoodie.task.start('directmessage', {
        'to': 'Ricardo',
        'body': 'Hello there! How are things? We're hurtling through space! Wish you were here :)'
    });

And in your backend component, listen for that task appearing and act upon it:

    hoodie.task.on('directmessage:add', function (dbName, task) {
        // generate a message object from the change data and
        // store it in both users' databases
    });

But we're getting ahead of ourselves. Let's do this properly and start at the beginning.

## Let's Build a Direct Messaging Plugin

### How Will this Work?

Here's what we want the Hoodie app to be able to do with the plugin, which we'll call `directmessages`:

* Logged in users can send a direct message to any other logged in user
* Recipient users will see a new message appear in near real time

In the frontend, we need:

* a `directMessages.send()` method in the Hoodie API to add a task that sends the message
* an optional `directMessages.on()` method to listen for events that are fired, for example when a new message appears in the recipient account

In the backend, we need to:

1. check that the recipient exists
2. save the new message to the recipient's database
3. mark the original task as completed
4. if anything goes wrong, update the task accordingly

### Where to Start

Any plugins you write live in the `node_modules` directory of your application, with their directory name adhering to the following syntax:

    [your_application]/node_modules/hoodie-plugin-[plugin-name]

So, for example:

    supermessenger/node_modules/hoodie-plugin-direct-messages

Everything related to your plugin goes in there.

### Structuring a Plugin

As stated, your plugin can consist of up to three components: __frontend__, __backend__ and __admin-dashboard__. Since it is also ideally a fully qualified npm module, we also require a `package.json` with some information about the plugin.

Assuming you've got all three components, your plugin's directory should look something like this:

    hoodie-plugin-direct-messages
        hoodie.direct-messages.js
        worker.js
        /admin-dashboard
            index.html
            styles.css
            main.js
        package.json

* `hoodie.direct-messages.js` contains the frontend code
* `worker.js` contains the backend code
* `/admin-dashboard` contains the admin view
* `package.json` contains the plugin's metadata and dependencies

Let's look at all four in turn:

#### The Direct Messaging Plugin's Frontend Component

This is where you write any extensions to the client side hoodie object, should you require them. In the same way you can do

    hoodie.store.add('zebra', {'name': 'Ricardo'});

from the browser in any Hoodie app, you can use the plugin's frontend component to expose something like

    hoodie.directMessages.send({
        'to': 'Ricardo',
        'body': 'One of your stripes is wonky'
    });

You've noticed I've used directMessages instead of our plugin's actual name "direct-messages", this is because, well, simply: I can. How and where you extend the hoodie object in the frontend is entirely up to you. Your plugin could even extend Hoodie in multiple places or override existing functionality.

All of your plugin's frontend code must live inside a file named according to the following convention:

    hoodie.[plugin_name].js

In our case, this would be

    hoodie.direct-messages.js

The code inside this is very straightforward:

    Hoodie.extend(function(hoodie) {
      hoodie.directMessages = {
        send: hoodie.task('directmessage').add,
        on: hoodie.task('directmessage').on // probably never needed
      };
    });

Now `hoodie.directMessages.send()` and `hoodie.directMessages.on()` actually exist. Here is `send()` in use:

    hoodie.directMessages.send(messageData)
    .done(function(messageTask){
        // Display a note that the message was sent
    })
    .fail(function(error){
        console.log("Message couldn't be sent: ",error);
    })

__Note:__ the `hoodie.task.on()` listener accepts three different object selectors after the event type, just like `hoodie.store.on` does in the hoodie.js frontend library:

* none, which means any object type: `'success'`
* a specific object type: `'directmessage:success'`
* a specific individual object `'directmessage:a1b2c3:success'`

__Important: Task and event names may _only_ contain _lowercase letters_, nothing else.__

That's your frontend component dealt with! Remember, your plugin can consist of only this component, should you just want to encapsulate some more complex abstract frontend code in some convenience functions, for example.

But we have lots of ground to cover, so onward! to the second part:

#### The Direct Messaging Plugin's Backend Component

For reference while reading along, here's the [current state of the Plugin API](https://github.com/hoodiehq/hoodie-plugins-api/blob/master/README.md) as documented on gitHub.

By default, the backend component lives inside a `index.js` file in your plugin's root directory. It can be left there for simplicity, but Hoodie will preferentially load whatever you reference under `main` in the plugin's `package.json`.

__First things first__: this component will be written in node.js, and node in general tends to be in favor of callbacks and opposed to promises. We respect that and want everyone to feel at home on their turf, which is why all of our backend code is stylistically quite different from the frontend code.

Let's look at the whole thing first:

    module.exports = function(hoodie) {
      hoodie.task.on('directmessage:add', handleNewMessage);

      function handleNewMessage(originDb, message) {
        var recipient = message.to;
        hoodie.account.find('user', recipient, function(error, user) {
          if (error) {
            return hoodie.task.error(originDb, message, error);
          };
          var targetDb = 'user/' + user.hoodieId;
          hoodie.database(targetDb).add('directmessage', message, addMessageCallback);
        });
      };

      function addMessageCallback(error, message) {
        if(error){
            return hoodie.task.error(originDb, message, error);
        }
        return hoodie.task.success(originDb, message);
      };
    };

Again, let's go through line by line.

    module.exports = function(hoodie) {

Essentially a boilerplate container for the actual backend component code. Again, we're passing the hoodie object so we can use the API inside the component.

    hoodie.task.on('directmessage:add', handleNewMessage);

Remember when we did `hoodie.task('directmessage').add` in the frontend component? This is the corresponding part of the backend, listening to the event emitted by the `task.('directmessage').add`. We call `handleNewMessage()` when it gets fired:

    function handleNewMessage(originDb, message) {

Now we're getting into databases. Remember: every user in Hoodie has their own isolated database, and `task.on()` passes through the name of the database where the event originated.

    var recipient = message.to;
    hoodie.account.find('user', recipient, function(error, user) {

We also need to find the recipient's database, so we can write the message to it. Our `hoodie.directMessages.send()` took a message object with a `to` key for the recipient, and that's what were using here. We're assuming that users are adressing each other by their actual Hoodie usernames and not some other name.

    if (error) {
      return hoodie.task.error(originDb, message, error);
    };

The sender may have made a mistake and the recipient may not exist. In this case, we call `task.error()` and pass in the message and the error so we can deal with the problem where neccessary. This will emit an `error` event that you can listen for both in the front- _and/or_ the backend with `task.on()`. In our case, we were just passing them through our plugin's frontend component to let the app author deal with it. Internally, Hoodie knows which task the error refers to through the `message` object and its unique id.

    var targetDb = 'user/' + user.hoodieId;

We still haven't got the recipient's database, which is what we do here. In CouchDB, database names consist of a type prefix (in this case: `user`), a slash, and an id. We recommend using Futon to find out what individual objects and databases are called. Now we get to the main point:

    hoodie.database(targetDb).add('directmessage', message, addMessageCallback);

This works a lot like adding an object with the Hoodie frontend API, except we use callbacks instead of promises here. We've added the message data as a `message` object in the recipient's database, and if we're listening to the corresponding `new` event in the frontend, we can make it show up in near realtime.

__Note__: You'll probably be thinking: "wait a second, what if another plugin generates `message` objects too?" and that's very prescient of you. We're not dealing with namespacing here for simplicity's sake, but prefixing your object type names with your plugin name seems like an excellent idea. In that case, this line should read

    hoodie.database(targetDb).add('directmessagesmessage', message, addMessageCallback);

but for clarity, we'll just leave that out in this example.

Anyway, we're nearly there, we just have to clean up after ourselves:

    function addMessageCallback(error, object) {
        if(error){
            return hoodie.task.error(originDb, message, error);
        }
        return hoodie.task.success(originDb, message);
    };

Again, Hoodie knows which task `success` refers to through the `message` object and the unique id therein. Once you've called `success` on a task, it will be marked as deleted, and the frontend component (which is listening for `'directmessage:'+message.id+':remove`) will trigger the original API call's success promise. The task's life cycle is complete.

#### Additional Notes on the Frontend Component and Application Frontend

All that's left to do now is display the message in the recipient user's app view as soon as it is saved to their database. In the application's frontend code, we'd just

    hoodie.store.on('directmessage:add'), function(messageObject){
      // Show the new message somewhere
    });

Really basic Hoodie stuff. You can also call `hoodie.store.findAll('directmessage').done(displayAllMessages)`or any of the other `hoodie.store` methods to work with the new messages objects.

As a plugin author, you could wrap your own methods around these, so app authors can stay within your plugin API's scope even when listening for native Hoodie store events or using the Hoodie core API. For example, in the plugin's frontend component, have:

    hoodie.directMessages.findAll = function(){
      return hoodie.store.findAll('directmessage');
    };

This could then be called by the app author as

    hoodie.directMessages.findAll().done(displayAllMessages, showError);

Now you know how to create and complete tasks, make your plugin promise-friendly, emit and listen for task events, build up your frontend API, write objects to user databases and a couple of other things. I'd say your're well on your way. All other features of the plugin API are waiting in the docs section for you to discover them.

There's more, though: we can build an admin panel for the `direct-messages` plugin.

#### Extending Admin Dashboard with your Plugin's own Admin Panel

For this example, let's have an admin panel which

* can send users direct messages
* has a configurable config setting for maximum message length (because it's working for Twitter, why shouldn't it work for us?)

To do this, you must provide a `/admin-dashboard` directory in your plugin's root directory, and this should contain an `index.html` with whatever you'd like your plugin's admin panel to show.

##### Admin Dashboard UIKit

Hoodie will provide a UIKit with some useful CSS/JS that you can load if you want. Ideally, you won't have to write a single line of CSS to make your plugin's panel look good, but we're not *quite* there yet.

**Note: this is very new and requires `node_modules/hoodie-server/hoodie-admin-dashboard-uikit` to have version 2.0.0 or higher. Every new Hoodie app created with `$hoodie new appName` should include this new version by default, if not, you may have to `$ hoodie cache clean`.**

Here's a preview:

![Screenshot of a plugin styled by the UIKit](admin_dashboard_uikit_screenshot.png)

Put this in the `<head>`:`<link rel="stylesheet" href="/_api/_plugins/_assets/styles/admin-dashboard-uikit.css">
`

And this before the closing `</body>` tag: `<script src="/_api/_plugins/_assets/scripts/admin-dashboard-uikit.js"></script>
`

`admin-dashboard-uikit.js` includes a bunch of stuff, among them jQuery and the Bootstrap libraries, plus everything to make checkboxes, radio buttons and dropdowns nicer (this is all automatic), plus drag-n-drop file uploads with image previews. Please consult the [UIKit guide](http://hoodiehq.github.io/hoodie-admin-dashboard-UIKit/) for further information, examples and copy-and-pastable markup.

In the near future, this will all be part of the default plugin template, so you'll have a nice scaffolding to work with.

Let's start with the easy bit:

##### Styling your Plugin's Admin Panel

As noted, your admin panel can have Admin Dashboard's styles applied by default. The UIKit is built with Bootstrap (currently 2.3.2), so all plugin developers can rely on a set of components they know will be sensibly styled by default. You're completely free to omit these styles, should you want to do something spectacular.

##### Sending Messages from Admin Dashboard

Admin Dashboard has a special version of Hoodie, called HoodieAdmin. It offers several APIs by default, like `hoodieAdmin.signIn(password)`, `hoodie.users.findAll`, and [more](https://github.com/hoodiehq/hoodie.admin.js).

It can be extended just like the standard Hoodie library:

    HoodieAdmin.extend(function(hoodieAdmin) {
      function send( messageData ) {
        var defer = hoodieAdmin.defer();

        hoodieAdmin.task.start('direct-message', messageData)
        .done( function(message) {
          hoodieAdmin.task.on('remove:direct-message:'+message.id, defer.resolve);
          hoodieAdmin.task.on('error:direct-message:'+message.id, defer.reject);
        })
        .fail( defer.reject );

        return defer.promise();
      };

      function on( eventName, callback ) {
        hoodieAdmin.task.on( eventName + ':direct-message', callback);
      };

      hoodieAdmin.directMessages = {
        send: send,
        on: on
      };
    });

Now `hoodie.directMessages.send` can be used the same way by the admin in Admin Dashboard as it can be used by the users of the app. The only difference is that other users cannot send messages to the admin, as it's a special kind of account.

##### Getting and Setting Plugin Configurations

To get / set a plugin's config, you can use `hoodieAdmin.plugin.getConfig('direct-messages')` & `hoodieAdmin.plugin.updateConfig('direct-messages', config)`. `config` is a simple object with key/value settings.

For example, let's say you'd like to limit the message length to 140 characters. You'd build a corresponding form in your `admin-dashboard/index.html` with an input for a number (let's say 140), and bind this to the submit event:

    hoodieAdmin.plugin.updateConfig('direct-messages',
      { maxLength: valueFromInputField }
    );

Then in the backend, you could check for the setting and reject messages that are longer:

    if (message.body.length > hoodie.config('maxLength')) {
      var error = {
        error: 'invalid',
        message: 'Message is too long (hoodie.config('maxLength') + ' characters maximum).'
      };
      return hoodie.task.error(originDb, message, error);
    }

#### The package.json

The package.json is required by node.js. For our plugin, it will look like this:

    {
      "name": "hoodie-plugin-direct-messages",
      "description": "Allows users to send direct messages to each other",
      "version": "1.0.0",
      "main": "worker.js"
    }

#### Writing tests
coming soon

#### Deploying your Plugin to NPM

It's as simple as `npm publish`.


#### Installing your plugin:

Inside your Hoodie application, simply run `npm install hoodie-plugin-direct-messages`.

#### Template to start
https://github.com/hoodiehq/hoodie-plugin-template
