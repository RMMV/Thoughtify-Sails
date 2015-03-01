var supertest = require('supertest');
var expect = require('expect.js');
var api = supertest('http://localhost:1338');
var jwt = require('jwt-simple');
var sinon = require('sinon');
var bluebird = require('bluebird');

describe('Policy token-auth', function() {

    var policy = null;
    var request, response, next, token;
    var id = 1;

    beforeEach('set globals', function(){
        /* Global User model mock */
        GLOBAL.User = {
            findOne: function(){
                return new Promise(function(resolve){
                    resolve({id: id});
                });
            }
        }

        /* Global service mock */
        GLOBAL.Secret = {
            'jwt-secret': 'foobar'
        };
    });

    beforeEach('initialize the mocks', function(){
        /* request mock */
        request = {headers: {}};
        response = {unauthorized: sinon.spy()};
        next = sinon.spy();

        /* token mock */
        token = {
            iss: id,
            exp: Date.now() + 1e4
        };
    });

    beforeEach('fetch the policy', function(){
        policy = app.hooks.policies.middleware['token-auth'];
    });

    describe('when the token exists', function(){

        describe('and is invalid', function(){

            beforeEach('set the access token', function(){
                request.headers['x-access-token'] = jwt.encode(token, Secret['jwt-secret']).slice(0,-2);
            });

            it('will reject the user\'s request because of decode failure', function(){
                policy(request, response, next);
                expect(response.unauthorized.calledOnce).to.be(true);
                expect(response.unauthorized.getCall(0).args).to.eql([{reason: Failure.authentication.decodeFailure}]);
                expect(next.called).to.be(false);
            });
        });

        describe('and is valid', function(){

            describe('and token decode works', function(){

                it('will reject the user if the tokes has expired', function(){
                    token.exp = Date.now() - 1e10;
                    request.headers['x-access-token'] = jwt.encode(token, Secret['jwt-secret']);
                    policy(request, response, next);
                    expect(response.unauthorized.called).to.equal(true);
                    expect(response.unauthorized.getCall(0).args).to.eql([{reason: Failure.authentication.tokenExpired}]);
                    expect(next.called).to.equal(false);
                });

                it('will let the user through', function(done){
                    request.headers['x-access-token'] = jwt.encode(token, Secret['jwt-secret']);
                    policy(request, response, function(){
                        expect(request.user).to.eql({id:1});
                        done();
                    });
                });
            });
        });

        afterEach('reset the access token', function(){
            delete request.headers['x-access-token'];
        });

    });

    describe('when the token does not exist', function(){

        it('rejects the user because he\'s unauthorized', function(){
            policy(request, response, next);
            /*  sinon.calledWith didn't work here, so I found a workaround
                Investigate this issue later but for the time being,
                just use the following pattern:
            */
            expect(response.unauthorized.calledOnce).to.be(true);
            expect(response.unauthorized.getCall(0).args).to.eql([{reason: Failure.authentication.noToken}]);
            expect(next.called).to.be(false);
        });

    });

});
