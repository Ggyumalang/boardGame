import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../shared/store/authStore';
import apiClient from '../../shared/api/apiClient';
import Navbar from '../../shared/ui/Navbar';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const StatsPage = () => {
    const { user } = useAuthStore();
    const [activeTab, setActiveTab] = useState('my');
    const [myStats, setMyStats] = useState(null);
    const [rankings, setRankings] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (activeTab === 'my') {
            fetchMyStats();
        } else if (activeTab === 'rankings') {
            fetchRankings();
        }
    }, [activeTab]);

    const fetchMyStats = async () => {
        setLoading(true);
        try {
            const { data } = await apiClient.get(`/stats/user/${user.id}`);
            setMyStats(data);
        } catch (error) {
            console.error('Failed to fetch stats', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRankings = async () => {
        setLoading(true);
        try {
            const { data } = await apiClient.get('/stats/rankings?type=wins');
            setRankings(data);
        } catch (error) {
            console.error('Failed to fetch rankings', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-bg-secondary">
            <Navbar />

            <div className="container py-xl">
                <h1 className="text-2xl font-bold text-primary mb-lg">통계 및 분석</h1>

                <div className="flex gap-md mb-lg border-b border-border">
                    <button
                        onClick={() => setActiveTab('my')}
                        className={`pb-2 px-4 font-medium transition-colors ${activeTab === 'my' ? 'text-primary border-b-2 border-primary' : 'text-secondary hover:text-primary'}`}
                    >
                        내 통계
                    </button>
                    <button
                        onClick={() => setActiveTab('rankings')}
                        className={`pb-2 px-4 font-medium transition-colors ${activeTab === 'rankings' ? 'text-primary border-b-2 border-primary' : 'text-secondary hover:text-primary'}`}
                    >
                        랭킹
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-xl text-secondary">로딩 중...</div>
                ) : activeTab === 'my' && myStats ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
                        {/* Overall Stats */}
                        <div className="bg-white p-lg rounded-lg shadow-sm border border-border">
                            <h3 className="text-lg font-bold mb-md">종합 기록</h3>
                            <div className="grid grid-cols-2 gap-md text-center">
                                <div className="p-md bg-gray-50 rounded">
                                    <div className="text-2xl font-bold text-primary">{myStats.overall?.total_plays || 0}</div>
                                    <div className="text-sm text-secondary">총 플레이</div>
                                </div>
                                <div className="p-md bg-gray-50 rounded">
                                    <div className="text-2xl font-bold text-success">{myStats.overall?.total_wins || 0}</div>
                                    <div className="text-sm text-secondary">승리</div>
                                </div>
                                <div className="p-md bg-gray-50 rounded">
                                    <div className="text-2xl font-bold text-secondary">{myStats.overall?.total_mvp || 0}</div>
                                    <div className="text-sm text-secondary">MVP</div>
                                </div>
                                <div className="p-md bg-gray-50 rounded">
                                    <div className="text-2xl font-bold text-tertiary">
                                        {myStats.overall?.total_plays ? Math.round((myStats.overall.total_wins / myStats.overall.total_plays) * 100) : 0}%
                                    </div>
                                    <div className="text-sm text-secondary">승률</div>
                                </div>
                            </div>
                        </div>

                        {/* Win Rate Chart */}
                        <div className="bg-white p-lg rounded-lg shadow-sm border border-border">
                            <h3 className="text-lg font-bold mb-md">승률 분석</h3>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={[
                                                { name: '승리', value: parseInt(myStats.overall?.total_wins || 0) },
                                                { name: '패배', value: parseInt(myStats.overall?.total_losses || 0) }
                                            ]}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            <Cell key="win" fill="#00C49F" />
                                            <Cell key="loss" fill="#FF8042" />
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Game Stats Table */}
                        <div className="col-span-1 lg:col-span-2 bg-white p-lg rounded-lg shadow-sm border border-border">
                            <h3 className="text-lg font-bold mb-md">게임별 기록</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-border text-secondary text-sm">
                                            <th className="py-2">게임</th>
                                            <th className="py-2">플레이</th>
                                            <th className="py-2">승리</th>
                                            <th className="py-2">승률</th>
                                            <th className="py-2">평균 점수</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {myStats.games.map(game => (
                                            <tr key={game.game_id} className="border-b border-gray-100 last:border-0">
                                                <td className="py-3 font-medium">{game.game_name}</td>
                                                <td className="py-3">{game.total_plays}</td>
                                                <td className="py-3 text-success">{game.wins}</td>
                                                <td className="py-3">
                                                    {Math.round((game.wins / game.total_plays) * 100)}%
                                                </td>
                                                <td className="py-3">{parseFloat(game.avg_score).toFixed(1)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                ) : activeTab === 'rankings' ? (
                    <div className="bg-white p-lg rounded-lg shadow-sm border border-border">
                        <h3 className="text-lg font-bold mb-md">전체 랭킹 (승리 기준)</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-border text-secondary text-sm">
                                        <th className="py-2 w-16">순위</th>
                                        <th className="py-2">사용자</th>
                                        <th className="py-2">승리</th>
                                        <th className="py-2">플레이</th>
                                        <th className="py-2">승률</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rankings.map((r, index) => (
                                        <tr key={r.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                                            <td className="py-3 font-bold text-primary">{index + 1}</td>
                                            <td className="py-3 flex items-center gap-sm">
                                                {r.profile_image && <img src={r.profile_image} alt="" className="w-8 h-8 rounded-full" />}
                                                <span>{r.nickname}</span>
                                            </td>
                                            <td className="py-3 font-bold text-success">{r.total_wins}</td>
                                            <td className="py-3">{r.total_plays}</td>
                                            <td className="py-3">
                                                {r.total_plays ? Math.round((r.total_wins / r.total_plays) * 100) : 0}%
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default StatsPage;
