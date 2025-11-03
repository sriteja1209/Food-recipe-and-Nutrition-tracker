import React, { useEffect, useState } from 'react';
import { useFavorites } from '../context/FavoriteContext';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styles from './FavoritesPage.module.css';
import RecipeCard from '../components/RecipeCard'; // Assuming you have a RecipeCard component

const API_URL = process.env.REACT_APP_API_URL;

const FavoritesPage = () => {
  const { favorites, toggleFavorite, isRecipeFavorited } = useFavorites();
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    setFavoriteRecipes(favorites);
  }, [favorites]);

  return (
    <div className={styles.favoritesContainer}>
      <h2>My Favorite Recipes</h2>

      {error && <p className={styles.error}>{error}</p>}

      {favoriteRecipes.length === 0 && !error && (
        <p className={styles.message}>You have no favorite recipes yet.</p>
      )}

      <div className={styles.recipeGrid}>
        {favoriteRecipes.map((recipe) => (
          <RecipeCard 
            key={recipe._id} // Add unique key prop here
            recipe={recipe}
            toggleFavorite={toggleFavorite} // Pass toggleFavorite prop to RecipeCard
          />
        ))}
      </div>
    </div>
  );
};

export default FavoritesPage;
