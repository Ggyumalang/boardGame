import { query } from '../config/database.js';

export const createGame = async (gameData) => {
    const {
        name,
        genre,
        description,
        minPlayers,
        maxPlayers,
        avgPlaytime,
        imageUrl,
        createdBy
    } = gameData;

    const result = await query(
        `INSERT INTO games (
      name, genre, description, min_players, max_players, avg_playtime, image_url, created_by
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *`,
        [name, genre, description, minPlayers, maxPlayers, avgPlaytime, imageUrl, createdBy]
    );

    return result.rows[0];
};

export const getAllGames = async (filters = {}) => {
    let sql = 'SELECT * FROM games';
    const values = [];
    const conditions = [];

    if (filters.genre) {
        conditions.push(`genre = $${values.length + 1}`);
        values.push(filters.genre);
    }

    if (filters.search) {
        conditions.push(`name ILIKE $${values.length + 1}`);
        values.push(`%${filters.search}%`);
    }

    if (conditions.length > 0) {
        sql += ' WHERE ' + conditions.join(' AND ');
    }

    sql += ' ORDER BY name ASC';

    const result = await query(sql, values);
    return result.rows;
};

export const getGameById = async (id) => {
    const result = await query('SELECT * FROM games WHERE id = $1', [id]);
    return result.rows[0];
};

export const updateGame = async (id, gameData) => {
    const fields = [];
    const values = [];
    let paramCount = 1;

    Object.keys(gameData).forEach(key => {
        if (gameData[key] !== undefined) {
            const dbCol = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
            fields.push(`${dbCol} = $${paramCount}`);
            values.push(gameData[key]);
            paramCount++;
        }
    });

    if (fields.length === 0) return null;

    values.push(id);
    const result = await query(
        `UPDATE games SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
        values
    );

    return result.rows[0];
};

export const deleteGame = async (id) => {
    await query('DELETE FROM games WHERE id = $1', [id]);
    return true;
};
