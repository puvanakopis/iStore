"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('Password reset request for:', email);
    setIsSubmitting(false);
    setIsSent(true);
  };

  return (
    <section className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12 lg:p-24 bg-white">
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[500px]"
      >
        <div className="bg-background-dim p-8 md:p-12 rounded-sm">
          <Link 
            href="/signin" 
            className="inline-flex items-center gap-2 text-[11px] text-foreground-secondary hover:text-black uppercase tracking-widest transition-colors mb-8 group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Back to Sign In
          </Link>

          <AnimatePresence mode="wait">
            {!isSent ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
              >
                <header className="mb-10">
                  <h2 className="text-[32px] font-bold tracking-tight mb-2">
                    Reset Password
                  </h2>
                  <p className="text-[17px] font-light text-foreground-secondary text-pretty leading-relaxed">
                    Enter the email address associated with your account and we&apos;ll send you a link to reset your password.
                  </p>
                </header>

                <form className="space-y-8" onSubmit={handleSubmit}>
                  <div className="flex flex-col">
                    <label className="text-xs uppercase tracking-widest text-on-surface-variant font-medium mb-1" htmlFor="email">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        id="email"
                        className="w-full bg-transparent border-b border-border py-2 focus:border-black outline-none transition-colors"
                        placeholder="name@example.com"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <button
                    className="w-full bg-black text-white px-10 py-4 rounded-full hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 mt-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending link...' : 'Send Reset Link →'}
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center py-4"
              >
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center text-white">
                    <CheckCircle2 size={32} />
                  </div>
                </div>
                <h2 className="text-[28px] font-bold tracking-tight mb-3">
                  Check your mail
                </h2>
                <p className="text-[17px] font-light text-foreground-secondary text-pretty leading-relaxed mb-10">
                  We have sent a password recovery link to <span className="text-black font-medium">{email}</span>.
                </p>
                <button
                  onClick={() => setIsSent(false)}
                  className="text-[11px] text-foreground-secondary hover:text-black uppercase tracking-widest transition-colors font-medium border-b border-transparent hover:border-black"
                >
                  Didn&apos;t receive the email? Try again
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
}
