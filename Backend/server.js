// server/server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

const userRoutes = require('./routes/userRoutes');
const recipeRoutes = require('./routes/recipeRoutes');
const statsRoutes = require('./routes/statsRoutes');
const mealPlanRoutes = require('./routes/mealPlanRoutes');
const favoritesRoutes = require('./routes/favoritesRoutes');
const { fetchAndStoreRecipes } = require('./controllers/recipeController');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
console.log('Setting up user routes...');
app.use('/api/users', userRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/mealplans', mealPlanRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/favorites', favoritesRoutes);
   

app.get('/fetch-recipes-now', async (req, res) => {
  try {
    console.log("Manually fetching recipes...");
    await fetchAndStoreRecipes();  // This will trigger the fetch and store process immediately
    res.status(200).json({ message: 'Recipes fetched and stored successfully!' });
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
});


// Static folder
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// MongoDB
mongoose.connect( 'mongodb://127.0.0.1:27017/foo-nutrition')
  .then(() => console.log(' MongoDB connected'))
  .catch((err) => console.error(' MongoDB connection error:', err));

// Test Route 
app.get('/', (req, res) => {
  res.status(200).send('Server is up and running!');
  console.log(' / route hit');
});

// Start server
app.listen(PORT, () => {
  console.log(` Server running at http://localhost:${PORT}`);
});
