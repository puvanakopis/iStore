"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import {
  Camera,
  Cpu,
  ShieldCheck,
  Zap,
  ArrowRight,
  Play,
  X,
  Layers,
} from "lucide-react";

const HIGHLIGHTS = [
  {
    id: "camera",
    icon: Camera,
    tag: "48MP Fusion Camera",
    title: "Cinematic 4K 120 fps",
    description:
      "Capture insanely sharp 4K 120 fps Dolby Vision video with standard studio-grade color grading options.",
    image: "/iPhone_04.png",
    accent: "from-amber-500/20 via-orange-500/10 to-transparent",
    glowColor: "rgba(245, 158, 11, 0.25)",
  },
  {
    id: "chip",
    icon: Cpu,
    tag: "A18 Pro Chipset",
    title: "Next-Gen Pro Speed",
    description:
      "Powered by 3-nanometer architecture with a 6-core GPU driving hardware-accelerated ray tracing.",
    image: "/iPhone_01.png",
    accent: "from-cyan-500/20 via-blue-500/10 to-transparent",
    glowColor: "rgba(6, 182, 212, 0.25)",
  },
  {
    id: "titanium",
    icon: ShieldCheck,
    tag: "Grade 5 Titanium",
    title: "Lightweight Strength",
    description:
      "Crafted with space-grade titanium enclosure featuring refined micro-blasted textures.",
    image: "/iPhone_02.png",
    accent: "from-amber-200/20 via-stone-400/10 to-transparent",
    glowColor: "rgba(217, 119, 6, 0.2)",
  },
  {
    id: "battery",
    icon: Zap,
    tag: "Battery & Power",
    title: "Up to 29 Hours",
    description:
      "Engineered for maximum energy efficiency, keeping up with your longest creation sessions.",
    image: "/iPhone_05.png",
    accent: "from-emerald-500/20 via-teal-500/10 to-transparent",
    glowColor: "rgba(16, 185, 129, 0.25)",
  },
];

