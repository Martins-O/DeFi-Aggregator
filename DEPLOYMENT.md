# Deployment Guide

## Prerequisites

- Node.js 18+ and npm
- Clarinet CLI installed
- Stacks wallet with testnet STX
- Reown AppKit project ID

## Local Development Setup

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd sbtc-defi-aggregator
npm install
```

### 2. Environment Configuration

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Update the following variables:

```env
NEXT_PUBLIC_NETWORK=testnet
NEXT_PUBLIC_STACKS_API_URL=https://api.testnet.hiro.so
NEXT_PUBLIC_REOWN_PROJECT_ID=your_reown_project_id
```

### 3. Smart Contract Development

Test contracts locally:

```bash
clarinet test
```

Check contract syntax:

```bash
clarinet check
```

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

## Testnet Deployment

### 1. Deploy Smart Contracts

Using Clarinet:

```bash
clarinet deployments generate --testnet
clarinet deployments apply --testnet
```

Or manually using Stacks CLI:

```bash
# Deploy router
stx deploy_contract router contracts/router.clar --testnet

# Deploy vault-manager
stx deploy_contract vault-manager contracts/vault-manager.clar --testnet

# Deploy adapters
stx deploy_contract velar-adapter contracts/protocol-adapters/velar-adapter.clar --testnet
stx deploy_contract alex-adapter contracts/protocol-adapters/alex-adapter.clar --testnet
```

### 2. Configure Contract Addresses

Update `.env.local` with deployed contract addresses:

```env
NEXT_PUBLIC_ROUTER_CONTRACT=ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.router
NEXT_PUBLIC_VAULT_CONTRACT=ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.vault-manager
```

### 3. Register Protocols

Call router contract to register protocol adapters:

```clarity
(contract-call? .router register-protocol
  "velar"
  'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar-adapter)

(contract-call? .router register-protocol
  "alex"
  'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.alex-adapter)
```

### 4. Deploy Frontend

Deploy to Vercel:

```bash
npm run build
vercel --prod
```

Or use Vercel GitHub integration for automatic deployments.

## Mainnet Deployment

### 1. Audit Contracts

Before mainnet deployment:
- Complete professional security audit
- Run extensive testnet testing
- Get community review

### 2. Deploy Contracts

```bash
clarinet deployments generate --mainnet
clarinet deployments apply --mainnet
```

### 3. Update Environment

```env
NEXT_PUBLIC_NETWORK=mainnet
NEXT_PUBLIC_STACKS_API_URL=https://api.hiro.so
```

### 4. Register Real Protocol Contracts

Update adapter contracts with actual protocol addresses:
- Velar mainnet contracts
- ALEX mainnet contracts
- Other protocol integrations

## Post-Deployment

### Monitor Contract Activity

```bash
# Check contract status
stx get_contract_info <contract-address>.<contract-name>

# Monitor transactions
curl https://api.testnet.hiro.so/extended/v1/address/<address>/transactions
```

### Frontend Monitoring

- Set up analytics (Vercel Analytics)
- Monitor error tracking (Sentry)
- Track user transactions
- Monitor protocol APY updates

## Security Checklist

- [ ] Smart contracts audited
- [ ] Access control verified
- [ ] Emergency pause mechanism tested
- [ ] Post-conditions on all transfers
- [ ] Frontend input validation
- [ ] Rate limiting on API calls
- [ ] Wallet connection security
- [ ] Environment variables secured

## Troubleshooting

### Contract Deployment Fails
- Verify sufficient STX balance
- Check contract syntax with `clarinet check`
- Ensure network connectivity

### Frontend Connection Issues
- Verify Reown Project ID
- Check network configuration
- Confirm contract addresses

### Transaction Failures
- Check user STX balance for fees
- Verify contract is not paused
- Confirm protocol is registered
- Check sBTC token approval
