---
layout: layout-tutorials
locales: en
---

# Getting started with Hoodie - Part 2

This guide will explain the code in the default Hoodie app, and then we'll modify the code a bit to add some new features. Afterwards, you should have a pretty good idea of how Hoodie works, and a good starting point for exploring the [docs](/en/techdocs/), the other [tutorials](/en/tutorials/), or just hacking away.

If you experience any problems at any step of this doc, please check our <a href="http://faq.hood.ie" target="_blank">FAQ</a> or <a href="http://hood.ie/chat" target="_blank">get in touch with us on IRC or Slack</a>.

### Prerequisites

You should have [installed Hoodie and its prerequisites](/en/start/) and read the [first part of this guide](/en/start/getting-started/getting-started-1.html). We'll be looking at the Hoodie app you created in that.

In case you skipped this step, here's the super short summary of how to create a new Hoodie app and run it:

```bash
$ hoodie new hoodietut
$ cd hoodietut
$ hoodie start
```
That should open the default Hoodie app in your browser.

### 1. Features of the Default Hoodie App

It's a simple todo-app designed to show you some of the basics of Hoodie. It's built with jQuery and Bootstrap for speed and simplicity. You can sign up, in and out, you can add todo items, and you can check them off.

#### 1.1 Signing Up / Anonymous Use

In the upper right, there is a drop down for **Sign Up**. Click on it and create an account with your desired username and password. After that you should be logged in automatically, and now your todos will be saved to the database. If you sign in from a different browser, your todos will appear there, too.

If you use the app *without* signing up and/or in, you're an **anonymous user**. Your todos will get saved locally, in your browser, and they'll still be there when you reload the page, but they won't get saved to the server, and you won't be able to see them from anywhere else. Also, they'll vanish forever when you clear your browser store.

You can use a Hoodie app as an anonymous user first, and once you decide to sign up, your data will automatically be moved to your proper account and synced.

Go ahead, add a couple of todos!

#### 1.2 Syncing

