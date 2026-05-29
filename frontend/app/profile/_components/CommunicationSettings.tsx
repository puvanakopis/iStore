"use client";

import { motion } from "framer-motion";
import { Bell, Mail, Smartphone } from "lucide-react";
import { useState } from "react";

interface ToggleProps {
  label: string;
  description: string;
  enabled: boolean;
  onChange: (val: boolean) => void;
  icon: any;
}

function Toggle({ label, description, enabled, onChange, icon: Icon }: ToggleProps) {
  return (
    <div className="flex items-center justify-between py-4 group">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-black/5 flex items-center justify-center text-black group-hover:bg-black group-hover:text-white transition-colors duration-300">
          <Icon size={18} />
        </div>
        <div>
          <h4 className="text-sm font-bold tracking-tight">{label}</h4>
          <p className="text-[13px] text-foreground-secondary font-light">{description}</p>
        </div>
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative w-11 h-6 transition-colors duration-300 rounded-full ${
          enabled ? "bg-black" : "bg-border"
        }`}
      >
        <motion.div
          animate={{ x: enabled ? 22 : 2 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="w-5 h-5 bg-white rounded-full shadow-sm"
        />
      </button>
    </div>
  );
}

export default function CommunicationSettings() {
  const [settings, setSettings] = useState({
    email: true,
    push: false,
    sms: true,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white p-8 rounded-sm border border-border shadow-[0_4px_24px_rgba(0,0,0,0.02)]"
    >
      <header className="mb-8">
        <h3 className="text-lg font-bold tracking-tight">Communication</h3>
        <p className="text-sm text-foreground-secondary font-light">Preferences for updates and alerts</p>
      </header>

      <div className="divide-y divide-border/50">
        <Toggle
          icon={Mail}
          label="Email Notifications"
          description="Receive order updates and exclusive offers via email."
          enabled={settings.email}
          onChange={(val) => setSettings({ ...settings, email: val })}
        />
        <Toggle
          icon={Bell}
          label="Push Notifications"
          description="Instant alerts via web or mobile devices."
          enabled={settings.push}
          onChange={(val) => setSettings({ ...settings, push: val })}
        />
        <Toggle
          icon={Smartphone}
          label="SMS Updates"
          description="Text messages for critical account and shipping updates."
          enabled={settings.sms}
          onChange={(val) => setSettings({ ...settings, sms: val })}
        />
      </div>
    </motion.div>
  );
}
