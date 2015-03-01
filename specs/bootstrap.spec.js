var Sails = require('sails').Sails;
var sails;

beforeEach(function(done) {

	var app = new Sails();
	app.lift({
		connections: {
	        testDB: {
	            adapter: 'sails-memory'
	        }
	    },
		connection: 'testDB',
		port: 1338
	}, callback);

	function callback(err, server) {
		if (err) {
			console.error('An error occured while trying to lift Sails for testing.');
			done(err);
			return;
		}

		sails = server;
		console.log('Welcome to Sails! Happy testing.');
		done(err, sails);
	}
});

afterEach(function() {
	sails.lower();
});

after(function(){

});
