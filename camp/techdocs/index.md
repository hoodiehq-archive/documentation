---
layout: layout-api
locales: camp
---

# Hoodie API Guide

The Hoodie Guide is a special version of the API documentation for beginners, intermediates and advanced programmers who want to have a nicely documented API with additional information and code examples. For now, it covers the core client API, as well as some of the plugins contributed by the Hoodie project itself.

## 1. The Hoodie Client API

This library, commonly called **hoodie.js**, is what you'll be working with on the client side. It consists of:

- [The Hoodie API](/en/techdocs/api/client/hoodie.html), which has a couple of useful helpers for connectivity and event handling
- [The account API](/en/techdocs/api/client/hoodie.account.html), which lets you do user authentication, such as signing users up, in and out
- [The store API](/en/techdocs/api/client/hoodie.store.html), which provides means to store and retrieve data for each individial user

## 2. The APIs of Some Basic Hoodie Plugins

We produce some plugins for Hoodie ourselves, and some of them have detailed API docs here. Plugins can deal with any number of things, since [Hoodie is extendable on basically all fronts](/en/plugins/tutorial.html), but here we're just covering some so-called *core plugins*, which are included in every Hoodie installation by default.
