---
layout: layout-api
locales: en
---

# hoodie-plugin-global-share  <a href="https://travis-ci.org/hoodiehq/hoodie-plugin-global-share" target="_blank" class="no-underlining"><img src="https://travis-ci.org/hoodiehq/hoodie-plugin-global-share.png?branch=master" /></a>

### Installation:

<pre><code>hoodie install global-share</code></pre>

### Usage:

Assuming you have a running hoodie setup.

Create a few documents you'd like to make publicly available:

<pre><code>var docs = [
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
</code></pre>

Make all **tasks** publicly available:

<pre><code>hoodie.store.findAll('tasks').publish();</code></pre>

or publish a **single task**:

<pre><code>hoodie.store.find('tasks', 'taskID12345').publish();</code></pre>

Same goes for **unpublishing**:

<pre><code>hoodie.store.findAll('tasks').unpublish();
hoodie.store.find('tasks', 'taskID12345').unpublish();
</code></pre>

You can then read these documents from the **hoodie.global** store, logged in
as any user (or not logged in at all).

<pre><code>hoodie.global.find('tasks')
	.done(function(publicTasks) { ... });</code></pre>

### Testing:

<pre><code>grunt</code></pre>
