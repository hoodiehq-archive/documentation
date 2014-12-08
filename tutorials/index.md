---
layout: layout-tutorials
---

# Getting started - Part 2

### 0. Make a new hoodie app

Let's make a new hoodie app, so we can play around! If you are good with the one you've just created, make sure 
that you are in your app folder, not in **www**, **node_modules** or other.

If you want to check your current path, just type
<pre><code>$ pwd</code></pre>

Going one level up, just type
<pre><code>$ cd ..</code></pre>

You would love to have a new app? Sure! 
<pre><code>$ hoodie new hoodietut</code></pre>

Please make sure to be on the right path. If you are not sure, if you are, use **pwd**. Hoodie creates your new folder with all includes and files in the current path, you are on right now.

### 1. Start Your App and Test It

Again from the command line type ...

<pre><code>$ cd hoodietut
$ hoodie start
</code></pre>

It’ll open up your default browser.

### 2. Play with the App

The demo todo app shows off what you can do with hoodie. You will probably notice that it looks like a Bootstrap app. Though the app uses Bootstrap, hoodie has no dependency on Bootstrap and any CSS framework can be used.

In the upper right, there is a drop down for “Sign Up”. Click on it and create an account with your desired username and password. After that you should be logged in automatically – only in this case your todos will be saved.

Type in a few todos like “learn hoodie” and “steps 5, 6, 7 and 8”. You should see your todos displayed directly.

Nice to see a working hoodie after just two steps!


### 3. Tabs for CouchDB and Admin

Our hood.ie demo app should already be opened in your browser. 
Start two more tabs for CouchDB and the admin interface:

```
http://127.0.0.1:6003/_utils
http://127.0.0.1:6002/
```

We won’t use the admin *(:6002)* yet, but good to know it’s ready. You also don’t need CouchDB, except for monitoring the hoodie magic.


### 4. Make Hoodie Your Own: Go Nuts

In the next several steps our demo todo app will be modified to give todos a priority of 1, 2 or 3. Also the list of todos will be sorted by priority.

At this point the hood.ie site tells you to “go nuts”. There are a few more steps you need to take before you can write your own hoodie app.

In my case, I started sublime text with a new project for **hoodietut**. This was the folder created by hoodie in Step Two.

Open the `hoodietut` folder created in step two with your editor/IDE of choice. You should see the folders `data`, `node_modules` and `www`. The hoodie command line client has set up files for both hoodie and the demo todo app.

We will be working in the `assets` folder of `www`.


### Step Seven – Edit your first hoodie files

To start creating you own app there are two files you’ll want to copy. In `/hoodietut/www/` copy `index.html` and name the copy `new.html`. In `/www/assets/` copy `main.js` and rename the copy to `new.js`.

Now open `new.html` and the last line should be ...

```html
<script src="assets/main.js"></script>
```

Change that line from `main.js` to `new.js` ...

```html
<script src="assets/new.js"></script>
```

Open a new tab in the browser and go to ...

```
http://127.0.0.1:6001/new.html
```

This displays the file you just created.

In the first part of the `<body>` you’ll see the line “hoodie playground”. Modify that to read “my first hoodie app”. When you reload the browser you should see your first modification to your hoodie app.


### Step Eight – Button Please

The demo todo app lets you type in new todos and saves them when you invoke the Return key. This works fine for a single input, but as we will be adding another form field for a priority later on, a submit button will be more appropriate.

First add a button to the `new.html` file. Look for the text input with the id `todoinput`. In the line after it add a button with the id `addBut`:

```html
<button id="addBut">Add</button>
```

Second, change `new.js` so a new todo is added when the button is clicked instead of a keypress. Replace the six lines of code after `// handle creating a new task` with ...

```javascript
// handle creating a new task
$('#addBut').on('click', function() {
  hoodie.store.add('todo', {title: $("#todoinput").val()});
  $("#todoinput").val('');
});
```

The first line binds to a click on our newly created button. When the button is clicked the second line adds a new todo using the `hoodie.store.add` method. The third line within our new function clears the input.

Save these files and run your modified app at:

```
http://127.0.0.1:6001/new.html
```

Enter a new task. You should see it rendered after clicking the “Add” button.

### Step Nine – Understanding Type

Type is an important convention to understand when working with Hoodie or CouchDB. Type is a convention to deal with the lack of schemas in CouchDB.

In CouchDB the same database can contain a wide variety of different records. For example, you might have records on people and records on location. Type is used to distinguish one record from another. So the people records would have fields like `first name`, `last name`, etc. and a record called `type` with a value of `people`. The location record would have fields like `street`, `country`, etc. and a record called `type` with a value of `location`.

Hoodie uses type the same way. It is a way to store different ‘types’ of records in the same database. In this demo only the “todo” type will be used.

So while type is not critical for this application, more complex applications will have several types.


### Step Ten – Adding Priority

Adding a priority requires a new input element. Add a `<select>` input before the button we added above in `new.html`:

```html
<select id="priorityinput" class="form-control">
  <option>1</option>
  <option selected="selected">2</option>
  <option>3</option>
</select>
<button id="addBut">Add</button>
```

Then modify the `#addBut` click method in `new.js` to store the priority:

```javascript
// handle creating a new vendor
$('#addBut').on('click', function() {
  hoodie.store.add('todo', {
  title: $("#todoinput").val(),
  priority: $("#priorityinput").val()
  });
  $("#todoinput").val('');
});
```

Again in `new.js` modify the `paint` function to show the priority:

Change ...

```javascript
'<input type="checkbox"> <label>' + collection[i].title + '</label>' +
```

to ...

```javascript
'<input type="checkbox"> <label>' + collection[i].priority + ' ' + collection[i].title + '</label>' +
```

At this point you should start seeing that each task listed is prefaced by a priority. Hoodie makes it pretty easy to add new fields to a store.


### Step Eleven – Sort By Priority

Our todo list would look a lot nicer if it was also listed by our new priority. So let’s change the sorting method in `new.js`:

Replace ...

```javascript
return ( a.createdAt > b.createdAt ) ? 1 : -1;
```

... with ...

```javascript
return ( a.priority > b.priority ) ? 1 : -1;
```

Now your number one priorities show first and you hopefully got a good first impression on the hoodie way of development.