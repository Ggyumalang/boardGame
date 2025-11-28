import React, { useState, useEffect } from 'react';
import apiClient from '../../shared/api/apiClient';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const AttendanceButton = () => {
    const [loading, setLoading] = useState(false);
    const [attended, setAttended] = useState(false);
    const [points, setPoints] = useState(0);

    useEffect(() => {
        checkStatus();
    }, []);

    const checkStatus = async () => {
        try {
            const { data } = await apiClient.get('/attendances/today');
            setAttended(data.attended);
            if (data.attended) {
                setPoints(data.attendance.points);
            }
        } catch (error) {
            console.error('Failed to check attendance status', error);
        }
    };

    const handleAttendance = async () => {
        if (attended) return;

        setLoading(true);
        try {
            const { data } = await apiClient.post('/attendances');
            setAttended(true);
            setPoints(data.pointsEarned);
            toast.success(`출석 완료! +${data.pointsEarned} 포인트 획득!`);
        } catch (error) {
            if (error.response?.data?.message === 'Already attended today') {
                toast.error('이미 오늘 출석하셨습니다.');
                setAttended(true);
            } else {
                toast.error('출석 체크에 실패했습니다.');
            }
        } finally {
            setLoading(false);
        }
    };

    if (attended) {
        return (
            <div className="w-full py-3 bg-tertiary rounded-md text-center border border-border">
                <span className="text-success font-bold mr-2">✓ 출석 완료</span>
                <span className="text-secondary text-sm">(+{points} P)</span>
            </div>
        );
    }

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAttendance}
            disabled={loading}
            className="w-full py-3 bg-primary text-white rounded-md font-bold hover:bg-primary-dark transition-colors shadow-md disabled:opacity-70"
        >
            {loading ? '처리 중...' : '출석하고 포인트 받기'}
        </motion.button>
    );
};

export default AttendanceButton;
