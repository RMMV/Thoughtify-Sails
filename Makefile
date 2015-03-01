FILES:='./specs/bootstrap.spec.js' $$(find ./specs/unit -iname '*.js')

build:
	@DATA= ; for f in ${FILES}; do \
		DATA=$$(echo $$DATA '+function(){' $$(cat $$f) '}();'); \
	done; echo $$DATA | cat > ./.tmp/unit-tests.js;\

test: build
	@echo -e "\e[0;32mRunning unit tests! \e[0m"
	./node_modules/.bin/mocha .tmp/unit-tests.js
