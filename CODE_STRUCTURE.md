# Code Documentation

## Project Overview

**Smart Dorm Room IoT Monitoring & Control System**

A Next.js + React application for real-time room environment monitoring with MQTT-based IoT integration.

---

## File Structure

```
Interactive Project/
│
├── app/
│   ├── page.tsx              # Main application component (650+ lines)
│   ├── layout.tsx            # Root layout wrapper
│   └── globals.css           # Global Tailwind styles
│
├── lib/
│   └── mqttClient.ts         # MQTT connection manager
│
├── public/                   # Static assets
│
├── .env.example              # Environment template
├── .env.local                # Local environment (gitignored)
├── package.json              # Dependencies & scripts
├── tsconfig.json             # TypeScript configuration
├── tailwind.config.ts        # Tailwind CSS configuration
├── next.config.js            # Next.js configuration
├── postcss.config.js         # PostCSS configuration
│
└── Documentation/
    ├── README.md             # Main documentation
    ├── MQTT_API.md           # MQTT protocol documentation
    └── CODE_STRUCTURE.md     # This file
```

---

## Component Structure: `app/page.tsx`

### State Variables

```typescript
// Room Control States
const [temperature, setTemperature] = useState(28) // °C
const [roomStatus, setRoomStatus] = useState<RoomStatus>('warm') // 'comfortable' | 'warm' | 'overheat'
const [ledActive, setLedActive] = useState(false) // AC on/off
const [ledOverride, setLedOverride] = useState(false) // Manual mode flag
const [systemMessage, setSystemMessage] = useState('Room temperature is stable')
const [lastAction, setLastAction] = useState('')

// MQTT States
const [mqttConnected, setMqttConnected] = useState(false)
const [mqttError, setMqttError] = useState<string | null>(null)

// UI/Animation States
const [particles, setParticles] = useState<Particle[]>([])
```

### Key Functions

#### Temperature Calculation
```typescript
calculateComfortScore(temp: number): number
  - Input: Temperature in Celsius
  - Output: Comfort score 0-100%
  - Logic:
    * 25-27°C: 95-100% (excellent)
    * 27-31°C: 70-90% (good)
    * > 31°C: 0-70% (poor)
    * < 25°C: 60-90% (cool)
```

#### Smart Status Messages
```typescript
getSmartStatusMessage(): string
  - Returns contextual message based on temperature
  - Updates in real-time
  - Includes comfort score percentage
```

#### Color Scheme Generator
```typescript
getStatusColors(): object
  - Returns Tailwind classes for current room status
  - Colors: Green (comfortable), Amber (warm), Red (overheat)
  - Updates all UI elements dynamically
```

#### Control Handlers
```typescript
coolRoom()          // Decrease temp by 2°C, spawn ❄️ particles
heatRoom()          // Increase temp by 2°C, spawn 🔥 particles
toggleLED()         // Toggle AC on/off, enter manual mode
resetToAutoMode()   // Exit manual mode, return to auto control
spawnParticles()    // Animation particle system
```

### Effect Hooks

#### Temperature Status Update
```typescript
useEffect(() => {
  // Triggers on temperature change
  // Updates: roomStatus, systemMessage
  // Conditions:
  //   < 28°C → comfortable
  //   28-31°C → warm
  //   > 31°C → overheat
}, [temperature])
```

#### MQTT Connection Setup
```typescript
useEffect(() => {
  // Runs once on component mount
  // Connects to MQTT broker at:
  //   ws://192.168.43.188:9001
  // Subscribes to: sensor/temperature
  // Publishes to: led/control
  // Cleans up on unmount
}, [])
```

#### Automatic AC Control
```typescript
useEffect(() => {
  // Triggers when: temperature or ledOverride changes
  // Auto-activates AC: temp > 31°C
  // Auto-deactivates AC: temp < 28°C
  // Skipped if: ledOverride is true
}, [temperature, ledActive, ledOverride])
```

#### Temperature Drift Simulation
```typescript
useEffect(() => {
  // Runs every 2 seconds (when MQTT not connected)
  // Simulates realistic temperature fluctuations
  // Range: 25-40°C
  // Drift: ±0.25°C random
}, [mqttConnected])
```

### UI Sections

#### Header
- Title: "🏠 Smart Room Monitor"
- Subtitle: "Real-time room environment control system"

#### Temperature Display
- Large 60px temperature number
- Animated pulsing effect
- Current/Optimal range indicator

#### Smart Status Message
- Contextual message based on temperature
- Color-coded text (green/amber/red)
- Includes comfort percentage

#### Comfort Score
- Progress bar (0-100%)
- Gradient colors (green → amber → orange → red)
- Label scale: Hot | Comfortable | Cold

#### Room Status
- State label: Comfortable/Warm/Overheat
- Emoji indicator: 🌿/😌/🔥
- Animated float effect

#### MQTT Connection Status
- Green/Yellow indicator light
- "Connected" / "Connecting..." text
- Error messages if connection fails

#### System Mode Indicator
- 🤖 AUTOMATIC: Temperature-based AC control
- 🖐️ MANUAL: User-controlled AC

#### AC Unit Status
- Power indicator (ON/OFF)
- "RUNNING" / "OFF" status text
- Cooling message when active

#### Control Buttons (4 buttons)
```
┌─────────────────┬────────────────┐
│ ❄️ Cool Room  │ 🔥 Heat Room   │
├─────────────────┼────────────────┤
│ 💨 Turn AC     │ ✨ Status Check│
└─────────────────┴────────────────┘
```

#### System Mode Indicator
- Shows when `ledOverride` is true
- Displays "Return to Auto Mode" button
- Pulsing animation

