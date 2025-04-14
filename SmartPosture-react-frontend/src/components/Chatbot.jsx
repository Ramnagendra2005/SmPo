import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SparklesIcon, CommandLineIcon, ArrowPathIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Format messages with markdown-like syntax
  const formatMessage = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-cyan-400">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="text-purple-300">$1</em>')
      .replace(/\n/g, '<br/>');
  };

  const toggleChat = () => {
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      inputRef.current?.focus();
    }
  }, [messages, isOpen]);

  const getCurrentTime = () =>
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    setMessages((prev) => [
      ...prev,
      { sender: "user", text: inputMessage, timestamp: getCurrentTime() },
    ]);
    setIsLoading(true);
    const userMessage = inputMessage;
    setInputMessage("");

    try {
      const response = await fetch("/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });
      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        { 
          sender: "bot", 
          text: formatMessage(data.response), 
          timestamp: getCurrentTime() 
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "🚨 **Connection Error**: Unable to reach the neural network",
          timestamp: getCurrentTime(),
        },
      ]);
    }
    setIsLoading(false);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 25 },
    },
    exit: { opacity: 0, y: 50, scale: 0.9, transition: { duration: 0.2 } },
  };

  const messageVariants = {
    hidden: { opacity: 0, x: -50, scale: 0.8 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 200, damping: 20 },
    },
  };

  const bubbleVariants = {
    hover: { scale: 1.1, rotate: 10 },
    tap: { scale: 0.9 },
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="flex flex-col w-[90%] sm:w-[420px] max-w-full h-[500px] sm:h-[600px] rounded-2xl shadow-2xl overflow-hidden mb-4 border border-white/20 backdrop-blur-xl"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={containerVariants}
            style={{
              background: 'radial-gradient(circle at center, #0a192f 0%, #020617 100%)',
            }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-900/80 to-blue-900/80 px-6 py-4 flex justify-between items-center border-b border-white/20">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-cyan-500/20 rounded-lg">
                  <CommandLineIcon className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-cyan-200">NeuroAssist AI</h4>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-xs text-cyan-300/80">Online</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={toggleChat} 
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <SparklesIcon className="w-6 h-6 text-cyan-300" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              <div className="text-center py-4">
                <div className="inline-flex items-center bg-white/5 px-4 py-2 rounded-full">
                  <SparklesIcon className="w-4 h-4 text-cyan-400 mr-2" />
                  <span className="text-sm text-cyan-300">NeuroAssist v2.3.1</span>
                </div>
              </div>

              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  className={`group relative p-4 rounded-xl max-w-[85%] break-words backdrop-blur-sm
                    ${msg.sender === "user"
                      ? "ml-auto bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-400/20"
                      : "mr-auto bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-400/20"
                    }`}
                  initial="hidden"
                  animate="visible"
                  variants={messageVariants}
                >
                  <div className={`text-sm ${msg.sender === "user" ? "text-cyan-100" : "text-purple-100"}`}>
                    {msg.sender === "user" ? (
                      msg.text
                    ) : (
                      <div dangerouslySetInnerHTML={{ __html: msg.text }} />
                    )}
                  </div>
                  <div className="text-xs mt-2 text-white/40 flex items-center justify-end space-x-1">
                    <span>{msg.timestamp}</span>
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center space-x-2 ml-4"
                >
                  <div className="flex space-x-[2px]">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
                        style={{ animationDelay: `${i * 0.1}s` }}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-cyan-300">Processing...</span>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form 
              onSubmit={sendMessage} 
              className="flex items-center space-x-2 p-4 border-t border-white/20 bg-gradient-to-r from-blue-900/20 to-purple-900/20"
            >
              <input
                type="text"
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Query the neural network..."
                className="flex-1 px-4 py-3 bg-white/5 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400/50 text-cyan-100 placeholder:text-cyan-100/40"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading}
                className="p-3 bg-cyan-400/20 hover:bg-cyan-400/30 rounded-lg transition-all group"
              >
                <PaperAirplaneIcon className="w-5 h-5 text-cyan-300 group-hover:text-cyan-400 transition-colors" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Chat Bubble */}
      <motion.button
        onClick={toggleChat}
        className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl w-16 h-16 flex items-center justify-center shadow-2xl focus:outline-none"
        variants={bubbleVariants}
        whileHover="hover"
        whileTap="tap"
      >
        {isOpen ? (
          <ArrowPathIcon className="w-8 h-8 text-white animate-spin" />
        ) : (
          <div className="relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
              <path d="M8 16l2-2-2-2M16 16l-2-2 2-2M12 18v-4"/>
            </svg>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
          </div>
        )}
      </motion.button>
    </div>
  );
};

export default ChatBot;
