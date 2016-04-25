---
layout: layout-hoodieverse
locales: fr
---

# Glossaire

### CouchDB/PouchDB
[CouchDB](http://couchdb.apache.org/) est une base de donnée non relationnelle orientée document avec réplication, ce qui veut dire qu'elle est orientée vers la synchronisation des données entre plusieurs de ses instances. Toutes les données sont stockées sous forme de JSON, toutes les indices (requêtes) sont écrites en JavaScript, et elle utilise HTTP standard pour son API. Elle fonctionne merveilleusement avec [PouchDB](http://pouchdb.com/), la version pour navigateur de CouchDB, que Hoodie utilise actuellement pour migrer les données en local, dans le navigateur.

### Dépôt global
Le dépôt global est l'endroit où Hoodie stocke les données accessibles à tous les utilisateurs, mais il n'est pas encore terminé. Ce dépôt supplémentaire est nécessaire car, par défaut, toutes les données utilisateurs dans Hoodie sont privées, et contenues dans de petites bases de données individuelles ([voir Private User Store](#private-user-store)). Il peut sembler qu'on prend le problème à l'envers, mais Hoodie se concentre sur la construction d'applications web, pas de site web, aussi la première chose que nous avons construite est le dépôt privé pour les utilisateurs. Nous ajouterons ultérieurement la capacité de gérer plusieurs formes de données partagées, publiques et globales sous forme de plugins.

### Les utilisateurs
Hoodie n'est pas un CMS, mais un framework pour les applications web, et en tant que tel, il est très centré sur les utilisateurs. Toutes les fonctionnalités de déconnexion et de synchronisation sont spécifiques aux données de chaque utilisateur, et les données de chaque utilisateur sont isolées de celles des autres par défaut. Ceci permet à Hoodie de savoir facilement comment synchroniser les différents clients de l'utilisateur et le serveur&#x202F;: toutes les données de l'utilisateur sont privées, tout simplement.

<a id="private-user-store"></a>
### Private User Store
Chaque utilisateur enregistré dans votre application Hoodie a sa propre petite base de données, qui est privée par défaut. Tout ce que vous faites dans le contexte **hoodie.my** stocke ses données à cet endroit. Si vous voulez que d'autres utilisateurs puissent voir les données de l'utilisateur, vous devez explicitement les rendre publiques. Voir [Public User Data](#public-user-data) à ce sujet.

<a id="public-user-data"></a>
### Public User Data
Les données dans un User Store sont privées par défaut, mais peuvent être rendues publiques, afin d'être visibles par les autres utilisateurs enregistrés ou anonymes. Pour cela, ajoutez l'attribut **public** à l'objet options à la fin de chaque appel d'une fonction de **store** (comme **store.update**). L'attribut public contient soit tableau des noms des attributs qui doivent être rendus publique, soit la valeur **true** ou **false**. Ces dernières options s'appliquent alors à l'objet entier qui vient d'être créé/sauvegardé/mis à jour.

Petit exemple&#x202F;: ceci rend l'attribut **color** de l'objet publique, tous les autres attributs restants privés.

```javascript
hoodie.my.store.update("couch","abc4567", {}, {
	public: ["color"]
});
```

<a href="https://github.com/hoodiehq/hoodie.js/blob/b790bb09613e25b907af0e10a444cdcee98d910b/README.md" target="_blank">Consultez le fichier readme de hoodie-client.js pour plus de détails</a>.

### Partage

Hoodie permet aux utilisateurs de rentre des données visibles publiquement (voir [Public User Data](#public-user-data)), mais ils pourront aussi partager leurs données en modification dans un futur proche.

### Workers

Les "workers" sont des "helpers" qui tournent constamment pour observer les données de l'application Hoodie et travaillent pour vous, afin par exemple de recevoir et interpréter des mails ou les transformer en tâches. Ou envoyer le mail de confirmation d'enregistrement. Ou écrire les traces sur le serveur. Ou à peu près tout ce que vous pouvez imaginer faire avec node.js.

<a href="https://github.com/hoodiehq/documentation/blob/master/worker.md" target="_blank">Pour apprendre à travailler avec les "workers", reportez-vous à ce tutoriel pour écrire un "worker" basique de trace</a>.
