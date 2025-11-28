import * as UserModel from '../models/userModel.js';

export const getUsers = async (req, res) => {
    try {
        const { search } = req.query;
        if (!search) {
            return res.json([]);
        }
        const users = await UserModel.searchUsers(search);
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to search users' });
    }
};

export const getUser = async (req, res) => {
    try {
        const user = await UserModel.getUserProfile(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch user profile' });
    }
};

export const updateProfile = async (req, res) => {
    try {
        // Ensure user can only update their own profile
        if (parseInt(req.params.id) !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const updatedUser = await UserModel.updateUser(req.user.id, req.body);
        res.json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update profile' });
    }
};
