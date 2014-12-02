---
layout: layout-get-help
---

# System Requirements, Browser Compatibilities and Prerequisites before getting started with Hoodie

This is a list of everything you should know and prepare *before* finally starting with Hoodie. For all OS, you'll need to install [node.js](http://nodejs.org/), [Apache CouchDB](http://couchdb.apache.org/) and [git](http://git-scm.com/). If you already installed them, you can skip this tutorial and check out our tutorial for [getting started with Hoodie](MISSING LINK TO TUTORIAL).

## Table of Content
- <a href="#system-requirements">System Requirements</a>
- <a href="#browser-compatibilities">Browser Compatibilities</a>
- <a href="#Installation-of-Prerequisites">Installation of prerequisites: node.js, Apache CouchDB, git</a>
  - <a href="#mac-os-x">Mac OS X</a>
  - <a href="#Windows">Windows</a>
  - <a href="#Linux-Ubuntu">Linux-Ubuntu</a>
  - <a href="#Linux-Fedora">Linux-Fedora 19+</a>

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
You can download the installer for the latest version of CouchDB [here](http://couchdb.apache.org/#download).
#### Install git

The download for Mac is [here](http://git-scm.com/download/mac).

-------------------------------

### Windows
#### Install node.js
You can download node.js for Windows [here](http://nodejs.org/download/). 
#### Install CouchDB
You can download the latest version of CouchDB [here](http://couchdb.apache.org/#download).
#### Install git
The download for Mac is [here](http://git-scm.com/download/win). 

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

-------------------------------

### Linux – Fedora 19+
#### Install CouchDB, Git and node.js

```
  $ sudo yum install couchdb git nodejs npm
```

-------------------------------

Installation done! Time to [get started with Hoodie](MISSING LINK TO TUTORIAL).
