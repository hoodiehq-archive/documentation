---
layout: layout-api
locales: fr
---
# hoodie.email

Le plugin email vous donne le moyen d'envoyer des emails depuis le client.

## Methods
- [send](#emailsend)

<a id="emailsend"></a>
### [email.send()](#emailsend)
**version:**    *> 0.1.0*<br>
**source:**     <a href="https://github.com/hoodiehq/hoodie-plugin-email" target="_blank">hoodiehq/hoodie-plugin-email</a>


```javascript
hoodie.email.send(payload);
```


| option              | type   | obligatoire |
| ------------------- |:------ |:----------- |
| payload.to          | String | oui         |
| payload.from        | String | oui         |
| payload.subject     | String | non         |
| payload.text        | String | oui         |
| payload.html        | String | non         |
| payload.attachments | Array  | non         |

Le plugin email expose une méthode **send** sur **hoodie.email**. Utilisez-la pour envoyer des emails depuis le client.

Elle prend un seul argument - un objet email. Comme Hoodie utilise <a href="http://www.nodemailer.com/" target="_blank">nodemailer</a> en interne vous pouvez utiliser toutes ses options. Vous en trouverez une liste complète <a href="http://www.nodemailer.com/#e-mail-message-fields" target="_blank">dans sa documentation</a>.

#### Exemple

Envoyer des emails avec le plugin&#x202F;:

```javascript
hoodie.email.send({
  from: "Hans Hansson <hans@ottersunlimited.com>", // adresse de l'expéditeur
  to: "per@ottersunlimited.com,
      sven@ottersunlimited.com", // liste des destinataires
  subject: "Greetings", // sujet du mail
  text: "Hello world!", // corps au format texte
  html: "<b>Hello world</b>" // corps au format HTML
});
```

Vous pouvez aussi passer des pièces jointes sous forme de dataURIs&#x202F;:

```javascript
hoodie.email.send({
  to: 'hans@ottersunlimited.com',
  from: 'sven@ottersunlimited.com',
  subject: 'Greetings',
  text: 'Hello world!',
  attachments: [
    {
      dataURI:
      'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ%3D%3D',
      ...
    }
  ]
});
```

#### Important

Ce plugin n'est pas terminé et peut être considéré comme une pré-version pour développeur. Il sera prochainement amélioré de manière significative.
