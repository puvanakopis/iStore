"use client";

import AboutHero from "./_components/AboutHero";
import AboutStory from "./_components/AboutStory";
import AboutServices from "./_components/AboutServices";

export default function About() {
  return (
    <main className="w-full">
      <AboutHero />
      <AboutStory />
      <AboutServices />
    </main>
  );
}
