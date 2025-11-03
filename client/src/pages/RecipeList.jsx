// src/pages/RecipeList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import RecipeCard from '../components/RecipeCard';
import { useFavorites } from '../context/FavoriteContext';
import styles from './RecipeList.module.css';

const API_URL = process.env.REACT_APP_API_URL;

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    ingredients: '',
    calorieRange: [0, 1000],
    dietary: [],
  });
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentUser, setCurrentUser] = useState(null);
  const [message, setMessage] = useState('');

  const dietaryOptions = ['Vegan', 'Vegetarian', 'Gluten-Free', 'Non-Veg', 'Veg + Egg'];
  const { favorites, toggleFavorite } = useFavorites();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_URL}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCurrentUser(res.data);
      } catch (err) {
        console.error('Error fetching current user:', err);
      }
    };
    fetchCurrentUser();
  }, []);

  const fetchRecipes = async () => {
    const queryParams = new URLSearchParams({
      search: filters.search,
      category: filters.category,
      ingredients: filters.ingredients,
      minCalories: filters.calorieRange[0],
      maxCalories: filters.calorieRange[1],
    });

    filters.dietary.forEach((item) => queryParams.append('dietary', item));
    queryParams.append('page', currentPage);

    try {
      const res = await axios.get(`${API_URL}/api/recipes?${queryParams.toString()}`);
      setRecipes(res.data.recipes);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error('Error fetching recipes:', err);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, [filters, currentPage]);

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'dietary') {
      const updatedDietary = checked
        ? [...filters.dietary, value]
        : filters.dietary.filter((item) => item !== value);
      setFilters({ ...filters, dietary: updatedDietary });
    } else if (name === 'minCalories' || name === 'maxCalories') {
      const newRange = [...filters.calorieRange];
      if (name === 'minCalories') newRange[0] = Number(value);
      else newRange[1] = Number(value);
      setFilters({ ...filters, calorieRange: newRange });
    } else {
      setFilters({ ...filters, [name]: value });
    }
  };

  const applyFilters = () => {
    setCurrentPage(1);
    fetchRecipes();
  };

  const handleDelete = async (recipeId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/api/recipes/${recipeId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchRecipes();
      setMessage('Recipe deleted successfully.');
    } catch (error) {
      console.error(error);
      setMessage('Error deleting recipe.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <input
          type="text"
          name="search"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          placeholder="Search recipes..."
          className={styles.searchInput}
        />
        <button
          className={styles.filterToggleBtn}
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? 'Hide Filters' : 'Filters'}
        </button>
      </div>

      {showFilters && (
        <div className={styles.filterBox}>
          <input
            type="text"
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            placeholder="Enter category"
            className={styles.filterInput}
          />
          <input
            type="text"
            name="ingredients"
            value={filters.ingredients}
            onChange={handleFilterChange}
            placeholder="Ingredients (comma-separated)"
            className={styles.filterInput}
          />
          <div className={styles.calorieRange}>
            <label>Calorie Range:</label>
            <div className={styles.rangeInputs}>
              <input
                type="number"
                name="minCalories"
                value={filters.calorieRange[0]}
                onChange={handleFilterChange}
              />
              <span> - </span>
              <input
                type="number"
                name="maxCalories"
                value={filters.calorieRange[1]}
                onChange={handleFilterChange}
              />
            </div>
          </div>
          <label>Dietary:</label>
          <div className={styles.dietaryGroup}>
            {dietaryOptions.map((option) => (
              <label key={option} className={styles.dietaryLabel}>
                <input
                  type="checkbox"
                  name="dietary"
                  value={option}
                  checked={filters.dietary.includes(option)}
                  onChange={handleFilterChange}
                />
                {option}
              </label>
            ))}
          </div>
          <button className={styles.applyBtn} onClick={applyFilters}>
            Apply Filters
          </button>
        </div>
      )}

      {message && <div className={styles.message}>{message}</div>}

      <div className={styles.recipeGrid}>
        {recipes.length > 0 ? (
          recipes.map((recipe) => (
            <RecipeCard
              key={recipe._id}
              recipe={recipe}
              currentUserId={currentUser?._id}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <p>No recipes found.</p>
        )}
      </div>

      <div className={styles.pagination}>
        <button
          className={styles.pageBtn}
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className={styles.pageBtn}
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default RecipeList;
