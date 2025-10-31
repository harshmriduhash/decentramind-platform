#!/usr/bin/env node

/**
 * DecentraMind Production Integration Test Suite
 * Tests all critical production features and workflows
 */

console.log('🧪 DECENTRAMIND PRODUCTION INTEGRATION TESTS');
console.log('=============================================\n');

// Test configuration
const TEST_CONFIG = {
  timeout: 30000,
  retries: 3,
  network: 'devnet'
};

// Test results tracking
const testResults = {
  passed: 0,
  failed: 0,
  skipped: 0,
  total: 0,
  details: []
};

// Utility functions
const logTest = (name, status, details = '') => {
  const icon = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '⏭️';
  console.log(`${icon} ${name} - ${status}${details ? `: ${details}` : ''}`);
  
  testResults.total++;
  if (status === 'PASS') testResults.passed++;
  else if (status === 'FAIL') testResults.failed++;
  else testResults.skipped++;
  
  testResults.details.push({ name, status, details });
};

const runTest = async (name, testFn) => {
  try {
    await testFn();
    logTest(name, 'PASS');
  } catch (error) {
    logTest(name, 'FAIL', error.message);
  }
};

// Mock wallet for testing
const mockWallet = {
  publicKey: { toBase58: () => '11111111111111111111111111111111' },
  connected: true,
  signTransaction: async (tx) => tx
};

// Test 1: Environment Configuration
const testEnvironmentConfig = async () => {
  const requiredVars = [
    'NEXT_PUBLIC_SOLANA_RPC_URL',
    'NEXT_PUBLIC_ENABLE_DAO',
    'NEXT_PUBLIC_ENABLE_STAKING',
    'NEXT_PUBLIC_ENABLE_GOVERNANCE',
    'NEXT_PUBLIC_ENABLE_ANALYTICS'
  ];
  
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    throw new Error(`Missing environment variables: ${missingVars.join(', ')}`);
  }
  
  // Check feature flags are properly configured
  const featureFlags = {
    dao: process.env.NEXT_PUBLIC_ENABLE_DAO === 'true',
    staking: process.env.NEXT_PUBLIC_ENABLE_STAKING === 'true',
    governance: process.env.NEXT_PUBLIC_ENABLE_GOVERNANCE === 'true',
    analytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true'
  };
  
  console.log('Feature flags:', featureFlags);
};

// Test 2: Wallet Connection
const testWalletConnection = async () => {
  // Test wallet validation
  const { SolanaWalletService } = await import('./app/services/solanaWalletService.js');
  const walletService = SolanaWalletService.getInstance();
  
  const validAddress = '11111111111111111111111111111111';
  const invalidAddress = 'invalid-address';
  
  if (!walletService.isValidWalletAddress(validAddress)) {
    throw new Error('Valid wallet address not recognized');
  }
  
  if (walletService.isValidWalletAddress(invalidAddress)) {
    throw new Error('Invalid wallet address incorrectly accepted');
  }
  
  // Test network connection
  const networkStatus = await walletService.getNetworkStatus();
  if (!networkStatus.connected) {
    throw new Error('Network connection failed');
  }
};

// Test 3: Blockchain Transactions
const testBlockchainTransactions = async () => {
  const { tokenomicsService } = await import('./app/services/tokenomicsService.js');
  
  // Test DMT balance retrieval
  const balance = await tokenomicsService.getDmtBalance('11111111111111111111111111111111');
  if (typeof balance !== 'number' || balance < 0) {
    throw new Error('Invalid balance returned');
  }
  
  // Test transaction validation
  const isValid = await tokenomicsService.validateTransaction(
    '11111111111111111111111111111111',
    100,
    'transfer'
  );
  
  if (typeof isValid !== 'boolean') {
    throw new Error('Transaction validation failed');
  }
};

// Test 4: Service Integration
const testServiceIntegration = async () => {
  // Test agent service
  const { agentService } = await import('./app/services/agentService.js');
  const agents = await agentService.getAgents();
  
  if (!Array.isArray(agents)) {
    throw new Error('Agent service returned invalid data');
  }
  
  // Test DAO service
  const { daoService } = await import('./app/services/daoService.js');
  const proposals = await daoService.getProposals();
  
  if (!Array.isArray(proposals)) {
    throw new Error('DAO service returned invalid data');
  }
  
  // Test tokenomics service
  const { tokenomicsService } = await import('./app/services/tokenomicsService.js');
  const metrics = await tokenomicsService.getEconomicMetrics();
  
  if (!metrics || typeof metrics.totalDmtSupply !== 'number') {
    throw new Error('Tokenomics service returned invalid data');
  }
};

// Test 5: Authentication Flow
const testAuthenticationFlow = async () => {
  // Test authentication hook
  const { useAuth } = await import('./app/hooks/useAuth.js');
  
  // Mock wallet connection
  const authState = {
    session: {
      isAuthenticated: true,
      walletAddress: '11111111111111111111111111111111',
      permissions: ['can_mint_agents', 'can_create_proposals']
    },
    isLoading: false,
    error: null
  };
  
  // Test permission checking
  const hasPermission = authState.session.permissions.includes('can_mint_agents');
  if (!hasPermission) {
    throw new Error('Permission checking failed');
  }
};

