// components/admin/AdminNavbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './AdminLayout.css'; // Use same global CSS file

const AdminNavbar = () => {
  return (
    <nav className="navbar navbar-expand-lg admin-navbar d-flex justify-content-between align-items-center px-4 py-2" style={{ background: '#ff7f50' }}>
      <div className="navbar-logo">
        <h2 className="text-white mb-0">FOOD & NUTRITION TRACKER</h2>
      </div>
      <div className="navbar-links d-flex gap-3 align-items-center">
        <Link to="/admin/dashboard" className="btn btn-outline-light btn-sm">Dashboard</Link>
        <Link to="/admin/users" className="btn btn-outline-light btn-sm">Users</Link>
        <Link to="/admin/recipes" className="btn btn-outline-light btn-sm">Recipes</Link>
        <Link to="/admin/analytics" className="btn btn-outline-light btn-sm">Analytics</Link>
        <Link to="/admin/profile" className="btn btn-outline-light btn-sm">Profile</Link>
        <Link to="/login" className="btn btn-outline-danger btn-sm">Logout</Link>
      </div>
    </nav>
  );
};

export default AdminNavbar;