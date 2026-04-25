import mqtt, { MqttClient } from 'mqtt';

interface MQTTConfig {
  brokerUrl: string;
  topic: string;
  onMessage: (topic: string, message: string) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Error) => void;
}

let client: MqttClient | null = null;
let isConnecting = false;

/**
 * Connect to MQTT broker via WebSocket
 * @param config - Configuration object with broker URL, topic, and callbacks
 * @returns Promise that resolves when connected
 */
export const connectMQTT = (config: MQTTConfig): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (client && client.connected) {
      console.log('✅ Already connected to MQTT broker');
      resolve();
      return;
    }

    if (isConnecting) {
      console.log('⏳ Connection already in progress...');
      reject(new Error('Connection already in progress'));
      return;
    }

    isConnecting = true;
    const { brokerUrl, topic, onMessage, onConnect, onError, onDisconnect } = config;

    console.log(`🔗 Connecting to MQTT broker: ${brokerUrl}`);

    try {
      client = mqtt.connect(brokerUrl, {
        // Works with both mqtt:// and ws:// URLs
        // mqtt.js auto-detects the protocol based on URL scheme
        clientId: `ritualApp-${Math.random().toString(36).substr(2, 9)}`,
        clean: true,
        reconnectPeriod: 5000, // Attempt reconnection every 5 seconds
        connectTimeout: 10000, // Wait 10 seconds for connection
        username: '',
        password: '',
      });

      // Connection successful
      client.on('connect', () => {
        console.log('✅ Connected to MQTT broker');
        isConnecting = false;

        // Subscribe to topic
        client?.subscribe(topic, (err) => {
          if (err) {
            console.error(`❌ Failed to subscribe to ${topic}:`, err);
            onError?.(new Error(`Subscription failed: ${err.message}`));
            reject(err);
          } else {
            console.log(`📡 Subscribed to topic: ${topic}`);
            onConnect?.();
            resolve();
          }
        });
      });

      // Handle incoming messages
      client.on('message', (msgTopic: string, msgBuffer: Buffer) => {
        const message = msgBuffer.toString();
        console.log(`📨 Message received on ${msgTopic}: ${message}`);
        onMessage(msgTopic, message);
      });

      // Handle errors
      client.on('error', (err: Error) => {
        console.error('❌ MQTT Error:', err.message);
        onError?.(err);
      });

      // Handle disconnection
      client.on('disconnect', () => {
        console.log('🔌 Disconnected from MQTT broker');
        onDisconnect?.();
      });

      // Handle offline status
      client.on('offline', () => {
        console.log('⚠️ MQTT client offline');
      });

      // Handle reconnection attempts
      client.on('reconnect', () => {
        console.log('🔄 Attempting to reconnect to MQTT broker...');
      });
    } catch (error) {
      isConnecting = false;
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ Failed to create MQTT connection:', errorMsg);
      onError?.(error instanceof Error ? error : new Error(errorMsg));
      reject(error);
    }
  });
};

/**
 * Disconnect from MQTT broker
 */
export const disconnectMQTT = async (): Promise<void> => {
  return new Promise((resolve) => {
    if (!client) {
      console.log('ℹ️ No active MQTT connection');
      resolve();
      return;
    }

    client.end(true, () => {
      console.log('🛑 Disconnected from MQTT broker');
      client = null;
      isConnecting = false;
      resolve();
    });
  });
};

/**
 * Get current MQTT connection status
 */
export const isMQTTConnected = (): boolean => {
  return client ? client.connected : false;
};

/**
 * Publish a message to a topic
 */
export const publishMQTT = (topic: string, message: string): void => {
  if (!client || !client.connected) {
    console.error('❌ MQTT client not connected');
    return;
  }

  client.publish(topic, message, (err) => {
    if (err) {
      console.error(`❌ Failed to publish to ${topic}:`, err);
    } else {
      console.log(`✅ Published to ${topic}: ${message}`);
    }
  });
};
