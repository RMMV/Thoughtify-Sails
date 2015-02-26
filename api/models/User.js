/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
	schema: true,
	tableName: 'users',
  attributes: {
  	username: {
  		type: 'string',
  		required: true,
  		unique: true,
  	},
  	email: {
  		type: 'email',
  		required: true,
  		unique: true,
  	},
    password: {
      type: 'string',
      required: true,
    },
  	about: {
  		type: 'string',
  		maxLength: 1000,
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
  	// toJSON: toJSON
  },
};

function toJSON() {
	var user = this.toObject();
	console.log(user);
	delete user.__v;
	return user;
}
