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
  	// toJSON: toJSON
  }
};

function toJSON() {
	var vote = this.toObject();
	var done = false;

	// format the json in the way that ember data expects it to be
	['comment', 'idea'].forEach(function(thought){
		if (done) return;
		if (vote instanceof Object && vote.hasOwnProperty(thought)) {
			vote.thought = vote[thought];
			delete vote[thought];
			if (vote.thought) {
				vote.thought = {
					type: thought,
					id: vote.thought
				};
			}
			done = true;
		}
	});

	vote.id = vote._id;
	delete vote._id;
	delete vote.__v;
	return vote;
}
