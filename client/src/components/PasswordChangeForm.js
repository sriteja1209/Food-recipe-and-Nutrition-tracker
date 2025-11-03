import React from 'react';
import styles from './PasswordChangeForm.module.css';

const PasswordChangeForm = ({
  password,
  setPassword,
  newPassword,
  setNewPassword,
  onSubmit,
}) => {
  return (
    <form onSubmit={onSubmit} className={styles.passwordForm}>
      <h3>Change Password</h3>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Current Password"
        required
      />
      <input
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        placeholder="New Password"
        required
      />
      <button type="submit">Change Password</button>
    </form>
  );
};

export default PasswordChangeForm;



