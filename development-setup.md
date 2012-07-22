# How to get up and running with hood.ie (with OS X and localhost)

###THIS IS A WORK IN PROGRESS AND MIGHT BREAK AT ANY TIME

Hoodie in OS X and with localhost in 7 not particularly complicated steps
-------------------------------------------------------------------------

Works as of 11.07.2012

Installation
------------

This assumes you've got Homebrew installed and up to date. Open a terminal window and:

###1. Get CouchDB 
(1.2 required. If you already have it installed, run `$ couchdb -V` to check your version)

	$ brew install CouchDB

###2. Get nodeJS

	$ brew install nodejs

###3. Get npm (the Node Package Manager)

	$ curl http://npmjs.org/install.sh | sh

###4. Start couch and leave it running

	$ sudo CouchDB

###5. Check your installation

Check that everything worked by opening Futon, the CouchDB admin interface, at http://127.0.0.1:5984/_utils

Run "Verify Installation" (under "tools" in the sidebar on the right)

Set up an admin user for couch (bottom of the sidebar) and remember the user name and password for point 7

Don't bother with the "Test Suite", that's for people working on couch itself

###6. Set up the CORS-Proxy

You'll very likely need a proxy to avoid different origin-problems, which you will definitely get if you want to build stuff in localhost. Get cors-proxy from https://github.com/gr2m/cors-proxy and put it somewhere you'll find it again. Open a terminal in the cors-proxy folder and do $ npm install . (the "." is important)

To run the proxy, do `$ node server.js` and leave it running

More on how to use the proxy later

###7. Set up a database worker

Get the worker-user-database script from https://github.com/hoodiehq/worker-user-database and put it somewhere you'll find it again. This worker creates individual databases from hoodie users, which is something you need. So this needs to be running all the time
You'll need to set some environment variables. Open a new terminal window in this folder and do 

	$ export HOODIE_SERVER=http://localhost:5984
	$ export HOODIE_ADMIN_USER=couch_admin_username
	$ export HOODIE_ADMIN_PASS=couch_admin_password

To start the worker, do `$ node index.js` and leave it running

You're set. You'll need to have CouchDB, node server.js and node CreateUserDatabase running at all times, so don't close those terminal tabs or windows. You can turn couch into a daemon so it starts automatically with your system (check out http://guide.couchdb.org/draft/source.html#daemon).

First steps
-----------

To start doing stuff with hoodie, you'll need a html file that gets served from any kind of webserver. 
As of now, hoodie.js requires jQuery. So just include jQuery and hoodie.js from from these external hosts and you're good to go. 
Then start by initializing a hoodie:
	
	<html>
	  <head>
	    <title>Hello Hoodie</title>
	  </head>
	  <body>
	    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
	    <script src="http://hoodiehq.github.com/hoodie-client.js/hoodie.js"></script>
	    <script>
	      couchDB_endpoint = 'http://localhost:9292/localhost:5984';
	      hoodie = new Hoodie(couchDB_endpoint);

	 			// do some hoodie magic here
	    </script>
	  </body>
	</html>

The only interesting thing here is the content of "CouchDB_endpoint": localhost:9292 is the cors-proxy you launched in step 6, and you pass the local couch endpoint (localhost:5984) to that.

So now you're ready to save data:

	hoodie.my.store.create('couch', {color: 'red'});

Now, since hoodie currently only stores data that belongs to individual users, this isn't actually written into the database. Instead, it is stored locally and synced to the couch as soon as the current user is signed up. The same thing happens if you're offline while using the app. Hoodie will save changes locally and sync them as soon as the server becomes available. 

So now try registering a new user with hoodie:

	hoodie.my.account.signUp('joe@example.com', 'secret')
	      .done( function(user) { console.log("Yay! ", user) } )
	      .fail( function(err)  { console.log("Meh. ", err) } )

You should see the server.js terminal showing some activity as the worker converts the new user to a database, and you should also be able to see a new database called joe$example.com when you call up http://localhost:5984/_utils (Don't worry about the "$" in the database name). The 'couch'-object you created a minute ago (that only existed locally before you set up the user) has now automatically been synced with the server and lives inside that user database. If you go ahead and change the color attribute of the couch Object in Futon and then go back to check the browser's localStorage, you should see that the local copy has automatically been synced as well. That's some pretty effortless persistence right there.

Let's do one more thing. Add this to the code or run it in your console:

	hoodie.my.remote.on('changed', function(type, id, changedObject) {
		console.log("Someone painted my couch ", changedObject.color);
	});

In Futon, change the color attribute of the 'couch'-object to 'green' and then check your browser console. Don't tell me that isn't awesome!

Take a look at http://hoodiehq.github.com/hoodie-client.js/ for more of the hoodie API reference.

Have fun trying out hoodie!

