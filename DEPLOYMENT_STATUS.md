# Deployment Status

## Testnet Deployment

### Status: Ready for Deployment

All smart contracts have passed syntax validation and are ready for testnet deployment.

### Pre-Deployment Checklist

- [x] Contract syntax verified
- [x] Deployment scripts created
- [x] Deployment plan generated
- [ ] Testnet STX acquired (faucet: https://explorer.hiro.so/sandbox/faucet?chain=testnet)
- [ ] Deployer wallet configured in `settings/Testnet.toml`
- [ ] Contracts deployed
- [ ] Contract addresses updated in `.env.local`
- [ ] Protocol adapters registered

### Deployment Commands

#### Option 1: Automated Deployment

```bash
./scripts/deploy-testnet.sh
```

#### Option 2: Manual Deployment

```bash
# Check contracts
clarinet check

# Generate deployment plan
clarinet deployments generate --testnet

# Apply deployment
clarinet deployments apply --testnet
```

### Contract Deployment Order

1. **math-utils** - `contracts/utils/math.clar`
2. **access-control** - `contracts/utils/access-control.clar`
3. **router** - `contracts/router.clar`
4. **vault-manager** - `contracts/vault-manager.clar`
5. **velar-adapter** - `contracts/protocol-adapters/velar-adapter.clar`
6. **alex-adapter** - `contracts/protocol-adapters/alex-adapter.clar`

### Expected Contract Addresses (After Deployment)

Update these in `.env.local` after deployment:

```env
# Will be in format: ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.contract-name
NEXT_PUBLIC_ROUTER_CONTRACT=
NEXT_PUBLIC_VAULT_CONTRACT=
NEXT_PUBLIC_MATH_UTILS_CONTRACT=
NEXT_PUBLIC_ACCESS_CONTROL_CONTRACT=
NEXT_PUBLIC_VELAR_ADAPTER_CONTRACT=
NEXT_PUBLIC_ALEX_ADAPTER_CONTRACT=
```

### Post-Deployment Configuration

After deploying contracts, run the post-deployment configuration:

```bash
# Register protocol adapters with router
# This will be done via contract calls once deployed
```

### Get Testnet STX

Get free testnet STX from the faucet:
https://explorer.hiro.so/sandbox/faucet?chain=testnet

You'll need:
- A Stacks wallet (Hiro Wallet, Xverse, etc.)
- Testnet STX for deployment fees (~1-2 STX per contract)

### Troubleshooting

**Contract deployment fails:**
- Check you have sufficient testnet STX
- Verify network connectivity to `https://api.testnet.hiro.so`
- Confirm mnemonic/private key in `settings/Testnet.toml`

**Clarinet errors:**
- Run `clarinet check` to verify syntax
- Ensure all dependencies are in correct order
- Check Clarinet version: `clarinet --version` (requires 3.0+)

### Mainnet Deployment

⚠️ **DO NOT deploy to mainnet without:**
1. Professional security audit
2. Extensive testnet testing
3. Community review
4. Legal compliance review

See [DEPLOYMENT.md](./DEPLOYMENT.md) for mainnet deployment guide.

## Deployment History

| Date | Network | Status | Deployer | Tx Hash |
|------|---------|--------|----------|---------|
| - | Testnet | Pending | - | - |

## Contract Versions

| Contract | Version | Last Updated |
|----------|---------|--------------|
| router | 1.0.0 | 2025-12-25 |
| vault-manager | 1.0.0 | 2025-12-25 |
| velar-adapter | 1.0.0 | 2025-12-25 |
| alex-adapter | 1.0.0 | 2025-12-25 |
| math-utils | 1.0.0 | 2025-12-25 |
| access-control | 1.0.0 | 2025-12-25 |
