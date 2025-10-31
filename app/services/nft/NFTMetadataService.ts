// NFT Metadata Service for DecentraMind
// Handles on-chain metadata updates for agent NFTs

import { Agent } from '../agentService';
import { EvolutionStage, VisualEffect, RarityLevel } from '../agent/AvatarEvolutionService';
import SolanaService from '../solanaService';

export interface NFTMetadata {
  name: string;
  symbol: string;
  description: string;
  image: string;
  external_url?: string;
  attributes: NFTAttribute[];
  properties?: {
    files?: Array<{
      uri: string;
      type: string;
    }>;
    category?: string;
    creators?: Array<{
      address: string;
      share: number;
    }>;
  };
}

export interface NFTAttribute {
  trait_type: string;
  value: string | number;
  display_type?: string;
  max_value?: number;
}

export interface MetadataUpdateResult {
  success: boolean;
  transactionSignature?: string;
  metadataUri?: string;
  error?: string;
}

export interface EvolutionMetadata {
  level: number;
  evolutionStage: string;
  rarity: string;
  visualEffects: string[];
  xp: number;
  tasksCompleted: number;
  successRate: number;
  lastEvolved: string;
}

class NFTMetadataService {
  private static instance: NFTMetadataService;
  private solanaService: typeof SolanaService;

  constructor() {
    this.solanaService = SolanaService;
  }

  static getInstance(): NFTMetadataService {
    if (!NFTMetadataService.instance) {
      NFTMetadataService.instance = new NFTMetadataService();
    }
    return NFTMetadataService.instance;
  }

