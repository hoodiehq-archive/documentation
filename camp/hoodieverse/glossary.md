---
layout: layout-hoodieverse
locales: camp
---

# Glossary of Terms

### CouchDB/PouchDB
[CouchDB](http://couchdb.apache.org/) is a non-relational, document-based database that replicates, which means it's really good at syncing data between multiple instances of itself. All data is stored as JSON, all indices (queries) are written in JavaScript, and it uses regular HTTP as its API. It gets along wonderfully with [PouchDB](http://pouchdb.com/), the in-browser version of CouchDB, which Hoodie is currently migrating to for storing data locally, in browser.

### Users
Hoodie isn't a CMS, but a backend for web apps, and as such, it is very much centered around users. All of the offline and sync features are specific to each individual user's data, and each user's data is encapsulated from that of all others by default. This allows Hoodie to easily know what to sync between a user's clients and the server: simply all of the user's private data.

<a id="private-user-store"></a>
### Private User Store
Every user signed up with your Hoodie app has their own little database, which is private by default. Anything you do in the **hoodie.store** methods stores data in here.

---

TODO:

- Client
- Server
- Plugins
