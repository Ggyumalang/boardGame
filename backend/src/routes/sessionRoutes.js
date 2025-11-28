import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import * as sessionController from '../controllers/sessionController.js';

const router = express.Router();

router.post('/', protect, sessionController.createSession);
router.get('/', protect, sessionController.getSessions);
router.get('/:id', protect, sessionController.getSessionDetail);

export default router;
