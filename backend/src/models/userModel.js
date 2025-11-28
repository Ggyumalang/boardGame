import { query } from '../config/database.js';

export const findUserById = async (id) => {
    const result = await query(
        'SELECT * FROM users WHERE id = $1',
        [id]
    );
    return result.rows[0];
};

export const findUserByOAuth = async (provider, oauthId) => {
    const result = await query(
        'SELECT * FROM users WHERE oauth_provider = $1 AND oauth_id = $2',
        [provider, oauthId]
    );
    return result.rows[0];
};

export const createUser = async (userData) => {
    const {
        email,
        nickname,
        profileImage,
        oauthProvider,
        oauthId
    } = userData;

    const result = await query(
        `INSERT INTO users (
      email, nickname, profile_image, oauth_provider, oauth_id
    ) VALUES ($1, $2, $3, $4, $5)
    RETURNING *`,
        [email, nickname, profileImage, oauthProvider, oauthId]
    );

    return result.rows[0];
};

export const updateUser = async (id, userData) => {
    const fields = [];
    const values = [];
    let paramCount = 1;

    Object.keys(userData).forEach(key => {
        if (userData[key] !== undefined) {
            // Convert camelCase to snake_case for DB columns
            const dbCol = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
            fields.push(`${dbCol} = $${paramCount}`);
            values.push(userData[key]);
            paramCount++;
        }
    });

    if (fields.length === 0) return null;

    values.push(id);
    const result = await query(
        `UPDATE users SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
        values
    );

    return result.rows[0];
};

export const searchUsers = async (keyword) => {
    const result = await query(
        `SELECT id, nickname, profile_image, level, rank 
     FROM users 
     WHERE nickname ILIKE $1 
     LIMIT 10`,
        [`%${keyword}%`]
    );
    return result.rows;
};

export const getUserProfile = async (id) => {
    const result = await query(
        `SELECT id, nickname, profile_image, level, rank, points, created_at
     FROM users 
     WHERE id = $1`,
        [id]
    );
    return result.rows[0];
};
