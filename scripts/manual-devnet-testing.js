#!/usr/bin/env node

/**
 * Manual Devnet Economic Flow Testing Script
 * 
 * This script performs comprehensive manual testing of all economic flows:
 * - Subscription flows (all tiers)
 * - Agent minting and evolution
 * - Marketplace operations
 * - DAO operations
 * - Burning mechanisms
 * - Credit management
 */

const { SubscriptionService } = require('../app/services/subscriptionService');
const { BurningService } = require('../app/services/burningService');
const { AgentService } = require('../app/services/agentService');

// Test configuration
const TEST_CONFIG = {
  userId: '11111111111111111111111111111111',
  agentId: 'agent-001',
  testAmounts: {
    minting: 100,
    subscription: 29,
    upgrade: 100,
    marketplace: 50,
    dao: 1000
  }
};

// Test results tracking
const testResults = {
  passed: 0,
  failed: 0,
  errors: [],
  details: []
};

function logTest(name, result, details = '') {
  const status = result ? '✅ PASS' : '❌ FAIL';
  console.log(`${status} ${name}`);
  if (details) console.log(`   ${details}`);
  
  if (result) {
    testResults.passed++;
  } else {
    testResults.failed++;
    testResults.errors.push({ name, details });
  }
  
  testResults.details.push({ name, result, details });
}

async function testSubscriptionFlows() {
  console.log('\n🎯 TESTING SUBSCRIPTION FLOWS');
  console.log('================================');
  
  const subscriptionService = SubscriptionService.getInstance();
  
  // Test 1: Freemium subscription
  try {
    const freemiumResult = await subscriptionService.subscribe(TEST_CONFIG.userId, 'freemium');
    logTest(
      'Freemium Subscription',
      freemiumResult.success && freemiumResult.creditsGranted === 5,
      `Credits: ${freemiumResult.creditsGranted}, Burned: ${freemiumResult.burnedAmount}`
    );
  } catch (error) {
    logTest('Freemium Subscription', false, error.message);
  }
  
  // Test 2: Basic subscription
  try {
    const basicResult = await subscriptionService.subscribe(TEST_CONFIG.userId, 'basic');
    logTest(
      'Basic Subscription',
      basicResult.success && basicResult.creditsGranted === 20 && basicResult.burnedAmount === 1.8,
      `Credits: ${basicResult.creditsGranted}, Burned: ${basicResult.burnedAmount}`
    );
  } catch (error) {
    logTest('Basic Subscription', false, error.message);
  }
  
  // Test 3: Pro subscription
  try {
    const proResult = await subscriptionService.subscribe(TEST_CONFIG.userId, 'pro');
    logTest(
      'Pro Subscription',
      proResult.success && proResult.creditsGranted === 50,
      `Credits: ${proResult.creditsGranted}, Burned: ${proResult.burnedAmount}`
    );
  } catch (error) {
    logTest('Pro Subscription', false, error.message);
  }
  
  // Test 4: Enterprise subscription
  try {
    const enterpriseResult = await subscriptionService.subscribe(TEST_CONFIG.userId, 'enterprise');
    logTest(
      'Enterprise Subscription',
      enterpriseResult.success && enterpriseResult.creditsGranted === 200,
      `Credits: ${enterpriseResult.creditsGranted}, Burned: ${enterpriseResult.burnedAmount}`
    );
  } catch (error) {
    logTest('Enterprise Subscription', false, error.message);
  }
  
  // Test 5: Credit consumption
  try {
    const creditResult = await subscriptionService.useCredits(TEST_CONFIG.userId, 5);
    logTest(
      'Credit Consumption',
      creditResult,
      'Credits consumed successfully'
    );
  } catch (error) {
    logTest('Credit Consumption', false, error.message);
  }
  
  // Test 6: Feature access
  try {
    const featureAccess = await subscriptionService.hasFeatureAccess(TEST_CONFIG.userId, 'Advanced Analytics');
    logTest(
      'Feature Access Control',
      featureAccess,
      'Feature access validated'
    );
  } catch (error) {
    logTest('Feature Access Control', false, error.message);
  }
}

