import React from 'react';
import { useAuthStore } from '../../shared/store/authStore';
import AttendanceButton from '../../features/attendance/AttendanceButton';
import Navbar from '../../shared/ui/Navbar';

const HomePage = () => {
    const { user } = useAuthStore();

    return (
        <div className="min-h-screen bg-bg-secondary">
            <Navbar />

            <div className="container py-xl">
                <div className="mb-lg">
                    <h2 className="text-2xl font-bold text-primary mb-xs">안녕하세요, {user?.nickname}님! 👋</h2>
                    <p className="text-secondary">오늘도 즐거운 보드게임 한 판 어떠신가요?</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
                    {/* Dashboard cards */}
                    <div className="p-lg bg-white rounded-lg shadow-sm border border-border">
                        <h3 className="text-lg font-semibold mb-md">출석 체크</h3>
                        <p className="text-secondary mb-md">오늘 모임에 참석하셨나요?</p>
                        <AttendanceButton />
                    </div>

                    <div className="p-lg bg-white rounded-lg shadow-sm border border-border">
                        <h3 className="text-lg font-semibold mb-md">최근 게임</h3>
                        <p className="text-secondary">아직 기록된 게임이 없습니다.</p>
                    </div>

                    <div className="p-lg bg-white rounded-lg shadow-sm border border-border">
                        <h3 className="text-lg font-semibold mb-md">내 통계</h3>
                        <div className="flex justify-between text-sm text-secondary">
                            <span>총 플레이</span>
                            <span className="font-bold text-primary">0회</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
