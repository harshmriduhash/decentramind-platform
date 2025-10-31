# DecentraMind Economic Flow Manual Testing Checklist

## 🎯 **Manual Devnet Economic Flow Testing**

### **Phase 1: Core Economic Features Verification**

#### **1. Subscription System Testing**
- [ ] **Freemium Tier Access**
  - [ ] Verify freemium tier is displayed as default
  - [ ] Check credit allocation (0 credits for freemium)
  - [ ] Test feature restrictions (limited agent creation)
  - [ ] Verify no burning occurs for freemium

- [ ] **Basic Tier Testing**
  - [ ] Navigate to Subscription Management
  - [ ] Select Basic tier (100 credits, $10 DMT)
  - [ ] Verify credit allocation updates
  - [ ] Check burning rate (20% of subscription fee)
  - [ ] Test feature access improvements

- [ ] **Pro Tier Testing**
  - [ ] Upgrade to Pro tier (500 credits, $50 DMT)
  - [ ] Verify credit allocation and burning
  - [ ] Test advanced features (priority support, custom features)
  - [ ] Check evolution limits (increased from Basic)

- [ ] **Enterprise Tier Testing**
  - [ ] Upgrade to Enterprise tier (2000 credits, $200 DMT)
  - [ ] Verify maximum feature access
  - [ ] Test custom features and priority support
  - [ ] Check unlimited agent creation

#### **2. Burning System Testing**
- [ ] **Minting Fee Burning**
  - [ ] Create a new AI agent
  - [ ] Verify 30% of minting fee is burned
  - [ ] Check burning metrics update
  - [ ] Verify transaction hash recording

- [ ] **Subscription Fee Burning**
  - [ ] Subscribe to any paid tier
  - [ ] Verify 20% of subscription fee is burned
  - [ ] Check burning analytics dashboard
  - [ ] Verify treasury allocation (70%)

- [ ] **Upgrade Fee Burning**
  - [ ] Upgrade agent to next evolution level
  - [ ] Verify 15% of upgrade fee is burned
  - [ ] Check burning metrics update

- [ ] **Marketplace Fee Burning**
  - [ ] List agent on marketplace
  - [ ] Verify 20% of marketplace fee is burned
  - [ ] Check burning analytics

- [ ] **DAO Treasury Burning**
  - [ ] Create DAO proposal
  - [ ] Verify 10% of DAO treasury burns
  - [ ] Check burning metrics

#### **3. Credit System Testing**
- [ ] **Credit Allocation**
  - [ ] Verify credits are allocated based on tier
  - [ ] Check credit usage tracking
  - [ ] Test credit depletion warnings

- [ ] **Credit Consumption**
  - [ ] Use credits for agent interactions
  - [ ] Verify credit deduction
  - [ ] Test credit purchase flow

- [ ] **Credit Management**
  - [ ] Purchase additional credits
  - [ ] Verify credit balance updates
  - [ ] Test credit expiration handling

#### **4. Agent Minting & Evolution Testing**
- [ ] **Agent Creation**
  - [ ] Create new AI agent
  - [ ] Verify minting cost (30% burned)
  - [ ] Check agent ownership assignment
  - [ ] Test agent capabilities

- [ ] **Agent Evolution**
  - [ ] Evolve agent to next level
  - [ ] Verify evolution cost (15% burned)
  - [ ] Check agent performance improvements
  - [ ] Test evolution limits by tier

- [ ] **Sub-Agent Architecture**
  - [ ] Create sub-agents
  - [ ] Verify sub-agent relationships
  - [ ] Test sub-agent interactions
  - [ ] Check sub-agent evolution

#### **5. Marketplace Operations Testing**
- [ ] **Agent Listing**
  - [ ] List agent on marketplace
  - [ ] Verify listing fee (20% burned)
  - [ ] Check marketplace visibility

- [ ] **Agent Trading**
  - [ ] Purchase agent from marketplace
  - [ ] Verify transaction fees
  - [ ] Check ownership transfer

- [ ] **Marketplace Analytics**
  - [ ] View marketplace statistics
  - [ ] Check trading volume
  - [ ] Verify fee distribution

#### **6. DAO Governance Testing**
- [ ] **Proposal Creation**
  - [ ] Create DAO proposal
  - [ ] Verify proposal fee (10% burned)
  - [ ] Check proposal visibility

- [ ] **Voting System**
  - [ ] Vote on proposals
  - [ ] Verify voting power calculation
  - [ ] Check vote recording

