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
- changepassword
- changeusername
- passwordreset
- error:passwordreset
- error:unauthenticated



## Properties

<br>
### account.username
> **version:**    *> 0.2.0*

```javascript
hoodie.account.username
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


<br />
### account.changePassword()
> **version:**    *> 0.2.0*


```javascript
hoodie.account.changePassword(currentPassword, newPassword);
```


###### Arguments

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
###### Example

```javascript
hoodie.account.changeUsername('secret', 'newusername')
  .done(showSuccessMessage)
  .fail(showErrorMessage)
```


<br />
### account.resetPassword(username)
> **version:**    *> 0.2.0*


```javascript
hoodie.account.resetPassword('joe@example.com')
```


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


<br />
### account.destroy()
> **version:**    *> 0.2.0*


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
