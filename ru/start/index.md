---
layout: layout-start
locales: ru
---

# Установка


### Установка и необходимые программы
Для всех операционных систем, вам потребуется <a href="http://nodejs.org/" target="_blank">Node.js</a>, <a href="http://couchdb.apache.org/" target="_blank">CouchDB</a> и <a href="http://git-scm.com/" target="_blank">Git</a>.

Уже есть всё это?<br />
Переходите сразу к <a href="../start/getting-started/getting-started-1.html">началу работы</a>!


### Установка на Mac OS X
##### Шаг первый: Node.js
Мы рекомендуем использовать nodejs.org .pkg чтобы установить Node.js, вы можете <a href="http://nodejs.org/download/" target="_blank">скачать Node.js тут</a>. 
##### Шаг второй: CouchDB
Вы можете скачать последнюю версию инсталлятора <a href="http://couchdb.apache.org/#download" target="_blank">CouchDB для Mac</a>.
##### Шаг третий: Hoodie-CLI
Откройте терминал и наберите
<pre><code>npm install -g hoodie-cli</code></pre>



### Устрановка для Windows
##### Шаг первый: Node.js
Скачать Node.js для Windows <a href="http://nodejs.org/download/" target="_blank">тут</a>. 
##### Шаг второй: CouchDB
Скачать последнюю версию <a href="http://couchdb.apache.org/#download" target="_blank">CouchDB для Windows</a>.
##### Шаг третий: Hoodie-CLI
Откройте терминал и наберите
<pre><code>npm install -g hoodie-cli</code></pre>


### Установка для Linux – Ubuntu
##### Шаг первый: Node.js
В Ubuntu у вас нет необходимости устанавливать Node.js из исходников, добавьте репозиторий Криса Ли и установите Node.JS:

<pre><code>sudo add-apt-repository ppa:chris-lea/node.js
sudo apt-get update
sudo apt-get install nodejs
</code></pre>

##### Шаг второй: CouchDB

<pre><code>sudo apt-get update
sudo apt-get install couchdb-bin git
</code></pre>

##### Шаг третий: Hoodie-CLI
<pre><code>npm install -g hoodie-cli</code></pre>


### Linux – Fedora 19+
##### Step one: Node.js and CouchDB  

<pre><code>sudo yum install couchdb nodejs npm
</code></pre>

##### Step two: Hoodie-CLI
<pre><code>npm install -g hoodie-cli
</code></pre>

### Done!
Готово! Теперь узнайте как создать новое приложение Hoodie, как работает интерфейс админки, о структуре приложения и многое другое здесь: <a href="../start/getting-started/getting-started-1.html">"Начнём с Hoodie, часть 1"</a>.
