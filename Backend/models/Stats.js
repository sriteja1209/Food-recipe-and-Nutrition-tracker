const { Schema, model } = require('mongoose');

const StatsSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true }, // Format: YYYY-MM-DD
  waterIntake: { type: Number, default: 0 },
  totalCalories: { type: Number, default: 0 },
});

module.exports = model('Stats', StatsSchema);
