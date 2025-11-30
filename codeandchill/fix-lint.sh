#!/bin/bash

# This script will automatically fix many common linting issues

cd "$(dirname "$0")"

echo "Running ESLint with auto-fix..."
npm run lint -- --fix

echo "Lint fixes applied!"
