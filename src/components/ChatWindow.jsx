// ../src/components/ChatWindow.jsx

import { useState, useRef, useEffect } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Sparkles, UserCircle, Send } from "lucide-react";
import { fetchChatResponse, startChatSession, submitBirthDetails } from "../services/chatService";
import { astrologyPersona } from "../services/astrologyPersonas.js";

export default function ChatWindow() {
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [detailsSubmitted, setDetailsSubmitted] = useState(false);
  const [formDetails, setFormDetails] = useState({
    name: "",
    date: "",
    time: "",
    location: "",
  });

  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchInitialMessage = async () => {
      try {
        const { sessionId, message } = await startChatSession();
        setSessionId(sessionId);
        setMessages([{ sender: "bot", text: message }]);
      } catch (error) {
        console.error("Failed to start chat session", error);
        setMessages([{ sender: "bot", text: "Cosmic signals are weak... please refresh the page." }]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialMessage();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

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
      setMessages((prev) => [...prev, { sender: "bot", text: response }]);
      setDetailsSubmitted(true);
    } catch (error) {
      console.error("Error submitting details", error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    setInput("");
    setIsLoading(true);
    try {
      const response = await fetchChatResponse(sessionId, input);
      setMessages((prev) => [...prev, { sender: "bot", text: response }]);
    } catch (error) {
      console.error("Error fetching response", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormChange = (e) => {
    setFormDetails({ ...formDetails, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-gray-200">
      <div className="bg-gray-800 text-white p-4 flex items-center gap-3 shadow-lg border-b border-slate-700">
        <Sparkles size={40} className="bg-indigo-500 text-white rounded-full p-2" />
        <span className="text-lg font-semibold">{astrologyPersona.name}</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-end gap-2 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
            {msg.sender === 'bot' && <Sparkles className="text-indigo-400" size={24} />}
            <div className={`p-3 rounded-lg max-w-lg shadow-md ${msg.sender === "user" ? "bg-indigo-600 text-white" : "bg-slate-700 text-gray-200"}`}>{msg.text}</div>
            {msg.sender === 'user' && <UserCircle className="text-indigo-400" size={24} />}
          </div>
        ))}
        
        {/* --- THIS IS THE CORRECTED CODE --- */}
        {isLoading && (
          <div className="flex items-end gap-2 justify-start">
             <Sparkles className="text-indigo-400" size={24} />
            <div className="p-3 rounded-lg bg-slate-700 text-gray-400 italic shadow-md">
              Astra is consulting the stars...
            </div>
          </div>
        )}
        {/* --- END OF CORRECTION --- */}

        <div ref={messagesEndRef} />
      </div>

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
            <Button type="submit" disabled={isLoading} className="w-full bg-indigo-600 hover:bg-indigo-700 transition">
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
            <Button onClick={sendMessage} disabled={isLoading} className="bg-indigo-600 hover:bg-indigo-700">
              <Send size={18} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}