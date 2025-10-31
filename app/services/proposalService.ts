import { db } from '../lib/firebase';
import { collection, addDoc, getDocs, query, where, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';

export interface Proposal {
  id?: string;
  title: string;
  description: string;
  type: string;
  status: 'Active' | 'Pending' | 'Completed' | 'Rejected';
  votes: number;
  totalVotes: number;
  startDate: string;
  endDate: string;
  proposer: string;
  proposerId: string;
  fee: number;
  transactionSignature?: string;
}

export interface ProposalVote {
  id?: string;
  proposalId: string;
  userId: string;
  voteAmount: number;
  timestamp: Date;
  transactionSignature?: string;
}

export class ProposalService {
  private static instance: ProposalService;

  static getInstance(): ProposalService {
    if (!ProposalService.instance) {
      ProposalService.instance = new ProposalService();
    }
    return ProposalService.instance;
  }

  // Create a new proposal
  async createProposal(
    proposerId: string,
    proposer: string,
    title: string,
    description: string,
    type: string,
    fee: number,
    transactionSignature?: string
  ): Promise<string> {
    try {
      if (!db) {
        console.error('Firebase not initialized');
        return '';
      }

      const startDate = new Date();
      const endDate = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days

      const proposal: Omit<Proposal, 'id'> = {
        title,
        description,
        type,
        status: 'Active',
        votes: 0,
        totalVotes: 0,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        proposer,
        proposerId,
        fee,
        transactionSignature
      };

      const docRef = await addDoc(collection(db, 'proposals'), proposal);
      return docRef.id;
    } catch (error) {
      console.error('Failed to create proposal:', error);
      throw error;
    }
  }

  // Get all proposals
  async getProposals(): Promise<Proposal[]> {
    try {
      if (!db) {
        console.error('Firebase not initialized');
        return [];
      }

      const q = query(
        collection(db, 'proposals'),
        orderBy('startDate', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const proposals: Proposal[] = [];
      
      querySnapshot.forEach((doc) => {
        proposals.push({ id: doc.id, ...doc.data() } as Proposal);
      });

      return proposals;
    } catch (error) {
      console.error('Failed to get proposals:', error);
      return [];
    }
  }

  // Subscribe to real-time proposal updates
  subscribeToProposals(callback: (proposals: Proposal[]) => void): () => void {
    try {
      if (!db) {
        console.error('Firebase not initialized');
        return () => {};
      }

      const q = query(
        collection(db, 'proposals'),
        orderBy('startDate', 'desc')
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const proposals: Proposal[] = [];
        querySnapshot.forEach((doc) => {
          proposals.push({ id: doc.id, ...doc.data() } as Proposal);
        });
        callback(proposals);
      });

      return unsubscribe;
    } catch (error) {
      console.error('Failed to subscribe to proposals:', error);
      return () => {};
    }
  }

  // Vote on a proposal
  async voteOnProposal(
    proposalId: string,
    userId: string,
    voteAmount: number,
    transactionSignature?: string
  ): Promise<string> {
    try {
      if (!db) {
        console.error('Firebase not initialized');
        return '';
      }

      // Create vote record
      const vote: Omit<ProposalVote, 'id'> = {
        proposalId,
        userId,
        voteAmount,
        timestamp: new Date(),
        transactionSignature
      };

      const voteDocRef = await addDoc(collection(db, 'proposal_votes'), vote);

      // Update proposal vote count
      const proposalRef = doc(db, 'proposals', proposalId);
      const proposalDoc = await getDocs(query(collection(db, 'proposals'), where('__name__', '==', proposalId)));
      
      if (!proposalDoc.empty) {
        const proposal = proposalDoc.docs[0].data() as Proposal;
        await updateDoc(proposalRef, {
          votes: proposal.votes + voteAmount,
          totalVotes: proposal.totalVotes + voteAmount
        });
      }

      return voteDocRef.id;
    } catch (error) {
      console.error('Failed to vote on proposal:', error);
      throw error;
    }
  }

  // Get votes for a proposal
  async getProposalVotes(proposalId: string): Promise<ProposalVote[]> {
    try {
      if (!db) {
        console.error('Firebase not initialized');
        return [];
      }

      const q = query(
        collection(db, 'proposal_votes'),
        where('proposalId', '==', proposalId),
        orderBy('timestamp', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const votes: ProposalVote[] = [];
      
      querySnapshot.forEach((doc) => {
        votes.push({ id: doc.id, ...doc.data() } as ProposalVote);
      });

      return votes;
    } catch (error) {
      console.error('Failed to get proposal votes:', error);
      return [];
    }
  }

  // Get user's votes
  async getUserVotes(userId: string): Promise<ProposalVote[]> {
    try {
      if (!db) {
        console.error('Firebase not initialized');
        return [];
      }

      const q = query(
        collection(db, 'proposal_votes'),
        where('userId', '==', userId),
        orderBy('timestamp', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const votes: ProposalVote[] = [];
      
      querySnapshot.forEach((doc) => {
        votes.push({ id: doc.id, ...doc.data() } as ProposalVote);
      });

      return votes;
    } catch (error) {
      console.error('Failed to get user votes:', error);
      return [];
    }
  }

  // Update proposal status
  async updateProposalStatus(proposalId: string, status: Proposal['status']): Promise<boolean> {
    try {
      if (!db) {
        console.error('Firebase not initialized');
        return false;
      }

      await updateDoc(doc(db, 'proposals', proposalId), { status });
      return true;
    } catch (error) {
      console.error('Failed to update proposal status:', error);
      return false;
    }
  }

  // Delete a proposal
  async deleteProposal(proposalId: string): Promise<boolean> {
    try {
      if (!db) {
        console.error('Firebase not initialized');
        return false;
      }

      await deleteDoc(doc(db, 'proposals', proposalId));
      return true;
    } catch (error) {
      console.error('Failed to delete proposal:', error);
      return false;
    }
  }

  // Get proposal statistics
  async getProposalStats(): Promise<{
    totalProposals: number;
    activeProposals: number;
    completedProposals: number;
    totalVotes: number;
  }> {
    try {
      const proposals = await this.getProposals();
      
      const totalProposals = proposals.length;
      const activeProposals = proposals.filter(p => p.status === 'Active').length;
      const completedProposals = proposals.filter(p => p.status === 'Completed').length;
      const totalVotes = proposals.reduce((sum, p) => sum + p.totalVotes, 0);

      return {
        totalProposals,
        activeProposals,
        completedProposals,
        totalVotes
      };
    } catch (error) {
      console.error('Failed to get proposal stats:', error);
      return {
        totalProposals: 0,
        activeProposals: 0,
        completedProposals: 0,
        totalVotes: 0
      };
    }
  }
}

export default ProposalService; 