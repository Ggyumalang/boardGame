import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import * as statsController from '../controllers/statsController.js';

const router = express.Router();

router.get('/user/:userId', protect, statsController.getUserStats);
router.get('/rankings', protect, statsController.getRankings);
router.get('/versus/:userId1/:userId2', protect, statsController.getHeadToHead);

export default router;
