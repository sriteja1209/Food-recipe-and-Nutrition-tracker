import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import EditProfileForm from "../components/EditProfileForm";
import PasswordChangeForm from "../components/PasswordChangeForm";
import MyRecipes from "./MyRecipesPage";
import FavoritesPage from "./FavoritesPage";
import { calculateCalorieGoal } from '../utils/dailyCaloriesCalculator';
import { useNavigate } from "react-router-dom";
import "./Profile.css";

const API_URL = process.env.REACT_APP_API_URL;

const Profile = () => {
  const [user, setUser] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showMyRecipes, setShowMyRecipes] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error("Error fetching user profile:", err);
      }
    };

    fetchUserData();
  }, [token]);

  const calorieGoal = user ? calculateCalorieGoal(user.age, user.height, user.weight, user.gender) : null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  const handleClickOutside = (e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleProfileSubmit = async (e, updatedData) => {
    e.preventDefault(); // Now `e` will work
    try {
      const res = await axios.put(`${API_URL}/api/users/profile`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
      setShowEditForm(false);
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };
  

  const handleCancelEdit = () => {
    setShowEditForm(false);
  };

  if (!user) return <div>Loading profile...</div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Welcome, {user.name}</h2>
        <div className="dropdown" ref={menuRef}>
          <button className="btn btn-secondary dropdown-toggle" onClick={toggleDropdown}>
            ⋮
          </button>
          {showDropdown && (
            <ul className="dropdown-menu show">
              <li onClick={() => { setShowMyRecipes(true); setShowPasswordForm(false); setShowEditForm(false); setShowDropdown(false); }}>My Recipes</li>
              <li onClick={() => { navigate("/favorites"); setShowDropdown(false); }}>Favorites</li>
              <li onClick={() => { setShowPasswordForm(true); setShowMyRecipes(false); setShowEditForm(false); setShowDropdown(false); }}>Reset Password</li>
            </ul>
          )}
        </div>
      </div>

      <div className="profile-details mb-4">
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Age:</strong> {user.age}</p>
        <p><strong>Height:</strong> {user.height} cm</p>
        <p><strong>Weight:</strong> {user.weight} kg</p>
        <p>
          <strong>BMI:</strong> {((user.weight / ((user.height / 100) ** 2)).toFixed(2))} ({user.gender})
        </p>
        <p>
          <strong>Estimated Daily Calorie Goal:</strong> {calorieGoal} kcal
        </p>
      </div>

      <button className="btn btn-primary mb-2" onClick={() => { setShowEditForm(true); setShowMyRecipes(false); setShowPasswordForm(false); }}>
        Edit Profile
      </button>

      <button className="btn btn-danger" onClick={handleLogout}>
        Logout
      </button>

      {showEditForm && (
        <EditProfileForm
          profile={user}
          setProfile={setUser}
          onSubmit={handleProfileSubmit}
          onCancel={handleCancelEdit}
        />
      )}
      {showPasswordForm && <PasswordChangeForm />}
      {showMyRecipes && <MyRecipes />}
    </div>
  );
};

export default Profile;
