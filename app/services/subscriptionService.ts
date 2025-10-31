// Subscription Service for DecentraMind
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
const validateSubscriptionRequest = (request: any) => {
  if (!request.userId) {
    return { success: false, error: 'User ID is required' };
  }
  if (!request.tierName || !['freemium', 'basic', 'pro', 'enterprise'].includes(request.tierName)) {
    return { success: false, error: 'Invalid subscription tier' };
  }
  return { success: true };
};

const isValidWalletAddress = (address: string): boolean => {
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
};

// Use centralized Firebase configuration
const db = firestore;
const auth = firebaseAuth;

export interface SubscriptionTier {
  id: string;
  name: 'freemium' | 'basic' | 'pro' | 'enterprise';
  price: number; // DMT cost
  credits: number;
  llmAccess: string[];
  features: string[];
  burningRate: number; // Percentage burned
  maxAgents: number;
  maxEvolutions: number;
  prioritySupport: boolean;
  customFeatures: string[];
}

export interface Subscription {
  id?: string;
  userId: string;
  tier: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'cancelled';
  creditsRemaining: number;
  creditsUsed: number;
  totalPaid: number;
  totalBurned: number;
  transactionHash?: string;
  metadata: {
    lastBilling: string;
    nextBilling: string;
    autoRenew: boolean;
    paymentMethod: string;
  };
}

export interface SubscriptionResult {
  success: boolean;
  subscriptionId?: string;
  creditsGranted: number;
  burnedAmount: number;
  treasuryAmount: number;
  rewardsAmount: number;
  error?: string;
}

export interface BurningMetrics {
  totalBurned: number;
  subscriptionBurned: number;
  mintingBurned: number;
  upgradeBurned: number;
  marketplaceBurned: number;
  lastBurnDate: string;
  burnRate: number;
}

class SubscriptionService {
  private static instance: SubscriptionService;
  private subscriptions: Subscription[] = [];

  // Subscription tiers configuration
  private tiers: { [key: string]: SubscriptionTier } = {
    freemium: {
      id: 'freemium',
      name: 'freemium',
      price: 0,
      credits: 5,
      llmAccess: ['LLaMA'],
      features: ['Basic Agent Creation', 'Limited Evolution', 'Community Support'],
      burningRate: 0,
      maxAgents: 1,
      maxEvolutions: 0,
      prioritySupport: false,
      customFeatures: []
    },
    basic: {
      id: 'basic',
      name: 'basic',
      price: 9,
      credits: 20,
      llmAccess: ['LLaMA', 'LLaMA 3'],
      features: ['Standard Agent Creation', 'Basic Evolution', 'Email Support', 'Analytics'],
      burningRate: 20,
      maxAgents: 3,
      maxEvolutions: 2,
      prioritySupport: false,
      customFeatures: ['Basic Analytics']
    },
    pro: {
      id: 'pro',
      name: 'pro',
      price: 29,
      credits: 50,
      llmAccess: ['ChatGPT', 'LLaMA 3', 'Claude'],
      features: ['Advanced Agent Creation', 'Unlimited Evolution', 'Priority Support', 'Advanced Analytics', 'Custom Training'],
      burningRate: 20,
      maxAgents: 10,
      maxEvolutions: 10,
      prioritySupport: true,
      customFeatures: ['Advanced Analytics', 'Custom Training', 'Priority Support']
    },
    enterprise: {
      id: 'enterprise',
      name: 'enterprise',
      price: 99,
      credits: 200,
      llmAccess: ['CrewAI', 'All LLMs', 'Custom Models'],
      features: ['Unlimited Agent Creation', 'Unlimited Evolution', 'Dedicated Support', 'Custom Integrations', 'White-label Options'],
      burningRate: 20,
      maxAgents: -1, // Unlimited
      maxEvolutions: -1, // Unlimited
      prioritySupport: true,
      customFeatures: ['Custom Integrations', 'White-label Options', 'Dedicated Support', 'Custom Models']
    }
  };

