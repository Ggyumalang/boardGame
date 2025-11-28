import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import * as attendanceController from '../controllers/attendanceController.js';

const router = express.Router();

router.post('/', protect, attendanceController.checkAttendance);
router.get('/history', protect, attendanceController.getMyHistory);
router.get('/history/:userId', protect, attendanceController.getUserHistory);
router.get('/today', protect, attendanceController.getTodayStatus);

export default router;
