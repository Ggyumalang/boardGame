import * as GameModel from '../models/gameModel.js';

export const getGames = async (req, res) => {
    try {
        const { genre, search } = req.query;
        const games = await GameModel.getAllGames({ genre, search });
        res.json(games);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching games' });
    }
};

export const getGame = async (req, res) => {
    try {
        const game = await GameModel.getGameById(req.params.id);
        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }
        res.json(game);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching game' });
    }
};

export const createGame = async (req, res) => {
    try {
        const gameData = {
            ...req.body,
            createdBy: req.user.id
        };
        const newGame = await GameModel.createGame(gameData);
        res.status(201).json(newGame);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error creating game' });
    }
};

export const updateGame = async (req, res) => {
    try {
        const updatedGame = await GameModel.updateGame(req.params.id, req.body);
        if (!updatedGame) {
            return res.status(404).json({ message: 'Game not found' });
        }
        res.json(updatedGame);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error updating game' });
    }
};

export const deleteGame = async (req, res) => {
    try {
        await GameModel.deleteGame(req.params.id);
        res.json({ message: 'Game deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error deleting game' });
    }
};
