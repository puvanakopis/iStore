"use client";

import Hero from "./components/Hero";
import FeaturedPhones from "./components/FeaturedPhones";
import Offers from "./components/Offers";
import WhyChooseUs from "./components/WhyChooseUs";
import Reviews from "./components/Reviews";
import LifestyleBanner from "./components/LifestyleBanner";

export default function Home() {
  return (
    <main>
      <Hero />
      <FeaturedPhones />
      <Offers />
      <WhyChooseUs />
      <Reviews />
      <LifestyleBanner />
    </main>
  );
}