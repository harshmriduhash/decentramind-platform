# Manual Devnet Economic Flow Testing Checklist

**Date**: August 5, 2024  
**Status**: Ready for Manual Testing  
**Network**: Solana Devnet  
**URL**: http://localhost:3000

---

## 🎯 **TESTING OBJECTIVES**

Verify all core economic flows are working correctly on devnet:
- ✅ Subscription flows (all tiers)
- ✅ Agent minting and evolution
- ✅ Marketplace operations
- ✅ DAO operations
- ✅ Burning mechanisms
- ✅ Credit management

---

## 📋 **MANUAL TESTING CHECKLIST**

### **1. Subscription Flows Testing**

#### **Freemium Tier**
- [ ] Navigate to subscription page
- [ ] Select "Freemium" tier
- [ ] Confirm subscription creation
- [ ] Verify 5 credits granted
- [ ] Confirm no DMT burned (free tier)
- [ ] Check credit balance updates

#### **Basic Tier ($9)**
- [ ] Select "Basic" tier
- [ ] Confirm subscription creation
- [ ] Verify 20 credits granted
- [ ] Confirm 1.8 DMT burned (20% of $9)
- [ ] Check credit balance updates
- [ ] Verify burning metrics updated

#### **Pro Tier ($29)**
- [ ] Select "Pro" tier
- [ ] Confirm subscription creation
- [ ] Verify 50 credits granted
- [ ] Confirm 5.8 DMT burned (20% of $29)
- [ ] Check credit balance updates
- [ ] Verify burning metrics updated

#### **Enterprise Tier ($99)**
- [ ] Select "Enterprise" tier
- [ ] Confirm subscription creation
- [ ] Verify 200 credits granted
- [ ] Confirm 19.8 DMT burned (20% of $99)
- [ ] Check credit balance updates
- [ ] Verify burning metrics updated

### **2. Credit Management Testing**

#### **Credit Consumption**
- [ ] Use credits for agent operations
- [ ] Verify credit balance decreases
- [ ] Confirm credit usage tracking
- [ ] Test credit exhaustion scenarios

#### **Feature Access Control**
- [ ] Test feature access with different tiers
- [ ] Verify Pro tier has access to "Advanced Analytics"
- [ ] Confirm Basic tier has limited access
- [ ] Test Freemium tier restrictions

### **3. Agent Operations Testing**

#### **Agent Minting**
- [ ] Navigate to agent minting page
- [ ] Select agent type (Vision, Domain, etc.)
- [ ] Confirm subscription gating works
- [ ] Verify minting fee calculation
- [ ] Confirm 30% of minting fee burned
- [ ] Check agent creation success

#### **Agent Evolution**
- [ ] Select existing agent for upgrade
- [ ] Choose evolution type
- [ ] Confirm upgrade fee calculation
- [ ] Verify 15% of upgrade fee burned
- [ ] Check agent evolution success
- [ ] Verify agent stats updated

### **4. Burning Mechanisms Testing**

#### **Minting Fee Burning (30%)**
- [ ] Perform agent minting
- [ ] Verify 30% of fee burned
- [ ] Check burning metrics updated
- [ ] Confirm burn event recorded

#### **Subscription Fee Burning (20%)**
- [ ] Purchase paid subscription
- [ ] Verify 20% of fee burned
- [ ] Check burning metrics updated
- [ ] Confirm burn event recorded

#### **Upgrade Fee Burning (15%)**
- [ ] Perform agent upgrade
- [ ] Verify 15% of fee burned
- [ ] Check burning metrics updated
- [ ] Confirm burn event recorded

#### **Marketplace Fee Burning (20%)**
- [ ] Perform marketplace transaction
- [ ] Verify 20% of fee burned
- [ ] Check burning metrics updated
- [ ] Confirm burn event recorded

#### **DAO Treasury Burning (10%)**
- [ ] Simulate DAO proposal
- [ ] Verify 10% of treasury burned
- [ ] Check burning metrics updated
- [ ] Confirm burn event recorded

