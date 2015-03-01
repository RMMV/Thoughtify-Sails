UNIT_TESTS=$$(find ./specs -iname "*.spec.js")
REPORTER=dot

test:
	@echo -e "\e[0;32mRunning unit tests! \e[0m"
	@NODE_ENV=test ./node_modules/.bin/mocha --reporter ${REPORTER} ${UNIT_TESTS}

test-w:
	@NODE_ENV=test ./node_modules/.bin/mocha --reporter ${REPORTER} --growl --watch ${UNIT_TESTS}

.PHONY: test test-w
