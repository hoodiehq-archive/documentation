# hoodie.account 
> **version:** 		*> 0.1.0* <br />
> **source:** 		*hoodie/src/hoodie/account.js*<br />
> **tutorial:** 	*http://hood.ie/tutorial/accounts*<br />

**<br />after reading this you will know:**
- how to sign up / in / out a user
- how to get information about the user and store it
- how to listen to account even

## Introduction

*The account object gives you the methods to create, update and delete an account. Your data will be stored locally and synced by saving to the server. After logging in on another device you can access it again, because your data is always bound to the account by default.*



## Methods

- signUp()
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
- changepassword
- resetpassword
- error:passwordreset (error, username)
- changeusername (newUsername)
- error:unauthenticated
- passwordreset (username)
- signup (username)
- cleanup
- signout (username)

### account.signUp() 
> **version:** 		*> 0.2.0* 


```javascript
hoodie.account.signUp('user', 'password', 'password2');
```

| option     | type   | description     | required |
| ---------- |:------:|:---------------:|:--------:|
| user       | String | username        | yes      |
| password   | String | valid password  | yes      |
| password2  | String | repeat password | yes      |

<br />


SignUp uses standard CouchDB API to create a new document in _users db.

The backend will automatically create a userDB based on the username address and approve the account by adding a 'confirmed' role to the user doc. The account confirmation might take a while, so we keep trying to sign in with a 300ms timeout.

###### Example

```javascript
 $('#signInForm').submit(function (ev) {
    ev.preventDefault();
    var username  = $('#signUpUsername').val();
    var password  = $('#signUpPassword').val();
    var password2 = $('#signUpPassword2').val();

    hoodie.account.signUp(username, password, password2);
});
```

###### Notes
> - You need to signIn after a signUp!
> - Second password does not get checked at the moment. It is still a bug. 
> Please make sure to validate this on the frontend side.


<br />
### account.signIn() 
> **version:** 		*> 0.2.0* 


```javascript
hoodie.account.signIn('user', 'password', options);
```

| option     | type   | description    | required |
| ---------- |:------:|:--------------:|:--------:|
| user       | String | username       | yes      |
| password   | String | valid password | yes      |
| options    |        | moveData       | no       |

<br />

SignIn() uses the standard CouchDB API to create a new user session (POST /_session).
Besides the standard sign in, hoodie also checks if the account has been confirmed (roles include 'confirmed' role).

When signing in, by default all local data gets cleared beforehand. Otherwise data that has been created beforehand (authenticated with another user account or anonymously) would be merged into the user account that signs in. That only applies if username isn't the same as current username.

To prevent data loss, signIn can be called with ````options.moveData = true````, that will move all data from the anonymous account to the account the user signed into.

###### Example

```javascript
 $('#signInForm').submit(function (ev) {
    ev.preventDefault();
    var username = $('#signUpUsername').val();
    var password = $('#signUpPassword').val();

    hoodie.account.signIn(username, password);
});
```
###### Notes
> - Please create an account with ````account.SignUp();````


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
