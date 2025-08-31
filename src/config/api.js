// API Configuration
const isDevelopment = process.env.NODE_ENV === 'development';

export const API_CONFIG = {
  BASE_URL: isDevelopment 
    ? "http://localhost:8000/api/v1" 
    : "https://astro-backend-xi.vercel.app/api/v1",
  
  ENDPOINTS: {
    PERSONAS: "/personas",
    ASTRO_START: "/astro/start",
    ASTRO_CHAT: "/astro/chat"
  }
};

export const getApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};
