/**
* Comment.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
	schema: true,
	tableName: 'comments',
  attributes: {
  	body: {
  		type: 'string',
  		defaultsTo: '',
  	},
  	idea: {
  		model: 'idea',
  		via: 'comments',
  	},
  	author: {
  		model: 'user',
  		via: 'comments',
  	},
  	votes: {
  		collection: 'vote',
  		via: 'comment',
  	},
  },
};
