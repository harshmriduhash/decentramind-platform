import { Claim, TokenSale, VestingSchedule } from '../types/launchpad';

export class ClaimService {
  private static instance: ClaimService;
  
  static getInstance(): ClaimService {
    if (!ClaimService.instance) {
      ClaimService.instance = new ClaimService();
    }
    return ClaimService.instance;
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
  
  async getAvailableClaims(walletAddress: string): Promise<Claim[]> {
    this.validateParams({ walletAddress }, ['walletAddress']);
    
    return this.handleRequest(async () => {
      const response = await fetch(`/api/launchpad/claims/${walletAddress}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    }, 'Failed to fetch available claims');
  }
  
  async submitClaim(
    tokenSaleId: string,
    walletAddress: string,
    amount: number
  ): Promise<Claim> {
    this.validateParams({ tokenSaleId, walletAddress, amount }, ['tokenSaleId', 'walletAddress', 'amount']);
    
    return this.handleRequest(async () => {
      const response = await fetch('/api/launchpad/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tokenSaleId,
          walletAddress,
          amount,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response.json();
    }, 'Failed to submit claim');
  }
  
  async calculateVestingSchedule(
    contributionAmount: number,
    tokenSale: TokenSale,
    currentDate: Date
  ): Promise<{
    totalTokens: number;
    tgeTokens: number;
    vestingTokens: number;
    nextVestingDate: Date;
    nextVestingAmount: number;
  }> {
    this.validateParams({ contributionAmount, tokenSale, currentDate }, ['contributionAmount', 'tokenSale', 'currentDate']);
    
    const totalTokens = contributionAmount / tokenSale.salePrice;
    const tgeTokens = totalTokens * (tokenSale.vestingSchedule.tgePercentage / 100);
    const vestingTokens = totalTokens - tgeTokens;
    
    // Calculate next vesting date and amount
    const daysSinceTGE = Math.floor((currentDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    const vestingPeriods = Math.floor(daysSinceTGE / tokenSale.vestingSchedule.vestingFrequency);
    const nextVestingDate = new Date(currentDate.getTime() + (tokenSale.vestingSchedule.vestingFrequency * 24 * 60 * 60 * 1000));
    const nextVestingAmount = vestingTokens / (tokenSale.vestingSchedule.vestingDuration / tokenSale.vestingSchedule.vestingFrequency);
    
    return {
      totalTokens,
      tgeTokens,
      vestingTokens,
      nextVestingDate,
      nextVestingAmount,
    };
  }
  
  async getClaimHistory(walletAddress: string): Promise<Claim[]> {
    this.validateParams({ walletAddress }, ['walletAddress']);
    
    return this.handleRequest(async () => {
      const response = await fetch(`/api/launchpad/claims/${walletAddress}/history`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    }, 'Failed to fetch claim history');
  }
}

export default ClaimService;
