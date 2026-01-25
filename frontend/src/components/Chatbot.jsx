import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import "./Chatbot.css";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  // 1. New State to manage window size
  const [size, setSize] = useState({ width: 350, height: 500 });

  const [messages, setMessages] = useState([
    {
      text: "Welcome to AgriGrow! 🌱 I am your AI assistant. Ask me anything about crops, fertilizers, or plant diseases!",
      sender: "bot",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  // 2. Resize Logic (Top-Left)
  const handleResizeMouseDown = (e) => {
    e.preventDefault(); // Prevent text selection
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = size.width;
    const startHeight = size.height;

    const doDrag = (dragEvent) => {
      // Calculate how much the mouse moved
      const deltaX = startX - dragEvent.clientX; // Moving left (negative) increases width
      const deltaY = startY - dragEvent.clientY; // Moving up (negative) increases height

      setSize({
        // Limit min size to 300x400
        width: Math.max(300, startWidth + deltaX),
        height: Math.max(400, startHeight + deltaY),
      });
    };

    const stopDrag = () => {
      document.removeEventListener("mousemove", doDrag);
      document.removeEventListener("mouseup", stopDrag);
    };

    document.addEventListener("mousemove", doDrag);
    document.addEventListener("mouseup", stopDrag);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/chat", {
        message: userMessage.text,
      });

      const botMessage = { text: response.data.reply, sender: "bot" };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          text: "Sorry, I am having trouble connecting. Please try again later.",
          sender: "bot",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chatbot-container">
      {isOpen && (
        <div
          className="chat-window"
          // 3. Apply the dynamic width and height
          style={{ width: size.width, height: size.height }}
        >
          {/* 4. The New Resize Handle (Top-Left) */}
          <div
            className="resize-handle-tl"
            onMouseDown={handleResizeMouseDown}
            title="Drag to resize"
          >
            {/* Simple diagonal grip icon using SVG */}
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="2" y1="2" x2="12" y2="12"></line>
              <line x1="2" y1="2" x2="2" y2="2"></line>{" "}
              {/* Make the corner look sharp */}
            </svg>
          </div>

          <div className="chat-header">
            <div className="header-info">
              <h3>AgriGrow AI 🌿</h3>
              <p>Your Farming Expert</p>
            </div>
            <button onClick={toggleChat} className="close-btn">
              ×
            </button>
          </div>

          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`}>
                <div className="message-bubble">
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="message bot">
                <div className="message-bubble typing">...</div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="chat-input-area">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about crops..."
            />
            <button type="submit" disabled={isLoading}>
              ➤
            </button>
          </form>
        </div>
      )}

      <button className="chat-launcher" onClick={toggleChat}>
        {isOpen ? "✖" : "💬"}
      </button>
    </div>
  );
};

export default Chatbot;
