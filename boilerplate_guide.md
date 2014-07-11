# hoodie.account 
*available since 0.2*

#### after reading this you will know
> - how to sign up / in / out a user
> - how to get information about the user and store it
> - how to listen to account even

What is an account and what can it provide?


## Methods

- signUp()
- signIn()
- signOut() // please add anchors

### account.signIn() (> v.0.2)
*Signin a user.*

```javascript
hoodie.account.signIn('user', 'password');
```

| option     | type | desc |
| ------------- |:-------------:| -----:|
| user     | String | username |
| password      | String      |   the valid password |


<br />
###### Example

```javascript
 $('#signInForm').submit(function (ev) {
    ev.preventDefault();
    var username = $('#signUpUsername').val();
    var password = $('#signUpPassword').val();

    hoodie.account.signIn(username, password);
});
```
<br />
###### Notes
> There is no validation provided here. Please make this work on the frontend side.
> User need existing account.
> Please create an account with ````account.SignUp();````
