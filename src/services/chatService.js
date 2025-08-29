// ../src/services/chatService.js

// Ensure this URL points to your deployed backend or local server
const API_BASE_URL = "https://astro-backend-xi.vercel.app/api/v1";

/**
 * Starts a new chat session.
 * @returns {Promise<{sessionId: string, message: string}>}
 */
export const startChatSession = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/astro/start`);
    if (!response.ok) throw new Error("Failed to start session");
    return await response.json();
  } catch (error) {
    console.error("Error starting chat session:", error);
    throw error;
  }
};

/**
 * Submits the user's birth details.
 * @param {string} sessionId
 * @param {object} birthDetails - { name, date, time, location }
 * @returns {Promise<string>}
 */
export const submitBirthDetails = async (sessionId, birthDetails) => {
  try {
    const response = await fetch(`${API_BASE_URL}/astro/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        message: "Here are my birth details.",
        birthDetails, // This must be a structured object
      }),
    });
    if (!response.ok) throw new Error("Failed to submit details");
    const data = await response.json();
    return data.message;
  } catch (error) {
    console.error("Error submitting birth details:", error);
    throw error;
  }
};

/**
 * Sends a regular chat message.
 * @param {string} sessionId
 * @param {string} message
 * @returns {Promise<string>}
 */
export const fetchChatResponse = async (sessionId, message) => {
  try {
    const response = await fetch(`${API_BASE_URL}/astro/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, message }), // No birthDetails here
    });
    if (!response.ok) throw new Error("Failed to fetch response");
    const data = await response.json();
    return data.message;
  } catch (error) {
    console.error("Error fetching chat response:", error);
    throw error;
  }
};