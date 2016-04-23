---
layout: layout-api
locales: fr
---
# hoodie
**version:**      *> 0.1.0*

## Introduction

Ce document décrit les fonctionnalités de l'objet Hoodie de base. Ce dernier fourni un certain nombre de méthodes de soutien quant à la gestion d'événements et la connexion, ainsi qu'un générateur d'identifiant unique et un moyen de positionner l'URL avec laquelle Hoodie communique.

<a id="top"></a>

### Propriétés

- [baseUrl](#baseUrl)

### Méthodes

- [id](#id)
- [on](#on)
- [one](#one)
- [off](#off)
- [trigger](#trigger)
- [request](#request)
- [open](#open)
- [checkConnection](#checkConnection)
- [isConnected](#isConnected)
- [extend](#extend)


<a id="baseUrl"></a>
### [hoodie.baseUrl](#baseUrl)
**version:**    *> 0.2.0*

**Retourne l'URL de base de Hoodie**

```javascript
hoodie.baseUrl
```

La propriété **hoodie.baseUrl** est automatiquement positionnée à l'initialisation, mais vous pouvez l'écraser quand vous initialisez Hoodie, et fournir votre propre URL. Ceci veut dire que vous pouvez dans la pratique utiliser le même stockage de données pour plusieurs applications si vous le souhaitez. 

##### exemple

Initialisation par défaut de Hoodie

```javascript
hoodie = new Hoodie();
hoodie.baseUrl; // ''
```

Spécifier votre propre URL

```javascript
hoodie = new Hoodie('http://myhoodieapp.com');
hoodie.baseUrl; // 'http://myhoodieapp.com'
```

<a id="id"></a>
### [id()](#id)
**version:**      *> 0.2.0*

**Retour un identifiant unique et persistant pour l'utilisateur courant.**

```javascript
hoodie.id();
```

Chaque utilisateur se voit assigner un identifiant unique et aléatoire lors de sa première visite à une application Hoodie, avant même de s'enregistrer. Il est, dans cet état, un **utilisateur anonyme**. Son identifiant et ses données seront maintenus en local.

Quand l'utilisateur s'enregistre, cet identifiant est lié de manière permanente avec son compte. Après chaque déconnexion subséquente, **hoodie.id()** retourne une nouvelle valeur pour son client, parce qu'il est de facto un nouvel utilisateur, anonyme.

#### Exemple
```javascript
hoodie.id(); // "i67s6sm"
hoodie.account.signIn(username, password)
  .done(function() {
    hoodie.id(); // "vley9kp"
});
```

<a id="on"></a>
### [on()](#on)
**version:**      *> 0.2.0*

**Ajoute un nouveau gestionnaire d'événement pour l'événement spécifié**

```javascript
hoodie.on('event', eventHandler);
```

| option       | type     | description                        | obligatoire |
|:------------ |:-------- |:---------------------------------- |:----------- |
| event        | String   | Identifiant de l'événement custom  | oui         |
| eventHandler | Function | Fonction de gestion de l'événement | oui         |

Hoodie vous informe d'un grand nombre d'événements internes, comme quand des données sont ajoutées, supprimées ou changées, ou quand un utilisateur se connecte et se déconnecte. Ces événements peut être écoutés avec **on()**. Vous pouvez aussi raccrocher des processus d'écoute aux événements que vous créez et les déclencher vous-même. Voir [trigger](#trigger) à ce sujet.

#### Une note sur le format de l'identifiant d'événement

Les identifiants d'événements de stockage de Hoodie ont toujours le même format:

```javascript
object-type:object-id:event-type
```

Le **event-type** est obligatoire. Si vous voulez écouter plus d'un type d'événement à la fois, utilisez le type **change**, qui est déclenché sur *add*, *update* et *remove*.

**object-type** et **object-id** sont optionnels: omettre **object-type** écoutera pour tous les objets de la base, le préciser écoutera seulement les objets de ce type. Omettre **object-id** écoutera les événements de tous les objets d'un type. Si vous précisez *effectivement* un identifiant d'objet, vous ne recevrez que les événements pour cet objet spécifique.

Vous pouvez trouver des explications plus détaillées et des exemples dans la [documentation des événements hoodie.store](/fr/techdocs/api/client/hoodie.store.html#storeevents).

**Dans les bases ciblées**, qui sont des bases qui ne contiennent qu'un type d'objet, **le paramètre type devrait être omis** puisqu'il est implicite.

#### Exemple

**Écouter l'apparition d'un nouvel objet todo:**

```javascript
hoodie.store.on('todo:add', function(newTodoObject) {
  console.log('A todo has been added => ', newTodoObject);
});
```

Notez que vous appelez **on()** depuis **hoodie.store**, pas depuis **hoodie** lui-même.

**Écouter les modifications dans une base avec scope:**

```javascript
var todoStore = hoodie.store('todo');
todoStore.on('change', function(changedTodoObject) {
  console.log('A todo has been changed => ', changedTodoObject);
});
```

Comme vous pouvez le constater, la base est ciblée pour ne contenir que des objets de type **todo**, aussi est-il inutile de spécifier le type d'objet dans le processus d'écoute.

**Écouter l'authentification d'un utilisateur:**

```javascript
hoodie.account.on('signin', function(username) {
  console.log('Hello there, '+ username);
});
```

Notez que pour les événements d'authentification, vous appelez **on()** depuis **hoodie.account**, pas depuis **hoodie** lui-même.[Voici une liste complète des événements liées aux comptes](/fr/techdocs/api/client/hoodie.account.html#accountevents).


<a id="one"></a>
### [one()](#one)
**version:**      *> 0.2.0*

**Lie un gestionnaire d'événement à l'événement spécifié pour un seul déclenchement. Une fois que l'événement a été déclenché, le gestionnaire est automatiquement délié.**

```javascript
hoodie.one('event', eventHandler);
```

| option       | type     | description                        | obligatoire |
|:------------ |:-------- |:---------------------------------- |:----------- |
| event        | String   | Identifiant de l'événement custom  | oui         |
| eventHandler | Function | Fonction de gestion de l'événement | oui         |

Ceci fonctionne exactement comme **on()**, mais pour un seul déclenchement seulement.

<a id="off"></a>
### [off()](#off)
**version:**      *> 0.2.0*

**Débranche tous les gestionnaires d'événements d'un certain événement.**

```javascript
hoodie.off('event');
```

| option       | type     | description                        | obligatoire |
|:------------ |:-------- |:---------------------------------- |:----------- |
| event        | String   | Identifiant de l'événement custom  | oui         |

Opposé de **on()**. Vous n'avez pas à spécifier la fonction de gestion, seulement l'identifiant de l'événement.

#### Exemple

Ajout d'un processus d'écoute sur un événement custom, puis retrait avant qu'il ne soit déclenché

```javascript
var todoStore = hoodie.store('todo');

todoStore.on('todo:completed', function(completedTodo) {
  // on atteindra jamais ce point
});

// ceci retire le gestionnaire
// d'événement précédemment enregistré
todoStore.off('todo:completed');

// Aussi, ceci n'a aucun effet
todoStore.trigger('todo:completed', completedTodo);

```

<a id="trigger"></a>
### [trigger()](#trigger)

**version:**      *> 0.2.0*

**Déclencher un événement particulier Ceci inclus à la fois les événements custom et les prédéfinis.**

```javascript
hoodie.trigger('event', param, param, param ...);
```

| option     | type   | description                                             | obligatoire |
|:---------- |:------ |:------------------------------------------------------- |:----------- |
| event      | String | Identifiant de l'événement                              | oui         |
| param      | Object | Information qui sera passé aux processus d'écoute       | non         |

**trigger()** vous permet de déclencher des événements, à la fois ceux natifs à Hoodie (comme *add* ou *change*) que les customs que vous auriez défini vous-même.

**Note:** dès le second paramètre, vous pouvez passer un nombre illimité d'information additionnelle avec l'événement. Bon, <a href="http://stackoverflow.com/questions/22747068/is-there-a-max-number-of-arguments-javascript-functions-can-accept/22747272#22747272" target="_blank">presque illimité</a>.

#### Exemple

Déclencher un événement custom "**:completed**"

```javascript
var todoStore = hoodie.store('todo');

function markAsCompleted(todo) {
  // mark une too comme terminée et déclenche l'événment completed
  todo.completed = true;
  todoStore.trigger('todo:completed', todo, new Date());
}

todoStore.on('todo:completed', function(completedTodo, completionDate) {
  console.log(completedTodo.title, ' was completed on ', completionDate);
});

todoStore.findAll().done(function(allTodos) {
  // Cherche toutes les todo, prend la première,
  // et la marque comme terminée
  markAsCompleted(allTodos[0]);
});

```
**Important**: si vous liés un gestionnaire d'événement à un dépôt de données ciblé, comme dans **hoodie.store('todo').on()**, un appel général **hoodie.store.trigger()** n'atteindra pas le gestionnaire. Un exemple devrait rendre ça plus clair:

#### Using trigger() with Scoped Stores

```javascript
var todoStore = hoodie.store('todo');

todoStore.on('trigger-test', function(num) {
  // ne sera pas appelé par le premier trigger
  console.log('triggered by', num);
});

// Ne fonctionnera pas
hoodie.store.trigger('trigger-test', 'number 1');
// Fonctionne
todoStore.trigger('trigger-test', 'number 2');
// Fonctionne aussi
hoodie.store('todo').trigger('trigger-test', 'number 3');

```

<a id="request"></a>
### [request()](#request)

**version:**      *> 0.2.0*

**Envoie une requête**

```javascript
hoodie.request(type, url, options);
```

| option     | type     | description                                | obligatoire |
|:---------- |:-------- |:------------------------------------------ |:-------- |
| type       | string   | verbe http, i.e. get, post, put ou delete  | oui      |
| url        | string   | URL absolue ou relative                    | oui      |
| options    | object   | compare <a href="http://api.jquery.com/jquery.ajax/" target="_blank">http://api.jquery.com/jquery.ajax</a> | non      |


##### Exemple
```javascript
hoodie.request('get', 'http://example.com/something')
  .done(renderSomething)
  .fail(handleError);

```


<a id="open"></a>
### [open()](#open)

**version:**      *> 0.2.0*

**Interagit avec une base distante**

```javascript
hoodie.open('db-name');
```

Utilisez ceci pour vous connecter à une base de donnée autre que celle de l'utilisateur actuel, ce qui est le comportement par défaut. Ça peut, par exemple, être une base publique en lecture seule contenant les données de configuration globale de votre application, ou un salle de discussion publique pour les utilisateurs connectés, ou tout autre dépôt partagé de données.


Hoodie ne fournit pas de méthode native pour ça, (il fournit seulement les bases utilisateurs), mais vous pouvez utiliser ceci en combinaison avec les [plugins](/fr/plugins/) ou autre code côté serveur.

| option     | type     | description               | obligatoire |
|:---------- |:-------- |:------------------------- |:----------- |
| name       | string   | nom de la base de données | oui         |


##### Exemple
```javascript
var chat = hoodie.open('chatroom');
chat.findAll('message')
  .done(renderMessages)
  .fail(handleError);

```


<a id="checkConnection"></a>
### [checkConnection()](#checkConnection)

**version:**      *> 0.2.0*

**Envoie une requête au serveur Hoodie pour vérifier s'il est joignable**

```javascript
hoodie.checkConnection();
```

Retourne une promise. Sur **fail()**, un objet erreur sera inclus avec les détails.

##### Exemple
```javascript
hoodie.checkConnection()
  .done(renderGreenLight)
  .fail(renderRedLight);

```


<a id="isConnected"></a>
### [isConnected()](#isConnected)

**version:**      *> 0.2.0*

**Retourne vrai si le backend Hoodie est actuellement joignable, sinon retourne faux**

```javascript
hoodie.isConnected();
```

##### Exemple
```javascript
if (hoodie.isConnected()) {
  alert('Looks like you are online!');
} else {
  alert('You are offline!');
}

```


<a id="extend"></a>
### extend()

**version:**      *> 0.2.0*

**Étend l'API Hoodie avec une nouvelle fonctionnalité**

```javascript
hoodie.extend(plugin);
```

| option     | type     | description                                                             | obligatoire |
|:---------- |:-------- |:----------------------------------------------------------------------- |:----------- |
| plugin     | function | Étend l'API frontend avec la logique exposée par votre plugin           | oui         |

Utilisé lors de l'écriture de plugins Hoodie, vous donne les moyens d'étendre l'API frontend de Hoodie pour exposer des méthodes pour utiliser votre plugin. [Voyez ce guide détaillé pour écrire vos propres plugins](/fr/plugins/tutorial.html).

##### Exemple
```javascript
hoodie.extend(function(hoodie, lib, util) {
  hoodie.sayHi = function() {
    alert('say hi!');
  };
});

hoodie.sayHi(); // Montre l'alerte

```


## Plus avant

Dirigez-vous maintenant vers le côté excitant: les documents pour les [comptes utilisateurs](/fr/techdocs/api/client/hoodie.account.html) et le [stockage](/fr/techdocs/api/client/hoodie.store.html)! Apprenez comment enregistrer vos utilisateurs et les laisser stocker des données, parmi d'autres choses sympathiques.

Nous espérons que ce guide API vous a aidé. Sinon, laissez-nous vous aider <a href="http://hood.ie/chat" target="_blank">sur IRC ou Slack</a>.
Nous avons aussi une <a href="http://faq.hood.ie" target="_blank">FAQ</a> qui pourrait se révéler utile si les choses se passent mal.

Si vous trouvez des erreurs dans ce guide ou qu'il est dépassé, vous pouvez aussi <a href="https://github.com/hoodiehq/documentation/issues" target="_blank">ouvrir un ticket</a> ou soumettre une pull request avec vos corrections à <a href="https://github.com/hoodiehq/documentation/blob/gh-pages/fr/techdocs/api/client/hoodie.md" target="_blank">ce fichier</a>.
