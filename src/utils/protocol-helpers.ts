/**
 * Protocol helper utilities
 */

export interface Protocol {
  id: string;
  name: string;
  adapter: string;
  category: 'dex' | 'lending' | 'yield';
  description: string;
}

export const SUPPORTED_PROTOCOLS: Protocol[] = [
  {
    id: 'velar',
    name: 'Velar',
    adapter: 'velar-adapter',
    category: 'dex',
    description: 'DEX liquidity provision and trading',
  },
  {
    id: 'alex',
    name: 'ALEX',
    adapter: 'alex-adapter',
    category: 'lending',
    description: 'Lending and borrowing platform',
  },
];

export function getProtocolById(id: string): Protocol | undefined {
  return SUPPORTED_PROTOCOLS.find(p => p.id === id);
}

export function getProtocolsByCategory(category: string): Protocol[] {
  return SUPPORTED_PROTOCOLS.filter(p => p.category === category);
}

export function formatProtocolName(id: string): string {
  const protocol = getProtocolById(id);
  return protocol ? protocol.name : id.toUpperCase();
}
