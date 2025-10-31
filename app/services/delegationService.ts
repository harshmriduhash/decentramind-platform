import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  getDocs, 
  getDoc, 
  onSnapshot, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';

export interface Delegation {
  id?: string;
  fromAddress: string;
  toAddress: string;
  amount: number;
  createdAt: Timestamp;
  isActive: boolean;
}

class DelegationService {
  private static instance: DelegationService;
  private delegationsUnsubscribe: (() => void) | null = null;

  static getInstance(): DelegationService {
    if (!DelegationService.instance) {
      DelegationService.instance = new DelegationService();
    }
    return DelegationService.instance;
  }

  // Delegate voting power from one address to another
  async delegatePower(fromAddress: string, toAddress: string, amount: number): Promise<string> {
    try {
      // Check if delegation already exists
      const existingDelegation = await this.getActiveDelegation(fromAddress);
      if (existingDelegation) {
        throw new Error('User already has an active delegation');
      }

      // Validate addresses
      if (fromAddress === toAddress) {
        throw new Error('Cannot delegate to yourself');
      }

      // Check if user has sufficient voting power
      const dmtTokenService = (await import('./dmtTokenService')).default;
      const votingPower = await dmtTokenService.getVotingPower(fromAddress);
      if (votingPower < amount) {
        throw new Error('Insufficient voting power for delegation');
      }

      const delegationRef = await addDoc(collection(db, 'delegations'), {
        fromAddress,
        toAddress,
        amount,
        createdAt: serverTimestamp(),
        isActive: true,
      });

      return delegationRef.id;
    } catch (error) {
      console.error('Error creating delegation:', error);
      throw error;
    }
  }

  // Get all delegations for a wallet address (both incoming and outgoing)
  async getDelegations(walletAddress: string): Promise<Delegation[]> {
    try {
      const delegationsRef = collection(db, 'delegations');
      const q = query(
        delegationsRef,
        where('isActive', '==', true),
        where('fromAddress', '==', walletAddress)
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Delegation[];
    } catch (error) {
      console.error('Error getting delegations:', error);
      return [];
    }
  }

  // Get delegations received by a wallet address
  async getReceivedDelegations(walletAddress: string): Promise<Delegation[]> {
    try {
      const delegationsRef = collection(db, 'delegations');
      const q = query(
        delegationsRef,
        where('isActive', '==', true),
        where('toAddress', '==', walletAddress)
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Delegation[];
    } catch (error) {
      console.error('Error getting received delegations:', error);
      return [];
    }
  }

  // Get total delegated power received by a wallet
  async getDelegatedPower(walletAddress: string): Promise<number> {
    try {
      const receivedDelegations = await this.getReceivedDelegations(walletAddress);
      return receivedDelegations.reduce((total, delegation) => total + delegation.amount, 0);
    } catch (error) {
      console.error('Error getting delegated power:', error);
      return 0;
    }
  }

  // Get total power delegated by a wallet
  async getDelegatedByWallet(walletAddress: string): Promise<number> {
    try {
      const delegations = await this.getDelegations(walletAddress);
      return delegations.reduce((total, delegation) => total + delegation.amount, 0);
    } catch (error) {
      console.error('Error getting delegated by wallet:', error);
      return 0;
    }
  }

  // Get active delegation for a wallet address
  async getActiveDelegation(walletAddress: string): Promise<Delegation | null> {
    try {
      const delegationsRef = collection(db, 'delegations');
      const q = query(
        delegationsRef, 
        where('fromAddress', '==', walletAddress),
        where('isActive', '==', true)
      );
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return null;
      }

      const delegationDoc = querySnapshot.docs[0];
      return {
        id: delegationDoc.id,
        ...delegationDoc.data()
      } as Delegation;
    } catch (error) {
      console.error('Error getting active delegation:', error);
      return null;
    }
  }

  // Revoke a delegation
  async revokeDelegation(delegationId: string): Promise<void> {
    try {
      const delegationRef = doc(db, 'delegations', delegationId);
      await updateDoc(delegationRef, {
        isActive: false,
        revokedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error revoking delegation:', error);
      throw new Error('Failed to revoke delegation');
    }
  }

  // Subscribe to delegations for real-time updates
  subscribeToDelegations(walletAddress: string, callback: (delegations: Delegation[]) => void): () => void {
    const delegationsRef = collection(db, 'delegations');
    const q = query(
      delegationsRef,
      where('isActive', '==', true),
      where('fromAddress', '==', walletAddress)
    );
    
    this.delegationsUnsubscribe = onSnapshot(q, (querySnapshot) => {
      const delegations = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Delegation[];
      callback(delegations);
    });

    return () => {
      if (this.delegationsUnsubscribe) {
        this.delegationsUnsubscribe();
        this.delegationsUnsubscribe = null;
      }
    };
  }

  // Get delegation statistics
  async getDelegationStats(walletAddress: string): Promise<{
    totalDelegated: number;
    totalReceived: number;
    activeDelegations: number;
    receivedDelegations: number;
  }> {
    try {
      const [delegations, receivedDelegations] = await Promise.all([
        this.getDelegations(walletAddress),
        this.getReceivedDelegations(walletAddress)
      ]);

      return {
        totalDelegated: delegations.reduce((total, d) => total + d.amount, 0),
        totalReceived: receivedDelegations.reduce((total, d) => total + d.amount, 0),
        activeDelegations: delegations.length,
        receivedDelegations: receivedDelegations.length,
      };
    } catch (error) {
      console.error('Error getting delegation stats:', error);
      return {
        totalDelegated: 0,
        totalReceived: 0,
        activeDelegations: 0,
        receivedDelegations: 0,
      };
    }
  }

  // Cleanup
  cleanup(): void {
    if (this.delegationsUnsubscribe) {
      this.delegationsUnsubscribe();
      this.delegationsUnsubscribe = null;
    }
  }
}

export default DelegationService.getInstance();

