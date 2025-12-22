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

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

## Architecture

```
├── contracts/           # Clarity smart contracts
│   ├── router.clar
│   ├── vault-manager.clar
│   └── protocol-adapters/
├── src/
│   ├── app/            # Next.js app router
│   ├── components/     # React components
│   ├── hooks/          # Custom hooks
│   └── utils/          # Utilities
```

## Roadmap

- [x] Project initialization
- [ ] Smart contract router
- [ ] Velar protocol integration
- [ ] ALEX protocol integration
- [ ] Dashboard UI
- [ ] Vault auto-rebalancing
- [ ] Multi-protocol support

## License

MIT
