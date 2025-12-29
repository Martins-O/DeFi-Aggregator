/**
 * Helper utilities for interacting with Clarity contracts
 */

import { principalCV, uintCV, stringAsciiCV, PostConditionMode } from '@stacks/transactions';

export interface ContractCallParams {
  contractAddress: string;
  contractName: string;
  functionName: string;
  functionArgs: any[];
  postConditionMode?: PostConditionMode;
}

export function buildContractPrincipal(address: string, contractName: string): string {
  return `${address}.${contractName}`;
}

export function parseContractIdentifier(identifier: string): {
  address: string;
  contractName: string;
} {
  const [address, contractName] = identifier.split('.');
  if (!address || !contractName) {
    throw new Error('Invalid contract identifier format');
  }
  return { address, contractName };
}

export function encodeProtocolId(protocol: string): typeof stringAsciiCV {
  return stringAsciiCV(protocol);
}

export function encodeAmount(amount: number): typeof uintCV {
  const microAmount = Math.floor(amount * 1_000_000);
  return uintCV(microAmount);
}

export function decodeAmount(microAmount: number): number {
  return microAmount / 1_000_000;
}
