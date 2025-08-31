// ../src/services/chatService.js

import { getApiUrl, API_CONFIG } from "../config/api";

/**
 * A helper function to handle API responses and parse errors correctly.
 * @param {Response} response - The raw response from the fetch call.
 */
const handleResponse = async (response) => {
  // Try to parse the body of the response as JSON
  const data = await response.json();
  
  // If the server responded with an error status code (like 400 or 500)
  if (!response.ok) {
    // Throw an error using the specific message from the server's JSON response
    throw new Error(data.message || `API Error: ${response.status}`);
  }
  
  // If the response is OK, return the JSON data
  return data;
};

export const fetchPersonas = async () => {
  try {
    const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.PERSONAS));
    return await handleResponse(response); // Returns array of personas
  } catch (error) {
    console.error("Error fetching personas:", error.message);
    throw error; // Re-throw the error to be caught by the component
  }
};

export const startChatSession = async (persona = null) => {
  try {
    const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.ASTRO_START), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ persona: persona || null }),
    });
    return await handleResponse(response); // Returns { sessionId, message }
  } catch (error) {
    console.error("Error starting chat session:", error.message);
    throw error; // Re-throw the error to be caught by the component
  }
};

export const submitBirthDetails = async (sessionId, birthDetails) => {
  try {
    const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.ASTRO_CHAT), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        message: "Here are my birth details.",
        birthDetails,
      }),
    });
    const data = await handleResponse(response);
    return data.message;
  } catch (error) {
    console.error("Error submitting birth details:", error.message);
    throw error; // Re-throw the error
  }
};

export const fetchChatResponse = async (sessionId, message) => {
  try {
    const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.ASTRO_CHAT), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, message }),
    });
    const data = await handleResponse(response);
    return data.message;
  } catch (error) {
    console.error("Error fetching chat response:", error.message);
    throw error; // Re-throw the error
  }
};