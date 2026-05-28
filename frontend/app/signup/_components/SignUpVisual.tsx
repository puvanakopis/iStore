"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function SignUpVisual() {
  return (
    <section className="hidden md:flex relative w-1/2 bg-white overflow-hidden items-center justify-center px-12">
      {/* Background soft gradient - very subtle */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-[60%] h-[60%] bg-gradient-to-br from-gray-50 to-transparent rounded-full blur-[120px] opacity-50" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-lg">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12"
        >
          <div className="relative w-full aspect-square max-w-[400px] mx-auto">
            <img
              alt="Premium iPhone Display"
              className="w-full h-auto drop-shadow-[0_35px_35px_rgba(0,0,0,0.1)]"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAHHwlNFaF4Jqu_xcfMV_bOEJHZUkyt97gwr6PIcI0StkXY7UGbOreKnXqJ88MMp3iDU0figTH7xcyfFw-jOBEg_uuGlPLgsVzs9E6LuL4IpybYldeQaBGaV0CW-Lq8YsdOjRLyYV1xig2tUjtqbw5-ifpCbbHf1BbYBEmv4Lo0RpzZoVwlqnTnVnstXjpeM-k5prnHUhRbrMKEhg_x8JhqRS-2rsMKJpSyQ_AI5TbYNvs6T5tNS7Ydy8WSDdaqIpQqsQQLQBPNwgh6"
            />
          </div>
        </motion.div>

        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="text-[14px] font-bold text-black mb-4 block tracking-[0.2em] uppercase">
            Exclusive Access
          </span>
          <h1 className="text-[48px] font-bold leading-[1.1] tracking-tight mb-6">
            Join the Future of iStore.
          </h1>
          <p className="text-[19px] font-light text-foreground-secondary max-w-md mx-auto tracking-tight leading-relaxed text-pretty">
            Experience the pinnacle of technology through a lens of absolute minimalism and craft.
          </p>
        </motion.div>
      </div>
    </section>
  );
}