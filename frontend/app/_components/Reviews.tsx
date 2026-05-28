"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";

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
  {
    name: "Liam O'Connor",
    role: "Business Owner",
    rating: 5,
    text: "Switched from Android after 10 years. Best decision ever. The ecosystem integration and build quality are unmatched. iStore made it seamless.",
    avatar: "https://i.pravatar.cc/150?u=liam",
  },
  {
    name: "Emma Thompson",
    role: "Fitness Coach",
    rating: 5,
    text: "The Action button is a lifesaver for my workouts. Customized it to start my fitness tracking instantly. Love the durability too!",
    avatar: "https://i.pravatar.cc/150?u=emma",
  },
];

const StarRating = ({ rating, size = 16 }: { rating: number; size?: number }) => {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`${i < rating ? "text-yellow-400" : "text-gray-300"}`}
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

// Truncate text function
const truncateText = (text: string, maxLength: number = 120) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export default function Reviews() {
  const sectionRef = useRef(null);
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
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const itemsPerView = isMobile ? 1 : 3;

  // Create circular array by duplicating reviews for seamless infinite loop
  const duplicatedReviews = [...reviews, ...reviews, ...reviews];
  const startIndex = reviews.length;
  const totalSlides = reviews.length;

  // Handle slide change with circular logic
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => {
      const next = prevIndex + 1;
      return next;
    });
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => {
      const prev = prevIndex - 1;
      return prev;
    });
  };

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  // Handle circular reset after animation
  useEffect(() => {
    // When we reach the end of the duplicated array, jump back to the middle seamlessly
    if (currentIndex >= startIndex + totalSlides) {
      // Use setTimeout to avoid animation interruption
      setTimeout(() => {
        setCurrentIndex(startIndex);
      }, 0);
    } else if (currentIndex < 0) {
      setTimeout(() => {
        setCurrentIndex(startIndex + totalSlides - 1);
      }, 0);
    }
  }, [currentIndex, startIndex, totalSlides]);

  // Pause auto-play on hover
  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

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
    <section ref={sectionRef} className="relative w-full bg-background-dim overflow-hidden py-24 md:py-32">
      {/* Background subtle gradient */}
      <div className="absolute inset-0 z-0">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[90%] h-[60%] rounded-full blur-[120px] opacity-40" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16 md:mb-24"
        >
          <span className="text-[13px] md:text-[15px] font-semibold text-black/40 uppercase tracking-wider mb-4 block">
            Testimonials
          </span>

          <h2 className="text-[40px] md:text-[64px] font-bold tracking-tight mb-6 text-black leading-[1.08]">
            Loved by enthusiasts.
          </h2>

          <p className="text-[17px] md:text-[21px] font-light text-gray-500 max-w-2xl mx-auto leading-relaxed">
            See why people are switching to the new iPhone 16 Pro.
          </p>
        </motion.div>

        {/* Reviews Carousel */}
        <div
          className="relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Carousel Container */}
          <div className="overflow-hidden py-5">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${(currentIndex % (itemsPerView * 3)) * (100 / itemsPerView)}%)`,
              }}
            >
              {duplicatedReviews.map((review, idx) => (
                <div
                  key={`${review.name}-${idx}`}
                  className="flex-shrink-0 px-3 bg-background-dim"
                  style={{ width: `${100 / itemsPerView}%` }}
                >
                  <div
                    className="group bg-background border border-border relative rounded-2xl p-8 md:p-10 transition-all duration-500 hover:-translate-y-2 h-full"
                  >
                    {/* Hover shadow effect */}
                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                    <div className="relative z-10 flex flex-col h-full">
                      {/* Rating */}
                      <div className="mb-6">
                        <StarRating rating={review.rating} size={16} />
                      </div>

                      {/* Review Text with truncation */}
                      <p className="text-[16px] md:text-[17px] font-light leading-relaxed text-gray-700 mb-8 flex-grow tracking-tight">
                        {truncateText(review.text, 110)}
                      </p>

                      {/* Author Info */}
                      <div className="flex items-center gap-4 pt-4 border-t border-gray-100 mt-auto">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                          <Image
                            src={review.avatar}
                            alt={review.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-semibold text-black text-[14px] tracking-tight truncate">
                            {review.name}
                          </h4>
                          <p className="text-gray-400 text-[12px] font-light truncate">
                            {review.role}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows - Only show if more than items per view */}
          {totalSlides > itemsPerView && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-6 w-10 h-10 rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-all duration-300 z-20"
                style={{
                  boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.05), 0 4px 12px rgba(0, 0, 0, 0.1)',
                }}
              >
                <svg className="w-5 h-5 text-black/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-6 w-10 h-10 rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-all duration-300 z-20"
                style={{
                  boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.05), 0 4px 12px rgba(0, 0, 0, 0.1)',
                }}
              >
                <svg className="w-5 h-5 text-black/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Dots Indicator */}
          {totalSlides > itemsPerView && (
            <div className="flex justify-center gap-2 mt-8 md:mt-12">
              {Array.from({ length: totalSlides }).map((_, i) => {
                // Map current index to the actual review index in the original array
                const activeIndex = ((currentIndex % totalSlides) + totalSlides) % totalSlides;
                return (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(startIndex + i)}
                    className={`h-2 rounded-full transition-all duration-300 ${activeIndex === i ? 'bg-black w-8' : 'bg-gray-300 w-2 hover:bg-gray-400'
                      }`}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}