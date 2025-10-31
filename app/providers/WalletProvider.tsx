"use client";

import React from 'react';
import { WalletProvider as WalletContextProvider } from './WalletContext';

interface WalletProviderProps {
  children: React.ReactNode;
}

export function WalletProvider({ children }: WalletProviderProps) {
  return (
    <WalletContextProvider>
      {children}
    </WalletContextProvider>
  );
} 