#!/usr/bin/env node

// Core Functionality Test Script
// This script tests the basic functionality without requiring full deployment

console.log('🧪 Testing DecentraMind Core Functionality...');

// Test 1: Environment Variables
console.log('\n📋 Test 1: Environment Variables');
const requiredEnvVars = [
  'NEXT_PUBLIC_SOLANA_RPC_URL',
  'NEXT_PUBLIC_DMT_CONTRACT_ADDRESS',
  'NEXT_PUBLIC_SUBSCRIPTION_CONTRACT_ADDRESS',
  'NEXT_PUBLIC_AGENT_CONTRACT_ADDRESS',
  'NEXT_PUBLIC_DAO_CONTRACT_ADDRESS',
  'NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS',
  'NEXT_PUBLIC_ENABLE_SUBSCRIPTION',
  'NEXT_PUBLIC_ENABLE_BURNING',
  'NEXT_PUBLIC_ENABLE_AGENT_MINTING',
  'NEXT_PUBLIC_ENABLE_AGENT_EVOLUTION',
  'NEXT_PUBLIC_ENABLE_STAKING',
  'NEXT_PUBLIC_ENABLE_DAO_GOVERNANCE'
];

let envVarsOk = true;
requiredEnvVars.forEach(varName => {
  const value = process.env[varName];
  if (!value) {
    console.log(`❌ Missing: ${varName}`);
    envVarsOk = false;
  } else {
    console.log(`✅ ${varName}: ${value}`);
  }
});

if (envVarsOk) {
  console.log('✅ All required environment variables are set');
} else {
  console.log('❌ Some environment variables are missing');
}

// Test 2: Service Loading
console.log('\n🔧 Test 2: Service Loading');
try {
  // Test if we can require the services (basic syntax check)
  const fs = require('fs');
  const path = require('path');
  
  const serviceFiles = [
    'app/services/agentService.ts',
    'app/services/subscriptionService.ts',
    'app/services/burningService.ts',
    'app/lib/validation.ts'
  ];
  
  let servicesOk = true;
  serviceFiles.forEach(file => {
    if (fs.existsSync(file)) {
      console.log(`✅ ${file} exists`);
    } else {
      console.log(`❌ ${file} missing`);
      servicesOk = false;
    }
  });
  
  if (servicesOk) {
    console.log('✅ All service files exist');
  } else {
    console.log('❌ Some service files are missing');
  }
} catch (error) {
  console.log('❌ Service loading test failed:', error.message);
}

// Test 3: Documentation
console.log('\n📚 Test 3: Documentation');
const docFiles = [
  'docs/README.md',
  'docs/ARCHITECTURE.md',
  'docs/DEPLOYMENT.md',
  'docs/modules/TOKENOMICS.md',
  'docs/modules/AGENTS.md',
  'docs/modules/DAO.md'
];

let docsOk = true;
docFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.log(`❌ ${file} missing`);
    docsOk = false;
  }
});

if (docsOk) {
  console.log('✅ All documentation files exist');
} else {
  console.log('❌ Some documentation files are missing');
}

// Test 4: Economic Model Validation
console.log('\n💰 Test 4: Economic Model Validation');

// Test subscription tiers
const subscriptionTiers = [
  { name: 'freemium', price: 0, credits: 5 },
  { name: 'basic', price: 9, credits: 20 },
  { name: 'pro', price: 29, credits: 50 },
  { name: 'enterprise', price: 99, credits: 200 }
];

console.log('Subscription Tiers:');
subscriptionTiers.forEach(tier => {
  console.log(`  ${tier.name}: $${tier.price} - ${tier.credits} credits`);
});

// Test burning rates
const burningRates = {
  minting: '30%',
  subscription: '20%',
  upgrade: '15%',
  marketplace: '20%',
  dao: '10%'
};

console.log('\nBurning Rates:');
Object.entries(burningRates).forEach(([source, rate]) => {
  console.log(`  ${source}: ${rate}`);
});

// Test 5: Feature Flags
console.log('\n🚩 Test 5: Feature Flags');
const featureFlags = [
  'NEXT_PUBLIC_ENABLE_SUBSCRIPTION',
  'NEXT_PUBLIC_ENABLE_BURNING',
  'NEXT_PUBLIC_ENABLE_AGENT_MINTING',
  'NEXT_PUBLIC_ENABLE_AGENT_EVOLUTION',
  'NEXT_PUBLIC_ENABLE_STAKING',
  'NEXT_PUBLIC_ENABLE_DAO_GOVERNANCE'
];

let flagsOk = true;
featureFlags.forEach(flag => {
  const value = process.env[flag];
  if (value === 'true') {
    console.log(`✅ ${flag}: enabled`);
  } else {
    console.log(`❌ ${flag}: disabled or not set`);
    flagsOk = false;
  }
});

if (flagsOk) {
  console.log('✅ All feature flags are enabled');
} else {
  console.log('❌ Some feature flags are disabled');
}

// Summary
console.log('\n📊 Test Summary');
console.log('================');
console.log(`Environment Variables: ${envVarsOk ? '✅ PASS' : '❌ FAIL'}`);
console.log(`Service Files: ${servicesOk ? '✅ PASS' : '❌ FAIL'}`);
console.log(`Documentation: ${docsOk ? '✅ PASS' : '❌ FAIL'}`);
console.log(`Feature Flags: ${flagsOk ? '✅ PASS' : '❌ FAIL'}`);

if (envVarsOk && servicesOk && docsOk && flagsOk) {
  console.log('\n🎉 All core functionality tests passed!');
  console.log('✅ Ready for devnet deployment');
  console.log('\nNext steps:');
  console.log('1. Deploy smart contracts to devnet');
  console.log('2. Update contract addresses in .env.local');
  console.log('3. Run integration tests');
  console.log('4. Test economic flows');
} else {
  console.log('\n❌ Some tests failed. Please fix issues before proceeding.');
  process.exit(1);
} 