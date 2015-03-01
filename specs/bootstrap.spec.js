var Sails = require('sails').Sails;
var sails;

beforeEach('Lift a new sails server at port 1338.', function(done) {

	var app = new Sails();
	app.lift({
		connections: {
	        testDB: {
	            adapter: 'sails-memory'
	        }
	    },
		connection: 'testDB',
		log:{
			noShip: true,
		},
		port: 1338
	}, callback);

	function callback(err, server) {
		if (err) {
			console.error('An error occured while trying to lift Sails for testing.');
			done(err);
			return;
		}

		sails = server;
		done(err, sails);
	}
});

afterEach('Lower our sails server.', function() {
	sails.lower();
});
