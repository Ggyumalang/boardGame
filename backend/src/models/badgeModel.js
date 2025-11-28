import { query } from '../config/database.js';

export const createBadge = async (badgeData) => {
    const {
        userId,
        badgeType,
        badgeName,
        badgeIcon,
        description
    } = badgeData;

    const result = await query(
        `INSERT INTO badges (
      user_id, badge_type, badge_name, badge_icon, description
    ) VALUES ($1, $2, $3, $4, $5)
    RETURNING *`,
        [userId, badgeType, badgeName, badgeIcon, description]
    );

    return result.rows[0];
};

export const getUserBadges = async (userId) => {
    const result = await query(
        'SELECT * FROM badges WHERE user_id = $1 ORDER BY earned_at DESC',
        [userId]
    );
    return result.rows;
};

export const checkAndAwardBadges = async (userId) => {
    const newBadges = [];

    // Get user stats
    const statsResult = await query(
        `SELECT 
      SUM(total_plays) as total_plays,
      SUM(wins) as total_wins
     FROM user_stats
     WHERE user_id = $1`,
        [userId]
    );

    const stats = statsResult.rows[0];
    const totalPlays = parseInt(stats.total_plays || 0);
    const totalWins = parseInt(stats.total_wins || 0);

    // Helper to check if badge already exists
    const hasBadge = async (name) => {
        const res = await query(
            'SELECT * FROM badges WHERE user_id = $1 AND badge_name = $2',
            [userId, name]
        );
        return res.rows.length > 0;
    };

    // 1. First Game
    if (totalPlays >= 1 && !(await hasBadge('첫 게임 시작'))) {
        const badge = await createBadge({
            userId,
            badgeType: 'achievement',
            badgeName: '첫 게임 시작',
            badgeIcon: '🎲',
            description: '첫 번째 보드게임을 플레이했습니다.'
        });
        newBadges.push(badge);
    }

    // 2. First Win
    if (totalWins >= 1 && !(await hasBadge('첫 승리'))) {
        const badge = await createBadge({
            userId,
            badgeType: 'achievement',
            badgeName: '첫 승리',
            badgeIcon: '👑',
            description: '첫 번째 승리를 거두었습니다.'
        });
        newBadges.push(badge);
    }

    // 3. 10 Wins
    if (totalWins >= 10 && !(await hasBadge('10승 달성'))) {
        const badge = await createBadge({
            userId,
            badgeType: 'achievement',
            badgeName: '10승 달성',
            badgeIcon: '🏆',
            description: '총 10번의 승리를 거두었습니다.'
        });
        newBadges.push(badge);
    }

    return newBadges;
};
