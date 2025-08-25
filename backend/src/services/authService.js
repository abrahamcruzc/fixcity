/**
 * AuthService
 *
 * Service responsible for user authentication and account recovery operations.
 *
 * @class
 *
 * @typedef {Object} Tokens
 * @property {string} accessToken - JWT access token
 * @property {string} refreshToken - JWT refresh token
 * @property {number} expiresIn - Access token expiry in seconds (optional)
 *
 * @typedef {Object} UserPublic
 * @property {string} id - User identifier
 * @property {string} name - User name
 * @property {string} email - User email
 * @property {string} phone - User phone
 * @property {string} role - User role
 * @property {boolean} isEmailVerified - Whether the email is verified
 *
 * @typedef {Object} AuthResponse
 * @property {UserPublic} user - Public user information
 * @property {string} accessToken - JWT access token
 * @property {string} refreshToken - JWT refresh token
 *
 * Notes on errors:
 * - Methods typically throw Error instances with Spanish messages used by the implementation,
 *   e.g. "El email ya está registrado", "Credenciales invalidas", "Refresh token invalido", etc.
 */

/**
 * Register a new user.
 *
 * @async
 * @function register
 * @param {Object} userData - New user data
 * @param {string} userData.name - Full name
 * @param {string} userData.email - Email address (must be unique)
 * @param {string} userData.phone - Phone number (must be unique)
 * @param {string} userData.password - Plain text password
 * @returns {Promise<AuthResponse>} Resolves with the created user's public data and authentication tokens.
 * @throws {Error} If the email or phone is already registered or other persistence errors occur.
 */

/**
 * Authenticate a user by email and password.
 *
 * @async
 * @function login
 * @param {string} email - User's email
 * @param {string} password - Plain text password
 * @returns {Promise<AuthResponse>} Resolves with the authenticated user's public data and tokens.
 * @throws {Error} If credentials are invalid, the account is locked, or the user is not found/active.
 */

/**
 * Exchange a refresh token for new tokens.
 *
 * @async
 * @function refreshToken
 * @param {string} refreshToken - Refresh token previously issued to the client
 * @returns {Promise<Tokens>} Resolves with a new set of tokens.
 * @throws {Error} If the refresh token is invalid or the referenced user is not valid/active.
 */

/**
 * Log out a user.
 *
 * Note: The current implementation is a no-op persistence-wise and returns a success message if the user exists.
 *
 * @async
 * @function logout
 * @param {string} userId - Identifier of the user to log out
 * @returns {Promise<Object>} Resolves with a message confirming logout.
 * @throws {Error} If the user cannot be found.
 */

/**
 * Initiate password recovery for a user.
 *
 * Generates a reset token, stores a hashed version and expiration on the user record.
 * The raw reset token is typically sent to the user's email (returned here for testing/demo purposes).
 *
 * @async
 * @function forgotPassword
 * @param {string} email - Email address of the account to recover
 * @returns {Promise<Object>} Resolves with a message; when the email exists and is active, also returns the raw resetToken.
 * @throws {Error} Propagates persistence errors if saving the user fails.
 */

/**
 * Reset a user's password using a reset token.
 *
 * @async
 * @function resetPassword
 * @param {string} token - Raw reset token provided to the user
 * @param {string} newPassword - New plain text password to set
 * @returns {Promise<Object>} Resolves with a success message when the password is updated.
 * @throws {Error} If the token is invalid or expired, or if saving fails.
 */

/**
 * Increment failed login attempts and optionally lock the account.
 *
 * @async
 * @function handleFailedLogin
 * @param {Object} user - Mongoose user document (mutable). Expected to have loginAttempts and lockUntil fields.
 * @returns {Promise<void>} Resolves after updating the user document.
 * @remarks Locks the user for a configured duration when max attempts are reached.
 */

/**
 * Reset failed login counters and record a successful login.
 *
 * @async
 * @function handleSuccessfulLogin
 * @param {Object} user - Mongoose user document (mutable). Expected to have loginAttempts, lockUntil and lastLogin fields.
 * @returns {Promise<void>} Resolves after updating the user document.
 */

import User from '../models/User.js';
import {
  generateResetToken,
  generateTokens,
  hashToken,
  verifyRefreshToken,
} from '../utils/tokenUtils.js';

class AuthService {
  async register(userData) {
    const { name, email, phone, password } = userData;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('El email ya está registrado');
    }

    const existingPhone = await User.findOne({ phone });
    if (existingPhone) {
      throw new Error('El telefono ya esta registrado');
    }

    const user = new User({
      name,
      email,
      phone,
      password,
    });

    await user.save();

    const tokens = generateTokens(user._id);

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      },
      ...tokens,
    };
  }

  async login(email, password) {
    const user = await User.findOne({
      email,
      isActive: true,
    }).select('+password +lockUntil');

    if (!user) {
      throw new Error('Credenciales invalidas');
    }

    if (user.isLocked) {
      throw new Error('Cuenta bloqueada temporalmente');
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      await this.handleFailedLogin(user);
      throw new Error('Credenciales invalidas');
    }

    // login exitoso
    await this.handleSuccessfulLogin(user);

    const tokens = generateTokens(user._id);

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      },
      ...tokens,
    };
  }

  async refreshToken(refreshToken) {
    try {
      const decoded = verifyRefreshToken(refreshToken);
      const user = await User.findById(decoded.userId);

      if (!user || !user.isActive) {
        throw new Error('Usuario no valido');
      }
      const tokens = generateTokens(user._id);
      return tokens;
    } catch (error) {
      throw new Error('Refresh token invalido');
    }
  }

  async logout(userId) {
    const user = await User.findById(userId);
    if (user) {
      return { message: 'Logout exitoso' };
    }
    throw new Error('Usuario no encontrado');
  }

  async forgotPassword(email) {
    const user = await User.findOne({ email, isActive: true });
    if (!user) {
      return {
        message:
          'Si el email existe, recibirás instrucciones para resetear tu contraseña',
      };
    }

    const resetToken = generateResetToken();
    const hashedToken = hashToken(resetToken);

    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutos
    await user.save();

    return {
      message: 'Token de reset enviado al email',
      resetToken,
    };
  }

  async resetPassword(token, newPassword) {
    const hashedToken = hashToken(token);
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      throw new Error('Token inválido o expirado');
    }

    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.loginAttempts = 0;
    user.lockUntil = undefined;

    await user.save();

    return { message: 'Contraseña actualizada exitosamente' };
  }

  async handleFailedLogin(user) {
    const maxAttempts = 5;
    const lockTime = 2 * 60 * 60 * 1000; // 2 horas

    user.loginAttempts = (user.loginAttempts || 0) + 1;

    if (user.loginAttempts >= maxAttempts) {
      user.lockUntil = Date.now() + lockTime;
    }

    await user.save();
  }

  async handleSuccessfulLogin(user) {
    user.loginAttempts = 0;
    user.lockUntil = undefined;
    user.lastLogin = new Date();
    await user.save();
  }
}

export default new AuthService();
