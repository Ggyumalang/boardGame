import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import apiClient from '../../shared/api/apiClient';
import toast from 'react-hot-toast';

const GameFormModal = ({ isOpen, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        genre: '',
        description: '',
        minPlayers: 2,
        maxPlayers: 4,
        avgPlaytime: 30,
        imageUrl: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await apiClient.post('/games', formData);
            toast.success('게임이 등록되었습니다!');
            onSuccess();
            onClose();
            setFormData({
                name: '',
                genre: '',
                description: '',
                minPlayers: 2,
                maxPlayers: 4,
                avgPlaytime: 30,
                imageUrl: ''
            });
        } catch (error) {
            console.error(error);
            toast.error('게임 등록에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative bg-white rounded-lg shadow-xl w-full max-w-lg max-h-90 flex flex-col overflow-hidden"
                    >
                        <div className="p-lg border-b border-border flex justify-between items-center bg-white z-10">
                            <h2 className="text-xl font-bold">새 게임 등록</h2>
                            <button onClick={onClose} className="text-secondary hover:text-primary p-2 -mr-2 transition-colors">✕</button>
                        </div>

                        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 bg-white">
                            <div className="p-lg overflow-y-auto flex-1 flex flex-col gap-md">
                                <div>
                                    <label className="block text-sm font-medium mb-xs text-secondary">게임 이름</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full p-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                                        placeholder="예: 스플렌더"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-md">
                                    <div>
                                        <label className="block text-sm font-medium mb-xs text-secondary">장르</label>
                                        <select
                                            name="genre"
                                            value={formData.genre}
                                            onChange={handleChange}
                                            className="w-full p-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                                        >
                                            <option value="">선택하세요</option>
                                            <option value="strategy">전략</option>
                                            <option value="party">파티</option>
                                            <option value="cooperative">협력</option>
                                            <option value="card">카드</option>
                                            <option value="wargame">워게임</option>
                                            <option value="family">가족</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-xs text-secondary">평균 플레이 시간 (분)</label>
                                        <input
                                            type="number"
                                            name="avgPlaytime"
                                            value={formData.avgPlaytime}
                                            onChange={handleChange}
                                            className="w-full p-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-md">
                                    <div>
                                        <label className="block text-sm font-medium mb-xs text-secondary">최소 인원</label>
                                        <input
                                            type="number"
                                            name="minPlayers"
                                            value={formData.minPlayers}
                                            onChange={handleChange}
                                            min="1"
                                            className="w-full p-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-xs text-secondary">최대 인원</label>
                                        <input
                                            type="number"
                                            name="maxPlayers"
                                            value={formData.maxPlayers}
                                            onChange={handleChange}
                                            min="1"
                                            className="w-full p-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-xs text-secondary">이미지 URL (선택)</label>
                                    <input
                                        type="url"
                                        name="imageUrl"
                                        value={formData.imageUrl}
                                        onChange={handleChange}
                                        className="w-full p-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                                        placeholder="https://example.com/image.jpg"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-xs text-secondary">설명 (선택)</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows="3"
                                        className="w-full p-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                                    ></textarea>
                                </div>
                            </div>

                            <div className="p-lg border-t border-border flex justify-end gap-sm mt-auto bg-bg-secondary/50">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-4 py-2 text-secondary hover:bg-gray-100 rounded-md transition-colors"
                                >
                                    취소
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn btn-primary px-6"
                                >
                                    {loading ? '등록 중...' : '등록하기'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default GameFormModal;
