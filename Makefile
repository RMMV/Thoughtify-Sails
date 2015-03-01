UNIT_TESTS=$$(find ./specs -iname "*.spec.js")

test:
	@echo -e "\e[0;32mRunning unit tests! \e[0m"
	@NODE_ENV=test ./node_modules/.bin/mocha ${UNIT_TESTS}

.PHONY: test
