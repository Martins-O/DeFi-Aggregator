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

interface RetryOptions {
  maxRetries: number;
  delayMs: number;
  backoffMultiplier: number;
}

const DEFAULT_RETRY_OPTIONS: RetryOptions = {
  maxRetries: 3,
  delayMs: 2000,
  backoffMultiplier: 2,
};

/**
 * Sleep for a specified duration
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retry a function with exponential backoff
 */
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: RetryOptions = DEFAULT_RETRY_OPTIONS
): Promise<T> {
  let lastError: Error | undefined;
  let delay = options.delayMs;

  for (let attempt = 0; attempt <= options.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (attempt < options.maxRetries) {
        console.log(`Attempt ${attempt + 1} failed, retrying in ${delay}ms...`);
        await sleep(delay);
        delay *= options.backoffMultiplier;
      }
    }
  }

  throw lastError;
}

/**
 * Register a protocol adapter with the router contract
 */
export async function registerAdapter(
  adapter: ProtocolAdapter,
  config: RegistrationConfig,
  retryOptions?: RetryOptions
): Promise<string> {
  return retryWithBackoff(async () => {
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

    try {
      const transaction = await makeContractCall(txOptions);
      const broadcastResponse = await broadcastTransaction(transaction, network);

      if (!broadcastResponse.txid) {
        throw new Error('Transaction broadcast failed: no txid received');
      }

      return broadcastResponse.txid;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to register ${adapter.name}: ${errorMsg}`);
    }
  }, retryOptions);
}

/**
 * Register multiple adapters in sequence
 */
export async function registerAdapters(
  adapters: ProtocolAdapter[],
  config: RegistrationConfig,
  retryOptions?: RetryOptions
): Promise<Map<string, string | Error>> {
  const results = new Map<string, string | Error>();

  for (const adapter of adapters) {
    console.log(`Registering ${adapter.name}...`);

    try {
      const txid = await registerAdapter(adapter, config, retryOptions);
      results.set(adapter.name, txid);
      console.log(`✓ ${adapter.name} registered: ${txid}`);
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      results.set(adapter.name, err);
      console.error(`✗ ${adapter.name} registration failed: ${err.message}`);
    }
  }

  return results;
}
