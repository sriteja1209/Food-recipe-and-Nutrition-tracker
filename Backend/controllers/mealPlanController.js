const { body, validationResult } = require('express-validator');
const axios = require('axios');
const Recipe = require('../models/Recipe');
const Stats = require('../models/Stats');
const MealPlan = require('../models/MealPlan');

// Validation for Create Meal Plan
const validateMealPlan = [
  body('recipeName').isString().notEmpty().withMessage('Recipe name is required'),
  body('mealType')
    .custom((value) => {
      const allowedMealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];
      if (!allowedMealTypes.includes(value.toLowerCase())) {
        throw new Error('Invalid meal type');
      }
      return value;
    })
    .withMessage('Invalid meal type'),
  body('servingSize').isInt({ min: 1 }).withMessage('Serving size must be a positive integer'),
  body('date').isString().notEmpty().withMessage('Date is required'),
];


const createMealPlan = async (req, res) => {
  try {
    const { recipeName, date, mealType, servingSize = 1 } = req.body;
    const userId = req.user?.id; // Extracted from JWT

    if (!userId || !recipeName || !date || !mealType) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const recipe = await Recipe.findOne({ title : recipeName });

    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found in DB." });
    }

    const totalCalories = (recipe.calories || 0) * servingSize;
    const dateOnly = new Date(date).toLocaleDateString('en-CA'); 

    const newMealPlan = new MealPlan({
      userId,
      date: dateOnly,
      mealType,
      recipeName,
      servingSize,
      totalCalories,
      consumed: false,
    });

    await newMealPlan.save();
    res.status(201).json(newMealPlan);

  } catch (error) {
    console.error("Error creating meal plan:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};


// Other methods (getMealPlansByDate, getMealPlanById, updateMealPlan, deleteMealPlan) remain unchanged.
// Get Meal Plans by Date
const getMealPlansByDate = async (req, res) => {
  try {
    const meals = await MealPlan.find({
      userId: req.user.id,
      date: req.params.date,
    });
    res.json(meals);
  } catch (err) {
    console.error('Error fetching meal plans:', err);
    res.status(500).json({ error: 'Failed to get meal plans', details: err.message });
  }
};

// Get Meal Plan by ID
const getMealPlanById = async (req, res) => {
  try {
    const mealPlan = await MealPlan.findById(req.params.id);
    if (!mealPlan) return res.status(404).json({ error: 'Meal plan not found' });
    res.json(mealPlan);
  } catch (err) {
    console.error('Error fetching meal plan:', err);
    res.status(500).json({ error: 'Failed to fetch meal plan', details: err.message });
  }
};

// Update Meal Plan
const updateMealPlan = async (req, res) => {
  try {
    const existingMealPlan = await MealPlan.findById(req.params.id);
    if (!existingMealPlan) {
      return res.status(404).json({ error: 'Meal plan not found' });
    }

    const { recipeName, servingSize = 1, date, mealType } = req.body;

    if (!recipeName || !date || !mealType) {
      return res.status(400).json({ error: 'Required fields: recipeName, date, mealType' });
    }

    const updated = await MealPlan.findByIdAndUpdate(
      req.params.id,
      {
        recipeName,
        servingSize,
        date,
        mealType
      },
      { new: true }
    );

    res.json({ message: 'Meal plan updated', mealPlan: updated });
  } catch (err) {
    console.error('Error updating meal plan:', err);
    res.status(500).json({ error: 'Failed to update meal plan', details: err.message });
  }
};


// Delete Meal Plan
const deleteMealPlan = async (req, res) => {
  try {
    const mealPlan = await MealPlan.findById(req.params.id);
    if (!mealPlan) return res.status(404).json({ error: 'Meal plan not found' });

    const recipeName = mealPlan.recipeName;
    const stats = await Stats.findOne({ userId: req.user.id, date: mealPlan.date });

    if (stats && recipeName) {
      const recipe = await Recipe.findOne({ name: recipeName });
      if (recipe) {
        stats.totalCalories -= recipe.calories * mealPlan.servingSize;
      }
      if (stats.totalCalories < 0) stats.totalCalories = 0;
      await stats.save();
    }

    await mealPlan.deleteOne();
    res.json({ message: 'Meal plan deleted successfully' });
  } catch (err) {
    console.error('Error deleting meal plan:', err);
    res.status(500).json({ error: 'Failed to delete meal plan', details: err.message });
  }
};

module.exports = {
  validateMealPlan,
  createMealPlan,
  getMealPlansByDate,
  getMealPlanById,
  updateMealPlan,
  deleteMealPlan,
};