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

# Check if private key is set
if [ -z "$DEPLOYER_PRIVATE_KEY" ]; then
    echo -e "${RED}Error: DEPLOYER_PRIVATE_KEY not set${NC}"
    echo "Export your deployer private key: export DEPLOYER_PRIVATE_KEY=your_private_key"
    exit 1
fi

# Check if ts-node is available
if ! command -v ts-node &> /dev/null; then
    echo -e "${YELLOW}ts-node not found, installing dependencies...${NC}"
    npm install
fi

# Run the TypeScript registration script
echo -e "${GREEN}Running registration script...${NC}"
echo ""

export NETWORK=$NETWORK
export DEPLOYER_ADDRESS=$DEPLOYER_ADDRESS
export DEPLOYER_PRIVATE_KEY=$DEPLOYER_PRIVATE_KEY

ts-node "$(dirname "$0")/run-registration.ts"

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}=================================="
    echo -e "Registration completed successfully!"
    echo -e "==================================${NC}"
else
    echo ""
    echo -e "${RED}=================================="
    echo -e "Registration failed!"
    echo -e "==================================${NC}"
    exit 1
fi
