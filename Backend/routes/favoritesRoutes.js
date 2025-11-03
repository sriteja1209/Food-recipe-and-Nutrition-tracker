const express = require('express');
const router = express.Router();
const favoritesController = require('../controllers/favoritesController');

// GET user's favorites (just the recipe IDs)
router.get('/:userId/favorites', favoritesController.getUserFavorites);

// GET full recipe details of user's favorites
router.get('/:userId/favorites/details', favoritesController.getUserFavoriteDetails);

// POST to add a recipe to favorites
router.post('/:userId/favorites', favoritesController.addFavorite);

// DELETE to remove a recipe from favorites
router.delete('/:userId/favorites', favoritesController.removeFavorite);

module.exports = router;
