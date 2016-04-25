---
layout: layout-deployment
locales: fr
---

# Guide de déploiement de Hoodie

Notez que ceci est un brouillon incomplet. Il devrait vous mettre en selle pour un système de production, mais nous ne pouvons garantir qu'il n'y ait pas de problème dans cette configuration d'un point de vue performance et sécurité. Vérifiez avec votre administrateur système local pour en être sûr et faites-nous savoir si nous pouvons améliorer quoique ce soit :)

Ce guide est dédié à Linux pour le moment. D'autres Unices devraient être couverts avec quelques légères modifications.

### Installer les dépendances:

 - Installez CouchDB 1.2.0 ou ultérieure, 1.4.0 ou ultérieure est recommandé pour des questions de performance.
 - Installez NodeJS 0.10.0 or ultérieure.
 - Installez nginx, n'importe quelle version récente.
 - Installez Monit, n'importe quelle version récente.
 - Installez git.


### Configuration

#### CouchDB:

Hoodie est en mode de développement par défaut et de ce fait il démarre sa propre instance CouchDB. Pour des déploiements en production, nous vous recommandons de faire tourner une instance indépendante de CouchDB pour différentes raisons, comme la simplicité d'exploitation ou la sécurité.

Nous partons du principe que vous avez configuré CouchDB avec votre gestionnaire de paquet ou manuellement en suivant la procédure documentée le fichier Install.Unix présent dans le code source de CouchDB.

Si vous utilisez déjà CouchDB pour d'autres choses, nous vous recommandons de démarrer une seconde instance de CouchDB qui soit complètement séparée de l'original. Voir ci-dessous pour les instructions.

Dans ce guide, nous partirons du principe que votre CouchDB est atteignable à l'adresse [http://127.0.0.1:5984/]().

Créez un utilisateur CouchDB d'administration appelé **admin** avec un mot de passe fort de votre choix depuis [http://127.0.0.1:5984/_utils/]() en cliquant sur le lien **Fix this** en bas à droit. Retenez ce mot de passe.

Vous devrez ensuite changer la configuration par défaut sur certains points. Le plus simple est d'aller sur [http://127.0.0.1:5984/_utils/config.html]() et de changer les champs suivants (double-cliquez sur une valeur pour entrer en mode d'édition):

<pre><code>couchdb -> delayed_commits: false
couchdb -> max_dbs_open: 1024
couch_httpd_auth -> timeout: 1209600 ; that’s two weeks
</code></pre>

#### Système

Ajoutez ceci à `/etc/security/limits.conf`

<pre><code>hoodie    soft    nofile    768
hoodie    hard    nofile    1024
</code></pre>

#### Hoodie

Créez un nouvel utilisateur système:

<pre><code>useradd --system \
       -m \
       --home /home/hoodie \
       --shell /bin/bash \
       --no-user-group \
       -c "Hoodie Administrator" hoodie
</code></pre>

Ceci créera un nouvelle utilisateur avec pour répertoire "home" **/home/hoodie**.

**cd** dans ce répertoire.

En tant qu'utilisateur Hoodie, installez votre application, soit avec la fonction de "template" de Hoodie:

<pre><code>[sudo -u hoodie] hoodie new appname githubname/reponame 
  # think https://github.com/githubname/reponame
</code></pre>

…soit via un checkout git et une configuration manuelle:

<pre><code>[sudo -u hoodie] git clone appname repourl
  # make sure package.json has a valid `name` property.
[sudo -u hoodie] npm install
</code></pre>

Pour démarrer, recopier le script depuis [ce gist](https://gist.github.com/janl/b097f7a578ec07e4101c)

<pre><code>wget https://gist.githubusercontent.
  com/janl/b097f7a578ec07e4101c/raw/
  01ab9816f64660075e6fe9e5a787545097f22da8/
  hoodie-daemon.sh
chmod +x hoodie-daemon.sh
</code></pre>

Il est fait pour être lancé en tant que **root**. C'est aussi une version de départ de ce qui deviendra le script **init.d**, mais nous n'en sommes pas encore là :)

Pour lancez Hoodie maintenant, en tant que **root**:

<pre><code>HOODIE_ADMIN_PASS=yourcouchdbadminpasswordfromearlier 
  ./hoodie-daemon.sh start
</code></pre>

Voilà! Vous pouvez vérifier que la configuration est valide en vérifier les fichiers trace:

