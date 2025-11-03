import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null); // user = { role: 'admin' | 'user' }

  useEffect(() => {
    // Load auth state from localStorage if available
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    // If token and role exist, the user is authenticated
    if (token && role) {
      setIsAuthenticated(true);
      setUser({ role });
    }
  }, []); // only run once on component mount

  const login = (token, role) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    setIsAuthenticated(true);
    setUser({ role });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
