export interface LaunchpadProposal {
  id?: string;
  title: string;
  description: string;
  tokenName: string;
  tokenSymbol: string;
  totalSupply: string;
  initialPrice: string;
  fundingGoal: string;
  projectWebsite: string;
  whitepaper: string;
  teamMembers: string;
  roadmap: string;
  status?: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected';
  createdAt?: Date;
  updatedAt?: Date;
  proposer?: string;
  votes?: {
    for: number;
    against: number;
    abstain: number;
  };
}

export interface TokenSale {
  id: string;
  projectName: string;
  description: string;
  tokenName: string;
  tokenSymbol: string;
  totalSupply: number;
  price: number;
  salePrice: number;
  minContribution: number;
  maxContribution: number;
  startDate: Date;
  endDate: Date;
  status: 'upcoming' | 'active' | 'ended';
  raised: number;
  goal: number;
  totalRaised: number;
  targetAmount: number;
  vestingSchedule: {
    vestingFrequency: number;
    totalVestingPeriod: number;
    tgePercentage: number;
    cliffDuration: number;
    vestingDuration: number;
  };
}

export interface VestingSchedule {
  vestingFrequency: number;
  totalVestingPeriod: number;
  tgePercentage: number;
  cliffDuration: number;
  vestingDuration: number;
}

export interface Contribution {
  id: string;
  tokenSaleId: string;
  investorId: string;
  amount: number;
  tokens: number;
  timestamp: Date;
  status: 'pending' | 'confirmed' | 'failed';
}

export interface Investor {
  id: string;
  walletAddress: string;
  totalContributed: number;
  totalTokens: number;
  contributions: string[];
  whitelisted: boolean;
  kycStatus: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
}

export interface WhitelistEntry {
  id: string;
  tokenSaleId: string;
  walletAddress: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: Date;
  approvedAt?: Date;
  kycStatus: 'pending' | 'approved' | 'rejected';
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  maxContribution: number;
}

export interface Claim {
  id: string;
  tokenSaleId: string;
  userId: string;
  amount: number;
  claimed: boolean;
  claimDate?: Date;
  status: 'pending' | 'claimed' | 'expired';
  vestingPeriod: number;
}