#!/usr/bin/env ts-node

import { registerAdapters } from './register-adapters';
import { validateAllAdapters } from './validate-adapters';
import { checkAllAdaptersStatus, displayStatusSummary } from './check-registration-status';
import { StacksTestnet, StacksMainnet } from '@stacks/network';

async function main() {
  const network = (process.env.NETWORK || 'testnet') as 'testnet' | 'mainnet';
  const deployerAddress = process.env.DEPLOYER_ADDRESS;
  const privateKey = process.env.DEPLOYER_PRIVATE_KEY;

  if (!deployerAddress) {
    console.error('Error: DEPLOYER_ADDRESS environment variable not set');
    process.exit(1);
  }

  if (!privateKey) {
    console.error('Error: DEPLOYER_PRIVATE_KEY environment variable not set');
    process.exit(1);
  }

  const routerContract = `${deployerAddress}.router`;

  const adapters = [
    {
      name: 'Velar',
      contractName: 'velar-adapter',
      contractAddress: deployerAddress,
      address: deployerAddress,
    },
    {
      name: 'ALEX',
      contractName: 'alex-adapter',
      contractAddress: deployerAddress,
      address: deployerAddress,
    },
  ];

  console.log('================================================');
  console.log('Protocol Adapter Registration');
  console.log('================================================');
  console.log(`Network: ${network}`);
  console.log(`Deployer: ${deployerAddress}`);
  console.log(`Router: ${routerContract}`);
  console.log('');

  // Step 1: Validate adapters
  console.log('Step 1: Validating adapters...');
  console.log('');

  const stacksNetwork = network === 'mainnet' ? new StacksMainnet() : new StacksTestnet();
  const validationResults = await validateAllAdapters(adapters, stacksNetwork);

  const allValid = Array.from(validationResults.values()).every(r => r.isValid);

  if (!allValid) {
    console.error('\nValidation failed! Please check adapter contracts.');
    process.exit(1);
  }

  console.log('\n✓ All adapters validated successfully\n');

  // Step 2: Check current registration status
  console.log('Step 2: Checking current registration status...');
  console.log('');

  const statusConfig = { network, routerContract };
  const currentStatus = await checkAllAdaptersStatus(adapters, statusConfig);

  const alreadyRegistered = currentStatus.filter(s => s.isRegistered);

  if (alreadyRegistered.length === adapters.length) {
    console.log('\n✓ All adapters are already registered!');
    displayStatusSummary(currentStatus);
    process.exit(0);
  }

  // Step 3: Register adapters
  console.log('\nStep 3: Registering adapters...');
  console.log('');

  const registrationConfig = {
    network,
    routerContract,
    deployerAddress,
    privateKey,
  };

  const results = await registerAdapters(adapters, registrationConfig);

  // Step 4: Display results
  console.log('\n================================================');
  console.log('Registration Results');
  console.log('================================================\n');

  let successCount = 0;
  let failCount = 0;

  results.forEach((result, name) => {
    if (typeof result === 'string') {
      console.log(`✓ ${name}: ${result}`);
      successCount++;
    } else {
      console.error(`✗ ${name}: ${result.message}`);
      failCount++;
    }
  });

  console.log('\n================================================');
  console.log(`Success: ${successCount}, Failed: ${failCount}`);
  console.log('================================================\n');

  // Step 5: Final status check
  console.log('Step 4: Verifying final registration status...');
  console.log('');

  const finalStatus = await checkAllAdaptersStatus(adapters, statusConfig);
  displayStatusSummary(finalStatus);

  if (failCount > 0) {
    process.exit(1);
  }
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
