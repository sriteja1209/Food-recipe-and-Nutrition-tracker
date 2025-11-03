const mongoose = require('mongoose');
const User = require('../models/User');
const Recipe = require('../models/Recipe');

// GET all favorites for a user
const getUserFavorites = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).populate('favorites');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user.favorites);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET full details of the user's favorite recipes
const getUserFavoriteDetails = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).populate('favorites');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user.favorites);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST to add a recipe to favorites
const addFavorite = async (req, res) => {
  const { userId } = req.params;
  const { recipeId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(recipeId)) {
    return res.status(400).json({ message: 'Invalid recipe ID' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    if (user.favorites.includes(recipeId)) {
      return res.status(409).json({ message: 'Recipe is already in favorites' });
    }

    user.favorites.push(recipeId);
    await user.save();
    res.status(201).json({ message: 'Recipe added to favorites' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE to remove a recipe from favorites
const removeFavorite = async (req, res) => {
  const { userId } = req.params;
  const { recipeId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(recipeId)) {
    return res.status(400).json({ message: 'Invalid recipe ID' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.favorites.includes(recipeId)) {
      return res.status(400).json({ message: 'Recipe is not in favorites' });
    }

    user.favorites = user.favorites.filter(
      (id) => id.toString() !== recipeId.toString()
    );
    await user.save();
    res.status(200).json({ message: 'Recipe removed from favorites' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// 👇 Export all functions using CommonJS
module.exports = {
  getUserFavorites,
  getUserFavoriteDetails,
  addFavorite,
  removeFavorite,
};
