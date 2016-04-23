---
layout: layout-plugins
locales: fr
---

## Table des matières

##### 1. Introduction
- Intro
- Que peut faire un plugin Hoodie?

##### 2. Pré-requis
- Pré-requis
- L'architecture de Hoodie
- L'API plugin et les tâches

##### 3. Construire un plugin
- Construisons un plugin de messagerie instantanée
- Comment ça va fonctionner?
- Par où commencer <br/><br />
- Structurer un plugin<br /><br />
- Le composant frontend du plugin de messagerie instantanée
- Le composant backend du plugin de messagerie instantanée
- Étendre le panneau d'administration avec celui de votre plugin
<br /><br />
- Le fichier package.json

##### 4. Tests
- Écrire les tests

##### 5. Déploiement
- Déployer votre plugin sur NPM

##### 6. Démarrer avec le template
- Démarrer avec le template


### Introduction

L'API de Hoodie offre un petit ensemble de fonctionnalités pour gérer le stockage des données, la synchronisation et l'authentification. Toutes les autres fonctionnalités dont vous pourriez avoir besoin peuvent être ajoutées en construisant des plugins. Notre but est de rendre Hoodie extensible autant que possible, tout en conservant un petit coeur, de manière à ce que vous puissiez ajouter les modules que dont _vous_ avez besoin, et juste ceux-là.

#### Que peut faire un plugin Hoodie?

Pour faire court, tout ce que Hoodie peut faire. Un plugin peut travailler au sein du backend Node.js de Hoodie et manipuler la base de donnée ou parler à d'autres services, il peut étendre l'API de la bibliothèque frontend, et il peut apparaître dans la panneau d'administration dont toute application Hoodie dispose, et l'étendre avec de nouvelles statistiques, configuration ou tout ce que vous pourrez imaginer.

#### Des exemples de plugins

Vous pourriez …

- tracer des événements particuliers et vous envoyer des mails à chaque fois que quelque-chose de catastrophique / merveilleux survient (un peu comme votre propre IFTTT pour votre application)
- faire en sorte que Node.js redimensionne les images uploadées dans votre application, générer quelques versions réduites, les sauvegarder sur S3 ou un autre serveur et les référencer dans votre base de donnée
- authentifier de manière sécurisée vos utilisateurs sur des services comme Twitter ou GitHub et échanger des données
- étendre Hoodie afin que les utilisateurs enregistrés puissent échanger des messages directement entre eux

### Pré-requis: un peu de préparation avant de démarrer

