'use client';

import { useState, useEffect, useCallback } from 'react';
import { connectMQTT, disconnectMQTT, isMQTTConnected, publishMQTT } from '@/lib/mqttClient';

type RoomStatus = 'comfortable' | 'warm' | 'overheat';

export default function SmartRoomMonitoring() {
  const [temperature, setTemperature] = useState(28);
  const [roomStatus, setRoomStatus] = useState<RoomStatus>('warm');
  const [ledActive, setLedActive] = useState(false);
  const [ledOverride, setLedOverride] = useState(false); // Manual override mode
  const [systemMessage, setSystemMessage] = useState('Room temperature is stable');
  const [lastAction, setLastAction] = useState('');
  
  // MQTT Connection State
  const [mqttConnected, setMqttConnected] = useState(false);
  const [mqttError, setMqttError] = useState<string | null>(null);
  
  // Interactive features
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; emoji: string; scale: number; duration: number; delay: number; opacity: number }>>([]);
  let particleIdRef = { current: 0 };

  // Comfort level messages
  const comfortMessages = [
    { emoji: '🌿', title: 'Comfortable', status: 'Room is perfectly comfortable' },
    { emoji: '😌', title: 'Warm', status: 'Room is getting warm' },
    { emoji: '🔥', title: 'Overheat', status: 'Room needs cooling' },
  ];

  // Remove old particles
  useEffect(() => {
    if (particles.length === 0) return;

    const timer = setTimeout(() => {
      setParticles((prev) => prev.slice(1));
    }, 2500);

    return () => clearTimeout(timer);
  }, [particles]);

  // Connect to MQTT on component mount
  useEffect(() => {
    const setupMQTT = async () => {
      try {
        await connectMQTT({
          brokerUrl: 'ws://192.168.43.188:9001',
          topic: 'sensor/temperature',
          onMessage: (topic, message) => {
            const tempValue = parseFloat(message);
            if (!isNaN(tempValue)) {
              // Clamp temperature between 25-40°C
              const clampedTemp = Math.max(25, Math.min(40, tempValue));
              setTemperature(Math.round(clampedTemp * 10) / 10);
              console.log(`🌡️ Temperature updated: ${clampedTemp}°C`);
            } else {
              console.warn(`⚠️ Invalid temperature value: ${message}`);
            }
          },
          onConnect: () => {
            console.log('🎉 MQTT connected and subscribed');
            setMqttConnected(true);
            setMqttError(null);
          },
          onDisconnect: () => {
            console.log('📴 MQTT disconnected');
            setMqttConnected(false);
          },
          onError: (error) => {
            console.error('MQTT Error:', error.message);
            setMqttError(error.message);
            setMqttConnected(false);
          },
        });
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        console.error('Failed to setup MQTT:', errorMsg);
        setMqttError(errorMsg);
        setMqttConnected(false);
      }
    };

    setupMQTT();

    // Cleanup on unmount
    return () => {
      disconnectMQTT().catch(console.error);
    };
  }, []);

  // Update room status based on temperature
  useEffect(() => {
    if (temperature < 28) {
      setRoomStatus('comfortable');
      setSystemMessage('Room is perfectly comfortable 🌿');
    } else if (temperature >= 28 && temperature <= 31) {
      setRoomStatus('warm');
      setSystemMessage('Room is getting warm 😌');
    } else {
      setRoomStatus('overheat');
      setSystemMessage('Room needs cooling 🔥');
    }
  }, [temperature]);

  // Automatic LED control (only if not in override mode)
  useEffect(() => {
    if (ledOverride) return; // Skip auto control if manually overridden
    
    if (temperature > 31 && !ledActive) {
      setLedActive(true);
      setLastAction('🔧 AC automatically activated - cooling in progress');
      const timer = setTimeout(() => {
        setLastAction('');
      }, 3000);
      return () => clearTimeout(timer);
    } else if (temperature < 28 && ledActive) {
      setLedActive(false);
      setLastAction('✓ Temperature normalized - AC deactivated');
      const timer = setTimeout(() => {
        setLastAction('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [temperature, ledActive, ledOverride]);

  // Simulate temperature drift when not connected to MQTT
  useEffect(() => {
    if (mqttConnected) return; // Skip if MQTT connected

    const interval = setInterval(() => {
      setTemperature((prev) => {
        const drift = (Math.random() - 0.5) * 0.5;
        const newTemp = Math.max(25, Math.min(40, prev + drift));
        return Math.round(newTemp * 10) / 10;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [mqttConnected]);

  // Spawn particles with variety
  const spawnParticles = useCallback((emoji: string, count: number = 6) => {
    for (let i = 0; i < count; i++) {
      const delay = i * 50;
      setTimeout(() => {
        const scale = 0.6 + Math.random() * 0.8;
        const duration = 0.8 + Math.random() * 0.7;
        const opacity = 0.6 + Math.random() * 0.4;
        
        setParticles((prev) => [
          ...prev,
          {
            id: particleIdRef.current++,
            x: 30 + Math.random() * 40,
            y: Math.random() * 15,
            emoji,
            scale,
            duration,
            delay: 0,
            opacity,
          },
        ]);
      }, delay);
    }
  }, []);

  // Control actions with particle feedback
  const coolRoom = () => {
    setTemperature((prev) => Math.max(25, prev - 2));
    spawnParticles('❄️', 7);
    setLastAction('❄️ Room cooled by 2°C');
    setTimeout(() => setLastAction(''), 1500);
  };

  const heatRoom = () => {
    setTemperature((prev) => Math.min(40, prev + 2));
    spawnParticles('🔥', 8);
    setLastAction('🔥 Room heated by 2°C');
    setTimeout(() => setLastAction(''), 1500);
  };

  const toggleLED = () => {
    const newLEDState = !ledActive;
    setLedActive(newLEDState);
    setLedOverride(true); // Activate override mode
    spawnParticles('💨', 6);
    
    // Publish AC control command via MQTT
    const command = newLEDState ? 'ON' : 'OFF';
    publishMQTT('led/control', command);
    
    setLastAction(newLEDState ? '💨 AC turned ON (manual)' : '🪫 AC turned OFF (manual)');
    setTimeout(() => setLastAction(''), 1500);
  };

  const resetToAutoMode = () => {
    setLedOverride(false); // Return to automatic mode
    
    // Publish AUTO mode command via MQTT
    publishMQTT('led/control', 'AUTO');
    
    setLastAction('🔄 AC returned to automatic mode');
    setTimeout(() => setLastAction(''), 1500);
  };

  // Calculate comfort score based on temperature
  const calculateComfortScore = (temp: number): number => {
    if (temp >= 25 && temp <= 27) {
      // Excellent range: 25-27°C → 95-100%
      return Math.round(95 + ((27 - temp) / 2) * 5);
    } else if (temp > 27 && temp <= 31) {
      // Good range: 27-31°C → 70-90%
      const ratio = (31 - temp) / 4;
      return Math.round(70 + ratio * 20);
    } else if (temp > 31) {
      // Overheat: > 31°C → 0-70%
      return Math.max(0, Math.round(70 - (temp - 31) * 10));
    } else {
      // Below 25°C → 60-90%
      return Math.round(60 + ((temp - 25) / 3) * 30);
    }
  };

  // Get smart status message based on temperature
  const getSmartStatusMessage = (): string => {
    const score = calculateComfortScore(temperature);
    
    if (temperature < 28) {
      return `Room is comfortable 🌿 (${score}% score)`;
    } else if (temperature >= 28 && temperature <= 31) {
      return `Slightly warm 😌 (${score}% score)`;
    } else {
      return `Too hot! Cooling recommended 🔥 (${score}% score)`;
    }
  };

  // Get comfort score color based on percentage
  const getComfortScoreColor = (): string => {
    const score = calculateComfortScore(temperature);
    if (score >= 85) return 'from-green-400 to-green-600';
    if (score >= 70) return 'from-amber-400 to-amber-600';
    if (score >= 50) return 'from-orange-400 to-orange-600';
    return 'from-red-400 to-red-600';
  };

  const getComfortScoreProgressColor = (): string => {
    const score = calculateComfortScore(temperature);
    if (score >= 85) return 'bg-green-500 shadow-lg shadow-green-500/50';
    if (score >= 70) return 'bg-amber-500 shadow-lg shadow-amber-500/50';
    if (score >= 50) return 'bg-orange-500 shadow-lg shadow-orange-500/50';
    return 'bg-red-500 shadow-lg shadow-red-500/50';
  };

  // Determine color scheme based on room status
  const getStatusColors = () => {
    switch (roomStatus) {
      case 'comfortable':
        return {
          bg: 'from-green-900 to-green-800',
          text: 'text-green-300',
          border: 'border-green-500',
          button: 'bg-green-600 hover:bg-green-700',
          glow: 'shadow-lg shadow-green-500/50',
          statusText: 'text-green-400',
        };
      case 'warm':
        return {
          bg: 'from-amber-900 to-amber-800',
          text: 'text-amber-300',
          border: 'border-amber-500',
          button: 'bg-amber-600 hover:bg-amber-700',
          glow: 'shadow-lg shadow-amber-500/50',
          statusText: 'text-amber-400',
        };
      case 'overheat':
        return {
          bg: 'from-red-900 to-red-800',
          text: 'text-red-300',
          border: 'border-red-500',
          button: 'bg-red-600 hover:bg-red-700',
          glow: 'shadow-lg shadow-red-500/50',
          statusText: 'text-red-400',
        };
    }
  };

  // Get dynamic background gradient
  const getPageBackground = () => {
    switch (roomStatus) {
      case 'comfortable':
        return 'from-slate-900 via-green-900/30 to-slate-900';
      case 'warm':
        return 'from-slate-900 via-amber-900/30 to-slate-900';
      case 'overheat':
        return 'from-slate-900 via-red-900/50 to-red-950';
    }
  };

  // Get temperature indicator styles
  const getTempIndicator = () => {
    switch (roomStatus) {
      case 'comfortable':
        return {
          size: 'w-24 h-24',
          glow: 'shadow-lg shadow-green-400/80',
          bg: 'bg-gradient-to-br from-green-400 to-green-600',
        };
      case 'warm':
        return {
          size: 'w-28 h-28',
          glow: 'shadow-lg shadow-amber-400/90',
          bg: 'bg-gradient-to-br from-amber-300 to-amber-500',
        };
      case 'overheat':
        return {
          size: 'w-32 h-32',
          glow: 'shadow-2xl shadow-red-500/100',
          bg: 'bg-gradient-to-br from-red-400 to-red-600',
        };
    }
  };

  const colors = getStatusColors();
  const tempIndicator = getTempIndicator();
  const pageBg = getPageBackground();

  const statusEmojis = {
    comfortable: '🌿',
    warm: '😌',
    overheat: '🔥',
  };

  const statusLabels = {
    comfortable: 'Comfortable',
    warm: 'Warm',
    overheat: 'Overheat',
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 bg-gradient-to-b ${pageBg} transition-all duration-500 ease-in-out`}
    >
      <div className="w-full max-w-2xl relative">
        {/* Floating Particles Layer */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="absolute text-2xl pointer-events-none"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                transform: `scale(${particle.scale})`,
                opacity: particle.opacity,
                animation: `slide-down ${particle.duration}s linear forwards`,
                animationDelay: `${particle.delay}ms`,
              }}
            >
              {particle.emoji}
            </div>
          ))}
        </div>

        {/* Dynamic Glow Background Layer */}
        <div className="fixed inset-0 pointer-events-none">
          <div
            className={`absolute top-1/4 left-1/2 transform -translate-x-1/2 w-96 h-96 rounded-full filter blur-3xl opacity-40 transition-all duration-500 ${
              roomStatus === 'comfortable'
                ? 'bg-green-500'
                : roomStatus === 'warm'
                  ? 'bg-amber-500'
                  : 'bg-red-600'
            }`}
          />
        </div>

        {/* Main Dashboard Container */}
        <div
          className={`relative rounded-2xl border-2 ${colors.border} bg-gradient-to-br ${colors.bg} p-8 transition-all duration-500 ${
            roomStatus === 'overheat' ? 'animate-shake' : ''
          }`}
        >
          {/* Animated Glow Effect on Card */}
          <div
            className={`absolute inset-0 rounded-2xl pointer-events-none transition-all duration-500`}
            style={{
              boxShadow:
                roomStatus === 'comfortable'
                  ? '0 0 20px 4px rgba(34, 197, 94, 0.6)'
                  : roomStatus === 'warm'
                    ? '0 0 20px 4px rgba(180, 83, 9, 0.6)'
                    : '0 0 25px 6px rgba(239, 68, 68, 0.7)',
            }}
          />

          <div className="relative z-10">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-2 animate-fade-in">
                🏠 Smart Room Monitor
              </h1>
              <p className="text-gray-400 text-sm">
                Real-time room environment control system
              </p>
            </div>

            {/* Temperature Indicator Orb */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div
                  className={`${tempIndicator.size} ${tempIndicator.bg} ${tempIndicator.glow} rounded-full filter blur-sm transition-all duration-500 animate-pulse-smooth`}
                />
                <div
                  className={`absolute inset-0 ${tempIndicator.size} rounded-full transition-all duration-500`}
                  style={{
                    background:
                      roomStatus === 'comfortable'
                        ? 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3), transparent)'
                        : roomStatus === 'warm'
                          ? 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4), transparent)'
                          : 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2), transparent)',
                  }}
                />
              </div>
            </div>

            {/* Temperature Display - Main */}
            <div className="mb-10">
              <div
                className={`relative text-center p-8 rounded-xl border ${colors.border} bg-black/30 backdrop-blur-sm transition-all duration-500 ${
                  roomStatus === 'overheat' ? 'scale-105' : 'scale-100'
                }`}
              >
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-white to-transparent h-px w-24 opacity-30" />
                <p className="text-gray-400 text-sm mb-2 uppercase tracking-widest">
                  Current Temperature
                </p>
                <div
                  className={`text-6xl font-bold ${colors.text} animate-pulse-smooth transition-all duration-500`}
                >
                  {temperature.toFixed(1)}°C
                </div>
                <p className="text-gray-500 text-xs mt-2">Optimal Range: 25°C – 28°C</p>
              </div>
            </div>

            {/* Smart Status Message */}
            <div className="mb-8 text-center">
              <p className={`text-lg font-semibold ${colors.statusText} animate-fade-in`}>
                {getSmartStatusMessage()}
              </p>
            </div>

            {/* Comfort Score Progress Bar */}
            <div className="mb-10">
              <div className="flex justify-between items-center mb-3">
                <p className="text-gray-400 text-xs uppercase tracking-widest">Comfort Score</p>
                <p className={`text-lg font-bold ${colors.text}`}>
                  {calculateComfortScore(temperature)}%
                </p>
              </div>
              <div className="w-full h-4 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
                <div
                  className={`h-full transition-all duration-500 ease-out shadow-lg bg-gradient-to-r ${getComfortScoreColor()}`}
                  style={{ width: `${calculateComfortScore(temperature)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>Hot</span>
                <span>Comfortable</span>
                <span>Cold</span>
              </div>
            </div>

            {/* MQTT Connection Status */}
            <div className="mb-8">
              <div className="text-center">
                <p className="text-gray-400 text-xs uppercase tracking-widest mb-3">
                  📡 Sensor Connection
                </p>
                <div className="flex justify-center items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full animate-pulse ${
                      mqttConnected ? 'bg-green-400 shadow-lg shadow-green-400/50' : 'bg-yellow-500 shadow-lg shadow-yellow-500/50'
                    }`}
                  />
                  <span
                    className={`text-sm font-semibold transition-all duration-300 ${
                      mqttConnected ? 'text-green-300' : 'text-yellow-400'
                    }`}
                  >
                    {mqttConnected ? 'Connected' : 'Connecting...'}
                  </span>
                </div>
                {mqttError && (
                  <p className="text-xs text-red-400 mt-2 animate-pulse">
                    ⚠️ {mqttError} (using simulation)
                  </p>
                )}
                {!mqttConnected && !mqttError && (
                  <p className="text-xs text-gray-400 mt-2 animate-pulse">
                    Waiting for real sensor data...
                  </p>
                )}
              </div>
            </div>

            {/* System Mode Indicator */}
            <div className="mb-8">
              <div className="text-center">
                <p className="text-gray-400 text-xs uppercase tracking-widest mb-3">
                  🎛️ System Mode
                </p>
                <div className={`text-xl font-bold ${colors.text} transition-all duration-300`}>
                  {ledOverride ? '🖐️ MANUAL' : '🤖 AUTOMATIC'}
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  {ledOverride 
                    ? 'LED control is manual - click "Return to Auto" to resume automatic management'
                    : 'LED automatically adjusts based on room temperature'}
                </p>
              </div>
            </div>

            {/* AC/LED Control Status */}
            <div className="mb-10">
              <div className="text-center">
                <p className="text-gray-400 text-xs uppercase tracking-widest mb-3">
                  ❄️ AC Unit Status
                </p>
                <div className="flex justify-center items-center gap-3">
                  <div
                    className={`w-4 h-4 rounded-full animate-pulse ${
                      ledActive ? 'bg-yellow-400 shadow-lg shadow-yellow-400/50' : 'bg-gray-600'
                    }`}
                  />
                  <span
                    className={`text-lg font-semibold transition-all duration-300 ${
                      ledActive ? 'text-yellow-300' : 'text-gray-500'
                    }`}
                  >
                    {ledActive ? 'RUNNING' : 'OFF'}
                  </span>
                </div>
                {ledActive && (
                  <p className="text-xs text-yellow-300 mt-2 animate-pulse">
                    AC is cooling the room
                  </p>
                )}
                {!ledActive && roomStatus === 'comfortable' && (
                  <p className="text-xs text-green-300 mt-2">
                    Room temperature is optimal
                  </p>
                )}
              </div>
            </div>


            {/* Action Messages */}
            {lastAction && (
              <div className="mb-8 text-center">
                <p className="text-sm text-blue-300 animate-slide-up">
                  {lastAction}
                </p>
              </div>
            )}

            {/* Control Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                onClick={coolRoom}
                className={`py-3 px-4 rounded-lg font-semibold text-sm uppercase tracking-wide transition-all duration-300 ${colors.button} hover:scale-105 active:scale-95`}
              >
                ❄️ Cool Room
              </button>
              <button
                onClick={heatRoom}
                className={`py-3 px-4 rounded-lg font-semibold text-sm uppercase tracking-wide transition-all duration-300 ${colors.button} hover:scale-105 active:scale-95`}
              >
                🔥 Heat Room
              </button>
              <button
                onClick={toggleLED}
                className={`py-3 px-4 rounded-lg font-semibold text-sm uppercase tracking-wide transition-all duration-300 ${
                  ledOverride
                    ? 'bg-blue-600 border-2 border-blue-400 shadow-lg shadow-blue-400/50'
                    : colors.button
                } hover:scale-105 active:scale-95`}
              >
                {ledActive ? '🪫 TURN OFF AC' : '💨 TURN ON AC'}
              </button>
              <button
                onClick={() => spawnParticles('✨', 5)}
                className={`py-3 px-4 rounded-lg font-semibold text-sm uppercase tracking-wide transition-all duration-300 ${colors.button} hover:scale-105 active:scale-95`}
              >
                ✨ Status Check
              </button>
            </div>

            {/* Manual Mode Indicator & Reset Button */}
            {ledOverride && (
              <div className="mb-6 p-4 bg-blue-900/30 border border-blue-500/50 rounded-lg animate-pulse">
                <p className="text-center text-blue-300 text-sm font-semibold mb-3">
                  🖐️ MANUAL MODE - AC override active
                </p>
                <button
                  onClick={resetToAutoMode}
                  className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  🔄 Return to Auto Mode
                </button>
              </div>
            )}

            {/* Comfort Level Info */}
            <div className="mb-6 p-4 bg-gray-900/50 border border-gray-700 rounded-lg">
              <p className="text-center text-gray-400 text-xs uppercase tracking-widest mb-3">
                Comfort Level Guide
              </p>
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="text-center">
                  <p className="text-green-400 font-bold mb-1">🌿 Comfortable</p>
                  <p className="text-gray-400">Below 28°C</p>
                </div>
                <div className="text-center">
                  <p className="text-amber-400 font-bold mb-1">😌 Warm</p>
                  <p className="text-gray-400">28–31°C</p>
                </div>
                <div className="text-center">
                  <p className="text-red-400 font-bold mb-1">🔥 Overheat</p>
                  <p className="text-gray-400">Above 31°C</p>
                </div>
              </div>
            </div>

            {/* Footer Info */}
            <div className="mt-12 pt-6 border-t border-gray-700">
              <div className="text-center text-xs text-gray-500">
                <p>Real-time room environment monitoring system</p>
                <p className="mt-1">Temperature sensor data updates every 2 seconds</p>
              </div>
            </div>
          </div>
        </div>

        {/* Background decorative elements */}
        <div className="fixed -top-1/2 -left-1/2 w-full h-full pointer-events-none opacity-20 transition-opacity duration-700">
          <div
            className={`absolute top-20 left-10 w-72 h-72 rounded-full filter blur-3xl transition-all duration-700 ${
              roomStatus === 'comfortable'
                ? 'bg-green-500'
                : roomStatus === 'warm'
                  ? 'bg-amber-500'
                  : 'bg-red-600'
            }`}
          />
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-500 rounded-full filter blur-3xl" />
        </div>
      </div>
    </div>
  );
}
