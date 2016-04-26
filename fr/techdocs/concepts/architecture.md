---
layout: layout-api
locales: fr
---

# Architecture

La manière dont Hoodie est conçu essaye de régler un certain nombre de choses&#x202F;:

1. Il devrait être facile d'installer Hoodie pour le développement d'application.
2. Il devrait être facile d'installer Hoodie pour son propre développement.
3. La configuration de développement devrait ressembler autant que possible à la configuration de production.


## Démarrage rapide (NdT&#x202F;: sous MacOSX)

  $ brew install hoodie
  $ hoodie service-start
  Launching hoodie...done.
  Launching browser.
  $

Ceci ouvre le navigateur par défaut sur http://hoodie.local (http://localhost:1234) qui montre l'interface web de Hoodie.

## Créer une application Hoodie en ligne de commande

  $ hoodie new app
  $ cd app # où se trouve votre application, tout ceci étant sous contrôle de version
  $ ls
  node_modules/ # les composants coeurs de Hoodie (et autres)
  www/ # les éléments statiques du site, la racine de hoodie_web
  package.json/ # le fichier de configuration
  $ hoodie start
  Launching app...done. Please visit http://app.hoodie.local (http://localhost:1235)

## `hoodie start`

Lance $pwd/hoodie/bin/hoodie_web sur le port $PORT


## Installer un plugin

  $ hoodie install <name>
