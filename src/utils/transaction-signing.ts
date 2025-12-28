import {
  makeContractCall,
  broadcastTransaction,
  AnchorMode,
  PostConditionMode,
  FungibleConditionCode,
  makeStandardSTXPostCondition,
  ContractCallOptions,
} from '@stacks/transactions';
import { StacksNetwork } from '@stacks/network';
import { openContractCall } from '@stacks/connect';

export interface TransactionOptions {
  contractAddress: string;
  contractName: string;
  functionName: string;
  functionArgs: any[];
  network: StacksNetwork;
  postConditions?: any[];
  onFinish?: (data: any) => void;
  onCancel?: () => void;
}

/**
 * Sign and broadcast a contract call transaction
 */
export async function signAndBroadcastTransaction(
  options: TransactionOptions
): Promise<string> {
  return new Promise((resolve, reject) => {
    openContractCall({
      contractAddress: options.contractAddress,
      contractName: options.contractName,
      functionName: options.functionName,
      functionArgs: options.functionArgs,
      network: options.network,
      anchorMode: AnchorMode.Any,
      postConditions: options.postConditions || [],
      postConditionMode: PostConditionMode.Deny,
      onFinish: (data) => {
        if (options.onFinish) {
          options.onFinish(data);
        }
        resolve(data.txId);
      },
      onCancel: () => {
        if (options.onCancel) {
          options.onCancel();
        }
        reject(new Error('Transaction cancelled by user'));
      },
    });
  });
}

/**
 * Create STX post condition for transfers
 */
export function createSTXPostCondition(
  address: string,
  amount: number,
  conditionCode: FungibleConditionCode = FungibleConditionCode.Equal
) {
  return makeStandardSTXPostCondition(
    address,
    conditionCode,
    amount * 1_000_000 // Convert to micro-STX
  );
}

/**
 * Wait for transaction confirmation
 */
export async function waitForTransaction(
  txId: string,
  network: StacksNetwork,
  maxAttempts: number = 30
): Promise<boolean> {
  const apiUrl = network.isMainnet()
    ? 'https://api.mainnet.hiro.so'
    : 'https://api.testnet.hiro.so';

  for (let i = 0; i < maxAttempts; i++) {
    try {
      const response = await fetch(`${apiUrl}/extended/v1/tx/${txId}`);
      const data = await response.json();

      if (data.tx_status === 'success') {
        return true;
      } else if (data.tx_status === 'abort_by_response' || data.tx_status === 'abort_by_post_condition') {
        throw new Error(`Transaction failed: ${data.tx_status}`);
      }

      // Wait 2 seconds before next attempt
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      if (i === maxAttempts - 1) {
        throw error;
      }
    }
  }

  throw new Error('Transaction confirmation timeout');
}

/**
 * Get transaction details
 */
export async function getTransactionDetails(
  txId: string,
  network: StacksNetwork
): Promise<any> {
  const apiUrl = network.isMainnet()
    ? 'https://api.mainnet.hiro.so'
    : 'https://api.testnet.hiro.so';

  const response = await fetch(`${apiUrl}/extended/v1/tx/${txId}`);

  if (!response.ok) {
    throw new Error('Failed to fetch transaction details');
  }

  return await response.json();
}

/**
 * Estimate transaction fee
 */
export async function estimateTransactionFee(
  options: Omit<TransactionOptions, 'onFinish' | 'onCancel'>
): Promise<number> {
  try {
    // This is a simplified estimation
    // In production, you'd want to use the actual fee estimation API
    return 0.001; // 0.001 STX
  } catch (error) {
    console.error('Error estimating fee:', error);
    return 0.001;
  }
}
