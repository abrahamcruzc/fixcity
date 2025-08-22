import {
  disconnectDatabase,
  ensureConnection,
  getConnectionStatus,
} from './config/database.js';
import './config/env.js';
import { env } from './config/env.js';

import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// 404 - Not found
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not Found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  const response = {
    error: err.message || 'Internal Server Error',
  };
  if (env.NODE_ENV !== 'production') {
    response.stack = err.stack;
  }
  res.status(status).json(response);
});

async function startServer() {
  try {
    console.log('Starting application...');

    await ensureConnection();

    const server = app.listen(env.PORT || 3000, () => {
      console.log(`Server running on http://${env.HOST}:${env.PORT}`);
      console.log(`Database: ${getConnectionStatus().database}`);
      console.log(`Environment: ${env.NODE_ENV}`);
    });

    process.on('SIGINT', async () => {
      cosole.log('\nSutting down...');
      await disconnectDatabase();
      server.close(() => {
        process.exit(0);
      });
    });
  } catch (error) {
    console.error('Failed to start server: ', error);
    process.exit(1);
  }
}

startServer();

export default app;
