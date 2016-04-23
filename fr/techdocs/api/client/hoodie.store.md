---
layout: layout-api
locales: fr
---
# hoodie.store
**version:**      *> 0.1.0* <br>
**source:**       *[hoodie.js/src/hoodie/store](https://github.com/hoodiehq/hoodie.js/tree/master/src/hoodie/store)*

Si vous voulez faire quoique ce soit avec des données dans Hoodie, c'est ici que ça se passe.

**Après avoir lu ce guide, vous saurez comment:**

- ajouter des objets
- trouver des objets
- mettre des objets à jour
- supprimer des objets
- réagir à des modifications d'objets

## Introduction

Une des fonctions clefs de toute application web est de pouvoir stocker et récupérer des données, et **hoodie.store** est votre boite à outil pour toutes les opérations liées aux données. Hoodie est un peu spécial dans le sens où chaque utilisateur a son propre dépôt de données, qui est privé par défaut et se synchronise automatiquement entre les clients de l'utilisateur et le serveur. Initialement, votre application n'a aucun moyen de rendre des données globales ou de les partager entre utilisateurs,mais cette fonctionnalité sera fournie par des [plugins](/fr/plugins/). Ce qu'elle fera, cependant, c'est de s'assurer que les données de chaque utilisateur sont toujours synchronisées sur tous les appareils, et qu'elles sont disponibles sur chaque client pour une utilisation déconnectée.

#### Choses à savoir avant de continuer

Si vous n'avez pas déjà lu comment Hoodie fonctionne sous le capot (NdT: calembour perdu à la traduction...) et synchronise toutes vos données, alors [c'est peut-être le bon moment](/fr/hoodieverse/how-hoodie-works.html). C'est juste un guide avec une vue générale pour que vous compreniez l'architecture de base et les capacités de Hoodie.

