import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

const JWT_SECRET = env.JWT_SECRET;
const JWT_EXPIRES_IN = env.JWT_EXPIRES_IN;
const JWT_REFRESH_SECRET = env.JWT_REFRESH_SECRET;
const JWT_REFRESH_EXPIRES_IN = env.JWT_REFRESH_EXPIRES_IN;

export const generateTokens = userId => {
  const accessToken = jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  // refresh token
  const refreshToken = jwt.sign({ userId }, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN,
  });

  return { accessToken, refreshToken };
};

export const verifyToken = token => {
  return jwt.verify(token, JWT_SECRET);
};

export const verifyRefreshToken = token => {
  return jwt.verify(token, JWT_REFRESH_SECRET)
}

export const generateResetToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

export const hashToken = token => {
  return crypto.createHash('sha256').update(token).digest('hex');
};
