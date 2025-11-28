import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './shared/store/authStore';

import LoginPage from './pages/LoginPage/LoginPage';
import AuthSuccessPage from './pages/LoginPage/AuthSuccessPage';
import HomePage from './pages/HomePage/HomePage';
import GamesPage from './pages/GamesPage/GamesPage';
import SessionCreatePage from './pages/SessionCreatePage/SessionCreatePage';
import StatsPage from './pages/StatsPage/StatsPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuthStore();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

function App() {
    return (
        <BrowserRouter>
            <Toaster position="top-center" />
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/auth/success" element={<AuthSuccessPage />} />

                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <HomePage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/games"
                    element={
                        <ProtectedRoute>
                            <GamesPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/sessions/new"
                    element={
                        <ProtectedRoute>
                            <SessionCreatePage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/stats"
                    element={
                        <ProtectedRoute>
                            <StatsPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <ProfilePage />
                        </ProtectedRoute>
                    }
                />

                {/* Fallback route */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
