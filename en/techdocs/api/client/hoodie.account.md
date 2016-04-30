---
layout: layout-api
locales: en
---
# hoodie.account
**version:** 		*> 0.1.0*<br>
**source:** 		*[hoodie.js/src/hoodie/account](https://github.com/hoodiehq/hoodie/tree/hoodie-client-legacy/src/hoodie/account)*

The account object in the client-side Hoodie API covers all user and authentication-related operations, and enables you to do previously complex operations, such as signing up a new user, with only a few lines of frontend code. Since [data in Hoodie is generally bound to a user](/en/hoodieverse/glossary.html#private-user-store), it makes sense to familiarise yourself with **account** before you move on to [store](/en/techdocs/api/client/hoodie.store.html).

**After reading this guide, you will know how to:**

- sign a user up, in and out
- check if a user is signed in
- change username or password
- reset a password
- listen to account events
- destroy a user account

<a id="top"></a>

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

### Events
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

**hoodie.account.username** gets automatically set/unset when signing in, signing up, changing the username or destroying the account.

It is also the current way to check if a user is signed in or not.


#### Example

```javascript
if (hoodie.account.username) {
  // user is signed in
  console.log('Hey there, '+hoodie.account.username);
} else {
  // user is anonymous
  console.log('You are not logged in!');
}
```

<a id="accountsignup"></a>
### [account.signUp()](#accountsignup)
**version:** 		*> 0.2.0*

**Lets you sign up a new user**

```javascript
hoodie.account.signUp('user', 'password');
```

##### Arguments

| Nr | argument   | type   | description     | required |
|:--:|:---------- |:------ |:--------------- |:-------- |
|  1 | username   | String | username        | yes      |
|  2 | password   | String | valid password  | yes      |


##### Resolves with

| argument    | description                                          |
| ----------- | ---------------------------------------------------- |
| username    | the username the user signed up with                 |

##### Progresses with

| argument    | when                                                 |
| ----------- | ---------------------------------------------------- |
| -           | after account created on server, before confirmation |

##### Rejects with

| error                 | message                                     |
| --------------------- | ------------------------------------------- |
| HoodieError           | Username must be set                        |
| HoodieError           | Must sign out first                         |
| HoodieConflictError   | Username **<username>** already exists   |
| HoodieConnectionError | Could not connect to server                 |


**signUp** creates a new user account on the Hoodie server. Currently, the account is confirmed automatically after the user-specific database (where all the user's data gets automatically synchronized to) has been created.

#### Example
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

**Note:** The confirmation workflow will be customizable in future, so you'll be able to require signup confirmation by email, for example. This will happen in the admin panel of the user-plugin.


<a id="accountsignin"></a>
### [account.signIn()](#accountsignin)
**version:** 		*> 0.2.0*

**Signs in an existing user.**

```javascript
hoodie.account.signIn('user', 'password');
```

##### Arguments

| Nr | option     | type   | description             | required |
|:--:|:---------- |:------ |:----------------------- |:-------- |
|  1 | user       | String | username                | yes      |
|  2 | password   | String | valid password          | yes      |
|  3 | options    | Object | {moveData: true/false}  | no       |

##### Resolves with

| argument    | description                                          |
| ----------- | ---------------------------------------------------- |
| username    | the username the user signed in with                 |

##### Rejects with

| error                          | message                                     |
| ------------------------------ | ------------------------------------------- |
| HoodieAccountUnconfirmedError  | Account has not been confirmed yet |
| HoodieAccountNotFoundError     | Account could not be found |
| HoodieError                    | _A custom error can be set by plugins, e.g. the account could be blocked due to missing payments_ |
| HoodieConnectionError | Could not connect to server                 |

The **signIn** method tries to sign in the user to an existing account.

#### NOTES

All Hoodie data that existed in the browser's local store before signin will be cleared on signin. To prevent data loss, you can pass **{moveData: true}** as the options argument, this will move current data (created anonymously) to the account the user signs in to.

**moveData** is useful for the following very rare Offline-First edge case: a user wants to use your app and
- has the app itself cached locally (with AppCache, for example)
- is *not* signed in to the app
- cannot sign in (authenticate with the server) because there's no internet connection

They can then work as an anonymous user and produce new data with the app, and as soon as they're online again, they can sign in with **moveData:true**. This will migrate all their local user data from their anonymous user over to their actual user.

#### Example

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

**Signs the current user out of their existing and clears all local data**

```javascript
hoodie.account.signOut(options);
```

##### Arguments

| Nr | option     | type   | description             | required |
|:--:|:---------- |:------ |:----------------------- |:-------- |
|  1 | options    | Object | {ignoreLocalChanges: true/false}  | no       |

##### Resolves with

_resolves without argument_

##### Rejects with

| error                          | message                        |
| ------------------------------ | ------------------------------ |
| HoodieAccountLocalChangesError | There are local changes that could not be synced |

Before signing out a user, Hoodie pushes all local changes to the user's server-side database. If that fails because the server cannot be reached, or because the user's session is invalid, **signOut()** fails and rejects with an **HoodieAccountLocalChangesError** error. To enforce a signout despite eventual data loss, you can pass **{ignoreLocalChanges: true}** in the options argument.

#### Example

```javascript
hoodie.account.signOut()
  .done(redirectToHomepage)
  .fail(showError);
```

#### Notes
**HoodieAccountLocalChangesError** does currently not get returned, instead you will receive cryptic errors about the user not being authenticated or a failed request. See [issue #358](https://github.com/hoodiehq/hoodie.js/issues/358).

<a id="accountchangepassword"></a>
### [account.changePassword()](#accountchangepassword)
**version:**    *> 0.2.0*

**Lets a registered user change their password.**

```javascript
hoodie.account.changePassword(currentPassword, newPassword);
```

##### Arguments

| Nr | option           | type   | description                           | required |
|:--:|:---------------- |:------ |:------------------------------------- |:-------- |
|  1 | currentPassword  | String | password of signed in user            | yes      |
|  2 | newPassword      | String | new password for signed in user       | yes      |

##### Resolves with

_resolves without argument_

##### Rejects with

| error                      | message                        |
| -------------------------- | ------------------------------ |
| HoodieUnauthenticatedError | Not signed in |


#### Example

```javascript
hoodie.account.changePassword('secret', 'newSecret')
  .done(showSuccessMessage)
  .fail(showErrorMessage)
```

<a id="accountchangeusername"></a>
### [account.changeUsername()](#accountchangeusername)
**version:**    *> 0.2.0*

**Lets a registered user change their username.**

```javascript
hoodie.account.changeUsername(currentPassword, newUsername);
```

##### Arguments

| Nr | option           | type   | description                           | required |
| --:| ---------------- |:------:|:------------------------------------- |:-------- |
|  1 | currentPassword  | String | password of signed in user            | yes      |
|  2 | newUsername      | String | new username for signed in user       | yes      |

##### Resolves with

_resolves without argument_

##### Rejects with

| error                      | message                        |
| -------------------------- | ------------------------------ |
| HoodieUnauthenticatedError | Not signed in |
| HoodieConflictError        | Usernames identical |
| HoodieConflictError        | **<newUsername>** is taken |


#### Example

```javascript
hoodie.account.changeUsername('secret', 'newusername')
  .done(showSuccessMessage)
  .fail(showErrorMessage)
```


<a id="accountresetpassword"></a>
### [account.resetPassword()](#accountresetpassword)
**version:**    *> 0.2.0*

```javascript
hoodie.account.resetPassword(username);
```

##### Arguments

| Nr | option     | type   | description                    | required |
|:--:|:---------- |:------ |:------------------------------ |:-------- |
|  1 | username   | String | username for which to reset password | yes      |

##### Resolves with

| argument    | description                                          |
| ----------- | ---------------------------------------------------- |
| username    | the username whose password was reset          |

##### Rejects with

| error                      | message                              |
| -------------------------- | ------------------------------------ |
| HoodieError                | User **<username>** could not be found |
| HoodieError                | No email address found               |
| HoodieError                | Failed to send password reset email  |
| HoodieConnectionError      | Could not connect to Server          |

#### Example

```javascript
hoodie.account.resetPassword('joe@example.com')
  .done(showSuccessMessage)
  .fail(showErrorMessage)
```

##### Notes
> We currently generate a new password and send it out via email.
> In future, we will send a token instead, see [#360](https://github.com/hoodiehq/hoodie.js/issues/360)


<a id="accountdestroy"></a>
### [account.destroy()](#accountdestroy)
**version:**      *> 0.2.0*

**Destroys the account of the currently signed in user.**

```javascript
hoodie.account.destroy();
```

##### Arguments

_no arguments_

##### Resolves with

_resolves without argument_

##### Rejects with

| error                      | message                              |
| -------------------------- | ------------------------------------ |
| HoodieConnectionError      | Could not connect to Server          |

#### Example

```javascript
hoodie.account.destroy()
  .done(showSuccessMessage)
  .fail(showErrorMessage)
```

##### Notes
> - When a user account gets destroyed, the user's database gets removed and cannot be recovered.
> - We currently do not ask for the user's password, but plan to do so in the future [#55](https://github.com/hoodiehq/hoodie.js/issues/55)


<a id="accountevents"></a>
### [Account events](#accountevents)

| name | arguments | description |
| ---- | --------- | ----------- |
| <a id="signup"></a>[signup](#signup) | username | triggered after user successfully signed up |
| <a id="signin"></a>[signin](#signin) | username | triggered after user successfully signed in |
| <a id="signout"></a>[signout](#signout) | username | triggered after user successfully signed out |
| <a id="reauthenticated"></a>[reauthenticated](#reauthenticated) | username | triggered after user successfully signed in with current username. See **error:unauthenticated** event for more information. |
| <a id="changepassword"></a>[changepassword](#changepassword) | - | triggered after user successfully changed the password |
| <a id="changeusername"></a>[changeusername](#changeusername) | username | triggered after user successfully changed the username |
| <a id="passwordreset"></a>[passwordreset](#passwordreset) | username | triggered after password has been reset successfully |
| <a id="error-passwordreset"></a>[error:passwordreset](#error-passwordreset) | error, username | An error occurred when trying to reset the password for **username** |
| <a id="error-unauthenticated"></a>[error:unauthenticated](#error-unauthenticated) | error, username | The current user has no valid session anymore and needs to reauthenticate. As Hoodie works offline, it can get into a state where a user is signed in with data stored in the browser, but without a valid session, so e.g. sync does not work anymore. In that case, the **error:unauthenticated** is triggered and the user should sign in with the current username again. |


#### Example

```javascript
hoodie.account.on('signup signin', redirectToDashboard)
hoodie.account.on('error:unauthenticated', showSignInForm)
```

## Next Steps

Right, now you're ready for the meaty bits! Check out the guide for the [store API](/en/techdocs/api/client/hoodie.store.html)!

We hope this API guide was helpful! If not, please let us help you <a href="http://hood.ie/chat" target="_blank">on IRC or Slack</a>.

We also have an <a href="http://faq.hood.ie" target="_blank">FAQ</a> that could prove useful if things go wrong.

If you find this guide in error or out of date, you could also <a href="https://github.com/hoodiehq/documentation/issues" target="_blank">open an issue</a> or submit a pull request with your corrections to <a href="https://github.com/hoodiehq/documentation/blob/gh-pages/en/techdocs/api/client/hoodie.account.md" target="_blank">this file</a>.
