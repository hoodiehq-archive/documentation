---
layout: layout-start
---

# Installation 


### Installation of Prerequisites
For all OS, you'll need to install <a href="http://nodejs.org/" target="_blank">Node.js</a>, <a href="http://couchdb.apache.org/" target="_blank">CouchDB</a> and <a href="http://git-scm.com/" target="_blank">Git</a>.

Already installed it all?<br />
Just jump straight to <a href="/start/getting-started/getting-started-1.html">how to get started</a>!


### Installation on Mac OS X
##### Step one: Node.js
We recommend using the nodejs.org .pkg file to install Node.js, you can <a href="http://nodejs.org/download/" target="_blank">download Node.js here</a>. 
##### Step two: CouchDB
You can download the installer for the latest version of <a href="http://couchdb.apache.org/#download" target="_blank">CouchDB for Mac</a>.
##### Step four: Hoodie-CLI
Open your Terminal and type
<pre><code>$ npm install -g hoodie-cli</code></pre>



### Installation on Windows
##### Step one: Node.js
You can download Node.js for Windows <a href="http://nodejs.org/download/" target="_blank">here</a>. 
##### Step two: CouchDB
You can download the latest version of <a href="http://couchdb.apache.org/#download" target="_blank">CouchDB for Windows</a>.
##### Step three: Git
The download of <a href="http://git-scm.com/download/win" target="_blank">git for Windows is here</a>.
##### Step four: Hoodie-CLI
Open your Terminal and type
<pre><code>$ npm install -g hoodie-cli</code></pre>


### Installation on Linux – Ubuntu
This is an Ubuntu-specific guide courtesy of Stuart Langridge. 
##### Step one: Node.js
On Ubuntu, you don't have to build Node.js from source, you can install it as a package instead. Add Chris Lea's Node.js PPA and install from it:

<pre><code>$ sudo add-apt-repository ppa:chris-lea/node.js
$ sudo apt-get update
$ sudo apt-get install nodejs
</code></pre>

##### Step two: CouchDB

<pre><code>$ sudo apt-get update
$ sudo apt-get install couchdb-bin git
</code></pre>

##### Step three: Hoodie-CLI
<pre><code>$ npm install -g hoodie-cli</code></pre>


### Linux – Fedora 19+
##### Step one: Node.js, CouchDB and Git  

<pre><code>$ sudo yum install couchdb git nodejs npm
</code></pre>

##### Step two: Hoodie-CLI
<pre><code>$ npm install -g hoodie-cli
</code></pre>


<!-- 
### Done!
Installation done! Now you can... 
### Follow our guides for getting started 
- <a href="https://github.com/hoodiehq/documentation/blob/gh-pages/tutorials/installation/development-osx.md" target="_blank">Mac OS X</a>, 
- <a href="https://github.com/hoodiehq/documentation/blob/gh-pages/tutorials/installation/development-windows.md" target="_blank">Windows</a>
- <a href="https://github.com/hoodiehq/documentation/blob/gh-pages/tutorials/installation/development-linux.md" target="_blank">Linux</a>

or

### Find out how to …
create a new Hoodie app, how its admin interface works, how Hoodie projects are structured and more in our tutorial <a href="https://github.com/hoodiehq/documentation/blob/gh-pages/tutorials/getting-started/getting-started-1.md" target="_blank">"Getting started with Hoodie, part 1"</a>.
-->
