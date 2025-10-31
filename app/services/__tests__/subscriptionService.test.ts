import SubscriptionService from '../subscriptionService';
import { SubscriptionTier } from '../subscriptionService';

describe('SubscriptionService', () => {
  let subscriptionService: any;

  beforeEach(() => {
    subscriptionService = SubscriptionService;
  });

  describe('getSubscriptionTiers', () => {
    it('should return all available subscription tiers', () => {
      const tiers = subscriptionService.getSubscriptionTiers();
      
      expect(tiers).toHaveLength(4);
      expect(tiers.map((tier: SubscriptionTier) => tier.name)).toEqual([
        'freemium', 'basic', 'pro', 'enterprise'
      ]);
    });

    it('should have correct pricing for each tier', () => {
      const tiers = subscriptionService.getSubscriptionTiers();
      
      const freemium = tiers.find((tier: SubscriptionTier) => tier.name === 'freemium');
      const basic = tiers.find((tier: SubscriptionTier) => tier.name === 'basic');
      const pro = tiers.find((tier: SubscriptionTier) => tier.name === 'pro');
      const enterprise = tiers.find((tier: SubscriptionTier) => tier.name === 'enterprise');
      
      expect(freemium?.price).toBe(0);
      expect(basic?.price).toBe(9);
      expect(pro?.price).toBe(29);
      expect(enterprise?.price).toBe(99);
    });

    it('should have correct burning rates', () => {
      const tiers = subscriptionService.getSubscriptionTiers();
      
      const freemium = tiers.find((tier: SubscriptionTier) => tier.name === 'freemium');
      const basic = tiers.find((tier: SubscriptionTier) => tier.name === 'basic');
      const pro = tiers.find((tier: SubscriptionTier) => tier.name === 'pro');
      const enterprise = tiers.find((tier: SubscriptionTier) => tier.name === 'enterprise');
      
      expect(freemium?.burningRate).toBe(0);
      expect(basic?.burningRate).toBe(20);
      expect(pro?.burningRate).toBe(20);
      expect(enterprise?.burningRate).toBe(20);
    });
  });

  describe('getTier', () => {
    it('should return correct tier by name', () => {
      const proTier = subscriptionService.getTier('pro');
      
      expect(proTier).toBeDefined();
      expect(proTier.name).toBe('pro');
      expect(proTier.price).toBe(29);
      expect(proTier.credits).toBe(50);
    });

    it('should return null for invalid tier', () => {
      const invalidTier = subscriptionService.getTier('invalid');
      
      expect(invalidTier).toBeNull();
    });
  });

  describe('subscribe', () => {
    const mockUserId = '11111111111111111111111111111111';

    it('should create freemium subscription successfully', async () => {
      const result = await subscriptionService.subscribe(mockUserId, 'freemium');
      
      expect(result.success).toBe(true);
      expect(result.creditsGranted).toBe(5);
      expect(result.burnedAmount).toBe(0);
      expect(result.treasuryAmount).toBe(0);
      expect(result.rewardsAmount).toBe(0);
    });

    it('should create pro subscription with burning', async () => {
      const result = await subscriptionService.subscribe(mockUserId, 'pro');
      
      expect(result.success).toBe(true);
      expect(result.creditsGranted).toBe(50);
      expect(result.burnedAmount).toBe(5.8); // 20% of 29
      expect(result.treasuryAmount).toBe(2.9); // 10% of 29
      expect(result.rewardsAmount).toBe(1.45); // 5% of 29
    });

    it('should fail with invalid wallet address', async () => {
      const result = await subscriptionService.subscribe('invalid-address', 'pro');
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid wallet address');
    });

    it('should fail with invalid tier', async () => {
      const result = await subscriptionService.subscribe(mockUserId, 'invalid-tier');
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid subscription tier');
    });
  });

  describe('hasFeatureAccess', () => {
    const mockUserId = '11111111111111111111111111111111';

    beforeEach(async () => {
      // Create a test subscription
      await subscriptionService.subscribe(mockUserId, 'pro');
    });

    it('should return true for features available in pro tier', async () => {
      const hasAccess = await subscriptionService.hasFeatureAccess(mockUserId, 'Advanced Analytics');
      
      expect(hasAccess).toBe(true);
    });

    it('should return false for features not in pro tier', async () => {
      const hasAccess = await subscriptionService.hasFeatureAccess(mockUserId, 'Custom Integrations');
      
      expect(hasAccess).toBe(false);
    });

    it('should return false for user without subscription', async () => {
      const hasAccess = await subscriptionService.hasFeatureAccess('different-user', 'Advanced Analytics');
      
      expect(hasAccess).toBe(false);
    });
  });

  describe('hasCredits', () => {
    const mockUserId = '11111111111111111111111111111111';

    beforeEach(async () => {
      // Create a test subscription
      await subscriptionService.subscribe(mockUserId, 'basic');
    });

    it('should return true when user has sufficient credits', async () => {
      const hasCredits = await subscriptionService.hasCredits(mockUserId, 1);
      
      expect(hasCredits).toBe(true);
    });

    it('should return false when user has insufficient credits', async () => {
      const hasCredits = await subscriptionService.hasCredits(mockUserId, 100);
      
      expect(hasCredits).toBe(false);
    });

    it('should return false for user without subscription', async () => {
      const hasCredits = await subscriptionService.hasCredits('different-user', 1);
      
      expect(hasCredits).toBe(false);
    });
  });

  describe('useCredits', () => {
    const mockUserId = '11111111111111111111111111111111';

    beforeEach(async () => {
      // Create a test subscription
      await subscriptionService.subscribe(mockUserId, 'basic');
    });

    it('should successfully use credits', async () => {
      const result = await subscriptionService.useCredits(mockUserId, 1);
      
      expect(result).toBe(true);
    });

    it('should fail when user has insufficient credits', async () => {
      const result = await subscriptionService.useCredits(mockUserId, 100);
      
      expect(result).toBe(false);
    });
  });

  describe('getSubscriptionStats', () => {
    beforeEach(async () => {
      // Create test subscriptions
      await subscriptionService.subscribe('user1', 'freemium');
      await subscriptionService.subscribe('user2', 'pro');
      await subscriptionService.subscribe('user3', 'enterprise');
    });

    it('should return correct subscription statistics', async () => {
      const stats = await subscriptionService.getSubscriptionStats();
      
      expect(stats.totalSubscriptions).toBeGreaterThanOrEqual(3);
      expect(stats.activeSubscriptions).toBeGreaterThanOrEqual(3);
      expect(stats.totalRevenue).toBeGreaterThan(0);
      expect(stats.totalBurned).toBeGreaterThan(0);
      expect(stats.tierDistribution).toBeDefined();
    });
  });
}); 