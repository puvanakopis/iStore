"use client";

import ContactHero from "./_components/ContactHero";
import ContactFormSection from "./_components/ContactFormSection";
import ContactMap from "./_components/ContactMap";

export default function Contact() {
  return (
    <main className="w-full">
      <ContactHero />
      <ContactFormSection />
      <ContactMap />
    </main>
  );
}