Once you're signed in to a Hoodie app, **Hoodie will constantly try to keep your user data in sync** between the server and any client that user may be signed in to. To see this happening, open the app's URL in a different Browser, or in incognito mode (so you won't be signed in automatically). Sign in to the second instance of the app with the same credentials, and when you add a todo in either tab, it should appear in the other within a few seconds. Keep that second tab open for now.

#### 1.3 Offline support

[We strongly believe that apps shouldn't break just because they're offline](/en/hoodieverse/hoodie-concepts.html#offline-first). So naturally, this todo app also works offline. Give it a try:

In the terminal, turn off the Hoodie server with **ctrl+c** (Mac) or **alt+c** (Windows).

In one of the tabs, add a few todos. You'll notice two things:

1. You were able to add new todos despite the app's server being down. No error messages! It just works. Yay!
2. If you check the second tab, the new todos won't have shown up. They can't, since all the syncing happens through the server, which you just turned off. Boo you. But just for kicks, add some new todos here too.

And now, let's turn the server back on again (the **-n** option prevents a new browser tab being opened):

```bash
$ hoodie start -n
```
**Now observe the two tabs**: they should sync up with the server, and both should show all the todos you entered while offline. Preeetty nice, we think.

**Hoodie apps are super robust even in bad networks**, and you get two big user experience bonuses:

1. No frustrating error messages when going offline during use
2. Your users can always access their own data, even when offline

The code to make this work must be super complex, right? You'll be surprised…

### 2. The Code

Let's take a look at how the todo app uses Hoodie. Open

```bash
www/assets/js/main.js
```

in your editor of choice.

At the very top, we **initialise Hoodie** and assign it to a var, so we can call its methods:

```javascript
var hoodie  = new Hoodie();
```

#### 2.1 Adding a New Todo Object

Now scroll to the end of the file, where we **handle adding a new todo** to the Hoodie store. This will save the todo in the currently logged in user's own [little private database](/en/hoodieverse/glossary.html#private-user-store). It'll get synced to the server, and it'll get synced back whenever the user logs in to the app again.

```javascript
$('#todoinput').on('keypress', function(event) {
  if (event.keyCode === 13 && event.target.value.length) {
    hoodie.store.add('todo', {title: event.target.value});
    event.target.value = '';
  }
});
```

The inside of the if statement is where all the action is: we're calling Hoodie's **store.add()** method and passing two values:

1. **The type** of the object we're adding to the store. The type is just an arbitrary string, in this case **todo**.
2. **The object itself**. This is an arbitrary JavaScript object, with keys and values. Here, it has one key, **title**, which holds the actual todo text.

And that, fundamentally, is it.

```javascript
hoodie.store.add(type, object);
```

One line. That stores your todo in the local browser store, and Hoodie will take care of syncing it to wherever it needs to be. Pretty simple, right? **add()** also [returns some promises](/en/techdocs/api/client/hoodie.store.html#storeadd) so you can check if it worked, but let's skip that for now.

<a id="understanding-type"></a>
#### 2.2 A Short Aside: Understanding Type

**Type** is a fundamental convention to deal with the lack of schemas in CouchDB, which is the database system that Hoodie uses.

In CouchDB, the same database can contain a wide variety of different records, none of which have to be defined in advance. For example, you might have records on people and records on location. The type attribute is used to distinguish these… well, *types* of records from each other. Here are some (abridged and fictional) objects that Hoodie might write to CouchDB:

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

You'll notice that these are, again, just JavaScript objects. Throughout your entire Hoodie app, all data is always just JavaScript objects. But back to type:

**Type is essential to give your schemaless data some structure**, so when you want to fetch all locations, for example, you can easily do so.

<a id="updating-the-view"></a>
#### 2.3 Updating the View

So far, we've only seen how the app *stores* the new todo after it's been entered, but not how it's actually being *displayed*. Take a look at the code right above the listener we just looked at, near the end of **main.js**:

```javascript
// when a todo changes, update the UI.
hoodie.store.on('todo:add', todos.add);
hoodie.store.on('todo:update', todos.update);
hoodie.store.on('todo:remove', todos.remove);
```

What's happening here? We're listening to some events emitted by the Hoodie store. Look at the first one: **todo:add**. That gets fired whenever a new object with the type *todo* is added. Simple, hm? The others should be self-explanatory now. When this listener fires, it calls a method that updates the model (an array of objects called **collection**) and then the view. *There is no direct connection between the todo input and the todo list*.

So we've neatly decoupled *adding* a todo from *displaying* a new todo, and this gets us all the fancy syncing action we saw previously, *for free*. **There's no extra code to make syncing work**. When a new todo arrives in the in-browser storage, the **todo:add** event gets fired, and the view updates. With this code, you don't have to care about *where* the todo came from (the current client, or the one in that other tab, or another on a phone), the app will handle it regardless.

We strooooongly suggest you use this decoupled structure when building your own apps. It really unlocks the power of Hoodie!

### 3. Let's Modify the Todo App

In the next several steps our demo todo app will be modified to give todos a priority of **urgent**, **normal** or **later**.

#### 3.1 Adding an Add-Button

The todo app lets you type in new todos and saves them when you hit the return key. This works fine for a single input, but as we will be adding another form input for the todo priority, a submit button will be more appropriate.

First add a button to the **www/index.html** file. Look for the text input with the id **todoinput**. In the line after it add a button with the id **add-todo**:

<pre><code class="language-markup">&lt;button id="add-todo">Add New Todo&lt;/button></code></pre>

Second, change the **main.js** file so a new todo is added when the button is clicked instead of when return is pressed. Replace the last code block in the file with this:

<pre><code class="language-javascript">// handle creating a new task
$('#add-todo').on('click', function() {
  hoodie.store.add('todo', {title: $("#todoinput").val()});
  $("#todoinput").val('');
});
</code></pre>

The first line binds to a click on our newly created button. When the button is clicked the second line adds a new todo using the **hoodie.store.add** method. The third line within our new function clears the input.

Save the two files and refresh your browser. Enter a new task. You should see it rendered after clicking the **Add New Todo** button.

Now we're ready to change the interface and the data model.

#### 3.2. Adding Priority

Adding a priority requires a new input element. Insert this right above the new button we just added in **www/index.html**:

<pre><code class="language-markup">&lt;select id="priorityinput" class="form-control">
  &lt;option>Urgent&lt;/option>
  &lt;option selected="selected">Normal&lt;/option>
  &lt;option>Later&lt;/option>
&lt;/select>
&lt;button id="add-todo">Add&lt;/button>
</code></pre>

Now modify the click method in **main.js** to store the priority:

```javascript
// handle creating a new task
$('#add-todo').on('click', function() {
  hoodie.store.add('todo', {
    title: $("#todoinput").val(),
    priority: $("#priorityinput").val()
  });
  $("#todoinput").val('');
});
```

In the same file, modify the **paint()** function to display the priority:

Change

```javascript
+ collection[i].title +
```

to

```javascript
+ collection[i].priority + ': ' + collection[i].title +
```

Save everything and try it!

At this point you should start seeing that each *new* task is prefaced by a priority. Because there's no database schema, **it's super simple to add new values to objects in Hoodie** without having to think about the database or the data structure.

However, if you haven't ticked off all the tasks you created before we added the priority selector, those will now render "undefined:" in place of a priority. Not cool. This is the flipside of simply changing the data structure on the fly. In a traditional database, you'd do a data model migration in the database and add a priority of **normal** to all todos that don't already have one. But since we're running a system that distributes copies of each users' database to any number of devices, *we can't do that*. We don't even know how many databases there are, or where.

One solution to this problem is to build a robust view that simply deals with missing fields:

<pre><code class="language-javascript">
var todo = collection[i];
todo.priority = todo.priority || 'Normal';

var $li = $('&lt;li&gt;' +
                 '&lt;input type="checkbox"&gt;' +
                    '&lt;label&gt;&lt;/label&gt;' +
                 '&lt;/input&gt;' +
                 '&lt;input type="text"&gt;&lt;/input&gt;' +
            '&lt;/li&gt;'
            );


var label = todo.priority + ': ' + todo.title;

$li.data('id', todo.id);
$li.find('label').text(label);
$li.find('input[type="text"]').val(label);

$el.append($li);
</code></pre>

If you're still in the prototyping/testing phase and you want to start with a fresh database, you could also just stop the server, delete the **data** folder in the project root, restart the server, and sign up in the app again.

### 4. Conclusion

We've only briefly touched **hoodie.store.add** and **hoodie.store.on**, but that should already give you a pretty good idea of how Hoodie works, and how your app could be structured. You've also seen that Hoodie's got your back with regard to cross-device syncing and offline support. You now know how users work, and if you spend a bit more time with **main.js**, you'll come across [hoodie.store.findAll](/en/techdocs/api/client/hoodie.store.html#storefindall) and learn how to load data from Hoodie, too.

If you'd like to try another tutorial, check out [the time tracker](../tutorials/timetracker.html).

#### How did it go?

We'd love to hear your feedback on this guide, and whether it helped you. Feel free to <a href="http://hood.ie/chat" target="_blank">get in touch with us on IRC or Slack</a>.

We also have an <a href="http://faq.hood.ie" target="_blank">FAQ</a> that could prove useful if things go wrong.

If you find this guide in error or out of date, you could also <a href="https://github.com/hoodiehq/documentation/issues" target="_blank">open an issue</a> or submit a pull request with your corrections to <a href="https://github.com/hoodiehq/documentation/blob/gh-pages/en/tutorials/index.md" target="_blank">this file</a>.

Thanks for your interest and time!

And here's your congratulatory chicken:

![Dooooc doc doc doc](/src/img/doc-doc-chicken.png)
