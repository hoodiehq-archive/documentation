---
layout: layout-api
locales: fr
---

# Le worker Hoodie

Ce document explique comment écrire un worker Hoodie.


## Qu'est-ce qu'un worker Hoodie&#x202F;?

Un worker Hoodie est un module côté serveur qui implémente une fonction que le code côté client ne peut pas réaliser. Un bon exemple consiste en l'envoi d'email. Pour envoyer un mail, on doit envoyer des données via SMTP, qui est une connexion TCP. Le code client côté n'a pas habituellement les mécanismes pour le faire.

Pour ne pas trop compliquer les choses, nous allons créer un worker de traçage. Il lira les messages de traces depuis des objets et les écrira dans un fichier.

Un worker communique avec le frontend via des [*des documents de machine à état*](TODO LINK).

Voir [l'architecture Hoodie](TODO LINK) pour plus de détails.

## Démarrage

L'implémentation de référence de Hoodie s'appuie sur Node.js et CouchDB. Si la spécification Hoodie est indépendante de l'implémentation, nous avons choisi certains outils pour commencer parce qu'ils nous permettaient d'avancer rapidement.

Comme de plus en plus de language implémentent les workers, attendez-vous à une documentation spécifique chaque langage. Pour le moment, nous vous montrerons comment écrire un worker Hoodie en Node.js.

Cette documentation part du principe que vous voulez développer votre worker Hoodie localement et seulement ensuite le déployer. Voir la documentation sur [le déploiement d'un worker Hoodie](TODO LINK) pour plus de détails.

Si vous souhaitez vous assurer de ne faire aucune erreur en copiant le code, ou, quand nous ne montrerons plus tard que les additions aux codes, vous pouvez partir du [repository git](https://github.com/hoodiehq/worker-log/) avec les différentes étapes sur différentes branches, nous feront aussi le lien avec les différentes parties dans la suite.

La seule dépendance est Node.js version 0.8.0 ou supérieure. Voici quelques façons de l'installer:

Mac OS X:

    $ brew install node

[TODO: linux, windows]

Créons un répertoire pour le nouveau projet. Nous utilisons le préfixe `worker-` pour rendre la lecture plus facile dans git.

    $ mkdir worker-log
    $ cd worker-log

Nous commençons par créer un fichier `index.js`. Il s'agira du principal point d'entrée pour le code du worker. Quand nous commençons, nous mettons tout le code nécessaire ici, et ça deviendra moins gérable, nous déplacerons les choses dans d'autres fichiers et modules.

Copier ce code template, nous l'expliquerons en détail dans une minute:

    module.exports = WorkerLog;
    function WorkerLog()
    {
		console.log("Logger started.");
    }

    var log = new WorkerLog();

[Lien repo](https://github.com/hoodiehq/worker-log/blob/how-to-1/index.js)

C'est tout&#x202F;! Nous allons maintenant démarrer notre worker:

    $ node index.js
    Logger Started
    $

Super&#x202F;!

Bon, ce n'est pas terriblement impressionnant, mais nous avons la fondation en place.

## Le processus d'écoute des changements

Vous noterez que le worker quitte vers le shell après qu'il ait affiché notre message `console.log()`. Un vrai worker est prévu pour rester en tâche de fond et réagir aux messages qui lui sont envoyés.

Ceci fonctionne dans Hoodie via des documents CouchDB et une fonction de CouchDB appelée *changes feed* (NdT: flux des changements). Un document CouchDB est juste un objet JSON, mais persistant. Les documents sont stockés en base de donnée. Chaque base de donnée possède un *changes feed* auquel vous pouvez souscrire. Il vous envoie en quasi temps-réel des notification sur ce qui se passe dans la base.

Un objet et un document sont en fait la même chose. Nous l'appelons objet dans le contexte de JavaScript et nous l'appelons document dans le contexte de CouchDB.

Ce que nous allons faire, c'est souscrire au *changes feed* de la base de donnée et écouter l'ajout de documents de type `log`. Nous lirons alors ces documents et compilerons un message de trace depuis sont contenu pour finalement l'écrire dans un fichier trace. Jusqu'ici c'est simple.

Fort heureusement, les mécanismes d'écoute du *changes feed* d'une base de donnée sont abstraits dans un module Node.js pratique `CouchDB Changes`. Pour l'installer, lancer:

    $ npm install CouchDBChanges

Ajoutez ceci au début de votre fichier `index.js`:

    var CouchDBChanges = require("CouchDBChanges");

Pour commencer l'écoute, nous devons d'abord créer une fonction *callback* qui est appelée pour chaque nouveau changement qui nous est envoyé. Placez cette nouvelle fonction avant l'actuelle dernière ligne (qui devrait être `var log = new WorkerLog();`).

Notre fonction *callback* ne fera, pour l'instant, que tracer l'objet changement sur la ligne de commande:

    WorkerLog.prototype._changesCallback = function(error, message)
    {
        console.log(message);
    }

Voir les *Méthodes de soutien* ci-dessous pour une explication sur pourquoi nous utilisons la syntaxe `prototype`. 

Le *callback* se verra passé deux arguments, nous ignorerons l'erreur pour le moment. Voir *Gestion des erreurs* ci-dessous pour plus de détails.

Maintenant nous pouvons mettre en place le processus d'écoute des changements. Il se place dans la fonction `WorkerLog()` en haut, après notre `console.log("Logger started.");` initial.

    var changes = new CouchDBChanges("http://127.0.0.1:5984/");
    changes.follow("myDatabaseName", this._changesCallback, {}, {
        include_docs: true}
    );

[Lien repo](https://github.com/hoodiehq/worker-log/blob/how-to-2/index.js)

S'il s'agit de votre première lecture après l'introduction[lisez-moi démarrage](https://github.com/hoodiehq/documentation/blob/master/development-setup.md), essayez de conserver le même utilisateur en base de donnée. Si vous avez déjà fait tourner tous les exemple de code du lisez-moi, `joe$example_com` fonctionnera comme nom de base de données.

Avant de pouvoir tester notre nouveau processus d'écoute, nous devons configurer une instance CouchDB. Assurez-vous que son emplacement correspond à ce que nous avons mis dans le code ci-dessus. Nous partons du principe qu'elle tourne sur votre machine locale sur le port par défaut, et que nous utilisons une base de donnée `mydatabase` pour tester les choses. Voir[*Options de configuration de CouchDB*](TBD) pour les alternatives dans l'usage de CouchDB. Voir [*Servir plusieurs bases*](plus bas) pour les détails quant à la manière de ne pas hard-coder le nom d'une base unique dans votre worker.

Maintenant nous pouvons de nouveau lancer notre worker:

    $ node index.js
    Logger started.

Et nous voyons qu'il ne revient pas à la ligne de commande, mais "reste là". C'est ce que nous voulions&#x202F;!

TODO: erreurs, URL CouchDB erronée, base qui n'existe pas, etc.

Si nous créons maintenant un nouveau document dans la base `mydatabase` de CouchDB, nous devrions voir notre document tracé sur la ligne de commande. Ouvrez une nouvelle fenêtre de terminal et tapez ceci:

    $ curl -X POST http://127.0.0.1:5984/mydatabase/ -d '{"message":"hello world"}' -H "Content-Type: application/json"

Vous devriez voir quelque-chose comme ça:

    {"ok":true,"id":"e72c9af9291eae530b28a3f15d00094d","rev":"1-baa23d8189d19e166f6e0393e23b1085"}

Si vous revenez au terminal où le worker tourne, vous devriez voir:

    { seq: 1,
      id: 'e72c9af9291eae530b28a3f15d00094d',
      changes: [ { rev: '1-baa23d8189d19e166f6e0393e23b1085' } ],
      doc:
       { _id: 'e72c9af9291eae530b28a3f15d00094d',
         _rev: '1-baa23d8189d19e166f6e0393e23b1085',
         message: 'hello world' } }

Pour arrêter le worker, utilisez `ctrl-c`:

    ^C$

Il y a trois choses que nous devons régler ensuite:

 1. Ne tracer que les objets de type `log`.
 2. Formater les objets en une seule ligne par entrée.
 3. Écrire le message de trace dans un fichier.

Traitons-les dans l'ordre.

### Les types d'objets Hoodie

Hoodie défini que les objets ont des types[^cf_types]. C'est purement conventionnel, mais ça permet tout un tas de trucs magiques. Tous les objets dans Hoodie on un attribut `_id` qui identifie de manière unique l'objet de manière globale. Nous utiliser un UUID pour ça. Le type est spécifié par un préfixe de cet attribut `_id`.

[^cf_types]: Voir [*Conventions des types d'objets Hoodie*](TBD) pour une liste complète des types et une discussion plus complète.

Voici un exemple en JSON:

    {
        "_id": "image/fb461a0bfc5a4aeefc4d7fb461a0b1c1"
    }

Le type ici est `image`. Nous allons maintenant voir les objets de type `log`:

    {
        "_id": "log/4ffd901d052de901bcaa28902dda3b4a"
    }

Modifions notre méthode `_changesCallback()` pour ne réagir qu'aux objets `log`:

    WorkerLog.prototype._changesCallback = function(error, message)
    {
        if(message.doc._id.substr(0, 3) != "log") {
            return;
        }

        console.log(message);
    }

[Lien repo](https://github.com/hoodiehq/worker-log/blob/how-to-3/index.js)

// TODO: Les futures versions de ceci devrait avoir un module *Hoodie* comment celui de l'API cliente.

Quand vous redémarrez le worker et que vous ajouter un nouvel objet à la base CouchDB, vous devriez ne voir aucune sortie:

    $ curl -X POST http://127.0.0.1:5984/mydatabase/ -d '{"message":"hello world"}' -H "Content-Type: application/json"
    {"ok":true,"id":"e72c9af9291eae530b28a3f15d0023dc","rev":"1-baa23d8189d19e166f6e0393e23b1085"}

    $ node index.js
    Logger started.

Quand vous ajoutez un document avec le bon type:

    $ curl -X POST http://127.0.0.1:5984/mydatabase/ -d '{"_id":"log/foobar","message":"hello world"}' -H "Content-Type: application/json"
    {"ok":true,"id":"log/foobar","rev":"1-baa23d8189d19e166f6e0393e23b1085"}

Vous devriez voir:

    { seq: 3,
      id: 'log/foobar',
      changes: [ { rev: '1-baa23d8189d19e166f6e0393e23b1085' } ],
      doc:
       { _id: 'log/foobar',
         _rev: '1-baa23d8189d19e166f6e0393e23b1085',
         message: 'hello world' } }

Jusqu'ici, on est bon.

Ensuite, nous allons formater un peu notre message. Avant de plonger dans le code de formatage, nous allons *définir* un format sous lequel nous attendons l'objet trace. Il pourra être forcé plus tard, afin que nous n'ayons à attendre des objets de type `log` qui possèdent tous les champs requis.

    {
        "_id": "log/*",
        "message": "Log Message",
        "timestamp": 1234567890123, // seconds since epoch
        "level": "one of 'info', 'warn', 'debug', 'tmi'",
        "tag": "(optional, user-defined tag)"
    }

Nous allons prendre les objets ayant cette structure et les transformer en une chaîne qui ressemblera à ceci:

    timestamp [level[, tag]: message

Par exemple:

    1234567890123 [debug]: Hello World

Ou, avec un tag:

    1234567890123 [info, email]: Email X Sent.

Allons-y&#x202F;!

    WorkerLog.prototype._changesCallback = function(error, message)
    {
        var obj = message.doc;
        if(obj._id.substr(0, 3) != "log") {
            return;
        }

        var log_message = "";
        if(obj.tag) {
            log_message = util.format("%d [%s, %s]: %s",
                obj.timestamp, obj.level, obj.tag, obj.message);
        } else {
            log_message = util.format("%d [%s]: %s",
                obj.timestamp, obj.level, obj.message);
        }
        console.log(log_message);
    }

[Lien repo](https://github.com/hoodiehq/worker-log/blob/how-to-4/index.js)

Nous regardons toujours les documents `log`. Nous regardons ensuite si l'objet a un membre `tag`, et formatons la chaîne en fonction. Enfin, nous affichons le message.

Notez que nous utilisons le module `util` ici. Il est fourni par Node.js, aussi vous n'avez rien à installer, mais pour l'utiliser vous devez le déclarer dans votre module. Nous ajoutons ceci en haut du fichier `index.js`:

    var util = require("util");

Si vous relancez le worker, vous devriez voir un certain nombre de message undefined et NaN. C'est parce que le document de test de tout à l'heure n'a pas les champs requis. Si vous allez dans la [console d'administration](http://127.0.0.1:5984/_utils/) de COuchDB, vous pouvez éditer le document et ajouter les champs `message`, `timestamp` et `level`, et si vous voulez `tag`, mais ça n'est pas obligatoire.

Quand vous aurez sauvé le document, vous devriez voir quelque-chose comme ceci:

    1342020415 [debug]: hello world

Ou, si vous avez un `tag`:

    1342020415 [debug, foo]: hello world

Ca trace, nous nous en approchons.

Enfin, nous voulons tracer vers un fichier, et pas seulement vers la ligne de commande. Pour ce faire, nous allons utiliser la méthode Node.js `fs.appendFileSync()`. Pour accéder à cette méthode, nous devons requérir le module `fs` au début d'`index.js`:

    var fs = require("fs");


Enfin, nous changer l'appel à `console.log` en:

    fs.appendFileSync("/tmp/hoodie-worker-log.log", log_message + "\n");

[Lien repo](https://github.com/hoodiehq/worker-log/blob/how-to-5/index.js)

Quand nous démarrons le worker, nous ne voyons plus que le message de bienvenue:

    $ node index.js
    Logger started.

Et c'est ce qui était attendu. Si nous ouvrons un nouveau terminal nous pouvons voir les messages arriver en temps réel avec:

    $ tail -f /tmp/hoodie-worker-log.log
    1342020415 [debug, foo]: hello world

Ca trace.

Ceci conclut la section principale de ce tutoriel. Les sections suivantes remplissent quelques blancs que nous avons omis afin que vous démarrer rapidement.


## Méthodes de soutien

Les méthodes de soutien sont des méthodes dont nous avons besoin durant l'exécution de notre worker, mais qui ne doivent pas être exposés en dehors du module.

La méthode `_changesCallback` ci-dessus est l'une de ces méthode. Si vous avez juste besoin d'une seule d'une méthode de soutien, le code est satisfaisant en l'état, mais si vous voulez appeler d'autres fonctions de soutien à l'intérieur de votre première fonction, nous devons réaliser un petit changement:

    -    changes.follow("mydatabase", this._changesCallback, {}, {
    +    changes.follow("mydatabase", this._changesCallback.bind(this), {}, {

[Lien repo](https://github.com/hoodiehq/worker-log/blob/how-to-6/index.js)

Ceci a pour effet que la variable `this` dans toutes les méthodes de soutien fasse référence à la fonction du module principal. Dans notre cas `WorkerLog()`. Le résultat est que nous pouvons désormais appeler d'autres méthodes avec `this._otherHelperMethod()` à la place de `WorkerLog.prototype._otherHelperMethod()` ce qui est plus pratique.


## Tests

Vous voulez vous assurer que la fonctionnalité de votre worker continue à fonctionner (blague définitivement voulue) pendant que vous développez. Chez Hoodie, nous utilisons [Mocha](http://visionmedia.github.com/mocha/). Vous êtes libre d'utiliser ce qui vous plait, mais cette exemple utilise Mocha et les [assertions](http://nodejs.org/api/assert.html) intégrées à Node.js.

D'abord, installer mocha:

    $ npm install -g mocha

Ensuite, créer un répertoire `test` et un fichier test:

    $ mkdir test
    $ $EDITOR test/test.js

Collez ce code:

    var assert = require("assert")
    describe("Worker", function(){
      describe("#test()", function(){
        it("should do the right thing", function() {
            assert(true);
        });
      });
    });

[Lien repo](https://github.com/hoodiehq/worker-log/blob/how-to-7/index.js)

Enfin, lancez `mocha`:

    $ mocha

    .

    ✔ 1 test complete (2ms)

Super, ça fonctionne, mais nous n'avons rien à tester, en fait.

Re-visitons le code de notre worker et voyons ce que nous pouvons tester. La méthode `_changesCallback()` fait un certain nombre de choses:

 * elle filtre les messages qui ne sont pas de type `log`.
 * elle crée un message formaté à partir d'un objet trace.
 * ele écrit le message dans un fichier de trace.

C'est généralement une bonne idée de garder les méthodes courtes et ne faire qu'une seule chose. Notre méthode ici faire un certain nombre de chose. Ca semble être une bonne idée de la scinder.

Commençons par le filtrage des objets qui ne sont pas de type `log`:

    WorkerLog.prototype._isLogObject = function(obj)
    {
        if(obj._id.substr(0, 3) == "log") {
            return true;
        }

        return false;
    }

Nous sortons le code de `_changesCallback()` et le mettons dans sa propre méthode `isLogObject()`. Le préfixe `is` nous dit que la méthode retournera vrai ou faux. Notez que nous avons basculer l'opérateur de comparaison du `if` en `==`.

Pour utiliser cette fonction, nous ajoutons ceci à `_changesCallback()`:

    if(!this._isLogObject(obj)) {
        return;
    }

[Lien repo](https://github.com/hoodiehq/worker-log/blob/how-to-8/index.js)

Si nous démarrons de nouveau le worker, tout devrait fonctionner comme avant.

Maintenant, nous avons une méthode qui fait un seul travail et nous pouvons tester si elle le fait bien:

    var assert = require("assert")
    describe("WorkerLog", function(){
      describe("#_isLogObject()", function(){
        it("filters log objects correctly", function() {
            var log_object = {
                _id: "log/1234"
            };
            var not_a_log_object = {
                _id: "image/4321"
            };
            var WorkerLog = require("../index");
            assert(WorkerLog.prototype._isLogObject(log_object));
            assert(!WorkerLog.prototype._isLogObject(not_a_log_object));
        });
      });
    });

[Lien repo](https://github.com/hoodiehq/worker-log/blob/how-to-9/index.js)

Nous créons deux objets, un qui est de type `log` et un qui ne l'est pas et nous passons les eux à travers la méthode `_isLogObject()` et vérifions le succès et l'échec respectivement.

Si nous lançons `mocha` à nouveau, notre test passe.

    $ mocha

      Logger started.
    .

      ✔ 1 test complete (45ms)

Génial&#x202F;! Mais nous n'avons pas terminé. `_changeCallback()` fait encore deux jobs. Déplaçons le formatage du message dans sa propre méthode:

    WorkerLog.prototype._formatLogMessage = function(obj)
    {
        var log_message = "";
        if(obj.tag) {
            log_message = util.format("%d [%s, %s]: %s\n",
                obj.timestamp, obj.level, obj.tag, obj.message);
        } else {
            log_message = util.format("%d [%s]: %s\n",
                obj.timestamp, obj.level, obj.message);
        }
        return log_message;
    }

Et appelons-le depuis `_changesCallback()`:

    var log_message = this._formatLogMessage(obj);
    fs.appendFileSync("/tmp/hoodie-worker-log.log", log_message);

[Lien repo](https://github.com/hoodiehq/worker-log/blob/how-to-10/index.js)

Maintenant nous pouvons écrire un test pour la méthode de formatage:

    describe("#_formatLogMessage()", function() {
        it("should format messages correctly", function() {
            var log_object = {
                _id: "log/1234",
                message: "log message",
                level: "debug",
                timestamp: 1234567890
            };
            var WorkerLog = require("../index");
            var expected_message = "1234567890 [debug]: log message\n";
            var result = WorkerLog.prototype._formatLogMessage(log_object);
            assert.equal(expected_message, result);
        });
        it("should format messages with tags correctly", function() {
            var log_object = {
                _id: "log/1234",
                message: "log message",
                level: "debug",
                tag: "internal",
                timestamp: 1234567890
            };
            var WorkerLog = require("../index");
            var expected_message = "1234567890 [debug, internal]: log message\n";
            var result = WorkerLog.prototype._formatLogMessage(log_object);
            assert.equal(expected_message, result);
        });
    });

[Lien repo](https://github.com/hoodiehq/worker-log/blob/how-to-11/index.js)

Lançons `mocha` à nouveau:

    $ mocha

      Logger started.
    ...

      ✔ 3 tests complete (53ms)

Hourra, nous sommes testés maintenant&#x202F;!

Pour récapituler, nous avons appris à séparer notre code dans des méthodes individuelles que nous pouvons tester. Les méthodes définissent ce qui rend le worker spécial, et nous évitons de tester le processus d'écoute lui-même qui est déjà contenu dans un module.

Notez que pour le moment, nous devons lancer une instance CouchDB pour que nos tests fonctionnent. Nous allons bientôt régler ça&#x202F;!

## NPM-itude (NdT: -isation&#x202F;? -isationage&#x202F;?)

Nous utilisons Node.js pour écrire notre worker. Node.js fourni un outil pratique pour le développeur appelé *npm*. Nous avons utilisé npm plus tôt pour installer le package `CouchDBChanges`. Npm peut faire tout sortes de choses bonnes pour nous. Nous devrions l'utiliser.

Pour commencer, créons un nouveau fichier `package.json` au niveau le plus haut du répertoire de notre worker:

    {
        "name": "hoodie-worker-log",
        "version": "0.0.1",
        "description": "log things to a file, Hoodie-style",
        "author": "Hoodie",
        "scripts": {
            "start": "node index.js",
            "test": "mocha"
        },
        "dependencies": {
            "CouchDBChanges": ">=0.0.3"
        },
        "devDependencies": {
            "mocha": ">=1.3.0"
        }
    }

[Lien repo](https://github.com/hoodiehq/worker-log/blob/how-to-12/index.js)

Lisez `npm help json` pour les détails sur ce que tout ceci veut dire. Brièvement, un nom nous permettra d'enregistrer le worker auprès d'npm, afin que d'autres personnes puissent l'utiliser. Nous lui donnons une version basse que nous augmenterons au fur et à mesure. La description explique ce que le worker fait. Dans `scripts` nous pouvons dire à npm quoi lancer quand il est appelé avec `npm start` ou `npm test` ce qui sera utile plus tard. Et enfin, nous enregistrons nos dépendances, pour nous assurer de toujours avoir la bonne version du package CouchDBChanges.

Pour démarrer maintenant notre worker, nous pouvons lancer `npm start`:

    $ npm start

    > hoodie-worker-log@0.0.1 start /Users/jan/Work/hoodie/worker/worker-log
    > node index.js

    Logger started.

Ca semble bon.


## Intégration continue avec Travis CI

Nous avons déjà nos tests unitaires de près. C'est bien, mais nous pouvons faire mieux: une intégration continue qui lance nos tests unitaires à chaque commit dans notre repository. Ce qui suit par du principe que vous utilisez GitHub.

Pour activer l'intégration Travis, nous devons créer un fichier `.travis.yml`:

    language: node_js
    node_js:
      - 0.8

Nous allons ensuite sur le [site web de Travis CI](http://travis-ci.org) et suivons les instructions pour configurer notre repository.

[Lien repo](https://github.com/hoodiehq/worker-log/blob/how-to-13/index.js)

Notez que pour le moment, nous avons besoin d'une instance CouchDB pour que les tests réussis, aussi pousser ceci vers Travis CI échouera. Nous allons régler ceci rapidement&#x202F;!

## Configuring Workers

Jusqu'ici, nous avons harcodé quelques valeurs, l'adresse du serveur CouchDB, le nom de la base de donnée et le nom du fichier trace. Dans le monde réel, ces choses devraient être configurables. Faisons-le maintenant. Pour commencer, nous devons rendre ces valeurs harcodées variables:

    var config = {
        server: "http://127.0.0.1:5984",
        database: "mydatabase",
        logfile: "/tmp/hoodie-worker-log.log"
    };

Nous passons alors la variable `config` à notre instantiation de `WorkerLog`:

    var log = new WorkerLog(config);

Et nous remplaçons toutes les occurrences dans notre code, comme montré dans ce diff:

    -function WorkerLog()
    +function WorkerLog(config)
     {
    +    this.config = config;
         console.log("Logger started.");

    -    var changes = new CouchDBChanges("http://127.0.0.1:5984/");
    -    changes.follow("mydatabase", this._changesCallback.bind(this), {}, {
    +    var changes = new CouchDBChanges(this.config.server);
    +    changes.follow(this.config.database, this._changesCallback.bind(this), {}, {
             include_docs: true}
         );
     }
    @@ -43,7 +44,13 @@ WorkerLog.prototype._changesCallback = function(error, message)
         }

         var log_message = this._formatLogMessage(obj);
    -    fs.appendFileSync("/tmp/hoodie-worker-log.log", log_message);
    +    fs.appendFileSync(this.config.logfile, log_message);
     }

[Lien repo](https://github.com/hoodiehq/worker-log/tree/how-to-14)

Maintenant que notre code est variable, nous avons besoin d'un moyen d'y passer les nouvelles options de configuration.

C'est facile, nous avons juste besoin d'étendre ce que nous avons déjà:

    var config = {
        server: process.env.HOODIE_SERVER || "http://127.0.0.1:5984",
        database: process.env.HOODIE_DATABASE || "mydatabase",
        logfile: process.env.HOODIE_LOGFILE || "/tmp/hoodie-worker-log.log"
    };

[Lien repo](https://github.com/hoodiehq/worker-log/tree/how-to-14b)

Ce code essaye de lire des variables d'environnement, et s'il le les trouve pas, il assigne des valeurs par défaut.

Pour, disons, changer les valeurs serveur et base de donnée, nous pouvons faire:

    $ HOODIE_SERVER="http://example.com" HOODIE_DATABASE="somedatabase" npm start

Notez que les autres shells peuvent avoir d'autres syntaxes pour configurer les variables d'environnement.

// TODO: rechargement et autres, c.f. Heroku


## Organiser le code

Prenons un peu de hauteur, et introduisons un peu de structure pour nous rendre les choses plus faciles plus tard: nous organisons le code dans différents fichiers.

Le motif de module Node.js que nous utilisons ici (nous ne vous l'avons pas dit, mais c'est ce que nous faisons secrètement) maintient le fichier `index.js` aussi réduit que possible, le notre va donc ressembler à ça:

    var WorkerLog = require("./lib/worker-log");

    var config = {
        server: "http://127.0.0.1:5984",
        database: "mydatabase",
        logfile: "/tmp/hoodie-worker-log.log"
    };

    var log = new WorkerLog(config);

Et `lib/worker-log.js` contiendra le reste de notre code.

Ceci nous permet de finalement lancer nos tests sans avoir à lancer le worker au complet. Ceci veut dire que nous pouvons désormais lancer nos tests sans avoir besoin d'une instance CouchDB fonctionnelle. Et notre configuration Travis CI fonctionne aussi maintenant&#x202F;!

Reportez-vous au [lien repo](https://github.com/hoodiehq/worker-log/tree/how-to-15) pour voir comment nous devons ajuster quelques require pour nos tests.


## Servir plusieurs bases de données

Pour le moment, notre worker n'écoutera les modifications que d'une seule base de donnée. Pour pouvoir tracer depuis plusieurs bases, nous pourrions simplement lancer un worker par base et passer le nom de la base au worker via les variables d'environnement (voir [*Configurer les workers*][] pour les détails là-dessus).

Avec plusieurs centaines ou milliers d'utilisateurs, ça voudrait dire avoir de nombreux process Node.js qui ne font presque rien. Avec un tout petit peu de travail, nous pouvons rendre notre worker capable de gérer toutes les bases dans un seul processus Node.js qui travaille. L'astuce est d'instancier plusieurs objets workers, un par base de donnée.

Voici à quoi ressemble le fichier `index.js`:

    var WorkerLog = require("./lib/worker-log");
    var request = require("request");

    var config = {
        server: process.env.HOODIE_SERVER || "http://127.0.0.1:5984",
        logfile: process.env.HOODIE_LOGFILE || "/tmp/hoodie-worker-log.log"
    };

    var workers = [];
    request({
      uri: config.server + "/_all_dbs"
    }, function(error, response, body) {
      if(error !== null) {
        console.warn("init error, _all_dbs: " + error);
      }

      var dbs = JSON.parse(body);
      dbs.forEach(function(db) {
        if(db[0] == "_") {
            // skip system dbs
            return;
        }
        config.database = db;
        var worker = new WorkerLog(config);
        workers.push(worker);
      });
    });

[Lien repo](https://github.com/hoodiehq/worker-log/tree/how-to-16).

D'abord, nous requérons le module `request` dont nous aurons besoin plus tard. Ensuite, nous retirer la valeur de configuration `database` de notre objet `config`. Enfin nous initialisons un tableau vide qui contient les instances des workers. Nous envoyons alors une requête au serveur COuchDB et demandons la liste de toutes les bases de données. Pour chaque base, nous ajoutons son nom à l'objet `config` et nous démarrons un nouveau worker avec cette configuration. Nous passons les bases avec un *souligné*, car elles sont spéciales pour CouchDB.

Quand nous démarrons maintenant notre worker, nous devrions voir:

    $ npm start

    > hoodie-worker-log@0.0.1 start /Users/jan/Work/hoodie/worker/worker-log
    > node index.js

    Logger started for 'mydatabase'.

Si vous avez plus de bases de données dans votre instance CouchDB, vous devriez avoir une ligne pour chacune d'entre elle, du format "Logger started for 'nom de la base'".



## Gestion d'erreur

## Ignorer les objets déjà traités

## Objets avec machines à état

## Déployer un worker avec Heroku

## S'enregistrer avec Hoodie

## Configuration distante
