---
layout: layout-start
locales: fr
---

# Installer Hoodie sur votre système

### Pré-requis
Pour tous les OS, vous aurez besoin d'avoir installé <a href="http://nodejs.org/" target="_blank">Node.js</a>, <a href="http://couchdb.apache.org/" target="_blank">CouchDB</a> et <a href="http://git-scm.com/" target="_blank">Git</a>. Si vous les avez déjà tous, vous pouvez sautez directement <a href="../start/getting-started/getting-started-1.html">ici</a>&#x202F;!

### Installation sous Mac OS X
##### 1. Node.js
Les composants serveur de Hoodie tournent sous Node.js. Nous vous recommandons d'utiliser <a href="https://nodejs.org/" target="_blank">le fichier .pkg de nodejs.org</a> pour l'installer.
##### 2. CouchDB
CouchDB est la base de données de Hoodie côté serveur. Merci d'utiliser le super pratique <a href="http://couchdb.apache.org/#download" target="_blank">installateur CouchDB pour Mac</a>. 
##### 3. Hoodie-CLI
Il s'agit de la ligne de commande Hoodie, utilisée pour le scaffolding des nouvelles applications Hoodie et lancer votre serveur Hoodie local. Pour l'installer, utilisez npm qui fait partie de l'installation node.js du point 1. Ouvrez votre terminal et tapez

```bash
npm install -g hoodie-cli
```

### Installation sous Windows
##### 1. Node.js
Les composants serveur de Hoodie tournent sous Node.js. Nous vous recommandons d'utiliser <a href="https://nodejs.org/" target="_blank">l'installateur Windows de nodejs.org</a> pour l'installer.
##### 2. CouchDB
CouchDB est la base de donnée de Hoodie côté serveur. Il existe un <a href="http://couchdb.apache.org/#download" target="_blank">installateur CouchDB pour Windows</a>. 
##### 3. Hoodie-CLI
Il s'agit de la ligne de commande Hoodie, utilisée pour le scaffolding des nouvelles applications Hoodie et lancer votre serveur Hoodie local. Pour l'installer, utilisez npm qui fait partie de l'installation node.js du point 1. Ouvrez votre terminal et tapez

```bash
npm install -g hoodie-cli
```

### Installation sous Linux – Ubuntu
Il s'agit d'un guide spécifique à Ubuntu, avec la permission de Stuart Langridge.
##### 1. Node.js
Sous Ubuntu, vous n'avez pas à compiler Node.js depuis son code source, vous pouvez l'installer via un package. Ajouter le PPA Node.js de Chris Lea et installez-le à partir de là&#x202F;:

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

### Installation sous Linux – Fedora 19 et plus
##### 1. Node.js and CouchDB

```bash
sudo yum install couchdb nodejs npm
```

##### 2. Hoodie-CLI
```bash
npm install -g hoodie-cli
```

### Installation terminée&#x202F;!
Parfait&#x202F;! Maintenant vous pouvez découvrir comment créer de nouvelles applications Hoodie, comment le tableau de bord d'administration fonctionne, comment les projets Hoodie sont structurés et bien plus dans <a href="../start/getting-started/getting-started-1.html">Démarrer avec Hoodie - partie 1</a>.

### Des soucis&#x202F;?
Désolé si ça ne s'est pas bien passé pour vous. Consultez notre <a href="http://faq.hood.ie" target="_blank">FAQ</a> ou venez nous parler sur <a href="http://hood.ie/chat" target="_blank">IRC ou Slack</a>, et nous verrons si nous pouvons vous aider&#x202F;!

