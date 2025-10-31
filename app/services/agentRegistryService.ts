// Agent Registry Service for DecentraMind
import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc,
  doc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  setDoc,
  serverTimestamp,
  increment
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Agent } from './agentService';
import { useAuth } from '../hooks/useAuth';

// Agent Registry Interfaces
export interface AgentMetadata {
  id: string;
  agentId: string;
  creator: string;
  name: string;
  domain: string;
  description: string;
  tags: string[];
  skills: string[];
  level: number;
  xp: number;
  rating: number;
  reviewCount: number;
  downloads: number;
  views: number;
  verified: boolean;
  featured: boolean;
  lastUpdated: string;
  createdAt: string;
  evolutionHistory: {
    timestamp: string;
    previousLevel: number;
    newLevel: number;
    dmtSpent: number;
    reason: string;
  }[];
  performance: {
    tasksCompleted: number;
    successRate: number;
    averageResponseTime: number;
    totalEarnings: number;
  };
}

export interface AgentRating {
  id: string;
  agentId: string;
  userId: string;
  userWallet: string;
  rating: number;
  review: string;
  timestamp: string;
  helpful: number;
  reported: boolean;
}

export interface AgentListing {
  id: string;
  agentId: string;
  seller: string;
  price: number;
  currency: 'DMT' | 'SOL';
  status: 'active' | 'sold' | 'cancelled' | 'pending';
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
  description?: string;
  terms?: string;
}

export interface AgentSearchFilters {
  domain?: string;
  minLevel?: number;
  maxLevel?: number;
  minRating?: number;
  skills?: string[];
  creator?: string;
  verified?: boolean;
  featured?: boolean;
  priceRange?: {
    min: number;
    max: number;
  };
  sortBy?: 'rating' | 'level' | 'price' | 'created' | 'updated';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
}

export interface AgentSearchResult {
  agents: AgentMetadata[];
  total: number;
  hasMore: boolean;
  filters: AgentSearchFilters;
}

class AgentRegistryService {
  private static instance: AgentRegistryService;
  private metadata: Map<string, AgentMetadata> = new Map();
  private ratings: Map<string, AgentRating[]> = new Map();
  private listings: Map<string, AgentListing[]> = new Map();

  static getInstance(): AgentRegistryService {
    if (!AgentRegistryService.instance) {
      AgentRegistryService.instance = new AgentRegistryService();
    }
    return AgentRegistryService.instance;
  }

  // Agent Discovery System
  async searchAgents(filters: AgentSearchFilters = {}): Promise<AgentSearchResult> {
    try {
      console.log('Searching agents with filters:', filters);
      
      let q = collection(db, 'agent_metadata');
      const constraints = [];

      // Apply filters
      if (filters.domain) {
        constraints.push(where('domain', '==', filters.domain));
      }
      
      if (filters.minLevel !== undefined) {
        constraints.push(where('level', '>=', filters.minLevel));
      }
      
      if (filters.maxLevel !== undefined) {
        constraints.push(where('level', '<=', filters.maxLevel));
      }
      
      if (filters.minRating !== undefined) {
        constraints.push(where('rating', '>=', filters.minRating));
      }
      
      if (filters.creator) {
        constraints.push(where('creator', '==', filters.creator));
      }
      
      if (filters.verified !== undefined) {
        constraints.push(where('verified', '==', filters.verified));
      }
      
      if (filters.featured !== undefined) {
        constraints.push(where('featured', '==', filters.featured));
      }

      // Apply sorting
      const sortBy = filters.sortBy || 'created';
      const sortOrder = filters.sortOrder || 'desc';
      constraints.push(orderBy(sortBy, sortOrder));

      // Apply limit
      const limitCount = filters.limit || 50;
      constraints.push(limit(limitCount));

      // Execute query
      const querySnapshot = await getDocs(query(q, ...constraints));
      const agents: AgentMetadata[] = [];

      // First, collect all agents
      const allAgents: AgentMetadata[] = [];
      querySnapshot.forEach((doc) => {
        const agent = { id: doc.id, ...doc.data() } as AgentMetadata;
        allAgents.push(agent);
      });

      // Then apply async filters
      for (const agent of allAgents) {
        // Apply additional filters that can't be done in Firestore
        if (filters.skills && filters.skills.length > 0) {
          const hasRequiredSkills = filters.skills.every(skill => 
            agent.skills.includes(skill)
          );
          if (!hasRequiredSkills) continue;
        }
        
        if (filters.priceRange) {
          // Check if agent is listed and price is in range
          const listing = await this.getActiveListing(agent.agentId);
          if (listing) {
            if (listing.price < filters.priceRange!.min || listing.price > filters.priceRange!.max) {
              continue;
            }
          }
        }
        
        agents.push(agent);
      }

      return {
        agents,
        total: agents.length,
        hasMore: agents.length === limitCount,
        filters
      };

    } catch (error) {
      console.error('Failed to search agents:', error);
      throw new Error('Failed to search agents');
    }
  }

