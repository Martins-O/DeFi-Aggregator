import { callReadOnlyFunction, cvToJSON } from '@stacks/transactions';
import { StacksTestnet, StacksMainnet, StacksNetwork } from '@stacks/network';

interface RegistrationStatus {
  adapter: string;
  isRegistered: boolean;
  error?: string;
}

interface StatusCheckConfig {
  network: 'testnet' | 'mainnet';
  routerContract: string;
}

/**
 * Check if a specific adapter is registered
 */
export async function checkAdapterRegistration(
  adapterAddress: string,
  adapterName: string,
  config: StatusCheckConfig
): Promise<RegistrationStatus> {
  const network: StacksNetwork = config.network === 'mainnet'
    ? new StacksMainnet()
    : new StacksTestnet();

  const [routerAddress, routerName] = config.routerContract.split('.');

  try {
    const response = await callReadOnlyFunction({
      contractAddress: routerAddress,
      contractName: routerName,
      functionName: 'is-protocol-registered',
      functionArgs: [],
      network,
      senderAddress: routerAddress,
    });

    const result = cvToJSON(response);

    return {
      adapter: adapterName,
      isRegistered: result.value === true,
    };
  } catch (error) {
    return {
      adapter: adapterName,
      isRegistered: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Check registration status for all adapters
 */
export async function checkAllAdaptersStatus(
  adapters: Array<{ address: string; name: string }>,
  config: StatusCheckConfig
): Promise<RegistrationStatus[]> {
  const results: RegistrationStatus[] = [];

  for (const adapter of adapters) {
    const status = await checkAdapterRegistration(adapter.address, adapter.name, config);
    results.push(status);

    if (status.isRegistered) {
      console.log(`✓ ${adapter.name} is registered`);
    } else {
      console.log(`✗ ${adapter.name} is NOT registered${status.error ? `: ${status.error}` : ''}`);
    }
  }

  return results;
}

/**
 * Display registration status summary
 */
export function displayStatusSummary(statuses: RegistrationStatus[]): void {
  const registered = statuses.filter(s => s.isRegistered).length;
  const total = statuses.length;

  console.log('\n================================');
  console.log('Registration Status Summary');
  console.log('================================');
  console.log(`Total Adapters: ${total}`);
  console.log(`Registered: ${registered}`);
  console.log(`Not Registered: ${total - registered}`);
  console.log('================================\n');

  if (registered === total) {
    console.log('✓ All adapters are registered!');
  } else {
    console.log('⚠ Some adapters are not registered. Please run registration script.');
  }
}
