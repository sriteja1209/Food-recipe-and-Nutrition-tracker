import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Login.module.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:7000/api/users/login', formData);
      const { token, role } = res.data;

      login(token, role);

      const profileRes = await axios.get('http://localhost:7000/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });

      localStorage.setItem('profile', JSON.stringify(profileRes.data));
      navigate(role === 'admin' ? '/admin/dashboard' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.card}>
        <h2 className={styles.title}>Login</h2>
        {error && <p className={styles.error}>{error}</p>}
        <form onSubmit={handleLogin} className={styles.form}>
          <input
            type="email"
            name="email"
            className={styles.input}
            placeholder="Email"
            required
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            className={styles.input}
            placeholder="Password"
            required
            value={formData.password}
            onChange={handleChange}
          />
          <button type="submit" className={styles.primaryBtn}>Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
