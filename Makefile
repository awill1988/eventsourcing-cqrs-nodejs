# HELP
# This will output the help for each task
.PHONY: help build

help: ## This help.
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

.DEFAULT_GOAL := help

# use the rest as arguments for "run"
PROCESS := $(firstword $(subst " ", ,$(wordlist 2,$(words $(MAKECMDGOALS)),$(MAKECMDGOALS))))
# ...and turn them into do-nothing targets
$(eval $(PROCESS):;@:)

ifndef PROCESS
	PROCESS := users
endif

up:
	docker-compose -p eventsourcing up -d --build && cd tests && npm i

rebuild:
	docker-compose -p eventsourcing down && docker-compose build && docker-compose -p eventsourcing up -d

down: ## Stop and remove a running container
	docker-compose -p eventsourcing down

logs:
	docker logs -f $(PROCESS)

test:
	cd tests && npm test
