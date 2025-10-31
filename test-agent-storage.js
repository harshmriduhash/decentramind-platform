// Test script for agent storage
// Run this in the browser console to test agent storage functionality

// Test agent storage functionality
async function testAgentStorage() {
  console.log('Testing agent storage...');
  
  // Import the agent storage service
  const { agentStorage } = await import('./services/agent-storage.ts');
  
  // Test creating an agent
  console.log('Creating test agent...');
  const testAgent = await agentStorage.createAgent({
    name: 'Test Agent',
    type: 'master',
    domain: 'crypto',
    specialization: 'Test specialization',
    status: 'pending',
    metadata: {
      personality: 'Balanced',
      avatar: '🤖',
      level: 1,
      experience: 0,
      activities: [],
      environmentalScore: 0,
      socialScore: 0,
    }
  });
  
  console.log('Test agent created:', testAgent);
  
  // Test getting all agents
  console.log('Getting all agents...');
  const allAgents = agentStorage.getAllAgents();
  console.log('All agents:', allAgents);
  
  // Test getting agents in MintedAgent format
  console.log('Getting agents in MintedAgent format...');
  const mintedAgents = await agentStorage.getAgents();
  console.log('Minted agents:', mintedAgents);
  
  // Test getting pending agents
  console.log('Getting pending agents...');
  const pendingAgents = agentStorage.getPendingAgents();
  console.log('Pending agents:', pendingAgents);
  
  // Test getting agent stats
  console.log('Getting agent stats...');
  const stats = agentStorage.getAgentStats();
  console.log('Agent stats:', stats);
  
  console.log('Agent storage test completed!');
}

// Run the test
testAgentStorage().catch(console.error); 