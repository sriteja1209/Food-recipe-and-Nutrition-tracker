import axios from 'axios';

// Create an Axios instance with a base URL (now pointing to port 7000)
const api = axios.create({
  baseURL: 'http://localhost:7000/api', // Updated to use port 7000 for the backend
});

// Function to get the token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Automatically attach JWT token to each request
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Handle request errors (like network issues)
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Handle responses to catch and process errors like expired tokens
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors (e.g., token expired)
    if (error.response && error.response.status === 401) {
      // Optionally, you could handle token expiration, like refreshing the token or logging out
      console.error("Token expired or unauthorized. Logging out.");
      // Remove token and logout or refresh logic here
      localStorage.removeItem('token');
      // Redirect to login or handle as per your app's logic
      window.location.href = '/login';  // Redirect to login
    }
    return Promise.reject(error);
  }
);

// You can also add a helper method to handle specific API calls if needed
const apiRequest = async (url, options = {}) => {
  try {
    const response = await api(url, options);
    return response.data;
  } catch (error) {
    throw new Error(error.response ? error.response.data : error.message);
  }
};

export { api, apiRequest };  // Exporting api instance and helper function for use in other files
