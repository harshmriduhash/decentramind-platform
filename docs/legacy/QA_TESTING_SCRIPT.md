# 🔍 **COMPREHENSIVE QA TESTING SCRIPT**
## DecentraMind Platform - End-to-End Testing

---

## **TESTING PHASE 1: AGENT MANAGEMENT**

### **1.1 Agent Minting Test**
**Steps:**
1. Navigate to Agent Minting Studio
2. Fill in agent details:
   - Name: "Test Agent QA"
   - Domain: "Productivity"
   - Description: "QA testing agent"
   - Personality: "Analytical"
3. Click "Mint Agent"
4. **Expected:** Agent appears in list with proper details
5. **Verify:** Agent data persists after page reload

### **1.2 Agent Editing Test**
**Steps:**
1. Find the minted agent in the list
2. Click "Edit" button
3. Change agent name to "Updated Test Agent"
4. Click "Save"
5. **Expected:** Agent name updates in list
6. **Verify:** Changes persist after page reload

### **1.3 Agent Upgrade Test**
**Steps:**
1. Click "Upgrade" on an agent
2. **Expected:** AgentUpgradeModal opens with:
   - Current level and XP display
   - Upgrade cost calculation
   - Benefits breakdown
   - Wallet balance check
3. Connect wallet if not connected
4. Click "Upgrade Agent"
5. **Expected:** Wallet signature prompt
6. **Verify:** Agent level increases, XP updates

### **1.4 Agent Deletion Test**
**Steps:**
1. Click "Delete" on an agent
2. **Expected:** Confirmation dialog
3. Confirm deletion
4. **Expected:** Agent removed from list
5. **Verify:** Agent doesn't reappear after reload

---

## **TESTING PHASE 2: STAKING & UNSTAKING**

### **2.1 Staking Test**
**Steps:**
1. Navigate to Staking tab
2. Enter stake amount: 100 DMT
3. Click "Stake"
4. **Expected:** 
   - Wallet signature prompt
   - Balance validation
   - Success toast notification
   - Staking position appears in list
5. **Verify:** Position persists after reload

### **2.2 Unstaking Test**
**Steps:**
1. Find active staking position
2. Enter unstake amount: 50 DMT
3. Click "Unstake"
4. **Expected:**
   - Penalty calculation display
   - Wallet signature prompt
   - Success notification with rewards/penalty
5. **Verify:** Position updates or removes correctly

### **2.3 Edge Cases**
**Steps:**
1. Try staking with insufficient balance
2. **Expected:** Error message about insufficient balance
3. Try staking with wallet disconnected
4. **Expected:** Prompt to connect wallet

---

## **TESTING PHASE 3: DMTX DAO GOVERNANCE**

### **3.1 Proposal Creation Test**
**Steps:**
1. Navigate to DMTX DAO tab
2. Click "Create Proposal"
3. Fill in details:
   - Title: "QA Test Proposal"
   - Description: "Testing proposal creation"
   - Type: "Governance"
4. Click "Create"
5. **Expected:**
   - 100 DMTX fee validation
   - Wallet signature prompt
   - Success notification
   - Proposal appears in list
6. **Verify:** Proposal persists after reload

### **3.2 Voting Test**
**Steps:**
1. Find active proposal
2. Click "Vote"
3. Enter vote amount: 50 DMT
4. Click "Submit Vote"
5. **Expected:**
   - Wallet signature prompt
   - Vote count updates
   - Success notification
6. **Verify:** Vote count persists after reload

### **3.3 Edge Cases**
**Steps:**
1. Try creating proposal with insufficient DMTX
2. **Expected:** Error about insufficient balance
3. Try voting with insufficient balance
4. **Expected:** Error about insufficient balance

---

## **TESTING PHASE 4: CHAT & CONTEXTUAL AI**

### **4.1 Context-Aware Responses Test**
**Steps:**
1. Navigate to Chat tab
2. Ask: "Show my staking information"
3. **Expected:** Response with actual staking data
4. Ask: "How many agents do I have?"
5. **Expected:** Response with actual agent count
6. Ask: "What are my current proposals?"
7. **Expected:** Response with actual proposal data

