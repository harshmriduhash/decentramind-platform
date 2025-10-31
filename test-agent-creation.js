// Test script to debug agent creation and loading
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, getDocs, query, where } = require('firebase/firestore');

// Firebase config (you'll need to add your actual config)
const firebaseConfig = {
  // Add your Firebase config here
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function testAgentCreation() {
  try {
    console.log('Testing agent creation...');
    
    // Test creating a simple agent
    const testAgent = {
      name: 'Test Agent',
      domain: 'Health & Wellness',
      description: 'Test fitness agent',
      personality: 'Motivational',
      cost: 50,
      skills: ['Fitness Training'],
      type: 'sub',
      mintDate: new Date().toISOString(),
      owner: 'test-wallet-address',
      status: 'active',
      xp: 0,
      level: 1,
      performance: {
        tasksCompleted: 0,
        successRate: 100,
        averageResponseTime: 0
      },
      metadata: {
        model: 'gpt-4',
        version: '1.0.0',
        lastUpdated: new Date().toISOString()
      },
      llmConfig: {
        model: 'GPT-3.5',
        version: '3.5-turbo-0613',
        temperature: 0.7,
        maxTokens: 4096,
        contextWindow: 4096
      },
      ragConfig: {
        dataSource: 'test_data_source',
        vectorDB: 'test_vector_db',
        ipfsHash: 'Qmtest',
        knowledgeBase: ['fitness', 'health'],
        lastUpdated: new Date().toISOString()
      },
      evolutionHistory: [],
      individualStats: {
        totalUpgrades: 0,
        totalDmtSpent: 0,
        uniqueConversations: 0,
        domainExpertise: 10,
        lastActive: new Date().toISOString()
      }
    };

    // Add to Firestore
    const docRef = await addDoc(collection(db, 'agents'), testAgent);
    console.log('Agent created with ID:', docRef.id);

    // Test loading agents
    const agentsRef = collection(db, 'agents');
    const q = query(agentsRef, where('owner', '==', 'test-wallet-address'));
    const querySnapshot = await getDocs(q);
    
    console.log('Found agents:', querySnapshot.size);
    querySnapshot.forEach((doc) => {
      console.log('Agent:', doc.id, doc.data());
    });

  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the test
testAgentCreation(); 