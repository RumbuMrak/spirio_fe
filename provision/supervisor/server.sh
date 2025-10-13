#!/bin/bash

set -euo pipefail

exec ./node_modules/.bin/next start -p ${1:-${NEXT_PORT}}
