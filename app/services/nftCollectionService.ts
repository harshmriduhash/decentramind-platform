'use client';

import { WalletAdapter } from '../hooks/useWallet';

// NFT Collection Service for DecentraMind AI Agents
export class NFTCollectionService {
  private wallet: WalletAdapter | null = null;
  private collectionAddress: string | null = null;

  // Set wallet for signing transactions
  setWallet(wallet: WalletAdapter) {
    this.wallet = wallet;
  }

  // Create NFT Collection for DecentraMind AI Agents
  async createCollection(): Promise<{
    collectionAddress: string;
    transaction: string;
  }> {
    if (!this.wallet || !this.wallet.publicKey) {
      throw new Error('Wallet not connected');
    }

    try {
      console.log('Creating NFT Collection...');
      
      // Collection metadata
      const collectionMetadata = {
        name: "DecentraMind AI Agents",
        symbol: "DMAGENTS",
        description: "A collection of AI agents from DecentraMind Labs, each representing unique AI capabilities and personalities.",
        image: "https://ipfs.io/ipfs/bafybeidki742oakaxqxdk5u6s7zz4iinaszyyw62mpcmxmkcpo3m3qsm6a/david_859400_AI_Healthcare_Assistant_soft_glowing_humanoid_fo_249dd97f-c4a7-45a3-b0b6-ed8e71e6b9be_0.png",
        external_url: "https://decentramind.com",
        attributes: [
          { trait_type: "Collection Type", value: "AI Agents" },
          { trait_type: "Platform", value: "DecentraMind Labs" },
          { trait_type: "Blockchain", value: "Solana" },
          { trait_type: "Total Supply", value: "1000" }
        ],
        properties: {
          files: [
            {
              uri: "https://ipfs.io/ipfs/bafybeidki742oakaxqxdk5u6s7zz4iinaszyyw62mpcmxmkcpo3m3qsm6a/david_859400_AI_Healthcare_Assistant_soft_glowing_humanoid_fo_249dd97f-c4a7-45a3-b0b6-ed8e71e6b9be_0.png",
              type: "image/png"
            }
          ],
          category: "image",
          creators: [
            {
              address: String(this.wallet.publicKey),
              verified: true,
              share: 100
            }
          ]
        }
      };

      // Simulate collection creation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const collectionAddress = `collection_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const transactionSignature = `tx_collection_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      this.collectionAddress = collectionAddress;

      console.log('Collection created successfully!');
      console.log('Collection address:', collectionAddress);
      console.log('Transaction signature:', transactionSignature);

      return {
        collectionAddress,
        transaction: transactionSignature
      };

    } catch (error) {
      console.error('Failed to create collection:', error);
      throw new Error(`Failed to create collection: ${error.message}`);
    }
  }

  // Mint NFT as part of collection
  async mintCollectionNFT(
    agentName: string,
    agentImage: string,
    agentDescription: string,
    agentAttributes: Array<{ trait_type: string; value: string }>,
    isSoulbound: boolean = false
  ): Promise<{
    mint: string;
    metadata: string;
    transaction: string;
  }> {
    if (!this.wallet || !this.wallet.publicKey) {
      throw new Error('Wallet not connected');
    }

    if (!this.collectionAddress) {
      throw new Error('Collection not created. Please create collection first.');
    }

    try {
      console.log('Minting NFT as part of collection...');
      
      // Enhanced metadata with collection info
      const nftMetadata = {
        name: agentName,
        symbol: 'DMAGENT',
        description: agentDescription,
        image: agentImage,
        external_url: "https://decentramind.com",
        attributes: [
          ...agentAttributes,
          { trait_type: 'Collection', value: 'DecentraMind AI Agents' },
          { trait_type: 'Collection Address', value: this.collectionAddress },
          { trait_type: 'Soulbound', value: isSoulbound ? 'Yes' : 'No' },
          { trait_type: 'Mint Date', value: new Date().toISOString() }
        ],
        properties: {
          files: [
            {
              uri: agentImage,
              type: "image/png"
            }
          ],
          category: "image",
          creators: [
            {
              address: String(this.wallet.publicKey),
              verified: true,
              share: 100
            }
          ],
          collection: {
            name: "DecentraMind AI Agents",
            family: "AI Agents"
          }
        }
      };

      // Simulate metadata upload
      const metadataUri = `https://arweave.net/nft-metadata-${Date.now()}`;
      console.log('NFT metadata uploaded to:', metadataUri);

      // Generate mint address
      const mintAddress = `mint_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Simulate NFT creation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const transactionSignature = `tx_nft_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      console.log('Collection NFT minted successfully!');
      console.log('Mint address:', mintAddress);
      console.log('Transaction signature:', transactionSignature);

      return {
        mint: mintAddress,
        metadata: metadataUri,
        transaction: transactionSignature
      };

    } catch (error) {
      console.error('Failed to mint collection NFT:', error);
      throw new Error(`Failed to mint collection NFT: ${error.message}`);
    }
  }

  // Get collection address
  getCollectionAddress(): string | null {
    return this.collectionAddress;
  }

  // Check if collection exists
  hasCollection(): boolean {
    return this.collectionAddress !== null;
  }

  // Get collection info
  async getCollectionInfo(): Promise<{
    name: string;
    symbol: string;
    description: string;
    totalSupply: number;
    mintedCount: number;
  }> {
    if (!this.collectionAddress) {
      throw new Error('Collection not created');
    }

    // Simulate collection info retrieval
    return {
      name: "DecentraMind AI Agents",
      symbol: "DMAGENTS",
      description: "A collection of AI agents from DecentraMind Labs",
      totalSupply: 1000,
      mintedCount: 1 // This would be fetched from blockchain
    };
  }
}

// Export singleton instance
export const nftCollectionService = new NFTCollectionService();
