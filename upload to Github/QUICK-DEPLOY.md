# ⚡ Quick Deploy Guide (5 Minutes)

## 🚀 Deploy to Render.com (FREE)

### Step 1: Upload to GitHub (2 minutes)

**Easy Way - Drag & Drop:**

1. Go to: https://github.com/new
2. Name: `emergency-alert-system`
3. Click "Create repository"
4. Click "uploading an existing file"
5. **Drag your entire Projects folder** into the browser
6. Click "Commit changes"

**Or use terminal:**
```bash
cd Projects
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/emergency-alert-system.git
git push -u origin main
```

---

### Step 2: Deploy on Render (3 minutes)

1. **Go to:** https://render.com
2. **Sign up** with GitHub
3. **Click "New +"** → "Web Service"
4. **Connect** your `emergency-alert-system` repository
5. **Settings:**
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Instance Type: `Free`
6. **Click "Create Web Service"**
7. **Wait 2-3 minutes**

---

### Step 3: Get Your URL

You'll get a URL like:
```
https://emergency-alert-system-xxxx.onrender.com
```

**Access your system:**
```
https://your-url.onrender.com/public/carDriver.html
https://your-url.onrender.com/public/hospital1.html
```

---

## ✅ Done!

Your system is now online and accessible from anywhere!

**Share the URLs with anyone - they can access from any device!**

---

## 📝 Notes:

- First request takes 30 seconds (service wakes up)
- After that, works instantly
- Free forever
- Automatic HTTPS
- WebSocket supported

---

**For detailed guide, see DEPLOYMENT-GUIDE.md**
