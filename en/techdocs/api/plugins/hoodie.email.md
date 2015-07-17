---
layout: layout-api
locales: en
---
# hoodie.email

The email plugin gives you a method to send email from the client.

## Methods
- [send](#emailsend)

<a id="emailsend"></a>
### [email.send()](#emailsend)
**version:**    *> 0.1.0*<br>
**source:**     <a href="https://github.com/hoodiehq/hoodie-plugin-email" target="_blank">hoodiehq/hoodie-plugin-email</a>


```javascript
hoodie.email.send(payload);
```


| option              | type   | required |
| ------------------- |:------ |:-------- |
| payload.to          | String | yes      |
| payload.from        | String | yes      |
| payload.subject     | String | no       |
| payload.text        | String | yes      |
| payload.html        | String | no       |
| payload.attachments | Array  | no       |

The E-Mail plugins exposes the **send** method to **hoodie.email**. Use it to send E-Mails right from the client.

It takes only one argument – an E-Mail object. As Hoodie uses <a href="http://www.nodemailer.com/" target="_blank">nodemailer</a> internally you can use all options available there. You can find a full list <a href="http://www.nodemailer.com/#e-mail-message-fields" target="_blank">in their documentation</a>.

#### Example

Sending emails with the plugin:

```javascript
hoodie.email.send({
  from: "Hans Hansson <hans@ottersunlimited.com>", // sender address
  to: "per@ottersunlimited.com,
      sven@ottersunlimited.com", // list of receivers
  subject: "Greetings", // Subject line
  text: "Hello world!", // plaintext body
  html: "<b>Hello world</b>" // html body
});
```

You can also pass attachments as dataURIs:

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

This plugin isn't complete and is considered a developer preview. It will be significantly improved soon.
