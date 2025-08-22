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
};

if (!process.env.MONGO_ROOT_USERNAME || !process.env.MONGO_ROOT_PASSWORD) {
  console.warn('Cannot find MongoDB credentiasl');
}

export default env;
