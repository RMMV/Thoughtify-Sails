var supertest = require('supertest');
var api = supertest('http://localhost:1338');
var sinon = require('sinon');
var jwt = require('jwt-simple');

describe('UserController', function() {

	describe('#login', function(){

		var request, response, next, controller;

		function configUserStub(obj, auth){

			var user = null;

			if (obj) {
				user = {
					authenticate: function() {
						return new Promise(function(fullfill){
							fullfill(auth);
						});
					}
				};

				Object.keys(obj).forEach(function(key){
					user[key] = obj[key];
				});
			}

			GLOBAL.User = {
				find: function(){
					return new Promise(function(fullfill){
						fullfill([user]);
					});
				},
				findOne: function(){
					return new Promise(function(fullfill){
						fullfill(user);
					});
				}
			};
		}

		beforeEach('setup the globals', function(){
			configUserStub({id:1}, true);
			GLOBAL.Secret = {'jwt-secret': 'foobar'};
		});

		beforeEach('setup the response and next mocks', function(){
			response = { unauthorized: sinon.spy(), badRequest: sinon.spy() };
			next = sinon.spy();
		});

		beforeEach('fetch the controller', function(){
			controller = app.controllers.user;
		});

		it('should fail if the request has no body', function(){
			controller.login({}, response, next);
			expect(next.called).to.equal(false);
			expect(response.badRequest.called).to.equal(true);
			expect(response.badRequest.getCall(0).args).to.eql([{reason: Failure.controllers.User.login.missingUser}]);
		});

		it('should fail if the request\'s body has no user', function(){
			controller.login({body:null}, response, next);
			expect(next.called).to.equal(false);
			expect(response.badRequest.called).to.equal(true);
			expect(response.badRequest.getCall(0).args).to.eql([{reason: Failure.controllers.User.login.missingUser}]);
		});

		it('should fail if the user has no username', function(){
			controller.login({body:{user:{password: 'yolo'}}}, response, next);
			expect(next.called).to.equal(false);
			expect(response.badRequest.called).to.equal(true);
			expect(response.badRequest.getCall(0).args).to.eql([{reason: Failure.controllers.User.login.invalidUser}]);
		});

		it('should fail if the user has no password', function(){
			controller.login({body:{user:{username: 'yolo'}}}, response, next);
			expect(next.called).to.equal(false);
			expect(response.badRequest.called).to.equal(true);
			expect(response.badRequest.getCall(0).args).to.eql([{reason: Failure.controllers.User.login.invalidUser}]);
		});

		describe(', after looking up the user in the database,', function(){

			beforeEach('setup the request', function(){
				request = {
					body:{
						user:{
							username: 1,
							password: 1,
						}
					}
				};
			});

			it('should fail if the user was not found', function(done){

				response = {
					unauthorized: function(args){
						expect(args).to.eql({ reason: Failure.controllers.User.login.notInDB});
						done();
					}
				}

				configUserStub(null, false);
				controller.login(request, response, next);


			});

			it('should fail if the user\'s password was incorrect', function(done){
				/**
				 * Failure in this test means timing out, sadly.
				 * Might need to reorganize the code to better test this.
				 */

				response = {
					unauthorized: function(args){
						expect(args).to.eql({ reason: Failure.controllers.User.login.invalidPassword});
						done();
					}
				};

				configUserStub({}, false);
				controller.login(request, response, next);

			});

			it('should return a jwt if the user\'s password was correct', function(done){

				response = {
					ok: function(res){
						expect(jwt.decode(res.token, Secret['jwt-secret']).iss).to.equal(10);
						done();
					}
				};

				configUserStub({id: 10}, true);
				controller.login(request, response, next);

			});
		});

	});

});
