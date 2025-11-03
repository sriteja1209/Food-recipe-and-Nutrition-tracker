import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useFavorites } from '../context/FavoriteContext';
import RecipeCard from '../components/RecipeCard';
import styles from './MyRecipesPage.module.css';

const API_URL = process.env.REACT_APP_API_URL;

const MyRecipesPage = () => {
  const [addedRecipes, setAddedRecipes] = useState([]);
  const { toggleFavorite } = useFavorites();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUserRecipes = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/users/recipes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAddedRecipes(res.data);
        console.log(res.data)
      } catch (err) {
        console.error('Error fetching user recipes:', err);
      }
    };

    fetchUserRecipes();
  }, [token]);

  return (
    <div className={styles.container}>
      <h2>Recipes Added by Me</h2>
      <div className={styles.recipeList}>
        {addedRecipes.length > 0 ? (
          addedRecipes.map((recipe) => (
            <RecipeCard key={recipe._id} recipe={recipe} toggleFavorite={toggleFavorite} />
          ))
        ) : (
          <p>No recipes added yet.</p>
        )}
      </div>
    </div>
  );
};

export default MyRecipesPage;
