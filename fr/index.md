---
layout: layout-hoodieverse
locales: fr
---

# Bienvenue chez Hoodie

## Qu'est Hoodie?

Hoodie est un environnement pour le développement d'applications web dans le navigateur qui fait abstraction du serveur. Si vous adorez travailler en jQuery, Backbone, Dojo, Ember, ou dans un autre environnement navigateur, mais que vous *détestez* travailler sur le serveur, Hoodie est ce qu'il vous faut.

> Avec Hoodie, ça tient sans serveur!

Hoodie donne des superpouvoirs à votre code, en vous permettant de faire dans le navigateur des choses que seul un serveur sait faire (comptes utilisateurs, mails, paiements, etc.).

Tout ce qu'offre Hoodie est disponible via un include de script tout simple:

<pre><code>&lt;script src="hoodie.js"&gt;&lt;/script&gt;
&lt;script type="javascript"&gt;
  var hoodie = new Hoodie();
&lt;/script&gt;</code></pre>

Hoodie est une abstraction dans le navigateur d'un service web générique de serveur. Hoodie vous laisse libre de votre choix d'environnement applicatif dans le navigateur.

Par exemple, vous pouvez utiliser jQuery pour votre appli web, et Hoodie pour votre connexion au serveur à la place de, disons, jQuery.xhr. Vous pouvez aussi utiliser Backbone au-dessus de Hoodie, ou n'importe quel autre environnement, mème du Javascript de base.

## Logiciel Libre

<a href="http://github.com/hoodiehq" target="_blank">Le code source de Hoodie est disponible sur GitHub</a> sous la licence Apache 2.0.