async function testBurningMechanisms() {
  console.log('\n🔥 TESTING BURNING MECHANISMS');
  console.log('===============================');
  
  const burningService = BurningService.getInstance();
  
  // Test 1: Minting fee burning (30%)
  try {
    const mintingBurn = await burningService.burnMintingFee(TEST_CONFIG.userId, TEST_CONFIG.testAmounts.minting, TEST_CONFIG.agentId);
    logTest(
      'Minting Fee Burning (30%)',
      mintingBurn.success && mintingBurn.burnedAmount === 30,
      `Burned: ${mintingBurn.burnedAmount} DMT`
    );
  } catch (error) {
    logTest('Minting Fee Burning', false, error.message);
  }
  
  // Test 2: Subscription fee burning (20%)
  try {
    const subscriptionBurn = await burningService.burnSubscriptionFee(TEST_CONFIG.userId, TEST_CONFIG.testAmounts.subscription, 'pro');
    logTest(
      'Subscription Fee Burning (20%)',
      subscriptionBurn.success && Math.abs(subscriptionBurn.burnedAmount - 5.8) < 0.01,
      `Burned: ${subscriptionBurn.burnedAmount} DMT`
    );
  } catch (error) {
    logTest('Subscription Fee Burning', false, error.message);
  }
  
  // Test 3: Upgrade fee burning (15%)
  try {
    const upgradeBurn = await burningService.burnUpgradeFee(TEST_CONFIG.userId, TEST_CONFIG.testAmounts.upgrade, TEST_CONFIG.agentId);
    logTest(
      'Upgrade Fee Burning (15%)',
      upgradeBurn.success && upgradeBurn.burnedAmount === 15,
      `Burned: ${upgradeBurn.burnedAmount} DMT`
    );
  } catch (error) {
    logTest('Upgrade Fee Burning', false, error.message);
  }
  
  // Test 4: Marketplace fee burning (20%)
  try {
    const marketplaceBurn = await burningService.burnMarketplaceFee(TEST_CONFIG.userId, TEST_CONFIG.testAmounts.marketplace, TEST_CONFIG.agentId);
    logTest(
      'Marketplace Fee Burning (20%)',
      marketplaceBurn.success && marketplaceBurn.burnedAmount === 10,
      `Burned: ${marketplaceBurn.burnedAmount} DMT`
    );
  } catch (error) {
    logTest('Marketplace Fee Burning', false, error.message);
  }
  
  // Test 5: DAO treasury burning (10%)
  try {
    const daoBurn = await burningService.burnDAOTreasury(TEST_CONFIG.testAmounts.dao, 'proposal-123');
    logTest(
      'DAO Treasury Burning (10%)',
      daoBurn.success && daoBurn.burnedAmount === 100,
      `Burned: ${daoBurn.burnedAmount} DMT`
    );
  } catch (error) {
    logTest('DAO Treasury Burning', false, error.message);
  }
  
  // Test 6: Burning metrics
  try {
    const metrics = await burningService.getBurningMetrics();
    logTest(
      'Burning Metrics Tracking',
      metrics.totalBurned > 0,
      `Total Burned: ${metrics.totalBurned} DMT`
    );
  } catch (error) {
    logTest('Burning Metrics Tracking', false, error.message);
  }
}

async function testAgentOperations() {
  console.log('\n🤖 TESTING AGENT OPERATIONS');
  console.log('============================');
  
  const agentService = AgentService;
  
  // Test 1: Agent minting with subscription gating
  try {
    const mintResult = await agentService.mintAgent({
      userId: TEST_CONFIG.userId,
      agentType: 'vision',
      subscriptionTier: 'pro'
    });
    logTest(
      'Agent Minting with Subscription Gating',
      mintResult.success,
      `Agent ID: ${mintResult.agentId}, Burned: ${mintResult.burnedAmount}`
    );
  } catch (error) {
    logTest('Agent Minting', false, error.message);
  }
  
  // Test 2: Agent evolution with DMT burning
  try {
    const evolutionResult = await agentService.evolveAgent(TEST_CONFIG.agentId, {
      userId: TEST_CONFIG.userId,
      evolutionType: 'upgrade',
      subscriptionTier: 'pro'
    });
    logTest(
      'Agent Evolution with DMT Burning',
      evolutionResult.success,
      `Evolution: ${evolutionResult.evolutionType}, Burned: ${evolutionResult.burnedAmount}`
    );
  } catch (error) {
    logTest('Agent Evolution', false, error.message);
  }
}

