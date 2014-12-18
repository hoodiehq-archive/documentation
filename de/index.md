---
layout: layout-hoodieverse
locales: de
---

# Welcome to Hoodie

## What is Hoodie?

Hoodie is framework for frontend web applications that abstracts away the backend. If you love working in jQuery, Backbone, Dojo, Ember, or any other frontend framework, but *dread* backend work, Hoodie is for you.

> Hoodie, look ma, no backend!

Hoodie gives your frontend code superpowers, by allowing you to do things that only a backend can do (user accounts, emails, payments, etc.).

All of Hoodie is accessible through a simple script include:

<pre><code>&lt;script src="hoodie.js"&gt;&lt;/script&gt;
&lt;script type="javascript"&gt;
	var hoodie = new Hoodie("https://api.hoodieapps.com");
&lt;/script&gt;</code></pre>
Hoodie is a frontend abstraction of a generic backend web service. Hoodie is agnostic to your choice of frontend application framework.

For example, you can use jQuery for your web app, Hoodie for your connection to the backend, say, instead of raw 
jQuery.xhr. You can also use Backbone on top of Hoodie, or any other framework, even vanilla.js.


## Open Source

<a href="http://github.com/hoodiehq" target="_blank">The source code for Hoodie is available on GitHub</a> under the Apache License 2.0.