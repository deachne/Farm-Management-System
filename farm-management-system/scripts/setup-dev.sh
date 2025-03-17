#!/bin/bash

# Setup script for development environment

echo "Setting up development environment..."

# Install dependencies
echo "Installing dependencies..."
npm install

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
  echo "Creating .env file..."
  cp .env.example .env
  echo "Please update the .env file with your configuration."
fi

# Setup database
echo "Setting up database..."
npx prisma migrate dev

# Initialize database with sample data
echo "Initializing database with sample data..."
node scripts/init-db.js

echo "Development environment setup complete!"
echo "You can now run 'npm run dev' to start the development server." 