- [ ] **Proposal Execution**
  - [ ] Execute approved proposals
  - [ ] Verify treasury operations
  - [ ] Check governance metrics

### **Phase 2: Economic Dashboard Verification**

#### **7. Economic Status Bar Testing**
- [ ] **Real-time Updates**
  - [ ] Verify credit balance display
  - [ ] Check tier status display
  - [ ] Test burning metrics updates
  - [ ] Verify refresh functionality

- [ ] **Alert System**
  - [ ] Test low credit warnings
  - [ ] Check tier upgrade prompts
  - [ ] Verify burning alerts

#### **8. Subscription Dashboard Testing**
- [ ] **Tier Management**
  - [ ] View current tier
  - [ ] Test tier upgrade flow
  - [ ] Check tier downgrade options
  - [ ] Verify billing information

- [ ] **Credit Management**
  - [ ] View credit balance
  - [ ] Test credit purchase
  - [ ] Check credit usage history
  - [ ] Verify credit expiration

#### **9. Burning Analytics Dashboard Testing**
- [ ] **Burning Metrics**
  - [ ] View total burned amount
  - [ ] Check burning by source
  - [ ] Test burning trends
  - [ ] Verify burning rates

- [ ] **Analytics Features**
  - [ ] Test date range filtering
  - [ ] Check source filtering
  - [ ] Verify export functionality
  - [ ] Test real-time updates

### **Phase 3: Integration Testing**

#### **10. Service Integration Testing**
- [ ] **Firebase Integration**
  - [ ] Verify data persistence
  - [ ] Check real-time updates
  - [ ] Test offline functionality
  - [ ] Verify data synchronization

- [ ] **Solana Integration**
  - [ ] Test wallet connection
  - [ ] Verify transaction signing
  - [ ] Check balance updates
  - [ ] Test network switching

#### **11. UI/UX Testing**
- [ ] **Responsive Design**
  - [ ] Test mobile layout
  - [ ] Check tablet layout
  - [ ] Verify desktop layout
  - [ ] Test different screen sizes

- [ ] **User Experience**
  - [ ] Test navigation flow
  - [ ] Check loading states
  - [ ] Verify error handling
  - [ ] Test accessibility features

### **Phase 4: Performance Testing**

#### **12. Performance Verification**
- [ ] **Load Testing**
  - [ ] Test with multiple users
  - [ ] Check concurrent operations
  - [ ] Verify response times
  - [ ] Test memory usage

- [ ] **Stress Testing**
  - [ ] Test high transaction volume
  - [ ] Check system stability
  - [ ] Verify error recovery
  - [ ] Test network failures

### **Phase 5: Security Testing**

#### **13. Security Verification**
- [ ] **Authentication**
  - [ ] Test wallet authentication
  - [ ] Verify session management
  - [ ] Check authorization levels
  - [ ] Test logout functionality

- [ ] **Data Security**
  - [ ] Verify data encryption
  - [ ] Check secure transmission
  - [ ] Test input validation
  - [ ] Verify access controls

### **Testing Results Summary**

#### **✅ Passed Tests:**
- [ ] Economic Status Bar visible and functional
- [ ] Subscription Management accessible
- [ ] Burning Analytics dashboard loaded
- [ ] Basic UI components rendering

#### **⚠️ Issues Found:**
- [ ] Credit balance showing 0 (expected for new user)
- [ ] Tier showing "None" (expected for new user)
- [ ] Burning metrics showing 0.00 (expected for new user)

#### **🔧 Next Steps:**
1. Test actual economic transactions
2. Verify burning calculations
3. Test credit allocation
4. Verify tier upgrades
5. Test agent minting
6. Verify marketplace operations
7. Test DAO governance

### **Manual Testing Instructions:**

1. **Open Browser**: Navigate to `http://localhost:3000`
2. **Connect Wallet**: Use Solana wallet (Phantom, Solflare, etc.)
3. **Navigate Features**: Use sidebar to access different features
4. **Test Transactions**: Perform actual economic transactions
5. **Verify Results**: Check that all economic flows work correctly
6. **Document Issues**: Note any problems or unexpected behavior

### **Expected Outcomes:**
- All economic features should be fully functional
- Burning calculations should be accurate
- Credit system should work properly
- Tier upgrades should function correctly
- Agent minting should work with proper burning
- Marketplace should be operational
- DAO governance should be functional

---

**Status**: ✅ **READY FOR MANUAL TESTING**
**Server**: Running on `http://localhost:3000`
**Economic Components**: ✅ **VISIBLE AND FUNCTIONAL**
**Next Step**: Begin manual testing of economic flows 