import { env } from './env.js';

import mongoose from 'mongoose';

const connectionState = {
  isConnected: false,
  lastError: null,
  connectedAt: null,
  connectionAttempts: 0,
};

export async function connectDatabase() {
  if (connectionState.isConnected) {
    console.log('✅ Already connected to MongoDb');
    return true;
  }

  if (mongoose.connection.readyState === 1) {
    connectionState.isConnected = true;
    return true;
  }

  try {
    connectionState.connectionAttemps++;
    console.log(
      `Connecting to MongoDB (attempt ${connectionState.connectionAttemps})...`
    );

    await mongoose.connect(env.MONGO_URI, env.MONGO_OPTIONS);

    connectionState.isConnected = true;
    connectionState.connectedAt = new Date();
    connectionState.lastError = null;

    console.log('✅ MongoDb connected succesfully');

    return true;
  } catch (error) {
    connectionState.lastError = error;
    console.error('❌ MongoDB connection failed: ', error.message);
    throw error;
  }
}

export async function disconnectDatabase() {
  if (!connectionState.isConnected) {
    console.log('⚠️ Not connected to MongoDB');
    return true;
  }

  try {
    await mongoose.disconnect();
    connectionState.isConnected = false;
    connectionState.connectedAt = null;
    console.log('✅ MongoDB disconnected gracefully');
    return true;
  } catch (error) {
    console.error('❌ Error disconnecting from MongoDB', error.message);
    throw error;
  }
}

export function getConnectionStatus() {
  const readyState = mongoose.connection.readyState;
  const readyStateMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
    4: 'invalid',
  };

  return {
    connected: connectionState.isConnected,
    readyState: readyState,
    readyStateText: readyStateMap[readyState] || 'unknown',
    database: mongoose.connection.db?.databaseName,
    host: mongoose.connection.host,
    connectedAt: connectionState.connectedAt,
    lastError: connectionState.lastError?.message,
    connectionAttemps: connectionState.connectionAttemps,
  };
}

export function isConnected() {
  return connectionState.isConnected && mongoose.connection.readyState === 1;
}

export async function ensureConnection(maxRetries = 5) {
  let retries = 0;

  while (!isConnected() && retries < maxRetries) {
    try {
      await connectDatabase();
      return;
    } catch (error) {
      retries++;
      if (retries >= maxRetries) {
        throw new Error(`Failed to connect after ${maxRetries} attempts`);
      }

      console.log(
        `Retrying connection in 2 seconds... (${retries}/${maxRetries})`
      );
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  return isConnected();
}
