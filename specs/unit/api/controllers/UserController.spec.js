var supertest = require('supertest');
var expect = require('expect.js');
var api = supertest('http://localhost:1338');
var sinon = require('sinon');

describe('UserController', function() {

	describe('#login', function(){

		var request, response, next, controller;
		function configUserMock(obj, auth){
			GLOBAL.User = {
				find: function(){
					return new Promise(function(fullfill){
						fullfill([obj]);
					});
				},
				findOne: function(){
					return new Promise(function(fullfill){
						fullfill(obj);
					});
				},
				authenticate: function(){
					return auth;
				}
			};
		}

		beforeEach('setup the globals', function(){
			configUserMock({id:1}, true);
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
			expect(next.called).to.be(false);
			expect(response.badRequest.called).to.be(true);
			expect(response.badRequest.getCall(0).args).to.eql([{reason: Failure.controllers.User.login.missingUser}]);
		});

		it('should fail if the request\'s body has no user', function(){
			controller.login({body:null}, response, next);
			expect(next.called).to.be(false);
			expect(response.badRequest.called).to.be(true);
			expect(response.badRequest.getCall(0).args).to.eql([{reason: Failure.controllers.User.login.missingUser}]);
		});

		it('should fail if the user has no username', function(){
			controller.login({body:{user:{}}}, response, next);
			expect(next.called).to.be(false);
			expect(response.badRequest.called).to.be(true);
			expect(response.badRequest.getCall(0).args).to.eql([{reason: Failure.controllers.User.login.invalidUser}]);
		});

		describe(', after looking up the user in the database,', function(){

			it('should fail if the user was not found', function(done){

				/**
				 * Failure in this test means timing out, sadly.
				 * Might need to reorganize the code to better test this.
				 */

				request = {
					body:{
						user:{
							username: 1,
							password: 1
						}
					}
				};

				response = {
					unauthorized: function(data){
						expect(data).to.eql({reason: Failure.controllers.User.login.notInDB});
						done();
					}
				};

				configUserMock(null, true);
				controller.login(request, response, next);
			});

		});

	});

});