  static getInstance(): SubscriptionService {
    if (!SubscriptionService.instance) {
      SubscriptionService.instance = new SubscriptionService();
    }
    return SubscriptionService.instance;
  }

  async initialize(): Promise<void> {
    try {
      console.log('Initializing subscription service...');
      
      // Load subscription data from Firebase
      if (db) {
        console.log('Firebase connected for subscription data');
      }
    } catch (error) {
      console.error('Failed to initialize subscription service:', error);
    }
  }

  // Get all available subscription tiers
  getSubscriptionTiers(): SubscriptionTier[] {
    return Object.values(this.tiers);
  }

  // Get specific tier by name
  getTier(tierName: string): SubscriptionTier | null {
    return this.tiers[tierName] || null;
  }

  // Subscribe user to a tier
  async subscribe(userId: string, tierName: string, paymentMethod?: string): Promise<SubscriptionResult> {
    try {
      // Validate input
      const validation = validateSubscriptionRequest({ userId, tierName });
      if (!validation.success) {
        return { 
          success: false, 
          error: validation.error,
          creditsGranted: 0,
          burnedAmount: 0,
          treasuryAmount: 0,
          rewardsAmount: 0
        };
      }

      // Validate wallet address
      if (!isValidWalletAddress(userId)) {
        return { 
          success: false, 
          error: 'Invalid wallet address format',
          creditsGranted: 0,
          burnedAmount: 0,
          treasuryAmount: 0,
          rewardsAmount: 0
        };
      }

      const tier = this.getTier(tierName);
      if (!tier) {
        return { 
          success: false, 
          error: `Invalid subscription tier: ${tierName}`,
          creditsGranted: 0,
          burnedAmount: 0,
          treasuryAmount: 0,
          rewardsAmount: 0
        };
      }

      const subscriptionFee = tier.price;
      const burnedAmount = subscriptionFee * (tier.burningRate / 100);
      const treasuryAmount = subscriptionFee * 0.10; // 10% to treasury
      const rewardsAmount = subscriptionFee * 0.05; // 5% to rewards pool

      // Create subscription record
      const subscription: Omit<Subscription, 'id'> = {
        userId,
        tier: tierName,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
        status: 'active',
        creditsRemaining: tier.credits,
        creditsUsed: 0,
        totalPaid: subscriptionFee,
        totalBurned: burnedAmount,
        metadata: {
          lastBilling: new Date().toISOString(),
          nextBilling: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          autoRenew: true,
          paymentMethod: paymentMethod || 'DMT'
        }
      };

      let subscriptionId: string | undefined;

      if (db) {
        // Try to save to Firebase
        try {
          const docRef = await addDoc(collection(db, 'subscriptions'), subscription);
          subscriptionId = docRef.id;
          
          // Add to local cache
          const subscriptionWithId = { ...subscription, id: subscriptionId };
          this.subscriptions.push(subscriptionWithId);
          
          console.log('Subscription saved to Firebase:', subscriptionId);
        } catch (firebaseError) {
          console.log('Firebase subscription save failed, using local cache:', firebaseError);
          // Fall through to local implementation
        }
      }

      // Local implementation for development or when Firebase fails
      if (!subscriptionId) {
        subscriptionId = `local-sub-${Date.now()}`;
        const subscriptionWithId = { ...subscription, id: subscriptionId };
        this.subscriptions.push(subscriptionWithId);
      }

      // Track burning metrics
      await this.trackBurningMetrics({
        amount: burnedAmount,
        source: 'subscription',
        userId,
        tier: tierName,
        timestamp: new Date().toISOString()
      });

      console.log('Subscription created successfully:', {
        userId,
        tier: tierName,
        credits: tier.credits,
        burnedAmount,
        treasuryAmount,
        rewardsAmount
      });

      return {
        success: true,
        subscriptionId,
        creditsGranted: tier.credits,
        burnedAmount,
        treasuryAmount,
        rewardsAmount
      };
    } catch (error) {
      console.error('Failed to create subscription:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        creditsGranted: 0,
        burnedAmount: 0,
        treasuryAmount: 0,
        rewardsAmount: 0
      };
    }
  }

