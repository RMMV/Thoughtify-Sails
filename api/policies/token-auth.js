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

module.exports = function(request, response, next) {

	var token = request.headers['x-access-token'];
	var secret = Secret['jwt-secret'];

	if (token) {
		try {

			var decoded = jwt.decode(token, secret);

			if (decoded.exp <= Date.now()) {
	    		// expired token, let user know in error
				response.unauthorized({reason: Failure.authentication.tokenExpired});
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
			response.unauthorized({ reason: Failure.authentication.decodeFailure});
	    	return;
	    }

	} else {
		// reject request
		response.unauthorized({reason: Failure.authentication.noToken});
		return;
	}
};
