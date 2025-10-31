# 🔐 Firebase Admin SDK Setup for Solana Authentication

## 🚨 **IMPORTANT: You need Firebase Admin SDK credentials for Solana authentication to work**

Your Firebase client configuration is set up, but the Solana authentication requires Firebase Admin SDK credentials.

---

## 📋 **Step 1: Get Firebase Admin SDK Credentials**

### **1.1 Go to Firebase Console**
1. Visit: https://console.firebase.google.com/
2. Select your project: `decentramind-af1c7`

### **1.2 Generate Service Account Key**
1. Go to **Project Settings** (gear icon)
2. Click **Service Accounts** tab
3. Click **Generate new private key**
4. Download the JSON file

### **1.3 Extract Credentials**
The downloaded JSON file contains:
```json
{
  "type": "service_account",
  "project_id": "decentramind-af1c7",
  "private_key_id": "your-private-key-id",
  "private_key": "-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@decentramind-af1c7.iam.gserviceaccount.com",
  "client_id": "your-client-id",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40decentramind-af1c7.iam.gserviceaccount.com"
}
```

---

## 🔧 **Step 2: Create Environment Variables**

### **2.1 Create `.env.local` file**
Create this file in your project root:

```bash
# Firebase Admin SDK (for server-side authentication)
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@decentramind-af1c7.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"

# Optional: Additional Firebase config
FIREBASE_PROJECT_ID=decentramind-af1c7
FIREBASE_DATABASE_URL=https://decentramind-af1c7-default-rtdb.firebaseio.com
```

### **2.2 Replace Placeholder Values**
- Replace `firebase-adminsdk-xxxxx@decentramind-af1c7.iam.gserviceaccount.com` with your actual `client_email`
- Replace `YOUR_PRIVATE_KEY_HERE` with your actual `private_key`

---

## 🧪 **Step 3: Test the Setup**

### **3.1 Start Development Server**
```bash
npm run dev
```

### **3.2 Test Solana Authentication**
1. Go to http://localhost:3000
2. Click "Connect Phantom" button
3. Connect your Phantom wallet
4. Click "Log In with Solana"
5. Should show "✅ Successfully logged in with Solana wallet!"

### **3.3 Check Firebase Console**
1. Go to Firebase Console > Authentication > Users
2. You should see a new user with your wallet address

---

## 🔒 **Security Notes**

### **Important Security Practices**
- ✅ Never commit `.env.local` to git
- ✅ Keep your private key secure
- ✅ Use different service accounts for dev/staging/prod
- ✅ Rotate keys regularly

### **Environment File Structure**
```
DecentraMind/
├── .env.local          # ✅ Create this (not in git)
├── .env.example        # ✅ Template (safe to commit)
├── app/
│   ├── lib/
│   │   └── firebase.ts # ✅ Client config
│   └── api/
│       └── auth/
│           └── solana/
│               └── route.ts # ✅ Server config
```

---

## 🚀 **What This Enables**

### **With Firebase Admin SDK, you can:**
- ✅ **Solana Wallet Authentication**: Users can log in with Phantom wallet
- ✅ **Custom Tokens**: Generate Firebase auth tokens from wallet signatures
- ✅ **Secure Backend**: Verify wallet signatures server-side
- ✅ **User Management**: Store user data in Firebase
- ✅ **Real-time Updates**: Sync data across devices

### **Authentication Flow**
1. User connects Phantom wallet
2. Frontend signs a message with wallet
3. Backend verifies signature
4. Backend creates Firebase custom token
5. Frontend logs in with Firebase token
6. User is authenticated in Firebase

---

## 🎯 **Next Steps After Setup**

### **Once Firebase Admin SDK is working:**
1. ✅ Test Solana authentication
2. ✅ Set up Firebase Realtime Database rules
3. ✅ Integrate Claude Code Hooks
4. ✅ Add 3D avatars and voice commands
5. ✅ Deploy to production

---

**🔐 Complete this setup to enable Solana wallet authentication in DecentraMind!** 