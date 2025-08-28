// ../src/services/chatService.js

// const API_BASE_URL = "http://localhost:8000/api/v1"; // Your server's URL
const API_BASE_URL = "https://astro-backend-xi.vercel.app/api/v1"; // Production server URL

// NEW FUNCTION
/**
 * Fetches the initial greeting from the bot to start a new session.
 * @returns {Promise<string>} The bot's initial greeting.
 */
export const startChatSession = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/astro/start`);
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    const data = await response.json();
    return data.message;
  } catch (error) {
    console.error("Failed to start chat session:", error);
    return "Could not connect to the celestial plane. Please refresh.";
  }
};


export const fetchChatResponse = async (message) => {
  try {
    const response = await fetch(`${API_BASE_URL}/astro/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.message;

  } catch (error) {
    console.error("Failed to fetch chat response:", error);
    return "Sorry, the cosmic connection seems to be weak right now. Please try again later.";
  }
};