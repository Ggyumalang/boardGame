import * as SessionModel from '../models/sessionModel.js';
import * as ParticipationModel from '../models/participationModel.js';
import * as BadgeModel from '../models/badgeModel.js';
import { cacheDelPattern } from '../config/redis.js';
import pool from '../config/database.js';

export const createSession = async (req, res) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const {
            gameId,
            groupId,
            sessionDate,
            duration,
            isTeamGame,
            participants // Array of { userId, score, rank, team, isWinner, mvpBadge }
        } = req.body;

        // 1. Create Session
        const sessionResult = await client.query(
            `INSERT INTO sessions (
        game_id, group_id, session_date, duration, is_team_game, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
            [gameId, groupId, sessionDate, duration, isTeamGame, req.user.id]
        );
        const session = sessionResult.rows[0];

        // 2. Create Participations and Update Stats
        const createdParticipations = [];

        for (const p of participants) {
            // Create Participation
            const partResult = await client.query(
                `INSERT INTO participations (
          session_id, user_id, score, rank, team, is_winner, mvp_badge
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *`,
                [session.id, p.userId, p.score, p.rank, p.team, p.isWinner, p.mvpBadge]
            );
            createdParticipations.push(partResult.rows[0]);

            // Update User Stats
            const existingStats = await client.query(
                'SELECT * FROM user_stats WHERE user_id = $1 AND game_id = $2',
                [p.userId, gameId]
            );

            if (existingStats.rows.length === 0) {
                await client.query(
                    `INSERT INTO user_stats (
            user_id, game_id, total_plays, wins, losses, total_score, avg_score, total_playtime, best_rank, mvp_count, last_played_at
          ) VALUES ($1, $2, 1, $3, $4, $5, $6, $7, $8, $9, NOW())`,
                    [
                        p.userId,
                        gameId,
                        p.isWinner ? 1 : 0,
                        p.isWinner ? 0 : 1,
                        p.score || 0,
                        p.score || 0,
                        duration || 0,
                        p.rank || null,
                        p.mvpBadge ? 1 : 0
                    ]
                );
            } else {
                const stats = existingStats.rows[0];
                const newTotalPlays = stats.total_plays + 1;
                const newWins = stats.wins + (p.isWinner ? 1 : 0);
                const newLosses = stats.losses + (p.isWinner ? 0 : 1);
                const newTotalScore = stats.total_score + (p.score || 0);
                const newAvgScore = newTotalScore / newTotalPlays;
                const newTotalPlaytime = stats.total_playtime + (duration || 0);
                const newMvpCount = stats.mvp_count + (p.mvpBadge ? 1 : 0);

                let newBestRank = stats.best_rank;
                if (p.rank && (!stats.best_rank || p.rank < stats.best_rank)) {
                    newBestRank = p.rank;
                }

                await client.query(
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
        }

        await client.query('COMMIT');

        // 3. Award Badges (After Commit)
        const newBadges = [];
        for (const p of participants) {
            const badges = await BadgeModel.checkAndAwardBadges(p.userId);
            newBadges.push(...badges);
        }

        // 4. Invalidate caches for affected users and rankings
        for (const p of participants) {
            await cacheDelPattern(`stats:user:${p.userId}`);
        }
        await cacheDelPattern('rankings:*');

        res.status(201).json({
            message: 'Session recorded successfully',
            session,
            participations: createdParticipations,
            newBadges
        });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Session creation error:', error);
        res.status(500).json({ message: 'Failed to record session' });
    } finally {
        client.release();
    }
};

export const getSessions = async (req, res) => {
    try {
        const { gameId, limit } = req.query;
        let sessions;

        if (gameId) {
            sessions = await SessionModel.getSessionsByGame(gameId, limit);
        } else {
            sessions = await SessionModel.getRecentSessions(limit);
        }

        res.json(sessions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch sessions' });
    }
};

export const getSessionDetail = async (req, res) => {
    try {
        const session = await SessionModel.getSessionById(req.params.id);
        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }

        const participations = await ParticipationModel.getParticipationsBySession(req.params.id);

        res.json({
            ...session,
            participations
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch session details' });
    }
};
