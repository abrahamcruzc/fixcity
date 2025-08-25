/**
 * Mongoose schema for a User document.
 *
 * @typedef {Object} User
 *
 * @property {string} name
 *   - Required. Trimmed string. Minimum 2 characters, maximum 50 characters.
 *   - Validation message: 'El nombre es obligatorio' / 'El nombre debe tener al menos 2 caracteres' / 'El nombre no puede exceder 50 caracteres'
 *
 * @property {string} email
 *   - Required, unique, stored lowercase and trimmed. Must match a standard email pattern.
 *   - Validation message: 'El email es obligatorio' / 'Por favor ingresa un email valido'
 *
 * @property {string} phone
 *   - Required, trimmed. Must match international-style phone regex (optional '+' then digits, 1–16 digits).
 *   - Validation message: 'El teléfono es obligatorio' / 'Por favor ingresa un numero valido'
 *
 * @property {string} password
 *   - Required. Minimum length 8. Stored but excluded from query results by default (select: false).
 *   - Validation message: 'La contraseña es obligatoria' / 'La contraseña debe tener al menos 8 caracteres'
 *
 * @property {'citizen'|'admin'|'operator'} role
 *   - Enum with allowed values 'citizen', 'admin', 'operator'. Default: 'citizen'.
 *   - Validation message: 'El rol debe ser: citizen, admin o operator'
 *
 * @property {boolean} isActive
 *   - Whether the account is active. Default: true.
 *
 * @property {boolean} isEmailVerified
 *   - Whether the email has been verified. Default: true.
 *
 * @property {string} [emailVerificationToken]
 *   - Token used for email verification. Excluded from query results by default (select: false).
 *
 * @property {string} [passwordResetToken]
 *   - Token used for password reset. Excluded from query results by default (select: false).
 *
 * @property {Date} [passwordResetExpires]
 *   - Expiration timestamp for the password reset token. Excluded from query results by default (select: false).
 *
 * @property {Date|null} [lastLogin]
 *   - Timestamp of the user's last successful login. Default: null.
 *
 * @property {number} loginAttempts
 *   - Number of recent failed login attempts. Default: 0.
 *
 * @property {Date} [lockUntil]
 *   - If present, indicates the date/time until which the account is locked. Excluded from query results by default (select: false).
 *
 * Schema options:
 * - timestamps: true — automatically adds createdAt and updatedAt fields.
 * - toJSON.transform: removes sensitive/internal fields from serialized output:
 *     * password
 *     * emailVerificationToken
 *     * passwordResetExpires
 *     * lockUntil
 *     * __v
 *
 * Notes:
 * - Fields marked with select: false will not be returned by default in query results unless explicitly selected.
 * - Validation messages in the schema are provided in Spanish.
 */

import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';


const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
      maxlength: [50, 'El nombre no puede exceder 50 caracteres'],
      minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
    },
    email: {
      type: String,
      required: [true, 'El email es obligatorio'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Por favor ingresa un email valido',
      ],
    },
    phone: {
      type: String,
      required: [true, 'El teléfono es obligatorio'],
      trim: true,
      match: [/^[\+]?[1-9][\d]{0,15}$/, 'Por favor ingresa un numero valido'],
    },
    password: {
      type: String,
      required: [true, 'La contraseña es obligatoria'],
      minlength: [8, 'La contraseña debe tener al menos 8 caracteres'],
      select: false,
    },
    role: {
      type: String,
      enum: {
        values: ['citizen', 'admin', 'operator'],
        message: 'El rol debe ser: citizen, admin o operator',
      },
      default: 'citizen',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: true,
    },
    emailVerificationToken: {
      type: String,
      select: false,
    },
    passwordResetToken: {
      type: String,
      select: false,
    },
    passwordResetExpires: {
      type: Date,
      select: false,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    loginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        delete ret.password;
        delete ret.emailVerificationToken;
        delete ret.passwordResetExpires;
        delete ret.lockUntil;
        delete ret.__v;
        return ret;
      },
    },
  }
);

userSchema.index({ phone: 1 });
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });

// virtual to verify if the account is blocked
userSchema.virtual('isLocked').get(function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// middleware: pre-save to hash password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.passwordChangedAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

export default mongoose.model('User', userSchema);
