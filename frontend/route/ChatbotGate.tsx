"use client";

import Chatbot from "@/components/Chatbot";
import { useAuth } from "@/contexts/AuthContext";

export default function ChatbotGate() {
    const { user, loading } = useAuth();

    if (loading) return null;

    if (!user || user.role !== "user") return null;

    return <Chatbot />;
}