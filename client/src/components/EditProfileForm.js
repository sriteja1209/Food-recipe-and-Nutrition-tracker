import React, { useState, useEffect } from 'react';
import styles from './EditProfileForm.module.css';

const EditProfileForm = ({ profile, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    height: '',
    weight: '',
    gender: 'male',
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        age: profile.age || '',
        height: profile.height || '',
        weight: profile.weight || '',
        gender: profile.gender || 'male',
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e,formData); // Send form data to parent
  };

  return (
    <form onSubmit={handleSubmit} className={styles.editForm}>
      <label>Name:</label>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
      />

      <label>Age:</label>
      <input
        type="number"
        name="age"
        value={formData.age}
        onChange={handleChange}
      />

      <label>Height (cm):</label>
      <input
        type="number"
        name="height"
        value={formData.height}
        onChange={handleChange}
      />

      <label>Weight (kg):</label>
      <input
        type="number"
        name="weight"
        value={formData.weight}
        onChange={handleChange}
      />

      <label>Gender:</label>
      <select
        name="gender"
        value={formData.gender}
        onChange={handleChange}
      >
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>

      <div className={styles.buttons}>
        <button type="submit">Save Changes</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
};

export default EditProfileForm;
