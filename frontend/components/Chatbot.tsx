"use client";

import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Bot, User, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function Chatbot() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize with a welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content: `Hi ${user ? user.firstName : ""}! Welcome to iStore Customer Support. I am your AI assistant. I can help you search products, manage your wishlist, checkout products, and track orders.`
        }
      ]);
    }
  }, [user, messages.length]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMessage = textToSend.trim();
    setInput("");

    const newMessages = [
      ...messages,
      { role: "user", content: userMessage } as Message
    ];

    setMessages(newMessages);
    setIsLoading(true);

    try {
      const historyPayload = newMessages.slice(1, -1);

      const response = await api.post("/agent/chat", {
        message: userMessage,
        history: historyPayload
      });

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response.data.response }
      ]);
    } catch (error: any) {
      const status = error.response?.status;
      const detail = error.response?.data?.detail;
      let errorMsg =
        "Sorry, I couldn't reach the agent server. Please make sure the backend is running on port 8000.";

      if (status === 429) {
        errorMsg =
          "The AI service is temporarily rate-limited. Please wait a few minutes and try again.";
      } else if (typeof detail === "string") {
        errorMsg = detail.startsWith("Agent Error:")
          ? detail.replace(/^Agent Error:\s*/, "")
          : detail;
      } else if (detail) {
        errorMsg = JSON.stringify(detail);
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `⚠️ ${errorMsg}` }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend(input);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-[380px] h-[550px] max-h-[85vh] bg-white/95 backdrop-blur-xl border border-black/5 rounded-3xl shadow-2xl overflow-hidden flex flex-col mb-4"
          >
            {/* Header */}
            <div className="bg-black text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
                  <Bot size={18} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm leading-none text-white/90">
                    iStore AI Assistant
                  </h3>
                  <span className="text-[11px] text-white/60">
                    Multi-agent System
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50/50">
              {messages.map((msg, index) => {
                const isAssistant = msg.role === "assistant";

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-start gap-2.5 ${
                      isAssistant ? "justify-start" : "justify-end"
                    }`}
                  >
                    {isAssistant && (
                      <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center mt-0.5">
                        <Bot size={14} className="text-white" />
                      </div>
                    )}

                    <div
                      className={`max-w-[75%] px-4 py-3 rounded-2xl text-xs leading-relaxed ${
                        isAssistant
                          ? "bg-white text-black border border-black/5 shadow-sm rounded-tl-sm whitespace-pre-wrap"
                          : "bg-black text-white rounded-tr-sm shadow-sm"
                      }`}
                    >
                      {isAssistant ? (
                        <div className="prose prose-sm prose-p:leading-relaxed prose-pre:bg-gray-100 prose-pre:text-black prose-pre:p-2 prose-pre:rounded-md max-w-none text-xs">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {msg.content}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        msg.content
                      )}
                    </div>

                    {!isAssistant && (
                      <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center mt-0.5 border border-black/5">
                        <User size={14} className="text-black" />
                      </div>
                    )}
                  </motion.div>
                );
              })}

              {isLoading && (
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
                    <Bot size={14} className="text-white" />
                  </div>

                  <div className="bg-white px-4 py-3 border border-black/5 rounded-2xl rounded-tl-sm flex items-center gap-2">
                    <Loader2 size={14} className="animate-spin" />
                    <span className="text-xs text-black/50">
                      Agent is thinking...
                    </span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-black/5 flex items-center gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything about iStore products..."
                disabled={isLoading}
                className="flex-1 px-4 py-2.5 bg-black/5 rounded-2xl text-xs outline-none text-black disabled:opacity-50"
              />

              <button
                onClick={() => handleSend(input)}
                disabled={!input.trim() || isLoading}
                className="w-9 h-9 rounded-2xl bg-black text-white flex items-center justify-center disabled:opacity-30"
              >
                <Send size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 rounded-full bg-black text-white flex items-center justify-center shadow-2xl"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X size={20} />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
            >
              <MessageSquare size={20} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}