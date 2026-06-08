"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function NotFound() {
    return (
        <main className="w-full min-h-screen flex items-center justify-center bg-white px-6 md:px-12 relative overflow-hidden">

            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[80%] bg-gradient-to-b from-gray-50 to-transparent rounded-full blur-[120px] opacity-30" />
            </div>

            <div className="relative z-10 max-w-3xl w-full text-center">

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-8"
                >

                    <span className="text-[17px] md:text-[21px] font-semibold text-black tracking-tight uppercase block">
                        Error 404
                    </span>

                    <h1 className="text-[56px] md:text-[96px] font-bold leading-[1.02] tracking-tight">
                        Page Not Found
                    </h1>

                    <p className="text-[18px] md:text-[22px] font-light text-foreground-secondary leading-relaxed max-w-2xl mx-auto">
                        The page you are looking for doesn’t exist or has been moved.
                        We can help you get back to a meaningful place.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">

                        <Link
                            href="/"
                            className="bg-black text-white px-10 py-4 rounded-full hover:scale-105 active:scale-95 transition"
                        >
                            Back to Home →
                        </Link>

                        <Link
                            href="/contact"
                            className="bg-white border border-border text-black px-10 py-4 rounded-full hover:scale-105 active:scale-95 transition"
                        >
                            Contact Support
                        </Link>

                    </div>
                </motion.div>
            </div>
        </main>
    );
}