#!/bin/bash

# Test Runner Script
# Runs all contract tests using Clarinet

set -e

echo "=================================="
echo "Running Contract Tests"
echo "=================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if clarinet is installed
if ! command -v clarinet &> /dev/null; then
    echo -e "${RED}Error: Clarinet not found${NC}"
    echo "Please install Clarinet: https://github.com/hirosystems/clarinet"
    exit 1
fi

echo -e "${GREEN}Running all tests...${NC}"
echo ""

# Run tests
clarinet test

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}=================================="
    echo -e "All tests passed!"
    echo -e "==================================${NC}"
else
    echo ""
    echo -e "${RED}=================================="
    echo -e "Some tests failed"
    echo -e "==================================${NC}"
    exit 1
fi
