import React, { useState } from 'react';
import GameList from '../../features/game/GameList';
import GameFormModal from '../../features/game/GameFormModal';
import Navbar from '../../shared/ui/Navbar';

const GamesPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleSuccess = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    return (
        <div className="min-h-screen bg-bg-secondary">
            <Navbar />

            <div className="container py-xl">
                <div className="flex justify-between items-center mb-lg">
                    <h1 className="text-2xl font-bold text-primary">게임 목록</h1>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="btn btn-primary"
                    >
                        + 새 게임 등록
                    </button>
                </div>

                <GameList refreshTrigger={refreshTrigger} />
            </div>

            <GameFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleSuccess}
            />
        </div>
    );
};

export default GamesPage;
