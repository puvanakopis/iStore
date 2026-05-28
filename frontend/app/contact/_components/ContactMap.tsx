"use client";

import { MapPin } from "lucide-react";

export default function ContactMap() {
  return (
    <section className="max-w-7xl mx-auto px-6 md:px-12 pb-24">
      <div className="relative overflow-hidden rounded-sm border border-white/10 bg-black shadow-2xl">
        
        {/* Google Map */}
        <div className="w-full h-[500px] grayscale invert-[90%] contrast-125 brightness-90">
          <iframe
            title="iStore Colombo Location"
            src="https://www.google.com/maps?q=World+Trade+Center,+Colombo,+Sri+Lanka&output=embed"
            width="100%"
            height="100%"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            className="border-0"
          />
        </div>

        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

        {/* Animated Location Pin */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="relative flex items-center justify-center">
            <div className="absolute w-16 h-16 rounded-full bg-white/10 animate-ping" />

            <div className="relative z-10 w-14 h-14 rounded-full bg-white text-black flex items-center justify-center shadow-2xl border border-white/30">
              <MapPin className="w-6 h-6 fill-black" />
            </div>
          </div>
        </div>

        {/* Glassmorphism Info Card */}
        <div className="absolute bottom-8 left-8 max-w-sm rounded-sm border border-white/10 bg-white/10 backdrop-blur-2xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
          
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>

            <div>
              <h4 className="text-white text-lg font-semibold tracking-tight">
                iStore Colombo
              </h4>

              <p className="text-white/50 text-sm">
                Premium Apple Experience
              </p>
            </div>
          </div>

          <p className="text-sm leading-relaxed text-white/70">
            World Trade Center, Colombo 01, Sri Lanka. Visit our premium Apple
            showroom for the latest iPhone, MacBook, Apple Watch, and exclusive
            in-store experience.
          </p>

          <a
            href="https://maps.google.com/?q=World+Trade+Center,+Colombo,+Sri+Lanka"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition-all duration-300 hover:scale-105 hover:bg-neutral-200"
          >
            Open in Maps
          </a>
        </div>
      </div>
    </section>
  );
}