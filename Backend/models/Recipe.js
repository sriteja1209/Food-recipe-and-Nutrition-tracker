const { Schema, model } = require('mongoose');

const recipeSchema = new Schema({
  title: String,
  ingredients: [String],
  directions: String,
  prepTime: String,
  cookTime: String,
  servings: Number,
  category: String,
  dietary: String,
  calories: Number,
  macros: {
    fat: Number,
    carbs: Number,
    sugar: Number,
    protein: Number
  },
  photo: String,
  addedBy: { type: Schema.Types.ObjectId, ref: 'User' }, // Changed to ObjectId reference
  createdAt: { type: Date, default: Date.now }
});

module.exports = model('Recipe', recipeSchema);
