import { useState } from "react";
import Message from "./Message";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { MessageCircle, UserCircle } from "lucide-react";
import { fetchChatResponse } from "../services/chatService";

export default function ChatWindow() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hey there! How’s your day going? 😊" },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);
    setInput("");

    try {
      const response = await fetchChatResponse(input);
      setMessages((prev) => [...prev, { sender: "bot", text: response }]);
    } catch (error) {
      console.error("Error fetching response", error);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Navbar */}
      <div className="bg-green-600 text-white p-4 flex items-center gap-3 shadow-md">
        <UserCircle size={40} className="bg-white text-green-600 rounded-full p-1" />
        <span className="text-lg font-semibold">Sunaina</span>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 mb-24">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg max-w-md ${
              msg.sender === "user"
                ? "bg-green-500 text-white self-end ml-auto"
                : "bg-gray-200 text-gray-900 self-start"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* Input Section */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-md flex items-center gap-2">
        <Input
          value={input} 
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              sendMessage();
            }
          }}
          placeholder="Type a message..."
          className="flex-1 border border-gray-300 rounded-lg p-2"
        />
        <Button
          onClick={sendMessage}
          className="bg-green-500 text-white flex items-center gap-1 px-4 py-2 rounded-lg hover:bg-green-600 transition"
        >
          <MessageCircle size={18} /> Send
        </Button>
      </div>
    </div>
  );
}
