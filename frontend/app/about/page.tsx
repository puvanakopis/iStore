"use client";

import AboutHero from "./_components/AboutHero";
import AboutStory from "./_components/AboutStory";
import AboutValues from "./_components/AboutValues";

export default function About() {
  return (
    <main className="w-full">
      <AboutHero />
      <AboutStory />
      <AboutValues />
    </main>
  );
}
