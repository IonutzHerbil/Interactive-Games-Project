import axios from 'axios';

// Base URL of the Spring Boot backend
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

export const getHomeMessage = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/Home`);
    return response.data; // "Hello World"
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};
