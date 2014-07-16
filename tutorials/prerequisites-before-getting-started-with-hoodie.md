---
layout: layout
---

# Prerequisites before getting started with Hoodie

This is a list of everything you should prepare *before* finally starting with Hoodie. For all OS, you'll need to install [Node.JS](http://nodejs.org/), [Apache CouchDB](http://couchdb.apache.org/) and [git](http://git-scm.com/). 

This file will show you how to do this for your OS, so you can finally get started with Hoodie.

If you already installed them, you can skip this tutorial and check out our tutorial for [getting started with Hoodie](MISSING LINK TO TUTORIAL).

## Operating Systems

Hoodie has support for Mac OS X, Windows and Linux. This file covers installation of prerequisites for all Operating Systems.

## Table of Content
- <a href="#mac-os-x">Mac OS X</a>
- <a href="#Windows">Windows</a>
- <a href="#Linux-Ubuntu">Linux-Ubuntu</a>
- <a href="#Linux-Fedora">Linux-Fedora 19+</a>

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

  $ sudo add-apt-repository ppa:chris-lea/node.js
  $ sudo apt-get update
  $ sudo apt-get install nodejs
  
#### Install CouchDB

  $ sudo apt-get update
  $ sudo apt-get install couchdb-bin git
  
-------------------------------

### Linux – Fedora 19+
#### Install CouchDB, Git and node.js

  $ sudo yum install couchdb git nodejs npm
  
-------------------------------

Installation done! Time to [get started with Hoodie](MISSING LINK TO TUTORIAL).
