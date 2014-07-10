# Getting Started with Hood.ie


### Step One - Installing Hoodie (on OS X)

Installing Hoodie on Mac OS X requires Homebrew (http://brew.sh/). Homebrew is a package manager for OS X, and makes installing things as easy as:

```
brew install [package]
```

So with that in mind, our first step is to make sure that our homebrew package library is up to date with:

```
brew update
```

Then we'll pull in Hoodie's dependencies with the following command:

```
brew install git node couchdb
```

These modules are what power Hoodie, and each have their own roles.

**Git** is a distributed version control software that Hoodie uses to store the Hoodie source code, and using it within Hoodie allows us to keep the installation process simple, and grab the latest files from our repositories.

**Node** is a way for Hoodie to be developed using JavaScript on every layer, as it provides a runtime that can be run across operating systems with no changes. It's fantastic for server-side and networking applications, and suits Hoodie well.

**CouchDB** is a NoSQL database that stores its data in JSON format, and JavaScript as its query language, which is great from Hoodie's point of view because, alongside **Node**, it allows really powerful handling of data in JavaScript.

When you install **Node** via **Homebrew**, **npm** comes bundled with it. **npm** is a fantastic package manager for all CommonJS applications (CommonJS being JavaScript being used outside the browser), and it's how we'll install Hoodie.

```
npm install -g hoodie-cli
```

Notice that we passed npm a *-g* option. This tells npm to install the module *globally*, and this allows you to not be confined to a specific place to run the hoodie commands. It also highlights another strength of **npm**, as we can actually have different versions of the same npm module installed on our computer for compatibility reasons with different apps. If we don't pass the *-g* option, then the module is installed inside a *node_modules/* folder within the folder you are in, which can be really handy if a module hasn't been updated to use the latest version of something.

However for our purposes, a global install works best, and now we can move on to the next step.

### Step Two - Create Hoodie Project

You’ll need a folder for your project. Hoodie command line interface does this and populates it with the required files and folders.

In my case, in a folder I typed:

```
hoodie new hoodietut
```

You’ll be prompted for an admin password.


### Step Three - Start Your App and Test It

From the command line type

```
hoodie start
```

and it opened up a browser tab at

```
http://127.0.0.1: 6004
```

You should see a hoodie app in your browser with a subtitle of ‘hoodie playground’. This ‘test’ shows that hoodie is working.

The command line output also shows you this information which you’ll use later:

```
CouchDB started: http://127.0.0.1:6006
Admin: http://127.0.0.1:6005
```

### Step Four - Play with the App

The demo todo app shows off what you can do with hoodie. You will probably notice that it looks like a Bootstrap app. Though the app uses Bootstrap, hoodie has no dependency on Bootstrap and any CSS framework can be used.

In the upper right, there is a drop down for Sign Up. Click on it and created an account with username and password. Now you should login because only then will data be saved.

Type in a few todos like “learn hoodie” and “steps 5, 6, 7 and 8”. You should see your todos displayed.

Nice to see a hoodie demo after just three steps!


### Step Five - Tabs for CouchDB and Admin

The hood.ie demo app is already opened in your browser. Start two more tabs for CouchDB and admin. For CouchDB I wanted to see the Futon app, so these where the two urls I used:

```
http://127.0.0.1:6006/_utils
http://127.0.0.1:6005
```

While I did not use the admin *(:6005)* yet, it was good to know it was there. You don’t need Couchdb except for monitoring the hoodie magic.


# Part Two: Make Hoodie Your Own: Go Nuts

In the next several steps the todo app will be modified to give todos a priority of 1, 2 or 3. The list of todos will be sorted on priority.


### Step Six - Open your text editor

At this point the hood.ie site tells you to “go nuts”.  There are a few more steps you need to take before you can write your own hoodie app.

In my case, I started sublime text with a new project for /dalyapps/hoodietut. This was the folder created by hoodie in Step Two.

You should see folders of data, node_modules and www. Hoodie command line has set up files for both hoodie and the demo todo app.

We are going to be working in assets folder of www.


### Step Seven - Edit your first hoodie files

To start creating you own App there are two files you’ll want to copy. In /hoodietut/www/ copy index.html and name the copy new.html. In /www/assets/assets/ copy main.js and rename the copy to new.js.

In sublime (your text editor) open new.html. On the last line you’ll see

```html
<script src="“assets/main.js”"></script>
```

Change that line from main.js to new.js

```html
<script src="“assets/new.js”"></script>
```

Open a new tab in the browser and go to

```
http://127.0.0.1:6004/new.html
```

This displays the file you just copied.

In the start of the body you’ll see the line “hoodie playground”. Modify that to read “my first hoodie app”. When you reload the browser you should see your first modification to a a hoodie app.


### Step Eight - Button Please

The demo todo app lets you type in a new todo. It saves it when you hit the Return key. This works fine for a single input. But more because priority will be a new input, a submit button would be a more appropriate.

First, add a button to the new.html file. Look for the text input - search for “todoinput”. In the line after that add a button with an id. I used:

```html
<button id=“addBut”>Add</button>
```

Second, change new.js so the addTodo is triggered when the button is clicked instead of on keypress. Replace the six lines of code after //handle creating a new task with

```javascript
// handle creating a new vendor
$('#addBut').on('click', function() {
  hoodie.store.add('todo', {title: $("#todoinput").val()});
  $("#todoinput").val('');
});
```

The first line here looks for a click on our button. When the button is clicked second line adds a new task into hoodie using the hoodie.store.add method. This method takes two parameters: type and a data object where the task is defined. The third line clears the input.

Save these files and run your modified app at:

```
http://127.0.0.1:6004/new.html
```

Enter a new task. You should see it displayed when clicking on the “Add” button.

### Step Nine - Understanding Type

Type is an important convention to understand when working with Hoodie or Couchdb. Type is a convention to deal with the lack of schemas in Couchdb.

In Couchdb the same database can contain a wide variety of different records. For example, you might have records on people and records on location. Type is used to distinguish one record from another. So the people records would have fields like fist name, last name, etc and a record called “type” with a value of “people”. The location record would have fields like street, country, etc and a record called “type” with a value of “location”

Hoodie uses type the same way. It is a way to store different ‘types’ of records in the same database. In this demo only the “todo” type is used.

So while type is not critical for this application, more complex application will have several types.


###Step Ten - Adding Priority

Adding a priority requires an new input field, adding it to the display and modifying the add method we just worked with.

In **new.html** add a select input before the button we added above:

```html
<select id="priorityinput" class="form-control">
  <option>1</option>
  <option selected="selected">2</option>
  <option>3</option>
</select>
<button id="addBut">Add</button>
```

Then in **new.js** modify the addBut handle to store the priority.

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

Also in *new.js* modify the **addTodo** function to show the priority.

```javascript
function addTodo( todo ) {
  $('#todolist').append('<li>'+todo.priority+' '+todo.title+'</li>');
}
```

At this point you should start seeing each task listed prefaced by a priority. Hoodie makes it pretty simple to add new fields to a store.


### Step Eleven - Sort By Priority

Out todo list would look a lot nicer if they were listed by priority. So lets change the sort in *new.js*.

```
function sortByCreatedAt(a, b) {
  return a.priority > b.priority;
}
```

Now your number one priorities show first.