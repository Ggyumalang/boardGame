import React, { useState, useEffect } from 'react';
import apiClient from '../../shared/api/apiClient';
import GameCard from './GameCard';

const GameList = ({ refreshTrigger }) => {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState({ genre: '', search: '' });

    useEffect(() => {
        fetchGames();
    }, [refreshTrigger, filter.genre]); // Refetch when refreshTrigger or genre changes

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchGames();
        }, 500);
        return () => clearTimeout(timer);
    }, [filter.search]);

    const fetchGames = async () => {
        setLoading(true);
        try {
            const params = {};
            if (filter.genre) params.genre = filter.genre;
            if (filter.search) params.search = filter.search;

            const { data } = await apiClient.get('/games', { params });
            setGames(data);
        } catch (error) {
            console.error('Failed to fetch games', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchChange = (e) => {
        setFilter(prev => ({ ...prev, search: e.target.value }));
    };

    const handleGenreChange = (e) => {
        setFilter(prev => ({ ...prev, genre: e.target.value }));
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row gap-md mb-lg">
                <input
                    type="text"
                    placeholder="게임 검색..."
                    value={filter.search}
                    onChange={handleSearchChange}
                    className="flex-1 p-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <select
                    value={filter.genre}
                    onChange={handleGenreChange}
                    className="p-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                    <option value="">모든 장르</option>
                    <option value="strategy">전략</option>
                    <option value="party">파티</option>
                    <option value="cooperative">협력</option>
                    <option value="card">카드</option>
                    <option value="wargame">워게임</option>
                    <option value="family">가족</option>
                </select>
            </div>

            {loading ? (
                <div className="text-center py-xl text-secondary">로딩 중...</div>
            ) : games.length === 0 ? (
                <div className="text-center py-xl text-secondary">등록된 게임이 없습니다.</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-lg">
                    {games.map(game => (
                        <GameCard key={game.id} game={game} onClick={(g) => console.log('Clicked', g)} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default GameList;
