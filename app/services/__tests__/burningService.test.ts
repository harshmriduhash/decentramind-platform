import BurningService from '../burningService';
import { BurnRequest, BurningMetrics } from '../burningService';

describe('BurningService', () => {
  let burningService: any;

  beforeEach(() => {
    burningService = BurningService;
  });

  describe('burnDMT', () => {
    const mockUserId = '11111111111111111111111111111111';

    it('should burn 30% of minting fees', async () => {
      const burnRequest: BurnRequest = {
        amount: 100,
        source: 'minting',
        userId: mockUserId
      };

      const result = await burningService.burnDMT(burnRequest);
      
      expect(result.success).toBe(true);
      expect(result.burnedAmount).toBe(30); // 30% of 100
    });

    it('should burn 20% of subscription fees', async () => {
      const burnRequest: BurnRequest = {
        amount: 29,
        source: 'subscription',
        userId: mockUserId
      };

      const result = await burningService.burnDMT(burnRequest);
      
      expect(result.success).toBe(true);
      expect(result.burnedAmount).toBe(5.8); // 20% of 29
    });

    it('should burn 15% of upgrade fees', async () => {
      const burnRequest: BurnRequest = {
        amount: 100,
        source: 'upgrade',
        userId: mockUserId
      };

      const result = await burningService.burnDMT(burnRequest);
      
      expect(result.success).toBe(true);
      expect(result.burnedAmount).toBe(15); // 15% of 100
    });

    it('should burn 20% of marketplace fees', async () => {
      const burnRequest: BurnRequest = {
        amount: 50,
        source: 'marketplace',
        userId: mockUserId
      };

      const result = await burningService.burnDMT(burnRequest);
      
      expect(result.success).toBe(true);
      expect(result.burnedAmount).toBe(10); // 20% of 50
    });

    it('should burn 10% of DAO treasury', async () => {
      const burnRequest: BurnRequest = {
        amount: 1000,
        source: 'dao',
        userId: 'dao-treasury'
      };

      const result = await burningService.burnDMT(burnRequest);
      
      expect(result.success).toBe(true);
      expect(result.burnedAmount).toBe(100); // 10% of 1000
    });

    it('should fail with invalid wallet address', async () => {
      const burnRequest: BurnRequest = {
        amount: 100,
        source: 'minting',
        userId: 'invalid-address'
      };

      const result = await burningService.burnDMT(burnRequest);
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid wallet address');
    });

    it('should fail with invalid source', async () => {
      const burnRequest: BurnRequest = {
        amount: 100,
        source: 'invalid' as any,
        userId: mockUserId
      };

      const result = await burningService.burnDMT(burnRequest);
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid source');
    });

    it('should return 0 burned for 0 amount', async () => {
      const burnRequest: BurnRequest = {
        amount: 0,
        source: 'minting',
        userId: mockUserId
      };

      const result = await burningService.burnDMT(burnRequest);
      
      expect(result.success).toBe(true);
      expect(result.burnedAmount).toBe(0);
    });
  });

  describe('burnMintingFee', () => {
    const mockUserId = '11111111111111111111111111111111';

    it('should burn minting fee correctly', async () => {
      const result = await burningService.burnMintingFee(mockUserId, 100, 'agent123');
      
      expect(result.success).toBe(true);
      expect(result.burnedAmount).toBe(30); // 30% of 100
    });
  });

  describe('burnSubscriptionFee', () => {
    const mockUserId = '11111111111111111111111111111111';

    it('should burn subscription fee correctly', async () => {
      const result = await burningService.burnSubscriptionFee(mockUserId, 29, 'pro');
      
      expect(result.success).toBe(true);
      expect(result.burnedAmount).toBe(5.8); // 20% of 29
    });
  });

  describe('burnUpgradeFee', () => {
    const mockUserId = '11111111111111111111111111111111';

    it('should burn upgrade fee correctly', async () => {
      const result = await burningService.burnUpgradeFee(mockUserId, 100, 'agent123');
      
      expect(result.success).toBe(true);
      expect(result.burnedAmount).toBe(15); // 15% of 100
    });
  });

  describe('burnMarketplaceFee', () => {
    const mockUserId = '11111111111111111111111111111111';

    it('should burn marketplace fee correctly', async () => {
      const result = await burningService.burnMarketplaceFee(mockUserId, 50, 'agent123');
      
      expect(result.success).toBe(true);
      expect(result.burnedAmount).toBe(10); // 20% of 50
    });
  });

  describe('burnDAOTreasury', () => {
    it('should burn DAO treasury correctly', async () => {
      const result = await burningService.burnDAOTreasury(1000, 'proposal123');
      
      expect(result.success).toBe(true);
      expect(result.burnedAmount).toBe(100); // 10% of 1000
    });
  });

  describe('getBurningMetrics', () => {
    beforeEach(async () => {
      // Create test burn events
      await burningService.burnDMT({
        amount: 100,
        source: 'minting',
        userId: 'user1'
      });
      await burningService.burnDMT({
        amount: 29,
        source: 'subscription',
        userId: 'user2'
      });
      await burningService.burnDMT({
        amount: 100,
        source: 'upgrade',
        userId: 'user3'
      });
    });

    it('should return correct burning metrics', async () => {
      const metrics = await burningService.getBurningMetrics();
      
      expect(metrics.totalBurned).toBeGreaterThan(0);
      expect(metrics.mintingBurned).toBeGreaterThan(0);
      expect(metrics.subscriptionBurned).toBeGreaterThan(0);
      expect(metrics.upgradeBurned).toBeGreaterThan(0);
      expect(metrics.burnRate).toBeGreaterThanOrEqual(0);
      expect(metrics.dailyBurnRate).toBeGreaterThanOrEqual(0);
      expect(metrics.monthlyBurnRate).toBeGreaterThanOrEqual(0);
    });

    it('should have correct data types', async () => {
      const metrics = await burningService.getBurningMetrics();
      
      expect(typeof metrics.totalBurned).toBe('number');
      expect(typeof metrics.mintingBurned).toBe('number');
      expect(typeof metrics.subscriptionBurned).toBe('number');
      expect(typeof metrics.upgradeBurned).toBe('number');
      expect(typeof metrics.marketplaceBurned).toBe('number');
      expect(typeof metrics.daoBurned).toBe('number');
      expect(typeof metrics.lastBurnDate).toBe('string');
      expect(typeof metrics.burnRate).toBe('number');
      expect(typeof metrics.dailyBurnRate).toBe('number');
      expect(typeof metrics.monthlyBurnRate).toBe('number');
    });
  });

  describe('getAllBurnEvents', () => {
    beforeEach(async () => {
      // Create test burn events
      await burningService.burnDMT({
        amount: 100,
        source: 'minting',
        userId: 'user1'
      });
      await burningService.burnDMT({
        amount: 50,
        source: 'subscription',
        userId: 'user2'
      });
    });

    it('should return all burn events', async () => {
      const events = await burningService.getAllBurnEvents();
      
      expect(events.length).toBeGreaterThanOrEqual(2);
      expect(events[0]).toHaveProperty('amount');
      expect(events[0]).toHaveProperty('source');
      expect(events[0]).toHaveProperty('userId');
      expect(events[0]).toHaveProperty('timestamp');
    });
  });

  describe('getUserBurnEvents', () => {
    const mockUserId = '11111111111111111111111111111111';

    beforeEach(async () => {
      // Create test burn events for specific user
      await burningService.burnDMT({
        amount: 100,
        source: 'minting',
        userId: mockUserId
      });
      await burningService.burnDMT({
        amount: 50,
        source: 'subscription',
        userId: mockUserId
      });
    });

    it('should return burn events for specific user', async () => {
      const events = await burningService.getUserBurnEvents(mockUserId);
      
      expect(events.length).toBeGreaterThanOrEqual(2);
      events.forEach(event => {
        expect(event.userId).toBe(mockUserId);
      });
    });
  });

  describe('getBurnEventsBySource', () => {
    beforeEach(async () => {
      // Create test burn events
      await burningService.burnDMT({
        amount: 100,
        source: 'minting',
        userId: 'user1'
      });
      await burningService.burnDMT({
        amount: 50,
        source: 'subscription',
        userId: 'user2'
      });
    });

    it('should return burn events by source', async () => {
      const mintingEvents = await burningService.getBurnEventsBySource('minting');
      const subscriptionEvents = await burningService.getBurnEventsBySource('subscription');
      
      expect(mintingEvents.length).toBeGreaterThanOrEqual(1);
      expect(subscriptionEvents.length).toBeGreaterThanOrEqual(1);
      
      mintingEvents.forEach(event => {
        expect(event.source).toBe('minting');
      });
      
      subscriptionEvents.forEach(event => {
        expect(event.source).toBe('subscription');
      });
    });
  });

  describe('getTotalBurnedBySource', () => {
    beforeEach(async () => {
      // Create test burn events
      await burningService.burnDMT({
        amount: 100,
        source: 'minting',
        userId: 'user1'
      });
      await burningService.burnDMT({
        amount: 50,
        source: 'subscription',
        userId: 'user2'
      });
    });

    it('should calculate total burned by source', async () => {
      const mintingBurned = await burningService.getTotalBurnedBySource('minting');
      const subscriptionBurned = await burningService.getTotalBurnedBySource('subscription');
      
      expect(mintingBurned).toBeGreaterThanOrEqual(30); // 30% of 100
      expect(subscriptionBurned).toBeGreaterThanOrEqual(10); // 20% of 50
    });
  });

  describe('getBurningStats', () => {
    beforeEach(async () => {
      // Create test burn events
      await burningService.burnDMT({
        amount: 100,
        source: 'minting',
        userId: 'user1'
      });
      await burningService.burnDMT({
        amount: 50,
        source: 'subscription',
        userId: 'user2'
      });
    });

    it('should return burning statistics', async () => {
      const stats = await burningService.getBurningStats();
      
      expect(stats.totalBurnEvents).toBeGreaterThanOrEqual(2);
      expect(stats.totalBurned).toBeGreaterThan(0);
      expect(stats.averageBurnPerEvent).toBeGreaterThan(0);
      expect(typeof stats.mostActiveSource).toBe('string');
      expect(['increasing', 'decreasing', 'stable']).toContain(stats.burnTrend);
    });
  });
}); 