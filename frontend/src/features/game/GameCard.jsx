import React from 'react';
import { motion } from 'framer-motion';

const GameCard = ({ game, onClick }) => {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            onClick={() => onClick(game)}
            className="bg-white rounded-lg shadow-sm border border-border overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
        >
            <div className="h-32 bg-gray-200 relative overflow-hidden">
                {game.image_url ? (
                    <img
                        src={game.image_url}
                        alt={game.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-4xl text-gray-400">
                        🎲
                    </div>
                )}
                <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                    {game.genre || '기타'}
                </div>
            </div>

            <div className="p-md">
                <h3 className="font-bold text-lg mb-xs truncate">{game.name}</h3>
                <div className="flex items-center gap-sm text-sm text-secondary mb-sm">
                    <span>👥 {game.min_players}-{game.max_players}인</span>
                    <span>⏱️ {game.avg_playtime}분</span>
                </div>
                <p className="text-sm text-tertiary line-clamp-2">
                    {game.description || '설명이 없습니다.'}
                </p>
            </div>
        </motion.div>
    );
};

export default GameCard;
