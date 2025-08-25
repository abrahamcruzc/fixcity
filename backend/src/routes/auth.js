/**
 * Express router that defines authentication-related routes for the application.
 *
 * Routes:
 *  - POST /register
 *      - Public
 *      - Controller: AuthController.register
 *      - Description: Register a new user account.
 *      - Expected body: object containing registration details (e.g., name, email, password, and any additional required fields).
 *      - Response: Typically returns created user data and/or authentication tokens or an error.
 *
 *  - POST /login
 *      - Public
 *      - Controller: AuthController.login
 *      - Description: Authenticate a user with credentials.
 *      - Expected body: object containing credentials (e.g., email/username and password).
 *      - Response: Typically returns access and refresh tokens and user info or an authentication error.
 *
 *  - POST /refresh-token
 *      - Public
 *      - Controller: AuthController.refreshToken
 *      - Description: Exchange a valid refresh token for a new access token (and possibly a new refresh token).
 *      - Expected body: object containing a refresh token.
 *      - Response: New access token (and possibly a new refresh token) or an error if the refresh token is invalid/expired.
 *
 *  - POST /forgot-password
 *      - Public
 *      - Controller: AuthController.forgotPassword
 *      - Description: Initiate a password reset flow (e.g., send a reset email with a token).
 *      - Expected body: object containing user identifier (commonly an email).
 *      - Response: Confirmation that reset instructions were sent or an error.
 *
 *  - POST /reset-password
 *      - Public
 *      - Controller: AuthController.resetPassword
 *      - Description: Complete a password reset using a token and a new password.
 *      - Expected body: object containing reset token and new password.
 *      - Response: Confirmation of password change or an error if token is invalid/expired.
 *
 *  - GET /profile
 *      - Protected (uses authenticate middleware)
 *      - Middleware: authenticate
 *      - Controller: AuthController.getProfile
 *      - Description: Retrieve the authenticated user's profile information.
 *      - Request: Authenticated request (e.g., contains a valid access token).
 *      - Response: The user's profile data or an authorization error.
 *
 *  - POST /logout
 *      - Protected (uses authenticate middleware)
 *      - Middleware: authenticate
 *      - Controller: AuthController.logout
 *      - Description: Log out the authenticated user (e.g., invalidate tokens, clear sessions).
 *      - Request: Authenticated request.
 *      - Response: Confirmation of logout or an error.
 *
 * Dependencies:
 *  - ../controllers/authController.js : AuthController that implements handlers for each route.
 *  - ../middleware/auth.js : authenticate middleware used to protect routes that require authentication.
 *
 * Export:
 *  - Default export: express.Router configured with the above routes.
 *
 * @module routes/auth
 * @returns {import("express").Router} Configured Express router for authentication endpoints.
 */

import express from 'express';
import AuthController from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Rutas públicas
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/refresh-token', AuthController.refreshToken);
router.post('/forgot-password', AuthController.forgotPassword);
router.post('/reset-password', AuthController.resetPassword);

// Rutas protegidas
router.get('/profile', authenticate, AuthController.getProfile);
router.post('/logout', authenticate, AuthController.logout);

export default router;
