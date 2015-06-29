---
layout: layout-plugins
locales: en
---

## Table of Content

##### 1. Introduction
- Intro
- What is a Hoodie plugin?
- What can a Hoodie plugin do?

##### 2. Prerequisites
- Prerequisites
- The Hoodie Architecture
- The Plugin API and Tasks

##### 3. Build a plugin
- Let's Build a Direct Messaging Plugin
- How Will this Work?
- Where to Start <br/><br />
- Structuring a Plugin<br /><br />
- The Direct Messaging Plugin's Frontend Component
- The Direct Messaging Plugin's Backend Component
- Extending Admin Dashboard with your Plugin's own Admin Panel
<br /><br />
- The package.json

##### 4. Testing
- Writing tests

##### 5. Deployment
- Deploying your Plugin to NPM

##### 6. Start with the template
- Start with the template


### Introduction

Hoodie's API offers a small set of core features that handle data storage, sync and authentication. All other functionality you may need can be added by building plugins. Our goal is to so make Hoodie as extensible as possible, while keeping the core tiny, so you can add the modules _you_ need and just them.

#### What can Hoodie plugins do?

In short, anything Hoodie can do. A plugin can work in Hoodie's Node.js backend and manipulate the database or talk to other services, it can extend the Hoodie frontend library's API, and it can appear in the admin dashboard that each Hoodie app has, and extend that with new stats, configurations and whatever else you can think of.

#### Example plugins

You could …

- log special events and send out emails to yourself whenever something catastrophic / wonderful happens (a bit like your own IFTTT for your app)
- make Node.js resize any images uploaded to your app, generate a couple of thumbnail versions, save them to S3 or another server and reference them in your database
- securely authenticate your users with services like Twitter or GitHub and exchange data
- extend Hoodie so signed-up users can send direct messages to each other

### Prerequisites: preparations for getting started

