module.exports = {
    authentication: {
        noToken: 'No Authentication Token found. Please send a request with an \'x-access-token\' header.',
        decodeFailure: 'Invalid token; decode failed.',
        tokenExpired: 'Authentication token has expired, please re-login.',
    },
    controllers: {
        User: {
            login: {
                notInDB: 'User does not exist',
                invalidPassword: 'Invalid password.',
                generic: 'Failed to login',
                noUserInRequest: 'No \'user\' root object in request body.',
            }
        }
    }
}
