import { TokenSale, Contribution, Investor } from '../types/launchpad';
import { useWallet } from '@solana/wallet-adapter-react';

export class SaleService {
  private static instance: SaleService;
  
  static getInstance(): SaleService {
    if (!SaleService.instance) {
      SaleService.instance = new SaleService();
    }
    return SaleService.instance;
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
  
  async getActiveTokenSales(): Promise<TokenSale[]> {
    return this.handleRequest(async () => {
      const response = await fetch('/api/launchpad/sales');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    }, 'Failed to fetch active token sales');
  }
  
  async getTokenSaleById(id: string): Promise<TokenSale> {
    this.validateParams({ id }, ['id']);
    
    return this.handleRequest(async () => {
      const response = await fetch(`/api/launchpad/sales/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    }, 'Failed to fetch token sale');
  }
  
  async submitContribution(
    tokenSaleId: string,
    amount: number,
    currency: 'USDC' | 'SOL'
  ): Promise<Contribution> {
    this.validateParams({ tokenSaleId, amount, currency }, ['tokenSaleId', 'amount', 'currency']);
    
    return this.handleRequest(async () => {
      const response = await fetch('/api/launchpad/contribute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tokenSaleId,
          amount,
          currency,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response.json();
    }, 'Failed to submit contribution');
  }
  
  async getInvestorContributions(walletAddress: string): Promise<Contribution[]> {
    this.validateParams({ walletAddress }, ['walletAddress']);
    
    return this.handleRequest(async () => {
      const response = await fetch(`/api/launchpad/investor/${walletAddress}/contributions`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    }, 'Failed to fetch investor contributions');
  }
  
  async getInvestorProfile(walletAddress: string): Promise<Investor> {
    this.validateParams({ walletAddress }, ['walletAddress']);
    
    return this.handleRequest(async () => {
      const response = await fetch(`/api/launchpad/investor/${walletAddress}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    }, 'Failed to fetch investor profile');
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
}

export default SaleService;
