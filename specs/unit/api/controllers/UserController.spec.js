var supertest = require('supertest');
var expect = require('expect.js');
var api = supertest('http://localhost:1338');

describe('UserController', function() {

	describe('authentication', function(){

		it('should prevent people from accessing /users endpoints', function(done){
			api .get('/users')
				.expect(401)
				.expect({reason: Failure.authentication.noToken}, done);
		});

	});

});
