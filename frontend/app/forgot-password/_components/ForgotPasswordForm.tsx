"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle2, Lock, Mail, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { authService } from '@/services/auth.service';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState<'email' | 'otp' | 'password' | 'success'>('email');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await authService.forgotPassword(email);
      setStep('otp');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await authService.verifyOtp({ email, code: otpCode, purpose: 'reset_password' });
      setStep('password');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Invalid OTP. Please check and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      await authService.resetPassword({
        email,
        otp_code: otpCode,
        new_password: newPassword
      });
      setStep('success');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to reset password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
          {step !== 'success' && (
            <Link
              href="/signin"
              className="inline-flex items-center gap-2 text-[11px] text-foreground-secondary hover:text-black uppercase tracking-widest transition-colors mb-8 group"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              Back to Sign In
            </Link>
          )}

          <AnimatePresence mode="wait">
            {step === 'email' && (
              <motion.div
                key="email"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
              >
                <header className="mb-10">
                  <div className="w-12 h-12 bg-black/5 rounded-full flex items-center justify-center mb-6">
                    <Mail size={24} className="text-black" />
                  </div>
                  <h2 className="text-[32px] font-bold tracking-tight mb-2">
                    Forgot Password?
                  </h2>
                  <p className="text-[17px] font-light text-foreground-secondary text-pretty leading-relaxed">
                    Enter your email address and we&apos;ll send you an OTP to reset your password.
                  </p>
                </header>

                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-sm text-sm">
                    {error}
                  </div>
                )}

                <form className="space-y-8" onSubmit={handleEmailSubmit}>
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
                    {isSubmitting ? 'Sending OTP...' : 'Send OTP →'}
                  </button>
                </form>
              </motion.div>
            )}

            {step === 'otp' && (
              <motion.div
                key="otp"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
              >
                <header className="mb-10">
                  <div className="w-12 h-12 bg-black/5 rounded-full flex items-center justify-center mb-6">
                    <ShieldCheck size={24} className="text-black" />
                  </div>
                  <h2 className="text-[32px] font-bold tracking-tight mb-2">
                    Verify OTP
                  </h2>
                  <p className="text-[17px] font-light text-foreground-secondary text-pretty leading-relaxed">
                    We&apos;ve sent a 6-digit verification code to <span className="text-black font-medium">{email}</span>.
                  </p>
                </header>

                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-sm text-sm">
                    {error}
                  </div>
                )}

                <form className="space-y-8" onSubmit={handleOtpSubmit}>
                  <div className="flex flex-col">
                    <label className="text-xs uppercase tracking-widest text-on-surface-variant font-medium mb-1" htmlFor="otp">
                      6-Digit Code
                    </label>
                    <div className="relative">
                      <input
                        id="otp"
                        className="w-full bg-transparent border-b border-border py-2 focus:border-black outline-none transition-colors text-center tracking-[1em] text-xl font-bold"
                        placeholder="000000"
                        maxLength={6}
                        type="text"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                        required
                      />
                    </div>
                  </div>

                  <button
                    className="w-full bg-black text-white px-10 py-4 rounded-full hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 mt-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Checking...' : 'Verify OTP →'}
                  </button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setStep('email')}
                      className="text-xs text-foreground-secondary hover:text-black uppercase tracking-widest transition-colors font-medium"
                    >
                      Change Email
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {step === 'password' && (
              <motion.div
                key="password"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
              >
                <header className="mb-10">
                  <div className="w-12 h-12 bg-black/5 rounded-full flex items-center justify-center mb-6">
                    <Lock size={24} className="text-black" />
                  </div>
                  <h2 className="text-[32px] font-bold tracking-tight mb-2">
                    Create New Password
                  </h2>
                  <p className="text-[17px] font-light text-foreground-secondary text-pretty leading-relaxed">
                    OTP verified successfully. Please enter your new password below.
                  </p>
                </header>

                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-sm text-sm">
                    {error}
                  </div>
                )}

                <form className="space-y-8" onSubmit={handlePasswordSubmit}>
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col">
                      <label className="text-xs uppercase tracking-widest text-on-surface-variant font-medium mb-1" htmlFor="new-password">
                        New Password
                      </label>
                      <input
                        id="new-password"
                        className="w-full bg-transparent border-b border-border py-2 focus:border-black outline-none transition-colors"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-xs uppercase tracking-widest text-on-surface-variant font-medium mb-1" htmlFor="confirm-password">
                        Confirm New Password
                      </label>
                      <input
                        id="confirm-password"
                        className="w-full bg-transparent border-b border-border py-2 focus:border-black outline-none transition-colors"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <button
                    className="w-full bg-black text-white px-10 py-4 rounded-full hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 mt-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Updating...' : 'Update Password →'}
                  </button>
                </form>
              </motion.div>
            )}

            {step === 'success' && (
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
                  Password Updated
                </h2>
                <p className="text-[17px] font-light text-foreground-secondary text-pretty leading-relaxed mb-10">
                  Your password has been successfully reset. You can now sign in with your new password.
                </p>
                <Link
                  href="/signin"
                  className="inline-block bg-black text-white px-10 py-4 rounded-full hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 font-medium"
                >
                  Sign In Now
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
}