  // Agent Metadata Management
  async registerAgent(agent: Agent, metadata: Omit<AgentMetadata, 'id' | 'agentId' | 'createdAt' | 'lastUpdated'>): Promise<string> {
    try {
      console.log('Registering agent:', agent.id, metadata.name);

      const agentMetadata: AgentMetadata = {
        id: `metadata_${Date.now()}`,
        agentId: agent.id!,
        ...metadata,
        rating: 0,
        reviewCount: 0,
        downloads: 0,
        views: 0,
        verified: false,
        featured: false,
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        evolutionHistory: agent.evolutionHistory || [],
        performance: agent.performance || {
          tasksCompleted: 0,
          successRate: 100,
          averageResponseTime: 0,
          totalEarnings: 0
        }
      };

      // Add to Firestore
      const docRef = await addDoc(collection(db, 'agent_metadata'), agentMetadata);
      
      // Add to local cache
      this.metadata.set(agent.id!, agentMetadata);

      console.log('Agent registered successfully with ID:', docRef.id);
      return docRef.id;

    } catch (error) {
      console.error('Failed to register agent:', error);
      throw new Error('Failed to register agent');
    }
  }

  async getAgentMetadata(agentId: string): Promise<AgentMetadata | null> {
    try {
      // Check local cache first
      if (this.metadata.has(agentId)) {
        return this.metadata.get(agentId)!;
      }

      // Query Firestore
      const docRef = doc(db, 'agent_metadata', agentId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const metadata = { id: docSnap.id, ...docSnap.data() } as AgentMetadata;
        this.metadata.set(agentId, metadata);
        return metadata;
      }

      return null;

    } catch (error) {
      console.error('Failed to get agent metadata:', error);
      return null;
    }
  }

  async updateAgentMetadata(agentId: string, updates: Partial<AgentMetadata>): Promise<boolean> {
    try {
      console.log('Updating agent metadata:', agentId, updates);

      const docRef = doc(db, 'agent_metadata', agentId);
      await updateDoc(docRef, {
        ...updates,
        lastUpdated: new Date().toISOString()
      });

      // Update local cache
      const existing = this.metadata.get(agentId);
      if (existing) {
        this.metadata.set(agentId, { ...existing, ...updates });
      }

      return true;

    } catch (error) {
      console.error('Failed to update agent metadata:', error);
      return false;
    }
  }

  // Agent Rating System
  async rateAgent(agentId: string, userId: string, userWallet: string, rating: number, review: string): Promise<boolean> {
    try {
      console.log('Rating agent:', agentId, 'by user:', userWallet, 'rating:', rating);

      // Check if user already rated this agent
      const existingRating = await this.getUserRating(agentId, userWallet);
      if (existingRating) {
        throw new Error('User has already rated this agent');
      }

      // Validate rating
      if (rating < 1 || rating > 5) {
        throw new Error('Rating must be between 1 and 5');
      }

      if (review.length < 10) {
        throw new Error('Review must be at least 10 characters long');
      }

      const agentRating: AgentRating = {
        id: `rating_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        agentId,
        userId,
        userWallet,
        rating,
        review,
        timestamp: new Date().toISOString(),
        helpful: 0,
        reported: false
      };

      // Add to Firestore
      await addDoc(collection(db, 'agent_ratings'), agentRating);

      // Add to local cache
      if (!this.ratings.has(agentId)) {
        this.ratings.set(agentId, []);
      }
      this.ratings.get(agentId)!.push(agentRating);

      // Update agent metadata
      await this.updateAgentRating(agentId);

      return true;

    } catch (error) {
      console.error('Failed to rate agent:', error);
      throw error;
    }
  }

  async getUserRating(agentId: string, userWallet: string): Promise<AgentRating | null> {
    try {
      const q = query(
        collection(db, 'agent_ratings'),
        where('agentId', '==', agentId),
        where('userWallet', '==', userWallet)
      );
      
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return { id: doc.id, ...doc.data() } as AgentRating;
      }
      
      return null;

    } catch (error) {
      console.error('Failed to get user rating:', error);
      return null;
    }
  }

  async getAgentRatings(agentId: string): Promise<AgentRating[]> {
    try {
      const q = query(
        collection(db, 'agent_ratings'),
        where('agentId', '==', agentId),
        orderBy('timestamp', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const ratings: AgentRating[] = [];
      
      querySnapshot.forEach((doc) => {
        ratings.push({ id: doc.id, ...doc.data() } as AgentRating);
      });
      
      return ratings;

    } catch (error) {
      console.error('Failed to get agent ratings:', error);
      return [];
    }
  }

  private async updateAgentRating(agentId: string): Promise<void> {
    try {
      const ratings = await this.getAgentRatings(agentId);
      
      if (ratings.length === 0) return;

      const totalRating = ratings.reduce((sum, rating) => sum + rating.rating, 0);
      const averageRating = totalRating / ratings.length;

      await this.updateAgentMetadata(agentId, {
        rating: averageRating,
        reviewCount: ratings.length
      });

    } catch (error) {
      console.error('Failed to update agent rating:', error);
    }
  }

  // Agent Marketplace Foundation
  async createListing(agentId: string, seller: string, price: number, currency: 'DMT' | 'SOL' = 'DMT', description?: string): Promise<string> {
    try {
      console.log('Creating listing for agent:', agentId, 'price:', price, currency);

      // Check if agent is already listed
      const existingListing = await this.getActiveListing(agentId);
      if (existingListing) {
        throw new Error('Agent is already listed for sale');
      }

      const listing: AgentListing = {
        id: `listing_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        agentId,
        seller,
        price,
        currency,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        description,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
      };

      // Add to Firestore
      const docRef = await addDoc(collection(db, 'agent_listings'), listing);

      // Add to local cache
      if (!this.listings.has(agentId)) {
        this.listings.set(agentId, []);
      }
      this.listings.get(agentId)!.push(listing);

      return docRef.id;

    } catch (error) {
      console.error('Failed to create listing:', error);
      throw error;
    }
  }

