import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import * as badgeController from '../controllers/badgeController.js';

const router = express.Router();

router.get('/my', protect, badgeController.getMyBadges);
router.get('/user/:userId', protect, badgeController.getUserBadges);

export default router;
