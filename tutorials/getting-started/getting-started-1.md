# Getting started 1

## Description

GS1 is the first tutorial you'd watch/read after successfully installing Hoodie. As such, it covers

- starting hoodie-cli
- creating new app (default or custom with -t)
- app, admin and Futon URLs
- structure of a Hoodie Project
- including the script
- the global window.hoodie object

## Script

# Introduction

Hello! My name is ???? and this is the first part of Getting Started with Hoodie, which describes the first steps after you've successfully installed it. I'll be showing you how to create new apps, what a Hoodie project folder looks like, and how to set your project up to make use of the Hoodie library.

As I said, this video assumes you've already installed Hoodie, so if you haven't please watch the installation video for your respective platform first.

# Creating a new Hoodie app

Hoodie comes with a command line tool, called Hoodie CLI, which helps you with a lot of Hoodie-related stuff, like setting up and running an app. If you're unsure about anything concerning the CLI, just enter `hoodie -h` for some hints.

The very first step is using Hoodie CLI to instantiate your new application. In your terminal, enter

`hoodie new testapp`

You'll be prompted to enter a password for the Admin Dashboard, just pick something simple for now, like `123`.

This will create a folder called `testapp`, in which you'll find a simple demo application. Let's `cd testapp` and start up the Hoodie server!

`hoodie start`

That's it, your app should now start up and tell you a bunch of things about itself, for example where your app is actually hosted and which plugins it is running. The first thing you'll notice though is that Hoodie opens a browser with the demo app already running in it. As a side note, if you don't want this, start the Hoodie server with `hoodie start -n`, for "no new browser tab please, I've already got one."

Let's scan through the CLI output really quickly:

    Version: 0.5.1 (node v0.10.29, npm 1.4.21, platform: darwin)

    Initializing...
    CouchDB started: http://127.0.0.1:6098
    Waiting for CouchDB [---*--] SUCCESS
    prompt: Please set an admin password :
    WWW:    http://127.0.0.1:6096
    Admin:  http://127.0.0.1:6097
    Starting Plugin: 'hoodie-plugin-appconfig'
    Starting Plugin: 'hoodie-plugin-email'
    Starting Plugin: 'hoodie-plugin-users'
    All plugins started.

    [hoodie] Hoodie app is running!

There are three URLs in here:

1. __The CouchDB endpoint__. It's what the Hoodie library talks to when it fetches and stores data. You can append `/_utils` to it to reach the CouchDB database admin tool (similar to phpMyAdmin for MySQL), which is called Futon. You can sign in to Futon with the admin password you set earlier. For now, you don't really have to bother with it.
2. __The application's URL__. This is the URL that Hoodie just opened in a browser for you, its where your app is running.
3. __The Admin Dashboard's URL__. We'll cover the dashboard in a later screencast, but it's where you can see how many users you have, reset their passwords, check out plugin backends etc. Again, the admin password you previously set will get you in.

But before we look at the demo app, let's stop the server with `ctrl-c` (on Macs) and take a quick look at the application folder.

# The Structure of a Hoodie Application

Let's look at folders first. At the top: `data/`. Yup, that's your database. It's not hidden away in `usr/local/` somewhere, it's right there in your app folder. This setup makes it really easy to move the app and its data to another system without much hassle. Also, if you want to clear all of your test data during development, you can just delete or rename this folder, Hoodie will recreate it and you can start with a clean slate.

`node_modules`, if you're unfamiliar with it, is where npm, the package management system for Node, keeps all its files. Hoodie uses it to manage its plugins and dependencies, and you might use it too to manage front- and backend modules in your app. The content of this folder is determined by the `package.json` file in the app folder. To learn more about npm, check out [this introduction](#).

`www` is where your app is hosted from. It includes the usual `index.html` and all of the app's assets. If you're into task runners such as Grunt or Gulp, this is where you'd put your compiled code (it's practically your `dist` folder). Hoodie doesn't care about what else you add to the app folder, so feel free to throw in your source folder, tests, more documentation, whatever you like.

# Templates

Now of course, you won't want to start with the demo application every single time, which is why `hoodie new` supports templates.

`hoodie new <appname> -t <template>`

[WIP]

# Including Hoodie in your Application

The demo app will already have this line, but essentially, all you need to do to make your app Hoodie-ready is include a single js library:

    <script src="/_api/_files/hoodie.js"></script>

You'll notice that this file isn't in `node_modules` or some `vendor` or `lib` folder, instead, it is served directly by the Hoodie server itself. This is cool because it automatically contains all of the installed plugins' frontend code, too. Less hassle for you!

That's actually it.

# The global Hoodie object

Hoodie is designed to stay out of your way and let you build frontends the way you like to build frontends. The only way you talk to Hoodie in the frontend of your app is through the Hoodie API, and that lives in a global window object called, unsurprisingly, `window.hoodie`, or simply `hoodie`.

Go ahead, open the app in your browser, open the browser's dev tools and type `hoodie.`, it'll show you all of the globally available methods, like `hoodie.account` and `hoodie.store`, which are the most important ones. We'll cover these two in the next part of this series.

For now, congratulations! You've created a demo Hoodie app, learned about the basic structure of a Hoodie project, you know all about the endpoints and app URLs and how to include and use the Hoodie library in your project. I'd say your set for part two!











