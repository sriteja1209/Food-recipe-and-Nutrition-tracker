// components/admin/AdminLayout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
//import AdminNavbar from './AdminNavbar';
import AdminSidebar from './AdminSidebar';
import './AdminLayout.css'; // Optional styling

const AdminLayout = () => {
  return (
    <div className="admin-layout">
     
      <div className="admin-content">
        <AdminSidebar />
        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
