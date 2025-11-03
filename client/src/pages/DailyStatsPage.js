import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import styles from './DailyStatsPage.module.css'; // CSS Module

const API_URL = process.env.REACT_APP_API_URL;

const DailyStatsPage = () => {
  const [historicalStats, setHistoricalStats] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateDates = (startDate, endDate) => {
    if (!moment(startDate, 'YYYY-MM-DD', true).isValid() || !moment(endDate, 'YYYY-MM-DD', true).isValid()) {
      setError('Invalid date format. Please use YYYY-MM-DD.');
      return false;
    }
    return true;
  };

  console.log('Start Date:', startDate);
  console.log('End Date:', endDate);

  
  const fetchHistoricalStats = async (startDate, endDate) => {
    if (!validateDates(startDate, endDate)) return;
    const token = localStorage.getItem('token');
    if (!token) {
      setError('You are not logged in. Please log in again.');
      return;
    }
  
    setLoading(true);
    console.log(`Fetching stats from ${startDate} to ${endDate}`);
    try {
      const response = await axios.get(`${API_URL}/api/stats/historical-stats?startDate=${startDate}&endDate=${endDate}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Response:', response.data);  // Log response for debugging
      setHistoricalStats(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch historical stats. Please try again later.');
      console.error(err);
    }
    setLoading(false);
  };
  

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.heading}>Historical Daily Stats</h1>
        <button className={styles.backButton} onClick={() => navigate('/dashboard')}>
          ⬅ Back to Dashboard
        </button>
      </div>

      <div className={styles.filters}>
        <label>Start Date:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className={styles.input}
        />

        <label>End Date:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className={styles.input}
        />

        <button
          className={styles.button}
          onClick={() => fetchHistoricalStats(startDate, endDate)}
          disabled={!startDate || !endDate || loading}
        >
          Load Stats
        </button>
      </div>

      {error && <p className={styles.error}>{error}</p>}
      {loading && <p>Loading...</p>}

      <div className={styles.statsList}>
        {historicalStats.length > 0 ? (
          <ul>
            {historicalStats.map((stat) => (
              <li key={stat._id}>
                <strong>{stat.date}</strong>: {stat.totalCalories} calories, {stat.waterIntake}L water
              </li>
            ))}
          </ul>
        ) : (
          <p>No historical stats found for this range.</p>
        )}
      </div>
    </div>
  );
};

export default DailyStatsPage;
