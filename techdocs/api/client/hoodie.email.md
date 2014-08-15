---
layout: layout
---

# Hoodie.Email

*Source: hoodie/src/hoodie/email.js*

The Hoodie Email Api comes usually preinstalled with hoodie. Nevertheless, before you can use the Hoodie Email API, you have to configure mail transport in the global AppConfiguration. Otherwise Hoodie will not know, how it can send your emails.

For configuring the mail transport, start hoodie and open the Admin Interface in the browser of you choice. When using hoodie on the local development environment the URL is http://127.0.0.1:6014/#plugins/appconfig. If this may differs on your machine, check the terminal where hoodie is running on. During every session of the `hoodie start` command, the complete admin url will be displayed right when hoodie is starting up. You may select a preconfigured mail service like Google Mail, Mailgun, Mandrill, Postmark or SendGrid and just fill out your personal user credentials of the particular service. Save the settings by clicking the **Save email config** button and you are good to go using the Hoodie.Email API.


## Methods

### send

`hoodie.email.send()`



