/**
 * Attempts to establish a MongoDB connection using mongoose and a shared connection state.
 *
 * Behavior:
 * - If connectionState.isConnected is true, logs a message and resolves immediately with true.
 * - If mongoose.connection.readyState === 1 (already connected), sets connectionState.isConnected and resolves true.
 * - Otherwise increments connectionState.connectionAttemps, attempts to connect using env.MONGO_URI and env.MONGO_OPTIONS,
 *   and on success sets connectionState.isConnected, connectionState.connectedAt, clears connectionState.lastError, logs success,
 *   and resolves true.
 * - On failure stores the error in connectionState.lastError, logs the failure message, and rethrows the error.
 *
 * @async
 * @function connectDatabase
 * @returns {Promise<boolean>} Resolves to true when a connection is established or already present.
 * @throws {Error} Rethrows any error produced by mongoose.connect after recording it in connectionState.lastError.
 *
 * @sideEffects
 * - Reads/writes the shared connectionState object:
 *   - increments connectionState.connectionAttemps
 *   - sets connectionState.isConnected and connectionState.connectedAt on success
 *   - sets connectionState.lastError on failure
 * - Reads mongoose.connection.readyState and calls mongoose.connect(...)
 *
 * @example
 * // ensure a DB connection before starting the app
 * await connectDatabase();
 */

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
