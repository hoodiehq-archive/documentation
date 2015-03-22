---
layout: layout-start
locales: en
---

# Installation


### Installation of Prerequisites
For all OS, you'll need to install <a href="http://nodejs.org/" target="_blank">Node.js</a>, <a href="http://couchdb.apache.org/" target="_blank">CouchDB</a> and <a href="http://git-scm.com/" target="_blank">Git</a>.

Already installed it all?<br />
Just jump straight to <a href="../start/getting-started/getting-started-1.html">how to get started</a>!


### Installation on Mac OS X
##### Step one: Node.js
We recommend using the nodejs.org .pkg file to install Node.js, you can <a href="http://nodejs.org/download/" target="_blank">download Node.js here</a>.
##### Step two: CouchDB
You can download the installer for the latest version of <a href="http://couchdb.apache.org/#download" target="_blank">CouchDB for Mac</a>.
##### Step three: Hoodie-CLI
Open your Terminal and type
<pre><code>npm install -g hoodie-cli</code></pre>

<p><small>(Hint: You can also install Node.js and CouchDB via Homebrew.)</small></p>



### Installation on Windows
##### Step one: Node.js
You can download Node.js for Windows <a href="http://nodejs.org/download/" target="_blank">here</a>.
##### Step two: CouchDB
You can download the latest version of <a href="http://couchdb.apache.org/#download" target="_blank">CouchDB for Windows</a>.
##### Step three: Hoodie-CLI
Open your Terminal and type
<pre><code>npm install -g hoodie-cli</code></pre>


### Installation on Linux – Ubuntu
This is an Ubuntu-specific guide courtesy of Stuart Langridge.
##### Step one: Node.js
On Ubuntu, you don't have to build Node.js from source, you can install it as a package instead. Add Chris Lea's Node.js PPA and install from it:

<pre><code>sudo add-apt-repository ppa:chris-lea/node.js
sudo apt-get update
sudo apt-get install nodejs
</code></pre>

##### Step two: CouchDB

<pre><code>sudo apt-get update
sudo apt-get install couchdb-bin git
</code></pre>

##### Step three: Hoodie-CLI
<pre><code>npm install -g hoodie-cli</code></pre>


### Linux – Fedora 19+
##### Step one: Node.js and CouchDB

<pre><code>sudo yum install couchdb nodejs npm
</code></pre>

##### Step two: Hoodie-CLI
<pre><code>npm install -g hoodie-cli
</code></pre>

### Done!
Installation done! Now you can find out how to create a new Hoodie app, how its admin interface works, how Hoodie projects are structured and more in <a href="../start/getting-started/getting-started-1.html">"Getting started with Hoodie, part 1"</a>.