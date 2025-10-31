'use client';

import { useState, useEffect } from 'react';
import { useWallet } from './useWallet';
import { NFTCacheService } from '../services/nftCacheService';

// Types for NFT metadata
export interface NFTAttribute {
  trait_type: string;
  value: string;
}

export interface NFTMetadata {
  name: string;
  symbol: string;
  description: string;
  image: string;
  attributes: NFTAttribute[];
  mint: string;
  collection?: string;
  external_url?: string;
}

export interface UserNFT {
  mint: string;
  metadata: NFTMetadata;
  owner: string;
  tokenAccount: string;
}

// Hook to fetch user's NFTs
export const useUserNFTs = () => {
  const { wallet, connected, publicKey } = useWallet();
  const [nfts, setNfts] = useState<UserNFT[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch NFTs for the connected wallet
  const fetchUserNFTs = async () => {
    if (!connected || !publicKey) {
      console.log('🔍 useUserNFTs: Wallet not connected, clearing NFTs');
      setNfts([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('🔍 useUserNFTs: Fetching NFTs for wallet:', publicKey);
      
      // First, try to get cached NFTs
      const cachedNFTs = await NFTCacheService.getCachedUserNFTs(publicKey);
      console.log('🔍 useUserNFTs: Cached NFTs found:', cachedNFTs.length);
      
      if (cachedNFTs.length > 0) {
        console.log('🔍 useUserNFTs: Using cached NFTs:', cachedNFTs);
        const userNFTs: UserNFT[] = cachedNFTs.map(cached => ({
          mint: cached.mintAddress,
          metadata: cached.metadata,
          owner: publicKey,
          tokenAccount: `token_account_${cached.mintAddress}`
        }));
        setNfts(userNFTs);
        setLoading(false);
        
        // Debug: Check for Care Orchestrator NFT
        const careNFT = userNFTs.find(nft => nft.metadata.symbol === 'COAI');
        if (careNFT) {
          console.log('🎯 Care Orchestrator NFT found in cache:', careNFT);
        } else {
          console.log('❌ Care Orchestrator NFT NOT found in cache');
        }
        return;
      }

      console.log('🔍 useUserNFTs: No cached NFTs, using mock data');
      
      // If no cache, simulate fetching from blockchain
      // In a real implementation, this would use:
      // - getProgramAccounts for Token Program
      // - getAccountInfo for NFT metadata
      // - fetch from Arweave/IPFS for metadata JSON
      
      // Mock NFT data for demonstration
      const mockNFTs: UserNFT[] = [
        {
          mint: 'mint_1760059186565_298tmkqr7', // Your actual mint address
          metadata: {
            name: 'Care Orchestrator',
            symbol: 'COAI',
            description: 'AI Healthcare Assistant Agent for DecentraMind Labs - Hospital Management System',
            image: 'https://ipfs.io/ipfs/bafybeidki742oakaxqxdk5u6s7zz4iinaszyyw62mpcmxmkcpo3m3qsm6a/david_859400_AI_Healthcare_Assistant_soft_glowing_humanoid_fo_249dd97f-c4a7-45a3-b0b6-ed8e71e6b9be_0.png',
            attributes: [
              { trait_type: 'Agent Type', value: 'Healthcare Assistant' },
              { trait_type: 'Level', value: 'Expert' },
              { trait_type: 'Domain', value: 'Health' },
              { trait_type: 'Hospital', value: 'Your Hospital' },
              { trait_type: 'Plan', value: 'Professional' },
              { trait_type: 'Rarity', value: 'Legendary' }
            ],
            mint: 'mint_1760059186565_298tmkqr7',
            collection: 'DecentraMind AI Agents',
            external_url: 'https://decentramind.com'
          },
          owner: publicKey,
          tokenAccount: 'token_account_123'
        }
      ];

      console.log('🔍 useUserNFTs: Mock NFTs created:', mockNFTs);

      // Filter NFTs that match our criteria
      const filteredNFTs = mockNFTs.filter(nft => 
        nft.metadata.symbol === 'COAI' || 
        nft.metadata.attributes.some(attr => 
          attr.trait_type === 'Agent Type' && 
          attr.value === 'Healthcare Assistant'
        )
      );

      console.log('🔍 useUserNFTs: Filtered NFTs:', filteredNFTs);

      // Cache the NFTs for future use
      for (const nft of filteredNFTs) {
        console.log('🔍 useUserNFTs: Caching NFT:', nft.mint);
        await NFTCacheService.cacheUserNFT(publicKey, nft.mint, nft.metadata);
      }

      setNfts(filteredNFTs);
      console.log('🔍 useUserNFTs: Final NFTs set:', filteredNFTs);

    } catch (err: any) {
      console.error('❌ useUserNFTs: Failed to fetch NFTs:', err);
      setError(err.message || 'Failed to fetch NFTs');
      setNfts([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch NFTs when wallet connects or changes
  useEffect(() => {
    if (connected && publicKey) {
      fetchUserNFTs();
    } else {
      setNfts([]);
    }
  }, [connected, publicKey]);

  // Find NFT by agent type
  const findNFTByAgentType = (agentType: string): UserNFT | undefined => {
    return nfts.find(nft => 
      nft.metadata.attributes.some(attr => 
        attr.trait_type === 'Agent Type' && 
        attr.value === agentType
      )
    );
  };

  // Find NFT by symbol
  const findNFTBySymbol = (symbol: string): UserNFT | undefined => {
    return nfts.find(nft => nft.metadata.symbol === symbol);
  };

  // Get Care Orchestrator NFT specifically
  const getCareOrchestratorNFT = (): UserNFT | undefined => {
    return findNFTBySymbol('COAI') || findNFTByAgentType('Healthcare Assistant');
  };

  // Refresh NFTs (useful after minting)
  const refreshNFTs = () => {
    fetchUserNFTs();
  };

  return {
    nfts,
    loading,
    error,
    findNFTByAgentType,
    findNFTBySymbol,
    getCareOrchestratorNFT,
    refreshNFTs
  };
};
