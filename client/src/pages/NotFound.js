import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';  // Import the CSS

const NotFound = ({ isUnauthorized }) => (
  <div className="not-found">
    <h2>404 - Page Not Found</h2>
    {isUnauthorized ? (
      <p className="unauthorized-message">You are not authorized to access this page. Please log in.</p>
    ) : (
      <p>Sorry, the page you're looking for doesn't exist.</p>
    )}
    <Link to="/" className="back-link">Go Back to Home</Link>
  </div>
);

export default NotFound;
