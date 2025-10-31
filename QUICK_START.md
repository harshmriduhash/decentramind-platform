# 🚀 DecentraMind Labs - Quick Start Guide

## ✅ CURRENT STATUS: RUNNING
**URL:** http://localhost:3000  
**Last Started:** September 27, 2025

---

## 🎯 Quick Commands

### Start Frontend (EASIEST)
```bash
cd /Users/davidbonillajaylen2022/DecentraMind
./start-frontend.sh
```

### Start Frontend (MANUAL)
```bash
cd /Users/davidbonillajaylen2022/DecentraMind
/Users/davidbonillajaylen2022/.nvm/versions/node/v20.10.0/bin/node -e "const next = require('next'); const app = next({ dev: true, port: 3000 }); app.prepare().then(() => { const server = require('http').createServer(app.getRequestHandler()); server.listen(3000, () => { console.log('🚀 DecentraMind Labs running on http://localhost:3000'); }); });" &
```

### Check Status
```bash
curl -s -I http://localhost:3000
```

### Stop Server
```bash
pkill -f "next dev" || pkill -f "node.*next"
```

---

## 🎨 What's Working

✅ **Complete Next.js App** with React 18  
✅ **Top Navigation** with dropdown menus  
✅ **Dark Theme** with neon cyan accents  
✅ **Responsive Design** for all devices  
✅ **All Routes** - No 404s  
✅ **Mobile Menu** with hamburger  
✅ **Status Bar** with DMT/XP  
✅ **Hover Animations** and transitions  

---

## 🧭 Navigation Structure

- **Dashboard** → Main dashboard
- **AI Agents** → Management, Workflows, Mint, Chat, Evolution, Marketplace
- **Token & Governance** → Tokenomics, DAO, Staking, Burning, Treasury, Voting
- **Services** → Contracts, Automation, Professional, Subscription, API, Support
- **Learn** → Getting Started, Agent Docs, DAO Guide, Tokenomics, Developers, Tutorials
- **Community** → Forum, Voting, Metaverse, Social, Events, Ambassadors
- **About** → Mission, Roadmap, Team, Version, Careers, Contact

---

## 🔧 Troubleshooting

### If Server Won't Start
1. Check if port 3000 is free: `lsof -i :3000`
2. Kill existing processes: `pkill -f "next dev"`
3. Try the manual command above

### If Pages Show 404
1. All routes are created and should work
2. Check browser console for errors
3. Restart the server

### If Styling Looks Wrong
1. Check if Tailwind CSS is loading
2. Verify dark theme classes are applied
3. Clear browser cache

---

## 📱 Features Available

- **Responsive Top Navigation** with mega dropdowns
- **Mobile Hamburger Menu** with collapsible submenus
- **Dark Theme** with glassmorphism effects
- **Neon Cyan Accents** throughout the UI
- **Hover Animations** and smooth transitions
- **Status Bar** showing DMT and XP
- **Active Page Highlighting** in navigation
- **All Route Pages** working without 404s

---

**🎊 Ready to use! Open http://localhost:3000 in your browser**

