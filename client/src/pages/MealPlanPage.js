// src/pages/MealPlanPage.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import MealPlanCalendar from "../components/MealPlanCalendar";
import Modal from "../components/Modal";
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap is imported
import "./MealPlanPage.css"; // Optional custom styles
const API_URL = process.env.REACT_APP_API_URL;

const MealPlanPage = () => {
  const [mealPlans, setMealPlans] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMealPlans = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/api/mealPlans`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMealPlans(response.data);
      } catch (error) {
        console.error("Error fetching meal plans:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMealPlans();
  }, []);

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedDate(null);
    setIsModalOpen(false);
  };

  const addMealPlan = (newPlan) => {
    setMealPlans((prev) => [...prev, newPlan]);
  };

  const updateMealPlans = (newList) => {
    setMealPlans(newList);
  };

  const getMealsForDate = (date) => {
    return mealPlans.filter(
      (meal) =>
        new Date(meal.date).toLocaleDateString('en-CA') === new Date(date).toLocaleDateString('en-CA')

    );
  };

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">Meal Planner</h1>
      {isLoading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          <MealPlanCalendar
            mealPlans={mealPlans}
            onDateClick={handleDateClick}
          />
          {isModalOpen && (
            <Modal
              date={selectedDate}
              mealPlans={getMealsForDate(selectedDate)}
              closeModal={closeModal}
              addMealPlan={addMealPlan}
              updateMealPlans={updateMealPlans}
            />
          )}
        </>
      )}
    </div>
  );
};

export default MealPlanPage;
