# Server: Hoodie.Database 

This is a work in progress documentation for  the serverside hoodie.database

// list all databases
hoodie.database.findAll(callback)

// create a new database
hoodie.database.add(name, callback)

// remove a database
hoodie.database.remove(name, callback)

// get a database object to make calls against
hoodie.database(name) => db

// add a document to db
db.add(type, attrs, callback)

// update a document in db
db.update(type, id, changed_attrs, callback)

// get a document from db
db.find(type, id, callback)

// get all documents from db
db.findAll(callback)

// get all documents of a single type in db
db.findAll(type, callback)

// remove a document from db
db.remove(type, id, callback)

// remove all documents of type in db
db.removeAll(type, callback)

// grant read access to everyone on db by updating CouchDB security
db.grantPublicReadAccess(callback)

// grant write access to everyone on db
db.grantPublicWriteAccess(callback)

// grant read access to specific user on db by updating CouchDB security
db.grantReadAccess(account_type, account_id, callback)

// grant write access to specific user on db by adding role (checked by design doc in db)
db.grantWriteAccess(account_type, account_id, callback)

// update db security so it's no longer publicly readable
db.revokePublicReadAccess(callback)

// update db security so it's no longer publicly writable
db.revokePublicWriteAccess(callback)

// remove user from couchdb readers for db
db.revokeReadAccess(account_type, account_id, callback)

// remove role from user so they cannot write to db (checked by design doc)
db.revokeWriteAccess(account_type, account_id, callback)


// Index / Query API is not yet implemented, see:
// https://github.com/hoodiehq/hoodie-plugins-api/issues/3

// creates new design doc with CouchDB view on db
db.addIndex(name, {map: .., reduce: ..}, callback)

// removes design doc for couchdb view on db
db.removeIndex(name, callback)

// query a couchdb view on db
db.query(index, options, callback)