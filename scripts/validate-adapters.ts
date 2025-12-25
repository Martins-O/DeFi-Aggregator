import { callReadOnlyFunction, cvToJSON } from '@stacks/transactions';
import { StacksNetwork } from '@stacks/network';

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validate adapter contract exists and is accessible
 */
export async function validateAdapterContract(
  contractAddress: string,
  contractName: string,
  network: StacksNetwork
): Promise<ValidationResult> {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
  };

  try {
    // Check if contract exists by calling a read-only function
    await callReadOnlyFunction({
      contractAddress,
      contractName,
      functionName: 'get-name',
      functionArgs: [],
      network,
      senderAddress: contractAddress,
    });
  } catch (error) {
    result.isValid = false;
    result.errors.push(`Contract ${contractAddress}.${contractName} not found or not accessible`);
  }

  return result;
}

/**
 * Check if adapter is already registered
 */
export async function isAdapterRegistered(
  adapterAddress: string,
  adapterName: string,
  routerAddress: string,
  routerName: string,
  network: StacksNetwork
): Promise<boolean> {
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
    return result.value === true;
  } catch (error) {
    console.warn('Could not check registration status:', error);
    return false;
  }
}

/**
 * Validate all adapters before registration
 */
export async function validateAllAdapters(
  adapters: Array<{ contractAddress: string; contractName: string; name: string }>,
  network: StacksNetwork
): Promise<Map<string, ValidationResult>> {
  const results = new Map<string, ValidationResult>();

  for (const adapter of adapters) {
    console.log(`Validating ${adapter.name}...`);
    const validation = await validateAdapterContract(
      adapter.contractAddress,
      adapter.contractName,
      network
    );
    results.set(adapter.name, validation);

    if (validation.isValid) {
      console.log(`✓ ${adapter.name} validation passed`);
    } else {
      console.error(`✗ ${adapter.name} validation failed:`, validation.errors);
    }
  }

  return results;
}