Il est aussi important de comprendre le [concept de type dans Hoodie](/fr/tutorials/#understanding-type), puisqu'il concerne toutes les opérations autour des données.

Stocker et accéder aux objets avec Hoodie veut toujours dire accéder à vos objets personnels et locaux.

Tous les objets stockés ont une association stricte avec l'utilisateur qui les a créé. Vous ne serez donc pas capable d'accéder aux données des autres utilisateurs par défaut.

Afin de synchroniser automatiquement les données avec le dépôt serveur, vous devrez vous connecter avec un utilisateur valide. Apprenez-en plus sur le système gestion utilisateur dans [**hoodie.account**](./hoodie.account.html).

<a id="top"></a>

### Méthodes

- [store.add()](#storeadd)
- [store.find()](#storefind)
- [store.findOrAdd()](#storefindoradd)
- [store.findAll()](#storefindall)
- [store.update()](#storeupdate)
- [store.updateOrAdd()](#storeupdateoradd)
- [store.updateAll()](#storeupdateall)
- [store.remove()](#storeremove)
- [store.removeAll()](#storeremoveall)
- [store.on()](#storeon)
- [store()](#store)

### Evénements
- [add](#add)
- [update](#update)
- [remove](#remove)
- [change](#change)
- [clear](#clear)

<a id="storeadd"></a>
### [store.add()](#storeadd)
**version:**      *> 0.2.0*

**Crée un nouvel objet dans votre dépôt local.**

```javascript
hoodie.store.add(type, properties, options);
```

| option     | type   | description                     | obligatoire |
|:---------- |:------ |:------------------------------- |:----------- |
| type       | String | type de l'objet                 | oui         |
| properties | Object | propriétés de l'objet à stocker | oui         |
| options.silent | Boolean  | Si à **true**, aucun événement ne sera déclenché suite à cet appel | non (défaut: false) |

Si **properties.id** est renseigné, il sera utilisé comme l'identifiant de l'objet, sinon il sera généré automatiquement.

Retourne une promise. Si l'opération se termine avec succès, elle appelle le callback **done** et lui passe le nouvel objet. Hoodie ajoutera alors des propriétés supplémentaires (*id* (sauf si vous l'avez déjà positionné), *createdBy*, *createdAt*, *updatedAt*). Si quelque-chose se passe mal, le callback **fail** sera appelé à la place, avec un objet erreur en paramètre. 

#### Exemple

```javascript
hoodie.store.add('todo', { title: 'Getting Coffee' })
	.done(function(todo) { /* gestion de succès */ })
	.fail(function(error) { /* gestion d'erreur */ });
```

<a id="storefind"></a>
### [store.find()](#storefind)
**version:**      *> 0.2.0*

**Recherche le dépôt pour un objet stocké de *type* et *id* spécifié.**

```javascript
hoodie.store.find(type, id);
```

| option     | type   | description                         | obligatoire |
|:---------- |:------ |:-----------------------------------:|:-----------:|
| type       | String | type de l'objet                     | oui         |
| id         | String | identifiant de l'objet à trouver    | oui         |

Retourne une promise. Si l'objet est trouvé, appelle le callback **done** en lui passant l'objet. Sinon, ou si quelque-chose se passe mal, le callback **fail** est appelé avec l'erreur correspondante.

#### Exemple

```javascript
hoodie.store.find('todo', 'hrmvby9')
	.done(function(todo) { /* gestion de succès */ })
	.fail(function(error) { /* gestion d'erreur */ });
```

<a id="storefindoradd"></a>
### [store.findOrAdd()](#storefindoradd)
**version:**      *> 0.2.0*

**Une combinaison pratique de hoodie.store.find et hoodie.store.add.** Utilisez ceci si vous voulez travailler avec un objet spécifique mais pour lequel vous n'êtes pas sûr qu'il existe déjà.

```javascript
hoodie.store.findOrAdd(type, id, properties, options);
```

| option     | type   | description                                         | obligatoire |
|:---------- |:------ |:---------------------------------------------------:|:-----------:|
| type       | String | type de l'objet                                     | oui         |
| id         | String | identifiant de l'objet à trouver                    | oui         |
| properties | Object | propriétés de l'objet à créer s'il n'est pas trouvé | oui      |
| options.silent | Boolean  | Si à **true**, aucun événement ne sera déclenché suite à cet appel | non (défaut: false) |

Retourne une promise. Si l'objet est trouvé, appelle le callback **done** et lui passe l'objet.
Sinon, un objet est créé avec l'id et les propriétés précisées. Si quelque-chose se passe mal, le callback **fail** est appelé avec l'erreur correspondante.

Un cas d'usage sera un objet de configuration spécifique à l'utilisateur. S'il existe déjà, vous voulez utiliser celui-là, mais s'il n'existe pas, vous voulez probablement positionner des valeurs par défaut.

#### Exemple

```javascript
var configDefaults = {
  language: 'en/en',
  appTheme: 'default'
};
var configId  = 'config';

hoodie.store
.findOrAdd('config', configId, configDefaults)
.done(function(userConfig) {
	console.log('Configuration for this user:', userConfig);
});
```

#### Notes
Le paramètre **properties** n'a pas d'influence sur la recherche elle-même. Les paramètres utilisés pour la recherche sont le **type** et l'**id** du document.

<a id="storefindall"></a>
### [store.findAll()](#storefindall)
**version:**      *> 0.2.0*

**Récupère tous les objets d'un *type* particulier depuis le dépôt.**

```javascript
hoodie.store.findAll(type);
```

| option     | type   | description                         | obligatoire |
|:---------- |:------ |:-----------------------------------:|:-----------:|
| type       | String | type de l'objet                     | oui         |


##### Exemple

Si vous avez une application de suivi de tâche et que vous voulez récupérer tous les objets tâches, voici ce que vous utiliseriez:

```javascript
hoodie.store.findAll('todo')
  .done(function(allTodos) {
    console.log(allTodos.length + ' todos found.');
  })
```

**findAll** accepte aussi une fonction comme argument. Si cette fonction retourne vrai pour un objet du dépôt, il sera retourné. **Ceci vous permet d'écrire des requêtes complexe pour le dépôt**. Dans cet exemple simple, supposons que toutes les tâches à faire ont une clef **status**, et nous voulons trouver les tâches non terminées:

```javascript
hoodie.store.findAll(function(object){
  if(object.type === "todo" && object.status === "open"){
    return true;
  }
}).done(function (unfinishedTodos) {
    console.log(allTodos.length + ' unfinished todos found.');
});
```

<a id="storeupdate"></a>
### [store.update()](#storeupdate)
**version:**      *> 0.2.0*

**Change les attributs d'un objet existant, s'il existe.**

```javascript
hoodie.store.update(type, id, changedProperties, options)
hoodie.store.update(type, id, updateFunction, options)
```

| option            | type   | description                         | obligatoire |
|:----------------- |:------ |:----------------------------------- |:----------- |
| type              | String | type de l'objet                     | oui         |
| id                | String | id de l'objet cible                 | non         |
| changedProperties | Object | nouvelles valeurs pour l'objet      | non*        |
| updateFunction    | String | callback qui sera appelé avec les propriétés suivantes. Doit retourner un objet | non*  |
| options.silent    | Boolean  | Si à **true**, aucun événement ne sera déclenché par cet appel | non (défaut: false) |

__*__ Le troisième paramètre est obligatoire, mais peut être soit **changedProperties**, qui est un objet contenant les propriétés à changer, soit **updateFonction**, qui est une fonction qui reçoit, modifie, et retourne l'objet.

Retourne une promise. Quand un objet est trouvé, il est mis à jour et passé au callback **done**. S'il ne peut être trouvé ou si quelque-chose se passe mal, le callback **fail** est appelé avec l'erreur correspondante.

#### Exemple

Mise à jour d'un objet en passant un objet avec les propriétés changées (et nouvelles):

```javascript

/*
Soit l'objet 'todo' suivant:

{
  type:'todo',
	id:'abc456',
	title: 'Start learning Hoodie',
	done: false,
	dueDate: 1381536000
}
*/

hoodie.store('todo')
  .update('todo', 'abc4567', { done: true })
  .done(function(newTodo) {})
  .fail(function(error) {})
```

Les méthodes **update** acceptent une fonction à la place d'un objet avec les propriétés modifiées, afin que vous puissiez manipuler les valeurs existantes. C'est utile quand vous appliquez des calculs aux données ou que vous réalisez des mises à jour conditionnelles. Ce sera particulièrement utile avec **hoodie.store.updateAll**.

#### Exemple

Une mise à jour avec une fonction de mise à jour à la place de propriétés:

```javascript
hoodie.store.update('todo', 'abc456', function(todo) {
    // La mise à jour ne se fait que si la condition est validée
    if( Math.random() > 0.5) {
      // positionne dueDate à maintenant
      todo.dueDate = Date.now();
    }
  })
  .done(function(newTodo) {})
  .fail(function(error) {})
```

<a id="storeupdateoradd"></a>
### [store.updateOrAdd()](#storeupdateoradd)
**version:**      *> 0.2.0*

**Met un objet à jour avec les propriétés fournies ou en crée un nouveau s'il n'existe pas.**

```javascript
hoodie.store.updateOrAdd(type, id, updateObject, options);
```

| option         | type    | description              | obligatoire |
|:-------------- |:------- |:------------------------ |:----------- |
| type           | String  | type de l'objet          | oui         |
| id             | String  | id de l'objet cible      | oui         |
| updateObject   | Object  | nouvelles valeurs        | oui         |
| options.silent | Boolean | Si à **true**, aucun événement ne sera déclenché par cet appel | non (défaut: false) |

Comme pour **store.findOrAdd()**, ceci est utile si vous ne savez pas si l'objet cible existe déjà et que vous ne voulez pas gérer la vérification auparavant.

Retourne une promise. Si l'opération se déroule correctement, appelle le callback **done** avec l'objet mis à jour ou nouvellement stocké avec les valeurs mises à jour ou ajoutées, ainsi que (*id*, *createdBy*, *createdAt*, *updatedAt*). Si quelque-chose se passe mal, le callback **fail** est appelé avec l'erreur correspondante.

Vous pouvez, techniquement, passer une fonction à la place d'**updateObject**, et ça fonctionnera de la même manière que pour **store.update()** et **store.updateAll()**, *mais seulement si l'objet avec l'id spécifié existe*. S'il n'existe pas, vous générerez un objet vide et inutilisable, parce que votre fonction de mise à jour n'a rien pour travailler, et ne peut donc rien retourner.

#### Exemple

```javascript
hoodie.store.updateOrAdd('userconfig', 'config', {
    language: 'de/de'
  })
  .done(function(configObject) {
  	console.log('Config saved: ', configObject);
  })
  .fail(function(error) {
    console.log('An error occurred: ', error);
  });
```

<a id="storeupdateall"></a>
### [store.updateAll()](#storeupdateall)
**version:**      *> 0.2.0*

**Met à jour tous les objets d'un même type à la fois**

```javascript
hoodie.store.updateAll(type, updateObject, options);
```

| option            | type    | description             | obligatoire |
|:----------------- |:------- |:----------------------- |:----------- |
| type              | String  | type de l'objet         | oui         |
| changedProperties | Object  | new object values       | non*        |
| updateFunction    | String  | callback qui sera appelé pour les propriétés actuelles. Doit retourner un objet | non*  |
| options.silent    | Boolean | Si à **true**, aucun événement ne sera déclenché par cet appel | non (défaut: false) |

__*__ Le second paramètre est obligatoire, mais il peut être soit **changedProperties**, qui est un objet contenant les propriétés modifiées, soit **updateFonction**, qui est une fonction qui reçoit, modifie et retourne l'objet.

#### Exemple

Marquer toutes les tâches comme terminées

```javascript
hoodie.store.updateAll('todo', {
    done: true
  })
  .done(function(allTodos) {
  	console.log('Marked all todos as done', allTodos);
  });
```

<a id="storeremove"></a>
### [store.remove()](#storeremove)
**version:**      *> 0.2.0*

**Retire un seul objet du dépôt**

```javascript
hoodie.store.remove(type, id, options);
```

| option         | type    | description              | obligatoire |
|:-------------- |:------- |:------------------------ |:----------- |
| type           | String  | type de l'objet          | oui         |
| id             | String  | id de l'objet cible      | oui         |
| options.silent | Boolean | Si à **true**, aucun événement ne sera déclenché par cet appel | non (défaut: false) |

Retourne une promise. Quand l'opération se déroule avec succès, l'objet retiré est passé au callback **done**. Dans le cas contraire, le callback **fail** est appelé.

#### Exemple

```javascript
hoodie.store.remove('todo', 'abc456')
	.done(function(removedTodo) {})
	.fail(function(error) {});
```

<a id="storeremoveall"></a>
### [store.removeAll()](#storeremoveall)
**version:**      *> 0.2.0*

**Supprime tous les objets du *type* spécifié du dépôt de l'utilisateur.**

```javascript
hoodie.store.removeAll(type, options);
```

| option         | type    | description              | obligatoire |
|:-------------- |:------- |:------------------------ |:----------- |
| type           | String  | type de l'objet          | oui         |
| options.silent | Boolean | Si à **true**, aucun événement ne sera déclenché par cet appel | non (défaut: false) |

Retourne une promise. Quand l'opération se déroule avec succès, les objets retirés sont passés au callback **done**.dans le cas contraire, le callback **fail** est appelé.

#### Exemple
```javascript
hoodie.store.removeAll('todo')
  .done(function(removedTodos) {})
  .fail(function(error) {})
```

<a id="storeon"></a>
### [store.on()](#storeon)
**version:**      *> 0.2.0*

**Ajoute un callback sur les événements de dépôt.**

```javascript
hoodie.store.on(event, handler);
```

| option  | type     | description        | obligatoire |
|:------- |:-------- |:------------------ |:----------- |
| event   | String   | nom de l'événement | oui         |
| handler | Function | Fonction qui sera appelée lorsque l'événement passé surviendra dans le dépôt | oui |

Pas de retour défini.

Vous permet d'attacher un processus d'écoute à un dépôt, afin que votre interface puisse réagir aux données qui changent. C'est très important pour construire des frontend correctement découplés, [comme expliqué ici](/fr/tutorials/#updating-the-view), ce qui offrira les bénéfices complets du mode déconnecté et de la synchronisation inter-appareils de Hoodie.

**Important:** si vous ne l'avez pas déjà fait, allez lire le [guide général sur les événements Hoodie et leur syntaxe de nommage](/fr/techdocs/api/client/hoodie.html#on) pour bien comprendre comment les événements sont gérés. Cette page décrit les méthodes [one()](/fr/techdocs/api/client/hoodie.html#one) et [off()](/fr/techdocs/api/client/hoodie.html#off) pour attacher un gestionnaire une fois ou détacher tous les gestionnaires.

#### Exemple

Montrer une notification différente selon qu'une nouvelle note ou une nouvelle tâche sont ajoutées:

```javascript
hoodie.store.on('add', function(newObject) {
  if (newObject.type === 'todo') {
    showNewTodoAddedNotification();
  }
  if (newObject.type === 'note') {
    showNewNoteAddedNotification();
  }
});
```

Vous pouvez aussi gérer ce cas avec des gestionnaires plus précis, un pour chaque **type**:

```javascript
hoodie.store.on('todo:add', showNewTodoAddedNotification);
hoodie.store.on('note:add', showNewNoteAddedNotification);
```

<a id="store"></a>
### [store()](#store)
**version:**      *> 0.2.0*

**Crée une instance de "*dépôt ciblé*" par *type*, ou par *type* et par *id*.**

```javascript
hoodie.store(type, id);
```

| option         | type    | description               | obligatoire |
|:-------------- |:------- |:------------------------- |:----------- |
| type           | String  | type de l'objet           | oui         |
| id             | String  | id de l'objet du stockage | Non         |

Il est plus que probable que votre application ait plus d'un type dans son dépôt, et à un moment donné vous voudrez arrêter de spécifier les types constamment. Les **dépôts ciblé** fournissent un raccourci pratique aux méthodes **hoodie.store**, pré-configuré avec le **type** spécifique d'objet ou même un objet en particulier (quand vous passez un **id**).

Ceci veut dire que vous pouvez utiliser les méthodes **hoodie.store** directement sur les objets créés avec **hoodie.store()**.


#### Exemple

Typiquement vous feriez quelque-chose comme ça pour votre application de gestion de tâche:

```javascript
hoodie.store.add('todo', { title: 'Getting Coffee' })
.done(function () {
  hoodie.store.findAll('todo')
  .done(function(allTodos) { /* … */ })
})
```

L'exemple suivant utilise un dépôt ciblé: notez que nous avons omis le paramètre *type* dans les appels à **add()** et **findAll()**, car ils sont implicites: le dépôt est ciblé sur le type **todo**, il ne s'y trouve que des objets de ce type.

```javascript
var todoStore = hoodie.store('todo');

todoStore.add({ title: 'Getting Coffee' })
.done(function(){
  todoStore.findAll()
  .done(function(allTodos) { /* … */ });
})
```

Les bénéfices de cette variante ne sont pas super évidents à première vue, mais en dehors d'être plus concis et de ne pas vous répéter, ils sont aussi moins sujets aux erreurs: imaginez vous tromper de **type** avec une fonction **add()**, et ajouter un tas de **todoo** par accident. Votre application continuerait à sauver des **todoo** sans erreur, mais ils n'apparaitraient pas dans l'interface, puisque votre gestionnaire **on()** n'écoutent que le type correctement écrit. Vous supposeriez probablement que quelque-chose ne va pas avec le code d'affichage et iriez chasser le bug au mauvais endroit.

Comme mentionné, vous pouvez aussi avoir un dépôt ciblé sur un seul objet, comme ceci:

```javascript
var userConfig = hoodie.store( 'userConfig', 'config' );
```

**Important:** dans un appel comme celui-ci, seul un sous-ensemble minimum de fonctions sera disponible sur le contexte ainsi créé. Vous ne serez pas capable d'appeller toute méthode dont l'objet est de travailler sur plus d'un objet stocké (i.e. **findAll()**). Parce que ça n'aurait pas de sens.

## Evénements de stockage

**Important:** si vous ne l'avez déjà fait, allez lire le [guide général sur les événements Hoodie et leur syntaxe de nommage](/fr/techdocs/api/client/hoodie.html#on) pour mieux comprendre comment les événements sont gérés.

<a id="add"></a>
### [add](#add)
**version:**      *> 0.2.0*

**Est déclenché quand un nouvel objet est ajouté au dépôt.**

```javascript
hoodie.store.on('add', function(newObject) {});
```

L'événement **add** est déclenché pour tout objet qui est ajouté au dépôt utilisateur. Si vous voulez réagir à de nouveaux objets d'un certain **type** seulement, vous pouvez préfixé l'identifiant de l'événement avec **type:add**, comme ceci:

```javascript
hoodie.store.on('todo:add', function(newTodoObject) {});
```
<a id="update"></a>
### [update](#update)
**version:**      *> 0.2.0*

**Est déclenché quand un objet existant est mis à jour.**

```javascript
hoodie.store.on('update',
    function(updatedObject){});
```

L'événement **update** est déclenché pour tout objet qui est mis à jour dans le dépôt utilisateur. Si vous voulez réagir à un certain **type** seulement, vous pouvez préfixer l'identifiant d'événement avec **type:update**:

```javascript
hoodie.store.on('todo:update',
    function(updatedTodoObject) {});
```

Si vous êtes intéressé par les mises à jour d'un objet spécifique, vous pouvez spécifier un identifiant d'événement avec un id d'objet, comme ceci:

```javascript
// config is the type, userconfig is the id
hoodie.store.on('config:userconfig:update',
  function(updatedUserConfig) {});
```
Ceci écoute les changements sur un seul objet ayant pour id **userconfig**, ainsi quand l'utilisateur change sa police pour Comic Sans, vous pouvez réagir immédiatement(...).


<a id="remove"></a>
### [remove](#remove)
**version:**      *> 0.2.0*

**Est déclenché quand un objet existant est supprimé.**

```javascript
hoodie.store.on('remove',
  function(removedObject){});
```

L'événement **remove** est déclenché pour tout objet qui est retiré du dépôt utilisateur. Si vous voulez réagir à des objets d'un certain type seulement, vous pouvez préfixer l'identifiant de l'événement avec **type:remove**, comme ceci:

```javascript
hoodie.store.on('todo:remove',
  function(removedTodoObject) {});
```

Si vous êtes intéressé par la suppression d'un objet spécifique, vous pouvez passer l'id de l'objet à l'identifiant d'événement:

```javascript
// config is the type, userconfig is the id
hoodie.store.on('config:userconfig:remove',
  function(removedUserConfig) {});
```

<a id="change"></a>
### [change](#change)
**version:**      *> 0.2.0*

**Est déclenché quand un objet existant a été modifié.**

```javascript
hoodie.store.on('change',
  function(eventName, changedObject){});
```

L'événement **change** est déclenché pour tout objet qui est **changé** dans le dépôt utilisateur. L'**eventName**, passé comme premier paramètre au gestionnaire, est **add**, **update** ou **remove**. Si vous voulez réagir à des objets d'un certain type seulement, vous pouvez préfixer l'identifiant de l'événement avec **type:change**:

```javascript
hoodie.store.on('todo:change',
  function(eventName, changedTodoObject) {});
```

Si vous êtes intéressé par un objet spécifique, vous pouvez aussi préfixer l'identifiant de l'événement avec **type:id:change**:

```javascript
// config is the type, userconfig is the id
hoodie.store.on('config:userconfig:change',
  function(eventName, removedUserConfig) {});
```

<a id="clear"></a>
### [clear](#clear)
**version:**      *> 0.2.0*

**est déclenché quand le dépôt local est nettoyé entièrement.**

```javascript
hoodie.store.on('clear', function(){});
```

L'événement **clear** est déclenché quand un utilisateur se déconnecte, ou quand **hoodie.account.destroy()** est appelé. Il est aussi déclenché quand un utilisateur se connecte pour supprimer tout objet existant avant de charger les objets depuis le compte de l'utilisateur.

Notez qu'aucun événement **remove** n'est déclenché quand le dépôt est nettoyé, car les objets ne sont pas forcément supprimés du compte de l'utilisateur, juste du cache local.

## Plus avant

Excellent, vous êtes arrivé à la fin de la documentation du coeur. La prochaine étape logique serait de [découvrir les plugins Hoodie](/fr/plugins/). Amusez-vous bien!

Nous espérons que ce guide API vous a aidé. Sinon, laissez-nous vous aider <a href="http://hood.ie/chat" target="_blank">sur IRC ou Slack</a>.

Nous avons aussi une <a href="http://faq.hood.ie" target="_blank">FAQ</a> qui pourrait se révéler utile si les choses se passent mal.

Si vous trouvez des erreurs dans ce guide ou qu'il est dépassé, vous pouvez aussi <a href="https://github.com/hoodiehq/documentation/issues" target="_blank">ouvrir un ticket</a> ou soumettre une pull request avec vos corrections à <a href="https://github.com/hoodiehq/documentation/blob/gh-pages/fr/techdocs/api/client/hoodie.store.md" target="_blank">ce fichier</a>.
