"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  MessageSquare,
  X,
  Send,
  Bot,
  User,
  Loader2,
  Eye,
  EyeOff,
  RotateCcw,
} from "lucide-react";
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
  const [groqKey, setGroqKey] = useState("");
  const [showGroqKey, setShowGroqKey] = useState(false);

  // Load Groq API Key from localStorage
  useEffect(() => {
    const savedKey = localStorage.getItem("groq_api_key");
    if (savedKey) {
      setGroqKey(savedKey);
    }
  }, []);

  const getWelcomeMessage = (): Message => ({
    role: "assistant",
    content: `Hi ${user ? user.first_name : "there"
      }! Welcome to iStore Customer Support. \n\nI can help you search products, manage your wishlist, track orders, or place a new purchase. How can I help you today?`,
  });

  // Initialize welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([getWelcomeMessage()]);
    }
  }, [user, messages.length]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const resetChat = () => {
    setMessages([getWelcomeMessage()]);
  };

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMessage = textToSend.trim();
    setInput("");

    const newMessages: Message[] = [
      ...messages,
      { role: "user", content: userMessage },
    ];

    setMessages(newMessages);
    setIsLoading(true);

    try {
      const historyPayload = newMessages.slice(1, -1);

      const headers: Record<string, string> = {};
      if (groqKey && groqKey.trim()) {
        headers["X-Groq-Api-Key"] = groqKey.trim();
      }

      const response = await api.post(
        "/agent/chat",
        {
          message: userMessage,
          history: historyPayload,
        },
        { headers }
      );

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response.data.response },
      ]);
    } catch (error: any) {
      const status = error.response?.status;
      const detail = error.response?.data?.detail;
      let errorMsg = "";

      if (status === 429) {
        errorMsg =
          "The AI service is temporarily rate-limited. Please wait a few minutes and try again.";
      } else if (typeof detail === "string") {
        errorMsg = detail.startsWith("Agent Error:")
          ? detail.replace(/^Agent Error:\s*/, "")
          : detail;
      } else if (detail) {
        errorMsg = JSON.stringify(detail);
      } else {
        errorMsg =
          "Sorry, I couldn't reach the agent server. Please make sure the backend is running on port 8000.";
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `⚠️ ${errorMsg}` },
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

  // Custom Code Badge & Markdown Renderer
  const markdownComponents = {
    code({ node, inline, className, children, ...props }: any) {
      const text = String(children).replace(/\n$/, "");
      const cleanText = text.trim();

      // Status badges
      if (cleanText === "Confirmed" || cleanText === "Delivered" || cleanText === "Paid") {
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            ● {cleanText}
          </span>
        );
      }
      if (cleanText === "Pending") {
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            ● {cleanText}
          </span>
        );
      }
      if (cleanText === "Cancelled") {
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-semibold bg-rose-100 text-rose-800 border border-rose-200">
            ● {cleanText}
          </span>
        );
      }

      // Product or Order ID badge
      if (cleanText.startsWith("product_") || cleanText.startsWith("order_") || /^[0-9a-fA-F]{24}$/.test(cleanText)) {
        return (
          <code className="inline-block px-1.5 py-0.5 text-[11px] font-mono font-medium bg-gray-100 text-gray-800 rounded border border-gray-200" {...props}>
            {children}
          </code>
        );
      }

      return (
        <code className="inline-block px-1 py-0.5 text-[11px] font-mono bg-black/5 rounded text-black/80" {...props}>
          {children}
        </code>
      );
    },
    table({ children }: any) {
      return (
        <div className="overflow-x-auto my-3 border border-black/10 rounded-xl">
          <table className="min-w-full divide-y divide-black/10 text-xs">{children}</table>
        </div>
      );
    },
    thead({ children }: any) {
      return <thead className="bg-gray-100 text-black/80 font-semibold">{children}</thead>;
    },
    th({ children }: any) {
      return <th className="px-3 py-2 text-left text-[11px] uppercase tracking-wider">{children}</th>;
    },
    td({ children }: any) {
      return <td className="px-3 py-2 border-t border-black/5 text-[11px] whitespace-normal">{children}</td>;
    },
    h2({ children }: any) {
      return <h2 className="text-xs font-bold text-black uppercase tracking-wider border-b border-black/10 pb-1 mt-3 mb-2 flex items-center gap-1.5">{children}</h2>;
    },
    h3({ children }: any) {
      return <h3 className="text-xs font-semibold text-black mt-2 mb-1">{children}</h3>;
    },
    ul({ children }: any) {
      return <ul className="list-disc pl-4 space-y-1 my-1.5 text-xs text-black/90">{children}</ul>;
    },
    ol({ children }: any) {
      return <ol className="list-decimal pl-4 space-y-1 my-1.5 text-xs text-black/90">{children}</ol>;
    },
    strong({ children }: any) {
      return <strong className="font-semibold text-black">{children}</strong>;
    },
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: "spring", damping: 26, stiffness: 320 }}
            className="w-[420px] h-[600px] max-w-[94vw] max-h-[85vh] bg-white/95 backdrop-blur-2xl border border-black/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col mb-4 relative"
          >
            {/* Header */}
            <div className="bg-black text-white px-5 py-4 flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/15">
                    <Bot size={20} className="text-white" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-black" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm leading-none text-white flex items-center gap-1.5">
                    iStore AI Assistant
                  </h3>
                  <span className="text-[11px] text-white/60">
                    Product • Order • Wishlist Agents
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={resetChat}
                  title="Clear Conversation"
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white/80 hover:text-white"
                >
                  <RotateCcw size={15} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Integrated GROQ API KEY Input Banner */}
            <div className="bg-gray-100/90 backdrop-blur-sm border-b border-black/5 px-4 py-2 flex items-center gap-2">
              <span className="text-[10px] font-bold tracking-wider text-black/60 shrink-0 uppercase">
                GROQ KEY:
              </span>
              <div className="relative flex-1 min-w-0 flex items-center">
                <input
                  type={showGroqKey ? "text" : "password"}
                  value={groqKey}
                  onChange={(e) => {
                    const val = e.target.value;
                    setGroqKey(val);
                    localStorage.setItem("groq_api_key", val);
                  }}
                  placeholder="Enter gsk_... (Optional override)"
                  className="w-full bg-white border border-black/10 rounded-xl pl-3 pr-8 py-1 text-[11px] outline-none focus:border-black transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowGroqKey(!showGroqKey)}
                  className="absolute right-2 text-black/40 hover:text-black transition-colors p-1"
                  title={showGroqKey ? "Hide Key" : "Show Key"}
                >
                  {showGroqKey ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/60 scrollbar-thin scrollbar-thumb-black/10">
              {messages.map((msg, index) => {
                const isAssistant = msg.role === "assistant";

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-start gap-2.5 ${isAssistant ? "justify-start" : "justify-end"
                      }`}
                  >
                    {isAssistant && (
                      <div className="w-8 h-8 rounded-2xl bg-black flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                        <Bot size={15} className="text-white" />
                      </div>
                    )}

                    <div
                      className={`max-w-[88%] px-4 py-3 rounded-2xl text-[13px] leading-relaxed ${isAssistant
                          ? "bg-white text-black/90 border border-black/5 shadow-sm rounded-tl-xs"
                          : "bg-black text-white rounded-tr-xs shadow-sm"
                        }`}
                    >
                      {isAssistant ? (
                        <div className="prose prose-sm prose-p:leading-relaxed max-w-none text-[13px] text-black/90">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={markdownComponents}
                          >
                            {msg.content}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <span className="whitespace-pre-wrap">{msg.content}</span>
                      )}
                    </div>

                    {!isAssistant && (
                      <div className="w-8 h-8 rounded-2xl bg-black/5 flex items-center justify-center shrink-0 mt-0.5 border border-black/5">
                        <User size={15} className="text-black" />
                      </div>
                    )}
                  </motion.div>
                );
              })}

              {isLoading && (
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-2xl bg-black flex items-center justify-center shrink-0 shadow-sm">
                    <Bot size={15} className="text-white" />
                  </div>

                  <div className="bg-white px-4 py-3 border border-black/5 rounded-2xl rounded-tl-xs flex items-center gap-2.5 shadow-sm">
                    <Loader2 size={15} className="animate-spin text-black/70" />
                    <span className="text-xs font-medium text-black/60">
                      Agents are processing your request...
                    </span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>


            {/* Input Bar */}
            <div className="p-3.5 bg-white border-t border-black/5 flex items-center gap-2.5">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about products, orders, or wishlist..."
                disabled={isLoading}
                className="flex-1 px-4 py-2.5 bg-black/5 rounded-2xl text-xs outline-none text-black placeholder:text-black/40 focus:bg-black/[0.07] transition-all disabled:opacity-50"
              />

              <button
                onClick={() => handleSend(input)}
                disabled={!input.trim() || isLoading}
                className="w-9 h-9 rounded-2xl bg-black hover:bg-black/90 text-white flex items-center justify-center transition-transform active:scale-95 disabled:opacity-30 shrink-0 shadow-sm"
              >
                <Send size={15} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        className="w-14 h-14 rounded-full bg-black text-white flex items-center justify-center shadow-2xl border border-white/10 relative"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X size={22} />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              className="relative"
            >
              <MessageSquare size={22} />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-black" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}