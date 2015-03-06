# Thoughtify-API
**Before starting the application, make sure you've run through the configuration steps outlined below.**

## Starting Application
```bash
# one time
$ npm start

# auto-refresh on file change
$ npm run-script lift
```

## Running tests
All the tests are run using a local installation of ```mocha``` along with ```chai.js```.
```bash
# one time
$ npm test

# re-run after each file change
$ make test-w
```

<br>
# Configuration
## JWT secret
Create a file called ```jwt-secret.js``` that exports a string of your choice inside ```/secrets```.

```JavaScript
// example file
module.exports = "my arbitrary string";
```

## Setting up SSL
Run following command and place generated keys inside ```/config/ssl```:

```bash
# your answers largely don't matter
$ openssl req -x509 -newkey rsa:2048 -keyout key.pem -nodes -out cert.pem -days 365
```

Then, change your config.local file to include the following lines:

```JavaScript
var path = require('path');
var fs = require('fs');

module.exports = {
    ssl: {
        key: fs.readFileSync(path.join(__dirname,'./ssl/key.pem')),
        cert: fs.readFileSync(path.join(__dirname, './ssl/cert.pem'))
    },
};

```

Start the app and behold the protocol in ```https://localhost:1337```!:
```bash
info: Starting app...

info:
info:                .-..-.
info:
info:    Sails              <|    .-..-.
info:    v0.11.0             |\
info:                       /|.\
info:                      / || \
info:                    ,'  |'  \
info:                 .-'.-==|/_--'
info:                 `--'-------'
info:    __---___--___---___--___---___--___
info:  ____---___--___---___--___---___--___-__
info:
info: Server lifted in `/home/ramanpreet/workspace/node/Thoughtify-Sails`
info: To see your app, visit https://localhost:1337
info: To shut down Sails, press <CTRL> + C at any time.

debug: --------------------------------------------------------
debug: :: Thu Mar 05 2015 21:18:01 GMT-0500 (EST)

debug: Environment : development
debug: Port        : 1337
debug: --------------------------------------------------------

```
