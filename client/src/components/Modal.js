// src/components/Modal.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./Modal.module.css";

const API_URL = process.env.REACT_APP_API_URL;

const Modal = ({ date, mealPlans, closeModal, addMealPlan, updateMealPlans }) => {
  const isPastDate = new Date(date).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0);

  const [formData, setFormData] = useState({
    recipeName: "",
    servingSize: 1,
    mealType: "",
  });

  const [editingMealId, setEditingMealId] = useState(null);
  const [validationErrors, setValidationErrors] = useState([]);

  useEffect(() => {
    setFormData({ recipeName: "", servingSize: 1, mealType: "" });
    setValidationErrors([]);
    setEditingMealId(null);
  }, [closeModal]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleServingSizeChange = (increment) => {
    setFormData((prev) => ({
      ...prev,
      servingSize: increment ? prev.servingSize + 1 : Math.max(1, prev.servingSize - 1),
    }));
  };

  const token = localStorage.getItem("token");
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const handleAddMeal = async (e) => {
    e.preventDefault();
    setValidationErrors([]);

    if (!formData.recipeName || !formData.servingSize || !formData.mealType) {
      setValidationErrors(["All fields are required."]);
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/api/mealplans`,
        {
          date,
          recipeName: formData.recipeName,
          servingSize: formData.servingSize,
          mealType: formData.mealType.toLowerCase(),
        },
        config
      );

      if (response.data && response.data.mealPlan) {
        console.log("Added:", response.data.mealPlan);
        addMealPlan(response.data.mealPlan); // This must update parent
        console.log(response.data.mealPlan);
        setFormData({ recipeName: "", servingSize: 1, mealType: "" });
      }
    } catch (error) {
      console.error("Error adding meal:", error);
      if (error.response) {
        setValidationErrors(error.response.data.errors || ["Something went wrong"]);
      }
    }
  };

  const handleEditMeal = async (e) => {
    e.preventDefault();
    setValidationErrors([]);

    try {
      const payload = {
        recipeName: formData.recipeName,
        servingSize: formData.servingSize || 1,
        date,
        mealType: formData.mealType.toLowerCase(),
      };

      const response = await axios.put(
        `${API_URL}/api/mealplans/${editingMealId}`,
        payload,
        config
      );

      if (response.data && response.data.updatedMeal) {
        console.log("Updated:", response.data.updatedMeal);
        updateMealPlans((prev) =>
          prev.map((meal) => (meal._id === editingMealId ? response.data.updatedMeal : meal))
        );
        setFormData({ recipeName: "", servingSize: 1, mealType: "" });
        setEditingMealId(null);
      }
    } catch (err) {
      console.error("Error updating meal:", err);
      setValidationErrors(["Something went wrong during update"]);
    }
  };

  const handleDeleteMeal = async (mealId) => {
    if (window.confirm("Are you sure you want to delete this meal?")) {
      try {
        await axios.delete(`${API_URL}/api/mealplans/${mealId}`, config);
        updateMealPlans((prev) => prev.filter((m) => m._id !== mealId));
      } catch (error) {
        console.error("Error deleting meal:", error);
      }
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={closeModal}>✖</button>
        <h2>Meals for {new Date(date).toLocaleDateString()}</h2>

        {mealPlans.length === 0 ? (
          <p>No meals scheduled for this date.</p>
        ) : (
          <ul>
            {mealPlans.map((meal) => (
              <li key={meal._id}>
                <p><strong>Recipe:</strong> {meal.recipeName}</p>
                <p><strong>Servings:</strong> {meal.servingSize}</p>
                <p><strong>Meal Type:</strong> {meal.mealType}</p>
                <div className={styles.actions}>
                  {!isPastDate && (
                    <>
                      <button
                        onClick={() => {
                          setEditingMealId(meal._id);
                          setFormData({
                            recipeName: meal.recipeName,
                            servingSize: meal.servingSize,
                            mealType: meal.mealType.charAt(0).toUpperCase() + meal.mealType.slice(1),
                          });
                        }}
                      >
                        Edit
                      </button>
                      <button onClick={() => handleDeleteMeal(meal._id)}>Delete</button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}

        {!isPastDate && (
          <div className={styles.formContainer}>
            <form onSubmit={editingMealId ? handleEditMeal : handleAddMeal}>
              {validationErrors.length > 0 && (
                <div className={styles.errorMessages}>
                  {validationErrors.map((error, idx) => (
                    <p key={idx} className={styles.error}>{error}</p>
                  ))}
                </div>
              )}

              <div className={styles.inputGroup}>
                <label htmlFor="recipeName">Recipe Name</label>
                <input
                  type="text"
                  id="recipeName"
                  name="recipeName"
                  value={formData.recipeName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="servingSize">Serving Size</label>
                <div className={styles.servingSizeControls}>
                  <button type="button" onClick={() => handleServingSizeChange(false)}>-</button>
                  <input
                    type="number"
                    id="servingSize"
                    name="servingSize"
                    value={formData.servingSize}
                    readOnly
                  />
                  <button type="button" onClick={() => handleServingSizeChange(true)}>+</button>
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label>Meal Type</label>
                <div className={styles.radioGroup}>
                  {["Breakfast", "Lunch", "Dinner", "Snack"].map((type) => (
                    <label key={type}>
                      <input
                        type="radio"
                        name="mealType"
                        value={type}
                        checked={formData.mealType === type}
                        onChange={handleInputChange}
                      />
                      {type}
                    </label>
                  ))}
                </div>
              </div>

              <div className={styles.formActions}>
                <button type="submit">{editingMealId ? "Update Meal" : "Add Meal"}</button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingMealId(null);
                    setFormData({ recipeName: "", servingSize: 1, mealType: "" });
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {isPastDate && (
          <p className={styles.viewOnlyNote}>
            This is a past date. You can only view meals scheduled.
          </p>
        )}

        <button onClick={closeModal}>Close</button>
      </div>
    </div>
  );
};

export default Modal;
