import { query } from '../config/database.js';

export const updateUserStats = async (userId, gameId, participationData, sessionDuration) => {
    const { isWinner, score, rank, mvpBadge } = participationData;

    // Check if stats exist
    const existingStats = await query(
        'SELECT * FROM user_stats WHERE user_id = $1 AND game_id = $2',
        [userId, gameId]
    );

    if (existingStats.rows.length === 0) {
        // Create new stats record
        await query(
            `INSERT INTO user_stats (
        user_id, game_id, total_plays, wins, losses, total_score, avg_score, total_playtime, best_rank, mvp_count, last_played_at
      ) VALUES ($1, $2, 1, $3, $4, $5, $6, $7, $8, $9, NOW())`,
            [
                userId,
                gameId,
                isWinner ? 1 : 0,
                isWinner ? 0 : 1,
                score || 0,
                score || 0,
                sessionDuration || 0,
                rank || null,
                mvpBadge ? 1 : 0
            ]
        );
    } else {
        // Update existing stats
        const stats = existingStats.rows[0];
        const newTotalPlays = stats.total_plays + 1;
        const newWins = stats.wins + (isWinner ? 1 : 0);
        const newLosses = stats.losses + (isWinner ? 0 : 1);
        const newTotalScore = stats.total_score + (score || 0);
        const newAvgScore = newTotalScore / newTotalPlays;
        const newTotalPlaytime = stats.total_playtime + (sessionDuration || 0);
        const newMvpCount = stats.mvp_count + (mvpBadge ? 1 : 0);

        let newBestRank = stats.best_rank;
        if (rank && (!stats.best_rank || rank < stats.best_rank)) {
            newBestRank = rank;
        }

        await query(
            `UPDATE user_stats SET
        total_plays = $1,
        wins = $2,
        losses = $3,
        total_score = $4,
        avg_score = $5,
        total_playtime = $6,
        best_rank = $7,
        mvp_count = $8,
        last_played_at = NOW()
      WHERE id = $9`,
            [
                newTotalPlays,
                newWins,
                newLosses,
                newTotalScore,
                newAvgScore,
                newTotalPlaytime,
                newBestRank,
                newMvpCount,
                stats.id
            ]
        );
    }
};
