---
layout: layout
---

# System Requirements, Browser Compatibilities and Prerequisites before getting started with Hoodie

This is a list of everything you should know and prepare *before* finally starting with Hoodie. For all OS, you'll need to install [node.js](http://nodejs.org/), [Apache CouchDB](http://couchdb.apache.org/) and [git](http://git-scm.com/). If you already installed them, you can skip this tutorial and check out our tutorial for [getting started with Hoodie](MISSING LINK TO TUTORIAL).

## Table of Content
- <a href="#system-requirements">System Requirements</a>
- <a href="#browser-compatibilities">Browser Compatibilities</a>
- <a href="#Installation-of-Prerequisites">Installation of prerequisites: node.js, Apache CouchDB, git</a>
  - [https://github.com/hoodiehq/documentation/blob/gh-pages/tutorials/system-requirements-browser-compatibilities-prerequisites-before-getting-started-with-hoodie.md#mac-os-x](Mac OS X)
  - [https://github.com/hoodiehq/documentation/blob/gh-pages/tutorials/system-requirements-browser-compatibilities-prerequisites-before-getting-started-with-hoodie.md#windows](Windows)
  - [https://github.com/hoodiehq/documentation/blob/gh-pages/tutorials/system-requirements-browser-compatibilities-prerequisites-before-getting-started-with-hoodie.md#linux-ubuntu](Linux-Ubuntu)
  - [https://github.com/hoodiehq/documentation/blob/gh-pages/tutorials/system-requirements-browser-compatibilities-prerequisites-before-getting-started-with-hoodie.md#linux-fedora-19](Linux-Fedora 19+)

## System Requirements
* Mac OS X
* Windows (if you use Windows 7 on a 64bit machine, there's a special trick required to make Hoodie run, you'll find all details [here](https://github.com/hoodiehq/documentation/wiki/The-Hoodie-FAQ-%E2%80%93%C2%A0Work-in-Progress#windows-7-64-bit-installation-problem-error-spawn-enoent)
* Linux (Ubuntu, Fedora 19+)

## Browser Compatibilities

* Firefox latest stable (v29)
* Chrome latest stable (v34)
* Desktop Safari latest stable (v7)
* Internet Explorer v10+
* Opera latest stable (v21)
* Android 4.3+
* iOS Safari latest stable (v7.1)

## Installation of Prerequisites

-------------------------------

### Mac OS X
#### Install node.js
We recommend using the nodejs.org .pkg file to install node, you can download it [here](http://nodejs.org/download/). 
#### Install CouchDB
You can download the installer for the latest version of [CouchDB for Mac](http://couchdb.apache.org/#download).
#### Install git
git for Mac can be downloaded [here](http://git-scm.com/download/mac).
#### Install Hoodie-CLI
```
  $ npm install -g hoodie-cli
```

-------------------------------

### Windows
#### Install node.js
You can download [Node.js for Windows here](http://nodejs.org/download/). 
#### Install CouchDB
You can download the latest version of [CouchDB for Windows here](http://couchdb.apache.org/#download).
#### Install git
The download of [git for Windows is here](http://git-scm.com/download/win). 
#### Install Hoodie-CLI
```
  $ npm install -g hoodie-cli
```

-------------------------------

### Linux – Ubuntu
This is an Ubuntu-specific guide courtesy of Stuart Langridge. 
#### Install node.js
On Ubuntu, you don't have to build Node.js from source, you can install it as a package instead. Add Chris Lea's Node.js PPA and install from it:

```
  $ sudo add-apt-repository ppa:chris-lea/node.js
  $ sudo apt-get update
  $ sudo apt-get install nodejs
```

#### Install CouchDB

```
  $ sudo apt-get update
  $ sudo apt-get install couchdb-bin git
```
#### Install Hoodie-CLI
```
  $ npm install -g hoodie-cli
```


-------------------------------

### Linux – Fedora 19+
#### Install CouchDB, Git and node.js

```
  $ sudo yum install couchdb git nodejs npm
```
#### Install Hoodie-CLI
```
  $ npm install -g hoodie-cli
```

-------------------------------

Installation done! Now you can 
### Follow our guides for getting started 
- <a href="https://github.com/hoodiehq/documentation/blob/gh-pages/tutorials/installation/development-osx.md" target="_blank">Mac OS X</a>, 
- <a href="https://github.com/hoodiehq/documentation/blob/gh-pages/tutorials/installation/development-windows.md" target="_blank">Windows</a>
- <a href="https://github.com/hoodiehq/documentation/blob/gh-pages/tutorials/installation/development-linux.md" target="_blank">Linux</a>

or

### Find out how to …
create a new Hoodie app, how its admin interface works, how Hoodie projects are structured and more in our tutorial <a href="https://github.com/hoodiehq/documentation/blob/gh-pages/tutorials/getting-started/getting-started-1.md" target="_blank">"Getting started with Hoodie, part 1"</a>.
