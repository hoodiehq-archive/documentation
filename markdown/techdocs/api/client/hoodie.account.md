# Hoodie.Account

*Source: hoodie/src/hoodie/account.js*


## Methods

<hr />
###### blueprint
account.signUp // headline

account signUp // description

.signUp(‘username’, ‘password’) // Options + hoodie version (since v 1.0 f.e.)

var, type, description
var, type, description

longer description with all options.

example of code:
hoodie.account.signUp('joe@example.com', 'secret');

practical example:
 $('#signUpForm').submit(function (ev) {
ev.preventDefault();
var username = $('#signUpUsername').val();
var password = $('#signUpPassword').val();

hoodie.account.signUp(username, password);
});

CAUTION! This might be a problem… // show the user if anything could go wrong & why!
// add errorhandling → FAQ



<hr />





### signIn
// uses standard CouchDB API to create a new user session (POST /_session).
// Besides the standard sign in we also check if the account has been confirmed
// (roles include 'confirmed' role).
//
// When signing in, by default all local data gets cleared beforehand.
// Otherwise data that has been created beforehand (authenticated with another user
// account or anonymously) would be merged into the user account that signs in.
// That only applies if username isn't the same as current username.
//
// To prevent data loss, signIn can be called with options.moveData = true, that wll
// move all data from the anonymous account to the account the user signed into.

<pre>
hoodie.account.signIn('joe@example.com', 'secret');
</pre>


<pre>
hoodie.account.signIn('joe@example.com', 'secret');
</pre>


### signUp
// sign up with username & password
// ----------------------------------

// uses standard CouchDB API to create a new document in _users db.
// The backend will automatically create a userDB based on the username
// address and approve the account by adding a 'confirmed' role to the
// user doc. The account confirmation might take a while, so we keep trying
// to sign in with a 300ms timeout.

<pre>
hoodie.account.signUp('joe@example.com', 'secret', 'secret');
</pre>

#### ?
// you need to signIn after a signUp!
// is the check second PW bug fixed finally?


### anonymousSignUp

// anonymous sign up
  // -------------------

  // If the user did not sign up yet, but data needs to be transferred
  // to the couch, e.g. to send an email or to share data, the anonymousSignUp
  // method can be used. It generates a random password and stores it locally
  // in the browser.
  //
  // If the user signs up for real later, we 'upgrade' the account, meaning we
  // change the username and password internally instead of creating another user.

<pre>
hoodie.account.anonymousSignUp();
</pre>


### signOut
 // uses standard CouchDB API to invalidate a user session (DELETE /_session)

<pre>
hoodie.account.signOut();
</pre>


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


### checkPasswordReset
// check for the status of a password reset. It might take
// a while until the password reset worker picks up the job
// and updates it
//
// If a password reset request was successful, the $passwordRequest
// doc gets removed from _users by the worker, therefore a 401 is
// what we are waiting for.
//
// Once called, it continues to request the status update with a
// one second timeout

<pre>
hoodie.account.checkPasswordReset('joe@example.com');
</pre>


### destroy
// destroys a user's account

<pre>
hoodie.account.destroy();
</pre>


### username
<pre>
hoodie.account.username;
</pre>


### authenticate
// Use this method to assure that the user is authenticated:
  // `hoodie.account.authenticate().done( doSomething ).fail( handleError )`

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

### hasAnonymousAccount
// checks if the user has an anonymous account
<pre>
hoodie.account.hasAnonymousAccount();
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
