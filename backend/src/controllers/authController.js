/**
 * AuthController
 *
 * Controller responsible for handling authentication related HTTP requests and responses.
 * Each method assumes an AuthService is available in the surrounding scope that provides
 * the actual business logic (register, login, refreshToken, logout, forgotPassword, resetPassword).
 *
 * Common behavior:
 * - Sets a secure httpOnly cookie named 'refreshToken' when issuing refresh tokens.
 * - Cookie options: httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict',
 *   maxAge: 30 * 24 * 60 * 60 * 1000 (30 days).
 * - Methods are async and send JSON responses; they do not return data values to callers.
 *
 * @class
 *
 * @example
 * // Typical usage in an Express route file:
 * // router.post('/login', (req, res) => authController.login(req, res));
 *
 * Methods:
 *
 * @method register
 * @async
 * @param {import('express').Request} req - Express request. Expects user data in req.body.
 * @param {import('express').Response} res - Express response.
 * @returns {Promise<void>} Sends:
 *   - 201 on success with body { success: true, message: string, data: { user, accessToken } }
 *     and sets a 'refreshToken' cookie.
 *   - 400 on failure with body { success: false, error: string }.
 *
 * @method login
 * @async
 * @param {import('express').Request} req - Expects { email, password } in req.body.
 * @param {import('express').Response} res
 * @returns {Promise<void>} Sends:
 *   - 200 on success with body { success: true, message: string, data: { user, accessToken } }
 *     and sets a 'refreshToken' cookie.
 *   - 401 on authentication failure with body { success: false, error: string }.
 *
 * @method refreshToken
 * @async
 * @param {import('express').Request} req - Reads refresh token from req.cookies.refreshToken or req.body.refreshToken.
 * @param {import('express').Response} res
 * @returns {Promise<void>} Sends:
 *   - 200 on success with body { success: true, data: { accessToken } } and updates the 'refreshToken' cookie.
 *   - 401 if no refresh token is provided or it is invalid, with body { success: false, error: string }.
 *
 * @method logout
 * @async
 * @param {import('express').Request} req - Expects authenticated user info on req.user (req.user.id used).
 * @param {import('express').Response} res
 * @returns {Promise<void>} Sends:
 *   - 200 on success with body { success: true, message: string } and clears the 'refreshToken' cookie.
 *   - 500 on server error with body { success: false, error: string }.
 *
 * @method forgotPassword
 * @async
 * @param {import('express').Request} req - Expects { email } in req.body.
 * @param {import('express').Response} res
 * @returns {Promise<void>} Sends:
 *   - 200 on success with body { success: true, message: string }.
 *     In development mode (process.env.NODE_ENV === 'development') the response also includes { resetToken } for convenience.
 *   - 400 on failure with body { success: false, error: string }.
 *
 * @method resetPassword
 * @async
 * @param {import('express').Request} req - Expects { token, password } in req.body.
 * @param {import('express').Response} res
 * @returns {Promise<void>} Sends:
 *   - 200 on success with body { success: true, message: string }.
 *   - 400 on failure with body { success: false, error: string }.
 *
 * @method getProfile
 * @param {import('express').Request} req - Expects authenticated user object on req.user with fields:
 *   _id, name, email, phone, role, isEmailVerified, lastLogin.
 * @param {import('express').Response} res
 * @returns {void} Sends:
 *   - 200 with body { success: true, data: { user: { id, name, email, phone, role, isEmailVerified, lastLogin } } }.
 *
 * Error handling:
 * - Errors thrown by AuthService are caught and returned to the client as JSON with appropriate HTTP status codes
 *   (400, 401, or 500 depending on the method).
 *
 * Notes:
 * - This controller is intended to be used in an Express application with cookie-parsing middleware
 *   (e.g. cookie-parser) and an authentication middleware that populates req.user for protected routes.
 */
import AuthService from '../services/authService.js';


class AuthController {
  async register(req, res) {
    try {
      const result = await AuthService.register(req.body);

      // Configurar cookies seguras (opcional)
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 días
      });

      res.status(201).json({
        success: true,
        message: 'Usuario registrado exitosamente',
        data: {
          user: result.user,
          accessToken: result.accessToken,
        },
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);

      // Configurar cookie para refresh token
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      res.json({
        success: true,
        message: 'Login exitoso',
        data: {
          user: result.user,
          accessToken: result.accessToken,
        },
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        error: error.message,
      });
    }
  }

  async refreshToken(req, res) {
    try {
      const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

      if (!refreshToken) {
        return res.status(401).json({
          success: false,
          error: 'Refresh token requerido',
        });
      }

      const tokens = await AuthService.refreshToken(refreshToken);

      // Actualizar cookie
      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      res.json({
        success: true,
        data: {
          accessToken: tokens.accessToken,
        },
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        error: error.message,
      });
    }
  }

  async logout(req, res) {
    try {
      await AuthService.logout(req.user.id);

      res.clearCookie('refreshToken');

      res.json({
        success: true,
        message: 'Logout exitoso',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      const result = await AuthService.forgotPassword(email);

      res.json({
        success: true,
        message: result.message,
        ...(process.env.NODE_ENV === 'development' && {
          resetToken: result.resetToken,
        }),
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  async resetPassword(req, res) {
    try {
      const { token, password } = req.body;
      await AuthService.resetPassword(token, password);

      res.json({
        success: true,
        message: 'Contraseña actualizada exitosamente',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  async getProfile(req, res) {
    res.json({
      success: true,
      data: {
        user: {
          id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          phone: req.user.phone,
          role: req.user.role,
          isEmailVerified: req.user.isEmailVerified,
          lastLogin: req.user.lastLogin,
        },
      },
    });
  }
}

export default new AuthController();
