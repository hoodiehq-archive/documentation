---
layout: layout-api
locales: camp
---
# hoodie.global
**source:**     <a href="https://github.com/hoodiehq/hoodie-plugin-global-share" target="_blank">hoodiehq/hoodie-plugin-global-share</a>

Lets you make documents globally available to any user or unregistered visitor.

### Installation:

```bash
$ hoodie install global-share
```

### Usage:

Assuming you have a running hoodie setup.

Create a few documents you'd like to make publicly available:

```javascript
var docs = [
  {
    name: 'sleep'
  },
  {
    name: 'eat'
  },
  {
    name: 'sleep some more'
  }
];

hoodie.store.add('tasks', docs)
	.done(function(newDocs) { ... });
```

Make all **tasks** publicly available:

```javascript
hoodie.store.findAll('tasks').publish();
```

or publish a **single task**:

```javascript
hoodie.store.find('tasks', 'taskID12345').publish();
```

Same goes for **unpublishing**:

```javascript
hoodie.store.findAll('tasks').unpublish();
hoodie.store.find('tasks', 'taskID12345').unpublish();
```

You can then read these documents from the **hoodie.global** store, logged in
as any user (or not logged in at all).

```javascript
hoodie.global.find('tasks')
	.done(function(publicTasks) { ... });
```

### Testing:

```bash
$ grunt
```
