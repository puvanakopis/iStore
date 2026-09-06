"use client";

import { useState, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Cpu,
  Camera,
  ShieldCheck,
  ArrowRight,
  ChevronDown,
  Zap,
} from "lucide-react";

const FINISHES = [
  {
    id: "black",
    name: "Black Titanium",
    image: "/iPhone 16 Pro Black Titanium.png",
    color: "#313236",
    accent: "from-zinc-400/15 via-zinc-800/10 to-transparent",
    bgGlow: "rgba(49, 50, 54, 0.2)",
  },
  {
    id: "natural",
    name: "Natural Titanium",
    image: "/iPhone 16 Pro Natural Titanium.png",
    color: "#9A958E",
    accent: "from-amber-200/20 via-orange-100/10 to-transparent",
    bgGlow: "rgba(154, 149, 142, 0.22)",
  },
  {
    id: "desert",
    name: "Desert Titanium",
    image: "/iPhone 16 Pro Desert Titanium.png",
    color: "#CBA386",
    accent: "from-amber-400/20 via-orange-200/10 to-transparent",
    bgGlow: "rgba(203, 163, 134, 0.25)",
  },
  {
    id: "white",
    name: "White Titanium",
    image: "/iPhone 16 Pro White Titanium.png",
    color: "#E3E4E5",
    accent: "from-blue-100/20 via-slate-100/10 to-transparent",
    bgGlow: "rgba(227, 228, 229, 0.3)",
  },
];

const SPECS = [
  { icon: Cpu, label: "A18 Pro Chip", sub: "3nm Architecture" },
  { icon: Camera, label: "48MP Fusion", sub: "4K 120 fps Dolby" },
  { icon: ShieldCheck, label: "Grade 5 Titanium", sub: "Ultralight & Strong" },
  { icon: Zap, label: "Apple Intelligence", sub: "Personal & Private" },
];

