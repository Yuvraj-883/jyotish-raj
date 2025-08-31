// ../src/components/ChatWindow.jsx

import { useState, useRef, useEffect, useCallback } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Sparkles, UserCircle, Send, ArrowLeft } from "lucide-react";
import { fetchChatResponse, startChatSession, submitBirthDetails } from "../services/chatService";

export default function ChatWindow({ persona, onBack }) {
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [detailsSubmitted, setDetailsSubmitted] = useState(false);
  const [formDetails, setFormDetails] = useState({
    name: "",
    date: "",
    time: "",
    location: "",
  });

  const messagesEndRef = useRef(null);

  // Calculate typing delay based on message length
  // Assuming 30 WPM typing speed and 5 characters average word length
  const calculateTypingDelay = (text) => {
    const wordCount = text.length / 5; // Approximate word count
    const typingTimeInMinutes = wordCount / 30; // 30 WPM
    const typingTimeInMs = typingTimeInMinutes * 60 * 1000;
    // Add a minimum delay of 1 second and maximum of 5 seconds for better UX
    return Math.max(1000, Math.min(5000, typingTimeInMs));
  };

  const addBotMessageWithDelay = useCallback((message) => {
    setIsTyping(true);
    const delay = calculateTypingDelay(message);
    
    setTimeout(() => {
      setMessages((prev) => [...prev, { sender: "bot", text: message }]);
      setIsTyping(false);
    }, delay);
  }, []);

  useEffect(() => {
    const fetchInitialMessage = async () => {
      try {
        const { sessionId, message } = await startChatSession(persona);
        setSessionId(sessionId);
        setIsLoading(false);
        addBotMessageWithDelay(message);
      } catch (error) {
        console.error("Failed to start chat session", error);
        setIsLoading(false);
        addBotMessageWithDelay("Cosmic signals are weak... please refresh the page.");
      }
    };
    fetchInitialMessage();
  }, [addBotMessageWithDelay, persona]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, isTyping]);

  const handleDetailsSubmit = async (e) => {
    e.preventDefault();
    if (!formDetails.name || !formDetails.date || !formDetails.time || !formDetails.location) {
      alert("Please fill in all the details.");
      return;
    }
    setIsLoading(true);
    const submissionMessage = `Okay, here are my details: Name: ${formDetails.name}, DOB: ${formDetails.date} at ${formDetails.time} in ${formDetails.location}.`;
    setMessages((prev) => [...prev, { sender: "user", text: submissionMessage }]);
    try {
      const response = await submitBirthDetails(sessionId, formDetails);
      setIsLoading(false);
      addBotMessageWithDelay(response);
      setDetailsSubmitted(true);
    } catch (error) {
      console.error("Error submitting details:", error);
      const errorMessage = `A cosmic disturbance occurred... ${error.message}`;
      setIsLoading(false);
      addBotMessageWithDelay(errorMessage);
    }
  };

  const sendMessage = async () => {
    if (!sessionId || !input.trim() || isLoading || isTyping) return;
    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    const currentInput = input;
    setInput("");
    setIsLoading(true);
    try {
      const response = await fetchChatResponse(sessionId, currentInput);
      setIsLoading(false);
      addBotMessageWithDelay(response);
    } catch (error) {
      console.error("Error fetching response", error);
      const errorMessage = `A cosmic disturbance occurred... ${error.message}`;
      setIsLoading(false);
      addBotMessageWithDelay(errorMessage);
    }
  };

  const handleFormChange = (e) => {
    setFormDetails({ ...formDetails, [e.target.name]: e.target.value });
  };

  // --- The rest of your JSX remains exactly the same ---
  return (
    <div className="flex flex-col h-screen bg-slate-900 text-gray-200">
      {/* Navbar */}
      <div className="bg-gray-800 text-white p-4 flex items-center gap-3 shadow-lg border-b border-slate-700">
        {onBack && (
          <Button
            onClick={onBack}
            className="bg-gray-700 hover:bg-gray-600 p-2 mr-2"
          >
            <ArrowLeft size={20} />
          </Button>
        )}
        <div className="text-3xl">{persona.avatar}</div>
        <div className="flex-1">
          <span className="text-lg font-semibold">{persona.name}</span>
          <p className="text-sm text-gray-300">{persona.specialty}</p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1 text-yellow-400">
            <Sparkles size={16} />
            <span className="text-sm font-bold">{persona.rating.toFixed(1)}</span>
          </div>
          <p className="text-xs text-gray-400">{persona.experience} exp</p>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-end gap-2 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
            {msg.sender === 'bot' && <Sparkles className="text-indigo-400" size={24} />}
            <div className={`p-3 rounded-lg max-w-lg shadow-md ${msg.sender === "user" ? "bg-indigo-600 text-white" : "bg-slate-700 text-gray-200"}`}>{msg.text}</div>
            {msg.sender === 'user' && <UserCircle className="text-indigo-400" size={24} />}
          </div>
        ))}
        
        {(isLoading || isTyping) && (
          <div className="flex items-end gap-2 justify-start">
             <Sparkles className="text-indigo-400" size={24} />
            <div className="p-3 rounded-lg bg-slate-700 text-gray-400 italic shadow-md flex items-center gap-2">
              <span>{persona.name} is typing</span>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Section */}
      <div className="p-4 bg-gray-800 border-t border-slate-700">
        {!detailsSubmitted ? (
          <form onSubmit={handleDetailsSubmit} className="space-y-3">
            <p className="text-center text-indigo-300">Please provide your birth details to cast your chart.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input name="name" onChange={handleFormChange} placeholder="Your Name" required className="bg-slate-600 text-white border-slate-500"/>
              <Input name="location" onChange={handleFormChange} placeholder="Birth City, Country (e.g., Delhi, India)" required className="bg-slate-600 text-white border-slate-500"/>
              <Input name="date" type="date" onChange={handleFormChange} required className="bg-slate-600 text-white border-slate-500"/>
              <Input name="time" type="time" onChange={handleFormChange} required className="bg-slate-600 text-white border-slate-500"/>
            </div>
            <Button type="submit" disabled={isLoading || isTyping} className="w-full bg-indigo-600 hover:bg-indigo-700 transition">
              Calculate My Cosmic Blueprint
            </Button>
          </form>
        ) : (
          <div className="flex items-center gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask a follow-up question..."
              className="flex-1 bg-slate-600 text-white border-slate-500"
            />
            <Button onClick={sendMessage} disabled={isLoading || isTyping} className="bg-indigo-600 hover:bg-indigo-700">
              <Send size={18} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}