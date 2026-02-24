import axios from "axios";

const isProduction = window.location.hostname !== "localhost";

const axiosinstance = axios.create({
  baseURL: isProduction 
    ? "https://varidate-backend-production-ae3e.up.railway.app/api" 
    : "http://localhost:3000/api",
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add response interceptor to handle errors
axiosinstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      console.error('Response error:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('Request error:', error.request);
    } else {
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosinstance;
