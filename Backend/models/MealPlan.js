const { Schema, model } = require('mongoose');

const mealPlanSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true },
  mealType: { type: String, enum: ['breakfast', 'lunch', 'dinner', 'snack'], required: true },
  recipeName: { type: String, required: true }, // Store recipe name instead of recipe ID
  servingSize: { type: Number, default: 1 }, // User-specified serving size
  totalCalories: { type: Number, required: true }, // Calories calculated for this meal
  consumed: { type: Boolean, default: false },
});

module.exports = model('MealPlan', mealPlanSchema);

