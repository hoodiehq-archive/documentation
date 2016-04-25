---
layout: layout-api
locales: fr
---
# hoodie.global
**source:**     <a href="https://github.com/hoodiehq/hoodie-plugin-global-share" target="_blank">hoodiehq/hoodie-plugin-global-share</a>

Vous permet de rendre des documents accessibles de manière globale à tout utilisateur ou visiteur non enregistré.

### Installation&#x202F;:

```bash
$ hoodie install global-share
```

### Utilisation&#x202F;:

Partons du principe que vous avez une configuration Hoodie en place.

Créez quelque documents que vous voudriez rendre accessible publiquement&#x202F;:

```javascript
var docs = [
  {
    name: 'sleep'
  },
  {
    name: 'eat'
  },
  {
    name: 'sleep some more'
  }
];

hoodie.store.add('tasks', docs)
	.done(function(newDocs) { ... });
```

Rentre toutes les **tâches** accessibles publiquement&#x202F;:

```javascript
hoodie.store.findAll('tasks').publish();
```

ou publier **une seule tâche**&#x202F;:

```javascript
hoodie.store.find('tasks', 'taskID12345').publish();
```
C'est la même chose pour **dépublier**&#x202F;:

```javascript
hoodie.store.findAll('tasks').unpublish();
hoodie.store.find('tasks', 'taskID12345').unpublish();
```

Vous pouvez alors lire ces documents depuis le dépôt **hoodie.global**, connecté comme n'importe quel utilisateur (ou même pas connecté du tout).


```javascript
hoodie.global.find('tasks')
	.done(function(publicTasks) { ... });
```

### Tests&#x202F;:

```bash
$ grunt
```
