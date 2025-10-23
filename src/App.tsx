import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Navbar } from './components/Layout/Navbar';
import { HomePage } from './pages/HomePage';
import { ListingsPage } from './pages/ListingsPage';
import { PropertyDetailPage } from './pages/PropertyDetailPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { DashboardPage } from './pages/DashboardPage';
import WalletModal from './components/WalletModal/WalletModal';
import { connectMetaMask, saveWalletAddress, loadWalletAddress, clearWalletAddress } from './utils/wallet';
import type { EthereumProvider, EIP1193Error } from './utils/wallet';

const AppContent: React.FC = () => {
  // Replace mock walletConnected boolean with actual address-based state
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [walletStatus, setWalletStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');
  const [walletError, setWalletError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState(['1', '4']);
  const navigate = useNavigate();

  useEffect(() => {
    // Load persisted address
    const saved = loadWalletAddress();
    if (saved) {
      setWalletAddress(saved);
      setWalletStatus('connected');
    }
  }, []);

  useEffect(() => {
    // Sync with provider account changes
    const ethereum = (window as Window & typeof globalThis).ethereum as EthereumProvider | undefined;
    if (!ethereum || !ethereum.on) return;
    const handler = (accounts: string[]) => {
      if (accounts && accounts.length > 0) {
        setWalletAddress(accounts[0]);
        saveWalletAddress(accounts[0]);
        setWalletStatus('connected');
        setWalletError(null);
      } else {
        setWalletAddress(null);
        clearWalletAddress();
        setWalletStatus('idle');
      }
    };
    ethereum.on('accountsChanged', handler);
    return () => {
      if (ethereum && ethereum.removeListener) {
        ethereum.removeListener('accountsChanged', handler);
      }
    };
  }, []);

  const handleConnectWallet = () => {
    // Open modal to select wallet and connect
    setIsWalletModalOpen(true);
  };

  const handleDisconnectWallet = () => {
    setWalletAddress(null);
    clearWalletAddress();
    setWalletStatus('idle');
    setWalletError(null);
  };

  const handleConnectMetaMask = async () => {
    setWalletStatus('connecting');
    setWalletError(null);
    try {
      const address = await connectMetaMask();
      setWalletAddress(address);
      saveWalletAddress(address);
      setWalletStatus('connected');
    } catch (err: unknown) {
      const e = err as EIP1193Error;
      if (e?.code === 'NO_PROVIDER' || e?.message === 'NO_PROVIDER') {
        setWalletError('MetaMask is not installed. Please install it to continue.');
        setWalletStatus('error');
      } else if (e?.code === 4001) {
        setWalletError('Connection request was rejected.');
        setWalletStatus('error');
      } else {
        setWalletError('Failed to connect to MetaMask.');
        setWalletStatus('error');
      }
    }
  };

  const handleToggleFavorite = (propertyId: string) => {
    setFavorites(prev => 
      prev.includes(propertyId)
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  const handlePropertyClick = (propertyId: string) => {
    navigate(`/property/${propertyId}`);
  };

  return (
    <>
      <Navbar 
        onConnectWallet={handleConnectWallet}
        onDisconnectWallet={handleDisconnectWallet}
        walletConnected={!!walletAddress}
        walletAddress={walletAddress}
      />

      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        onConnectMetaMask={handleConnectMetaMask}
        onDisconnect={handleDisconnectWallet}
        status={walletStatus}
        address={walletAddress}
        error={walletError}
      />
      
      <Routes>
        <Route 
          path="/" 
          element={
            <HomePage 
              onToggleFavorite={handleToggleFavorite}
              onPropertyClick={handlePropertyClick}
            />
          } 
        />
        <Route 
          path="/listings" 
          element={
            <ListingsPage 
              onToggleFavorite={handleToggleFavorite}
              onPropertyClick={handlePropertyClick}
            />
          } 
        />
        <Route 
          path="/property/:id" 
          element={<PropertyDetailPage onToggleFavorite={handleToggleFavorite} />} 
        />
        <Route 
          path="/favorites" 
          element={
            <FavoritesPage 
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              onPropertyClick={handlePropertyClick}
            />
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <DashboardPage 
              walletConnected={!!walletAddress}
              onConnectWallet={handleConnectWallet}
            />
          } 
        />
      </Routes>
    </>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;