import passport from 'passport';
import { Strategy as NaverStrategy } from 'passport-naver-v2';
import { Strategy as KakaoStrategy } from 'passport-kakao';
import * as UserModel from '../models/userModel.js';
import dotenv from 'dotenv';

dotenv.config();

// Serialize user for the session (if using sessions, but we'll use JWT)
// However, passport requires these for some flows or if we switch to sessions later
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await UserModel.findUserById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});

// Naver Strategy
passport.use(new NaverStrategy({
    clientID: process.env.NAVER_CLIENT_ID,
    clientSecret: process.env.NAVER_CLIENT_SECRET,
    callbackURL: process.env.NAVER_CALLBACK_URL
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            // Check if user exists
            let user = await UserModel.findUserByOAuth('naver', profile.id);

            if (!user) {
                // Create new user
                user = await UserModel.createUser({
                    email: profile.email || `naver_${profile.id}@example.com`, // Naver might not return email
                    nickname: profile.nickname || profile.name || 'User',
                    profileImage: profile.profileImage,
                    oauthProvider: 'naver',
                    oauthId: profile.id
                });
            }

            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }
));

// Kakao Strategy
passport.use(new KakaoStrategy({
    clientID: process.env.KAKAO_CLIENT_ID,
    clientSecret: process.env.KAKAO_CLIENT_SECRET || '', // Optional for Kakao
    callbackURL: process.env.KAKAO_CALLBACK_URL
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            // Check if user exists
            let user = await UserModel.findUserByOAuth('kakao', profile.id.toString());

            if (!user) {
                // Create new user
                // Kakao profile structure can vary, handling basic fields
                const kakaoAccount = profile._json.kakao_account;
                const properties = profile._json.properties;

                user = await UserModel.createUser({
                    email: kakaoAccount?.email || `kakao_${profile.id}@example.com`,
                    nickname: properties?.nickname || profile.username || 'User',
                    profileImage: properties?.profile_image || properties?.thumbnail_image,
                    oauthProvider: 'kakao',
                    oauthId: profile.id.toString()
                });
            }

            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }
));

export default passport;
