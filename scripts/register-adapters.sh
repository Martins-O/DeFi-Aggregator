#!/bin/bash

# Protocol Adapter Registration Script
# This script registers protocol adapters with the router contract after deployment

set -e

echo "=================================="
echo "Protocol Adapter Registration"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if required environment variables are set
if [ -z "$DEPLOYER_ADDRESS" ]; then
    echo -e "${RED}Error: DEPLOYER_ADDRESS not set${NC}"
    exit 1
fi

if [ -z "$NETWORK" ]; then
    echo -e "${YELLOW}Warning: NETWORK not set, defaulting to testnet${NC}"
    NETWORK="testnet"
fi

echo -e "${GREEN}Network: $NETWORK${NC}"
echo -e "${GREEN}Deployer: $DEPLOYER_ADDRESS${NC}"
echo ""

# TODO: Add adapter registration logic
echo "Registration script initialized..."
