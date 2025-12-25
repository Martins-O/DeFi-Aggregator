# Testnet Deployment Quick Start

## Prerequisites

1. **Get Testnet STX**
   - Visit: https://explorer.hiro.so/sandbox/faucet?chain=testnet
   - Request testnet STX (you'll need ~10 STX for deployment)

2. **Install Stacks Wallet**
   - Hiro Wallet: https://wallet.hiro.so/
   - Xverse: https://www.xverse.app/
   - Or any Stacks-compatible wallet

3. **Get Wallet Mnemonic**
   - Export your wallet's 24-word seed phrase
   - Store securely (never commit to git!)

## Step 1: Configure Deployer Wallet

Edit `settings/Testnet.toml`:

```toml
[accounts.deployer]
mnemonic = "your 24 word seed phrase here"
```

⚠️ **IMPORTANT:** This file is gitignored. Never commit real credentials!

## Step 2: Verify Contracts

```bash
# Check contract syntax
clarinet check
```

Expected output: `✔ 6 contracts checked`

## Step 3: Deploy to Testnet

### Option A: Automated Script

```bash
./scripts/deploy-testnet.sh
```

This script will:
1. Check contract syntax
2. Generate deployment plan
3. Deploy all contracts in correct order
4. Display deployment results

### Option B: Manual Deployment

```bash
# Generate deployment configuration
clarinet deployments generate --testnet

# Review deployment plan
cat deployments/default.testnet-plan.yaml

# Deploy contracts
clarinet deployments apply --testnet
```

## Step 4: Note Contract Addresses

After deployment, you'll see output like:

```
✓ Deployed math-utils: ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.math-utils
✓ Deployed access-control: ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.access-control
✓ Deployed router: ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.router
✓ Deployed vault-manager: ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.vault-manager
✓ Deployed velar-adapter: ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar-adapter
✓ Deployed alex-adapter: ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.alex-adapter
```

**Save these addresses!** You'll need them for the next steps.

## Step 5: Update Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your deployed contract addresses:

```env
NEXT_PUBLIC_NETWORK=testnet
NEXT_PUBLIC_STACKS_API_URL=https://api.testnet.hiro.so
NEXT_PUBLIC_REOWN_PROJECT_ID=your_reown_project_id

# Your deployed contracts
NEXT_PUBLIC_ROUTER_CONTRACT=ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.router
NEXT_PUBLIC_VAULT_CONTRACT=ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.vault-manager
NEXT_PUBLIC_VELAR_ADAPTER_CONTRACT=ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar-adapter
NEXT_PUBLIC_ALEX_ADAPTER_CONTRACT=ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.alex-adapter
```

## Step 6: Post-Deployment Configuration

Register protocol adapters with the router:

```bash
export DEPLOYER_ADDRESS=ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM
./scripts/post-deploy-config.sh
```

This will show you the contract calls needed to:
1. Register Velar adapter
2. Register ALEX adapter
3. Set pool contracts

Execute these calls using:
- Stacks Explorer Sandbox
- Clarinet console
- Your wallet's contract call interface

## Step 7: Verify Deployment

Check your contracts on Stacks Explorer:

```
https://explorer.hiro.so/txid/<transaction-id>?chain=testnet
https://explorer.hiro.so/address/<your-address>?chain=testnet
```

Test contract calls:

```clarity
;; Check if protocol is registered
(contract-call? 'ST1PQHQKV....router get-protocol-info "velar")

;; Should return protocol info with enabled: true
```

## Step 8: Test Frontend Locally

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` and test:
1. Wallet connection
2. Protocol data display
3. Contract interactions

## Step 9: Deploy Frontend

Deploy to Vercel:

```bash
npm run build
vercel --prod
```

Or connect GitHub repository to Vercel for automatic deployments.

## Troubleshooting

### "Insufficient funds" error
- Check testnet STX balance
- Request more from faucet

### "Contract already exists" error
- Contract names must be unique
- Use different deployer account or rename contracts

### "Transaction failed" error
- Verify contract syntax with `clarinet check`
- Check transaction in explorer for detailed error

### Frontend can't connect to contracts
- Verify contract addresses in `.env.local`
- Check network setting (testnet vs mainnet)
- Ensure Reown Project ID is correct

## Next Steps

After successful testnet deployment:

1. **Test thoroughly**
   - Try all contract functions
   - Test edge cases
   - Monitor for errors

2. **Get feedback**
   - Share with community
   - Gather user feedback
   - Iterate on features

3. **Prepare for mainnet**
   - Security audit
   - Load testing
   - Legal review
   - Final testing

## Resources

- Stacks Testnet Explorer: https://explorer.hiro.so/?chain=testnet
- Clarinet Documentation: https://docs.hiro.so/clarinet
- Stacks Documentation: https://docs.stacks.co
- Reown AppKit: https://docs.reown.com/appkit

## Support

If you encounter issues:
1. Check [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed info
2. Review [DEPLOYMENT_STATUS.md](./DEPLOYMENT_STATUS.md)
3. Open an issue on GitHub
