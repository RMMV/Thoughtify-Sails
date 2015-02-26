/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var jwt = require('jwt-simple');
var secret = Secret['jwt-secret'];

module.exports = {
	login: function(request, response, next) {
		if (request.body && request.body.user) {
			var expires = 60*60*24*7*1000 + Date.now();

			User.findOne({username: request.body.user.username})
				.then(function(user){
					if (! user) {
						response.status(401).end('User does not exist.');
						return;
					}

					return user.authenticate(request.body.user.password)
						.then(function(isMatch) {
							if (! isMatch) {
								response.status(401).end('Invalid password.');
								return;
							} 

							// return jwt
							return jwt.encode({
								iss: user.id,
								exp: expires,
							}, secret);

						});
				})
				.catch(function(error) {
					response.status(500).json({
						title: 'Failed to login.',
						reason: error
					})
				})
				.done(function(token) {
					token && response.status(200).json({
						token: token,
						expires: expires
					})
				});
		} 
		else {
			response.badRequest();
			return;
		}
	}
};

