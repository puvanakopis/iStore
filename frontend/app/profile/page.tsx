"use client";

import { motion } from "framer-motion";
import Sidebar from "@/components/Sidebar";
import ProfileBentoCard from "./_components/ProfileBentoCard";
import PersonalDetailsForm from "./_components/PersonalDetailsForm";
import CommunicationSettings from "./_components/CommunicationSettings";

export default function Profile() {
  return (
    <main className="min-h-screen bg-white pt-24 md:pt-32 pb-20">
      {/* Page Header */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 mb-16">
        <header className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-[32px] md:text-[44px] font-bold tracking-tight mb-2">My ID</h1>
            <p className="text-foreground-secondary font-light">Manage your settings and preference across the ecosystem.</p>
          </motion.div>
        </header>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content Grid */}
          <div className="flex-1">
            <div className="grid  gap-6">
              
              {/* Row 1 */}
              <div className="md:col-span-2 lg:col-span-2">
                <ProfileBentoCard />
              </div>
              {/* <div className="md:col-span-1 h-[350px]">
                <FeaturedImageCard />
              </div> */}

              {/* Row 2 */}
              <div className="md:col-span-2 lg:col-span-2">
                <PersonalDetailsForm />
              </div>

              {/* Row 3 */}
              <div className="md:col-span-2 lg:col-span-2">
                <CommunicationSettings />
              </div>
              
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
