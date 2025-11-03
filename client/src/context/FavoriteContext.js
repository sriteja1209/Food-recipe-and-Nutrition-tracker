import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const FavoriteContext = createContext();

export const FavoriteProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]); // full recipe objects
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) return;

      setToken(storedToken);

      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        });
        setUserId(res.data.userId);
      } catch (err) {
        console.error('Error fetching user data:', err);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!userId || !token) return;

      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/favorites/${userId}/favorites/details`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setFavorites(res.data);
      } catch (err) {
        console.error('Error fetching favorites:', err);
      }
    };

    fetchFavorites();
  }, [userId, token]);

  const toggleFavorite = async (recipeId) => {
    if (!userId || !token) return;

    const isAlreadyFavorited = favorites.some(fav => fav._id === recipeId);

    if (isAlreadyFavorited) {
      try {
        // Remove from backend
        await axios.delete(
          `${process.env.REACT_APP_API_URL}/api/favorites/${userId}/favorites`,
          {
            data: { recipeId },
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Remove from local state
        setFavorites(prev => prev.filter(fav => fav._id !== recipeId));
      } catch (err) {
        console.error('Failed to remove favorite:', err);
      }
    } else {
      try {
        // Add to backend
        const res = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/favorites/${userId}/favorites`,
          { recipeId },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Add to local state by refetching the new recipe details
        const recipeRes = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/recipes/${recipeId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setFavorites(prev => [...prev, recipeRes.data]);
      } catch (err) {
        if (err.response?.status === 409) {
          console.warn('Recipe already in favorites.');
        } else {
          console.error('Failed to add favorite:', err);
        }
      }
    }
  };

  const isRecipeFavorited = (recipeId) => {
    return favorites.some(fav => fav._id === recipeId);
  };

  return (
    <FavoriteContext.Provider value={{ favorites, toggleFavorite, isRecipeFavorited }}>
      {children}
    </FavoriteContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoriteContext);
