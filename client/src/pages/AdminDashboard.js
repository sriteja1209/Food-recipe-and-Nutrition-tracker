// components/admin/AdminDashboard.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../components/Admin/AdminLayout.css';

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard container mt-4">
      <h1 className="mb-5 text-center">Welcome to Admin Dashboard</h1>
      <div className="admin-links d-flex justify-content-center gap-4 flex-wrap">
        <Link to="/admin/users" className="admin-link-card btn btn-outline-primary shadow-sm">
          Manage Users
        </Link>
        <Link to="/admin/recipes" className="admin-link-card btn btn-outline-success shadow-sm">
          Manage Recipes
        </Link>
        <Link to="/admin/analytics" className="admin-link-card btn btn-outline-info shadow-sm">
          View Analytics
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