### **5. Blockchain Validation Testing**

#### **Solana Explorer Verification**
- [ ] Open Solana Explorer (devnet)
- [ ] Search for contract addresses
- [ ] Verify transaction history
- [ ] Confirm burn events on-chain
- [ ] Check wallet balance changes

#### **Contract Interaction Verification**
- [ ] Verify contract calls successful
- [ ] Confirm transaction confirmations
- [ ] Check gas fees reasonable
- [ ] Validate contract state changes

### **6. Economic Integration Testing**

#### **End-to-End Flow**
- [ ] Subscribe to Pro tier
- [ ] Mint agent with subscription
- [ ] Upgrade agent
- [ ] Use marketplace features
- [ ] Verify all economic flows work
- [ ] Confirm total burning metrics

#### **Credit Balance Tracking**
- [ ] Check initial credit balance
- [ ] Perform various operations
- [ ] Verify credit consumption
- [ ] Confirm balance updates correctly

### **7. API and Service Testing**

#### **Firebase Integration**
- [ ] Verify subscription data saved
- [ ] Check credit balance updates
- [ ] Confirm burning metrics stored
- [ ] Test data retrieval

#### **AI Service Integration**
- [ ] Test agent chat functionality
- [ ] Verify AI responses
- [ ] Check service credits usage
- [ ] Confirm API rate limiting

---

## 🚨 **BUG REPORTING TEMPLATE**

### **Critical Issues**
- [ ] Economic calculations incorrect
- [ ] Burning mechanisms not working
- [ ] Credit system failures
- [ ] Contract interaction errors
- [ ] Data persistence issues

### **Minor Issues**
- [ ] UI display problems
- [ ] Performance issues
- [ ] User experience problems
- [ ] Documentation gaps

### **Issue Report Format**
```
Issue: [Brief description]
Severity: Critical/Minor
Steps to Reproduce:
1. [Step 1]
2. [Step 2]
3. [Step 3]
Expected Result: [What should happen]
Actual Result: [What actually happened]
Environment: Devnet
Browser: [Chrome/Firefox/Safari]
Wallet: [Phantom/Solflare/etc.]
```

---

## 📊 **SUCCESS CRITERIA**

### **Must Pass (100%)**
- [ ] All subscription tiers work correctly
- [ ] All burning mechanisms function
- [ ] Credit system operates properly
- [ ] Agent operations work with gating
- [ ] Blockchain transactions succeed

### **Should Pass (90%+)**
- [ ] UI displays correctly
- [ ] Performance is acceptable
- [ ] Error handling works
- [ ] Data persistence functions

### **Nice to Have (80%+)**
- [ ] Advanced features work
- [ ] Analytics tracking functions
- [ ] User experience is smooth
- [ ] Documentation is complete

---

## 🎯 **TESTING INSTRUCTIONS**

1. **Start the application**: `npm run dev`
2. **Connect wallet**: Use Phantom or Solflare
3. **Switch to devnet**: Ensure wallet is on devnet
4. **Follow checklist**: Go through each test systematically
5. **Document results**: Note any issues or successes
6. **Report findings**: Update documentation with results

---

## 📈 **EXPECTED RESULTS**

### **Economic Model Verification**
- ✅ Freemium: 5 credits, 0 DMT burned
- ✅ Basic: 20 credits, 1.8 DMT burned
- ✅ Pro: 50 credits, 5.8 DMT burned
- ✅ Enterprise: 200 credits, 19.8 DMT burned

### **Burning Rates Verification**
- ✅ Minting: 30% burned
- ✅ Subscription: 20% burned
- ✅ Upgrade: 15% burned
- ✅ Marketplace: 20% burned
- ✅ DAO: 10% burned

### **Integration Verification**
- ✅ Subscription + Minting + Burning = Working
- ✅ Credit consumption + Feature gating = Working
- ✅ Agent operations + Economic flows = Working
- ✅ Blockchain + Backend + UI = Working

---

**🎯 GOAL**: Achieve 100% confidence in all core economic flows before mainnet launch. 