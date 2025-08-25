/**
 * Application environment configuration object that centralizes server, database,
 * container and JWT related settings. Values are read from process.env with
 * sensible defaults. Some properties are implemented as getters and are
 * computed from other configuration values.
 *
 * @namespace env
 *
 * @property {string} NODE_ENV - Server environment mode. Defaults to 'development'.
 * @property {number} PORT - HTTP server port. Defaults to 3000.
 * @property {string} HOST - Server host. Defaults to 'localhost'.
 *
 * // Database
 * @property {string} MONGO_VERSION - Expected MongoDB version. Defaults to '7.0'.
 *
 * // Container configuration
 * @property {(string|number)} MONGO_CONTAINER_NAME - Docker container name for MongoDB. Defaults to 'fixcity-mongodb'.
 * @property {(string|number)} MONGO_PORT - MongoDB TCP port. Defaults to 27017.
 *
 * // MongoDB Credentials
 * @property {string} MONGO_ROOT_USERNAME - MongoDB admin username. Defaults to 'admin'.
 * @property {string} MONGO_ROOT_PASSWORD - MongoDB admin password. Defaults to 'admin_password'.
 * @property {string} MONGO_DATABASE - Default database name. Defaults to 'fixcity_dev'.
 *
 * // Computed connection URIs (getters)
 * @property {string} MONGO_URI - Computed MongoDB URI for local connections. Username and password are URL-encoded and the string uses localhost and the configured MONGO_PORT/MONGO_DATABASE. The authSource=admin query parameter is appended.
 * @property {string} MONGODB_DOCKER_URI - Computed MongoDB URI for Docker connections. Username and password are URL-encoded and the string uses MONGO_CONTAINER_NAME and MONGO_PORT/MONGO_DATABASE. The authSource=admin query parameter is appended.
 *
 * // Connection config (numbers parsed from env or defaulted)
 * @property {number} MONGO_MAX_POOL_SIZE - Maximum connection pool size. Defaults to 10.
 * @property {number} MONGO_SERVER_SELECTION_TIMEOUT - Server selection timeout (ms). Defaults to 5000.
 * @property {number} MONGO_SOCKET_TIMEOUT - Socket timeout (ms). Defaults to 45000.
 * @property {number} MONGO_CONNECT_TIMEOUT - Connection timeout (ms). Defaults to 10000.
 * @property {number} MONGO_MAX_IDLE_TIME - Maximum idle time for a connection (ms). Defaults to 10000.
 *
 * // Computed MongoDB driver options (getter)
 * @property {Object} MONGO_OPTIONS - Options object suitable for the MongoDB Node.js driver.
 * @property {number} MONGO_OPTIONS.maxPoolSize - Alias of MONGO_MAX_POOL_SIZE.
 * @property {number} MONGO_OPTIONS.serverSelectionTimeoutMS - Alias of MONGO_SERVER_SELECTION_TIMEOUT.
 * @property {number} MONGO_OPTIONS.socketTimeoutMS - Alias of MONGO_SOCKET_TIMEOUT.
 * @property {number} MONGO_OPTIONS.connectTimeoutMS - Alias of MONGO_CONNECT_TIMEOUT.
 * @property {number} MONGO_OPTIONS.maxIdleTimeMS - Alias of MONGO_MAX_IDLE_TIME.
 *
 * // JWT
 * @property {(string|undefined)} JWT_SECRET - Secret used to sign JWT access tokens.
 * @property {(string|undefined)} JWT_EXPIRES_IN - Expiration for access tokens (e.g. '1h', seconds).
 * @property {(string|undefined)} JWT_REFRESH_SECRET - Secret used to sign JWT refresh tokens.
 * @property {(string|undefined)} JWT_REFRESH_EXPIRES_IN - Expiration for refresh tokens.
 */

import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.resolve(process.cwd(), '.env'),
});

export const env = {
  // Server
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT) || 3000,
  HOST: process.env.HOST || 'localhost',

  // Database
  MONGO_VERSION: process.env.MONGO_VERSION || '7.0',

  // Container configuration
  MONGO_CONTAINER_NAME: process.env.MONGO_CONTAINER_NAME || 'fixcity-mongodb',
  MONGO_PORT: process.env.MONGO_PORT || 27017,

  // MongoDB Credentials
  MONGO_ROOT_USERNAME: process.env.MONGO_ROOT_USERNAME || 'admin',
  MONGO_ROOT_PASSWORD: process.env.MONGO_ROOT_PASSWORD || 'admin_password',
  MONGO_DATABASE: process.env.MONGO_DATABASE || 'fixcity_dev',

  get MONGO_URI() {
    const username = encodeURIComponent(this.MONGO_ROOT_USERNAME);
    const password = encodeURIComponent(this.MONGO_ROOT_PASSWORD);
    return `mongodb://${username}:${password}@localhost:${this.MONGO_PORT}/${this.MONGO_DATABASE}?authSource=admin`;
  },

  get MONGODB_DOCKER_URI() {
    const username = encodeURIComponent(this.MONGO_ROOT_USERNAME);
    const password = encodeURIComponent(this.MONGO_ROOT_PASSWORD);
    return `mongodb://${username}:${password}@${this.MONGO_CONTAINER_NAME}:${this.MONGO_PORT}/${this.MONGO_DATABASE}?authSource=admin`;
  },

  // Conection config
  MONGO_MAX_POOL_SIZE: parseInt(process.env.MONGO_MAX_POOL_SIZE) || 10,
  MONGO_SERVER_SELECTION_TIMEOUT:
    parseInt(process.env.MONGO_SERVER_SELECTION_TIMEOUT) || 5000,
  MONGO_SOCKET_TIMEOUT: parseInt(process.env.MONGO_SOCKET_TIMEOUT) || 45000,
  MONGO_CONNECT_TIMEOUT: parseInt(process.env.MONGO_CONNECT_TIMEOUT) || 10000,
  MONGO_MAX_IDLE_TIME: parseInt(process.env.MONGO_MAX_IDLE_TIME) || 10000,

  // Conection options for MongoDB Driver
  get MONGO_OPTIONS() {
    return {
      maxPoolSize: this.MONGO_MAX_POOL_SIZE,
      serverSelectionTimeoutMS: this.MONGO_SERVER_SELECTION_TIMEOUT,
      socketTimeoutMS: this.MONGO_SOCKET_TIMEOUT,
      connectTimeoutMS: this.MONGO_CONNECT_TIMEOUT,
      maxIdleTimeMS: this.MONGO_MAX_IDLE_TIME,
    };
  },

  // JWT
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN,
};

if (!process.env.MONGO_ROOT_USERNAME || !process.env.MONGO_ROOT_PASSWORD) {
  console.warn('Cannot find MongoDB credentiasl');
}

export default env;
