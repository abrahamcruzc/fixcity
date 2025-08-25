/**
 * Express middleware that authenticates requests using a Bearer JWT.
 *
 * Behavior:
 * - Expects an Authorization header with the format: "Bearer <token>".
 * - Verifies the token using verifyToken(token). The verification function is expected to
 *   throw a TokenExpiredError for expired tokens.
 * - Loads the user document via User.findById(decoded.userId).
 * - Ensures the user exists and isActive is truthy.
 * - On success, attaches the user document to req.user and calls next().
 *
 * Error responses (JSON):
 * - 401 { error: 'Token de acceso requerido' } when header is missing or malformed.
 * - 401 { error: 'Usuario no válido' } when user is missing or not active.
 * - 401 { error: 'Token expirado', code: 'TOKEN_EXPIRED' } when the token has expired.
 * - 401 { error: 'Token inválido' } for other token verification failures.
 *
 * @param {import('express').Request} req - Express request object. On success, req.user is set to the authenticated user.
 * @param {import('express').Response} res - Express response object used to send JSON error responses.
 * @param {import('express').NextFunction} next - Express next function to pass control to the next middleware.
 * @returns {Promise<void>} Resolves after calling next() or sending an error response.
 */

/**
 * Middleware factory that authorizes authenticated users by role.
 *
 * Usage:
 * const requireAdmin = authorize('admin');
 * app.get('/admin', authenticate, requireAdmin, handler);
 *
 * Behavior:
 * - Returns a middleware that checks req.user (must be set by prior authentication).
 * - If req.user is not present: responds with 401 { error: 'Usuario no autenticado' }.
 * - If req.user.role is not included in the allowed roles: responds with 403
 *   { error: 'No tienes permisos para realizar esta acción' }.
 * - Otherwise calls next().
 *
 * @param {...string} roles - One or more allowed roles.
 * @returns {(req: import('express').Request, res: import('express').Response, next: import('express').NextFunction) => void}
 *   Express middleware enforcing role-based authorization.
 */

import { verifyToken } from '../utils/tokenUtils.js';
import User from '../models/User.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token de acceso requerido' });
    }

    const token = authHeader.substring(7); // Remover 'Bearer '
    const decoded = verifyToken(token);

    const user = await User.findById(decoded.userId);
    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Usuario no válido' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token expirado',
        code: 'TOKEN_EXPIRED'
      });
    }

    return res.status(401).json({ error: 'Token inválido' });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'No tienes permisos para realizar esta acción'
      });
    }

    next();
  };
};
