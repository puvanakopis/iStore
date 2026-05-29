"use client";

import Hero from "./_components/Hero";
import FeaturedPhones from "./_components/FeaturedPhones";
import Offers from "./_components/Offers";
import WhyChooseUs from "./_components/WhyChooseUs";
import Reviews from "./_components/Reviews";
import LifestyleBanner from "./_components/LifestyleBanner";

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