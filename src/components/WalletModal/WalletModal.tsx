import React from 'react';
import { Wallet } from 'lucide-react';
import { isMetaMaskAvailable } from '../../utils/wallet';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnectMetaMask: () => void;
  onDisconnect: () => void;
  status: 'idle' | 'connecting' | 'connected' | 'error';
  address: string | null;
  error: string | null;
}

export const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  onClose,
  onConnectMetaMask,
  onDisconnect,
  status,
  address,
  error,
}) => {
  if (!isOpen) return null;

  const metaMaskInstalled = isMetaMaskAvailable();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Connect Wallet</h3>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="p-4 space-y-4">
          {!metaMaskInstalled && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 text-amber-800 p-3">
              <p className="text-sm">
                MetaMask is not detected. Please install MetaMask to continue.
              </p>
              <a
                href="https://metamask.io/download/"
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:underline text-sm"
              >
                Download MetaMask
              </a>
            </div>
          )}

          <div className="space-y-2">
            <button
              onClick={onConnectMetaMask}
              disabled={status === 'connecting' || !metaMaskInstalled}
              className={`w-full flex items-center space-x-2 px-4 py-3 rounded-lg border transition-all duration-200 ${
                metaMaskInstalled
                  ? 'border-gray-200 hover:border-blue-400 hover:bg-blue-50'
                  : 'border-gray-200 bg-gray-50 cursor-not-allowed'
              }`}
            >
              <Wallet className="w-5 h-5 text-blue-600" />
              <span className="font-medium">MetaMask</span>
              {status === 'connecting' && (
                <span className="ml-auto text-sm text-gray-500">Connecting...</span>
              )}
            </button>
          </div>

          {status === 'connected' && address && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-800 p-3">
              <p className="text-sm">Connected address:</p>
              <p className="font-mono text-sm">{address}</p>
              <button
                onClick={onDisconnect}
                className="mt-3 px-3 py-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 font-medium"
              >
                Disconnect
              </button>
            </div>
          )}

          {status === 'error' && error && (
            <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 p-3">
              <p className="text-sm">{error}</p>
            </div>
          )}
        </div>

        <div className="px-4 pb-4">
          <button
            onClick={onClose}
            className="w-full mt-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default WalletModal;