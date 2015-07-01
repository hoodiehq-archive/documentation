Hoodie Documentationn
=============

## State of Documentation
This documentation is currently work in progress. We are constantly working and reworking certain parts of our documentation for the first final release of hoodie.

Please see the https://github.com/hoodiehq/documentation/issues/87 for the roadmap.
If you need any help, feel free to add comments with questions.

## Support the Team

Your contribution can be various. Tutorials, screencasts, code examples or official hoodie techdocs. We'd be happy to have you! <3

If you want to join our great Hoodie-Docs-Team and help us ship this, ping us on `irc.freenode.net` channel `#hoodie-docs`.

## Running the doc site locally

The docs are a `gh-pages` site and run on **Jekyll**, so you'll need that for development. [Installation instructions for Jekyll are here](http://jekyllrb.com/docs/installation/). Once you've got Jekyll installed on your system, serve the docs with

```$ jekyll serve```

That will host the docs at [http://127.0.0.1:4000/](http://127.0.0.1:4000/). 

**Note:** We're in the process of refactoring the stylesheets for docs (and for the rest of the hood.ie websites, too), so please forgive us if those are currently unclear.  

## External Resources of Documentation

### Guides

* How to Deploy Hoodie (https://github.com/hoodiehq/my-first-hoodie/blob/master/deployment.md)
* How to Write Plugins for Hoodie (https://github.com/hoodiehq/hoodie-plugin-tutorial)

### Code Examples

* Using Hoodie by Todo Examples (https://github.com/snnd/todomvc-on-hoodie)


## Translations

### Structure
If you want to translate the content in your language, please copy the `en` folder in root and change the `locales` in your language (e.g. french = fr). Make sure to name your folder the same. 

### Menu + nav
The Menu and the navigation are generated dynamically. All you have to do is to set the locales in your page and make sure you have translated all the strings. All the strigs are translated in the `_config.yml`.

### Templates
Always change the 'locales' from en to your language e.g. fr. This is also needed for the right path.

### New content
If you add new content to the page, make sure to: 
- add it in your language folder
- add the link in the menu 
- add translations to the config (not for all languages, but include the structure to all. Please leave the to translated String empty)
- create an issue for the other languages seperatelly and point out exactly what you added, so the person responsible for an other specific language can translate the content.

## Note

Please do **NOT** change the content / navigation / menu structure without talking to @zoepage or creating an issue and discussing it there first.

Thank you! &lt; 3

