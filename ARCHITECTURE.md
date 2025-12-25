# Architecture Overview

## System Design

The sBTC DeFi Aggregator consists of three main layers:

### 1. Smart Contract Layer (Clarity)

**Router Contract** (`contracts/router.clar`)
- Entry point for all protocol interactions
- Manages protocol registration and validation
- Tracks user deposits across protocols
- Handles deposit/withdrawal operations
- Emergency pause functionality

**Vault Manager Contract** (`contracts/vault-manager.clar`)
- Creates and manages auto-rebalancing vaults
- Implements different yield strategies
- Tracks vault allocations across protocols
- Handles vault deposits and withdrawals
- Supports multiple concurrent vaults per user

**Protocol Adapters** (`contracts/protocol-adapters/`)
- Velar Adapter: DEX liquidity provision interface
- ALEX Adapter: Lending/borrowing interface
- Standardized interface for adding new protocols

**Utilities** (`contracts/utils/`)
- Math utilities: APY calculations, safe math operations
- Access control: Role-based permissions

### 2. Frontend Layer (Next.js/TypeScript)

**Pages**
- `/` - Landing page with feature overview
- `/dashboard` - Main aggregator view showing all protocols
- `/vault` - Vault management and creation interface

**Components**
- `WalletConnect` - Reown AppKit integration
- `ProtocolCard` - Individual protocol display
- `TransactionModal` - Deposit/withdrawal interface

**Hooks**
- `useProtocolData` - Fetches protocol yields and TVL
- `useRouter` - Router contract interactions
- `useVault` - Vault contract interactions

**Contract Interactions** (`src/contracts/interactions/`)
- Router module: All router contract calls
- Vault module: All vault contract calls

### 3. Data Flow

```
User Interface
    ↓
Custom Hooks (useRouter, useVault, useProtocolData)
    ↓
Contract Interaction Modules
    ↓
Smart Contracts (Router, Vault, Adapters)
    ↓
Protocol Contracts (Velar, ALEX, etc.)
```

## Key Design Decisions

### Hybrid Custody Model
- **Direct Router**: Users approve individual transactions, maintain custody
- **Vault Deposits**: Users deposit to vault contract, automated management

### APY Normalization
- All protocols return APY in basis points (10000 = 100%)
- Frontend normalizes for comparison
- Compound vs simple interest handled transparently

### Modular Protocol Integration
- Each protocol has dedicated adapter contract
- Router registers adapters dynamically
- Easy to add new protocols without modifying core router

### Security Considerations
- Emergency pause mechanism
- Owner-only admin functions
- Post-condition checks on all transfers
- Role-based access control for vault operations

## Scalability

### Adding New Protocols
1. Create adapter contract implementing standard interface
2. Register adapter with router contract
3. Add frontend integration in `useProtocolData`
4. Update protocol list in dashboard

### Vault Strategies
Current strategies:
- `max-yield`: Highest APY regardless of risk
- `balanced`: Balanced yield/risk ratio
- `conservative`: Established protocols only

Future strategies can be added by implementing new rebalancing logic.

## Technology Stack

- **Smart Contracts**: Clarity 2.0
- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Blockchain Integration**: @stacks/transactions, @stacks/connect
- **Wallet**: Reown AppKit
- **Testing**: Clarinet (smart contracts)
- **Network**: Stacks Testnet → Mainnet
