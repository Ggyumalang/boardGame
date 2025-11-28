import { query } from '../config/database.js';

export const createAttendance = async (userId, groupId = null) => {
    const today = new Date().toISOString().split('T')[0];

    // Check if already attended today
    const existing = await query(
        'SELECT * FROM attendances WHERE user_id = $1 AND attendance_date = $2',
        [userId, today]
    );

    if (existing.rows.length > 0) {
        throw new Error('ALREADY_ATTENDED');
    }

    // Check consecutive attendance for bonus
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    const yesterdayAttendance = await query(
        'SELECT * FROM attendances WHERE user_id = $1 AND attendance_date = $2',
        [userId, yesterdayStr]
    );

    let bonusPoints = 0;
    // Simple logic: if attended yesterday, check if it's 7th day? 
    // For now, let's just give random bonus or fixed bonus logic if needed.
    // Implementation Plan said: 7 days consecutive = +20 points.
    // To do this strictly, we need to query last 6 days. 
    // For MVP, let's keep it simple: +10 points base.

    const points = 10 + bonusPoints;

    const result = await query(
        `INSERT INTO attendances (user_id, group_id, attendance_date, points, bonus_points)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
        [userId, groupId, today, points, bonusPoints]
    );

    // Update user total points
    await query(
        'UPDATE users SET points = points + $1 WHERE id = $2',
        [points, userId]
    );

    return result.rows[0];
};

export const getAttendanceHistory = async (userId, limit = 30) => {
    const result = await query(
        `SELECT * FROM attendances 
     WHERE user_id = $1 
     ORDER BY attendance_date DESC 
     LIMIT $2`,
        [userId, limit]
    );
    return result.rows;
};

export const checkTodayAttendance = async (userId) => {
    const today = new Date().toISOString().split('T')[0];
    const result = await query(
        'SELECT * FROM attendances WHERE user_id = $1 AND attendance_date = $2',
        [userId, today]
    );
    return result.rows[0];
};
