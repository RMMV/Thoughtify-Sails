UNIT_TESTS=$$(find ./specs -iname "*.spec.js" | tr '\n' ' ')
REPORTER=dot

test:
	@echo -e "\e[0;32mRunning unit tests! \e[0m"
	@NODE_ENV=test ./node_modules/.bin/mocha --reporter ${REPORTER} --growl ${UNIT_TESTS}

test-w:
	@NODE_ENV=test ./node_modules/.bin/nodemon -e spec.js -q --exec './node_modules/.bin/mocha --reporter ${REPORTER} --growl $$(find ./specs -iname "*.spec.js" | tr "\n" " ")'

.PHONY: test test-w
