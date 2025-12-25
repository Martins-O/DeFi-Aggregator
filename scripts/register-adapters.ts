import {
  makeContractCall,
  broadcastTransaction,
  AnchorMode,
  PostConditionMode,
} from '@stacks/transactions';
import { StacksTestnet, StacksMainnet } from '@stacks/network';

interface ProtocolAdapter {
  name: string;
  contractName: string;
  contractAddress: string;
}

interface RegistrationConfig {
  network: 'testnet' | 'mainnet';
  routerContract: string;
  deployerAddress: string;
  privateKey: string;
}

/**
 * Register a protocol adapter with the router contract
 */
export async function registerAdapter(
  adapter: ProtocolAdapter,
  config: RegistrationConfig
): Promise<string> {
  const network = config.network === 'mainnet'
    ? new StacksMainnet()
    : new StacksTestnet();

  const [routerAddress, routerName] = config.routerContract.split('.');

  const txOptions = {
    contractAddress: routerAddress,
    contractName: routerName,
    functionName: 'register-protocol',
    functionArgs: [],
    network,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Allow,
    senderKey: config.privateKey,
  };

  const transaction = await makeContractCall(txOptions);
  const broadcastResponse = await broadcastTransaction(transaction, network);

  return broadcastResponse.txid;
}

/**
 * Register multiple adapters in sequence
 */
export async function registerAdapters(
  adapters: ProtocolAdapter[],
  config: RegistrationConfig
): Promise<Map<string, string>> {
  const results = new Map<string, string>();

  for (const adapter of adapters) {
    console.log(`Registering ${adapter.name}...`);
    const txid = await registerAdapter(adapter, config);
    results.set(adapter.name, txid);
    console.log(`✓ ${adapter.name} registered: ${txid}`);
  }

  return results;
}
