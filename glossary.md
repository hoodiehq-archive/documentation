---
layout: layout-get-help
---

# Glossary of Terms

* ##CouchDB

* ##Global Store

	The global store doesn't exist yet.

* ##Hoodie App

* ##User

* ##Private User Store

	Every user signed up with your hoodie app has their own little database, which is private by default. Anything you do in the `hoodie.my` context stores its data in here. If you want other users to be able to see a user's data, you explicitly have to make it public. See **Public User Data** for more on that.

* ##Public User Data

	Data in a user's store is private by default, but can be made public, so that it is readable for other/anonymous users. This is done by adding a `public` attribute to the options object at the end of each call to a `store` function (such as `store.update`). The public attribute contains either an array of  names of attributes that should be made public, or is `true` or `false`. The latter options apply to the entire object that is being created/saved/updated.

	Brief example: this sets the `color` attribute of this object to public, while all other attributes remain private.

	`hoodie.my.store.update("couch","abc4567", {}, {public: ["color"]})`

	[Consult the hoodie-client.js readme for more details.](https://github.com/hoodiehq/hoodie-client.js/blob/b790bb09613e25b907af0e10a444cdcee98d910b/README.md)

* ##Sharing

	Hoodie allows users to have publicly readable data (see **Public User Data**), but they will also be able to share data for collaborative editing in the near future.

* ##Workers

	Workers are constantly running helpers that observe your hoodie app's data and do stuff for you, like receive and parse emails and turn them into todo items. Or send signup confirmation mails. Or write logs to the server. Or almost anything you can think of.

	[Check out this tutorial on writing a basic log worker to get started with workers.](https://github.com/hoodiehq/documentation/blob/master/worker.md)


