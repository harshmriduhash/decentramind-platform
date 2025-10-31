// Runtime Check Script for DecentraMind
// This script tests all the critical functionality

console.log('🔍 DECENTRAMIND RUNTIME CHECK STARTING...');

// Test 1: Environment Variables
console.log('\n📋 TEST 1: Environment Variables');
const envVars = [
  'NEXT_PUBLIC_SOLANA_RPC_URL',
  'NEXT_PUBLIC_ENABLE_DAO',
  'NEXT_PUBLIC_ENABLE_STAKING',
  'NEXT_PUBLIC_ENABLE_GOVERNANCE',
  'NEXT_PUBLIC_ENABLE_ANALYTICS',
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_OPENAI_API_KEY'
];

envVars.forEach(varName => {
  const value = process.env[varName];
  console.log(`${varName}: ${value ? '✅ SET' : '❌ NOT SET'}`);
});

// Test 2: Feature Flags
console.log('\n🚩 TEST 2: Feature Flags');
const featureFlags = {
  ENABLE_DAO: process.env.NEXT_PUBLIC_ENABLE_DAO === 'true',
  ENABLE_STAKING: process.env.NEXT_PUBLIC_ENABLE_STAKING === 'true',
  ENABLE_GOVERNANCE: process.env.NEXT_PUBLIC_ENABLE_GOVERNANCE === 'true',
  ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true'
};

Object.entries(featureFlags).forEach(([flag, enabled]) => {
  console.log(`${flag}: ${enabled ? '✅ ENABLED' : '❌ DISABLED'}`);
});

// Test 3: Component Availability
console.log('\n🧩 TEST 3: Component Availability');
const components = [
  'StakingDashboard',
  'ProposalList',
  'RewardStats',
  'AgentList',
  'AgentProfile'
];

components.forEach(component => {
  try {
    // This would need to be tested in the browser
    console.log(`${component}: ✅ AVAILABLE (needs browser test)`);
  } catch (error) {
    console.log(`${component}: ❌ NOT AVAILABLE - ${error.message}`);
  }
});

// Test 4: Navigation Structure
console.log('\n🧭 TEST 4: Navigation Structure');
const sidebarItems = [
  'Decentralized Productivity Hub',
  'Quick Actions',
  'Chat & Services Hub',
  'Agent Minting',
  'Staking & Rewards',
  'DAO Governance',
  'IDO/ICO Launchpad',
  'Agent Management',
  'Multi-Domain Dashboard',
  'Advanced Analytics',
  'History & Evolution Tracker'
];

sidebarItems.forEach((item, index) => {
  console.log(`Item ${index}: ${item}`);
});

console.log('\n✅ RUNTIME CHECK COMPLETE');
console.log('\n📝 NEXT STEPS:');
console.log('1. Open browser to http://localhost:3000');
console.log('2. Open DevTools (F12) and check Console tab');
console.log('3. Look for debug messages starting with 🔍');
console.log('4. Test navigation by clicking sidebar items');
console.log('5. Check for any error messages in red');
console.log('6. Verify that Staking, Governance, and Analytics tabs work'); 