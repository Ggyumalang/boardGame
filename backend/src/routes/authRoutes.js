import express from 'express';
import passport from 'passport';
import * as authController from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Naver Auth
router.get('/naver', passport.authenticate('naver'));
router.get(
    '/callback/naver',
    passport.authenticate('naver', { session: false, failureRedirect: '/login?error=naver_failed' }),
    authController.handleOAuthCallback
);

// Kakao Auth
router.get('/kakao', passport.authenticate('kakao'));
router.get(
    '/callback/kakao',
    passport.authenticate('kakao', { session: false, failureRedirect: '/login?error=kakao_failed' }),
    authController.handleOAuthCallback
);

// User Info
router.get('/me', protect, authController.getMe);
router.post('/logout', authController.logout);

export default router;
