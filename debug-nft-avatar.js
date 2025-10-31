/**
 * Debug Script: NFT Avatar Display Issue
 * 
 * This script helps debug why the Care Orchestrator's avatar is not displaying
 * its minted NFT image instead of the fallback emoji 🩺.
 */

console.log('🔍 NFT Avatar Debug Script Starting...');

// Check localStorage for cached NFTs
function checkLocalStorageNFTs() {
  console.log('\n📦 Checking localStorage for cached NFTs...');
  
  const nftKeys = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('nft_cache_')) {
      nftKeys.push(key);
    }
  }
  
  console.log('Found NFT cache keys:', nftKeys);
  
  nftKeys.forEach(key => {
    try {
      const data = JSON.parse(localStorage.getItem(key) || '{}');
      console.log(`\n🔍 NFT Cache Key: ${key}`);
      console.log('  - Mint Address:', data.mintAddress);
      console.log('  - Name:', data.metadata?.name);
      console.log('  - Symbol:', data.metadata?.symbol);
      console.log('  - Image URL:', data.metadata?.image);
      console.log('  - Cached At:', data.cachedAt);
      
      // Check if mint address is mock
      if (data.mintAddress && data.mintAddress.startsWith('mint_')) {
        console.warn('  ⚠️ WARNING: Mock mint address detected!');
        console.warn('  ⚠️ This is NOT a real Solana Base58 address!');
      }
    } catch (error) {
      console.error('  ❌ Failed to parse NFT data:', error);
    }
  });
  
  return nftKeys.length;
}

// Simulate NFT minting and caching
function simulateNFTCaching() {
  console.log('\n🎯 Simulating NFT minting and caching...');
  
  const mockWalletAddress = 'mock_wallet_address_123';
  const mockMintAddress = `mint_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const mockNFTMetadata = {
    name: 'Care Orchestrator',
    symbol: 'COAI',
    description: 'AI Healthcare Assistant Agent for DecentraMind Labs',
    image: 'https://ipfs.io/ipfs/bafybeidki742oakaxqxdk5u6s7zz4iinaszyyw62mpcmxmkcpo3m3qsm6a/david_859400_AI_Healthcare_Assistant_soft_glowing_humanoid_fo_249dd97f-c4a7-45a3-b0b6-ed8e71e6b9be_0.png',
    attributes: [
      { trait_type: 'Agent Type', value: 'Healthcare Assistant' },
      { trait_type: 'Level', value: 'Expert' },
      { trait_type: 'Domain', value: 'Health' },
      { trait_type: 'Rarity', value: 'Legendary' }
    ],
    collection: 'DecentraMind AI Agents',
    external_url: 'https://decentramind.com'
  };
  
  const cacheKey = `nft_cache_${mockWalletAddress}_${mockMintAddress}`;
  const cacheData = {
    userId: mockWalletAddress,
    mintAddress: mockMintAddress,
    metadata: mockNFTMetadata,
    cachedAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString()
  };
  
  try {
    localStorage.setItem(cacheKey, JSON.stringify(cacheData));
    console.log('✅ Mock NFT cached successfully!');
    console.log('  - Cache Key:', cacheKey);
    console.log('  - Mint Address:', mockMintAddress);
    console.log('  - Image URL:', mockNFTMetadata.image);
    console.warn('  ⚠️ WARNING: Mock mint address used!');
  } catch (error) {
    console.error('❌ Failed to cache mock NFT:', error);
  }
}

// Test image loading
function testImageLoading() {
  console.log('\n🖼️ Testing image loading...');
  
  const imageUrl = 'https://ipfs.io/ipfs/bafybeidki742oakaxqxdk5u6s7zz4iinaszyyw62mpcmxmkcpo3m3qsm6a/david_859400_AI_Healthcare_Assistant_soft_glowing_humanoid_fo_249dd97f-c4a7-45a3-b0b6-ed8e71e6b9be_0.png';
  
  const img = new Image();
  img.onload = () => {
    console.log('✅ Image loaded successfully!');
    console.log('  - URL:', imageUrl);
    console.log('  - Dimensions:', img.width, 'x', img.height);
  };
  img.onerror = () => {
    console.error('❌ Image failed to load!');
    console.error('  - URL:', imageUrl);
  };
  img.src = imageUrl;
}

// Main debug function
function runDebug() {
  console.log('🚀 Starting NFT Avatar Debug Analysis...\n');
  
  // Check existing localStorage
  const existingNFTs = checkLocalStorageNFTs();
  
  if (existingNFTs === 0) {
    console.log('\n📝 No cached NFTs found. Simulating NFT minting...');
    simulateNFTCaching();
  }
  
  // Test image loading
  testImageLoading();
  
  console.log('\n🎯 Debug Analysis Complete!');
  console.log('\n📋 Summary:');
  console.log('1. Check browser console for NFT-related logs');
  console.log('2. Verify wallet connection status');
  console.log('3. Check if NFT metadata is properly cached');
  console.log('4. Verify image URL is accessible');
  console.log('5. Check if AgentCard is using NFT data correctly');
}

// Run debug if in browser
if (typeof window !== 'undefined') {
  runDebug();
} else {
  console.log('This script should be run in the browser console.');
}







