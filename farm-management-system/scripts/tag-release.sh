#!/bin/bash

# Script to tag a release in git

if [ $# -ne 1 ]; then
  echo "Usage: $0 <version>"
  echo "Example: $0 0.1.0"
  exit 1
fi

VERSION=$1

echo "Tagging release v$VERSION..."

# Create a release commit
git add .
git commit -m "Release v$VERSION"

# Create a tag
git tag -a "v$VERSION" -m "Version $VERSION"

echo "Release v$VERSION tagged successfully!"
echo "To push the tag to the remote repository, run:"
echo "git push origin v$VERSION" 