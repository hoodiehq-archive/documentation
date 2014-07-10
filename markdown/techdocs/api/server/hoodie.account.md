# Server: Hoodie.Account

This is a work in progress documentation for  the serverside hoodie.account

//
// hoodie.account API
//
hoodie.account.add(type, attrs, callback)
hoodie.account.update(type, id, changed_attrs, callback)
hoodie.account.find(type, id, callback)
hoodie.account.findAll(callback)
hoodie.account.findAll(type, callback)
hoodie.account.remove(type, id, callback)
hoodie.account.removeAll(type, callback)

// hoodie.account events
hoodie.account.on('change', handler)
hoodie.account.on('type:change', handler)

// use case: 
// handle password resets
hoodie.account.on('$passwordReset:change', function(object) {
  // set new password in user doc & send it via email
})