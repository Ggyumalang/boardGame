import { query } from '../config/database.js';

export const createSession = async (sessionData) => {
    const {
        gameId,
        groupId,
        sessionDate,
        duration,
        isTeamGame,
        createdBy
    } = sessionData;

    const result = await query(
        `INSERT INTO sessions (
      game_id, group_id, session_date, duration, is_team_game, created_by
    ) VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *`,
        [gameId, groupId, sessionDate, duration, isTeamGame, createdBy]
    );

    return result.rows[0];
};

export const getSessionById = async (id) => {
    const result = await query(
        `SELECT s.*, g.name as game_name, g.image_url as game_image 
     FROM sessions s
     JOIN games g ON s.game_id = g.id
     WHERE s.id = $1`,
        [id]
    );
    return result.rows[0];
};

export const getSessionsByGame = async (gameId, limit = 10) => {
    const result = await query(
        `SELECT s.*, u.nickname as creator_name
     FROM sessions s
     JOIN users u ON s.created_by = u.id
     WHERE s.game_id = $1
     ORDER BY s.session_date DESC
     LIMIT $2`,
        [gameId, limit]
    );
    return result.rows;
};

export const getRecentSessions = async (limit = 10) => {
    const result = await query(
        `SELECT s.*, g.name as game_name, g.image_url as game_image
     FROM sessions s
     JOIN games g ON s.game_id = g.id
     ORDER BY s.session_date DESC
     LIMIT $1`,
        [limit]
    );
    return result.rows;
};
