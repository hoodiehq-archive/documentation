# Hoodie.Account

*Source: hoodie/src/lib/store/scoped.js*

This class defines the API that `hoodie.account` (local store) and `hoodie.open` 
(remote store) implement to assure a coherent API. It also implements some
basic validations.

The returned API can be called as function returning a store scoped by the 
passed type, for example

<pre>
var todoStore = hoodie.store('todo');
    
todoStore.findAll().then(showAllTasks);
todoStore.update('id123', {done: true});
</pre>

An important thing to note is that storing and accessing objects with hoodie always means accessing you personal, local objects. All stored data has a fixed association to the user who created them. So you won't be able to access other user's data by default. 

Never the less there are some community contributed solutions, available as [Hoodie Plugins](http://). Each one offers a different level of data privacy:

* [hoodie-plugin-shares](https://github.com/hoodiehq/hoodie-plugin-shares) share particular store objects, with particular rights to particular people. Also can invite people by mail.
* [hoodie-plugin-global-share](https://github.com/hoodiehq/hoodie-plugin-global-share) shares particular store objects to all people within the same application.
* [hoodie-plugin-punk](https://github.com/olizilla/hoodie-plugin-punk) share just everything to everyone within the same application.

**Attention!** Please note that most of these are community contributions and may have flaws or are just outdated. Always feel free to adopt an ophaned plugin of contribute your own.

The objects you save with the `hoodie.store` are saved to yourbrowsers local data storage. This is one of the most important key concepts of hoodie itself. Otherwise we would yet have still very limited possibilities to build offline first applications. Since hoodie is also designed to also store data on the serverside, there has to be a sync. Currently hoodie uses long polling to achieve this. In future releases, we will make use of [PouchDB](http://pouchdb.com), a [CouchDB](http://couchdb.apache.org) compatible JavaScript implemantation. 

Please note that generally, in order save objects to the server's store, you need to be logged in with a valid user. Learn more about the hoodie user system at [`Hoodie.User`](./hoodie.user.md).

## The General `options` Parameter

Most of the `hoodie.store` functions come with an `options` parameter, that is always passed as last parameter of a function call. This parameter was created to pass optional configurations to the certain function call. Like the following.

<pre>
	hoodie.store('todo').remove(id, {silent: true})
</pre>

The options that are available for most of these methods are listed below. For details on `options` parameters of particular functions, please see the section of the particular function itself.

| Option        | Values           | Default | Description  |
| ------------- |:----------------:| -------:| ------------:|
| silent        | `true`, `false`  | false   | If set to `true`, this will stop the triggers from sending events about store changes. Otherwise the store informs all listeners, when events like addig or removing a data object occurs. Using the silent option might be interesting in cases you don't want to inform the event listeners about store changes. For instance when setting up the store for the first time or just storing application irrelevant meta/configuration data. |



## Methods

### signIn
 
### signUp

### signOut

### changePassword

### changeUsername

### resetPassword

### checkPasswordReset

### destroy

### username

### authenticate
// Use this method to assure that the user is authenticated:
  // `hoodie.account.authenticate().done( doSomething ).fail( handleError )`
  
### hasAccount

### hasAnonymousAccount

### hasInvalidSession

### hasOwnProperty

### hasValidSession

### anonymousSignUp

### on


## Code Example

<pre>
</pre>
