---
layout: layout
---

# Folder Structure

When using the [command line interface](https:/github.com/hoodiehq/hoodie-cli) to create a new Hoodie app everything one needs is automatically generated.

```bash
$ npm install -g hoodie-cli
$ hoodie new myApp
$ cd myApp
```

But when we really want to get started and create our very own app the folder structure has to be clear first. So there should be no more doubt about what goes where after reading this tutorial.

So what does a brand new Hoodie app look like?

```bash
$ ls
README.md node_modules package.json www
```

## The `README.md` file

Let's get the easiest part out of the way first – the readme file.
As the name suggests you should read it as it contains lots of useful information. Change or delete it if you have the feeling you don't longer need it.

## The `package.json` file

Every Hoodie app is a node.js application and every node.js application needs a `package.json` file. It defines the name of the app ("myApp" in this case) and dependencies. It is used to install and declare the used versions of [`hoodie-server`](https://github.com/hoodiehq/hoodie-server) and all core plugins.

In the [npmjs](https://www.npmjs.org/) (node.js's package manager) documentation you can find a [detailed description of every single property](https://www.npmjs.org/doc/files/package.json.html). 

## The `node_modules` folder

The `node_modules` folder is the default location for installed dependencies.
Normally one has to execute the `npm install` command to get this folder and its contents, but `hoodie new` did this for us already.

```bash
$ ls node_modules
hoodie-plugin-appconfig hoodie-plugin-email hoodie-plugin-users hoodie-server
```

The contents of the folder are essential for the Hoodie app to work, so there are two things to remember.

1. Do not edit the contents of this folder
2. Do not add this folder to source control

Here is a little experiment: Remove the `node_modules` folder entirely and run `npm install` afterwards. This should take a short while, but when it is finished you will notice that the install command restored all modules.

Now the above rules should be clear. All your changes to the files in this folder will be overwritten whenever you have to install or update dependencies and it makes no sense to put this huge folder into source control, because everyone can restore it with a simple command.

## The `www` folder

This is where the frontend app lives that is opened once you enter `hoodie start` in your terminal. Currently it contains the Hoodie ToDo-demo-application that is built upon [jQuery](http://jquery.com) and [Bootstrap](http://getbootstrap.com), but Hoodie itself is framework agnostic, so you can build whatever you want in here.

You're probably wondering where the actual `hoodie.js` frontend library comes from. `hoodie-server` generates it for you on the fly. So you only have to add a script tag to your `index.html` file and you'll get the latest and greatest `hoodie.js` file, together with all the plugin code.

```html
<script src="/_api/_files/hoodie.js"></script>
``` 
