---
layout: layout-start
locales: de
---

# Installation


### Installation der technischen Voraussetzungen

Für alle Betriebssysteme sind zunächst <a href="http://nodejs.org/" target="_blank">Node.js</a>, <a href="http://couchdb.apache.org/" target="_blank">CouchDB</a> und <a href="http://git-scm.com/" target="_blank">Git</a> zu installieren.

Hast du das alles schon?<br />
Dann kannst du diesen Teil überspringen und unter <a href="../start/getting-started/getting-started-1.html">"Wie man loslegt"</a> weiterlesen!


### Installation unter Mac OS X
##### Schritt 1: Node.js
Wir empfehlen, dass du die .pkg-Datei von nodejs.org zum Installieren von Node.js benutzt. Du kannst sie <a href="http://nodejs.org/download/" target="_blank">hier</a> herunterladen.
##### Schritt 2: CouchDB
Du kannst den Installer für die aktuellste Version von CouchDB für den Mac <a href="http://couchdb.apache.org/#download" target="_blank">hier</a> herunterladen.
##### Schritt 3: Hoodie-CLI
Öffne deine Konsole und tippe Folgendes ein:
<pre><code>npm install -g hoodie-cli</code></pre>


### Installation unter Windows
##### Schritt 1: Node.js
Die aktuellste Version von Node.js für Windows findest du <a href="http://nodejs.org/download/" target="_blank">hier</a>.
##### Schritt 2: CouchDB
Du kannst CouchDB für Windows <a href="http://couchdb.apache.org/#download" target="_blank">hier</a> herunterladen.
##### Schritt 3: Hoodie-CLI
Öffne deine Konsole und tippe das Folgende ein:
<pre><code>npm install -g hoodie-cli</code></pre>


### Installation unter Linux – Ubuntu
Dies ist eine speziell auf Ubuntu zugeschnittene Anleitung, die uns Stuart Langridge freundlicherweise zur Verfügung gestellt hat.
##### Schritt 1: Node.js
Unter Ubuntu muss man Node.js nicht aus den Quellen bauen, sondern kann es als Paket installieren. Dazu benötigst du zunächst Chris Leas Node.js PPA und installierst daraus dann Node.js

<pre><code>sudo add-apt-repository ppa:chris-lea/node.js
sudo apt-get update
sudo apt-get install nodejs
</code></pre>

##### Schritt 2: CouchDB

<pre><code>sudo apt-get update
sudo apt-get install couchdb-bin git
</code></pre>

##### Schritt 3: Hoodie-CLI
<pre><code>npm install -g hoodie-cli</code></pre>


### Linux – Fedora 19+
##### Schritt 1: Node.js and CouchDB  

<pre><code>sudo yum install couchdb nodejs npm
</code></pre>

##### Schritt 2: Hoodie-CLI
<pre><code>npm install -g hoodie-cli
</code></pre>

### Fertig!

Du hast die Installation beendet! Jetzt kannst du im Abschnitt <a href="../start/getting-started/getting-started-1.html">"Wie man mit Hoodie loslegt, Teil 1"</a> herausfinden, wie man eine neue App mit Hoodie erstellt, wie seine Admin-Oberfläche funktioniert, wie man Hoodie-Projekte strukturiert und vieles mehr.
