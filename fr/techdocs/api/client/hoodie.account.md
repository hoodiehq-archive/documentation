---
layout: layout-api
locales: fr
---
# hoodie.account
**version:** 		*> 0.1.0*<br>
**source:** 		*[hoodie.js/src/hoodie/account](https://github.com/hoodiehq/hoodie/tree/hoodie-client-legacy/src/hoodie/account)*

L'objet account de l'API cliente Hoodie couvre toutes les opérations liées à l'authentification des utilisateurs, et vous permet de réaliser des opérations auparavant complexes, comme l'enregistrement d'un nouvel utilisateur, en quelques lignes de code frontend. Puisque {les données sont généralement associées à un utilisateur](/fr/hoodieverse/glossary.html#private-user-store), vous devriez vous familiariser avec **account** avant de passer au [stockage](/fr/techdocs/api/client/hoodie.store.html). 

**Après avoir lu ce guide, vous saurez comment:**

- enregistrer, connecter et déconnecter un utilisateur
- vérifier si un utilisateur est identifié
- changer nom et mot de passe de l'utilisateur
- remettre à zéro le mot de passe
- écouter les événements liées aux comptes
- supprimer un compte utilisateur

<a id="top"></a>

### Propriétés
- [username](#accountusername)

### Méthodes
- [signUp()](#accountsignup)
- [signIn()](#accountsignin)
- [signOut()](#accountsignout)
- [changePassword()](#accountchangepassword)
- [changeUsername()](#accountchangeusername)
- [resetPassword()](#accountresetpassword)
- [destroy()](#accountdestroy)

### Evénements
- [signup](#signup)
- [signin](#signin)
- [signout](#signout)
- [reauthenticated](#reauthenticated)
- [changepassword](#changepassword)
- [changeusername](#changeusername)
- [passwordreset](#passwordreset)
- [error:passwordreset](#error-passwordreset)
- [error:unauthenticated](#error-unauthenticated)

<a id="accountusername"></a>
### [account.username](#accountusername)
**version:**    *> 0.2.0*

```javascript
hoodie.account.username
```

**hoodie.account.username** est automatiquement alimenté/vidé quand l'utilisateur s'enregistre, se connecte, change son nom d'utilisateur ou supprime le compte.

C'est aussi ainsi que l'on vérifie que l'utilisateur est ou non identifié.


#### Example

```javascript
if (hoodie.account.username) {
  // l'utilisateur est connecté
  console.log('Hey there, '+hoodie.account.username);
} else {
  // l'utilisateur est anonyme
  console.log('You are not logged in!');
}
```

<a id="accountsignup"></a>
### [account.signUp()](#accountsignup)
**version:** 		*> 0.2.0*

**Vos permet d'enregistrer un nouvel utilisateur**

```javascript
hoodie.account.signUp('user', 'password');
```

##### Arguments

| Nr | argument   | type   | description     | obligatoire |
|:--:|:---------- |:------ |:--------------- |:----------- |
|  1 | username   | String | identifiant     | oui         |
|  2 | password   | String | mot de passe    | oui         |


##### Valeur de retour

| argument    | description                                          |
| ----------- | ---------------------------------------------------- |
| username    | l'identifiant avec lequel il s'est enregistré        |

##### Retour de la méthode

| argument    | quand                                                            |
| ----------- | ---------------------------------------------------------------- |
| -           | après que le compte soit créé sur le serveur, avant confirmation |

##### Retours d'erreurs

| erreur                | message                                     |
| --------------------- | ------------------------------------------- |
| HoodieError           | Username doit être précisé                  |
| HoodieError           | L'utilisateur doit se déconnecter avant     |
| HoodieConflictError   | L'identifiant **&lt;username>** existe déjà |
| HoodieConnectionError | Impossible de se connecter au serveur       |


**signUp** créer un nouveau compte utilisateur sur le serveur Hoodie. Actuellement, le compte est confirmé automatiquement après que la base de l'utilisateur (où se retrouve synchronisées toutes les données de l'utilisateur) ait été créée.

#### Exemple
```javascript
$('#signUpForm').submit(function (event) {
  event.preventDefault();
  var username  = $('#username').val();
  var password  = $('#password').val();

  hoodie.account.signUp(username, password)
    .done(welcomeNewUser)
    .fail(showErrorMessage);
});
```

**Note:** Le workflow de confirmation sera configurable dans le futur, afin que vous puissiez demander une confirmation d'enregistrement par mail, par exemple. Ceci se fera dans le panneau d'administration du plugin user.


<a id="accountsignin"></a>
### [account.signIn()](#accountsignin)
**version:** 		*> 0.2.0*

**Connecte un utilisateur existant.**

```javascript
hoodie.account.signIn('user', 'password');
```

##### Arguments

| Nr | option     | type   | description             | obligatoire |
|:--:|:---------- |:------ |:----------------------- |:----------- |
|  1 | user       | String | identifiant             | oui         |
|  2 | password   | String | mot de passe            | oui         |
|  3 | options    | Object | {moveData: true/false}  | non        |

##### Valeur de retour

| argument    | description                                          |
| ----------- | ---------------------------------------------------- |
| username    | identifiant de l'utilisateur connecté                |

##### Retours d'erreur

| erreur                         | message                                     |
| ------------------------------ | ------------------------------------------- |
| HoodieAccountUnconfirmedError  | Le compte n'a pas encore été confirmé |
| HoodieAccountNotFoundError     | Le compte est introuvable|
| HoodieError                    | _Une erreur custom peut être positionnée par les plugins, par exemple le compte est bloqué pour défaut de paiement_ |
| HoodieConnectionError | Impossible de se connecter au serveur                |

La méthode **signIn** essaye de connecter l'utilisateur sur un compte existant.

#### NOTES

Toutes les données Hoodie se trouvent dans le dépôt local du navigateur avant l'authentification. Pour éviter une perte de données, vous pouvez passer l'option **{moveData: true}**, ce qui déplacera les données courantes (créées anonymement) vers le compte auquel l'utilisateur s'est connecté.

**moveData** est utile pour un rare cas d'usage déconnecté : un utilisateur veut se connecter à votre application et

- il a l'application elle-même en cache local (avec AppCache, par exemple)
- il n'est *pas* identifié dans l'application
- il ne peut pas se connecter (s'authentifier auprès du serveur) parce qu'il n'a pas de connexion internet

Il peut alors travailler en tant qu'utilisateur anonyme et produire de nouvelles données, et dès qu'il est de nouveau en ligne, il peut se connecter avec **moveData:true**. Ceci migrera les données locales de l'utilisateur depuis l'utilisateur anonyme vers l'utilisateur réel.

#### Exemple

```javascript
$('#signInForm').submit(function (event) {
  event.preventDefault();
  var username = $('#username').val();
  var password = $('#password').val();
  hoodie.account.signIn(username, password)
    .done(welcomeUser)
    .fail(showErrorMessage);
});
```

<a id="accountsignout"></a>
### [account.signOut()](#accountsignout)
**version:** 		*> 0.2.0*

**Déconnecte l'utilisateur de leur compte existant et supprime toutes les données locales**

```javascript
hoodie.account.signOut(options);
```

##### Arguments

| Nr | option     | type   | description             | obligatoire |
|:--:|:---------- |:------ |:----------------------- |:-------- |
|  1 | options    | Object | {ignoreLocalChanges: true/false}  | non       |

##### Valeur de retour

_pas de valeur de retour_

##### Retours d'erreurs

| erreur                         | message                        |
| ------------------------------ | ------------------------------ |
| HoodieAccountLocalChangesError | Il y a des modifications locales qui n'ont pas été synchronisées |

Avant qu'un utilisateur ne se déconnecte, Hoodie pousse toutes les modifications locales vers la base de l'utilisateur côté serveur. Si cela échoue parce que le serveur ne peut pas être contacté, ou parce que la session utilisateur est invalide, **signOut()** échoue et remonte une erreur **HoodieAccountLocalChangesError**. Pour forcer la déconnexion malgré une perte potentielle de données, vous pouvez passez l'option **{ignoreLocalChanges: true}**.

#### Exemple

```javascript
hoodie.account.signOut()
  .done(redirectToHomepage)
  .fail(showError);
```

#### Notes
**HoodieAccountLocalChangesError** n'est actuellement pas retournée, à la place vous recevrez des erreurs cryptiques concernant l'utilisateur qui ne se serait pas authentifié, ou une requête en échec. Voir [le ticket #358](https://github.com/hoodiehq/hoodie.js/issues/358).

<a id="accountchangepassword"></a>
### [account.changePassword()](#accountchangepassword)
**version:**    *> 0.2.0*

**Permets à un utilisateur enregistré de changer son mot de passe.**

```javascript
hoodie.account.changePassword(currentPassword, newPassword);
```

##### Arguments

| Nr | option           | type   | description                           | obligatoire |
|:--:|:---------------- |:------ |:------------------------------------- |:----------- |
|  1 | currentPassword  | String | mot de passe courant de l'utilisateur | oui         |
|  2 | newPassword      | String | nouveau mot de passe                  | oui         |

##### Valeur de retour

_pas de valeur de retour_

##### Retours d'erreurs

| erreur                     | message                          |
| -------------------------- | -------------------------------- |
| HoodieUnauthenticatedError | L'utilisateur n'est pas connecté |


#### Exemple

```javascript
hoodie.account.changePassword('secret', 'newSecret')
  .done(showSuccessMessage)
  .fail(showErrorMessage)
```

<a id="accountchangeusername"></a>
### [account.changeUsername()](#accountchangeusername)
**version:**    *> 0.2.0*

**Permets à un utilisateur enregistré de changer son identifiant.**

```javascript
hoodie.account.changeUsername(currentPassword, newUsername);
```

##### Arguments

| Nr | option           | type   | description                           | obligatoire |
| --:| ---------------- |:------:|:------------------------------------- |:----------- |
|  1 | currentPassword  | String | mot de passe de l'utilisateur         | oui         |
|  2 | newUsername      | String | nouvel identifiant                    | oui         |

##### Valeur de retour

_pas de valeur de retour_

##### Retours d'erreurs

| erreur                     | message                               |
| -------------------------- | ------------------------------------- |
| HoodieUnauthenticatedError | L'utilisateur n'est pas connecté      |
| HoodieConflictError        | Identifiants identiques               |
| HoodieConflictError        | **&lt;newUsername>** est déjà utilisé |


#### Exemple

```javascript
hoodie.account.changeUsername('secret', 'newusername')
  .done(showSuccessMessage)
  .fail(showErrorMessage)
```


<a id="accountresetpassword"></a>
### [account.resetPassword()](#accountresetpassword)
**version:**    *> 0.2.0*

**Demande une remise à zéro du mot de passe**

```javascript
hoodie.account.resetPassword(username);
```

##### Arguments

| Nr | option     | type   | description                                                              | obligatoire |
|:--:|:---------- |:------ |:------------------------------------------------------------------------ |:----------- |
|  1 | username   | String | identifiant de l'utilisateur pour lequel remettre le mot de passe à zéro | oui         |

##### Valeur de retour

| argument    | description                                                  |
| ----------- | ------------------------------------------------------------ |
| username    | l'identifiant pour lequel le mot de passe a été remis à zéro |

##### Retours d'erreurs

| erreur                     | message                               |
| -------------------------- | ------------------------------------- |
| HoodieError                | L'utilisateur **&lt;username>** n'a pas été trouvé |
| HoodieError                | Adresse email absente                 |
| HoodieError                | Échec lors de l'envoi de l'email      |
| HoodieConnectionError      | Impossible de se connecter au serveur |

#### Exemple

```javascript
hoodie.account.resetPassword('joe@example.com')
  .done(showSuccessMessage)
  .fail(showErrorMessage)
```

##### Notes
> Actuellement nous générons un nouveau mot de passe et l'envoyons par mail.
> Dans le futur, nous enverrons plutôt un jeton, voir [#360](https://github.com/hoodiehq/hoodie.js/issues/360)


<a id="accountdestroy"></a>
### [account.destroy()](#accountdestroy)
**version:**      *> 0.2.0*

**Détruit le compte de l'utilisateur actuellement connecté.**

```javascript
hoodie.account.destroy();
```

##### Arguments

_pas d'arguments_

##### Valeur de retour

_pas de valeur de retour_

##### Retours d'erreurs

| erreur                     | message                               |
| -------------------------- | ------------------------------------- |
| HoodieConnectionError      | Impossible de se connecter au serveur |

#### Exemple

```javascript
hoodie.account.destroy()
  .done(showSuccessMessage)
  .fail(showErrorMessage)
```

##### Notes
- Quand un compte utilisateur est détruit, la base de donnée de l'utilisateur est supprimée et ne peut être récupérée.
- Actuellement nous ne demandons pas le mot de passe de l'utilisateur, mais prévoyons de le faire dans le futur [#55](https://github.com/hoodiehq/hoodie.js/issues/55)


<a id="accountevents"></a>
### [Evénements liées aux comptes](#accountevents)

| name | arguments | description |
| ---- | --------- | ----------- |
| <a id="signup"></a>[signup](#signup) | username | déclenché quand un utilisateur s'enregistre avec succès |
| <a id="signin"></a>[signin](#signin) | username | déclenché après que l'utilisateur se soit connecté avec succès |
| <a id="signout"></a>[signout](#signout) | username | déclenché après que l'utilisateur se soit déconnecté avec succès |
| <a id="reauthenticated"></a>[reauthenticated](#reauthenticated) | username | déclenché après que l'utilisateur se soit connecté avec succès avec son identifiant courant. Voir l'événement **error:unauthenticated** pour plus de détail. |
| <a id="changepassword"></a>[changepassword](#changepassword) | - | déclenché après que l'utilisateur ait changé son mot de passe avec succès |
| <a id="changeusername"></a>[changeusername](#changeusername) | username | déclenché après que l'utilisateur ait changé son identifiant avec succès |
| <a id="passwordreset"></a>[passwordreset](#passwordreset) | username | déclenché après qu'un mot de passe ait été remis à zéro avec succès |
| <a id="error-passwordreset"></a>[error:passwordreset](#error-passwordreset) | error, username | Une erreur est survenue lors de la remise à zéro du mot de passe de **username** |
| <a id="error-unauthenticated"></a>[error:unauthenticated](#error-unauthenticated) | error, username | L'utilisateur actuel n'a plus de session valide et doit se ré-authentifier. Comme Hoodie fonctionne en mode déconnecté, il peut se retrouver dans un état où l'utilisateur est connecté avec des données dans son navigateur, mais sans session valide, aussi la synchronisation ne fonctionne plus. Dans ce cas, l'événement **error:unauthenticated** est déclenché et l'utilisateur devrait se reconnecter avec son identifiant actuel. |


#### Exemple

```javascript
hoodie.account.on('signup signin', redirectToDashboard)
hoodie.account.on('error:unauthenticated', showSignInForm)
```

## Étapes suivantes

Ok, maintenant vous êtes prêts pour la partie plus consistante. Allez voir le guide pour [l'API de stockage](/fr/techdocs/api/client/hoodie.store.html)&#x202F;!


Nous espérons que ce guide API vous a aidé. Sinon, laissez-nous vous aider <a href="http://hood.ie/chat" target="_blank">sur IRC ou Slack</a>.
Nous avons aussi une <a href="http://faq.hood.ie" target="_blank">FAQ</a> qui pourrait se révéler utile si les choses se passent mal.

Si vous trouvez des erreurs dans ce guide ou qu'il est dépassé, vous pouvez aussi <a href="https://github.com/hoodiehq/documentation/issues" target="_blank">ouvrir un ticket</a> ou soumettre une pull request avec vos corrections à <a href="https://github.com/hoodiehq/documentation/blob/gh-pages/fr/techdocs/api/client/hoodie.account.md" target="_blank">ce fichier</a>.
