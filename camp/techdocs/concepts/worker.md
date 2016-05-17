---
layout: layout-api
locales: camp
---

# Hoodie Worker

This document explains how to write a Hoodie Worker.


## What is a Hoodie Worker?

A hoodie Worker is a server-side module that implements a feature that client-side code can’t implement. A good example is an email-delivery worker. To deliver an email, one needs to send data over SMTP, which is a TCP connection. Client side code doesn’t (usually) have the facilities to do so.

To keep things simple, we’ll create a Logger worker. It reads log messages from objects and writes them into a file.

A worker communicates with the frontend over [*state machine documents*](TODO LINK).

See the [Hoodie Architecture](TODO LINK) for more details.

## Getting Started

The Hoodie reference implementation uses Node.js and CouchDB. While the Hoodie Specification is implementation agnostic, these are the tools we chose to start because they helped us to get going quick.

As more language implementations for workers come up, expect language-specific documentation. Until then, we’ll show you how we write Hoodie Workers in Node.js.

This documentation assumes you want to develop your Hoodie Worker locally and only later plan on deploying it. See the [Hoodie Worker Deployment Documentation](TODO LINK) for details.

If you want  to make sure you don’t make any typos copying the code, or, when we later only show additions to the code, we set up a [git repository](https://github.com/hoodiehq/worker-log/) with all the different steps in separate branches, we link to the relevant parts later too.

The only dependency is Node.js version 0.8.0 or higher. Here are a few ways to install it:

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

[Repo Link](https://github.com/hoodiehq/worker-log/blob/how-to-1/index.js)

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

To start listening, we first need to create a *callback function* that is called for every new change that is sent to us. Put this new function before the current last line (which should be `var log = new WorkerLog();`).

Our callback function will, for now, only log the changes object to the command line:

    WorkerLog.prototype._changesCallback = function(error, message)
    {
        console.log(message);
    }

See *Helper Methods* below for an explanation of why we use the `prototype` syntax.

The callback will get passed two arguments, we ignore the error for now. See *Error Handling* below for more details.

Now we can set up the changes listener. This goes inside the `WorkerLog()` function at the top, after our initial `console.log("Logger started.");`.

    var changes = new CouchDBChanges("http://127.0.0.1:5984/");
    changes.follow("myDatabaseName", this._changesCallback, {}, {
        include_docs: true}
    );

[Repo Link](https://github.com/hoodiehq/worker-log/blob/how-to-2/index.js)

If this is your first stop after the introductory [getting started-readme](https://github.com/hoodiehq/documentation/blob/master/development-setup.md), try following a user database. If you've run all the code examples from the readme, `joe$example_com` will work as a database name.

Before we can test our new changes listener, we need to start up a CouchDB instance. Make sure its location matches what we put in the code above. We assume that it runs on your local machine on the default port, and that we are using a database called `mydatabase` to test things. See [*CouchDB Setup Options*](TBD) for alternative ways to use CouchDB. See [*Serving Multiple Databases*](below) for details on how not to hard code the database name for a single database into your worker.

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
        if(message.doc._id.substr(0, 3) != "log") {
            return;
        }

        console.log(message);
    }

[Repo Link](https://github.com/hoodiehq/worker-log/blob/how-to-3/index.js)

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

Next up, we’ll format our message a little bit. Before we dive into the actual formatting code, we’ll *define* a format that we expect a log object to look like. This can be later enforced, so we know only to expect objects of the type `log` that have all the required fields.

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

[Repo Link](https://github.com/hoodiehq/worker-log/blob/how-to-4/index.js)

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

    fs.appendFileSync("/tmp/hoodie-worker-log.log", log_message + "\n");

[Repo Link](https://github.com/hoodiehq/worker-log/blob/how-to-5/index.js)

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

The `_changesCallback` method above is one such helper method. If you just need a single helper method, the code is fine as is, but if you want to call other helper functions from within your first helper function, we must make a subtle change:

    -    changes.follow("mydatabase", this._changesCallback, {}, {
    +    changes.follow("mydatabase", this._changesCallback.bind(this), {}, {

[Repo Link](https://github.com/hoodiehq/worker-log/blob/how-to-6/index.js)

This makes it that the `this` variable in all helper methods refers to the main module function. In our case `WorkerLog()`. The result is that we now can call other helper methods with `this._otherHelperMethod()` instead of `WorkerLog.prototype._otherHelperMethod()` which should be more convenient.


## Testing

You want to make sure that the functionality of your worker keeps working (pun definitely intended) as you keep developing. At Hoodie, we’re using [Mocha](http://visionmedia.github.com/mocha/). You are free to use whatever you fancy, but this example uses Mocha and Node.js’s built-in [assertions](http://nodejs.org/api/assert.html).

First, install mocha:

    $ npm install -g mocha

Next, create a `test` directory and test file:

    $ mkdir test
    $ $EDITOR test/test.js

Paste in this code:

    var assert = require("assert")
    describe("Worker", function(){
      describe("#test()", function(){
        it("should do the right thing", function() {
            assert(true);
        });
      });
    });

[Repo Link](https://github.com/hoodiehq/worker-log/blob/how-to-7/index.js)

Then, run `mocha`:

    $ mocha

    .

    ✔ 1 test complete (2ms)

Yay, the setup works, but we don’t have anything to test, really.

Let’s revisit our worker code and see what we can test. The `_changesCallback()` method does a few things:

 * filter out messages that are not of type `log`.
 * create a formatted log message from a log object.
 * write the message to the log file.

It’s generally a good idea to keep methods short and let them do one thing. Our method here does a number of things. It sounds like a good idea to split that up.

Let’s start with filtering out objects that are not of the type `log`:

    WorkerLog.prototype._isLogObject = function(obj)
    {
        if(obj._id.substr(0, 3) == "log") {
            return true;
        }

        return false;
    }

We take the code out of `_changesCallback()` and put it into its own method `isLogObject()`. The `is` prefix tells us that the method will return true or false. Note that we flipped the comparison operator in the `if` statement to `==`.

To make use of the function, we add this to `_changesCallback()`:

    if(!this._isLogObject(obj)) {
        return;
    }

[Repo Link](https://github.com/hoodiehq/worker-log/blob/how-to-8/index.js)

If you start the worker again, everything should still work as before.

Now we have a method that does one job and we can test whether it does a good job of it:

    var assert = require("assert")
    describe("WorkerLog", function(){
      describe("#_isLogObject()", function(){
        it("filters log objects correctly", function() {
            var log_object = {
                _id: "log/1234"
            };
            var not_a_log_object = {
                _id: "image/4321"
            };
            var WorkerLog = require("../index");
            assert(WorkerLog.prototype._isLogObject(log_object));
            assert(!WorkerLog.prototype._isLogObject(not_a_log_object));
        });
      });
    });

[Repo Link](https://github.com/hoodiehq/worker-log/blob/how-to-9/index.js)

We create two objects, one that is of type `log` and one that isn’t and then we run both through the `_isLogObject()` method and assert it’s success and failure respectively.

If we run `mocha` again, our test passes.

    $ mocha

      Logger started.
    .

      ✔ 1 test complete (45ms)

Great! But we’re not done yet. `_changeCallback()` still does two jobs. Let’s move the message formatting into its own method:

    WorkerLog.prototype._formatLogMessage = function(obj)
    {
        var log_message = "";
        if(obj.tag) {
            log_message = util.format("%d [%s, %s]: %s\n",
                obj.timestamp, obj.level, obj.tag, obj.message);
        } else {
            log_message = util.format("%d [%s]: %s\n",
                obj.timestamp, obj.level, obj.message);
        }
        return log_message;
    }

And call it from `_changesCallback()`:

    var log_message = this._formatLogMessage(obj);
    fs.appendFileSync("/tmp/hoodie-worker-log.log", log_message);

[Repo Link](https://github.com/hoodiehq/worker-log/blob/how-to-10/index.js)

Now we can write a test for the formatting method:

    describe("#_formatLogMessage()", function() {
        it("should format messages correctly", function() {
            var log_object = {
                _id: "log/1234",
                message: "log message",
                level: "debug",
                timestamp: 1234567890
            };
            var WorkerLog = require("../index");
            var expected_message = "1234567890 [debug]: log message\n";
            var result = WorkerLog.prototype._formatLogMessage(log_object);
            assert.equal(expected_message, result);
        });
        it("should format messages with tags correctly", function() {
            var log_object = {
                _id: "log/1234",
                message: "log message",
                level: "debug",
                tag: "internal",
                timestamp: 1234567890
            };
            var WorkerLog = require("../index");
            var expected_message = "1234567890 [debug, internal]: log message\n";
            var result = WorkerLog.prototype._formatLogMessage(log_object);
            assert.equal(expected_message, result);
        });
    });

[Repo Link](https://github.com/hoodiehq/worker-log/blob/how-to-11/index.js)

Let’s run `mocha` again:

    $ mocha

      Logger started.
    ...

      ✔ 3 tests complete (53ms)

Hooray, we’re tested now!

To recap, we learned how to separate out code into discrete methods that we can test. The methods define what makes a worker special, and we avoid testing things like the changes follower itself which is already encapsulated in a module.

Note that for now, you need a running CouchDB instance for the tests to succeed. We’ll fix that soon!

## NPM-ness

We are using Node.js to write our worker. Node.js comes with a handy developer tool called *npm*. We used npm earlier to install the `CouchDBChanges` package. Npm can do all sorts of good things for us. We should use it.

To get started, we need to create a new file `package.json` in the top level of our worker directory:

    {
        "name": "hoodie-worker-log",
        "version": "0.0.1",
        "description": "log things to a file, Hoodie-style",
        "author": "Hoodie",
        "scripts": {
            "start": "node index.js",
            "test": "mocha"
        },
        "dependencies": {
            "CouchDBChanges": ">=0.0.3"
        },
        "devDependencies": {
            "mocha": ">=1.3.0"
        }
    }

[Repo Link](https://github.com/hoodiehq/worker-log/blob/how-to-12/index.js)


Read `npm help json` for details on what all this means in detail. Just briefly, a name will allow us to register the worker with npm, so other people can make use of it. We give it an early version number that we can increase as we go along. The description explains what our worker does. In `scripts` we can tell npm what to run when called as `npm start` or `npm test` which becomes really useful later. And finally, we register our dependencies, to make sure we always get the correct version of the CouchDBChanges package.

To start our worker now, we can run `npm start`:

    $ npm start

    > hoodie-worker-log@0.0.1 start /Users/jan/Work/hoodie/worker/worker-log
    > node index.js

    Logger started.

Looking good.


## Continuous Integration with Travis CI

We already have unit tests set up. That’s great, but we can do one better: continuous integration that runs our unit tests with every commit to our repository. This assumes you are using GitHub.

To enable Travis integration, we need to create a `.travis.yml` file:

    language: node_js
    node_js:
      - 0.8

Then go to the [Travis CI Website](http://travis-ci.org) and follow the instructions to set up your repository.

[Repo Link](https://github.com/hoodiehq/worker-log/blob/how-to-13/index.js)

Note that for now, you need a running CouchDB instance for the tests to succeed, so actually pushing to Travis CI will fail. We’ll fix that very soon!

## Configuring Workers

So far we hardcoded a few values, the CouchDB server address, the database name and the log file. In the real world, these things should be configurable. Let’s do that now. As a first step, we make the the hardcoded values variables:

    var config = {
        server: "http://127.0.0.1:5984",
        database: "mydatabase",
        logfile: "/tmp/hoodie-worker-log.log"
    };

We then pass the `config` variable to our instantiation of `WorkerLog`:

    var log = new WorkerLog(config);

And then we replace all occurrences in our code, as shown in this diff:

    -function WorkerLog()
    +function WorkerLog(config)
     {
    +    this.config = config;
         console.log("Logger started.");

    -    var changes = new CouchDBChanges("http://127.0.0.1:5984/");
    -    changes.follow("mydatabase", this._changesCallback.bind(this), {}, {
    +    var changes = new CouchDBChanges(this.config.server);
    +    changes.follow(this.config.database, this._changesCallback.bind(this), {}, {
             include_docs: true}
         );
     }
    @@ -43,7 +44,13 @@ WorkerLog.prototype._changesCallback = function(error, message)
         }

         var log_message = this._formatLogMessage(obj);
    -    fs.appendFileSync("/tmp/hoodie-worker-log.log", log_message);
    +    fs.appendFileSync(this.config.logfile, log_message);
     }

[Repo Link](https://github.com/hoodiehq/worker-log/tree/how-to-14)

Now that our code is variable, we need a way to pass in new configuration options.

This is easy, we just extend what we already have:

    var config = {
        server: process.env.HOODIE_SERVER || "http://127.0.0.1:5984",
        database: process.env.HOODIE_DATABASE || "mydatabase",
        logfile: process.env.HOODIE_LOGFILE || "/tmp/hoodie-worker-log.log"
    };

[Repo Link](https://github.com/hoodiehq/worker-log/tree/how-to-14b)

This code tries to read environment variables, and if it doesn’t find them, assigns our default values.

To, say, override the server and database values, you can do:

    $ HOODIE_SERVER="http://example.com" HOODIE_DATABASE="somedatabase" npm start

Note that other shells might have other syntaxes to set up environment variables.

// TBD: reload and whatnot, cf heroku


## Organising Code

Now we take a step back from coding, and introduce some structure that will make things easier for us down the line: we reorganise our code into multiple files.

The Node.js module pattern we are using here (we didn’t tell you, but it’s what we are secretly doing), keeps the `index.js` file as lean as possible, our’s is going to look like this:

    var WorkerLog = require("./lib/worker-log");

    var config = {
        server: "http://127.0.0.1:5984",
        database: "mydatabase",
        logfile: "/tmp/hoodie-worker-log.log"
    };

    var log = new WorkerLog(config);

And `lib/worker-log.js` will include the rest of our code.

This allows us finally to run our tests without also starting the worker fully. That means we can run our tests now without requiring a working CouchDB instance. And our Travis CI setup also works, yay!

See the [Repo Link](https://github.com/hoodiehq/worker-log/tree/how-to-15)
 for how we need to adjust a few require statements in our tests.


## Serving Multiple Databases

For now, our worker will only listen to the changes of a single database. To be able to log from multiple databases, we could just launch a worker per database and pass the database name to the worker using environment variables (see [*Configuring Workers*][] for details on that).

With hundreds and thousands of users, that would mean as many Node.js processes that almost all do nothing. With a little bit of work, we can make our worker handle all databases in a single, busy Node.js process. The trick is to instantiate multiple workers, one per database.

Here’s what the `index.js` file looks like:

    var WorkerLog = require("./lib/worker-log");
    var request = require("request");

    var config = {
        server: process.env.HOODIE_SERVER || "http://127.0.0.1:5984",
        logfile: process.env.HOODIE_LOGFILE || "/tmp/hoodie-worker-log.log"
    };

    var workers = [];
    request({
      uri: config.server + "/_all_dbs"
    }, function(error, response, body) {
      if(error !== null) {
        console.warn("init error, _all_dbs: " + error);
      }

      var dbs = JSON.parse(body);
      dbs.forEach(function(db) {
        if(db[0] == "_") {
            // skip system dbs
            return;
        }
        config.database = db;
        var worker = new WorkerLog(config);
        workers.push(worker);
      });
    });

[Repo Link](https://github.com/hoodiehq/worker-log/tree/how-to-16).

First, we require the `request` module as we’ll need that later. Next, we remove the `database` configuration value from our `config` object. Then we initialise an empty array to hold all instances of our workers. We then send a request to the CouchDB server and request a list of all databases. For each database, we add its name to the `config` object and then start a new worker with that configuration. We skip databases that start with an underscore, as they are special to CouchDB.

When we start our worker now, we should see:

    $ npm start

    > hoodie-worker-log@0.0.1 start /Users/jan/Work/hoodie/worker/worker-log
    > node index.js

    Logger started for 'mydatabase'.

If you have more databases in your CouchDB instance, you should get a line for each of them, of the format "Logger started for 'databasename'".



## Error Handling

## Ignoring Already Processed Objects

## Objects as State Machines

## Deploying a Worker with Heroku

## Registering a With Hoodie

## Remote Configuration
