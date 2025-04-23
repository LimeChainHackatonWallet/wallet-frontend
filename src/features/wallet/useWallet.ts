// src/features/wallet/useWallet.ts
import { useState, useEffect } from 'react';
import { generateSolanaWallet } from './walletUtils';

export function useWallet() {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [secretKey, setSecretKey] = useState<string | null>(null);

  useEffect(() => {
    // Load wallet from localStorage (if it exists)
    const storedWallet = localStorage.getItem('wallet');
    if (storedWallet) {
      const { publicKey, secretKey } = JSON.parse(storedWallet);
      setPublicKey(publicKey);
      setSecretKey(secretKey);
    }
  }, []);

  const createWallet = () => {
    const { publicKey, secretKey } = generateSolanaWallet();
    // Store wallet securely (in real-world scenarios, use IndexedDB and/or encryption)
    localStorage.setItem('wallet', JSON.stringify({ publicKey, secretKey }));
    setPublicKey(publicKey);
    setSecretKey(secretKey);
  };

  return { publicKey, secretKey, createWallet };
}
