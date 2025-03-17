#!/bin/bash

# Script to check the project structure

echo "Checking project structure..."

# Check if required directories exist
required_dirs=(
  "src/metadata"
  "src/document-processing"
  "src/retrieval"
  "src/librechat-integration"
  "docs"
  "tests"
  "scripts"
  "prisma"
  "prisma/migrations"
)

for dir in "${required_dirs[@]}"; do
  if [ ! -d "$dir" ]; then
    echo "❌ Missing directory: $dir"
  else
    echo "✅ Directory exists: $dir"
  fi
done

# Check if required files exist
required_files=(
  "package.json"
  ".env.example"
  "prisma/schema.prisma"
  "src/metadata/MetadataManager.js"
  "src/metadata/FarmMetadataExtension.js"
  "src/metadata/api.js"
  "index.js"
  "docs/01-Metadata-System.md"
  "tests/metadata.test.js"
  ".eslintrc.js"
  "jest.config.js"
)

for file in "${required_files[@]}"; do
  if [ ! -f "$file" ]; then
    echo "❌ Missing file: $file"
  else
    echo "✅ File exists: $file"
  fi
done

echo "Project structure check complete!" 