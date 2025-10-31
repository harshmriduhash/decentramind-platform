import { db } from '../lib/firebase';
import { collection, addDoc, getDocs, query, where, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';

export interface StakingPosition {
  id?: string;
  userId: string;
  amount: number;
  startDate: string;
  endDate: string;
  rewards: number;
  status: 'Active' | 'Completed' | 'Unstaked';
  lockPeriod: number;
  penalty?: number;
  unstakeDate?: string;
  transactionSignature?: string;
}

export class StakingService {
  private static instance: StakingService;

  static getInstance(): StakingService {
    if (!StakingService.instance) {
      StakingService.instance = new StakingService();
    }
    return StakingService.instance;
  }

  // Create a new staking position
  async createStakingPosition(
    userId: string,
    amount: number,
    lockPeriod: number,
    transactionSignature?: string
  ): Promise<string> {
    try {
      if (!db) {
        console.error('Firebase not initialized');
        return '';
      }

      const startDate = new Date();
      const endDate = new Date(startDate.getTime() + lockPeriod * 24 * 60 * 60 * 1000);
      const rewards = amount * 0.125 * (lockPeriod / 365); // 12.5% APY

      const stakingPosition: Omit<StakingPosition, 'id'> = {
        userId,
        amount,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        rewards,
        status: 'Active',
        lockPeriod,
        transactionSignature
      };

      const docRef = await addDoc(collection(db, 'staking_positions'), stakingPosition);
      return docRef.id;
    } catch (error) {
      console.error('Failed to create staking position:', error);
      throw error;
    }
  }

  // Get staking positions for a user
  async getStakingPositions(userId: string): Promise<StakingPosition[]> {
    try {
      if (!db) {
        console.error('Firebase not initialized');
        return [];
      }

      const q = query(
        collection(db, 'staking_positions'),
        where('userId', '==', userId),
        orderBy('startDate', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const positions: StakingPosition[] = [];
      
      querySnapshot.forEach((doc) => {
        positions.push({ id: doc.id, ...doc.data() } as StakingPosition);
      });

      return positions;
    } catch (error) {
      console.error('Failed to get staking positions:', error);
      return [];
    }
  }

  // Subscribe to real-time staking updates
  subscribeToStakingPositions(userId: string, callback: (positions: StakingPosition[]) => void): () => void {
    try {
      if (!db) {
        console.error('Firebase not initialized');
        return () => {};
      }

      const q = query(
        collection(db, 'staking_positions'),
        where('userId', '==', userId),
        orderBy('startDate', 'desc')
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const positions: StakingPosition[] = [];
        querySnapshot.forEach((doc) => {
          positions.push({ id: doc.id, ...doc.data() } as StakingPosition);
        });
        callback(positions);
      });

      return unsubscribe;
    } catch (error) {
      console.error('Failed to subscribe to staking positions:', error);
      return () => {};
    }
  }

  // Unstake a position
  async unstakePosition(
    positionId: string,
    penalty: number,
    transactionSignature?: string
  ): Promise<boolean> {
    try {
      if (!db) {
        console.error('Firebase not initialized');
        return false;
      }

      const updates = {
        status: 'Unstaked' as const,
        penalty,
        unstakeDate: new Date().toISOString(),
        transactionSignature
      };

      await updateDoc(doc(db, 'staking_positions', positionId), updates);
      return true;
    } catch (error) {
      console.error('Failed to unstake position:', error);
      return false;
    }
  }

  // Update staking position
  async updateStakingPosition(positionId: string, updates: Partial<StakingPosition>): Promise<boolean> {
    try {
      if (!db) {
        console.error('Firebase not initialized');
        return false;
      }

      await updateDoc(doc(db, 'staking_positions', positionId), updates);
      return true;
    } catch (error) {
      console.error('Failed to update staking position:', error);
      return false;
    }
  }

  // Delete a staking position
  async deleteStakingPosition(positionId: string): Promise<boolean> {
    try {
      if (!db) {
        console.error('Firebase not initialized');
        return false;
      }

      await deleteDoc(doc(db, 'staking_positions', positionId));
      return true;
    } catch (error) {
      console.error('Failed to delete staking position:', error);
      return false;
    }
  }

  // Get staking statistics for a user
  async getStakingStats(userId: string): Promise<{
    totalStaked: number;
    totalRewards: number;
    activePositions: number;
    totalPenalty: number;
  }> {
    try {
      const positions = await this.getStakingPositions(userId);
      
      const totalStaked = positions.reduce((sum, pos) => sum + pos.amount, 0);
      const totalRewards = positions.reduce((sum, pos) => sum + pos.rewards, 0);
      const activePositions = positions.filter(pos => pos.status === 'Active').length;
      const totalPenalty = positions.reduce((sum, pos) => sum + (pos.penalty || 0), 0);

      return {
        totalStaked,
        totalRewards,
        activePositions,
        totalPenalty
      };
    } catch (error) {
      console.error('Failed to get staking stats:', error);
      return {
        totalStaked: 0,
        totalRewards: 0,
        activePositions: 0,
        totalPenalty: 0
      };
    }
  }
}

export default StakingService; 