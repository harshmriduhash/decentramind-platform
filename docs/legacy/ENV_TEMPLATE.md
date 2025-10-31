# 🔧 Environment Variables Template

## 📋 **Create `.env.local` file with these variables:**

```bash
# Firebase Configuration
# Replace these values with your actual Firebase project credentials
# Get these from: https://console.firebase.google.com/

# Firebase Client Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your-project-id-default-rtdb.firebaseio.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:your-app-id

# Firebase Admin SDK (for server-side authentication)
# Get these from: Firebase Console > Project Settings > Service Accounts > Generate New Private Key
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Private-Key-Here\n-----END PRIVATE KEY-----\n"
FIREBASE_DATABASE_URL=https://your-project-id-default-rtdb.firebaseio.com

# Solana Configuration
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_SOLANA_NETWORK=devnet

# Claude Code Hooks Configuration (for future integration)
CLAUDE_HOOKS_ENABLED=true
ELEVENLABS_API_KEY=your-elevenlabs-key
OPENAI_API_KEY=your-openai-key
```

## 🚀 **How to Get Firebase Credentials:**

### **Step 1: Create Firebase Project**
1. Go to https://console.firebase.google.com/
2. Click "Create a project"
3. Name: `decentramind-production`
4. Enable Google Analytics: ✅ Yes
5. Click "Create project"

### **Step 2: Get Client Configuration**
1. Go to Project Settings (gear icon)
2. Scroll to "Your apps"
3. Click "Add app" > Web
4. Register app: `decentramind-web`
5. Copy the config object
6. Replace the values in `.env.local`

### **Step 3: Get Admin SDK Credentials**
1. Go to Project Settings > Service Accounts
2. Click "Generate new private key"
3. Download the JSON file
4. Copy values to `.env.local`

### **Step 4: Enable Services**
1. **Authentication**: Go to Authentication > Sign-in method > Enable Custom
2. **Database**: Go to Realtime Database > Create database > Start in test mode
3. **Storage**: Go to Storage > Get started > Start in test mode

## 🧪 **Test Your Setup:**

1. Create `.env.local` file with your credentials
2. Run `npm run dev`
3. Go to http://localhost:3000
4. Check the "Firebase Integration Test" component
5. Should show "✅ Firebase Connected Successfully!"

## 🔒 **Security Notes:**

- Never commit `.env.local` to git
- Use different projects for development/staging/production
- Set up proper Firebase security rules
- Rotate keys regularly

---

**🚀 Once you have these environment variables set up, Firebase will be fully integrated!** 