const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Recipe = require('../models/Recipe');

// ✅ Middleware to verify JWT token and attach user info to the request
const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      return res.status(401).json({ error: 'User not found' });
    }
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token is not valid' });
  }
};

// ✅ Middleware to check if the user is allowed to edit the recipe
const canEditRecipe = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    if (
      recipe.addedBy.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ error: 'Not authorized to modify this recipe' });
    }

    next();
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};


module.exports = {
  protect,
  canEditRecipe,
};
