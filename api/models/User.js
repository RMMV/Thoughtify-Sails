/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/
var bluebird = require('bluebird');
var bcrypt = bluebird.promisifyAll(require('bcrypt'), {suffix: '$'});

module.exports = {
	schema: true,
	tableName: 'users',
	attributes: {
		username: {
			type: 'string',
			required: true,
			notEmpty: true,
			unique: true,
		},
		email: {
			type: 'email',
			required: true,
			notEmpty: true, // redundant? idk
			unique: true,
		},
		password: {
			type: 'string',
			required: true,
			minLength: 8,
		},
		about: {
			type: 'string',
			maxLength: 10000,
			minLength: 0,
			defaultsTo: '',
		},
		avatar: {
			type: 'string',
			url: true,
		},
		votes: {
			collection: 'vote',
			via: 'caster',
		},
		comments: {
			collection: 'comment',
			via: 'author',
		},
		ideas: {
			collection: 'idea',
			via: 'author',
		},
		authenticate: function(password) {
			return bcrypt.compare$(password, this.password);
		},
	},

	beforeCreate: function(values, cb) {
		bcrypt.genSalt$(10)
			.then(function(salt) {
				return bcrypt.hash$(values.password, salt);
			})
			.then(function(hash) {
				values.password = hash;
				cb();
			})
			.catch(function(error) {
				cb(error);
			});
	}
};
