import * as BadgeModel from '../models/badgeModel.js';

export const getMyBadges = async (req, res) => {
    try {
        const badges = await BadgeModel.getUserBadges(req.user.id);
        res.json(badges);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch badges' });
    }
};

export const getUserBadges = async (req, res) => {
    try {
        const badges = await BadgeModel.getUserBadges(req.params.userId);
        res.json(badges);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch user badges' });
    }
};
