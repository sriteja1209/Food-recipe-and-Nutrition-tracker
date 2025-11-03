// src/pages/Register.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Register.module.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    height: '',
    weight: '',
    gender: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const response = await axios.post('http://localhost:7000/api/users/register', formData);
      setSuccess(response.data.message);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className={styles.bgLight}>
      <div className={styles.registerCard}>
        <h2 className={styles.heading}>Register</h2>

        {error && <div className={`${styles.alert} ${styles.alertDanger}`}>{error}</div>}
        {success && <div className={`${styles.alert} ${styles.alertSuccess}`}>{success}</div>}

        <form onSubmit={handleSubmit}>
          <label className={styles.label}>Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} className={styles.input} required />

          <label className={styles.label}>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} className={styles.input} required />

          <label className={styles.label}>Password</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} className={styles.input} required />

          <div className={styles.inlineGroup}>
            <div>
              <label className={styles.label}>Age</label>
              <input type="number" name="age" value={formData.age} onChange={handleChange} className={styles.input} required />
            </div>
            <div>
              <label className={styles.label}>Height (cm)</label>
              <input type="number" name="height" value={formData.height} onChange={handleChange} className={styles.input} required />
            </div>
            <div>
              <label className={styles.label}>Weight (kg)</label>
              <input type="number" name="weight" value={formData.weight} onChange={handleChange} className={styles.input} required />
            </div>
          </div>

          <label className={styles.label}>Gender</label>
          <select name="gender" value={formData.gender} onChange={handleChange} className={styles.input} required>
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>

          <button type="submit" className={styles.button}>Register</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
