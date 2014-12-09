---
layout: layout-api
---
# hoodie.email 

The email plugin gives you a method to send email from the client.

## Methods
- [send](#emailsend)

<a id="emailsend"></a>
### emai.send()
> **version:**    *> 0.0.1* 


```javascript
hoodie.email.send(payload);
```

| option              | type   | required |
| ------------------- |:------:|:--------:|
| payload.to          | String | yes      |
| payload.from        | String | yes      |
| payload.subject     | String | no       |
| payload.text        | String | yes      |
| payload.html        | String | no       |
| payload.attachments | Array  | no       |

<br />
The E-Mail plugins exposes the **send** method to **hoodie.email**. Using it you can send E-Mails right from the client.
It takes only one argument – an E-Mail object. As Hoodie uses <a href="http://www.nodemailer.com/" target="_blank">nodemailer</a> internally you can use all options available there. 

You can find a full list <a href="http://www.nodemailer.com/#e-mail-message-fields" target="_blank">in their documentation</a>.

#### Example

<pre><code>// send emails
hoodie.sendEmail({
  from: "Fred Foo <foo@blurdybloop.com>", // sender address
  to: "bar@blurdybloop.com, 
      baz@blurdybloop.com", // list of receivers
  subject: "Greetings", // Subject line
  text: "Hello world!", // plaintext body
  html: "<b>Hello world</b>" // html body
});

// you can also pass attachments as dataURIs:
hoodie.sendEmail({
  to: 'test@example.com',
  from: 'hoodie@example.com',
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
</code></pre>
