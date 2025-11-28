import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../../shared/store/authStore';
import apiClient from '../../shared/api/apiClient';
import toast from 'react-hot-toast';

const AuthSuccessPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { login } = useAuthStore();

    useEffect(() => {
        const token = searchParams.get('token');

        if (token) {
            // Store token temporarily to make the request
            localStorage.setItem('token', token);

            // Fetch user info
            apiClient.get('/auth/me')
                .then((response) => {
                    login(response.data, token);
                    toast.success(`환영합니다, ${response.data.nickname}님!`);
                    navigate('/');
                })
                .catch((error) => {
                    console.error('Login failed:', error);
                    toast.error('로그인 정보를 불러오는데 실패했습니다.');
                    navigate('/login');
                });
        } else {
            navigate('/login');
        }
    }, [searchParams, navigate, login]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-secondary">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-md"></div>
                <p className="text-lg font-medium text-secondary">로그인 처리 중...</p>
            </div>
        </div>
    );
};

export default AuthSuccessPage;
