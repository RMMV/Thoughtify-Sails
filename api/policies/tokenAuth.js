/**
 * sessionAuth
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
var jwt = require('jwt-simple');
var secret = Secret['jwt-secret'];

module.exports = function(request, response, next) {

	/*	A special check to let registration requests through. Check config/policies.js
		for more information.
	*/
	// if (request.url === '/users' && String(request.method).toLowerCase() === 'post') {
	// 	next();
	// 	return;
	// }

	var token = request.headers['x-access-token'];

	if (token) {
		try {
			var decoded = jwt.decode(token, secret);

			if (decoded.exp <= Date.now()) {
	    		// expired token, let user know in error
				response.unauthorized({reason: 'Authentication token has expired'});
	    		return;
	    	}
	    	else {
	    		// get user from database and attach to request.user
	    		User.findOne({id: decoded.iss})
	    			.then(function(user){
	    				request.user = user;
	    				next();
	    			});
	    	}


		} catch (err) {
			// reject request
			response.unauthorized({ reason: "Token decode failed."});
	    	return;
	  	}
	} else {
		// reject request
		response.unauthorized({reason: 'No Authentication Token. Please send a request with an \'x-access-token\' header.'});
		return;
	}
};
