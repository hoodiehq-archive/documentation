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

To get started check out the recent version and type `npm install`.

The Hoodie website is built with [Jekyll](https://jekyllrb.com/), Jekyll requires ruby version 2.0.0 or higher.  Open a terminal and type `ruby --version` to check if ruby is installed and up to date.  If not, follow the [official download instructions](https://www.ruby-lang.org/en/downloads/).  Now install [bundler](http://bundler.io/) by running `gem install bundler` on the command line.

Once ruby and bundler are up and running, run `bundle install` to install jekyll.
Once you've got Jekyll installed on your system, serve the docs with

```
bundle exec jekyll serve --watch
```

That will host the docs at [http://127.0.0.1:4000/](http://127.0.0.1:4000/).

## Syntax Highlighting

…is done with [prism](http://prismjs.com/), and is pretty straightforward. You can defined a code block in both markdown or HTML, like this:

In Markdown, with the triple-backtick-block. Append the language to the opening backticks.
```
```javascript
console.log('badgers');
``` // Ignore this comment, it's for github's formatter
```

In HTML, with a `<pre><code>` block. Add the language to the `code` element as a class with the `language-`-prefix.
```
<pre><code class="language-javascript">
console.log('otters');
</code></pre>
```

Note that the language identifier for HTML is not `HTML`, but `markup`. We support currently support `markup`, `javascript`, `css` and `bash`.

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

Please do **NOT** change the content / navigation / menu structure without talking to [@zoepage](https://github.com/zoepage) or creating an issue and discussing it there first.

Thank you! &lt; 3