All you need for writing a Hoodie plugin is a running Hoodie app. Your plugin lives directly in the app's **node_modules** directory and must be referenced in its **package.json**, just like any other npm module. You don't have to register and maintain it as an npm module once it is complete.
(As we'd like to be able to use npm's infrastructure for helping people find and install Hoodie plugins in the longterm, we still want to encourage you to use it as well, this would help the community a lot. We'll explain how to do this at the end of this document.)

#### The Hoodie Architecture

<!--
If you haven't seen it yet, now is a good time to browse through [the explanation of the Hoodie stack](http://hoodiehq.github.io/hood.ie-website-old/intro.html), and how it differs from what you might be used to. 
-->
One of Hoodie's most powerful features is that it is offline first, which means all Hoodie-applications (and therefore also your plugin) work anytime, regardless of the user's connection status. This works because we don't let the frontend send tasks to the backend directly in Hoodie-Apps. Instead, the frontend deposits tasks in the database, which is both local and remote, and syncs whenever it can (which means: whenever it detects internet connection; if there's none, it doesn't care). After sync, these tasks are picked up by the backend, which acts accordingly to what it's told to do by the tasks. When completed, the database emits corresponding events, which then the frontend can act upon.
Thus, we provide you with a Plugin API that handles generating and managing these tasks, writing stuff to user databases and so all other things you may need for building _your_ plugin.

#### Which components do Plugins have?

Hoodie plugins have three distinct parts, and you will need at least one of them (depending on what you want your plugin to do). They are:

- __A frontend component__ that extends the Hoodie API in your frontend, written in Javascript.
- __A backend component__ that exports the server / database functionality to the plugin, written in Node.js.
- __An admin view__, which is an interface written in HTML, CSS and JS, that appears in your Hoodie admin dashboard to give you the option to interact with the user e.g. configurate the plugin.

#### The Plugin API and Tasks

Currently, the only way to get the backend component of a plugin to do anything is with a task. A task is a slightly special object that can be saved into the database from the Hoodie frontend. Your plugin's backend component can listen to the events emitted when a task appears, and then do whatever it is you want it to do. You could create a task to send a private message in the frontend, for example:

<pre><code>hoodie.task.start('directmessage', {
    'to': 'Ricardo',
    'body': 'Hello there! How are things? :)'
});
</code></pre>
And in your backend component, listen for that task appearing and act upon it:

<pre><code>hoodie.task.on('directmessage:add', 
    function (dbName, task) {
        // generate a message object from the change data 
        // and store it in both users' databases
    });
</code></pre>
But we're getting ahead of ourselves. Let's do this properly and start at the beginning.

### Let's Build a Direct Messaging Plugin

#### How Will this Work?

Here's what we want the Hoodie app to be able to do with the plugin, which we'll call **directmessages**:

* Logged in users can send a direct message to any other logged in user
* Recipient users will see a new message appear in near real time

In the frontend, we need:

* a **directMessages.send()** method in the Hoodie API to add a task that sends the message
* an optional **directMessages.on()** method to listen for events that are fired, for example when a new message appears in the recipient account

In the backend, we need to:

1. check that the recipient exists
2. save the new message to the recipient's database
3. mark the original task as completed
4. if anything goes wrong, update the task accordingly

#### Where to Start

Any plugins you write live in the **node_modules** directory of your application, with their directory name adhering to the following syntax:

<pre><code>[your_application]/node_modules/hoodie-plugin-[plugin-name]</code></pre>

So, for example:

<pre><code>supermessenger/node_modules/hoodie-plugin-direct-messages</code></pre>

Everything related to your plugin goes in there.

#### Structuring a Plugin

As stated, your plugin can consist of up to three components: __frontend__, __backend__ and __admin-dashboard__. Since it is also ideally a fully qualified npm module, we also require a **package.json** with some information about the plugin.

Assuming you've got all three components, your plugin's directory should look something like this:

<pre><code>hoodie-plugin-direct-messages
    hoodie.direct-messages.js
    worker.js
    /admin-dashboard
        index.html
        styles.css
        main.js
    package.json
</code></pre>
* **hoodie.direct-messages.js** contains the frontend code
* **worker.js** contains the backend code
* **/admin-dashboard** contains the admin view
* **package.json** contains the plugin's metadata and dependencies

Let's look at all four in turn:

#### The Direct Messaging Plugin's Frontend Component

This is where you write any extensions to the client side hoodie object, should you require them. In the same way you can do

<pre><code>hoodie.store.add('zebra', {'name': 'Ricardo'});</code></pre>

from the browser in any Hoodie app, you can use the plugin's frontend component to expose something like

<pre><code>hoodie.directMessages.send({
    'to': 'Ricardo',
    'body': 'One of your stripes is wonky'
});</code></pre>

You've noticed I've used directMessages instead of our plugin's actual name "direct-messages", this is because, well, simply: I can. How and where you extend the hoodie object in the frontend is entirely up to you. Your plugin could even extend Hoodie in multiple places or override existing functionality.

All of your plugin's frontend code must live inside a file named according to the following convention:

<pre><code>hoodie.[plugin_name].js</code></pre>

In our case, this would be

<pre><code>hoodie.direct-messages.js</code></pre>

The code inside this is very straightforward:

<pre><code>Hoodie.extend(function(hoodie) {
  hoodie.directMessages = {
    send: hoodie.task('directmessage').add,
    on: hoodie.task('directmessage').on // maybe not needed
  };
});
</code></pre>

Now **hoodie.directMessages.send()** and **hoodie.directMessages.on()** actually exist. Here is **send()** in use:

<pre><code>hoodie.directMessages.send(messageData)
.done(function(messageTask){
    // Display a note that the message was sent
})
.fail(function(error){
    console.log("Message couldn't be sent: ",error);
})
</code></pre>
__Note:__ the **hoodie.task.on()** listener accepts three different object selectors after the event type, just like **hoodie.store.on** does in the hoodie.js frontend library:

* none, which means any object type: **'success'**
* a specific object type: **'directmessage:success'**
* a specific individual object **'directmessage:a1b2c3:success'**

__Important:__ Task and event names may _only_ contain _lowercase letters_, nothing else.

That's your frontend component dealt with! Remember, your plugin can consist of only this component, should you just want to encapsulate some more complex abstract frontend code in some convenience functions, for example.

But we have lots of ground to cover, so onward! to the second part:

#### The Direct Messaging Plugin's Backend Component

For reference while reading along, here's the [current state of the Plugin API](https://github.com/hoodiehq/hoodie-plugins-api/blob/master/README.md) as documented on gitHub.

By default, the backend component lives inside a **index.js** file in your plugin's root directory. It can be left there for simplicity, but Hoodie will preferentially load whatever you reference under **main** in the plugin's **package.json**.

__First things first__: this component will be written in node.js, and node in general tends to be in favor of callbacks and opposed to promises. We respect that and want everyone to feel at home on their turf, which is why all of our backend code is stylistically quite different from the frontend code.

Let's look at the whole thing first:

<pre><code>module.exports = function(hoodie, done) {
  hoodie.task.on('directmessage:add', handleNewMessage);

  function handleNewMessage(originDb, message) {
    var recipient = message.to;
    hoodie.account.find('user', recipient, 
    function(error, user) {
      if (error) {
        return hoodie.task.error(originDb, message, error);
      };
      var targetDb = 'user/' + user.hoodieId;
      hoodie.database(targetDb).add('directmessage', 
      message, 
      addMessageCallback);
    });
  };

  function addMessageCallback(error, message) {
    if(error){
        return hoodie.task.error(originDb, message, error);
    }
    return hoodie.task.success(originDb, message);
  };
  done();
};
</code></pre>
Again, let's go through line by line.

<pre><code>module.exports = function(hoodie, done) {</code></pre>

Essentially a boilerplate container for the actual backend component code. Again, we're passing the hoodie object so we can use the API inside the component. We are also passing in a function called **done** which we will need to call later, to tell Hoodie that we are done loading our plugin. Watch out for this towards the end of this section.

<pre><code>hoodie.task.on('directmessage:add', handleNewMessage);</code></pre>

Remember when we did **hoodie.task('directmessage').add** in the frontend component? This is the corresponding part of the backend, listening to the event emitted by the **task.('directmessage').add**. We call **handleNewMessage()** when it gets fired:

<pre><code>function handleNewMessage(originDb, message) {</code></pre>

Now we're getting into databases. Remember: every user in Hoodie has their own isolated database, and **task.on()** passes through the name of the database where the event originated.

<pre><code>var recipient = message.to;
hoodie.account.find('user', recipient, function(error, user) {</code></pre>

We also need to find the recipient's database, so we can write the message to it. Our **hoodie.directMessages.send()** took a message object with a **to** key for the recipient, and that's what were using here. We're assuming that users are adressing each other by their actual Hoodie usernames and not some other name.

<pre><code>if (error) {
  return hoodie.task.error(originDb, message, error);
};</code></pre>

The sender may have made a mistake and the recipient may not exist. In this case, we call **task.error()** and pass in the message and the error so we can deal with the problem where neccessary. This will emit an **error** event that you can listen for both in the front- _and/or_ the backend with **task.on()**. In our case, we were just passing them through our plugin's frontend component to let the app author deal with it. Internally, Hoodie knows which task the error refers to through the **message** object and its unique id.

<pre><code>var targetDb = 'user/' + user.hoodieId;</code></pre>

We still haven't got the recipient's database, which is what we do here. In CouchDB, database names consist of a type prefix (in this case: **user**), a slash, and an id. We recommend using Futon to find out what individual objects and databases are called. Now we get to the main point:

<pre><code>hoodie.database(targetDb).add(
    'directmessage', 
    message, 
    addMessageCallback
);</code></pre>

This works a lot like adding an object with the Hoodie frontend API, except we use callbacks instead of promises here. We've added the message data as a **message** object in the recipient's database, and if we're listening to the corresponding **new** event in the frontend, we can make it show up in near realtime.

__Note__: You'll probably be thinking: "wait a second, what if another plugin generates **message** objects too?" and that's very prescient of you. We're not dealing with namespacing here for simplicity's sake, but prefixing your object type names with your plugin name seems like an excellent idea. In that case, this line should read

<pre><code>hoodie.database(targetDb).add(
    'directmessagesmessage', 
    message, 
    addMessageCallback
);</code></pre>

but for clarity, we'll just leave that out in this example.

Anyway, we're nearly there, we just have to clean up after ourselves:

<pre><code>function addMessageCallback(error, object) {
    if(error){
        return hoodie.task.error(originDb, message, error);
    }
    return hoodie.task.success(originDb, message);
};
</code></pre>
Again, Hoodie knows which task **success** refers to through the **message** object and the unique id therein. Once you've called **success** on a task, it will be marked as deleted, and the frontend component (which is listening for **'directmessage:'+message.id+':remove**) will trigger the original API call's success promise. The task's life cycle is complete.

<pre><code>
  done();
</code></pre>

If you remember from when we started looking at this code, now is the time to tell Hoodie, that we are done with initiatlising our plugin. We do this by calling the **done** function that we got passed in as the second argument to our **module.exports** function at the top of the code.

This concludes the work we have to do on the backend.

#### Additional Notes on the Frontend Component and Application Frontend

All that's left to do now is display the message in the recipient user's app view as soon as it is saved to their database. In the application's frontend code, we'd just

<pre><code>hoodie.store.on('directmessage:add'), 
function(messageObject){
  // Show the new message somewhere
});
</code></pre>
Really basic Hoodie stuff. You can also call **hoodie.store.findAll('directmessage').done(displayAllMessages)** or any of the other **hoodie.store** methods to work with the new messages objects.

As a plugin author, you could wrap your own methods around these, so app authors can stay within your plugin API's scope even when listening for native Hoodie store events or using the Hoodie core API. For example, in the plugin's frontend component, have:
<pre><code>hoodie.directMessages.findAll = function(){
  return hoodie.store.findAll('directmessage');
};
</code></pre>
This could then be called by the app author as

<pre><code>hoodie.directMessages.findAll()
    .done(displayAllMessages, showError);</code></pre>

Now you know how to create and complete tasks, make your plugin promise-friendly, emit and listen for task events, build up your frontend API, write objects to user databases and a couple of other things. I'd say your're well on your way. All other features of the plugin API are waiting in the docs section for you to discover them.

There's more, though: we can build an admin panel for the **direct-messages** plugin.

#### Extending Admin Dashboard with your Plugin's own Admin Panel

For this example, let's have an admin panel which

* can send users direct messages
* has a configurable config setting for maximum message length (because it's working for Twitter, why shouldn't it work for us?)

To do this, you must provide a **/admin-dashboard** directory in your plugin's root directory, and this should contain an **index.html** with whatever you'd like your plugin's admin panel to show.

##### Admin Dashboard UIKit

Hoodie will provide a UIKit with some useful CSS/JS that you can load if you want. Ideally, you won't have to write a single line of CSS to make your plugin's panel look good, but we're not *quite* there yet.

**Note:** This is very new and requires **node_modules/hoodie-server/hoodie-admin-dashboard-uikit** to have version 2.0.0 or higher. Every new Hoodie app created with **$hoodie new appName** should include this new version by default, if not, you may have to **$ hoodie cache clean**.

Here's a preview:

![Screenshot of a plugin styled by the UIKit](admin_dashboard_uikit_screenshot.png)

Put this in the 
<pre><code>&lt;head>
    &lt;link rel="stylesheet" 
    href="/&#95;api/&#95;plugins/&#95;assets/styles/admin-dashboard-uikit.css">
</code></pre>

And this before the closing 
<pre><code>&lt;script src="/&#95;api/&#95;plugins/&#95;assets/scripts/admin-dashboard-uikit.js">
&lt;/script>
&lt;/body>
</code></pre>

The **admin-dashboard-uikit.js** includes a bunch of stuff, among them jQuery and the Bootstrap libraries, plus everything to make checkboxes, radio buttons and dropdowns nicer (this is all automatic), plus drag-n-drop file uploads with image previews. Please consult the <a href="http://hoodiehq.github.io/hoodie-admin-dashboard-UIKit/" target="_blank">UIKit guide</a> for further information, examples and copy-and-pastable markup.

In the near future, this will all be part of the default plugin template, so you'll have a nice scaffolding to work with.

Let's start with the easy bit:

##### Styling your Plugin's Admin Panel

As noted, your admin panel can have Admin Dashboard's styles applied by default. The UIKit is built with Bootstrap (currently 2.3.2), so all plugin developers can rely on a set of components they know will be sensibly styled by default. You're completely free to omit these styles, should you want to do something spectacular.

##### Sending Messages from Admin Dashboard

Admin Dashboard has a special version of Hoodie, called HoodieAdmin. It offers several APIs by default, like **hoodieAdmin.signIn(password)**, **hoodie.users.findAll**, and <a href="https://github.com/hoodiehq/hoodie.admin.js" target="_blank">more</a>.

It can be extended just like the standard Hoodie library:

<pre><code>HoodieAdmin.extend(function(hoodieAdmin) {
  function send( messageData ) {
    var defer = hoodieAdmin.defer();

    hoodieAdmin.task.start('direct-message', messageData)
    .done( function(message) {
      hoodieAdmin.task.on(
        'remove:direct-message:'+message.id, defer.resolve
      );
      hoodieAdmin.task.on(
        'error:direct-message:'+message.id, defer.reject
      );
    })
    .fail( defer.reject );

    return defer.promise();
  };

  function on( eventName, callback ) {
    hoodieAdmin.task.on(
      eventName + ':direct-message', callback
    );
  };

  hoodieAdmin.directMessages = {
    send: send,
    on: on
  };
});
</code></pre>

Now **hoodie.directMessages.send** can be used the same way by the admin in Admin Dashboard as it can be used by the users of the app. The only difference is that other users cannot send messages to the admin, as it's a special kind of account.

##### Getting and Setting Plugin Configurations

To get / set a plugin's config, you can use 
<pre><code>hoodieAdmin.plugin.getConfig('direct-messages');</code></pre>
and 
<pre><code>hoodieAdmin.plugin.updateConfig('direct-messages', config);</code></pre>

Here **config** is a simple object with key/value settings.

For example, let's say you'd like to limit the message length to 140 characters. You'd build a corresponding form in your **admin-dashboard/index.html** with an input for a number (let's say 140), and bind this to the submit event:

<pre><code>hoodieAdmin.plugin.updateConfig('direct-messages',
  { maxLength: valueFromInputField }
);</code></pre>

Then in the backend, you could check for the setting and reject messages that are longer:

<pre><code>if (message.body.length > hoodie.config('maxLength')) {
  var error = {
    error: 'invalid',
    message: 'Message is too long (
      hoodie.config('maxLength') + ' characters maximum).'
  };
  return hoodie.task.error(originDb, message, error);
}</code></pre>

#### The package.json

The package.json is required by node.js. For our plugin, it will look like this:

<pre><code>{
  "name": "hoodie-plugin-direct-messages",
  "description": "Allows users to send DMs to each other",
  "version": "1.0.0",
  "main": "worker.js"
}</code></pre>

#### Writing tests
coming soon

#### Deploying your Plugin to NPM

It's as simple as **npm publish**.


#### Installing your plugin:

Inside your Hoodie application, simply run 

<pre><code>npm install hoodie-plugin-direct-messages</code></pre>.

#### Template to start
Find the plugin template <a href="https://github.com/hoodiehq/hoodie-plugin-template" target="_blank">here.</a>
