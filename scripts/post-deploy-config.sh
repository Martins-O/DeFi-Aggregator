#!/bin/bash

# Post-Deployment Configuration Script
# Registers protocol adapters and configures contracts after deployment

set -e

echo "================================================="
echo "Post-Deployment Configuration"
echo "================================================="
echo ""

# Check if deployment addresses are set
if [ -z "$DEPLOYER_ADDRESS" ]; then
    echo "Error: DEPLOYER_ADDRESS environment variable not set"
    echo "Export your deployer address: export DEPLOYER_ADDRESS=ST1PQHQKV..."
    exit 1
fi

echo "Deployer Address: $DEPLOYER_ADDRESS"
echo ""

# Protocol adapter addresses (update these with actual deployed addresses)
ROUTER_CONTRACT="${DEPLOYER_ADDRESS}.router"
VELAR_ADAPTER="${DEPLOYER_ADDRESS}.velar-adapter"
ALEX_ADAPTER="${DEPLOYER_ADDRESS}.alex-adapter"

echo "================================================="
echo "Step 1: Register Protocol Adapters"
echo "================================================="
echo ""

echo "Registering Velar adapter..."
echo "Contract call: router.register-protocol"
echo "  Protocol ID: velar"
echo "  Adapter: $VELAR_ADAPTER"
echo ""

# Example contract call (actual implementation depends on your wallet/CLI setup)
cat << EOF
To register Velar adapter, execute this contract call:

(contract-call? '${ROUTER_CONTRACT} register-protocol
  "velar"
  '${VELAR_ADAPTER})

EOF

echo "Registering ALEX adapter..."
echo "Contract call: router.register-protocol"
echo "  Protocol ID: alex"
echo "  Adapter: $ALEX_ADAPTER"
echo ""

cat << EOF
To register ALEX adapter, execute this contract call:

(contract-call? '${ROUTER_CONTRACT} register-protocol
  "alex"
  '${ALEX_ADAPTER})

EOF

echo "================================================="
echo "Step 2: Configure Protocol Pool Contracts"
echo "================================================="
echo ""

echo "Set Velar pool contract..."
echo "⚠  Update with actual Velar pool address on testnet"
echo ""

cat << EOF
(contract-call? '${VELAR_ADAPTER} set-pool-contract
  'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar-pool)

EOF

echo "Set ALEX pool contract..."
echo "⚠  Update with actual ALEX pool address on testnet"
echo ""

cat << EOF
(contract-call? '${ALEX_ADAPTER} set-pool-contract
  'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.alex-pool)

EOF

echo "================================================="
echo "Step 3: Verify Configuration"
echo "================================================="
echo ""

echo "Verify protocol registration:"
echo ""
cat << EOF
(contract-call? '${ROUTER_CONTRACT} get-protocol-info "velar")
(contract-call? '${ROUTER_CONTRACT} get-protocol-info "alex")

EOF

echo "================================================="
echo "Configuration Complete!"
echo "================================================="
echo ""
echo "Next steps:"
echo "1. Update frontend .env.local with contract addresses"
echo "2. Test contract interactions"
echo "3. Deploy frontend to Vercel"
echo ""
