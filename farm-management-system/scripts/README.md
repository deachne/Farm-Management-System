# Farm Management System Scripts

This directory contains utility scripts for the Farm Management System.

## Available Scripts

- `setup-dev.sh`: Sets up the development environment
- `run-tests.sh`: Runs tests
- `init-db.js`: Initializes the database with sample data
- `check-structure.sh`: Checks the project structure
- `tag-release.sh`: Tags a release in git
- `prepare-next-phase.sh`: Prepares for the next phase of development

## Usage

### Setup Development Environment

```bash
./scripts/setup-dev.sh
```

This script:
1. Installs dependencies
2. Generates Prisma client
3. Creates `.env` file if it doesn't exist
4. Sets up the database
5. Initializes the database with sample data

### Run Tests

```bash
./scripts/run-tests.sh
```

This script:
1. Runs ESLint
2. Runs Jest tests

### Initialize Database

```bash
node scripts/init-db.js
```

This script:
1. Creates sample fields
2. Creates sample crops
3. Creates sample equipment

### Check Project Structure

```bash
./scripts/check-structure.sh
```

This script:
1. Checks if required directories exist
2. Checks if required files exist

### Tag a Release

```bash
./scripts/tag-release.sh <version>
```

Example:
```bash
./scripts/tag-release.sh 0.1.0
```

This script:
1. Creates a release commit
2. Creates a git tag for the specified version

### Prepare for Next Phase

```bash
./scripts/prepare-next-phase.sh <phase-number>
```

Example:
```bash
./scripts/prepare-next-phase.sh 2
```

This script:
1. Creates a documentation file for the next phase
2. Creates a git branch for the next phase
3. Provides next steps for the phase implementation 