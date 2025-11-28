import { query } from '../config/database.js';
import { cacheGet, cacheSet, cacheDel } from '../config/redis.js';

export const getUserStats = async (req, res) => {
    try {
        const userId = req.params.userId;
        const cacheKey = `stats:user:${userId}`;

        // Try to get from cache first
        const cached = await cacheGet(cacheKey);
        if (cached) {
            return res.json(cached);
        }

        // Aggregate stats across all games
        const totalStats = await query(
            `SELECT 
        SUM(total_plays) as total_plays,
        SUM(wins) as total_wins,
        SUM(losses) as total_losses,
        SUM(total_playtime) as total_playtime,
        SUM(mvp_count) as total_mvp
       FROM user_stats
       WHERE user_id = $1`,
            [userId]
        );

        // Get per-game stats
        const gameStats = await query(
            `SELECT us.*, g.name as game_name, g.image_url
       FROM user_stats us
       JOIN games g ON us.game_id = g.id
       WHERE us.user_id = $1
       ORDER BY us.total_plays DESC`,
            [userId]
        );

        const result = {
            overall: totalStats.rows[0],
            games: gameStats.rows
        };

        // Cache for 10 minutes
        await cacheSet(cacheKey, result, 600);

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch user stats' });
    }
};

export const getRankings = async (req, res) => {
    try {
        const { type = 'wins', limit = 10 } = req.query;
        const cacheKey = `rankings:${type}:${limit}`;

        // Try to get from cache first
        const cached = await cacheGet(cacheKey);
        if (cached) {
            return res.json(cached);
        }

        let orderBy = 'total_wins DESC';

        if (type === 'score') orderBy = 'total_score DESC';
        if (type === 'playtime') orderBy = 'total_playtime DESC';
        if (type === 'mvp') orderBy = 'total_mvp DESC';

        // Aggregate stats per user
        const rankings = await query(
            `SELECT 
        u.id, u.nickname, u.profile_image,
        SUM(us.total_plays) as total_plays,
        SUM(us.wins) as total_wins,
        SUM(us.total_score) as total_score,
        SUM(us.mvp_count) as total_mvp
       FROM users u
       JOIN user_stats us ON u.id = us.user_id
       GROUP BY u.id
       ORDER BY ${orderBy}
       LIMIT $1`,
            [limit]
        );

        // Cache for 1 hour
        await cacheSet(cacheKey, rankings.rows, 3600);

        res.json(rankings.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch rankings' });
    }
};

export const getHeadToHead = async (req, res) => {
    try {
        const { userId1, userId2 } = req.params;

        // Find sessions where both participated
        const sessions = await query(
            `SELECT s.id, s.session_date, g.name as game_name,
        p1.score as score1, p1.rank as rank1, p1.is_winner as winner1,
        p2.score as score2, p2.rank as rank2, p2.is_winner as winner2
       FROM sessions s
       JOIN games g ON s.game_id = g.id
       JOIN participations p1 ON s.id = p1.session_id AND p1.user_id = $1
       JOIN participations p2 ON s.id = p2.session_id AND p2.user_id = $2
       ORDER BY s.session_date DESC`,
            [userId1, userId2]
        );

        let wins1 = 0;
        let wins2 = 0;
        let draws = 0;

        sessions.rows.forEach(s => {
            if (s.rank1 < s.rank2) wins1++;
            else if (s.rank2 < s.rank1) wins2++;
            else draws++;
        });

        res.json({
            summary: {
                totalMatches: sessions.rows.length,
                wins1,
                wins2,
                draws
            },
            matches: sessions.rows
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch head-to-head stats' });
    }
};
