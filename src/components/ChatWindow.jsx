// ../src/components/ChatWindow.jsx

import { useState, useRef, useEffect } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Sparkles, UserCircle, Send } from "lucide-react";
// UPDATED: Import the start chat service function
import { fetchChatResponse, startChatSession } from "../services/chatService";
import { astrologyPersona } from "../services/astrologyPersonas.js";

export default function ChatWindow() {
  // Start with an empty message array
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(true); // Set initial loading to true
  const messagesEndRef = useRef(null);

  // NEW: useEffect to fetch the initial message on component mount
  useEffect(() => {
    const fetchInitialMessage = async () => {
      try {
        const initialMessage = await startChatSession();
        setMessages([{ sender: "bot", text: initialMessage }]);
      } catch (error) {
        console.error("Failed to start chat session", error);
        setMessages([{ sender: "bot", text: "Cosmic signals are weak... please refresh the page." }]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialMessage();
  }, []); // The empty dependency array means this runs only once on mount

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages, isLoading]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetchChatResponse(input);
      setMessages((prev) => [...prev, { sender: "bot", text: response }]);
    } catch (error) {
      console.error("Error fetching response", error);
      setMessages((prev) => [...prev, { sender: "bot", text: "The cosmic signals are blurry... Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  // ... rest of your JSX remains the same ...
  // (The full JSX is below for completeness)

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
            <div className={`p-3 rounded-lg max-w-lg shadow-md ${msg.sender === "user" ? "bg-indigo-600 text-white" : "bg-slate-700 text-gray-200"}`}>
              {msg.text}
            </div>
            {msg.sender === 'user' && <UserCircle className="text-indigo-400" size={24} />}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-end gap-2 justify-start">
             <Sparkles className="text-indigo-400" size={24} />
            <div className="p-3 rounded-lg bg-slate-700 text-gray-400 italic shadow-md">
              Acharya is consulting the stars...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-gray-800 border-t border-slate-700 flex items-center gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          placeholder="Ask the stars a question..."
          className="flex-1 bg-slate-600 text-white border-slate-500 rounded-lg p-2 placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500"
        />
        <Button
          onClick={sendMessage}
          disabled={isLoading || messages.length === 0} // Disable if still loading initial message
          className="bg-indigo-600 text-white flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-indigo-700 transition disabled:bg-indigo-400"
        >
          <Send size={18} /> Send
        </Button>
      </div>
    </div>
  );
}