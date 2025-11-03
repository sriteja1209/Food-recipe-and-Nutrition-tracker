const Stats = require('../models/Stats');
const MealPlan = require('../models/MealPlan'); // Ensure MealPlan model is imported
const Recipe = require('../models/Recipe'); // Ensure Recipe model is imported
const moment = require('moment'); 

// GET daily stats by date for a user
const getDailyStats = async (req, res) => {
  try {
    const { date } = req.params;
    const userId = req.user.id; // Use user from JWT

    let stats = await Stats.findOne({ userId, date });

    if (!stats) {
      // If no stats exist, return empty stats object
      stats = new Stats({ userId, date, totalCalories: 0, waterIntake: 0 });
      await stats.save();
    }

    res.json(stats); // Return the found or newly created stats
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch daily stats' });
  }
};

// PUT update daily stats (e.g., water intake or manual calorie override)
const updateDailyStats = async (req, res) => {
  try {
    const { date } = req.params;
    const userId = req.user.id; // Use user from JWT
    const { waterIntake, totalCalories } = req.body;

    let stats = await Stats.findOne({ userId, date });

    if (!stats) {
      stats = new Stats({ userId, date });
    }

    // Update stats only if the values are provided
    if (waterIntake !== undefined) stats.waterIntake = waterIntake;
    if (totalCalories !== undefined) stats.totalCalories = totalCalories;

    await stats.save();

    res.json({ message: 'Daily stats updated', stats });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update daily stats' });
  }
};

// POST Log Meal Consumption (when user logs they consumed a meal)
const logMealConsumption = async (req, res) => {
  try {
    const { mealPlanId, caloriesConsumed, waterConsumed } = req.body;
    const userId = req.user.id; // Get user from JWT

    // Step 1: Find the meal plan by mealPlanId
    const mealPlan = await MealPlan.findById(mealPlanId);
    if (!mealPlan) {
      return res.status(404).json({ error: 'Meal Plan not found' });
    }

    // Step 2: Check if the meal has already been consumed
    if (mealPlan.consumed) {
      return res.status(400).json({ error: 'Meal has already been consumed' });
    }

    // Mark the meal as consumed
    mealPlan.consumed = true;
    await mealPlan.save(); // Save the updated meal plan

    // Step 3: Check if DailyStats already exists for this date
    let stats = await Stats.findOne({ userId, date: mealPlan.date });

    if (!stats) {
      // If stats don't exist, create new ones
      stats = new Stats({
        userId,
        date: mealPlan.date,
        totalCalories: caloriesConsumed || mealPlan.totalCalories, // Use provided or meal plan calories
        waterIntake: waterConsumed || 0, // Use provided or 0
      });
    } else {
      // If stats already exist, update them
      stats.totalCalories += caloriesConsumed || mealPlan.totalCalories;
      stats.waterIntake += waterConsumed || 0;
    }

    // Step 4: Save the updated or newly created DailyStats
    await stats.save();

    res.status(200).json({ message: 'Meal consumption logged successfully', stats });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to log meal consumption', details: err.message });
  }
};


// GET total calories for the given date (from all meal plans)
const getTotalCalories = async (req, res) => {
  try {
    const { date } = req.params;
    const mealPlans = await MealPlan.find({ date: date }); // Fetch all meal plans for the date
    let totalCalories = 0;

    for (let meal of mealPlans) {
      const recipe = await Recipe.findById(meal.recipeId); // Fetch recipe data to get calories
      if (recipe) {
        totalCalories += recipe.calories;
      }
    }

    res.json({ totalCalories });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getHistoricalStats = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user is authenticated and their ID is available
    const { startDate, endDate } = req.query; // Get start and end date from query params

    // Validate dates (ensure they're in a valid format, e.g., 'YYYY-MM-DD')
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Please provide both startDate and endDate' });
    }

    if (!moment(startDate, 'YYYY-MM-DD', true).isValid() || !moment(endDate, 'YYYY-MM-DD', true).isValid()) {
      return res.status(400).json({ message: 'Invalid date format. Please use YYYY-MM-DD.' });
    }

    // Convert dates to Date objects using moment
    const start = moment(startDate, 'YYYY-MM-DD').toDate();
    const end = moment(endDate, 'YYYY-MM-DD').toDate();

    // Query the database for stats between start and end date
    const historicalStats = await Stats.find({
      userId,
      date: { $gte: start, $lte: end },
    }).sort({ date: 1 }); // Sort by date, you can change sorting order if needed

    if (!historicalStats || historicalStats.length === 0) {
      return res.status(404).json({ message: 'No historical stats found for this period' });
    }

    // Return the historical stats
    res.json(historicalStats);
  } catch (err) {
    console.error('Error fetching historical stats:', err);
    res.status(500).json({ message: 'Error fetching historical stats. Please try again later.' });
  }
};

const addWaterIntake = async (req, res) => {
  const { date, amount } = req.body;
  const userId = req.user.id;

  if (!date || !amount) {
    return res.status(400).json({ error: 'Date and water amount are required' });
  }

  try {
    // Find or create the stats document for that date
    let stats = await Stats.findOne({ userId, date });

    if (!stats) {
      stats = new Stats({ userId, date, waterIntake: amount });
    } else {
      stats.waterIntake = (stats.waterIntake || 0) + amount;
    }

    await stats.save();
    res.json({ message: 'Water intake updated', stats });
  } catch (err) {
    console.error('Error updating water intake:', err);
    res.status(500).json({ error: 'Failed to update water intake' });
  }
};

module.exports = {
  getDailyStats,
  updateDailyStats,
  getTotalCalories,
  logMealConsumption,
  getHistoricalStats,
  addWaterIntake,
};
