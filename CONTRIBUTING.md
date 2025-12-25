# Contributing to sBTC DeFi Aggregator

Thank you for your interest in contributing! This guide will help you get started.

## Development Setup

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/sbtc-defi-aggregator.git`
3. Install dependencies: `npm install`
4. Copy environment file: `cp .env.example .env.local`
5. Run development server: `npm run dev`

## Project Structure

```
sbtc-defi-aggregator/
├── contracts/              # Clarity smart contracts
│   ├── router.clar
│   ├── vault-manager.clar
│   ├── protocol-adapters/
│   ├── utils/
│   └── tests/
├── src/
│   ├── app/               # Next.js pages
│   ├── components/        # React components
│   ├── hooks/            # Custom React hooks
│   ├── contracts/        # Contract interaction modules
│   └── utils/            # Utility functions
└── public/               # Static assets
```

## How to Contribute

### Reporting Bugs

Open an issue with:
- Clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Environment details (browser, OS, etc.)

### Suggesting Features

Open an issue with:
- Clear feature description
- Use case / problem it solves
- Proposed implementation (optional)
- UI/UX mockups (if applicable)

### Adding New Protocols

To integrate a new protocol:

1. **Create Adapter Contract**

```clarity
;; contracts/protocol-adapters/new-protocol-adapter.clar

(define-read-only (get-current-apy)
  ;; Return APY in basis points
  (ok u1500) ;; 15.00%
)

(define-public (deposit-liquidity (amount uint) (sbtc-token <ft-trait>))
  ;; Implementation
  (ok amount)
)

(define-public (withdraw-liquidity (amount uint) (sbtc-token <ft-trait>))
  ;; Implementation
  (ok amount)
)
```

2. **Add to Clarinet.toml**

```toml
[contracts.new-protocol-adapter]
path = "contracts/protocol-adapters/new-protocol-adapter.clar"
clarity_version = 2
epoch = 2.5
```

3. **Update Frontend**

Add to `src/hooks/useProtocolData.ts`:

```typescript
{
  id: 'new-protocol',
  name: 'New Protocol',
  apy: 15.0,
  tvl: '500 sBTC',
  category: 'Lending',
  risk: 'Medium'
}
```

4. **Write Tests**

Create `contracts/tests/new-protocol_test.ts`

5. **Update Documentation**

Add protocol to README.md and ARCHITECTURE.md

### Code Style

#### Clarity Contracts
- Follow Clarity best practices
- Use descriptive function names
- Add comments for complex logic
- Include error codes with clear constants
- Write comprehensive tests

#### TypeScript/React
- Use TypeScript strict mode
- Follow React hooks best practices
- Use functional components
- Implement proper error handling
- Add JSDoc comments for public functions

#### Styling
- Use Tailwind CSS utilities
- Follow existing color scheme (orange-500 accent)
- Ensure mobile responsiveness
- Maintain dark theme consistency

### Testing

#### Smart Contracts

```bash
# Run all tests
clarinet test

# Test specific contract
clarinet test --filter router
```

#### Frontend

```bash
# Run linter
npm run lint

# Build check
npm run build
```

### Pull Request Process

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   - Write clean, documented code
   - Follow existing patterns
   - Add tests for new features

3. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: add new protocol integration"
   ```

   Commit message format:
   - `feat:` New feature
   - `fix:` Bug fix
   - `docs:` Documentation
   - `style:` Code style/formatting
   - `refactor:` Code refactoring
   - `test:` Tests
   - `chore:` Maintenance

4. **Push to Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Open Pull Request**
   - Clear description of changes
   - Reference related issues
   - Include screenshots for UI changes
   - Ensure CI passes

### Review Process

- Maintainers will review within 48 hours
- Address feedback in new commits
- Once approved, PR will be merged
- Delete feature branch after merge

## Adding Vault Strategies

To add a new vault strategy:

1. **Update Strategy List**

In `src/app/vault/page.tsx`:

```typescript
{
  id: 'new-strategy',
  name: 'Your Strategy',
  description: 'Strategy description',
  risk: 'Medium',
  targetAPY: '10-12%'
}
```

2. **Implement Rebalancing Logic**

Add logic to vault-manager contract or create strategy-specific contract.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on the code, not the person
- Help others learn and grow

## Questions?

- Open a discussion on GitHub
- Join our community chat
- Check existing issues and PRs

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
