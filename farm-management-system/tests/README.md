# Farm Management System Tests

This directory contains tests for the Farm Management System.

## Test Structure

- `metadata.test.js`: Tests for the metadata system
- Document processing tests (Coming Soon)
- Contextual retrieval tests (Coming Soon)
- LibreChat integration tests (Coming Soon)

## Running Tests

Run all tests with:

```bash
npm test
```

Run a specific test file with:

```bash
npx jest tests/metadata.test.js
```

## Test Coverage

Generate test coverage report with:

```bash
npm test -- --coverage
```

The coverage report will be available in the `coverage` directory.

## Writing Tests

When writing tests, follow these guidelines:

1. Create a test file for each module
2. Use descriptive test names
3. Mock external dependencies
4. Test both success and error cases
5. Keep tests independent of each other 