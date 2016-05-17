---
layout: layout-start
locales: camp
---

# Getting Started with Hoodie - Part 1

This is the first part of Getting Started with Hoodie, which describes the first steps after you've successfully [installed Hoodie and its prerequisites](/camp/start/). In this guide you'll learn how to create a demo Hoodie app, learn about the basic structure of a Hoodie project and its folders, the endpoints and app URLs and how to include and use the Hoodie library in your project.

### Topics Covered in this guide

1. Creating a new app
2. App, Admin and Futon URLs
3. Structure of a Hoodie Project
4. Including the Script
5. The global window.hoodie Object

If you experience any problems at any step of this doc, please check our <a href="http://faq.hood.ie" target="_blank">FAQ</a> or <a href="http://hood.ie/chat" target="_blank">get in touch with us on IRC or Slack</a>.

### 1. Creating a new Hoodie app

First you need to create a new folder, let’s call it `testapp`

```bash
$ mkdir testapp
```

Now we need to create a `package.json` file. For that we can use [npm](https://www.npmjs.com/) which comes with Node by default. It will ask you a few questions, you can simply press enter to leave the default values.

```bash
$ npm init
```

If you are interested, here are docs on the [npm init](https://docs.npmjs.com/cli/init) command.

Now we can install `hoodie` using npm

```bash
$ npm install --save
```

If you are curious what happens in the background, here are docs for the [npm install](https://docs.npmjs.com/cli/install) command.

Now you need to edit the `package.json` file. We need to set the `"start"` script to `"hoodie"`. The result should look something like this

```json
{
  "name": "funky",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "start": "hoodie",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

Now you can start the app

```bash
$ npm start
```

Great, your app started up and is now telling you at which URL you can access your app. By default that is [http://127.0.0.1:8080](http://127.0.0.1:8080)

Congratulations, you just created your first Hoodie App :)



### 2. Structure of a Hoodie Project

#### public folder

When you open your app in the browser you will see Hoodie’s default page telling
you that your app has no `public/` folder. So let’s create it

```bash
mkdir public
touch public/index.html
```

Now edit the `public/index.html` file and past in the following content.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>My Hoodie App</title>
  </head>
  <body>
    <h1>My Hoodie App</h1>

    <script src="/hoodie/client.js"></script>
  </body>
</html>
```

You need to stop the server now (`ctrl` + `c`) and start it again.
If you reload your app in your browser, you will now see your HTML file.

The only line interesting for us is the `<script src="/hoodie/client.js"></script>` tag.

Where is the `/hoodie/client.js` you wonder? Well, it’s magic ✨
Okay, because it’s you, you can actually find the file at `./.hoodie/client.js` (see the `.` in `.hoodie`?).
But ignore this folder, it’s used internally by Hoodie, all you need to know is that it’s there and that
if you use `git` make sure to add it to your `.gitignore` file :)

The `/hoodie/client.js` is loading the dynamic Hoodie Client for your Hoodie Server.
Open your browser’s console (command + alt + j on Mac, ctrl + alt + j on Windows) and type in `hoodie`.
This is how Hoodie apps talk to their servers. For example, type in

```js
hoodie.account.signUp({username: 'Robin', password: 'secret'})
```

Congratulations, you just created a user account :) You can now sign in to it using

Okay we got ahead of ourselves, the short version is: all assets like html, JavaScript or CSS files in the public folder will be served by the Hoodie Server at the `/` root path.

#### package.json (file)

Every Hoodie app is a Node.js application and every Node.js application needs a **package.json** file. It defines the name of the app (**testapp** in this case) and its dependencies. It is used to install and declare the used versions of the <a href="https://github.com/hoodiehq/hoodie" target="_blank">Hoodie Server</a> and Hoodie plugins that your app uses.

#### node_modules (folder)

This is where npm, the package management system for Node, keeps all its files. Hoodie uses it to manage its plugins and dependencies, and you might use it too to manage front- and backend modules in your app. The content of this folder is determined by the previously mentioned **package.json** file in the app folder. To learn more about npm, check out <a href="http://howtonode.org/introduction-to-npm" target="_blank">this introduction</a>.

The contents of this folder are essential for the Hoodie app to work, so there are two things to remember:

1. Do not edit the contents of this folder manually (only through npm).
2. Do not add this folder to source control.

All your changes to the files in this folder will be overwritten whenever you have to install or update dependencies, and it makes no sense to put this huge folder into source control, because everyone can restore it with a simple command:

```bash
$ npm install
```

#### .hoodie (folder)

This is Hoodie’s secret folder. Your own Hoodie Client is stored here after it gets dynamically created, as well as database files or your app’s configuration.

We could have put it somewhere in **usr/local/**, but it's right there in your app folder. This setup makes it really easy to move the app and its data to another system without much hassle. Also, if you want to clear all of your test data during development, you can just delete or rename this folder, Hoodie will recreate it and you can start with a clean slate. **You'll want to leave this out of source control, too.**

### 4. Including the Script

The demo app will already have this line in its **index.html**, but essentially, all you need to do to make your app Hoodie-ready is include a single **js** library:

<pre><code class="language-markup">
&lt;script src="/hoodie/client.js"&gt;&lt;/script&gt;
</code></pre>

You'll notice that this file isn't in **node_modules** or some **vendor** or **lib** folder, instead, it is *served directly by the Hoodie server itself*. This is cool because it automatically contains all of the installed plugins' frontend code, too. Less hassle for you!

And that's actually it! You're ready to go.

### 5. The global window.hoodie Object

Hoodie is designed to let you build frontends the way you like to build frontends. The only way you talk to Hoodie in the frontend of your app is through the Hoodie API, which lives in a global window object and is, unsurprisingly, called **window.hoodie**, or simply **hoodie**.

Go ahead, open the app in your browser, open the console in your browser's dev tools and type **hoodie.**. It'll show you all of the globally available methods, like **hoodie.account** and **hoodie.store**, which are the most important ones. We'll cover these two in the next part of this guide.

#### Good Job!

For now, **congratulations!** You've created a demo Hoodie app, learned about the basic structure of a Hoodie project, you know all about the endpoints and app URLs and how to include and use the Hoodie library in your project. I'd say you're all set for [part two](/camp/tutorials/)!

#### Had any Trouble?

Please check the <a href="http://faq.hood.ie" target="_blank">FAQ</a> or <a href="http://hood.ie/chat" target="_blank">get in touch with us on IRC or Slack</a>. We'd also love to hear from you if things went well!

If you find this guide in error or out of date, you could also <a href="https://github.com/hoodiehq/documentation/issues" target="_blank">open an issue</a> or submit a pull request with your corrections to <a href="https://github.com/hoodiehq/documentation/blob/gh-pages/camp/start/getting-started/getting-started-1.md" target="_blank">this file</a>.

Thanks for your interest and time!
