/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

/**
 * 	Algorithm:
 *
 * 	assertion 0: response body exists
 * 	assertion 1: body has a user object
 * 	assertion 2: user has a username
 *	lookup the user in the database using the username
 *	assertion 3: user found
 *	assertion 4: user has a password
 *	assertion 5: user''s password is valid
 *	make a jwt with the user''s id and an expiry date set to 7 days from today
 *	return web token, done
 */
var jwt = require('jwt-simple');

module.exports = {
	login: function(request, response, next) {

		var secret = Secret['jwt-secret'];

		if (request.body && request.body.user) {

			var expires = 60*60*24*7*1000 + Date.now();

			if (request.body.user.username && request.body.user.password) {

				User.findOne({username: request.body.user.username})
					.then(function(user){
						
						if (! user) {
							response.unauthorized({ reason: Failure.controllers.User.login.notInDB});
							return;
						}

						return user.authenticate(request.body.user.password)
							.then(function(isMatch) {
								if (! isMatch) {
									response.unauthorized({ reason: Failure.controllers.User.login.invalidPassword});
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
							title: Failure.controllers.User.login.generic,
							reason: error.message
						});
					})
					.then(function(token) {
						if (token) {
							response.ok({
								token: token,
								expires: expires
							})
						};
					});
			}
			else {
				response.badRequest({reason: Failure.controllers.User.login.invalidUser});
				return;
			}
		}
		else {
			response.badRequest({reason: Failure.controllers.User.login.missingUser});
			return;
		}
	}
};
