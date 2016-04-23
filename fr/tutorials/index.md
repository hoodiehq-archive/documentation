---
layout: layout-tutorials
locales: fr
---

# Démarrer avec Hoodie - Partie 2

Ce guide va détailler le code dans l'application Hoodie par défaut, puis vous modifierez un peu le code pour ajouter de nouvelles fonctionnalités. De là, vous aurez une bonne idée de comment Hoodie fonctionne, ainsi qu'un bon point de départ pour explorer les [docs](/fr/techdocs/), les autres [tutoriels](/fr/tutorials/), ou simplement continuer à construire l'application.

Si vous éprouvez des difficultés à quelque étape que ce soit de cette doc, merci de consulter notre <a href="http://faq.hood.ie" target="_blank">FAQ</a> ou <a href="http://hood.ie/chat" target="_blank">de nous joindre sur IRC ou Slack</a>.

### Pré-requis

Vous devriez avoir [installé Hoodie et ses pré-requis](/fr/start/) et avoir lu [la première partie de ce guide](/fr/start/getting-started/getting-started-1.md). Nous partirons de l'application Hoodie que vous y avez créé.

Au cas où vous auriez sauté cette étape, voici le résumé ultra-court sur comment créer une nouvelle application Hoodie et la lancer:

```bash
$ hoodie new hoodietut
$ cd hoodietut
$ hoodie start
```
Ceci devrait ouvrir l'application Hoodie par défaut dans votre navigateur.

### 1. Fonctionnalité de l'application Hoodie par défaut

Il s'agit d'un simple application de liste de choses à faire conçue pour vous montrer certaines des bases de Hoodie. Elle est construite avec jQuery et Bootstrap afin d'être rapide et simple. Vous pouvez vous enregistrer, vous connecter, ajouter des nouvelles entrées dans votre liste et les marquer comme terminées.

#### 1.1 Connexion / utilisation anonyme

En haut à droite se trouve une drop down pour **s'enregistrer**. Cliquez dessus et créez un compte avec l'identifiant et le mot de passe que vous souhaitez. Vous êtes ensuite connectés automatiquement, et désormais vos tâches seront sauvegardées dans la base de donnée. Si vous vous connectez depuis un navigateur différent, vos tâches apparaîtront là aussi.

Si vous utilisez l'application *sans* vous êtes enregistré et/ou connecté, vous êtes un **utilisateur anonyme**. Vos tâches sont alors conservées en local, dans votre navigateur et s'y trouveront encore quand vous rechargerez la page, cependant elles ne seront pas sauvegardées sur le serveur et vous ne serez pas en mesure de les voir ailleurs. De plus, elles disparaîtront si vous videz le dépôt local de votre navigateur.

Vous pouvez utiliser une application Hoodie en tant qu'utilisateur anonyme pour commencer, et une fois que vous vous serez enregistré, vos données seront automatiquement déplacées dans votre compte nouvellement créé et synchronisées.

Allez-y, ajoutez quelques tâches!

#### 1.2 Synchronisation

Une fois que vous êtes enregistré dans une application Hoodie, **Hoodie va tenter de maintenir vos données synchronisées en continu** entre le serveur et chaque client sur lequel vous vous seriez connecté. Pour observer ceci, ouvrez l'application dans un navigateur différent, ou en mode incognito ou privé (pour ne pas être connecté automatiquement). Connectez-vous dans cette nouvelle instance de l'application avec les mêmes identifiants et quand vous ajouterez une tâche dans un des onglets, elle apparaîtra dans l'autre en quelques secondes. Laissez le second onglet ouvert pour le moment.

#### 1.3 Support du "déconnecté"

