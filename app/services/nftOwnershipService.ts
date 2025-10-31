import { Connection, PublicKey } from '@solana/web3.js';
import { getAccount } from '@solana/spl-token';

export interface NFTMetadata {
  name: string;
  symbol: string;
  description: string;
  image: string;
  attributes?: Array<{
    trait_type: string;
    value: string;
  }>;
}

export interface NFTOwnership {
  mint: string;
  owner: string;
  tokenAccount: string;
  amount: number;
  metadata?: NFTMetadata;
}

// Contract addresses for role-based NFTs
export const ROLE_NFT_CONTRACTS = {
  CARE_ORCHESTRATOR_NFT: 'CareOrchestratorNFTContractAddress', // Replace with actual contract
  DMTX_DAO_TOKEN: 'DMTXDAOTokenContractAddress', // Replace with actual contract
  PATIENT_NFT: 'PatientNFTContractAddress', // Replace with actual contract
} as const;

// Role mapping based on NFT ownership
export const NFT_TO_ROLE_MAPPING = {
  [ROLE_NFT_CONTRACTS.CARE_ORCHESTRATOR_NFT]: 'provider',
  [ROLE_NFT_CONTRACTS.DMTX_DAO_TOKEN]: 'admin',
  [ROLE_NFT_CONTRACTS.PATIENT_NFT]: 'patient',
} as const;

export type UserRole = 'admin' | 'provider' | 'patient' | 'guest';

export class NFTOwnershipService {
  private connection: Connection;
  private rpcEndpoint: string;

  constructor(rpcEndpoint: string = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com') {
    this.rpcEndpoint = rpcEndpoint;
    this.connection = new Connection(rpcEndpoint, 'confirmed');
  }

  /**
   * Check if a wallet owns any NFTs from the specified contracts
   */
  async checkNFTOwnership(walletAddress: string, contractAddresses: string[]): Promise<NFTOwnership[]> {
    try {
      const publicKey = new PublicKey(walletAddress);
      const tokenAccounts = await this.connection.getParsedTokenAccountsByOwner(publicKey, {
        programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'), // SPL Token Program
      });

      const ownedNFTs: NFTOwnership[] = [];

      for (const tokenAccount of tokenAccounts.value) {
        const accountInfo = tokenAccount.account.data.parsed.info;
        const mint = accountInfo.mint;
        
        // Check if this NFT belongs to one of our role contracts
        if (contractAddresses.includes(mint)) {
          ownedNFTs.push({
            mint,
            owner: walletAddress,
            tokenAccount: tokenAccount.pubkey.toString(),
            amount: parseInt(accountInfo.tokenAmount.amount),
          });
        }
      }

      return ownedNFTs;
    } catch (error) {
      console.error('Error checking NFT ownership:', error);
      return [];
    }
  }

  /**
   * Determine user role based on NFT ownership
   */
  async getUserRoleFromNFTs(walletAddress: string): Promise<UserRole> {
    try {
      const contractAddresses = Object.values(ROLE_NFT_CONTRACTS);
      const ownedNFTs = await this.checkNFTOwnership(walletAddress, contractAddresses);

      // Check for admin role (highest priority)
      const adminNFT = ownedNFTs.find(nft => nft.mint === ROLE_NFT_CONTRACTS.DMTX_DAO_TOKEN);
      if (adminNFT && adminNFT.amount > 0) {
        return 'admin';
      }

      // Check for provider role
      const providerNFT = ownedNFTs.find(nft => nft.mint === ROLE_NFT_CONTRACTS.CARE_ORCHESTRATOR_NFT);
      if (providerNFT && providerNFT.amount > 0) {
        return 'provider';
      }

      // Check for patient role
      const patientNFT = ownedNFTs.find(nft => nft.mint === ROLE_NFT_CONTRACTS.PATIENT_NFT);
      if (patientNFT && patientNFT.amount > 0) {
        return 'patient';
      }

      return 'guest';
    } catch (error) {
      console.error('Error determining user role from NFTs:', error);
      return 'guest';
    }
  }

  /**
   * Get detailed NFT information including metadata
   */
  async getNFTMetadata(mintAddress: string): Promise<NFTMetadata | null> {
    try {
      // In a real implementation, you would fetch metadata from:
      // 1. Metaplex metadata program
      // 2. IPFS/Arweave for JSON metadata
      // 3. On-chain metadata accounts
      
      // For now, return mock metadata
      return {
        name: `NFT ${mintAddress.slice(0, 8)}`,
        symbol: 'DMT',
        description: 'DecentraMind Healthcare NFT',
        image: 'https://via.placeholder.com/300x300',
        attributes: [
          { trait_type: 'Role', value: 'Healthcare Provider' },
          { trait_type: 'Tier', value: 'Premium' }
        ]
      };
    } catch (error) {
      console.error('Error fetching NFT metadata:', error);
      return null;
    }
  }

  /**
   * Verify NFT ownership with additional validation
   */
  async verifyNFTOwnership(walletAddress: string, contractAddress: string): Promise<boolean> {
    try {
      const ownedNFTs = await this.checkNFTOwnership(walletAddress, [contractAddress]);
      return ownedNFTs.length > 0 && ownedNFTs[0].amount > 0;
    } catch (error) {
      console.error('Error verifying NFT ownership:', error);
      return false;
    }
  }

  /**
   * Get all NFTs owned by a wallet with role information
   */
  async getAllRoleNFTs(walletAddress: string): Promise<Array<NFTOwnership & { role: UserRole }>> {
    try {
      const contractAddresses = Object.values(ROLE_NFT_CONTRACTS);
      const ownedNFTs = await this.checkNFTOwnership(walletAddress, contractAddresses);

      return ownedNFTs.map(nft => ({
        ...nft,
        role: NFT_TO_ROLE_MAPPING[nft.mint as keyof typeof NFT_TO_ROLE_MAPPING] || 'guest'
      }));
    } catch (error) {
      console.error('Error getting all role NFTs:', error);
      return [];
    }
  }

  /**
   * Check if wallet has sufficient balance for a specific role
   */
  async hasRoleAccess(walletAddress: string, requiredRole: UserRole): Promise<boolean> {
    try {
      const userRole = await this.getUserRoleFromNFTs(walletAddress);
      
      // Role hierarchy: admin > provider > patient > guest
      const roleHierarchy = {
        guest: 0,
        patient: 1,
        provider: 2,
        admin: 3
      };

      return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
    } catch (error) {
      console.error('Error checking role access:', error);
      return false;
    }
  }
}

// Singleton instance
export const nftOwnershipService = new NFTOwnershipService();

// Utility functions
export const getRoleFromNFT = (nftMint: string): UserRole => {
  return NFT_TO_ROLE_MAPPING[nftMint as keyof typeof NFT_TO_ROLE_MAPPING] || 'guest';
};

export const getRequiredNFTsForRole = (role: UserRole): string[] => {
  switch (role) {
    case 'admin':
      return [ROLE_NFT_CONTRACTS.DMTX_DAO_TOKEN];
    case 'provider':
      return [ROLE_NFT_CONTRACTS.CARE_ORCHESTRATOR_NFT];
    case 'patient':
      return [ROLE_NFT_CONTRACTS.PATIENT_NFT];
    default:
      return [];
  }
};

export const validateWalletAddress = (address: string): boolean => {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
};
