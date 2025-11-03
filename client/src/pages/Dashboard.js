// src/pages/Dashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Link } from 'react-router-dom';
import { calculateCalorieGoal } from '../utils/dailyCaloriesCalculator';
import styles from './Dashboard.module.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const API_URL = process.env.REACT_APP_API_URL;

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [water, setWater] = useState(0);
  const [user, setUser] = useState(null);
  const [meals, setMeals] = useState([]);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setUser(res.data);
      fetchStats(res.data.userId);
      fetchMeals(res.data.userId);
    } catch (err) {
      console.error('Error fetching user data:', err);
    }
  };

  const fetchStats = async (userId) => {
    const date = new Date().toLocaleDateString('en-CA');
    try {
      const res = await axios.get(`${API_URL}/api/stats/${userId}/${date}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setStats(res.data);
      setWater(res.data?.waterIntake || 0);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const fetchMeals = async (userId) => {
    const date = new Date().toLocaleDateString('en-CA');
    try {
      const res = await axios.get(`${API_URL}/api/mealplans/${date}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setMeals(res.data);
    } catch (err) {
      console.error('Error fetching meals:', err);
    }
  };

  const handleWater = async () => {
    const date = new Date().toLocaleDateString('en-CA');
    try {
      await axios.post(`${API_URL}/api/stats/water`, {
        userId: user._id,
        date,
        amount: 250,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setWater(prev => prev + 250);
    } catch (err) {
      console.error('Error adding water intake:', err);
    }
  };

  const handleMealLog = async (mealPlanId, isConsumed, mealCalories) => {
    try {
      const response = await axios.post(`${API_URL}/api/stats/log-consumption`, 
        { mealPlanId, caloriesConsumed: isConsumed ? mealCalories : 0, waterConsumed: isConsumed ? 1 : 0 },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      fetchMeals(user._id);
      fetchStats(user._id);
    } catch (err) {
      console.error('Error logging meal:', err);
    }
  };

  const calorieGoal = user ? calculateCalorieGoal(user.age, user.height, user.weight, user.gender) : 0;
  const consumed = stats?.totalCalories || 0;
  const remaining = Math.max(calorieGoal - consumed, 0);

  const calorieChartData = {
    labels: ['Consumed', 'Remaining'],
    datasets: [{ data: [consumed, remaining], backgroundColor: ['#ff9f00', '#dcdcdc'] }],
  };

  const nutrientChart = (label, value, color) => ({
    labels: [label, 'Remaining'],
    datasets: [{ data: [value, 100 - value], backgroundColor: [color, '#f0f0f0'] }],
  });

  const waterPercentage = Math.min((water / 3000) * 100, 100);

  return (
    <div key={user?._id || 'default'} className={styles.container}>

      <h2 className={styles.heading}>Dashboard</h2>
      {user && <p className={styles.welcomeText}>Welcome, {user.name}!</p>}

      <div className="row">
        <h3 className={styles.subHeading}>Today's Meals</h3>
        {['Breakfast', 'Lunch', 'Dinner', 'Snack'].map(mealType => {
          const mealsOfType = meals.filter(meal => meal.mealType.toLowerCase() === mealType.toLowerCase());
          return (
            <div key={mealType} className="col-md-3">
              <div className={styles.mealTypeSection}>
                <h4>{mealType}</h4>
                {mealsOfType.length > 0 ? (
                  mealsOfType.map(meal => (
                    <div key={meal._id} className={styles.card}>
                      <p>{meal.recipeName} - {meal.totalCalories || 0} kcal</p>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={`meal-${meal._id}`}
                          checked={meal.consumed}
                          onChange={(e) => handleMealLog(meal._id, e.target.checked, meal.totalCalories)}
                        />
                        <label className={`form-check-label ${styles.formCheckLabel}`} htmlFor={`meal-${meal._id}`}>
                          Log Consumption
                        </label>
                      </div>
                      <span className={meal.consumed ? styles.successText : styles.dangerText}>
                        {meal.consumed ? "Consumed" : "Not Consumed"}
                      </span>
                    </div>
                  ))
                ) : (
                  <p>No {mealType.toLowerCase()} scheduled.</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.doughnutGrid}>
  <div className={styles.mainChart}>
    <Doughnut data={calorieChartData} />
    <p className={styles.chartLabel}>Calories</p>
  </div>

  <div className={styles.chartSection}>
    <Doughnut data={nutrientChart('Carbs', stats?.carbs || 0, '#4bc0c0')} />
    <p className={styles.chartLabel}>Carbs</p>
  </div>

  <div className={styles.chartSection}>
    <Doughnut data={nutrientChart('Fats', stats?.fats || 0, '#ff6384')} />
    <p className={styles.chartLabel}>Fats</p>
  </div>

  <div className={styles.chartSection}>
    <Doughnut data={nutrientChart('Proteins', stats?.proteins || 0, '#36a2eb')} />
    <p className={styles.chartLabel}>Proteins</p>
  </div>
</div>



      <div className={styles.waterSection}>
        <h3 className={styles.waterHeading}>Water Intake: {water} ml</h3>
        <div className={styles.progress}>
          <div className={styles.progressBar} style={{ width: `${waterPercentage}%` }} />
        </div>
        <button className={`${styles.button} ${styles.primaryBtn}`} onClick={handleWater}>+250ml</button>
      </div>

      <Link to="/daily-stats">
        <button className={`${styles.button} ${styles.infoBtn}`}>View Historical Stats</button>
      </Link>
    </div>
  );
};

export default Dashboard;
