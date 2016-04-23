---
layout: layout-hoodieverse
locales: fr
---
# Derrière la magie: comment Hoodie fonctionne

Hoodie possède plusieurs composants qui participent ensemble de manière plutôt atypique à tenir notre promesse de simplicité, de synchronisation par défaut et des capacités déconnectées.

Tout commence au frontend, avec votre application. C'est votre interface utilisateurs, votre logique business côté client, etc.

<p><img src="../../src/img/how-hoodie-works/1.jpg" width="100%" height="auto"></p>

Le code de l'application ne parle qu'à l'API frontend de Hoodie, jamais au code côté serveur, à la base de donnée ou même au stockage du navigateur.
<p><img src="../../src/img/how-hoodie-works/2.jpg" width="100%" height="auto"></p>

Vous pouvez remplacer le localstorage avec n'importe quel stockage dans le navigateur (en fait, nous sommes en train de le remplacer avec <a href="http://pouchdb.com" target="_blank">PouchDB</a>). Hoodie sauvegarde toutes ses données à cet endroit avant tout, avant de faire quoique que ce soit. Si vous êtes déconnecté, vos données sont stockées localement, saines et sauves.
<p><img src="../../src/img/how-hoodie-works/3.jpg" width="100%" height="auto"></p>

Ceci, en soi, est déjà suffisant pour une application. Mais si vous souhaitez sauvegarder vos données à distance, ou envoyer un mail, par exemple, vous allez avoir besoin d'un peu plus.

Hoodie s'appuie sur <a href="http://couchdb.apache.org" target="_blank">CouchDB</a>, la base de donnée répliquée. Nous l'utilisons pour synchroniser les données entre le serveur et les clients, ce qui est justement quelque-chose que CouchDB fait plutôt bien.
<p><img src="../../src/img/how-hoodie-works/4.jpg" width="100%" height="auto"></p>

*Petit aparté: dans CouchDB, chaque utilisateur possède sa propre base de donnée privée qu'il est le seul à pouvoir accéder, aussi toutes les données utilisateurs sont privées par défaut. Elle peut être partagée avec le public si l'utilisateur le décide, mais ça ne peut pas arriver par accident. Voilà pourquoi nous mentionnons le partage de donnée et les données globales comme fonctionnalité indépendante.*

Derrière la base de donnée, nous avons le code serveur réel, sous la forme d'un petit coeur node.js avec plusieurs plugins pour l'appuyer. Ceux-ci peuvent alors agir sur les données dans CouchDB, qui réplique alors les modifications jusqu'aux clients.
<p><img src="../../src/img/how-hoodie-works/5.jpg" width="100%" height="auto"></p>

Hoodie fait donc **client &harr; base de donnée &harr; serveur** plutôt que le traditionnel **client &harr; serveur &harr; base de donnée**, et c'est de là que nombre de ses super-pouvoirs viennent.

L'astuce est indiquée par la ligne pointillée au milieu: la connexion entre les clients et le serveur peut être rompue à n'importe quelle moment sans casser le système. Le frontend et le backend ne se parlent jamais directement, ils se laissent juste des messages et des tâches l'un à l'autre. Tout est découplé et basé sur événements, et conçu pour une intégrité a posteriori.

## Les plugins

<a href="/fr/plugins/tutorial.html">Hoodie est extensible</a> sur tout ses aspects: vous pouvez étendre la bibliothèque frontend, le backend, et le panneau d'administration de Hoodie. Actuellement, les fondamentaux suivants sont pré-installés:

* enregistrement et administration des utilisateurs
* le stockage de données
* le chargement et la synchronisation des données
* le partage de données
* envoyer des emails

Vous pouvez démarrer en un clin d'oeil, mais vous avez aussi la possibilité d'aller plus loin et d'adapter tout votre saoul. Mais pour le moment, voyons comment les données naviguent à travers le système…

### Comment les données circulent à travers Hoodie

Partons du principe que nous avons construit une application qui contient un plugin de messagerie directe, afin que les utilisateurs puissent s'envoyer des messages entre eux. Voici comment ça se passerait:

