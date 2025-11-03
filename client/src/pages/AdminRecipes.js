import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import RecipeCard from '../components/RecipeCard';
import './AdminRecipes.css';

const AdminRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get('/api/recipes');
        setRecipes(response.data.recipes);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };
    fetchRecipes();
  }, []);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/recipes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRecipes(recipes.filter((recipe) => recipe._id !== id));
    } catch (error) {
      console.error('Error deleting recipe:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-4">
      <h1 className="mb-4 text-center">Manage Recipes</h1>

      <div className="mb-4 text-center">
        <Link to="/admin/recipes/add">
          <button className="btn btn-primary">Add New Recipe</button>
        </Link>
      </div>

      <div className="row">
        {recipes.length === 0 ? (
          <p>No recipes available</p>
        ) : (
          recipes.map((recipe) => (
            <div key={recipe._id} className="col-md-4 mb-4">
              <div className="card">
                <RecipeCard recipe={recipe} />
                <div className="card-body">
                  <div className="d-flex justify-content-center gap-2">
                    <Link
                      to={`/admin/recipes/edit/${recipe._id}`}
                      className="btn btn-sm btn-outline-warning"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(recipe._id)}
                      className="btn btn-sm btn-outline-danger"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminRecipes;
