# Hoodie Worker

This document explains how to write a Hoodie Worker.


## What is a Hoodie Worker?

A hoodie Worker is a server-side module that implements a feature that client-side code can’t implement. A good example is an email-delivery worker. To deliver an email, one needs to send data over SMTP, which is a TCP connection. Client side code doesn’t (usually) have the facilities to do so.

To keep things simple, we’ll create a *Logger* **worker**. It reads log messages from objects and writes them into a file.

A worker communicates with the frontend over [*state machine documents*](TODO LINK).

See the [Hoodie Architecture](TODO LINK) for more details.

## Getting Started

The Hoodie reference implementation uses Node.js and CouchDB. While the Hoodie Specification is implementation agnostic, these are the tools we chose to start because the helped us to get going quick.

As more language implementations for workers come up, expect language-specific documentation. Until then, we’ll show you how we write Hoodie Workers in Node.js.

This documentation assumes you want to develop your Hoodie Worker locally and only later plan on deploying it. See the [Hoodie Worker Deployment Documentation](TODO LINK) for details.

The only dependency is Node.js. Here are a few ways to install it:

Mac OS X:

    $ brew install node

[TODO: linux, windows]

Let’s make a new project directory. We are using the `worker-` prefix to make things easier to read in git.

    $ mkdir worker-log
    $ cd worker-log

We start by creating an `index.js` file. This will be the main entry point into the worker’s code. When starting out, we just put all the code we need in here, and when it gets a bit unwieldy, we move things out into other files and modules.

Copy over this template code, we’ll explain it in detail in a minute:

    module.exports = WorkerLog;
    function WorkerLog()
    {
		console.log("Logger started.");
    }

    var log = new WorkerLog();

That’s all! You can now start your worker:

    $ node index.js
    Logger Started
    $

Yay!

Well, this isn’t terribly exciting, but we’ve got the foundation going.

## The Changes Listener

You notice that the worker exits to the shell after it has output our `console.log()` message. A real worker is meant to sit in the background and react to messages sent to it.

The way this works in Hoodie is via CouchDB documents and a CouchDB feature called the *changes feed*. A CouchDB document is just a JSON object, but persistent. Documents are stored in databases. Each database has a changes feed that you can subscribe to. It sends you near-real-time notifications about what happens in the database.

An object and a document are really the same thing. We call it object when we are in the context of JavaScript and we call it document when we are in the context of CouchDB.

What we are going to do is subscribe to a database’s changes feed and listen for the addition of documents of the type `log`. We then read these documents and compile a log message from its contents and write this to a log file. So far so simple.

Luckily, the mechanics of listening to a database’s changes feed are abstracted away in the handy node module `CouchDB Changes`. To install it, run:

    $ npm install CouchDBChanges

Add this to the top of your `index.js` file:

    var CouchDBChanges = require("CouchDBChanges");

To start listening, we first need to create a *callback function* that is called for every new change that is sent to us.

Our callback for now, will only log the changes object to the command line:

    WorkerLog.prototype._changesCallback = function(error, message)
    {
        console.log(message);
    }

See *Helper Methods* below for an explanation of why we use the `prototype` syntax.

The callback will get passed two arguments, we ignore the error for now. See *Error Handling* below for more details.

Now we can set up the changes listening:

    var changes = new CouchDBChanges("http://127.0.0.1:5984/");
    changes.follow("mydatabase", this._changesCallback, {}, {
        include_docs: true}
    );

Before we can test our new changes listener, we need to start up a CouchDB instance. Make sure its location matches what we put in the code above. We assume that it runs on your local machine on the default port, and that we are using a database called `mydatabase` to test things. See [*CouchDB Setup Options*](TBD) for alternative ways to use CouchDB.

Now we can start the worker again:

    $ node index.js
    Logger started.

And we see that it does not return to the command line, but keeps “hanging there”. That’s what we want!

TBD: errors, wrong CouchDB url, database doesn't exist, etc.

If we now create a new document in the CouchDB database `mydatabase`, we should get that document logged to the command line. Open a new terminal window and type this:

    $ curl -X POST http://127.0.0.1:5984/mydatabase/ -d '{"message":"hello world"}' -H "Content-Type: application/json"

You should see something like:

    {"ok":true,"id":"e72c9af9291eae530b28a3f15d00094d","rev":"1-baa23d8189d19e166f6e0393e23b1085"}

If you switch back to the terminal where your worker is running, you should see:

    { seq: 1,
      id: 'e72c9af9291eae530b28a3f15d00094d',
      changes: [ { rev: '1-baa23d8189d19e166f6e0393e23b1085' } ],
      doc: 
       { _id: 'e72c9af9291eae530b28a3f15d00094d',
         _rev: '1-baa23d8189d19e166f6e0393e23b1085',
         message: 'hello world' } }

To stop your worker, just hit `ctrl-c`:

    ^C$

There’s three things we need to address next:

 1. Only log objects of the type `log`.
 2. Format objects to a line per entry.
 3. Write the log message to a file.

Let’s do them in that order.

### Hoodie Object Types