#### Comfort Level Guide
```
🌿 Comfortable: Below 28°C
😌 Warm: 28-31°C
🔥 Overheat: Above 31°C
```

---

## MQTT Client: `lib/mqttClient.ts`

### Functions

```typescript
connectMQTT(config: MQTTConfig): Promise<void>
  - Establishes WebSocket connection to MQTT broker
  - Subscribes to temperature topic
  - Sets up event handlers
  - Automatically reconnects on disconnect

disconnectMQTT(): Promise<void>
  - Gracefully closes MQTT connection
  - Cleans up resources

publishMQTT(topic: string, message: string): void
  - Publishes message to specified topic
  - Used for AC control commands

isMQTTConnected(): boolean
  - Returns connection status
  - Useful for conditional rendering
```

### Error Handling
- Catches connection errors
- Logs to console
- Falls back to simulation mode
- Shows user-facing error messages

---

## Styling: Tailwind CSS

### Custom Animations (in tailwind.config.ts)

```typescript
pulse-smooth      // Smooth pulsing effect (2s)
float             // Floating animation (3s)
slide-up          // Slide up entrance (0.5s)
fade-in           // Fade in effect (0.5s)
shake             // Shake effect when overheat
```

### Color Scheme

#### Comfortable State (Green)
- Background: `from-green-900 to-green-800`
- Text: `text-green-300`
- Border: `border-green-500`
- Button: `bg-green-600`

#### Warm State (Amber)
- Background: `from-amber-900 to-amber-800`
- Text: `text-amber-300`
- Border: `border-amber-500`
- Button: `bg-amber-600`

#### Overheat State (Red)
- Background: `from-red-900 to-red-800`
- Text: `text-red-300`
- Border: `border-red-500`
- Button: `bg-red-600`

---

## Data Flow

```
┌─────────────────────────────────────────┐
│        MQTT Broker (Mosquitto)          │
└──────┬──────────────────────┬───────────┘
       │                      │
       ↓ sensor/temperature   ↓ led/control
       │ (subscribe)          │ (publish)
       │                      │
┌──────▼──────────────────────▼───────────┐
│     Next.js Smart Room App (React)      │
│  ┌────────────────────────────────────┐ │
│  │ Temperature Processing              │ │
│  │ ├─ Clamp 25-40°C                   │ │
│  │ ├─ Calculate comfort score         │ │
│  │ ├─ Determine room status           │ │
│  │ ├─ Auto AC logic (if > 31°C)       │ │
│  │ └─ Update display                  │ │
│  └────────────────────────────────────┘ │
│  ┌────────────────────────────────────┐ │
│  │ User Interactions                   │ │
│  │ ├─ Cool/Heat buttons                │ │
│  │ ├─ AC on/off toggle                │ │
│  │ ├─ Manual/Auto mode                │ │
│  │ └─ Status check animation          │ │
│  └────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

---

## Environment Variables

```env
# Required
NEXT_PUBLIC_MQTT_BROKER_URL=ws://192.168.43.188:9001

# Optional (with defaults)
NEXT_PUBLIC_MQTT_TEMPERATURE_TOPIC=sensor/temperature
NEXT_PUBLIC_MQTT_LED_CONTROL_TOPIC=led/control
NEXT_PUBLIC_APP_NAME=Smart Room Monitor
NEXT_PUBLIC_TEMP_MIN=25
NEXT_PUBLIC_TEMP_MAX=40
```

---

## Build & Deployment

### Scripts
```json
{
  "dev": "next dev",           // Local development
  "build": "next build",       // Production build
  "start": "next start",       // Run production
  "lint": "next lint"          // Code linting
}
```

### Build Output
- Optimized for Vercel, Netlify, or any Node.js host
- Static assets pre-compiled
- Requires Node.js 18+
- Ready for containerization (Docker)

---

## Performance Optimization

✅ **Already Implemented**:
- React.useCallback for function memoization
- Proper effect cleanup (prevent memory leaks)
- Conditional rendering (don't render if not needed)
- CSS gradient animations (GPU-accelerated)

⚡ **Possible Future Improvements**:
- React.memo for particle components
- Service Worker caching
- Image optimization
- Code splitting

---

## Testing

### Manual Testing Checklist
- [ ] Temperature display updates
- [ ] MQTT connection shows status
- [ ] Cool/Heat buttons change temp
- [ ] AC auto-activates at 31°C
- [ ] Manual mode works
- [ ] Colors change correctly
- [ ] Comfort score updates
- [ ] Status messages are relevant

### Browser Console Logs
```javascript
// Temperature update
"🌡️ Temperature updated: 28.5°C"

// AC activation
"🔧 AC automatically activated - cooling in progress"

// Connection status
"🎉 MQTT connected and subscribed"
"📴 MQTT disconnected"
"⚠️ Connection refused (using simulation)"
```

---

## Common Issues & Solutions

| Issue | Root Cause | Solution |
|-------|-----------|----------|
| Temperature doesn't update | MQTT not connected | Check broker IP/port in .env.local |
| Buttons don't work | MQTT subscription failed | Verify topic name |
| Slow performance | Too many animations | Reduce animation in Tailwind config |
| AC won't toggle | ledActive state issue | Check console for errors |

---

## Accessibility

- 🎯 Semantic HTML structure
- 🔊 Color-based status (with emoji backup)
- ⌨️ Keyboard navigation supported
- 📱 Responsive design (mobile-friendly)

---

## Browser Support

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

---

**Version**: 2.0  
**Last Updated**: April 25, 2026  
**Maintainer**: Student Project  
**Status**: ✅ Production Ready
