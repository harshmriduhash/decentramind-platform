// Burning Service for DecentraMind
import { 
  getFirestore, 
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
  setDoc
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import app, { auth as firebaseAuth, firestore } from '../lib/firebase';
import { errorHandler } from '../lib/errorHandler';

// Add validation functions directly to avoid import issues
const validateBurnRequest = (burnRequest: any) => {
  if (!burnRequest.amount || burnRequest.amount <= 0) {
    return { success: false, error: 'Invalid burn amount' };
  }
  if (!burnRequest.source || !['minting', 'subscription', 'upgrade', 'marketplace', 'dao'].includes(burnRequest.source)) {
    return { success: false, error: 'Invalid burn source' };
  }
  if (!burnRequest.userId) {
    return { success: false, error: 'User ID is required' };
  }
  return { success: true };
};

const isValidWalletAddress = (address: string): boolean => {
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
};

// Use centralized Firebase configuration
const db = firestore;
const auth = firebaseAuth;

export interface BurnRequest {
  amount: number;
  source: 'minting' | 'subscription' | 'upgrade' | 'marketplace' | 'dao';
  userId: string;
  agentId?: string;
  subscriptionTier?: string;
  transactionHash?: string;
  metadata?: any;
}

export interface BurnResult {
  success: boolean;
  burnedAmount: number;
  transactionHash?: string;
  error?: string;
}

export interface BurningMetrics {
  totalBurned: number;
  mintingBurned: number;
  subscriptionBurned: number;
  upgradeBurned: number;
  marketplaceBurned: number;
  daoBurned: number;
  lastBurnDate: string;
  burnRate: number;
  dailyBurnRate: number;
  monthlyBurnRate: number;
}

export interface BurnEvent {
  id?: string;
  amount: number;
  source: string;
  userId: string;
  agentId?: string;
  subscriptionTier?: string;
  transactionHash?: string;
  timestamp: string;
  metadata?: any;
}

class BurningService {
  private static instance: BurningService;
  private burnEvents: BurnEvent[] = [];

  // Burning rates configuration
  private burningRates = {
    minting: 0.30, // 30% of minting fees burned
    subscription: 0.20, // 20% of subscription fees burned
    upgrade: 0.15, // 15% of upgrade fees burned
    marketplace: 0.20, // 20% of marketplace fees burned
    dao: 0.10 // 10% of DAO treasury burns
  };

  static getInstance(): BurningService {
    if (!BurningService.instance) {
      BurningService.instance = new BurningService();
    }
    return BurningService.instance;
  }

  async initialize(): Promise<void> {
    try {
      console.log('Initializing burning service...');
      
      // Load burning data from Firebase
      if (db) {
        console.log('Firebase connected for burning data');
      }
    } catch (error) {
      console.error('Failed to initialize burning service:', error);
    }
  }

  // Burn DMT tokens
  async burnDMT(burnRequest: BurnRequest): Promise<BurnResult> {
    try {
      // Validate input
      const validation = validateBurnRequest(burnRequest);
      if (!validation.success) {
        return { 
          success: false, 
          error: validation.error,
          burnedAmount: 0
        };
      }

      // Validate wallet address
      if (!isValidWalletAddress(burnRequest.userId)) {
        return { 
          success: false, 
          error: 'Invalid wallet address format',
          burnedAmount: 0
        };
      }

      const { amount, source, userId, agentId, subscriptionTier, transactionHash, metadata } = burnRequest;

      // Calculate burning rate based on source
      const burningRate = this.burningRates[source] || 0;
      const burnedAmount = amount * burningRate;

      if (burnedAmount <= 0) {
        return {
          success: true,
          burnedAmount: 0
        };
      }

      // Create burn event
      const burnEvent: Omit<BurnEvent, 'id'> = {
        amount: burnedAmount,
        source,
        userId,
        agentId,
        subscriptionTier,
        transactionHash,
        timestamp: new Date().toISOString(),
        metadata
      };

      let burnEventId: string | undefined;

      if (db) {
        // Try to save to Firebase
        try {
          const docRef = await addDoc(collection(db, 'burnEvents'), burnEvent);
          burnEventId = docRef.id;
          
          // Add to local cache
          const burnEventWithId = { ...burnEvent, id: burnEventId };
          this.burnEvents.push(burnEventWithId);
          
          console.log('Burn event saved to Firebase:', burnEventId);
        } catch (firebaseError) {
          console.log('Firebase burn event save failed, using local cache:', firebaseError);
          // Fall through to local implementation
        }
      }

      // Local implementation for development or when Firebase fails
      if (!burnEventId) {
        burnEventId = `local-burn-${Date.now()}`;
        const burnEventWithId = { ...burnEvent, id: burnEventId };
        this.burnEvents.push(burnEventWithId);
      }

      // Track burning metrics
      await this.updateBurningMetrics({
        amount: burnedAmount,
        source,
        userId,
        timestamp: new Date().toISOString()
      });

      console.log('DMT burned successfully:', {
        amount: burnedAmount,
        source,
        userId,
        transactionHash
      });

      return {
        success: true,
        burnedAmount,
        transactionHash
      };
    } catch (error) {
      console.error('Failed to burn DMT:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        burnedAmount: 0
      };
    }
  }

  // Burn tokens from minting
  async burnMintingFee(userId: string, mintingFee: number, agentId?: string): Promise<BurnResult> {
    return this.burnDMT({
      amount: mintingFee,
      source: 'minting',
      userId,
      agentId,
      metadata: {
        burnType: 'minting_fee',
        originalFee: mintingFee
      }
    });
  }

  // Burn tokens from subscription
  async burnSubscriptionFee(userId: string, subscriptionFee: number, tier?: string): Promise<BurnResult> {
    return this.burnDMT({
      amount: subscriptionFee,
      source: 'subscription',
      userId,
      subscriptionTier: tier,
      metadata: {
        burnType: 'subscription_fee',
        originalFee: subscriptionFee,
        tier
      }
    });
  }

  // Burn tokens from agent upgrade
  async burnUpgradeFee(userId: string, upgradeFee: number, agentId?: string): Promise<BurnResult> {
    return this.burnDMT({
      amount: upgradeFee,
      source: 'upgrade',
      userId,
      agentId,
      metadata: {
        burnType: 'upgrade_fee',
        originalFee: upgradeFee
      }
    });
  }

  // Burn tokens from marketplace
  async burnMarketplaceFee(userId: string, marketplaceFee: number, agentId?: string): Promise<BurnResult> {
    return this.burnDMT({
      amount: marketplaceFee,
      source: 'marketplace',
      userId,
      agentId,
      metadata: {
        burnType: 'marketplace_fee',
        originalFee: marketplaceFee
      }
    });
  }

  // Burn tokens from DAO treasury
  async burnDAOTreasury(amount: number, proposalId?: string): Promise<BurnResult> {
    return this.burnDMT({
      amount,
      source: 'dao',
      userId: 'dao-treasury',
      metadata: {
        burnType: 'dao_treasury',
        proposalId
      }
    });
  }

  // Get burning metrics
  async getBurningMetrics(): Promise<BurningMetrics> {
    try {
      const burnEvents = await this.getAllBurnEvents();
      
      const totalBurned = burnEvents.reduce((sum, event) => sum + event.amount, 0);
      const mintingBurned = burnEvents
        .filter(event => event.source === 'minting')
        .reduce((sum, event) => sum + event.amount, 0);
      const subscriptionBurned = burnEvents
        .filter(event => event.source === 'subscription')
        .reduce((sum, event) => sum + event.amount, 0);
      const upgradeBurned = burnEvents
        .filter(event => event.source === 'upgrade')
        .reduce((sum, event) => sum + event.amount, 0);
      const marketplaceBurned = burnEvents
        .filter(event => event.source === 'marketplace')
        .reduce((sum, event) => sum + event.amount, 0);
      const daoBurned = burnEvents
        .filter(event => event.source === 'dao')
        .reduce((sum, event) => sum + event.amount, 0);

      const lastBurnDate = burnEvents.length > 0 
        ? burnEvents[0].timestamp 
        : new Date().toISOString();

      // Calculate burn rates
      const now = new Date();
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const dailyBurns = burnEvents.filter(event => 
        new Date(event.timestamp) > oneDayAgo
      );
      const monthlyBurns = burnEvents.filter(event => 
        new Date(event.timestamp) > oneMonthAgo
      );

      const dailyBurnRate = dailyBurns.reduce((sum, event) => sum + event.amount, 0);
      const monthlyBurnRate = monthlyBurns.reduce((sum, event) => sum + event.amount, 0);

      // Calculate overall burn rate (percentage of total supply)
      const totalSupply = 1000000000; // 1 billion DMT
      const burnRate = (totalBurned / totalSupply) * 100;

      return {
        totalBurned,
        mintingBurned,
        subscriptionBurned,
        upgradeBurned,
        marketplaceBurned,
        daoBurned,
        lastBurnDate,
        burnRate,
        dailyBurnRate,
        monthlyBurnRate
      };
    } catch (error) {
      console.error('Failed to get burning metrics:', error);
      return {
        totalBurned: 0,
        mintingBurned: 0,
        subscriptionBurned: 0,
        upgradeBurned: 0,
        marketplaceBurned: 0,
        daoBurned: 0,
        lastBurnDate: new Date().toISOString(),
        burnRate: 0,
        dailyBurnRate: 0,
        monthlyBurnRate: 0
      };
    }
  }

  // Get all burn events
  async getAllBurnEvents(): Promise<BurnEvent[]> {
    try {
      if (db) {
        // Try to get from Firebase
        try {
          const burnEventsRef = collection(db, 'burnEvents');
          const q = query(burnEventsRef, orderBy('timestamp', 'desc'));
          
          const querySnapshot = await getDocs(q);
          const burnEvents: BurnEvent[] = [];
          
          querySnapshot.forEach((doc) => {
            burnEvents.push({ id: doc.id, ...doc.data() } as BurnEvent);
          });

          // Update local cache
          this.burnEvents = [...this.burnEvents, ...burnEvents];
          
          return burnEvents;
        } catch (firebaseError) {
          console.log('Firebase burn events retrieval failed, using local cache:', firebaseError);
        }
      }

      return this.burnEvents;
    } catch (error) {
      console.error('Failed to get all burn events:', error);
      return this.burnEvents;
    }
  }

  // Get burn events by user
  async getUserBurnEvents(userId: string): Promise<BurnEvent[]> {
    try {
      const allEvents = await this.getAllBurnEvents();
      return allEvents.filter(event => event.userId === userId);
    } catch (error) {
      console.error('Failed to get user burn events:', error);
      return [];
    }
  }

  // Get burn events by source
  async getBurnEventsBySource(source: string): Promise<BurnEvent[]> {
    try {
      const allEvents = await this.getAllBurnEvents();
      return allEvents.filter(event => event.source === source);
    } catch (error) {
      console.error('Failed to get burn events by source:', error);
      return [];
    }
  }

  // Calculate total burned by source
  async getTotalBurnedBySource(source: string): Promise<number> {
    try {
      const events = await this.getBurnEventsBySource(source);
      return events.reduce((sum, event) => sum + event.amount, 0);
    } catch (error) {
      console.error('Failed to get total burned by source:', error);
      return 0;
    }
  }

  // Update burning metrics
  private async updateBurningMetrics(metrics: {
    amount: number;
    source: string;
    userId: string;
    timestamp: string;
  }): Promise<void> {
    try {
      if (db) {
        const metricsRef = collection(db, 'burningMetrics');
        await addDoc(metricsRef, {
          ...metrics,
          transactionType: 'burn_event'
        });
      }

      console.log('Burning metrics updated:', metrics);
    } catch (error) {
      console.error('Failed to update burning metrics:', error);
    }
  }

  // Real-time burning metrics listener
  subscribeToBurningMetrics(callback: (metrics: BurningMetrics) => void): () => void {
    if (db) {
      // Firebase is available
      const metricsRef = collection(db, 'burningMetrics');
      const q = query(metricsRef, orderBy('timestamp', 'desc'), limit(1));
      
      const unsubscribe = onSnapshot(q, async (querySnapshot) => {
        if (!querySnapshot.empty) {
          const metrics = await this.getBurningMetrics();
          callback(metrics);
        } else {
          // Return default metrics if no data
          const defaultMetrics: BurningMetrics = {
            totalBurned: 0,
            mintingBurned: 0,
            subscriptionBurned: 0,
            upgradeBurned: 0,
            marketplaceBurned: 0,
            daoBurned: 0,
            lastBurnDate: new Date().toISOString(),
            burnRate: 0,
            dailyBurnRate: 0,
            monthlyBurnRate: 0
          };
          callback(defaultMetrics);
        }
      });

      return unsubscribe;
    } else {
      // Mock implementation
      this.getBurningMetrics().then(callback);
      return () => {}; // No-op unsubscribe
    }
  }

  // Get burning statistics
  async getBurningStats(): Promise<{
    totalBurnEvents: number;
    totalBurned: number;
    averageBurnPerEvent: number;
    mostActiveSource: string;
    burnTrend: 'increasing' | 'decreasing' | 'stable';
  }> {
    try {
      const burnEvents = await this.getAllBurnEvents();
      
      const totalBurnEvents = burnEvents.length;
      const totalBurned = burnEvents.reduce((sum, event) => sum + event.amount, 0);
      const averageBurnPerEvent = totalBurnEvents > 0 ? totalBurned / totalBurnEvents : 0;

      // Find most active source
      const sourceCounts = burnEvents.reduce((acc, event) => {
        acc[event.source] = (acc[event.source] || 0) + 1;
        return acc;
      }, {} as { [key: string]: number });

      const mostActiveSource = Object.entries(sourceCounts)
        .sort(([,a], [,b]) => b - a)[0]?.[0] || 'none';

      // Calculate burn trend (last 7 days vs previous 7 days)
      const now = new Date();
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

      const recentBurns = burnEvents.filter(event => 
        new Date(event.timestamp) > sevenDaysAgo
      );
      const previousBurns = burnEvents.filter(event => 
        new Date(event.timestamp) > fourteenDaysAgo && 
        new Date(event.timestamp) <= sevenDaysAgo
      );

      const recentTotal = recentBurns.reduce((sum, event) => sum + event.amount, 0);
      const previousTotal = previousBurns.reduce((sum, event) => sum + event.amount, 0);

      let burnTrend: 'increasing' | 'decreasing' | 'stable' = 'stable';
      if (recentTotal > previousTotal * 1.1) {
        burnTrend = 'increasing';
      } else if (recentTotal < previousTotal * 0.9) {
        burnTrend = 'decreasing';
      }

      return {
        totalBurnEvents,
        totalBurned,
        averageBurnPerEvent,
        mostActiveSource,
        burnTrend
      };
    } catch (error) {
      console.error('Failed to get burning stats:', error);
      return {
        totalBurnEvents: 0,
        totalBurned: 0,
        averageBurnPerEvent: 0,
        mostActiveSource: 'none',
        burnTrend: 'stable'
      };
    }
  }
}

export default BurningService.getInstance(); 