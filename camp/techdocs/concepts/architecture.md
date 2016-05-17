---
layout: layout-api
locales: camp
---

# Architecture

The way Hoodie is set up is trying to solve a number of things:

1. It should be easy to install Hoodie for application development.
2. It should be easy to install Hoodie for Hoodie development.
3. The development setup should mirror the production setup as much as possible.


## Quick Start

  $ brew install hoodie
  $ hoodie service-start
  Launching hoodie...done.
  Launching browser.
  $

This opens the standard browser on http://hoodie.local (http://localhost:1234) which shows the hoodie web interface.

## Creating a Hoodie Application from the Command Line

  $ hoodie new app
  $ cd app # where your app lives, all of this lives in your version control
  $ ls
  node_modules/ # core hoodie components (and others)
  www/ # static site assets, document root for hoodie_web
  package.json/ # configuration file
  $ hoodie start
  Launching app...done. Please visit http://app.hoodie.local (http://localhost:1235)

## `hoodie start`

Launches $pwd/hoodie/bin/hoodie_web on $PORT


## Install a Plugin

  $ hoodie install <name>