export default function Hero() {
  const [selectedFinish, setSelectedFinish] = useState(FINISHES[0]);
  const sectionRef = useRef<HTMLElement>(null);

  // Scroll animations
  const { scrollY } = useScroll();
  const imageY = useTransform(scrollY, [0, 600], [0, 80]);
  const heroScale = useTransform(scrollY, [0, 450], [1, 0.98]);
  const indicatorOpacity = useTransform(scrollY, [0, 120], [1, 0]);
  const indicatorY = useTransform(scrollY, [0, 120], [0, 15]);

  // 3D Parallax Mouse Physics
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 120, damping: 18 });
  const mouseY = useSpring(y, { stiffness: 120, damping: 18 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-8, 8]);
  const parallaxX = useTransform(mouseX, [-0.5, 0.5], [-12, 12]);
  const parallaxY = useTransform(mouseY, [-0.5, 0.5], [-12, 12]);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseXPos = (e.clientX - rect.left) / rect.width - 0.5;
    const mouseYPos = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(mouseXPos);
    y.set(mouseYPos);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  function handleScrollDown() {
    if (sectionRef.current) {
      const nextSection = sectionRef.current.nextElementSibling;
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: "smooth" });
      } else {
        window.scrollTo({
          top: sectionRef.current.offsetHeight,
          behavior: "smooth",
        });
      }
    }
  }

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[92vh] md:min-h-screen w-full bg-white overflow-hidden flex flex-col items-center justify-between pt-20 md:pt-28 pb-12 px-4 sm:px-6 md:px-12 select-none"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Dynamic Animated Background Aura */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.35, 0.55, 0.35],
            rotate: [0, 10, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[700px] sm:w-[900px] md:w-[1100px] h-[500px] sm:h-[650px] rounded-full blur-[140px] transition-colors duration-1000"
          style={{
            background: `radial-gradient(circle, ${selectedFinish.bgGlow} 0%, rgba(255,255,255,0) 70%)`,
          }}
        />

        {/* Ambient Subtle Grid Lines */}
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:32px_32px] opacity-40" />
      </div>

      {/* Main Container */}
      <motion.div
        style={{ scale: heroScale }}
        className="relative z-10 max-w-7xl mx-auto w-full flex flex-col items-center text-center my-auto"
      >
        {/* Header Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center"
        >

          {/* Main Title */}
          <h1 className="text-[44px] sm:text-[68px] md:text-[96px] lg:text-[104px] font-bold leading-[0.98] tracking-tight mb-6 text-black">
            iPhone 16 Pro
          </h1>

          {/* Subtitle with Gradient Accent */}
          <p className="text-[18px] sm:text-[22px] md:text-[24px] font-light text-foreground-secondary max-w-2xl mx-auto mb-8 tracking-tight leading-relaxed">
            Built for{" "}
            <span className="font-semibold bg-gradient-to-r from-black via-zinc-700 to-black bg-clip-text text-transparent underline decoration-black/15 underline-offset-4">
              Apple Intelligence
            </span>
            . Crafted in Grade 5 titanium.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-10">
            <Link href="/shop" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="relative overflow-hidden w-full sm:w-auto apple-button-primary rounded-full group flex items-center justify-center gap-2 shadow-lg shadow-black/10"
              >
                <span>Buy from Rs. 99,900</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </motion.button>
            </Link>

            <Link href="/products" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full sm:w-auto apple-button-outline rounded-full flex items-center justify-center gap-2"
              >
                <span>Learn more</span>
              </motion.button>
            </Link>
          </div>

          {/* Finish Color Switcher Selector */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col items-center gap-3 mb-8"
          >
            <div className="flex items-center gap-3 p-1.5 rounded-full bg-black/[0.04] border border-black/[0.08] backdrop-blur-md">
              {FINISHES.map((finish) => {
                const isSelected = selectedFinish.id === finish.id;
                return (
                  <button
                    key={finish.id}
                    onClick={() => setSelectedFinish(finish)}
                    aria-label={`Select ${finish.name}`}
                    className="relative p-1.5 rounded-full transition-all focus:outline-none"
                  >
                    {isSelected && (
                      <motion.div
                        layoutId="finishRing"
                        className="absolute inset-0 rounded-full border-2 border-black/80"
                        transition={{ type: "spring", stiffness: 350, damping: 25 }}
                      />
                    )}
                    <span
                      className="block w-6 h-6 rounded-full shadow-inner border border-black/10 transition-transform duration-300 hover:scale-110"
                      style={{ backgroundColor: finish.color }}
                    />
                  </button>
                );
              })}
            </div>
            <motion.span
              key={selectedFinish.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-[13px] font-medium text-black/70 tracking-wide"
            >
              Finish: <span className="text-black font-semibold">{selectedFinish.name}</span>
            </motion.span>
          </motion.div>
        </motion.div>

        {/* 3D Interactive Floating Product Showcase Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{
            y: imageY,
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
          className="relative w-full max-w-[850px] h-[360px] sm:h-[460px] md:h-[540px] flex items-center justify-center cursor-grab active:cursor-grabbing"
        >
          {/* Floating Spec Badges around Device */}
          <div className="absolute inset-0 pointer-events-none hidden md:block z-30">
            {/* Top Left Spec Badge */}
            <motion.div
              style={{ x: parallaxX, y: parallaxY }}
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-12 left-4 lg:left-0 pointer-events-auto bg-white/85 backdrop-blur-xl border border-black/10 px-4 py-3 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-black/5 flex items-center justify-center text-black group-hover:bg-black group-hover:text-white transition-colors duration-300">
                  <Cpu className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="text-[13px] font-bold text-black">A18 Pro Chip</div>
                  <div className="text-[11px] text-black/60 font-medium">3nm Architecture</div>
                </div>
              </div>
            </motion.div>

            {/* Top Right Spec Badge */}
            <motion.div
              style={{ x: parallaxX, y: parallaxY }}
              animate={{ y: [6, -6, 6] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute top-16 right-4 lg:right-0 pointer-events-auto bg-white/85 backdrop-blur-xl border border-black/10 px-4 py-3 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-black/5 flex items-center justify-center text-black group-hover:bg-black group-hover:text-white transition-colors duration-300">
                  <Camera className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="text-[13px] font-bold text-black">48MP Fusion</div>
                  <div className="text-[11px] text-black/60 font-medium">4K 120 fps Dolby</div>
                </div>
              </div>
            </motion.div>

            {/* Bottom Left Spec Badge */}
            <motion.div
              style={{ x: parallaxX, y: parallaxY }}
              animate={{ y: [5, -5, 5] }}
              transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-16 left-6 lg:left-4 pointer-events-auto bg-white/85 backdrop-blur-xl border border-black/10 px-4 py-3 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-black/5 flex items-center justify-center text-black group-hover:bg-black group-hover:text-white transition-colors duration-300">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="text-[13px] font-bold text-black">Grade 5 Titanium</div>
                  <div className="text-[11px] text-black/60 font-medium">Ultralight & Strong</div>
                </div>
              </div>
            </motion.div>

            {/* Bottom Right Spec Badge */}
            <motion.div
              style={{ x: parallaxX, y: parallaxY }}
              animate={{ y: [-6, 6, -6] }}
              transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
              className="absolute bottom-20 right-6 lg:right-4 pointer-events-auto bg-white/85 backdrop-blur-xl border border-black/10 px-4 py-3 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-black/5 flex items-center justify-center text-black group-hover:bg-black group-hover:text-white transition-colors duration-300">
                  <Zap className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="text-[13px] font-bold text-black">Apple Intelligence</div>
                  <div className="text-[11px] text-black/60 font-medium">Personal & Private</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Product Image Crossfade Transition */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedFinish.id}
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.05, y: -15 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full h-full flex items-center justify-center"
            >
              {/* Ground Shadow */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[65%] h-[24px] bg-black/15 rounded-[100%] blur-xl pointer-events-none" />

              <Image
                src={selectedFinish.image}
                alt={`iPhone 16 Pro in ${selectedFinish.name}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 850px"
                className="object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.12)] transition-transform duration-500"
                priority
              />
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.button
        type="button"
        aria-label="Scroll down to explore featured products"
        style={{ opacity: indicatorOpacity, y: indicatorY }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 1 }}
        onClick={handleScrollDown}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative z-20 flex flex-col items-center gap-2 mt-6 text-black/50 hover:text-black transition-colors cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30 rounded-full p-2"
      >
        <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-black/60 group-hover:text-black transition-colors">
          Scroll to explore
        </span>

        <div className="flex flex-col items-center gap-1">
          <div className="w-5 h-8 rounded-full border-[1.5px] border-black/30 group-hover:border-black/70 p-1 flex justify-center backdrop-blur-sm transition-colors duration-300 shadow-sm bg-white/40">
            <motion.div
              animate={{ y: [0, 10, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              className="w-1 h-2 bg-black/70 group-hover:bg-black rounded-full"
            />
          </div>
          <motion.div
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="w-4 h-4 text-black/40 group-hover:text-black transition-colors" />
          </motion.div>
        </div>
      </motion.button>
    </section>
  );
}
