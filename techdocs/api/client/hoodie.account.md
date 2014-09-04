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


### Properties
- [username](#accountusername)


<<<<<<< HEAD
### Methods
- [signUp()](#accountsignup)
- [signIn()](#accountsignin)
- [signOut()](#accountsignout)
- [changePassword()](#accountchangepassword)
- [changeUsername()](#accountchangeusername)
- [resetPassword()](#accountresetpassword)
- [destroy()](#accountdestroy)

### [Events](account-events)
- signup
- signin
- signout
- reauthenticated
=======
- [signUp](#accountsignup)
- signIn()
- signOut() // please add anchors
- changePassword()
- resetPassword()
- changeUsername()
- destroy()
- isSignedIn() // tba
- confirm(options) // tba
- checkAvailability(username) // tba
- userData() // tba


## Events

- signup (username)
- signup:anonymous
- signin:anonymous (username)
- movedata
- reauthenticated (newUsername)
- signin (newUsername, newHoodieId, options)
>>>>>>> gh-pages
- changepassword
- changeusername
- passwordreset
- error:passwordreset
- error:unauthenticated

<<<<<<< HEAD
=======

<a name="accountsignup" id="accountsignup"></a>
### account.signUp() 
> **version:** 		*> 0.2.0* 
>>>>>>> gh-pages


## Properties

<br>
### account.username
> **version:**    *> 0.2.0*

```javascript
<<<<<<< HEAD
hoodie.account.username
=======
hoodie.account.signUp(user, password, password2);
>>>>>>> gh-pages
```

`hoodie.account.username` gets automatically set / unset when signing in, signing up, changing username
or destroying the account.

It is also the current way to check if a user is signed in or not


###### Example

```javascript
if (hoodie.account.username) {
  // user is signed in
} else {
  // user is anonymous
}
```

## Methods

<br>
### account.signUp()
> **version:** 		*> 0.2.0*


```javascript
<<<<<<< HEAD
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
=======
 $('#signUpForm').submit(function (ev) {
    ev.preventDefault();
    var username  = $('#signUpUsername').val();
    var password  = $('#signUpPassword').val();
    var password2 = $('#signUpPassword2').val();
>>>>>>> gh-pages

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

###### Notes
> - The confirmation workflow will be customizable in future
> - there is no feature built-in to compare the password to a password confirmation.
>   If you need this logic, please validate this beforehand in your app.


<br />
### account.signIn()
> **version:** 		*> 0.2.0*


```javascript
<<<<<<< HEAD
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
=======
hoodie.account.signIn(user, password, options);
```

| option     | type    | description    | required |
| ---------- |:-------:|:--------------:|:--------:|
| user       | String  | username       | yes      |
| password   | String  | valid password | yes      |
| options    | Boolean | moveData       | no       |
| options    | Boolean | silent         | no       |
>>>>>>> gh-pages

<br />


`signIn` tries to sign in the user to an existing account.

All local data that exists locally before signin in gets cleared. To prevent data loss, you can pass `{moveData: true}`
as the options argument, this will move current data (created anonymously or by another account) to the account the user signs in to.

###### Example

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

<br />
### account.signOut()
> **version:** 		*> 0.2.0*


```javascript
hoodie.account.signOut(options);
```

<<<<<<< HEAD

###### Arguments

| Nr | option     | type   | description             | required |
| --:| ---------- |:------:|:-----------------------:|:--------:|
|  1 | options    | Object | {ignoreLocalChanges: true/false}  | no       |

###### Resolves with

_resolves without argument_

###### Rejects with

| error                          | message                        |
| ------------------------------ | ------------------------------ |
| HoodieAccountLocalChangesError | There are local changes that could not be synced |

<br />

`signOut()` ends the user's session if signed in, and clears all local data.

Before signing out a user, Hoodie pushes all local changes to the user's databases. If that fails
because the Server cannot be reached or the user's session is invalid, `signOut()` fails and rejects
with an `HoodieAccountLocalChangesError` error. To enforce a signout despite eventual data loss,
you can pass `{ignoreLocalChanges: true}` as the options argument.


###### Example

```javascript
hoodie.account.signOut()
  .done(redirectToHomepage)
  .fail(showError);
```

<br />
###### Notes
> - `HoodieAccountLocalChangesError` does currently not get returned, instead cryptic errors
>   may be returned, about the user not being authenticated or a failed request. See [#358](https://github.com/hoodiehq/hoodie.js/issues/358)

=======
| option     | type    | description    | required |
| ---------- |:-------:|:--------------:|:--------:|
| options    | Boolean | cleanup        | no       |
| options    | Boolean | silent         | no       |
>>>>>>> gh-pages

<br />
### account.changePassword()
> **version:**    *> 0.2.0*


```javascript
hoodie.account.changePassword(currentPassword, newPassword);
```


<<<<<<< HEAD
###### Arguments
=======
SignOut() uses standard CouchDB API to invalidate a user session (DELETE /_session).
Calling signOut() with ````options.cleanup = true```` cleans the localStorage. All local changes get deleted without sync to the server.
>>>>>>> gh-pages

| Nr | option           | type   | description                           | required |
| --:| ---------------- |:------:|:-------------------------------------:|:--------:|
|  1 | currentPassword  | String | password of signed in user            | yes      |
|  2 | newPassword      | String | new password for signed in user       | yes      |

###### Resolves with

_resolves without argument_

###### Rejects with

| error                      | message                        |
| -------------------------- | ------------------------------ |
| HoodieUnauthenticatedError | Not signed in |

<br />
###### Example

```javascript
hoodie.account.changePassword('secret', 'newSecret')
  .done(showSuccessMessage)
  .fail(showErrorMessage)
```

<br />
###### Notes
> - The current password is ignored with the current implementation.
>   This will be fixed with [#103](https://github.com/hoodiehq/hoodie.js/issues/103)


<br />
### account.changePassword()
> **version:**    *> 0.2.0*


```javascript
hoodie.account.changeUsername(currentPassword, newUsername);
```


###### Arguments

| Nr | option           | type   | description                           | required |
| --:| ---------------- |:------:|:-------------------------------------:|:--------:|
|  1 | currentPassword  | String | password of signed in user            | yes      |
|  2 | newUsername      | String | new username for signed in user       | yes      |

###### Resolves with

_resolves without argument_

###### Rejects with

| error                      | message                        |
| -------------------------- | ------------------------------ |
| HoodieUnauthenticatedError | Not signed in |
| HoodieConflictError        | Usernames identical |
| HoodieConflictError        | `<newUsername>` is taken |

<br />
<<<<<<< HEAD
###### Example

```javascript
hoodie.account.changeUsername('secret', 'newusername')
  .done(showSuccessMessage)
  .fail(showErrorMessage)
```
=======
### account.changePassword() 
> **version:** 		*> 0.2.0* 

>>>>>>> gh-pages

```javascript
hoodie.account.changePassword(currentpassword, newpassword);
```

<<<<<<< HEAD
<br />
### account.resetPassword(username)
> **version:**    *> 0.2.0*

=======
| option         | type   | description      | required |
| -------------- |:------:|:----------------:|:--------:|
| currentpassword| String | current password | no       |
| newpassword    | String | new password     | no       |

<br />
>>>>>>> gh-pages

```javascript
hoodie.account.resetPassword('joe@example.com')
```

<<<<<<< HEAD

###### Arguments

| Nr | option     | type   | description                                           | required |
| --:| ---------- |:------:|:-----------------------------------------------------:|:--------:|
|  1 | username   | String | username of the user which password shall be resetted | yes      |

###### Resolves with

| argument    | description                                          |
| ----------- | ---------------------------------------------------- |
| username    | the username that got the password resetted          |

###### Rejects with

| error                      | message                              |
| -------------------------- | ------------------------------------ |
| HoodieError                | User `<username>` could not be found |
| HoodieError                | No email address found               |
| HoodieError                | Failed to send password reset email  |
| HoodieConnectionError      | Could not connect to Server          |

<br />
###### Example

```javascript
hoodie.account.resetPassword('joe@example.com')
  .done(showSuccessMessage)
  .fail(showErrorMessage)
```

<br />
###### Notes
> - We currently generate a new password and send it out via email.
>   In future, we will send a token instead, see [#360](https://github.com/hoodiehq/hoodie.js/issues/360)
=======
###### Example

```javascript
$('#editUserForm').submit(function (ev) {
    ev.preventDefault();
    var currentpassword = $('#pw1').val();
    var newpassword = $('#pw2').val();

    hoodie.account.changePassword(pw1, pw2);
});
```
<br />
###### Notes
> - The hoodie API requires the currentPassword for security reasons, but couchDb doesn't require it for a password change, so it's ignored in this implementation of the hoodie API.


<br />
### account.resetPassword() 
> **version:** 		*> 0.2.0* 


```javascript
hoodie.account.resetPassword(username);
```

| option         | type   | description      | required |
| -------------- |:------:|:----------------:|:--------:|
| username       | String | username         | yes      |

<br />

Here we sign up a new CouchDB user with some special attributes, but this happends internally. It will be picked up by the password reset worker and removed once the password was reset.

###### Example
>>>>>>> gh-pages

```javascript
$('#editUserForm').submit(function (ev) {
    ev.preventDefault();
    var user = hoodie.account.username;

<<<<<<< HEAD
<br />
### account.destroy()
> **version:**    *> 0.2.0*
=======
    if (user != undefined) {
        hoodie.account.resetPassword(user);
    } else {
        alert('Please log in first!');
    }
});
```
<br />
###### Notes
> - We still need to check, if the passwordReset gets executed. There is already a filed issue to fix that.


<br />
### account.checkPasswordReset() 
> **version:** 		*> 0.2.0* 


```javascript
hoodie.account.checkPasswordReset(user);
```

| option     | type   | description      | required |
| ---------- |:------:|:----------------:|:--------:|
| username   | String | username         | yes      |

<br />

  The hoodie.account.checkPasswordReset() Method checks for the status of a password reset. It might take a while until the password reset worker picks up the job and updates it.

  If a password reset request was successful, the $passwordRequest doc gets removed from _users by the worker, therefore a 401 is what we are waiting for.
  
  Once called, it continues to request the status update with a one second timeout.

###### Example

```javascript
$('#editUserForm').submit(function (ev) {
    // here goes some code!
});
```
<br />
###### Notes
> 


<br />
### account.changeUsername(currentPassword, newUsername) 
> **version:** 		*> 0.2.0* 


```javascript
hoodie.account.changeUsername(currentPassword, newUsername);
```

| option         | type   | description      | required |
| -------------- |:------:|:----------------:|:--------:|
| currentPassword| String | current password | yes      |
| newUsername    | String | new username     | yes      |

<br />

###### Example

```javascript
$('#editUserForm').submit(function (ev) {
    ev.preventDefault();
    var currentPassword = $('#pw').val();
    var newUsername = $('#newUser').val();

    hoodie.account.changeUsername(currentPassword, newUsername);
});
```
<br />
###### Notes
> - The current password is needed to login with the new username.

<br />
### account.destroy() 
> **version:**      *> 0.2.0* 


```javascript
hoodie.account.destroy();
```

| option         | type   | description      | required |
| -------------- |:------:|:----------------:|:--------:|
| -              | -      | -                | -        |

<br />

###### Example

```javascript
// add prompt

hoodie.account.destroy();
```
<br />
###### Notes
> - The account get's destroyed right away, so please make sure to implement a checkback.




### old ===========================
>>>>>>> gh-pages


```javascript
hoodie.account.destroy()
```


###### Arguments

_no arguments_

###### Resolves with

_resolves without argument_

###### Rejects with

| error                      | message                              |
| -------------------------- | ------------------------------------ |
| HoodieConnectionError      | Could not connect to Server          |

<br />
###### Example

```javascript
hoodie.account.destroy()
  .done(showSuccessMessage)
  .fail(showErrorMessage)
```

<br />
###### Notes
> - When a user account gets destroy, the user's database gets removed and cannot be recovered.
> - We currently do not ask for the user's password, but plan to do so in the future [#55](https://github.com/hoodiehq/hoodie.js/issues/55)


<br />
## Account events

| name | arguments | description |
| ---- | --------- | ----------- |
| signup | username | triggered after user successfully signed up |
| signin | username | triggered after user successfully signed in |
| signout | username | triggered after user successfully signed out |
| reauthenticated | username | triggered after user successfully signed in with current username. See `error:unauthenticated` event for more information. |
| changepassword | - | triggered after user successfully changed the password |
| changeusername | username | triggered after user successfully changed the username |
| passwordreset | username | triggered after password has been resetted successfully |
| error:passwordreset | error, username | An error occured when trying to reset the password for `username` |
| error:unauthenticated | error, username | The current user has no valid session anymore and needs to reauthenticate. As Hoodie works offline, it can get into a state where a user is signed in with data stored in the browser, but without a valid session, so e.g. sync does not work anymore. In that case, the `error:unauthenticated` is triggered and the user should sign in with the current username again. |


###### Example

```javascript
hoodie.account.on('signup signin', redirectToDashboard)
hoodie.account.on('error:unauthenticated', showSignInForm)
```
