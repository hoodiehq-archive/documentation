---
layout: layout-api
locales: fr
---

# L'architecture de Hoodie

Hoodie comporte les deux parties qui constituent tout architecture web, le frontend et le backend.

Le frontend Hoodie est contenu dans le fichier `hoodie.hs` qui est inclus dans votre application.

Ce frontend communique avec le backend via HTTPS. Le backend Hoodie peut être fourni par le service d'hébergement de votre choix, ou par vous-même.

Notre implémentation de référence pour le backend Hoodie est Node.js et CouchDB. Cependant, si vous préférez utiliser un autre framework, tout ce que vous avez à faire est d'implémenter les spécifications frontend dans le backend de votre choix.

    -----------------
    | Votre appli.  | \
    |---------------|  \
    | jQuery UI     |   \
    |---------------|    Frontend
    | jQuery        |   /
    |---------------|  /
    | hoodie.js     | /
         ^
         | HTTPS
         v
    | Hoodie        |  Backend
    |---------------|
    | Node.js       |
    |---------------|
    | CouchDB       |
    -----------------


## Le coeur de Hoodie

Hoodie est conçu comme un oignon: un coeur solide et des couches de modules qui étendent l'ensemble des fonctionnalités de base. Au centre de Hoodie se trouve un système efficace de synchronisation d'objets. Tout le reste est construit là-dessus. [TODO, trouver une meilleure analogie]

Hoodie vous fourni un accès unifié aux divers systèmes de dépôt dans les navigateurs. Si vous voulez utiliser cela (et nous vous suggérons de le faire), vous obtiendrez la synchronisation de vos données avec le serveur sans effort supplémentaire. Les implications clefs sont ici:

 - les données sont immédiatement disponible pour le client. Inutile d'attendre les requêtes serveurs.
 - une expérience utilisateur améliorée via la mitigation de la latence serveur
 - les applications Hoodie fonctionnent en mode déconnecté par défaut.

Voir la documentation du [coeur stockage de Hoodie](core-storage.md) pour plus de détails. (NdT: documentation absente à ce jour)


## Les modules

Au dessus du système coeur de stockage se trouve une couche de divers modules. Chaque module active une fonction spécifique pour votre application. Tous les modules partagent la même architecture. Certains modules dépendent d'autre pour leurs fonctions spécifiques (nous allons vous en montrer un exemple dans une seconde).

Le premier module est le module utilisateur. La majorité des applications web offre la possibilité aux gens de s'enregistrer, ou quand ils se sont enregistrés, de se connecter. Une fois connectés, les utilisateurs doivent pouvoir changer leu mot de passe. Certaines applications demandent une vérification par mail avant de permettre la création d'un nouveau compte.

Le module utilisateur vous donne une API facile à utiliser pour toute ces actions

    hoodie.account.signUp('email@example.com', 'secret passphrase');
    hoodie.account.signIn('email@example.com', 'secret passphrase');
    hoodie.account.resetPassword('email@example.com');

La vérification de compte et l'oubli de mot de passe demandent l'envoi de mails. Le module email s'occupe de ça. C'est un exemple d'un module dépendant d'un autre module pour une certaine partie de son travail.

Les modules sont activés dans le [tableau de bord d'administration d'application Hoodie]() que nous allons expliquer ci-dessous.

Les autres modules inclus le paiement, la réception d'email, le partage de données. Référez-vous à la [liste des modules Hoodie]() pour les autres.


## Le panneau d'administration

Chaque application Hoodie possède automatiquement un tableau de bord d'administration. Le tableau de bord d'administration Hoodie vous donne accès divers éléments de configuration pour le frontend et le backend.

L'inteface vous permet de gérer les modules de votre application. Vous pouvez activer et désactiver les modules à la demande, et changer leur configuration.

Par exemple, vous pouvez adapter les templates des mails qui sont envoyés à vos utilisateurs, ou créer des plans de paiement auxquels les utilisateurs peuvent souscrire.

Le tableau de bord d'administration Hoodie a accès à la [liste des modules Hoodie]() et vous pouvez ajouter de nouveaux modules à n'importe quel moment.

Voir [la tableau de bord d'administration d'application Hoodie]() pour plus de détails.
