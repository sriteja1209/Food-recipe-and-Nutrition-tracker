// components/admin/AdminSidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './AdminLayout.css'; // Use same global CSS file

const AdminSidebar = () => {
  return (
    <div className="admin-sidebar p-3">
      <h4 className="text-white mb-4">Admin Menu</h4>
      <ul className="list-unstyled">
        <li className="mb-3">
          <Link to="/admin/dashboard" className="text-white text-decoration-none">
            Dashboard
          </Link>
        </li>
        <li className="mb-3">
          <Link to="/admin/recipes" className="text-white text-decoration-none">
            Recipes
          </Link>
        </li>
        <li className="mb-3">
          <Link to="/admin/users" className="text-white text-decoration-none">
            Users
          </Link>
        </li>
        <li className="mb-3">
          <Link to="/admin/analytics" className="text-white text-decoration-none">
            Analytics
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default AdminSidebar;
