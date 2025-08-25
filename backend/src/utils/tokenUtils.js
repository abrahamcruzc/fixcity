/**
 * Utilities for creating and verifying JSON Web Tokens and secure tokens.
 *
 * This module depends on environment configuration values:
 * - env.JWT_SECRET: secret used to sign access tokens
 * - env.JWT_EXPIRES_IN: access token expiration (e.g. "1h", "15m")
 * - env.JWT_REFRESH_SECRET: secret used to sign refresh tokens
 * - env.JWT_REFRESH_EXPIRES_IN: refresh token expiration (e.g. "7d")
 *
 * Functions:
 * - generateTokens(userId): creates an access token and a refresh token
 * - verifyToken(token): verifies an access token and returns its decoded payload
 * - verifyRefreshToken(token): verifies a refresh token and returns its decoded payload
 * - generateResetToken(): creates a cryptographically secure random token (hex)
 * - hashToken(token): returns a SHA-256 hex digest of the given token
 *
 * Note: jwt.sign and jwt.verify may throw errors (e.g. JsonWebTokenError, TokenExpiredError).
 */

/**
 * Generate both an access token and a refresh token for a given user id.
 *
 * The access token is signed with the configured JWT_SECRET and expires
 * according to JWT_EXPIRES_IN. The refresh token is signed with
 * JWT_REFRESH_SECRET and expires according to JWT_REFRESH_EXPIRES_IN.
 *
 * @param {string|number} userId - Unique identifier of the user to include in the token payload.
 * @returns {{ accessToken: string, refreshToken: string }} An object containing the signed access and refresh tokens.
 * @throws {Error} If token signing fails (propagates errors from jwt.sign).
 * @example
 * const { accessToken, refreshToken } = generateTokens('user-123');
 */

/**
 * Verify and decode an access token.
 *
 * Uses the configured JWT_SECRET to verify the token signature and expiration.
 *
 * @param {string} token - JWT access token to verify.
 * @returns {Object} Decoded token payload (typically contains fields such as userId, iat, exp).
 * @throws {JsonWebTokenError|TokenExpiredError} If token is invalid or expired.
 * @example
 * const payload = verifyToken(accessToken); // { userId: 'user-123', iat: 162..., exp: 162... }
 */

/**
 * Verify and decode a refresh token.
 *
 * Uses the configured JWT_REFRESH_SECRET to verify the token signature and expiration.
 *
 * @param {string} token - JWT refresh token to verify.
 * @returns {Object} Decoded refresh token payload.
 * @throws {JsonWebTokenError|TokenExpiredError} If token is invalid or expired.
 * @example
 * const payload = verifyRefreshToken(refreshToken);
 */

/**
 * Generate a cryptographically secure random token for actions like password reset.
 *
 * The token is generated using crypto.randomBytes(32) and returned as a hex string.
 *
 * @returns {string} A 64-character hex string representing 32 bytes of randomness.
 * @example
 * const resetToken = generateResetToken(); // '9f8b3a...'
 */

/**
 * Compute a SHA-256 hash of the provided token and return it as a hex string.
 *
 * Typically used to store a hashed version of a token (e.g., password reset token)
 * in persistent storage, so the raw token never needs to be saved.
 *
 * @param {string} token - The raw token to hash.
 * @returns {string} Hex-encoded SHA-256 digest of the token.
 * @example
 * const hashed = hashToken(resetToken); // 'a3b1c2...'
 */

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
