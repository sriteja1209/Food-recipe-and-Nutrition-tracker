const Recipe = require('../models/Recipe');
const User = require('../models/User');
const path = require('path');
const fs = require('fs');
const cron = require('node-cron');
const axios = require('axios');

const API_KEY = '3871c861fde3473c9033d42562180ccb'; 
// 🔸 Fetch Recipes from External API and Store in DB
const fetchAndStoreRecipes = async () => {
  try {
    console.log("Fetching recipes from Spoonacular...");

    // Fetch admin user ID
    const admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      console.log('Admin user not found.');
      throw new Error('Admin user not found');
    }

    const adminUserId = admin._id;

    // Fetch recipes from Spoonacular API
    const response = await axios.get('https://api.spoonacular.com/recipes/complexSearch', {
      params: {
        apiKey: API_KEY,
        number: 30,  // Number of recipes to fetch
        random: true,  // Random recipes
      }
    });

    if (!response.data.results || response.data.results.length === 0) {
      console.log("No recipes returned from Spoonacular.");
      return;
    }

    const recipes = response.data.results;
    console.log(`Fetched ${recipes.length} recipes.`);  // Log the number of recipes

    for (const recipeData of recipes) {
      const detailsResponse = await axios.get(`https://api.spoonacular.com/recipes/${recipeData.id}/information`, {
        params: { apiKey: API_KEY }
      });

      const fullRecipeData = detailsResponse.data;
      const nutrition = fullRecipeData.nutrition?.nutrients || [];
      const calories = nutrition.find(nutrient => nutrient.title === 'Calories')?.amount || 0;
      const recipe = new Recipe({
        title: fullRecipeData.title,
        ingredients: fullRecipeData.extendedIngredients.map(item => item.name),
        calories: calories,//fullRecipeData.nutrition.nutrients.find(nutrient => nutrient.title === 'Calories')?.amount || 0,
        prepTime: fullRecipeData.preparationMinutes,
        cookTime: fullRecipeData.cookingMinutes,
        servings: fullRecipeData.servings,
        category: fullRecipeData.dishTypes.join(', '),
        dietary: fullRecipeData.diets.join(', '),
        photo: fullRecipeData.image,
        addedBy: adminUserId,
      });

      console.log(`Saving recipe: ${recipe.title}`);  // Log before saving the recipe
      await recipe.save();
      console.log(`Recipe ${recipe.title} added successfully!`);
    }

    console.log("Recipes added successfully!");
  } catch (error) {
    console.error("Error in fetching and storing recipes:", error);  // Log the error
    throw error; // Rethrow to catch in the route handler
  }
};
// Schedule to run every Sunday at midnight
cron.schedule('0 0 * * 0', fetchAndStoreRecipes);

// 🔸 Admin-only: Manually Fetch Recipes
const fetchRecipesManually = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied: Admins only' });
  }

  try {
    await fetchAndStoreRecipes();  // Manually trigger the fetch process
    res.status(200).json({ message: 'Recipes fetched and stored successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
};


// 🔸 Get Recipe by ID
const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch recipe' });
  }
};

// 🔸 Admin-only: Get All Recipes with Filters & Pagination
const getAllRecipes = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied: Admins only' });
  }

  const { page = 1, limit = 10, search = '' } = req.query;
  const query = search ? { title: new RegExp(search, 'i') } : {};

  try {
    const recipes = await Recipe.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const count = await Recipe.countDocuments(query);

    res.json({
      recipes,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
};

// 🔸 Add New Recipe
const addRecipe = async (req, res) => {
  try {
    const recipe = new Recipe({
      ...req.body,
      addedBy: req.user._id,
      photo: req.file ? req.file.filename : null,
    });

    await recipe.save();
    res.status(201).json(recipe);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add recipe' });
  }
};

// 🔸 Edit Recipe
const editRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    if (req.user._id.toString() !== recipe.addedBy.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'You do not have permission to edit this recipe' });
    }

    if (req.file && recipe.photo) {
      const oldPath = path.join('uploads', recipe.photo);
      fs.unlink(oldPath, (err) => {
        if (err) console.error('Error deleting old photo:', err);
      });
      recipe.photo = req.file.filename;
    }

    recipe.set(req.body);
    await recipe.save();
    res.json({ message: 'Recipe updated successfully', recipe });
  } catch (err) {
    res.status(500).json({ error: 'Error updating recipe' });
  }
};

// 🔸 Delete Recipe

const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    // Permission check
    if (req.user._id.toString() !== recipe.addedBy.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'You do not have permission to delete this recipe' });
    }

    // Delete photo if it's a local file (not a URL)
    if (recipe.photo && !recipe.photo.startsWith('http')) {
      const photoPath = path.join(__dirname, '..', 'uploads', recipe.photo);
      try {
        await deletePhoto(photoPath);
        console.log('Photo deleted successfully');
      } catch (err) {
        console.error('Error deleting photo:', err);
        // Don't return 500 here — allow recipe deletion even if photo deletion fails
      }
    }

    // Delete the recipe
    await recipe.deleteOne();
    res.json({ message: 'Recipe deleted successfully' });
  } catch (err) {
    console.error('Error during recipe deletion:', err.stack);
    res.status(500).json({ error: 'Error deleting recipe' });
  }
};

const deletePhoto = (photoPath) => {
  return new Promise((resolve, reject) => {
    fs.unlink(photoPath, (err) => {
      if (err) {
        // Ignore file-not-found errors (ENOENT), only reject serious errors
        if (err.code !== 'ENOENT') reject(err);
        else resolve();
      } else {
        resolve();
      }
    });
  });
};

module.exports = { deleteRecipe };





// 🔸 Get Recipes with Filters & Search
const validDietaryOptions = ['veg', 'non-veg', 'vegan', 'veg+egg', 'gluten-free'];

const getFilteredRecipes = async (req, res) => {
  const { page = 1, limit = 10, search = '', category, ingredients, minCalories, maxCalories, dietary } = req.query;

  const filters = {};

  // Search by recipe title
  if (search) {
    filters.title = new RegExp(search, 'i');
  }

  // Filter by category
  if (category) {
    filters.category = category;
  }

  // Filter by ingredients
  if (ingredients) {
    filters.ingredients = { $in: ingredients.split(',').map((ingredient) => ingredient.trim()) };
  }

  // Filter by calories range
  if (minCalories || maxCalories) {
    filters.calories = {};
    if (minCalories) filters.calories.$gte = minCalories;
    if (maxCalories) filters.calories.$lte = maxCalories;
  }

  // Filter by dietary preferences (validation)
  if (dietary) {
    const dietaryArray = dietary.split(',').map((diet) => diet.trim());
    const invalidDietary = dietaryArray.filter((diet) => !validDietaryOptions.includes(diet));
    if (invalidDietary.length > 0) {
      return res.status(400).json({ error: `Invalid dietary options: ${invalidDietary.join(', ')}` });
    }
    filters.dietary = { $in: dietaryArray };
  }

  try {
    const recipes = await Recipe.find(filters)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const count = await Recipe.countDocuments(filters);

    res.json({
      recipes,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
};


module.exports = {
  fetchAndStoreRecipes,
  fetchRecipesManually,
  getRecipeById,
  getAllRecipes,
  addRecipe,
  editRecipe,
  deleteRecipe,
  getFilteredRecipes,
};
