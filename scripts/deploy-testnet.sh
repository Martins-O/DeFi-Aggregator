#!/bin/bash

# sBTC DeFi Aggregator - Testnet Deployment Script
# This script deploys all smart contracts to Stacks testnet

set -e

echo "================================================="
echo "sBTC DeFi Aggregator - Testnet Deployment"
echo "================================================="
echo ""

# Check if Clarinet is installed
if ! command -v clarinet &> /dev/null; then
    echo "Error: Clarinet is not installed"
    echo "Install from: https://github.com/hirosystems/clarinet"
    exit 1
fi

echo "✓ Clarinet found: $(clarinet --version)"
echo ""

# Check if testnet configuration exists
if [ ! -f "settings/Testnet.toml" ]; then
    echo "Error: settings/Testnet.toml not found"
    echo "Please configure your testnet deployer account"
    exit 1
fi

# Verify contracts syntax
echo "Checking contract syntax..."
if ! clarinet check; then
    echo "Error: Contract syntax check failed"
    exit 1
fi
echo "✓ All contracts passed syntax check"
echo ""

# Generate deployment plan
echo "Generating testnet deployment configuration..."
if clarinet deployments generate --testnet; then
    echo "✓ Deployment plan generated"
else
    echo "⚠ Using manual deployment plan"
fi
echo ""

# Deploy to testnet
echo "================================================="
echo "Ready to deploy to testnet"
echo "================================================="
echo ""
echo "Contracts to be deployed:"
echo "  1. math-utils"
echo "  2. access-control"
echo "  3. router"
echo "  4. vault-manager"
echo "  5. velar-adapter"
echo "  6. alex-adapter"
echo ""
echo "⚠  WARNING: This will use STX from your deployer account"
echo "⚠  Make sure you have sufficient testnet STX"
echo ""
read -p "Continue with deployment? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Deployment cancelled"
    exit 0
fi

echo ""
echo "Deploying contracts to testnet..."
echo ""

# Deploy using Clarinet
if clarinet deployments apply --testnet; then
    echo ""
    echo "✓ Deployment successful!"
    echo ""
    echo "Next steps:"
    echo "1. Note the deployed contract addresses"
    echo "2. Update .env.local with contract addresses"
    echo "3. Register protocol adapters with router"
    echo "4. Configure adapter pool contracts"
    echo ""
    echo "See DEPLOYMENT.md for detailed post-deployment steps"
else
    echo ""
    echo "✗ Deployment failed"
    echo "Check the error messages above and try again"
    exit 1
fi
