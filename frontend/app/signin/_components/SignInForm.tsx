"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Cookies from 'js-cookie';

export default function SignInForm() {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const togglePassword = () => {
    setShowPassword(prev => !prev);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await login(formData);
      // login in AuthContext already handles redirect to /profile
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Invalid email or password');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Login with ${provider}`);
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
          <header className="mb-10 text-center md:text-left">
            <h2 className="text-[32px] font-bold tracking-tight mb-2">
              Sign In
            </h2>
            <p className="text-[17px] font-light text-foreground-secondary text-pretty">
              Access your personalized iStore experience.
            </p>
          </header>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-sm text-sm">
              {error}
            </div>
          )}

          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="flex flex-col">
              <label className="text-xs uppercase tracking-widest text-on-surface-variant font-medium mb-1" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                className="w-full bg-transparent border-b border-border py-2 focus:border-black outline-none transition-colors"
                placeholder="name@example.com"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="flex flex-col space-y-3">
              <div className="flex justify-between items-end">
                <label className="text-xs uppercase tracking-widest text-on-surface-variant font-medium mb-1" htmlFor="password">
                  Password
                </label>
                <Link href="/forgot-password" title="Forgot Password" className="text-[11px] text-foreground-secondary hover:text-black uppercase tracking-widest transition-colors mb-1">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  className="w-full bg-transparent border-b border-border py-2 focus:border-black outline-none transition-colors pr-10"
                  placeholder="••••••••"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                <button
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                  onClick={togglePassword}
                  type="button"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              className="w-full bg-black text-white px-10 py-4 rounded-full hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 mt-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>

          <div className="relative flex items-center my-10">
            <div className="flex-grow border-t border-border"></div>
            <span className="px-4 text-[11px] text-gray-400 uppercase tracking-[0.2em]">Or join with</span>
            <div className="flex-grow border-t border-border"></div>
          </div>

          <div className="grid">

            <button
              onClick={() => handleSocialLogin('Google')}
              className="flex items-center justify-center gap-2 py-3 px-6 border border-border rounded-full hover:bg-white transition-all duration-300 text-sm font-medium"
            >
              <Image src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-4 h-4" alt="Google" width={16} height={16} />
              Google
            </button>
          </div>

          <footer className="mt-10 text-center">
            <p className="text-sm text-foreground-secondary">
              Don&apos;t have an account?{' '}
              <Link className="text-black font-bold hover:underline underline-offset-4" href="/signup">
                Sign Up
              </Link>
            </p>
          </footer>
        </div>
      </motion.div>
    </section>
  );
}