  /**
   * Update NFT metadata on-chain with evolution data
   */
  async updateNFTMetadata(
    agentId: string,
    agent: Agent,
    evolutionStage: EvolutionStage,
    visualEffects: VisualEffect[],
    rarity: RarityLevel
  ): Promise<MetadataUpdateResult> {
    try {
      console.log(`Updating NFT metadata for agent ${agentId}`);
      
      // Generate metadata
      const metadata = this.generateEvolutionMetadata(
        agent,
        evolutionStage,
        visualEffects,
        rarity
      );
      
      // Upload metadata to IPFS or centralized storage
      const metadataUri = await this.uploadMetadata(metadata);
      
      // Update on-chain NFT metadata
      // TODO: Implement actual Solana NFT metadata update
      const transactionSignature = await this.updateNFTMetadataOnChain(
        agentId,
        metadataUri
      );
      
      console.log(`NFT metadata updated successfully: ${transactionSignature}`);
      
      return {
        success: true,
        transactionSignature,
        metadataUri
      };
    } catch (error) {
      console.error('Failed to update NFT metadata:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Generate comprehensive metadata for evolved agent
   */
  private generateEvolutionMetadata(
    agent: Agent,
    evolutionStage: EvolutionStage,
    visualEffects: VisualEffect[],
    rarity: RarityLevel
  ): NFTMetadata {
    const evolutionMetadata: EvolutionMetadata = {
      level: agent.level,
      evolutionStage: evolutionStage.name,
      rarity: rarity.name,
      visualEffects: visualEffects.map(effect => effect.type),
      xp: agent.xp,
      tasksCompleted: agent.performance.tasksCompleted,
      successRate: agent.performance.successRate,
      lastEvolved: new Date().toISOString()
    };

    return {
      name: `${agent.name} - ${evolutionStage.name}`,
      symbol: 'DMT',
      description: this.generateDescription(agent, evolutionStage, rarity),
      image: agent.avatar || '/avatars/default-agent.png',
      external_url: `https://decentramind.com/agents/${agent.id}`,
      attributes: this.generateAttributes(agent, evolutionStage, visualEffects, rarity, evolutionMetadata),
      properties: {
        files: [
          {
            uri: agent.avatar || '/avatars/default-agent.png',
            type: 'image/png'
          }
        ],
        category: 'image',
        creators: [
          {
            address: agent.owner,
            share: 100
          }
        ]
      }
    };
  }

  /**
   * Generate dynamic description based on agent evolution
   */
  private generateDescription(
    agent: Agent,
    evolutionStage: EvolutionStage,
    rarity: RarityLevel
  ): string {
    const baseDescription = `${agent.name} is a ${agent.domain} specialist AI agent`;
    const evolutionDescription = `evolved to ${evolutionStage.name} level with ${rarity.name} rarity`;
    const performanceDescription = `achieving ${agent.performance.successRate}% success rate`;
    const taskDescription = `completing ${agent.performance.tasksCompleted} tasks`;
    
    return `${baseDescription}, ${evolutionDescription}, ${performanceDescription} and ${taskDescription}. ${evolutionStage.description}`;
  }

  /**
   * Generate NFT attributes for metadata
   */
  private generateAttributes(
    agent: Agent,
    evolutionStage: EvolutionStage,
    visualEffects: VisualEffect[],
    rarity: RarityLevel,
    evolutionMetadata: EvolutionMetadata
  ): NFTAttribute[] {
    const attributes: NFTAttribute[] = [
      // Core agent attributes
      {
        trait_type: 'Agent Name',
        value: agent.name
      },
      {
        trait_type: 'Domain',
        value: agent.domain
      },
      {
        trait_type: 'Personality',
        value: agent.personality
      },
      {
        trait_type: 'Type',
        value: agent.type || 'sub'
      },
      
      // Evolution attributes
      {
        trait_type: 'Level',
        value: agent.level,
        display_type: 'number',
        max_value: 20
      },
      {
        trait_type: 'Evolution Stage',
        value: evolutionStage.name
      },
      {
        trait_type: 'Rarity',
        value: rarity.name
      },
      {
        trait_type: 'Rarity Multiplier',
        value: rarity.multiplier,
        display_type: 'number'
      },
      
      // Performance attributes
      {
        trait_type: 'XP',
        value: agent.xp,
        display_type: 'number'
      },
      {
        trait_type: 'Tasks Completed',
        value: agent.performance.tasksCompleted,
        display_type: 'number'
      },
      {
        trait_type: 'Success Rate',
        value: agent.performance.successRate,
        display_type: 'number',
        max_value: 100
      },
      {
        trait_type: 'Total Earnings',
        value: agent.performance.totalEarnings,
        display_type: 'number'
      },
      
      // Visual effects attributes
      {
        trait_type: 'Visual Effects',
        value: visualEffects.length,
        display_type: 'number'
      },
      {
        trait_type: 'Has Glow',
        value: visualEffects.some(e => e.type === 'glow') ? 'Yes' : 'No'
      },
      {
        trait_type: 'Has Particles',
        value: visualEffects.some(e => e.type === 'particles') ? 'Yes' : 'No'
      },
      {
        trait_type: 'Has Aura',
        value: visualEffects.some(e => e.type === 'aura') ? 'Yes' : 'No'
      },
      {
        trait_type: 'Is Legendary',
        value: visualEffects.some(e => e.type === 'legendary') ? 'Yes' : 'No'
      },
      
      // Technical attributes
      {
        trait_type: 'LLM Model',
        value: agent.llmConfig?.model || 'GPT-3.5'
      },
      {
        trait_type: 'LLM Version',
        value: agent.llmConfig?.version || 'latest'
      },
      {
        trait_type: 'Vector DB',
        value: agent.ragConfig?.vectorDB || 'pinecone'
      },
      {
        trait_type: 'Knowledge Base Size',
        value: agent.ragConfig?.knowledgeBase?.length || 0,
        display_type: 'number'
      },
      
      // Timestamp attributes
      {
        trait_type: 'Mint Date',
        value: agent.mintDate
      },
      {
        trait_type: 'Last Evolved',
        value: evolutionMetadata.lastEvolved
      },
      {
        trait_type: 'Last Updated',
        value: agent.metadata?.lastUpdated || new Date().toISOString()
      }
    ];

    // Add individual stats if available
    if (agent.individualStats) {
      attributes.push(
        {
          trait_type: 'Total Upgrades',
          value: agent.individualStats.totalUpgrades,
          display_type: 'number'
        },
        {
          trait_type: 'Total DMT Spent',
          value: agent.individualStats.totalDmtSpent,
          display_type: 'number'
        },
        {
          trait_type: 'Unique Conversations',
          value: agent.individualStats.uniqueConversations,
          display_type: 'number'
        },
        {
          trait_type: 'Domain Expertise',
          value: agent.individualStats.domainExpertise,
          display_type: 'number',
          max_value: 100
        }
      );
    }

    // Add evolution history count
    if (agent.evolutionHistory) {
      attributes.push({
        trait_type: 'Evolution Events',
        value: agent.evolutionHistory.length,
        display_type: 'number'
      });
    }

    return attributes;
  }

  /**
   * Upload metadata to IPFS or centralized storage
   */
  private async uploadMetadata(metadata: NFTMetadata): Promise<string> {
    try {
      // For now, return a placeholder URI
      // In production, this would upload to IPFS or centralized storage
      const metadataJson = JSON.stringify(metadata, null, 2);
      const hash = this.generateHash(metadataJson);
      
      console.log('Uploading metadata:', metadataJson);
      console.log('Generated hash:', hash);
      
      // TODO: Implement actual IPFS upload
      // This would involve:
      // 1. Uploading metadata JSON to IPFS
      // 2. Returning IPFS URI (e.g., ipfs://Qm...)
      
      return `https://decentramind.com/metadata/${hash}`;
    } catch (error) {
      console.error('Failed to upload metadata:', error);
      throw error;
    }
  }

  /**
   * Generate hash for metadata
   */
  private generateHash(data: string): string {
    // Simple hash generation for demo purposes
    // In production, use proper cryptographic hash
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  /**
   * Get current NFT metadata for agent
   */
  async getCurrentMetadata(agentId: string): Promise<NFTMetadata | null> {
    try {
      // This would fetch current metadata from blockchain
      // For now, return null as placeholder
      console.log(`Fetching current metadata for agent ${agentId}`);
      return null;
    } catch (error) {
      console.error('Failed to get current metadata:', error);
      return null;
    }
  }

  /**
   * Validate metadata before update
   */
  validateMetadata(metadata: NFTMetadata): boolean {
    try {
      // Check required fields
      if (!metadata.name || !metadata.description || !metadata.image) {
        return false;
      }
      
      // Check attributes format
      if (!Array.isArray(metadata.attributes)) {
        return false;
      }
      
      // Validate each attribute
      for (const attr of metadata.attributes) {
        if (!attr.trait_type || attr.value === undefined) {
          return false;
        }
      }
      
      return true;
    } catch (error) {
      console.error('Metadata validation failed:', error);
      return false;
    }
  }

  /**
   * Get metadata template for agent type
   */
  getMetadataTemplate(agentType: 'master' | 'sub'): Partial<NFTMetadata> {
    const baseTemplate = {
      symbol: 'DMT',
      properties: {
        category: 'image',
        files: [
          {
            uri: '',
            type: 'image/png'
          }
        ]
      }
    };

    if (agentType === 'master') {
      return {
        ...baseTemplate,
        description: 'A master AI agent capable of coordinating sub-agents and complex task management'
      };
    } else {
      return {
        ...baseTemplate,
        description: 'A specialized AI agent with domain-specific capabilities'
      };
    }
  }

  /**
   * Calculate metadata size
   */
  calculateMetadataSize(metadata: NFTMetadata): number {
    const jsonString = JSON.stringify(metadata);
    return new Blob([jsonString]).size;
  }

  /**
   * Compress metadata if needed
   */
  async compressMetadata(metadata: NFTMetadata): Promise<NFTMetadata> {
    // For now, return as-is
    // In production, implement compression if metadata is too large
    return metadata;
  }

  /**
   * Get metadata update history
   */
  async getMetadataUpdateHistory(agentId: string): Promise<Array<{
    timestamp: string;
    transactionSignature: string;
    metadataUri: string;
    changes: string[];
  }>> {
    try {
      // This would fetch update history from blockchain or database
      console.log(`Fetching metadata update history for agent ${agentId}`);
      return [];
    } catch (error) {
      console.error('Failed to get metadata update history:', error);
      return [];
    }
  }

  /**
   * Placeholder method for updating NFT metadata on-chain
   * TODO: Implement actual Solana NFT metadata update
   */
  private async updateNFTMetadataOnChain(agentId: string, metadataUri: string): Promise<string> {
    try {
      console.log(`Updating NFT metadata on-chain for agent ${agentId}: ${metadataUri}`);
      
      // Placeholder implementation
      // In production, this would:
      // 1. Connect to Solana program
      // 2. Update NFT metadata URI
      // 3. Return transaction signature
      
      const mockSignature = `mock_tx_${agentId}_${Date.now()}`;
      return mockSignature;
    } catch (error) {
      console.error('Failed to update NFT metadata on-chain:', error);
      throw error;
    }
  }
}

export default NFTMetadataService.getInstance();
