/**
* Vote.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
	schema: true,
	tableName: 'votes',
	attributes: {
	idea: {
		model: 'idea',
		via: 'votes',
	},
	comment: {
		model: 'comment',
		via: 'votes',
	},
	caster: {
		model: 'user',
		via: 'votes',
	},
	value: {
		type: 'integer',
		enum: [1, 5, -1]
	},
  }
};

