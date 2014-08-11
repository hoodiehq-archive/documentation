---
layout: layout
---

# Hoodie's Concepts: noBackend, Offline First, Dreamcode

A major part of the magic behind Hoodie are concepts that make it so powerful. These concepts are deeply embedded in Hoodie's code and functionalities, and here's an introduction to each of them.

## Table of Content
- <a href="#Dreamcode">Dreamcode</a>
- <a href="#noBackend">noBackend</a>
- <a href="#Offline-First">Offline First</a>

### Dreamcode
Dreamcode, or Dream-Driven development, means:
1.  you dream up the most beautiful API you can
2.  dream big. Really big.
3.  get excited. A lot.
4.  built the API backwards
5.  repeat

Dreamcode in Hoodie means: that Hoodie’s API is optimized for being awesome. And it’s optimized for making the lives of frontend developers as good as possible. It’s also an API first: it’s a promise - everything else can change or is replaceable. The API is all that matters.

Forget all the constraints of today's browsers. Then write down the code of your dreams for all the tasks you need to build your app. This is dreamcode.

#### More information about Dreamcode
See [this website](http://nobackend.org/dreamcode.html) for further information and links to Dreamcode examples.

### noBackend
<p><img src="http://blog.hood.ie/wp-content/uploads/2014/07/Screen-Shot-2014-07-16-at-10.23.41.png" alt="before-no-backend"></p>
This is what building an app usually looks like: you have an idea, and you turn this idea into a static HTML prototype. It’s already working, you can click things and edit fields, but it has none of the features that usually would require a backend. If you now want to add these features, to add these features, you would need to setup a backend by yourself, or find someone who would do it for you.

Once the backend work has been done, you would get a RESTful API which then could be wired with the frontend with the jQuery Ajax methods. Then a beta version of the product could be launched, and finally, there would be a product that could generate some income.

This is how apps are built without noBackend.

<p><img src="http://blog.hood.ie/wp-content/uploads/2014/07/Screen-Shot-2014-07-16-at-11.05.07.png" alt="with-no-backend"></p>
If we compare that to the noBackend design process, we can stop, right at the frontend. – Because there is no backend, that would have to be built. There is no REST API or jQuery ajax wiring. There is nothing, you're done. Indeed, you can start charging right away. There is nothing that has to be build first. All the boring stuff is already done. This is noBackend.

noBackend is an approach to decouple apps from backends, by abstracting backend tasks with frontend code (Dreamcode). This allows frontend developers to focus on user experience and gives backend developers more flexibility on the implementation side.

It ultimately leads to backends that can be used out of the box, empowering frontend developers to build entire apps (Examples) without thinking about backend at all.

#### More information about noBackend
See [nobackend.org](http://nobackend.org/), [Examples for noBackend solutions](http://nobackend.org/solutions.html) and Twitter [@nobackend](http://twitter.com/noBackend)

### Offline First
The idea behind Offline First is pretty simple: after the rise of the internet, we’ve been building applications for this internet  - because we could. We’ve optimized those applications with the state of permanently online and connected users in mind.

If you want to see how far this has gone: have you ever been on a train? Have you ever tried to send an email from a train? Or have you ever been abroad, gotten out of your plane and trying to check your Google Maps app on your smartphone to see where you are and where to go? Or: have you ever made a screenshot of an app because you were afraid to lose data?

This is what Offline First is there to solve. Offline First means: building applications with the permanent mindset of your users not being online. This has many great advantages: apps are way faster, because they’re usable with and without internet connection. And, of course, they can *always* be used, no matter if users are online or not. And these annoying error messages disappear that tell your users “you’re offline, you can’t do anything”. And of course your users are not disappointed but happy because the user experience is amazing - and they can always do what they want, and their data is always accessible.

#### More information about Offline First
See [offlinefirst.org](http://offlinefirst.org/), [on GitHub](https://github.com/offlinefirst/) and [discussions and research](https://github.com/offlinefirst/research)
