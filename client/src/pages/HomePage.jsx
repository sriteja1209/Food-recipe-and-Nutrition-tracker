import React from 'react';
import { Link } from 'react-router-dom';
import styles from './HomePage.module.css';

const HomePage = () => {
  return (
    <div className={styles.homePage}>
      <div className={styles.card}>
        <h1 className={styles.title}>Welcome to the Food Recipe and Nutrition Tracker!</h1>
        <p className={styles.description}>
          Discover a variety of healthy, delicious recipes and track your nutrition with ease.
          Plan your meals, stay on top of your calorie intake, and save your favorite recipes for quick access.
          Whether you're aiming for a healthier lifestyle or simply looking for new meal ideas,
          our app is here to support you every step of the way!
        </p>
        <div className={styles.actions}>
          <Link to="/register" className={styles.link}>
            <button className={styles.primaryBtn}>Register</button>
          </Link>
          <Link to="/login" className={styles.link}>
            <button className={styles.outlineBtn}>Login</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
