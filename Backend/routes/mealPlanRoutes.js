const express = require('express');
const router = express.Router();
const MealPlan = require('../models/MealPlan'); 

const {
  createMealPlan,
  validateMealPlan,
  getMealPlansByDate,
  getMealPlanById,
  updateMealPlan,
  deleteMealPlan,
} = require('../controllers/mealPlanController');

const { protect } = require('../middleware/authMiddleware.js');

router.post('/', protect, validateMealPlan, createMealPlan);  // Create meal plan
router.get('/:date', protect, getMealPlansByDate);  // Get meal plans for a specific date
router.get('/:id', protect, getMealPlanById);  // Get a meal plan by ID
router.put('/:id', protect, updateMealPlan);  // Update meal plan
router.delete('/:id', protect, deleteMealPlan);  // Delete meal plan
router.get('/', protect, async (req, res) => {
  try {
    const mealPlans = await MealPlan.find({ userId: req.user.id });
    res.json(mealPlans);
  } catch (err) {
    console.error('Error fetching all meal plans:', err);
    res.status(500).json({ error: 'Failed to get meal plans' });
  }
});


module.exports = router;