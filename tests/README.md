# PayFast MCP Server - Test Suite

This directory contains the test suite for the PayFast MCP server implementation.

## Test Structure

```
tests/
├── unit/                           # Unit tests (fast, no external dependencies)
│   └── *.test.ts                  # Individual unit test files
├── integration/                    # Integration tests (require external services)
│   └── payfast-sandbox.test.ts    # PayFast sandbox API integration tests
└── README.md                       # This file
```

## Running Tests

### Unit Tests Only (Fast)
```bash
npm test
# or
npm run test
```

This runs only unit tests from the `tests/unit` directory. These tests are fast and do not require any external dependencies or credentials.

### Integration Tests Only
```bash
npm run test:integration
```

This runs integration tests from the `tests/integration` directory. These tests interact with the PayFast sandbox environment and require valid sandbox credentials.

**Required Environment Variables:**
- `PAYFAST_MERCHANT_ID` - Your PayFast sandbox merchant ID
- `PAYFAST_MERCHANT_KEY` - Your PayFast sandbox merchant key
- `PAYFAST_PASSPHRASE` - Your PayFast sandbox passphrase

**Note:** Integration tests are automatically skipped if credentials are not available, making them safe to run in CI/CD environments.

### All Tests (Unit + Integration)
```bash
npm run test:all
```

This runs all tests from both `tests/unit` and `tests/integration` directories.

## Integration Test Configuration

### Setting Up Sandbox Credentials

1. **Get Sandbox Credentials:**
   - Visit [PayFast Sandbox](https://sandbox.payfast.co.za)
   - Register for a sandbox merchant account
   - Navigate to Settings > Integration to get your credentials

2. **Configure Environment Variables:**

   Create a `.env` file in the project root:
   ```env
   PAYFAST_MERCHANT_ID=your_sandbox_merchant_id
   PAYFAST_MERCHANT_KEY=your_sandbox_merchant_key
   PAYFAST_PASSPHRASE=your_sandbox_passphrase
   PAYFAST_ENVIRONMENT=sandbox
   ```

   Or export them in your shell:
   ```bash
   export PAYFAST_MERCHANT_ID=your_sandbox_merchant_id
   export PAYFAST_MERCHANT_KEY=your_sandbox_merchant_key
   export PAYFAST_PASSPHRASE=your_sandbox_passphrase
   export PAYFAST_ENVIRONMENT=sandbox
   ```

### What Integration Tests Cover

The integration tests in `payfast-sandbox.test.ts` validate:

1. **Connectivity**
   - API ping/health checks
   - Base URL configuration
   - Header generation and authentication

2. **Transaction Operations**
   - Transaction history retrieval
   - Transaction queries
   - Pagination support
   - Date range filtering

3. **Subscription Operations**
   - Subscription queries
   - Pause/unpause operations
   - Cancellation
   - Updates
   - Ad-hoc charges

4. **Refund Operations**
   - Refund queries
   - Refund creation

5. **Credit Card Transactions**
   - Credit card-specific transaction queries

6. **Error Handling**
   - Invalid IDs and tokens
   - Network errors
   - API error responses
   - Error detail propagation

### CI/CD Integration

Integration tests are designed to be CI/CD friendly:

- Tests automatically skip when credentials are unavailable
- No test failures due to missing credentials
- Console message indicates when tests are skipped
- Safe to run in environments without PayFast access

Example CI configuration:

```yaml
# GitHub Actions example
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm test              # Unit tests only
      - run: npm run test:integration  # Will skip if no credentials
        env:
          PAYFAST_MERCHANT_ID: ${{ secrets.PAYFAST_MERCHANT_ID }}
          PAYFAST_MERCHANT_KEY: ${{ secrets.PAYFAST_MERCHANT_KEY }}
          PAYFAST_PASSPHRASE: ${{ secrets.PAYFAST_PASSPHRASE }}
```

## Test Framework

This project uses [Vitest](https://vitest.dev/) as the test framework, chosen for:

- Native ESM support (matches project configuration)
- Fast execution with smart watch mode
- Compatible API with Jest
- Excellent TypeScript support
- Built-in coverage reporting

## Writing New Tests

### Unit Tests

Unit tests should:
- Be fast (< 100ms per test)
- Not make network requests
- Mock external dependencies
- Test pure functions and business logic
- Have no side effects

Example:
```typescript
import { describe, it, expect } from 'vitest';
import { generateSignature } from '../../src/utils/signature.js';

describe('generateSignature', () => {
  it('should generate correct MD5 signature', () => {
    const params = { foo: 'bar' };
    const passphrase = 'secret';
    const signature = generateSignature(params, passphrase);

    expect(signature).toBeDefined();
    expect(typeof signature).toBe('string');
  });
});
```

### Integration Tests

Integration tests should:
- Test real API interactions
- Use sandbox environment only
- Be skippable when credentials unavailable
- Have reasonable timeouts (10-15 seconds)
- Test error cases thoroughly

Example:
```typescript
import { describe, it, expect, beforeAll } from 'vitest';

const SKIP_INTEGRATION = !process.env.PAYFAST_MERCHANT_ID;
const describeIntegration = SKIP_INTEGRATION ? describe.skip : describe;

describeIntegration('My Integration Test', () => {
  beforeAll(() => {
    // Setup
  });

  it('should do something', async () => {
    // Test implementation
  }, 10000); // 10 second timeout
});
```

## Coverage

To generate coverage reports:

```bash
npm run test:all -- --coverage
```

This generates a coverage report in the `coverage/` directory.

## Best Practices

1. **Isolation:** Each test should be independent and not rely on other tests
2. **Clarity:** Test names should clearly describe what is being tested
3. **AAA Pattern:** Arrange, Act, Assert structure for test bodies
4. **Error Testing:** Always test error cases and edge conditions
5. **Timeouts:** Set appropriate timeouts for async operations
6. **Cleanup:** Clean up any resources in afterEach/afterAll hooks
7. **Mocking:** Mock external dependencies in unit tests
8. **Real Data:** Use real sandbox data in integration tests when possible

## Troubleshooting

### Integration Tests Failing

1. **Verify Credentials:**
   ```bash
   echo $PAYFAST_MERCHANT_ID
   echo $PAYFAST_MERCHANT_KEY
   echo $PAYFAST_PASSPHRASE
   ```

2. **Check Sandbox Access:**
   - Ensure you're using sandbox credentials (not production)
   - Verify credentials are active on PayFast dashboard
   - Check for any IP restrictions

3. **Network Issues:**
   - Verify internet connectivity
   - Check if PayFast sandbox is operational
   - Review firewall/proxy settings

4. **Timeout Errors:**
   - Increase timeout values in tests
   - Check network latency
   - Verify PayFast API response times

### Unit Tests Failing

1. **Check TypeScript Compilation:**
   ```bash
   npm run build
   ```

2. **Verify Dependencies:**
   ```bash
   npm install
   ```

3. **Clear Cache:**
   ```bash
   rm -rf node_modules
   npm install
   ```

## Resources

- [PayFast API Documentation](https://developers.payfast.co.za/docs)
- [PayFast Sandbox](https://sandbox.payfast.co.za)
- [Vitest Documentation](https://vitest.dev/)
- [Testing Best Practices](https://testingjavascript.com/)
