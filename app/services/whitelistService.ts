import { WhitelistEntry, Investor } from '../types/launchpad';

export class WhitelistService {
  private static instance: WhitelistService;
  
  static getInstance(): WhitelistService {
    if (!WhitelistService.instance) {
      WhitelistService.instance = new WhitelistService();
    }
    return WhitelistService.instance;
  }

  private async handleRequest<T>(
    request: () => Promise<T>,
    errorMessage: string = 'Request failed'
  ): Promise<T> {
    try {
      return await request();
    } catch (error) {
      console.error(errorMessage, error);
      throw new Error(`${errorMessage}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private validateParams(params: any, required: string[]): void {
    for (const field of required) {
      if (!params[field]) {
        throw new Error(`Missing required parameter: ${field}`);
      }
    }
  }
  
  async checkWhitelistStatus(walletAddress: string): Promise<boolean> {
    this.validateParams({ walletAddress }, ['walletAddress']);
    
    return this.handleRequest(async () => {
      const response = await fetch(`/api/launchpad/whitelist/check/${walletAddress}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      return result.isWhitelisted;
    }, 'Failed to check whitelist status');
  }
  
  async getWhitelistEntry(walletAddress: string): Promise<WhitelistEntry | null> {
    this.validateParams({ walletAddress }, ['walletAddress']);
    
    return this.handleRequest(async () => {
      const response = await fetch(`/api/launchpad/whitelist/${walletAddress}`);
      if (response.status === 404) {
        return null;
      }
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    }, 'Failed to fetch whitelist entry');
  }
  
  async requestWhitelist(
    walletAddress: string,
    reason: string,
    additionalInfo?: string
  ): Promise<{ success: boolean; message: string }> {
    this.validateParams({ walletAddress, reason }, ['walletAddress', 'reason']);
    
    return this.handleRequest(async () => {
      const response = await fetch('/api/launchpad/whitelist/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress,
          reason,
          additionalInfo,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response.json();
    }, 'Failed to request whitelist access');
  }
  
  async getWhitelistCriteria(): Promise<{
    daoMember: boolean;
    earlyInvestor: boolean;
    nftHolder: boolean;
    manualApproval: boolean;
    requirements: string[];
  }> {
    return this.handleRequest(async () => {
      const response = await fetch('/api/launchpad/whitelist/criteria');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    }, 'Failed to fetch whitelist criteria');
  }
  
  async getWaitingList(): Promise<{
    walletAddress: string;
    reason: string;
    requestedAt: Date;
    status: 'pending' | 'approved' | 'rejected';
  }[]> {
    return this.handleRequest(async () => {
      const response = await fetch('/api/launchpad/whitelist/waiting-list');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    }, 'Failed to fetch waiting list');
  }
  
  async isEligibleForWhitelist(walletAddress: string): Promise<{
    isEligible: boolean;
    reasons: string[];
    nextSteps: string[];
  }> {
    this.validateParams({ walletAddress }, ['walletAddress']);
    
    return this.handleRequest(async () => {
      const response = await fetch(`/api/launchpad/whitelist/eligibility/${walletAddress}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    }, 'Failed to check whitelist eligibility');
  }
}

export default WhitelistService;
