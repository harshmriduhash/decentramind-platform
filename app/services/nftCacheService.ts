'use client';

import { db, isFirebaseConfigured } from '../services/firebase';
import { collection, doc, setDoc, getDoc, query, where, getDocs, orderBy, limit } from 'firebase/firestore';

// NFT Cache Service for storing and retrieving NFT metadata
export class NFTCacheService {
  private static readonly COLLECTION_NAME = 'user_nfts';

  // Cache NFT metadata for a user
  static async cacheUserNFT(
    userId: string,
    mintAddress: string,
    metadata: {
      name: string;
      symbol: string;
      description: string;
      image: string;
      attributes: Array<{ trait_type: string; value: string }>;
      collection?: string;
      external_url?: string;
    }
  ): Promise<void> {
    try {
      if (!isFirebaseConfigured() || !db) {
        console.log('Firebase not configured, using localStorage for NFT cache');
        const cacheKey = `nft_cache_${userId}_${mintAddress}`;
        const cacheData = {
          userId,
          mintAddress,
          metadata,
          cachedAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        };
        localStorage.setItem(cacheKey, JSON.stringify(cacheData));
        console.log('NFT metadata cached to localStorage:', mintAddress);
        return;
      }

      const nftRef = doc(db, this.COLLECTION_NAME, `${userId}_${mintAddress}`);
      await setDoc(nftRef, {
        userId,
        mintAddress,
        metadata,
        cachedAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      });
      console.log('NFT metadata cached successfully:', mintAddress);
    } catch (error) {
      console.error('Failed to cache NFT metadata:', error);
      // Fallback to localStorage
      try {
        const cacheKey = `nft_cache_${userId}_${mintAddress}`;
        const cacheData = {
          userId,
          mintAddress,
          metadata,
          cachedAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        };
        localStorage.setItem(cacheKey, JSON.stringify(cacheData));
        console.log('NFT metadata cached to localStorage as fallback:', mintAddress);
      } catch (localError) {
        console.error('Failed to cache to localStorage:', localError);
        throw error;
      }
    }
  }

  // Get cached NFT metadata for a user
  static async getCachedUserNFTs(userId: string): Promise<Array<{
    mintAddress: string;
    metadata: any;
    cachedAt: string;
  }>> {
    try {
      console.log('🔍 NFTCacheService: Getting cached NFTs for user:', userId);
      
      if (!isFirebaseConfigured() || !db) {
        console.log('🔍 NFTCacheService: Firebase not configured, using localStorage');
        const nfts: Array<{
          mintAddress: string;
          metadata: any;
          cachedAt: string;
        }> = [];
        
        // Get all localStorage keys for this user
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith(`nft_cache_${userId}_`)) {
            try {
              const cachedData = JSON.parse(localStorage.getItem(key) || '{}');
              console.log('🔍 NFTCacheService: Found localStorage NFT:', cachedData);
              nfts.push({
                mintAddress: cachedData.mintAddress,
                metadata: cachedData.metadata,
                cachedAt: cachedData.cachedAt
              });
            } catch (parseError) {
              console.warn('⚠️ NFTCacheService: Failed to parse cached NFT data:', parseError);
            }
          }
        }
        
        console.log('🔍 NFTCacheService: Retrieved cached NFTs from localStorage:', nfts.length);
        return nfts.sort((a, b) => new Date(b.cachedAt).getTime() - new Date(a.cachedAt).getTime());
      }

      console.log('🔍 NFTCacheService: Using Firebase for cached NFTs');
      const nftsRef = collection(db, this.COLLECTION_NAME);
      const q = query(
        nftsRef,
        where('userId', '==', userId),
        orderBy('cachedAt', 'desc'),
        limit(50) // Limit to 50 most recent NFTs
      );
      
      const querySnapshot = await getDocs(q);
      const nfts: Array<{
        mintAddress: string;
        metadata: any;
        cachedAt: string;
      }> = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log('🔍 NFTCacheService: Found Firebase NFT:', data);
        nfts.push({
          mintAddress: data.mintAddress,
          metadata: data.metadata,
          cachedAt: data.cachedAt
        });
      });

      console.log('🔍 NFTCacheService: Retrieved cached NFTs from Firebase:', nfts.length);
      return nfts;
    } catch (error) {
      console.error('❌ NFTCacheService: Failed to get cached NFTs:', error);
      return [];
    }
  }

  // Get specific cached NFT by mint address
  static async getCachedNFT(userId: string, mintAddress: string): Promise<{
    mintAddress: string;
    metadata: any;
    cachedAt: string;
  } | null> {
    try {
      const nftRef = doc(db, this.COLLECTION_NAME, `${userId}_${mintAddress}`);
      const nftDoc = await getDoc(nftRef);
      
      if (nftDoc.exists()) {
        const data = nftDoc.data();
        return {
          mintAddress: data.mintAddress,
          metadata: data.metadata,
          cachedAt: data.cachedAt
        };
      }
      
      return null;
    } catch (error) {
      console.error('Failed to get cached NFT:', error);
      return null;
    }
  }

  // Update NFT metadata (useful for evolving agents)
  static async updateNFTMetadata(
    userId: string,
    mintAddress: string,
    updatedMetadata: any
  ): Promise<void> {
    try {
      const nftRef = doc(db, this.COLLECTION_NAME, `${userId}_${mintAddress}`);
      await setDoc(nftRef, {
        userId,
        mintAddress,
        metadata: updatedMetadata,
        lastUpdated: new Date().toISOString()
      }, { merge: true });
      console.log('NFT metadata updated successfully:', mintAddress);
    } catch (error) {
      console.error('Failed to update NFT metadata:', error);
      throw error;
    }
  }

  // Clear cache for a user (useful for testing)
  static async clearUserCache(userId: string): Promise<void> {
    try {
      const nftsRef = collection(db, this.COLLECTION_NAME);
      const q = query(nftsRef, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      
      const deletePromises = querySnapshot.docs.map(doc => doc.ref.delete());
      await Promise.all(deletePromises);
      
      console.log('User NFT cache cleared:', userId);
    } catch (error) {
      console.error('Failed to clear user cache:', error);
      throw error;
    }
  }

  // Check if NFT is cached
  static async isNFTCached(userId: string, mintAddress: string): Promise<boolean> {
    try {
      const cachedNFT = await this.getCachedNFT(userId, mintAddress);
      return cachedNFT !== null;
    } catch (error) {
      console.error('Failed to check NFT cache:', error);
      return false;
    }
  }
}

// Export singleton instance
export const nftCacheService = new NFTCacheService();
