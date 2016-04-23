---
layout: layout-tutorials
locales: fr
---

# Tutoriel - Comment construire une application de cartographie avec Hoodie

*Un tutoriel décrivant comment construire une application de cartographie avec Hoodie.*

**TL;DR [Le dépôt git](https://github.com/hoodiehq/hoodie-template-app-map)**

Si vous êtes arrivés aussi loin dans la documentation, vous devriez avoir Hoodie et ses dépendances installés et savoir que Hoodie est un outil puissant pour faire des applications simplement fantastiques. Combinez Hoodie avec un autre outil solide, comme [Leaflet](http://leafletjs.com/), et cette application sera encore meilleure.

Commençons avec [Hoodie Skeleton](https://github.com/hoodiehq/hoodie-app-skeleton) pour démarrer le projet, un modèle de projet Hoodie qui contient jQuery, un système de login simple et des styles initiaux. Nous appellerons notre projet Hoodie Maps.

<pre><code>$ hoodie new HoodieMaps -t "hoodiehq/hoodie-app-skeleton"
$ cd HoodieMaps
</code></pre>

Une fois dans le répertoire du projet, vous pouvez démarrer Hoodie et commencer à construire votre application.

<pre><code>$ hoodie start</code></pre>

Ouvrez Hoodie Maps avec votre éditeur de texte ou IDE préféré, et commencez par index.html dans le répertoire **wwww/**. Remplacez le texte dans le **h1** qui indique "e_card" avec le nom de notre application, Hoodie Maps, et remplacer le texte dans le **h2** en dessous avec une description de notre application. Enlevez ensuite toutes les divs avec **class "one-third"**, ce qui vous donnera une base de travail.

Ensuite, récupérez une copie de Leaflet.js, soit via leur [page de téléchargement](http://leafletjs.com/download.html) soit par un système de paquet comme npm. Ajouter un tag script pour charger Leaflet après ceux de jQuery et Bootstrap.

```html
<script src="assets/vendor/jquery-2.1.0.min.js"></script>
<script src="assets/vendor/bootstrap/bootstrap.js"></script>
<script src="assets/vendor/leaflet/leaflet.js"></script>
```

Et n'oubliez pas d'inclure aussi la bibliothèque CSS.

```html
<!-- Vendor CSS
  ================================================== -->
<link rel="stylesheet" href="assets/vendor/bootstrap/bootstrap.min.css">
<link rel="stylesheet" href="assets/vendor/skeleton/base.css">
<link rel="stylesheet" href="assets/vendor/skeleton/skeleton.css">
<link rel="stylesheet" href="assets/vendor/skeleton/layout.css">
<link rel="stylesheet" href="assets/vendor/leaflet/leaflet.css">
```

Pour finir le travail sur **index.html**, ajoutez des éléments sous la zone d'entête avec lesquels travailler pendant que vous rendrez votre application fonctionnelle.

```html
<div id="hoodie-map" class="sixteen columns">
  <p class="loading-message">Loading Map...</p>
</div>

<div id="location-container" class="sixteen columns">
  <p class="location-message">Getting Your Current Location...</p>
</div>

<div id="marker-list-container" class="sixteen columns">
  <h3 class="marker-title h3"><u>Markers</u></h3>
  <ul class="marker-list"></ul>
</div>
```

Passons à **main.js** dans **assets/js/**, vous verrez que la première ligne est déjà en place.

```js
// initialize Hoodie

var hoodie  = new Hoodie();
```

Ensuite, créez la carte Leaflet dans une div d'**id** "hoodie-map".

```js
// initialise une nouvelle carte Leaflet

var hoodieMap = L.map('hoodie-map');
```

Vous avez maintenant une carte mais aucune coordonnées à lui fournir pour positionner la vue de ses tuiles. Créez une fonction pour récupérer la position courante via l'API GeoLocation.

```js
// Utilise l'API GeoLocation pour récupérer notre position actuelle.

function getCurrentPosition() {
   window.navigator.geolocation
    .getCurrentPosition(positionSuccess, alert);
}
```

Dans la méthode getCurrentPosition, nous avons passé un callback en cas de succès que nous définirons nous-même et la fonction native "alert" à laquelle sera passé un objet erreur et qui sera appelée s'il y a des erreurs lors de notre requête. Si la requête réussi, nous devrions récupérer la latitude et longitude et les ajouter au dépôt Hoodie.

```js
// En cas de réussite de récupération de la position courante, l'ajoute au dépôt

function positionSuccess(position){
  var longitude = position.coords.longitude,
      latitude = position.coords.latitude,
      storeOptions = {
        'id': 1,
        'lat': latitude,
        'lng': longitude
      };

  hoodie.store.add('position', storeOptions)
    .done(function(position){
      console.log('Position stored:', position);
    })
    .fail(alert);
}
```
Nous pouvons désormais écouter les événements d'une position ajoutée ou mise à jour dans le dépôt et créer une vue carte avec ces coordonnées en utilisant ma méthode [setView](http://leafletjs.com/reference.html#map-setview) de la carte Leaflet. Nous ajouterons des tuiles à la carte avec [Open Street Maps](http://www.openstreetmap.org/) et [tileLayer](http://leafletjs.com/reference.html#tilelayer) avec un zoom maximum de 18. Bien sûr, nous pouvons créer un [Marker](http://leafletjs.com/reference.html#marker) sympa pour montrer où nous sommes sur la carte exactement.

```js
// Quand une nouvelle position est ajoutée ou mise à jour, créer la carte.

hoodie.store.on('position:add position:update', createMap);

// Crée la carte initial et l'assigne à la variable hoodieMap, crée le marqueur de position actuelle et le message associé.

function createMap(position) {
  hoodieMap
    .setView(
      [position.lat, position.lng], 
      18, 
      {animate: true}
    );

  L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 
      '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(hoodieMap);

  L.marker([position.lat, position.lng])
    .bindPopup('<p>Your Current Location:</p><p>'+position.lat+' / '+position.lng+'</p>')
    .addTo(hoodieMap);

  $('.location-message')
    .text('Current Location: '+position.lat+' / '+position.lng);
}
```

Pour démarrer le processus complet, vous pouvez récupérer une position préalablement stockée dans le dépôt pour créer la carte, sinon appeler **getCurrentPosition()**.

```js
// Récupère une position existante depuis le dépôt et créer la carte avec ça, sinon récupère la position actuelle pour créer le carte.

hoodie.store.find('position', 1)
  .done(createMap)
  .fail(getCurrentPosition);
```

Pour ajouter un peu d'interactivité à notre application Hoodie Map, vous devriez donner aux utilisateurs la possibilité de cliquer/taper la carte pour créer des marqueurs pour une position et les ajouter au dépôt. Une fois le marquer ajouté, placez-le sur la carte et mettez à jour la liste des marqueurs sous la carte.

(Vous devrez inclure la [police d'icones Glyphicons](http://glyphicons.com/) pour que l'icône "remove" s'affiche à côté des entrées de la liste des marqueurs, ou vous pouvez juste placer un "X" dans le span à la place.)

```js
// Quand on clique sur la carte, créer un marqueur dans le dépôt et le placer sur la carte et dans la liste des marqueurs.

hoodieMap.on('click', createMarker);

// Fonction pour ajouter des marqueurs au dépôt.

function createMarker(e) {
  var lat = e.latlng.lat,
      lng = e.latlng.lng;

  var marker = new L.marker(e.latlng);

  hoodie.store.add('marker', {
    'id': L.stamp(marker),
    '_leaflet_id': L.stamp(marker),
    'lat': lat,
    'lng': lng
  })
  .done(placeMarker)
  .fail(alert);
}

// Fonction pour placer les marqueurs sur la carte et dans la liste.

function placeMarker(marker) {
  var lat = marker.lat;
  var lng = marker.lng;
  var mark = new L.marker([lat, lng]);
  var listItem = '
    <li class="marker" data-id="'+marker.id+'">
      Marker '+marker.id+' at '+lat+'/'+lng+' 
      <span class="glyphicon glyphicon-remove" data-action="remove-marker"></span>
    </li>';

  // remplace l'id privé de Leaflet pour ce marqueur par celui fourni par le dépôt Hoodie.

  mark._leaflet_id = +marker.id; 

  // ajouter une propriété custom 'type' pour identifier ces marqueurs lors de leur retrait de la carte plus tard.

  mark.type = 'stored'; 
  mark.bindPopup('
    <p>A new marker 
        '+marker.id+' 
      at:
    </p>
    <p>
      '+lat+' / '+lng+'
    </p>');

  hoodieMap.addLayer(mark);
  $('.marker-list').append(listItem);
}
```

Pour enlever un marqueur du dépôt et de la carte, nous pouvons écouter les événements "click" sur l'icon "remove" à côté de chaque entrée de marqueur sous la carte.

```js
// Quand le X de suppression de marqueur est cliqué, retire le marqueur du dépôt et de la carte.

$('.marker-list')
  .on('click', '[data-action=remove-marker]', deleteMarker);

// Fonction pour supprimer les marqueurs du dépôt.

function deleteMarker(e) {
  var marker = $(e.target).parent();
  var markerID = marker.data("id");

  hoodie.store.remove('marker', markerID)
    .done(removeMarker)
    .fail(alert);
}

// Fonction pour retirer les marqueurs de la carte et de la liste.

function removeMarker(marker) {
  var markerID = marker.id;

  // Trouve l'objet Layer dans les zones de couches privées de la classe Map.
  
  hoodieMap.removeLayer(hoodieMap._layers[markerID]); 

  $('[data-id='+markerID+']').remove();
}
```

Maintenant l'utilisateur de votre application peut créer un tas de marqueurs mais ils sont stockés en tant qu'anonyme, i.e. sans compte. Comment faites-vous pour déplacer ces entrées dans le compte de l'utilisateurs lors qu'il se connecte ou s'enregistre? La réponse est simple: vous n'avez pas à le faire. Hoodie récupérera toute donnée locale anonyme, et la déplacera dans le compte de l'utilisateur quand il [s'enregistrera](http://docs.hood.ie/en/techdocs/api/client/hoodie.account.html#accountsignup). Quand [un utilisateur se connecte](http://docs.hood.ie/en/techdocs/api/client/hoodie.account.html#accountsignin), vous pouvez passer un objet options avec la propriété "moveData" à "true". 

Heureusement, vous avez le script **assets/vendor/hoodie.accountbar.bootstrap.js** qui s'occupe de cette logique pour vous.

Quand un utilisateur est authentifié d'une manière ou d'une autre, que ce soit suite à connexion, enregistrement, ou ré-authentification (définie comme "déclenchée après que l'utilisateur se soit connecté avec succès avec son nom courant"), vous devriez remplir la carte avec les marqueurs stockés. Vous devriez aussi vérifier si l'utilisateur est déjà connecté quand l'application se charge. Vérifier que **hoodie.account.username** retourne false suffit pour savoir si l'utilisateur n'est pas identifié.

```js
// Si un utilisateur est déjà connecté, remplit la carte avec ses marqueurs.

if(hoodie.account.username) {
  fillMap();
}

// Quand un utilisateur s'enregistre, se connecte ou se ré-authentifie, remplir la carte avec ses marqueurs.

hoodie.account.on('signin signup reauthenticated', fillMap);
```

Une fois que l'utilisateur en a terminé avec l'application et se déconnecte, vous devriez nettoyer la carte de tous les marqueurs de l'utilisateur à l'exception du marqueur de position courante.

```js
// Quand l'utilisateur se déconnecte, nettoie la carte de tous les marqueurs utilisateur.

hoodie.account.on('signout', clearMap);

// Fonction pour retirer tous les marqueurs stockés de la carte.

function clearMap(e) {
  for( var layerID in hoodieMap._layers) {
    var layer = hoodieMap._layers[layerID];
    var marker = layer.type === 'stored' ? layer : null;
    if(marker) {
      hoodieMap.removeLayer(marker);
    }
  }
  $('.marker-list').empty();
}
```

Ceci devrait conclure le fonctionnement de base de cette application cartographique de démonstration. Comme exercice, essayez d'ajouter la possibilité d'éditer le texte popup associé à chaque marqueur et le stocker dans le dépôt. Assurez-vous de consulter [la documentation Hoodie](http://docs.hood.ie/en/techdocs/api/client/hoodie.html) pour plus d'information sur l'API Hoodie.js et la [documentation Leaflet](http://leafletjs.com/reference.html) pour les spécificités de l'API Leaflet.js. 