  // Get user's current subscription
  async getUserSubscription(userId: string): Promise<Subscription | null> {
    try {
      if (db) {
        // Try to get from Firebase
        try {
          const subscriptionsRef = collection(db, 'subscriptions');
          const q = query(
            subscriptionsRef,
            where('userId', '==', userId),
            where('status', '==', 'active'),
            orderBy('startDate', 'desc'),
            limit(1)
          );
          
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            const subscription = { id: doc.id, ...doc.data() } as Subscription;
            return subscription;
          }
        } catch (firebaseError) {
          console.log('Firebase subscription retrieval failed, checking local cache:', firebaseError);
        }
      }

      // Check local cache
      const subscription = this.subscriptions.find(s => 
        s.userId === userId && s.status === 'active'
      );
      
      return subscription || null;
    } catch (error) {
      console.error('Failed to get user subscription:', error);
      return null;
    }
  }

  // Check if user has access to a feature
  async hasFeatureAccess(userId: string, feature: string): Promise<boolean> {
    try {
      const subscription = await this.getUserSubscription(userId);
      if (!subscription) {
        return false;
      }

      const tier = this.getTier(subscription.tier);
      if (!tier) {
        return false;
      }

      return tier.features.includes(feature);
    } catch (error) {
      console.error('Failed to check feature access:', error);
      return false;
    }
  }

  // Check if user has credits remaining
  async hasCredits(userId: string, requiredCredits: number = 1): Promise<boolean> {
    try {
      const subscription = await this.getUserSubscription(userId);
      if (!subscription) {
        return false;
      }

      return subscription.creditsRemaining >= requiredCredits;
    } catch (error) {
      console.error('Failed to check credits:', error);
      return false;
    }
  }

  // Use credits for a feature
  async useCredits(userId: string, creditsUsed: number = 1): Promise<boolean> {
    try {
      if (db) {
        // Try to update in Firebase
        try {
          const subscription = await this.getUserSubscription(userId);
          if (!subscription || !subscription.id) {
            return false;
          }

          const subscriptionRef = doc(db, 'subscriptions', subscription.id);
          await updateDoc(subscriptionRef, {
            creditsRemaining: subscription.creditsRemaining - creditsUsed,
            creditsUsed: subscription.creditsUsed + creditsUsed,
            'metadata.lastBilling': new Date().toISOString()
          });

          // Update local cache
          const index = this.subscriptions.findIndex(s => s.id === subscription.id);
          if (index !== -1) {
            this.subscriptions[index].creditsRemaining -= creditsUsed;
            this.subscriptions[index].creditsUsed += creditsUsed;
          }

          return true;
        } catch (firebaseError) {
          console.log('Firebase credit update failed, updating local cache only:', firebaseError);
        }
      }

      // Update local cache
      const subscription = this.subscriptions.find(s => s.userId === userId && s.status === 'active');
      if (subscription) {
        subscription.creditsRemaining -= creditsUsed;
        subscription.creditsUsed += creditsUsed;
        return true;
      }

      return false;
    } catch (error) {
      console.error('Failed to use credits:', error);
      return false;
    }
  }

  // Cancel subscription
  async cancelSubscription(userId: string): Promise<boolean> {
    try {
      if (db) {
        // Try to update in Firebase
        try {
          const subscription = await this.getUserSubscription(userId);
          if (!subscription || !subscription.id) {
            return false;
          }

          const subscriptionRef = doc(db, 'subscriptions', subscription.id);
          await updateDoc(subscriptionRef, {
            status: 'cancelled',
            'metadata.autoRenew': false,
            'metadata.lastBilling': new Date().toISOString()
          });

          // Update local cache
          const index = this.subscriptions.findIndex(s => s.id === subscription.id);
          if (index !== -1) {
            this.subscriptions[index].status = 'cancelled';
            this.subscriptions[index].metadata.autoRenew = false;
          }

          return true;
        } catch (firebaseError) {
          console.log('Firebase subscription cancellation failed, updating local cache only:', firebaseError);
        }
      }

      // Update local cache
      const subscription = this.subscriptions.find(s => s.userId === userId && s.status === 'active');
      if (subscription) {
        subscription.status = 'cancelled';
        subscription.metadata.autoRenew = false;
        return true;
      }

      return false;
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
      return false;
    }
  }

  // Get subscription statistics
  async getSubscriptionStats(): Promise<{
    totalSubscriptions: number;
    activeSubscriptions: number;
    totalRevenue: number;
    totalBurned: number;
    tierDistribution: { [key: string]: number };
  }> {
    try {
      const subscriptions = await this.getAllSubscriptions();
      
      const totalSubscriptions = subscriptions.length;
      const activeSubscriptions = subscriptions.filter(s => s.status === 'active').length;
      const totalRevenue = subscriptions.reduce((sum, s) => sum + s.totalPaid, 0);
      const totalBurned = subscriptions.reduce((sum, s) => sum + s.totalBurned, 0);
      
      const tierDistribution = subscriptions.reduce((acc, s) => {
        acc[s.tier] = (acc[s.tier] || 0) + 1;
        return acc;
      }, {} as { [key: string]: number });

      return {
        totalSubscriptions,
        activeSubscriptions,
        totalRevenue,
        totalBurned,
        tierDistribution
      };
    } catch (error) {
      console.error('Failed to get subscription stats:', error);
      return {
        totalSubscriptions: 0,
        activeSubscriptions: 0,
        totalRevenue: 0,
        totalBurned: 0,
        tierDistribution: {}
      };
    }
  }

  // Get all subscriptions (for admin purposes)
  async getAllSubscriptions(): Promise<Subscription[]> {
    try {
      if (db) {
        // Try to get from Firebase
        try {
          const subscriptionsRef = collection(db, 'subscriptions');
          const q = query(subscriptionsRef, orderBy('startDate', 'desc'));
          
          const querySnapshot = await getDocs(q);
          const subscriptions: Subscription[] = [];
          
          querySnapshot.forEach((doc) => {
            subscriptions.push({ id: doc.id, ...doc.data() } as Subscription);
          });

          // Update local cache
          this.subscriptions = [...this.subscriptions, ...subscriptions];
          
          return subscriptions;
        } catch (firebaseError) {
          console.log('Firebase subscription retrieval failed, using local cache:', firebaseError);
        }
      }

      return this.subscriptions;
    } catch (error) {
      console.error('Failed to get all subscriptions:', error);
      return this.subscriptions;
    }
  }

  // Track burning metrics
  private async trackBurningMetrics(metrics: {
    amount: number;
    source: string;
    userId: string;
    tier?: string;
    timestamp: string;
  }): Promise<void> {
    try {
      if (db) {
        const burningRef = collection(db, 'burningMetrics');
        await addDoc(burningRef, {
          ...metrics,
          transactionType: 'subscription_burn'
        });
      }

      console.log('Burning metrics tracked:', metrics);
    } catch (error) {
      console.error('Failed to track burning metrics:', error);
    }
  }

  // Real-time subscription listener
  subscribeToUserSubscription(userId: string, callback: (subscription: Subscription | null) => void): () => void {
    if (db) {
      // Firebase is available
      const subscriptionsRef = collection(db, 'subscriptions');
      const q = query(
        subscriptionsRef,
        where('userId', '==', userId),
        where('status', '==', 'active'),
        orderBy('startDate', 'desc'),
        limit(1)
      );
      
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          const subscription = { id: doc.id, ...doc.data() } as Subscription;
          callback(subscription);
        } else {
          callback(null);
        }
      });

      return unsubscribe;
    } else {
      // Mock implementation
      const subscription = this.subscriptions.find(s => s.userId === userId && s.status === 'active');
      callback(subscription || null);
      return () => {}; // No-op unsubscribe
    }
  }
}

export default SubscriptionService.getInstance(); 