Hoodie defines that objects have types[^cf_types]. This is purely conventional, but it allows for all sorts of magic. All objects in Hoodie have an attribute `_id` that uniquely identifies an object globally. We usually use a UUID for that. The type is specified as a prefix to the `_id` attribute. 

[^cf_types]: See [*Hoodie Object Type Conventions*](TBD) for a full list of types and a more in-depth discussion.

Here’s an example in JSON:

    {
        "_id": "image/fb461a0bfc5a4aeefc4d7fb461a0b1c1"
    }

The type here is `image`. We are now looking for objects that are of the type `log`:

    {
        "_id": "log/4ffd901d052de901bcaa28902dda3b4a"
    }

Let’s amend our `_changesCallback()` method to only react on `log` objects:

    WorkerLog.prototype._changesCallback = function(error, message)
    {
        if(substr(message._id, 0, 3) != "log") {
            return;
        }

        console.log(message);
    }

// TBD: Future versions of this should have a *hoodie* module that mirrors the client API.

When you start the worker again and add another object to the CouchDB database, you should see no output:

    $ curl -X POST http://127.0.0.1:5984/mydatabase/ -d '{"message":"hello world"}' -H "Content-Type: application/json"
    {"ok":true,"id":"e72c9af9291eae530b28a3f15d0023dc","rev":"1-baa23d8189d19e166f6e0393e23b1085"}

    $ node index.js
    Logger started.

When you add a document with the correct type:

    $ curl -X POST http://127.0.0.1:5984/mydatabase/ -d '{"_id":"log/foobar","message":"hello world"}' -H "Content-Type: application/json"
    {"ok":true,"id":"log/foobar","rev":"1-baa23d8189d19e166f6e0393e23b1085"}

You should see:

    { seq: 3,
      id: 'log/foobar',
      changes: [ { rev: '1-baa23d8189d19e166f6e0393e23b1085' } ],
      doc:
       { _id: 'log/foobar',
         _rev: '1-baa23d8189d19e166f6e0393e23b1085',
         message: 'hello world' } }

So far, so good.

Next up, we’ll format our message a little bit. Before we dive into the actual formatting code, we’ll *define* a format that we expect a log object to look like. This can be later be enforced, so we know only to expect objects of the type `log` that have all the required fields.

    {
        "_id": "log/*",
        "message": "Log Message",
        "timestamp": 1234567890123, // seconds since epoch
        "level": "one of 'info', 'warn', 'debug', 'tmi'",
        "tag": "(optional, user-defined tag)"
    }

We’ll take objects of that structure and turn them into a string that looks like this:

    timestamp [level[, tag]: message

For example:

    1234567890123 [debug]: Hello World

Or, with a tag:

    1234567890123 [info, email]: Email X Sent.

Let’s do it!

    WorkerLog.prototype._changesCallback = function(error, message)
    {
        var obj = message.doc;
        if(obj._id.substr(0, 3) != "log") {
            return;
        }

        var log_message = "";
        if(obj.tag) {
            log_message = util.format("%d [%s, %s]: %s",
                obj.timestamp, obj.level, obj.tag, obj.message);
        } else {
            log_message = util.format("%d [%s]: %s",
                obj.timestamp, obj.level, obj.message);
        }
        console.log(log_message);
    }

We keep looking for `log` documents. The we see if the current object has a `tag` member, and format the message string accordingly. Finally, we output the message.

Note that we are using the `util` module here. It ships with Node.js, so you don’t have to install anything, but to use it you have to declare it in your module. We add this to the top of our `index.js` file:

    var util = require("util");

If you run your worker again now, you should see a bunch of undefined and NaN messages. That’s because your test document from earlier doesn’t have the required fields. If you go to CouchDB’s [administration console](http://127.0.0.1:5984/_utils/), you can edit the document and add the fields `message`, `timestamp` and `level`, and if you want `tag`, but that’s no required.

When you save the document now, you should see something like this:

    1342020415 [debug]: hello world

Or, when you have a `tag`:

    1342020415 [debug, foo]: hello world

Yay logging, we are getting closer.

Finally, we want to log to a file, not just the command line. To do this, we’ll use Node.js’s `fs.appendFileSync()` method. To get access to that method, we need to require the `fs` module at the top of our `index.js`:

    var fs = require("fs");

Finally, we change the call to `console.log` to:

    fs.fileAppendSync("/tmp/hoodie-worker-log.log", log_message + "\n");

When we start the worker now, we go back to just seeing the welcome message:

    $ node index.js
    Logger started.

But that’s expected. If you open another terminal you can see the messages coming in in real-time with:

    $ tail -f /tmp/hoodie-worker-log.log
    1342020415 [debug, foo]: hello world

Yay Logging.

This concludes the main section of this tutorial. The following sections fill in a few blanks that we glossed over in favour of getting you up and running quickly.


## Helper Methods

Helper methods are methods that we need during the operation of our worker, but that are not exposed to the outside of the module.

The `_changesCallback` method above is one such helper method.

// TBD expand

## Testing

## Configuring Workers

## Workers Callbacks

## Error Handling

## Organising Code

## Using Modules

## Serving Multiple Databases
