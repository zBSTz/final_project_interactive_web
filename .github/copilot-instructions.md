# IoT Ritual Simulation - Development Guidelines

## Project Overview

This is an interactive Next.js web application that simulates an IoT ritual experience with environmental data transformation. The app presents a unique UI that feels "alive" with smooth animations, real-time state changes, and interactive controls.

## Architecture

- **Framework**: Next.js 15+ with App Router
- **Styling**: Tailwind CSS with custom animations
- **State Management**: React hooks (useState, useEffect)
- **Language**: TypeScript
- **No Database**: All data is ephemeral (simulated)

## Key Components

### 1. Temperature System (`app/page.tsx`)
- Maintains state between 25°C - 40°C
- Simulates realistic drift every 2-3 seconds
- Updates based on user actions and time
- Drives all downstream state changes

### 2. Ritual State Engine
Maps temperature to three visual states:
- **Calm** (< 28°C): Green theme, message "Energy is stable 🌿"
- **Balanced** (28-34°C): Yellow theme, message "Ritual is stabilizing 😌"
- **Chaotic** (> 34°C): Red theme, message "Energy is unstable 🔥"

### 3. Fan Control Logic
- Automatic activation when temp > 34°C
- Automatic deactivation when temp < 30°C
- Manual override independent of temperature
- Shows status indicator and contextual messages

### 4. Ritual Progress System
- Triggered by "Start Ritual" button
- Accelerated timeline for demo (~30 seconds)
- Smooth progress bar animation
- Completion confirmation and reset capability

## Code Organization

```
app/
├── page.tsx       # Main component (330+ lines)
│   ├── State Management
│   ├── Effects (Temperature drift, Ritual progress, Auto fan)
│   ├── Event Handlers
│   ├── Color Scheme Logic
│   └── UI Rendering
├── layout.tsx     # Root metadata and layout
└── globals.css    # Base Tailwind styles
```

## Development Workflow

1. **Install Dependencies**: `npm install`
2. **Start Dev Server**: `npm run dev`
3. **Hot Reload**: Changes to page.tsx update instantly
4. **Build for Production**: `npm run build`

## Customization Points

### Adjusting Temperature Ranges
In `app/page.tsx`, modify the temperature thresholds:
```typescript
// Currently: calm < 28, balanced 28-34, chaotic > 34
if (temperature < 28) { /* calm */ }
```

### Modifying Ritual Duration
In the ritual progress effect, adjust the interval:
```typescript
// Currently increases by 0-15% every 500ms
// Modify Math.random() * 15 for faster/slower progression
```

### Adding New States
Would require:
1. Adding new value to `RitualState` type
2. Adding temperature threshold
3. Creating color configuration
4. Adding emoji and label

### Customizing Animations
Edit `tailwind.config.ts` in the `keyframes` and `animation` sections to modify:
- `fade-in`: 0.5s ease-in-out
- `pulse-smooth`: 2s infinite
- `float`: 3s ease-in-out infinite
- `slide-up`: 0.5s ease-out

## Key Features Implementation

### Smooth Color Transitions
- Uses Tailwind's `transition-all duration-500` on main container
- Theme colors defined in color scheme function
- Glow effect with shadow reactive to state

### Dynamic Messages
- System message updates with temperature state
- Last action message shows for 2-3 seconds
- Fan activation triggers temporary "restoring balance" message

### Animations
- `animate-pulse-smooth`: Temperature display
- `animate-float`: State indicator
- `animate-slide-up`: Various elements
- `animate-fade-in`: Header and messages

### Interactive Feedback
- Button scale effects (105% on hover, 95% on click)
- Disabled state during ritual
- Real-time status indicators
- Color-coded progress bars

## Performance Considerations

- Temperature simulation uses `setInterval` (2-3s)
- Ritual progress uses `setInterval` (500ms)
- Effects cleanup timers properly with return
- No unnecessary re-renders due to selective state updates
- Memoization possible for color scheme (optimize if needed)

## Testing Scenarios

1. **Temperature Transitions**: Watch state changes and color themes
2. **Fan Activation**: Raise temperature above 34°C
3. **Ritual Cycle**: Start ritual, watch progress, confirm completion
4. **User Actions**: Test each control button's immediate effect
5. **Message Display**: Verify all user feedback messages appear

## Browser Compatibility

- Requires ES2020+ JavaScript support
- CSS Grid and Flex layout
- CSS animations and transitions
- Modern React 18+ hooks

## Deployment

- Ready for Vercel, Netlify, or any Node.js host
- Requires Node.js 18+
- Static build includes all assets

## Future Enhancements

- MQTT integration for real ESP32 sensors
- Data persistence with SQLite
- Historical analytics
- Multi-device support
- Advanced ritual customization

---

Last Updated: April 2026
