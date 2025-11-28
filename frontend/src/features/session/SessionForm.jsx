import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../shared/api/apiClient';
import ParticipantInput from './ParticipantInput';
import toast from 'react-hot-toast';

const SessionForm = () => {
    const navigate = useNavigate();
    const [games, setGames] = useState([]);
    const [formData, setFormData] = useState({
        gameId: '',
        sessionDate: new Date().toISOString().slice(0, 16), // YYYY-MM-DDTHH:mm
        duration: 30,
        isTeamGame: false
    });
    const [participants, setParticipants] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchGames();
    }, []);

    const fetchGames = async () => {
        try {
            const { data } = await apiClient.get('/games');
            setGames(data);
        } catch (error) {
            console.error('Failed to fetch games', error);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleAddParticipant = (participant) => {
        setParticipants(prev => [...prev, participant]);
    };

    const handleRemoveParticipant = (userId) => {
        setParticipants(prev => prev.filter(p => p.userId !== userId));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.gameId) {
            toast.error('게임을 선택해주세요.');
            return;
        }
        if (participants.length === 0) {
            toast.error('최소 1명의 참여자가 필요합니다.');
            return;
        }

        setLoading(true);
        try {
            await apiClient.post('/sessions', {
                ...formData,
                participants
            });
            toast.success('플레이 기록이 저장되었습니다!');
            navigate('/games'); // Or to session detail page
        } catch (error) {
            console.error(error);
            toast.error('기록 저장에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto card">
            <div className="border-b border-border pb-md mb-lg">
                <h2 className="text-2xl font-bold text-primary">플레이 기록하기</h2>
                <p className="text-secondary mb-0">새로운 게임 세션을 기록하고 전적을 관리하세요.</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                {/* Game & Date Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                    <div className="form-group">
                        <label className="form-label">게임 선택</label>
                        <select
                            name="gameId"
                            value={formData.gameId}
                            onChange={handleChange}
                            className="form-select"
                            required
                        >
                            <option value="">게임을 선택하세요</option>
                            {games.map(game => (
                                <option key={game.id} value={game.id}>{game.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">플레이 날짜</label>
                        <input
                            type="datetime-local"
                            name="sessionDate"
                            value={formData.sessionDate}
                            onChange={handleChange}
                            className="form-input"
                            required
                        />
                    </div>
                </div>

                {/* Duration & Type Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                    <div className="form-group">
                        <label className="form-label">플레이 시간 (분)</label>
                        <div className="relative">
                            <input
                                type="number"
                                name="duration"
                                value={formData.duration}
                                onChange={handleChange}
                                className="form-input pr-12"
                                min="1"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary text-sm">분</span>
                        </div>
                    </div>
                    <div className="form-group flex items-end pb-2">
                        <label className="flex items-center gap-sm cursor-pointer p-2 hover:bg-tertiary rounded-md transition-colors w-full">
                            <input
                                type="checkbox"
                                name="isTeamGame"
                                checked={formData.isTeamGame}
                                onChange={handleChange}
                                className="form-checkbox"
                            />
                            <span className="font-medium text-primary">팀 게임으로 진행</span>
                        </label>
                    </div>
                </div>

                <hr className="border-border my-8" />

                {/* Participants Section */}
                <div>
                    <div className="flex items-center justify-between mb-md">
                        <h3 className="text-lg font-bold">참여자 및 결과</h3>
                        <span className="text-sm text-secondary bg-tertiary px-2 py-1 rounded-md">
                            현재 {participants.length}명
                        </span>
                    </div>

                    {/* Participants List */}
                    {participants.length > 0 && (
                        <div className="mb-lg flex flex-col gap-sm">
                            {participants.map((p, index) => (
                                <div key={p.userId} className="flex items-center justify-between bg-secondary p-md rounded-lg border border-border hover:border-primary-light transition-colors">
                                    <div className="flex items-center gap-lg">
                                        <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold ${p.rank === 1 ? 'bg-yellow-100 text-yellow-700' :
                                            p.rank === 2 ? 'bg-gray-100 text-gray-700' :
                                                p.rank === 3 ? 'bg-orange-100 text-orange-700' : 'bg-tertiary text-secondary'
                                            }`}>
                                            {p.rank || '-'}
                                        </div>

                                        <div className="flex items-center gap-md">
                                            {p.profileImage ? (
                                                <img src={p.profileImage} alt="" className="w-10 h-10 rounded-full border border-border" />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center text-white">
                                                    {p.nickname.charAt(0)}
                                                </div>
                                            )}
                                            <div>
                                                <div className="font-bold">{p.nickname}</div>
                                                <div className="text-xs text-secondary">{p.team ? `Team ${p.team}` : '개인전'}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-xl">
                                        <div className="text-right">
                                            <div className="font-bold text-lg text-primary">{p.score}점</div>
                                            <div className="flex gap-xs justify-end">
                                                {p.isWinner && <span title="승리" className="text-lg">👑</span>}
                                                {p.mvpBadge === 'mvp' && <span title="MVP" className="text-lg">🏆</span>}
                                                {p.mvpBadge === 'strategist' && <span title="전략가" className="text-lg">🧠</span>}
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => handleRemoveParticipant(p.userId)}
                                            className="p-2 text-secondary hover:text-danger hover:bg-red-50 rounded-full transition-colors"
                                            title="삭제"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <ParticipantInput onAdd={handleAddParticipant} participants={participants} />
                </div >

                <div className="flex justify-end gap-md mt-lg pt-lg border-t border-border">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="btn btn-secondary px-6"
                    >
                        취소
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary px-8 py-2.5 text-base shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
                    >
                        {loading ? (
                            <div className="flex items-center gap-sm">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>저장 중...</span>
                            </div>
                        ) : (
                            '기록 저장하기'
                        )}
                    </button>
                </div>
            </form >
        </div >
    );
};

export default SessionForm;
