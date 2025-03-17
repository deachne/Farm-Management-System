#!/bin/bash

# Script to run tests

echo "Running tests..."

# Run ESLint
echo "Running ESLint..."
npm run lint

# Run Jest tests
echo "Running Jest tests..."
npm test

echo "Tests complete!" 