Tout ce dont vous avez besoin pour écrire un plugin Hoodie est une application Hoodie qui tourne. Votre plugin vit directement dans le répertoire **node_modules** de l'application et doit être référencé dans son **package.json**, comme n'importe quel autre module npm. Vous n'avez pas besoin de l'enregistrer ou de le maintenir en tant que module npm une fois qu'il est terminé.
(Comme nous souhaitons être capable d'utiliser l'infrastructure de npm pour aider les gens à trouver et installer les plugins Hoodie sur le long terme, nous voulons tout de même vous encourager à l'utiliser aussi, ce qui aiderait beaucoup la communauté. Nous vous expliquerons comment faire à la fin de ce document.)

#### L'architecture de Hoodie

L'une des fonctions les plus puissantes de Hoodie est le Offline First, ce qui veut dire que toutes les applications Hoodie (et par conséquent, votre plugin aussi) fonctionne constamment, indépendamment de l'état de la connexion de l'utilisateur. Ceci fonctionne parce que nous ne laissons pas le frontend envoyer une tâche au backend directement depuis l'application. A la place, le frontend déposer des tâches dans la base de donnée, qui est à la fois locale et distante, et synchronise le tout à chaque fois que c'est possible (ce qui veut dire: à chaque fois qu'il détecte une connexion internet; s'il n'y en a pas, il ne s'en préoccupe pas). Après la synchronisation, ces tâches sont récupérées par le backend, qui agit en fonction de ce que lui ordonne les tâches. Une fois fait, la base de donnée émet les événements correspondants auxquels le frontend peut réagir.
Aussi, nous vous fournissons une API de plugin qui gère la génération et la gestion de ces tâches, l'écriture dans les bases utilisateurs et tout ce dont vous pourriez avoir besoin pour construire _votre_ plugin.

#### Quels composants constituent un plugin?

Les plugins Hoodie sont constitués de trois parties distinctes, et vous aurez besoin d'au moins une (selon ce que vous voulez que votre plugin fasse):

- __Un composant frontend__ qui étend l'API Hoodie sur votre frontend, écrit en JavaScript.
- __Un composant backend__ qui exporte les fonctions serveur / base de données vers votre plugin, écrit en Node.js.
- __Une vue administration__ qui est une interface écrite en HTML, CSS et JS, qui apparaît dans le panneau d'administration de Hoodie pour vous permettre d'intéragir avec l'utilisateur, par exemple pour configurer le plugin.

#### L'API plugin et les tâches

Actuellement, la seule manière d'obtenir quoique ce soit du composant backend est une tâche. Une tâche est un objet un peu spécial qui peut être sauvegardé dans la base à partir du frontend de Hoodie. Le composant backend de votre plugin va écouter les événements émis lorsqu'une tâche apparaît, et fera alors ce que vous souhaitez qu'il fasse. Vous pourriez créer une tâche pour envoyer un message privé dans le frontend, par exemple:

<pre><code>hoodie.task.start('directmessage', {
    'to': 'Ricardo',
    'body': 'Hello there! How are things? :)'
});
</code></pre>
Et dans votre composant backend, écouter l'apparition d'une tâche et agir en conséquence:

<pre><code>hoodie.task.on('directmessage:add',
    function (dbName, task) {
        // generate a message object from the change data
        // and store it in both users' databases
    });
</code></pre>
Mais n'allons pas trop vite. Faisons ça correctement et commençons par le commencement.

### Construisons un plugin de messagerie instantanée

#### Comment ça va fonctionner?

Voici ce que nous voulons que notre application Hoodie puisse faire avec le plugin, que nous allons appeler **directmessages**:

* Les utilisateurs connectés peuvent envoyer un message direct à un autre utilisateur connecté
* Les utilisateurs destinataires verront le nouveau message en quasi temps-réel

Côté frontend, nous avons besoin:

* d'une méthode **directMessages.send()** dans l'API Hoodie pour ajouter une tâche qui envoie le message
* d'une méthode optionnelle **directMessages.on()** qui écoute les événements déclencher, par exemple quand un nouveau message apparaît sur le compte du destinataire

Côté backend, nous devons:

1. vérifier que le destinataire existe
2. sauver le nouveau message dans la base de donnée du destinataire
3. marquer la tâche d'origine comme terminée
4. si ça se passe mal, mettre la tâche à jour en conséquence

#### Par où commencer

Tout plugin que vous écrivez se trouve dans le répertoire **node_modules** de votre application, avec un nom de répertoire qui suive la syntaxe suivante:

<pre><code>[votre_application]/node_modules/hoodie-plugin-[nom-du-plugin]</code></pre>

Ainsi, par exemple:

<pre><code>supermessenger/node_modules/hoodie-plugin-direct-messages</code></pre>

Tout ce qui est lié à votre plugin se trouve là.

#### Structurer un plugin

Comme dit précédemment, votre plugin comporte 3 composants: __frontend__, __backend__ et __admin-dashboard__ (NdT: tableau de bord d'administration). Comme il s'agit idéalement d'un module *npm* complètement qualifié, nous attendons aussi un fichier **package.json** avec les informations sur le plugin.

Partant du principe que vous avez les trois composants, le répertoire de votre plugin devrait ressembler à ça:

<pre><code>hoodie-plugin-direct-messages
    hoodie.direct-messages.js
    worker.js
    /admin-dashboard
        index.html
        styles.css
        main.js
    package.json
</code></pre>
* **hoodie.direct-messages.js** contient le code frontend
* **worker.js** contient le code backend
* **/admin-dashboard** contient le tableau de bord d'administration
* **package.json** contient les métadonnées et les dépendances du plugin

Passons chacun des quatre en revue:

#### Le composant frontend du plugin de messagerie instantanée

C'est ici que vous écrirez les extensions à la partie cliente de l'objet hoodie, si vous en avez besoin. De la même manière que vous pouvez faire

<pre><code>hoodie.store.add('zebra', {'name': 'Ricardo'});</code></pre>

depuis le navigateur dans n'importe quelle application Hoodie, vous pouvez utiliser le composant frontend de votre plugin pour exposer quelque-chose comme

<pre><code>hoodie.directMessages.send({
    'to': 'Ricardo',
    'body': 'One of your stripes is wonky'
});</code></pre>

Vous noterez que nous avons utilisé directMessages au lieu du nom réel de notre plugin "direct-message", juste parce que nous le pouvons. Comment et où vous étendez l'objet hoodie sur le frontend est à votre entière discrétion. Votre plugin pourrait étendre Hoodie à plusieurs endroits ou remplacer une fonction existante.

Tout le code frontend de votre plugin doit se trouver à l'intérieur d'un fichier nommé selon la convention suivante:

<pre><code>hoodie.[nom_du_plugin].js</code></pre>

Dans notre cas, ce serait

<pre><code>hoodie.direct-messages.js</code></pre>

Le code à l'intérieur est très explicite:

<pre><code>Hoodie.extend(function(hoodie) {
  hoodie.directMessages = {
    send: hoodie.task('directmessage').start,
    on: hoodie.task('directmessage').on // maybe not needed
  };
});
</code></pre>

Désormais **hoodie.directMessages.send()** et **hoodie.directMessages.on()** existent. Voici un exemple d'utilisateur de **send()**:

<pre><code>hoodie.directMessages.send(messageData)
.done(function(messageTask){
    // Display a note that the message was sent
})
.fail(function(error){
    console.log("Message couldn't be sent: ",error);
})
</code></pre>
__Note:__ le processus d'écoute **hoodie.task.on()** accepte trois sélecteurs d'objets différents après le type d'événement, tout comme **hoodie.store.on()** le fait pour la bibliothèque frontend hoodie.js:

* aucun, ce qui veut dire n'importe quel type d'objet: **'success'**
* un type spécifique d'objet: **'directmessage:success'**
* un objet spécifique unique: **'directmessage:a1b2c3:success'**

__Important:__ Les noms des tâches et événements doivent _exclusivement_ contenir des _lettres minuscules_, et rien d'autre.

On a réglé le cas du composant frontend. Notez bien que votre plugin peut se contenter de ce seul composant, si vous ne voulez qu'encapsuler du code frontend complexe dans des fonctions pratiques, par exemple.

Mais nous avons encore du chemin à faire, alors avançons jusqu'à la deuxième partie:

#### Le composant backend du plugin de messagerie instantanée

Pour référence pendant que vous lisez, voici [l'état actuel de l'API plugin](https://github.com/hoodiehq/hoodie-plugins-api/blob/master/README.md) telle que documentée sur GitHub.

Par défaut, le composant backend réside dans le fichier **index.js** du répertoire racine de votre plugin. Il peut être laissé là par simplicité, mais Hoodie chargera de préférence ce que vous référencerez dans **main** du **package.json** de votre plugin.

__Avant de commencer__: ce composant sera écrit en Node.js, et Node en général tend à favoriser les callbacks plutôt que les promises. Nous respectons ce choix et souhaitons que chacun se sente à l'aise dans son domaine, ce qui explique pourquoi le code backend possède un style plutôt différent du code frontend.  

Voyons d'abord la chose dans son ensemble:

<pre><code>module.exports = function(hoodie, done) {
  hoodie.task.on('directmessage:add', handleNewMessage);

  function handleNewMessage(originDb, message) {
    var recipient = message.to;
    hoodie.account.find('user', recipient,
    function(error, user) {
      if (error) {
        return hoodie.task.error(originDb, message, error);
      };
      var targetDb = 'user/' + user.hoodieId;
      hoodie.database(targetDb).add('directmessage',
      message,
      addMessageCallback);
    });
  };

  function addMessageCallback(error, message) {
    if(error){
        return hoodie.task.error(originDb, message, error);
    }
    return hoodie.task.success(originDb, message);
  };
  done();
};
</code></pre>
Maintenant, voyons ligne par ligne.

<pre><code>module.exports = function(hoodie, done) {</code></pre>

Un simple conteneur habituel pour le code du composant backend. Encore une fois, nous passons l'objet hoodie de manière à pouvoir utiliser l'API au sein du composant. Nous passons aussi une fonction appelée **done** qu'il nous faudra appeler plus tard, pour dire à Hoodie que nous avons terminé de charger notre plugin. Faites attention à ceci vers la fin de cette section.

<pre><code>hoodie.task.on('directmessage:add', handleNewMessage);</code></pre>

Vous vous souvenez quand nous avons appelé **hoodie.task('directmessage').start** dans le composant frontend. C'est ici la partie correspondante dans le backend, écoutant l'événement émis par **task.('directmessage').add**. Nous appelons **handleNewMessage()** quand l'événement survient:

<pre><code>function handleNewMessage(originDb, message) {</code></pre>

Maintenant nous arrivons aux bases de données. Souvenez-vous: chaque utilisateur dans Hoodie possède sa propre base de donnée isolée, et **task.on()** passe le nom de la base de données d'où provient l'événément.

<pre><code>var recipient = message.to;
hoodie.account.find('user', recipient, function(error, user) {</code></pre>

Nous allons aussi avoir besoin de trouver la base de données du destinataire, afin d'y écrire le message. Notre **hoodie.directMessages.send()** a pris l'objet message avec une clef **to** pour le destinataire, et c'est ce que nous utilisons ici. Nous partons de ce que les utilisateurs s'adressent entre eux par leur nom d'utilisateur et pas par un autre nom.

<pre><code>if (error) {
  return hoodie.task.error(originDb, message, error);
};</code></pre>

L'expéditeur peut avoir fait une erreur et le destinataire peut ne pas exister. Dans ce cas, nous appelons **task.error()** et lui passons le message et l'erreur afin de gérer le problème quand c'est nécessaire. Ceci émettra un événement **error** que vous pouvez écouter sur le frontend _et/ou_ le backend avec **task.on()**. Dans notre cas, nous l'avons passé directement au composant frontend du plugin pour laisser l'auteur de l'application le gérer. En interne, Hoodie sait à quelle tâche se rapporte l'erreur à travers l'objet **message** et son identifiant unique.

<pre><code>var targetDb = 'user/' + user.hoodieId;</code></pre>

Nous n'avions pas encore la base de donnée de l'utilisateur, c'est ce que nous faisons ici. Dans CouchDB, les noms de bases de données consistent en un préfixe de type (dans ce cas, **user**), un slash, et un identifiant. Nous recommandons d'utiliser Futon pour trouver comment sont appelés les objets individuels et les bases de données. Maintenant nous en arrivons au point principal:

<pre><code>hoodie.database(targetDb).add(
    'directmessage',
    message,
    addMessageCallback
);</code></pre>

Ceci fonctionne beaucoup  comme l'ajout d'un objet avec l'API frontend de Hoodie, sauf que nous utilisons ici des callbacks plutôt que des promises. Nous avons ajouté les données du message comme un objet **message** dans la base du destinataire, et si nous écoutons l'événement correspondant **new** sur le frontend, nous pouvons le faire apparaître en quasi temps réel.

__Note__: vous pensez probablement: "Attendez une seconde, et que se passe-t-il si un autre plugin génère aussi des objets **message**?" Et c'est bien vu de votre part. Nous ne gérons pas de namespace ici pour simplifier, mais préfixer les noms des types d'objets avec celui de votre plugin semble être une excellente idée. Dans ce cas, la ligne devrait être

<pre><code>hoodie.database(targetDb).add(
    'directmessagesmessage',
    message,
    addMessageCallback
);</code></pre>

mais pour plus de clarté, on en restera là pour cet exemple.

Quoiqu'il en soit, nous y sommes presque, nous avons juste à faire un peu de ménage:

<pre><code>function addMessageCallback(error, object) {
    if(error){
        return hoodie.task.error(originDb, message, error);
    }
    return hoodie.task.success(originDb, message);
};
</code></pre>
Encore une fois, Hoodie sait à quelle tâche **success** fait référence à travers l'objet **message** et l'identifiant unique qu'il contient. Une fois que vous avez appelé **success** sur une tâche, elle est marquée pour suppression, et le composant frontend (qui écoute un **'directmessage:'+message.id+':remove**') déclenchera la promise de succès dans l'API originelle. Le cycle de vie de la tâche est terminé.

<pre><code>
  done();
</code></pre>

Si vous vous souvenez bien quand nous avons commencé à regarder le code, est maintenant venu le temps de dire à Hoodie que nous avons terminé l'initialisation du plugin. Nous faisons ça en appellant la fonction **done** qui nous a été fournie en second argument de notre fonction **module.exports** au début du code.

Ceci conclu le travail que nous avons à faire côté backend.

#### Notes additionnel sur le composant frontend et l'application

Tout ce qui reste à faire est d'afficher le message dans la vue de l'application de l'utilisateur destinataire dès qu'elle est sauvée en base de données. Dans le code frontend de l'application, nous faisons juste

<pre><code>hoodie.store.on('directmessage:add'),
function(messageObject){
  // Show the new message somewhere
});
</code></pre>
Un truc Hoodie vraiment classique. Vous pouvez aussi appeler **hoodie.store.findAll('directmessage').done(displayAllMessages)** ou tout autre méthode **hoodie.store** pour travailler avec les nouveaux objets messages.

En tant qu'auteur de plugin, vous devriez intégrer ces méthodes avec les vôtres, afin que les auteurs d'application puissent rester dans le scope de l'API de votre plugin même quand ils écoutent des événement de stockage ou de l'API coeur de Hoodie. Par exemple, dans le composant frontend du plugin, avoir:

<pre><code>hoodie.directMessages.findAll = function(){
  return hoodie.store.findAll('directmessage');
};
</code></pre>

Ceci pourrait alors être appelé par l'auteur de l'application ainsi:

<pre><code>hoodie.directMessages.findAll()
    .done(displayAllMessages, showError);</code></pre>

Maintenant vous savez comment créer et terminer des tâches, rendre votre plugin orienté promise, émettre et écouter des événements de tâches, construire votre API frontend, écrire des objets dans les bases utilisateurs et quelques autres choses. Nous dirions que vous êtes bien partis. Toutes les autres fonctionnalités de l'API plugin attendent que vous les découvriez dans la section documentation.

Il y a plus, cependant: nous pouvons construire un panneau d'administration pour le plugin **direct-messages**.

#### Étendre le tableau de bord d'administration avec celui de votre plugin

Pour cette exemple, partons d'un panneau d'administration qui:

* peut envoyer des messages directs aux utilisateurs
* a un paramètre de configuration pour la taille maximum pour la longueur du message (parce que si ça fonctionne pour Twitter, pourquoi ça ne marcherait pas pour nous?)
 
Pour cela, nous devons fournir un répertoire **/admin-dashboard** dans le répertoire racine de notre plugin, et il devra contenir un fichier **index.html** avec ce que vous souhaitez que votre panneau de d'administration montre.

##### Le kit UI du tableau de bord d'administration

Hoodie fournira un kit UI avec des CSS/JS utiles que vous pouvez charger si vous le souhaitez. Idéalement, vous n'aurez pas à écrire une seule ligne de CSS pour rendre votre panneau de plugin joli, mais vous n'en êtes pas encore **tout à fait** là.

**Note:** Tout ceci est très récent et requiert que **node_modules/hoodie-server/hoodie-admin-dashboard-uikit** soit à sa version 2.0.0 ou supérieure. Toute nouvelle application Hoodie créée avec **$hoodie new appName** devrait include cette nouvelle version par défaut, sinon, vous pourriez devoir faire **$hoodie cache clean**. 


Voici un avant-goût:

![Capture d'un plugin stylé avec le kit UI](admin_dashboard_uikit_screenshot.png)

Mettez ceci dans en entête
<pre><code>&lt;head>
    &lt;link rel="stylesheet"
    href="/&#95;api/&#95;plugins/&#95;assets/styles/admin-dashboard-uikit.css">
</code></pre>

Et ceci avant la fin
<pre><code>&lt;script src="/&#95;api/&#95;plugins/&#95;assets/scripts/admin-dashboard-uikit.js">
&lt;/script>
&lt;/body>
</code></pre>

Le fichier **admin-dashboard-uikit.js** inclus un certain nombre de choses, parmi lesquelles les bibliothèques jQuery et Bootstrap, plus tout ce qui rend les cases à cocher, les boutons radios et les listes déroulantes plus jolies (c'est tout automatique), plus le chargement de fichiers par glisser-déposer avec pré-visualisation des images. Merci de consulter le <a href="http://hoodiehq.github.io/hoodie-admin-dashboard-UIKit/" target="_blank">guide du kit UI</a> pour de plus amples informations, des exemples et du code à copier/coller.

Dans un futur proche, ceci fera partie du template de plugin par défaut, aussi aurez-vous un scaffolding sympa à partir duquel travailler.

Commençons par un morceau simple:

##### Styler le panneau d'administration de votre plugin

Comme noté, votre panneau d'administration peut avoir les styles du tableau de bord d'administration appliqués par défaut. Le kit UI est construit autour de Bootstrap (actuellement 2.3.2) aussi tous les développeurs de plugins peuvent s'appuyer sur un ensemble de composants qu'ils savent être stylés par défaut de manière correcte. Vous êtes totalement libre d'omettre ces styles, au cas où vous voudriez faire quelque-chose de spectaculaire.

##### Envoyer des messages depuis le panneau d'administration

La tableau de bord d'administration possède une version spéciale de Hoodie, appelée HoodieAdmin. Elle offre plusieurs API par défaut, comme **hoodieAdmin.signIn(password)**, **hoodie.users.findAll**, et <a href="https://github.com/hoodiehq/hoodie.admin.js" target="_blank">plus</a>.

Elle peut être étendue comme la bibliothèque Hoodie standard:

<pre><code>HoodieAdmin.extend(function(hoodieAdmin) {
  function send( messageData ) {
    var defer = hoodieAdmin.defer();

    hoodieAdmin.task.start('direct-message', messageData)
    .done( function(message) {
      hoodieAdmin.task.on(
        'remove:direct-message:'+message.id, defer.resolve
      );
      hoodieAdmin.task.on(
        'error:direct-message:'+message.id, defer.reject
      );
    })
    .fail( defer.reject );

    return defer.promise();
  };

  function on( eventName, callback ) {
    hoodieAdmin.task.on(
      eventName + ':direct-message', callback
    );
  };

  hoodieAdmin.directMessages = {
    send: send,
    on: on
  };
});
</code></pre>

Maintenant, **hoodie.directMessages.send** peut être utilisée de la même manière par l'administrateur dans le tableau de bord d'administration que par les utilisateurs de l'application. La seule différence est que les autres utilisateurs ne peuvent pas envoyer de message à l'administrateur, ce dernier étant un type de compte spécial.

##### Récupérer et alimenter la configuration du plugin

Pour récupérer / alimenter la configuration du plugin, vous pouvez utiliser
<pre><code>hoodieAdmin.plugin.getConfig('direct-messages');</code></pre>
et
<pre><code>hoodieAdmin.plugin.updateConfig('direct-messages', config);</code></pre>

Ici **config** est un simple objet avec des clefs/valeurs.

Par exemple, disons que vous voulez limiter la taille de message à 140 caractères. Vous construisez un formulaire correspondant dans **admin-dashboard/index.html** avec une entrée de type nombre (disons 140) et l'associez à l'événement submit:

<pre><code>hoodieAdmin.plugin.updateConfig('direct-messages',
  { maxLength: valueFromInputField }
);</code></pre>

Dans le backend, vous vérifiez le paramètre et rejetez les messages qui sont plus longs:

<pre><code>if (message.body.length > hoodie.config('maxLength')) {
  var error = {
    error: 'invalid',
    message: 'Message is too long (
      hoodie.config('maxLength') + ' characters maximum).'
  };
  return hoodie.task.error(originDb, message, error);
}</code></pre>

#### Le fichier package.json

Le fichier package.json est requis par node.js. Pour notre plugin, il ressemble à ça:

<pre><code>{
  "name": "hoodie-plugin-direct-messages",
  "description": "Allows users to send DMs to each other",
  "version": "1.0.0",
  "main": "worker.js"
}</code></pre>

#### Écrire les tests
Arrive bientôt!

#### Déployer votre plugin sur NPM

C'est aussi simple qu'un **npm publish**.


#### Installer votre plugin

Dans votre application Hoodie, lancez simplement

<pre><code>npm install hoodie-plugin-direct-messages</code></pre>.

#### Démarrer avec le template
Vous trouverez le template de plugin <a href="https://github.com/hoodiehq/hoodie-plugin-template" target="_blank">ici.</a>
