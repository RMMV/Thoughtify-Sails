/**
* Idea.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
	schema: true,
	tableName: 'ideas',
	attributes: {
		title: {
			type: 'string',
			maxLength: 200,
			minLength: 1,
			required: true,
		},
		body: {
			type: 'string',
			maxLength: 10000,
			minLength: 0,
			defaultsTo: ''
		},
		image: {
			type: 'string',
			url: true,
		},
		comments: {
			collection: 'comment',
			via: 'idea',
		},
		author: {
			model: 'user',
			via: 'ideas',
		},
		votes: {
			collection: 'vote',
			via: 'idea',
		},
	},
};
