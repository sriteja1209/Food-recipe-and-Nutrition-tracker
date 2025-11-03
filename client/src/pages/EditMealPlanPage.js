// src/pages/EditMealPlanPage.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom"; // Use useParams and useNavigate from react-router-dom
import styles from "./EditMealPlanPage.module.css"; // Importing CSS module
const API_URL = process.env.REACT_APP_API_URL;

const EditMealPlanPage = () => {
  const { date } = useParams(); // Get the selected date from the URL
  const [mealDetails, setMealDetails] = useState({
    breakfast: "",
    lunch: "",
    dinner: "",
  });
  
  const navigate = useNavigate(); // Initialize the useNavigate hook for navigation

  // Fetch meal plan data based on the date
  useEffect(() => {
    const fetchMealPlan = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/mealplans/${date}`);
        setMealDetails(response.data);
      } catch (error) {
        console.error("Error fetching meal plan:", error);
      }
    };
    fetchMealPlan();
  }, [date]);

  // Handle input change for meal details
  const handleInputChange = (e) => {
    setMealDetails({
      ...mealDetails,
      [e.target.name]: e.target.value,
    });
  };

  // Save the updated meal plan and navigate back to the meal plan page
  const handleSave = async () => {
    try {
      await axios.put(`${API_URL}/api/mealplans/${date}`, mealDetails);
      alert("Meal plan updated successfully");
      navigate(`/meal-plan/${date}`); // Navigate to the meal plan page after saving
    } catch (error) {
      console.error("Error updating meal plan:", error);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Edit Meal Plan for {date}</h1>
      <div className={styles.mealInput}>
        <label>Breakfast</label>
        <input
          type="text"
          name="breakfast"
          value={mealDetails.breakfast}
          onChange={handleInputChange}
        />
      </div>
      <div className={styles.mealInput}>
        <label>Lunch</label>
        <input
          type="text"
          name="lunch"
          value={mealDetails.lunch}
          onChange={handleInputChange}
        />
      </div>
      <div className={styles.mealInput}>
        <label>Dinner</label>
        <input
          type="text"
          name="dinner"
          value={mealDetails.dinner}
          onChange={handleInputChange}
        />
      </div>
      <button onClick={handleSave}>Save Changes</button>
    </div>
  );
};

export default EditMealPlanPage;