export default function LifestyleBanner() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeHighlight, setActiveHighlight] = useState(HIGHLIGHTS[0]);
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  // Scroll animations
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const bgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 0.96]);
  const bgY = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0.6, 1, 1, 0.7]);

  // 3D Parallax Mouse Physics
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 100, damping: 20 });
  const mouseY = useSpring(y, { stiffness: 100, damping: 20 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], [5, -5]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-5, 5]);
  const parallaxX = useTransform(mouseX, [-0.5, 0.5], [-12, 12]);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mouseXPos = (e.clientX - rect.left) / rect.width - 0.5;
    const mouseYPos = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(mouseXPos);
    y.set(mouseYPos);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <section className="relative w-full bg-white overflow-hidden py-12 md:py-20 flex items-center justify-center">
      <div className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 md:px-12">
        {/* Main Banner Card Container */}
        <motion.div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ opacity }}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full min-h-[580px] md:h-[calc(100vh-10rem)] md:min-h-[640px] md:max-h-[720px] flex flex-col justify-between rounded-[36px] overflow-hidden group bg-black shadow-2xl border border-white/10 transition-all duration-700"
        >
          {/* Ambient Dynamic Background Light Orb */}
          <motion.div
            className="absolute inset-0 pointer-events-none z-0 transition-all duration-1000"
            animate={{
              background: `radial-gradient(800px circle at 50% 50%, ${activeHighlight.glowColor}, transparent 70%)`,
            }}
          />

          {/* Background Image with Scroll & 3D Tilt Parallax */}
          <motion.div
            style={{
              scale: bgScale,
              y: bgY,
              rotateX,
              rotateY,
              x: parallaxX,
            }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="absolute inset-0 z-0 origin-center transition-transform duration-200 ease-out"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeHighlight.id}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 0.85, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full h-full"
              >
                <Image
                  src={activeHighlight.image}
                  alt={activeHighlight.title}
                  fill
                  className="object-contain md:object-cover object-center filter brightness-[0.9] contrast-[1.05]"
                  priority
                />
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Accent Overlay */}
          <div
            className={`absolute inset-0 z-10 bg-gradient-to-tr ${activeHighlight.accent} opacity-60 pointer-events-none transition-all duration-700`}
          />

          {/* Vignette Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/30 z-10 pointer-events-none" />

          {/* Top Header & Interactive Feature Tabs */}
          <div className="relative z-20 pt-8 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-4">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white/90 text-sm font-medium shadow-lg"
            >
              <span>iPhone 16 Pro Showcase</span>
            </motion.div>

            {/* Interactive Feature Tabs */}
            <div className="flex items-center gap-2 p-1.5 rounded-full bg-black/50 backdrop-blur-xl border border-white/15 overflow-x-auto max-w-full">
              {HIGHLIGHTS.map((item) => {
                const Icon = item.icon;
                const isActive = activeHighlight.id === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveHighlight(item)}
                    className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-300 ${
                      isActive
                        ? "text-black font-semibold shadow-md"
                        : "text-white/70 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTabBg"
                        className="absolute inset-0 bg-white rounded-full z-0"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <Icon className={`w-3.5 h-3.5 relative z-10 ${isActive ? "text-black" : "text-white/80"}`} />
                    <span className="relative z-10 whitespace-nowrap">{item.tag}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Content Overlay */}
          <div className="relative flex-1 flex flex-col justify-end p-6 md:p-12 lg:p-14 z-20 py-4 md:py-6 my-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeHighlight.id}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="max-w-3xl"
              >
                {/* Tag Pill */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-amber-300 text-xs font-semibold uppercase tracking-wider mb-4 border border-white/15">
                  {activeHighlight.tag}
                </div>

                {/* Hero Title */}
                <h2 className="text-[34px] sm:text-[48px] md:text-[64px] lg:text-[72px] font-bold text-white tracking-tight leading-[1.05] mb-4 drop-shadow-md">
                  <span className="bg-gradient-to-r from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
                    {activeHighlight.title}
                  </span>
                </h2>

                {/* Description */}
                <p className="text-[15px] sm:text-[17px] md:text-[19px] text-white/85 font-light leading-relaxed mb-8 max-w-2xl">
                  {activeHighlight.description}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                  <Link href="/shop">
                    <button className="group relative px-8 py-4 bg-white text-black rounded-full font-bold text-[16px] md:text-[17px] shadow-xl hover:bg-zinc-100 transition-all duration-300 active:scale-95 flex items-center gap-3 overflow-hidden">
                      <span className="relative z-10">Explore Pro</span>
                      <ArrowRight className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover:translate-x-1.5" />
                    </button>
                  </Link>

                  <button
                    onClick={() => setIsVideoOpen(true)}
                    className="group px-7 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 text-white rounded-full font-semibold text-[16px] transition-all duration-300 active:scale-95 flex items-center gap-3"
                  >
                    <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors duration-300">
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    </div>
                    <span>Watch Film</span>
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom Bar Feature Specs */}
          <div className="relative z-20 px-8 md:px-14 py-5 bg-black/60 backdrop-blur-md border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs md:text-sm text-white/60">
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Available in 4 Titanium Finishes
              </span>
            </div>
            <div className="flex items-center gap-2 text-white/80 font-medium">
              <Layers className="w-4 h-4 text-amber-400" />
              <span>Super Retina XDR Display with ProMotion</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Trailer Video Showcase Modal */}
      <AnimatePresence>
        {isVideoOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-2xl"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative w-full max-w-5xl bg-zinc-900 rounded-3xl overflow-hidden border border-white/15 shadow-2xl"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/40">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="ml-2 text-sm font-semibold text-white/80">
                    iPhone 16 Pro — Official Trailer
                  </span>
                </div>
                <button
                  onClick={() => setIsVideoOpen(false)}
                  className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Video Frame */}
              <div className="relative aspect-video w-full bg-black flex items-center justify-center">
                <iframe
                  src="https://www.youtube.com/embed/LAadH7SVEFo?autoplay=1&rel=0"
                  title="iPhone 16 Pro — Official Trailer"
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