1. L'utilisateur A écrit un message à l'utilisateur B dans son client et l'envoi
2. Hoodie sauvegarde le message dans le stockage du navigateur (localstorage ou PouchDB)
3. Hoodie va essayer de synchroniser le message via CouchDB. Si le client(<a href="https://twitter.com/karlwestin/status/608269861601558528" target="blank"> ou le serveur, pour le coup</a>) est déconnecté, Hoodie va automatiquement réessayer jusqu'à atteindre l'intégrité entre le serveur et tous les clients (par exemple, le téléphone et le macbook de A)
4. Quand le message arrive dans CouchDB, ce dernier émet un *événement de changement* sur lequel notre plugin de messagerie directe est en écoute, et agit
5. Le plugin recopie le message sur la base de donnée de l'utilisateur B, d'où il sera synchronisé avec le stockage des navigateurs des client de B dès qu'ils se connecteront de nouveau au serveur
6. Dans le client de B, Hoodie émet un autre *événement de changement* quand le message arrive, que l'interface utilisateur en frontend peut écouter
7. L'interface se met à jour et montre à B le nouveau message. B peut désormais emporter son appareil dans un avion, un sous-marin ou un bunker, et sera toujours capable d'y voir le message, connecté ou pas

### Donc… la synchronisation inter-appareil est intégrée… et le mode déconnecté aussi?

Exact. Tout ce que vous construisez avec Hoodie gère automatiquement la synchronisation des données entre les différents appareils de l'ulilisateur, et il stocke aussi les données sur ces appareils afin que vous puissiez facilement les rendre disponibles déconnecté. Et ce ne sont pas des fonctionnalités supplémentaires que vous devez invoquer, c'est juste comme ça que Hoodie fonctionne.

### Travailler avec les événements de changement

Voici quelques éclaircissement sur comment nous avons rendu tout ça aussi simple, et pour commencer voyons comment vous implémenteriez la réponse de l'interface quand votre utilisateur [ajoute](/fr/techdocs/api/client/hoodie.store.html#storeadd) une nouvelle tâche dans notre application fictive de gestion de tâches:

```javascript
// Storing the new todo item
$('.add-new-todo').click(function(event){
  hoodie.store.add('todo', {
    todovalue: $('.todo-input').val()
  });
});

```

Ce que nous découplons bien évidemment proprement de:

```javascript
// displaying the new todo item
hoodie.store.on('add:todo', function(doc) {
  renderTodo(doc);
});
```
Ce listener se déclenche à chaque fois qu'une nouvelle tâche est ajoutée au stockage de Hoodie. **Mais le stockage de Hoodie ne se préoccupe pas *d'où* cette tâche provient**. Et c'est en fait plutôt impressionnant: la nouvelle tâche pourrait venir de ce client. Elle pourrait venir d'un autre client que l'utilisateur a, comme leur téléphone. Elle pourrait venir d'un plugin de la partie serveur qui lit une API quelque-part et génère à partir de là de nouvelles tâches. Elle a pu venir d'un plugin différent qui permet aux utilisateurs de s'assigner des tâches les uns aux autres. Ca ne fait littéralement aucune différence pour Hoodie, tout ceci est géré avec ce même petit bout de code.

Oh, et ceci couvre aussi la resynchronisation après avoir perdu la connexion serveur, bien sûr.

Et avant que nous oublions, ceci gère aussi et pour commencer le fait d'être complètement déconnecté.

*Pas de soucis. On gère.*

Comme vous voudrez probablement différencier une tâche locale d'une distante, c'est tout aussi facile:

```javascript
hoodie.store.on('add:todo', function(doc, options) {
  if (options.remote) {
    return renderRemoteTodo(doc);
  }
  renderTodo(doc);
});
```
Mais fondamentalement, c'est tout. Voilà comment vous pouvez faire réagir votre interface aux modifications de données dans Hoodie. Simple, robuste et puissant.

## Maintenant allez et construisez des trucs!

Est-ce que vous êtes chaud? Alors dirigez vous vers le [guide d'installation](/fr/start/)!