### **4.2 DecentraMind-Specific Queries Test**
**Steps:**
1. Ask: "How do I upgrade an agent?"
2. **Expected:** DecentraMind-specific upgrade guide
3. Ask: "What's the DMTX DAO process?"
4. **Expected:** DMTX-specific governance information
5. Ask: "Start a focus session"
6. **Expected:** DecentraMind focus session options

### **4.3 Edge Cases**
**Steps:**
1. Refresh browser
2. **Expected:** Chat history persists
3. Switch wallets
4. **Expected:** Context updates with new wallet data

---

## **TESTING PHASE 5: MASTER AGENT DASHBOARD**

### **5.1 Real Data Display Test**
**Steps:**
1. Navigate to Master Agent Dashboard
2. **Expected:** 
   - Real agent data displayed
   - Actual XP and level information
   - Task completion rates
3. Click on an agent
4. **Expected:** Detailed agent profile opens

### **5.2 Task Delegation Test**
**Steps:**
1. Click "Create Task"
2. Fill in task details:
   - Title: "QA Test Task"
   - Description: "Testing task delegation"
   - Assign To: "Productivity Agent"
   - Due Date: Tomorrow
3. Click "Create Task"
4. **Expected:** Task appears in task list
5. **Verify:** Task persists after reload

---

## **TESTING PHASE 6: LEARNING & FOCUS SESSIONS**

### **6.1 Learning Session Test**
**Steps:**
1. Navigate to Learning tab
2. Start a German learning session
3. **Expected:** Timer starts, progress tracked
4. Complete session
5. **Expected:** XP rewards, progress saved
6. **Verify:** Progress persists after reload

### **6.2 Focus Session Test**
**Steps:**
1. Start a 25-minute focus session
2. **Expected:** Timer with progress bar
3. Complete session
4. **Expected:** XP rewards, session logged
5. **Verify:** Session history persists

---

## **TESTING PHASE 7: UI/UX & NOTIFICATIONS**

### **7.1 Toast Notifications Test**
**Steps:**
1. Perform any action (mint, stake, vote)
2. **Expected:** Appropriate toast notification
3. Try invalid actions (insufficient balance)
4. **Expected:** Error toast notification

### **7.2 Wallet Integration Test**
**Steps:**
1. Disconnect wallet
2. Try to perform wallet-required action
3. **Expected:** Prompt to connect wallet
4. Connect wallet
5. **Expected:** Action proceeds normally

### **7.3 Branding Test**
**Steps:**
1. Check all component names
2. **Expected:** DecentraMind-specific terminology
3. Look for any "TikTok-style" references
4. **Expected:** None found

---

## **TESTING PHASE 8: DATA PERSISTENCE**

### **8.1 Persistence Test**
**Steps:**
1. Perform various actions (mint, stake, vote)
2. Refresh browser
3. **Expected:** All data persists
4. Disconnect and reconnect wallet
5. **Expected:** Data remains intact

### **8.2 Error Handling Test**
**Steps:**
1. Disconnect internet
2. Try to perform actions
3. **Expected:** Graceful error handling
4. Reconnect internet
5. **Expected:** Actions work normally

---

## **BUG REPORTING TEMPLATE**

### **Bug Found:**
- **Feature:** [Agent Management/Staking/DAO/etc.]
- **Steps to Reproduce:** [Detailed steps]
- **Expected Behavior:** [What should happen]
- **Actual Behavior:** [What actually happens]
- **Error Messages:** [Any error messages]
- **Screenshots:** [If applicable]
- **Severity:** [Critical/High/Medium/Low]

---

## **SUCCESS CRITERIA**

### **✅ All Features Must:**
1. Work with real wallet connections
2. Provide appropriate feedback (toasts)
3. Handle errors gracefully
4. Persist data correctly
5. Use DecentraMind branding
6. Not have silent failures

### **❌ Do NOT Mark as Working If:**
1. Only works with mocks
2. Fails silently
3. Doesn't persist data
4. Uses generic responses
5. Has undefined errors
6. Doesn't require wallet signatures where needed

---

## **FINAL VERIFICATION**

After completing all tests:
1. **Document all working features**
2. **Document all broken features**
3. **Provide screenshots/recordings**
4. **Rate overall platform readiness**
5. **Provide improvement suggestions**

**Only mark as "Production Ready" if ALL critical features work as intended for real users.** 