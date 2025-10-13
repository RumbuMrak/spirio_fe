# Default shell
SHELL := /bin/bash

# Default environment file (can be overridden)
ENV ?= .env_test

# Default goal
.DEFAULT_GOAL := assert-never

# Goals
.PHONY: production
production:
	@echo "Using environment file: $(ENV)"
	cp $(ENV) .env
	npm install --include=dev
	npm run build

.PHONY: staging
staging: production

.PHONY: development
development: production

.PHONY: local
local: production

.PHONY: testing
testing: production

.PHONY: check
check:
