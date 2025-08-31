// API Configuration
const isDevelopment = process.env.NODE_ENV === 'development';
const customApiUrl = process.env.REACT_APP_API_BASE_URL;

export const API_CONFIG = {
  BASE_URL: customApiUrl || (isDevelopment 
    ? "http://localhost:8000/api/v1" 
    : "https://astro-backend-xi.vercel.app/api/v1"),
  
  ENDPOINTS: {
    PERSONAS: "/personas",
    ASTRO_START: "/astro/start",
    ASTRO_CHAT: "/astro/chat",
    REVIEWS: "/reviews/persona"
  }
};

export const getApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Log environment info in development
if (isDevelopment) {
  console.log(`🌍 Environment: ${process.env.REACT_APP_ENVIRONMENT || 'development'}`);
  console.log(`🔗 API Base URL: ${API_CONFIG.BASE_URL}`);
  console.log(`📝 Custom API URL from env: ${customApiUrl || 'Not set'}`);
}
