// Lightweight wallet utilities for MetaMask integration

// Minimal global typing to avoid TS errors when accessing window.ethereum
export interface EthereumProvider {
  isMetaMask?: boolean;
  request<T = unknown>(args: { method: string; params?: unknown[] | Record<string, unknown> }): Promise<T>;
  on?(event: 'accountsChanged', handler: (accounts: string[]) => void): void;
  on?(event: 'chainChanged', handler: (chainId: string) => void): void;
  on?(event: string, handler: (payload: unknown) => void): void;
  removeListener?(event: 'accountsChanged', handler: (accounts: string[]) => void): void;
  removeListener?(event: 'chainChanged', handler: (chainId: string) => void): void;
  removeListener?(event: string, handler: (payload: unknown) => void): void;
  providers?: EthereumProvider[];
}

export type EIP1193Error = {
  code?: number | string;
  message?: string;
};

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

const STORAGE_KEY = 'propchain_wallet_address';

export function isMetaMaskAvailable(): boolean {
  const ethereum = (window as Window & typeof globalThis).ethereum;
  if (!ethereum) return false;
  // Prefer explicit MetaMask detection when available
  return !!ethereum.isMetaMask || !!ethereum.providers?.some((p: EthereumProvider) => p.isMetaMask);
}

// Connect to MetaMask and return the first account address
export async function connectMetaMask(): Promise<string> {
  const ethereum = (window as Window & typeof globalThis).ethereum;
  if (!ethereum) {
    const err = new Error('NO_PROVIDER') as Error & { code?: string };
    err.code = 'NO_PROVIDER';
    throw err;
  }

  try {
    const accounts = await ethereum.request<string[]>({ method: 'eth_requestAccounts' });
    if (!accounts || accounts.length === 0) {
      throw new Error('NO_ACCOUNTS');
    }
    return accounts[0];
  } catch (error: unknown) {
    const e = error as EIP1193Error;
    if (e?.code === 4001) {
      throw error;
    }
    throw error;
  }
}

export function truncateAddress(address: string, size = 4): string {
  if (!address) return '';
  const prefix = address.slice(0, 2) === '0x' ? 2 : 0;
  const start = address.slice(0 + prefix, 2 + prefix + size);
  const end = address.slice(-size);
  return `${address.slice(0, prefix)}${start}...${end}`;
}

export function saveWalletAddress(address: string) {
  try {
    localStorage.setItem(STORAGE_KEY, address);
  } catch (e) {
    console.warn('Failed to save wallet address to localStorage', e);
  }
}

export function loadWalletAddress(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch (e) {
    console.warn('Failed to load wallet address from localStorage', e);
    return null;
  }
}

export function clearWalletAddress() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn('Failed to clear wallet address from localStorage', e);
  }
}