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

## Events

- signup (username)
- signup:anonymous


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
    var username = $('#signUpUsername').val();
    var password = $('#signUpPassword').val();

    hoodie.account.signIn(username, password);
});
```
###### Notes
> - You need to signIn after a signUp!
> - Second password does not get checked at the moment. It is still a bug. 
> Please make sure to validate this on the frontend side.


<br />
### account.signUp() 
> **version:** 		*> 0.2.0* 
