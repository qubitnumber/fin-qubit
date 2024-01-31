import express from 'express';
import {
  getAllUsersHandler,
  getMeHandler,
} from '../controllers/user.controller.js';
import { deserializeUser } from '../middlewares/deserializeUser.js';
import { requireUser } from '../middlewares/requireUser.js';
import { restrictTo } from '../middlewares/restrictTo.js';

const router = express.Router();

router.use(deserializeUser, requireUser);

// Admin Get Users route
router.get('/', restrictTo('admin'), getAllUsersHandler);

// Get my info route
router.get('/me', getMeHandler);

export default router;