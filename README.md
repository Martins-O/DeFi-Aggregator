# sBTC DeFi Aggregator

A comprehensive DeFi aggregator for sBTC on the Stacks blockchain, enabling users to discover optimal yields and manage their Bitcoin across multiple protocols.

## Features

- **Yield Aggregation**: Compare APYs across Velar, ALEX, Bitflow, Zest, and more
- **Smart Router**: Execute cross-protocol transactions in a single click
- **Vault Management**: Auto-rebalancing vaults for optimized returns
- **Risk Analytics**: Protocol safety scores and risk-adjusted returns
- **Portfolio Tracking**: Monitor all your sBTC positions in one dashboard

## Core Problems Solved

1. **Yield Fragmentation & Discovery** - Unified dashboard for all sBTC yields
2. **Inefficient Capital Allocation** - Risk-adjusted return comparisons
3. **Complexity Barrier** - Simplified interface with educational tooltips
4. **Opportunity Cost Blindness** - Clear visibility of potential earnings
5. **Time-Consuming Research** - Automated monitoring and alerts

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Wallet**: Reown AppKit for Stacks integration
- **Smart Contracts**: Clarity (Stacks blockchain)
- **Blockchain**: Stacks, sBTC

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Clarinet CLI (for smart contract development)
- Stacks wallet

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/sbtc-defi-aggregator.git
cd sbtc-defi-aggregator

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

Visit `http://localhost:3000` to see the app.

### Environment Setup

Update `.env.local` with your configuration:

```env
NEXT_PUBLIC_NETWORK=testnet
NEXT_PUBLIC_STACKS_API_URL=https://api.testnet.hiro.so
NEXT_PUBLIC_REOWN_PROJECT_ID=your_project_id
```

## Project Structure

```
sbtc-defi-aggregator/
├── contracts/                    # Clarity smart contracts
│   ├── router.clar              # Main routing contract
│   ├── vault-manager.clar       # Vault management
│   ├── protocol-adapters/       # Protocol integrations
│   │   ├── velar-adapter.clar
│   │   └── alex-adapter.clar
│   ├── utils/                   # Utility contracts
│   │   ├── math.clar
│   │   └── access-control.clar
│   └── tests/                   # Smart contract tests
├── src/
│   ├── app/                     # Next.js pages
│   │   ├── page.tsx            # Landing page
│   │   ├── dashboard/          # Main dashboard
│   │   └── vault/              # Vault management
│   ├── components/              # React components
│   │   ├── WalletConnect.tsx
│   │   ├── ProtocolCard.tsx
│   │   └── TransactionModal.tsx
│   ├── hooks/                   # Custom React hooks
│   │   ├── useProtocolData.ts
│   │   ├── useRouter.ts
│   │   └── useVault.ts
│   ├── contracts/               # Contract interactions
│   │   └── interactions/
│   └── utils/                   # Utility functions
│       └── apy-calculator.ts
└── public/                      # Static assets
```

## Smart Contracts

### Router Contract
- Manages protocol registration
- Routes deposits/withdrawals
- Tracks user positions
- Emergency pause mechanism

### Vault Manager
- Creates auto-rebalancing vaults
- Implements yield strategies
- Manages allocations
- Handles rebalancing logic

### Protocol Adapters
- Standardized interface for protocols
- Velar: DEX liquidity provision
- ALEX: Lending/borrowing
- Easy to extend for new protocols

## Documentation

- [Architecture Overview](./ARCHITECTURE.md) - System design and technical details
- [Deployment Guide](./DEPLOYMENT.md) - How to deploy to testnet/mainnet
- [Contributing Guide](./CONTRIBUTING.md) - How to contribute

## Testing

### Smart Contracts

```bash
# Run all contract tests
clarinet test

# Test specific contract
clarinet test --filter router

# Check contract syntax
clarinet check
```

### Frontend

```bash
# Lint code
npm run lint

# Build for production
npm run build
```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

Quick deploy to Vercel:

```bash
npm run build
vercel --prod
```

## Supported Protocols

Currently integrating:
- **Velar** - DEX and liquidity provision
- **ALEX** - Lending and borrowing
- **Bitflow** - Coming soon
- **Zest** - Coming soon

## Vault Strategies

1. **Maximum Yield** - Highest APY, higher risk
2. **Balanced** - Optimized yield/risk ratio
3. **Conservative** - Established protocols, lower risk

## Roadmap

### Phase 1 - MVP (Completed)
- [x] Project initialization
- [x] Smart contract router
- [x] Vault manager contract
- [x] Protocol adapters (Velar, ALEX)
- [x] Dashboard UI
- [x] Wallet integration

### Phase 2 - Integration
- [ ] Testnet deployment
- [ ] Real protocol integration
- [ ] APY data fetching
- [ ] Transaction execution
- [ ] Vault auto-rebalancing

### Phase 3 - Advanced Features
- [ ] Multi-protocol support (Bitflow, Zest)
- [ ] Historical analytics
- [ ] Risk scoring system
- [ ] Alert notifications
- [ ] Portfolio optimization

### Phase 4 - Mainnet
- [ ] Security audit
- [ ] Mainnet deployment
- [ ] Community features
- [ ] Governance integration

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## Security

- Smart contracts should be audited before mainnet deployment
- Use testnet for development and testing
- Report security issues privately to the maintainers

## License

MIT - see LICENSE file for details

## Support

- GitHub Issues: Bug reports and feature requests
- Discussions: Questions and community chat
- Documentation: See `/docs` folder

## Acknowledgments

Built for the Stacks ecosystem to optimize sBTC yields and improve DeFi accessibility.