[Nous croyons fermement que les applications ne devrait pas casser parce que vous êtes déconnecté](/fr/hoodieverse/hoodie-concepts.html#offline-first). Naturellement, cette application fonctionne déconnectée. Essayez:

Dans le terminal, arrêter le serveur Hoodie avec **ctrl+c** (Mac/Linux) ou **alt+c** (Windows).

Dans l'un de vos deux onglets, ajoutez quelques tâches. Vous noterez deux choses:
 
1. Vous pouvez ajoutez des nouvelles tâches malgré le serveur arrêté. Pas de messages d'erreur! Ca fonctionne juste. Youpi!
2. Si vous regardez l'autre onglet, les nouvelles tâches n'apparaissent pas. Elles ne peuvent pas, puisque toute la synchronisation se fait via le serveur, que vous venez d'arrêter. Pas top. Mais juste pour le coup, ajoutez ici aussi quelques tâches.

Et maintenant, redémarrons le serveur (l'option **-n** évite qu'un nouveau navigateur ne soit ouvert):

```bash
$ hoodie start -n
```
**Maintenant observez les deux onglets**: ils devraient se synchroniser avec le serveur, et les deux devraient afficher toutes les tâches que vous avez ajouté pendant que vous étiez déconnecté.
Plutôt sympa, non?

**Les application Hoodie sont super robustes même sur de mauvais réseaux**, et vous gagnez deux bonus sur l'expérience utilisateur:
 
1. Pas de message d'erreur frustrant quand vous passez en déconnecté durant l'utilisation
2. Vos utilisateurs peuvent toujours accéder à leurs propres données, même déconnectés.

Le code pour faire fonctionner tout ça doit être super complexe, non? Vous serez surpris…

### 2. Le Code

Jetons un coup d'oeil à comment l'application utilise Hoodie. Ouvrez 

```bash
www/assets/js/main.js
```

dans l'éditeur de votre choix.

Tout en haut, nous **initialisons Hoodie** et l'assignons à une variable, afin de pouvoir appeler ses méthodes:

```javascript
var hoodie  = new Hoodie();
```

#### 2.1 Ajouter un nouveau projet "Todo"

Maintenant descendez jusqu'à la fin du fichier, où nous **gérons l'ajout d'une nouvelle tâche** au dépôt de Hoodie. Ce code sauve la tâche dans la [petite base privée](/fr/hoodieverse/glossary.html#private-user-store) de l'utilisateur connecté. Elle sera synchronisée avec le serveur et sera ensuite resynchronisée à chaque fois que l'utilisateur se reconnecte à l'application.

```javascript
$('#todoinput').on('keypress', function(event) {
  if (event.keyCode === 13 && event.target.value.length) {
    hoodie.store.add('todo', {title: event.target.value});
    event.target.value = '';
  }
});
```

C'est à l'intérieur du "if" que se trouve l'action: nous appelons la méthode **store.add()** de Hoodie et lui passons deux valeurs:


1. **Le type**  de l'objet que nous ajoutons au dépôt. Le type est une chaîne arbitraire, dans ce cas **todo**.
2. **L'objet lui-même**. C'est un objet Javascript arbitraire, avec clefs et valeurs. Ici, il n'a qu'une clef, **title**, qui contient le texte de tâche en question.

Et c'est à peu près tout.

```javascript
hoodie.store.add(type, object);
```

Une ligne. Ceci stocke la tâche dans le dépôt local du navigateur, et Hoodie se charge de la synchroniser partout où elle doit se retrouver. Plutôt simple, non? **add()** retourne aussi [des promises](/fr/techdocs/api/client/hoodie.store.html#storeadd) afin que vous puissiez vérifier que ça a fonctionné, mais laissons ça de côté pour l'instant.

<a id="understanding-type"></a>
#### 2.2 Un petit aparté: comprendre le type

Le **type** est une convention fondamentale pour gérer l'absence de schémas dans CouchDB, qui est le système de base de donnée que Hoodie utilise.

Dans CouchDB, la même base de donnée contient une grande variété d'enregistrement différent, donc aucun n'est défini à l'avance. Par exemple, vous pouvez avoir des enregistrements de personnes et de lieux. L'attribut de type est utilisé pour les distinguer ces… et bien, ces *types* d'enregistrement entre eux. Voici quelques-uns des objets (abrégés et fictifs) que Hoodie pourrait écrire dans CouchDB:

```javascript
{
    type: 'person',
    name: 'Hans Hansson',
    spirit_animal: 'Otter'
}

{
    type: 'location',
    name: 'Berlin',
    is_often_quite_windy: true
}
```

Vous noterez qu'il s'agit juste, encore une fois, d'objets JavaScript. Dans toute votre application Hoodie, toutes les données sont toujours de simples objets JavaScript. Mais revenons au type:


Le **type est essentiel pour donner une structure à vos données sans schéma**, afin que quand vous récupérez des lieux, par exemple, vous puissiez le faire facilement.

<a id="updating-the-view"></a>
#### 2.3 Mettre la Vue à jour

Jusqu'ici, nous n'avons vu que comment l'application *stock* la nouvelle tâche après qu'elle ait été saisie, mais pas comment elle était effectivement *affichée*. Jetez un oeil au code juste au dessus du gestionnaire d'événement que nous venons de regarder, vers la fin de **main.js**:

```javascript
// when a todo changes, update the UI.
hoodie.store.on('todo:add', todos.add);
hoodie.store.on('todo:update', todos.update);
hoodie.store.on('todo:remove', todos.remove);
```

Qu'est-ce qui se passe ici? Nous écoutons des événements émis par le dépôt Hoodie. Regardez le premier: **todo:add**. Il se déclenche à chaque fois qu'un nouvelle objet de type *todo* est ajouté. Les autres devraient être évidents maintenant. Quand un gestionnaire d'événement se déclenche, il appelle la méthode qui met le modèle à jour (un tableau d'objet appelé **collection**) puis la vue. *Il n'y pas a pas de connexion directe entre l'entrée de la tâche et la liste des tâches*.

Nous avons donc proprement découplé *ajouter* une tâche et *afficher* une nouvelle tâche, et ceci nous offre la fonction de synchronisation avancée que nous avons vu précédemment, *gratuitement*. **Il n'y a pas de code supplémentaire pour faire fonctionner la synchronisation**. Quand une nouvelle tâche arrive dans le dépôt du navigateur, l'événement **todo:add** se déclenche, et la vue se met à jour. Avec ce code, vous n'avez pas besoin de vous inquiéter *d'où* la tâche provient (du client actuel, ou de celui dans un autre onglet, ou de celui sur un téléphone), l'application les gère de la même manière.

Nous vous suggérons fortement d'utiliser cette structure découplée dans vos propres applications. C'est ce qui fait la puissance de Hoodie!

### 3. Modification de l'application

Dans les quelques prochaines étapes notre application va être modifiée pour donner aux tâches une priorité parmi **urgent**, **normal** ou **later** (NdT: "plus tard").

#### 3.1 Ajouter un bouton d'ajout

L'application vous laisse entrer de nouvelles tâches et les sauvegarder en tapant la touche entrée. Ca fonctionne bien pour une seule entrée, mais comme nous allons ajouter un nouveau champ pour la priorité de la tâche, un bouton "Submit" va être plus approprié.

Premièrement, ajoutez le bouton au fichier **www/index.html**. Cherchez le champ texte avec l'id **todoinput**. Sur la ligne qui suit ajoutez le bouton avec un id **add-todo**:

```markup
<button id="add-todo">Add New Todo</button>
```

Deuxièmement, changer le fichier **main.js** pour que notre nouvelle tâche soit ajoutée quand le bouton est cliqué plutôt que quand la touche "entrée" est pressée. Remplacer le dernier block de code de fichier avec ceci:

```javascript
// gère la création d'une nouvelle tâche
$('#add-todo').on('click', function() {
  hoodie.store.add('todo', {title: $("#todoinput").val()});
  $("#todoinput").val('');
});
```

La première ligne fait l'association au clic sur le bouton nouvellement créé. Quand le bouton est cliqué, la seconde ligne ajoute la nouvelle tâche en utilisant la méthode **hoodie.store.add**. La troisième ligne au sein de la nouvelle fonction vide les champs.

Enregistrez les deux fichiers et rafraîchissez votre navigateur. Entrez une nouvelle tâche. Vous devriez la voir remonter après avoir cliqué sur le bouton **Add New Todo**.

Maintenant nous sommes prêts à changer l'interface et le modèle de données.

#### 3.2. Ajouter la priorité

Ajouter la priorité demande un nouvel élément "input". Insérez-le juste au dessus du nouveau bouton que nous avons ajouté à **www/index.html**:


```markup
<select id="priorityinput" class="form-control">
  &lt;option>Urgent&lt;/option>
  &lt;option selected="selected">Normal&lt;/option>
  &lt;option>Later&lt;/option>
&lt;/select>
&lt;button id="add-todo">Add&lt;/button>
```

Maintenant modifiez la méthode click dans **main.js** pour stocker la priorité:

```javascript
// gère la création d'une nouvelle tâche
$('#add-todo').on('click', function() {
  hoodie.store.add('todo', {
    title: $("#todoinput").val(),
    priority: $("#priorityinput").val()
  });
  $("#todoinput").val('');
});
```

Dans le même fichier, modifiez la fonction **paint()** pour afficher la priorité:

Changez

```javascript
+ collection[i].title +
```

en

```javascript
+ collection[i].priority + ': ' + collection[i].title +
```

Sauvegardez le tout et essayez!

A ce stade vous devriez commencer à voir que chaque *nouvelle* tâche est préfacée de sa priorité. Parce que la base n'a pas de schéma, **il est super simple d'ajouter de nouveaux attributs aux objets dans Hoodie** sans avoir à penser à la base de donnée ou à la structure des données.

Cependant, si vous n'avez pas marqué toutes les tâches que vous aviez créées avant d'ajouter la priorité, elles seront désormais rendues avec "undefined:" à la place de la priorité. Pas cool. C'est le revers de la médaille pour pouvoir changer la structure de donnée à la volée. Dans une base traditionnelle, vous devriez réaliser une migration du modèle de donnée et ajouter la priorité **normal** pour toutes les tâches qui n'en ont pas déjà une. Mais comme nous utilisons un système qui distribue des copies de chaque base utilisateur sur un certain nombre d'appareils, *nous ne pouvons pas faire ça*. Nous ne savons même pas combien de base de données il y a, ou même où elles se trouvent.   

La solution à ce problème est de construire une vue robuste qui gère simplement les champs manquants:

```javascript
var todo = collection[i];
todo.priority = todo.priority || 'Normal';

var $li = $('<li>' +
                 '<input type="checkbox">' +
                    '<label></label>' +
                 '</input>' +
                 '<input type="text"></input>' +
            '</li>'
            );


var label = todo.priority + ': ' + todo.title;

$li.data('id', todo.id);
$li.find('label').text(label);
$li.find('input[type="text"]').val(label);

$el.append($li);
```

Si vous en êtes encore à la phase de prototype/test et que vous souhaitez démarrer avec une base de donnée fraîche, vous pouvez aussi arrêter le serveur, supprimer le répertoire **data** à la racine du projet, redémarrer le serveur et vous réenregistrer sur l'application.

### 4. Conclusion

Nous n'avons abordé que brièvement **hoodie.store.add** et **hoodie.store.on**, mais ceci a déjà dû vous donner une bonne idée de comment Hoodie fonctionne, et comment votre application est structurée. Vous avez aussi constaté que Hoodie se charge de la synchronisation inter-appareil et du support déconnecté. Vous savez maintenant comme les utilisateurs fonctionne, et si vous passez un peu plus de temps dans **main.js**, vous tomberez sur [hoodie.store.findAll](/en/techdocs/api/client/hoodie.store.html#storefindall) et apprendrez aussi comment récupérer les données depuis Hoodie.

Si vous voulez essayer un autre tutoriel, allez voir [la gestion de temps](../tutorials/timetracker.html).

#### Comment ça s'est passé?

Nous aimerions avoir votre ressenti sur ce guide, et s'il vous a aidé. N'hésitez pas à <a href="http://hood.ie/chat" target="_blank">nous contacter via IRC ou Slack</a>.

Vous avez aussi une <a href="http://faq.hood.ie" target="_blank">FAQ</a> qui pourrait se révéler utile si les choses se passent mal.

Si ce guide comporte des erreurs ou est dépassé, vous pouvez aussi <a href="https://github.com/hoodiehq/documentation/issues" target="_blank">ouvrir un ticket</a> ou soumettre une "pull request" avec vos corrections sur <a href="https://github.com/hoodiehq/documentation/blob/gh-pages/fr/tutorials/index.md" target="_blank">ce fichier</a>.

Merci de votre intérêt et de votre temps!

Et voici votre poulet de félicitations:

![Cooooot cot cot cot](/src/img/doc-doc-chicken.png)
