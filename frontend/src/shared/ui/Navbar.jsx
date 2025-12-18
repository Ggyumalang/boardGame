import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import DarkModeToggle from './DarkModeToggle';

const Navbar = () => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
    };

    const NavItem = ({ to, icon, label }) => {
        const active = isActive(to);
        return (
            <Link
                to={to}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 font-medium text-sm ${active
                    ? 'bg-brand text-white shadow-md transform scale-105'
                    : 'text-secondary hover:bg-tertiary hover:text-primary'
                    }`}
            >
                <span>{icon}</span>
                <span>{label}</span>
            </Link>
        );
    };

    return (
        <nav className="bg-glass border-b border-border sticky top-0 z-50 transition-colors">
            <div className="container h-16 flex items-center justify-between">
                <div className="flex items-center gap-12">
                    <Link to="/" className="text-xl font-bold text-brand hover:opacity-80 transition-opacity flex items-center gap-2">
                        <span className="text-2xl">🎲</span>
                        <span className="hidden sm:inline">BGM</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-8">
                        <NavItem to="/" icon="🏠" label="홈" />
                        <NavItem to="/games" icon="🎮" label="게임" />
                        <NavItem to="/stats" icon="📊" label="통계" />
                        <NavItem to="/sessions/new" icon="✍️" label="기록" />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <DarkModeToggle />

                    <div className="h-6 w-px bg-border"></div>

                    <Link to="/profile" className="flex items-center gap-2 hover:bg-tertiary p-1.5 pr-3 rounded-full transition-colors group">
                        {user?.profile_image ? (
                            <img
                                src={user.profile_image}
                                alt={user.nickname}
                                className="w-8 h-8 rounded-full border border-border group-hover:border-primary transition-colors"
                            />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
                                {user?.nickname?.charAt(0)}
                            </div>
                        )}
                        <span className="hidden sm:inline font-medium text-sm text-secondary group-hover:text-primary transition-colors">
                            {user?.nickname}
                        </span>
                    </Link>

                    <button
                        onClick={handleLogout}
                        className="p-2 text-secondary hover:text-danger hover:bg-red-50 rounded-full transition-colors"
                        title="로그아웃"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Navigation (Bottom Bar) */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-border pb-safe z-50">
                <div className="flex justify-around items-center p-2">
                    <Link to="/" className={`flex flex-col items-center p-2 rounded-lg ${isActive('/') ? 'text-primary' : 'text-secondary'}`}>
                        <span className="text-xl">🏠</span>
                        <span className="text-xs mt-1">홈</span>
                    </Link>
                    <Link to="/games" className={`flex flex-col items-center p-2 rounded-lg ${isActive('/games') ? 'text-primary' : 'text-secondary'}`}>
                        <span className="text-xl">🎮</span>
                        <span className="text-xs mt-1">게임</span>
                    </Link>
                    <Link to="/sessions/new" className={`flex flex-col items-center p-2 rounded-lg ${isActive('/sessions/new') ? 'text-primary' : 'text-secondary'}`}>
                        <span className="text-xl">✍️</span>
                        <span className="text-xs mt-1">기록</span>
                    </Link>
                    <Link to="/stats" className={`flex flex-col items-center p-2 rounded-lg ${isActive('/stats') ? 'text-primary' : 'text-secondary'}`}>
                        <span className="text-xl">📊</span>
                        <span className="text-xs mt-1">통계</span>
                    </Link>
                    <Link to="/profile" className={`flex flex-col items-center p-2 rounded-lg ${isActive('/profile') ? 'text-primary' : 'text-secondary'}`}>
                        <span className="text-xl">👤</span>
                        <span className="text-xs mt-1">MY</span>
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
