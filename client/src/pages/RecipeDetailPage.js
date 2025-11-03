import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './RecipeDetailPage.module.css';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useFavorites } from '../context/FavoriteContext';

const API_URL = process.env.REACT_APP_API_URL;

const role = localStorage.getItem('role');

const RecipeDetailPage = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const { toggleFavorite, isRecipeFavorited } = useFavorites();
  const isFavorited = isRecipeFavorited(id);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/recipes/${id}`);
        setRecipe(res.data);
      } catch (err) {
        setError('Failed to fetch recipe details.');
        console.error('Error fetching recipe details:', err);
      }
    };
    fetchRecipe();
  }, [id]);

  const handleToggleFavorite = () => {
    toggleFavorite(id);
  };

  if (error) return <p className={styles.error}>{error}</p>;
  if (!recipe) return <p className={styles.loading}>Loading recipe...</p>;

  return (
    <div className={styles.recipeDetail}>
      <h2 className={styles.title}>{recipe.title}</h2>

      {recipe.photo && (
        <img src={recipe.photo} alt={recipe.title} className={styles.image} />
      )}

      <div className={styles.info}>
        <p><strong>Ingredients:</strong> {Array.isArray(recipe.ingredients) ? recipe.ingredients.join(', ') : recipe.ingredients}</p>
        <p><strong>Directions:</strong> {recipe.directions}</p>
        <p><strong>Prep Time:</strong> {recipe.prepTime}</p>
        <p><strong>Cook Time:</strong> {recipe.cookTime}</p>
        <p><strong>Servings:</strong> {recipe.servings}</p>
        <p><strong>Category:</strong> {recipe.category}</p>
        <p><strong>Dietary:</strong> {recipe.dietary}</p>
        <p><strong>Calories:</strong> {recipe.calories}</p>
        {recipe.macros && (
          <>
            <p><strong>Fat:</strong> {recipe.macros.fat} g</p>
            <p><strong>Carbs:</strong> {recipe.macros.carbs} g</p>
            <p><strong>Sugar:</strong> {recipe.macros.sugar} g</p>
            <p><strong>Protein:</strong> {recipe.macros.protein} g</p>
          </>
        )}
      </div>

      <div className={styles.favoriteIcon} onClick={handleToggleFavorite} title="Toggle Favorite">
        {isFavorited ? (
          <FaHeart className={styles.heartFilled} />
        ) : (
          <FaRegHeart className={styles.heartOutline} />
        )}
      </div>
      
      <button
  onClick={() => navigate(role === 'admin' ? '/admin/recipes' : '/recipes')}
  className={styles.backButton}
>
  Back to Recipes
</button>
    </div>
  );
};

export default RecipeDetailPage;