<pre><code>tail -f /home/hoodie/log/*</code></pre>

Si vous voyez la moindre erreur, vérifier que vous n'avez pas manqué une des étapes précédentes. Prévenez-nous si vous êtes coincé.

Votre application Hoodie devrait être accessible depuis [http://127.0.0.1:6001/]()

#### WWW

Vous voulez probablement que votre application Hoodie écoute sur le port 80 et soit même disponible sous un nom de domaine classique. Le mapping d'un domaine est bien entendu hors sujet pour cette configuration, mais l'écoute sur le port 80 peut être implémentée facilement. Sous Unix, les utilisateurs qui ne sont pas administrateurs ne peuvent pas lancer de programmes en écoute des ports inférieurs à 1024. Au lieu de lancer Hoodie en tant que **root** (ce qui nous considérons être un risque de sécurité, merci de **ne pas lancer Hoodie en tant que root**), nous avons une meilleure idée: utiliser un logiciel qui soit éprouvé et qui nous donne une fonction bonus que vous allez apprécier.

Nous allons utiliser nginx comme serveur proxy HTTP. D'autres logiciels proxy devrait être aussi utilisables (Apache 2 et HAProxy sont deux qui viennent à l'esprit). Nous partons sur nginx parce que notre hébergement le support :)

Ajouter un nouveau fichier **/etc/nginx/vhosts.d/appname.conf** avec le contenu de [ce gist](https://gist.github.com/janl/2a8e6ebc80a25817dca0). Vous devrez ajuster le nom de domaine et les chemins d'accès aux fichiers traces et au certificat et à la clef SSL.

**NOTE**: du fait d'un [problème](https://www.ruby-forum.com/topic/4412004) avec la terminaison de session SSL, nous vous recommandons d'utiliser HAProxy pour s'occuper de cet aspect. Nous ajouterons un exemple de configuration plus tard.

Une fois que tout ceci est en place, vous pouvez recharger la configuration de nginx:

<pre><code>[sudo] nginx reload</code></pre>

Maintenant votre application est disponible sur l'IP publique de votre machine et depuis tous les domaines qui point sur ce serveur. Toutes les requêtes seront automatiquement passées via HTTPS par sécurité. De plus, **NE LANCER PAS HOODIE SANS HTTPS**.

### La fonction bonus

Désormais, toutes les requêtes à notre application sont servies via HTTPS. nginx offre la terminaison HTTPS et la délègue vers Hoodie en HTTP. Nous avons aussi dit à nginx de servir le **/** de votre application depuis le répertoire **/www** et de déléguer seulement **/_api** vers Hoodie plutôt que de laisser Hoodie servir le contenu statique en plus du "backend" dynamique.

Ceci a l'avantage que, dans le cas d'un problème avec Hoodie, vos clients seront toujours capables d'accéder aux éléments statique et seront toujours capable d'utiliser votre application. Il s'agit d'un énorme bénéfice des architecture "offline-first": vos utilisateurs peuvent continuer à utiliser l'application même quand le "backend" est arrêter. Alors que ce design est fait pour permettre aux utilisateurs de fonctionner en déconnecté, il permet aussi de déconnecter le "backend" :)

#### logrotate

Nous avons configuré un certain nombre de fichiers traces, aussi vous voudrez vous assurer que vous ne manquerez pas d'espace. Configurons la rotation des traces dans **/etc/logrotate.d/hoodie**:

<pre><code>/var/log/hoodie.std* {
       weekly
       rotate 10
       copytruncate
       delaycompress
       compress
       notifempty
       missingok
}
</code></pre>

### Monit

Enfin, nous voulons nous assurer que Hoodie reste accessible et en bonne santé même quand le processus principal NodeJS s'arrête pour quelque raison que ce soit. Nous utiliserons Monit pour surveiller et redémarrer Hoodie au besoin.

Créer le fichier **/etc/monit.d/hoodie** ainsi:
<pre><code>check process hoodie with pidfile 
  /home/hoodie/log/hoodie.pid
start program = "/home/hoodie/hoodie-daemon.sh start"
stop program  = "/home/hoodie/hoodie-daemon.sh stop"
if failed URL https://yourapp.com/_api then restart
</code></pre>

Une fois encore, insérez le nom de domaine de votre application où c'est pertinent. Le processus redémarrera si l'url **/_api** (l'API principale de Hoodie) est indisponible.

Tant que nous y sommes, configuration la même chose pour nginx:

**/etc/monit.d/nginx**
<pre><code>check process nginx with pidfile /var/run/nginx.pid
start program = "/etc/init.d/nginx start"
stop program  = "/etc/init.d/nginx stop"
if failed host 127.0.0.1 port 80 then restart
if failed host 127.0.0.1 port 443 then restart
</code></pre>

#### Configurer une seconde instance CouchDB

A faire&#x202F;!
