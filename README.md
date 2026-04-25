# IoT Smart Room Monitor 🏠

> An interactive Next.js web application for real-time room environment monitoring and control with MQTT IoT integration.

![Node.js](https://img.shields.io/badge/Node.js-18+-green) ![Next.js](https://img.shields.io/badge/Next.js-15+-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3+-06B6D4) ![License](https://img.shields.io/badge/License-MIT-green)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation Guide](#installation-guide)
- [Environment Configuration](#environment-configuration)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

This is a **smart room monitoring and control system** built with Next.js and React that integrates with IoT devices via MQTT protocol. The application provides:

- **Real-time temperature monitoring** from IoT sensors
- **Automated AC/LED control** based on temperature thresholds
- **Manual override mode** for user intervention
- **Interactive dashboard** with comfort scoring
- **Fallback simulation mode** when MQTT is unavailable

### Key Highlights
- 🌡️ **Live Temperature Display** - Updates from IoT sensors every 2 seconds
- 🎨 **Dynamic Color Themes** - Visual feedback based on room conditions (Comfortable/Warm/Overheat)
- 🤖 **Smart Auto-Control** - Automatic AC activation/deactivation based on temperature
- 🖐️ **Manual Override** - Toggle AC independently from automatic mode
- 📊 **Comfort Score** - Calculate and display room comfort percentage
- 📡 **MQTT Integration** - Real-time sensor data synchronization
- ✨ **Rich Animations** - Smooth transitions and particle effects

---

## ✨ Features

### 🌡️ Three Comfort States
- **Comfortable** (< 28°C): Green theme - "Room is perfectly comfortable 🌿"
- **Warm** (28-31°C): Amber theme - "Room is getting warm 😌"
- **Overheat** (> 31°C): Red theme - "Room needs cooling 🔥"

### ⚙️ Automatic System Control
- **Auto AC Activation**: Activates when temperature > 31°C
- **Auto AC Deactivation**: Deactivates when temperature < 28°C
- **Manual Override Mode**: Take control independently
- **Status Indicator**: Always shows current mode (Automatic/Manual)

### 📊 Comfort Metrics
- **Comfort Score** (0-100%): Based on temperature deviation from optimal range
- **Smart Status Messages**: Context-aware feedback on room conditions
- **AC Status Display**: Shows whether unit is running or idle
- **System Mode Indicator**: Displays current operation mode

### ✨ Interactive Feedback
- **Particle Effects**: Animated emojis responding to user actions
- **Color Transitions**: Smooth theme changes based on temperature
- **Action Messages**: Confirms each user action
- **Real-time Updates**: Instant reflection of system state changes

---

## 🛠️ Tech Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| **Framework** | Next.js | 15+ |
| **Runtime** | React | 18+ |
| **Language** | TypeScript | 5+ |
| **Styling** | Tailwind CSS | 3.3+ |
| **IoT Protocol** | MQTT | 3.1.1 |
| **MQTT Client** | mqtt.js | 5.15+ |
| **CSS Processing** | PostCSS | 8.4+ |
| **Tooling** | ESLint | 8+ |

---

## 📋 Prerequisites

### System Requirements
- **Node.js**: Version 18.x or higher
- **npm**: Version 9.x or higher (or yarn/pnpm equivalent)
- **Git**: For cloning the repository
- **MQTT Broker** (optional): Mosquitto or equivalent for real sensor data

### Recommended Tools
- **VS Code**: Recommended code editor with TypeScript support
- **Postman**: For testing MQTT API messages
- **MQTT Explorer**: GUI tool for monitoring MQTT topics

### Verify Prerequisites
```bash
# Check Node.js version
node --version  # Should be v18.0.0 or higher

# Check npm version
npm --version   # Should be 9.0.0 or higher
```

---

## 📦 Installation Guide

### Step 1: Clone or Extract the Project

#### Option A: From GitHub (if repository exists)
```bash
git clone <repository-url>
cd Interactive\ Project
```

#### Option B: From ZIP File
```bash
unzip Interactive-Project.zip
cd Interactive\ Project
```

### Step 2: Install Dependencies
```bash
npm install
```

This will install all required packages from `package.json`:
- Next.js framework
- React and React-DOM
- MQTT client library
- TypeScript and type definitions
- Tailwind CSS and PostCSS
- ESLint for code quality

**Installation time**: ~2-3 minutes (varies by internet speed)

### Step 3: Configure Environment Variables
```bash
# Create local environment file from template
cp .env.example .env.local
```

Edit `.env.local` with your MQTT broker details (see [Environment Configuration](#environment-configuration) section)

### Step 4: Start Development Server
```bash
npm run dev
```

**Expected output:**
```
> next dev

  ▲ Next.js 15.x.x
  - Ready in 3.2s
  - Local:        http://localhost:3000
```

Open your browser and navigate to: **http://localhost:3000**

### Step 5: Verify Installation
- [ ] Page loads without errors
- [ ] Temperature display shows 28°C
- [ ] "Connecting..." message appears (or "Connected" if MQTT available)
- [ ] Buttons respond to clicks (with particle effects)
- [ ] Color themes change with temperature changes

---

## 🔧 Environment Configuration

### Using .env.example

An `.env.example` file is provided as a template. Copy it to `.env.local` to configure your deployment:

```bash
cp .env.example .env.local
```

### Environment Variables Reference

#### MQTT Configuration
```env
# MQTT Broker WebSocket URL
# Local development: ws://localhost:9001
# Network deployment: ws://<broker-ip>:9001
NEXT_PUBLIC_MQTT_BROKER_URL=ws://192.168.43.188:9001

# MQTT Topic: Where temperature sensor publishes data
NEXT_PUBLIC_MQTT_TEMPERATURE_TOPIC=sensor/temperature

# MQTT Topic: Where app sends AC control commands
NEXT_PUBLIC_MQTT_LED_CONTROL_TOPIC=led/control
```

#### Application Configuration
```env
# Application display name
NEXT_PUBLIC_APP_NAME=Smart Room Monitor

# Temperature limits (°C)
NEXT_PUBLIC_TEMP_MIN=25      # Minimum simulated temperature
NEXT_PUBLIC_TEMP_MAX=40      # Maximum simulated temperature
```

#### Node.js Environment
```env
# Node.js environment (development/production)
NODE_ENV=development
```

### Configuration Scenarios

#### Scenario 1: Local Development (No MQTT)
```env
NEXT_PUBLIC_MQTT_BROKER_URL=ws://localhost:9001
NEXT_PUBLIC_APP_NAME=Smart Room Monitor Dev
NODE_ENV=development
```
*App will use simulated temperature data*

#### Scenario 2: Network MQTT Broker
```env
NEXT_PUBLIC_MQTT_BROKER_URL=ws://192.168.1.100:9001
NEXT_PUBLIC_MQTT_TEMPERATURE_TOPIC=sensor/temperature
NEXT_PUBLIC_MQTT_LED_CONTROL_TOPIC=led/control
NODE_ENV=development
```
*App will connect to real IoT devices*

#### Scenario 3: Production Deployment
```env
NEXT_PUBLIC_MQTT_BROKER_URL=ws://mqtt.yourdomain.com:9001
NEXT_PUBLIC_APP_NAME=Smart Room Monitor
NODE_ENV=production
```

---

## 📁 Project Structure

```
Interactive Project/
│
├── 📄 README.md                    # Project documentation (this file)
├── 📄 .env.example                 # Environment template
├── 📄 package.json                 # Project dependencies & scripts
├── 📄 tsconfig.json                # TypeScript configuration
├── 📄 tailwind.config.ts           # Tailwind CSS theme
├── 📄 next.config.js               # Next.js build configuration
├── 📄 postcss.config.js            # PostCSS configuration
│
├── 📂 app/                         # Next.js App Router directory
│   ├── page.tsx                    # Main dashboard component (650+ lines)
│   │   ├── State Management        # Temperature, AC, Override states
│   │   ├── Effect Hooks            # MQTT connection, auto-control
│   │   ├── Event Handlers          # User actions, button clicks
│   │   ├── Color Scheme Logic      # Dynamic theming
│   │   └── UI Components           # Dashboard layout & controls
│   ├── layout.tsx                  # Root layout wrapper
│   └── globals.css                 # Global Tailwind styles
│
├── 📂 lib/                         # Shared utilities & libraries
│   └── mqttClient.ts               # MQTT connection manager (180+ lines)
│       ├── Connection              # Connect/disconnect to MQTT broker
│       ├── Subscriptions           # Topic management
│       ├── Publishing              # Send commands to devices
│       └── Error Handling          # Connection state management
│
├── 📂 public/                      # Static assets (if any)
│
└── 📂 docs/                        # Additional documentation
    ├── MQTT_API.md                 # MQTT protocol specification
    ├── CODE_STRUCTURE.md           # Detailed code architecture
    └── README_COMPLETE.md          # Extended documentation
```

### Key Files Explained

| File | Purpose | Lines |
|------|---------|-------|
| `app/page.tsx` | Main React component with dashboard UI | 650+ |
| `lib/mqttClient.ts` | MQTT client wrapper with error handling | 180+ |
| `app/layout.tsx` | Root layout and metadata | 20 |
| `app/globals.css` | Global styles and Tailwind setup | 15 |
| `tailwind.config.ts` | Custom animations and theme colors | 50+ |

---

## 🚀 Usage

### Running the Application

#### Development Mode (with Hot Reload)
```bash
npm run dev
```
- **Port**: http://localhost:3000
- **Auto-reload**: Changes to code automatically refresh the browser
- **Best for**: Development and testing

#### Production Build
```bash
npm run build
npm start
```
- **Port**: http://localhost:3000
- **Optimized**: Code is minified and optimized
- **Best for**: Deployment and performance testing

#### Linting (Code Quality Check)
```bash
npm run lint
```
- Checks code for issues
- Follows ESLint configuration

### Interactive Controls

Once the app is running, you can interact with:

| Button | Action | Effect |
|--------|--------|--------|
| ❄️ **Cool Room** | Decrease temperature by 2°C | Spawns ❄️ particles |
| 🔥 **Heat Room** | Increase temperature by 2°C | Spawns 🔥 particles |
| 💨 **Toggle AC** | Turn AC on/off manually | Activates manual mode |
| ✨ **Status Check** | Verify system status | Spawns ✨ particles |
| 🔄 **Return to Auto** | Exit manual mode | Resumes auto-control |

### Temperature Ranges

```
Comfortable    Warm        Overheat
    ↓           ↓             ↓
  25-27°C    28-31°C      32-40°C
   🌿         😌            🔥
  Green       Amber         Red
```

---

## 📡 API Documentation

### MQTT Topics

#### Published by Sensor (App Subscribe)
```
Topic:   sensor/temperature
Message: <numeric-value>
Example: 28.5
Format:  Plain text, UTF-8 encoded
QoS:     1 (At-least-once delivery)
```

#### Published by App (Device Subscribe)
```
Topic:   led/control
Message: ON | OFF | AUTO
Example: ON
Format:  Plain text command
QoS:     1 (At-least-once delivery)
```

### API Response Examples

See [MQTT_API.md](MQTT_API.md) for detailed protocol specifications including:
- Message format and encoding
- Topic structure
- QoS levels
- Retained message settings
- Example payloads
- Testing procedures
- Troubleshooting guide

---

## 🔍 Troubleshooting

### Issue: "MQTT Connection Failed"

**Symptom**: Red "Connecting..." message with error

**Solution**:
1. Check MQTT broker URL in `.env.local`
2. Verify broker is running: `telnet <broker-ip> 9001`
3. Check firewall rules allow WebSocket traffic (port 9001)
4. App falls back to simulation mode automatically

### Issue: Temperature Not Updating

**Symptom**: Temperature display stays at 28°C

**Solutions**:
- If MQTT shows "Connected": Verify sensor is publishing to `sensor/temperature` topic
- If MQTT shows "Connecting...": App uses simulated data (click buttons to change)
- Check MQTT broker logs for message delivery
- Use MQTT Explorer to verify message flow

### Issue: AC Not Responding

**Symptom**: AC button works but device doesn't activate

**Solutions**:
- Verify AC device subscribed to `led/control` topic
- Check command format: Must be exactly `ON` or `OFF`
- Monitor MQTT broker to see if message is published
- Check device's MQTT implementation

### Issue: Hot Module Reload Not Working

**Symptom**: Changes require manual page refresh

**Solutions**:
```bash
# Stop dev server and restart
npm run dev

# Or check for file watcher limit (Linux)
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

### Debug Mode

Enable console logging by opening browser DevTools (F12) and check:
- Connection messages
- Temperature updates
- MQTT errors
- State changes

---

## 📝 Additional Resources

- **Next.js Documentation**: https://nextjs.org/docs
- **React Hooks Guide**: https://react.dev/reference/react
- **MQTT Protocol**: http://mqtt.org
- **Tailwind CSS**: https://tailwindcss.com/docs
- **TypeScript**: https://www.typescriptlang.org/docs

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👨‍💻 Development Notes

### Code Quality Standards
- ✅ TypeScript strict mode enabled
- ✅ Comments for complex logic
- ✅ Consistent code formatting
- ✅ Responsive design principles
- ✅ Accessibility considerations

### Performance Optimizations
- React hooks for efficient state management
- Interval-based updates (2-3 second refresh)
- Memoized calculations
- CSS transitions for smooth animations

### Browser Support
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Modern mobile browsers

---

**Last Updated**: April 2026  
**Project Version**: 0.1.0

## Running the Application

### Development Mode
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
npm run build
npm start
```

## Project Structure

```
.
├── app/
│   ├── page.tsx           # Main interactive dashboard
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
├── postcss.config.js
└── README.md
```

## How It Works

### Temperature System
- Simulates temperature changes every 2-3 seconds
- Range: 25°C - 40°C
- User actions immediately affect the temperature
- Automatic drift creates realistic fluctuations

### Ritual State Engine
The system automatically maps temperature to three states:
- **Calm Energy** (< 28°C): "Energy is stable 🌿"
- **Balanced State** (28-34°C): "Ritual is stabilizing 😌"
- **Chaotic State** (> 34°C): "Energy is unstable 🔥"

Each state triggers visual themes:
- Calm: Green gradient + subtle animations
- Balanced: Yellow gradient + steady rhythm
- Chaotic: Red gradient + active pulse

### Fan Control Logic
- **Automatic**: Activates at > 34°C, shows "System is restoring balance..."
- **Manual**: Users can toggle on/off independently
- **Visual Feedback**: LED indicator shows ON/OFF status

### Ritual Progress System
- Accelerated timeline (typical demo: ~30 seconds for full cycle)
- Smooth gradient-based progress bar
- Completion state with confirmation message
- Full reset capability for new cycles

## User Interactions

| Action | Effect | Feedback |
|--------|--------|----------|
| Cool Down | -2°C | "Cooling activated..." |
| Increase Energy | +2°C | "Energy surge detected 🔥" |
| Turn On/Off Fan | Toggle fan state | Real-time status update |
| Start Ritual | Begin progress cycle | Progress bar animates |
| Reset Ritual | Clear progress | "Ritual reset. Ready for new cycle." |

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Notes

- All temperature and sensor data is **simulated** - no real hardware or MQTT required
- Perfect for demos, presentations, and understanding IoT UI patterns
- Can be extended with real MQTT integration or hardware connections

## Future Enhancements

- Real MQTT integration for ESP32 DHT11 sensors
- SQLite database for data history
- Advanced analytics and trends
- Multi-room/device management
- Dark/light mode toggle

---

Built with ❤️ using Next.js and React
