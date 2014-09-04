# hoodie.account
> **version:** 		*> 0.1.0* <br />
> **source:** 		*hoodie/src/hoodie/account.js*<br />
> **tutorial:** 	*http://hood.ie/tutorial/accounts*<br />

**<br />after reading this you will know:**
- how to sign up / in / out a user
- how to check if a user is signed in
- how to change username or password
- how to reset a password
- how to listen to account events
- how to destroy a user account

## Introduction

*The account object gives you the methods to create, update and delete an account. A user's data is always bound to the user's account, and will automatically be synchronized when signend in on different devices.*


## Methods

- signUp()
- signIn()
- signOut() // please add anchors
- changePassword()
- changeUsername()
- resetPassword()
- destroy()

coming soon:

- isSignedIn()
- confirm(options)
- checkAvailability(username)
- userData()


## Events

- signup (username)
- reauthenticated (username)
- signin (newUsername, newHoodieId, options)
- signup (username)
- signout (username)
- reauthenticated
- changepassword
- changeusername (newUsername)
- passwordreset (username)
- error:passwordreset (error, username)
- error:unauthenticated

### account.signUp()
> **version:** 		*> 0.2.0*


```javascript
hoodie.account.signUp('user', 'password');
```

###### Arguments

| Nr | argument   | type   | description     | required |
| --:| ---------- |:------:|:---------------:|:--------:|
|  1 | username   | String | username        | yes      |
|  2 | password   | String | valid password  | yes      |

###### Resolves with

| argument    | description                                          |
| ----------- | ---------------------------------------------------- |
| username    | the username the user signed up with                 |

###### Progresses with

| argument    | when                                                 |
| ----------- | ---------------------------------------------------- |
| -           | after account created on server, before confirmation |

###### Rejects with

| error                 | message                                     |
| --------------------- | ------------------------------------------- |
| HoodieError           | Username must be set                        |
| HoodieError           | Must sign out first                         |
| HoodieConflictError   | Username `<username>` already exists        |
| HoodieConnectionError | Could not connect to Server                 |


<br />

`signUp` creates a new user account on the Hoodie server. The account is confirmed automatically,
after the user-specific database has been created, where all the user's data gets automatically
synchronized to.

###### Example

```javascript
 $('#signInForm').submit(function (ev) {
    ev.preventDefault();
    var username  = $('#username').val();
    var password  = $('#password').val();

    hoodie.account.signUp(username, password)
      .done(welcomeNewUser)
      .fail(showErrorMessage);
});
```

###### Notes
> - The confirmation workflow will be customizable in future
> - there is no feature built-in to compare the password to a password confirmation.
>   If you need this logic, please validate this beforehand in your app.


<br />
### account.signIn()
> **version:** 		*> 0.2.0*


```javascript
hoodie.account.signIn('user', 'password');
```

###### Arguments

| Nr | option     | type   | description             | required |
| --:| ---------- |:------:|:-----------------------:|:--------:|
|  1 | user       | String | username                | yes      |
|  2 | password   | String | valid password          | yes      |
|  3 | options    | Object | {moveData: true/false}  | no       |

###### Resolves with

| argument    | description                                          |
| ----------- | ---------------------------------------------------- |
| username    | the username the user signed in with                 |

###### Rejects with

| error                          | message                                     |
| ------------------------------ | ------------------------------------------- |
| HoodieAccountUnconfirmedError  | Account has not been confirmed yet |
| HoodieAccountNotFoundError     | Account could not be found |
| HoodieError                    | _A custom error can be set by plugins, e.g. the account could be blocked due to missing payments_ |
| HoodieConnectionError | Could not connect to Server                 |

<br />


`signIn` tries to sign in the user to an existing account.

All local data that exists locally before signin in gets cleared. To prevent data loss, you can pass `{moveData: true}`
as the options argument, this will move current data (created anonymously or by another account) to the account the user signs in to.

###### Example

```javascript
 $('#signInForm').submit(function (ev) {
    ev.preventDefault();
    var username = $('#sername').val();
    var password = $('#password').val();

    hoodie.account.signIn(username, password)
      .done(welcomeUser)
      .fail(showErrorMessage);
});
```

<br />
### account.signOut()
> **version:** 		*> 0.2.0*


```javascript
hoodie.account.signOut(options);
```

| option     | type   | description    | required |
| ---------- |:------:|:--------------:|:--------:|
| options    | ------ | --------       | no       |

<br />

SignOut() uses standard CouchDB API to invalidate a user session (DELETE /_session).


###### Example

```javascript
hoodie.account.signOut();
```
<br />
###### Notes
> -


### old ===========================


### changePassword
// Note: the hoodie API requires the currentPassword for security reasons,
// but couchDb doesn't require it for a password change, so it's ignored
// in this implementation of the hoodie API.

<pre>
hoodie.account.changePassword('currentpassword', 'newpassword');
</pre>


### changeUsername
// Note: the hoodie API requires the current password for security reasons,
// but technically we cannot (yet) prevent the user to change the username
// without knowing the current password, so it's ignored in the current
// implementation.
//
// But the current password is needed to login with the new username.

<pre>
hoodie.account.changeUsername('currentpassword', 'newusername');
</pre>


### resetPassword
// This is kind of a hack. We need to create an object anonymously
// that is not exposed to others. The only CouchDB API offering such
// functionality is the _users database.
//
// So we actually sign up a new couchDB user with some special attributes.
// It will be picked up by the pa

<pre>
hoodie.account.resetPassword('joe@example.com');
</pre>




### destroy
// destroys a user's account

<pre>
hoodie.account.destroy('password');
</pre>


### username
<pre>
hoodie.account.username;
</pre>



### hasAccount
// anonymous accounts get created when data needs to be
// synced without the user having an account. That happens
// automatically when the user creates a task, but can also
// be done manually using hoodie.account.anonymousSignUp(),
// e.g. to prevent data loss.
//
// To determine between anonymous and "real" accounts, we
// can compare the username to the hoodie.id, which is the
// same for anonymous accounts.

<pre>
hoodie.account.hasAccount();
</pre>



### hasInvalidSession
// returns true if the user is signed in, but does not have a valid cookie
<pre>
hoodie.account.hasInvalidSession();
</pre>


### hasOwnProperty

### hasValidSession
// returns true if the user is signed in, and has a valid cookie.

<pre>
hoodie.account.hasValidSession();
</pre>


### on
// user has signed up (this also triggers the authenticated event, see below)
hoodie.account.on('signup', function (user) {});

// user has signed in (this also triggers the authenticated event, see below)
hoodie.account.on('signin', function (user) {});

// user has signed out
hoodie.account.on('signout', function (user) {});

// user has re-authenticated after their session timed out (this does _not_ trigger the signin event)
hoodie.account.on('authenticated', function (user) {});

// user's session has timed out. This means the user is still signed in locally, but Hoodie cannot sync remotely, so the user must sign in again
hoodie.account.on('unauthenticated', function (user) {});
