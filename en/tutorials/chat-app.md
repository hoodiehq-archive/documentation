---
layout: layout-tutorials
locales: en
---

# Tutorial - How to Build a Chat App with Hoodie

*A tutorial describing how to start building a chat app using Hoodie.*

**TL;DR [The Repo](https://github.com/hoodiehq/hoodie-template-app-chat)**

If you've gotten this far in the Docs, you should have Hoodie and its dependencies installed and know that Hoodie is a powerful tool for making simply awesome apps. By taking advantage of the extensive [Hoodie Plugin system](http://docs.hood.ie/en/plugins/), using plugins like [Global-Share](http://docs.hood.ie/en/techdocs/api/plugins/hoodie.plugin.global.share.html), that app can become ever greater. So let's get started. 

We'll start off using the [Hoodie Boilerplate](https://github.com/zoepage/hoodie-boilerplate), a Hoodie project template, to get the project up and running with jQuery, a simple login system, and some initial styles. We'll call the project Hoodie Chat.

```bash
$ hoodie new HoodieChat -t "zoepage/hoodie-boilerplate"
$ cd HoodieChat
```
 
Open up Hoodie Chat in your preferred text editor or IDE, and we'll begin with getting a CSS Toolkit called Basscss to make styling our app a bit easier. We can grab a copy of this library [here](http://www.basscss.com/docs/) by clicking the Download Source button, opening the downloaded folder, and grabbing the minified source (basscss.min.css) in the css directory. Place this file in the css directory of our project under **www/assets/css** and link to it in the **index.html** file in the **www/** directory.  

```html
<link rel="stylesheet" href="assets/css/basscss.min.css">
```

Next, we'll install the Hoodie Global Share Plugin using the Hoodie command line tool.

```bash
$ hoodie install global-share
```

Now any extra methods the plugin adds to **hoodie.js** are automatically bundled into it without linking an extra script to **index.html**. You can find more information about how Hoodie plugins work [here](http://docs.hood.ie/en/plugins/tutorial.html).

Let's make some edits to our **index.html** file to fit our app's structural needs, starting with the user account bar: 

```html
<!-- add some extra spacing and layout styles to the account area -->
<section id="account" class="mt2 flex flex-right flex-center">

  <!-- create this user-avatar div to sit next to the username -->
  <div class="user-avatar relative">

    <!-- default the img src to a placekitten url for a little extra fun  and don't forget the extra style classes-->
    <img src="http://placekitten.com/g/50/50" data-avatar="currentUser" width="50px" height="50px" class="mr1 rounded relative" />

  </div>

  <p class="m0" >Hello <span id="userName"></span>!</p>
  <button id="signOut">Sign out</button>
</section>
```

Now we'll move into the section with the class "content":  

```html
<header>

  <!-- Put the name of our app in h1 and a fun tag line in the h3 -->
  <h1>Hoodie Chat</h1>
  <h3>The perfect way to converse with Hoodies, worldwide.</h3>

</header>

<section>
  
  <!-- create a div to hold the stream of chat messages and notifications as they're created -->
  <div class="border overflow-scroll chat-stream-container" data-action="chat-stream"></div>

  <!-- create a form for the user to submit their messages through -->
  <form data-action="chat-input">
    <div class="mt2 mb1">
      <textarea class="block full-width my1 field-light not-rounded no-resize" rows="1" placeholder="Type message here..." data-action="send-message"></textarea>
    </div>
    <input class="button bg-teal full-width" type="submit" value="Send Message">
  </form>

</section>
```

Before we get started with the JavaScript, we'll add some unique CSS to our **www/assets/main.css** file:

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
```

Now we can finally open up **www/assets/js/main.js** and start adding some functionality to our little chat app. That file should already have the one line needed to initialize a new Hoodie class:

```js 
// initialize Hoodie
var hoodie = new Hoodie();
```

From there, we can create some dedicated Stores for quickly saving and finding our messages and avatars:

```js
// create a scoped 'message' store for easier re-use
var messageStore = hoodie.store('message');

// create a scoped 'avatar' store for easier re-use
var avatarStore = hoodie.store('avatar');
```

Another part of our app setup will be selecting all the DOM elements we'll be interacting with to make the app work using the custom **data-action** attribute we gave them earlier:

```js
// Select the chat form
var chatForm = $('[data-action="chat-input"]');

// Select the textarea from the chat form
var chatBox = $('[data-action="send-message"]');

// Select the chat stream area
var chatStream = $('[data-action="chat-stream"]');
```

As for DOM interaction, we can begin by listening to the **chatForm** for **submit** events and send the message to our message store when that happens:

```js
// Setup submit event listener on chat form
chatForm.on('submit', sendMessage);

// create sendMessage function
function sendMessage(e) {
  e.preventDefault();

  // check for content in the chatBox,
  // if there is content,
  // then assign it to a variable
  // else, return false to cancel function
  var messageContent = chatBox.val().trim();

  if ( messageContent.length < 1 ) { return false; }

  // create a new message model
  var message = new messageModel(messageContent);

  // using the global messageStore, add this message object and publish it to the global store.
  messageStore.add(message).publish();

  trigger an immediate sync with the server for quicker updates
  hoodie.remote.push();

  // Dont't forget to clear out the charBox
  chatBox.val('');
}
```

You may have noticed the **new messageModel(messageContent)**; we define this **messageModel** just after defining the **sendMessage** function, in order to abstract some of the logic that goes into making our message object we're saving to the **messageStore**:

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

We should also be able to submit a message without clicking the submit button for the form, so let's add the functionality for sending a message if the user presses the **CMD/Ctrl** and **Enter** keys while focused on the chatBox:

```js
// Setup keydown listener for power user message submitting, CMD/Ctrl + Enter
chatBox.on('keydown', checkSubmit);

function checkSubmit(e) {
  // if the CMD/Ctrl key and the Enter key are both pressed down, then send the message to the store
  if (e.metaKey && e.keyCode === 13) {
    sendMessage(e);
  }
}
```

So we've sent a message to the messageStore, how does it appear in the chat stream? Well, we listening to the global share store for messages being added and push them into the stream:

```js
// setup event listener for new messages being saved to Hoodie
hoodie.global.on('add', streamMessage);

// post newly added message to the stream
function streamMessage(message) {
  // if the message contains a notification, skip to streaming a notification instead of a message
  if(message.notification) { return streamNotification(message); }

  // some quick validation to make sure these are the messages we are looking for
  if (message.type !== 'message') { return; }

  var date = new Date(message.date);

  // if the message is from the current user, give it a different background color than the rest of the messages
  var bgColor = message.user === hoodie.account.username ? "bg-silver" : "bg-white";
  
  // create template to store message content
  var messageTemplate = $('<div class="p1 '+bgColor+' flex flex-stretch"></div>');
  var messageAvatar = $('<aside class="flex flex-stretch rounded overflow-hidden mr2"><img src="http://placekitten.com/g/50/50" width="50px" height="50px" data-avatar="'+message.user+'" /></aside>');
  var messageContentContainer = $('<div></div>');
  var messageUser = $('<h4 class="inline-block mt0 mr1">'+message.user+'</h4>');
  var messageDate = $('<span class="inline-block h6 regular muted">'+date.toLocaleTimeString()+'</span>');
  var messageContent = $('<p class="mb0">'+message.message+'</p>');

  // insert data into template
  messageTemplate.append(messageAvatar);
  messageContentContainer.append(messageUser);
  messageContentContainer.append(messageDate);
  messageContentContainer.append(messageContent);
  messageTemplate.append(messageContentContainer);

  // finally, insert template into the chat stream
  // then, clear out the chat box
  messageTemplate.appendTo(chatStream);

  // start async proces of fetching the avatar for this user
  fetchAvatar(message.user);

  // scroll the new message into view if it overflows the chat stream
  scrollIntoViewIfNeeded(messageTemplate[0]);
}

function scrollIntoViewIfNeeded(element) {
  if (element.offsetTop > element.parentNode.offsetHeight) {
    element.scrollIntoView();
  }
}
```

To understand that notification check at the top of the **streamMessage** function, we can take a look at the **streamNotification** function. Essentially, we want to notify the signed-in users when another user signs-in and out of the chat:

```js
function streamNotification(notification) {
  var date = new Date(notification.date);

  // create template for notification
  var notifyTemplate = $('<div class="px1"></div>');
  var notifyContent = $('<h5 class="inline-block mr1 '+notification.status+'">'+notification.notification+'</h5>');
  var notifyDate = $('<span class="inline-block h6 regular muted">'+date.toLocaleTimeString()+'</span>');

  // insert data into template
  notifyTemplate.append(notifyContent);
  notifyTemplate.append(notifyDate);

  // insert template into chat stream
  notifyTemplate.appendTo(chatStream);

  // scroll the notification into view if it overflows the chat stream
  scrollIntoViewIfNeeded(notifyTemplate[0]);
}

// create a notification model for re-use later
function notifyModel(notification, status) {
  var postDate = new Date();

  return {
    'date': postDate,
    'notification': notification,
    'status': status
  };
}
```

How do we know when a user signs in and out of the chat app? Let's check out **www/assets/js/account.js** to find out:

```js
hoodie.account.on('error:unauthenticated signout', function(e){
  login.show();

  // added to trigger our chat notifications
  notifySignOut(e);
});

hoodie.account.on('signin signup', function(e){
  login.hide();

  // added to trigger our chat notifications
  notifySignIn(e);
});
```

So we have the ability to send chat messages and be notified who comes in & out of the chatroom; now let's finish up by giving user's the ability to set a unqiue avatar picture. A part of that CSS earlier was adding a hover state for the account bar avatar to tell the user they can click that avatar to change it, so what happens when they click it? 

```js
$('.user-avatar').on('click', showFileInput);

function showFileInput(e) {
  // grab the parent, Account area
  var parent = $('#account');

  // create a filepicker input that accepts .png, .jpeg/.jpg, and .gif files for upload
  var fileInput = $('<input type="file" accept="image/png, image/jpeg, image/gif" data-action="uploadAvatar" />');

  // create a container for that input to cover the hint message
  var inputContainer = $('<div class="bg-white input-container"></div>');

  // set a change listener for triggering the img upload process before attaching in the input to the DOM
  fileInput.on('change', handleImgUpload);

  // put the file input into the container and attach it to the DOM
  inputContainer.append(fileInput);
  parent.prepend(inputContainer);
}
```

That ^ seems simple enough, right? Next is what happens once someone selects an img from the filepicker input:

```js 
function handleImgUpload(e) {
  // process the image for saving to the avatarStore with the file taken from the file input's change event
  avatarProcess(e.target.files[0]);

  then remove the input from the DOM
  e.target.remove();
}

function avatarProcess(imgData) {
  // define a function to model the avatar data before sending it off to be saved
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

  // create a new FileReader, set our pre-defined function to trigger once the file reader has our image loaded, and trigger the read event
  var reader = new FileReader();
  reader.onload = handleImg(imgData);
  reader.readAsDataURL(imgData);
}

function saveAvatar(props) {
  // try to update a user's avatar, otherwise create a new item in the store for a user's avatar data, then update their image in the chat stream
  hoodie.store.updateOrAdd('avatar', hoodie.account.username, props).publish().then(function(avatar) {
    var avatarEl = $('[data-avatar="'+avatar[0].id+'"]');
    avatarEl[0].src = avatar[0].src;
  })
  .catch(function(error) { console.log(error); })
}
```

Finally, we can define a function that fetches a user's avatar when a new message is added or when a user signs into the app:

```js
function fetchAvatar(user) {
  var user = user || hoodie.account.username;
  var imgEl = $('[data-avatar="'+user+'"]');
  
  hoodie.global.find('avatar', user)
    .then(function(avatar) { imgEl.attr('src', avatar.src); })
    .catch(function(error) { console.log(user, error); return; });
}

// replace currentUser avatar data with the current username, if there is one, then fetch the real avatar.
if ( hoodie.account.username ) {
  $('[data-avatar="currentUser"]').attr('data-avatar', hoodie.account.username);
  fetchAvatar();
}
```

This is definitely one of the more complex features of our app but worth it to make this chat app feel more complete. As an extra challenge, try to add notifications for when the current user is @mentioned by another user in the chat by highlighting their messages with a unique background color. 
