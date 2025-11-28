import * as AttendanceModel from '../models/attendanceModel.js';

export const checkAttendance = async (req, res) => {
    try {
        const userId = req.user.id;
        const { groupId } = req.body; // Optional

        const attendance = await AttendanceModel.createAttendance(userId, groupId);

        res.status(201).json({
            message: 'Attendance checked successfully',
            attendance,
            pointsEarned: attendance.points
        });
    } catch (error) {
        if (error.message === 'ALREADY_ATTENDED') {
            return res.status(400).json({ message: 'Already attended today' });
        }
        console.error(error);
        res.status(500).json({ message: 'Server error during attendance check' });
    }
};

export const getMyHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const history = await AttendanceModel.getAttendanceHistory(userId);
        res.json(history);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching history' });
    }
};

export const getTodayStatus = async (req, res) => {
    try {
        const userId = req.user.id;
        const attendance = await AttendanceModel.checkTodayAttendance(userId);
        res.json({
            attended: !!attendance,
            attendance
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error checking status' });
    }
};

export const getUserHistory = async (req, res) => {
    try {
        const userId = req.params.userId;
        const { year, month } = req.query;

        let history;
        if (year && month) {
            // Filter by year and month
            history = await AttendanceModel.getAttendanceHistory(userId);
            history = history.filter(a => {
                const date = new Date(a.attendance_date);
                return date.getFullYear() === parseInt(year) &&
                    date.getMonth() + 1 === parseInt(month);
            });
        } else {
            history = await AttendanceModel.getAttendanceHistory(userId);
        }

        res.json(history);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching history' });
    }
};
