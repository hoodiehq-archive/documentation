---
layout: layout-get-help
---

# hoodie-plugin-global-share  [![Build Status](https://travis-ci.org/hoodiehq/hoodie-plugin-global-share.png?branch=master)](https://travis-ci.org/hoodiehq/hoodie-plugin-global-share)

### Installation:

```bash
hoodie install global-share
```

### Usage:

Assuming you have a running hoodie setup.

Create a few documents you'd like to make publicly available:

```js
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

hoodie.store.add('tasks', docs).done(function(newDocs) { ... });
```

Make all 'tasks' publicly available:

```js
hoodie.store.findAll('tasks').publish();
```

or publish a single task:

```js
hoodie.store.find('tasks', 'taskID12345').publish();
```

Same goes for unpublishing:

```js
hoodie.store.findAll('tasks').unpublish();

hoodie.store.find('tasks', 'taskID12345').unpublish();
```

You can then read these documents from the `hoodie.global` store, logged in
as any user (or not logged in at all).

```js
hoodie.global.find('tasks').done(function(publicTasks) { ... });
```

### Testing:

```bash
grunt
```
