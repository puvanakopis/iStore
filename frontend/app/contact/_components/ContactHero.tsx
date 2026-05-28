import { motion } from "framer-motion";

export default function ContactHero() {
  return (
    <section className="relative w-full bg-white overflow-hidden flex flex-col items-center justify-center pt-40 pb-20 px-6 md:px-12">
      {/* Background soft gradient - very subtle */}
      <div className="absolute inset-0 z-0 text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[80%] bg-gradient-to-b from-gray-50 to-transparent rounded-full blur-[120px] opacity-30" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="text-[17px] md:text-[21px] font-semibold text-black mb-4 block tracking-tight uppercase">
            Support
          </span>
          <h1 className="text-[48px] md:text-[80px] font-bold leading-[1.02] tracking-tight mb-8">
            Get in Touch
          </h1>
          <p className="text-[21px] md:text-[24px] font-light text-foreground-secondary max-w-3xl mx-auto mb-12 tracking-tight leading-relaxed text-pretty">
            Experience iStore&apos;s signature white-glove service. Whether you are inquiring
            about the latest iPhone or seeking technical support, our team is dedicated
            to providing an unparalleled standard of care.
          </p>
        </motion.div>
      </div>
    </section>
  );
}