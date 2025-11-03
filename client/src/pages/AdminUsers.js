// components/admin/AdminUsers.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const token = localStorage.getItem('token'); // Get token from localStorage

  useEffect(() => {
    // Add Authorization header with the token
    axios.get(`${API_URL}/api/users`, {
      headers: {
        Authorization: `Bearer ${token}` // Include the token in the header
      }
    })
      .then(response => setUsers(response.data))
      .catch(error => console.error('Error fetching users:', error));
  }, [token]); // Ensure token is watched for changes

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}` // Add token for delete request
        }
      });
      setUsers(users.filter(user => user._id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      await axios.put(`${API_URL}/api/users/${id}`, { role: newRole }, {
        headers: {
          Authorization: `Bearer ${token}` // Add token for put request
        }
      });
      setUsers(users.map(user => user._id === id ? { ...user, role: newRole } : user));
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <h1 className="mb-4 text-center">Manage Users</h1>
      <input 
        type="text" 
        className="form-control mb-4"
        placeholder="Search by name or email"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)} 
      />
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(user => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <select
                  className="form-select"
                  value={user.role}
                  onChange={(e) => handleRoleChange(user._id, e.target.value)}
                >
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                </select>
              </td>
              <td>
                <button 
                  className="btn btn-danger"
                  onClick={() => handleDelete(user._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsers;
