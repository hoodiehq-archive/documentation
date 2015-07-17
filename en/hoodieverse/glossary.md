---
layout: layout-hoodieverse
locales: en
---

# Glossary of Terms

### CouchDB/PouchDB
[CouchDB](http://couchdb.apache.org/) is a non-relational, document-based database that replicates, which means it's really good at syncing data between multiple instances of itself. All data is stored as JSON, all indices (queries) are written in JavaScript, and it uses regular HTTP as its API. It gets along wonderfully with [PouchDB](http://pouchdb.com/), the in-browser version of CouchDB, which Hoodie is currently migrating to for storing data locally, in browser.

### Global Store
The global store is where Hoodie will store data that is accessible to all users, but this hasn't been completed yet. This extra store is necessary because, by default, all user data in Hoodie is private, and encapsulated in individual little databases ([see Private User Store](#private-user-store)). This may seem a bit backwards, but Hoodie's focus is on enabling the building of web apps, not websites, so the first thing we built was the private user stores. We're adding the capability for various forms of shared, public and global data as plugins later.

### Users
Hoodie isn't a CMS, but a framework for web apps, and as such, it is very much centered around users. All of the offline and sync features are specific to each individual user's data, and each user's data is encapsulated from that of all others by default. This allows Hoodie to easily know what to sync between a user's clients and the server: simply all of the user's private data.

<a id="private-user-store"></a>
### Private User Store
Every user signed up with your Hoodie app has their own little database, which is private by default. Anything you do in the **hoodie.my** context stores its data in here. If you want other users to be able to see a user's data, you explicitly have to make it public. See [Public User Data](#public-user-data) for more on that.

<a id="public-user-data"></a>
### Public User Data
Data in a user's store is private by default, but can be made public, so that it is readable for other registered or anonymous users. This is done by adding a **public** attribute to the options object at the end of each call to a **store** function (such as **store.update**). The public attribute contains either an array of names of attributes that should be made public, or is **true** or **false**. The latter options apply to the entire object that is being created/saved/updated.

Brief example: this sets the **color** attribute of this object to public, while all other attributes remain private.

```javascript
hoodie.my.store.update("couch","abc4567", {}, {
	public: ["color"]
});
```

<a href="https://github.com/hoodiehq/hoodie.js/blob/b790bb09613e25b907af0e10a444cdcee98d910b/README.md" target="_blank">Consult the hoodie-client.js readme for more details</a>.

### Sharing

Hoodie allows users to have publicly readable data (see [Public User Data](#public-user-data)), but they will also be able to share data for collaborative editing in the near future.

### Workers

Workers are constantly running helpers that observe your hoodie app's data and do stuff for you, like receive and parse emails and turn them into todo items. Or send signup confirmation mails. Or write logs to the server. Or almost anything you can think of doing in node.js.

<a href="https://github.com/hoodiehq/documentation/blob/master/worker.md" target="_blank">Check out this tutorial on writing a basic log worker to get started with workers</a>.
