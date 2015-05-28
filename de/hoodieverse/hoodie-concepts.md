---
layout: layout-hoodieverse
locales: de
---
# Hoodie's Concepts: noBackend, Offline First, Dreamcode

A major part of the magic behind Hoodie are concepts that make it so powerful. These concepts are deeply embedded in Hoodie's code and functionalities, and here's an introduction to each of them.

## Table of Contents
- <a href="#dreamcode">Dreamcode</a>
- <a href="#nobackend">noBackend</a>
- <a href="#offline-first">Offline First</a>

<p><a id="dreamcode"></a></p>
### Dreamcode
Dreamcode, or Dream-Driven development, means:<br />
1.  you dream up the most beautiful API you can<br />
2.  dream big. Really big.<br />
3.  get excited. A lot.<br />
4.  built the API backwards<br />
5.  repeat<br />

Dreamcode in Hoodie means: that Hoodie’s API is optimized for being awesome. And it’s optimized for making the lives of frontend developers as good as possible. It’s also an API first: it’s a promise - everything else can change or is replaceable. The API is all that matters.

Forget all the constraints of today's browsers. Then write down the code of your dreams for all the tasks you need to build your app. This is dreamcode.

##### More information about Dreamcode
See <a href="http://nobackend.org/dreamcode.html" target="_blank">this website</a> for further information and links to Dreamcode examples.

<br />
<p><a id="nobackend"></a></p>
### noBackend
**This is what building an app usually looks like:** you have an idea, and you turn this idea into a static HTML prototype. It’s already working, you can click things and edit fields, but it has none of the features that would usually require a backend. If you now want to add these features, you would need to setup a backend by yourself, or find someone who would do it for you.

Once the backend work has been done, you would get a RESTful API which then could be wired with the frontend with the jQuery Ajax methods. Then a beta version of the product could be launched, and finally, there would be a product that could generate some income.

**This is how apps are built without noBackend.**   
If we compare that to the noBackend design process, we can stop, right at the frontend. Because there is no backend, that would have to be built. There is no REST API or jQuery Ajax wiring. There is nothing, you're done. Indeed, you can start charging right away. There is nothing that has to be build first. All the boring stuff is already done. This is noBackend.

noBackend is an approach to decouple apps from backends, by abstracting backend tasks with frontend code (Dreamcode). This allows frontend developers to focus on user experience and gives backend developers more flexibility on the implementation side.

It ultimately leads to backends that can be used out of the box, empowering frontend developers to build entire apps (<a href="http://hood.ie/#showcases" target="_blank">examples</a>) without thinking about backend at all.

##### More information about noBackend
See <a href="http://nobackend.org/" target="_blank">nobackend.org</a>, <a href="http://nobackend.org/solutions.html" target="_blank">Examples for noBackend solutions</a> and Twitter <a href="http://twitter.com/noBackend" target="_blank">@nobackend</a>

<br />
<p><a id="offline-first"></a></p>
### Offline First
The idea behind Offline First is pretty simple: after the rise of the internet, we’ve been building applications for this internet  - because we could. We’ve optimized those applications with the state of permanently online and connected users in mind.

If you want to see how far this has gone: have you ever been on a train? Have you ever tried to send an email from a train? Or have you ever been abroad, gotten out of your plane and trying to check your Google Maps app on your smartphone to see where you are and where to go? Or: have you ever made a screenshot of an app because you were afraid to lose data?

This is what Offline First is there to solve. Offline First is a concept and means: building applications with the permanent mindset of your users not being online. This has many great advantages: apps are way faster, because they’re usable with and without internet connection. The files are cached and do not need to be downloaded at every reload. And, of course, they can *always* be used, no matter if users are online or not. These annoying error messages disappear that tell your users “you’re offline, you can’t do anything”. That's why your users are not disappointed but happy because the user experience is amazing - and they can always do what they want, and their data is always accessible.

##### More information about Offline First
See <a href="http://offlinefirst.org/" target="_blank">offlinefirst.org</a>, <a href="https://github.com/offlinefirst/" target="_blank">on GitHub</a> and <a href="https://github.com/offlinefirst/research" target="_blank">discussions and research</a>

### Mindblowing right?
Now lets check out the <a href="system-requirements-browser-compatibilities-prerequisites-before-getting-started-with-hoodie.html">requirements</a> for Hoodie.
