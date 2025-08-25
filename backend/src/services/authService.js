import User from '../models/User.js';
import {
  generateResetToken,
  generateTokens,
  hashToken,
} from '../utils/tokenUtils.js';

class AuthService {
  async register(userData) {
    const { name, email, phone, password, role = 'citizen' } = userData;

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
      role,
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
