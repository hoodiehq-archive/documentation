---
layout: layout-hoodieverse
locales: fr
---
# Concepts fondamentaux de Hoodie&#x202F;: Dreamcode, noBackend et Offline First

Hoodie a été conçu autour de quelques convictions et concepts fondamentaux, et ils entrainent beaucoup des choix faits dans le code et les fonctionnalités. Ce sont&#x202F;:

- [Dreamcode](#dreamcode)
- [noBackend](#nobackend)
- [Offline First](#offline-first)

<a id="dreamcode"></a>

### Dreamcode

Lors du design de l'API de Hoodie, nous avons réalisé que nous voulions faire plus que simplement exposer du code serveur au frontend. **Nous voulions réduire la complexité, pas la déplacer**. Et pour rendre quelque-chose simple et intuitif, vous ne pouvez pas commencer par la couche technique, vous devez commencer par les humains qui vont l'utiliser. A quoi ressemblerait l'API de leur rêve&#x202F;? Dreamcode est essentiellement le design d'API centré sur les utilisateurs.

Pour faire simple&#x202F;: **l'API de Hoodie est optimisée pour être formidable**. Pour être intuitive et accessible. Et elle est optimisée pour faciliter autant que possible la vie des développeurs frontend. C'est aussi une API en premier lieu&#x202F;: c'est une promesse - tout le reste peut changer et est remplaçable. L'API est tout ce qui compte.

Oubliez les contraintes des navigateurs d'aujourd'hui. Écrivez le code de vos rêves pour toutes les tâches qui sont requises pour construire votre application. L'implémentation derrière l'API n'importe pas, elle peut être simple ou compliquée, mais de manière cruciale&#x202F;: les utilisateurs ne devrait pas avoir à s'en préoccuper. C'est ça le dreamcode.

**Tout est compliqué jusqu'à ce que quelqu'un le rende facile**. Nous rendons le développement web facile.

Voici <a href="http://nobackend.org/dreamcode.html" target="_blank">un peu plus d'information et de liens vers des exemples Dreamcode</a>.

<a id="nobackend"></a>

### noBackend

Le côté serveur est compliqué. Le côté base de donnée est compliqué. Les interactions entre le client et le serveur sont compliquées, il y a beaucoup de pièces mobiles, il y a bien des erreurs amusantes à faire, et **le ticket d'entrée au développement web est, à notre avis, inutilement élevé**. Vous ne devriez pas avoir à être un développeur full stack pour construire un prototype fonctionnel, ou coder un petit outil pour vous ou votre équipe, ou lancer un simple PMV (Produit Minimum Viable, MVP - NdT).

Les gens construisent des applications web depuis un certain temps déjà, et les opérations basiques (s'enregistrer, se connecter, se déconnecter, stocker et récupérer des données, etc.) ont dû être écrites des millions de fois depuis le temps. Ces choses ne devraient plus être difficiles désormais. Alors nous proposons Hoodie comme une solution noBackend. Oui, il y a effectivement un backend, mais vous ne devriez pas avoir à vous en préoccuper. Vous n'avez pas à le planifier et à le configurer. Vous n'avez tout simplement pas à vous préoccuper de ses opérations de base, vous pouvez toutes les réaliser depuis l'API frontend de Hoodie. Bien entendu, nous vous laissons creuser autant que vous le souhaitez, mais pour commencer, vous n'en avez pas besoin.

noBackend vous donne le temps de travailler sur les problèmes complexes, les parties de votre applications qui ont une complexité justifiée et qui ne peut pas être abstraite, comme l'interface, l'expérience utilisateur, les choses qui font de votre produit ce qu'il est.

Avez Hoodie, vous faire le scaffolding de votre application avec

<pre><code class="language-bash">$ hoodie new best-app-ever</code></pre>

et vous êtes prêt à commencer. Enregistrer les utilisateurs, stocker les données… tout est là, immédiatement. C'est un backend prêt à l'emploi, permettant aux développeurs frontend de construire des applications entières sans avoir à penser aucunement au backend. Vous pouvez consulter <a href="http://hood.ie/#showcases" target="_blank">les applications exemple de Hoodie</a> si vous voulez voir un peu de code.

##### Plus d'information sur noBackend
Consultez <a href="http://nobackend.org/" target="_blank">nobackend.org</a>, <a href="http://nobackend.org/solutions.html" target="_blank">Des exemples de solutions noBackend</a> et <a href="http://twitter.com/noBackend" target="_blank">@nobackend</a> sur Twitter.

<a id="offline-first"></a>

### Offline First
Nous faisons des sites web et des applications pour le web. L'objectif est d'être en ligne, d'accord&#x202F;? Nous sommes en ligne quand nous construisons ces choses, et nous partons généralement du principe que les utilisateurs sont dans un état de connexion permanente. Cet état, cependant, est un mythe, et cette hypothèse pose tout un tas de problèmes.

Avez l'augmentation astronomique de l'usage du mobile, nous ne pouvons assumer quoique ce soit sur les connexions de nos utilisateurs. Tout comme nous avons appris à accepter que les écrans sont désormais de toutes les formes et de toutes les tailles, **nous devrons admettre que les connexions peuvent être présentes ou absentes, rapides ou lentes, régulières ou intermittentes, gratuites ou chères**. Nous avons réagis au défi de taille d'écran inconnues avec le <a href="http://alistapart.com/article/responsive-web-design" target="_blank">Responsive Webdesign</a> et le Mobile First, et nous devront réagir au défi des connexions fluctuantes avec le <a href="http://alistapart.com/article/offline-first" target="_blank">Offline First</a>.

**Offline First veut dire&#x202F;: construisez vos applications sans l'hypothèse d'une connexion permanente.** Mettez les données et l'application en cache localement. Construisez des interfaces qui s'accomodent d'un état déconnecté de manière élégante. Concevez les interactions utilisateurs qui n'échoueront pas si le train entre dans un tunnel. N'allez pas effrayer vos utilisateurs avec des messages d'erreurs réseau ou les frustrer avec des données inaccessibles. **Les applications Offline First sont plus rapides, plus robustes, plus agréable à utiliser, et au final&#x202F;: plus utiles.**


##### Plus d'information sur Offline First
Consultez <a href="http://offlinefirst.org/" target="_blank">offlinefirst.org</a>, <a href="https://github.com/offlinefirst/" target="_blank">on GitHub</a> et <a href="https://github.com/offlinefirst/research" target="_blank">les discussions et la recherche</a>.

### Désormais vous savez ce qui nous motive
Nous espérons que ceci vous a aussi motivé&#x202F;! Vous pouvez désormais découvrir [la technologie sous-jacente et comment Hoodie fonctionne réellement](/fr/hoodieverse/how-hoodie-works.html).

Si vous êtes déjà familier avec l'architecture, il est peut-être temps de jeter un oeil aux <a href="system-requirements-browser-compatibilities-prerequisites-before-getting-started-with-hoodie.html">pré-requis systèmes de Hoodie</a>.
