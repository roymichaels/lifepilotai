#!/bin/bash
# Install project dependencies for development
set -e

if ! command -v npm >/dev/null 2>&1; then
  echo "npm is required but not installed" >&2
  exit 1
fi

npm install
