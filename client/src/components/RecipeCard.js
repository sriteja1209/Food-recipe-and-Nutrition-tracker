// src/components/RecipeCard.js
import React from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../context/FavoriteContext';
import styles from './RecipeCard.module.css';

const RecipeCard = ({ recipe, currentUserId, onDelete }) => {
  const { toggleFavorite, isRecipeFavorited } = useFavorites();
  const navigate = useNavigate();
  const isFavorited = isRecipeFavorited(recipe._id);
  const role = localStorage.getItem('role');

  const isOwner = currentUserId === (typeof recipe.owner === 'object' ? recipe.owner._id : recipe.owner);
  const isAdmin = role === 'admin';

  const handleEdit = () => {
    navigate(`/recipes/edit/${recipe._id}`);
  };

  const handleDelete = () => {
    const confirm = window.confirm('Are you sure you want to delete this recipe?');
    if (confirm) {
      onDelete(recipe._id);
    }
  };

  const recipeLink = isAdmin ? `/admin/recipes/${recipe._id}` : `/recipes/${recipe._id}`;

  return (
    <div className={styles.card}>
      <img src={recipe.photo || 'default-image.png'} alt={recipe.title} className={styles.image} />
      <div className={styles.body}>
        <h3 className={styles.title}>{recipe.title}</h3>
        <p className={styles.text}><strong>Category:</strong> {recipe.category}</p>
        <p className={styles.text}><strong>Dietary:</strong> {recipe.dietary}</p>
        <p className={styles.text}><strong>Calories:</strong> {recipe.calories} kcal</p>

        <div className={styles.actions}>
          <button onClick={() => navigate(recipeLink)} className={styles.viewBtn}>
            View Recipe
          </button>

          <div
            className={styles.favoriteIcon}
            onClick={() => toggleFavorite(recipe._id)}
            title={isFavorited ? 'Remove from Favorites' : 'Add to Favorites'}
          >
            {isFavorited ? <FaHeart color="red" /> : <FaRegHeart />}
          </div>
        </div>

        {(isOwner || isAdmin) && (
          <div className={styles.manageBtns}>
            <button onClick={handleEdit} className={styles.editBtn}>Edit</button>
            <button onClick={handleDelete} className={styles.deleteBtn}>Delete</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeCard;
