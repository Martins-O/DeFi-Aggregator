# Testing Guide

This document describes how to run and write tests for the sBTC DeFi Aggregator.

## Running Tests

### All Tests

```bash
npm test
```

Or directly with Clarinet:

```bash
clarinet test
```

### Watch Mode

Run tests in watch mode for continuous development:

```bash
npm run test:watch
```

### Individual Test Files

Run specific test files:

```bash
clarinet test --filter router
clarinet test --filter vault-manager
clarinet test --filter protocol-adapters
```

## Test Structure

Tests are organized in the `tests/` directory:

```
tests/
├── router_test.ts              # Router contract tests
├── vault-manager_test.ts       # Vault manager tests
├── protocol-adapters_test.ts   # Protocol adapter tests
├── math-utils_test.ts          # Math utility tests
└── integration_test.ts         # End-to-end integration tests
```

## Test Coverage

### Router Contract
- Protocol registration
- Deposit functionality
- Withdrawal functionality
- User deposit tracking
- Emergency pause mechanism
- Access control

### Vault Manager Contract
- Vault creation with strategies
- Deposits and withdrawals
- Strategy validation
- Duplicate prevention
- Owner verification

### Protocol Adapters
- Adapter identification
- APY retrieval
- Pool contract configuration
- Access control

### Math Utilities
- Percentage calculations
- Weighted averages
- Safe arithmetic operations
- Division by zero protection

### Integration Tests
- Complete deposit flows
- Multi-contract interactions
- Vault creation and deposits

## Writing Tests

### Basic Test Structure

```typescript
Clarinet.test({
    name: "Test name",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;

        let block = chain.mineBlock([
            Tx.contractCall(
                'contract-name',
                'function-name',
                [types.uint(100)],
                deployer.address
            )
        ]);

        block.receipts[0].result.expectOk();
    },
});
```

### Best Practices

1. **Test One Thing**: Each test should verify a single behavior
2. **Clear Names**: Test names should describe what is being tested
3. **Setup/Teardown**: Use separate transactions for setup when needed
4. **Error Cases**: Test both success and failure scenarios
5. **Edge Cases**: Include boundary condition tests

## Continuous Integration

Tests run automatically on:
- Pull requests
- Commits to main branch
- Before deployment

## Test Reports

Test results are displayed in the console with:
- Pass/fail status
- Execution time
- Coverage metrics

## Debugging Tests

### Verbose Output

```bash
clarinet test --verbose
```

### Stack Traces

Failed tests show full stack traces for debugging.

### Console Logging

Use `console.log()` in tests for debugging:

```typescript
console.log('Value:', cvToJSON(response));
```

## Performance

Tests are designed to run quickly:
- Unit tests: < 100ms each
- Integration tests: < 500ms each
- Full suite: < 5 seconds

## Prerequisites

- Clarinet CLI installed
- Node.js 18+
- Test contracts deployed locally

## Troubleshooting

### Tests Failing

1. Ensure Clarinet is up to date
2. Check contract syntax
3. Verify test data matches contracts
4. Review recent contract changes

### Setup Issues

```bash
# Reinstall Clarinet
brew upgrade clarinet

# Clear cache
clarinet cache clear

# Reset local environment
clarinet integrate
```

## Contributing

When adding new features:

1. Write tests first (TDD)
2. Ensure all tests pass
3. Add integration tests for new workflows
4. Update this documentation

## Resources

- [Clarinet Documentation](https://github.com/hirosystems/clarinet)
- [Clarity Testing Guide](https://docs.stacks.co/docs/clarity/testing)
- [Project Test Examples](../tests/)
