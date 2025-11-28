import { query } from '../config/database.js';

export const addParticipation = async (participationData) => {
    const {
        sessionId,
        userId,
        score,
        rank,
        team,
        isWinner,
        mvpBadge
    } = participationData;

    const result = await query(
        `INSERT INTO participations (
      session_id, user_id, score, rank, team, is_winner, mvp_badge
    ) VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *`,
        [sessionId, userId, score, rank, team, isWinner, mvpBadge]
    );

    return result.rows[0];
};

export const getParticipationsBySession = async (sessionId) => {
    const result = await query(
        `SELECT p.*, u.nickname, u.profile_image
     FROM participations p
     JOIN users u ON p.user_id = u.id
     WHERE p.session_id = $1
     ORDER BY p.rank ASC, p.score DESC`,
        [sessionId]
    );
    return result.rows;
};

export const getParticipationsByUser = async (userId, limit = 20) => {
    const result = await query(
        `SELECT p.*, s.session_date, g.name as game_name
     FROM participations p
     JOIN sessions s ON p.session_id = s.id
     JOIN games g ON s.game_id = g.id
     WHERE p.user_id = $1
     ORDER BY s.session_date DESC
     LIMIT $2`,
        [userId, limit]
    );
    return result.rows;
};
