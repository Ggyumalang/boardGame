import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import * as gameController from '../controllers/gameController.js';

const router = express.Router();

router.get('/', protect, gameController.getGames);
router.post('/', protect, gameController.createGame);
router.get('/:id', protect, gameController.getGame);
router.put('/:id', protect, gameController.updateGame);
router.delete('/:id', protect, gameController.deleteGame);

export default router;
