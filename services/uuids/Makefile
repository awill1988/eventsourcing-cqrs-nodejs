# import config.
# You can change the default config with `make cnf="config_special.env" build`
cnf ?= config.env
include $(cnf)
export $(shell sed 's/=.*//' $(cnf))

# HELP
# This will output the help for each task
.PHONY: help build

help: ## This help.
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

.DEFAULT_GOAL := help

build:
	docker build -t $(APP_NAME) .

build-nc: ## Build the container without caching
	docker build --no-cache -t $(APP_NAME) .

run: ## Run container on port configured in `config.env`
	docker run -i -t --rm --env-file=./config.env -p=$(APP_PORT):$(APP_PORT) --name="$(APP_NAME)" $(APP_NAME)

shell: ## Run bash in the container
	docker run -i -t --env-file=./config.env $(APP_NAME) /bin/bash

up: build run ## Run container on port configured in `config.env` (Alias to run)

stop: ## Stop and remove a running container
	docker stop $(APP_NAME); docker rm $(APP_NAME)

release: build-nc publish ## Make a release by building and publishing the `{version}` ans `latest` tagged containers to ECR

# Docker publish
publish: publish-version ## Publish the `{version}` ans `latest` tagged containers to ECR

publish-version: tag-version ## Publish the `{version}` taged container to ECR
	docker push $(DOCKER_REPO)/$(APP_NAME):$(if $(filter prod,$(PROFILE)),latest,$(PROFILE))

# Docker tagging
tag: tag-version ## Generate container tags for the `{version}` ans `latest` tags

tag-version: ## Generate container `latest` tag
	@echo 'create tag $(if $(filter prod,$(PROFILE)),latest,$(PROFILE))'
	docker tag $(APP_NAME) $(DOCKER_REPO)/$(APP_NAME):$(if $(filter prod,$(PROFILE)),latest,$(PROFILE))

version: ## Output the current version
	@echo 'App: $(DOCKER_REPO)/$(APP_NAME) Version: $(if $(filter prod,$(PROFILE)),latest,$(PROFILE))'
