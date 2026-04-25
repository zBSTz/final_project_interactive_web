# 🚀 Quick Start Guide

**Get the IoT Smart Room Monitor running in 2 minutes**

---

## ⚡ Fastest Way to Run

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open browser
# → http://localhost:3000
```

**Done!** The app is running. Click buttons to test.

---

## 🎮 Test the App

| Action | Effect |
|--------|--------|
| ❄️ Cool Room | Temperature -2°C, green theme |
| 🔥 Heat Room | Temperature +2°C, red theme |
| 💨 Toggle AC | Turn AC on/off manually |
| ✨ Status Check | Check system status |
| 🔄 Return to Auto | Exit manual mode |

---

## 🔧 Setup (5 minutes)

### Step 1: Clone or Extract
```bash
cd Interactive\ Project
```

### Step 2: Install
```bash
npm install
```

### Step 3: Configure (Optional)
```bash
# Copy template
cp .env.example .env.local

# Edit with your MQTT broker URL (if you have one)
# NEXT_PUBLIC_MQTT_BROKER_URL=ws://your-broker-ip:9001
```

### Step 4: Run
```bash
npm run dev
```

### Step 5: Visit
Open: http://localhost:3000

---

## 📦 Production Build

```bash
# Build optimized version
npm run build

# Start production server
npm start
```

---

## 🌐 Deploy to Cloud

### Vercel (Fastest for Next.js)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables
# Set NEXT_PUBLIC_MQTT_BROKER_URL in dashboard
```

### Netlify
```bash
# Build first
npm run build

# Deploy build folder
# Upload public/.next to Netlify
```

### Docker
```bash
# Build image
docker build -t smart-room-monitor .

# Run container
docker run -p 3000:3000 smart-room-monitor
```

---

## 📱 Features Overview

- 🌡️ Real-time temperature display
- 🎨 Dynamic color themes (green/amber/red)
- 🤖 Automatic AC control
- 🖐️ Manual override mode
- 📊 Comfort scoring
- 📡 MQTT integration
- ⚡ Fallback simulation (no MQTT needed)

---

## 🤔 FAQ

**Q: Do I need an MQTT broker?**  
A: No, app works without it using simulated data.

**Q: Can I change temperature ranges?**  
A: Yes, edit the thresholds in `app/page.tsx`.

**Q: How do I add real sensors?**  
A: See `HARDWARE_SETUP.md` for ESP32/Arduino integration.

**Q: How do I submit this?**  
A: See `GITHUB_SETUP.md` for GitHub submission steps.

---

## 🆘 Common Problems

**"Port 3000 already in use"**
```bash
# Kill process on port 3000
# Linux/Mac: lsof -i :3000 | kill -9 <PID>
# Windows: netstat -ano | findstr :3000

# Or use different port
npm run dev -- -p 3001
```

**"Cannot find module 'next'"**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**"MQTT Connection Failed"**
```bash
# This is normal, app uses simulation instead
# Check console (F12) for error details
```

---

## 📚 Full Documentation

- **README.md** - Complete documentation
- **MQTT_API.md** - Protocol details
- **HARDWARE_SETUP.md** - IoT device integration
- **GITHUB_SETUP.md** - GitHub submission guide
- **SUBMISSION_CHECKLIST.md** - Evaluation checklist

---

## 🎯 Next Steps

1. **Try it now**: `npm run dev`
2. **Read full docs**: See `README.md`
3. **Deploy**: Push to GitHub or cloud
4. **Add hardware**: Follow `HARDWARE_SETUP.md`

---

## 📞 Still Need Help?

Check the Troubleshooting section in `README.md` for detailed solutions.

---

**Ready? Run `npm install && npm run dev` now!** 🚀
