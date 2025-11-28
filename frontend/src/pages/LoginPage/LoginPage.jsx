import React from 'react';
import { motion } from 'framer-motion';

const LoginPage = () => {
    const handleLogin = (provider) => {
        window.location.href = `${import.meta.env.VITE_API_URL}/auth/${provider}`;
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-secondary p-md">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md p-lg bg-primary rounded-xl shadow-xl text-center"
            >
                <h1 className="text-3xl font-bold mb-sm text-primary">Board Game Manager</h1>
                <p className="text-secondary mb-xl">모임 관리와 전적 기록을 한 곳에서!</p>

                <div className="flex flex-col gap-md">
                    <button
                        onClick={() => handleLogin('naver')}
                        className="flex items-center justify-center w-full py-3 px-4 rounded-md font-bold text-white transition-transform hover:scale-105"
                        style={{ backgroundColor: '#03C75A' }}
                    >
                        <span>Naver로 시작하기</span>
                    </button>

                    <button
                        onClick={() => handleLogin('kakao')}
                        className="flex items-center justify-center w-full py-3 px-4 rounded-md font-bold text-black transition-transform hover:scale-105"
                        style={{ backgroundColor: '#FEE500' }}
                    >
                        <span>Kakao로 시작하기</span>
                    </button>
                </div>

                <p className="mt-lg text-xs text-tertiary">
                    로그인 시 이용약관 및 개인정보처리방침에 동의하게 됩니다.
                </p>
            </motion.div>
        </div>
    );
};

export default LoginPage;
