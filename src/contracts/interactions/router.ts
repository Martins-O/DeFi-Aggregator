/**
 * Router Contract Interaction Module
 * Handles all interactions with the router smart contract
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

export interface RouterConfig {
  contractAddress: string;
  contractName: string;
  network: StacksNetwork;
}

/**
 * Register a new protocol with the router
 */
export async function registerProtocol(
  config: RouterConfig,
  senderKey: string,
  protocolId: string,
  adapterContract: string
) {
  const txOptions = {
    contractAddress: config.contractAddress,
    contractName: config.contractName,
    functionName: 'register-protocol',
    functionArgs: [
      stringAsciiCV(protocolId),
      principalCV(adapterContract),
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
 * Deposit sBTC to a protocol via the router
 */
export async function depositToProtocol(
  config: RouterConfig,
  senderKey: string,
  protocolId: string,
  amount: bigint,
  sbtcTokenContract: string
) {
  const txOptions = {
    contractAddress: config.contractAddress,
    contractName: config.contractName,
    functionName: 'deposit-to-protocol',
    functionArgs: [
      stringAsciiCV(protocolId),
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
 * Withdraw sBTC from a protocol via the router
 */
export async function withdrawFromProtocol(
  config: RouterConfig,
  senderKey: string,
  protocolId: string,
  amount: bigint,
  sbtcTokenContract: string
) {
  const txOptions = {
    contractAddress: config.contractAddress,
    contractName: config.contractName,
    functionName: 'withdraw-from-protocol',
    functionArgs: [
      stringAsciiCV(protocolId),
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
 * Get protocol information from router
 */
export async function getProtocolInfo(
  config: RouterConfig,
  protocolId: string
) {
  // This would use callReadOnlyFunction from @stacks/transactions
  // Placeholder for actual implementation
  return {
    enabled: true,
    adapterContract: 'SP...adapter',
  };
}

/**
 * Get user deposit information
 */
export async function getUserDeposit(
  config: RouterConfig,
  userAddress: string,
  protocolId: string
) {
  // This would use callReadOnlyFunction from @stacks/transactions
  // Placeholder for actual implementation
  return {
    amount: BigInt(0),
  };
}

/**
 * Toggle router pause state (admin only)
 */
export async function togglePause(
  config: RouterConfig,
  senderKey: string
) {
  const txOptions = {
    contractAddress: config.contractAddress,
    contractName: config.contractName,
    functionName: 'toggle-pause',
    functionArgs: [],
    senderKey,
    network: config.network,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Allow,
  };

  const transaction = await makeContractCall(txOptions);
  return broadcastTransaction(transaction, config.network);
}