async function testEconomicIntegration() {
  console.log('\n💰 TESTING ECONOMIC INTEGRATION');
  console.log('================================');
  
  // Test 1: End-to-end subscription flow
  try {
    const subscriptionService = SubscriptionService.getInstance();
    const burningService = BurningService.getInstance();
    
    // Subscribe to pro tier
    const subscription = await subscriptionService.subscribe(TEST_CONFIG.userId, 'pro');
    
    // Use credits
    const creditUsed = await subscriptionService.useCredits(TEST_CONFIG.userId, 10);
    
    // Check burning metrics
    const metrics = await burningService.getBurningMetrics();
    
    logTest(
      'End-to-End Economic Flow',
      subscription.success && creditUsed && metrics.totalBurned > 0,
      `Subscription: ${subscription.success}, Credits: ${creditUsed}, Total Burned: ${metrics.totalBurned}`
    );
  } catch (error) {
    logTest('End-to-End Economic Flow', false, error.message);
  }
  
  // Test 2: Credit balance tracking
  try {
    const subscriptionService = SubscriptionService.getInstance();
    const userSubscription = await subscriptionService.getUserSubscription(TEST_CONFIG.userId);
    
    logTest(
      'Credit Balance Tracking',
      userSubscription && userSubscription.credits >= 0,
      `Credits: ${userSubscription?.credits || 0}`
    );
  } catch (error) {
    logTest('Credit Balance Tracking', false, error.message);
  }
}

async function testBlockchainValidation() {
  console.log('\n🔗 TESTING BLOCKCHAIN VALIDATION');
  console.log('==================================');
  
  // Test 1: Solana connection
  try {
    const { Connection, clusterApiUrl } = require('@solana/web3.js');
    const connection = new Connection(clusterApiUrl('devnet'));
    const version = await connection.getVersion();
    
    logTest(
      'Solana Devnet Connection',
      version && version['solana-core'],
      `Version: ${version['solana-core']}`
    );
  } catch (error) {
    logTest('Solana Devnet Connection', false, error.message);
  }
  
  // Test 2: Wallet connection
  try {
    const { Keypair } = require('@solana/web3.js');
    const wallet = Keypair.generate();
    
    logTest(
      'Wallet Generation',
      wallet && wallet.publicKey,
      `Wallet: ${wallet.publicKey.toString()}`
    );
  } catch (error) {
    logTest('Wallet Generation', false, error.message);
  }
}

function generateTestReport() {
  console.log('\n📊 TEST RESULTS SUMMARY');
  console.log('========================');
  console.log(`✅ Passed: ${testResults.passed}`);
  console.log(`❌ Failed: ${testResults.failed}`);
  console.log(`📈 Success Rate: ${((testResults.passed / (testResults.passed + testResults.failed)) * 100).toFixed(1)}%`);
  
  if (testResults.errors.length > 0) {
    console.log('\n🚨 ERRORS FOUND:');
    testResults.errors.forEach((error, index) => {
      console.log(`${index + 1}. ${error.name}: ${error.details}`);
    });
  }
  
  console.log('\n🎯 RECOMMENDATIONS:');
  if (testResults.failed === 0) {
    console.log('✅ All tests passed! Ready for production deployment.');
  } else if (testResults.passed > testResults.failed) {
    console.log('⚠️  Most tests passed. Review failed tests before production.');
  } else {
    console.log('❌ Multiple test failures. Fix issues before proceeding.');
  }
  
  return {
    passed: testResults.passed,
    failed: testResults.failed,
    successRate: (testResults.passed / (testResults.passed + testResults.failed)) * 100,
    errors: testResults.errors
  };
}

async function runAllTests() {
  console.log('🚀 STARTING MANUAL DEVNET ECONOMIC FLOW TESTING');
  console.log('================================================');
  console.log(`Test User ID: ${TEST_CONFIG.userId}`);
  console.log(`Test Agent ID: ${TEST_CONFIG.agentId}`);
  console.log(`Network: Devnet`);
  console.log(`Timestamp: ${new Date().toISOString()}`);
  
  try {
    await testSubscriptionFlows();
    await testBurningMechanisms();
    await testAgentOperations();
    await testEconomicIntegration();
    await testBlockchainValidation();
    
    const report = generateTestReport();
    
    // Save test results
    const fs = require('fs');
    const testReport = {
      timestamp: new Date().toISOString(),
      network: 'devnet',
      results: report,
      details: testResults.details
    };
    
    fs.writeFileSync('test-results-manual.json', JSON.stringify(testReport, null, 2));
    console.log('\n💾 Test results saved to test-results-manual.json');
    
    return report;
  } catch (error) {
    console.error('❌ Test execution failed:', error);
    return { passed: 0, failed: 1, successRate: 0, errors: [error.message] };
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  runAllTests().then(report => {
    process.exit(report.failed > 0 ? 1 : 0);
  });
}

module.exports = { runAllTests, testResults }; 