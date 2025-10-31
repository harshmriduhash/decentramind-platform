# 🔥 Firebase Integration Guide for DecentraMind

## 📋 Prerequisites
- Google account
- Node.js and npm installed
- DecentraMind project set up

## 🚀 Step 1: Create Firebase Project

### 1.1 Go to Firebase Console
- Visit [console.firebase.google.com](https://console.firebase.google.com)
- Click "Create a project"
- Enter project name: `decentramind`
- Enable Google Analytics (optional)
- Click "Create project"

### 1.2 Configure Project Settings
- Go to Project Settings (gear icon)
- Copy the Firebase config object
- Note down your `projectId`, `apiKey`, and other credentials

## 🔐 Step 2: Enable Authentication

### 2.1 Set Up Custom Authentication
- Go to Authentication > Sign-in method
- Enable "Custom" provider
- This allows Solana wallet authentication

### 2.2 Configure Security Rules
```javascript
// In Firebase Console > Authentication > Settings > Service accounts
// Download the service account key JSON file
```

## 🗄️ Step 3: Set Up Realtime Database

### 3.1 Create Database
- Go to Realtime Database
- Click "Create database"
- Choose "Start in test mode" for development
- Select a location (us-central1 recommended)

### 3.2 Database Structure
```json
{
  "users": {
    "$userId": {
      "agents": {
        "$agentId": {
          "id": "string",
          "name": "string",
          "type": "VisionSync|DomainSync",
          "level": "number",
          "xp": "number",
          "performance": "number",
          "tasks_completed": "number",
          "created_at": "number",
          "last_updated": "number",
          "owner": "string",
          "domain": "string",
          "personality": "string",
          "cost": "number",
          "skills": ["string"],
          "status": "active|inactive|training"
        }
      },
      "tasks": {
        "$taskId": {
          "id": "string",
          "agent_id": "string",
          "title": "string",
          "description": "string",
          "status": "pending|completed|failed",
          "xp_reward": "number",
          "dmt_reward": "number",
          "created_at": "number",
          "completed_at": "number",
          "owner": "string"
        }
      },
      "user_metrics": {
        "daily_life_score": "number",
        "focus_time_minutes": "number",
        "streak_days": "number",
        "active_agents": "number",
        "total_xp": "number",
        "total_dmt_earned": "number",
        "total_co2_reduced": "number",
        "last_updated": "number"
      }
    }
  },
  "messages": {
    "$messageId": {
      "id": "string",
      "sender_id": "string",
      "receiver_id": "string",
      "content": "string",
      "message_type": "text|image|file",
      "encrypted": "boolean",
      "created_at": "number",
      "read": "boolean"
    }
  },
  "co2_tracking": {
    "$userId": {
      "$entryId": {
        "id": "string",
        "user_id": "string",
        "category": "string",
        "amount": "number",
        "description": "string",
        "date": "string",
        "created_at": "number"
      }
    }
  },
  "rewards": {
    "$rewardId": {
      "id": "string",
      "user_id": "string",
      "type": "task|proposal|co2_reduction|staking",
      "amount": "number",
      "description": "string",
      "created_at": "number",
      "claimed": "boolean"
    }
  }
}
```

## 📁 Step 4: Set Up Storage

### 4.1 Enable Storage
- Go to Storage
- Click "Get started"
- Choose "Start in test mode"
- Select a location

### 4.2 Storage Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 🌐 Step 5: Configure Hosting

### 5.1 Install Firebase CLI
```bash
npm install -g firebase-tools
```

### 5.2 Login to Firebase
```bash
firebase login
```

### 5.3 Initialize Firebase in Project
```bash
cd /path/to/decentramind
firebase init
```

### 5.4 Select Services
- ✅ Hosting
- ✅ Realtime Database
- ✅ Storage
- ✅ Functions (optional)

### 5.5 Configure Hosting
- Public directory: `out` (for Next.js static export)
- Single-page app: Yes
- GitHub Actions: No (for now)

## 🔧 Step 6: Environment Variables

### 6.1 Create .env.local
```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# Firebase Admin (for server-side)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account-email
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com
```

### 6.2 Get Service Account Key
- Go to Project Settings > Service accounts
- Click "Generate new private key"
- Download JSON file
- Extract values for environment variables

## 📦 Step 7: Install Dependencies

### 7.1 Install Firebase SDK
```bash
npm install firebase@10
```

### 7.2 Install Firebase Admin (for server-side)
```bash
npm install firebase-admin
```

### 7.3 Install Redux Toolkit
```bash
npm install @reduxjs/toolkit react-redux
```

## 🧪 Step 8: Test Integration

### 8.1 Test Authentication
```bash
npm run dev
# Open http://localhost:3000
# Try connecting Phantom wallet
```

### 8.2 Test Database
- Create an agent
- Check Firebase Console > Realtime Database
- Verify data is saved

### 8.3 Test Storage
- Upload a file
- Check Firebase Console > Storage
- Verify file is uploaded

## 🚀 Step 9: Deploy to Firebase

### 9.1 Build for Production
```bash
npm run build
npm run export  # If using static export
```

### 9.2 Deploy
```bash
firebase deploy --only hosting
```

### 9.3 Verify Deployment
- Check the provided URL
- Test all functionality
- Monitor performance

## 🔒 Step 10: Security Rules

### 10.1 Database Rules
```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid",
        "agents": {
          ".read": "$uid === auth.uid",
          ".write": "$uid === auth.uid"
        },
        "tasks": {
          ".read": "$uid === auth.uid",
          ".write": "$uid === auth.uid"
        },
        "user_metrics": {
          ".read": "$uid === auth.uid",
          ".write": "$uid === auth.uid"
        }
      }
    },
    "messages": {
      "$messageId": {
        ".read": "data.child('sender_id').val() === auth.uid || data.child('receiver_id').val() === auth.uid",
        ".write": "newData.child('sender_id').val() === auth.uid"
      }
    },
    "co2_tracking": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    },
    "rewards": {
      "$rewardId": {
        ".read": "data.child('user_id').val() === auth.uid",
        ".write": "newData.child('user_id').val() === auth.uid"
      }
    }
  }
}
```

### 10.2 Storage Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /agents/{agentId}/{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 📊 Step 11: Monitoring & Analytics

### 11.1 Enable Analytics
- Go to Analytics in Firebase Console
- Set up events for:
  - Agent creation
  - Task completion
  - Wallet connection
  - CO2 tracking

### 11.2 Performance Monitoring
- Monitor response times
- Track error rates
- Set up alerts

## 🎯 Step 12: Production Checklist

- [ ] Firebase project created
- [ ] Authentication enabled
- [ ] Database configured
- [ ] Storage set up
- [ ] Hosting configured
- [ ] Environment variables set
- [ ] Dependencies installed
- [ ] Security rules applied
- [ ] Local testing completed
- [ ] Production deployment
- [ ] Monitoring enabled

## 🆘 Troubleshooting

### Common Issues:

1. **Authentication Errors**
   - Check API key in environment variables
   - Verify domain in Firebase Console
   - Check CORS settings

2. **Database Permission Errors**
   - Review security rules
   - Check user authentication status
   - Verify data structure

3. **Storage Upload Failures**
   - Check storage rules
   - Verify file size limits
   - Check authentication

4. **Deployment Issues**
   - Verify build output
   - Check Firebase CLI version
   - Review hosting configuration

## 📞 Support

For issues with this setup:
1. Check Firebase documentation
2. Review error logs in Firebase Console
3. Test with Firebase emulators locally
4. Contact Firebase support if needed

---

**🎉 Congratulations! Your DecentraMind app is now fully integrated with Firebase!** 