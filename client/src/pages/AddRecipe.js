import React, { useState } from 'react';
import axios from 'axios';
import './AddRecipe.css'; // ✅ Import the new CSS

const AddRecipe = () => {
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
    macros: { fat: '', carbs: '', sugar: '', protein: '' },
  });
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in formData.macros) {
      setFormData(prev => ({
        ...prev,
        macros: { ...prev.macros, [name]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const body = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'macros') {
          Object.entries(value).forEach(([macro, val]) => {
            body.append(`macros[${macro}]`, val);
          });
        } else {
          body.append(key, value);
        }
      });
      if (photo) body.append('photo', photo);

      await axios.post('http://localhost:7000/api/recipes', body, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage('Recipe added successfully!');
      setError('');
      setFormData({
        title: '',
        ingredients: '',
        directions: '',
        prepTime: '',
        cookTime: '',
        servings: '',
        category: '',
        dietary: '',
        calories: '',
        macros: { fat: '', carbs: '', sugar: '', protein: '' },
      });
      setPhoto(null);
      setPreview(null);
    } catch (err) {
      setError('Failed to add recipe');
      setMessage('');
    }
  };

  return (
    <div className="add-recipe-container">
      <h2 className="add-recipe-title">Add Recipe</h2>

      <form className="add-recipe-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input name="title" className="form-control" value={formData.title} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Ingredients (comma-separated)</label>
          <textarea name="ingredients" className="form-control" value={formData.ingredients} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Directions</label>
          <textarea name="directions" className="form-control large-textarea" value={formData.directions} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Preparation Time</label>
          <input name="prepTime" className="form-control" value={formData.prepTime} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Cooking Time</label>
          <input name="cookTime" className="form-control" value={formData.cookTime} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Servings</label>
          <input name="servings" type="number" className="form-control" value={formData.servings} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Category</label>
          <input name="category" className="form-control" value={formData.category} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Dietary</label>
          <select name="dietary" className="form-control" value={formData.dietary} onChange={handleChange}>
            <option value="">Select Dietary Notes</option>
            <option value="Vegetarian">Vegetarian</option>
            <option value="Vegan">Vegan</option>
            <option value="Gluten-Free">Gluten-Free</option>
            <option value="Veg + Egg">Veg + Egg</option>
            <option value="Non-Veg">Non-Veg</option>
          </select>
        </div>

        <div className="form-group">
          <label>Calories (in kcal)</label>
          <input name="calories" type="number" className="form-control" value={formData.calories} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Fat (g)</label>
          <input name="fat" type="number" className="form-control" value={formData.macros.fat} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Carbs (g)</label>
          <input name="carbs" type="number" className="form-control" value={formData.macros.carbs} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Sugar (g)</label>
          <input name="sugar" type="number" className="form-control" value={formData.macros.sugar} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Protein (g)</label>
          <input name="protein" type="number" className="form-control" value={formData.macros.protein} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Photo</label>
          <input type="file" className="form-control" onChange={handleImageChange} accept="image/*" />
          {preview && <img src={preview} alt="Preview" className="add-recipe-preview" />}
        </div>

        <button type="submit" className="btn btn-primary w-100 mt-3">Add</button>

        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default AddRecipe;
