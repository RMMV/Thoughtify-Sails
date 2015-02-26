/**
 * AuthController
 *
 * @description :: Server-side logic for managing Auths
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var jwt = require('jwt-simple');
var secret = require('../../secrets/jwt-secret');

module.exports = {
	register: function(request, response, next) {
		if (request.body) {
			User.findOne({username: request.body.username})
				.then(function(user) {
					if (user) {
						response.end('User already exists');
						return;
					}

					return User.create({
						username: request.body.username, 
						password: request.body.password
					});
						
				})
				.catch(function(error){
					response.status(500).json({
						title: 'Failed to register.',
						reason: error
					})
				})
				.done(function(user) {
					user && response.status(201).json({
						user: user
					});
				});
		} 
		else {
			response.badRequest();
			return;
		}
	},
	login: function(request, response, next) {
		if (request.body) {
			var expires = 60*60*24*7*1000 + Date.now();

			User.findOne({username: request.body.username})
				.then(function(user){
					if (! user) {
						response.end('User does not exist.');
						return;
					}

					return user.authenticate(request.body.password)
						.then(function(isMatch) {
							if (! isMatch) {
								response.end('Invalid password.');
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

