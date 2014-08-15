# Server: Hoodie.Email 

This is a work in progress documentation for  the serverside hoodie.email

// send emails
hoodie.sendEmail({
    from: "Fred Foo ✔ <foo@blurdybloop.com>", // sender address
    to: "bar@blurdybloop.com, baz@blurdybloop.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world ✔", // plaintext body
    html: "<b>Hello world ✔</b>" // html body
}, callback)

// sending emails uses nodemailer API:
// https://github.com/andris9/Nodemailer

// you can also pass attachments as dataURIs:
hoodie.sendEmail({
  to: 'test@example.com',
  from: 'hoodie@example.com',
  subject: 'test',
  text: 'blah blah',
  attachments: [
    {dataURI: 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ%3D%3D', ...}
  ]
}, callback);