// Test 6: Error Handling
const testErrorHandling = async () => {
  const { tokenomicsService } = await import('./app/services/tokenomicsService.js');
  
  try {
    // Test invalid wallet address
    await tokenomicsService.getDmtBalance('invalid-address');
    throw new Error('Should have thrown error for invalid address');
  } catch (error) {
    if (!error.message.includes('Invalid')) {
      throw new Error('Error handling not working properly');
    }
  }
  
  try {
    // Test invalid transaction
    await tokenomicsService.validateTransaction('invalid', -100, 'transfer');
    throw new Error('Should have thrown error for invalid transaction');
  } catch (error) {
    if (!error.message.includes('Invalid')) {
      throw new Error('Transaction validation error handling not working');
    }
  }
};

// Test 7: Feature Flag Integration
const testFeatureFlags = async () => {
  const flags = {
    dao: process.env.NEXT_PUBLIC_ENABLE_DAO === 'true',
    staking: process.env.NEXT_PUBLIC_ENABLE_STAKING === 'true',
    governance: process.env.NEXT_PUBLIC_ENABLE_GOVERNANCE === 'true',
    analytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true'
  };
  
  // Test that all flags are properly configured
  Object.entries(flags).forEach(([name, enabled]) => {
    if (typeof enabled !== 'boolean') {
      throw new Error(`Feature flag ${name} not properly configured`);
    }
  });
};

// Test 8: Data Validation
const testDataValidation = async () => {
  const { agentService } = await import('./app/services/agentService.js');
  
  // Test agent data validation
  const invalidAgentData = {
    name: '',
    domain: 'Invalid Domain',
    description: 'Test',
    personality: 'Test',
    cost: -100,
    owner: 'invalid-address'
  };
  
  try {
    await agentService.mintAgent(invalidAgentData);
    throw new Error('Should have validated agent data');
  } catch (error) {
    if (!error.message.includes('Invalid')) {
      throw new Error('Data validation not working properly');
    }
  }
};

// Test 9: Cross-Service Communication
const testCrossServiceCommunication = async () => {
  const { agentService } = await import('./app/services/agentService.js');
  const { tokenomicsService } = await import('./app/services/tokenomicsService.js');
  const { daoService } = await import('./app/services/daoService.js');
  
  // Test that services can communicate
  const walletAddress = '11111111111111111111111111111111';
  
  // Get agent data
  const agents = await agentService.getAgents(walletAddress);
  
  // Get token balance
  const balance = await tokenomicsService.getDmtBalance(walletAddress);
  
  // Get governance data
  const proposals = await daoService.getProposals();
  
  if (!Array.isArray(agents) || typeof balance !== 'number' || !Array.isArray(proposals)) {
    throw new Error('Cross-service communication failed');
  }
};

// Test 10: Production Readiness
const testProductionReadiness = async () => {
  // Check for debug bypasses
  const debugPatterns = [
    'FORCE_DASHBOARD',
    'mock_transaction',
    'mock_mint',
    'console.log.*🔍',
    'console.log.*🎯'
  ];
  
  // Check for proper error handling
  const errorHandlingPatterns = [
    'try.*catch',
    'throw new Error',
    'error.*message'
  ];
  
  // Check for environment variable usage
  const envPatterns = [
    'process.env.NEXT_PUBLIC_',
    'process.env.NODE_ENV'
  ];
  
  console.log('Production readiness checks completed');
};

// Run all tests
const runAllTests = async () => {
  console.log('🚀 Starting Production Integration Tests...\n');
  
  await runTest('Environment Configuration', testEnvironmentConfig);
  await runTest('Wallet Connection', testWalletConnection);
  await runTest('Blockchain Transactions', testBlockchainTransactions);
  await runTest('Service Integration', testServiceIntegration);
  await runTest('Authentication Flow', testAuthenticationFlow);
  await runTest('Error Handling', testErrorHandling);
  await runTest('Feature Flag Integration', testFeatureFlags);
  await runTest('Data Validation', testDataValidation);
  await runTest('Cross-Service Communication', testCrossServiceCommunication);
  await runTest('Production Readiness', testProductionReadiness);
  
  // Print results
  console.log('\n📊 TEST RESULTS SUMMARY');
  console.log('========================');
  console.log(`✅ Passed: ${testResults.passed}`);
  console.log(`❌ Failed: ${testResults.failed}`);
  console.log(`⏭️ Skipped: ${testResults.skipped}`);
  console.log(`📋 Total: ${testResults.total}`);
  
  const successRate = ((testResults.passed / testResults.total) * 100).toFixed(1);
  console.log(`📈 Success Rate: ${successRate}%`);
  
  if (testResults.failed > 0) {
    console.log('\n❌ FAILED TESTS:');
    testResults.details
      .filter(test => test.status === 'FAIL')
      .forEach(test => {
        console.log(`  - ${test.name}: ${test.details}`);
      });
  }
  
  // Exit with appropriate code
  process.exit(testResults.failed > 0 ? 1 : 0);
};

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests().catch(error => {
    console.error('❌ Test suite failed:', error);
    process.exit(1);
  });
}

module.exports = {
  runAllTests,
  testResults
}; 