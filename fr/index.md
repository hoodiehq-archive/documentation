---
layout: layout-hoodieverse
locales: fr
---

# Bienvenue à Hoodie

## Qu'est-ce que Hoodie&#x202F;?

Hoodie est un kit bibliothèque/serveur pour le frontend des applications web qui abstrait le backend. Si vous aimez travailler avec jQuery, Backbone, Dojo, Ember, ou tout autre framework frontend, mais êtes *terrifié* par le travail sur le backend, Hoodie est pour vous.

Hoodie vous donne des super-pouvoirs de code frontend, en vous permettant de faire des choses qu'habituellement seul le backend peut faire (comptes utilisateurs, emails, paiements, etc.).

L'intégralité de Hoodie est accessible grâce à une simple inclusion de script, comme pour jQuery ou lodash&#x202F;:

<pre><code class="language-markup">&lt;script src="hoodie.js"&gt;&lt;/script&gt;
&lt;script type="javascript"&gt;
  var hoodie = new Hoodie();
&lt;/script&gt;</code></pre>

A partir de là, le code devient très expressif, très rapidement&#x202F;:

```javascript
// In your front-end code:
hoodie.account.signUp(username, password);
```

Enregistrer un nouvel utilisateur est aussi simple que ça, par exemple. Quoiqu'il en soit&#x202F;:

**Hoodie abstrait un webservice backend générique, côté frontend**. En tant que tel, il est agnostique quant à votre choix de framework de frontend. Par exemple, vous pouvez utiliser jQuery pour votre application web and Hoodie pour votre connexion au backend, au lieu de jQuery.xhr brut. Vous pourriez aussi [utiliser Backbone avec Hoodie comme data store](https://github.com/hoodiehq/backbone-hoodie), ou en fait n'importe quel autre framework frontend. Des efforts sont en cours pour ajouter le support de Hoodie à [Angular](https://www.npmjs.com/package/hoodie-plugin-angularjs) et [Ember](https://github.com/gr2m/ember-hoodie-adapter).

## Open Source

Hoodie est un projet Open Source, nous ne le possédons donc pas, ne pouvons le vendre, et il ne disparaîtra pas soudainement parce que nous avons été racheté. <a href="http://github.com/hoodiehq" target="_blank">Le code source de Hoodie est disponible sur GitHub</a> sous licence Apache License 2.0.

## Comment procéder

Vous pouvez [lire quelques-uns des concepts derrière Hoodie](/fr/hoodieverse/hoodie-concepts.html), comme noBackend ou Offline First. Ils expliquent pourquoi Hoodie existe et les raisons de son apparence et de son fonctionnement.

Si vous êtes plus intéressés par les détails techniques de Hoodie, allez voir [Comment Hoodie fonctionne](/fr/hoodieverse/how-hoodie-works.html). Apprenez comment Hoodie gère le stockage des données, les synchronise et d'où vient le support du mode "offline".

Pressé de coder&#x202F;? Sautez directement au [guide d'installation](/fr/start/)&#x202F;!
