const express = require('express');
const { body, validationResult } = require('express-validator');
const Recipe = require('../models/Recipe.js');
const { protect, canEditRecipe } = require('../middleware/authMiddleware.js');
const verifyAdmin = require('../middleware/adminMiddleware.js');
const upload = require('../middleware/upload.js');
const favoritesController = require('../controllers/favoritesController');
const {
  getRecipeById,
  getAllRecipes,
  addRecipe,
  editRecipe,
  deleteRecipe,
  getFilteredRecipes,
  fetchRecipesManually,
} = require('../controllers/recipeController.js');

const router = express.Router();

const validateRecipe = [
  body('title').notEmpty().withMessage('Title is required'),
  body('ingredients').notEmpty().withMessage('Ingredients are required'),
  body('directions').notEmpty().withMessage('Directions are required'),

];

// 🔸 Get All Recipes with Pagination & Filters
router.get('/', getFilteredRecipes);

// 🔸 Get Recipe by ID
router.get('/:id', getRecipeById);

// 🔸 Admin-only Route to Get All Recipes
router.get('/admin/recipes', protect, verifyAdmin, getAllRecipes);

// 🔸 Add Recipe
router.post(
  '/',
  protect,
  upload.single('photo'),
  validateRecipe,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    addRecipe(req, res);
  }
);

// 🔸 Edit Recipe
router.put(
  '/:id',
  protect,
  canEditRecipe,
  upload.single('photo'),
  validateRecipe,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    editRecipe(req, res);
  }
);

// 🔸 Delete Recipe
router.delete('/:id', protect, canEditRecipe, deleteRecipe);
router.post('/:id/favorite', favoritesController.addFavorite);
router.post('/fetch', protect, verifyAdmin, fetchRecipesManually);


module.exports = router;
