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

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden"
                >
                    <div className="p-lg border-b border-border flex justify-between items-center">
                        <h2 className="text-xl font-bold">새 게임 등록</h2>
                        <button onClick={onClose} className="text-secondary hover:text-primary">✕</button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-lg flex flex-col gap-md">
                        <div>
                            <label className="block text-sm font-medium mb-xs">게임 이름</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full p-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="예: 스플렌더"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-md">
                            <div>
                                <label className="block text-sm font-medium mb-xs">장르</label>
                                <select
                                    name="genre"
                                    value={formData.genre}
                                    onChange={handleChange}
                                    className="w-full p-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
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
                                <label className="block text-sm font-medium mb-xs">평균 플레이 시간 (분)</label>
                                <input
                                    type="number"
                                    name="avgPlaytime"
                                    value={formData.avgPlaytime}
                                    onChange={handleChange}
                                    className="w-full p-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-md">
                            <div>
                                <label className="block text-sm font-medium mb-xs">최소 인원</label>
                                <input
                                    type="number"
                                    name="minPlayers"
                                    value={formData.minPlayers}
                                    onChange={handleChange}
                                    min="1"
                                    className="w-full p-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-xs">최대 인원</label>
                                <input
                                    type="number"
                                    name="maxPlayers"
                                    value={formData.maxPlayers}
                                    onChange={handleChange}
                                    min="1"
                                    className="w-full p-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-xs">이미지 URL (선택)</label>
                            <input
                                type="url"
                                name="imageUrl"
                                value={formData.imageUrl}
                                onChange={handleChange}
                                className="w-full p-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-xs">설명 (선택)</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="3"
                                className="w-full p-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            ></textarea>
                        </div>

                        <div className="flex justify-end gap-sm mt-md">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-secondary hover:bg-gray-100 rounded-md"
                            >
                                취소
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark disabled:opacity-70"
                            >
                                {loading ? '등록 중...' : '등록하기'}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default GameFormModal;
