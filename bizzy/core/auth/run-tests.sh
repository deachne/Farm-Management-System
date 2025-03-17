#!/bin/bash

# Ensure we're in the auth directory
cd "$(dirname "$0")"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install --no-save jest supertest chai express cookie-parser body-parser
fi

# Run the tests
echo "Running authentication tests..."
npx jest --config jest.config.js

# Check if tests passed
if [ $? -eq 0 ]; then
  echo "✅ All tests passed!"
else
  echo "❌ Some tests failed!"
  exit 1
fi 