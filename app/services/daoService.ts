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
  writeBatch,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';

export interface Proposal {
  id?: string;
  title: string;
  description: string;
  status: 'active' | 'passed' | 'rejected' | 'executed';
  createdBy: string;
  category: 'treasury' | 'governance' | 'tech' | 'community';
  createdAt: Timestamp;
  deadline: Timestamp;
  votes: {
    for: number;
    against: number;
    abstain: number;
    total: number;
  };
  quorum: number;
}

export interface Vote {
  id?: string;
  proposalId: string;
  walletAddress: string;
  type: 'for' | 'against' | 'abstain';
  votingPower: number;
  timestamp: Timestamp;
}

export interface Delegation {
  id?: string;
  fromAddress: string;
  toAddress: string;
  amount: number;
  createdAt: Timestamp;
  isActive: boolean;
}

class DAOService {
  private static instance: DAOService;
  private proposalsUnsubscribe: (() => void) | null = null;

  static getInstance(): DAOService {
    if (!DAOService.instance) {
      DAOService.instance = new DAOService();
    }
    return DAOService.instance;
  }

  // Get all proposals with real-time listener
  getProposals(callback: (proposals: Proposal[]) => void): () => void {
    const proposalsRef = collection(db, 'proposals');
    const q = query(proposalsRef, orderBy('createdAt', 'desc'));
    
    this.proposalsUnsubscribe = onSnapshot(q, (querySnapshot) => {
      const proposals = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Proposal[];
      callback(proposals);
    });

    return () => {
      if (this.proposalsUnsubscribe) {
        this.proposalsUnsubscribe();
        this.proposalsUnsubscribe = null;
      }
    };
  }

  // Submit a new proposal
  async submitProposal(proposal: Omit<Proposal, 'id' | 'createdAt' | 'votes' | 'quorum'>, walletAddress: string): Promise<string> {
    try {
      const deadline = new Date();
      deadline.setDate(deadline.getDate() + proposal.deadline.toDate().getDate());
      
      const proposalData = {
        ...proposal,
        createdBy: walletAddress,
        createdAt: serverTimestamp(),
        deadline: Timestamp.fromDate(deadline),
        votes: {
          for: 0,
          against: 0,
          abstain: 0,
          total: 0
        },
        quorum: await this.calculateQuorum()
      };

      const docRef = await addDoc(collection(db, 'proposals'), proposalData);
      return docRef.id;
    } catch (error) {
      console.error('Error submitting proposal:', error);
      throw new Error('Failed to submit proposal');
    }
  }

  // Cast a vote on a proposal
  async castVote(proposalId: string, type: 'for' | 'against' | 'abstain', walletAddress: string, votingPower: number): Promise<void> {
    try {
      const batch = writeBatch(db);

      // Check if user already voted
      const hasVoted = await this.hasUserVoted(proposalId, walletAddress);
      if (hasVoted) {
        throw new Error('User has already voted on this proposal');
      }

      // Add vote to votes subcollection
      const voteRef = doc(collection(db, 'proposals', proposalId, 'votes'));
      batch.set(voteRef, {
        proposalId,
        walletAddress,
        type,
        votingPower,
        timestamp: serverTimestamp(),
      });

      // Update proposal vote counts
      const proposalRef = doc(db, 'proposals', proposalId);
      const proposalDoc = await getDoc(proposalRef);
      
      if (!proposalDoc.exists()) {
        throw new Error('Proposal not found');
      }

      const proposalData = proposalDoc.data() as Proposal;
      const voteCounts = { ...proposalData.votes };

      // Update vote counts based on vote type
      if (type === 'for') {
        voteCounts.for += votingPower;
      } else if (type === 'against') {
        voteCounts.against += votingPower;
      } else if (type === 'abstain') {
        voteCounts.abstain += votingPower;
      }

      voteCounts.total += votingPower;

      batch.update(proposalRef, {
        votes: voteCounts,
        updatedAt: serverTimestamp(),
      });

      await batch.commit();
    } catch (error) {
      console.error('Error casting vote:', error);
      throw error;
    }
  }

  // Get votes for a specific proposal
  async getVotes(proposalId: string): Promise<Vote[]> {
    try {
      const votesRef = collection(db, 'proposals', proposalId, 'votes');
      const querySnapshot = await getDocs(votesRef);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Vote[];
    } catch (error) {
      console.error('Error getting votes:', error);
      return [];
    }
  }

  // Check if user has already voted on a proposal
  async hasUserVoted(proposalId: string, walletAddress: string): Promise<boolean> {
    try {
      const votesRef = collection(db, 'proposals', proposalId, 'votes');
      const q = query(votesRef, where('walletAddress', '==', walletAddress));
      const querySnapshot = await getDocs(q);
      
      return !querySnapshot.empty;
    } catch (error) {
      console.error('Error checking if user voted:', error);
      return false;
    }
  }

  // Get user's vote on a specific proposal
  async getUserVote(proposalId: string, walletAddress: string): Promise<Vote | null> {
    try {
      const votesRef = collection(db, 'proposals', proposalId, 'votes');
      const q = query(votesRef, where('walletAddress', '==', walletAddress));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return null;
      }

      const voteDoc = querySnapshot.docs[0];
      return {
        id: voteDoc.id,
        ...voteDoc.data()
      } as Vote;
    } catch (error) {
      console.error('Error getting user vote:', error);
      return null;
    }
  }

  // Calculate quorum based on total staked DMT
  async calculateQuorum(): Promise<number> {
    try {
      // This would typically query a staking contract or database
      // For now, return a fixed quorum
      return 1000; // 1000 DMT minimum for quorum
    } catch (error) {
      console.error('Error calculating quorum:', error);
      return 1000;
    }
  }

  // Update proposal status
  async updateProposalStatus(proposalId: string, status: Proposal['status']): Promise<void> {
    try {
      const proposalRef = doc(db, 'proposals', proposalId);
      await updateDoc(proposalRef, {
        status,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating proposal status:', error);
      throw new Error('Failed to update proposal status');
    }
  }

  // Cleanup
  cleanup(): void {
    if (this.proposalsUnsubscribe) {
      this.proposalsUnsubscribe();
      this.proposalsUnsubscribe = null;
    }
  }
}

export default DAOService.getInstance();