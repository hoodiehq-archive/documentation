# Hoodie Worker

This document explains how to write a Hoodie Worker.


## What is a Hoodie Worker?

A hoodie Worker is a server-side module that implemets a feature that client-side code can’t implement. A good example is an email-delivery worker. To deliver an email, one needs to send data over SMTP, which is a TCP connection. Client side code doesn’t (usually) have the facilities to do so.

A worker communicates with the frontend over [*state machine documents*](TODO LINK).

See the [Hoodie Architecture](TODO LINK) for more details.


## Getting Started

The Hoodie reference implementation uses Node.js and CouchDB. While the Hoodie Specification is implementation agnostic, these are the tools we chose to start because the helped us to get going quick.

As more language implementations for workers come up, expect langauge-specific documentation. Until then, we’ll show you how we write Hoodie Workers in Node.

This documentation assums you want to develop your Hoodie Worker locally and only later plan on deploying it. See the (Hoodie Worker Deployment Documentation)[TODO LINK] for details.

The only dependency is Node.js. Here are a few ways to install it:

Mac OS X:

    $ brew install node

[TODO: linux, windows]

Let’s make a new project directory. We are using the `worker-` prefix to make things easier to read in git.

    $ mkdir worker-does-cool-stuff
    $ cd worker-does-cool-stuff

We start by creating an `index.js` file. This will be the main entry point into the worker’s code. When starting out, we just put all the code we need in here, and when it gets a bit unwieldy, we move things out into other files and modules.

Copy over this template code, we’ll explain it in detail in a minute:

    module.exports = WorkerDoesCoolStuff;
    function WorkerDoesCoolStuff()
    {
		console.log("Cool Stuff is happening");
    }

That’s all! You can now start your worker:

    $ node index.js
    Cool Stuff is happening
    $

Yay!

Well, this isn’t terribly exciting, but we’ve got the foundation going.

## Helper Methods

## Testing

## Configuring Workers

## Workers Callbacks

## Organising Code

## Using Modules

