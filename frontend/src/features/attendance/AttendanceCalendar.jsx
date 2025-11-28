import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import apiClient from '../../shared/api/apiClient';
import { useAuthStore } from '../../shared/store/authStore';

const AttendanceCalendar = () => {
    const { user } = useAuthStore();
    const [value, setValue] = useState(new Date());
    const [attendances, setAttendances] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            fetchAttendances();
        }
    }, [value, user]);

    const fetchAttendances = async () => {
        setLoading(true);
        try {
            const year = value.getFullYear();
            const month = value.getMonth() + 1;
            const { data } = await apiClient.get(`/attendances/history/${user.id}`, {
                params: { year, month }
            });
            setAttendances(data);
        } catch (error) {
            console.error('Failed to fetch attendances', error);
        } finally {
            setLoading(false);
        }
    };

    const tileClassName = ({ date, view }) => {
        if (view === 'month') {
            const dateStr = format(date, 'yyyy-MM-dd');
            const hasAttendance = attendances.some(a => {
                const attendanceDate = new Date(a.attendance_date);
                return format(attendanceDate, 'yyyy-MM-dd') === dateStr;
            });

            if (hasAttendance) {
                return 'attendance-marked';
            }
        }
        return null;
    };

    const tileContent = ({ date, view }) => {
        if (view === 'month') {
            const dateStr = format(date, 'yyyy-MM-dd');
            const attendance = attendances.find(a => {
                const attendanceDate = new Date(a.attendance_date);
                return format(attendanceDate, 'yyyy-MM-dd') === dateStr;
            });

            if (attendance) {
                return (
                    <div className="attendance-marker">
                        <span className="text-xs">✓</span>
                    </div>
                );
            }
        }
        return null;
    };

    return (
        <div className="bg-white p-lg rounded-lg shadow-sm border border-border">
            <h3 className="text-lg font-bold mb-md">출석 캘린더</h3>

            {loading && <div className="text-center text-secondary mb-md">로딩 중...</div>}

            <div className="attendance-calendar">
                <Calendar
                    onChange={setValue}
                    value={value}
                    tileClassName={tileClassName}
                    tileContent={tileContent}
                    locale="ko-KR"
                />
            </div>

            <style jsx>{`
        .attendance-calendar :global(.react-calendar) {
          width: 100%;
          border: none;
          font-family: inherit;
        }
        
        .attendance-calendar :global(.react-calendar__tile) {
          padding: 0.75rem 0.5rem;
          position: relative;
        }
        
        .attendance-calendar :global(.attendance-marked) {
          background-color: #e0f2fe;
          color: #0369a1;
          font-weight: 600;
        }
        
        .attendance-calendar :global(.attendance-marked:hover) {
          background-color: #bae6fd;
        }
        
        .attendance-calendar :global(.react-calendar__tile--now) {
          background-color: #fef3c7;
        }
        
        .attendance-calendar :global(.react-calendar__tile--active) {
          background-color: #3b82f6;
          color: white;
        }
        
        .attendance-marker {
          position: absolute;
          top: 2px;
          right: 2px;
          color: #10b981;
          font-size: 0.75rem;
        }
      `}</style>

            <div className="mt-md flex items-center gap-md text-sm">
                <div className="flex items-center gap-xs">
                    <div className="w-4 h-4 bg-blue-100 rounded"></div>
                    <span className="text-secondary">출석 완료</span>
                </div>
                <div className="flex items-center gap-xs">
                    <div className="w-4 h-4 bg-yellow-100 rounded"></div>
                    <span className="text-secondary">오늘</span>
                </div>
            </div>
        </div>
    );
};

export default AttendanceCalendar;