  async getActiveListing(agentId: string): Promise<AgentListing | null> {
    try {
      const q = query(
        collection(db, 'agent_listings'),
        where('agentId', '==', agentId),
        where('status', '==', 'active')
      );
      
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return { id: doc.id, ...doc.data() } as AgentListing;
      }
      
      return null;

    } catch (error) {
      console.error('Failed to get active listing:', error);
      return null;
    }
  }

  async cancelListing(listingId: string, seller: string): Promise<boolean> {
    try {
      console.log('Cancelling listing:', listingId);

      const docRef = doc(db, 'agent_listings', listingId);
      await updateDoc(docRef, {
        status: 'cancelled',
        updatedAt: new Date().toISOString()
      });

      return true;

    } catch (error) {
      console.error('Failed to cancel listing:', error);
      return false;
    }
  }

  async purchaseAgent(listingId: string, buyer: string): Promise<boolean> {
    try {
      console.log('Purchasing agent from listing:', listingId, 'buyer:', buyer);

      // Get listing
      const docRef = doc(db, 'agent_listings', listingId);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        throw new Error('Listing not found');
      }

      const listing = { id: docSnap.id, ...docSnap.data() } as AgentListing;
      
      if (listing.status !== 'active') {
        throw new Error('Listing is not active');
      }

      // Update listing status
      await updateDoc(docRef, {
        status: 'sold',
        updatedAt: new Date().toISOString()
      });

      // TODO: Implement actual payment processing
      console.log('Payment processed for listing:', listingId);

      // TODO: Transfer agent ownership
      console.log('Agent ownership transferred to:', buyer);

      return true;

    } catch (error) {
      console.error('Failed to purchase agent:', error);
      throw error;
    }
  }

  // Utility Methods
  async getFeaturedAgents(): Promise<AgentMetadata[]> {
    try {
      const q = query(
        collection(db, 'agent_metadata'),
        where('featured', '==', true),
        orderBy('rating', 'desc'),
        limit(10)
      );
      
      const querySnapshot = await getDocs(q);
      const agents: AgentMetadata[] = [];
      
      querySnapshot.forEach((doc) => {
        agents.push({ id: doc.id, ...doc.data() } as AgentMetadata);
      });
      
      return agents;

    } catch (error) {
      console.error('Failed to get featured agents:', error);
      return [];
    }
  }

  async getPopularAgents(): Promise<AgentMetadata[]> {
    try {
      const q = query(
        collection(db, 'agent_metadata'),
        orderBy('views', 'desc'),
        limit(10)
      );
      
      const querySnapshot = await getDocs(q);
      const agents: AgentMetadata[] = [];
      
      querySnapshot.forEach((doc) => {
        agents.push({ id: doc.id, ...doc.data() } as AgentMetadata);
      });
      
      return agents;

    } catch (error) {
      console.error('Failed to get popular agents:', error);
      return [];
    }
  }

  async incrementViews(agentId: string): Promise<void> {
    try {
      const docRef = doc(db, 'agent_metadata', agentId);
      await updateDoc(docRef, {
        views: increment(1)
      });
    } catch (error) {
      console.error('Failed to increment views:', error);
    }
  }

  async incrementDownloads(agentId: string): Promise<void> {
    try {
      const docRef = doc(db, 'agent_metadata', agentId);
      await updateDoc(docRef, {
        downloads: increment(1)
      });
    } catch (error) {
      console.error('Failed to increment downloads:', error);
    }
  }
}

// Export singleton instance
export const agentRegistryService = AgentRegistryService.getInstance(); 