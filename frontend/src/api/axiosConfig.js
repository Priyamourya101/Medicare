import axios from "axios";

// Create an Axios instance with custom configuration
const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/hospital/", // ✅ Update this if deployed
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: false, // 🔧 Set to true if your backend uses cookies for sessions
});

// Interceptor to add Authorization token (JWT) if available
axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

// Interceptor for handling responses and errors globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      console.error("⚠️ Unauthorized! Please log in again.");
      // Optionally: redirect to login or show a toast message
    } else if (status === 403) {
      console.error(
        "🚫 Forbidden: You don't have permission to access this resource."
      );
    } else if (status === 500) {
      console.error("💥 Server Error: Something went wrong on the backend.");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
