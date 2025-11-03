import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FaCalendarAlt } from 'react-icons/fa';
import styles from './Navbar.module.css';

const Navbar = () => {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');
    setIsLoggedIn(!!token);
    setRole(userRole || '');
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setRole('');
    window.location.href = '/';
  };

  const navLinkClass = ({ isActive }) =>
    isActive ? `${styles.link} ${styles.active}` : styles.link;

  return (
    <nav className={styles.navbar}>
      <h3 className={styles.logo}>Food & Nutrition Tracker</h3>
      <div className={styles.links}>
        {isLoggedIn ? (
          role === 'admin' ? (
            <>
              <NavLink to="/admin/dashboard" className={navLinkClass}>Admin Dashboard</NavLink>
              <NavLink to="/admin/users" className={navLinkClass}>Users</NavLink>
              <NavLink to="/admin/recipes" className={navLinkClass}>Recipes</NavLink>
              <NavLink to="/admin/analytics" className={navLinkClass}>Analytics</NavLink>
              <NavLink to="/admin/profile" className={navLinkClass}>Profile</NavLink>
              <button onClick={handleLogout} className={styles.logout}>Logout</button>
            </>
          ) : (
            <>
              <NavLink to="/dashboard" className={navLinkClass}>Dashboard</NavLink>
              <NavLink to="/recipes" className={navLinkClass}>Recipes</NavLink>
              <NavLink to="/add-recipe" className={navLinkClass}>Add Recipe</NavLink>
              <NavLink to="/mealplanner" className={navLinkClass} title="Meal Planner">
                <FaCalendarAlt className={styles.calendarIcon} />
              </NavLink>
              <NavLink to="/profile" className={navLinkClass}>Profile</NavLink>
              <button onClick={handleLogout} className={styles.logout}>Logout</button>
            </>
          )
        ) : (
          <>
            <NavLink to="/login" className={navLinkClass}>Login</NavLink>
            <NavLink to="/register" className={navLinkClass}>Register</NavLink>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
