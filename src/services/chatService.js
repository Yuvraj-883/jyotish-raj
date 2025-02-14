import axios from "axios";

export const fetchChatResponse = async (message) => {
  try {
    const response = await axios.post("http://localhost:8000/api/chat", { message });
    const content = response?.data?.message;
    console.log(response);

    // Regular expression to remove <think>...</think> tags and their content
    // const cleanedContent = content.replace(/<think>[\s\S]*?<\/think>/g, '').trim();

    // console.log(content); 
    return content; 
  } catch (error) {
    console.error("Error fetching chatbot response:", error);
    return "Oops! Something went wrong. Try again. 😢";
  }
};
