/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
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
						token && response.ok({
							token: token,
							expires: expires
						});
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
