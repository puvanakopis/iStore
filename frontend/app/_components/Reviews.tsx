"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Review {
  name: string;
  role: string;
  rating: number;
  text: string;
  avatar: string;
}

const reviews: Review[] = [
  {
    name: "Marcus Chen",
    role: "Photographer",
    rating: 5,
    text: "The iPhone 16 Pro is a masterpiece. The Natural Titanium feels incredible in hand, and the camera performance is just on another level. iStore's delivery was remarkably fast.",
    avatar: "https://i.pravatar.cc/150?u=marcus",
  },
  {
    name: "Elena Rodriguez",
    role: "Content Creator",
    rating: 5,
    text: "I was hesitant about the trade-in process, but iStore made it so simple. I got a great price for my old phone and the new iPhone is simply stunning.",
    avatar: "https://i.pravatar.cc/150?u=elena",
  },
  {
    name: "Jameson Blake",
    role: "Tech Enthusiast",
    rating: 5,
    text: "The Apple Intelligence features on the new Pro are actually insane. As a power user, having this level of integration is a game changer. Highly recommended.",
    avatar: "https://i.pravatar.cc/150?u=jameson",
  },
  {
    name: "Sophia Williams",
    role: "Digital Artist",
    rating: 5,
    text: "The display on the iPhone 16 Pro is absolutely breathtaking. Colors are so vibrant and accurate. Perfect for my creative work on the go!",
    avatar: "https://i.pravatar.cc/150?u=sophia",
  },
  {
    name: "David Kim",
    role: "Software Engineer",
    rating: 5,
    text: "Battery life is incredible. I can go two full days without charging. The A18 Pro chip makes everything feel instant. Worth every penny.",
    avatar: "https://i.pravatar.cc/150?u=david",
  },
  {
    name: "Olivia Martinez",
    role: "Travel Blogger",
    rating: 5,
    text: "The camera system on this phone is a game changer for travel content. Night mode is unbelievable and the zoom capabilities are mind-blowing.",
    avatar: "https://i.pravatar.cc/150?u=olivia",
  },
];

const StarRating = ({ rating, size = 16 }: { rating: number; size?: number }) => {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`${i < rating ? "text-amber-400" : "text-gray-200"}`}
          style={{ width: size, height: size }}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

export default function Reviews() {
  const sectionRef = useRef<HTMLElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const itemsPerView = isMobile ? 1 : 3;
  const maxIndex = Math.max(0, reviews.length - itemsPerView);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, maxIndex]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      nextSlide();
    }
    if (touchStart - touchEnd < -50) {
      prevSlide();
    }
    setTouchStart(0);
    setTouchEnd(0);
  };

  return (
    <section ref={sectionRef} className="relative w-full bg-white overflow-hidden py-20 md:py-32">
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16 md:mb-20 px-4"
        >
          <span className="text-[13px] md:text-[14px] font-semibold text-black/40 uppercase tracking-widest mb-3 block">
            Testimonials
          </span>

          <h2 className="text-[32px] sm:text-[48px] md:text-[56px] lg:text-[64px] font-bold tracking-tight mb-5 text-black leading-[1.08]">
            Loved by enthusiasts.
          </h2>

          <p className="text-[17px] sm:text-[19px] md:text-[21px] font-light text-foreground-secondary max-w-2xl mx-auto leading-relaxed">
            See why people are switching to the new iPhone 16 Pro.
          </p>
        </motion.div>

        {/* Carousel Container */}
        <div
          className="relative"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="overflow-hidden py-4">
            <div
              className="flex transition-transform duration-700 ease-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
              }}
            >
              {reviews.map((review, idx) => (
                <div
                  key={`${review.name}-${idx}`}
                  className="flex-shrink-0 px-3.5"
                  style={{ width: `${100 / itemsPerView}%` }}
                >
                  <div className="group bg-[#fbfbfd] border border-gray-200/80 rounded-3xl p-8 transition-all duration-500 hover:border-gray-300 hover:-translate-y-1.5 h-full flex flex-col justify-between">
                    <div>
                      {/* Rating */}
                      <div className="mb-5">
                        <StarRating rating={review.rating} size={16} />
                      </div>

                      {/* Text */}
                      <p className="text-[15px] md:text-[16px] font-light leading-relaxed text-foreground-secondary mb-8">
                        "{review.text}"
                      </p>
                    </div>

                    {/* Author Profile */}
                    <div className="flex items-center gap-3.5 pt-4 border-t border-gray-200/60 mt-auto">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border border-black/10">
                        <Image
                          src={review.avatar}
                          alt={review.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-black text-[14px] tracking-tight truncate">
                          {review.name}
                        </h3>
                        <p className="text-foreground-muted text-[12px] font-light truncate">
                          {review.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Controls */}
          <button
            onClick={prevSlide}
            aria-label="Previous testimonial"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 md:-translate-x-5 w-10 h-10 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center text-black/70 hover:text-black hover:scale-110 active:scale-95 transition-all duration-300 z-20"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={nextSlide}
            aria-label="Next testimonial"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 md:translate-x-5 w-10 h-10 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center text-black/70 hover:text-black hover:scale-110 active:scale-95 transition-all duration-300 z-20"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Pagination Indicators */}
          <div className="flex justify-center gap-2 mt-10">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentIndex === i ? "bg-black w-8" : "bg-gray-200 w-2 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}