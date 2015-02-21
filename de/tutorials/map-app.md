---
layout: layout-tutorials
locales: de
---

# Tutorial - How to Build a Map App with Hoodie

*A tutorial describing how to start building a map app using Hoodie.*

**TL;DR [The Repo](https://github.com/hoodiehq/hoodie-template-app-map)**

If you've gotten this far in the Docs, you should have Hoodie and its dependencies installed and know that Hoodie is a powerful tool for making simply awesome apps. Combine Hoodie with another strong tool, like [Leaflet](http://leafletjs.com/), and that app can become even greater. So, let's get started.

We'll start off using [Hoodie-Moufle](https://github.com/zoepage/hoodie-moufle), a Hoodie project template, to get the project up and running with Bootstrap, jQuery, Skeleton, and a simple account bar. We'll call the project Hoodie Maps.

<pre><code>$ hoodie new HoodieMaps -t "zoepage/hoodie-moufle"
$ cd HoodieMaps
</code></pre>

Once inside our project directory, we can get start up Hoodie and get to building our app.

<pre><code>$ hoodie start</code></pre>

Open up Hoodie Maps in your preferred text editor or IDE, and we'll begin with index.html in the **www/** directory. Replace the text in the **h1** that says "e_card", to the name of our app, Hoodie Maps, and replace the text of the **h2** below it to a description of our app. Then remove all the divs with the **class "one-third"**, to give us a clean canvas on which to create.

Next, grab a copy of Leaflet.js, either from their [Downloads page](http://leafletjs.com/download.html) or a package system like npm. Add the script tag connecting to Leaflet after those for jQuery and Bootstrap.

```html
<script src="assets/vendor/jquery-2.1.0.min.js"></script>
<script src="assets/vendor/bootstrap/bootstrap.js"></script>
<script src="assets/vendor/leaflet/leaflet.js"></script>
```

And don't forget to include the library's CSS as well.

```html
<!-- Vendor CSS
  ================================================== -->
<link rel="stylesheet" href="assets/vendor/bootstrap/bootstrap.min.css">
<link rel="stylesheet" href="assets/vendor/skeleton/base.css">
<link rel="stylesheet" href="assets/vendor/skeleton/skeleton.css">
<link rel="stylesheet" href="assets/vendor/skeleton/layout.css">
<link rel="stylesheet" href="assets/vendor/leaflet/leaflet.css">
```

To wrap up our work on the **index.html**, we'll add some markup under the header area to work with while we make our app functional.

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

Move on over to **main.js** in **assets/js/** and see the first line taken care of for us.

```js
// initialize Hoodie

var hoodie  = new Hoodie();
```

Next, we'll create a new Leaflet Map in the div with the **id** of "hoodie-map".

```js
// initialize new Leaflet map

var hoodieMap = L.map('hoodie-map');
```

Now we have a Map but no coordinates to give it in order to set the view of its tiles. So we can create a function for getting our current position using the GeoLocation API.

```js
// Using the GeoLocation API to get your current location.

function getCurrentPosition() {
   window.navigator.geolocation
    .getCurrentPosition(positionSuccess, alert);
}
```

Inside the getCurrentPosition method, we've passed in a success callback function that we'll define ourselves and the native "alert" function, which will be passed an error object and called if there are any errors with our request. If the request succeeds, we should grab the longitude & latitude and add them to the Hoodie Store.

```js
// On the success of the current location, 
// add the position to the store.

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

Then we can listen for events of a position being added or updated on the Store, create our Map's view with those coordinates using the Leaflet Map's [setView](http://leafletjs.com/reference.html#map-setview) method. We'll add tiles to the map with [Open Street Maps](http://www.openstreetmap.org/) and [tileLayer](http://leafletjs.com/reference.html#tilelayer) with a max zoom of 18. Of course, we can make a nice [Marker](http://leafletjs.com/reference.html#marker) to show us exactly where we are on the Map.

```js
// When a new currentPosition is added or 
// updated then create a map.

hoodie.store.on('position:add position:update', createMap);

// Create the initial map and assign it to the 
// hoodieMap variable, creates the current location 
// marker and location message.

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

To start this whole process off, we can check the store for any previously stored positions to create the Map with, otherwise just **getCurrentPosition()**.

```js
// Check the Store for an existing currentLocation 
// and creates the map with that, otherwise grab 
// currentLocation to create the map.

hoodie.store.find('position', 1)
  .done(createMap)
  .fail(getCurrentPosition);
```

To add some interactivity to our Hoodie Maps app, we should give our users the ability to click or tap on the map to create Markers for a location and add it to the Store. Once the Marker is added, we'll place it on the Map and update the list of markers below the Map.

(You'll need to include the [Glyphicons Icon Font](http://glyphicons.com/) for the "remove" icon to show up next to the Marker list item, or you can just place an "X" in that span instead.)

```js
// When the map is clicked, create a marker 
// in the store and place it on the map and marker list.

hoodieMap.on('click', createMarker);

// Utility function for adding markers to the store.

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

// Utility function for placing markers 
// on the map and marker list.

function placeMarker(marker) {
  var lat = marker.lat;
  var lng = marker.lng;
  var mark = new L.marker([lat, lng]);
  var listItem = '
    <li class="marker" data-id="'+marker.id+'">
      Marker '+marker.id+' at '+lat+'/'+lng+' 
      <span class="glyphicon glyphicon-remove" data-action="remove-marker"></span>
    </li>';

  // change the marker's private Leaflet 
  // id to the coerced item id from Hoodie store.

  mark._leaflet_id = +marker.id; 

  // add a custom 'type' property to target when 
  // removing these markers from the map later.

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

To remove a marker from the Store and the Map, we can listen for click events on the "remove" icon next to each marker item below our map.

```js
// When the remove-marker X is clicked, 
// remove the marker from the store and the map.

$('.marker-list')
  .on('click', '[data-action=remove-marker]', deleteMarker);

// Utility function for deleting markers from the store.

function deleteMarker(e) {
  var marker = $(e.target).parent();
  var markerID = marker.data("id");

  hoodie.store.remove('marker', markerID)
    .done(removeMarker)
    .fail(alert);
}

// Utility function for removing markers 
// from the map and marker list.

function removeMarker(marker) {
  var markerID = marker.id;

  // finds the Layer object in the private 
  // layers area within the Map class.
  
  hoodieMap.removeLayer(hoodieMap._layers[markerID]); 

  $('[data-id='+markerID+']').remove();
}
```


Now an user of our app can create a bunch of markers but they are storing all these markers as Annie Anonymous, a.k.a without an account. So how do we move all those items over to a user's account when they sign up or sign in? Well the answer is simple, we don't. Hoodie will take any local data, i.e. from any Annie Anonymous, and move it a user account when they [sign up](http://docs.hood.ie/en/techdocs/api/client/hoodie.account.html#accountsignup). When [a user signs in](http://docs.hood.ie/en/techdocs/api/client/hoodie.account.html#accountsignin), we can pass in an options object with a property of "moveData" to true. 

Luckily, we have the **assets/vendor/hoodie.accountbar.bootstrap.js** script to take care of that logic for us.

When an user is authenticated in some way, either through sign in, sign up, or reauthentication (which is "triggered after user successfully signed in with current username."), we should fill the map with any stored markers. We should also check to see if the user is already signed in when the app loads. Checking for **hoodie.account.username** returns false if a user is not signed in.

```js
// If a user is already signed in, 
// then fill the map with their markers.

if(hoodie.account.username) {
  fillMap();
}

// When a user signs in, signs up, and 
// reauthenticates, fill the map with their markers.

hoodie.account.on('signin signup reauthenticated', fillMap);
```

Once the user is finished using the app and signs out, we should clear the Map of all the user's markers except for the current location marker.

```js
// When the user signs out, clear the map 
// of all the users markers.

hoodie.account.on('signout', clearMap);

// Utility function for clearing the map 
// of all the stored markers.

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

That should wrap up the basic functionality used within this demo map app. As an extra challenge, try to add the ability to edit the popup text bound to each marker and save it to the Store. Be sure to consult the [Hoodie Docs](http://docs.hood.ie/en/techdocs/api/client/hoodie.html) for further information on the Hoodie.js API and the [Leaflet Docs](http://leafletjs.com/reference.html) for specifics on the Leaflet.js API. 
