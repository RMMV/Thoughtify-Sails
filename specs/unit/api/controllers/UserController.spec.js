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
						fullfill(obj);
					});
				},
				findOne: function(){
					return new Promise(function(fullfill){
						fullfille([obj])
					});
				},
				authenticate: function(){
					return auth;
				}
			}
		}

		beforeEach('setup the globals', function(){
			configUserMock({id:1}, true);
			GLOBAL.Secret = {'jwt-secret': 'foobar'}
		});

		beforeEach('setup the response and next mocks', function(){
			response = { unauthorized: sinon.spy(), badRequest: sinon.spy() };
			next = sinon.spy();
		});

		beforeEach('fetch the controller', function(){
			controller = app.controllers.user;
		});

		it('should fail if the request has no user object', function(){
			controller.login({}, response, next);
			expect(next.called).to.be(false);
			expect(response.badRequest.called).to.be(true);
			expect(response.badRequest.getCall(0).args).to.eql([{reason: Failure.controllers.User.login.noUserInRequest}]);
		});

	});

});
