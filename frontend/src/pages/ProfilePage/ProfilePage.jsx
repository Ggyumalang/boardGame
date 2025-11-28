import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../shared/store/authStore';
import apiClient from '../../shared/api/apiClient';
import Navbar from '../../shared/ui/Navbar';
import BadgeList from '../../features/badge/BadgeList';
import AttendanceButton from '../../features/attendance/AttendanceButton';
import AttendanceCalendar from '../../features/attendance/AttendanceCalendar';

const ProfilePage = () => {
    const { user } = useAuthStore();
    const [profile, setProfile] = useState(null);
    const [badges, setBadges] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchProfile();
            fetchBadges();
        }
    }, [user]);

    const fetchProfile = async () => {
        try {
            const { data } = await apiClient.get(`/users/${user.id}`);
            setProfile(data);
        } catch (error) {
            console.error('Failed to fetch profile', error);
        }
    };

    const fetchBadges = async () => {
        try {
            const { data } = await apiClient.get('/badges/my');
            setBadges(data);
        } catch (error) {
            console.error('Failed to fetch badges', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="min-h-screen bg-bg-secondary flex items-center justify-center">로딩 중...</div>;
    }

    return (
        <div className="min-h-screen bg-bg-secondary">
            <Navbar />

            <div className="container py-xl">
                {/* Profile Header */}
                <div className="bg-white p-lg rounded-lg shadow-sm border border-border mb-lg flex flex-col md:flex-row items-center gap-lg">
                    <div className="relative">
                        {profile?.profile_image ? (
                            <img src={profile.profile_image} alt="" className="w-32 h-32 rounded-full border-4 border-white shadow-md" />
                        ) : (
                            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-4xl">👤</div>
                        )}
                        <div className="absolute bottom-0 right-0 bg-primary text-white text-xs font-bold px-2 py-1 rounded-full border-2 border-white">
                            Lv.{profile?.level || 1}
                        </div>
                    </div>

                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-2xl font-bold text-primary mb-xs">{profile?.nickname}</h1>
                        <p className="text-secondary mb-md">{profile?.rank || 'Bronze'} Rank</p>

                        <div className="flex items-center justify-center md:justify-start gap-lg text-sm">
                            <div>
                                <span className="font-bold text-lg block">{profile?.points || 0}</span>
                                <span className="text-secondary">포인트</span>
                            </div>
                            <div>
                                <span className="font-bold text-lg block">{badges.length}</span>
                                <span className="text-secondary">배지</span>
                            </div>
                            <div>
                                <span className="font-bold text-lg block">{new Date(profile?.created_at).toLocaleDateString()}</span>
                                <span className="text-secondary">가입일</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-sm w-full md:w-auto">
                        <AttendanceButton />
                        <button className="px-4 py-2 border border-border rounded-md hover:bg-gray-50 text-sm font-medium">
                            프로필 수정
                        </button>
                    </div>
                </div>

                {/* Badges Section */}
                <div className="mb-lg">
                    <h2 className="text-xl font-bold text-primary mb-md flex items-center gap-sm">
                        <span>🏆</span> 획득한 배지
                    </h2>
                    <BadgeList badges={badges} />
                </div>

                {/* Attendance Calendar Section */}
                <div className="mb-lg">
                    <AttendanceCalendar />
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
