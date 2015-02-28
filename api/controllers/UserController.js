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
						response.forbidden({ reason: 'User does not exist.'});
						return;
					}

					return user.authenticate(request.body.user.password)
						.then(function(isMatch) {
							if (! isMatch) {
								response.forbidden({ reason: 'Invalid password.'});
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
					response.serverError({
						title: 'Failed to login.',
						reason: error.message
					});
				})
				.done(function(token) {
					token && response.ok({
						token: token,
						expires: expires
					});
				});
		}
		else {
			response.badRequest({reason: 'No \'user\' root object in request body.'});
			return;
		}
	}
};
