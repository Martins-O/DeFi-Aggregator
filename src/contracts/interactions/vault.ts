/**
 * Vault Contract Interaction Module
 * Handles all interactions with the vault-manager smart contract
 */

import {
  makeContractCall,
  broadcastTransaction,
  AnchorMode,
  PostConditionMode,
  stringAsciiCV,
  uintCV,
  principalCV,
} from '@stacks/transactions';
import { StacksNetwork } from '@stacks/network';

export interface VaultConfig {
  contractAddress: string;
  contractName: string;
  network: StacksNetwork;
}

/**
 * Create a new vault with specified strategy
 */
export async function createVault(
  config: VaultConfig,
  senderKey: string,
  strategy: string
) {
  const txOptions = {
    contractAddress: config.contractAddress,
    contractName: config.contractName,
    functionName: 'create-vault',
    functionArgs: [stringAsciiCV(strategy)],
    senderKey,
    network: config.network,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Deny,
  };

  const transaction = await makeContractCall(txOptions);
  return broadcastTransaction(transaction, config.network);
}

/**
 * Deposit sBTC to a vault
 */
export async function depositToVault(
  config: VaultConfig,
  senderKey: string,
  vaultId: bigint,
  amount: bigint,
  sbtcTokenContract: string
) {
  const txOptions = {
    contractAddress: config.contractAddress,
    contractName: config.contractName,
    functionName: 'deposit-to-vault',
    functionArgs: [
      uintCV(vaultId),
      uintCV(amount),
      principalCV(sbtcTokenContract),
    ],
    senderKey,
    network: config.network,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Deny,
  };

  const transaction = await makeContractCall(txOptions);
  return broadcastTransaction(transaction, config.network);
}

/**
 * Withdraw sBTC from a vault
 */
export async function withdrawFromVault(
  config: VaultConfig,
  senderKey: string,
  vaultId: bigint,
  amount: bigint,
  sbtcTokenContract: string
) {
  const txOptions = {
    contractAddress: config.contractAddress,
    contractName: config.contractName,
    functionName: 'withdraw-from-vault',
    functionArgs: [
      uintCV(vaultId),
      uintCV(amount),
      principalCV(sbtcTokenContract),
    ],
    senderKey,
    network: config.network,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Deny,
  };

  const transaction = await makeContractCall(txOptions);
  return broadcastTransaction(transaction, config.network);
}

/**
 * Rebalance vault allocation to a target protocol
 */
export async function rebalanceVault(
  config: VaultConfig,
  senderKey: string,
  vaultId: bigint,
  targetProtocol: string,
  amount: bigint
) {
  const txOptions = {
    contractAddress: config.contractAddress,
    contractName: config.contractName,
    functionName: 'rebalance-vault',
    functionArgs: [
      uintCV(vaultId),
      stringAsciiCV(targetProtocol),
      uintCV(amount),
    ],
    senderKey,
    network: config.network,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Allow,
  };

  const transaction = await makeContractCall(txOptions);
  return broadcastTransaction(transaction, config.network);
}

/**
 * Get vault information
 */
export async function getVaultInfo(
  config: VaultConfig,
  vaultId: bigint
) {
  // This would use callReadOnlyFunction from @stacks/transactions
  // Placeholder for actual implementation
  return {
    owner: 'SP...',
    totalDeposited: BigInt(0),
    strategy: 'max-yield',
    active: true,
    createdAt: BigInt(0),
  };
}

/**
 * Get user's balance in a specific vault
 */
export async function getUserVaultBalance(
  config: VaultConfig,
  vaultId: bigint,
  userAddress: string
) {
  // This would use callReadOnlyFunction from @stacks/transactions
  // Placeholder for actual implementation
  return {
    balance: BigInt(0),
  };
}

/**
 * Get vault allocation for a specific protocol
 */
export async function getVaultAllocation(
  config: VaultConfig,
  vaultId: bigint,
  protocolId: string
) {
  // This would use callReadOnlyFunction from @stacks/transactions
  // Placeholder for actual implementation
  return {
    allocatedAmount: BigInt(0),
  };
}
