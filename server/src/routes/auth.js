import express from 'express';
import {
  loginHandler,
  logoutHandler,
  refreshAccessTokenHandler,
  registerHandler,
  sendOtpHandler,
  verifyEmailHandler,
} from '../controllers/auth.controller.js';
import { deserializeUser } from '../middlewares/deserializeUser.js';
import { requireUser } from '../middlewares/requireUser.js';
import { validate } from '../middlewares/validate.js';
import {
  createUserSchema,
  loginUserSchema,
  sendOtpSchema,
  verifyEmailSchema,
} from '../schema/user.schema.js';

const router = express.Router();

// Register user route
router.post('/register', validate(createUserSchema), registerHandler);

// Send OPT route
router.post('/sendotp', validate(sendOtpSchema), sendOtpHandler);

// Verify Email
router.post('/verifyemail/:otp', validate(verifyEmailSchema), verifyEmailHandler);

// Login user route
router.post('/login', validate(loginUserSchema), loginHandler);

// Refresh access toke route
router.get('/refresh', refreshAccessTokenHandler);

// Logout User
router.get('/logout', deserializeUser, requireUser, logoutHandler);

export default router;
