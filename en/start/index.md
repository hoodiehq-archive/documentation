---
layout: layout-start
locales: en
---

# Installing Hoodie on your System

### Prerequisites
For all OS, you'll need <a href="http://nodejs.org/" target="_blank">Node.js</a>, <a href="http://couchdb.apache.org/" target="_blank">CouchDB</a> and <a href="http://git-scm.com/" target="_blank">Git</a> installed. If you've already got all of them, you can <a href="../start/getting-started/getting-started-1.html">skip right ahead</a>!

### Installation on Mac OS X

##### 1. Node.js
Hoodie's server components run on node.js. We recommend using the <a href="https://nodejs.org/" target="_blank">nodejs.org .pkg file</a> to install it.

##### 2. CouchDB
CouchDB is used as Hoodie's server-side database. Please use the super-convenient <a href="http://couchdb.apache.org/#download" target="_blank">CouchDB for Mac installer</a>.

##### 3. Hoodie-CLI
This is the Hoodie Command Line Interface, used to scaffold new Hoodie apps and run your local Hoodie server. To install it, use npm, which is part of the node.js installation in step 1. Open your terminal and type

```bash
npm install -g hoodie-cli
```

### Installation on Windows

##### 1. Node.js
Hoodie's server components run on node.js. We recommend using the <a href="http://nodejs.org/download/" target="_blank">Node.js for Windows installer</a> you can use.

##### 2. CouchDB
CouchDB is used as Hoodie's server-side database. There's a <a href="http://couchdb.apache.org/#download" target="_blank">CouchDB for Windows installer</a>.

##### 3. Hoodie-CLI
This is the Hoodie Command Line Interface, used to scaffold new Hoodie apps and run your local Hoodie server. To install it, use npm, which is part of the node.js installation in step 1. Open your command prompt and type

```bash
npm install -g hoodie-cli
```


### Installation on Linux – Ubuntu
This is an Ubuntu-specific guide courtesy of Stuart Langridge.
##### 1. Node.js
On Ubuntu, you don't have to build Node.js from source, you can install it as a package instead. Add Chris Lea's Node.js PPA and install from it:

```bash
sudo add-apt-repository ppa:chris-lea/node.js
sudo apt-get update
sudo apt-get install nodejs
```

##### 2. CouchDB

```bash
sudo apt-get update
sudo apt-get install couchdb-bin git
```

##### 3. Hoodie-CLI
```bash
npm install -g hoodie-cli
```

### Linux – Fedora 19+
##### 1. Node.js and CouchDB

```bash
sudo yum install couchdb nodejs npm
```

##### 2. Hoodie-CLI
```bash
npm install -g hoodie-cli
```

### Installation Done!
Sweet. Now you can find out how to create new Hoodie apps, how the admin interface works, how Hoodie projects are structured and more, in <a href="../start/getting-started/getting-started-1.html">Getting started with Hoodie, part 1</a>.

### Having Trouble?
Sorry it didn't go smoothly for you. Consult our <a href="http://faq.hood.ie" target="_blank">FAQ</a> or come talk to us on <a href="http://hood.ie/chat" target="_blank">IRC or Slack</a>, and we'll see if we can help you!

