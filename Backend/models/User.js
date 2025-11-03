const { Schema, model } = require('mongoose');

// User Schema
const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  
  // Role field to handle user/admin roles
  role: { 
    type: String, 
    enum: ['user', 'admin'], // Restrict roles to user or admin
    default: 'user' // Default role is 'user'
  },
  
  // User-specific details
  age: { type: Number, required: true },
  height: { type: Number, required: true },
  weight: { type: Number, required: true },
  gender: { type: String, required: true },

  // Favorites array linking to the Recipe model
  favorites: [{ type: Schema.Types.ObjectId, ref: 'Recipe' }]
}, { timestamps: true });

module.exports = model('User', userSchema);
