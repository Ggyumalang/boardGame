import React, { useState, useEffect } from 'react';
import apiClient from '../../shared/api/apiClient';
import { motion, AnimatePresence } from 'framer-motion';

const ParticipantInput = ({ onAdd, participants }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [score, setScore] = useState('');
    const [rank, setRank] = useState('');
    const [team, setTeam] = useState('');
    const [isWinner, setIsWinner] = useState(false);
    const [mvpBadge, setMvpBadge] = useState('');

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (query.length >= 2) {
                searchUsers();
            } else {
                setResults([]);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [query]);

    const searchUsers = async () => {
        try {
            const { data } = await apiClient.get('/users', { params: { search: query } });
            // Filter out already added participants
            const filtered = data.filter(u => !participants.some(p => p.userId === u.id));
            setResults(filtered);
        } catch (error) {
            console.error('Search failed', error);
        }
    };

    const handleSelectUser = (user) => {
        setSelectedUser(user);
        setQuery('');
        setResults([]);
    };

    const handleAdd = () => {
        if (!selectedUser) return;

        onAdd({
            userId: selectedUser.id,
            nickname: selectedUser.nickname,
            profileImage: selectedUser.profile_image,
            score: parseInt(score) || 0,
            rank: parseInt(rank) || null,
            team,
            isWinner,
            mvpBadge
        });

        // Reset form
        setSelectedUser(null);
        setScore('');
        setRank('');
        setTeam('');
        setIsWinner(false);
        setMvpBadge('');
    };

    return (
        <div className="bg-bg-secondary p-lg rounded-lg border border-border border-dashed">
            <h4 className="font-bold mb-md text-primary flex items-center gap-sm">
                <span className="bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">
                    +
                </span>
                참여자 추가
            </h4>

            {!selectedUser ? (
                <div className="relative">
                    <div className="relative">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="사용자 닉네임 검색..."
                            className="form-input pl-10"
                        />
                        <svg className="w-5 h-5 text-secondary absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>

                    <AnimatePresence>
                        {results.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute top-full left-0 right-0 mt-2 bg-white border border-border rounded-lg shadow-xl z-10 max-h-60 overflow-y-auto"
                            >
                                {results.map(user => (
                                    <div
                                        key={user.id}
                                        onClick={() => handleSelectUser(user)}
                                        className="p-md hover:bg-bg-tertiary cursor-pointer flex items-center gap-md transition-colors border-b border-border last:border-0"
                                    >
                                        {user.profile_image ? (
                                            <img src={user.profile_image} alt="" className="w-8 h-8 rounded-full" />
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs">
                                                {user.nickname.charAt(0)}
                                            </div>
                                        )}
                                        <span className="font-medium">{user.nickname}</span>
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                    {query.length > 0 && results.length === 0 && (
                        <div className="mt-2 text-sm text-secondary pl-1">검색 결과가 없습니다.</div>
                    )}
                </div>
            ) : (
                <div className="bg-white p-lg rounded-lg border border-border shadow-sm animate-fade-in">
                    <div className="flex items-center justify-between mb-lg pb-md border-b border-border">
                        <div className="flex items-center gap-md">
                            {selectedUser.profile_image ? (
                                <img src={selectedUser.profile_image} alt="" className="w-10 h-10 rounded-full border border-border" />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center text-white">
                                    {selectedUser.nickname.charAt(0)}
                                </div>
                            )}
                            <div>
                                <span className="font-bold text-lg block">{selectedUser.nickname}</span>
                                <span className="text-xs text-secondary">참여자 정보 입력</span>
                            </div>
                        </div>
                        <button
                            onClick={() => setSelectedUser(null)}
                            className="text-sm text-secondary hover:text-danger transition-colors flex items-center gap-xs"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            취소
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-lg mb-lg">
                        <div className="form-group">
                            <label className="form-label">점수</label>
                            <input
                                type="number"
                                placeholder="0"
                                value={score}
                                onChange={(e) => setScore(e.target.value)}
                                className="form-input"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">순위</label>
                            <input
                                type="number"
                                placeholder="-"
                                value={rank}
                                onChange={(e) => setRank(e.target.value)}
                                className="form-input"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-lg mb-lg">
                        <div className="form-group">
                            <label className="form-label">팀 (선택)</label>
                            <input
                                type="text"
                                placeholder="예: A팀"
                                value={team}
                                onChange={(e) => setTeam(e.target.value)}
                                className="form-input"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">배지 (선택)</label>
                            <select
                                value={mvpBadge}
                                onChange={(e) => setMvpBadge(e.target.value)}
                                className="form-select"
                            >
                                <option value="">없음</option>
                                <option value="mvp">🏆 MVP</option>
                                <option value="strategist">🧠 전략가</option>
                                <option value="lucky">🍀 행운아</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-md border-t border-border">
                        <label className="flex items-center gap-sm cursor-pointer p-2 hover:bg-bg-tertiary rounded-md transition-colors">
                            <input
                                type="checkbox"
                                checked={isWinner}
                                onChange={(e) => setIsWinner(e.target.checked)}
                                className="form-checkbox"
                            />
                            <span className="font-bold text-primary">승리한 플레이어</span>
                        </label>

                        <button
                            onClick={handleAdd}
                            className="btn btn-primary px-6"
                        >
                            참여자 추가 완료
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ParticipantInput;
