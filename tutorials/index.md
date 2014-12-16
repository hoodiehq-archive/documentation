---
layout: layout-tutorials
---

# Getting started with Hoodie - Part 2

### 0. Make a new hoodie app

Let's make a new hoodie app, so we can play around! If you are good with the one you've just created, make sure 
that you are in your app folder, not in www, node_modules or other.

If you want to check your current path, just type
<pre><code>$ pwd</code></pre>

Going one level up, just type
<pre><code>$ cd ..</code></pre>

You would love to have a new app? Sure! 
<pre><code>$ hoodie new hoodietut</code></pre>

Hoodie creates your new folder with all includes and files in the current path, you are on right now.

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


### 4. Make Hoodie Your Own: Go Wild

In the next several steps our demo todo app will be modified to give todos a priority of 1, 2 or 3. Also the list of todos will be sorted by priority.

At this point the hood.ie site tells you to “go nuts”. There are a few more steps you need to take before you can write your own hoodie app.

In my case, I started <a href="http://www.sublimetext.com/" target="_blank">Sublime Text</a> with a new project for **hoodietut**. This was the folder created by hoodie before.

Open the **hoodietut** folder with your editor/IDE of choice. You should see the folders **data**, **node_modules** and **www**. The Hoodie-CLI has set up files for both hoodie and the demo todo app.

We will be working in the **assets** folder of **www**.


### 5. Edit your first hoodie files

To start creating you own app there are two files you’ll want to copy. In **/hoodietut/www/** copy **index.html** and name the copy **new.html**. In **/www/assets/** copy **main.js** and rename the copy to **new.js**.

Now open **new.html** and the last line should be ...

<pre><code>&lt;script src="assets/main.js">&lt;/script></code></pre>

Change that line from **main.js** to **new.js** ...

<pre><code>&lt;script src="assets/new.js">&lt;/script></code></pre>

Open a new tab in the browser and go to ...

<pre><code>http://127.0.0.1:6001/new.html</code></pre>

This displays the file you just created.

In the first part of the **&lt;body>** you’ll see the line “hoodie playground”. Modify that to read “my first hoodie app”. When you reload the browser you should see your first modification to your hoodie app.


### 6. Button Please

The demo todo app lets you type in new todos and saves them when you invoke the Return key. This works fine for a single input, but as we will be adding another form field for a priority later on, a submit button will be more appropriate.

First add a button to the **new.html** file. Look for the text input with the id **todoinput**. In the line after it add a button with the id **addBut**:

<pre><code>&lt;button id="addBut">Add&lt;/button></code></pre>

Second, change **new.js** so a new todo is added when the button is clicked instead of a keypress. Replace the six lines of code after **// handle creating a new task** with ...

<pre><code>// handle creating a new task
$('#addBut').on('click', function() {
  hoodie.store.add('todo', {title: $("#todoinput").val()});
  $("#todoinput").val('');
});
</code></pre>

The first line binds to a click on our newly created button. When the button is clicked the second line adds a new todo using the **hoodie.store.add** method. The third line within our new function clears the input.

Save these files and run your modified app at:

<pre><code>http://127.0.0.1:6001/new.html</code></pre>

Enter a new task. You should see it rendered after clicking the “Add” button.

### 7. Understanding Type

Type is an important convention to understand when working with Hoodie or CouchDB. Type is a convention to deal with the lack of schemas in CouchDB.

In CouchDB the same database can contain a wide variety of different records. For example, you might have records on people and records on location. Type is used to distinguish one record from another. So the people records would have fields like **first name**, **last name**, etc. and a record called **type** with a value of **people**. The location record would have fields like **street**, **country**, etc. and a record called **type** with a value of **location**.

Hoodie uses type the same way. It is a way to store different ‘types’ of records in the same database. In this demo only the “todo” type will be used.

So while type is not critical for this application, more complex applications will have several types.


### 8. Adding Priority

Adding a priority requires a new input element. Add a **&lt;select>** input before the button we added above in **new.html**:

<pre><code>&lt;select id="priorityinput" class="form-control">
  &lt;option>1&lt;/option>
  &lt;option selected="selected">2&lt;/option>
  &lt;option>3&lt;/option>
&lt;/select>
&lt;button id="addBut">Add&lt;/button>
</code></pre>

Then modify the **#addBut** click method in **new.js** to store the priority:

<pre><code>// handle creating a new vendor
$('#addBut').on('click', function() {
  hoodie.store.add('todo', {
  title: $("#todoinput").val(),
  priority: $("#priorityinput").val()
  });
  $("#todoinput").val('');
});
</code></pre>

Again in **new.js** modify the **paint** function to show the priority:

Change ...

<pre><code>+ collection[i].title +</code></pre>

to ...

<pre><code>+ collection[i].priority + ' ' + collection[i].title +</code></pre>

At this point you should start seeing that each task listed is prefaced by a priority. Hoodie makes it pretty easy to add new fields to a store.


### 9. Sort By Priority

Our todo list would look a lot nicer if it was also listed by our new priority. So let’s change the sorting method in **new.js**:

Replace ...

<pre><code>return ( a.createdAt > b.createdAt ) ? 1 : -1;</code></pre>

... with ...

<pre><code>return ( a.priority > b.priority ) ? 1 : -1;</code></pre>

Now your number one priorities show first and you hopefully got a good first impression on the hoodie way of development.

If you would love to see another tutorial, check out [the time tracker](/tutorials/timetracker.html).