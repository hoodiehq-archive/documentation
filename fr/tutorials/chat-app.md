---
layout: layout-tutorials
locales: fr
---

# Tutoriel - Comment construire une application de Chat avec Hoodie

*Un tutoriel décrivant comment construire une application de Chat avec Hoodie.*

**TL;DR [Le dépôt git](https://github.com/hoodiehq/hoodie-template-app-chat)**

Si vous êtes arrivés aussi loin dans la documentation, vous devriez avoir Hoodie et ses dépendances installés et savoir que Hoodie est un outil puissant pour faire des applications simplement fantastiques. En exploitant le très complet [système de plugin Hoodie](/fr/plugins/), utilisant les plugins comme [Global-Share](/fr/techdocs/api/plugins/hoodie.plugin.global.share.html), cette application peut devenir encore meilleure.

Nous commencerons par utiliser [Hoodie Skeleton](https://github.com/hoodiehq/hoodie-app-skeleton) pour démarrer le projet, un modèle de projet Hoodie qui contient jQuery, un système de login simple et des styles initiaux. Nous appellerons notre projet Hoodie Chat.

```bash
$ hoodie new HoodieChat -t "hoodiehq/hoodie-app-skeleton"
$ cd HoodieChat
```
 
Ouvrez Hoodie Chat avec votre éditeur de texte ou IDE préféré, et nous allons commencer par utiliser un kit CSS appelé Basscss pour rendre la mise au point du style de notre l'application un peu plus aisé. Vous pouvez récupérer une copie de la bibliothèque [ici](http://www.basscss.com/docs/) en cliquant sur le bouton Download Source, en ouvrant le répertoire téléchargé et en récupérant la source minifiée (basscss.min.css) dans le répertoire css. Placez ce fichier dans le répertoire css de votre projet sous **www/assets/css** et liez-le dans le fichier **index.html** du répertoire **www/**.  

```html
<link rel="stylesheet" href="assets/css/basscss.min.css">
```

Ensuite, nous allons installer le plugin Hoodie Global Share en utilisant l'outil en ligne de commande Hoodie.

```bash
$ hoodie install global-share
```

Toutes méthode supplémentaire ajoutée par le plugin à **hoodie.js** est automatiquement jointe sans avoir à lier un nouveau script dans **index.html**. Vous pouvez trouver plus d'information sur comment fonctionnent les plugins Hoodie [ici](/fr/plugins/tutorial.html).

Faisons quelques modifications à notre fichier **index.html** pour répondre à nos besoins de structure, en commençant par une barre pour le compte utilisateur: 

```html
<!-- ajoute de l'espace supplémentaire et des styles de layout à la zone du compte -->
<section id="account" class="mt2 flex flex-right flex-center">

  <!-- créer la div de l'avatar de l'utilisateur à côté de son nom -->
  <div class="user-avatar relative">

    <!-- la source par défaut de l'img pointe vers une url placekitten url parce que c'est marrant, n'oubliez pas les classes de style supplémentaires -->
    <img src="http://placekitten.com/g/50/50" data-avatar="currentUser" width="50px" height="50px" class="mr1 rounded relative" alt="your avatar"/>

  </div>

  <!-- ajout de la classe m0 au paragraphe -->
  <p class="m0">Hello <span id="userName"></span>!</p>
  <button id="signOut">Sign out</button>
</section>
```

Maintenant passons à la section de class "content":  

```html
<header>

  <!-- Mettre le nom de notre application en h1 et un sous-titre amusant en h3 -->
  <h1>Hoodie Chat</h1>
  <h3>The perfect way to converse with Hoodie's, worldwide.</h3>

</header>

<section>
  
  <!-- créer une div qui va contenir le flux de message et les notifications au fur et à mesure qu'ils sont créés -->
  <div class="border overflow-scroll chat-stream-container" data-action="chat-stream"></div>

  <!-- créer un formulaire pour que l'utilisateur puisse soumettre ses messages -->
  <form data-action="chat-input">
    <div class="mt2 mb1">
      <label for="message-input">Send a message!</label>
      <textarea id="message-input" class="block full-width my1 field-light not-rounded no-resize" rows="1" placeholder="Type message here..." data-action="send-message"></textarea>
    </div>
    <input class="button bg-teal full-width" type="submit" value="Send Message">
  </form>

</section>
```

Avant de commencer le JavaScript, nous allons ajouter du CSS à notre fichier **www/assets/main.css**:

```css
.no-resize { resize: none; }

.flex-right { 
  -webkit-justify-content: flex-end; 
  -moz-justify-content: flex-end; 
  -ms-justify-content: flex-end; 
  justify-content: flex-end; 
}

.user-avatar::before {
  color: black;
  content: "Click to change avatar ->";
  display: inline-block;
  font-size: 1rem;
  height: 1rem;
  opacity: 0;
  position: absolute;
  right: 130%;
  transition: opacity 0.3s ease-out;
  top: 25%;
  width: 300%;
}

.user-avatar:hover::before {
  opacity: 1;
}

.user-avatar:hover {
  cursor: pointer;
}

.input-container {
  z-index: 21;
}

.chat-stream-container {
  height: 20rem;
}
```
Maintenant nous pouvons enfin ouvrir **www/assets/js/main.js** et commencer à ajouter des fonctionnalités à notre petite application de chat. Ce fichier devrait déjà contenir une ligne nécessaire à l'initialisation de la classe Hoodie:

```js 
// initialize Hoodie
var hoodie = new Hoodie();
```

De là, nous pouvez créer les dépôts dédiés pour sauver et retrouver plus facilement les messages et avatars:

```js
// create a scoped 'message' store for easier re-use
var messageStore = hoodie.store('message');

// create a scoped 'avatar' store for easier re-use
var avatarStore = hoodie.store('avatar');
```

Une autre partie de la mise en place de notre application sera de sélectionner tous les éléments de DOM avec lesquels nous allons interagir pour faire fonctionner l'application en utilisant l'attribut custom **data-action** que nous leur avons donné plus tôt:

```js
// sélectionne le formulaire de chat
var chatForm = $('[data-action="chat-input"]');

// sélectionne la zone de texte du formulaire de chat
var chatBox = $('[data-action="send-message"]');

// sélection la zone de flux de chat
var chatStream = $('[data-action="chat-stream"]');
```

Pour ce qui est de l'interaction avec le DOM, nous commençons par écouter les événements **submit** de **chatForm** et envoyons un message à notre dépôt de message quand cela arrive:

```js
// Configure un gestionnaires d'événement sur le formulaire de chat
chatForm.on('submit', sendMessage);

// Crée la fonction sendMessage
function sendMessage(e) {
  e.preventDefault();

  // vérifie le contenu de chatBox,
  // s'il y a du contenu,
  // alors l'assigner à une nouvelle variable
  // sinon, retourner false et annuler la fonction
  var messageContent = chatBox.val().trim();

  if ( messageContent.length < 1 ) { return false; }

  // créer un nouveau modèle de message, la fonction messageModel sera définit après sendMessage
  var message = new messageModel(messageContent);

  // en utilisateur le messageStore global, ajouter cet objet message et le publier vers le dépôt global.
  messageStore.add(message).publish();

  // déclencher immédiatement une synchronisation serveur pour des mises à jour plus rapides
  hoodie.remote.push();

  // Ne pas oublier de nettoyer chatBox
  chatBox.val('');
}
```

Vous avez peut-être remarqué le **new messageModel(messageContent)**, nous définissons ce **messageModel** juste après avoir définie la fonction **sendMessage**, afin d'abstraire la logique de création de l'objet message que nous sauvegardons dans **messageStore**:

```js 
// create a message model for re-use later
function messageModel(message) {
  var user = hoodie.account.username;
  var postDate = new Date();

  return {
    'user': user,
    'date': postDate,
    'message': message
  };
}
```

Nous devrions pouvoir aussi envoyer un message sans cliquer sur le bouton "submit" du formulaire, aussi ajoutons la fonctionnalité d'envoi de message si l'utilisateur appuie sur les touches **CMD/Ctrl** et **Entrée** quand chatBox est active:

```js
// Met le gestionnaire de keydown en place pour l'envoi de message via CMD/Ctrl + Enter
chatBox.on('keydown', checkSubmit);

function checkSubmit(e) {
  // Si CMD/Ctrl et Entrée sont appuyées, envoi le message vers le dépôt
  if ( (e.metaKey ||e.ctrlKey) && e.keyCode === 13) {
    sendMessage(e);
  }
}
```

Nous avons donc envoyé le message dans messageStore, mais comment apparaît-il dans le flux de chat? Nous allons écouter sur le dépôt global les messages qui sont ajoutés, et nous les poussons dans le flux:

```js
// Met le gestionnaire d'événement en place pour les nouveaux messages sauvés dans Hoodie
hoodie.global.on('add', streamMessage);

// ajout les messages nouvellement ajoutés dans le flux
function streamMessage(message) {
  // si le message contient une notification, on l'ajoute au flux plutôt que le message lui-même
  if(message.notification) { return streamNotification(message); }

  // une rapide validation pour s'assurer que ce sont les messages que nous cherchons
  if (message.type !== 'message') { return; }

  var date = new Date(message.date);

  // si le message est pour l'utilisateur actuel, on lui donne une couleur de fond différente des autres messages
  var bgColor = message.user === hoodie.account.username ? "bg-silver" : "bg-white";
  
  // On créer un template pour stocker le contenu du message
  var messageTemplate = $('<div class="p1 '+bgColor+' flex flex-stretch"></div>');
  var messageAvatar = $('<aside class="flex flex-stretch rounded overflow-hidden mr2"><img src="http://placekitten.com/g/50/50" width="50px" height="50px" data-avatar="'+message.user+'" alt="'+message.user+'\'s avatar"/></aside>');
  var messageContentContainer = $('<div></div>');
  var messageUser = $('<h4 class="inline-block mt0 mr1">'+message.user+'</h4>');
  var messageDate = $('<span class="inline-block h6 regular muted">'+date.toLocaleTimeString()+'</span>');
  var messageContent = $('<p class="mb0">'+message.message+'</p>');

  // On insert les données dans le template
  messageTemplate.append(messageAvatar);
  messageContentContainer.append(messageUser);
  messageContentContainer.append(messageDate);
  messageContentContainer.append(messageContent);
  messageTemplate.append(messageContentContainer);

  // pour finir, on insert le template dans le flux de chat
  messageTemplate.appendTo(chatStream);

  // on démarre le processus asynchrone de récupération de l'avatar de l'utilisateur
  fetchAvatar(message.user);

  // et on fait remonter le message s'il dépasse le périmètre de la vue du flux de chat
  scrollIntoViewIfNeeded(messageTemplate[0]);
}

function scrollIntoViewIfNeeded(element) {
  if (element.offsetTop > element.parentNode.offsetHeight) {
    element.scrollIntoView();
  }
}
```

Pour comprendre cette vérification de notification en haut de la fonction **streamMessage**, nous pouvons jeter un oeil à la fonction **streamNotification**. En l'espèce, nous voulons notifier les utilisateurs connectés quand un autre utilisateur rejoint ou quitte le chat:

```js
function streamNotification(notification) {
  var date = new Date(notification.date);

  // crée un template pour la notification
  var notifyTemplate = $('<div class="px1"></div>');
  var notifyContent = $('<h5 class="inline-block mr1 '+notification.status+'">'+notification.notification+'</h5>');
  var notifyDate = $('<span class="inline-block h6 regular muted">'+date.toLocaleTimeString()+'</span>');

  // insert les données dans le template
  notifyTemplate.append(notifyContent);
  notifyTemplate.append(notifyDate);

  // insert le template dans le flux
  notifyTemplate.appendTo(chatStream);

  // remonte la notification si elle dépasse le périmètre de la vue du flux de chat
  scrollIntoViewIfNeeded(notifyTemplate[0]);
}

// crée un modèle de notification pour usage ultérieur
function notifyModel(notification, status) {
  var postDate = new Date();

  return {
    'date': postDate,
    'notification': notification,
    'status': status
  };
}
```

Comment savons-nous qu'un utilisateur s'est (dé)connecté à l'application? Voyons **www/assets/js/account.js**:

```js
hoodie.account.on('error:unauthenticated signout', function(e){
  login.show();

  // ajouté pour déclencher les notifications dans le chat
  notifySignOut(e);
});

hoodie.account.on('signin signup', function(e){
  login.hide();

  // ajouté pour déclencher les notifications dans le chat
  notifySignIn(e);
});
```

Une fois que vous avez ajouté les déclencheurs à **account.js**, ajoutez ces fonctions à **main.js**:

```js
function notifySignIn(e) {
  var notification = e + " has signed into the chat.";
  var model = new notifyModel(notification, 'green');

  messageStore.add(model).publish();
}

function notifySignOut(e) {
  var notification = e + " has signed out or disconnected.";
  var model = new notifyModel(notification, 'red');

  messageStore.add(model).publish();
}
```
Nous avons désormais la possibilité d'envoyer des messages et d'être notifié de qui entre et sort du chat; terminons en donnant à l'utilisateur la possibilité d'ajouter une image d'avatar unique. Un morceau de CSS ajoutait un état "hover" sur l'avatar de la barre de compte pour dire à l'utilisateur qu'il pouvait cliquer sur l'avatar pour le changer, que se passe-t-il quand il clique dessus?

```js
$('.user-avatar').on('click', showFileInput);

function showFileInput(e) {
  // récupère le parent, la zone Compte
  var parent = $('#account');

  // crée un sélecteur de fichier qui accepte les .png, .jpeg/.jpg et .git pour upload
  var fileInput = $('<input type="file" accept="image/png, image/jpeg, image/gif" data-action="uploadAvatar" />');

  // crée un conteneur pour le champ ci-dessus pour gérer le message d'aide
  var inputContainer = $('<div class="bg-white input-container"></div>');

  // met en place un gestionnaire de modification pour déclencher l'upload de l'image avant d'attacher le champ au DOM
  fileInput.on('change', handleImgUpload);

  // ajoute le champ dans le conteneur et l'attache au DOM
  inputContainer.append(fileInput);
  parent.prepend(inputContainer);
}
```

Ca semble simple, non? Voici ensuite ce qui se passe quand quelqu'un sélectionne une image depuis le sélecteur de fichier:

```js 
function handleImgUpload(e) {
  // traite l'image pour la sauvegarder dans avatarStore depuis le fichier lors du déclenchement de la modification du sélecteur de fichier
  avatarProcess(e.target.files[0]);

  // et on retire le champ du DOM
  e.target.remove();
}

function avatarProcess(imgData) {
  // défini une fonction pour modélise les données d'avatar avant de les envoyer pour sauvegarde
  function handleImg(img) {
    return function process(e) {
      var src = e.target.result;
      var props = {
        src: src,
        id: hoodie.account.username
      };

      saveAvatar(props);
    };
  }

  // crée un nouveau FileReader, met une fonction pré-définie en place à déclencher en fin de chargement de notre image, et déclenche l'événement de lecture
  var reader = new FileReader();
  reader.onload = handleImg(imgData);
  reader.readAsDataURL(imgData);
}

function saveAvatar(props) {
  // tente de mettre l'avatar de l'utilisateur à jour, créant une nouvelle entrée dans le dépôt de l'utilisateur pour cet avatar et met le flux à jour avec l'image
  hoodie.store.updateOrAdd('avatar', hoodie.account.username, props).publish().then(function(avatar) {
    var avatarEl = $('[data-avatar="'+avatar[0].id+'"]');
    avatarEl[0].src = avatar[0].src;
  })
  .catch(function(error) { console.log(error); });
}
```

Enfin nous pouvons définir la fonction qui récupère l'avatar de l'utilisateur quand un nouveau message est ajouté ou si un utilisateur se connecte à l'application:

```js
function fetchAvatar(user) {
  var user = user || hoodie.account.username;
  var imgEl = $('[data-avatar="'+user+'"]');
  
  hoodie.global.find('avatar', user)
    .then(function(avatar) { imgEl.attr('src', avatar.src); })
    .catch(function(error) { console.log(user, error); return; });
}

// remplace les données d'avatar de l'utilisateur avec son identifiant, s'il en possède, puis récupère l'avatar réel
if ( hoodie.account.username ) {
  $('[data-avatar="currentUser"]').attr('data-avatar', hoodie.account.username);
  fetchAvatar();
}
```

C'est définitivement l'une des fonctionnalités les plus complexes de notre application.
Nous pensons qu'elle fini bien l'application. En exercice, essayez d'ajouter des notifications quand l'utilisateur actuel est @mentionné par un autre utilisateur dans le chat en sur-lignant le message avec une couleur de fond unique.