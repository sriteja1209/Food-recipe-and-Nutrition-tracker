const express = require('express');
const router = express.Router();
const { protect: authMiddleware } = require('../middleware/authMiddleware.js');
const statsController = require('../controllers/statsController');

const { getDailyStats, updateDailyStats, logMealConsumption, getTotalCalories, getHistoricalStats, addWaterIntake } = statsController;

router.get('/:userID/:date', authMiddleware, getDailyStats);
router.put('/:userID/:date', authMiddleware, updateDailyStats);
router.post('/log-consumption', authMiddleware, logMealConsumption);
router.get('/total-calories/:date', authMiddleware, getTotalCalories);
router.get('/historical-stats', authMiddleware, getHistoricalStats);
router.post('/water', authMiddleware, addWaterIntake);

module.exports = router;
