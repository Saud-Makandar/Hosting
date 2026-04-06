# 🚨 Emergency Alert System - Multi-Device Real-Time

A real-time emergency detection and alert system that works across multiple devices using WebSocket technology.

## 🎯 What This Does

- **Car Driver** runs on one device (PC/phone/tablet)
- **Hospitals** run on different devices (multiple PCs/phones/tablets)
- When driver clicks YES → ONE random hospital receives instant alert
- Real-time communication across devices (< 1 second latency)

---

## 🚀 Quick Start (Local)

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Server
```bash
npm start
```

### 3. Access
- **PC:** `http://localhost:3000/public/carDriver.html`
- **Mobile:** `http://YOUR_IP:3000/public/hospital1.html`

---

## 🌐 Deploy Online (FREE)

See **DEPLOYMENT-GUIDE.md** or **QUICK-DEPLOY.md** for step-by-step instructions.

**Deploy to Render.com in 5 minutes - completely free!**

---

## 📁 Project Structure

```
Projects/
├── server.js              # Main server with WebSocket
├── package.json           # Dependencies
├── public/                # Frontend files
│   ├── carDriver.html     # Car driver interface
│   ├── carDriver.js       # Car driver logic
│   ├── hospital1.html     # Hospital 1 interface
│   ├── hospital2.html     # Hospital 2 interface
│   ├── hospital3.html     # Hospital 3 interface
│   ├── hospital.js        # Shared hospital logic
│   └── styles.css         # Styling
└── DEPLOYMENT-GUIDE.md    # How to deploy online
```

---

## ✨ Features

- ✅ Real-time WebSocket communication
- ✅ Multi-device support (PC, phone, tablet)
- ✅ Random hospital selection
- ✅ 60-second countdown timer
- ✅ Auto-trigger on timeout
- ✅ Connection status indicators
- ✅ SMS integration (Twilio - optional)
- ✅ Automatic reconnection
- ✅ Cross-platform compatibility

---

## 🧪 Testing

1. Open car driver on one device
2. Open hospital on another device
3. Click YES on car driver
4. Hospital receives alert instantly!

---

## 📚 Documentation

- **DEPLOYMENT-GUIDE.md** - Complete deployment guide
- **QUICK-DEPLOY.md** - 5-minute deployment
- **README.md** - This file

---

## 🔧 Technical Stack

- **Backend:** Node.js + Express
- **WebSocket:** Socket.IO 4.6.1
- **Frontend:** Vanilla JavaScript
- **SMS:** Twilio API (optional)
- **Protocol:** HTTP + WebSocket

---

## 📝 License

MIT License - Feel free to use and modify!

---

**Ready to deploy? See DEPLOYMENT-GUIDE.md for instructions!**