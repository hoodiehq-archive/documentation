---
layout: layout-community
locales: fr
---

# Organiser un atelier Hoodie 

*Ceci est un document vivant et en cours de rédaction. Si vous voulez y ajouter un retour ou votre expérience, merci de [nous contacter](http://hood.ie/contact).*

## Pré-requis

- Combien de temps l'atelier doit durer (Au moins 3/4 heures devraient y être consacrés, selon le niveau d'expérience des participants)
- Combien de participants&#x202F;?
- Qui peut assurer le coaching (Idéalement 1 coach pour 3/4 participants)
- Quel OS&#x202F;?
- Est-ce qu'ils doivent amener leurs propres machines ou est-ce des ordinateurs seront disponibles&#x202F;? (Dans ce dernier cas, avec droits d'administration pour les participants&#x202F;?)
- Quel niveau d'expérience&#x202F;?
  - HTML / CSS
  - JavaScript
  - Terminal
- Si possible, organiser une "Installation Party" avant l'atelier en lui-même (les participant peuvent s'y rencontrer et s'assurer que tout est prêt. Ils se sentiront plus à l'aise le lendemain).
- Mettez en place un Code de Conduite (par exemple similaire au [Code de Conduite de Hoodie](http://hood.ie/code-of-conduct) ou [comment concevoir un Code de Conduite](https://adainitiative.org/2014/02/howto-design-a-code-of-conduct-for-your-community/))

## Préparation
- Vérifiez qu'il y a assez de prises de courant disponibles
- Amenez des rallonges électriques
- Un wifi stable pour tous. Vérifiez si les participants ont besoin d'un login particulier
- Prévoyez nourriture et boissons en suffisance. Si vus ne le pouvez pas, assurez-vous de demander aux participants d'amener de quoi grignoter et cherchez un endroit où manger tous ensemble.
- Préparez (si nécessaire) une rapide présentation de Hoodie (voir nos [exemples]
- Check if there are enough sockets
- Bring extension cords
- Stable WiFi for everyone. Check if special login for participants is required(http://hood.ie/contribute#talks) ou la [page des événements Hoodie](http://hood.ie/events))
- Préparez toutes les commandes importantes sur des slides ou support à distribuer.
- Si vous avez plus d'une personne par ordinateur portable, imprimez le tutoriel que vous suivez.
- Imprimer la [Cheat Sheet Hoodie](http://hood.ie/dist/presentations/hoodie-cheat-sheet-print.pdf) pour chaque participant
- Préparez des shortlinks pour tous les liens importants
- Inventoriez les problèmes courants et leurs solutions (vérifiez aussi la FAQ et les "Erreurs connues") pour les coachs
- Préparez un tas d'idées d'application (au delà des habituelles applications de suivi de tâches) sur lesquelles les gens pourront travailler quand ils en sauront assez sur Hoodie, mais n'allez pas jusqu'à une idée concrète
- Préparez un questionnaire de retours (par exemple comme [celui-ci](https://docs.google.com/a/thehoodiefirm.com/forms/d/1toCQfdK4tF2WIXzico5MoMpI_UXpLQ5zvcxFOUhip5M/viewform))
- Passez en revue la [FAQ Hoodie](http://faq.hood.ie) pour les bugs et erreurs connues - notamment
  - [‘npm ERR! Please try running this command again as root/Administrator’](http://faq.hood.ie/#/question/38210259)
  - [les problèmes usuels d'installation sous Windows](http://faq.hood.ie/#/question/48204371) 
  - [Error ’could not start Hoodie`](http://faq.hood.ie/#/question/38210193)

## Pré-requis pour les participants (à annoncer)
- Amenez votre ordinateur portable
- Demandez aux participants d'avoir la dernière (ou en tout cas pas trop ancienne) version de leur système d'exploitation et navigateur - sinon ils risquent de rencontrer des problèmes. Vous trouverez les pré-requis de Hoodie [ici](../hoodieverse/system-requirements-browser-compatibilities-prerequisites-before-getting-started-with-hoodie.html)
- S'ils n'en ont pas déjà un, demandez-leur d'installer un éditeur (idéalement, envoyez une liste de suggestions + liens)
- Acceptez le Code de Conduite

## Déroulement

- Accueillir tout le monde
- Parler du Code de Conduite (expliciter les comportements acceptables / inacceptables) et qu'il sera appliqué
- Demandez qui sait ce qu'est Hoodie et ce qu'il faut; si tout le monde n'est pas à la page, faire une rapide présentation de Hoodie
- Demandez à tous leur niveau d'expérience et compétences, leur motivation et laissez-les se présenter un peu
- Installation (note&#x202F;: peut prendre bien plus de temps que prévu)
  - vérifiez que tout le monde a Hoodie installé et en ordre de marche
  - [guide d'installation](../start)
  - notez les problèmes particuliers qui surviennent avec Windows
- Si Hoodie est déjà installé, assurez-vous qu'ils ont tous la dernière version en lançant
<pre><code>hoodie new myApp</code></pre>
- Si Hoodie n'est pas la dernière version, Hoodie-CLI vous dira quoi faire et vous indiquer les étapes à suivre
- Commencez le premier tutoriel&#x202F;: lancez
<pre><code>hoodie new tutorial /
  -t gr2m/hoodie-store-and-account-tutorial</code></pre> 
- L'interface d'administration– http://127.0.0.1:6002
- …
- …
- [Tutoriel pour les plugins](../plugins/tutorial.html) (pour les participants très avancés)
- Boilerplate&#x202F;: <pre><code>hoodie new awesomeApp /
-t zoepage/hoodie-boilerplate</code></pre> 
- …
- … 
- Construisez votre propre application
- Présentez votre application au groupe
- Tour de restitution
  - demandez des retours
  - distribuez le lien vers le formulaire de retour
  - n'oubliez pas de de faire vous aussi un retour. Soyez gentil et encourageant
- Remerciez tous les gens impliqués et soyez fiers de vous.
- Si vous le souhaitez, socialisez avec le groupe dans le restaurant / café / pub le plus proche.
- Rentrez chez vous, reposez-vous
- Vérifier les retours et complétez les supports de l'atelier