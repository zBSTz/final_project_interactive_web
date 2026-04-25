# 🔧 Hardware Integration & Deployment Guide

## IoT Smart Room Monitor - Hardware Setup

This guide explains how to connect real IoT hardware (temperature sensor and AC unit) to the web application via MQTT.

---

## 📋 Table of Contents

- [Hardware Overview](#hardware-overview)
- [Temperature Sensor Setup](#temperature-sensor-setup)
- [AC Control Integration](#ac-control-integration)
- [MQTT Broker Setup](#mqtt-broker-setup)
- [Testing & Debugging](#testing--debugging)
- [Deployment](#deployment)

---

## 🖥️ Hardware Overview

### System Architecture

```
┌─────────────────────┐
│  Temperature Sensor │ (e.g., DHT22, LM35)
│   (ESP32/Arduino)   │
└──────────┬──────────┘
           │ publishes temperature
           ▼
┌─────────────────────┐
│   MQTT Broker       │ (e.g., Mosquitto)
│  (Raspberry Pi)     │
└──────────┬──────────┘
           │ subscribes temperature
           │ publishes AC commands
           ▼
┌─────────────────────┐
│   Web Application   │
│  (Next.js Browser)  │
└─────────────────────┘
```

### Recommended Hardware

| Component | Options | Purpose |
|-----------|---------|---------|
| **Temperature Sensor** | DHT22, LM35, DS18B20 | Measure room temperature |
| **Microcontroller** | ESP32, Arduino, Arduino MKR | Read sensor + publish MQTT |
| **AC Control Relay** | 5V or 12V relay module | Switch AC unit on/off |
| **MQTT Broker** | Mosquitto, HiveMQ | Message broker |
| **Broker Host** | Raspberry Pi, Linux server, Cloud | Run broker |

---

## 🌡️ Temperature Sensor Setup

### Hardware Connection (ESP32 + DHT22)

```
DHT22 Sensor        ESP32
  Pin 1 (VCC)  ---> 3.3V
  Pin 2 (DATA) ---> GPIO 4
  Pin 3 (GND)  ---> GND
```

### ESP32 Arduino Code

```cpp
#include <DHT.h>
#include <WiFi.h>
#include <PubSubClient.h>

// Configuration
#define DHTPIN 4
#define DHTTYPE DHT22
#define WIFI_SSID "your_wifi_ssid"
#define WIFI_PASSWORD "your_wifi_password"
#define MQTT_SERVER "192.168.1.100"
#define MQTT_PORT 1883

// Initialize
DHT dht(DHTPIN, DHTTYPE);
WiFiClient espClient;
PubSubClient client(espClient);

void setup() {
  Serial.begin(115200);
  dht.begin();
  
  // Connect to WiFi
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected");
  
  // Setup MQTT
  client.setServer(MQTT_SERVER, MQTT_PORT);
  client.setCallback(callback);
}

void loop() {
  // Reconnect MQTT if needed
  if (!client.connected()) {
    reconnect();
  }
  client.loop();
  
  // Publish temperature every 2 seconds
  delay(2000);
  
  float temperature = dht.readTemperature();
  if (!isnan(temperature)) {
    char tempStr[8];
    dtostrf(temperature, 6, 1, tempStr);
    client.publish("sensor/temperature", tempStr);
    Serial.println("Published: " + String(temperature) + "°C");
  }
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Connecting to MQTT...");
    if (client.connect("ESP32_Sensor")) {
      Serial.println("connected");
    } else {
      delay(5000);
    }
  }
}

void callback(char* topic, byte* payload, unsigned int length) {
  // Handle incoming messages if needed
}
```

### Arduino Setup Steps

1. **Install Libraries**:
   - DHT Sensor Library (Adafruit)
   - PubSubClient (by Nick O'Leary)
   - Install via Arduino IDE: Sketch → Include Library → Manage Libraries

2. **Configure WiFi & MQTT**:
   - Replace `your_wifi_ssid` and `your_wifi_password`
   - Set `MQTT_SERVER` to your broker IP address

3. **Upload Code**:
   - Connect ESP32 via USB
   - Select Board: ESP32 Dev Module
   - Select COM port
   - Click Upload

4. **Verify**:
   - Open Serial Monitor (9600 baud)
   - Should show temperature readings and MQTT connection status

---

## 💨 AC Control Integration

### Hardware Connection (ESP32 + Relay)

```
Relay Module        ESP32
  IN  --------> GPIO 5
  VCC --------> 5V (USB)
  GND --------> GND

AC Unit             Relay
  Line (110V) ----- COM
  Neutral    -----> NC (No Connection)
  Ground     -----> GND
```

**⚠️ SAFETY WARNING**: Only connect relay to AC if you have electrical expertise. Use a professional electrician for 110V/220V connections.

### ESP32 AC Control Code

```cpp
#define AC_RELAY_PIN 5

void setup() {
  pinMode(AC_RELAY_PIN, OUTPUT);
  digitalWrite(AC_RELAY_PIN, LOW); // AC off initially
}

void callback(char* topic, byte* payload, unsigned int length) {
  String message = "";
  for (int i = 0; i < length; i++) {
    message += (char)payload[i];
  }
  
  if (String(topic) == "led/control") {
    if (message == "ON") {
      digitalWrite(AC_RELAY_PIN, HIGH); // Turn on
      Serial.println("AC turned ON");
    } else if (message == "OFF") {
      digitalWrite(AC_RELAY_PIN, LOW);  // Turn off
      Serial.println("AC turned OFF");
    } else if (message == "AUTO") {
      // Implement auto logic based on temperature
      Serial.println("AC set to AUTO mode");
    }
  }
}
```

---

## 🐋 MQTT Broker Setup

### Option 1: Mosquitto on Raspberry Pi

```bash
# Update system
sudo apt-get update
sudo apt-get upgrade

# Install Mosquitto
sudo apt-get install mosquitto mosquitto-clients

# Enable on startup
sudo systemctl enable mosquitto

# Start broker
sudo systemctl start mosquitto

# Check status
sudo systemctl status mosquitto

# View logs
sudo tail -f /var/log/mosquitto/mosquitto.log
```

### Option 2: Mosquitto on Linux Server

```bash
# Ubuntu/Debian
sudo apt-get install mosquitto mosquitto-clients

# CentOS/RHEL
sudo yum install mosquitto

# Start
sudo systemctl start mosquitto
```

### Option 3: Docker Deployment

```bash
# Pull Mosquitto image
docker pull eclipse-mosquitto

# Run container
docker run -d \
  --name mqtt-broker \
  -p 1883:1883 \
  -p 9001:9001 \
  eclipse-mosquitto

# Check logs
docker logs mqtt-broker
```

### Option 4: Cloud MQTT Services

- **HiveMQ Cloud**: https://console.hivemq.cloud/
- **AWS IoT Core**: https://aws.amazon.com/iot-core/
- **Azure IoT Hub**: https://azure.microsoft.com/en-us/services/iot-hub/
- **Google Cloud IoT**: https://cloud.google.com/products/iot

### Mosquitto Configuration

Edit `/etc/mosquitto/mosquitto.conf`:

```
# Enable WebSocket support
listener 9001
protocol websockets

# Accept all connections (development)
# For production, use authentication

# Optional: Enable persistence
persistence true
persistence_location /var/lib/mosquitto/
```

Restart after editing:
```bash
sudo systemctl restart mosquitto
```

---

## 🧪 Testing & Debugging

### Test MQTT Connection

```bash
# Subscribe to temperature topic (on broker machine or dev machine)
mosquitto_sub -h 192.168.1.100 -t sensor/temperature

# Publish test temperature (from another terminal)
mosquitto_pub -h 192.168.1.100 -t sensor/temperature -m 28.5

# Should see: 28.5 in subscriber terminal
```

### Test AC Control

```bash
# Listen for AC commands
mosquitto_sub -h 192.168.1.100 -t led/control

# Send command from web app UI (click AC button)
# Should see: ON or OFF in subscriber terminal
```

### Debugging Tools

#### MQTT Explorer (GUI)
- Download: http://mqtt-explorer.com/
- Connect to broker
- Subscribe to all topics: `#`
- See real-time messages

#### Command Line
```bash
# Install mosquitto-clients
sudo apt-get install mosquitto-clients

# Monitor all topics
mosquitto_sub -h <broker-ip> -t '#' -v

# Publish with timestamp
mosquitto_pub -h <broker-ip> -t sensor/temperature -m "$(date +%s) 30.5"
```

#### Web Browser Console
```javascript
// In browser DevTools (F12) console
// Check MQTT logs
console.log("MQTT messages", window.mqttLogs);
```

---

## 🌐 Network Configuration

### Local Network (Development)

1. **Get Broker IP**:
   ```bash
   # Linux/Mac
   ifconfig | grep "inet "
   
   # Windows
   ipconfig
   ```

2. **Update .env.local**:
   ```env
   NEXT_PUBLIC_MQTT_BROKER_URL=ws://192.168.1.100:9001
   ```

3. **Verify Connectivity**:
   ```bash
   # Ping broker
   ping 192.168.1.100
   
   # Check WebSocket port
   telnet 192.168.1.100 9001
   ```

### Remote Network (Production)

1. **Port Forwarding** (if behind router):
   - Access router settings (usually 192.168.1.1)
   - Forward external port 9001 to internal broker port

2. **Domain/Dynamic DNS**:
   - Set up DNS for broker
   - Update `.env.local`:
   ```env
   NEXT_PUBLIC_MQTT_BROKER_URL=wss://mqtt.yourdomain.com:8883
   ```

3. **SSL/TLS Certificate**:
   - Use Let's Encrypt for free certificates
   - Configure Mosquitto with certificate

---

## 🚀 Deployment

### Docker Compose (All-in-One)

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  mqtt:
    image: eclipse-mosquitto
    ports:
      - "1883:1883"
      - "9001:9001"
    volumes:
      - ./mosquitto.conf:/mosquitto/config/mosquitto.conf
    restart: always

  web:
    image: node:18
    working_dir: /app
    volumes:
      - ./:/app
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_MQTT_BROKER_URL=ws://mqtt:9001
      - NODE_ENV=production
    command: sh -c "npm install && npm run build && npm start"
    restart: always
    depends_on:
      - mqtt
```

Run with:
```bash
docker-compose up -d
```

### Kubernetes Deployment

Deploy to Kubernetes cluster:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mqtt-broker
spec:
  replicas: 1
  selector:
    matchLabels:
      app: mqtt
  template:
    metadata:
      labels:
        app: mqtt
    spec:
      containers:
      - name: mosquitto
        image: eclipse-mosquitto
        ports:
        - containerPort: 9001
        - containerPort: 1883

---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app
spec:
  replicas: 1
  selector:
    matchLabels:
      app: web
  template:
    metadata:
      labels:
        app: web
    spec:
      containers:
      - name: next-app
        image: node:18
        ports:
        - containerPort: 3000
        env:
        - name: NEXT_PUBLIC_MQTT_BROKER_URL
          value: "ws://mqtt-broker:9001"
```

---

## 📊 Monitoring

### Broker Monitoring

```bash
# Check connections
mosquitto_sub -h <broker-ip> -t '$SYS/#' -v

# Monitor message count
mosquitto_sub -h <broker-ip> -t '$SYS/broker/messages/#' -v
```

### System Health

```bash
# CPU and Memory usage
top -p $(pgrep mosquitto)

# Port status
netstat -tulpn | grep 9001

# Firewall rules
sudo ufw status

# Log rotation
sudo logrotate -f /etc/logrotate.d/mosquitto
```

---

## 🆘 Common Issues

### Issue: Connection Refused

**Cause**: Broker not running or wrong port  
**Solution**:
```bash
# Check if mosquitto running
sudo systemctl status mosquitto

# Check listening ports
netstat -tulpn | grep LISTEN

# Restart broker
sudo systemctl restart mosquitto
```

### Issue: ESP32 Cannot Connect to WiFi

**Solution**:
1. Verify SSID and password are correct
2. Check WiFi signal strength
3. Restart ESP32 (power cycle)

### Issue: MQTT Messages Not Publishing

**Cause**: Topic mismatch or connection issues  
**Solution**:
```bash
# Verify topic names match
# Sensor publishes to: sensor/temperature
# App subscribes to: sensor/temperature

# Check message format is UTF-8 plaintext
mosquitto_pub -h <broker> -t sensor/temperature -m "28.5"
```

---

## 📝 Production Checklist

- [ ] MQTT broker running and stable
- [ ] WebSocket port (9001) open and accessible
- [ ] SSL/TLS certificates installed (production)
- [ ] Firewall rules configured
- [ ] Broker credentials set (if required)
- [ ] Sensor hardware tested and calibrated
- [ ] Relay control tested safely
- [ ] Environmental variables configured
- [ ] Backup and recovery plan in place
- [ ] Monitoring and alerting set up

---

## 📚 Reference Documents

- MQTT Specification: http://mqtt.org
- Mosquitto Documentation: https://mosquitto.org/documentation/
- Arduino MQTT: https://github.com/knolleary/pubsubclient
- ESP32 Guide: https://docs.espressif.com/projects/esp-idf/en/latest/esp32/

---

**Ready to deploy hardware?** Verify all connections and test thoroughly before production! ⚡

Last Updated: April 2026
