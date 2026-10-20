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
  Mic,
  MicOff,
  Volume2,
  VolumeX,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Cookies from "js-cookie";
import { useAuth } from "../contexts/AuthContext";
import ChatMarkdown from "./ChatMarkdown";

interface Message {
  role: "user" | "assistant";
  content: string;
}

// Clean markdown syntax so speech synthesis reads naturally
function cleanMarkdownForSpeech(text: string): string {
  return text
    .replace(/!\[.*?\]\(.*?\)/g, "") // images
    .replace(/\[(.*?)\]\(.*?\)/g, "$1") // link text only
    .replace(/`{1,3}[^`]*`{1,3}/g, "") // inline/block code
    .replace(/[#*_~>]/g, "") // markdown formatting
    .replace(/\n+/g, ". ") // linebreaks into pauses
    .trim();
}

export default function Chatbot() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [agentStatus, setAgentStatus] = useState<string>("");

  // Voice Commerce States
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(false);
  const recognitionRef = useRef<any>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [groqKey, setGroqKey] = useState("");
  const [showGroqKey, setShowGroqKey] = useState(false);

  // Check speech recognition support, load saved preferences, and clean up on unmount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRec =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      if (SpeechRec) {
        setSpeechSupported(true);
      }
      const savedKey = localStorage.getItem("groq_api_key");
      if (savedKey) {
        setGroqKey(savedKey);
      }
      const savedTts = localStorage.getItem("istore_voice_tts");
      if (savedTts === "true") {
        setSpeechEnabled(true);
      }
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore error if already stopped
        }
      }
      if (typeof window !== "undefined") {
        window.speechSynthesis?.cancel();
      }
    };
  }, []);

  // Initialize with a welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const greeting = user?.first_name ? `Hi ${user.first_name}!` : "Hi!";
      setMessages([
        {
          role: "assistant",
          content: `${greeting} Welcome to iStore Customer Support. I am your AI assistant. You can speak or type to browse products, check specifications, manage your wishlist, or place orders.`,
        },
      ]);
    }
  }, [user, messages.length]);

  // Scroll to bottom on new messages or during streaming
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, agentStatus]);

  // Voice-to-Chat: Toggle Microphone
  const toggleListening = () => {
    if (!speechSupported) {
      alert("Voice recognition is not supported in this browser. Please use Chrome, Edge, or Safari.");
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    try {
      const SpeechRec =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRec();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = "";
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setInput(currentTranscript);
      };

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition notice:", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.error("Failed to start speech recognition", e);
      setIsListening(false);
    }
  };

  // Speak assistant response aloud
  const speakText = (text: string) => {
    if (!speechEnabled || typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }
    try {
      window.speechSynthesis.cancel();
      const cleaned = cleanMarkdownForSpeech(text);
      if (!cleaned) return;
      const utterance = new SpeechSynthesisUtterance(cleaned);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error("Speech synthesis failed", e);
    }
  };

  // Stream send handler using Server-Sent Events (SSE)
  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    const userMessage = textToSend.trim();
    setInput("");

    // Add user message and blank assistant message to be filled by stream
    const updatedHistory = [
      ...messages,
      { role: "user", content: userMessage } as Message,
      { role: "assistant", content: "" } as Message,
    ];

    setMessages(updatedHistory);
    setIsLoading(true);
    setAgentStatus("Connecting to assistant...");

    try {
      const historyPayload = messages
        .slice(1)
        .filter((m) => m.content && !m.content.startsWith("⚠️"));
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const token = Cookies.get("token");

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) headers["Authorization"] = `Bearer ${token}`;
      if (groqKey && groqKey.trim()) headers["X-Groq-Api-Key"] = groqKey.trim();

      const response = await fetch(`${baseUrl}/agent/chat/stream`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          message: userMessage,
          history: historyPayload,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const detail = errorData.detail || "Server error";
        throw new Error(detail);
      }

      if (!response.body) {
        throw new Error("No response body received from server");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let accumulatedText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split("\n\n");
        buffer = events.pop() || "";

        for (const evt of events) {
          const line = evt.trim();
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.replace(/^data:\s*/, "");
          try {
            const data = JSON.parse(jsonStr);

            if (data.type === "token") {
              setAgentStatus("");
              accumulatedText += data.content;
              setMessages((prev) => {
                const next = [...prev];
                next[next.length - 1] = {
                  role: "assistant",
                  content: accumulatedText,
                };
                return next;
              });
            } else if (data.type === "status") {
              setAgentStatus(data.content);
            } else if (data.type === "error") {
              accumulatedText = `⚠️ ${data.content}`;
              setMessages((prev) => {
                const next = [...prev];
                next[next.length - 1] = {
                  role: "assistant",
                  content: accumulatedText,
                };
                return next;
              });
            } else if (data.type === "done") {
              setAgentStatus("");
            }
          } catch {
            // ignore partial json
          }
        }
      }

      // Voice output if enabled
      if (accumulatedText && !accumulatedText.startsWith("⚠️")) {
        speakText(accumulatedText);
      }
    } catch (error: any) {
      const errorMsg =
        error.message ||
        "Sorry, I couldn't reach the agent server. Please ensure the backend is running.";

      setMessages((prev) => {
        const next = [...prev];
        next[next.length - 1] = {
          role: "assistant",
          content: `⚠️ ${errorMsg}`,
        };
        return next;
      });
    } finally {
      setIsLoading(false);
      setAgentStatus("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
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
            className="w-[410px] sm:w-[440px] max-w-[calc(100vw-2rem)] h-[600px] max-h-[86vh] bg-white/95 backdrop-blur-xl border border-black/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col mb-4 relative"
          >
            {/* Header */}
            <div className="bg-black text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/15">
                  <Bot size={18} className="text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-semibold text-sm leading-none text-white/95">
                      iStore AI Assistant
                    </h3>
                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] bg-emerald-500/20 text-emerald-400 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      Live
                    </span>
                  </div>
                  <span className="text-[11px] text-white/60">
                    Voice & Streaming Multi-Agent
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Voice Output Speaker Toggle */}
                <button
                  type="button"
                  onClick={() => {
                    const next = !speechEnabled;
                    setSpeechEnabled(next);
                    localStorage.setItem("istore_voice_tts", String(next));
                    if (!next && typeof window !== "undefined") {
                      window.speechSynthesis?.cancel();
                    }
                  }}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                    speechEnabled
                      ? "bg-white text-black shadow-sm"
                      : "bg-white/10 hover:bg-white/20 text-white/80"
                  }`}
                  title={
                    speechEnabled
                      ? "Voice speech output active (click to mute)"
                      : "Enable voice speech output"
                  }
                >
                  {speechEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
                </button>

                {/* Close Button */}
                <button
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      window.speechSynthesis?.cancel();
                    }
                    setIsOpen(false);
                  }}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Integrated GROQ API KEY Input Banner */}
            <div className="bg-gray-100/90 border-b border-black/5 px-4 py-2 flex items-center gap-2">
              <span className="text-[10px] font-semibold text-black/60 shrink-0">
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
                  placeholder="Enter gsk_... (or leave blank to use backend key)"
                  className="w-full bg-white border border-black/10 rounded-xl pl-3 pr-8 py-1.5 text-[11px] outline-none focus:border-black transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowGroqKey(!showGroqKey)}
                  className="absolute right-2 text-black/50 hover:text-black transition-colors p-1"
                  title={showGroqKey ? "Hide Key" : "Show Key"}
                >
                  {showGroqKey ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-gray-50/50">
              {messages.map((msg, index) => {
                const isAssistant = msg.role === "assistant";
                if (isAssistant && !msg.content && isLoading && index === messages.length - 1) {
                  return null; // Don't render empty container until tokens arrive
                }

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-start gap-2.5 ${
                      isAssistant ? "justify-start" : "justify-end"
                    }`}
                  >
                    {isAssistant && (
                      <div className="w-7 h-7 rounded-full bg-black flex items-center justify-center mt-0.5 shrink-0">
                        <Bot size={13} className="text-white" />
                      </div>
                    )}

                    <div
                      className={`px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                        isAssistant
                          ? "max-w-[85%] bg-white text-neutral-900 border border-black/10 shadow-sm rounded-tl-sm break-words overflow-hidden"
                          : "max-w-[80%] bg-black text-white rounded-tr-sm shadow-sm whitespace-pre-wrap break-words"
                      }`}
                    >
                      {isAssistant ? (
                        <ChatMarkdown content={msg.content} />
                      ) : (
                        msg.content
                      )}
                    </div>

                    {!isAssistant && (
                      <div className="w-7 h-7 rounded-full bg-black/5 flex items-center justify-center mt-0.5 border border-black/5 shrink-0">
                        <User size={13} className="text-black" />
                      </div>
                    )}
                  </motion.div>
                );
              })}

              {/* Live Status indicator when agent or tool is working */}
              {(isLoading || agentStatus) && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-xs text-black/60 pl-9"
                >
                  <Loader2 size={13} className="animate-spin text-black" />
                  <span className="italic text-[11px]">
                    {agentStatus || "Generating response..."}
                  </span>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Voice Listening Waveform Banner */}
            <AnimatePresence>
              {isListening && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-4 py-2 bg-gradient-to-r from-red-50 to-rose-100 border-t border-red-200 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                    </span>
                    <span className="text-[11px] font-medium text-red-700">
                      Listening to your voice... Speak now
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-1 h-3 bg-red-500 rounded-full animate-bounce"></span>
                    <span className="w-1 h-5 bg-red-500 rounded-full animate-bounce delay-75"></span>
                    <span className="w-1 h-2 bg-red-500 rounded-full animate-bounce delay-150"></span>
                    <span className="w-1 h-4 bg-red-500 rounded-full animate-bounce delay-100"></span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input Bar */}
            <div className="p-3 bg-white border-t border-black/5 flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  isListening
                    ? "Listening to voice input..."
                    : "Ask or speak about products, specs, orders..."
                }
                disabled={isLoading}
                className="flex-1 px-4 py-2.5 bg-black/5 rounded-2xl text-xs outline-none text-black disabled:opacity-50 placeholder:text-black/40"
              />

              {/* Microphone Voice Button */}
              {speechSupported && (
                <button
                  type="button"
                  onClick={toggleListening}
                  disabled={isLoading}
                  className={`w-9 h-9 rounded-2xl flex items-center justify-center transition-all ${
                    isListening
                      ? "bg-red-500 text-white shadow-md shadow-red-500/40 animate-pulse"
                      : "bg-black/5 hover:bg-black/10 text-black/70 hover:text-black"
                  }`}
                  title={isListening ? "Stop listening" : "Click to speak (Voice-to-Chat)"}
                >
                  {isListening ? <MicOff size={15} /> : <Mic size={15} />}
                </button>
              )}

              {/* Send Button */}
              <button
                type="button"
                onClick={() => handleSend(input)}
                disabled={!input.trim() || isLoading}
                className="w-9 h-9 rounded-2xl bg-black text-white flex items-center justify-center disabled:opacity-30 hover:bg-black/85 transition-colors shadow-sm"
              >
                <Send size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Chatbot Launch Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 rounded-full bg-black text-white flex items-center justify-center shadow-2xl relative group"
        title="Chat with iStore AI Assistant"
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
              className="relative"
            >
              <MessageSquare size={20} />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-black animate-pulse"></span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}