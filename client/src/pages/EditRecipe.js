// client/src/pages/EditRecipe.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './EditRecipe.module.css'; // Import the CSS module
const API_URL = process.env.REACT_APP_API_URL;

const EditRecipe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    ingredients: '',
    directions: '',
    prepTime: '',
    cookTime: '',
    servings: '',
    category: '',
    dietary: '',
    calories: '',
    macros: { fat: '', carbs: '', sugar: '', protein: '' },  // Ensure these are initialized
  });
  const [photo, setPhoto] = useState(null);

  const token = localStorage.getItem('token');

  // Fetch user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error('Error fetching user:', err);
      }
    };
    if (token) fetchUser();
  }, [token]);

  // Fetch recipe data
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/recipes/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const recipe = res.data;  // Directly use the response data
        if (recipe) {
          setFormData({
            title: recipe.title || '',  // Default to empty string if undefined
            ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients.join(', ') : recipe.ingredients || '',
            directions: recipe.directions || '',
            prepTime: recipe.prepTime || '',
            cookTime: recipe.cookTime || '',
            servings: recipe.servings || '',
            category: recipe.category || '',
            dietary: recipe.dietary || '',
            calories: recipe.calories || '',  // Default to empty string
            macros: recipe.macros || { fat: '', carbs: '', sugar: '', protein: '' },  // Default empty macros if not available
          });
        }
      } catch (err) {
        console.error('Error fetching recipe:', err);
      }
    };
  
    if (token) fetchRecipe();
  }, [id, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith('macros.')) {
      const macroKey = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        macros: { ...prev.macros, [macroKey]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updateData = {
      ...formData,
      ingredients: formData.ingredients.split(',').map((i) => i.trim()),
    };

    try {
      await axios.put(`${API_URL}/api/recipes/${id}`, updateData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (photo) {
        const photoData = new FormData();
        photoData.append('photo', photo);
        await axios.put(`${API_URL}/api/recipes/${id}/photo`, photoData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      alert('Recipe updated!');
      navigate('/recipes');
    } catch (err) {
      console.error(err);
      alert('Error updating recipe');
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2>Edit Recipe</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Title</label>
        <input
          type="text"
          name="title"
          id="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Title"
          required
        />

        <label htmlFor="ingredients">Ingredients (comma-separated)</label>
        <input
          type="text"
          name="ingredients"
          id="ingredients"
          value={formData.ingredients}
          onChange={handleChange}
          placeholder="Ingredients (comma-separated)"
          required
        />

        <label htmlFor="directions">Directions</label>
        <textarea
          name="directions"
          id="directions"
          value={formData.directions}
          onChange={handleChange}
          placeholder="Directions"
          required
        />

        <label htmlFor="prepTime">Prep Time</label>
        <input
          type="text"
          name="prepTime"
          id="prepTime"
          value={formData.prepTime}
          onChange={handleChange}
          placeholder="Prep Time"
        />

        <label htmlFor="cookTime">Cook Time</label>
        <input
          type="text"
          name="cookTime"
          id="cookTime"
          value={formData.cookTime}
          onChange={handleChange}
          placeholder="Cook Time"
        />

        <label htmlFor="servings">Servings</label>
        <input
          type="number"
          name="servings"
          id="servings"
          value={formData.servings}
          onChange={handleChange}
          placeholder="Servings"
        />

        <label htmlFor="category">Category</label>
        <input
          type="text"
          name="category"
          id="category"
          value={formData.category}
          onChange={handleChange}
          placeholder="Category"
        />

        <label htmlFor="dietary">Dietary</label>
        <input
          type="text"
          name="dietary"
          id="dietary"
          value={formData.dietary}
          onChange={handleChange}
          placeholder="Dietary"
        />

        <label htmlFor="calories">Calories</label>
        <input
          type="number"
          name="calories"
          id="calories"
          value={formData.calories}
          onChange={handleChange}
          placeholder="Calories"
        />

        <label htmlFor="macros.fat">Fat (g)</label>
        <input
          type="number"
          name="macros.fat"
          id="macros.fat"
          value={formData.macros.fat}
          onChange={handleChange}
          placeholder="Fat (g)"
        />

        <label htmlFor="macros.carbs">Carbs (g)</label>
        <input
          type="number"
          name="macros.carbs"
          id="macros.carbs"
          value={formData.macros.carbs}
          onChange={handleChange}
          placeholder="Carbs (g)"
        />

        <label htmlFor="macros.sugar">Sugar (g)</label>
        <input
          type="number"
          name="macros.sugar"
          id="macros.sugar"
          value={formData.macros.sugar}
          onChange={handleChange}
          placeholder="Sugar (g)"
        />

        <label htmlFor="macros.protein">Protein (g)</label>
        <input
          type="number"
          name="macros.protein"
          id="macros.protein"
          value={formData.macros.protein}
          onChange={handleChange}
          placeholder="Protein (g)"
        />

        <label htmlFor="photo">Upload Recipe Photo</label>
        <input
          type="file"
          name="photo"
          id="photo"
          onChange={(e) => setPhoto(e.target.files[0])}
          accept="image/*"
        />

        <button type="submit">Update Recipe</button>
      </form>
    </div>
  );
};

export default EditRecipe;
