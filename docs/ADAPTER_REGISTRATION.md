# Protocol Adapter Registration Guide

This guide explains how to register protocol adapters with the router contract after deployment.

## Overview

Protocol adapters must be registered with the router contract before they can be used by the DeFi aggregator. The registration process involves:

1. Validation of adapter contracts
2. Checking current registration status
3. Registering unregistered adapters
4. Verification of successful registration

## Prerequisites

Before registering adapters, ensure you have:

- Deployed all contracts to the network (testnet or mainnet)
- Your deployer wallet address
- Your deployer private key
- Node.js and npm installed
- All project dependencies installed (`npm install`)

## Environment Variables

Set the following environment variables:

```bash
export DEPLOYER_ADDRESS="ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM"
export DEPLOYER_PRIVATE_KEY="your_private_key_here"
export NETWORK="testnet"  # or "mainnet"
```

**Security Note:** Never commit your private key to version control. Use environment variables or secure key management solutions.

## Registration Methods

### Method 1: Bash Script (Recommended)

The simplest way to register adapters:

```bash
chmod +x scripts/register-adapters.sh
./scripts/register-adapters.sh
```

This script will:
- Validate environment variables
- Check for required dependencies
- Run the TypeScript registration process
- Display results with colored output

### Method 2: TypeScript Direct

For more control, run the TypeScript script directly:

```bash
ts-node scripts/run-registration.ts
```

### Method 3: Manual Registration

If you prefer manual control, you can use the individual functions:

```typescript
import { registerAdapter } from './scripts/register-adapters';
import { checkAdapterRegistration } from './scripts/check-registration-status';

// Register a single adapter
const result = await registerAdapter(
  {
    name: 'Velar',
    contractName: 'velar-adapter',
    contractAddress: deployerAddress,
  },
  {
    network: 'testnet',
    routerContract: `${deployerAddress}.router`,
    deployerAddress,
    privateKey,
  }
);
```

## Registration Process

The registration script follows these steps:

### Step 1: Adapter Validation

Validates that each adapter contract exists and is accessible on the network.

```
Validating Velar...
✓ Velar validation passed
Validating ALEX...
✓ ALEX validation passed
```

### Step 2: Status Check

Checks if adapters are already registered to avoid duplicate registration.

```
Checking current registration status...
✗ Velar is NOT registered
✗ ALEX is NOT registered
```

### Step 3: Registration

Registers each unregistered adapter with the router contract.

```
Registering adapters...
Registering Velar...
✓ Velar registered: 0x1234...
Registering ALEX...
✓ ALEX registered: 0x5678...
```

### Step 4: Verification

Confirms all adapters are successfully registered.

```
================================
Registration Status Summary
================================
Total Adapters: 2
Registered: 2
Not Registered: 0
================================

✓ All adapters are registered!
```

## Error Handling

The registration system includes robust error handling:

### Retry Logic

- Failed transactions are automatically retried up to 3 times
- Uses exponential backoff (2s, 4s, 8s delays)
- Configurable retry parameters

### Error Types

**Validation Errors:**
```
✗ Velar validation failed:
  - Contract not found or not accessible
```

**Registration Errors:**
```
✗ ALEX registration failed:
  - Failed to register ALEX: Transaction broadcast failed
```

**Environment Errors:**
```
Error: DEPLOYER_ADDRESS environment variable not set
Error: DEPLOYER_PRIVATE_KEY environment variable not set
```

## Configuration

### Adapter Configuration File

Adapters are configured in `config/adapters.json`:

```json
{
  "adapters": [
    {
      "id": "velar",
      "name": "Velar",
      "contractName": "velar-adapter",
      "enabled": true,
      "poolContracts": {
        "testnet": "",
        "mainnet": ""
      }
    }
  ]
}
```

### Retry Configuration

Customize retry behavior in your code:

```typescript
const customRetryOptions = {
  maxRetries: 5,
  delayMs: 3000,
  backoffMultiplier: 2,
};

await registerAdapter(adapter, config, customRetryOptions);
```

## Troubleshooting

### Adapter Not Found

**Problem:** Contract validation fails with "not found or not accessible"

**Solution:**
- Verify the contract is deployed on the correct network
- Check the deployer address matches the deployed contract address
- Ensure the network is set correctly (testnet vs mainnet)

### Transaction Broadcast Failed

**Problem:** Registration fails with "Transaction broadcast failed"

**Solution:**
- Check your private key is correct
- Ensure you have enough STX for transaction fees
- Verify the network is accessible
- Check Stacks blockchain status

### Already Registered

**Problem:** Attempting to register an already registered adapter

**Solution:**
- This is detected automatically and skipped
- Use the status checker to verify current state
- Re-run the script safely - it won't duplicate registrations

### ts-node Not Found

**Problem:** Shell script fails with "ts-node: command not found"

**Solution:**
```bash
npm install
# or globally
npm install -g ts-node typescript
```

## Post-Registration

After successful registration:

1. **Update Frontend Environment:**
   ```bash
   # .env.local
   NEXT_PUBLIC_ROUTER_CONTRACT=${DEPLOYER_ADDRESS}.router
   NEXT_PUBLIC_VELAR_ADAPTER=${DEPLOYER_ADDRESS}.velar-adapter
   NEXT_PUBLIC_ALEX_ADAPTER=${DEPLOYER_ADDRESS}.alex-adapter
   ```

2. **Configure Pool Contracts:**
   Update each adapter with the actual protocol pool contract addresses:
   ```clarity
   (contract-call? .velar-adapter set-pool-contract 'POOL_ADDRESS.velar-pool)
   (contract-call? .alex-adapter set-pool-contract 'POOL_ADDRESS.alex-pool)
   ```

3. **Verify Configuration:**
   ```bash
   ts-node scripts/run-registration.ts
   ```
   Should show all adapters as already registered.

4. **Test Integration:**
   - Use frontend to interact with adapters
   - Verify APY data is being fetched correctly
   - Test deposit/withdrawal flows

## Adding New Adapters

To add a new protocol adapter:

1. **Create Adapter Contract:**
   ```clarity
   ;; contracts/protocol-adapters/new-protocol-adapter.clar
   (define-public (get-name)
     (ok "NewProtocol"))
   ```

2. **Add to Configuration:**
   ```json
   {
     "id": "new-protocol",
     "name": "NewProtocol",
     "contractName": "new-protocol-adapter",
     "enabled": true
   }
   ```

3. **Update Registration Script:**
   Add the new adapter to the adapters array in `run-registration.ts`

4. **Deploy and Register:**
   ```bash
   clarinet deployments apply -p deployments/testnet-deployment-plan.yaml
   ./scripts/register-adapters.sh
   ```

## Security Considerations

- **Private Keys:** Never expose private keys in code, logs, or version control
- **Network Validation:** Always verify you're on the correct network before registration
- **Owner Verification:** Ensure only the contract owner can register adapters
- **Testing:** Test on testnet before mainnet deployment
- **Monitoring:** Monitor registration transactions for success/failure

## Support

If you encounter issues:

1. Check the error messages carefully
2. Review this documentation
3. Verify environment variables are set correctly
4. Check network connectivity and blockchain status
5. Review transaction logs for detailed error information
